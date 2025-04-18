<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceRecord extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'bike_inventory_id',
        'maintenance_type',
        'description',
        'cost',
        'scheduled_date',
        'completion_date',
        'status'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'scheduled_date' => 'date',
        'completion_date' => 'date',
        'cost' => 'decimal:2'
    ];

    /**
     * Get the bike inventory item that is being maintained.
     */
    public function bikeInventory()
    {
        return $this->belongsTo(BikeInventory::class);
    }

    /**
     * Get the bike model through the inventory item.
     */
    public function bike()
    {
        return $this->hasOneThrough(Bike::class, BikeInventory::class, 'id', 'id', 'bike_inventory_id', 'bike_id');
    }
} 