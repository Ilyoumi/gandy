import React, { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import { Modal, Card, Checkbox } from "antd";
import AddAppointment from "./AddAppoitment";
import NewButton from "../../../constants/NewButton";
import AddAgendaModal from "./AddAgenda";
import { axiosClient } from "../../../api/axios";

function MyCalendar() {
    const [showModal, setShowModal] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const calendarRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [addAgendaModalVisible, setAddAgendaModalVisible] = useState(false);
    const [agentCommercialUsers, setAgentCommercialUsers] = useState([]);
    const [agendas, setAgendas] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [agendaCalendars, setAgendaCalendars] = useState([]);
    const [agentId, setAgentId] = useState(null);
    const [agendaId, setAgendaId] = useState(null);

    useEffect(() => {
        // Fetch users with role "Agent Commercial" when the component mounts
        fetchAgentCommercialUsers();
        fetchAgendas();
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
            fetchAppointmentsForAgenda(agendaId);
        }
    }, [agendaId]);

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
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleFormSubmit = (newAppointment) => {
        setAppointments([...appointments, newAppointment]);
        fetchAppointmentsForAgenda(agendaId);
        handleCloseModal();
    };

    const fetchAgendas = async () => {
        try {
            const response = await axiosClient.get("/api/agendas");
            setAgendas(response.data.agendas);
            console.log(
                "response.data.agendas[0].contact_id",
                response.data.agendas[0].contact_id
            );
            console.log("agendas response", response.data);
        } catch (error) {
            console.error("Error fetching agendas:", error);
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
                postal: appointment.postal, // Include postal information
            })),
        };
    }

    // Fetch appointments for a specific agenda
    const fetchAppointmentsForAgenda = async (agendaId) => {
        try {
            const response = await axiosClient.get(
                `/api/agendas/${agendaId}/appointments`
            );
            const appointmentsForAgenda = response.data.rdvs.map(
                (appointment) => ({
                    title: `${appointment.nom} ${appointment.prenom}`,
                    start: appointment.start_date
                        ? new Date(appointment.start_date.replace(" ", "T"))
                        : null,
                    end: appointment.end_date
                        ? new Date(appointment.end_date.replace(" ", "T"))
                        : null,
                    agendaId: agendaId,
                    postal: appointment.postal,
                })
            );

            setAppointments(appointmentsForAgenda);
        } catch (error) {
            console.error(
                `Error fetching appointments for agenda ${agendaId}:`,
                error
            );
        }
    };

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

            // Update agendaCalendars state with the new FullCalendar
            setAgendaCalendars((prevState) => [
                ...prevState,
                {
                    agendaId: agendaId,
                    agendaName: agendaName,
                    calendarRef: React.createRef(),
                },
            ]);

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

    

    const handleCheckboxClick = async (userId) => {
        try {
            let updatedSelectedItems = [...selectedItems];
            if (selectedItems.includes(userId)) {
                // Remove the user if already selected
                updatedSelectedItems = updatedSelectedItems.filter(
                    (id) => id !== userId
                );
                // If there are no selected items, clear the agendaId
                if (updatedSelectedItems.length === 0) {
                    setAgendaId(null);
                }
            } else {
                // Add the user if not already selected
                updatedSelectedItems.push(userId);
                // Fetch agendas for the selected user
                const response = await axiosClient.get(
                    `/api/users/${userId}/agendas`
                );
                const userAgendas = response.data.agendas;
                console.log('agenda id id ', response.data.agendas)

                setAgendaId(userAgendas[0].id);
            }
            setSelectedItems(updatedSelectedItems);
        } catch (error) {
            console.error("Error fetching agendas:", error);
        }
    };

    const config = fullCalendarConfig();
    useEffect(() => {
        console.log("agenda id of user", agendaId);
    }, [agendaId]);

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
                        >
                            {user.prenom} {user.nom}
                        </Checkbox>
                    ))}
                </Checkbox.Group>
            </Card>
            <Card style={{ width: "83%" }}>
                <NewButton
                    onClick={handleOpenAddAgendaModal}
                    loading={loading}
                    buttonText="Nouveau Calendrier"
                />
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

                        return (
                            <div key={index}>
                                <h2>{userName}</h2>{" "}
                                {/* Display user's name as the title */}
                                <Card style={{ marginBottom: "30px" }}>
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
                                            events={appointments
                                                .filter(
                                                    (appointment) =>
                                                        appointment.agendaId ===
                                                        agenda.id
                                                )
                                                .map((filteredAppointment) => ({
                                                    title: `${filteredAppointment.title} - ${filteredAppointment.postal}`,
                                                    start: filteredAppointment.start,
                                                    end: filteredAppointment.end,
                                                }))}
                                        />
                                    )}
                                </Card>
                            </div>
                        );
                    })}
            </Card>
            <Modal
                visible={showModal}
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
        </div>
    );
}

export default MyCalendar;
