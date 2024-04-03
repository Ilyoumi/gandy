<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */

     public function getUser(Request $request)
    {
        try {
            // Retrieve the authenticated user using the request
            $user = $request->user();

            // Return the user data along with a message
            return response()->json([
                'message' => 'User data retrieved successfully',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            // Log the error
            Log::error('Error retrieving user data: ' . $e->getMessage());

            // Return an error response
            return response()->json([
                'message' => 'Error retrieving user data',
                'error' => $e->getMessage()
            ], 500); // Internal Server Error status code
        }
    }
    public function store(LoginRequest $request): Response
    {
        $request->authenticate();

        $request->session()->regenerate();

        return response()->noContent();
    }

    /**
     * Handle an incoming login request.
     */
    public function login(Request $request)
{
    $email = $request->input('email');
    $plainPassword = $request->input('password');
    
    // Hash the plain password
    $hashedPassword = Hash::make($plainPassword);
    
    // Attempt authentication with the hashed password
    $credentials = [
        'email' => $email,
        'password' => $hashedPassword,
    ];

    if (Auth::attempt($credentials)) {
        // Authentication passed...
        $user = Auth::user();
        return response()->json([
            'success' => true,
            'user' => $user,
            'message' => 'Login successful',
        ], 200);
    }

    return response()->json([
        'success' => false,
        'message' => 'Login failed',
    ], 401); 
}

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
