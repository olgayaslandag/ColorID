<?php

declare(strict_types=1);

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSubmissionRequest extends FormRequest
{
    public const SURFACES = [
        'ic_duvar', 'dis_duvar', 'tavan', 'ic_zemin', 'dis_zemin',
        'ahsap_kapi', 'metal_kapi', 'pvc_pencere', 'ahsap_pencere',
        'mutfak_tezgahi', 'masa', 'sandalye_koltuk',
        'dolap_ic', 'dolap_dis', 'mobilya_ahsap', 'mobilya_metal',
        'korkuluk_parmaklik', 'demir_kapi', 'kepenk', 'bahce_citi',
        'sera_camli_yuzey', 'radyator_petek', 'boru_tesisat',
        'garaj_zemini', 'havuz_kenari', 'teras_balkon', 'cati',
        'sundurma', 'ahsap_deck', 'seramik_fayans', 'sivali_yuzey',
        'alcipan', 'kartonpiyer', 'kalorifer_boregi',
        'neme_maruz_yuzey_banyo', 'islak_hacim_mutfak',
        'yangin_kapisi', 'tabela_levha', 'endustriyel_makine',
        'arac_romork', 'gemi_tekne', 'her_yer_stella_cok_amagli',
    ];

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'email' => ['nullable', 'email'],
            'city' => ['required', 'string', 'max:100'],
            'surface' => ['required', 'string', Rule::in(self::SURFACES)],
            'palette_id' => ['required', 'integer', 'exists:palettes,id'],
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
            'surface.in' => 'Invalid surface type selected.',
            'palette_id.exists' => 'Selected palette does not exist.',
        ];
    }
}
