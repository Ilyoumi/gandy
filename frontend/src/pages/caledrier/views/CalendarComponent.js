import React, { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from "@fullcalendar/timegrid";
import { Modal, Col, Row } from "antd";
import AddAppointment from "./AddAppoitment";
import bootstrap5Plugin from '@fullcalendar/bootstrap5';


import dayjs from 'dayjs';
import { Alert, Calendar } from 'antd';


const CalendarComponent = ({ title, contact }) => {
  const [value, setValue] = useState(() => dayjs('2017-01-25'));
  const [selectedValue, setSelectedValue] = useState(() => dayjs('2017-01-25'));
  const onSelect = (newValue) => {
    setValue(newValue);
    setSelectedValue(newValue);
  };
  const onPanelChange = (newValue) => {
    setValue(newValue);
  };

  
  const [showModal, setShowModal] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
  const calendarRef = useRef(null);

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
          contact: contact
        }
      });
    }
  }, [title, contact]);

  return (
    <div style={{ marginBottom:"30px" }}>
  
        
            <FullCalendar
            ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrap5Plugin]}
                initialView="timeGridWeek"
                eventResizableFromStart={true}
                droppable={true}
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

export default CalendarComponent;
