<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\WidgetConfigResource;
use App\Services\TenantManager;
use Illuminate\Http\JsonResponse;

class WidgetConfigController extends Controller
{
    /**
     * Display the widget configuration for the current tenant.
     *
     * The tenant is resolved by the IdentifyTenant middleware and made
     * available via the TenantManager singleton.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(TenantManager $tenantManager): JsonResponse
    {
        $tenant = $tenantManager->getTenant();

        return response()->json(WidgetConfigResource::make($tenant)->toArray(request()));
    }
}
