<?php
namespace App\Http\Controllers;


use App\Models\agenda;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class AgendaController extends Controller
{
    public function index()
{
    try {
        // Fetch all agendas
        $agendas = Agenda::all();

        // return response with agendas
        return response()->json(['agendas' => $agendas], 200);
    } catch (\Exception $e) {
        // Log the error message
        Log::error('Failed to fetch agendas: ' . $e->getMessage());

        // Return a response with error message if an exception occurs
        return response()->json(['error' => $e->getMessage()], 500);
    }
}


    // Function to fetch appointments for a specific agenda
    public function getAppointments($agendaId)
{
    try {
        $agenda = Agenda::findOrFail($agendaId);
        $rdvs = $agenda->rdvs()->get(); 
        return response()->json(['rdvs' => $rdvs], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 404);
    }
}

public function getUserAgendas($userId)
    {
        try {
            // Fetch agendas for the specified user
            $agendas = Agenda::where('contact_id', $userId)->get();

            // return response with agendas
            return response()->json(['agendas' => $agendas], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    public function store(Request $request)
{
    try {
        $request->validate([
            'name' => 'required|string|unique:agendas',
            'contact_id' => 'required|exists:users,id',
            'description' => 'nullable|string',
        ]);
        

        // Create the agenda with provided data
        $agenda = Agenda::create([
            'name' => $request->name,
            'contact_id' => $request->contact_id,
            'description' => $request->description,
        ]);
        

        return response()->json([
            'agenda' => $agenda,
        ], 201);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}


public function show($id)
{
    try {
        // Fetch the agenda by its ID
        $agenda = Agenda::findOrFail($id);

        // Return a JSON response with the agenda data
        return response()->json(['agenda' => $agenda], 200);
    } catch (\Exception $e) {
        // Return a JSON response with an error message if the agenda is not found
        return response()->json(['error' => 'Agenda not found'], 404);
    }
}



public function update(Request $request, $id)
{
    try {
        // Find the agenda by its ID
        $agenda = Agenda::findOrFail($id);
        
        // Update agenda properties
        $agenda->name = $request->input('name');
        $agenda->contact_id = $request->input('contact_id');
        $agenda->description = $request->input('description');

        // Optionally, update fullcalendar_config and events if present in the request
        if ($request->has('fullcalendar_config')) {
            $agenda->fullcalendar_config = $request->input('fullcalendar_config');
        }
        if ($request->has('events')) {
            $agenda->events = $request->input('events');
        }

        // Save the changes to the agenda
        $agenda->save();

        // Return a JSON response with the updated agenda
        return response()->json(['agenda' => $agenda], 200);
    } catch (\Exception $e) {
        // Return an error response if an exception occurs
        return response()->json(['error' => $e->getMessage()], 500);
    }
}




public function destroy($id)
{
    try {
        $agenda = Agenda::findOrFail($id);
        $agenda->delete();

        // Return success response
        return response()->json(['message' => 'Agenda deleted successfully'], 200);
    } catch (\Exception $e) {
        // Return error response if agenda is not found or other error occurs
        return response()->json(['error' => 'Failed to delete agenda'], 500);
    }
}

    
}