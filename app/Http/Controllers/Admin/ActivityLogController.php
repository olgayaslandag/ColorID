<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Activity::query()
            ->with('causer:id,name,email')
            ->latest();

        if ($request->filled('subject_type')) {
            $query->where('subject_type', $request->subject_type);
        }

        if ($request->filled('event')) {
            $query->where('event', $request->event);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhereHas('causer', fn ($c) => $c->where('name', 'like', "%{$search}%"));
            });
        }

        $subjectTypes = Activity::distinct()->pluck('subject_type')
            ->map(fn ($t) => class_basename($t))
            ->unique()
            ->sort()
            ->values();

        $events = Activity::distinct()->pluck('event')->filter()->sort()->values();

        $activities = $query->paginate(30)
            ->through(fn (Activity $activity) => [
                'id' => $activity->id,
                'description' => $activity->description,
                'event' => $activity->event,
                'subject_type' => class_basename($activity->subject_type ?? ''),
                'subject_id' => $activity->subject_id,
                'causer' => $activity->causer ? [
                    'id' => $activity->causer->id,
                    'name' => $activity->causer->name,
                    'email' => $activity->causer->email,
                ] : null,
                'properties' => $activity->properties->toArray(),
                'created_at' => $activity->created_at?->toISOString(),
            ]);

        return Inertia::render('Admin/ActivityLog/Index', [
            'activities' => $activities,
            'subjectTypes' => $subjectTypes,
            'events' => $events,
            'filters' => [
                'subject_type' => $request->subject_type,
                'event' => $request->event,
                'search' => $request->search,
            ],
        ]);
    }
}
