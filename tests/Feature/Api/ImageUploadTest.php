<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\Tenant;
use App\Services\TenantManager;
use App\Jobs\GenerateImageJob;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Storage;

uses(TestCase::class, RefreshDatabase::class);

it('accepts valid image file types', function () {
    Storage::fake('public');
    Bus::fake();

    $tenant = Tenant::factory()->create([
        'domain' => 'test.example.com',
        'status' => true,
    ]);

    app(TenantManager::class)->setTenant($tenant);

    $validFiles = [
        UploadedFile::fake()->image('photo.jpg'),
        UploadedFile::fake()->image('photo.png'),
        UploadedFile::fake()->image('photo.webp'),
    ];

    $response = $this->withoutMiddleware(\App\Http\Middleware\IdentifyTenant::class)
        ->postJson('/api/submissions', [
            'name' => 'Test User',
            'phone' => '555-1234',
            'email' => 'test@example.com',
            'images' => $validFiles,
        ]);

    $response->assertCreated();
});

it('rejects invalid image file types', function () {
    Bus::fake();

    $tenant = Tenant::factory()->create([
        'domain' => 'test.example.com',
        'status' => true,
    ]);

    app(TenantManager::class)->setTenant($tenant);

    $invalidFiles = [
        UploadedFile::fake()->create('document.pdf'),
    ];

    $response = $this->withoutMiddleware(\App\Http\Middleware\IdentifyTenant::class)
        ->postJson('/api/submissions', [
            'name' => 'Test User',
            'phone' => '555-1234',
            'email' => 'test@example.com',
            'images' => $invalidFiles,
        ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['images.0']);
});