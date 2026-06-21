<?php

declare(strict_types=1);

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubmissionResource extends JsonResource
{
    /**
     * Transform the submission resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->resource->uuid,
            'name' => $this->resource->name,
            'phone' => $this->resource->phone,
            'email' => $this->resource->email,
            'city' => $this->resource->city,
            'surface' => $this->resource->surface,
            'prompt' => $this->resource->prompt,
            'status' => $this->resource->status,
            'images' => SubmissionImageResource::collection($this->whenLoaded('images')),
            'created_at' => $this->resource->created_at,
        ];
    }
}
