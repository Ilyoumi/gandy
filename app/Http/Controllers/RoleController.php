<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Role;
class RoleController extends Controller
{
   

    public function index()
    {
        return Role::all();
    }

    // public function store(Request $request)
    // {
    //     return Role::create($request->all());
    //     $roles = Role::all();
    //     return response()->json($roles);
    // }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validate request data
        $request->validate([
            'name' => 'required|string|unique:roles,name',
        ]);

        // Create a new role
        $role = Role::create([
            'name' => $request->input('name'),
        ]);

        // Return a response indicating success
        return response()->json(['message' => 'Role created successfully', 'role' => $role], 201);
    }

    public function show($id)
    {
        return Role::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);
        $role->update($request->all());

        return $role;
    }

    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return 204; // No content
    }
}
