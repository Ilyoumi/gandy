import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
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
    handleBlockAppointment,
} from "../services/api";
import { RollbackOutlined } from "@ant-design/icons";
import BlockRdv from "./BlockRdv";
import CountdownTimer from "./CountdownTimer ";

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
        contactName,
        setContactName,
        contactEmail,
        setContactEmail,
        contactAgendas, setContactAgendas, setAgentName,
        agentName
    } = useCalendar();
    const userContext = useUser();
    const [selectedAppointmentDate, setSelectedAppointmentDate] =
        useState(null);
    const [showBlockModal, setShowBlockModal] = useState(false);




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
        fetchAgentCommercialUsers(setAgentCommercialUsers);
        fetchAgendasAndAppointments(setAgendas, setAppointments,);
        const interval = setInterval(fetchAgentCommercialUsers, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const handleOpenAddAgendaModal = () => {
        setAddAgendaModalVisible(true);
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
    };
    const handleCloseBlockModal = () => {
        setShowBlockModal(false);
    };

    const handleAgendaCreatedCallback = (agendaId, agendaName, contactId) => {
        handleAgendaCreated(
            agendaId,
            agendaName,
            contactId
            ,
            appointments,
            handleAddAppointment,
            agentId,
            handleEventDropCallback,
            axiosClient,
            setAppointments,
        );
    };
    const handleRollback = () => {
        setShowUpdateModal(false);
        setShowDetailModal(true);
    };

    const handleAppointmentClickCallback = (event) => {
        console.log("Appointment ID:", event.id);

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

    const dayCellContent = (arg) => {
        return (
            <div style={{ backgroundColor: "#219fbbbe", height: "100%", width: "100%" }}>
                {arg.dayNumberText}
            </div>
        );
    };
    const handleDeleteAppointment = async (appointmentId) => {
        console.log("Timer finished for appointment:", appointmentId);
        
        try {
            const appointmentExists = appointments.find(appointment => appointment.id === appointmentId);
            if (!appointmentExists) {
                console.log("Appointment with ID", appointmentId, "does not exist. Skipping deletion.");
                const updatedAppointments = appointments.filter(
                    (appointment) => appointment.id !== appointmentId
                );
            setAppointments(updatedAppointments);

                return; 
            }
    
            await axiosClient.delete(`api/rdvs/${appointmentId}`);
            const updatedAppointments = appointments.filter(
                (appointment) => appointment.id !== appointmentId
            );
            setAppointments(updatedAppointments);
        } catch (error) {
            const updatedAppointments = appointments.filter(
                (appointment) => appointment.id !== appointmentId
            );
            setAppointments(updatedAppointments);

            console.error("Error deleting appointment:", error.response);
            
        }
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

        Modal.confirm({
            title: "Sélectionner une action",
            content: "Que voulez-vous faire ?",
            okText: "Bloque Crénaux",
            cancelText: "Ajouter Rdv",
            onOk: () => {
                setShowBlockModal(true);
                handleBlockAppointment(
                    agentId,
                    agendaId,
                    arg,
                    userContext,
                    setSelectedDate,
                    setShowBlockModal,
                    setAgentName
                );

                console.log("Bloque Crénaux clicked");
                console.log("Bloque selectedDate", selectedDate);
            },
            onCancel: () => {
                setShowAddModal(true);
                handleAddAppointment(
                    agentId,
                    agendaId,
                    arg,
                    userContext,
                    setSelectedDate,
                    setShowAddModal
                );
            },
        });
    };



    const handleEventDropCallback = (info) => {
        handleEventDrop(info, appointments, setAppointments);
    };

    const handleFormSubmitCallback = async (newAppointment) => {
        try {
            await handleFormSubmit(
                newAppointment,
                setAppointments,
                agendaId,
                setAgendas,
                handleCloseBlockModal,
                handleCloseModal,
                setShowUpdateModal,
                appointments,
                setSelectedDate
            );

            await fetchAgendasAndAppointments(
                setAgendas,
                setAppointments,
            );
        } catch (error) {
            // Handle any errors
            console.error("Error handling form submit:", error);
        }
    };

    const handleUpdateClick = (appointmentId) => {
        setShowDetailModal(false);
        setShowUpdateModal(true);
        console.log("appio", appointmentId)

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
                        role={userContext.userRole}
                        contactAgendas={contactAgendas}
                        setContactAgendas={setContactAgendas}
                    />
                    <Card style={{ width: "80%" }}>
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
                            appointments={appointments}
                            handleAddAppointment={handleAddAppointment}
                            agentId={agentId}
                            agendaId={agendaId}
                            handleEventDrop={handleEventDrop}
                        />


                        {selectedItems.length > 0 && (
                            <>
                                {contactAgendas.map((agenda) => {

                                    const user = agentCommercialUsers.find(
                                        (user) => user.id === agenda.contact_id
                                    );
                                    const userName = user
                                        ? `${user.prenom} ${user.nom}`
                                        : "Unknown User";
                                    const email = user
                                        ? `${user.email}`
                                        : "Unknown User";
                                    setContactName(userName)
                                    setContactEmail(email)

                                    return (
                                        <div key={agenda.id}>
                                            <h2>{userName}</h2>{" "}
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
                                                        let content = "";

                                                        if (arg.event.extendedProps.bloquer) {
                                                            // Display remaining time in French
                                                            content = `Bloqué / ${arg.event.title}`;
                                                            
                                                            return (
                                                                <div>
                                                                    <CountdownTimer onTimerFinish={() => handleDeleteAppointment(arg.event.id)} />
                                                                    <div >
                                                                        {content}
                                                                    </div>
                                                                </div>
                                                            );
                                                        } else {
                                                            content = `${arg.event.title} / ${arg.event.extendedProps.status}`;
                                                            return (
                                                                <div >
                                                                    {content}
                                                                </div>
                                                            );
                                                        }
                                                    }}
                                                    dayCellContent={dayCellContent}




                                                    eventDidMount={(arg) => {
                                                        arg.el.style.backgroundColor =
                                                            "#219fbbbe";
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
                                                            const title = appointment.bloquer ? `${appointment.postal}` : (appointment.prenom ? `${appointment.postal}/${appointment.nom} ${appointment.prenom}` : `${appointment.postal}/${appointment.nom}`);

                                                            return {
                                                                id: appointment.id,
                                                                title: title,
                                                                start: appointment.start_date,
                                                                end: appointment.end_date,
                                                                status: appointment.status,
                                                                bloquer: appointment.bloquer,
                                                                agent: appointment.id_agent,
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
                                                    height="auto"
                                                />
                                            )}
                                            {/* </Card> */}
                                        </div>
                                    );
                                })}
                            </>
                        )
                        }
                    </Card>
                    <Modal
                        open={showAddModal}
                        title={`Nouveau rendez-vous : ${contactName} - ${contactEmail}`}
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
                        title={
                            <Row justify="space-between" align="middle">
                                <Col>
                                    <p style={{ fontSize: "16px" }}>
                                        Modifier rendez-vous : {contactName} - {contactEmail}
                                    </p>
                                </Col>
                                <Col style={{ marginRight: "40px", marginBottom: "30px" }}>
                                    {/* Rollback icon */}
                                    <RollbackOutlined onClick={handleRollback} style={{ fontSize: "16px", cursor: "pointer" }} />
                                </Col>

                            </Row>
                        }



                        onCancel={() => setShowUpdateModal(false)}
                        footer={null}
                        width={1000}
                    >
                        {appointmentDetails && (
                            <>

                                <UpdateRdv
                                    initialValues={appointmentDetails}
                                    agendaId={agendaId}
                                    onFormSubmit={handleFormSubmitCallback}
                                />
                            </>
                        )}

                    </Modal>
                    <Modal
                        open={showDetailsModal}
                        onCancel={() => setShowDetailModal(false)}
                        footer={null}
                        style={{ marginTop: "-50px" }}
                        width="85%"
                        bodyStyle={{ maxHeight: "80vh", overflowY: "auto" }}
                        destroyOnClose
                        title={
                            <Row justify="space-between" align="middle">
                                <Col>
                                    <p style={{
                                        fontSize: "16px"
                                    }} >Détails de rendez-vous : {contactName} - {contactEmail}</p>
                                </Col>
                                <Col style={{ marginRight: "40px" }}>
                                    {(userContext.userRole === "Admin" ||
                                        agentId === userContext.userId) && (
                                            <Button
                                                onClick={() => handleUpdateClick(selectedRowData.id)}
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
                    <Modal
                        open={showBlockModal}
                        title="Bloquer Créneaux"
                        onCancel={handleCloseBlockModal}
                        footer={null}
                        width="50%"

                    >
                        <BlockRdv
                            selectedDate={selectedDate}
                            onFormSubmit={handleFormSubmitCallback}
                            selectedAppointmentDate={selectedAppointmentDate}
                            agentId={agentId}
                            agendaId={agendaId}

                        />
                    </Modal>
                    <AddAgendaModal
                        visible={addAgendaModalVisible}
                        onCancel={() => setAddAgendaModalVisible(false)}
                        onAgendaCreated={handleAgendaCreatedCallback}
                    />


                </>
            )
            }
        </div>
    );
}

export default MyCalendar;
