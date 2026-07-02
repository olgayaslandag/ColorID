<?php

namespace Database\Factories;

use App\Models\Swatch;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class SwatchFactory extends Factory
{
    protected $model = Swatch::class;

    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'name' => fake()->word(),
            'type' => fake()->randomElement(['hex', 'image']),
            'value' => fn (array $attributes) => $attributes['type'] === 'hex'
                ? fake()->hexColor()
                : 'swatches/' . fake()->uuid() . '.png',
        ];
    }

    public function hexType(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'hex',
            'value' => fake()->hexColor(),
        ]);
    }

    public function imageType(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'image',
            'value' => 'swatches/' . fake()->uuid() . '.png',
        ]);
    }

    public function forProduct(Product $product): static
    {
        return $this->state(fn (array $attributes) => [
            'product_id' => $product->id,
        ]);
    }
}
