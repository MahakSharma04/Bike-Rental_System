<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // Only redirect for web requests, not API requests
        if ($this->isApiRequest($request)) {
            return null; // No redirection for API requests
        }
        
        // For web requests, redirect to the appropriate login page
        // If you have a frontend app, change this to that URL
        return '/login';
    }
    
    /**
     * Handle an unauthenticated request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  array  $guards
     * @return void
     *
     * @throws \Illuminate\Auth\AuthenticationException
     */
    protected function unauthenticated($request, array $guards)
    {
        if ($this->isApiRequest($request)) {
            abort(response()->json([
                'status' => false,
                'message' => 'Unauthenticated.',
                'error' => 'You must be logged in to access this resource.'
            ], 401));
        }
        
        parent::unauthenticated($request, $guards);
    }
    
    /**
     * Determine if the request is an API request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return bool
     */
    protected function isApiRequest(Request $request): bool
    {
        // Check multiple indicators that this is an API request
        return $request->expectsJson() || 
               $request->is('api/*') || 
               $request->wantsJson() ||
               $request->header('X-Requested-With') == 'XMLHttpRequest' ||
               strpos($request->header('Accept', ''), '/json') !== false;
    }
} 