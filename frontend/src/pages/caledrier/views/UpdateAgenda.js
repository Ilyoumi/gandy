import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Modal } from "antd";
import { axiosClient } from "../../../api/axios";

const { Option } = Select;

const UpdateAgenda = ({ initialValues, onSubmit, onClose, updateAgendas }) => {
    const [agentCommercialUsers, setAgentCommercialUsers] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchAgentCommercialUsers();
    }, []);

    const fetchAgentCommercialUsers = async () => {
        try {
            const response = await axiosClient.get(
                "/api/users/agent-commercial"
            );
            setAgentCommercialUsers(response.data.users);
        } catch (error) {
            console.error("Error fetching agent commercial users:", error);
        }
    };

    const handleUpdateAgenda = async (values) => {
        try {
            // Make a PUT request to update the agenda data
            const response = await axiosClient.put(
                `/api/agendas/${initialValues.id}`,
                values
            );

            // Handle success response
            
            try {
                const response = await axiosClient.get(
                    "http://localhost:8000/api/agendas"
                );
            updateAgendas();
            onClose();
            
                
            } catch (error) {
                
                console.error("Error fetching agendas:", error);
            }

            // Optionally, update the state or perform any necessary actions
        } catch (error) {
            // Handle error response
            console.error("Error updating agenda:", error.response.data.error);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateAgenda}
            initialValues={initialValues}
        >
            <Form.Item
                label="Titre"
                name="name"
                rules={[{ required: true, message: "Please input the titre!" }]}
            >
                <Input value={initialValues.name} />
            </Form.Item>
            <Form.Item
                label="Agent"
                name="contact_id"
                rules={[
                    { required: true, message: "Please select a contact!" },
                ]}
            >
                <Select
                    placeholder="Sélectionner un contact"
                    onChange={(value) =>
                        form.setFieldsValue({ contact_id: value })
                    }
                >
                    {agentCommercialUsers.map((user) => (
                        <Option
                            key={user.id}
                            value={user.id}
                        >{`${user.prenom} ${user.nom}`}</Option>
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
                <Input.TextArea
                    rows={4}
                    value={initialValues.description}
                    onChange={(e) =>
                        form.setFieldsValue({ description: e.target.value })
                    }
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Sauvegarder
                </Button>
            </Form.Item>
        </Form>
    );
};

export default UpdateAgenda;
