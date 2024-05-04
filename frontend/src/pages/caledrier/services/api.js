// api.js

import { axiosClient } from "../../../api/axios";
import { fullCalendarConfig } from "../services/calendarConfig";

export const handleDeleteAppointment = (appointmentId, appointments, setAppointments, setShowUpdateModal) => {
	try {
			const updatedAppointments = appointments.filter(
					(appointment) => appointment.id !== appointmentId
			);
			setAppointments(updatedAppointments);
			setShowUpdateModal(false);
	} catch (error) {
			console.error("Error deleting appointment:", error);
	}
};


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


// Fetches agendas and appointments for all agendas, updates state with them
export const fetchAgendasAndAppointments = async (
    setAgendas,
    setAppointments,
) => {
    try {
        const agendasResponse = await axiosClient.get("/api/agendas");
        const agendas = agendasResponse.data.agendas;

        const allAppointments = [];
        for (const agenda of agendas) {
            try {

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


        setAgendas(agendas);
        setAppointments(allAppointments);

    } catch (error) {
        console.error("Error fetching agendas:", error.message);
    }
};
// Handles agenda creation, updates state with FullCalendar data in api.js
export const handleAgendaCreated = async (
    agendaId,
    agendaName,
    contactId,
    appointments,
    handleAddAppointment,
    agentId,
    handleEventDrop,
    axiosClient,
    setAppointments
) => {
    try {
        const updatedEvents = [...appointments];
        const config = fullCalendarConfig(
            appointments,
            handleAddAppointment,
            agentId,
            agendaId,
            handleEventDrop
        );
        const response = await axiosClient.put(`/api/agendas/${agendaId}`, {
            name: agendaName,
            fullcalendar_config: config,
            contact_id: contactId,
        });


        if (response && response.data) {
            setAppointments(updatedEvents);
        } else {
            console.error("Unexpected response from server:", response);
        }

        setAppointments(updatedEvents);
    } catch (error) {

        console.error("Error updating agenda with FullCalendar data:", error);
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

    try {
        const response = await axiosClient.get(
            `/api/appointments/${event.id}/agent`
        );

        const agentId = response.data.agentId;
        setAgentId(agentId);

        if (
            agentId === userContext.userId ||
            userContext.userRole === "Superviseur" || userContext.userRole === "Agent" || userContext.userRole === "Admin"
        ) {
            const response = await axiosClient.get(`/api/rdvs/${event.id}`);
            const appointmentDetails = response.data;
            setAppointmentDetails(appointmentDetails);
            setSelectedRowData(appointmentDetails);
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

export const handleBlockAppointment = (
    agentId,
    agendaId,
    arg,
    userContext,
    setSelectedDate,
    setShowBlockModal,
    setAgentName
) => {

    setSelectedDate({ date: arg.date, agentId, agendaId });
    setShowBlockModal(true)
    
};

export const handleFormSubmit = async (
    newAppointment,
    setAppointments,
    agendaId,
    setAgendas,
    handleCloseModal,
    handleCloseBlockModal,
    setShowUpdateModal,
    appointments,
    setSelectedDate
) => {
    try {

        setAppointments((prevAppointments) => [
            ...prevAppointments,
            newAppointment,
        ]);

        fetchAgendasAndAppointments(setAgendas, setAppointments, agendaId);

        handleCloseModal();
        handleCloseBlockModal()
        setShowUpdateModal(false);
        setSelectedDate(null);
    } catch (error) {
        console.error("Error handling form submission:", error);
    }
};

// Handles event drop (drag-and-drop) for appointments
export const handleEventDrop = async (info, appointments, setAppointments) => {
    try {
        const { event } = info;
        const updatedAppointment = {
            id: event.id,
            start_date: event.start.toISOString(),
            end_date: event.end.toISOString(),
        };

        const response = await axiosClient.put(
            `/api/rdvs/${event.id}`,
            updatedAppointment
        );

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
    } catch (error) {
        console.error("Error updating appointment:", error);
    }
};
