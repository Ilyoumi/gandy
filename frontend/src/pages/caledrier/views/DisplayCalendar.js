import React, { useState } from "react";


import { Button, Col, Row } from "antd";
import AddAgendaModal from "./AddAgenda";
import CalendarComponent from "./CalendarComponent";


const DisplayCalendar = () => {
    const [showModal, setShowModal] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [calendars, setCalendars] = useState([]);

    const [addAgendaModalVisible, setAddAgendaModalVisible] = useState(false);

    const handleCreateCalendar = (newCalendar) => {
        setCalendars([...calendars, { title: newCalendar.title, contact: newCalendar.contact }]);
    };

    const handleDateClick = (arg) => {
        setSelectedDate(arg.date);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
import React, { useState } from "react";



import { Button, Col, Row } from "antd";
import AddAgendaModal from "./AddAgenda";
import CalendarComponent from "./CalendarComponent";


const DisplayCalendar = () => {
    const [showModal, setShowModal] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [calendars, setCalendars] = useState([]);

    const [addAgendaModalVisible, setAddAgendaModalVisible] = useState(false);

    const handleCreateCalendar = (newCalendar) => {
        setCalendars([...calendars, { title: newCalendar.title, contact: newCalendar.contact }]);
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
    const handleOpenAddAgendaModal = () => {
        setAddAgendaModalVisible(true);
    };
    const handleFormSubmit = (newAppointment) => {
        setAppointments([...appointments, newAppointment]);
        handleCloseModal();
    };
    const handleOpenAddAgendaModal = () => {
        setAddAgendaModalVisible(true);
    };

    return (
        <div>
        <Row style={{ margin: "10px 20px" }}>
                <Col
                    span={12}
                    style={{
                        textAlign: "left",
                        fontWeight: "bold",
                        fontSize: "20px",
                    }}
                >
                    Ajouter Agenda
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        onClick={handleOpenAddAgendaModal}
                    >
                        Ajouter Agenda
                    </Button>
                </Col>
            </Row>
        
            <AddAgendaModal
            onCreate={handleCreateCalendar}
                visible={addAgendaModalVisible}
                onCancel={() => setAddAgendaModalVisible(false)}
            />
            <div >
                {calendars.map((calendar, index) => (
                    <CalendarComponent
                        key={index}
                        title={calendar.title}
                        contact={calendar.contact}
                        appointments={appointments} // Pass appointments to CalendarComponent

                    />
                ))}
            </div>
        <div>
        <Row style={{ margin: "10px 20px" }}>
                <Col
                    span={12}
                    style={{
                        textAlign: "left",
                        fontWeight: "bold",
                        fontSize: "20px",
                    }}
                >
                    Ajouter Agenda
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        onClick={handleOpenAddAgendaModal}
                    >
                        Ajouter Agenda
                    </Button>
                </Col>
            </Row>
        
            <AddAgendaModal
            onCreate={handleCreateCalendar}
                visible={addAgendaModalVisible}
                onCancel={() => setAddAgendaModalVisible(false)}
            />
            <div >
                {calendars.map((calendar, index) => (
                    <CalendarComponent
                        key={index}
                        title={calendar.title}
                        contact={calendar.contact}
                        appointments={appointments} // Pass appointments to CalendarComponent

                    />
                ))}
            </div>
        </div>
    );
};

export default DisplayCalendar;
export default DisplayCalendar;
