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
        'bike_id',
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
     * Get the bike associated with the damage report.
     */
    public function bike()
    {
        return $this->belongsTo(Bike::class);
    }

    /**
     * Get the user who reported the damage.
     */
    public function reporter()
    {
        return $this->belongsTo(User::class, 'reported_by');
    }
} 