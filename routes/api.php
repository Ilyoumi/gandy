<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoleController;

Route::middleware('auth:sanctum')->group(function () {
    // Routes pour les utilisateurs
    Route::apiResource('users', 'UserController');

    // Routes pour les agendas
    Route::apiResource('agendas', 'AgendaController');

    // Routes pour les rendez-vous (RDVs)
    Route::apiResource('rdvs', 'RdvController');

    Route::apiResource('roles', RoleController::class);

//     use App\Http\Controllers\UserController;
// use App\Http\Controllers\RoleController;
// use Illuminate\Support\Facades\Route;

// Route::get('/users', [UserController::class, 'index']);
// Route::post('/users', [UserController::class, 'store']);
// // Ajoutez d'autres routes pour show, update, delete si nécessaire

// Route::get('/roles', [RoleController::class, 'index']);
// Route::post('/roles', [RoleController::class, 'store']);
// // Ajoutez d'autres routes pour show, update, delete si nécessaire




});
