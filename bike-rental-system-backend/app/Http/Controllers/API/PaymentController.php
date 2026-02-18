<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\URL;
use Razorpay\Api\Api;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    /**
     * Display a listing of payments
     * Admin sees all, regular users see only their own
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Payment::with(['reservation', 'reservation.bike']);
        
        // Include all payments for admin, only user's payments for regular users
        if ($user->user_type !== 'admin') {
            $query->whereHas('reservation', function($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }
        
        // Apply filters if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('payment_method')) {
            $query->where('payment_method', $request->payment_method);
        }
        
        if ($request->has('reservation_id')) {
            $query->where('reservation_id', $request->reservation_id);
        }
        
        if ($request->has('min_amount')) {
            $query->where('amount', '>=', $request->min_amount);
        }
        
        if ($request->has('max_amount')) {
            $query->where('amount', '<=', $request->max_amount);
        }
        
        if ($request->has('date_from')) {
            $query->whereDate('payment_date', '>=', $request->date_from);
        }
        
        if ($request->has('date_to')) {
            $query->whereDate('payment_date', '<=', $request->date_to);
        }
        
        // Sort options
        $sortField = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        
        // Ensure valid sort field
        $allowedSortFields = ['amount', 'payment_method', 'status', 'payment_date', 'created_at'];
        if (!in_array($sortField, $allowedSortFields)) {
            $sortField = 'created_at';
        }
        
        $payments = $query->orderBy($sortField, $sortDirection)
            ->paginate($request->input('per_page', 10));
        
        return response()->json([
            'status' => true,
            'message' => 'Payments retrieved successfully',
            'data' => $payments
        ]);
    }

    /**
     * Display the specified payment
     *
     * @param Request $request
     * @param Payment $payment
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, Payment $payment)
    {
        // Load reservation to check ownership
        $payment->load('reservation');
        
        // Only allow access for admin or the payment's owner
        if ($request->user()->user_type !== 'admin' && $request->user()->id !== $payment->reservation->user_id) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized. You can only view your own payments.'
            ], 403);
        }
        
        // Load relationships
        $payment->load(['reservation.bike', 'reservation.user']);
        
        return response()->json([
            'status' => true,
            'message' => 'Payment details retrieved successfully',
            'data' => $payment
        ]);
    }

    /**
     * Generate a signed URL for payment view
     * 
     * @param Request $request
     * @param int $reservationId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPaymentViewLink(Request $request, $reservationId)
    {
        $user = Auth::user();
        
        // Find the reservation
        $reservation = Reservation::findOrFail($reservationId);
        
        // Only allow link generation for admin or the reservation's owner
        if ($user->user_type !== 'admin' && $user->id !== $reservation->user_id) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized. You can only generate payment links for your own reservations.'
            ], 403);
        }
        
        // Check if there's an existing completed payment
        $existingPayment = Payment::where('reservation_id', $reservationId)
            ->where('status', 'completed')
            ->first();
            
        if ($existingPayment) {
            return response()->json([
                'status' => false,
                'message' => 'Payment has already been completed for this reservation'
            ], 422);
        }
        
        // Generate signed URL valid for 30 minutes
        $url = URL::temporarySignedRoute(
            'payment.view',
            now()->addMinutes(30),
            ['reservationId' => $reservationId]
        );
        
        return response()->json([
            'status' => true,
            'message' => 'Payment link generated successfully',
            'data' => [
                'url' => $url,
                'expires_in' => '30 minutes'
            ]
        ]);
    }

    /**
     * Display payment page for a specific reservation
     * This does not require authentication as it uses a signed URL
     *
     * @param Request $request
     * @param int $reservationId
     * @return \Illuminate\View\View
     */
    public function getReservationPayment(Request $request, $reservationId)
    {
        // Find the reservation
        $reservation = Reservation::with(['bike', 'user'])->findOrFail($reservationId);
        
        // Check if there's an existing completed payment
        $existingPayment = Payment::where('reservation_id', $reservationId)
            ->where('status', 'completed')
            ->first();
            
        if ($existingPayment) {
            // Payment already completed, show receipt/confirmation
            return view('payment.completed', [
                'reservation' => $reservation,
                'payment' => $existingPayment
            ]);
        }
        
        // Get the amount in paise/cents (multiply by 100)
        $amountInPaise = $reservation->pay_amount * 100;
        
        // Generate a unique receipt ID
        $receiptId = 'reservation_' . $reservationId . '_' . time();
        
        // Check for success and error query parameters
        $success = $request->query('success');
        $error = $request->query('error');
        
        // Pass variables to the razorpayView.blade.php
        return view('razorpayView', [
            'amount' => $amountInPaise, 
            'name' => $reservation->user->name,
            'email' => $reservation->user->email,
            'reservationId' => $reservationId,
            'receiptId' => $receiptId,
            'reservation' => $reservation,
            'success' => $success,
            'error' => $error
        ]);
    }

    /**
     * Store a newly created payment or handle payment callback from Razorpay.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validate the request
        $validatedData = $request->validate([
            'razorpay_payment_id' => 'required|string',
            'reservation_id' => 'required|exists:reservations,id',
            'razorpay_order_id' => 'nullable|string',
            'razorpay_signature' => 'nullable|string',
        ]);

        try {
            // Find the reservation
            $reservation = Reservation::with('bike', 'user')->findOrFail($validatedData['reservation_id']);
            
            // Check if payment already exists
            $existingPayment = Payment::where('razor_pay_id', $validatedData['razorpay_payment_id'])->first();
            if ($existingPayment) {
                return response()->json(['message' => 'Payment already processed'], 200);
            }
            
            // Create the payment record
            $payment = new Payment();
            $payment->razor_pay_id = $validatedData['razorpay_payment_id'];
            $payment->reservation_id = $validatedData['reservation_id'];
            $payment->amount = $reservation->pay_amount;
            $payment->payment_method = 'razorpay';
            $payment->status = 'completed';
            $payment->payment_date = now();
            $payment->transaction_id = $validatedData['razorpay_payment_id'];
            $payment->save();
            
            // Update reservation status
            $reservation->status = 'confirmed';
            $reservation->save();
            
            // Return success response based on request type
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Payment successful', 'payment' => $payment], 200);
            }
            
            // For form submissions, render the view directly with success status
            $reservation = Reservation::with(['bike', 'user'])->findOrFail($validatedData['reservation_id']);
            $amountInPaise = $reservation->pay_amount * 100;
            $receiptId = 'reservation_' . $validatedData['reservation_id'] . '_' . time();
            
            return view('razorpayView', [
                'amount' => $amountInPaise, 
                'name' => $reservation->user->name,
                'email' => $reservation->user->email,
                'reservationId' => $validatedData['reservation_id'],
                'receiptId' => $receiptId,
                'reservation' => $reservation,
                'success' => 'true',
                'error' => null
            ]);
            
        } catch (\Exception $e) {
            // Log the error
            Log::error('Payment processing error: ' . $e->getMessage());
            
            // If this is an API request, return JSON error
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Payment processing failed: ' . $e->getMessage()], 500);
            }
            
            // Otherwise render the view directly with error status
            $reservation = Reservation::with(['bike', 'user'])->findOrFail($validatedData['reservation_id']);
            $amountInPaise = $reservation->pay_amount * 100;
            $receiptId = 'reservation_' . $validatedData['reservation_id'] . '_' . time();
            
            return view('razorpayView', [
                'amount' => $amountInPaise, 
                'name' => $reservation->user->name,
                'email' => $reservation->user->email,
                'reservationId' => $validatedData['reservation_id'],
                'receiptId' => $receiptId,
                'reservation' => $reservation,
                'success' => null,
                'error' => 'Payment processing failed: ' . $e->getMessage()
            ]);
        }
    }
}