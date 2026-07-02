<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            $table->dropForeign(['palette_id']);
            $table->dropColumn('palette_id');
        });

        Schema::dropIfExists('palettes');
        Schema::dropIfExists('palette_groups');
    }

    public function down(): void
    {
        Schema::create('palette_groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->timestamps();
        });

        Schema::create('palettes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('palette_group_id')->constrained('palette_groups')->cascadeOnDelete();
            $table->string('title');
            $table->string('color_code');
            $table->string('image')->nullable();
            $table->timestamps();
            $table->index('palette_group_id');
        });

        Schema::table('submissions', function (Blueprint $table) {
            $table->foreignId('palette_id')->nullable()->after('swatch_id')->constrained('palettes')->nullOnDelete();
        });
    }
};
