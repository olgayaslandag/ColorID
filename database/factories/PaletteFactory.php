<?php

namespace Database\Factories;

use App\Models\Palette;
use App\Models\PaletteGroup;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Palette>
 */
class PaletteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $colorNames = [
            'Sunset Orange',
            'Ocean Blue',
            'Forest Green',
            'Royal Purple',
            'Crimson Red',
            'Golden Yellow',
            'Silver Grey',
            'Burgundy Wine',
            'Teal Dream',
            'Coral Reef',
            'Midnight Black',
            'Pearl White',
            'Lavender Mist',
            'Mint Fresh',
            'Blush Pink',
            'Champagne Gold',
            'Terracotta Clay',
            'Slate Stone',
            'Indigo Night',
            'Amber Glow',
        ];

        return [
            'palette_group_id' => PaletteGroup::factory(),
            'title' => fake()->randomElement($colorNames),
            'color_code' => fake()->hexColor(),
            'image' => fake()->boolean(60)
                ? 'palettes/' . fake()->uuid() . '.png'
                : null,
        ];
    }

    /**
     * Attach the palette to a specific palette group.
     */
    public function forPaletteGroup(PaletteGroup $paletteGroup): static
    {
        return $this->state(fn (array $attributes) => [
            'palette_group_id' => $paletteGroup->id,
        ]);
    }

    /**
     * Set a specific color code.
     */
    public function withColor(string $colorCode): static
    {
        return $this->state(fn (array $attributes) => [
            'color_code' => $colorCode,
        ]);
    }

    /**
     * Indicate that the palette has no image.
     */
    public function withoutImage(): static
    {
        return $this->state(fn (array $attributes) => [
            'image' => null,
        ]);
    }
}
