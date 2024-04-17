// api.js

import { axiosClient } from "../../../api/axios";
import { fullCalendarConfig } from "../services/calendarConfig";

// Fetches the agenda for the logged-in user (agent) and sets agenda ID and appointments
export const fetchAgentAgenda = async (
    userContext,
    setAgendaId,
    setAppointments
) => {
    try {
        const response = await axiosClient.get(
            `/api/users/${userContext.userId}/agenda`
        );
        const agenda = response.data.agenda;
        setAgendaId(agenda.id);
        fetchAppointments(agenda.id, setAppointments);
    } catch (error) {
        console.error("Error fetching agent agenda:", error);
    }
};

// Fetches appointments for the specified agenda ID and updates the state
export const fetchAppointments = async (agendaId, setAppointments) => {
    try {
        const response = await axiosClient.get(
            `/api/agendas/${agendaId}/appointments`
        );
        const appointmentsData = response.data.rdvs.map((appointment) => ({
            id: appointment.id,
            title: `${appointment.nom} ${appointment.prenom}`,
            start: appointment.start_date
                ? new Date(appointment.start_date.replace(" ", "T"))
                : null,
            end: appointment.end_date
                ? new Date(appointment.end_date.replace(" ", "T"))
                : null,
            postal: appointment.postal,
        }));
        setAppointments(appointmentsData);
    } catch (error) {
        console.error("Error fetching appointments:", error);
    }
};

// Fetches agent commercial users and updates the state
export const fetchAgentCommercialUsers = async (setAgentCommercialUsers) => {
    try {
        const response = await axiosClient.get("/api/users/agent-commercial");
        setAgentCommercialUsers(response.data.users);
    } catch (error) {
        console.error("Error fetching agent commercial users:", error);
    }
};

// Fetches agendas and appointments for all agendas, updates state with them
export const fetchAgendasAndAppointments = async (
    setAgendas,
    setAppointments,
    agendaId
) => {
    try {
        // Fetch all agendas
        const agendasResponse = await axiosClient.get("/api/agendas");
        const agendas = agendasResponse.data.agendas;
        console.log("Agendas from response:", agendas);

        // Fetch appointments for each agenda
        const allAppointments = [];
        for (const agenda of agendas) {
            console.log("Agendas id from response:", agenda.id);

            try {
                const appointmentsResponse = await axiosClient.get(
                    `/api/agendas/${agenda.id}/appointments`
                );
                const appointmentsForAgenda = appointmentsResponse.data.rdvs.map((appointment) => ({
                    ...appointment,
                    start: appointment.start_date ? new Date(appointment.start_date.replace(" ", "T")) : null,
                    end: appointment.end_date ? new Date(appointment.end_date.replace(" ", "T")) : null,
                    agendaId: agenda.id,
                    id_agent: appointment.id_agent,
                }));
                allAppointments.push(...appointmentsForAgenda);
            } catch(error) {
                console.error("Error fetching appointments:", error.response.data.error);
            }
        }

        console.log("All Appointments:", allAppointments);

        // Update state with agendas and appointments
        setAgendas(agendas);
        setAppointments(allAppointments);
        console.log("Appointments fetchAgendasAndAppointments", allAppointments);
    } catch (error) {
        console.error("Error fetching agendas:", error.message);
    }
};


// Handles agenda creation, updates state with FullCalendar data
export const handleAgendaCreated = async (
    agendaId,
    agendaName,
    userContext,
    appointments,
    handleAddAppointment,
    agentId,
    handleEventDrop,
    axiosClient,
    setAppointments
) => {
    console.log("userContext.userId", userContext.userId);
    try {
        // Combine the default event with existing events from the database
        const updatedEvents = [...appointments];
        const config = fullCalendarConfig(
            appointments,
            handleAddAppointment,
            agentId,
            agendaId,
            handleEventDrop
        );
        console.log("fullCalendarConfig", config);

        // Update existing agenda with FullCalendar data
        const response = await axiosClient.put(`/api/agendas/${agendaId}`, {
            name: agendaName,
            fullcalendar_config: config,
            contact_id: userContext.userId,
        });

        console.log("Agenda updated with FullCalendar data:", response.data);

        // Update appointments state with the updated events
        setAppointments(updatedEvents);
        console.log("appointments handleAgendaCreated", updatedEvents);
    } catch (error) {
        console.log("Response data:", error.response.data);

        console.error("Error updating agenda with FullCalendar data:", error);
        // Handle error
    }
};

