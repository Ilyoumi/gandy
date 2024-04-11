<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

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
        $validator = Validator::make($request->all(), [
            'email' => 'required|email:191',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        } else {

            $credentials = $request->only('email', 'password');
            $user = User::where('email', $credentials['email'])->first();

            if (!$user || !Hash::check($credentials['password'], $user->password)) {
                // Log the provided password and the hashed password from the database
                Log::info('Login failed: Provided Password - ' . $credentials['password'] . ', Hashed Password - ' . $user->password);

                return response()->json([
                    'status' => 401,
                    'message' => 'Invalid Credentials',
                    'provided_password' => $credentials['password'],
                    'hashed_password' => $user ? $user->password : null, // Include hashed password if user exists
                ]);
            } else {
                if ($user->role_as == 1) {
                    $token = $user->createToken($user->email . '_AdminToken', ['server:admin'])->plainTextToken;
                } else {
                    $token = $user->createToken($user->email . '_Token', [''])->plainTextToken;
                }
                return response()->json([
                    'status' => 200,
                    'nom' => $user->nom,
                    'prenom' => $user->prenom,
                    'role' => $user->role,
                    'token' => $token,
                    'message' => 'Logged In Successfully',
                ]);
            }
        }
    }

    public function logout()
{
    try {
        // Invalidate the user's session
        Auth::guard('web')->logout();

        // If you want to return a response after successful logout
        return response()->json(['message' => 'Logout successful'], 200);
    } catch (\Exception $e) {
        // Handle any exceptions that may occur during the logout process
        return response()->json(['error' => 'Logout failed: ' . $e->getMessage()], 500);
    }
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
