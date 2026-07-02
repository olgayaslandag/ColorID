<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Swatch;

class PromptBuilder
{
    private const CATEGORY_MAP = [
        'İç Cephe Boyaları' => ['surface' => 'walls', 'description' => 'interior walls', 'preposition' => 'the'],
        'Dış Cephe Boyaları' => ['surface' => 'exterior walls', 'description' => 'exterior walls', 'preposition' => 'the'],
        'Ahşap ve Metal Boyaları' => ['surface' => 'wood and metal surfaces', 'description' => 'wood and metal surfaces', 'preposition' => 'the'],
        'Doğal Boyalar' => ['surface' => 'walls and surfaces', 'description' => 'walls and surfaces', 'preposition' => 'the'],
        'Endüstriyel Boyalar' => ['surface' => 'industrial surfaces', 'description' => 'industrial surfaces', 'preposition' => 'the'],
    ];

    private const SURFACE_KEYWORDS = [
        'duvar' => 'walls',
        'duvarlar' => 'walls',
        'wall' => 'walls',
        'zemin' => 'the floor',
        'floor' => 'the floor',
        'tavan' => 'the ceiling',
        'ceiling' => 'the ceiling',
        'masa' => 'the table',
        'table' => 'the table',
        'kapı' => 'the door',
        'door' => 'the door',
        'pencere' => 'the window',
        'window' => 'the window',
        'mobilya' => 'the furniture',
        'furniture' => 'the furniture',
        'dolap' => 'the cabinet',
        'cabinet' => 'the cabinet',
        'tezgah' => 'the countertop',
        'countertop' => 'the countertop',
        'mutfak' => 'the kitchen cabinets',
        'kapak' => 'the cabinet doors',
    ];

    public function buildEditPrompt(
        ?string $userPrompt,
        Swatch $swatch,
        string $categoryName,
        ?string $roomDescription = null,
    ): string {
        $colorCode = $this->formatColorCode($swatch->value);
        $surfaceInfo = $this->getSurfaceForCategory($categoryName);
        $colorName = $this->getColorName($colorCode);

        $surfaces = [$surfaceInfo['description']];
        $additional = $this->parseAdditionalSurfaces($userPrompt);
        if (!empty($additional)) {
            $surfaces = array_merge($surfaces, $additional);
        }
        $surfaces = array_unique($surfaces);
        $surfaceList = implode(', ', $surfaces);
        $lastComma = strrpos($surfaceList, ',');
        if ($lastComma !== false) {
            $surfaceList = substr_replace($surfaceList, ' and', $lastComma, 1);
        }

        $prompt = "Edit this image realistically. Paint the {$surfaceList} with the color {$colorCode} ({$colorName}). Apply the paint evenly with realistic finish, proper lighting, shadows, and texture that matches the original photo.";

        if ($roomDescription !== null && $roomDescription !== '') {
            $prompt .= " Keep all furniture, objects, lighting, and layout exactly as described: {$roomDescription}";
        }

        $prompt .= " Do not change anything else in the image. Only apply the new paint color to the specified surfaces.";

        if ($userPrompt !== null && $userPrompt !== '') {
            $userTrimmed = trim($userPrompt);
            $prompt .= " User additionally requests: {$userTrimmed}.";
        }

        return $prompt;
    }

    public function build(
        ?string $userPrompt,
        Swatch $swatch,
        string $categoryName,
        ?string $roomDescription = null,
    ): string {
        return $this->buildEditPrompt($userPrompt, $swatch, $categoryName, $roomDescription);
    }

    private function getSurfaceForCategory(string $categoryName): array
    {
        return self::CATEGORY_MAP[$categoryName] ?? [
            'surface' => 'specified surface',
            'description' => $this->deriveSurfaceLabel($categoryName),
            'preposition' => 'the',
        ];
    }

