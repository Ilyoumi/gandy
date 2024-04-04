import React, { useState } from "react";
import { Form, Input, Button, Col, Row, Upload, message , Card} from "antd";
import SearchSelect from "../../../constants/SearchSelect";
import axios from 'axios';
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    VerticalAlignTopOutlined,
} from "@ant-design/icons";
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
    { value: 'Admin', label: 'Admin' },
    { value: 'Agent', label: 'Agent' },
    { value: 'Superviseur', label: 'Superviseur' },
    { value: 'Agent Commercial', label: 'Agent Commercial' },
];


// Import statements remain unchanged...

const AddUserForm = () => {
    const [form] = Form.useForm();
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        role_name: "", 
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        try {
            if (formData.password !== formData.confirmPassword) {
                throw new Error("The password confirmation does not match.");
            } else{
                console.log("The two passwords are matching", formData.confirmPassword, formData.password)
            }
            console.log('Sending data:', formData);
            const response = await axios.post(
                'http://localhost:8000/api/users',
                formData,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }
            );
            message.success(response.data.message);
            // Optionally, clear the form fields if needed
            form.resetFields();
        } catch (error) {
            // Log the error details
    
            // Display an error message to the user
            console.error('Error:', error.response);
        }
    };
    
    

    

    return (
        <div>
            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={formData}
                    onValuesChange={handleChange}
                    onFinish ={handleSubmit}
                    style={{
                        padding: "30px",
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
                                        name="role_name"
                                        label="Role"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Veuillez choisir un rôle!",
                                            },
                                        ]}
                                    >
                                        <SearchSelect placeholder="Sélectionner un rôle" options={roleOptions} />
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
                            <Button type="primary" htmlType="submit">
                                Enregistrer
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </div>
    );
};

export default AddUserForm;