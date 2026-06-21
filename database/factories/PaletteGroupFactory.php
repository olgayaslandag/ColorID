<?php

namespace Database\Factories;

use App\Models\PaletteGroup;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PaletteGroup>
 */
class PaletteGroupFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $titles = [
            'Seasonal Collection',
            'Nature Inspired',
            'Modern Minimalist',
            'Bold & Vibrant',
            'Pastel Dreams',
            'Earth Tones',
            'Ocean Depths',
            'Sunset Vibes',
            'Urban Chic',
            'Vintage Classics',
            'Tropical Escape',
            'Winter Wonderland',
            'Autumn Harvest',
            'Spring Blossom',
            'Neon Nights',
        ];

        return [
            'tenant_id' => Tenant::factory(),
            'title' => fake()->randomElement($titles),
        ];
    }

    /**
     * Assign the palette group to a specific tenant.
     */
    public function forTenant(Tenant $tenant): static
    {
        return $this->state(fn (array $attributes) => [
            'tenant_id' => $tenant->id,
        ]);
    }

    /**
     * Set a specific title.
     */
    public function withTitle(string $title): static
    {
        return $this->state(fn (array $attributes) => [
            'title' => $title,
        ]);
    }
}
