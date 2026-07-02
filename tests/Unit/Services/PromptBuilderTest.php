<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Models\Swatch;
use App\Services\PromptBuilder;

uses(TestCase::class);

it('builds a basic prompt with color code', function () {
    $swatch = new Swatch();
    $swatch->value = '#ff5733';

    $promptBuilder = new PromptBuilder();
    $prompt = $promptBuilder->build(null, $swatch, 'ic_duvar');

    expect($prompt)->toBeString();
    expect($prompt)->toContain('A photorealistic scene.');
    expect($prompt)->toContain('The interior wall is painted with color #ff5733');
    expect($prompt)->toContain('Generate a photorealistic image of this exact scene');
    expect($prompt)->toContain('only the interior wall color changes to #ff5733');
});

it('appends user prompt when provided', function () {
    $swatch = new Swatch();
    $swatch->value = '#ff5733';

    $promptBuilder = new PromptBuilder();
    $prompt = $promptBuilder->build('Make it look more vibrant', $swatch, 'ic_duvar');

    expect($prompt)->toContain('Additional user request that must also be applied: Make it look more vibrant.');
});

it('maps surface label correctly', function () {
    $swatch = new Swatch();
    $swatch->value = '#44aaff';

    $promptBuilder = new PromptBuilder();
    $prompt = $promptBuilder->build(null, $swatch, 'dis_duvar');

    expect($prompt)->toContain('The exterior wall is painted with color #44aaff');
});

it('includes room description when provided', function () {
    $swatch = new Swatch();
    $swatch->value = '#ff5733';

    $promptBuilder = new PromptBuilder();
    $prompt = $promptBuilder->build(null, $swatch, 'ic_duvar', 'A spacious living room with large windows.');

    expect($prompt)->toContain('The room layout and details: A spacious living room with large windows.');
});

it('auto-prefixes hash to color code if missing', function () {
    $swatch = new Swatch();
    $swatch->value = 'ff5733';

    $promptBuilder = new PromptBuilder();
    $prompt = $promptBuilder->build(null, $swatch, 'ic_duvar');

    expect($prompt)->toContain('#ff5733');
});

it('falls back to specified surface for unknown surface key', function () {
    $swatch = new Swatch();
    $swatch->value = '#ff5733';

    $promptBuilder = new PromptBuilder();
    $prompt = $promptBuilder->build(null, $swatch, 'unknown_surface_key');

    expect($prompt)->toContain('The specified surface is painted with color #ff5733');
});

it('builds prompt with all parameters provided', function () {
    $swatch = new Swatch();
    $swatch->value = '#112233';

    $promptBuilder = new PromptBuilder();
    $prompt = $promptBuilder->build(
        'Add warm lighting',
        $swatch,
        'tavan',
        'A cozy bedroom with a wooden bed.',
    );

    expect($prompt)->toContain('The ceiling surface is painted with color #112233');
    expect($prompt)->toContain('The room layout and details: A cozy bedroom with a wooden bed.');
    expect($prompt)->toContain('Additional user request that must also be applied: Add warm lighting.');
    expect($prompt)->toContain('only the ceiling surface color changes to #112233');
});
