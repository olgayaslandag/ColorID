<?php

declare(strict_types=1);

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubmissionImageResource extends JsonResource
{
    /**
     * Transform the submission image resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'original_url' => $this->resource->original_image
                ? route('image.show', ['image' => $this->resource->id, 'variant' => 'original'])
                : null,
            'generated_url' => $this->resource->generated_image
                ? route('image.show', ['image' => $this->resource->id, 'variant' => 'generated'])
                : null,
        ];
    }
}
