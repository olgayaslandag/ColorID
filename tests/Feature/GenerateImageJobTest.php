<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Tenant;
use App\Models\Submission;
use App\Models\SubmissionImage;
use App\Jobs\GenerateImageJob;
use App\Services\OpenAIService;
use App\Services\PromptBuilder;
use App\Exceptions\ImageGenerationException;
use App\Notifications\ImageGeneratedNotification;
use App\Notifications\SubmissionFailedNotification;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;

it('dispatches the job', function () {
    Bus::fake();

    $submission = Submission::factory()->create();
    GenerateImageJob::dispatch($submission);

    Bus::assertDispatched(GenerateImageJob::class, function ($job) use ($submission) {
        return $job->submission->uuid === $submission->uuid;
    });
});

it('handles multi-image submission', function () {
    Notification::fake();

    $tenant = Tenant::factory()->create();

    $submission = Submission::factory()->create([
        'tenant_id' => $tenant->id,
        'status' => 'pending',
    ]);

    $image1 = SubmissionImage::factory()->create([
        'submission_id' => $submission->uuid,
        'original_image' => 'uploads/originals/ref1.jpg',
    ]);
    $image2 = SubmissionImage::factory()->create([
        'submission_id' => $submission->uuid,
        'original_image' => 'uploads/originals/ref2.jpg',
    ]);

    Storage::fake('public');
    Storage::disk('public')->put('uploads/originals/ref1.jpg', 'fake-image-data');

    $openAIService = \Mockery::mock(OpenAIService::class);
    $openAIService->shouldReceive('describeImage')
        ->withArgs(['uploads/originals/ref1.jpg', (string) $tenant->id])
        ->once()
        ->andReturn('Room description text');
    $openAIService->shouldReceive('generateImage')
        ->twice()
        ->andReturn(
            'tenant/' . $tenant->id . '/generated/img1.png',
            'tenant/' . $tenant->id . '/generated/img2.png',
        );

    $promptBuilder = \Mockery::mock(PromptBuilder::class);
    $promptBuilder->shouldReceive('build')
        ->once()
        ->andReturn('Generated prompt for image generation');

    config(['services.openai.api_key' => 'test-key']);

    $job = new GenerateImageJob($submission);
    $job->handle($promptBuilder, $openAIService);

    expect($submission->fresh()->status)->toBe('completed');
    expect($image1->fresh()->generated_image)->toBe('tenant/' . $tenant->id . '/generated/img1.png');
    expect($image2->fresh()->generated_image)->toBe('tenant/' . $tenant->id . '/generated/img2.png');

    Notification::assertSentOnDemand(ImageGeneratedNotification::class);
});

it('sets status to failed when OpenAI throws exception', function () {
    $tenant = Tenant::factory()->create();

    $submission = Submission::factory()->create([
        'tenant_id' => $tenant->id,
        'status' => 'pending',
    ]);

    SubmissionImage::factory()->create([
        'submission_id' => $submission->uuid,
    ]);

    $openAIService = \Mockery::mock(OpenAIService::class);
    $openAIService->shouldReceive('describeImage')
        ->andReturn('Room description');
    $openAIService->shouldReceive('generateImage')
        ->andThrow(new ImageGenerationException('OpenAI API error', provider: 'openai'));

    $promptBuilder = \Mockery::mock(PromptBuilder::class);
    $promptBuilder->shouldReceive('build')
        ->andReturn('Generated prompt');

    config(['services.openai.api_key' => 'test-key']);

    $job = new GenerateImageJob($submission);

    try {
        $job->handle($promptBuilder, $openAIService);
    } catch (\Throwable $e) {
        // Expected — job re-throws after setting status
    }

    expect($submission->fresh()->status)->toBe('failed');
});

it('notifies user on completion', function () {
    Notification::fake();

    $tenant = Tenant::factory()->create();

    $submission = Submission::factory()->create([
        'tenant_id' => $tenant->id,
    ]);

    SubmissionImage::factory()->create([
        'submission_id' => $submission->uuid,
    ]);

    $openAIService = \Mockery::mock(OpenAIService::class);
    $openAIService->shouldReceive('describeImage')->andReturn('desc');
    $openAIService->shouldReceive('generateImage')->andReturn('tenant/1/generated/test.png');

    $promptBuilder = \Mockery::mock(PromptBuilder::class);
    $promptBuilder->shouldReceive('build')->andReturn('prompt');

    config(['services.openai.api_key' => 'test-key']);

    $job = new GenerateImageJob($submission);
    $job->handle($promptBuilder, $openAIService);

    Notification::assertSentOnDemand(ImageGeneratedNotification::class);
});

it('notifies user on failure', function () {
    Notification::fake();

    $submission = Submission::factory()->pending()->create();

    $exception = new ImageGenerationException('Test error message', provider: 'openai');

    $job = new GenerateImageJob($submission);
    $job->failed($exception);

    expect($submission->fresh()->status)->toBe('failed');

    Notification::assertSentOnDemand(SubmissionFailedNotification::class);
});
