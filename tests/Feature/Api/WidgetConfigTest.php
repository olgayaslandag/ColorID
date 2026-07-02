<?php

namespace Tests\Feature\Api;

use App\Models\Tenant;
use App\Services\TenantManager;

it('returns widget config for a valid tenant', function () {
    $tenant = Tenant::factory()->create([
        'name' => 'Test Tenant',
        'domain' => 'test.example.com',
        'logo' => 'logos/test.png',
        'primary_color' => '#ff0000',
        'secondary_color' => '#00ff00',
        'status' => true,
        'monthly_limit' => 100,
    ]);

    app(TenantManager::class)->setTenant($tenant);

    $response = $this->withoutMiddleware(\App\Http\Middleware\IdentifyTenant::class)
        ->getJson('/api/widget/config');

    $response->assertOk();
    $response->assertJsonStructure([
        'name',
        'logo_url',
        'primary_color',
        'secondary_color',
        'monthly_limit',
    ]);

    expect($response->json('name'))->toBe('Test Tenant');
    expect($response->json('primary_color'))->toBe('#ff0000');
    expect($response->json('secondary_color'))->toBe('#00ff00');
    expect($response->json('monthly_limit'))->toBe(100);
});

it('returns error when tenant is not set', function () {
    $response = $this->withoutMiddleware(\App\Http\Middleware\IdentifyTenant::class)
        ->getJson('/api/widget/config');

    $response->assertStatus(500);
});