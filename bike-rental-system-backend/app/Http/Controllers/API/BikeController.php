<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Bike;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class BikeController extends Controller
{
    /**
     * Display a listing of bikes with optional filtering
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = Bike::query();
        
        // Apply filters if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        
        if ($request->has('brand')) {
            $query->where('brand', $request->brand);
        }
        
        if ($request->has('min_hourly_rate')) {
            $query->where('hourly_rate', '>=', $request->min_hourly_rate);
        }
        
        if ($request->has('max_hourly_rate')) {
            $query->where('hourly_rate', '<=', $request->max_hourly_rate);
        }
        
        // Sort options
        $sortField = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        
        // Ensure valid sort field
        $allowedSortFields = ['model', 'brand', 'type', 'hourly_rate', 'daily_rate', 'created_at'];
        if (!in_array($sortField, $allowedSortFields)) {
            $sortField = 'created_at';
        }
        
        $bikes = $query->orderBy($sortField, $sortDirection)
            ->paginate($request->input('per_page', 10));
        
        return response()->json([
            'status' => true,
            'message' => 'Bikes retrieved successfully',
            'data' => $bikes
        ]);
    }

    /**
     * Store a newly created bike
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Check if user is admin
        if (!Auth::user() || Auth::user()->user_type !== 'admin') {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized. Only admins can create bikes'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'model' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'hourly_rate' => 'required|numeric|min:0',
            'daily_rate' => 'required|numeric|min:0',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Create bike with basic info
        $bike = Bike::create([
            'model' => $request->model,
            'brand' => $request->brand,
            'type' => $request->type,
            'status' => 'available',
            'hourly_rate' => $request->hourly_rate,
            'daily_rate' => $request->daily_rate,
            'images' => [],
        ]);

        // Process images if provided
        if ($request->hasFile('images')) {
            $uploadedImages = [];
            
            foreach ($request->file('images') as $image) {
                $path = $image->store('bikes', 'public');
                $uploadedImages[] = $path;
            }
            
            $bike->images = $uploadedImages;
            $bike->save();
        }

        return response()->json([
            'status' => true,
            'message' => 'Bike created successfully',
            'data' => $bike
        ], 201);
    }

    /**
     * Display the specified bike
     *
     * @param Bike $bike
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Bike $bike)
    {
        // Load maintenance records if user is admin
        if (Auth::user() && Auth::user()->user_type === 'admin') {
            $bike->load('maintenanceRecords');
        }
        
        return response()->json([
            'status' => true,
            'message' => 'Bike details retrieved successfully',
            'data' => $bike
        ]);
    }

    /**
     * Update the specified bike
     *
     * @param Request $request
     * @param Bike $bike
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Bike $bike)
    {
        // Check if user is admin
        if (!Auth::user() || Auth::user()->user_type !== 'admin') {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized. Only admins can update bikes'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'model' => 'sometimes|string|max:255',
            'brand' => 'sometimes|string|max:255',
            'type' => 'sometimes|string|max:255',
            'status' => 'sometimes|in:available,rented,maintenance,damaged',
            'last_maintenance_date' => 'nullable|date',
            'hourly_rate' => 'sometimes|numeric|min:0',
            'daily_rate' => 'sometimes|numeric|min:0',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
            'replace_images' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Update bike info excluding images
        $bike->update($request->except('images', 'replace_images'));

        // Process images if provided
        if ($request->hasFile('images')) {
            $uploadedImages = [];
            
            foreach ($request->file('images') as $image) {
                $path = $image->store('bikes', 'public');
                $uploadedImages[] = $path;
            }
            
            // Replace or merge images
            if ($request->input('replace_images', false)) {
                // Delete old image files
                if (!empty($bike->images)) {
                    foreach ($bike->images as $oldImage) {
                        if (Storage::disk('public')->exists($oldImage)) {
                            Storage::disk('public')->delete($oldImage);
                        }
                    }
                }
                
                $bike->images = $uploadedImages;
            } else {
                $currentImages = $bike->images ?? [];
                $bike->images = array_merge($currentImages, $uploadedImages);
            }
            
            $bike->save();
        }

        return response()->json([
            'status' => true,
            'message' => 'Bike updated successfully',
            'data' => $bike
        ]);
    }

    /**
     * Remove the specified bike
     *
     * @param Request $request
     * @param Bike $bike
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, Bike $bike)
    {
        // Check if user is admin
        if (!Auth::user() || Auth::user()->user_type !== 'admin') {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized. Only admins can delete bikes'
            ], 403);
        }

        // Check if bike has active reservations
        $hasActiveReservations = Reservation::where('bike_id', $bike->id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->exists();
            
        if ($hasActiveReservations) {
            return response()->json([
                'status' => false,
                'message' => 'Cannot delete bike with active reservations'
            ], 422);
        }

        $bike->delete();

        return response()->json([
            'status' => true,
            'message' => 'Bike deleted successfully'
        ]);
    }

    /**
     * Get available bikes for a specific date range
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function available(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'start_datetime' => 'required|date',
            'end_datetime' => 'required|date|after:start_datetime',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Get all bikes that are available
        $query = Bike::where('status', 'available');
        
        // Exclude bikes that have reservations in the requested period
        $unavailableBikeIds = Reservation::where(function($q) use ($request) {
                $q->whereBetween('start_datetime', [$request->start_datetime, $request->end_datetime])
                  ->orWhereBetween('end_datetime', [$request->start_datetime, $request->end_datetime])
                  ->orWhere(function($q) use ($request) {
                      $q->where('start_datetime', '<=', $request->start_datetime)
                        ->where('end_datetime', '>=', $request->end_datetime);
                  });
            })
            ->whereIn('status', ['pending', 'confirmed'])
            ->pluck('bike_id')
            ->toArray();
            
        if (!empty($unavailableBikeIds)) {
            $query->whereNotIn('id', $unavailableBikeIds);
        }
        
        // Apply additional filters if provided
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        
        if ($request->has('brand')) {
            $query->where('brand', $request->brand);
        }
        
        $bikes = $query->paginate($request->input('per_page', 10));
        
        return response()->json([
            'status' => true,
            'message' => 'Available bikes retrieved successfully',
            'data' => $bikes
        ]);
    }

    /**
     * Get all bike types
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function types()
    {
        $types = Bike::select('type')->distinct()->pluck('type');
        
        return response()->json([
            'status' => true,
            'message' => 'Bike types retrieved successfully',
            'data' => $types
        ]);
    }

    /**
     * Upload images for a bike
     *
     * @param Request $request
     * @param Bike $bike
     * @return \Illuminate\Http\JsonResponse
     */
    public function uploadImages(Request $request, Bike $bike)
    {
        // Check if user is admin
        if (!Auth::user() || Auth::user()->user_type !== 'admin') {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized. Only admins can upload bike images'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Get current images or initialize empty array
        $currentImages = $bike->images ?? [];
        $uploadedImages = [];
        
        // Process and store each image
        foreach ($request->file('images') as $image) {
            $path = $image->store('bikes', 'public');
            $uploadedImages[] = $path;
        }
        
        // Merge with existing images
        $allImages = array_merge($currentImages, $uploadedImages);
        
        // Update bike with new images
        $bike->images = $allImages;
        $bike->save();

        return response()->json([
            'status' => true,
            'message' => 'Bike images uploaded successfully',
            'data' => [
                'images' => $bike->images
            ]
        ]);
    }
}