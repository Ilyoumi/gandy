import React from "react";
import { Form, Input, Select, Button } from "antd";

const { Option } = Select;

const UpdateAgenda = ({ initialValues, onSubmit }) => {
    const [form] = Form.useForm();

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            onSubmit(values);
            form.resetFields(); // Reset form fields after submission
        } catch (errorInfo) {
            console.log("Failed:", errorInfo);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={initialValues} // Set initial form values
        >
            <Form.Item
                label="Titre"
                name="title"
                rules={[{ required: true, message: "Please input the titre!" }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Contact"
                name="contact"
                rules={[{ required: true, message: "Please select a contact!" }]}
            >
                <Select placeholder="Sélectionner un contact">
                    <Option value="contact1">Contact 1</Option>
                    <Option value="contact2">Contact 2</Option>
                    <Option value="contact3">Contact 3</Option>
                    <Option value="contact4">Contact 4</Option>
                    <Option value="contact5">Contact 5</Option>
                </Select>
            </Form.Item>
            <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: "Please input the description!" }]}
            >
                <Input.TextArea rows={4} />
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
