<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\Tenant;
use App\Models\Submission;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(TestCase::class, RefreshDatabase::class);

it('can create a tenant with fillable attributes', function () {
    $tenant = Tenant::factory()->create([
        'name' => 'Test Tenant',
        'domain' => 'test.example.com',
        'primary_color' => '#ff0000',
        'secondary_color' => '#00ff00',
        'status' => true,
        'monthly_limit' => 100,
    ]);

    expect($tenant->name)->toBe('Test Tenant');
    expect($tenant->domain)->toBe('test.example.com');
    expect($tenant->primary_color)->toBe('#ff0000');
    expect($tenant->secondary_color)->toBe('#00ff00');
    expect($tenant->status)->toBeTrue();
    expect($tenant->monthly_limit)->toBe(100);
});

it('has an active scope', function () {
    Tenant::factory()->create(['status' => true]);
    Tenant::factory()->create(['status' => false]);

    $activeTenants = Tenant::active()->get();

    expect($activeTenants)->toHaveCount(1);
    expect($activeTenants->first()->status)->toBeTrue();
});

it('has submissions relationship', function () {
    $tenant = Tenant::factory()->create();
    $submission = Submission::factory()->create([
        'tenant_id' => $tenant->id,
    ]);

    $tenant->refresh();

    expect($tenant->submissions)->toHaveCount(1);
    expect($tenant->submissions->first()->uuid)->toBe($submission->uuid);
});

it('has tenant settings relationship', function () {
    $tenant = Tenant::factory()->create();
    $setting = \App\Models\TenantSetting::factory()->create([
        'tenant_id' => $tenant->id,
    ]);

    $tenant->refresh();

    expect($tenant->settings)->toHaveCount(1);
    expect($tenant->settings->first()->id)->toBe($setting->id);
});