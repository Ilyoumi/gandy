import React, { useEffect, useState } from "react";
import { Card, Input, Form, Row, Col, ConfigProvider, DatePicker, message, Alert } from "antd";
import frFR from "antd/lib/locale/fr_FR";
import moment from "moment";
import { axiosClient } from "../../../api/axios";
import SaveButton from "../../../constants/SaveButton";

const BlockRdv = ({ selectedDate, onFormSubmit, agendaId }) => {
	const [userId, setUserId] = useState(null);
	const [loading, setLoading] = useState(false);
	const [showAlert, setShowAlert] = useState(false);


	const [formData, setFormData] = useState({
		postal: "",
		commentaire: "",
		bloquer: true,
		appointment_date: selectedDate
			? [
				new Date(selectedDate.date),
				new Date(selectedDate.date.getTime() + 3600000),
			]
			: null,
	});

	const resetForm = () => {
		setFormData({
						postal: "",
						commentaire: "",
						bloquer: true,
						appointment_date: null,
		});
};
	const handleClick = () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
		}, 2000);
	};
	const fetchUserData = async () => {
		try {
			// Check if the user is logged in
			const authToken = localStorage.getItem("auth_token");
			if (!authToken) {
				// User is not logged in, do nothing
				console.log("User is not logged in");
				return;
			}

			// User is logged in, fetch user data
			const response = await axiosClient.get("/api/user", {
				headers: {
					Authorization: `Bearer ${authToken}`,
				},
			});
			const { id } = response.data;
			setUserId(id);
		} catch (error) {
			console.error("Error fetching user data:", error);
		}
	};
	useEffect(() => {
		fetchUserData();
	}, []);




	const handleBloquerRdv = async () => {
		setLoading(true);
		console.log("Received selectedDate from parent component:", selectedDate);
		console.log("Start Date formData:", formData.appointment_date[0]);
		console.log("End Date formData:", formData.appointment_date[1]);
		let startDate, endDate;

		if (!formData.appointment_date) {
						// Use the default selected date from the calendar if an appointment date is not selected
						startDate = selectedDate.date;
						endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
		} else {
						startDate = formData.appointment_date[0];
						endDate = formData.appointment_date[1];
		}

		console.log("Start Date before formatting:", startDate);
		console.log("End Date before formatting:", endDate);

		// Check if startDate is a Date object
		if (startDate instanceof Date && !isNaN(startDate.getTime())) {
						const startDateFormatted = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
						const endDateFormatted = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);

						console.log("Start Date after formatting:", startDateFormatted.toISOString().slice(0, 19).replace("T", " "));
						console.log("End Date after formatting:", endDateFormatted.toISOString().slice(0, 19).replace("T", " "));

						try {
										const formDataToSend = {
														...formData,
														start_date: startDateFormatted.toISOString().slice(0, 19).replace("T", " "),
														end_date: endDateFormatted.toISOString().slice(0, 19).replace("T", " "),
														id_agent: userId,
														id_agenda: agendaId,
										};
										console.log("Sending form data:", formDataToSend);

										// Make the HTTP request to bloquer-rdv endpoint
										const response = await axiosClient.post("api/rdvs/bloquer-rdv", formDataToSend);
										const newAppointment = {
														...response.data,
														id: response.data.id,
										};
										setLoading(false);
										onFormSubmit({ ...response.data, newAppointment });
										console.log("Response block:", response.data);
										message.success("Rendez-vous bloqué avec succès !");
										setShowAlert(false);
										debugger
										setFormData({
											postal: "",
											commentaire: "",
											bloquer: true,
											appointment_date: null,
							});

						} catch (error) {
										if (error.response && error.response.status === 409) {
										console.error("Error adding appointment:", error);

														setShowAlert(true);
														setLoading(false);
														return;
										}

										setLoading(false);
										console.error("Error adding appointment:", error);

						}
		} else {
						// Log the error without displaying it on the page
						console.error("Invalid startDate:", startDate);
						setLoading(false);
		}
};



	return (

		<Form
			initialValues={{ bloquer: true }}
			onFinish={handleBloquerRdv}

		>
			{showAlert && (
				<Alert
					message="La date sélectionnée est déjà réservée."
					type="warning"
					showIcon
					closable
					onClose={() => setShowAlert(false)}
				/>
			)}
			<Card>
				<Row gutter={[16, 16]} style={{ marginBottom: "40px" }}>
					<Col span={16}>
						<ConfigProvider locale={frFR}>
							<DatePicker.RangePicker
								rules={[
									{
										required: true,
										message:
											"Veuillez sélectionner une date de rendez-vous !",
									},
								]}
								value={
									selectedDate
										? [
											moment(selectedDate.date).utcOffset("+0100"),

											moment(selectedDate.date)
												.add(1, "hour")
												.utcOffset("+0100"),
										]
										: null
								}
								showTime={{
									format: "HH:mm",
									minuteStep: 15,
									disabledHours: () => {
										const disabledHours = [];
										for (let i = 0; i < 9; i++) {
											disabledHours.push(i);
										}
										for (let i = 20; i < 24; i++) {
											disabledHours.push(i);
										}
										return disabledHours;
									},
								}}
								format="YYYY-MM-DD HH:mm"
								onChange={(dates) => {
									console.log("Selected dates in range picker:", dates);
									if (dates && dates.length === 2) {
										setFormData({
											...formData,
											appointment_date: dates,
										});
									} else {
										setFormData({
											...formData,
											appointment_date: null,
										});
									}
								}}
							/>
						</ConfigProvider>
					</Col>

					<Col span={6}>
						<SaveButton
							onClick={handleClick}
							loading={loading}
							buttonText="Bloquer"
						/>
					</Col>
				</Row>
				<Row gutter={[16, 16]}>
					<Col span={24}>
						<p><span style={{ color: 'red' }}>* </span> Entrez le code postal :</p>
						<Form.Item name="postal" rules={[{ required: true, message: 'Veuillez entrer le code postal' }]}>
							<Input
								placeholder="Code Postal"
								onChange={(e) => {
									const { value } = e.target;
									setFormData({
											...formData,
											postal: value,
									});
							}}
							/>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={[16, 16]}>
					<Col span={24}>
						<p style={{ marginTop: "10px" }}><span style={{ color: 'red' }}>* </span> Ajoutez un commentaire :</p>
						<Form.Item name="commentaire" rules={[{ required: true, message: 'Veuillez entrer le code postal' }]}>
							<Input.TextArea
								rows={4}
								placeholder="Commentaire"
								onChange={(e) => {
									const { value } = e.target;
									setFormData({
													...formData,
													commentaire: value, 
									});
					}}
							/>
						</Form.Item>
					</Col>
				</Row>





			</Card>
		</Form>

	);
};

export default BlockRdv;
