<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Models\Role;
use Illuminate\Validation\Rule;

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

            // Log the received data
            Log::info('Validated data:', $validatedData);

            // Create the user
            $user = new User();
            $user->nom = $validatedData['nom'];
            $user->prenom = $validatedData['prenom'];
            $user->email = $validatedData['email'];
            $user->password = Hash::make($validatedData['password']);

            // Get role ID based on role name
            $role = Role::where('name', $validatedData['role_name'])->firstOrFail();
            $user->role_id = $role->id; // Assign role ID based on role name
            $user->role = $role->name; // Assign role name

            $user->save();

            // Return a response indicating success
            return response()->json([
                'message' => 'User created successfully',
                'user' => $user,
                'received_data' => $validatedData // Include received data in the response
            ], 201);
        } catch (\Exception $e) {
            // Log the error message
            Log::error('Failed to create user: ' . $e->getMessage());

            // Return a response with error message if an exception occurs
            return response()->json([
                'message' => 'Failed to create user: ' . $e->getMessage(),
                'received_data' => $request->all() // Include received data in the response
            ], 500);
        }
    }

    public function updateContact(Request $request, $id)
    {
        try {
            // Find the contact with the given id
            $contact = User::find($id);

            // Check if contact exists
            if (!$contact) {
                return response()->json(['message' => 'Contact not found'], 404);
            }

            // Ensure that the user with role "Agent Commercial" is being updated
            if ($contact->role !== 'Agent Commercial') {
                return response()->json(['message' => 'You can only update contacts with the role "Agent Commercial"'], 403);
            }

            // Validate request data
            $validatedData = $request->validate([
                'nom' => 'required|string',
                'email' => [
                    'required',
                    'email',
                    Rule::unique('users')->ignore($contact->id),
                ],
            ]);

            // Store old data
            $oldData = $contact->toArray();

            // Split the full name into first name and last name
            $names = explode(' ', $validatedData['nom']);
            $prenom = array_shift($names); // First name
            $nom = implode(' ', $names); // Last name

            // Update contact data
            $contact->nom = $validatedData['nom']; // Full name
            $contact->prenom = $prenom; // First name
            $contact->email = $validatedData['email'];
            $contact->save();

            // Return a response indicating success with old and updated data
            return response()->json([
                'message' => 'Contact updated successfully',
                'old_data' => $oldData,
                'updated_data' => $contact->toArray()
            ]);
        } catch (\Exception $e) {
            // Log the error
            Log::error('Failed to update contact: ' . $e->getMessage());

            // If an error occurs, return a response with error message and old and updated data
            return response()->json([
                'message' => 'Failed to update contact: ' . $e->getMessage(),
                'old_data' => $oldData ?? null,
                'updated_data' => $contact->toArray() ?? null
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
        try {
            // Fetch the user with the given id
            $user = User::find($id);

            // Check if user exists
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            // Return JSON response with user data
            return response()->json($user);
        } catch (\Exception $e) {
            // Log the error
            Log::error('Failed to fetch user data by ID: ' . $e->getMessage());

            // If an error occurs, return a response with error message
            return response()->json(['message' => 'Failed to fetch user data by ID: ' . $e->getMessage()], 500);
        }
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    // UserController.php
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

            // Validate request data
            $validatedData = $request->validate([
                'name' => 'required|string',
                'email' => 'required|email|unique:users,email,' . $id,
                'role_name' => 'required|string|in:Admin,Agent,Superviseur,Agent Commercial',
            ]);

            // Store old data
            $oldData = $user->toArray();

            // Update user data
            $user->name = $validatedData['name'];
            $user->email = $validatedData['email'];
            $user->role = $validatedData['role_name']; // Assign role name directly
            $user->save();

            // Return a response indicating success with old and updated data
            return response()->json([
                'message' => 'User updated successfully',
                'old_data' => $oldData,
                'updated_data' => $user->toArray()
            ]);
        } catch (\Exception $e) {
            // Log the error
            Log::error('Failed to update user: ' . $e->getMessage());

            // If an error occurs, return a response with error message and old and updated data
            return response()->json([
                'message' => 'Failed to update user: ' . $e->getMessage(),
                'old_data' => $oldData ?? null,
                'updated_data' => $user->toArray() ?? null
            ], 500);
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
        try {
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
        } catch (\Exception $e) {
            // Log the error
            Log::error('Failed to delete user: ' . $e->getMessage());

            // If an error occurs, return a response with error message
            return response()->json(['message' => 'Failed to delete user: ' . $e->getMessage()], 500);
        }
    }



    // UserController.php
    // UserController.php

    // UserController.php

    public function getUsersByRole()
    {
        try {
            // Fetch users with the role "Agent Commercial"
            $users = User::where('role', 'Agent Commercial')->get();

            // Return JSON response with users
            return response()->json(['users' => $users]);
        } catch (\Exception $e) {
            // Log the error
            Log::error('Failed to fetch users by role: ' . $e->getMessage());

            // If an error occurs, return a response with error message
            return response()->json(['message' => 'Failed to fetch users by role: ' . $e->getMessage()], 500);
        }
    }
}
