<?php

namespace App\Http\Controllers;

use App\Models\rdv;
use Illuminate\Http\Request;

class RdvController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\rdv  $rdv
     * @return \Illuminate\Http\Response
     */
    public function show(rdv $rdv)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\rdv  $rdv
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, rdv $rdv)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\rdv  $rdv
     * @return \Illuminate\Http\Response
     */
    public function destroy(rdv $rdv)
    {
        //
    }

    //  /**
    //  * Display a listing of the resource.
    //  *
    //  * @return \Illuminate\Http\Response
    //  */
    // public function index()
    // {
    //     // Récupérer tous les RDVs avec les relations user et agenda
    //     $rdvs = Rdv::with(['user', 'agenda'])->get();
    //     return response()->json($rdvs);
    // }

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
