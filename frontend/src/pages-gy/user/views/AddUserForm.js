import React, { useState } from "react";
import { Form, Input, Button, Col, Row, Upload, message, Select , Card} from "antd";
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    VerticalAlignTopOutlined,
} from "@ant-design/icons";
import DisplayUsers from "./DisplayUsers";

const { Dragger } = Upload;
const { Option } = Select;
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

const AddUserForm = () => {
    const [form] = Form.useForm();
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        role: "",
        password: "",
        confirmPassword: "",
        avatar: null,
    });

    const handleChange = (changedValues) => {
        setFormData({
            ...formData,
            ...changedValues,
        });
    };

    const handleSubmit = () => {
        console.log(formData);
    };

    return (
        <div>
        <Card style={{ marginBottom:"10px" }}>
        <Row>
        <Col span={12} style={{ textAlign: "left", fontWeight:"bold", fontSize:"20px" }}>
        Créer Utilisateur
                </Col>
        </Row>

        </Card>
        <Card>
        <Form
                form={form}
                layout="vertical"
                initialValues={formData}
                onValuesChange={handleChange}
                onFinish={handleSubmit}
                style={{
                    padding: "30px 80px",
                    
                }}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={12} sm={8}>
                        <Form.Item>
                            <Dragger
                                {...props}
                                style={{
                                    marginTop: "30px",
                                    padding: "20px 0px",
                                }}
                            >
                                <p className="ant-upload-drag-icon">
                                    <VerticalAlignTopOutlined />
                                </p>
                                <p className="ant-upload-text">
                                    Upload profile pictute
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
                                    <Select placeholder="Sélectionner un rôle">
                                        <Option value="admin">Admin</Option>
                                        <Option value="agent">Agent</Option>
                                        <Option value="superviseur">
                                            Superviseur
                                        </Option>
                                        <Option value="agent_commercial">
                                            Agent Commercial
                                        </Option>
                                    </Select>
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
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style={{ textAlign: "right" }}>
                        <Button type="primary" htmlType="submit">
                        Créer
                        </Button>
                    </Col>
                </Row>
            </Form>

        </Card>
            
            <DisplayUsers />
        </div>
    );
};

export default AddUserForm;
