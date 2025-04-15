<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\BikeController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public authentication routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

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
    Route::apiResource('bikes', BikeController::class);

    
});