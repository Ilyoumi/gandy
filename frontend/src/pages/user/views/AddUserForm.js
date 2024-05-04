import React, { useEffect, useState } from "react";
import {
	Form,
	Input,
	Button,
	Col,
	Row,
	Upload,
	message,
	Card,
	Select,
	Modal,
	Spin,
} from "antd";
// import SearchSelect from "../../../constants/SearchSelect";
import axios from "axios";
import {
	UserOutlined,
	LockOutlined,
	MailOutlined,
	VerticalAlignTopOutlined,
} from "@ant-design/icons";
import SaveButton from "../../../constants/SaveButton";
const { Dragger } = Upload;
const props = {
	name: "file",
	multiple: true,
	action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
	onChange(info) {
		const { status } = info.file;
		if (status !== "uploading") {
			console.log(info.file, info.fileList);
		}
		if (status === "done") {
			message.success(`${info.file.name} file uploaded successfully.`);
		} else if (status === "error") {
			message.error(`${info.file.name} file upload failed.`);
		}
	},
	onDrop(e) {
		console.log("Dropped files", e.dataTransfer.files);
	},
};

const roleOptions = [
	{ value: "Admin", label: "Admin" },
	{ value: "Agent", label: "Agent" },
	{ value: "Superviseur", label: "Superviseur" },
	{ value: "Agent Commercial", label: "Agent Commercial" },
];

// Import statements remain unchanged...

const AddUserForm = () => {
	const [form] = Form.useForm();
	const [formData, setFormData] = useState({
		nom: "",
		prenom: "",
		email: "",
		role: "",
		password: "",
		confirmPassword: "",
		image: null,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Simulate loading delay
		const timeout = setTimeout(() => {
			setLoading(false); // Set loading to false after a delay
		}, 1000);

		return () => clearTimeout(timeout);
	}, []);

	const handleChange = (changedValues) => {
		setFormData({
			...formData,
			...changedValues,
		});
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async () => {
		try {
			const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

			if (formData.password !== formData.confirmPassword) {
				throw new Error("The password confirmation does not match.");
			} else {
				console.log(
					"The two passwords are matching",
					formData.confirmPassword,
					formData.password
				);
			}
			const response = await axios.post(
				"http://localhost:8000/api/users",
				formData,
				{
					headers: {
						Accept: "application/json",
						"Content-Type": "multipart/form-data",
						// "X-CSRF-TOKEN": csrfToken,
					},
				}
			);

			// Handle successful response
			Modal.success({
				title: "Utilisateur ajouté avec succès",
				content: "L'utilisateur a été ajouté avec succès.",
			});


			// Reset form fields if needed
			form.resetFields();
		} catch (error) {
			// Handle errors
			Modal.error({
				title: "Erreur lors de l'ajout",
				content: "Une erreur s'est produite lors de l'ajout de l'utilisateur.",
			});
			console.error("Error:", error.response);
		}
	};

	const handleFileUpload = (info) => {
		if (info.file.status === "done") {
			message.success(`${info.file.name} file uploaded successfully.`);
			setFormData({
				...formData,
				image: info.file.originFileObj, // Store the uploaded file object in formData
			});
		} else if (info.file.status === "error") {
			message.error(`${info.file.name} file upload failed.`);
		}
	};


	return (
		<div>
			<Card>
				{loading ? (
					// Render the Spin component while loading
					<div style={{ textAlign: "center", padding: "20px" }}>
						<Spin size="large" />
					</div>
				) : (
					<Form
						form={form}
						layout="vertical"
						initialValues={formData}
						onValuesChange={handleChange}
						onFinish={handleSubmit}
						style={{
							padding: "30px",
						}}
					>
						<Row gutter={[16, 16]}>
							<Col xs={12} sm={8}>
								<Form.Item>
									<Dragger
										name="image"
										{...props}
										onChange={handleFileUpload}
										style={{
											marginTop: "30px",
											padding: "20px 0px",
										}}

									>
										<p className="ant-upload-drag-icon">
											<VerticalAlignTopOutlined />
										</p>
										<p className="ant-upload-text">
											Upload profile picture
										</p>
									</Dragger>

								</Form.Item>
							</Col>
							<Col xs={24} sm={16}>
								<Row gutter={[16, 16]}>
									<Col xs={24} sm={12}>
										<Form.Item
											name="nom"
											label="Nom"
											rules={[
												{
													required: true,
													message:
														"Veuillez entrer votre nom!",
												},
											]}
										>
											<Input
												prefix={<UserOutlined />}
												placeholder="Nom"
												name="nom"
												value={formData.nom}
												onChange={handleInputChange}
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={12}>
										<Form.Item
											name="prenom"
											label="Prenom" // Added prenom
											rules={[
												{
													required: true,
													message:
														"Veuillez entrer votre prenom!", // Updated message
												},
											]}
										>
											<Input
												prefix={<UserOutlined />}
												placeholder="Prenom" // Updated placeholder
												name="prenom"
												value={formData.prenom}
												onChange={handleInputChange}
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={12}>
										<Form.Item
											name="email"
											label="Email"
											rules={[
												{
													required: true,
													message:
														"Veuillez entrer votre email!",
												},
											]}
										>
											<Input
												prefix={<MailOutlined />}
												type="email"
												placeholder="Email"
												name="email"
												value={formData.email}
												onChange={handleInputChange}
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={12}>
										<Form.Item
											name="role"
											label="Role"
											rules={[
												{
													required: true,
													message:
														"Veuillez choisir un rôle!",
												},
											]}
										>
											<Select
												placeholder="Sélectionner un rôle"
												options={roleOptions}
												value={formData.role}
												onChange={(value) =>
													setFormData({
														...formData,
														role: value,
													})
												}
											></Select>
										</Form.Item>
									</Col>
									<Col xs={24} sm={12}>
										<Form.Item
											name="password"
											label="Mot de passe"
											rules={[
												{
													required: true,
													message:
														"Veuillez entrer votre mot de passe!",
												},
											]}
										>
											<Input.Password
												prefix={<LockOutlined />}
												placeholder="Mot de passe"
												name="password"
												value={formData.password}
												onChange={handleInputChange}
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={12}>
										<Form.Item
											name="confirmPassword"
											label="Confirmer le mot de passe"
											dependencies={["password"]}
											rules={[
												{
													required: true,
													message:
														"Veuillez confirmer votre mot de passe!",
												},
												({ getFieldValue }) => ({
													validator(_, value) {
														if (
															!value ||
															getFieldValue(
																"password"
															) === value
														) {
															return Promise.resolve();
														}
														return Promise.reject(
															new Error(
																"Les deux mots de passe ne correspondent pas!"
															)
														);
													},
												}),
											]}
										>
											<Input.Password
												prefix={<LockOutlined />}
												placeholder="Confirmer le mot de passe"
												name="confirmPassword"
												value={formData.confirmPassword}
												onChange={handleInputChange}
											/>
										</Form.Item>
									</Col>
								</Row>
							</Col>
						</Row>
						<Row>
							<Col span={24} style={{ textAlign: "right" }}>

								<SaveButton
									loading={loading}
									buttonText="Enregistrer"
									
								/>
							</Col>
						</Row>
					</Form>
				)}
			</Card>
		</div>
	);
};

export default AddUserForm;