    private function parseAdditionalSurfaces(?string $userPrompt): array
    {
        if ($userPrompt === null || $userPrompt === '') {
            return [];
        }

        $lower = mb_strtolower(trim($userPrompt), 'UTF-8');
        $surfaces = [];

        foreach (self::SURFACE_KEYWORDS as $word => $label) {
            if (mb_strpos($lower, $word, 0, 'UTF-8') !== false) {
                $surfaces[] = $label;
            }
        }

        return array_values(array_unique($surfaces));
    }

    private function deriveSurfaceLabel(string $categoryName): string
    {
        $lower = mb_strtolower(trim($categoryName), 'UTF-8');

        $keywords = [
            'iç' => 'interior surfaces',
            'ic' => 'interior surfaces',
            'dış' => 'exterior surfaces',
            'dis' => 'exterior surfaces',
            'duvar' => 'wall surfaces',
            'ahşap' => 'wood surfaces',
            'ahsap' => 'wood surfaces',
            'metal' => 'metal surfaces',
            'doğal' => 'natural surfaces',
            'dogal' => 'natural surfaces',
            'endüstriyel' => 'industrial surfaces',
            'endustriyel' => 'industrial surfaces',
            'boya' => 'painted surfaces',
            'tavan' => 'ceiling surfaces',
            'zemin' => 'floor surfaces',
            'masa' => 'table surfaces',
        ];

        foreach ($keywords as $word => $label) {
            if (mb_strpos($lower, $word, 0, 'UTF-8') !== false) {
                return $label;
            }
        }

        return 'specified surfaces';
    }

    private function formatColorCode(string $colorCode): string
    {
        $code = trim($colorCode);

        if (str_starts_with($code, '#')) {
            return $code;
        }

        return "#{$code}";
    }

    private function getColorName(string $hex): string
    {
        $hex = ltrim($hex, '#');
        if (strlen($hex) !== 6) {
            return 'selected color';
        }

        [$r, $g, $b] = sscanf($hex, '%02x%02x%02x');

        $hsl = $this->rgbToHsl($r, $g, $b);
        $h = $hsl[0] * 360;
        $s = $hsl[1];
        $l = $hsl[2];

        if ($l < 0.08) {
            return 'very dark';
        }
        if ($l > 0.92) {
            return 'white';
        }

        if ($s < 0.12) {
            if ($l < 0.35) {
                return 'dark gray';
            }
            if ($l < 0.65) {
                return 'medium gray';
            }
            return 'light gray';
        }

        $hueNames = [
            [0, 25, 'red'],
            [25, 45, 'orange'],
            [45, 70, 'yellow'],
            [70, 150, 'green'],
            [150, 200, 'teal'],
            [200, 255, 'blue'],
            [255, 285, 'indigo'],
            [285, 330, 'purple'],
            [330, 360, 'pink'],
            [0, 0, 'red'],
        ];

        $baseName = 'color';
        foreach ($hueNames as [$start, $end, $name]) {
            if ($start <= $end) {
                if ($h >= $start && $h < $end) {
                    $baseName = $name;
                    break;
                }
            }
        }

        $prefix = '';
        if ($l < 0.3) {
            $prefix = 'dark ';
        } elseif ($l > 0.7) {
            $prefix = 'light ';
        }

        return $prefix . $baseName;
    }

    private function rgbToHsl(int $r, int $g, int $b): array
    {
        $r /= 255;
        $g /= 255;
        $b /= 255;

        $max = max($r, $g, $b);
        $min = min($r, $g, $b);
        $l = ($max + $min) / 2;

        if ($max === $min) {
            return [0, 0, $l];
        }

        $d = $max - $min;
        $s = $l > 0.5 ? $d / (2 - $max - $min) : $d / ($max + $min);

        switch ($max) {
            case $r:
                $h = ($g - $b) / $d + ($g < $b ? 6 : 0);
                break;
            case $g:
                $h = ($b - $r) / $d + 2;
                break;
            default:
                $h = ($r - $g) / $d + 4;
                break;
        }

        $h /= 6;

        return [$h, $s, $l];
    }
}
