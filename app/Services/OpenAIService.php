<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\ImageGenerationException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class OpenAIService
{
    private const DEFAULT_MODEL = 'gpt-image-2';
    private const DEFAULT_SIZE = '1024x1024';
    private const DEFAULT_QUALITY = 'medium';
    private const DEFAULT_ENDPOINT = 'https://api.openai.com/v1/images/generations';
    private const VISION_ENDPOINT = 'https://api.openai.com/v1/responses';
    private const VISION_MODEL = 'gpt-5-mini';

    public function __construct(
        protected TenantManager $tenantManager,
        protected ImageStorageManager $imageStorage,
    ) {}

    public function describeImage(
        string $imagePath,
        ?string $tenantId = null,
    ): string {
        $tenantId = $tenantId ?? $this->tenantManager->getTenantId();

        $apiKey = $this->resolveApiKey($tenantId);
        $disk = $this->imageStorage->getDisk();
        $storage = Storage::disk($disk);

        if (! $storage->exists($imagePath)) {
            throw new ImageGenerationException(
                'Reference image not found for analysis.',
                provider: 'openai',
            );
        }

        $imageData = $storage->get($imagePath);
        $mime = $storage->mimeType($imagePath) ?? 'image/jpeg';
        $base64 = base64_encode($imageData);

        $response = $this->client($apiKey)->post(
            self::VISION_ENDPOINT,
            [
                'model' => self::VISION_MODEL,
                'input' => [
                    [
                        'role' => 'user',
                        'content' => [
                            [
                                'type' => 'input_image',
                                'image_url' => 'data:' . $mime . ';base64,' . $base64,
                            ],
                            [
                                'type' => 'input_text',
                                'text' => 'Describe this room in detail for image generation. Include: wall colors/materials, furniture type and placement, flooring, ceiling, lighting (natural/artificial, direction, warmth), window placement and size, decor items, room shape and size impression. Be specific about colors, materials, and spatial layout.',
                            ],
                        ],
                    ],
                ],
            ]
        );

        if ($response->failed()) {
            $error = $response->json();
            throw new ImageGenerationException(
                message: 'Vision API error: ' . ($error['error']['message'] ?? $response->body()),
                provider: 'openai',
                context: ['image_path' => $imagePath, 'response' => $error],
            );
        }

        $data = $response->json();
        $output = $data['output'] ?? [];

        foreach ($output as $item) {
            if (($item['type'] ?? '') === 'message') {
                $content = $item['content'] ?? [];
                foreach ($content as $part) {
                    if (($part['type'] ?? '') === 'output_text') {
                        return trim($part['text']);
                    }
                }
            }
        }

        throw new ImageGenerationException(
            'Vision API response does not contain expected text output.',
            provider: 'openai',
        );
    }

    public function generateImage(
        string $prompt,
        ?string $referenceImagePath = null,
        ?string $tenantId = null,
    ): string {
        $tenantId = $tenantId ?? $this->tenantManager->getTenantId();

        if ($tenantId === null) {
            throw new ImageGenerationException(
                'No tenant context available for image generation.',
                provider: 'openai',
                context: ['prompt' => $prompt],
            );
        }

        try {
            $apiKey = $this->resolveApiKey($tenantId);
            $payload = $this->buildPayload($prompt, $referenceImagePath);

            $response = $this->client($apiKey)->post(
                config('services.openai.endpoint', self::DEFAULT_ENDPOINT),
                $payload,
            );

            if ($response->failed()) {
                $error = $response->json();
                throw new ImageGenerationException(
                    message: 'OpenAI API error: ' . ($error['error']['message'] ?? $response->body()),
                    provider: 'openai',
                    context: ['prompt' => $prompt, 'response' => $error],
                );
            }

            $data = $response->json();
            $imageData = $this->extractImageData($data);

            return $this->storeGeneratedImage($imageData, $tenantId);
        } catch (ImageGenerationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            throw new ImageGenerationException(
                message: "Image generation failed: {$e->getMessage()}",
                code: (int) $e->getCode(),
                previous: $e,
                provider: 'openai',
                context: [
                    'prompt' => $prompt,
                    'tenant_id' => $tenantId,
                ],
            );
        }
    }

    private function client(string $apiKey): PendingRequest
    {
        return Http::withToken($apiKey)
            ->asJson()
            ->acceptJson()
            ->timeout(180);
    }

    private function buildPayload(string $prompt, ?string $referenceImagePath = null): array
    {
        $payload = [
            'model' => config('services.openai.model', self::DEFAULT_MODEL),
            'prompt' => $prompt,
            'n' => 1,
            'size' => config('services.openai.size', self::DEFAULT_SIZE),
            'quality' => config('services.openai.quality', self::DEFAULT_QUALITY),
        ];

        return $payload;
    }

    private function extractImageData(array $response): string
    {
        $data = $response['data'] ?? [];

        foreach ($data as $item) {
            if (isset($item['b64_json'])) {
                $binaryData = base64_decode($item['b64_json'], true);
                if ($binaryData !== false) {
                    return $binaryData;
                }
            }

            if (isset($item['url'])) {
                $binaryData = @file_get_contents($item['url']);
                if ($binaryData !== false) {
                    return $binaryData;
                }
            }
        }

        throw new ImageGenerationException(
            'Image generation response does not contain expected image data.',
            provider: 'openai',
            context: ['response_keys' => array_keys($response)],
        );
    }

    private function storeGeneratedImage(string $imageData, string $tenantId): string
    {
        $disk = $this->imageStorage->getDisk();
        $storage = Storage::disk($disk);

        $filename = 'generated_' . $tenantId . '_' . time() . '_' . bin2hex(random_bytes(8)) . '.png';

        $tempPath = 'temp/' . $filename;
        $storage->put($tempPath, $imageData);

        if (! $storage->exists($tempPath)) {
            throw new RuntimeException('Failed to save generated image to temporary path.');
        }

        try {
            return $this->imageStorage->storeGenerated($tempPath, (string) $tenantId);
        } catch (\Throwable $e) {
            $storage->delete($tempPath);
            throw $e;
        }
    }

    private function resolveApiKey(?string $tenantId = null): string
    {
        if ($tenantId !== null) {
            $tenantSetting = \App\Models\TenantSetting::query()
                ->where('tenant_id', $tenantId)
                ->where('key', 'openai_api_key')
                ->first();

            if ($tenantSetting !== null && ! empty($tenantSetting->value)) {
                return $tenantSetting->value;
            }
        }

        $apiKey = config('services.openai.api_key');

        if (empty($apiKey)) {
            throw new ImageGenerationException(
                'OpenAI API key is not configured. Set OPENAI_API_KEY in .env or configure it in tenant settings.',
                provider: 'openai',
            );
        }

        return $apiKey;
    }
}
