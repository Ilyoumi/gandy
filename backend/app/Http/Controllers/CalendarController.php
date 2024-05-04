<?php

namespace App\Http\Controllers;

use App\Models\Calendar;
use Illuminate\Http\Request;

class CalendarController extends Controller
{

    public function getCalendarEvents($agendaId)
    {
        try {
            $calendarEvents = Calendar::where('agenda_id', $agendaId)->get();
            return response()->json([
                'calendar_events' => $calendarEvents,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function index()
    {
        return Calendar::all();
    }

    public function store(Request $request)
{
    try {
        $request->validate([
            'agenda_id' => 'required|exists:agendas,id',
            'agenda_name' => 'required', // Add validation for agenda_name
        ]);

        $calendar = Calendar::create([
            'agenda_id' => $request->agenda_id,
            'agenda_name' => $request->agenda_name, // Assign the agenda name
        ]);

        return response()->json([
            'calendar' => $calendar,
        ], 201);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}



    public function show($id)
    {
        return Calendar::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $calendarEvent = Calendar::findOrFail($id);
        $calendarEvent->update($request->all());

        return $calendarEvent;
    }

    public function destroy($id)
    {
        $calendarEvent = Calendar::findOrFail($id);
        $calendarEvent->delete();

        return response()->json(null, 204);
    }
}
