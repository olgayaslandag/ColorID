<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTenantRequest;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TenantController extends Controller
{
    /**
     * Display a paginated listing of all tenants.
     */
    public function index(Request $request): Response
    {
        $tenants = Tenant::query()
            ->withCount('submissions')
            ->orderBy('name')
            ->paginate(15)
            ->through(fn (Tenant $tenant) => [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'domain' => $tenant->domain,
                'logo' => $tenant->logo,
                'primary_color' => $tenant->primary_color,
                'secondary_color' => $tenant->secondary_color,
                'status' => $tenant->status,
                'monthly_limit' => $tenant->monthly_limit,
                'submissions_count' => $tenant->submissions_count,
                'created_at' => $tenant->created_at?->toISOString(),
            ]);

        return Inertia::render('Tenants/Index', [
            'tenants' => $tenants,
        ]);
    }

    /**
     * Display the specified tenant with its submissions.
     */
    public function show(Tenant $tenant): Response
    {
        $tenant->load('settings');

        $submissions = $tenant->submissions()
            ->latest()
            ->paginate(15);

        return Inertia::render('Tenants/Show', [
            'tenant' => [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'domain' => $tenant->domain,
                'logo' => $tenant->logo,
                'primary_color' => $tenant->primary_color,
                'secondary_color' => $tenant->secondary_color,
                'status' => $tenant->status,
                'monthly_limit' => $tenant->monthly_limit,
                'settings' => $tenant->settings->map(fn ($setting) => [
                    'id' => $setting->id,
                    'key' => $setting->key,
                    'value' => $setting->value,
                ]),
                'created_at' => $tenant->created_at?->toISOString(),
            ],
            'submissions' => $submissions,
        ]);
    }

    /**
     * Update the specified tenant (e.g., toggle status).
     */
    public function store(StoreTenantRequest $request): RedirectResponse
    {
        Tenant::create($request->validated());

        return redirect()->route('admin.tenants.index')
            ->with('success', 'Kiracı başarıyla oluşturuldu.');
    }

    public function update(Request $request, Tenant $tenant): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'boolean',
            'name' => 'sometimes|string|max:255',
            'domain' => 'sometimes|string|max:255|unique:tenants,domain,' . $tenant->id,
            'monthly_limit' => 'sometimes|integer|min:0',
        ]);

        $tenant->update($validated);

        return back()->with('success', 'Tenant updated successfully.');
    }

    public function destroy(Tenant $tenant): RedirectResponse
    {
        $tenant->delete();

        return redirect()->route('admin.tenants.index')
            ->with('success', 'Kiracı başarıyla silindi.');
    }

    public function editApiKey(Tenant $tenant): Response
    {
        $setting = \App\Models\TenantSetting::query()
            ->where('tenant_id', $tenant->id)
            ->where('key', 'openai_api_key')
            ->first();

        return Inertia::render('Tenants/ApiKey', [
            'tenant' => [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'domain' => $tenant->domain,
            ],
            'hasApiKey' => $setting !== null,
        ]);
    }

    public function updateApiKey(Request $request, Tenant $tenant): RedirectResponse
    {
        $validated = $request->validate([
            'api_key' => 'nullable|string|max:255',
        ]);

        \App\Models\TenantSetting::updateOrCreate(
            [
                'tenant_id' => $tenant->id,
                'key' => 'openai_api_key',
            ],
            [
                'value' => $validated['api_key'] ?? '',
            ]
        );

        return redirect()->route('admin.tenants.show', $tenant)
            ->with('success', 'API key updated successfully.');
    }
}
