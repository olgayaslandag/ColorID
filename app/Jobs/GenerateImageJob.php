<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Swatch;
use App\Models\Submission;
use App\Models\SubmissionImage;
use App\Services\OpenAIService;
use App\Services\PromptBuilder;
use App\Services\WebhookService;
use App\Notifications\ImageGeneratedNotification;
use App\Notifications\SubmissionFailedNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Throwable;

class GenerateImageJob implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 300;

    public int $tries = 3;

    public array $backoff = [10, 30, 60];

    public function __construct(
        public Submission $submission
    ) {}

    public function uniqueId(): string
    {
        return (string) $this->submission->id;
    }

    public function handle(
        PromptBuilder $promptBuilder,
        OpenAIService $openAIService
    ): void
    {
        app(\App\Services\TenantManager::class)->reset();

        $this->submission->load('tenant', 'category');

        $this->submission->update(['status' => 'processing']);

        try {
            $swatch = $this->resolveSwatch();
            $categoryName = $this->submission->category?->name ?? 'surface';

            $referenceImage = $this->submission->images()->first()?->original_image;
            $roomDescription = null;

            if ($referenceImage !== null) {
                try {
                    $roomDescription = $openAIService->describeImage(
                        imagePath: $referenceImage,
                        tenantId: (string) $this->submission->tenant_id,
                    );
                } catch (\Throwable $e) {
                    Log::warning('Vision analysis failed, continuing without room description', [
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            $prompt = $promptBuilder->buildEditPrompt(
                userPrompt: $this->submission->prompt,
                swatch: $swatch,
                categoryName: $categoryName,
                roomDescription: $roomDescription,
            );

            $images = $this->submission->images()->get();

            foreach ($images as $image) {
                $storedPath = $openAIService->editImage(
                    originalImagePath: $image->original_image,
                    prompt: $prompt,
                    tenantId: (string) $this->submission->tenant_id,
                );

                if ($image instanceof SubmissionImage) {
                    $image->update(['generated_image' => $storedPath]);
                }
            }

            $this->submission->update(['status' => 'completed']);

            app(WebhookService::class)->dispatch($this->submission, 'submission.completed');

            Notification::route('mail', $this->submission->email)
                ->notify(new ImageGeneratedNotification($this->submission));

        } catch (Throwable $e) {
            $this->submission->update(['status' => 'failed']);

            app(WebhookService::class)->dispatch($this->submission, 'submission.failed');

            Log::error('GenerateImageJob failed during processing', [
                'submission_id' => $this->submission->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw $e;
        }
    }

    public function failed(Throwable $exception): void
    {
        if (! $this->submission->isFailed()) {
            $this->submission->update(['status' => 'failed']);
        }

        Log::error('GenerateImageJob failed definitively', [
            'submission_id' => $this->submission->id,
            'submission_uuid' => $this->submission->uuid,
            'error' => $exception->getMessage(),
            'attempt' => $this->attempts(),
        ]);

        try {
            Notification::route('mail', $this->submission->email)
                ->notify(new SubmissionFailedNotification(
                    submission: $this->submission,
                    errorMessage: $exception->getMessage(),
                ));
        } catch (Throwable $notificationException) {
            Log::warning('Failed to dispatch failure notification', [
                'submission_id' => $this->submission->id,
                'error' => $notificationException->getMessage(),
            ]);
        }
    }

    public function tags(): array
    {
        return [
            'image-generation',
            'submission:'.$this->submission->id,
        ];
    }

    private function resolveSwatch(): Swatch
    {
        $swatchId = $this->submission->swatch_id;

        if ($swatchId !== null) {
            $swatch = Swatch::find($swatchId);
            if ($swatch !== null) {
                return $swatch;
            }
        }

        $tenant = $this->submission->tenant;

        if ($tenant === null) {
            throw new \RuntimeException('No tenant or swatch resolved for submission.');
        }

        $swatch = $tenant->products()
            ->first()?->swatches()
            ->first();

        if ($swatch === null) {
            throw new \RuntimeException('No swatches available for tenant.');
        }

        return $swatch;
    }
}
