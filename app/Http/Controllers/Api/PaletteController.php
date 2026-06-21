<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\PaletteGroupResource;
use App\Models\PaletteGroup;
use App\Services\TenantManager;
use Illuminate\Http\JsonResponse;

class PaletteController extends Controller
{
    /**
     * Return all palette groups with their palettes for the current tenant.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(TenantManager $tenantManager): JsonResponse
    {
        $tenant = $tenantManager->getTenant();

        $paletteGroups = PaletteGroup::query()
            ->where('tenant_id', $tenant->getKey())
            ->with('palettes')
            ->get();

        return response()->json(
            PaletteGroupResource::collection($paletteGroups)->toArray(request())
        );
    }
}
