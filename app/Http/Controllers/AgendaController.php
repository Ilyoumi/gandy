<?php
namespace App\Http\Controllers;


use App\Models\agenda;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
class AgendaController extends Controller
{
    public function index()
    {
        return Agenda::with('calendar')->get();
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
        $agenda = Agenda::findOrFail($id);
        $agenda->update($request->all());

        return $agenda;
    }

    public function destroy($id)
    {
        $agenda = Agenda::findOrFail($id);
        $agenda->delete();

        return 204; // No content
    }
    
}
