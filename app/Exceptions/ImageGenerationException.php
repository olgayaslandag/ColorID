<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;
use Illuminate\Http\Request;

class ImageGenerationException extends Exception
{
    /**
     * Create a new image generation exception.
     */
    public function __construct(
        string $message = 'Image generation failed.',
        int $code = 0,
        ?\Throwable $previous = null,
        protected ?string $provider = null,
        protected ?array $context = [],
    ) {
        parent::__construct($message, $code, $previous);
    }

    /**
     * Get the provider that failed.
     */
    public function getProvider(): ?string
    {
        return $this->provider;
    }

    /**
     * Get the context data associated with the failure.
     */
    public function getContext(): array
    {
        return $this->context ?? [];
    }

    /**
     * Report the exception with additional context.
     */
    public function report(): void
    {
        logger()->error('ImageGenerationException', [
            'message' => $this->getMessage(),
            'provider' => $this->provider,
            'context' => $this->context,
        ]);
    }

    /**
     * Render the exception as an HTTP response.
     */
    public function render(Request $request): \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
    {
        if ($request->expectsJson()) {
            return response()->json([
                'error' => 'Image generation failed.',
                'message' => $this->getMessage(),
            ], 500);
        }

        return redirect()->back()->with('error', 'Image generation failed: ' . $this->getMessage());
    }
}
