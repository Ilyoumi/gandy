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

    const handleAddAppointment = (arg, agentId) => {
        setSelectedDate({ date: arg.date, agentId }); 
        console.log("handle agentId", agentId);

        setShowModal(true);
    };
    

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleFormSubmit = (newAppointment) => {
        setAppointments([...appointments, newAppointment]);
        handleCloseModal();
    };

    const fetchAgendas = async () => {
        try {
            const response = await axiosClient.get("/api/agendas");
            setAgendas(response.data.agendas);
            if (response.data.agendas.length > 0) {
                const defaultAgenda = response.data.agendas[0];
                setAgentId(defaultAgenda.contact_id);
                setAgendaId(defaultAgenda.id);
            }
            console.log('response.data.agendas[0].contact_id', response.data.agendas[0].contact_id)
            console.log("agendas response", response.data);
        } catch (error) {
            console.error("Error fetching agendas:", error);
        }
    };

    function fullCalendarConfig() {
        return {
            initialView: "dayGridMonth",
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
            dateClick: handleAddAppointment,
            events: [...appointments],
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

    const config = fullCalendarConfig();

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
                        <Checkbox key={index} value={user.id}>
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

                {agendas.map((agenda, index) => (
                    <div key={index}>
                        <h2>{agenda.name}</h2>
                        <Card style={{ marginBottom: "30px" }}>
                            {agenda.fullcalendar_config && (
                                <FullCalendar
                                    plugins={[
                                        dayGridPlugin,
                                        timeGridPlugin,
                                        interactionPlugin,
                                    ]}
                                    {...JSON.parse(agenda.fullcalendar_config)}
                                    dateClick={(arg) => handleAddAppointment(arg, agenda.contact_id)}
                                    
                                />
                            )}
                        </Card>
                    </div>
                ))}
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
