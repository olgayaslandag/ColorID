<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Tenant;
use App\Models\Submission;
use App\Models\SubmissionImage;
use Illuminate\Support\Facades\Storage;

it('returns 403 when not authenticated', function () {
    $image = SubmissionImage::factory()->create();

    $response = $this->get(route('image.show', $image));

    $response->assertForbidden();
});

it('returns 200 when authenticated and image exists', function () {
    $user = User::factory()->create();
    $tenant = Tenant::factory()->create();
    $submission = Submission::factory()->create(['tenant_id' => $tenant->id]);

    $image = SubmissionImage::factory()->create([
        'submission_id' => $submission->uuid,
        'generated_image' => 'uploads/generated/test.png',
    ]);

    Storage::fake('public');
    Storage::disk('public')->put('uploads/generated/test.png', 'fake-image-data');

    $response = $this->actingAs($user)->get(route('image.show', $image));

    $response->assertOk();
});

it('returns 404 when image path does not exist in storage', function () {
    $user = User::factory()->create();
    $tenant = Tenant::factory()->create();
    $submission = Submission::factory()->create(['tenant_id' => $tenant->id]);

    $image = SubmissionImage::factory()->create([
        'submission_id' => $submission->uuid,
        'generated_image' => 'uploads/generated/missing.png',
    ]);

    Storage::fake('public');

    $response = $this->actingAs($user)->get(route('image.show', $image));

    $response->assertNotFound();
});

it('returns 404 for non-existent image model', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/img/submissions/99999');

    $response->assertNotFound();
});

it('returns different variant based on query parameter', function () {
    $user = User::factory()->create();
    $tenant = Tenant::factory()->create();
    $submission = Submission::factory()->create(['tenant_id' => $tenant->id]);

    $image = SubmissionImage::factory()->create([
        'submission_id' => $submission->uuid,
        'original_image' => 'uploads/originals/orig.png',
        'generated_image' => 'uploads/generated/gen.png',
    ]);

    Storage::fake('public');
    Storage::disk('public')->put('uploads/originals/orig.png', 'orig-data');
    Storage::disk('public')->put('uploads/generated/gen.png', 'gen-data');

    $response = $this->actingAs($user)->get(route('image.show', ['submissionImage' => $image, 'variant' => 'original']));

    $response->assertOk();
});

it('serves media file successfully', function () {
    $media = \App\Models\Media::create([
        'id' => \Illuminate\Support\Str::uuid(),
        'disk' => 'public',
        'path' => 'uploads/media/test-image.png',
        'mime_type' => 'image/png',
    ]);

    Storage::fake('public');
    Storage::disk('public')->put('uploads/media/test-image.png', 'fake-image-data');

    $response = $this->get(route('media.show', $media));

    $response->assertOk();
    $response->assertHeader('Content-Type', 'image/png');
    $response->assertHeader('Cache-Control', 'max-age=86400, public');
});

it('returns 404 when media file does not exist in storage', function () {
    $media = \App\Models\Media::create([
        'id' => \Illuminate\Support\Str::uuid(),
        'disk' => 'public',
        'path' => 'uploads/media/missing.png',
    ]);

    Storage::fake('public');

    $response = $this->get(route('media.show', $media));

    $response->assertNotFound();
});

it('returns 404 for non-existent media uuid', function () {
    $response = $this->get('/img/nonexistent-uuid-12345');

    $response->assertNotFound();
});
