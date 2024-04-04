import React, { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { Modal, Card, Button, Radio } from 'antd';
import AddAppointment from "./AddAppoitment";
import NewButton from '../../../constants/NewButton';
import AddAgendaModal from "./AddAgenda";

function MyCalendar({ title, contact }) {
    const [showModal, setShowModal] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const calendarRef = useRef(null);
    const [calendars, setCalendars] = useState([]);
    
    const radioItems = ['Contact 1', 'Contact 2', 'Contact 3'];
    const [loading, setLoading] = useState(false);
    const [addAgendaModalVisible, setAddAgendaModalVisible] = useState(false);

    const handleOpenAddAgendaModal = () => {
        setAddAgendaModalVisible(true);
    };
    const handleClick = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
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
                    contact: contact
                }
            });
        }
    }, [title, contact]);

    const handleCreateCalendar = (newCalendar) => {
        setCalendars([...calendars, { title: newCalendar.title, contact: newCalendar.contact }]);
    };
  
        const handleRadioChange = (e) => {
            setSelectedItem(e.target.value);
        };
    

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
            <Card title="Calendriers des contacts" style={{ width: '15%' }}>
                <Radio.Group onChange={handleRadioChange} value={selectedItem}>
                    {radioItems.map((item, index) => (
                        <Radio key={index} value={index}>
                            {item}
                        </Radio>
                    ))}
                </Radio.Group>
            </Card>
            <Card style={{ width: '83%' }}>
            <NewButton onClick={handleOpenAddAgendaModal} loading={loading} buttonText="Nouveau Calendrier" />
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
                        left:'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    buttonText={{
                        today: 'Aujourd\'hui',
                        month: 'Mois',
                        week: 'Semaine',
                        day: 'Jour',
                        list: 'Liste'
                    }}
                    slotDuration={'00:30:00'}
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
