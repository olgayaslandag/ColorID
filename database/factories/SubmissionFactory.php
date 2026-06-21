<?php

namespace Database\Factories;

use App\Models\Submission;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Submission>
 */
class SubmissionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $prompts = [
            'A vibrant sunset over a calm ocean with purple and orange hues',
            'Modern minimalist living room with neutral earth tones and a pop of teal',
            'Bold geometric pattern combining deep navy, coral, and gold accents',
            'Spring garden palette inspired by blooming tulips and fresh greenery',
            'Urban industrial color scheme with concrete grey, rust orange, and steel blue',
            'Tropical paradise with turquoise water, white sand, and lush palm trees',
            'Retro 70s inspired palette with avocado green, mustard yellow, and burnt orange',
            'Luxurious wedding theme with champagne gold, blush pink, and ivory white',
            'Nordic winter landscape with icy blues, crisp whites, and charcoal greys',
            'Bohemian textile pattern featuring rich burgundy, indigo, and terracotta',
        ];

        return [
            'uuid' => fake()->uuid(),
            'tenant_id' => Tenant::factory(),
            'name' => fake()->name(),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->safeEmail(),
            'prompt' => fake()->randomElement($prompts),
            'status' => fake()->randomElement(['pending', 'processing', 'completed', 'failed', 'cancelled']),
        ];
    }

    /**
     * Indicate that the submission is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    /**
     * Indicate that the submission is processing.
     */
    public function processing(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'processing',
        ]);
    }

    /**
     * Indicate that the submission is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
        ]);
    }

    /**
     * Indicate that the submission has failed.
     */
    public function failed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'failed',
        ]);
    }

    /**
     * Indicate that the submission is cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
        ]);
    }

    /**
     * Assign submission to a specific tenant.
     */
    public function forTenant(Tenant $tenant): static
    {
        return $this->state(fn (array $attributes) => [
            'tenant_id' => $tenant->id,
        ]);
    }
}
