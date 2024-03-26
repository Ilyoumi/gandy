<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    // Routes pour les utilisateurs
    Route::apiResource('users', 'UserController');

    // Routes pour les agendas
    Route::apiResource('agendas', 'AgendaController');

    // Routes pour les rendez-vous (RDVs)
    Route::apiResource('rdvs', 'RdvController');
});
