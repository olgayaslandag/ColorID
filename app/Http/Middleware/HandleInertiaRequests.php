<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        $manifest = public_path('build/manifest.json');

        return file_exists($manifest) ? md5_file($manifest) : parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'locale' => app()->getLocale(),
            'availableLocales' => config('app.available_locales', ['en' => 'English']),
            'translations' => $this->getTranslations(app()->getLocale()),
            'isAdmin' => $request->user()?->hasRole('admin') ?? false,
        ];
    }

    private function getTranslations(string $locale): array
    {
        return cache()->remember("translations.{$locale}", 86400, function () use ($locale) {
            // Load only the most commonly used namespace to reduce memory and I/O
            $messagesFile = lang_path($locale) . '/messages.php';

            if (file_exists($messagesFile)) {
                return [
                    'messages' => require $messagesFile,
                ];
            }

            return [];
        });
    }
}
