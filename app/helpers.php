<?php

declare(strict_types=1);

use App\Models\Tenant;

if (! function_exists('currentTenant')) {
    /**
     * Get the current tenant from the container.
     */
    function currentTenant(): ?Tenant
    {
        /** @var Tenant|null $tenant */
        $tenant = app()->get('tenant');

        return $tenant;
    }
}
