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
    Modal,
} from "antd";
import signinbg from "../../assets/images/loginbg.png";
import logo from "../../assets/images/gy.png";
import { axiosClient } from "../../api/axios";
import { useAuth } from "../../AuthContext";
import { useHistory } from "react-router-dom";

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
                // validateFields is used to get form values
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
                                    // Display success message using message.success
                                    message.success(
                                        `Bienvenue, ${res.data.nom},${res.data.role} `
                                    );
                                } else if (res.data.status === 401) {
                                    console.log(res.data);
                                    setAlertVisible(true); // Show error message
                                    setAlertMessage(
                                        <p key="error-message">
                                            L'adresse e-mail ou le mot de passe
                                            est incorrect. <br></br> Veuillez
                                            réessayer.
                                        </p>
                                    );
                                } else {
                                    // Handle other status codes or validation errors
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
                                // Log the error
                                // You can also handle the error or display an error message to the user if needed
                            });
                    })
                    .catch((error) => {
                        console.error(
                            "An error occurred while fetching CSRF token:",
                            error
                        );
                        // Log the error
                        // You can also handle the error or display an error message to the user if needed
                    });
            })
            .catch((error) => {
                console.error("Form validation failed:", error);
                // Log the validation error
                // You can also handle the validation error or display an error message to the user if needed
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
            
                    <Row
                        gutter={[0, 0]}
                        justify="space-around"
                        align="middle"
                        style={{ height: "70%" }}
                    >
                        <Col
                            xs={{ span: 24, offset: 0 }}
                            lg={{ span: 8, offset: 4 }}
                            md={{ span: 12 }}
                        >
                            <Title className="mb-15">Connexion</Title>
                            <Title
                                className="font-regular text-muted"
                                level={5}
                            >
                                Entrez votre email et votre mot de passe pour
                                vous connecter
                            </Title>
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
                {/* <Footer>
    <p className="copyright">
      {" "}
      Copyright © 2024 GANDY Inc. All rights reserved
.{" "}
    </p>
  </Footer> */}
            </Layout>
        </>
    );
};

export default Login;
