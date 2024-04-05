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
    useEffect(() => {
        // Fetch users with role "Agent Commercial" when the component mounts
        fetchAgentCommercialUsers();
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

    const handleDateClick = (arg) => {
        setSelectedDate(arg.date);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleFormSubmit = (newAppointment) => {
        setAppointments([...appointments, newAppointment]);
        handleCloseModal();
    };

    const handleAgendaCreated = async (agendaId) => {
        try {
            const response = await axiosClient.get(`/api/agendas/${agendaId}`);
            console.log("data",response.data )
            console.log("data agenda",response.data.agenda )
            const agendaName = response.data.agenda.name; // Assuming the agenda name is nested under 'agenda' key
            setAgendaCalendars(prevState => [
                ...prevState,
                { agendaId: agendaId, agendaName: agendaName, calendarRef: React.createRef() }
            ]);
        } catch (error) {
            console.error("Error fetching agenda details:", error.response.data.error);
            // Set the error message in state or display it in the UI
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
                {agendaCalendars.map((agendaCalendar, index) => (
                <div key={index}>
                    <h2>Agenda: {agendaCalendar.agendaName}</h2>
                    <Card style={{ marginBottom: "30px" }}>
                        <FullCalendar
                            ref={agendaCalendar.calendarRef}
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            droppable={true}
                            weekends={true}
                            editable={true}
                            selectable={true}
                            selectMirror={true}
                            dateClick={handleDateClick}
                            events={appointments}
                            dayMaxEvents={true}
                            eventDisplay="block"
                            eventBackgroundColor="#52c41a"
                            eventBorderColor="#87d068"
                            locale={frLocale}
                            headerToolbar={{
                                left: "prev,next today",
                                center: "title",
                                right: "dayGridMonth,timeGridWeek,timeGridDay",
                            }}
                            buttonText={{
                                today: "Aujourd'hui",
                                month: "Mois",
                                week: "Semaine",
                                day: "Jour",
                                list: "Liste",
                            }}
                            slotDuration={"00:30:00"}
                            handleWindowResize={true}
                        />
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
                />
            </Modal>
        </div>
    );
}

export default MyCalendar;
