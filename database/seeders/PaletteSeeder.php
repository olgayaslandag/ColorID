<?php

namespace Database\Seeders;

use App\Models\Palette;
use App\Models\PaletteGroup;
use App\Models\Tenant;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaletteSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tenant = Tenant::where('domain', 'creativestudio.example.com')->first();

        if (! $tenant) {
            return;
        }

        // Create sample palette groups only if none exist for this tenant
        if (PaletteGroup::where('tenant_id', $tenant->id)->doesntExist()) {
            $groups = [
                [
                    'title' => 'Nature Inspired',
                    'palettes' => [
                        ['title' => 'Forest Canopy', 'color_code' => '#2D5A27'],
                        ['title' => 'Meadow Green', 'color_code' => '#7CB342'],
                        ['title' => 'Sky Blue', 'color_code' => '#64B5F6'],
                        ['title' => 'Autumn Leaf', 'color_code' => '#E65100'],
                        ['title' => 'River Stone', 'color_code' => '#9E9E9E'],
                    ],
                ],
                [
                    'title' => 'Modern Minimalist',
                    'palettes' => [
                        ['title' => 'Pure White', 'color_code' => '#FFFFFF'],
                        ['title' => 'Charcoal Grey', 'color_code' => '#333333'],
                        ['title' => 'Slate', 'color_code' => '#607D8B'],
                        ['title' => 'Warm Beige', 'color_code' => '#D7CCC8'],
                        ['title' => 'Matte Black', 'color_code' => '#1A1A1A'],
                    ],
                ],
                [
                    'title' => 'Bold & Vibrant',
                    'palettes' => [
                        ['title' => 'Electric Blue', 'color_code' => '#2962FF'],
                        ['title' => 'Neon Pink', 'color_code' => '#FF0080'],
                        ['title' => 'Lime Green', 'color_code' => '#00E676'],
                        ['title' => 'Sunset Orange', 'color_code' => '#FF6D00'],
                        ['title' => 'Deep Purple', 'color_code' => '#7C4DFF'],
                    ],
                ],
                [
                    'title' => 'Pastel Dreams',
                    'palettes' => [
                        ['title' => 'Blush Pink', 'color_code' => '#F8BBD0'],
                        ['title' => 'Lavender', 'color_code' => '#E1BEE7'],
                        ['title' => 'Baby Blue', 'color_code' => '#BBDEFB'],
                        ['title' => 'Mint Green', 'color_code' => '#C8E6C9'],
                        ['title' => 'Peach', 'color_code' => '#FFCCBC'],
                    ],
                ],
            ];

            foreach ($groups as $groupData) {
                $group = PaletteGroup::create([
                    'tenant_id' => $tenant->id,
                    'title' => $groupData['title'],
                ]);

                foreach ($groupData['palettes'] as $paletteData) {
                    Palette::create([
                        'palette_group_id' => $group->id,
                        'title' => $paletteData['title'],
                        'color_code' => $paletteData['color_code'],
                        'image' => null,
                    ]);
                }
            }
        }
    }
}
