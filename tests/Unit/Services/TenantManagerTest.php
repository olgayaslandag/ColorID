<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Models\Tenant;
use App\Services\TenantManager;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(TestCase::class, RefreshDatabase::class);

it('can set and get tenant', function () {
    $tenantManager = new TenantManager();
    $tenant = Tenant::factory()->create();

    $tenantManager->setTenant($tenant);

    expect($tenantManager->getTenant())->toBeInstanceOf(Tenant::class);
    expect($tenantManager->getTenant()->id)->toBe($tenant->id);
    expect($tenantManager->getTenantId())->toBe($tenant->id);
});

it('returns null when no tenant is set', function () {
    $tenantManager = new TenantManager();

    expect($tenantManager->getTenant())->toBeNull();
    expect($tenantManager->getTenantId())->toBeNull();
});

it('can check if tenant is active', function () {
    $tenantManager = new TenantManager();
    $activeTenant = Tenant::factory()->create(['status' => true]);
    $inactiveTenant = Tenant::factory()->create(['status' => false]);

    $tenantManager->setTenant($activeTenant);
    expect($tenantManager->isActive())->toBeTrue();

    $tenantManager->setTenant($inactiveTenant);
    expect($tenantManager->isActive())->toBeFalse();
});