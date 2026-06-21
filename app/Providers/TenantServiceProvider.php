<?php

declare(strict_types=1);

namespace App\Providers;

use App\Services\TenantManager;
use Illuminate\Support\ServiceProvider;

class TenantServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(TenantManager::class, function (): TenantManager {
            return new TenantManager();
        });

        // Allow resolution via app('tenant') — bound in IdentifyTenant middleware at runtime
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
