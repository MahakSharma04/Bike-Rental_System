<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'user_id',
        'bike_id',
        'bike_inventory_id',
        'reservation_id',
        'rating',
        'title',
        'comment'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'rating' => 'integer',
    ];

    /**
     * Get the user who wrote the review.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the bike that was reviewed.
     */
    public function bike()
    {
        return $this->belongsTo(Bike::class);
    }

    /**
     * Get the reservation associated with this review.
     */
    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    /**
     * Get the bike inventory item that was reviewed.
     */
    public function bikeInventory()
    {
        return $this->belongsTo(BikeInventory::class);
    }
} 