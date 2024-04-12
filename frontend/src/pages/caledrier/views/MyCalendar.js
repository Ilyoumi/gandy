import React, { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import { Modal, Card, Checkbox, Button, Space } from "antd";
import AddAppointment from "./AddAppoitment";
import NewButton from "../../../constants/NewButton";
import AddAgendaModal from "./AddAgenda";
import { axiosClient } from "../../../api/axios";
import UpdateRdv from "../../rdv/views/UpdateRdv";

function MyCalendar() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addAgendaModalVisible, setAddAgendaModalVisible] = useState(false);
    const [agentCommercialUsers, setAgentCommercialUsers] = useState([]);
    const [agendas, setAgendas] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [agentId, setAgentId] = useState(null);
    const [agendaId, setAgendaId] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [userRole, setUserRole] = useState("");
    const [userId, setUserId] = useState("");
    const [agent, setAgent] = useState("");
    let userName = "Unknown User";
// Find the user corresponding to the first agenda item
const firstAgenda = agendas.find(
    (agenda) => selectedItems.includes(agenda.contact_id)
);
if (firstAgenda) {
    const user = agentCommercialUsers.find(
        (user) => user.id === firstAgenda.contact_id
    );
    userName = user ? `${user.prenom} ${user.nom}` : "Unknown User";
}

    useEffect(() => {
        // Function to fetch user data
        const fetchUserData = async () => {
            try {
                // Check if the user is logged in
                const authToken = localStorage.getItem("auth_token");
                if (!authToken) {
                    // User is not logged in, do nothing
                    console.log("User is not logged in");
                    return;
                }

                // User is logged in, fetch user data
                const response = await axiosClient.get("/api/user", {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                const { role, id } = response.data;
                setUserRole(response.data.role);
                setUserId(response.data.id);
                console.log("User info", role, id);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        // Initial fetch
        fetchUserData();

        // Periodically fetch user data every second
        const interval = setInterval(fetchUserData, 5 * 60 * 1000);

        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Fetch users with role "Agent Commercial" when the component mounts
        fetchAgentCommercialUsers();
        fetchAgendasAndAppointments();
    }, []);

    useEffect(() => {
        // Set the first user as selected when component mounts
        if (agentCommercialUsers.length > 0) {
            setSelectedItems([agentCommercialUsers[0].id]);
        }
    }, [agentCommercialUsers]);

    useEffect(() => {
        // Fetch appointments for the default agenda when agendas or default agenda change
        if (agendaId) {
            fetchAgendasAndAppointments(agendaId);
            fetchAppointmentsForUser()
        }
    }, [agendaId]);

    // Function to handle appointment click

    const fetchAgentCommercialUsers = async () => {
        try {
            const response = await axiosClient.get(
                "/api/users/agent-commercial"
            );
            setAgentCommercialUsers(response.data.users);
        } catch (error) {
            console.error("Error fetching agent commercial users:", error);
        }
    };

    const handleOpenAddAgendaModal = () => {
        setAddAgendaModalVisible(true);
    };

    const handleAddAppointment = (arg, agentId, agendaId) => {
        console.log("Agent ID:", agentId);
        console.log("Agenda ID:", agendaId);
        setSelectedDate({ date: arg.date, agentId, agendaId });
        setShowAddModal(true);
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
    };

    const handleFormSubmit = (newAppointment) => {
        setAppointments([...appointments, newAppointment]);
        fetchAgendasAndAppointments(agendaId);
        handleCloseModal();
    };

    const fetchAppointmentsForUser = async () => {
        try {

            // Fetch appointments for the user using the user ID
            const response = await axiosClient.get(`/api/appointments/user/${userId}`);
            const userAppointments = response.data;
            console.log("RDV for user id", userId) 
            console.log("RDV for user", response.data) 
            setAgent(response.data.id_agent)
            // Set the fetched appointments to the state
            setAppointments(userAppointments);
        } catch (error) {
            console.error("Error fetching appointments for the user:", error);
        }
    };

    const fetchAgendasAndAppointments = async () => {
        try {
            // Fetch all agendas

            const agendasResponse = await axiosClient.get("/api/agendas");
            const agendas = agendasResponse.data.agendas;
            console.log("Agendas:", agendas);

            // Fetch appointments for each agenda
            const allAppointments = [];
            for (const agenda of agendas) {
                const appointmentsResponse = await axiosClient.get(
                    `/api/agendas/${agenda.id}/appointments`
                );
                const appointmentsForAgenda =
                    appointmentsResponse.data.rdvs.map((appointment) => ({
                        title: `${appointment.nom} ${appointment.prenom}`,
                        start: appointment.start_date
                            ? new Date(appointment.start_date.replace(" ", "T"))
                            : null,
                        end: appointment.end_date
                            ? new Date(appointment.end_date.replace(" ", "T"))
                            : null,
                        agendaId: agenda.id,
                        postal: appointment.postal,
                    }));
                allAppointments.push(...appointmentsForAgenda);
            }

            console.log("All Appointments:", allAppointments);

            // Update state with agendas and appointments
            setAgendas(agendas);
            setAppointments(allAppointments);
        } catch (error) {
            console.error("Error fetching agendas and appointments:", error);
        }
    };

    const handleEventDrop = async (info) => {
        console.log("handleEventDrop called", info);
        try {
            const { event } = info;
            const updatedAppointment = {
                id: event.id,
                start_date: event.start.toISOString(),
                end_date: event.end.toISOString(),
            };

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
        } catch (error) {
            console.error("Error updating appointment:", error);
        }
    };

    function fullCalendarConfig() {
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
            })),
        };
    }

    const handleAgendaCreated = async (agendaId, agendaName) => {
        try {
            // Combine the default event with existing events from the database
            const updatedEvents = [...appointments];
            const config = fullCalendarConfig();
            console.log("fullCalendarConfig", config);

            // Update existing agenda with FullCalendar data
            const response = await axiosClient.put(`/api/agendas/${agendaId}`, {
                fullcalendar_config: config,
            });

            console.log(
                "Agenda updated with FullCalendar data:",
                response.data
            );

            // Update appointments state with the updated events
            setAppointments(updatedEvents);
        } catch (error) {
            console.log("Response data:", error.response.data);

            console.error(
                "Error updating agenda with FullCalendar data:",
                error
            );
            // Handle error
        }
    };

   

    const config = fullCalendarConfig();
    const handleAppointmentClick = (event) => { 
        if (userId === agent) {
            console.log("Agent is logged in");
        } else {
            console.log("Agent is not logged in");
        }
    };


    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "30px",
            }}
        >
            <Card title="Calendriers des contacts" style={{ width: "15%" }}>
            <Checkbox.Group
                onChange={setSelectedItems}
                value={selectedItems}
            >
                {agentCommercialUsers.map((user, index) => (
                    <Checkbox
                        key={index}
                        value={user.id}
                        checked={selectedItems.includes(user.id)}
                        onClick={() => handleCheckboxClick(user.id)}
                        style={{ margin: 0 }} // Apply custom style to remove margin
                    >
                        {user.prenom} {user.nom}
                    </Checkbox>
                ))}
            </Checkbox.Group>
            </Card>
            <Card style={{ width: "83%" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>{userName}</h2>
                {(userRole === "Admin" || userRole === "Superviseur") && (
                    <NewButton
                        onClick={handleOpenAddAgendaModal}
                        loading={loading}
                        buttonText="Nouveau Calendrier"
                    />
                )}
            </div>



                <AddAgendaModal
                    visible={addAgendaModalVisible}
                    onCancel={() => setAddAgendaModalVisible(false)}
                    onAgendaCreated={handleAgendaCreated}
                />
                {agendas.length === 0 && (
                    <div>
                        <h2>Agenda par défaut</h2>
                        <Card style={{ marginBottom: "30px" }}>
                            <FullCalendar
                                plugins={[
                                    dayGridPlugin,
                                    timeGridPlugin,
                                    interactionPlugin,
                                ]}
                                {...config}
                            />
                        </Card>
                    </div>
                )}
            {loading ? ( 
                <Spin  style={{ textAlign: "center", paddingTop: "50vh", position:"relative", left:"50%" }} size="large" />
            ) : (
            <>
                <ContactList
                agentCommercialUsers={agentCommercialUsers}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                agendas={agendas}
                agentId={agentId}
                setAgentId={setAgentId}
                agendaId={agendaId}
                setAgendaId={setAgendaId}
            />
                <Card style={{ width: "83%" }}>
                    {(userContext.userRole === "Admin" ||
                        userContext.userRole === "Superviseur") && (
                        <NewButton
                            onClick={handleOpenAddAgendaModal}
                            loading={loading}
                            buttonText="Nouveau Calendrier"
                        />
                    )}
                    <AddAgendaModal
                        visible={addAgendaModalVisible}
                        onCancel={() => setAddAgendaModalVisible(false)}
                        onAgendaCreated={handleAgendaCreated}
                    />
                    {agendas.length === 0 && (
                        <div>
                            <h2>Agenda par défaut</h2>
                            <Card style={{ marginBottom: "30px" }}>
                                <FullCalendar
                                    plugins={[
                                        dayGridPlugin,
                                        timeGridPlugin,
                                        interactionPlugin,
                                    ]}
                                    {...config}
                                />
                            </Card>
                        </div>
                    )}

                    {agendas
                        .filter((agenda) =>
                            selectedItems.includes(agenda.contact_id)
                        )
                        .sort(
                            (a, b) =>
                                selectedItems.indexOf(a.contact_id) -
                                selectedItems.indexOf(b.contact_id)
                        )
                        .map((agenda, index) => {
                            // Find the user corresponding to the contact ID
                            const user = agentCommercialUsers.find(
                                (user) => user.id === agenda.contact_id
                            );
                            const userName = user
                                ? `${user.prenom} ${user.nom}`
                                : "Unknown User";
                {agendas
                    .filter((agenda) =>
                        selectedItems.includes(agenda.contact_id)
                    )
                    .sort(
                        (a, b) =>
                            selectedItems.indexOf(a.contact_id) -
                            selectedItems.indexOf(b.contact_id)
                    )
                    .map((agenda, index) => {
                        // Find the user corresponding to the contact ID
                        const user = agentCommercialUsers.find(
                            (user) => user.id === agenda.contact_id
                        );
                        const userName = user
                            ? `${user.prenom} ${user.nom}`
                            : "Unknown User";
                         
    

                        return (
                            <div key={index}>
                                {/* Display user's name as the title */}
                                    {agenda.fullcalendar_config && (
                                        <FullCalendar
                                            plugins={[
                                                dayGridPlugin,
                                                timeGridPlugin,
                                                interactionPlugin,
                                            ]}
                                            {...JSON.parse(
                                                agenda.fullcalendar_config
                                            )}
                                            dateClick={(arg) =>
                                                handleAddAppointment(
                                                    arg,
                                                    user.id,
                                                    agenda.id
                                                )
                                            }
                                            eventClick= {(info) => handleAppointmentClick(info.event)}
                                            events={appointments
                                                .filter(
                                                    (appointment) =>
                                                        appointment.agendaId ===
                                                        agenda.id
                                                )
                                                .map((filteredAppointment) => ({
                                                    id: filteredAppointment.start,
                                                    title: `${filteredAppointment.title} - ${filteredAppointment.postal}`,
                                                    start: filteredAppointment.start,
                                                    end: filteredAppointment.end,
                                                }))}
                                        />
                                    )}
                            </div>
                        );
                    })}
            </Card>
            <Modal
                visible={showAddModal}
                title="Nouveau rendez-vous"
                onCancel={handleCloseModal}
                footer={null}
                width={1000}
            >
                <AddAppointment
                    selectedDate={selectedDate}
                    onFormSubmit={handleFormSubmit}
                    agentId={agentId}
                    agendaId={agendaId}
                />
            </Modal>
            <Modal
                visible={showUpdateModal}
                title="Modifier rendez-vous"
                onCancel={() => setShowUpdateModal(false)}
                footer={null}
                width={1000}
            >
                {selectedAppointment && (
                    <UpdateRdv
                        appointment={selectedAppointment}
                        onClose={() => setShowUpdateModal(false)}
                    />
                )}
            </Modal>
        </div>
    );
}

export default MyCalendar;
