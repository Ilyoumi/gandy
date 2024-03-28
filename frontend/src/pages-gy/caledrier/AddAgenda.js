import React from "react";
import { Modal, Form, Input, Button, Select } from "antd";

const { Option } = Select;

const AddAgendaModal = ({ visible, onCancel, onSubmit }) => {
    const [form] = Form.useForm();

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            onSubmit(values);
            form.resetFields();
        } catch (errorInfo) {
            console.log("Failed:", errorInfo);
        }
    };

    return (
        <Modal
            title="Ajouter Agenda"
            visible={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Titre"
                    name="titre"
                    rules={[
                        { required: true, message: "Please input the titre!" },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Contact"
                    name="contact"
                    rules={[
                        { required: true, message: "Please select a contact!" },
                    ]}
                >
                    <Select
                        showSearch
                        placeholder="Search to Select"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.label ?? "").includes(input)
                        }
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? "")
                                .toLowerCase()
                                .localeCompare(
                                    (optionB?.label ?? "").toLowerCase()
                                )
                        }
                        options={[
                            {
                                value: "contact1",
                                label: "Contact 1",
                            },
                            {
                                value: "contact2",
                                label: "Contact 2",
                            },
                            {
                                value: "contact3",
                                label: "Contact 3",
                            },
                            {
                                value: "contact4",
                                label: "Contact 4",
                            },
                            {
                                value: "contact5",
                                label: "Contact 5",
                            },

                        ]}
                    />
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
                <Form.Item style={{position: "relative", left: "80%"}}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ textAlign: "center",backgroundColor:"#00CC6A", border:"none", width:"20%" }}
                    >
                        Ajouter
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddAgendaModal;
