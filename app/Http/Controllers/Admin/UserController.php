<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::query()
            ->with('roles:name');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($role = $request->input('role')) {
            $query->whereHas('roles', fn ($r) => $r->where('name', $role));
        }

        if ($city = $request->input('city')) {
            $query->where('city', 'like', "%{$city}%");
        }

        $users = $query->orderBy('name')
            ->paginate(15)
            ->through(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at?->toISOString(),
                'phone' => $user->phone,
                'city' => $user->city,
                'roles' => $user->roles->pluck('name'),
                'created_at' => $user->created_at?->toISOString(),
            ]);

        $roles = \Spatie\Permission\Models\Role::orderBy('name')->pluck('name');

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'availableRoles' => $roles,
            'filters' => $request->only(['search', 'role', 'city']),
        ]);
    }

    public function show(User $user): Response
    {
        $user->load('roles');

        return Inertia::render('Admin/Users/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at?->toISOString(),
                'roles' => $user->roles->pluck('name'),
                'created_at' => $user->created_at?->toISOString(),
                'updated_at' => $user->updated_at?->toISOString(),
            ],
            'availableRoles' => ['admin'],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'role' => 'required|string|exists:roles,name',
        ], [
            'name.required' => 'İsim alanı zorunludur.',
            'name.string' => 'İsim metin olmalıdır.',
            'name.max' => 'İsim en fazla :max karakter olabilir.',
            'email.required' => 'E-posta alanı zorunludur.',
            'email.email' => 'Geçerli bir e-posta adresi giriniz.',
            'email.max' => 'E-posta en fazla :max karakter olabilir.',
            'email.unique' => 'Bu e-posta adresi zaten kayıtlıdır.',
            'password.required' => 'Şifre alanı zorunludur.',
            'password.min' => 'Şifre en az :min karakter olmalıdır.',
            'password.confirmed' => 'Şifre tekrarı eşleşmiyor.',
            'role.required' => 'Rol alanı zorunludur.',
            'role.string' => 'Rol metin olmalıdır.',
            'role.exists' => 'Seçilen rol geçerli değil.',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
        ]);

        $user->syncRoles([$validated['role']]);

        return redirect()->route('admin.users.index')
            ->with('success', 'Kullanıcı başarıyla oluşturuldu.');
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255|unique:users,email,' . $user->id,
        ], [
            'name.string' => 'İsim metin olmalıdır.',
            'name.max' => 'İsim en fazla :max karakter olabilir.',
            'email.email' => 'Geçerli bir e-posta adresi giriniz.',
            'email.max' => 'E-posta en fazla :max karakter olabilir.',
            'email.unique' => 'Bu e-posta adresi zaten kayıtlıdır.',
        ]);

        $user->update($validated);

        return back()->with('success', 'Kullanıcı başarıyla güncellendi.');
    }

    public function updateRole(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'role' => 'required|string|exists:roles,name',
        ], [
            'role.required' => 'Rol alanı zorunludur.',
            'role.string' => 'Rol metin olmalıdır.',
            'role.exists' => 'Seçilen rol geçerli değil.',
        ]);

        $user->syncRoles([$validated['role']]);

        return back()->with('success', 'Kullanıcı rolü başarıyla güncellendi.');
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->id === request()->user()->id) {
            return back()->with('error', 'Kendi hesabınızı silemezsiniz.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'Kullanıcı başarıyla silindi.');
    }
}
