<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;


Route::post('/register', [RegisteredUserController::class, 'store']);
// Route for user login
Route::post('/login', [AuthenticatedSessionController::class, 'login']);

// Route::middleware('auth:sanctum')->group(function () {
     // Route for fetching all users
     Route::get('users', [UserController::class, 'index']);

// Route::middleware('auth:sanctum')->group(function () {
    // Routes pour les utilisateurs


    // Routes pour les agendas
    Route::apiResource('agendas', 'AgendaController');

    // Routes pour les rendez-vous (RDVs)
    Route::apiResource('rdvs', 'RdvController');
// });

