<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Bike;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class ReservationController extends Controller
{
    /**
     * Display a listing of reservations
     * Admin sees all, regular users see only their own
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Reservation::with('bike');
        
        // If not admin, only show user's own reservations
        if ($user->user_type !== 'admin') {
            $query->where('user_id', $user->id);
        }
        
        // Apply filters if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('start_date')) {
            $query->whereDate('start_datetime', '>=', $request->start_date);
        }
        
        if ($request->has('end_date')) {
            $query->whereDate('end_datetime', '<=', $request->end_date);
        }
        
        if ($request->has('bike_id')) {
            $query->where('bike_id', $request->bike_id);
        }
        
        // Sort options
        $sortField = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        
        // Ensure valid sort field
        $allowedSortFields = ['start_datetime', 'end_datetime', 'status', 'created_at'];
        if (!in_array($sortField, $allowedSortFields)) {
            $sortField = 'created_at';
        }
        
        $reservations = $query->orderBy($sortField, $sortDirection)
            ->paginate($request->input('per_page', 10));
        
        return response()->json([
            'status' => true,
            'message' => 'Reservations retrieved successfully',
            'data' => $reservations
        ]);
    }

    /**
     * Store a newly created reservation
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'bike_id' => 'required|exists:bikes,id',
            'start_datetime' => 'required|date|after_or_equal:today',
            'end_datetime' => 'required|date|after:start_datetime',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }
        
        // Check if bike is available for the requested period
        $bike = Bike::findOrFail($request->bike_id);
        
        if ($bike->status !== 'available') {
            return response()->json([
                'status' => false,
                'message' => 'This bike is not available for reservation'
            ], 422);
        }
        
        // Check for overlapping reservations
        $overlappingReservations = Reservation::where('bike_id', $request->bike_id)
            ->where(function($query) use ($request) {
                $query->whereBetween('start_datetime', [$request->start_datetime, $request->end_datetime])
                    ->orWhereBetween('end_datetime', [$request->start_datetime, $request->end_datetime])
                    ->orWhere(function($query) use ($request) {
                        $query->where('start_datetime', '<=', $request->start_datetime)
                            ->where('end_datetime', '>=', $request->end_datetime);
                    });
            })
            ->whereIn('status', ['pending', 'confirmed'])
            ->exists();
            
        if ($overlappingReservations) {
            return response()->json([
                'status' => false,
                'message' => 'The bike is already reserved for the selected time period'
            ], 422);
        }
        
        // Calculate rental duration and payment amount
        $startTime = new \DateTime($request->start_datetime);
        $endTime = new \DateTime($request->end_datetime);
        $interval = $startTime->diff($endTime);
        
        $totalHours = $interval->h + ($interval->days * 24);
        $totalDays = ceil($totalHours / 24);
        
        // Calculate price - use daily rate if more than 24 hours
        $payAmount = 0;
        if ($totalHours <= 24) {
            $payAmount = $bike->hourly_rate * $totalHours;
        } else {
            $payAmount = $bike->daily_rate * $totalDays;
        }
        
        // Create the reservation
        $reservation = Reservation::create([
            'user_id' => $request->user()->id,
            'bike_id' => $request->bike_id,
            'start_datetime' => $request->start_datetime,
            'end_datetime' => $request->end_datetime,
            'pay_amount' => $payAmount,
            'status' => 'pending'
        ]);
        
        // Load the bike relationship
        $reservation->load('bike');
        
        return response()->json([
            'status' => true,
            'message' => 'Reservation created successfully',
            'data' => $reservation
        ], 201);
    }

    /**
     * Display the specified reservation
     *
     * @param Request $request
     * @param Reservation $reservation
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, Reservation $reservation)
    {
        // Check if user is authorized to view this reservation
        if ($request->user()->user_type !== 'admin' && $request->user()->id !== $reservation->user_id) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized. You can only view your own reservations'
            ], 403);
        }
        
        // Load relationships
        $reservation->load('bike', 'user');
        
        return response()->json([
            'status' => true,
            'message' => 'Reservation details retrieved successfully',
            'data' => $reservation
        ]);
    }

    /**
     * Update the specified reservation
     *
     * @param Request $request
     * @param Reservation $reservation
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Reservation $reservation)
    {
        // Check if user is authorized to update this reservation
        if ($request->user()->user_type !== 'admin' && $request->user()->id !== $reservation->user_id) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized. You can only update your own reservations'
            ], 403);
        }
        
        // Regular users can only update pending reservations
        if ($reservation->status !== 'pending' && $request->user()->user_type !== 'admin') {
            return response()->json([
                'status' => false,
                'message' => 'Only pending reservations can be updated by regular users'
            ], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'start_datetime' => 'sometimes|date|after_or_equal:today',
            'end_datetime' => 'sometimes|date|after:start_datetime',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }
        
        // If dates are being changed, check availability again
        if ($request->has('start_datetime') || $request->has('end_datetime')) {
            $startDateTime = $request->start_datetime ?? $reservation->start_datetime;
            $endDateTime = $request->end_datetime ?? $reservation->end_datetime;
            
            // Check for overlapping reservations
            $overlappingReservations = Reservation::where('bike_id', $reservation->bike_id)
                ->where('id', '!=', $reservation->id)
                ->where(function($query) use ($startDateTime, $endDateTime) {
                    $query->whereBetween('start_datetime', [$startDateTime, $endDateTime])
                        ->orWhereBetween('end_datetime', [$startDateTime, $endDateTime])
                        ->orWhere(function($query) use ($startDateTime, $endDateTime) {
                            $query->where('start_datetime', '<=', $startDateTime)
                                ->where('end_datetime', '>=', $endDateTime);
                        });
                })
                ->whereIn('status', ['pending', 'confirmed'])
                ->exists();
                
            if ($overlappingReservations) {
                return response()->json([
                    'status' => false,
                    'message' => 'The bike is already reserved for the selected time period'
                ], 422);
            }
            
            // Recalculate payment if dates changed
            $bike = $reservation->bike;
            $startTime = new \DateTime($startDateTime);
            $endTime = new \DateTime($endDateTime);
            $interval = $startTime->diff($endTime);
            
            $totalHours = $interval->h + ($interval->days * 24);
            $totalDays = ceil($totalHours / 24);
            
            $payAmount = 0;
            if ($totalHours <= 24) {
                $payAmount = $bike->hourly_rate * $totalHours;
            } else {
                $payAmount = $bike->daily_rate * $totalDays;
            }
            
            $reservation->pay_amount = $payAmount;
        }
        
        // Update the reservation
        if ($request->has('start_datetime')) {
            $reservation->start_datetime = $request->start_datetime;
        }
        
        if ($request->has('end_datetime')) {
            $reservation->end_datetime = $request->end_datetime;
        }
        
        $reservation->save();
        
        // Load relationships
        $reservation->load('bike');
        
        return response()->json([
            'status' => true,
            'message' => 'Reservation updated successfully',
            'data' => $reservation
        ]);
    }

    /**
     * Remove/cancel the specified reservation
     *
     * @param Request $request
     * @param Reservation $reservation
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, Reservation $reservation)
    {
        // Check if user is authorized to cancel this reservation
        if ($request->user()->user_type !== 'admin' && $request->user()->id !== $reservation->user_id) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized. You can only cancel your own reservations'
            ], 403);
        }
        
        // Only allow cancellation if reservation is pending or confirmed
        if (!in_array($reservation->status, ['pending', 'confirmed'])) {
            return response()->json([
                'status' => false,
                'message' => 'Cannot cancel. Reservation is already ' . $reservation->status
            ], 422);
        }
        
        // Set reservation status to cancelled
        $reservation->status = 'cancelled';
        $reservation->save();
        
        return response()->json([
            'status' => true,
            'message' => 'Reservation cancelled successfully'
        ]);
    }
    
    /**
     * Update reservation status (admin only)
     *
     * @param Request $request
     * @param Reservation $reservation
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateStatus(Request $request, Reservation $reservation)
    {
        // Check if user is admin
        if ($request->user()->user_type !== 'admin') {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized. Only admins can update reservation status'
            ], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,confirmed,completed,cancelled,rejected'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }
        
        // Update reservation status
        $reservation->status = $request->status;
        $reservation->save();
        
        // If status is confirmed, update bike status to rented
        if ($request->status === 'confirmed') {
            $bike = $reservation->bike;
            $bike->status = 'rented';
            $bike->save();
        }
        
        // If status is completed or cancelled, update bike status to available
        if (in_array($request->status, ['completed', 'cancelled', 'rejected'])) {
            $bike = $reservation->bike;
            $bike->status = 'available';
            $bike->save();
        }
        
        return response()->json([
            'status' => true,
            'message' => 'Reservation status updated successfully',
            'data' => $reservation
        ]);
    }
} 