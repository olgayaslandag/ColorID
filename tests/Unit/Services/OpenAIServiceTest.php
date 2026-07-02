<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\OpenAIService;
use App\Services\TenantManager;
use App\Services\ImageStorageManager;
use App\Exceptions\ImageGenerationException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;

uses(TestCase::class, RefreshDatabase::class);

it('throws exception when reference image not found', function () {
    $tenantManager = \Mockery::mock(TenantManager::class);
    $tenantManager->shouldReceive('getTenantId')->andReturn(null);

    $imageStorage = \Mockery::mock(ImageStorageManager::class);
    $imageStorage->shouldReceive('getDisk')->andReturn('fake');

    Storage::fake('fake');
    config(['services.openai.api_key' => 'test-key']);

    $service = new OpenAIService($tenantManager, $imageStorage);

    expect(fn () => $service->describeImage('nonexistent.jpg'))
        ->toThrow(ImageGenerationException::class, 'Reference image not found for analysis.');
});

it('throws exception when API key not configured for describeImage', function () {
    $tenantManager = \Mockery::mock(TenantManager::class);
    $tenantManager->shouldReceive('getTenantId')->andReturn(null);

    $imageStorage = \Mockery::mock(ImageStorageManager::class);

    Storage::fake('fake');
    Storage::disk('fake')->put('exists.jpg', 'image-data');
    config(['services.openai.api_key' => '']);

    $service = new OpenAIService($tenantManager, $imageStorage);

    expect(fn () => $service->describeImage('exists.jpg'))
        ->toThrow(ImageGenerationException::class, 'OpenAI API key is not configured.');
});

it('throws exception when no tenant context for generateImage', function () {
    $tenantManager = \Mockery::mock(TenantManager::class);
    $tenantManager->shouldReceive('getTenantId')->andReturn(null);

    $imageStorage = \Mockery::mock(ImageStorageManager::class);

    $service = new OpenAIService($tenantManager, $imageStorage);

    expect(fn () => $service->generateImage('test prompt'))
        ->toThrow(ImageGenerationException::class, 'No tenant context available for image generation.');
});

it('throws exception when API key not configured for generateImage', function () {
    $tenantManager = \Mockery::mock(TenantManager::class);
    $imageStorage = \Mockery::mock(ImageStorageManager::class);

    config(['services.openai.api_key' => '']);

    $service = new OpenAIService($tenantManager, $imageStorage);

    expect(fn () => $service->generateImage('test prompt', 'tenant-1'))
        ->toThrow(ImageGenerationException::class, 'OpenAI API key is not configured.');
});
