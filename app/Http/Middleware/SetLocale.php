<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * Detects the locale from the first URL segment, session, or browser
     * preferences and sets it for the current request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->segment(1);

        $availableLocales = array_keys(config('app.available_locales', ['en' => 'English']));

        if (in_array($locale, $availableLocales)) {
            app()->setLocale($locale);
            session()->put('locale', $locale);
        } elseif (session()->has('locale')) {
            app()->setLocale(session()->get('locale'));
        } else {
            $locale = $request->getPreferredLanguage($availableLocales) ?? config('app.fallback_locale', 'en');
            app()->setLocale($locale);
        }

        URL::defaults(['locale' => app()->getLocale()]);

        // Remove the locale route parameter so it doesn't interfere with
        // controller argument resolution (route model binding depends on
        // positional parameter order via array_values in ControllerDispatcher).
        if ($route = $request->route()) {
            $route->forgetParameter('locale');
        }

        return $next($request);
    }
}
