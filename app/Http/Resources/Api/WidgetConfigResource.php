<?php

declare(strict_types=1);

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class WidgetConfigResource extends JsonResource
{
    /**
     * Transform the tenant resource into a widget configuration array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->resource->name,
            'logo_url' => $this->resource->logo
                ? Storage::disk('public')->url($this->resource->logo)
                : null,
            'primary_color' => $this->resource->primary_color,
            'secondary_color' => $this->resource->secondary_color,
            'monthly_limit' => $this->resource->monthly_limit,
        ];
    }
}
