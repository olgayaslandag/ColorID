<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Palette extends Model
{
    /** @use HasFactory<\Database\Factories\PaletteFactory> */
    use HasFactory;

    protected $fillable = [
        'palette_group_id',
        'title',
        'color_code',
        'image',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function paletteGroup(): BelongsTo
    {
        return $this->belongsTo(PaletteGroup::class);
    }
}
