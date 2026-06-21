<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\Tenant;
use App\Models\PaletteGroup;
use App\Models\Palette;
use App\Services\TenantManager;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(TestCase::class, RefreshDatabase::class);

it('returns palette groups with palettes for a tenant', function () {
    $tenant = Tenant::factory()->create([
        'domain' => 'test.example.com',
        'status' => true,
    ]);

    $paletteGroup = PaletteGroup::factory()->create([
        'tenant_id' => $tenant->id,
        'title' => 'Test Group',
    ]);

    Palette::factory()->create([
        'palette_group_id' => $paletteGroup->id,
        'title' => 'Test Color',
        'color_code' => '#ff0000',
    ]);

    app(TenantManager::class)->setTenant($tenant);

    $response = $this->withoutMiddleware(\App\Http\Middleware\IdentifyTenant::class)
        ->getJson('/api/palettes');

    $response->assertOk();
    $data = $response->json();

    expect($data)->toHaveCount(1);
    expect($data[0]['title'])->toBe('Test Group');
    expect($data[0]['palettes'])->toHaveCount(1);
    expect($data[0]['palettes'][0]['title'])->toBe('Test Color');
    expect($data[0]['palettes'][0]['color_code'])->toBe('#ff0000');
});

it('returns empty array when tenant has no palettes', function () {
    $tenant = Tenant::factory()->create([
        'domain' => 'empty.example.com',
        'status' => true,
    ]);

    app(TenantManager::class)->setTenant($tenant);

    $response = $this->withoutMiddleware(\App\Http\Middleware\IdentifyTenant::class)
        ->getJson('/api/palettes');

    $response->assertOk();
    expect($response->json())->toBeArray();
    expect($response->json())->toHaveCount(0);
});