import React, { useState } from "react";
import { DatePicker, Input, Form, ConfigProvider, Card, Row, Col, message, Alert } from "antd";
import frFR from "antd/lib/locale/fr_FR";
import moment from "moment";
import NewButton from "../../../constants/NewButton";
import { axiosClient } from "../../../api/axios";

const AddPrivateAppointmentModal = ({ userId, agendaId, onFormSubmit, selectedDate, }) => {

	const [formData, setFormData] = useState({
		postal: "",
		appointment_date: selectedDate
			? [
				moment(selectedDate.date).utcOffset("+0100"),
				moment(selectedDate.date).add(1, "hour").utcOffset("+0100"),
			]
			: null,
	});
	
	const [loading, setLoading] = useState(false);
	const [showAlert, setShowAlert] = useState(false);

	const handleClick = () => {
		setLoading(true);
		handleFormSubmit();
		setTimeout(() => {
			setLoading(false);
		}, 2000);
	};
	const handleFormSubmit = async () => {
		setLoading(true);
		console.log("Received selectedDate from parent component:", selectedDate);
		console.log("formData.appointment_date:", formData.appointment_date);
		if (formData.appointment_date === null) {
			console.log("Appointment date is null");
			setLoading(false);
			return;
	}
		let startDate, endDate;

		if (!formData.appointment_date) {
			startDate = selectedDate.date.toDate();
			endDate = startDate.getTime() + 60 * 60 * 1000;
			endDate = new Date(endDate);
		} else {
			startDate = formData.appointment_date[0].toDate();
			endDate = formData.appointment_date[1].toDate();
		}

		// Check if startDate is a Date object
		if (startDate instanceof Date || !isNaN(startDate.getTime())) {
						const startDateFormatted = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
						const endDateFormatted = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);
						

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
										const response = await axiosClient.post("api/rdvs/add-rdv-prv", formDataToSend);
										const newAppointment = {
														...response.data,
														id: response.data.id,
										};
										setLoading(false);
										onFormSubmit({ ...response.data, newAppointment });
										console.log("Response block:", response.data);
										message.success("Rendez-vous bloqué avec succès !");
										setShowAlert(false);
										

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
						console.log("Invalid startDate:", startDate);
						setLoading(false);
		}
};



	return (

			
			<Form layout="vertical" onFinish={handleFormSubmit} >
				{showAlert && (
				<Alert
					message="La date sélectionnée est déjà réservée."
					type="warning"
					showIcon
					closable
					onClose={() => setShowAlert(false)}
				/>
			)}
			<Card style={{ marginTop: "40px" }}>
				<Row gutter={[16, 16]} style={{ marginBottom: "40px" }}>
					<Col span={24}>
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
									console.log("Selected dates:", dates);
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
					<Col span={8} offset={15}>
						<NewButton
							onClick={handleClick}
							loading={loading}
							buttonText="Ajouter"
						/>
					</Col>
					


				</Row>


			</Card>
		</Form>
	);
};

export default AddPrivateAppointmentModal;
