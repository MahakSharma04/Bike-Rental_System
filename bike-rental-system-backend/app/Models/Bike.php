<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bike extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'model',
        'brand',
        'type',
        'description',
        'hourly_rate',
        'daily_rate',
        'images'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'images' => 'array',
        'hourly_rate' => 'decimal:2',
        'daily_rate' => 'decimal:2',
    ];

    /**
     * Get the inventory items for this bike model.
     */
    public function inventoryItems()
    {
        return $this->hasMany(BikeInventory::class);
    }

    /**
     * Get the maintenance records for all inventory items of this bike model.
     */
    public function maintenanceRecords()
    {
        return $this->hasManyThrough(MaintenanceRecord::class, BikeInventory::class);
    }

    /**
     * Get the reservations for all inventory items of this bike model.
     */
    public function reservations()
    {
        return $this->hasManyThrough(Reservation::class, BikeInventory::class);
    }

    /**
     * Get available inventory items for this bike model.
     */
    public function availableInventoryItems()
    {
        return $this->inventoryItems()->where('status', 'available');
    }
}  