<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('submission_images', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('submission_id')->constrained('submissions', 'uuid')->cascadeOnDelete();
            $table->string('original_image');
            $table->string('generated_image')->nullable();
            $table->timestamps();

            $table->index('submission_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submission_images');
    }
};
