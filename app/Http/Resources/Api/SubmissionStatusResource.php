<?php

declare(strict_types=1);

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubmissionStatusResource extends JsonResource
{
    /**
     * Transform the submission status resource into a lightweight array.
     *
     * Intended for polling endpoints where only the current status is needed.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->resource->uuid,
            'status' => $this->resource->status,
        ];
    }
}
