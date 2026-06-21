<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\Tenant;
use App\Models\Submission;
use App\Models\SubmissionImage;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(TestCase::class, RefreshDatabase::class);

it('generates UUID on creation', function () {
    $submission = Submission::factory()->create();

    expect($submission->uuid)->toBeString();
    expect($submission->uuid)->toMatch('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/');
});

it('has status helper methods', function () {
    $submission = Submission::factory()->create(['status' => 'processing']);

    expect($submission->isProcessing())->toBeTrue();
    expect($submission->isCompleted())->toBeFalse();
    expect($submission->isFailed())->toBeFalse();

    $submission->status = 'completed';
    expect($submission->isProcessing())->toBeFalse();
    expect($submission->isCompleted())->toBeTrue();
    expect($submission->isFailed())->toBeFalse();

    $submission->status = 'failed';
    expect($submission->isProcessing())->toBeFalse();
    expect($submission->isCompleted())->toBeFalse();
    expect($submission->isFailed())->toBeTrue();
});

it('belongs to a tenant', function () {
    $tenant = Tenant::factory()->create(['status' => true]);
    $submission = Submission::factory()->create([
        'tenant_id' => $tenant->id,
    ]);

    expect($submission->tenant->id)->toBe($tenant->id);
});

it('has images relationship', function () {
    $submission = Submission::factory()->create();
    $image = SubmissionImage::factory()->create([
        'submission_id' => $submission->uuid,
    ]);

    expect($submission->fresh()->images)->toHaveCount(1);
});