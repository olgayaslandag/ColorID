<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PaletteGroup extends Model
{
    /** @use HasFactory<\Database\Factories\PaletteGroupFactory> */
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'title',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function palettes(): HasMany
    {
        return $this->hasMany(Palette::class);
    }
}
