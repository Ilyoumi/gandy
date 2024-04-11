<?php

namespace App\Http\Controllers;

use App\Models\rdv;
use Illuminate\Http\Request;
use App\Models\Agenda;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class RdvController extends Controller
{


    public function getAgentByAppointmentId($id)
    {
        try {
            // Find the appointment by ID
            $appointment = rdv::findOrFail($id);

            // Extract and return the agent ID
            $agentId = $appointment->id_agent;

            return response()->json(['agentId' => $agentId]);
        } catch (\Exception $e) {
            // Handle error if appointment is not found
            return response()->json(['error' => 'Appointment not found'], 404);
        }
    }



    public function index()
    {
        try {
            $rdvs = Rdv::all();
            return response()->json($rdvs);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while fetching RDVs.'], 500);
        }
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
        try {
            $rdv = Rdv::findOrFail($id);
            return response()->json($rdv);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Appointment not found.'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while fetching appointment details.'], 500);
        }
    }

    public function indexByUser($userId)
    {
        try {
            // Fetch appointments for the specified user ID
            $rdvs = Rdv::where('id_agent', $userId)->get();

            return response()->json($rdvs);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while fetching RDVs.'], 500);
        }
    }

    public function indexExceptUser(Request $request)
    {
        try {
            // Get the logged-in user's ID
            $loggedInUserId = auth()->user()->id;

            // Fetch all appointments except those associated with the logged-in user
            $rdvs = Rdv::where('id_agent', '!=', $loggedInUserId)->get();

            return response()->json($rdvs);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while fetching RDVs.'], 500);
        }
    }


    public function update(Request $request, $id)
    {
        // Validate the incoming request data
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

        try {
            // Find the Rdv by ID
            $rdv = Rdv::findOrFail($id);

            // Update the Rdv with the validated data
            $rdv->update($validatedData);

            // Return a success response
            return response()->json(['message' => 'Rdv updated successfully'], 200);
        } catch (\Exception $e) {
            // Return an error response if something goes wrong
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    public function destroy($id)
    {
        try {
            $rdv = Rdv::findOrFail($id);
            $rdv->delete();

            return response()->json([
                'message' => 'Rdv deleted successfully',
            ], 204);
        } catch (\Exception $e) {
            // Log the error message
            Log::error('Failed to delete Rdv: ' . $e->getMessage());

            // Return a response with error message if an exception occurs
            return response()->json([
                'message' => 'Failed to delete Rdv: ' . $e->getMessage(),
            ], 500);
        }
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
