<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\DamageReport;
use App\Models\Reservation;
use App\Models\Bike;
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

        $query = DamageReport::with(['bike', 'reservation', 'reporter']);
        
        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        // Filter by severity if provided
        if ($request->has('severity')) {
            $query->where('severity', $request->severity);
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
        $damageReport = DamageReport::with(['bike', 'reservation', 'reporter'])->find($id);
        
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
            'bike_id' => 'required|exists:bikes,id',
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
        
        // Check if bike_id matches the reservation's bike_id
        if ($reservation->bike_id != $request->bike_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'The bike ID does not match the reservation\'s bike.'
            ], 422);
        }
        
        // Create the damage report
        $damageReport = new DamageReport([
            'reservation_id' => $request->reservation_id,
            'bike_id' => $request->bike_id,
            'reported_by' => Auth::id(),
            'description' => $request->description,
            'severity' => $request->severity,
            'status' => 'reported',
            'additional_charges' => 0
        ]);
        
        $damageReport->save();
        
        // Handle image uploads separately
        if ($request->hasFile('images')) {
            $this->uploadImages($request, $damageReport);
        }
        
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
        
        // Update the damage report
        $damageReport->update($request->only([
            'description',
            'severity',
            'status',
            'additional_charges'
        ]));
        
        // If status changed to "repaired", update the bike's status if needed
        if ($request->has('status') && $request->status === 'repaired') {
            $bike = Bike::find($damageReport->bike_id);
            if ($bike && $bike->status === 'damaged') {
                $bike->status = 'available';
                $bike->save();
            }
        }
        
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