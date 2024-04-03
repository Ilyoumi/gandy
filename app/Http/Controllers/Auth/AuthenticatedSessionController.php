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
    public function login (Request $request){
        $validator = Validator::make($request->all(), [
        'email' => 'required|email:191',
        'password' => 'required',
        ]);
        
        if($validator->fails())
        {
        return response()->json([
        'validation_errors' =>$validator->messages(),
        ]);
        }
        else
        {
        $user = User::where('email', $request->email)->first();
        
        if(!$user || !Hash::check($request->password,$user->password))
        {
        return response()->json([
        'status'=>401,
        'message'=>'Invalid Credentials',
        ]);
        }
        else
        {
        if($user->role_as == 1) //1 = admin
        {
        $role = 'admin';
        $token = $user->createToken($user->email.'_AdminToken',['server:admin'])->plainTextToken;
        }
        else
        {
        $role = '';
        $token = $user->createToken($user->email.'_Token', [''])->plainTextToken;
        }
        return response()->json([
        'status' =>200,
        'username' =>$user->name,
        'token' =>$token,
        'message' =>'Logged In Successfully',
        'role'=>$role,
        ]);
        }
        }
        }

        public function logout()
        {
            try {
                return Auth::logout();
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
