import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal, Card, Spin } from "antd";
import { axiosClient } from "../../../api/axios";
import { useCalendar } from "../../../CalendarContext";
import { handleAddAppointment } from "../services/api";
import AddPrivateAppointmentModal from "./AddPrivateAppointmentModal";
import NewButton from "../../../constants/NewButton";

function AgentCommercialCalendar() {
	const {
		setShowAddModal,
		agentId,
		selectedDate,
		setSelectedDate,
	} = useCalendar();
	const [userAgenda, setUserAgenda] = useState(null);
	const [userAppointments, setUserAppointments] = useState([]);
	const [addPrivateModalVisible, setAddPrivateModalVisible] = useState(false);
	const [loading, setLoading] = useState(true);

	const [userId, setUserId] = useState("");

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const authToken = localStorage.getItem("auth_token");
				if (!authToken) {
					console.log("User is not logged in");
					return;
				}

				const response = await axiosClient.get("/api/user", {
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				});
				const { id } = response.data;
				setUserId(id);
				console.log("User id:", userId);
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};

		fetchUserData();
	}, []);

	useEffect(() => {
		if (userId !== "") {
			console.log("Fetching user agenda and appointments...");
			axiosClient.get(`api/users/${userId}/agenda-with-appointments`)
				.then(response => {
					console.log("User agenda and appointments fetched successfully:", response.data);
					setUserAgenda(response.data.agenda);
					setUserAppointments(response.data.rdvs);
					setLoading(false);
				})
				.catch(error => {
					console.error("Error fetching user agenda:", error);
					setLoading(false);
				});
		}
	}, [userId]);


	const handleOpenAddPrivateModal = () => {
		setAddPrivateModalVisible(true);
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
		setAddPrivateModalVisible(true);

		handleAddAppointment(
			agentId,
			userAgenda.id,
			arg,
			userContext,
			setSelectedDate,
			setShowAddModal
		);
	};

	const handleAppointmentClick = (event) => {
		console.log("Clicked appointment:", event);
	};

	const handleFormSubmitCallback = async (formData) => {
		console.log("Form data:", formData);
		setAddPrivateModalVisible(false);
	};

	if (loading) {
		return (
			<Spin
				style={{ textAlign: "center", paddingTop: "50vh", position: "relative", left: "50%" }}
				size="large"
			/>
		);
	}

	return (
		<div>
			<NewButton
				onClick={handleOpenAddPrivateModal}
				loading={loading}
				buttonText="Ajouter un rendez-vous privé"
			/>

			<Card style={{ width: "100%" }}>

				{userAgenda && (
					<FullCalendar
						plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
						{...JSON.parse(userAgenda.fullcalendar_config)}
						dateClick={(arg) => {
							handleAddAppointmentCallback(
								arg,
								userId,
								userAgenda.id
							);
						}}
						views={{
							week: {
								type: "timeGridWeek",
								duration: {
									weeks: 1,
								},
							},
						}}
						headerToolbar={userAgenda.fullcalendar_config.headerToolbar}
						events={userAppointments.map((appointment) => {
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
						eventClick={handleAppointmentClick}
						eventDidMount={(arg) => {
							arg.el.style.backgroundColor = "#219fbbbe";
						}}
						initialView="week"
						slotMinTime="09:00"
						slotMaxTime="20:00"
						weekends={false}
					/>
				)}
			</Card>
			<Modal
				visible={addPrivateModalVisible}
				onCancel={() => setAddPrivateModalVisible(false)}
				footer={null}
			>
				<AddPrivateAppointmentModal
					
					onFormSubmit={handleFormSubmitCallback}
					selectedDate={selectedDate}
					userId={userId}
					agendaId={userAgenda.id}

				/>
			</Modal>
		</div>
	);
}

export default AgentCommercialCalendar;
