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
        'status',
        'hourly_rate',
        'daily_rate',
        'images',
        'last_maintenance_date'
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
        'last_maintenance_date' => 'datetime',
    ];

    /**
     * Get the maintenance records for the bike.
     */
    public function maintenanceRecords()
    {
        return $this->hasMany(MaintenanceRecord::class);
    }

    /**
     * Get the reservations for the bike.
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
} 