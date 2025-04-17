<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Add a login route that handles both web and API authentication
Route::get('/login', function (Request $request) {
    // Check if this is an API request
    $isApiRequest = $request->expectsJson() || 
                    $request->is('api/*') || 
                    $request->wantsJson() ||
                    $request->header('X-Requested-With') == 'XMLHttpRequest' ||
                    strpos($request->header('Accept', ''), '/json') !== false;
    
    if ($isApiRequest) {
        return response()->json([
            'status' => false,
            'message' => 'Unauthenticated.',
            'error' => 'You must be logged in to access this resource.'
        ], 401);
    }
    
    // For web requests, redirect to the frontend login page
    return redirect('http://localhost:5173/login');
})->name('login');
