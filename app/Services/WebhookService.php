<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Submission;
use App\Models\Webhook;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WebhookService
{
    public function dispatch(Submission $submission, string $event): void
    {
        $webhooks = Webhook::query()
            ->where('tenant_id', $submission->tenant_id)
            ->where('is_active', true)
            ->whereJsonContains('events', $event)
            ->get();

        $payload = $this->buildPayload($submission, $event);

        foreach ($webhooks as $webhook) {
            try {
                $response = Http::timeout(10)
                    ->withHeaders([
                        'Content-Type' => 'application/json',
                        'X-Webhook-Signature' => $this->generateSignature($payload, $webhook->secret),
                        'X-Webhook-Event' => $event,
                    ])
                    ->post($webhook->url, $payload);

                if ($response->failed()) {
                    Log::warning('Webhook delivery failed', [
                        'webhook_id' => $webhook->id,
                        'submission_uuid' => $submission->uuid,
                        'status' => $response->status(),
                    ]);
                }
            } catch (\Throwable $e) {
                Log::error('Webhook delivery error', [
                    'webhook_id' => $webhook->id,
                    'submission_uuid' => $submission->uuid,
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }

    private function buildPayload(Submission $submission, string $event): array
    {
        return [
            'event' => $event,
            'submission' => [
                'uuid' => $submission->uuid,
                'status' => $submission->status,
                'name' => $submission->name,
                'email' => $submission->email,
                'prompt' => $submission->prompt,
                'created_at' => $submission->created_at?->toISOString(),
                'updated_at' => $submission->updated_at?->toISOString(),
            ],
            'timestamp' => now()->toISOString(),
        ];
    }

    private function generateSignature(array $payload, ?string $secret): string
    {
        if (empty($secret)) {
            return '';
        }

        return hash_hmac('sha256', json_encode($payload), $secret);
    }
}
