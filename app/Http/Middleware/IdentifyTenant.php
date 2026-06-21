<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\Tenant;
use App\Services\TenantManager;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

class IdentifyTenant
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost();

        /** @var Tenant|null $tenant */
        $tenant = Tenant::query()->where('domain', $host)->first();

        if ($tenant === null) {
            throw new HttpException(403, 'Tenant not found for this domain.');
        }

        if (! $tenant->status) {
            throw new HttpException(403, 'This tenant is inactive.');
        }

        // Bind tenant into the container for resolution via app('tenant')
        app()->instance('tenant', $tenant);

        // Also set it on the TenantManager singleton for type-safe resolution
        app(TenantManager::class)->setTenant($tenant);

        return $next($request);
    }
}
