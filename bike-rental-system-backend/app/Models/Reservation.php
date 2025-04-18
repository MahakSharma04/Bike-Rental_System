<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'user_id',
        'bike_inventory_id',
        'start_datetime',
        'end_datetime',
        'pay_amount',
        'status'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_datetime' => 'datetime',
        'end_datetime' => 'datetime',
        'pay_amount' => 'decimal:2'
    ];

    /**
     * Get the bike inventory item that is reserved.
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
     * Get the user who made the reservation.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
} 