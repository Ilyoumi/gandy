<?php

use App\Http\Controllers\AgendaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

Route::post('/register', [RegisteredUserController::class, 'store']);

// Route for user login
Route::post('/login', [AuthenticatedSessionController::class, 'login']);
Route::get('/login', [AuthenticatedSessionController::class, 'getUser']);
Route::post('/logout', [AuthenticatedSessionController::class, 'logout']);
Route::post('/users', [UserController::class, 'store']);
Route::get('/users/agent-commercial', [UserController::class, 'getUsersByRole']);

// Route::middleware('auth:sanctum')->group(function () {
// Route for fetching all users
Route::get('users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store'])->middleware('web');
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);
Route::get('/csrf-token', function () {
    return response()->json(['csrfToken' => csrf_token()]);
});
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/agendas', [AgendaController::class, 'store']);

// Routes pour les agendas
Route::apiResource('agendas', AgendaController::class);

// Routes pour les rendez-vous (RDVs)
Route::apiResource('rdvs', 'RdvController');
