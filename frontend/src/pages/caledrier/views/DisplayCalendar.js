import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS locally
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons CSS locally
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { Modal } from "antd";
import AddAppointment from "./AddAppoitment";

const DisplayCalendar = () => {
    const [showModal, setShowModal] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

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

    return (
        <div>
        
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrap5Plugin]}
                initialView="timeGridWeek"
                weekends={true}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                dateClick={handleDateClick}
                events={appointments} // Display appointments on the calendar
                eventDisplay="block" // Display events as blocks
                eventBackgroundColor="#52c41a" // Custom color for added appointments
                eventBorderColor="#87d068" // Custom border color for added appointments
                locale="fr" // Set the calendar language to French
                themeSystem='bootstrap5'
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
            />
            <Modal
                visible={showModal}
                title="Ajouter un rendez-vous"
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
};

export default DisplayCalendar;
