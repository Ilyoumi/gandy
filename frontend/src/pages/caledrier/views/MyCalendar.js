import React, { useEffect, useRef, useState } from "react";
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

function MyCalendar({ title, contact }) {
    const [showModal, setShowModal] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const calendarRef = useRef(null);
    const [calendars, setCalendars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addAgendaModalVisible, setAddAgendaModalVisible] = useState(false);
    const [agentCommercialUsers, setAgentCommercialUsers] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

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

    useEffect(() => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.addEvent({
                title: title,
                start: new Date(),
                allDay: true,
                extendedProps: {
                    contact: contact,
                },
            });
        }
    }, [title, contact]);
    

    const handleCreateCalendar = (newCalendar) => {
        setCalendars([
            ...calendars,
            { title: newCalendar.title, contact: newCalendar.contact },
        ]);
    };

    const handleCheckboxChange = (checkedValues) => {
        setSelectedItems(checkedValues);
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
                    onChange={handleCheckboxChange}
                    value={selectedItems}
                >
                    {agentCommercialUsers.map((user, index) => (
                        <Checkbox key={index} value={user.id}>
                            {user.name}
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
                    onCreate={handleCreateCalendar}
                    visible={addAgendaModalVisible}
                    onCancel={() => setAddAgendaModalVisible(false)}
                />
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    eventResizableFromStart={true}
                    ref={calendarRef}
                    droppable={true}
                    weekends={true}
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    dateClick={handleDateClick}
                    events={appointments}
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
