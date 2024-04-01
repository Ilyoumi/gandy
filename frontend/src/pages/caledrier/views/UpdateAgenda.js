import React from "react";
import { Form, Input, Select, Button } from "antd";

const { Option } = Select;

const UpdateAgenda = ({ initialValues, onSubmit }) => {
    const [form] = Form.useForm();

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            onSubmit(values);
        } catch (errorInfo) {
            console.log("Failed:", errorInfo);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={initialValues}
        >
            <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please input the name!" }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Agent"
                name="agent"
                rules={[{ required: true, message: "Please select an agent!" }]}
            >
                <Select>
                    <Option value="agent1">Agent 1</Option>
                    <Option value="agent2">Agent 2</Option>
                    <Option value="agent3">Agent 3</Option>
                    {/* Add more options as needed */}
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Mettre à jour
                </Button>
            </Form.Item>
        </Form>
    );
};

export default UpdateAgenda;
