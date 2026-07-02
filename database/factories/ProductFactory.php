<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $products = [
            'Classic Fit T-Shirt',
            'Slim Fit Polo',
            'Oversized Hoodie',
            'Cargo Pants',
            'Denim Jacket',
            'Summer Dress',
            'Athletic Shorts',
            'Cashmere Sweater',
            'Cotton Socks',
            'Baseball Cap',
            'Canvas Tote Bag',
            'Wool Scarf',
            'Performance Leggings',
            'Linen Shirt',
            'Leather Belt',
            'Rain Jacket',
            'Graphic Tee',
            'Button Down Shirt',
            'Fleece Pullover',
            'Chino Trousers',
        ];

        return [
            'tenant_id' => Tenant::factory(),
            'name' => fake()->randomElement($products),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Product $product) {
            if ($product->categories()->count() === 0) {
                $product->categories()->attach(ProductCategory::factory()->create()->id);
            }
        });
    }

    public function forCategory(ProductCategory $category): static
    {
        return $this->afterCreating(function (Product $product) use ($category) {
            $product->categories()->attach($category->id);
        });
    }
}
