<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaletteGroup;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaletteController extends Controller
{
    /**
     * Display all palette groups with their palettes.
     */
    public function index(Request $request): Response
    {
        $paletteGroups = PaletteGroup::query()
            ->with(['palettes' => function ($query): void {
                $query->orderBy('title');
            }])
            ->orderBy('title')
            ->get()
            ->map(fn (PaletteGroup $group) => [
                'id' => $group->id,
                'tenant_id' => $group->tenant_id,
                'title' => $group->title,
                'created_at' => $group->created_at?->toISOString(),
                'palettes' => $group->palettes->map(fn ($palette) => [
                    'id' => $palette->id,
                    'palette_group_id' => $palette->palette_group_id,
                    'title' => $palette->title,
                    'color_code' => $palette->color_code,
                    'image' => $palette->image,
                    'created_at' => $palette->created_at?->toISOString(),
                ]),
            ]);

        return Inertia::render('Palettes/Index', [
            'paletteGroups' => $paletteGroups,
        ]);
    }
}
