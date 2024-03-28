<?php

namespace App\Http\Controllers;

use App\Models\agenda;
use Illuminate\Http\Request;
use App\Models\User; 

class AgendaController extends Controller
{
    public function index()
    {
        return Agenda::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:agendas',
            'contact_id' => 'required|exists:users,id',
            'description' => 'nullable|string',
        ]);

        return Agenda::create($request->all());
    }

    public function show($id)
    {
        return Agenda::findOrFail($id);
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
