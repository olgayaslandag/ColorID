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
            if (!Schema::hasColumn('submissions', 'category_id')) {
                $table->foreignId('category_id')
                    ->nullable()
                    ->after('city')
                    ->constrained('product_categories')
                    ->nullOnDelete();
            }

            if (!Schema::hasColumn('submissions', 'swatch_id')) {
                $table->foreignId('swatch_id')
                    ->nullable()
                    ->after('category_id')
                    ->constrained('swatches')
                    ->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            if (Schema::hasColumn('submissions', 'category_id')) {
                $table->dropForeign(['category_id']);
                $table->dropColumn('category_id');
            }

            if (Schema::hasColumn('submissions', 'swatch_id')) {
                $table->dropForeign(['swatch_id']);
                $table->dropColumn('swatch_id');
            }
        });
    }
};
