import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { fullCalendarConfig } from "../services/calendarConfig";
import { Modal, Card, Spin, Button, Col, Row } from "antd";
import AddAppointment from "./AddRdv";
import NewButton from "../../../constants/NewButton";
import AddAgendaModal from "./AddAgenda";
import { axiosClient } from "../../../api/axios";
import UpdateRdv from "../../rdv/views/UpdateRdv";
import AppointmentDetails from "../../rdv/views/AppoitmnetDetails";
import { useUser } from "../../../GlobalContext";
import { useCalendar } from "../../../CalendarContext";
import fetchUserData from "../../../api/acces";
import ContactList from "../../contacts/views/ContactList";
import {
    fetchAgentAgenda,
    fetchAgentCommercialUsers,
    fetchAgendasAndAppointments,
    handleAppointmentClick,
    handleAgendaCreated,
    handleAddAppointment,
    handleEventDrop,
    handleFormSubmit,
} from "../services/api";

function MyCalendar() {
    const {
        showAddModal,
        setShowAddModal,
        appointments,
        setAppointments,
        selectedItems,
        setSelectedItems,
        agentId,
        setAgentId,
        agendaId,
        setAgendaId,
        setSelectedAppointment,
        showUpdateModal,
        setShowUpdateModal,
        showDetailsModal,
        setShowDetailModal,
        selectedRowData,
        setSelectedRowData,
        appointmentDetails,
        setAppointmentDetails,
        selectedDate,
        setSelectedDate,
        loading,
        setLoading,
        addAgendaModalVisible,
        setAddAgendaModalVisible,
        agentCommercialUsers,
        setAgentCommercialUsers,
        agendas,
        setAgendas,
    } = useCalendar();
    const userContext = useUser();
    const [selectedAppointmentDate, setSelectedAppointmentDate] =
        useState(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (userContext.userRole === "Agent") {
            fetchAgentAgenda(userContext, setAgendaId, setAppointments);
        }
    }, [userContext.userRole]);

    useEffect(() => {
        fetchUserData(userContext);
        const interval = setInterval(fetchUserData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [userContext]);

    useEffect(() => {
        if (agentCommercialUsers.length > 0) {
            setSelectedItems([agentCommercialUsers[0].id]);
        }
    }, [agentCommercialUsers, setSelectedItems]);

    useEffect(() => {
        fetchAgentCommercialUsers(setAgentCommercialUsers);
        fetchAgendasAndAppointments(setAgendas, setAppointments, agendaId);
        const interval = setInterval(fetchAgentCommercialUsers, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const handleOpenAddAgendaModal = () => {
        setAddAgendaModalVisible(true);
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
    };

    const handleAgendaCreatedCallback = (agendaId, agendaName, userContext) => {
        handleAgendaCreated(
            agendaId,
            agendaName,
            userContext,
            appointments,
            handleAddAppointment,
            agentId,
            handleEventDropCallback,
            axiosClient,
            setAppointments
        );
    };

    const handleAppointmentClickCallback = (event) => {

        handleAppointmentClick(
            event,
            userContext,
            setAgentId,
            setAppointmentDetails,
            setSelectedRowData,
            setShowDetailModal,
            setSelectedAppointment,
            axiosClient,
            agendaId
        );
        setSelectedAppointmentDate(event.start);

    };

    const handleAddAppointmentCallback = (arg, userContext) => {
        const currentDate = new Date();
        const selectedDate = new Date(arg.date);
        if (selectedDate < currentDate) {
            Modal.warning({
                title: "Impossible d'ajouter un rendez-vous",
                content: "Vous ne pouvez pas ajouter de rendez-vous à des dates passées.",
            });
            return; 
        }
        handleAddAppointment(
            agentId,
            agendaId,
            arg,
            userContext,
            setSelectedDate,
            setShowAddModal
        );
    };

    const handleEventDropCallback = (info) => {
        handleEventDrop(info, appointments, setAppointments);
    };

    const handleFormSubmitCallback = async (newAppointment) => {
        try {
            // Call handleFormSubmit
            await handleFormSubmit(
                newAppointment,
                setAppointments,
                agendaId,
                setAgendas,
                handleCloseModal,
                setShowUpdateModal,
                appointments,
                setSelectedDate
            );

            // Fetch agendas and appointments after successful form submission
            await fetchAgendasAndAppointments(
                setAgendas,
                setAppointments,
                agendaId
            );
        } catch (error) {
            // Handle any errors
            console.error("Error handling form submit:", error);
        }
    };

    const handleUpdateClick = () => {
        setShowDetailModal(false);
        setShowUpdateModal(true);
    };

    const handleDeleteClick = () => {
        // Handle delete logic here
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "30px",
            }}
        >
            {loading ? (
                <Spin
                    style={{
                        textAlign: "center",
                        paddingTop: "50vh",
                        position: "relative",
                        left: "50%",
                    }}
                    size="large"
                />
            ) : (
                <>
                    <ContactList
                        agentCommercialUsers={agentCommercialUsers}
                        selectedItems={selectedItems}
                        setSelectedItems={setSelectedItems}
                        agendas={agendas}
                        agentId={agentId}
                        setAgentId={setAgentId}
                        agendaId={agendaId}
                        setAgendaId={setAgendaId}
                    />
                    <Card style={{ width: "83%" }}>
                        {(userContext.userRole === "Admin" ||
                            userContext.userRole === "Superviseur") && (
                                <NewButton
                                    onClick={handleOpenAddAgendaModal}
                                    loading={loading}
                                    buttonText="Nouveau Calendrier"
                                />
                            )}
                        <AddAgendaModal
                            open={addAgendaModalVisible}
                            onCancel={() => setAddAgendaModalVisible(false)}
                            onAgendaCreated={handleAgendaCreatedCallback}
                        />

                        {agendas.map((agenda) => {
                            // Find the user corresponding to the contact ID
                            const user = agentCommercialUsers.find(
                                (user) => user.id === agenda.contact_id
                            );
                            const userName = user
                                ? `${user.prenom} ${user.nom}`
                                : "Unknown User";

                            return (
                                <div key={agenda.id}>
                                    <h2>{userName}</h2>{" "}
                                    {/* <Card style={{ marginBottom: "30px" }}> */}
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
                                            eventContent={(arg) => {
                                                return (
                                                    <div>
                                                        <div>
                                                            {arg.event.title}/{
                                                                arg.event
                                                                    .extendedProps
                                                                    .status
                                                            }
                                                        </div>

                                                    </div>
                                                );
                                            }}
                                            eventDidMount={(arg) => {
                                                arg.el.style.backgroundColor =
                                                    "#F6995C";
                                            }}
                                            dateClick={(arg) => {

                                                handleAddAppointmentCallback(
                                                    arg,
                                                    user.id,
                                                    agenda.id
                                                )

                                            }

                                            }
                                            eventClick={(info) =>
                                                handleAppointmentClickCallback(
                                                    info.event
                                                )
                                            }
                                            events={appointments
                                                .filter(
                                                    (appointment) =>
                                                        appointment.agendaId ===
                                                        agenda.id
                                                )
                                                .map((appointment) => {
                                                    return {
                                                        id: appointment.id,
                                                        title: `${appointment.postal}/${appointment.nom} ${appointment.prenom}`,
                                                        start: appointment.start_date,
                                                        end: appointment.end_date,
                                                        status: appointment.status,
                                                    };
                                                })}
                                            
                                            views={{
                                                week: {
                                                    type: "timeGridWeek",
                                                    duration: {
                                                        weeks: 1,
                                                    },
                                                },
                                            }}
                                            initialView="week"
                                            slotMinTime="09:00"
                                            slotMaxTime="20:00"
                                            weekends={false}
                                        />
                                    )}
                                    {/* </Card> */}
                                </div>
                            );
                        })}
                    </Card>
                    <Modal
                        open={showAddModal}
                        title="Nouveau rendez-vous"
                        onCancel={handleCloseModal}
                        footer={null}
                        width={1000}
                    >
                        <AddAppointment
                            selectedDate={selectedDate}
                            onFormSubmit={handleFormSubmitCallback}
                            agentId={agentId}
                            agendaId={agendaId}
                            selectedAppointmentDate={selectedAppointmentDate}
                        />
                    </Modal>
                    <Modal
                        open={showUpdateModal}
                        title="Modifier rendez-vous"
                        onCancel={() => setShowUpdateModal(false)}
                        footer={null}
                        width={1000}
                    >
                        {appointmentDetails && (
                            <UpdateRdv
                                initialValues={appointmentDetails}
                                agendaId={agendaId}
                                onFormSubmit={handleFormSubmitCallback}

                            />
                        )}
                    </Modal>
                    <Modal
                        open={showDetailsModal}
                        onCancel={() => setShowDetailModal(false)}
                        footer={null}
                        style={{ marginTop: "-50px" }}
                        width="80%"
                        bodyStyle={{ maxHeight: "80vh", overflowY: "auto" }}
                        destroyOnClose
                        title={
                            <Row justify="space-between" align="middle">
                                <Col>
                                    <h2>Détails de rendez-vous</h2>
                                </Col>
                                <Col style={{ marginRight: "40px" }}>
                                    {(userContext.userRole === "Admin" ||
                                        agentId === userContext.userId) && (
                                            <Button
                                                onClick={handleUpdateClick}
                                                style={{ marginRight: "10px" }}
                                            >
                                                Modifier
                                            </Button>
                                        )}
                                    {userContext.userRole === "Admin" && (
                                        <Button
                                            onClick={handleDeleteClick}
                                            danger
                                        >
                                            Supprimer
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                        }
                    >
                        {showDetailsModal && selectedRowData && (
                            <AppointmentDetails
                                selectedRowData={selectedRowData}
                            />
                        )}
                    </Modal>

                    {userContext.userRole === "Agent" && (
                        <>
                            <h2>Mon Calendrier</h2>
                            <FullCalendar {...fullCalendarConfig} />
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default MyCalendar;
