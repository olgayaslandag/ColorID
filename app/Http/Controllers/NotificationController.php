<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user();

        $preferences = $user->notification_preferences ?? [
            'email_submission_completed' => true,
            'email_submission_failed' => true,
            'sms_submission_completed' => false,
            'sms_submission_failed' => false,
        ];

        return Inertia::render('Profile/NotificationPreferences', [
            'preferences' => $preferences,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email_submission_completed' => 'boolean',
            'email_submission_failed' => 'boolean',
            'sms_submission_completed' => 'boolean',
            'sms_submission_failed' => 'boolean',
        ]);

        $request->user()->update([
            'notification_preferences' => $validated,
        ]);

        return back()->with('success', 'Notification preferences updated.');
    }
}
