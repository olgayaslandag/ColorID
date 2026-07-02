<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\Submission;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ImageGeneratedNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Submission $submission
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
        $locale = app()->getLocale();
        $url = url("/{$locale}/admin/submissions/{$this->submission->uuid}");

        return (new MailMessage)
            ->subject('Your image generation is complete!')
            ->greeting('Hello, '.($this->submission->name ?? 'there').'!')
            ->line('Your image has been successfully generated.')
            ->line('Prompt: '.$this->submission->prompt)
            ->line('You can view your generated image by visiting your dashboard.')
            ->action('View Submission', $url)
            ->line('Thank you for using our service!');
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
            'status' => $this->submission->status,
            'message' => 'Image generation completed successfully.',
            'generated_at' => now()->toIso8601String(),
        ];
    }
}
