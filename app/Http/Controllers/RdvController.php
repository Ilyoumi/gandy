<?php

namespace App\Http\Controllers;

use App\Models\rdv;
use Illuminate\Http\Request;
use App\Models\Agenda;
use App\Models\User; 

class RdvController extends Controller
{
    public function index()
    {
        return Rdv::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'nom_ste' => 'required|string',
            'tva' => 'required|string',
            'tel' => 'required|string',
            'gsm' => 'required|string',
            'fournisseur' => 'required|boolean',
            'tarification' => 'required|string',
            'nbr_comp_elect' => 'required|integer',
            'nbr_comp_gaz' => 'required|integer',
            'tarif' => 'required|boolean',
            'haute_tension' => 'required|boolean',
            'id_agent' => 'required|exists:users,id',
            'id_agenda' => 'required|exists:agendas,id',
        ]);

        return Rdv::create($request->all());
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
