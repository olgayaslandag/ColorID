<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $permissions = [
            'view-tenants',
            'create-tenants',
            'edit-tenants',
            'delete-tenants',
            'view-submissions',
            'delete-submissions',
            'manage-users',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->syncPermissions($permissions);

        $adminUsers = [
            [
                'email' => 'olgayaslandag@gmail.com',
                'phone' => '+90 555 123 4567',
                'city'  => 'İstanbul',
            ],
            [
                'email' => 'admin@colorid.io',
                'phone' => '+90 555 987 6543',
                'city'  => 'Ankara',
            ],
        ];

        foreach ($adminUsers as $data) {
            $user = \App\Models\User::where('email', $data['email'])->first();

            if ($user) {
                $user->assignRole('admin');
                $user->update([
                    'phone' => $data['phone'],
                    'city'  => $data['city'],
                ]);
            }
        }
    }
}
