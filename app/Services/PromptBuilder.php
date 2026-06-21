<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Palette;

class PromptBuilder
{
    private const SURFACE_MAP = [
        'ic_duvar' => 'interior wall',
        'dis_duvar' => 'exterior wall',
        'tavan' => 'ceiling',
        'ic_zemin' => 'interior floor',
        'dis_zemin' => 'exterior floor',
        'ahsap_kapi' => 'wooden door',
        'metal_kapi' => 'metal door',
        'pvc_pencere' => 'PVC window frame',
        'ahsap_pencere' => 'wooden window frame',
        'mutfak_tezgahi' => 'kitchen countertop',
        'masa' => 'table',
        'sandalye_koltuk' => 'chair / armchair',
        'dolap_ic' => 'interior cabinet',
        'dolap_dis' => 'exterior cabinet',
        'mobilya_ahsap' => 'wooden furniture',
        'mobilya_metal' => 'metal furniture',
        'korkuluk_parmaklik' => 'railing / balustrade',
        'demir_kapi' => 'iron door',
        'kepenk' => 'shutter',
        'bahce_citi' => 'garden fence',
        'sera_camli_yuzey' => 'greenhouse / glazed surface',
        'radyator_petek' => 'radiator',
        'boru_tesisat' => 'pipe / plumbing',
        'garaj_zemini' => 'garage floor',
        'havuz_kenari' => 'poolside',
        'teras_balkon' => 'terrace / balcony',
        'cati' => 'roof',
        'sundurma' => 'canopy / awning',
        'ahsap_deck' => 'wooden deck',
        'seramik_fayans' => 'ceramic / tile',
        'sivali_yuzey' => 'plastered surface',
        'alcipan' => 'drywall',
        'kartonpiyer' => 'cornice / molding',
        'kalorifer_boregi' => 'radiator cover',
        'neme_maruz_yuzey_banyo' => 'moisture-exposed bathroom surface',
        'islak_hacim_mutfak' => 'wet area kitchen surface',
        'yangin_kapisi' => 'fire door',
        'tabela_levha' => 'sign / plate',
        'endustriyel_makine' => 'industrial machine',
        'arac_romork' => 'vehicle / trailer',
        'gemi_tekne' => 'ship / boat',
        'her_yer_stella_cok_amagli' => 'entire scene',
    ];

    private const FINAL_DIRECTIVE = 'Generate a photorealistic image of this exact scene. Keep all elements, lighting, shadows, and layout identical — only the %s color changes to %s. The paint/color must look realistically applied with natural lighting and reflections.';

    public function build(
        ?string $userPrompt,
        Palette $palette,
        string $surface,
        ?string $roomDescription = null,
    ): string {
        $colorCode = $this->formatColorCode($palette->color_code);
        $surfaceLabel = self::SURFACE_MAP[$surface] ?? 'specified surface';

        $prompt = "A photorealistic scene. The {$surfaceLabel} is painted with color {$colorCode} (applied evenly, realistic finish). ";

        if ($roomDescription !== null && $roomDescription !== '') {
            $prompt .= "The room layout and details: {$roomDescription}. ";
        }

        if ($userPrompt !== null && $userPrompt !== '') {
            $prompt .= "Additional user request that must also be applied: " . trim($userPrompt) . ". ";
        }

        $prompt .= sprintf(self::FINAL_DIRECTIVE, $surfaceLabel, $colorCode);

        return $prompt;
    }

    private function formatColorCode(string $colorCode): string
    {
        $code = trim($colorCode);

        if (str_starts_with($code, '#')) {
            return $code;
        }

        return "#{$code}";
    }
}
