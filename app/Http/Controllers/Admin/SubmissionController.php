<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SubmissionController extends Controller
{
    /**
     * Display a paginated, filterable listing of submissions.
     */
    public function index(Request $request): Response
    {
        $query = Submission::query()
            ->with('tenant:id,name');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('tenant_id')) {
            $query->where('tenant_id', $request->tenant_id);
        }

        if ($request->filled('city')) {
            $query->where('city', 'like', "%{$request->city}%");
        }

        if ($request->filled('search')) {
            $search = str_replace(['%', '_'], ['\\%', '\\_'], $request->search);
            $query->where(function ($q) use ($search): void {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $submissions = $query->latest()->paginate(15);

        $tenants = Tenant::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Submissions/Index', [
            'submissions' => $submissions,
            'tenants' => $tenants,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
                'tenant_id' => $request->tenant_id,
                'city' => $request->city,
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

    /**
     * Remove the specified submission.
     */
    public function destroy(Submission $submission): RedirectResponse
    {
        $submission->images()->delete();
        $submission->delete();

        return redirect()->route('admin.submissions.index')
            ->with('success', 'Submission deleted successfully.');
    }

    public function export(Request $request): StreamedResponse
    {
        $query = Submission::query()->with('tenant:id,name');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('tenant_id')) {
            $query->where('tenant_id', $request->tenant_id);
        }

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="submissions-' . now()->format('Y-m-d') . '.csv"',
        ];

        $callback = function () use ($query) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['UUID', 'Name', 'Email', 'Phone', 'City', 'Surface', 'Status', 'Tenant', 'Created At']);

            $query->chunkById(200, function ($submissions) use ($file) {
                foreach ($submissions as $submission) {
                    fputcsv($file, [
                        $submission->uuid,
                        $submission->name,
                        $submission->email,
                        $submission->phone,
                        $submission->city,
                        $submission->surface,
                        $submission->status,
                        $submission->tenant?->name ?? 'N/A',
                        $submission->created_at?->toISOString(),
                    ]);
                }
            });

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Delete multiple submissions at once.
     */
    public function batchDelete(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:submissions,uuid',
        ]);

        Submission::whereIn('uuid', $validated['ids'])
            ->chunkById(100, function ($submissions) {
                foreach ($submissions as $submission) {
                    $submission->images()->delete();
                    $submission->delete();
                }
            });

        return redirect()->route('admin.submissions.index')
            ->with('success', count($validated['ids']) . ' submissions deleted successfully.');
    }
}
