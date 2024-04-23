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
            status: appointment.status,
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

// Function to fetch contact information by contact ID
export const fetchContactInfo = async (contactId, contactName,
    setContactName,
    contactEmail,
    setContactEmail) => {
    let contactResponse
    try {
        contactResponse = await axiosClient.get(`/api/users/${contactId}`);
        const { nom, prenom, email } = contactResponse.data;
        setContactName(`${prenom} ${nom}`);
        setContactEmail(email);
        console.log("contact information:", contactName, contactEmail);

    } catch (error) {
        console.error("Error fetching contact information:", contactResponse.data);
    }
};

// Fetches agendas and appointments for all agendas, updates state with them
export const fetchAgendasAndAppointments = async (
    setAgendas,
    setAppointments,
    agendaId,
    contactName,
    setContactName,
    contactEmail,
    setContactEmail
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
            const contactId = agenda.contact_id;
            console.log("conqtct id ", contactId)
            try {
                // Fetch contact details for the agenda
                await fetchContactInfo(contactId, contactName,
                    setContactName,
                    contactEmail,
                    setContactEmail);
                const appointmentsResponse = await axiosClient.get(
                    `/api/agendas/${agenda.id}/appointments`
                );
                const appointmentsForAgenda =
                    appointmentsResponse.data.rdvs.map((appointment) => ({
                        ...appointment,
                        start: appointment.start_date
                            ? new Date(appointment.start_date.replace(" ", "T"))
                            : null,
                        end: appointment.end_date
                            ? new Date(appointment.end_date.replace(" ", "T"))
                            : null,
                        agendaId: agenda.id,
                        id_agent: appointment.id_agent,
                        status: appointment.status,
                    }));
                allAppointments.push(...appointmentsForAgenda);
            } catch (error) {
                console.error(
                    "Error fetching appointments:",
                    error.response.data.error
                );
            }
        }

        console.log("All Appointments:", allAppointments);

        // Update state with agendas and appointments
        setAgendas(agendas);
        setAppointments(allAppointments);
        console.log(
            "Appointments fetchAgendasAndAppointments",
            allAppointments
        );
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
        
        console.log("Response from server:", response);
        
        // Check if response is defined before accessing its data property
        if (response && response.data) {
            console.log("Agenda updated with FullCalendar data:", response.data);
            // Update appointments state with the updated events
            setAppointments(updatedEvents);
            console.log("appointments handleAgendaCreated", updatedEvents);
        } else {
            console.error("Unexpected response from server:", response);
        }
        

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
    console.log("event date", event.start)

    try {
        // Make a GET request to fetch the agent ID by appointment ID
        const response = await axiosClient.get(
            `/api/appointments/${event.id}/agent`
        );

        // Extract the agent ID from the response data
        const agentId = response.data.agentId;
        setAgentId(agentId);

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
            console.log(
                `User (${userContext.userId}) is either a supervisor or the owner. Agent ID: ${agentId}, User Role: ${userContext.userRole}`
            );

        } else {
            console.log(
                `User (${userContext.userId}) is neither a supervisor nor the owner. Agent ID: ${agentId}, User Role: ${userContext.userRole}`
            );
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
        fetchAgendasAndAppointments(setAgendas, setAppointments, agendaId);

        console.log("setAppointments:", appointments);
        handleCloseModal();
        setShowUpdateModal(false);
        setSelectedDate(null);
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
