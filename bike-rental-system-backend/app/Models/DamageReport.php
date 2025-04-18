<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DamageReport extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'reservation_id',
        'bike_inventory_id',
        'reported_by',
        'description',
        'images',
        'severity',
        'status',
        'additional_charges'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'images' => 'array',
        'additional_charges' => 'decimal:2'
    ];

    /**
     * Get the reservation associated with the damage report.
     */
    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    /**
     * Get the bike inventory item associated with the damage report.
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

    /**
     * Get the user who reported the damage.
     */
    public function reporter()
    {
        return $this->belongsTo(User::class, 'reported_by');
    }
} 