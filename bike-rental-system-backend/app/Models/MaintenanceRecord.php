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
        'bike_id',
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
     * Get the bike that owns the maintenance record.
     */
    public function bike()
    {
        return $this->belongsTo(Bike::class);
    }
} 