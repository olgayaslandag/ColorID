<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\Tenant;
use App\Models\Submission;
use App\Models\SubmissionImage;
use App\Services\TenantManager;
use App\Jobs\GenerateImageJob;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Storage;

uses(TestCase::class, RefreshDatabase::class);

it('creates a submission with valid data', function () {
    Storage::fake('public');
    Bus::fake();

    $tenant = Tenant::factory()->create([
        'domain' => 'test.example.com',
        'status' => true,
    ]);

    app(TenantManager::class)->setTenant($tenant);

    $file = UploadedFile::fake()->image('photo.jpg');

    $response = $this->withoutMiddleware(\App\Http\Middleware\IdentifyTenant::class)
        ->postJson('/api/submissions', [
            'name' => 'John Doe',
            'phone' => '555-1234',
            'email' => 'john@example.com',
            'prompt' => 'Make the walls blue',
            'images' => [$file],
        ]);

    $response->assertCreated();

    expect($response->json('data.name'))->toBe('John Doe');
    expect($response->json('data.status'))->toBe('pending');

    $submission = Submission::where('uuid', $response->json('data.uuid'))->first();
    expect($submission)->not->toBeNull();
    expect($submission->tenant_id)->toBe($tenant->id);
    expect($submission->name)->toBe('John Doe');
    expect($submission->prompt)->toBe('Make the walls blue');
    expect($submission->images)->toHaveCount(1);

    Bus::assertDispatched(GenerateImageJob::class);
});

it('validates required fields', function () {
    Bus::fake();

    Tenant::factory()->create([
        'domain' => 'test.example.com',
        'status' => true,
    ]);

    $response = $this->withoutMiddleware(\App\Http\Middleware\IdentifyTenant::class)
        ->postJson('/api/submissions', []);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['name', 'phone', 'email', 'images']);
});

it('validates image file types', function () {
    Bus::fake();

    Tenant::factory()->create([
        'domain' => 'test.example.com',
        'status' => true,
    ]);

    $fakeFile = UploadedFile::fake()->create('document.pdf');

    $response = $this->withoutMiddleware(\App\Http\Middleware\IdentifyTenant::class)
        ->postJson('/api/submissions', [
            'name' => 'John Doe',
            'phone' => '555-1234',
            'email' => 'john@example.com',
            'images' => [$fakeFile],
        ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['images.0']);
});

it('limits number of images to 3', function () {
    Bus::fake();

    Tenant::factory()->create([
        'domain' => 'test.example.com',
        'status' => true,
    ]);

    $files = [
        UploadedFile::fake()->image('photo1.jpg'),
        UploadedFile::fake()->image('photo2.jpg'),
        UploadedFile::fake()->image('photo3.jpg'),
        UploadedFile::fake()->image('photo4.jpg'),
    ];

    $response = $this->withoutMiddleware(\App\Http\Middleware\IdentifyTenant::class)
        ->postJson('/api/submissions', [
            'name' => 'John Doe',
            'phone' => '555-1234',
            'email' => 'john@example.com',
            'images' => $files,
        ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['images']);
});

it('returns submission details by UUID', function () {
    $tenant = Tenant::factory()->create([
        'domain' => 'test.example.com',
        'status' => true,
    ]);

    $submission = Submission::factory()->create([
        'tenant_id' => $tenant->id,
        'name' => 'Jane Doe',
        'phone' => '555-5678',
        'email' => 'jane@example.com',
    ]);

    SubmissionImage::factory()->create([
        'submission_id' => $submission->uuid,
        'original_image' => 'uploads/originals/test.jpg',
        'generated_image' => 'tenant/1/generated/result.jpg',
    ]);

    $response = $this->withoutMiddleware(\App\Http\Middleware\IdentifyTenant::class)
        ->getJson("/api/submissions/{$submission->uuid}");

    $response->assertOk();
    expect($response->json('uuid'))->toBe($submission->uuid);
    expect($response->json('name'))->toBe('Jane Doe');
    expect($response->json('images'))->toHaveCount(1);
});

it('returns 404 for non-existent submission UUID', function () {
    $response = $this->withoutMiddleware(\App\Http\Middleware\IdentifyTenant::class)
        ->getJson('/api/submissions/00000000-0000-0000-0000-000000000000');

    $response->assertNotFound();
});

it('returns submission status by UUID', function () {
    $tenant = Tenant::factory()->create([
        'domain' => 'test.example.com',
        'status' => true,
    ]);

    $submission = Submission::factory()->create([
        'tenant_id' => $tenant->id,
        'status' => 'processing',
    ]);

    $response = $this->withoutMiddleware(\App\Http\Middleware\IdentifyTenant::class)
        ->getJson("/api/submissions/{$submission->uuid}/status");

    $response->assertOk();
    expect($response->json('uuid'))->toBe($submission->uuid);
    expect($response->json('status'))->toBe('processing');
});