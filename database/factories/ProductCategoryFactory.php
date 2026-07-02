<?php

namespace Database\Factories;

use App\Models\ProductCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductCategoryFactory extends Factory
{
    protected $model = ProductCategory::class;

    public function definition(): array
    {
        $categories = [
            'T-Shirts',
            'Hoodies',
            'Pants',
            'Jackets',
            'Dresses',
            'Shorts',
            'Sweaters',
            'Socks',
            'Hats',
            'Bags',
            'Scarves',
            'Polo Shirts',
            'Tank Tops',
            'Leggings',
            'Skirts',
            'Suits',
            'Activewear',
            'Sleepwear',
            'Swimwear',
            'Undergarments',
        ];

        return [
            'name' => fake()->randomElement($categories),
        ];
    }
}