// Handles appointment click event, fetches agent ID and appointment details
export const handleAppointmentClick = async (
    event,
    userContext,
    setAgentId,
    setAppointmentDetails,
    setSelectedRowData,
    setShowDetailModal,
    setSelectedAppointment,
    axiosClient,
    agendaId,
    selectedRowData
) => {
    console.log("event", event);

    try {
        // Make a GET request to fetch the agent ID by appointment ID
        const response = await axiosClient.get(
            `/api/appointments/${event.id}/agent`
        );

        // Extract the agent ID from the response data
        const agentId = response.data.agentId;
        setAgentId(agentId);
        console.log("Fetched agent ID:", agentId);
        console.log("Fetched data :", response.data);
        console.log("agenda id ------", agendaId);
        console.log("agent id ------", agentId);
        console.log("context loggin id id ------", userContext.userId);
        console.log("app id ------", event.id);

        // Compare the agent ID with the logged-in user's ID
        if (
            agentId === userContext.userId ||
            userContext.userRole === "Superviseur"
        ) {
            const response = await axiosClient.get(`/api/rdvs/${event.id}`);
            // Extract the appointment details from the response data
            const appointmentDetails = response.data;
            // Update the state with the fetched appointment details
            setAppointmentDetails(appointmentDetails);
            setSelectedRowData(appointmentDetails);
            // Show the update modal
            setShowDetailModal(true);
            setSelectedAppointment(event);
            console.log("user is either a superviseur or teh owner");
            console.log("selectedRowData", selectedRowData, setShowDetailModal);
        } else {
            console.log("user is not either a superviseur or teh owner");
        }
    } catch (error) {
        console.error("Error fetching agent ID:", error);
    }
};

// Handles adding a new appointment
export const handleAddAppointment = (
    agentId,
    agendaId,
    arg,
    userContext,
    setSelectedDate,
    setShowAddModal
) => {
    setSelectedDate({ date: arg.date, agentId, agendaId });
    setShowAddModal(true);
};

// Handles form submission for new appointment
export const handleFormSubmit = async (
    newAppointment,
    setAppointments,
    agendaId,
    setAgendas,
    handleCloseModal,
    setShowUpdateModal,
    appointments,
    setSelectedDate
) => {
    try {
        console.log("New appointment:", newAppointment);

        // Update appointments state using the state updater function
        setAppointments((prevAppointments) => [
            ...prevAppointments,
            newAppointment,
        ]);

        // Fetch agendas and appointments after updating appointments state
        fetchAgendasAndAppointments(setAgendas, setAppointments,agendaId);

        console.log("setAppointments:", appointments);
        handleCloseModal();
        setShowUpdateModal(false);
        setSelectedDate(null )
    } catch (error) {
        console.error("Error handling form submission:", error);
    }
};

// Handles event drop (drag-and-drop) for appointments
export const handleEventDrop = async (info, appointments, setAppointments) => {
    console.log("handleEventDrop called", info);
    try {
        const { event } = info;
        const updatedAppointment = {
            id: event.id,
            start_date: event.start.toISOString(),
            end_date: event.end.toISOString(),
        };
        console.log("event", event);
        // Log the updated appointment before sending the request
        console.log("Updated Appointment:", updatedAppointment);

        // Update appointment in the database
        const response = await axiosClient.put(
            `/api/rdvs/${event.id}`,
            updatedAppointment
        );
        console.log("Appointment updated successfully:", response.data);

        // Update appointments state with the updated event
        const updatedAppointments = appointments.map((appointment) => {
            if (appointment.id === event.id) {
                return {
                    ...appointment,
                    start_date: updatedAppointment.start_date,
                    end_date: updatedAppointment.end_date,
                };
            }
            return appointment;
        });
        setAppointments(updatedAppointments);
        console.log("appointments handleEventDrop", updatedAppointments);
    } catch (error) {
        console.error("Error updating appointment:", error);
    }
};
