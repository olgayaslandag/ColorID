<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Spatie\Permission\Models\Role;

it('dashboard is accessible when authenticated', function () {
    $role = Role::create(['name' => 'admin']);
    $user = User::factory()->create();
    $user->assignRole('admin');

    $response = $this->actingAs($user)->get(route('admin.dashboard', ['locale' => 'en']));

    $response->assertOk();
});