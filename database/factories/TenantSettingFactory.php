<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TenantSetting>
 */
class TenantSettingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'tenant_id' => \App\Models\Tenant::factory(),
            'key' => $this->faker->word,
            'value' => $this->faker->randomElement([
                'value1',
                'value2',
                $this->faker->sentence,
                $this->faker->paragraph,
            ]),
        ];
    }
}