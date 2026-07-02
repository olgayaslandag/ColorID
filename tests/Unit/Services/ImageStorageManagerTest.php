<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\TenantManager;
use App\Services\ImageStorageManager;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

uses(TestCase::class);

it('stores original file correctly', function () {
    $tenantManager = \Mockery::mock(TenantManager::class);
    $manager = new ImageStorageManager($tenantManager);

    Storage::fake('public');
    config(['image_storage.disk' => 'public']);

    $file = UploadedFile::fake()->image('test.jpg');
    $path = $manager->storeOriginal($file);

    expect($path)->toStartWith('uploads/originals/');
    Storage::disk('public')->assertExists($path);
});

it('stores generated image correctly', function () {
    $tenantManager = \Mockery::mock(TenantManager::class);
    $manager = new ImageStorageManager($tenantManager);

    Storage::fake('public');
    config(['image_storage.disk' => 'public']);

    Storage::disk('public')->put('temp/test.png', 'fake-image-data');

    $path = $manager->storeGenerated('temp/test.png', 'tenant-1');

    expect($path)->toBe('tenant/tenant-1/generated/test.png');
    Storage::disk('public')->assertExists($path);
    Storage::disk('public')->assertMissing('temp/test.png');
});

it('returns configured disk', function () {
    $manager = new ImageStorageManager(\Mockery::mock(TenantManager::class));

    config(['image_storage.disk' => 'r2']);
    expect($manager->getDisk())->toBe('r2');

    config(['image_storage.disk' => 's3']);
    expect($manager->getDisk())->toBe('s3');
});

it('throws exception when source image not found for storeGenerated', function () {
    $tenantManager = \Mockery::mock(TenantManager::class);
    $manager = new ImageStorageManager($tenantManager);

    Storage::fake('public');
    config(['image_storage.disk' => 'public']);

    expect(fn () => $manager->storeGenerated('nonexistent.png', 'tenant-1'))
        ->toThrow(RuntimeException::class, 'Source image not found');
});
