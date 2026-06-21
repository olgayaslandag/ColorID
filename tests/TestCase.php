<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * Create a tenant for testing.
     *
     * @param  array  $attributes
     * @return \App\Models\Tenant
     */
    protected function createTenant(array $attributes = [])
    {
        return \App\Models\Tenant::factory()->create($attributes);
    }

    /**
     * Create a submission for testing.
     *
     * @param  array  $attributes
     * @return \App\Models\Submission
     */
    protected function createSubmission(array $attributes = [])
    {
        return \App\Models\Submission::factory()->create($attributes);
    }
}