import React, { useState } from "react";
import {
	Layout,
	Button,
	Row,
	Col,
	Typography,
	Form,
	Input,
	Switch,
	message,
	Alert,
	Modal, Card
} from "antd";
import sunlogo from "../../assets/images/LOGO_sunlightcall.png";
import logo from "../../assets/images/lg.png";
import by from "../../assets/images/by.png";
import { axiosClient } from "../../api/axios";
import { useAuth } from "../../AuthContext";
import { useHistory, Link } from "react-router-dom";
import "./login.css";

const { Title } = Typography;
const { Content } = Layout;

const Login = () => {
	const [remember, setRemember] = useState(true);


	const [alertVisible, setAlertVisible] = useState(false);
	const [alertMessage, setAlertMessage] = useState([]);
	const { handleLoginSuccess } = useAuth();

	const [form] = Form.useForm();
	const [loadings, setLoadings] = useState([]);
	const history = useHistory();

	const enterLoading = (index) => {
		setLoadings((prevLoadings) => {
			const newLoadings = [...prevLoadings];
			newLoadings[index] = true;
			return newLoadings;
		});
		setTimeout(() => {
			setLoadings((prevLoadings) => {
				const newLoadings = [...prevLoadings];
				newLoadings[index] = false;
				return newLoadings;
			});
		}, 6000);
	};
	const onFinish = () => {
		form.validateFields()
			.then((values) => {
				const data = {
					email: values.email,
					password: values.password,
				};

				axiosClient
					.get("/sanctum/csrf-cookie")
					.then(() => {
						axiosClient
							.post(`api/login`, data)
							.then((res) => {
								if (res.data.status === 200) {
									const { token, nom, prenom, role } = res.data;

									localStorage.setItem("auth_token", token);
									localStorage.setItem("auth_name", `${nom} ${prenom}`);
									localStorage.setItem("user_role", role);

									handleLoginSuccess();

									switch (role) {
										case "Admin":
											history.push("/dashboard");
											break;
										case "Superviseur":
											history.push("/calendrier");
											break;
										case "Agent":
											history.push("/calendrier");
											break;
											case "Agent Commercial":
											history.push("/agent-commercial-calendrier");
											break;
										default:
											console.error("Unknown user role:", role);
									}

									message.success(`Bienvenue, ${nom} - ${role} !`);
								} else {
									console.error("Échec de la connexion :", res.data.message);
								}
							})
							.catch((error) => {
								if (error.response && error.response.status === 401) {
									setAlertVisible(true);
									setAlertMessage("Adresse e-mail ou mot de passe incorrect. Veuillez réessayer.");
								} else {
									console.error("Une erreur s'est produite lors de la connexion :", error);
								}
							});
					})
					.catch((error) => {
						console.error("Une erreur s'est produite lors de la récupération du jeton CSRF :", error);
					});
			})
			.catch((error) => {
				console.error("La validation du formulaire a échoué :", error);
			});
	};

	const onFinishFailed = (errorInfo) => {
		setAlertVisible(true);
	};


	const handleRememberChange = (checked) => {
		setRemember(checked);
		if (!checked) {
			localStorage.removeItem("auth_token");
			localStorage.removeItem("auth_name");
			localStorage.removeItem("user_role");
		}
	};


	return (
		<>
			<Layout className="layout-default" style={{ backgroundColor: 'white' }}>
				<Content className="signin">
					<Row justify="center" className="logo-row">
						<Col>
							<Link to="/login">
								<img src={sunlogo} alt="Logo 3" className="logo-img" style={{ width: 250 }} />
							</Link>
						</Col>
						<Col>
							<img src={by} alt="Logo 2" className="logo-img" style={{ width: 250 }} />
						</Col>
						<Col>
							<Link to="/">
								<img src={logo} alt="Logo 3" className="logo-img" style={{ width: 250 }} />
							</Link>
						</Col>
					</Row>
					<Row justify="center">
						<Col xs={{ span: 24 }} lg={{ span: 10 }}>
							{alertVisible && (
								<Alert
									message="Erreur de connexion"
									description={alertMessage}
									type="error"
									showIcon
									closable
									onClose={() => setAlertVisible(false)}
								/>
							)}
						</Col>
					</Row>
					<br></br>
					<Row justify="center">
						<Col xs={{ span: 24 }} lg={{ span: 8 }}>
							<Card className="login-card">
								<Title level={3} className="mb-15 title-auth">Sunlight-call PRDV</Title>
								<Form
									form={form}
									onFinish={onFinish}
									onFinishFailed={onFinishFailed}
									layout="vertical"
									className="row-col"
								>
									<Form.Item
										className="username"
										label="Email"
										name="email"
										validateStatus={
											alertVisible &&
												form.getFieldError("email")
												? "error"
												: ""
										}
										help={
											alertVisible &&
											form.getFieldError("email")?.[0]
										}
										rules={[
											{
												required: true,
												message:
													"Veuillez saisir votre adresse e-mail!",
											},
										]}
									>
										<Input placeholder="Email" />
									</Form.Item>

									<Form.Item
										className="username"
										label="Password"
										name="password"
										validateStatus={
											alertVisible &&
												form.getFieldError("password")
												? "error"
												: ""
										}
										help={
											alertVisible &&
											form.getFieldError("password")?.[0]
										}
										rules={[
											{
												required: true,
												message:
													"Veuillez saisir votre mot de passe!",
											},
										]}
									>
										<Input.Password placeholder="Password" />
									</Form.Item>

									<Form.Item
										name="remember"
										className="aligin-center"
										valuePropName="checked"
									>

										<Switch
											defaultChecked={false}
											onChange={handleRememberChange}
										/>

										Souviens moi
									</Form.Item>


									<Form.Item>
										<Button
											type="primary"
											style={{ width: "100%" }}
											htmlType="submit"
										>
											Se connecter
										</Button>
									</Form.Item>
								</Form>

							</Card>
						</Col>
					</Row>
				</Content>
			</Layout>
		</>
	);
};

export default Login;
