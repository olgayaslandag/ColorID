<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Tenant;

class TenantManager
{
    private ?Tenant $tenant = null;

    /**
     * Get the current tenant.
     */
    public function getTenant(): ?Tenant
    {
        return $this->tenant;
    }

    /**
     * Set the current tenant.
     */
    public function setTenant(Tenant $tenant): void
    {
        $this->tenant = $tenant;
    }

    /**
     * Get the current tenant's ID.
     */
    public function getTenantId(): ?int
    {
        return $this->tenant?->id;
    }

    /**
     * Check if the current tenant is active.
     */
    public function isActive(): bool
    {
        return $this->tenant !== null && $this->tenant->status === true;
    }
}
