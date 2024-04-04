import React, { useState } from "react";
import { Button, Col, Row } from "antd";
import AddAgendaModal from "./AddAgenda";
import CalendarComponent from "./CalendarComponent";

const DisplayCalendar = () => {
    const [appointments, setAppointments] = useState([]);
    const [calendars, setCalendars] = useState([]);
    const [addAgendaModalVisible, setAddAgendaModalVisible] = useState(false);
    const handleCreateCalendar = (newCalendar) => {
        setCalendars([
            ...calendars,
            { title: newCalendar.title, contact: newCalendar.contact },
        ]);
        setAddAgendaModalVisible(false);
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
            <div>
                {calendars.map((calendar, index) => (
                    <CalendarComponent
                        key={index}
                        title={calendar.title}
                        contact={calendar.contact}
                        appointments={appointments}
                    />
                ))}
            </div>
        </div>
    );
};

export default DisplayCalendar;
