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
        Schema::create('palettes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('palette_group_id')->constrained('palette_groups')->cascadeOnDelete();
            $table->string('title');
            $table->string('color_code', 7);
            $table->string('image')->nullable();
            $table->timestamps();

            $table->index('palette_group_id');
            $table->index('color_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('palettes');
    }
};
