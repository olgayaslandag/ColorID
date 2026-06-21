<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create default admin user (skip if already exists)
        User::firstOrCreate(
            ['email' => 'admin@colorid.io'],
            [
                'name' => 'Admin User',
                'email' => 'olgayaslandag@gmail.com',
                'password' => Hash::make('123123123'),
                'email_verified_at' => now(),
            ]
        );

        // Create default tenant (skip if already exists)
        Tenant::firstOrCreate(
            ['domain' => 'default.colorid.io'],
            [
                'name' => 'Default Tenant',
                'domain' => 'default.colorid.io',
                'logo' => null,
                'primary_color' => '#4F46E5',
                'secondary_color' => '#F43F5E',
                'status' => true,
                'monthly_limit' => 100,
            ]
        );

        // Run additional seeders
        $this->call([
            TenantSeeder::class,
            PaletteSeeder::class,
        ]);
    }
}
