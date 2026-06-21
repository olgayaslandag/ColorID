<?php

declare(strict_types=1);

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PaletteResource extends JsonResource
{
    /**
     * Transform the palette resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'title' => $this->resource->title,
            'color_code' => $this->resource->color_code,
            'image_url' => $this->resource->image
                ? Storage::disk('public')->url($this->resource->image)
                : null,
        ];
    }
}
