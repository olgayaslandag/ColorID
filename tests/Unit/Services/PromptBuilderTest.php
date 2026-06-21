<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Models\Palette;
use App\Services\PromptBuilder;

uses(TestCase::class);

it('builds a basic prompt with color', function () {
    $palette = new Palette();
    $palette->color_code = '#ff5733';

    $promptBuilder = new PromptBuilder();
    $prompt = $promptBuilder->build(null, $palette);

    expect($prompt)->toBeString();
    expect($prompt)->toContain('Apply selected wall paint color');
    expect($prompt)->toContain('#ff5733');
    expect($prompt)->toContain('while preserving lighting, shadows, textures and furniture');
    expect($prompt)->toContain('Generate realistic result');
});

it('appends user prompt when provided', function () {
    $palette = new Palette();
    $palette->color_code = '#ff5733';

    $promptBuilder = new PromptBuilder();
    $prompt = $promptBuilder->build('Make it look more vibrant', $palette);

    expect($prompt)->toContain('Additional request: Make it look more vibrant');
});

it('mentions reference image when URL is provided', function () {
    $palette = new Palette();
    $palette->color_code = '#ff5733';

    $promptBuilder = new PromptBuilder();
    $prompt = $promptBuilder->build(null, $palette, 'https://example.com/reference.jpg');

    expect($prompt)->toContain('Use the provided reference image');
});

it('combines user prompt and reference image', function () {
    $palette = new Palette();
    $palette->color_code = '#ff5733';

    $promptBuilder = new PromptBuilder();
    $prompt = $promptBuilder->build('Add some shadows', $palette, 'https://example.com/reference.jpg');

    expect($prompt)->toContain('Additional request: Add some shadows');
    expect($prompt)->toContain('Use the provided reference image');
});

it('auto-prefixes hash to color code if missing', function () {
    $palette = new Palette();
    $palette->color_code = 'ff5733';

    $promptBuilder = new PromptBuilder();
    $prompt = $promptBuilder->build(null, $palette);

    expect($prompt)->toContain('#ff5733');
});