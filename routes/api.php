<?php

declare(strict_types=1);

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\SwatchController;
use App\Http\Controllers\Api\SubmissionController;
use App\Http\Controllers\Api\WidgetConfigController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Photo Builder API Routes
|--------------------------------------------------------------------------
|
| All API routes are rate-limited globally. Submissions store has an
| additional stricter rate limiter for abuse prevention.
|
*/

Route::middleware('throttle:api')->group(function (): void {

    // Tenant-scoped routes (resolved via IdentifyTenant middleware by domain)
    Route::middleware('tenant')->group(function (): void {
        Route::get('/widget/config', [WidgetConfigController::class, 'show']);
            Route::get('/categories', [CategoryController::class, 'index']);
        Route::get('/swatches', [SwatchController::class, 'index']);
    });

    // Submissions — store has a stricter rate limit
    Route::post('/submissions', [SubmissionController::class, 'store'])
        ->middleware(['tenant', 'throttle:submissions']);
    Route::get('/submissions/{uuid}', [SubmissionController::class, 'show'])
        ->middleware('tenant');
    Route::get('/submissions/{uuid}/status', [SubmissionController::class, 'status'])
        ->middleware('tenant');
});
