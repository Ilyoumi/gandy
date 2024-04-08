<?php

namespace App\Http\Controllers;

use App\Models\rdv;
use Illuminate\Http\Request;
use App\Models\Agenda;
use App\Models\User; 
use Illuminate\Support\Facades\Log;

class RdvController extends Controller
{
    public function index()
    {
        return Rdv::all();
    }

    

    public function store(Request $request)
{
    try {
        // Log the incoming request data
        Log::info('Incoming request data:', $request->all());

        // Validate incoming request
        $validatedData = $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'nom_ste' => 'required|string',
            'tva' => 'required|string',
            'tel' => 'required|string',
            'gsm' => 'required|string',
            'postal' => 'required|string', 
            'adresse' => 'required|string',
            'fournisseur' => 'required|string',
            'tarification' => 'required|string',
            'nbr_comp_elect' => 'required|integer',
            'nbr_comp_gaz' => 'required|integer',
            'ppv' => 'required|boolean', 
            'tarif' => 'required|boolean',
            'haute_tension' => 'required|boolean',
            'id_agent' => 'required|exists:users,id',
            'id_agenda' => 'required|exists:agendas,id',
            'start_date' => 'required|date',
                'end_date' => 'required|date|after:start_date',
        ]);
        // Convert dates to MySQL compatible format
        $validatedData['start_date'] = date('Y-m-d H:i:s', strtotime($validatedData['start_date']));
        $validatedData['end_date'] = date('Y-m-d H:i:s', strtotime($validatedData['end_date']));

        // Create the Rdv
        $rdv = Rdv::create($validatedData);


        // Create the Rdv
        $rdv = Rdv::create($validatedData);

        // Return a response indicating success
        return response()->json([
            'message' => 'Rdv created successfully',
            'rdv' => $rdv,
            'received_data' => $validatedData // Include received data in the response
        ], 201);
    } catch (\Exception $e) {
        // Log the error message
        Log::error('Failed to create Rdv: ' . $e->getMessage());

        // Return a response with error message if an exception occurs
        return response()->json([
            'message' => 'Failed to create Rdv: ' . $e->getMessage(),
            'received_data' => $request->all() // Include received data in the response
        ], 500);
    }
}




    public function show($id)
    {
        return Rdv::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $rdv = Rdv::findOrFail($id);
        $rdv->update($request->all());

        return $rdv;
    }

    public function destroy($id)
    {
        $rdv = Rdv::findOrFail($id);
        $rdv->delete();

        return 204; // No content
    }
    // /**
    //  * Store a newly created resource in storage.
    //  *
    //  * @param  \Illuminate\Http\Request  $request
    //  * @return \Illuminate\Http\Response
    //  */
    // public function store(Request $request)
    // {
    //     // Valider les données du formulaire (à adapter selon vos besoins)
    //     $validatedData = $request->validate([
    //         // Ajoutez ici les règles de validation pour chaque attribut
    //     ]);

    //     // Créer un nouveau RDV
    //     $rdv = Rdv::create($validatedData);

    //     return response()->json($rdv, 201);
    // }
}
