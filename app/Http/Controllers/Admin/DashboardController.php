<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard with stats and recent submissions.
     */
    public function index(Request $request): Response
    {
        $today = now()->startOfDay();
        $startOfMonth = now()->startOfMonth();

        $monthlyStats = Submission::query()
            ->selectRaw('COUNT(*) as total')
            ->selectRaw('COUNT(CASE WHEN status = ? THEN 1 END) as completed', ['completed'])
            ->selectRaw('COUNT(CASE WHEN status = ? THEN 1 END) as failed', ['failed'])
            ->where('created_at', '>=', $startOfMonth)
            ->first();

        $dailySubmissions = Submission::query()
            ->where('created_at', '>=', $today)
            ->count();

        $monthlyTotal = (int) $monthlyStats->total;
        $monthlyTotalForPercentage = $monthlyTotal > 0 ? $monthlyTotal : 1;

        $stats = [
            'daily_submissions' => $dailySubmissions,
            'monthly_total' => $monthlyTotal,
            'success_rate' => $monthlyTotal > 0 ? round(((int) $monthlyStats->completed / $monthlyTotal) * 100, 1) : 0,
            'error_rate' => $monthlyTotal > 0 ? round(((int) $monthlyStats->failed / $monthlyTotal) * 100, 1) : 0,
        ];

        $recentSubmissions = Submission::query()
            ->with('tenant:id,name')
            ->latest()
            ->limit(10)
            ->get([
                'uuid',
                'tenant_id',
                'name',
                'email',
                'status',
                'created_at',
            ]);

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentSubmissions' => $recentSubmissions,
        ]);
    }

    public function quota(Request $request): Response
    {
        $tenants = Tenant::query()
            ->withCount(['submissions as total_submissions' => function ($q) {
                $q->whereMonth('created_at', now()->month);
            }])
            ->withCount(['submissions as completed_submissions' => function ($q) {
                $q->where('status', 'completed')
                    ->whereMonth('created_at', now()->month);
            }])
            ->withCount(['submissions as failed_submissions' => function ($q) {
                $q->where('status', 'failed')
                    ->whereMonth('created_at', now()->month);
            }])
            ->orderBy('name')
            ->get()
            ->map(fn ($tenant) => [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'domain' => $tenant->domain,
                'monthly_limit' => $tenant->monthly_limit,
                'total_submissions' => (int) $tenant->total_submissions,
                'completed_submissions' => (int) $tenant->completed_submissions,
                'failed_submissions' => (int) $tenant->failed_submissions,
                'usage_percentage' => $tenant->monthly_limit > 0
                    ? round(($tenant->total_submissions / $tenant->monthly_limit) * 100, 1)
                    : 0,
                'status' => $tenant->status,
            ]);

        return Inertia::render('Admin/Quota/Index', [
            'tenants' => $tenants,
        ]);
    }

    /**
     * Display the widget demo / documentation page.
     */
    public function widgetDemo(Request $request): Response
    {
        $tenant = Tenant::query()->first();

        return Inertia::render('WidgetDemo', [
            'tenant' => $tenant ? [
                'name' => $tenant->name,
                'domain' => $tenant->domain,
                'primary_color' => $tenant->primary_color,
                'secondary_color' => $tenant->secondary_color,
            ] : null,
        ]);
    }
}
