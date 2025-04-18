<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\DamageReport;
use App\Models\Reservation;
use App\Models\Bike;
use App\Models\BikeInventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class DamageReportController extends Controller
{
    /**
     * Display a listing of the damage reports.
     * Admin access only.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // Check if user is admin
        if (!Auth::user() || Auth::user()->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. Admin access only.'
            ], 403);
        }

        $query = DamageReport::with(['bikeInventory', 'bikeInventory.bike', 'reservation', 'reporter']);
        
        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        // Filter by severity if provided
        if ($request->has('severity')) {
            $query->where('severity', $request->severity);
        }
        
        // Filter by bike_id if provided
        if ($request->has('bike_id')) {
            $query->whereHas('bikeInventory', function($q) use ($request) {
                $q->where('bike_id', $request->bike_id);
            });
        }
        
        // Filter by bike_inventory_id if provided
        if ($request->has('bike_inventory_id')) {
            $query->where('bike_inventory_id', $request->bike_inventory_id);
        }
        
        $damageReports = $query->latest()->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $damageReports
        ]);
    }

    /**
     * Display the specified damage report.
     * Admin or the user who ordered the bike can access.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $damageReport = DamageReport::with(['bikeInventory', 'bikeInventory.bike', 'reservation', 'reporter'])->find($id);
        
        if (!$damageReport) {
            return response()->json([
                'status' => 'error',
                'message' => 'Damage report not found'
            ], 404);
        }
        
        // Check if user is admin or the one who ordered the bike
        $user = Auth::user();
        if ($user->user_type !== 'admin' && $damageReport->reservation->user_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. You can only view your own damage reports.'
            ], 403);
        }
        
        return response()->json([
            'status' => 'success',
            'data' => $damageReport
        ]);
    }

    /**
     * Store a newly created damage report.
     * Admin or the user who ordered the bike can submit.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reservation_id' => 'required|exists:reservations,id',
            'bike_inventory_id' => 'required|exists:bike_inventories,id',
            'description' => 'required|string',
            'severity' => 'required|in:minor,moderate,severe',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }
        
        // Check if reservation exists and belongs to the user or user is admin
        $reservation = Reservation::find($request->reservation_id);
        $user = Auth::user();
        
        if (!$reservation) {
            return response()->json([
                'status' => 'error',
                'message' => 'Reservation not found'
            ], 404);
        }
        
        if ($user->user_type !== 'admin' && $reservation->user_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. You can only report damage for your own reservations.'
            ], 403);
        }
        
        // Check if bike_inventory_id matches the reservation's bike_inventory_id
        if ($reservation->bike_inventory_id != $request->bike_inventory_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'The bike inventory ID does not match the reservation\'s bike.'
            ], 422);
        }
        
        // Create the damage report
        $damageReport = new DamageReport([
            'reservation_id' => $request->reservation_id,
            'bike_inventory_id' => $request->bike_inventory_id,
            'reported_by' => Auth::id(),
            'description' => $request->description,
            'severity' => $request->severity,
            'status' => 'reported',
            'additional_charges' => 0
        ]);
        
        $damageReport->save();
        
        // Update bike inventory status if damage is moderate or severe
        if (in_array($request->severity, ['moderate', 'severe'])) {
            $bikeInventory = BikeInventory::find($request->bike_inventory_id);
            if ($bikeInventory) {
                $bikeInventory->status = 'damaged';
                $bikeInventory->save();
            }
        }
        
        // Handle image uploads separately
        if ($request->hasFile('images')) {
            $this->uploadImages($request, $damageReport);
        }
        
        // Load relationships for response
        $damageReport->load(['bikeInventory', 'bikeInventory.bike', 'reservation', 'reporter']);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Damage report submitted successfully',
            'data' => $damageReport
        ], 201);
    }

    /**
     * Update the specified damage report.
     * Admin access only.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // Check if user is admin
        if (!Auth::user() || Auth::user()->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. Admin access only.'
            ], 403);
        }
        
        $damageReport = DamageReport::find($id);
        
        if (!$damageReport) {
            return response()->json([
                'status' => 'error',
                'message' => 'Damage report not found'
            ], 404);
        }
        
        $validator = Validator::make($request->all(), [
            'description' => 'string',
            'severity' => 'in:minor,moderate,severe',
            'status' => 'in:reported,under review,repair scheduled,repaired',
            'additional_charges' => 'numeric|min:0'
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }
        
        // Get the old status and severity before updating
        $oldStatus = $damageReport->status;
        $oldSeverity = $damageReport->severity;
        
        // Update the damage report
        $damageReport->update($request->all());
        
        // If status is changed to 'repaired', update bike inventory status
        if ($request->has('status') && $request->status === 'repaired' && $oldStatus !== 'repaired') {
            $bikeInventory = BikeInventory::find($damageReport->bike_inventory_id);
            if ($bikeInventory && $bikeInventory->status === 'damaged') {
                $bikeInventory->status = 'available';
                $bikeInventory->save();
            }
        }
        
        // If severity is upgraded to moderate or severe, update bike inventory status
        if ($request->has('severity') && in_array($request->severity, ['moderate', 'severe']) && !in_array($oldSeverity, ['moderate', 'severe'])) {
            $bikeInventory = BikeInventory::find($damageReport->bike_inventory_id);
            if ($bikeInventory && $bikeInventory->status !== 'damaged') {
                $bikeInventory->status = 'damaged';
                $bikeInventory->save();
            }
        }
        
        // Load relationships for response
        $damageReport->load(['bikeInventory', 'bikeInventory.bike', 'reservation', 'reporter']);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Damage report updated successfully',
            'data' => $damageReport
        ]);
    }

    /**
     * Upload images for a damage report.
     * Admin or the user who ordered the bike can upload.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function uploadImages(Request $request, $id = null)
    {
        // If called from store method with damageReport object
        if (is_object($id)) {
            $damageReport = $id;
            $id = $damageReport->id;
        } else {
            $damageReport = DamageReport::find($id);
            
            if (!$damageReport) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Damage report not found'
                ], 404);
            }
            
            // Check if user is admin or the one who ordered the bike
            $user = Auth::user();
            $reservation = Reservation::find($damageReport->reservation_id);
            
            if ($user->user_type !== 'admin' && $reservation->user_id !== $user->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized. You can only upload images for your own damage reports.'
                ], 403);
            }
            
            $validator = Validator::make($request->all(), [
                'images' => 'required|array',
                'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }
        }
        
        $uploadedImages = [];
        $currentImages = $damageReport->images ?? [];
        
        foreach ($request->file('images') as $image) {
            $path = $image->store('damage-reports', 'public');
            $uploadedImages[] = $path;
        }
        
        // Merge with existing images
        $allImages = array_merge($currentImages, $uploadedImages);
        $damageReport->images = $allImages;
        $damageReport->save();
        
        if (is_object($id)) {
            // If called from store method, don't return a response
            return;
        }
        
        return response()->json([
            'status' => 'success',
            'message' => 'Images uploaded successfully',
            'data' => [
                'images' => $damageReport->images
            ]
        ]);
    }
} 