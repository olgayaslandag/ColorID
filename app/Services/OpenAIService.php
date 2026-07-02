<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\ImageGenerationException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class OpenAIService
{
    private const DEFAULT_MODEL = 'dall-e-2';
    private const DEFAULT_SIZE = '1024x1024';
    private const DEFAULT_QUALITY = 'standard';
    private const GENERATIONS_ENDPOINT = 'https://api.openai.com/v1/images/generations';
    private const EDITS_ENDPOINT = 'https://api.openai.com/v1/images/edits';
    private const VISION_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
    private const VISION_MODEL = 'gpt-4o-mini';

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
        $mime = (new \finfo(FILEINFO_MIME_TYPE))->buffer($imageData) ?: 'image/jpeg';
        $base64 = base64_encode($imageData);

        $response = $this->client($apiKey)->post(
            self::VISION_ENDPOINT,
            [
                'model' => self::VISION_MODEL,
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => [
                            [
                                'type' => 'text',
                                'text' => 'Analyze this room photo in detail. Identify all paintable surfaces: walls (color, material, texture), ceiling, floor, woodwork, doors, windows, furniture. Describe: exact wall colors/materials, furniture type and placement, flooring material and color, ceiling finish, lighting (natural/artificial, direction, warmth), window placement and size, decor items, room shape. Be highly specific about colors, textures, and spatial layout so another AI can recreate this exact scene.',
                            ],
                            [
                                'type' => 'image_url',
                                'image_url' => [
                                    'url' => 'data:' . $mime . ';base64,' . $base64,
                                ],
                            ],
                        ],
                    ],
                ],
                'max_tokens' => 1000,
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

        return trim($data['choices'][0]['message']['content'] ?? '');
    }

    public function editImage(
        string $originalImagePath,
        string $prompt,
        ?string $tenantId = null,
    ): string {
        $tenantId = $tenantId ?? $this->tenantManager->getTenantId();

        if ($tenantId === null) {
            throw new ImageGenerationException(
                'No tenant context available for image editing.',
                provider: 'openai',
                context: ['original_image' => $originalImagePath],
            );
        }

        try {
            $apiKey = $this->resolveApiKey($tenantId);
            $disk = $this->imageStorage->getDisk();
            $storage = Storage::disk($disk);

            if (!$storage->exists($originalImagePath)) {
                throw new ImageGenerationException(
                    'Original image not found for editing.',
                    provider: 'openai',
                );
            }

            $pngData = $this->convertToPng($storage->get($originalImagePath));

            $size = config('services.openai.size', self::DEFAULT_SIZE);

            $response = Http::withToken($apiKey)
                ->timeout(180)
                ->attach('image', $pngData, 'image.png', ['Content-Type' => 'image/png'])
                ->attach('prompt', $prompt)
                ->attach('n', '1')
                ->attach('size', $size)
                ->attach('model', config('services.openai.model', self::DEFAULT_MODEL))
                ->post(self::EDITS_ENDPOINT);

            if ($response->failed()) {
                $error = $response->json();
                throw new ImageGenerationException(
                    message: 'OpenAI edit API error: ' . ($error['error']['message'] ?? $response->body()),
                    provider: 'openai',
                    context: ['original_image' => $originalImagePath, 'response' => $error],
                );
            }

            $data = $response->json();
            $imageData = $this->extractImageData($data);

            return $this->storeGeneratedImage($imageData, $tenantId);
        } catch (ImageGenerationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            throw new ImageGenerationException(
                message: "Image editing failed: {$e->getMessage()}",
                code: (int) $e->getCode(),
                previous: $e,
                provider: 'openai',
                context: [
                    'original_image' => $originalImagePath,
                    'tenant_id' => $tenantId,
                ],
            );
        }
    }

    public function generateImage(
        string $prompt,
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
            $payload = $this->buildPayload($prompt);

            $response = $this->client($apiKey)->post(
                config('services.openai.endpoint', self::GENERATIONS_ENDPOINT),
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

    private function convertToPng(string $imageData): string
    {
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->buffer($imageData);

        if ($mime === 'image/png') {
            return $imageData;
        }

        $gdImage = match ($mime) {
            'image/jpeg', 'image/jpg' => @imagecreatefromstring($imageData),
            'image/webp' => @imagecreatefromwebp($imageData),
            'image/gif' => @imagecreatefromgif($imageData),
            'image/bmp' => @imagecreatefrombmp($imageData),
            default => throw new ImageGenerationException(
                "Unsupported image format for editing: {$mime}",
                provider: 'openai',
            ),
        };

        if ($gdImage === false) {
            throw new ImageGenerationException(
                'Failed to decode image for PNG conversion.',
                provider: 'openai',
            );
        }

        ob_start();
        $result = imagepng($gdImage, null, 9);
        $pngData = ob_get_clean();
        imagedestroy($gdImage);

        if ($result === false || $pngData === false || $pngData === '') {
            throw new ImageGenerationException(
                'Failed to convert image to PNG format.',
                provider: 'openai',
            );
        }

        return $pngData;
    }

    private function client(string $apiKey): PendingRequest
    {
        return Http::withToken($apiKey)
            ->asJson()
            ->acceptJson()
            ->timeout(180);
    }

    private function buildPayload(string $prompt): array
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
                $response = Http::withOptions(['verify' => true])->timeout(30)->get($item['url']);
                if ($response->successful()) {
                    return $response->body();
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
