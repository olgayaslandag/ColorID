<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Carbon\CarbonInterval;
use Closure;
use Illuminate\Cache\RateLimiter;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;

/**
 * Middleware: RateLimitUploads
 *
 * Limits the number of upload requests from a single IP address to prevent
 * abuse and ensure fair resource allocation across tenants/users.
 *
 * Configuration:
 * - Max uploads: 10 per hour per IP address
 * - Uses Laravel's built-in RateLimiter facade (cache-backed)
 * - Returns standard rate limit headers: X-RateLimit-Limit, X-RateLimit-Remaining
 * - Returns 429 Too Many Requests when the limit is exceeded with retry info
 *
 * Security considerations:
 * - Per-IP limiting prevents a single client from saturating upload workers
 * - Compatible with load balancers that preserve client IP (X-Forwarded-For)
 * - Does NOT replace authentication — it's a supplemental protection layer
 *
 * Usage in routes:
 *   Route::middleware(['rate_limit_uploads'])->group(function () {
 *       Route::post('/upload', [UploadController::class, 'store']);
 *   });
 */
class RateLimitUploads
{
    /**
     * Rate limit key prefix used to namespace upload rate limit entries
     * in the cache store, preventing collisions with other rate limiters.
     */
    private const KEY_PREFIX = 'upload_rate_limit:';

    /**
     * Maximum number of upload requests allowed per IP address per hour.
     */
    private const MAX_ATTEMPTS = 10;

    /**
     * Handle an incoming request.
     *
     * Checks the current IP's attempt count against the configured limit.
     * If the limit has been exceeded, a 429 response is returned with the
     * number of seconds the client must wait before retrying.
     *
     * @param  Request  $request  The incoming HTTP request.
     * @param  Closure  $next     The next middleware handler.
     * @return Response           The HTTP response with rate limit headers.
     *
     * @throws TooManyRequestsHttpException When the rate limit is exceeded.
     */
    public function handle(Request $request, Closure $next): Response
    {
        /** @var RateLimiter $limiter */
        $limiter = app(RateLimiter::class);

        $key = self::KEY_PREFIX . ($request->ip() ?? 'unknown');
        $decaySeconds = CarbonInterval::hour()->totalSeconds;

        // Check if the IP has exceeded the allowed number of attempts.
        if ($limiter->tooManyAttempts($key, self::MAX_ATTEMPTS)) {
            $retryAfterSeconds = $limiter->availableIn($key);

            throw new TooManyRequestsHttpException(
                $retryAfterSeconds,
                sprintf(
                    'Too many upload requests from your IP address. Please try again in %d minute(s).',
                    (int) ceil($retryAfterSeconds / 60)
                )
            );
        }

        // Record this attempt with a 1-hour decay window.
        $limiter->hit($key, $decaySeconds);

        // Process the request.
        $response = $next($request);

        // Add standard rate limit headers to the response for client transparency.
        $remaining = $limiter->remaining($key, self::MAX_ATTEMPTS);

        $response->headers->set('X-RateLimit-Limit', (string) self::MAX_ATTEMPTS);
        $response->headers->set('X-RateLimit-Remaining', (string) max(0, $remaining));

        return $response;
    }
}
