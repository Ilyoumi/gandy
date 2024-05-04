<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $users = User::all();
            $csrfToken = csrf_token();
            return response()->json(['users' => $users, 'csrfToken' => $csrfToken]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch users: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch users'], 500);
        }
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
                'role' => 'required|string|in:Admin,Agent,Superviseur,Agent Commercial',
                'password' => 'required|string|min:8',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

        // Log the received data
        Log::info('Validated data:', $validatedData);

        // Create the user
            $user = new User();
            $user->nom = $validatedData['nom'];
            $user->prenom = $validatedData['prenom'];
            $user->email = $validatedData['email'];
            $user->role = $validatedData['role'];
            $user->password = Hash::make($validatedData['password']);

            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('images'), $imageName);
                $user->image = $imageName;
            }

            $user->save();

            return response()->json([
                'message' => 'User created successfully',
                'user' => $user,
                'received_data' => $validatedData
            ], 201);
    } catch (\Exception $e) {
        Log::error('Failed to create user: ' . $e->getMessage());

        return response()->json([
            'message' => 'Failed to create user: ' . $e->getMessage(),
            'received_data' => $request->all()
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
            Log::error('Failed to create user: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create user: ' . $e->getMessage(),
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
        // Use findOrFail instead of find to automatically handle the case where the user is not found
        $user = User::findOrFail($id);
        return response()->json($user);
    } catch (ModelNotFoundException $e) {
        return response()->json(['message' => 'User not found'], 404);
    } catch (\Exception $e) {
        Log::error('Failed to fetch user data by ID: ' . $e->getMessage());
        return response()->json(['message' => 'Failed to fetch user data by ID'], 500);
    }
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
        try {
            $user = User::find($id);
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            $validatedData = $request->validate([
                'nom' => 'required|string|max:255',
                'prenom' => 'required|string|max:255',
                'email' => [
                    'required',
                    'email',
                    Rule::unique('users')->ignore($id),
                ],
                'role' => 'required|string|in:Admin,Agent,Superviseur,Agent Commercial',
                'password' => 'nullable|string|min:8', // Allow null for password update
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $user->nom = $validatedData['nom'];
            $user->prenom = $validatedData['prenom'];
            $user->email = $validatedData['email'];
            $user->role = $validatedData['role'];
            if (isset($validatedData['password'])) {
                $user->password = Hash::make($validatedData['password']);
            }

            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('images'), $imageName);
                $user->image = $imageName;
            }

            $user->save();

            return response()->json([
                'message' => 'User updated successfully',
                'user' => $user,
                'received_data' => $validatedData
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update user: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update user: ' . $e->getMessage(),
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
            $user = User::find($id);
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }
            $user->delete();
            return response()->json(['message' => 'User deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Failed to delete user: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to delete user'], 500);
        }
    }

    /**
     * Fetch users by role.
     *
     * @return \Illuminate\Http\Response
     */
    public function getUsersByRole()
    {
        try {
            $users = User::where('role', 'Agent Commercial')->get();
            return response()->json(['users' => $users]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch users by role: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch users by role'], 500);
        }
    }

    public function getSuperviseurAndAgentUsers()
{
    try {
        $users = User::whereIn('role', ['Superviseur', 'Agent'])->get();
        return response()->json(['users' => $users]);
    } catch (\Exception $e) {
        Log::error('Failed to fetch users by role: ' . $e->getMessage());
        return response()->json(['message' => 'Failed to fetch users by role'], 500);
    }
}
}
