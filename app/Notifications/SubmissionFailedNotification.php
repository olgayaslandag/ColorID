<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\Submission;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SubmissionFailedNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Submission $submission,
        public string $errorMessage = 'An unexpected error occurred.',
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Image generation failed')
            ->greeting('Hello, '.($this->submission->name ?? 'there').'!')
            ->line('We regret to inform you that your image generation could not be completed.')
            ->line('Prompt: '.$this->submission->prompt)
            ->line('Error: '.$this->errorMessage)
            ->line('Please try again or contact support if the issue persists.')
            ->action('Retry', url('/'.app()->getLocale().'/admin/submissions/'.$this->submission->uuid))
            ->line('We apologise for the inconvenience.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'submission_id' => $this->submission->id,
            'submission_uuid' => $this->submission->uuid,
            'prompt' => $this->submission->prompt,
            'status' => 'failed',
            'error' => $this->errorMessage,
            'message' => 'Image generation failed.',
            'failed_at' => now()->toIso8601String(),
        ];
    }
}
