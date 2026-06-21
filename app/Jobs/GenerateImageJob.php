<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Submission;
use App\Models\SubmissionImage;
use App\Models\Palette;
use App\Services\OpenAIService;
use App\Services\PromptBuilder;
use App\Notifications\ImageGeneratedNotification;
use App\Notifications\SubmissionFailedNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Throwable;

class GenerateImageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 240;

    public int $tries = 3;

    public array $backoff = [10, 30, 60];

    public function __construct(
        public Submission $submission
    ) {}

    public function handle(
        PromptBuilder $promptBuilder,
        OpenAIService $openAIService
    ): void
    {
        $this->submission->update(['status' => 'processing']);

        try {
            $palette = $this->resolvePalette();

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

            $prompt = $promptBuilder->build(
                userPrompt: $this->submission->prompt,
                palette: $palette,
                surface: $this->submission->surface ?? 'ic_duvar',
                roomDescription: $roomDescription,
            );

            $storedPath = $openAIService->generateImage(
                prompt: $prompt,
                tenantId: (string) $this->submission->tenant_id,
            );

            DB::transaction(function () use ($storedPath): void {
                $image = $this->submission->images()->first();

                if ($image instanceof SubmissionImage) {
                    $image->update(['generated_image' => $storedPath]);
                }
            });

            $this->submission->update(['status' => 'completed']);

            Notification::route('mail', $this->submission->email)
                ->notify(new ImageGeneratedNotification($this->submission));

        } catch (Throwable $e) {
            $this->submission->update(['status' => 'failed']);

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

    private function resolvePalette(): Palette
    {
        $paletteId = $this->submission->palette_id;

        if ($paletteId !== null) {
            $palette = Palette::find($paletteId);
            if ($palette instanceof Palette) {
                return $palette;
            }
        }

        $tenant = $this->submission->tenant;

        if ($tenant === null) {
            throw new \RuntimeException('No tenant or palette resolved for submission.');
        }

        $paletteGroup = $tenant->paletteGroups()->first();

        if ($paletteGroup === null) {
            throw new \RuntimeException('No palette group available for tenant.');
        }

        $palette = $paletteGroup->palettes()->first();
        
        if (!$palette instanceof Palette) {
            throw new \RuntimeException('No palettes available for tenant.');
        }

        return $palette;
    }
}
