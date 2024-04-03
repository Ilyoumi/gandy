import React from "react";
import { Modal, Form, Input, Select, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const UpdateUserModal = ({ visible, onCancel, onUpdate, userData }) => {
    const [form] = Form.useForm();

    const handleImageChange = (info) => {
        if (info.file.status === "done") {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (info.file.status === "error") {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            onUpdate(values);
            form.resetFields();
        });
    };

    return (
        <Modal
            visible={visible}
            title="Modifier Utilisateur"
            okText="Modifier"
            onCancel={onCancel}
            onOk={handleSubmit}
        >
            <Form form={form} initialValues={userData} layout="vertical">
                <Form.Item
                    name="image"
                    label="Image"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => {
                        if (Array.isArray(e)) {
                            return e;
                        }
                        return e && e.fileList;
                    }}
                    style={{ marginBottom: 20 }}
                >
                    <Upload
                        name="image"
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        listType="picture"
                        maxCount={1}
                        onChange={handleImageChange}
                        style={{ width: "100%" }}
                    >
                        <Button icon={<UploadOutlined />}>Uploader</Button>
                    </Upload>
                </Form.Item>
                <Form.Item
                    name="nom"
                    label="Nom"
                    rules={[{ required: true, message: "Veuillez entrer votre nom!" }]}
                    style={{ marginBottom: 20 }}
                >
                    <Input placeholder="Nom" />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: "Veuillez entrer votre email!" }]}
                    style={{ marginBottom: 20 }}
                >
                    <Input type="email" placeholder="Email" />
                </Form.Item>
                <Form.Item
                    name="role"
                    label="Rôle"
                    rules={[{ required: true, message: "Veuillez sélectionner un rôle!" }]}
                    style={{ marginBottom: 20 }}
                >
                    <Select placeholder="Sélectionner un rôle" style={{ width: "100%" }}>
                        <Option value="Admin">Admin</Option>
                        <Option value="Agent">Agent</Option>
                        <Option value="Superviseur">Superviseur</Option>
                        <Option value="Agent Commercial">Agent Commercial</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateUserModal;
