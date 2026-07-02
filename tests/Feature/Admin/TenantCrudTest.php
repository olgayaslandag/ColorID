<?php

namespace Tests\Feature\Admin;

use Tests\TestCase;
use App\Models\User;
use App\Models\Tenant;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    $role = Role::create(['name' => 'admin']);
    $this->adminUser = User::factory()->create();
    $this->adminUser->assignRole('admin');
});

it('admin can list tenants', function () {
    Tenant::factory()->count(3)->create();

    $response = $this->actingAs($this->adminUser)
        ->get(route('admin.tenants.index', ['locale' => 'en']));

    $response->assertOk();
});

it('admin can view a single tenant', function () {
    $tenant = Tenant::factory()->create();

    $response = $this->actingAs($this->adminUser)
        ->get(route('admin.tenants.show', ['locale' => 'en', 'tenant' => $tenant]));

    $response->assertOk();
});

it('admin can create a tenant', function () {
    $response = $this->actingAs($this->adminUser)
        ->post(route('admin.tenants.store', ['locale' => 'en']), [
            'name' => 'New Test Tenant',
            'domain' => 'new-test.example.com',
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('tenants', [
        'name' => 'New Test Tenant',
        'domain' => 'new-test.example.com',
    ]);
});

it('admin can update a tenant', function () {
    $tenant = Tenant::factory()->create();

    $response = $this->actingAs($this->adminUser)
        ->put(route('admin.tenants.update', ['locale' => 'en', 'tenant' => $tenant]), [
            'name' => 'Updated Name',
        ]);

    $response->assertRedirect();
    expect($tenant->fresh()->name)->toBe('Updated Name');
});

it('admin can delete a tenant', function () {
    $tenant = Tenant::factory()->create();

    $response = $this->actingAs($this->adminUser)
        ->delete(route('admin.tenants.destroy', ['locale' => 'en', 'tenant' => $tenant]));

    $response->assertRedirect();
    $this->assertSoftDeleted($tenant);
});

it('non-admin user gets 403 on admin routes', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->get(route('admin.tenants.index', ['locale' => 'en']));

    $response->assertForbidden();
});
