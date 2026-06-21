<?php

declare(strict_types=1);

namespace App\Notifications\Channels;

use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class SmsChannel
{
    /**
     * Send the given notification via SMS.
     *
     * Skeleton implementation — will be fully integrated with an SMS provider
     * (e.g. Twilio, Vonage) in V2. Currently logs the notification metadata
     * for development visibility.
     */
    public function send(object $notifiable, Notification $notification): void
    {
        // V2: Replace with actual SMS provider integration.
        // V2: Implement $notification->toSms($notifiable) on each notification.
        Log::info('SMS notification would be sent', [
            'notification' => get_class($notification),
            'recipient' => method_exists($notifiable, 'routeNotificationForSms')
                ? $notifiable->routeNotificationForSms()
                : ($notifiable->phone ?? 'unknown'),
        ]);
    }
}
