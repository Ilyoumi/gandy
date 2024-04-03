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
} from "antd";
import signinbg from "../../../assets/images/loginbg.png";
import logo from "../../../assets/images/gy.png";
import { useHistory } from "react-router-dom";
import { axiosClient } from "../../../api/axios";
import { useAuth } from "../../../AuthContext";
const { Title } = Typography;
const { Content } = Layout;

const Login = () => {
    const [remember, setRemember] = useState(true);
    const { handleLoginSuccess } = useAuth();
    
    
    const [form] = Form.useForm();
    const history = useHistory();
    const onFinish = () => {
        form.validateFields().then((values) => { // validateFields is used to get form values
            const data = {
                email: values.email,
                password: values.password,
            };
    
            axiosClient.get("/sanctum/csrf-cookie")
                .then((response) => {
                    axiosClient.post(`api/login`, data)
                        .then((res) => {
                            if (res.data.status === 200) {
                                localStorage.setItem("auth_token", res.data.token);
                                localStorage.setItem("auth_name", res.data.username);
                                handleLoginSuccess(res.data.username);
                                fetchAndUpdateRole(res.data.token);
                                console.log("res:",res.data)
                                console.log(localStorage)
    
                                if (res.data.role === "admin") {
                                    history.push("/admin/dashboard");
                                } else {
                                    history.push("/dashboard");
                                }
                            } else if (res.data.status === 401) {
                                // Handle 401 Unauthorized error if needed
                            } else {
                                // Handle other status codes or validation errors
                                console.error("Login failed:", res.data.message);
                            }
                        })
                        .catch((error) => {
                            console.error("An error occurred during login:", error);
                            // Log the error
                            // You can also handle the error or display an error message to the user if needed
                        });
                })
                .catch((error) => {
                    console.error("An error occurred while fetching CSRF token:", error);
                    // Log the error
                    // You can also handle the error or display an error message to the user if needed
                });
        }).catch((error) => {
            console.error("Form validation failed:", error);
            // Log the validation error
            // You can also handle the validation error or display an error message to the user if needed
        });
    };

    const fetchAndUpdateRole = (token) => {
        axiosClient.get("/api/user", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                const { role } = response.data;
                if (role) {
                    localStorage.setItem("user_role", role); // Update user role in localStorage
                    handleLoginSuccess(response.data.name);
                    console.log("role",localStorage )
                    if (role === "admin") {
                        history.push("/admin/dashboard");
                    } else {
                        history.push("/dashboard");
                    }
                } else {
                    console.error("User role not found in response data");
                }
            })
            .catch((error) => {
                console.error("An error occurred while fetching user data:", error);
            });
    };
    
    
    
    
    
    
    

    const onFinishFailed = (errorInfo) => {
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
                        gutter={[24, 0]}
                        justify="space-around"
                        align="left"
                        style={{}}
                    >
                        <Col
                            xs={{ span: 24, offset: 0 }}
                            lg={{ span: 20, offset: 4 }}
                            md={{ span: 24 }}
                        >
                            <img src={logo} alt="" style={{ width: "100px" }} />
                        </Col>
                    </Row>
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
                                    validateStatus={form.getFieldError('email') ? 'error' : ''}
    help={form.getFieldError('email')?.[0]}
                                    
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
                                    validateStatus={form.getFieldError('password') ? 'error' : ''}
    help={form.getFieldError('password')?.[0]}
                                    
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Veuillez saisir votre mot de passe!",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Password" />
                                    
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
                                        htmlType="submit"
                                        style={{ width: "100%" }}
                                    >
                                        Se connecter
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Col>
                        <Col
                            xs={{ span: 24, offset: 0 }}
                            lg={{ span: 2, offset: 0 }}
                            md={{ span: 12 }}
                        ></Col>
                        <Col
                            className="sign-img"
                            // style={{ padding: 12 }}
                            xs={{ span: 24 }}
                            lg={{ span: 10 }}
                            md={{ span: 12 }}
                        >
                            <img src={signinbg} alt="" />
                        </Col>
                    </Row>
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
