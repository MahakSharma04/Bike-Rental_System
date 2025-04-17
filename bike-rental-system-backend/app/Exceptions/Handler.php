<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Auth\AuthenticationException;
use Symfony\Component\Routing\Exception\RouteNotFoundException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
        
        // Convert RouteNotFoundException to a JSON response for API requests
        $this->renderable(function (RouteNotFoundException $e, $request) {
            if ($this->isApiRequest($request)) {
                return response()->json([
                    'status' => false,
                    'message' => 'The requested endpoint was not found.',
                    'error' => 'Not Found'
                ], 404);
            }
        });
        
        // Handle validation exceptions for API requests
        $this->renderable(function (ValidationException $e, $request) {
            if ($this->isApiRequest($request)) {
                return response()->json([
                    'status' => false,
                    'message' => 'The given data was invalid.',
                    'errors' => $e->errors(),
                ], 422);
            }
        });
        
        // Handle all other exceptions for API requests
        $this->renderable(function (Throwable $e, $request) {
            if ($this->isApiRequest($request)) {
                // Determine status code - default to 500
                $statusCode = 500;
                
                // Check for specific exception types with status codes
                if ($e instanceof HttpExceptionInterface) {
                    $statusCode = $e->getStatusCode();
                }
                
                return response()->json([
                    'status' => false,
                    'message' => $statusCode == 500 ? 'Server Error' : $e->getMessage(),
                    'error' => class_basename($e),
                    'error_details' => config('app.debug') ? [
                        'message' => $e->getMessage(),
                        'file' => $e->getFile(),
                        'line' => $e->getLine()
                    ] : null
                ], $statusCode);
            }
        });
    }
    
    /**
     * Convert an authentication exception into a response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Auth\AuthenticationException  $exception
     * @return \Illuminate\Http\Response
     */
    protected function unauthenticated($request, AuthenticationException $exception)
    {
        // For API requests, return a JSON response
        if ($this->isApiRequest($request)) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthenticated.',
                'error' => 'You must be logged in to access this resource.'
            ], 401);
        }
        
        // For web requests, redirect to login page
        return redirect()->guest('/login');
    }
    
    /**
     * Determine if the request is an API request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return bool
     */
    protected function isApiRequest($request): bool
    {
        // Check multiple indicators that this is an API request
        return $request->expectsJson() || 
               $request->is('api/*') || 
               $request->wantsJson() ||
               $request->header('X-Requested-With') == 'XMLHttpRequest' ||
               strpos($request->header('Accept', ''), '/json') !== false;
    }
} 