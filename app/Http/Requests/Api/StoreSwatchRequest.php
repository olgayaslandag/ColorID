<?php

declare(strict_types=1);

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class StoreSwatchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', 'exists:product_categories,id'],
            'tenant_id' => ['nullable', 'integer', 'exists:tenants,id'],
            'product_id' => ['nullable', 'integer', 'exists:products,id'],
        ];
    }
}
