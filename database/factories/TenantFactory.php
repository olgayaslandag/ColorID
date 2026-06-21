<?php

namespace Database\Factories;

use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Tenant>
 */
class TenantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->company();

        return [
            'name' => $name,
            'domain' => Str::slug($name) . '.' . fake()->domainName(),
            'logo' => 'logos/' . fake()->uuid() . '.png',
            'primary_color' => fake()->hexColor(),
            'secondary_color' => fake()->hexColor(),
            'status' => fake()->boolean(90),
            'monthly_limit' => fake()->randomElement([50, 100, 250, 500, 1000, 2500, 5000, 10000]),
        ];
    }

    /**
     * Indicate that the tenant is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => true,
        ]);
    }

    /**
     * Indicate that the tenant is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => false,
        ]);
    }

    /**
     * Set a specific monthly limit.
     */
    public function withMonthlyLimit(int $limit): static
    {
        return $this->state(fn (array $attributes) => [
            'monthly_limit' => $limit,
        ]);
    }
}
