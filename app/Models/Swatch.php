<?php

declare(strict_types=1);

namespace App\Models;

use App\Models\Media;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Swatch extends Model
{
    /** @use HasFactory<\Database\Factories\SwatchFactory> */
    use HasFactory;

    protected $fillable = ['product_id', 'name', 'type', 'value', 'position'];

    protected $appends = ['image_url'];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    protected static function booted(): void
    {
        static::addGlobalScope('position', fn ($builder) => $builder->orderBy('position')->orderBy('id'));
    }

    protected function getImageUrlAttribute(): ?string
    {
        if ($this->type !== 'image' || !$this->value) {
            return null;
        }

        return route('media.show', $this->value);
    }
}
