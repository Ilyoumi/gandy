import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";


export default function App() {
    return <FullCalendar defaultView="dayGridMonth" plugins={[dayGridPlugin]} />;
}