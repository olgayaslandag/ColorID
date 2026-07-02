<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreSwatchRequest;
use App\Http\Resources\Api\SwatchResource;
use App\Models\Swatch;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class SwatchController extends Controller
{
    public function index(StoreSwatchRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $query = Swatch::query()
            ->whereHas('product.categories', function ($q) use ($validated) {
                $q->where('product_categories.id', $validated['category_id']);
            })
            ->with(['product.tenant']);

        if (! empty($validated['tenant_id'])) {
            $query->whereHas('product', function ($q) use ($validated) {
                $q->where('tenant_id', $validated['tenant_id']);
            });
        }

        if (! empty($validated['product_id'])) {
            $query->where('product_id', $validated['product_id']);
        }

        $swatches = $query->get();

        return SwatchResource::collection($swatches)->response();
    }
}
