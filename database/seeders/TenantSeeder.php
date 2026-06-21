<?php

namespace Database\Seeders;

use App\Models\Tenant;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TenantSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (Tenant::where('domain', 'creativestudio.example.com')->doesntExist()) {
            Tenant::create([
                'name' => 'Creative Studio',
                'domain' => 'creativestudio.example.com',
                'logo' => 'logos/creative-studio.png',
                'primary_color' => '#6366F1',
                'secondary_color' => '#EC4899',
                'status' => true,
                'monthly_limit' => 500,
            ]);
        }

        if (Tenant::where('domain', 'designhub.example.com')->doesntExist()) {
            Tenant::create([
                'name' => 'Design Hub Agency',
                'domain' => 'designhub.example.com',
                'logo' => 'logos/design-hub.png',
                'primary_color' => '#10B981',
                'secondary_color' => '#F59E0B',
                'status' => true,
                'monthly_limit' => 1000,
            ]);
        }

        if (Tenant::where('domain', 'artisanworks.example.com')->doesntExist()) {
            Tenant::create([
                'name' => 'Artisan Works',
                'domain' => 'artisanworks.example.com',
                'logo' => 'logos/artisan-works.png',
                'primary_color' => '#8B5CF6',
                'secondary_color' => '#F97316',
                'status' => false,
                'monthly_limit' => 250,
            ]);
        }
    }
}
