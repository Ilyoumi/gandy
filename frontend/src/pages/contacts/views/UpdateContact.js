import React, { useState, useEffect } from "react";
import { Input, Button, Modal, Form, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const UpdateContactModal = ({ visible, onCancel, onUpdate, initialValues }) => {
    const [form] = Form.useForm();

    const handleImageChange = (info) => {
        if (info.file.status === "done") {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (info.file.status === "error") {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    const handleSubmit = () => {
        form
            .validateFields()
            .then((values) => {
                form.resetFields();
                const { nom, email } = values;
                const [prenom = '', nomValue = ''] = nom ? nom.split(' ') : [];
                const updatedValues = { nom: nomValue, email };
                onUpdate(updatedValues);
                axios
                    .put(`/api/users/${initialValues.id}`, updatedValues)
                    .then((response) => {
                        console.log("User updated successfully:", response.data);
                    })
                    .catch((error) => {
                        console.error("Error updating user:", error);
                    });
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
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
            <Form
                form={form}
                initialValues={initialValues}
            >
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
                    rules={[{ required: true, message: "Veuillez entrer le nom!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: "Veuillez entrer l'email!" }]}
                >
                    <Input />
                </Form.Item>
                
            </Form>
        </Modal>
    );
};

export default UpdateContactModal;
