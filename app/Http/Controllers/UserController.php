<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
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
        $csrfToken = csrf_token();
        return response()->json(['users' => $users, 'csrfToken' => $csrfToken]);
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
        // Create the user
$user = new User();
$user->name = $validatedData['nom'] . ' ' . $validatedData['prenom'];
$user->email = $validatedData['email'];
$user->password = Hash::make($validatedData['password']);
$user->role_id = $roleIds[$validatedData['role_name']]; // Assign role ID based on role name
$user->role = $validatedData['role_name']; // Assign role name
$user->save();


        // Return a response indicating success
        return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
    } catch (\Exception $e) {
        // Log the error message
        Log::error('Failed to create user: ' . $e->getMessage());

        // Return a response with error message if an exception occurs
        return response()->json([
            'message' => 'Failed to create user: ' . $e->getMessage(),
            'formData' => $request->all() // Include form data in the response
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
    // UserController.php
public function update(Request $request, $id)
{
    try {
        // Find the user with the given id
        $user = User::find($id);

        // Check if user exists
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Map role name to role ID
        $roleIds = [
            'Admin' => 1,
            'Agent' => 2,
            'Superviseur' => 3,
            'Agent Commercial' => 4,
        ];

        // Validate request data
        $validatedData = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email,'.$id,
            'role_id' => 'required|exists:roles,id',
        ]);

        // Update user data
        $user->name = $validatedData['name'];
        $user->email = $validatedData['email'];
        $user->role_id = $validatedData['role_id'];
        $user->save();

        // Return a response indicating success
        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    } catch (\Exception $e) {
        // Log the error
        Log::error('Failed to update user: ' . $e->getMessage());

        // Return a response with error message
        return response()->json(['message' => 'Failed to update user: ' . $e->getMessage()], 500);
    }
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
