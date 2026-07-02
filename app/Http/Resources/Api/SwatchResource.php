<?php

declare(strict_types=1);

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SwatchResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $product = $this->resource->relationLoaded('product') ? $this->resource->product : null;
        $tenant = $product !== null && $product->relationLoaded('tenant') ? $product->tenant : null;

        return [
            'id' => $this->resource->id,
            'name' => $this->resource->name,
            'type' => $this->resource->type,
            'value' => $this->resource->value,
            'product_id' => $this->resource->product_id,
            'product_name' => $product?->name,
            'tenant_id' => $tenant?->id,
            'tenant_name' => $tenant?->name,
            'image_url' => $this->resource->image_url,
        ];
    }
}
