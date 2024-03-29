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
import handleLogin from "../services/apis/login/loginApi";
import { useHistory } from "react-router-dom";
import { axiosClient } from "../../../api/axios";

const { Title } = Typography;
const { Content } = Layout;

const SignIn = () => {
    const [remember, setRemember] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();

    const onFinish = async (values) => {
        const axios = axiosClient.defaults
        console.log(values, axios)
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
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                layout="vertical"
                                className="row-col"
                            >
                                <Form.Item
                                    className="username"
                                    label="Email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
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

export default SignIn;
