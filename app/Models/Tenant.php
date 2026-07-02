<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

use Spatie\Activitylog\Support\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class Tenant extends Model
{
    /** @use HasFactory<\Database\Factories\TenantFactory> */
    use HasFactory, SoftDeletes, LogsActivity;

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
            'deleted_at' => 'datetime',
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
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

    public function settings(): HasMany
    {
        return $this->hasMany(TenantSetting::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
