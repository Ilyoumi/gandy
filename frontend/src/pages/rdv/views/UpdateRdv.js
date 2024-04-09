import React, { useState, useEffect } from "react";
import { Input, Button, Form, Select, DatePicker } from "antd";
import moment from "moment";
import { axiosClient } from "../../../api/axios";
const { Option } = Select;

const UpdateRdv = ({ initialValues, onSubmit }) => {
    const [form] = Form.useForm();
    const [agents, setAgents] = useState([]);
    const [agendas, setAgendas] = useState([]);

    useEffect(() => {
        fetchAgendas();
        // Convert date string to moment object
        const formattedInitialValues = {
            ...initialValues,
            startTime: moment(initialValues.start_date),
            endTime: moment(initialValues.end_date),
        };
        form.setFieldsValue(formattedInitialValues);
    }, [initialValues, form]);

    const fetchAgendas = async () => {
        try {
            const response = await axiosClient.get("/api/agendas");
            if (response.data && Array.isArray(response.data.agendas)) {
                setAgendas(response.data.agendas);
                console.log("fetching agendas:", response.data.agendas);
            } else {
                console.error("Invalid data format received for agendas:", response.data);
            }
        } catch (error) {
            console.error("Error fetching agendas:", error);
        }
    };
    

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            // Combine date and time into start_date and end_date
            values.start_date = values.startTime.format("YYYY-MM-DD HH:mm:ss");
            values.end_date = values.endTime.format("YYYY-MM-DD HH:mm:ss");
            delete values.startTime;
            delete values.endTime;

            // Submit updated data to the backend
            await axiosClient.put(`/api/rdvs/${initialValues.id}`, values);
            // Call the parent onSubmit callback
            onSubmit(values);
        } catch (errorInfo) {
            console.log("Failed:", errorInfo);
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
                label="Nom"
                name="nom"
                initialValue={initialValues.nom}
                rules={[{ required: true, message: "Veuillez entrer le nom" }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Prénom"
                name="prenom"
                initialValue={initialValues.prenom}
                rules={[
                    { required: true, message: "Veuillez entrer le prénom" },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Société"
                name="nom_ste"
                initialValue={initialValues.nom_ste}
                rules={[
                    { required: true, message: "Veuillez entrer la société" },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="TVA"
                name="tva"
                initialValue={initialValues.tva}
                rules={[{ required: true, message: "Veuillez entrer le TVA" }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Téléphone"
                name="tel"
                initialValue={initialValues.tel}
                rules={[
                    {
                        required: true,
                        message: "Veuillez entrer le téléphone",
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Portable"
                name="gsm"
                initialValue={initialValues.gsm}
                rules={[
                    { required: true, message: "Veuillez entrer le portable" },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Adresse"
                name="adresse"
                initialValue={initialValues.adresse}
                rules={[
                    { required: true, message: "Veuillez entrer l'adresse" },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Code postal"
                name="postal"
                initialValue={initialValues.postal}
                rules={[
                    {
                        required: true,
                        message: "Veuillez entrer le code postal",
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Fournisseur"
                name="fournisseur"
                initialValue={initialValues.fournisseur}
                rules={[
                    {
                        required: true,
                        message: "Veuillez entrer le fournisseur",
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Nombre de compagnies électroniques"
                name="nbr_comp_elect"
                initialValue={initialValues.nbr_comp_elect}
                rules={[
                    {
                        required: true,
                        message:
                            "Veuillez entrer le nombre de compagnies électroniques",
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Nombre de compagnies gaz"
                name="nbr_comp_gaz"
                initialValue={initialValues.nbr_comp_gaz}
                rules={[
                    {
                        required: true,
                        message: "Veuillez entrer le nombre de compagnies gaz",
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="PPV"
                name="ppv"
                initialValue={initialValues.ppv}
                rules={[{ required: true, message: "Veuillez choisir PPV" }]}
            >
                <Select>
                    <Option value={true}>Oui</Option>
                    <Option value={false}>Non</Option>
                </Select>
            </Form.Item>
            <Form.Item
                label="Tarification"
                name="tarification"
                initialValue={initialValues.tarification}
                rules={[
                    {
                        required: true,
                        message: "Veuillez entrer la tarification",
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Haute tension"
                name="haute_tension"
                initialValue={initialValues.haute_tension}
                rules={[
                    {
                        required: true,
                        message: "Veuillez choisir haute tension",
                    },
                ]}
            >
                <Select>
                    <Option value={true}>Oui</Option>
                    <Option value={false}>Non</Option>
                </Select>
            </Form.Item>
            <Form.Item
                label="Agent"
                name="id_agent"
                initialValue={initialValues.id_agent}
                rules={[
                    { required: true, message: "Veuillez choisir un agent" },
                ]}
            >
                <Select>
                    <Option value={1}>Agent 1</Option>
                    <Option value={2}>Agent 2</Option>
                    {/* Add more options as needed */}
                </Select>
            </Form.Item>
            <Form.Item
                label="Agenda"
                name="id_agenda"
                initialValue={initialValues.id_agenda}
                rules={[
                    { required: true, message: "Veuillez choisir un agenda" },
                ]}
            >
                <Select>
                    {agendas.map((agenda) => (
                        <Option key={agenda.id} value={agenda.id}>
                            {agenda.name}
                        </Option>
                    ))}
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

export default UpdateRdv;
