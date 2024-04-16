import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import { Modal, Card, Spin, Button, Col, Row } from "antd";
import AddAppointment from "./AddAppoitment";
import NewButton from "../../../constants/NewButton";
import AddAgendaModal from "./AddAgenda";
import { axiosClient } from "../../../api/axios";
import UpdateRdv from "../../rdv/views/UpdateRdv";
import AppointmentDetails from "../../rdv/views/AppoitmnetDetails";
import { useUser } from "../../../GlobalContext";
import fetchUserData from "../../../api/acces";
import ContactList from "../../contacts/views/ContactList";

function MyCalendar() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addAgendaModalVisible, setAddAgendaModalVisible] = useState(false);
    const [agentCommercialUsers, setAgentCommercialUsers] = useState([]);
    const [agendas, setAgendas] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [agentId, setAgentId] = useState(null);
    const [agendaId, setAgendaId] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDetailsModal, setShowDetailModal] = useState(false);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [appointmentDetails, setAppointmentDetails] = useState(null);
    const userContext = useUser();

    useEffect(() => {
        // Simulate loading for demonstration purposes
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 2000);

        // Clean up timer
        return () => clearTimeout(timeout);
    }, []);
    useEffect(() => {
        // Fetch agenda for the logged-in agent when component mounts
        if (userContext.userRole === "Agent") {
            fetchAgentAgenda();
        }
    }, [userContext.userRole]);

    const fetchAgentAgenda = async () => {
        try {
            // Fetch agenda for the logged-in user (agent)
            const response = await axiosClient.get(
                `/api/users/${userContext.userId}/agenda`
            );
            const agenda = response.data.agenda;

            // Set the agenda ID for the logged-in agent
            setAgendaId(agenda.id);

            // Fetch appointments for the logged-in agent's agenda
            fetchAppointments(agenda.id);
        } catch (error) {
            console.error("Error fetching agent agenda:", error);
        }
    };

    const fetchAppointments = async (agendaId) => {
        try {
            // Fetch appointments for the specified agenda ID
            const response = await axiosClient.get(
                `/api/agendas/${agendaId}/appointments`
            );
            const appointmentsData = response.data.rdvs.map((appointment) => ({
                id: appointment.id,
                title: `${appointment.nom} ${appointment.prenom}`,
                start: appointment.start_date
                    ? new Date(appointment.start_date.replace(" ", "T"))
                    : null,
                end: appointment.end_date
                    ? new Date(appointment.end_date.replace(" ", "T"))
                    : null,
                postal: appointment.postal,
            }));

            // Update appointments state with the fetched appointments
            setAppointments(appointmentsData);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };

    useEffect(() => {
        fetchUserData(userContext);

        // Periodically fetch user data every 5 minutes (5 * 60 * 1000 milliseconds)
        const interval = setInterval(fetchUserData, 5 * 60 * 1000);

        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, [userContext]);

    useEffect(() => {
        // Fetch users with role "Agent Commercial" when the component mounts
        fetchAgentCommercialUsers();
        fetchAgendasAndAppointments();
        const interval = setInterval(fetchAgentCommercialUsers, 5 * 60 * 1000);

        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Set the first user as selected when component mounts
        if (agentCommercialUsers.length > 0) {
            setSelectedItems([agentCommercialUsers[0].id]);
        }
    }, [agentCommercialUsers]);

    useEffect(() => {
        // Function to fetch agent commercial users
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

        // Initial fetch
        fetchAgentCommercialUsers();

        // Periodically fetch agent commercial users every second
        const interval = setInterval(fetchAgentCommercialUsers, 5 * 60 * 1000);

        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, []);

    // Function to handle appointment click

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

    const handleAddAppointment = (arg, agentId, agendaId) => {
        console.log("Agent ID....:", userContext.userId);
        console.log("userContext...:", userContext);
        console.log("Agenda ID:", agendaId);
        setSelectedDate({ date: arg.date, agentId, agendaId });
        setShowAddModal(true);
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
    };

    const handleFormSubmit = async (newAppointment) => {
        try {
            console.log("New appointment:", newAppointment);

            // Update appointments state using the state updater function
            setAppointments((prevAppointments) => [
                ...prevAppointments,
                newAppointment,
            ]);

            // Fetch agendas and appointments after updating appointments state
            fetchAgendasAndAppointments(agendaId);
            console.log("setAppointments:", appointments);
            handleCloseModal();
            setShowUpdateModal(false);
        } catch (error) {
            console.error("Error handling form submission:", error);
        }
    };

    const fetchAgendasAndAppointments = async () => {
        try {
            // Fetch all agendas

            const agendasResponse = await axiosClient.get("/api/agendas");
            const agendas = agendasResponse.data.agendas;
            console.log("Agendas:", agendas);

            // Fetch appointments for each agenda
            const allAppointments = [];
            for (const agenda of agendas) {
                const appointmentsResponse = await axiosClient.get(
                    `/api/agendas/${agenda.id}/appointments`
                );
                const appointmentsForAgenda =
                    appointmentsResponse.data.rdvs.map((appointment) => {
                        console.log(
                            "id_agent from fetchAgendasAndAppointments:",
                            appointment.id_agent
                        ); // Log the id_agent
                        return {
                            ...appointment,
                            start: appointment.start_date
                                ? new Date(
                                      appointment.start_date.replace(" ", "T")
                                  )
                                : null,
                            end: appointment.end_date
                                ? new Date(
                                      appointment.end_date.replace(" ", "T")
                                  )
                                : null,
                            agendaId: agenda.id,
                            id_agent: appointment.id_agent,
                        };
                    });

                allAppointments.push(...appointmentsForAgenda);
            }

            console.log("All Appointments:", allAppointments);

            // Update state with agendas and appointments
            setAgendas(agendas);
            setAppointments(allAppointments);
            console.log(
                "appointments fetchAgendasAndAppointments",
                allAppointments
            );
        } catch (error) {
            console.error("Error fetching agendas and appointments:", error);
        }
    };

    const handleEventDrop = async (info) => {
        console.log("handleEventDrop called", info);
        try {
            const { event } = info;
            const updatedAppointment = {
                id: event.id,
                start_date: event.start.toISOString(),
                end_date: event.end.toISOString(),
            };
            console.log("event", event);
            // Log the updated appointment before sending the request
            console.log("Updated Appointment:", updatedAppointment);

            // Update appointment in the database
            const response = await axiosClient.put(
                `/api/rdvs/${event.id}`,
                updatedAppointment
            );
            console.log("Appointment updated successfully:", response.data);

            // Update appointments state with the updated event
            const updatedAppointments = appointments.map((appointment) => {
                if (appointment.id === event.id) {
                    return {
                        ...appointment,
                        start_date: updatedAppointment.start_date,
                        end_date: updatedAppointment.end_date,
                    };
                }
                return appointment;
            });
            setAppointments(updatedAppointments);
            console.log("appointments handleEventDrop", updatedAppointments);
        } catch (error) {
            console.error("Error updating appointment:", error);
        }
    };

    function fullCalendarConfig() {
        return {
            initialView: "dayGridMonth",
            eventDrop: handleEventDrop,
            droppable: true,
            weekends: true,
            editable: true,
            selectable: true,
            selectMirror: true,
            dayMaxEvents: true,
            eventDisplay: "block",
            eventBackgroundColor: "#52c41a",
            eventBorderColor: "#87d068",
            locale: frLocale,
            headerToolbar: {
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
            },
            buttonText: {
                today: "Aujourd'hui",
                month: "Mois",
                week: "Semaine",
                day: "Jour",
                list: "Liste",
            },
            slotDuration: "00:30:00",
            handleWindowResize: true,
            dateClick: (arg) => handleAddAppointment(arg, agentId, agendaId),
            events: appointments.map((appointment) => ({
                id: appointment.id,
                title: `${appointment.nom} ${appointment.prenom}`,
                start: appointment.start_date
                    ? new Date(appointment.start_date.replace(" ", "T"))
                    : null,
                end: appointment.end_date
                    ? new Date(appointment.end_date.replace(" ", "T"))
                    : null,
                postal: appointment.postal,
            })),
        };
    }

    const handleAgendaCreated = async (agendaId, agendaName) => {
        try {
            // Combine the default event with existing events from the database
            const updatedEvents = [...appointments];
            const config = fullCalendarConfig();
            console.log("fullCalendarConfig", config);

            // Update existing agenda with FullCalendar data
            const response = await axiosClient.put(`/api/agendas/${agendaId}`, {
                fullcalendar_config: config,
            });

            console.log(
                "Agenda updated with FullCalendar data:",
                response.data
            );

            // Update appointments state with the updated events
            setAppointments(updatedEvents);
            console.log("appointments handleAgendaCreated", updatedEvents);
        } catch (error) {
            console.log("Response data:", error.response.data);

            console.error(
                "Error updating agenda with FullCalendar data:",
                error
            );
            // Handle error
        }
    };

    const config = fullCalendarConfig();

    const handleAppointmentClick = async (event) => {
        console.log(event.id);

        try {
            // Make a GET request to fetch the agent ID by appointment ID
            const response = await axiosClient.get(
                `/api/appointments/${event.id}/agent`
            );

            // Extract the agent ID from the response data
            const agentId = response.data.agentId;
            setAgentId(agentId)
            console.log("Fetched agent ID:", agentId);
            console.log("Fetched data :", response.data);
            console.log("agenda id ------", agendaId);
            console.log("agent id ------", agentId);
            console.log("context loggin id id ------", userContext.userId);
            console.log("app id ------", event.id);

            // Compare the agent ID with the logged-in user's ID
            if (
                agentId === userContext.userId ||
                userContext.userRole === "Superviseur"
            ) {
                const response = await axiosClient.get(`/api/rdvs/${event.id}`);
                // Extract the appointment details from the response data
                const appointmentDetails = response.data;
                // Update the state with the fetched appointment details
                setAppointmentDetails(appointmentDetails);
                setSelectedRowData(appointmentDetails);
                // Show the update modal
                setShowDetailModal(true);
                setSelectedAppointment(event);
                console.log("user is either a superviseur or teh owner");
                console.log(
                    "selectedRowData",
                    selectedRowData,
                    setShowDetailModal
                );
            } else {
                console.log("user is not either a superviseur or teh owner");
            }
        } catch (error) {
            console.error("Error fetching agent ID:", error);
        }
    };

    const handleUpdateClick = () => {
        setShowDetailModal(false);

        // Open Update modal
        setShowUpdateModal(true);
    };

    const handleDeleteClick = () => {
        // Handle delete logic here
    };

    console.log("userRole m:", userContext.userRole);
    console.log("agentId m:", agentId);
    console.log("userId m:", userContext.userId);

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
                            visible={addAgendaModalVisible}
                            onCancel={() => setAddAgendaModalVisible(false)}
                            onAgendaCreated={handleAgendaCreated}
                        />
                        {agendas.length === 0 && (
                            <div>
                                <h2>Agenda par défaut</h2>
                                <Card style={{ marginBottom: "30px" }}>
                                    <FullCalendar
                                        plugins={[
                                            dayGridPlugin,
                                            timeGridPlugin,
                                            interactionPlugin,
                                        ]}
                                        {...config}
                                    />
                                </Card>
                            </div>
                        )}

                        {agendas
                            .filter((agenda) =>
                                selectedItems.includes(agenda.contact_id)
                            )
                            .sort(
                                (a, b) =>
                                    selectedItems.indexOf(a.contact_id) -
                                    selectedItems.indexOf(b.contact_id)
                            )
                            .map((agenda, index) => {
                                // Find the user corresponding to the contact ID
                                const user = agentCommercialUsers.find(
                                    (user) => user.id === agenda.contact_id
                                );
                                const userName = user
                                    ? `${user.prenom} ${user.nom}`
                                    : "Unknown User";

                                return (
                                    <div key={index}>
                                        <h2>{userName}</h2>{" "}
                                        {/* Display user's name as the title */}
                                        <Card style={{ marginBottom: "30px" }}>
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
                                                    dateClick={(arg) =>
                                                        handleAddAppointment(
                                                            arg,
                                                            user.id,
                                                            agenda.id
                                                        )
                                                    }
                                                    eventClick={(info) =>
                                                        handleAppointmentClick(
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
                                                            console.log(
                                                                "id_agent from cal:",
                                                                appointment.id_agent,
                                                                appointment.nom
                                                            ); // Log the id_agent
                                                            return {
                                                                id: appointment.id,
                                                                title: `${appointment.nom} ${appointment.prenom} - ${appointment.postal}`,
                                                                start: appointment.start_date
                                                                    ? new Date(
                                                                          appointment.start_date.replace(
                                                                              " ",
                                                                              "T"
                                                                          )
                                                                      )
                                                                    : null,
                                                                end: appointment.end_date
                                                                    ? new Date(
                                                                          appointment.end_date.replace(
                                                                              " ",
                                                                              "T"
                                                                          )
                                                                      )
                                                                    : null,
                                                                agendaId:
                                                                    appointment.agendaId,
                                                                id_agent:
                                                                    appointment.id_agent,
                                                            };
                                                        })}
                                                    views={{
                                                        week: {
                                                            type: "timeGridWeek", // Change the type to timeGridWeek for weekly view
                                                            duration: {
                                                                weeks: 1,
                                                            }, // Show one week at a time
                                                        },
                                                    }}
                                                    initialView="week"
                                                    slotMinTime="08:00" // Set minimum time to 8 AM
                                                    slotMaxTime="19:00" // Set maximum time to 7 PM
                                                />
                                            )}
                                        </Card>
                                    </div>
                                );
                            })}
                    </Card>
                    <Modal
                        visible={showAddModal}
                        title="Nouveau rendez-vous"
                        onCancel={handleCloseModal}
                        footer={null}
                        width={1000}
                    >
                        <AddAppointment
                            selectedDate={selectedDate}
                            onFormSubmit={handleFormSubmit}
                            agentId={agentId}
                            agendaId={agendaId}
                        />
                    </Modal>
                    <Modal
                        visible={showUpdateModal}
                        title="Modifier rendez-vous"
                        onCancel={() => setShowUpdateModal(false)}
                        footer={null}
                        width={1000}
                    >
                        {appointmentDetails && (
                            <UpdateRdv
                                initialValues={appointmentDetails}
                                agendaId={agendaId}
                                onFormSubmit={handleFormSubmit}
                            />
                        )}
                    </Modal>
                    <Modal
                        visible={showDetailsModal}
                        onCancel={() => setShowDetailModal(false)} // Update this line
                        footer={null}
                        style={{ marginTop: "-50px" }}
                        width="80%"
                        bodyStyle={{ maxHeight: "80vh", overflowY: "auto" }} // Ensure the modal body is scrollable if needed
                        destroyOnClose
                        title={
                            <Row justify="space-between" align="middle">
                                {/* Title column */}
                                <Col>
                                    <h2>Détails de rendez-vous</h2>
                                </Col>
                                {/* Buttons column */}
                                <Col style={{ marginRight: "40px" }}>
                                    {(userContext.userRole === "Superviseur" ||
                                        agentId === userContext.userId) && (
                                        <Button
                                            onClick={handleUpdateClick}
                                            style={{ marginRight: "10px" }}
                                        >
                                            Modifier
                                        </Button>
                                    )}
                                    {userContext.userRole === "Superviseur" && (
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
