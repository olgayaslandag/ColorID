<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreSubmissionRequest;
use App\Http\Resources\Api\SubmissionResource;
use App\Http\Resources\Api\SubmissionStatusResource;
use App\Models\Submission;
use App\Jobs\GenerateImageJob;
use App\Services\TenantManager;
use Illuminate\Http\JsonResponse;

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
        $tenant = app(TenantManager::class)->getTenant();
        $validated = $request->validated();

        $submission = Submission::create([
            'tenant_id' => $tenant->id,
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'email' => $validated['email'] ?? null,
            'city' => $validated['city'],
            'surface' => $validated['surface'],
            'palette_id' => $validated['palette_id'],
            'prompt' => $validated['prompt'] ?? null,
            'status' => 'pending',
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('uploads/originals', 'public');

                $submission->images()->create([
                    'original_image' => $path,
                ]);
            }
        }

        $submission->load('images');

        dispatch(new GenerateImageJob($submission));

        return SubmissionResource::make($submission)
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified submission details with images.
     *
     * @param  string  $uuid
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(string $uuid): JsonResponse
    {
        $submission = Submission::query()
            ->with('images')
            ->where('uuid', $uuid)
            ->firstOrFail();

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
        $submission = Submission::query()
            ->where('uuid', $uuid)
            ->firstOrFail(['uuid', 'status']);

        return response()->json(SubmissionStatusResource::make($submission)->toArray(request()));
    }
}
