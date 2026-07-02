<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreTenantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'domain' => 'required|string|max:255|unique:tenants,domain',
            'monthly_limit' => 'nullable|integer|min:0',
            'primary_color' => 'nullable|string|max:7',
            'secondary_color' => 'nullable|string|max:7',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Kiracı adı zorunludur.',
            'domain.required' => 'Domain adı zorunludur.',
            'domain.unique' => 'Bu domain zaten kullanılıyor.',
            'monthly_limit.integer' => 'Aylık limit sayı olmalıdır.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'status' => true,
            'monthly_limit' => $this->input('monthly_limit', 100),
        ]);
    }
}
