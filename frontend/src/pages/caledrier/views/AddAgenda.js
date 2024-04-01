// AddAgendaModal.js

import React, { useState } from "react";
import { Modal, Form, Input, Button, Card, Row, Col, Select } from "antd";

const { Option } = Select;

const options = [
    { value: "contact1", label: "Contact 1" },
    { value: "contact2", label: "Contact 2" },
    { value: "contact3", label: "Contact 3" },
    { value: "contact4", label: "Contact 4" },
    { value: "contact5", label: "Contact 5" },
];

const AddAgendaModal = ({ visible, onCancel, onCreate }) => {
    const [form] = Form.useForm();

    const handleSubmit = (values) => {
        try{
            onCreate(values); // Pass form values to the parent component to create a new calendar
        onCancel(); // Close the modal after submitting
        form.resetFields(); // Reset form fields
        console.log("All is well")
        }catch(error){
            console.log("ERROR", error)
        }
    };

    return (
        <Modal
            title="Ajouter Agenda"
            visible={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit} // Handle form submission
                initialValues={{ contact: options[0].value }} // Set initial value for contact
            >
                <Card>
                    <Form.Item
                        label="Titre"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: "Please input the titre!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Contact"
                        name="contact"
                        rules={[
                            {
                                required: true,
                                message: "Please select a contact!",
                            },
                        ]}
                    >
                        <Select placeholder="Sélectionner un contact">
                            {options.map((option) => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: "Please input the description!",
                            },
                        ]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item>
                        <Row gutter={[16, 16]}>
                            <Col span={7}>
                                <Button type="primary" htmlType="submit" style={{ backgroundColor: "#00CC6A" }}>Sauvegarder</Button>
                            </Col>
                            <Col span={6}>
                                <Button type="primary" htmlType="submit" style={{ backgroundColor: "#40A2D8" }}>Sauvegarder et Nouveau</Button>
                            </Col>
                        </Row>
                    </Form.Item>
                </Card>
            </Form>
        </Modal>
    );
};

export default AddAgendaModal;
