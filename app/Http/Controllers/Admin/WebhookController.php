<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\Webhook;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WebhookController extends Controller
{
    public function index(Request $request): Response
    {
        $webhooks = Webhook::query()
            ->with('tenant:id,name')
            ->latest()
            ->paginate(15)
            ->through(fn (Webhook $webhook) => [
                'id' => $webhook->id,
                'tenant_id' => $webhook->tenant_id,
                'tenant_name' => $webhook->tenant?->name,
                'url' => $webhook->url,
                'events' => $webhook->events,
                'is_active' => $webhook->is_active,
                'created_at' => $webhook->created_at?->toISOString(),
            ]);

        return Inertia::render('Admin/Webhooks/Index', [
            'webhooks' => $webhooks,
            'tenants' => Tenant::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tenant_id' => 'required|exists:tenants,id',
            'url' => 'required|url|max:255',
            'secret' => 'nullable|string|max:255',
            'events' => 'required|array',
            'events.*' => 'string|in:submission.completed,submission.failed',
            'is_active' => 'boolean',
        ]);

        Webhook::create($validated);

        return redirect()->route('admin.webhooks.index')
            ->with('success', 'Webhook created successfully.');
    }

    public function update(Request $request, Webhook $webhook): RedirectResponse
    {
        $validated = $request->validate([
            'url' => 'sometimes|url|max:255',
            'secret' => 'nullable|string|max:255',
            'events' => 'sometimes|array',
            'events.*' => 'string|in:submission.completed,submission.failed',
            'is_active' => 'boolean',
        ]);

        $webhook->update($validated);

        return back()->with('success', 'Webhook updated successfully.');
    }

    public function destroy(Webhook $webhook): RedirectResponse
    {
        $webhook->delete();

        return redirect()->route('admin.webhooks.index')
            ->with('success', 'Webhook deleted successfully.');
    }
}
