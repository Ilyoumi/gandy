<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
{
    try {
        // Log the incoming request data
        Log::info('Incoming request data:', $request->all());

        // Validate incoming request
        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role_name' => 'required|string|in:Admin,Agent,Superviseur,Agent Commercial',
            'password' => 'required|string|min:8',
        ]);

        // Map role name to role ID
        $roleIds = [
            'Admin' => 1,
            'Agent' => 2,
            'Superviseur' => 3,
            'Agent Commercial' => 4,
        ];

        // Create the user
        $user = new User();
        $user->name = $validatedData['nom'] . ' ' . $validatedData['prenom'];
        $user->email = $validatedData['email'];
        $user->password = Hash::make($validatedData['password']);
        $user->role_id = $roleIds[$validatedData['role_name']]; // Assign role ID based on role name
        $user->save();

        // Return a response indicating success
        return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
    } catch (\Exception $e) {
        // Log the error message
        Log::error('Failed to create user: ' . $e->getMessage());

        // Return a response with error message and received password and confirmation password
        return response()->json([
            'message' => 'Failed to create user: ' . $e->getMessage(),
            'password' => $request->input('password'),
            'confirmPassword' => $request->input('password_confirmation'),
        ], 500);
    }
}






    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // Fetch the user with the given id along with their associated role
        $user = User::with('role')->find($id);

        // Check if user exists
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Return JSON response with user data
        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // Find the user with the given id
        $user = User::find($id);

        // Check if user exists
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Validate request data
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email,'.$id,
            'password' => 'nullable|string',
            'role_id' => 'required|exists:roles,id',
        ]);

        // Update user data
        $user->name = $request->input('name');
        $user->email = $request->input('email');
        if ($request->has('password')) {
            $user->password = bcrypt($request->input('password'));
        }
        $user->role_id = $request->input('role_id');
        $user->save();

        // Return a response indicating success
        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // Find the user with the given id
        $user = User::find($id);

        // Check if user exists
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Delete the user
        $user->delete();

        // Return a response indicating success
        return response()->json(['message' => 'User deleted successfully']);
    }
}