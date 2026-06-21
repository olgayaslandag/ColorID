<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\Tenant;
use App\Services\TenantManager;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Middleware: ValidateUploadDomain
 *
 * Validates that the request domain is authorized for the current tenant's
 * upload operations. This middleware should be applied to any upload-related
 * routes to ensure uploads are only accepted from recognized domains.
 *
 * This middleware relies on the tenant context having been established by the
 * IdentifyTenant middleware (which runs earlier in the pipeline). It retrieves
 * the current tenant from the TenantManager singleton and checks that the
 * request's host domain matches the tenant's allowed domains.
 *
 * Security model:
 * - Prevents cross-tenant uploads from unregistered domains
 * - Protects against host header injection attacks on upload endpoints
 * - Provides a clear 403 response for unauthorized domains
 *
 * Usage in routes:
 *   Route::middleware(['tenant', 'validate.upload.domain'])->group(function () {
 *       Route::post('/upload', [UploadController::class, 'store']);
 *   });
 */
class ValidateUploadDomain
{
    /**
     * Handle an incoming request.
     *
     * @param  Request  $request  The incoming HTTP request.
     * @param  Closure  $next     The next middleware handler.
     * @return Response           The HTTP response.
     *
     * @throws HttpException If no tenant is found or the domain is not authorized.
     */
    public function handle(Request $request, Closure $next): Response
    {
        /** @var Tenant|null $tenant */
        $tenant = app(TenantManager::class)->getTenant();

        if ($tenant === null) {
            throw new HttpException(403, 'No tenant context found. Ensure the tenant middleware runs before this middleware.');
        }

        $host = $request->getHost();

        // Retrieve the list of domains allowed for this tenant.
        $allowedDomains = $this->getAllowedDomains($tenant);

        // If the request host is not in the list of allowed domains, block the request.
        if (! in_array($host, $allowedDomains, true)) {
            throw new HttpException(
                403,
                sprintf(
                    'The domain "%s" is not authorized for uploads on tenant "%s".',
                    $host,
                    $tenant->name ?? $tenant->id
                )
            );
        }

        return $next($request);
    }

    /**
     * Get the list of allowed domains for the given tenant.
     *
     * Supports both a single 'domain' column and a future 'allowed_domains'
     * array/JSON column for multi-domain tenants. If the tenant model has an
     * 'allowed_domains' attribute, it will be used as the source of truth.
     * Otherwise, falls back to the tenant's primary domain.
     *
     * @param  Tenant  $tenant  The current tenant model.
     * @return array<int, string>  List of fully-qualified domain names.
     */
    private function getAllowedDomains(Tenant $tenant): array
    {
        // If the model has an 'allowed_domains' column (array/JSON cast), use it.
        // This allows future flexibility for multi-domain tenants.
        if ($tenant->relationLoaded('allowedDomains') || array_key_exists('allowed_domains', $tenant->getAttributes())) {
            $allowedDomains = $tenant->getAttribute('allowed_domains');
            if (is_array($allowedDomains) && $allowedDomains !== []) {
                return array_values($allowedDomains);
            }
        }

        // Fall back to the primary 'domain' column (the standard single-domain setup).
        if (is_string($tenant->domain) && $tenant->domain !== '') {
            return [$tenant->domain];
        }

        // No domains configured — deny all requests for safety.
        return [];
    }
}
