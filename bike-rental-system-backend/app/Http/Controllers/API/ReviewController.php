<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Bike;
use App\Models\BikeInventory;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    /**
     * Display a listing of reviews
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Review::with(['user', 'bike', 'bikeInventory']);
        
        // Apply filters if provided
        if ($request->has('rating')) {
            $query->where('rating', $request->rating);
        }
        
        if ($request->has('bike_id')) {
            $query->where('bike_id', $request->bike_id);
        }
        
        if ($request->has('bike_inventory_id')) {
            $query->where('bike_inventory_id', $request->bike_inventory_id);
        }
        
        if ($request->has('user_id')) {
            // Only admins can filter by user_id
            if (Auth::user() && Auth::user()->user_type === 'admin') {
                $query->where('user_id', $request->user_id);
            }
        }
        
        // Sort options
        $sortField = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        
        // Ensure valid sort field
        $allowedSortFields = ['rating', 'created_at'];
        if (!in_array($sortField, $allowedSortFields)) {
            $sortField = 'created_at';
        }
        
        $reviews = $query->orderBy($sortField, $sortDirection)
            ->paginate($request->input('per_page', 10));
        
        return response()->json([
            'status' => true,
            'message' => 'Reviews retrieved successfully',
            'data' => $reviews
        ]);
    }

    /**
     * Get reviews for a specific bike
     *
     * @param int $bikeId
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function getByBike($bikeId, Request $request)
    {
        // Check if bike exists
        $bike = Bike::findOrFail($bikeId);
        
        $query = Review::with(['user', 'bikeInventory'])
            ->where('bike_id', $bikeId);
        
        // Apply filter by rating if provided
        if ($request->has('rating')) {
            $query->where('rating', $request->rating);
        }
        
        // Sort options
        $sortField = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        
        // Ensure valid sort field
        $allowedSortFields = ['rating', 'created_at'];
        if (!in_array($sortField, $allowedSortFields)) {
            $sortField = 'created_at';
        }
        
        $reviews = $query->orderBy($sortField, $sortDirection)
            ->paginate($request->input('per_page', 10));
        
        return response()->json([
            'status' => true,
            'message' => 'Bike reviews retrieved successfully',
            'data' => [
                'bike' => $bike->only(['id', 'model', 'brand', 'type', 'description']),
                'average_rating' => $reviews->avg('rating'),
                'total_reviews' => $reviews->total(),
                'reviews' => $reviews->items()
            ]
        ]);
    }

    /**
     * Store a newly created review
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reservation_id' => 'required|exists:reservations,id',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'required|string|max:100',
            'comment' => 'required|string|min:10|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }
        
        // Get the reservation
        $reservation = Reservation::with(['bikeInventory', 'bikeInventory.bike'])->findOrFail($request->reservation_id);
        
        // Check if the reservation belongs to the authenticated user
        if (Auth::id() !== $reservation->user_id && Auth::user()->user_type !== 'admin') {
            return response()->json([
                'status' => false,
                'message' => 'You can only review your own reservations'
            ], 403);
        }
        
        // Check if the reservation is completed or confirmed
        if (!in_array($reservation->status, ['completed', 'confirmed'])) {
            return response()->json([
                'status' => false,
                'message' => 'You can only review confirmed or completed reservations'
            ], 422);
        }
        
        // Check if the user has already reviewed this reservation
        $existingReview = Review::where('reservation_id', $request->reservation_id)
            ->where('user_id', Auth::id())
            ->first();
            
        if ($existingReview) {
            return response()->json([
                'status' => false,
                'message' => 'You have already reviewed this reservation'
            ], 422);
        }
        
        // Get the bike and bike inventory information
        $bikeInventory = $reservation->bikeInventory;
        $bike = $bikeInventory->bike;
        
        // Create the review
        $review = Review::create([
            'user_id' => Auth::id(),
            'bike_id' => $bike->id,
            'bike_inventory_id' => $bikeInventory->id,
            'reservation_id' => $request->reservation_id,
            'rating' => $request->rating,
            'title' => $request->title,
            'comment' => $request->comment
        ]);
        
        // Load relationships
        $review->load(['user', 'bike', 'bikeInventory']);
        
        return response()->json([
            'status' => true,
            'message' => 'Review submitted successfully',
            'data' => $review
        ], 201);
    }

    /**
     * Update a review
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);
        
        // Check if the user is authorized to update this review
        if (Auth::id() !== $review->user_id && Auth::user()->user_type !== 'admin') {
            return response()->json([
                'status' => false,
                'message' => 'You can only update your own reviews'
            ], 403);
        }
        
        // Check if review is older than 30 days (for non-admin users)
        if (Auth::user()->user_type !== 'admin' && now()->diffInDays($review->created_at) > 30) {
            return response()->json([
                'status' => false,
                'message' => 'Reviews can only be updated within 30 days of posting'
            ], 422);
        }
        
        $validator = Validator::make($request->all(), [
            'rating' => 'sometimes|integer|min:1|max:5',
            'title' => 'sometimes|string|max:100',
            'comment' => 'sometimes|string|min:10|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }
        
        // Update the review
        if ($request->has('rating')) {
            $review->rating = $request->rating;
        }
        
        if ($request->has('title')) {
            $review->title = $request->title;
        }
        
        if ($request->has('comment')) {
            $review->comment = $request->comment;
        }
        
        $review->save();
        
        // Load relationships
        $review->load(['user', 'bike']);
        
        return response()->json([
            'status' => true,
            'message' => 'Review updated successfully',
            'data' => $review
        ]);
    }

    /**
     * Delete a review
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        
        // Check if the user is authorized to delete this review
        if (Auth::id() !== $review->user_id && Auth::user()->user_type !== 'admin') {
            return response()->json([
                'status' => false,
                'message' => 'You can only delete your own reviews'
            ], 403);
        }
        
        // Delete the review
        $review->delete();
        
        return response()->json([
            'status' => true,
            'message' => 'Review deleted successfully'
        ]);
    }
} 