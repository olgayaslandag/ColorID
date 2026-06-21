<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubmissionController extends Controller
{
    /**
     * Display a paginated, filterable listing of submissions.
     */
    public function index(Request $request): Response
    {
        $query = Submission::query()
            ->with('tenant:id,name')
            ->latest();

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search by name or email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search): void {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $submissions = $query->paginate(15);

        return Inertia::render('Submissions/Index', [
            'submissions' => $submissions,
            'filters' => [
                'status' => $request->status,
                'search' => $request->search,
            ],
        ]);
    }

    /**
     * Display the specified submission with images.
     */
    public function show(Submission $submission): Response
    {
        $submission->load(['images', 'tenant:id,name,domain']);

        return Inertia::render('Submissions/Show', [
            'submission' => [
                'uuid' => $submission->uuid,
                'tenant_id' => $submission->tenant_id,
                'name' => $submission->name,
                'phone' => $submission->phone,
                'email' => $submission->email,
                'city' => $submission->city,
                'surface' => $submission->surface,
                'prompt' => $submission->prompt,
                'status' => $submission->status,
                'created_at' => $submission->created_at?->toISOString(),
                'updated_at' => $submission->updated_at?->toISOString(),
                'tenant' => $submission->tenant ? [
                    'id' => $submission->tenant->id,
                    'name' => $submission->tenant->name,
                    'domain' => $submission->tenant->domain,
                ] : null,
                'images' => $submission->images->map(fn ($image) => [
                    'id' => $image->id,
                    'original_image' => $image->original_image,
                    'generated_image' => $image->generated_image,
                ]),
            ],
        ]);
    }
}
