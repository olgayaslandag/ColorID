<?php

namespace Database\Factories;

use App\Models\Media;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class MediaFactory extends Factory
{
    protected $model = Media::class;

    public function definition(): array
    {
        return [
            'id' => (string) Str::uuid(),
            'disk' => 'public',
            'path' => 'uploads/media/' . fake()->uuid() . '.png',
            'original_name' => fake()->word() . '.png',
            'mime_type' => 'image/png',
            'size' => fake()->numberBetween(1000, 5000000),
        ];
    }
}
