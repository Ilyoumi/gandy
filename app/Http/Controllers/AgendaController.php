<?php
namespace App\Http\Controllers;


use App\Models\agenda;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
class AgendaController extends Controller
{
    public function index()
    {
        // Fetch all agendas
        $agendas = Agenda::all();

        // return response with agendas
        return response()->json(['agendas' => $agendas], 200);
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
        $agenda = Agenda::with('calendar')->findOrFail($id);
        return response()->json(['agenda' => $agenda], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 404);
    }
}


public function update(Request $request, $id)
{
    try {
        $agenda = Agenda::findOrFail($id);
        $agenda->update($request->all());

        // Check if 'fullcalendar_config' is present in the request
        if ($request->has('fullcalendar_config')) {
            $agenda->fullcalendar_config = $request->input('fullcalendar_config');
        }

        // Optionally, you can check if 'events' is present and update it as well
        if ($request->has('events')) {
            $agenda->events = $request->input('events');
        }

        // Save the changes to the agenda
        $agenda->save();

        return response()->json(['agenda' => $agenda], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}



    public function destroy($id)
    {
        $agenda = Agenda::findOrFail($id);
        $agenda->delete();

        return 204; // No content
    }
    
}