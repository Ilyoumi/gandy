import frLocale from "@fullcalendar/core/locales/fr";


export function fullCalendarConfig(appointments, handleAddAppointment, agentId, agendaId,handleEventDrop) {
    return {
        initialView: "dayGridMonth",
        eventDrop: handleEventDrop,
        droppable: true,
        weekends: true,
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        eventDisplay: "block",
        eventBackgroundColor: "#52c41a",
        eventBorderColor: "#87d068",
        locale: frLocale,
        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        buttonText: {
            today: "Aujourd'hui",
            month: "Mois",
            week: "Semaine",
            day: "Jour",
            list: "Liste",
        },
        slotDuration: "00:30:00",
        handleWindowResize: true,
        dateClick: (arg) => handleAddAppointment(arg, agentId, agendaId),
        events: appointments.map((appointment) => ({
            id: appointment.id,
            title: `${appointment.nom} ${appointment.prenom}`,
            start: appointment.start_date
                ? new Date(appointment.start_date.replace(" ", "T"))
                : null,
            end: appointment.end_date
                ? new Date(appointment.end_date.replace(" ", "T"))
                : null,
            postal: appointment.postal,
            status: appointment.status,
        })),
    };
}