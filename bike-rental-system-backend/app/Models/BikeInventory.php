<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BikeInventory extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'bike_id',
        'plate_number',
        'serial_number',
        'status',
        'last_maintenance_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'last_maintenance_date' => 'date',
    ];

    /**
     * Get the bike model this inventory item belongs to.
     */
    public function bike()
    {
        return $this->belongsTo(Bike::class);
    }

    /**
     * Get the reservations for this bike inventory item.
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'bike_inventory_id');
    }

    /**
     * Get the maintenance records for this bike inventory item.
     */
    public function maintenanceRecords()
    {
        return $this->hasMany(MaintenanceRecord::class, 'bike_inventory_id');
    }

    /**
     * Scope a query to only include available bikes.
     */
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    /**
     * Check if the bike is available for the given date range.
     */
    public function isAvailableForDateRange($startDate, $endDate)
    {
        if ($this->status !== 'available') {
            return false;
        }

        // Check if there are any overlapping reservations
        $overlappingReservations = $this->reservations()
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('start_date', [$startDate, $endDate])
                    ->orWhereBetween('end_date', [$startDate, $endDate])
                    ->orWhere(function ($query) use ($startDate, $endDate) {
                        $query->where('start_date', '<=', $startDate)
                            ->where('end_date', '>=', $endDate);
                    });
            })
            ->where('status', '!=', 'cancelled')
            ->count();

        return $overlappingReservations === 0;
    }
}
