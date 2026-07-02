<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

$locales = array_keys(config('app.available_locales', ['en' => 'English']));
$localePattern = implode('|', $locales);

Route::redirect('/', '/' . app()->getLocale());

Route::get('/img/submissions/{submissionImage}', [\App\Http\Controllers\Img\ImageController::class, 'show'])
    ->name('image.show')
    ->middleware('throttle:60,1');

Route::get('/img/{media}', [\App\Http\Controllers\Img\MediaController::class, 'show'])
    ->name('media.show')
    ->middleware('throttle:60,1');

Route::group(['prefix' => '{locale?}', 'where' => ['locale' => $localePattern]], function () {
    Route::get('/', function () {
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    })->name('welcome');

    Route::get('/visualize', function () {
        return Inertia::render('Visualize');
    })->name('visualize');

    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])
        ->middleware(['auth', 'verified'])->name('dashboard');

    Route::middleware('auth')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
        Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'edit'])->name('notifications.edit');
        Route::put('/notifications', [\App\Http\Controllers\NotificationController::class, 'update'])->name('notifications.update');
        Route::get('/profile/two-factor', [\App\Http\Controllers\TwoFactorController::class, 'edit'])->name('profile.two-factor');
        Route::post('/profile/two-factor/enable', [\App\Http\Controllers\TwoFactorController::class, 'enable'])->name('profile.two-factor.enable');
        Route::post('/profile/two-factor/disable', [\App\Http\Controllers\TwoFactorController::class, 'disable'])->name('profile.two-factor.disable');
    });

    Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
        Route::get('/tenants', [\App\Http\Controllers\Admin\TenantController::class, 'index'])->name('tenants.index');
        Route::get('/tenants/{tenant}', [\App\Http\Controllers\Admin\TenantController::class, 'show'])->name('tenants.show');
        Route::put('/tenants/{tenant}', [\App\Http\Controllers\Admin\TenantController::class, 'update'])->name('tenants.update');
        Route::get('/submissions', [\App\Http\Controllers\Admin\SubmissionController::class, 'index'])->name('submissions.index');
        Route::get('/submissions/export/csv', [\App\Http\Controllers\Admin\SubmissionController::class, 'export'])->name('submissions.export');
        Route::get('/submissions/{submission}', [\App\Http\Controllers\Admin\SubmissionController::class, 'show'])->name('submissions.show');
        Route::delete('/submissions/{submission}', [\App\Http\Controllers\Admin\SubmissionController::class, 'destroy'])->name('submissions.destroy');
        Route::post('/submissions/batch-delete', [\App\Http\Controllers\Admin\SubmissionController::class, 'batchDelete'])->name('submissions.batch-delete');
        Route::post('/tenants', [\App\Http\Controllers\Admin\TenantController::class, 'store'])->name('tenants.store');
        Route::delete('/tenants/{tenant}', [\App\Http\Controllers\Admin\TenantController::class, 'destroy'])->name('tenants.destroy');
        Route::get('/users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
        Route::post('/users', [\App\Http\Controllers\Admin\UserController::class, 'store'])->name('users.store');
        Route::get('/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'show'])->name('users.show');
        Route::put('/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('users.destroy');
        Route::put('/users/{user}/role', [\App\Http\Controllers\Admin\UserController::class, 'updateRole'])->name('users.role');
        Route::get('/quota', [\App\Http\Controllers\Admin\DashboardController::class, 'quota'])->name('quota');
        Route::get('/activity-log', [\App\Http\Controllers\Admin\ActivityLogController::class, 'index'])->name('activity-log');
        Route::get('/tenants/{tenant}/api-key', [\App\Http\Controllers\Admin\TenantController::class, 'editApiKey'])->name('tenants.api-key');
        Route::put('/tenants/{tenant}/api-key', [\App\Http\Controllers\Admin\TenantController::class, 'updateApiKey'])->name('tenants.api-key.update');
        Route::get('/widget-demo', [\App\Http\Controllers\Admin\DashboardController::class, 'widgetDemo'])->name('widget-demo');
        Route::get('/webhooks', [\App\Http\Controllers\Admin\WebhookController::class, 'index'])->name('webhooks.index');
        Route::post('/webhooks', [\App\Http\Controllers\Admin\WebhookController::class, 'store'])->name('webhooks.store');
        Route::put('/webhooks/{webhook}', [\App\Http\Controllers\Admin\WebhookController::class, 'update'])->name('webhooks.update');
        Route::delete('/webhooks/{webhook}', [\App\Http\Controllers\Admin\WebhookController::class, 'destroy'])->name('webhooks.destroy');
        Route::get('/cache', [\App\Http\Controllers\Admin\CacheController::class, 'index'])->name('cache');
        Route::post('/cache/clear', [\App\Http\Controllers\Admin\CacheController::class, 'clear'])->name('cache.clear');

        Route::get('/categories', [\App\Http\Controllers\Admin\CategoryController::class, 'index'])->name('categories.index');
        Route::post('/categories', [\App\Http\Controllers\Admin\CategoryController::class, 'store'])->name('categories.store');
        Route::put('/categories/{productCategory}', [\App\Http\Controllers\Admin\CategoryController::class, 'update'])->name('categories.update');
        Route::delete('/categories/{productCategory}', [\App\Http\Controllers\Admin\CategoryController::class, 'destroy'])->name('categories.destroy');
        Route::get('/products', [\App\Http\Controllers\Admin\ProductController::class, 'index'])->name('products.index');
        Route::post('/products', [\App\Http\Controllers\Admin\ProductController::class, 'store'])->name('products.store');
        Route::put('/products/{product}', [\App\Http\Controllers\Admin\ProductController::class, 'update'])->name('products.update');
        Route::delete('/products/{product}', [\App\Http\Controllers\Admin\ProductController::class, 'destroy'])->name('products.destroy');
        Route::get('/swatches', [\App\Http\Controllers\Admin\SwatchController::class, 'index'])->name('swatches.index');
        Route::post('/swatches', [\App\Http\Controllers\Admin\SwatchController::class, 'store'])->name('swatches.store');
        Route::put('/swatches/{swatch}', [\App\Http\Controllers\Admin\SwatchController::class, 'update'])->name('swatches.update');
        Route::delete('/swatches/{swatch}', [\App\Http\Controllers\Admin\SwatchController::class, 'destroy'])->name('swatches.destroy');
        Route::post('/swatches/reorder', [\App\Http\Controllers\Admin\SwatchController::class, 'reorder'])->name('swatches.reorder');
        Route::get('/swatches/load-more', [\App\Http\Controllers\Admin\SwatchController::class, 'loadMore'])->name('swatches.load-more');
    });

    require __DIR__ . '/auth.php';
});
