<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

        $dailySubmissions = Submission::query()
            ->where('created_at', '>=', $today)
            ->count();

        $monthlyTotal = Submission::query()
            ->where('created_at', '>=', $startOfMonth)
            ->count();

        $totalCompleted = Submission::query()
            ->where('created_at', '>=', $startOfMonth)
            ->where('status', 'completed')
            ->count();

        $totalFailed = Submission::query()
            ->where('created_at', '>=', $startOfMonth)
            ->where('status', 'failed')
            ->count();

        $monthlyTotalForPercentage = $monthlyTotal > 0 ? $monthlyTotal : 1;

        $stats = [
            'daily_submissions' => $dailySubmissions,
            'monthly_total' => $monthlyTotal,
            'success_rate' => round(($totalCompleted / $monthlyTotalForPercentage) * 100, 1),
            'error_rate' => round(($totalFailed / $monthlyTotalForPercentage) * 100, 1),
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
