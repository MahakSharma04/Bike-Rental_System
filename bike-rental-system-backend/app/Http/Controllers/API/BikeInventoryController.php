<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\BikeInventory;
use App\Models\Bike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BikeInventoryController extends Controller
{
    /**
     * Display a listing of bike inventory items.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = BikeInventory::with('bike');
        
        // Apply filters if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('bike_id')) {
            $query->where('bike_id', $request->bike_id);
        }
        
        // Sort options
        $sortField = $request->input('sort_by', 'id');
        $sortDirection = $request->input('sort_direction', 'asc');
        
        // Ensure valid sort field
        $allowedSortFields = ['id', 'plate_number', 'status', 'last_maintenance_date', 'created_at'];
        if (!in_array($sortField, $allowedSortFields)) {
            $sortField = 'id';
        }
        
        $inventory = $query->orderBy($sortField, $sortDirection)
            ->paginate($request->input('per_page', 15));
        
        return response()->json([
            'status' => true,
            'message' => 'Bike inventory items retrieved successfully',
            'data' => $inventory
        ]);
    }

    /**
     * Store a newly created inventory item.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'bike_id' => 'required|exists:bikes,id',
            'plate_number' => 'required|string|max:50|unique:bike_inventories',
            'serial_number' => 'required|string|max:100|unique:bike_inventories',
            'status' => 'required|in:available,rented,maintenance,damaged',
            'last_maintenance_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }
        
        // Check if the bike exists
        $bike = Bike::findOrFail($request->bike_id);
        
        // Create the inventory item
        $inventoryItem = BikeInventory::create([
            'bike_id' => $request->bike_id,
            'plate_number' => $request->plate_number,
            'serial_number' => $request->serial_number,
            'status' => $request->status,
            'last_maintenance_date' => $request->last_maintenance_date,
        ]);
        
        // Load the bike relationship
        $inventoryItem->load('bike');
        
        return response()->json([
            'status' => true,
            'message' => 'Bike inventory item created successfully',
            'data' => $inventoryItem
        ], 201);
    }

    /**
     * Display the specified inventory item.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $inventoryItem = BikeInventory::with('bike')->findOrFail($id);
        
        return response()->json([
            'status' => true,
            'message' => 'Bike inventory item retrieved successfully',
            'data' => $inventoryItem
        ]);
    }

    /**
     * Update the specified inventory item.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $inventoryItem = BikeInventory::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'bike_id' => 'sometimes|exists:bikes,id',
            'plate_number' => 'sometimes|string|max:50|unique:bike_inventories,plate_number,' . $id,
            'serial_number' => 'sometimes|string|max:100|unique:bike_inventories,serial_number,' . $id,
            'status' => 'sometimes|in:available,rented,maintenance,damaged',
            'last_maintenance_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }
        
        // Update the inventory item
        $inventoryItem->update($request->only([
            'bike_id',
            'plate_number',
            'serial_number',
            'status',
            'last_maintenance_date',
        ]));
        
        // Load the bike relationship
        $inventoryItem->load('bike');
        
        return response()->json([
            'status' => true,
            'message' => 'Bike inventory item updated successfully',
            'data' => $inventoryItem
        ]);
    }

    /**
     * Remove the specified inventory item.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $inventoryItem = BikeInventory::findOrFail($id);
        
        // Check if the inventory item has any associated reservations
        if ($inventoryItem->reservations()->count() > 0) {
            return response()->json([
                'status' => false,
                'message' => 'Cannot delete bike inventory item with existing reservations'
            ], 422);
        }
        
        $inventoryItem->delete();
        
        return response()->json([
            'status' => true,
            'message' => 'Bike inventory item deleted successfully'
        ]);
    }
    
    /**
     * Get available inventory items for a specific bike model.
     *
     * @param  int  $bikeId
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getAvailableByBike($bikeId, Request $request)
    {
        // Validate date params if provided
        $validator = Validator::make($request->all(), [
            'start_date' => 'sometimes|required_with:end_date|date',
            'end_date' => 'sometimes|required_with:start_date|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $bike = Bike::findOrFail($bikeId);
        
        // Get all available inventory items for this bike
        $query = $bike->inventoryItems()->where('status', 'available');
        
        // If date range is provided, filter by availability for that range
        if ($request->has('start_date') && $request->has('end_date')) {
            $startDate = $request->start_date;
            $endDate = $request->end_date;
            
            $query->whereDoesntHave('reservations', function ($query) use ($startDate, $endDate) {
                $query->where(function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('start_datetime', [$startDate, $endDate])
                    ->orWhereBetween('end_datetime', [$startDate, $endDate])
                    ->orWhere(function ($q) use ($startDate, $endDate) {
                        $q->where('start_datetime', '<=', $startDate)
                        ->where('end_datetime', '>=', $endDate);
                    });
                })->where('status', '!=', 'cancelled');
            });
        }
        
        $availableItems = $query->get();
        
        return response()->json([
            'status' => true,
            'message' => 'Available bike inventory items retrieved successfully',
            'data' => [
                'bike' => $bike->only(['id', 'model', 'brand', 'type', 'description', 'hourly_rate', 'daily_rate']),
                'available_items' => $availableItems
            ]
        ]);
    }
}
