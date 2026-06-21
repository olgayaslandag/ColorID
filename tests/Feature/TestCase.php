<?php

declare(strict_types=1);

namespace Tests\Feature;

use Tests\TestCase as BaseTestCase;

/**
 * Base test case for feature tests with common setup.
 *
 * This class provides shared helper methods for feature tests,
 * including tenant management and authentication utilities.
 */
abstract class TestCase extends BaseTestCase
{
    /**
     * Create and set up an active tenant for testing.
     *
     * @param  array<string, mixed>  $attributes
     * @return \App\Models\Tenant
     */
    protected function createActiveTenant(array $attributes = []): \App\Models\Tenant
    {
        $tenant = \Database\Factories\TenantFactory::new()->active()->create($attributes);

        app(\App\Services\TenantManager::class)->setTenant($tenant);
        app()->instance('tenant', $tenant);

        return $tenant;
    }

    /**
     * Make a request with a tenant's domain header.
     *
     * @param  string  $method
     * @param  string  $uri
     * @param  array<string, mixed>  $data
     * @return \Illuminate\Testing\TestResponse
     */
    protected function withTenantDomain(string $method, string $uri, \App\Models\Tenant $tenant, array $data = []): \Illuminate\Testing\TestResponse
    {
        return $this->withHeader('Host', $tenant->domain)
            ->json($method, $uri, $data);
    }

    /**
     * Create an authenticated admin user.
     *
     * @return \App\Models\User
     */
    protected function createAdminUser(): \App\Models\User
    {
        $user = \App\Models\User::factory()->create();

        $this->actingAs($user);

        return $user;
    }
}
