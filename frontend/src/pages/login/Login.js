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
    Modal,Card
} from "antd";
import signinbg from "../../assets/images/loginbg.png";
import sunlogo from "../../assets/images/sunlogo.png";
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
    const [name, setName] = useState("");
    const [role, setRole] = useState("true");
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState([]);
    const { handleLoginSuccess } = useAuth();
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [userInfo, setUserInfo] = useState({ name: "", role: "" });

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
                    .then((response) => {
                        axiosClient
                            .post(`api/login`, data)
                            .then((res) => {
                                if (res.data.status === 200) {
                                    if (res.data.role === "Admin") {
                                        history.push("/dashboard");
                                    }
                                    console.log("res:", res.data);
                                    localStorage.setItem(
                                        "auth_token",
                                        res.data.token
                                    );
                                    localStorage.setItem(
                                        "auth_name",
                                        res.data.nom + " " + res.data.prenom
                                    );
                                    localStorage.setItem(
                                        "auth_nom",
                                        res.data.nom
                                    );
                                    localStorage.setItem(
                                        "auth_prenom",
                                        res.data.prenom
                                    );
                                    localStorage.setItem(
                                        "user_id",
                                        res.data.id
                                    );
                                    localStorage.setItem(
                                        "user_role",
                                        res.data.role
                                    );

                                    handleLoginSuccess(
                                        res.data.id, 
                                        res.data.nom + " " + res.data.prenom
                                    );
                                    console.log("local Storage", localStorage);
                                    setSuccessModalVisible(true);
                                    setUserInfo({
                                        name: localStorage.getItem("auth_name"),
                                        role: localStorage.getItem("user_role"),
                                    });
                                    console.log(
                                        "successModalVisible",
                                        successModalVisible
                                    );
                                    console.log(
                                        "user info from login: ",
                                        localStorage.getItem("auth_name"),
                                        localStorage.getItem("user_role")
                                    );
                                    message.success(
                                        `Bienvenue, ${res.data.nom},${res.data.role} `
                                    );
                                } else if (res.data.status === 401) {
                                    console.log(res.data);
                                    setAlertVisible(true);
                                    setAlertMessage(
                                        <p key="error-message">
                                            L'adresse e-mail ou le mot de passe
                                            est incorrect. <br></br> Veuillez
                                            réessayer.
                                        </p>
                                    );
                                } else {
                                    console.error(
                                        "Login failed:",
                                        res.data.message
                                    );
                                }
                            })
                            .catch((error) => {
                                console.error(
                                    "An error occurred during login:",
                                    error
                                );
                            });
                    })
                    .catch((error) => {
                        console.error(
                            "An error occurred while fetching CSRF token:",
                            error
                        );
                    });
            })
            .catch((error) => {
                console.error("Form validation failed:", error);
            });
    };

    const onFinishFailed = (errorInfo) => {
        setAlertVisible(true);
        console.log("Failed:", errorInfo);
    };

    const handleRememberChange = (checked) => {
        setRemember(checked);
    };

    return (
        <>
         <Layout className="layout-default layout-signin">
                <Content className="signin">
                    <Row justify="center" className="logo-row">
                        <Col>
                            <Link to="/login">
                            <img src={sunlogo} alt="Logo 3" className="logo-img" style={{ width: 250 }} />
                            </Link>
                        </Col>
                        <Col>
                            <img src={by} alt="Logo 2" className="logo-img" style={{ width: 250 }}/>
                        </Col>
                        <Col>
                            <Link to="/">
                                <img src={logo} alt="Logo 3" className="logo-img" style={{ width: 250 }} />
                            </Link>
                        </Col>
                    </Row>

                    <Row justify="center">
                        <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                            <Card className="login-card">
                                <Title level={3} className="mb-15">Sunlight-call PRDV</Title>
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
                                        defaultChecked
                                        onChange={handleRememberChange}
                                    />
                                    Remember me
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
                            </Card>
                        </Col>
                    </Row>
                    <Modal
                        title="Connexion réussie"
                        open={successModalVisible}
                        onCancel={() => setSuccessModalVisible(false)}
                        footer={null}
                    >
                        <p>Bienvenue, {userInfo.name}!</p>
                        <p>Votre rôle est {userInfo.role}.</p>
                        <Button
                            type="primary"
                            onClick={() => setSuccessModalVisible(false)}
                        >
                            OK
                        </Button>
                    </Modal>
                </Content>
            </Layout>
        </>
    );
};

export default Login;
