<?php

use App\Http\Controllers\AgendaController;
use App\Http\Controllers\CalendarController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\RdvController;

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



// Routes pour les agendas
Route::post('/agendas', [AgendaController::class, 'store']);
Route::get('/agendas/{id}', [AgendaController::class, 'show']);
Route::get('/agendas/{agendaId}/calendar', [CalendarController::class, 'getCalendarEvents']);
Route::put('/agendas/{id}', [AgendaController::class, 'update']);
Route::get('/agendas', [AgendaController::class, 'index']);
Route::get('/agendas/{agendaId}/appointments', [AgendaController::class, 'getAppointments']);
Route::get('/users/{userId}/agendas', 'App\Http\Controllers\AgendaController@getUserAgendas');
// Define the route for creating calendar events
Route::post('/calendars', [CalendarController::class, 'store']);

// Routes pour les rendez-vous (RDVs)
Route::post('/rdvs', [RdvController::class, 'store']);
Route::get('/rdvs', [RdvController::class, 'index']);
Route::put('/rdvs/{id}', [RdvController::class, 'update']);
Route::delete('/rdvs/{id}', [RdvController::class, 'destroy']);
Route::get('/rdvs/{id}', [RdvController::class, 'show']);
Route::get('/appointments/user/{userId}', [RdvController::class, 'indexByUser']);
Route::get('/agendas/{agenda}/appointmentsExceptUser', [RdvController::class, 'indexExceptUser']);



