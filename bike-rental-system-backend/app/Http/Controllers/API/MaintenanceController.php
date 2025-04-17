<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\MaintenanceRecord;
use App\Models\Bike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class MaintenanceController extends Controller
{
    /**
     * Display a listing of maintenance records.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $maintenanceRecords = MaintenanceRecord::with('bike')->latest()->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $maintenanceRecords
        ]);
    }

    /**
     * Display the specified maintenance record.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $maintenanceRecord = MaintenanceRecord::with('bike')->find($id);
        
        if (!$maintenanceRecord) {
            return response()->json([
                'status' => 'error',
                'message' => 'Maintenance record not found'
            ], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'data' => $maintenanceRecord
        ]);
    }

    /**
     * Store a newly created maintenance record.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'bike_id' => 'required|exists:bikes,id',
            'maintenance_type' => 'required|in:routine,repair',
            'description' => 'required|string',
            'cost' => 'nullable|numeric|min:0',
            'scheduled_date' => 'required|date',
            'status' => 'nullable|in:scheduled,in-progress,completed',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $maintenanceRecord = MaintenanceRecord::create($request->all());
        
        // If maintenance is in-progress, update bike status
        if ($request->status == 'in-progress') {
            $bike = Bike::find($request->bike_id);
            if ($bike) {
                $bike->status = 'maintenance';
                $bike->save();
            }
        }
        
        return response()->json([
            'status' => 'success',
            'message' => 'Maintenance record created successfully',
            'data' => $maintenanceRecord
        ], 201);
    }

    /**
     * Update the specified maintenance record.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $maintenanceRecord = MaintenanceRecord::find($id);
        
        if (!$maintenanceRecord) {
            return response()->json([
                'status' => 'error',
                'message' => 'Maintenance record not found'
            ], 404);
        }
        
        $validator = Validator::make($request->all(), [
            'bike_id' => 'exists:bikes,id',
            'maintenance_type' => 'in:routine,repair',
            'description' => 'string',
            'cost' => 'nullable|numeric|min:0',
            'scheduled_date' => 'date',
            'completion_date' => 'nullable|date',
            'status' => 'in:scheduled,in-progress,completed',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $oldStatus = $maintenanceRecord->status;
        $maintenanceRecord->update($request->all());
        
        // Update bike status if maintenance status changes
        if ($request->has('status') && $oldStatus != $request->status) {
            $bike = Bike::find($maintenanceRecord->bike_id);
            if ($bike) {
                if ($request->status == 'in-progress') {
                    $bike->status = 'maintenance';
                    $bike->save();
                } else if ($request->status == 'completed' && $bike->status == 'maintenance') {
                    $bike->status = 'available';
                    $bike->last_maintenance_date = Carbon::now();
                    $bike->save();
                    
                    // Update completion date if not already set
                    if (!$maintenanceRecord->completion_date) {
                        $maintenanceRecord->completion_date = Carbon::now();
                        $maintenanceRecord->save();
                    }
                }
            }
        }
        
        return response()->json([
            'status' => 'success',
            'message' => 'Maintenance record updated successfully',
            'data' => $maintenanceRecord
        ]);
    }

    /**
     * Get upcoming scheduled maintenance.
     *
     * @return \Illuminate\Http\Response
     */
    public function scheduled()
    {
        $scheduledMaintenance = MaintenanceRecord::with('bike')
            ->where('status', 'scheduled')
            ->where('scheduled_date', '>=', Carbon::now()->toDateString())
            ->orderBy('scheduled_date')
            ->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $scheduledMaintenance
        ]);
    }

    /**
     * Mark maintenance as completed.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function complete($id)
    {
        $maintenanceRecord = MaintenanceRecord::find($id);
        
        if (!$maintenanceRecord) {
            return response()->json([
                'status' => 'error',
                'message' => 'Maintenance record not found'
            ], 404);
        }
        
        $maintenanceRecord->status = 'completed';
        $maintenanceRecord->completion_date = Carbon::now();
        $maintenanceRecord->save();
        
        // Update bike status and last maintenance date
        $bike = Bike::find($maintenanceRecord->bike_id);
        if ($bike && $bike->status == 'maintenance') {
            $bike->status = 'available';
            $bike->last_maintenance_date = Carbon::now();
            $bike->save();
        }
        
        return response()->json([
            'status' => 'success',
            'message' => 'Maintenance marked as completed successfully',
            'data' => $maintenanceRecord
        ]);
    }
} 