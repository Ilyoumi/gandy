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
    const onFinish = async (values) => {
        try {
            // Make a request to fetch the CSRF cookie
            await axiosClient.get("/sanctum/csrf-cookie");
    
            // Make a request to login
            const response = await axiosClient.post("/login", values);
    
            // Check if login is successful
            if (response.status === 204) {
                console.log("Login successful!");
                handleLoginSuccess()
                history.push("/dashboard");
                
                // Fetch user info after successful login
                // try {
                //     const userInfoResponse = await axiosClient.get("/api/user");
                //     const userInfo = userInfoResponse.data.user;
                //     console.log("user data", userInfo);
                
                //     // Pass user info to the handleLoginSuccess function
                //     handleLoginSuccess(userInfo);
                
                //     // Redirect to dashboard
                // } catch (userInfoError) {
                //     console.error("Error fetching user info:", userInfoError);
                    
                //     // Log more details from the error response if available
                //     if (userInfoError.response && userInfoError.response.data) {
                //         console.error("Error response data:", userInfoError.response.data);
                //     }
                    
                //     // Handle error fetching user info
                // }
                
            } else {
                console.log("Login failed:", response.data.message);
                // Set form validation error
                form.setFields([
                    {
                        name: "email",
                        errors: ["Identifiants incorrects. Veuillez réessayer."],
                    },
                    {
                        name: "password",
                        errors: ["Identifiants incorrects. Veuillez réessayer."],
                    },
                ]);
            }
        } catch (error) {
            console.error("Error occurred:", error);
            // Display the error message from the server response
            if (error.response && error.response.data && error.response.data.message) {
                console.error("Server error message:", error.response.data.message);
                // Log the exact error message received from the server
            } else {
                console.error("Unexpected error occurred:", error.message);
            }
        }
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
