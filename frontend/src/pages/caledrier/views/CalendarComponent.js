import React, { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from "@fullcalendar/timegrid";
import { Modal } from "antd";
import AddAppointment from "./AddAppoitment";
import frLocale from '@fullcalendar/core/locales/fr';

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
const handleDropdownItemClick = (item) => {
  console.log(`Selected option: ${item}`);
  // Faire quelque chose avec l'élément sélectionné
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
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
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
                locale={frLocale}

                headerToolbar={{
                  left: 'myDropdown',
                  center: 'title',
                  right: 'today prev,next dayGridMonth,timeGridWeek,timeGridDay',
              }}
              customButtons={{
                  myDropdown: {
                      text: 'Dropdown',
                      click: () => {
                          // Cette fonction sera appelée lors du clic sur le bouton Dropdown
                          const dropdownItems = ['Contact 1', 'Contact 2', 'Contact 3'];
                          const selectedItem = window.prompt('Select an option:\n' + dropdownItems.join('\n'));
                          if (selectedItem) {
                              handleDropdownItemClick(selectedItem);
                          }
                      }
                  }
              }}
              buttonText={{
                  today:    'Aujourd\'hui',
                  month:    'Mois',
                  week:     'Semaine',
                  day:      'Jour',
                  list:     'Liste'
              }}
              slotDuration={'00:30:00'}
              handleWindowResize={true}
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
