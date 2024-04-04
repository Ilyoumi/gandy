// AddAgendaModal.js

import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Card, Row, Col, Select } from "antd";
import { axiosClient } from "../../../api/axios";

const { Option } = Select;

const AddAgendaModal = ({ visible, onCancel, onCreate }) => {
    const [form] = Form.useForm();
    const [agentCommercialUsers, setAgentCommercialUsers] = useState([]);
    const [calendarId, setCalendarId] = useState(null);

    useEffect(() => {
        fetchAgentCommercialUsers();
    }, []);

    const fetchAgentCommercialUsers = async () => {
        try {
            const response = await axiosClient.get(
                "/api/users/agent-commercial"
            );
            setAgentCommercialUsers(response.data.users);
            console.log("agentCommercialUsers", response.data.users);
        } catch (error) {
            console.error("Error fetching agent commercial users:", error);
        }
    };

    const handleSubmit = async (values) => {
        try {
            console.log('Submitting agenda form with values:', values);
    
            const response = await axiosClient.post('/api/agendas', {
                ...values,
                calendar_id: calendarId // Include calendar_id in the request data
            });
            console.log('Response from backend:', response.data);
    
            const { agenda, calendar_id } = response.data;
            console.log('Received agenda data:', agenda);
            console.log('Received calendar ID:', calendar_id);
            setCalendarId(calendar_id);
            console.log('Set calendar ID:', calendar_id);
    
            onCreate(agenda);
            console.log('Created agenda:', agenda);
    
            onCancel();
            console.log('Cancelled modal');
    
            form.resetFields();
            console.log('Form fields reset');
        } catch (error) {
            console.log("ERROR", error);
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
                initialValues={{
                    contact:
                        agentCommercialUsers.length > 0
                            ? agentCommercialUsers[0].value
                            : "",
                }}
            >
                <Card>
                <Form.Item
                        label="Calendrier"
                        name="calendarId"
                        initialValue={calendarId}
                        hidden // Hide the field as it's automatically set
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Nom"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Veuillez saisir le nom!",
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
                            {agentCommercialUsers.map((user) => (
                                <Option key={user.id} value={user.id}>
                                    {user.name}
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
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{ backgroundColor: "#00CC6A" }}
                                >
                                    Sauvegarder
                                </Button>
                            </Col>
                            <Col span={6}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{ backgroundColor: "#40A2D8" }}
                                >
                                    Sauvegarder et Nouveau
                                </Button>
                            </Col>
                        </Row>
                    </Form.Item>
                </Card>
            </Form>
        </Modal>
    );
};

export default AddAgendaModal;
