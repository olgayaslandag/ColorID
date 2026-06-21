<?php

declare(strict_types=1);

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaletteGroupResource extends JsonResource
{
    /**
     * Transform the palette group resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'title' => $this->resource->title,
            'palettes' => PaletteResource::collection($this->whenLoaded('palettes')),
        ];
    }
}
