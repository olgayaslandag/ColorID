<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\ProductCategory;
use App\Models\Submission;
use App\Models\Swatch;
use App\Models\Tenant;
use App\Services\OpenAIService;
use App\Services\PromptBuilder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class TestImageEdit extends Command
{
    protected $signature = 'test:image-edit
        {image : Test görseli yolu (public/ altı veya absolute path)}
        {--category=1 : Product category ID}
        {--swatch=1 : Swatch ID}
        {--prompt= : Custom prompt metni}
        {--tenant=1 : Tenant ID}
    ';

    protected $description = 'Test AI image editing using the same services as GenerateImageJob';

    public function handle(OpenAIService $openAI, PromptBuilder $promptBuilder): int
    {
        $imageArg = $this->argument('image');
        $categoryId = (int) $this->option('category');
        $swatchId = (int) $this->option('swatch');
        $customPrompt = $this->option('prompt');
        $tenantId = (string) $this->option('tenant');

        // ─── 1. Resolve inputs ───
        $storage = Storage::disk('public');

        if (file_exists($imageArg)) {
            $imagePath = 'uploads/originals/test_' . time() . '.jpg';
            $storage->put($imagePath, file_get_contents($imageArg));
        } elseif ($storage->exists($imageArg)) {
            $imagePath = $imageArg;
        } elseif ($storage->exists('uploads/originals/' . $imageArg)) {
            $imagePath = 'uploads/originals/' . $imageArg;
        } else {
            $this->error("Image not found: {$imageArg}");
            return self::FAILURE;
        }
        $this->line("  <fg=yellow>INFO</> Image: <fg=cyan>{$imagePath}</>");

        $tenant = Tenant::find($tenantId);
        if ($tenant === null) { $this->error("Tenant ID {$tenantId} not found."); return self::FAILURE; }
        $tenantLabel = $tenant->name ?? $tenant->id;
        $this->line("  <fg=yellow>INFO</> Tenant: <fg=cyan>{$tenantLabel}</> (ID: {$tenant->id})");

        $category = ProductCategory::find($categoryId);
        if ($category === null) { $this->error("Category ID {$categoryId} not found."); return self::FAILURE; }
        $this->line("  <fg=yellow>INFO</> Category: <fg=cyan>{$category->name}</> (ID: {$category->id})");

        $swatch = Swatch::find($swatchId);
        if ($swatch === null) { $this->error("Swatch ID {$swatchId} not found."); return self::FAILURE; }
        $this->line("  <fg=yellow>INFO</> Swatch: <fg=cyan>{$swatch->name}</> ({$swatch->value})");

        if ($customPrompt) $this->line("  <fg=yellow>INFO</> Prompt: <fg=cyan>{$customPrompt}</>");
        $this->newLine();

        // ─── 2. Create Submission (same as SubmissionController@store) ───
        $this->line('━━━ Step 1/4: Create Submission ━━━');
        $submission = Submission::create([
            'tenant_id' => $tenant->getKey(),
            'name' => 'Test User',
            'phone' => '555-0100',
            'email' => 'test@example.com',
            'city' => 'Test City',
            'category_id' => $category->id,
            'swatch_id' => $swatch->id,
            'prompt' => $customPrompt,
            'status' => 'pending',
        ]);
        $submission->images()->create(['original_image' => $imagePath]);
        $this->line('  <fg=green>✓ Submission created</> (UUID: <fg=cyan>' . $submission->uuid . '</>)');
        $this->newLine();

        // ─── 3. describeImage() — same as GenerateImageJob::handle() ───
        $this->line('━━━ Step 2/4: Vision Analysis ━━━');
        $this->line('  Calling <fg=cyan>OpenAIService::describeImage()</> (GPT-4o-mini)...');
        $bar = $this->output->createProgressBar(1);
        $bar->start();

        $roomDescription = null;
        try {
            $roomDescription = $openAI->describeImage(
                imagePath: $imagePath,
                tenantId: $tenantId,
            );
            $bar->finish();
            $this->newLine(2);
            $this->line('  <fg=green>✓ describeImage() OK</>');
            $lines = explode("\n", $roomDescription);
            $this->line('  <fg=gray>  └─ ' . count($lines) . ' satır döndü</>');
        } catch (\Throwable $e) {
            $bar->finish();
            $this->newLine(2);
            $this->line('  <fg=yellow>⚠ Vision failed (continuing without description):</>');
            $this->line('  <fg=red>    ' . $e->getMessage() . '</>');
        }
        $this->newLine();

        // ─── 4. buildEditPrompt() — same as GenerateImageJob::handle() ───
        $this->line('━━━ Step 3/4: Build Prompt ━━━');
        $this->line('  Calling <fg=cyan>PromptBuilder::buildEditPrompt()</>...');
        try {
            $prompt = $promptBuilder->buildEditPrompt(
                userPrompt: $customPrompt,
                swatch: $swatch,
                categoryName: $category->name,
                roomDescription: $roomDescription,
            );
            $this->line('  <fg=green>✓ buildEditPrompt() OK</>');
            foreach (explode("\n", $prompt) as $l) {
                $this->line('     <fg=gray>' . $l . '</>');
            }
        } catch (\Throwable $e) {
            $this->error('PromptBuilder FAILED: ' . $e->getMessage());
            return self::FAILURE;
        }
        $this->newLine();

        // ─── 5. editImage() — same as GenerateImageJob::handle() ───
        $this->line('━━━ Step 4/4: DALL-E 2 Edit ━━━');
        $this->line('  Calling <fg=cyan>OpenAIService::editImage()</>...');
        $bar = $this->output->createProgressBar(1);
        $bar->start();

        try {
            $resultPath = $openAI->editImage(
                originalImagePath: $imagePath,
                prompt: $prompt,
                tenantId: $tenantId,
            );
            $bar->finish();
            $this->newLine(2);

            // Update submission status (same as job does)
            $submission->update(['status' => 'completed']);

            $image = $submission->images()->first();
            $image->update(['generated_image' => $resultPath]);

            $this->line('  <fg=green>✓✓✓ editImage() SUCCESS</>');
            $this->line('  <fg=yellow>  └─ Storage:</> <fg=cyan>' . $resultPath . '</>');
            $this->line('  <fg=yellow>  └─ URL:</>     <fg=cyan>' . url($storage->url($resultPath)) . '</>');

            $outputName = 'test_output_' . time() . '.png';
            file_put_contents(public_path($outputName), $storage->get($resultPath));
            $this->line('  <fg=yellow>  └─ Saved:</>   <fg=cyan>public/' . $outputName . '</>');
            $this->newLine();

            // ─── 6. Summary ───
            $this->line('━━━ SUMMARY ━━━');
            $this->line('  <fg=green>✓ Submission:</> ' . $submission->uuid);
            $this->line('  <fg=green>✓ Status:</>     ' . $submission->status);
            $this->line('  <fg=green>✓ Services:</>   describeImage() + buildEditPrompt() + editImage()');
            $this->newLine();
            $this->line('━━━ DONE ━━━');

            return self::SUCCESS;
        } catch (\Throwable $e) {
            $bar->finish();
            $this->newLine(2);
            $this->error('editImage() FAILED: ' . $e->getMessage());
            $this->line('  <fg=red>File:</> ' . $e->getFile() . ':' . $e->getLine());
            $this->line('  <fg=red>Trace:</>');
            foreach (explode("\n", $e->getTraceAsString()) as $tl) {
                $this->line('    <fg=gray>' . $tl . '</>');
            }
            return self::FAILURE;
        }
    }
}
