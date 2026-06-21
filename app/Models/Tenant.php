<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tenant extends Model
{
    /** @use HasFactory<\Database\Factories\TenantFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'domain',
        'logo',
        'primary_color',
        'secondary_color',
        'status',
        'monthly_limit',
    ];

    protected function casts(): array
    {
        return [
            'status' => 'boolean',
            'monthly_limit' => 'integer',
        ];
    }

    /**
     * Scope a query to only include active tenants.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', true);
    }

    /**
     * Get the storage path for this tenant.
     */
    public function getStoragePathAttribute(): string
    {
        return "tenants/{$this->id}";
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class);
    }

    public function paletteGroups(): HasMany
    {
        return $this->hasMany(PaletteGroup::class);
    }

    public function settings(): HasMany
    {
        return $this->hasMany(TenantSetting::class);
    }
}
