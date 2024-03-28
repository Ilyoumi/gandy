import React, { Component } from "react";
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


const { Title } = Typography;
const {  Content } = Layout;

export default class SignIn extends Component {
  render() {
    const onFinish = (values) => {
      console.log("Success:", values);
    };

    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };
    return (
      <>
        <Layout className="layout-default layout-signin">
          <Content className="signin">
            <Row
             gutter={[24, 0]}
             justify="space-around"
             align="left"
             style={{ }}
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
                <Title className="mb-15">Sign In</Title>
                <Title className="font-regular text-muted" level={5}>
                  Enter your email and password to sign in
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
                    rules={[
                      {
                        required: true,
                        message: "Please input your email!",
                      },
                    ]}
                  >
                    <Input placeholder="Email" />
                  </Form.Item>

                  <Form.Item
                    className="username"
                    label="Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
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
                    <Switch defaultChecked onChange={onChange} />
                    Remember me
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ width: "100%" }}
                    >
                      SIGN IN
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
                lg={{ span: 10  }}
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
  }
}

function onChange(checked) {
  console.log(`switch to ${checked}`);
}
