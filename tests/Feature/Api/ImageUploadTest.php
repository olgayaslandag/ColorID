<?php

namespace Tests\Feature\Api;

use App\Models\Tenant;
use App\Services\TenantManager;
use App\Jobs\GenerateImageJob;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Storage;

it('accepts valid image file types', function () {
    Storage::fake('public');
    Bus::fake();

    $tenant = Tenant::factory()->create([
        'domain' => 'test.example.com',
        'status' => true,
    ]);

    app(TenantManager::class)->setTenant($tenant);

    $category = \App\Models\ProductCategory::factory()->create();
    $swatch = \App\Models\Swatch::factory()->create();

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
            'city' => 'Istanbul',
            'surface' => 'ic_duvar',
            'category_id' => $category->id,
            'swatch_id' => $swatch->id,
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

    $category = \App\Models\ProductCategory::factory()->create();
    $swatch = \App\Models\Swatch::factory()->create();

    $invalidFiles = [
        UploadedFile::fake()->create('document.pdf'),
    ];

    $response = $this->withoutMiddleware(\App\Http\Middleware\IdentifyTenant::class)
        ->postJson('/api/submissions', [
            'name' => 'Test User',
            'phone' => '555-1234',
            'email' => 'test@example.com',
            'city' => 'Istanbul',
            'surface' => 'ic_duvar',
            'category_id' => $category->id,
            'swatch_id' => $swatch->id,
            'images' => $invalidFiles,
        ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['images.0']);
});