<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            $table->string('city')->nullable()->after('email');
            $table->string('surface')->nullable()->after('city');
            $table->foreignId('palette_id')->nullable()->constrained('palettes')->nullOnDelete()->after('surface');
        });
    }

    public function down(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            $table->dropForeign(['palette_id']);
            $table->dropColumn(['city', 'surface', 'palette_id']);
        });
    }
};
