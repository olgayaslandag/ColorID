<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreSubmissionRequest;
use App\Http\Resources\Api\SubmissionResource;
use App\Http\Resources\Api\SubmissionStatusResource;
use App\Jobs\GenerateImageJob;
use App\Models\Submission;
use App\Services\ImageStorageManager;
use App\Services\TenantManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;

class SubmissionController extends Controller
{
    /**
     * Store a newly created submission with uploaded images.
     *
     * Validates the request, persists the submission and images to disk,
     * dispatches the image generation job, and returns the created resource.
     *
     * @param  \App\Http\Requests\Api\StoreSubmissionRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreSubmissionRequest $request): JsonResponse
    {
        set_time_limit(300);

        $tenant = app(TenantManager::class)->getTenant();

        return DB::transaction(function () use ($request, $tenant) {
            $submission = Submission::create([
                'tenant_id' => $tenant->getKey(),
                'name' => $request->name,
                'phone' => $request->phone,
                'email' => $request->email,
                'city' => $request->city,
                'category_id' => $request->category_id,
                'swatch_id' => $request->swatch_id,
                'surface' => $request->surface,
                'prompt' => $request->prompt,
                'status' => 'pending',
            ]);

            $images = $request->file('images', []);
            foreach ($images as $image) {
                $storedPath = app(ImageStorageManager::class)->storeOriginal($image);
                $submission->images()->create(['original_image' => $storedPath]);
            }

            Bus::dispatch(new GenerateImageJob($submission));

            $submission->refresh();

            return SubmissionResource::make($submission)
                ->response()
                ->setStatusCode(201);
        });
    }

    /**
     * Display the specified submission details with images.
     *
     * @param  string  $uuid
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(string $uuid): JsonResponse
    {
        $tenant = app(TenantManager::class)->getTenant();

        $query = Submission::query()->with('images')->where('uuid', $uuid);

        if ($tenant !== null) {
            $query->where('tenant_id', $tenant->getKey());
        }

        $submission = $query->firstOrFail();

        return response()->json(SubmissionResource::make($submission)->toArray(request()));
    }

    /**
     * Return only the status of a submission.
     *
     * Lightweight endpoint for polling submission progress.
     *
     * @param  string  $uuid
     * @return \Illuminate\Http\JsonResponse
     */
    public function status(string $uuid): JsonResponse
    {
        $tenant = app(TenantManager::class)->getTenant();

        $query = Submission::query()->where('uuid', $uuid);

        if ($tenant !== null) {
            $query->where('tenant_id', $tenant->getKey());
        }

        $submission = $query->firstOrFail(['uuid', 'status']);

        return response()->json(SubmissionStatusResource::make($submission)->toArray(request()));
    }
}
