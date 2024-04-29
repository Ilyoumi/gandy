<?php

namespace App\Http\Controllers;

use App\Models\rdv;
use Illuminate\Http\Request;
use Carbon\Carbon;
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



    public function index(Request $request)
    {
        try {
            $query = Rdv::query();
            if ($request->has('agent_id')) {
                // Filter appointments by agent ID
                $query->where('id_agent', $request->agent_id);
            }

            if ($request->has('agenda_id')) {
                // Filter appointments by agenda ID
                $query->where('id_agenda', $request->agenda_id);
            }

            if ($request->has('start_date')) {
                // Filter appointments by start date
                $query->whereDate('start_date', '>=', $request->start_date);
            }

            if ($request->has('end_date')) {
                // Filter appointments by end date
                $query->whereDate('start_date', '<=', $request->end_date);
            }

            // Order appointments by start date in ascending order
            $query->orderBy('start_date', 'asc');

            $rdvs = $query->get();

            return response()->json($rdvs);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while fetching RDVs.'], 500);
        }
    }


    public function getAppointmentStatisticsByMonth(Request $request)
    {
        try {
            $statistics = [];
    
            $currentMonth = Carbon::now()->month;
            $currentYear = Carbon::now()->year;
    
            $firstDayOfMonth = Carbon::create($currentYear, $currentMonth, 1)->startOfDay();
            $lastDayOfMonth = Carbon::create($currentYear, $currentMonth, 1)->endOfMonth();
    
            $appointments = Rdv::whereBetween('start_date', [$firstDayOfMonth, $lastDayOfMonth])->get();
            
            $annulerCount = $appointments->where('status', 'annuler')->count();
            $confirmerCount = $appointments->where('status', 'confirmer')->count();
            $nrpCount = $appointments->where('status', 'NRP')->count();
            $totalCount = $appointments->count();
            
            $statistics[] = [
                'month' => $firstDayOfMonth->format('F Y'),
                'annuler_count' => $annulerCount,
                'confirmer_count' => $confirmerCount,
                'nrp_count' => $nrpCount,
                'total_appointments' => $totalCount,
            ];
    
            return response()->json($statistics);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while fetching appointment statistics.'], 500);
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
                'prenom' => 'nullable|string',
                'nom_ste' => 'nullable|string',
                'tva' => 'nullable|string',
                'tel' => 'required|string',
                'gsm' => 'nullable|string',
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
                'commentaire' => 'nullable|string',
                'note' => 'nullable|string',
                'status' => 'nullable|string',
                'pro' => 'required|boolean',
            ]);

            $startDate = date('Y-m-d H:i:s', strtotime($validatedData['start_date']));
            $endDate = date('Y-m-d H:i:s', strtotime($validatedData['end_date']));

            // Check if the appointment with the same date range already exists
            $existingAppointment = Rdv::where(function ($query) use ($startDate, $endDate) {
                $query->where('start_date', '>=', $startDate)
                    ->where('end_date', '<=', $endDate)
                    ->orWhere(function ($query) use ($startDate, $endDate) {
                        $query->where('start_date', '<=', $startDate)
                            ->where('end_date', '>=', $endDate);
                    });
            })->exists();

            // If the appointment already exists, return an error response
            if ($existingAppointment) {
                return response()->json([
                    'message' => 'An appointment with the same date range already exists.',
                    'received_data' => $validatedData // Include received data in the response
                ], 409); // 409 Conflict status code indicates a conflict with the current state of the resource
            }

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

    public function bloquerRdv(Request $request)
    {
        try {
            Log::info('Incoming request data:', $request->all());

            $validatedData = $request->validate([
                'start_date' => 'required|date',
                'end_date' => 'required|date|after:start_date',
                'postal' => 'required|string',
                'commentaire' => 'nullable|string',
                'bloquer' => 'required|boolean',
                'id_agent' => 'required|exists:users,id',
                'id_agenda' => 'required|exists:agendas,id',
            ]);
            $validatedData['nom'] = $request->input('nom', '');
            $validatedData['prenom'] = $request->input('prenom', '');
            $validatedData['nom_ste'] = $request->input('nom_ste', '');
            $validatedData['tva'] = $request->input('tva', '');
            $validatedData['tel'] = $request->input('tel', '');
            $validatedData['gsm'] = $request->input('gsm', '');
            $validatedData['adresse'] = $request->input('adresse', '');
            $validatedData['fournisseur'] = $request->input('fournisseur', '');
            $validatedData['tarification'] = $request->input('tarification', '');
            $validatedData['nbr_comp_elect'] = $request->input('nbr_comp_elect', 0);
            $validatedData['nbr_comp_gaz'] = $request->input('nbr_comp_gaz', 0);
            $validatedData['ppv'] = $request->input('ppv', false);
            $validatedData['tarif'] = $request->input('tarif', false);
            $validatedData['haute_tension'] = $request->input('haute_tension', false);
            $startDate = date('Y-m-d H:i:s', strtotime($validatedData['start_date']));
            $endDate = date('Y-m-d H:i:s', strtotime($validatedData['end_date']));

            // Check if the appointment with the same date range already exists
            $existingAppointment = Rdv::where(function ($query) use ($startDate, $endDate) {
                $query->where('start_date', '>=', $startDate)
                    ->where('end_date', '<=', $endDate)
                    ->orWhere(function ($query) use ($startDate, $endDate) {
                        $query->where('start_date', '<=', $startDate)
                            ->where('end_date', '>=', $endDate);
                    });
            })->exists();

            // If the appointment already exists, return an error response
            if ($existingAppointment) {
                return response()->json([
                    'message' => 'An appointment with the same date range already exists.',
                    'received_data' => $validatedData // Include received data in the response
                ], 409); // 409 Conflict status code indicates a conflict with the current state of the resource
            }

            $rdv = Rdv::create($validatedData);


            return response()->json([
                'message' => 'Rdv blocked successfully',
                'rdv' => $rdv,
                'received_data' => $validatedData
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to block Rdv: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to create Rdv: ' . $e->getMessage(),
                'received_data' => $request->all()
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
            'prenom' => 'nullable|string',
            'nom_ste' => 'nullable|string',
            'tva' => 'nullable|string',
            'tel' => 'required|string',
            'gsm' => 'nullable|string',
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
            'start_date' => 'required|date_format:Y-m-d H:i:s',
            'end_date' => 'required|date_format:Y-m-d H:i:s|after:start_date',
            'commentaire' => 'nullable|string',
            'note' => 'nullable|string',
            'status' => 'nullable|string',
            'pro' => 'required|boolean',
            'modifiedBy'=> 'required|exists:users,id',
        ]);

        try {
            // Find the Rdv by ID
            $rdv = Rdv::findOrFail($id);
            // Convert dates to MySQL compatible format
            $startDate = date('Y-m-d H:i:s', strtotime($validatedData['start_date']));
            $endDate = date('Y-m-d H:i:s', strtotime($validatedData['end_date']));

            // Check if the appointment with the same date range already exists
            $existingAppointment = Rdv::where(function ($query) use ($startDate, $endDate, $rdv) {
                $query->where('start_date', '>=', $startDate)
                    ->where('end_date', '<=', $endDate)
                    ->orWhere(function ($query) use ($startDate, $endDate, $rdv) {
                        $query->where('start_date', '<=', $startDate)
                            ->where('end_date', '>=', $endDate);
                    });
            })->where('id', '!=', $rdv->id) // Exclude the current appointment
                ->exists();

            // If the appointment already exists, return an error response
            if ($existingAppointment) {
                return response()->json([
                    'message' => 'An appointment with the same date range already exists.',
                    'received_data' => $validatedData // Include received data in the response
                ], 409); // 409 Conflict status code indicates a conflict with the current state of the resource
            }
            $validatedData['updatedAt'] = Carbon::now(); // Add current timestamp


            // Update the Rdv with the validated data
            $rdv->update($validatedData);

            // Return a success response
            return response()->json([
                'message' => 'Rdv updated successfully',
                'rdv' => $rdv, // Include the updated Rdv object
                'received_data' => $validatedData // Include the received data
            ], 200);
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
