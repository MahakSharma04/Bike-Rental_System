<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\BikeController;
use App\Http\Controllers\API\PaymentController;
use App\Http\Controllers\API\ReservationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public authentication routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Public payment routes
Route::get('/payment-view/{reservationId}', [PaymentController::class, 'getReservationPayment'])
    ->name('payment.view')
    ->middleware('signed');

Route::post('/payments', [PaymentController::class, 'store']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::put('/auth/user', [AuthController::class, 'update']);
    Route::post('/auth/change-password', [AuthController::class, 'changePassword']);
    
    // Bike routes
    Route::get('/bikes/available', [BikeController::class, 'available']);
    Route::get('/bikes/types', [BikeController::class, 'types']);
    Route::post('/bikes/{bike}/images', [BikeController::class, 'uploadImages']);
    
    // Individual bike routes
    Route::get('/bikes', [BikeController::class, 'index'])->middleware('admin');
    Route::post('/bikes', [BikeController::class, 'store']);
    Route::get('/bikes/{bike}', [BikeController::class, 'show']);
    Route::put('/bikes/{bike}', [BikeController::class, 'update']);
    Route::delete('/bikes/{bike}', [BikeController::class, 'destroy']);
    
    // Reservation routes
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/reservations/{reservation}', [ReservationController::class, 'show']);
    Route::put('/reservations/{reservation}', [ReservationController::class, 'update']);
    Route::delete('/reservations/{reservation}', [ReservationController::class, 'destroy']);
    Route::put('/reservations/{reservation}/status', [ReservationController::class, 'updateStatus']);
    
    // Payment routes
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::get('/get-payment-link/{reservationId}', [PaymentController::class, 'getPaymentViewLink']);
});