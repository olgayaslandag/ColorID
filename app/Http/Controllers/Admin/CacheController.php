<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class CacheController extends Controller
{
    public function index(Request $request): Response
    {
        $stats = [
            'cache_driver' => config('cache.default'),
            'session_driver' => config('session.driver'),
            'queue_connection' => config('queue.default'),
            'app_env' => app()->environment(),
            'app_debug' => config('app.debug'),
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
        ];

        return Inertia::render('Admin/Cache/Index', [
            'stats' => $stats,
        ]);
    }

    public function clear(Request $request): RedirectResponse
    {
        Cache::flush();

        return back()->with('success', 'Application cache cleared successfully.');
    }
}
