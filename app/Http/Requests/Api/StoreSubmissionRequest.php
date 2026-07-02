<?php

declare(strict_types=1);

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class StoreSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => $this->user() ? ['nullable', 'string', 'max:255'] : ['required', 'string', 'max:255'],
            'phone' => $this->user() ? ['nullable', 'string', 'max:20'] : ['required', 'string', 'max:20'],
            'email' => $this->user() ? ['nullable', 'email'] : ['required', 'email'],
            'city' => $this->user() ? ['nullable', 'string', 'max:100'] : ['required', 'string', 'max:100'],
            'category_id' => ['required', 'integer', 'exists:product_categories,id'],
            'swatch_id' => ['required', 'integer', 'exists:swatches,id'],
            'prompt' => ['nullable', 'string', 'max:155'],
            'images' => ['required', 'array', 'max:3'],
            'images.*' => ['image', 'mimes:jpg,png,webp', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'images.max' => 'You may upload up to 3 images.',
            'images.*.max' => 'Each image must not exceed 5MB in size.',
            'images.*.mimes' => 'Images must be in JPG, PNG, or WebP format.',
            'images.*.image' => 'Each file must be a valid image.',
            'category_id.required' => 'Please select a category.',
            'category_id.exists' => 'Selected category does not exist.',
            'swatch_id.required' => 'Please select a swatch.',
            'swatch_id.exists' => 'Selected swatch does not exist.',
        ];
    }
}
