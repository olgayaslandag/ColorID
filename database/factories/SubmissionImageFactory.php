<?php

namespace Database\Factories;

use App\Models\Submission;
use App\Models\SubmissionImage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SubmissionImage>
 */
class SubmissionImageFactory extends Factory
{
    protected $model = SubmissionImage::class;

    public function definition(): array
    {
        return [
            'submission_id' => Submission::factory(),
            'original_image' => 'uploads/originals/' . fake()->uuid() . '.jpg',
            'generated_image' => null,
        ];
    }

    public function withGeneratedImage(): static
    {
        return $this->state(fn () => [
            'generated_image' => 'uploads/generated/' . fake()->uuid() . '.jpg',
        ]);
    }
}