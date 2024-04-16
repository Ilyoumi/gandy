import React, { useState, useEffect } from "react";
import {
    Form,
    Input,
    DatePicker,
    Switch,
    Row,
    Col,
    Card,
    ConfigProvider,
    Select,
    Radio,
    message,
} from "antd";
import moment from "moment";
import frFR from "antd/lib/locale/fr_FR";
import SaveButton from "../../../constants/SaveButton";
import { axiosClient } from "../../../api/axios";

const { Option } = Select;
const AddAppointment = ({ onFormSubmit, agendaId }) => {
    const [showAdditionalInput, setShowAdditionalInput] = useState(false);
    const [userId, setUserId] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        nom: "",
        prenom: "",
        nom_ste: "",
        postal: "",
        adresse: "",
        tva: "",
        tel: "",
        gsm: "",
        fournisseur: "",
        nbr_comp_elect: "",
        nbr_comp_gaz: "",
        ppv: false,
        tarif: false,
        haute_tension: false,
        tarification: "",
        commentaire: "",
        appointment_date: null,
    });

    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };
    const fetchUserData = async () => {
        try {
            // Check if the user is logged in
            const authToken = localStorage.getItem("auth_token");
            if (!authToken) {
                // User is not logged in, do nothing
                console.log("User is not logged in");
                return;
            }

            // User is logged in, fetch user data
            const response = await axiosClient.get("/api/user", {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            const { id } = response.data;
            setUserId(id);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleFormSubmit = async () => {
        setLoading(true);
        let formDataToSend;
        if (!formData.appointment_date) {
            message.warning("Veuillez sélectionner une date de rendez-vous !");
            setLoading(false);
            return;
        }

        // Validate appointment date

        try {
            formDataToSend = {
                ...formData,
                start_date: formData.appointment_date[0].format(
                    "YYYY-MM-DD HH:mm:ss"
                ),
                end_date: formData.appointment_date[1].format(
                    "YYYY-MM-DD HH:mm:ss"
                ),
                id_agent: userId,
                id_agenda: agendaId,
                tarification: formData.tarif ? "Variable" : "Fixe",
            };
            console.log("agendaIdh:", agendaId);
            console.log("id_agent:", userId);

            const response = await axiosClient.post(
                "/api/rdvs",
                formDataToSend
            );
            const newAppointment = { ...response.data, id: response.data.id };
            setLoading(false);
            console.log("Form submission successful. Response:", response.data);
            onFormSubmit({ ...response.data, newAppointment });
            message.success("Rendez-vous ajouté avec succès !");
        } catch (error) {
            setLoading(false);

            console.error("Response data:", error.response.data);
            console.error("Error adding appointment:", error);
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
        // Display a warning alert
        // You can also store errorInfo in state and display it in the alert if needed
        alert("Form validation failed. Please check your input.");
    };

    return (
        <Form
            layout="vertical"
            onFinish={handleFormSubmit}
            onFinishFailed={onFinishFailed}
        >
            <Card style={{ marginBottom: "10px" }}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <ConfigProvider locale={frFR}>
                            <DatePicker.RangePicker
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Veuillez sélectionner une date de rendez-vous !",
                                    },
                                ]}
                                defaultValue={[
                                    moment().startOf("day").hour(9),
                                    moment().startOf("day").hour(10),
                                ]}
                                showTime={{
                                    format: "HH:mm",
                                    minuteStep: 15,
                                    disabledHours: () => {
                                        const disabledHours = [];
                                        // Hours before 9 AM
                                        for (let i = 0; i < 9; i++) {
                                            disabledHours.push(i);
                                        }
                                        // Hours after 6 PM
                                        for (let i = 18; i < 24; i++) {
                                            disabledHours.push(i);
                                        }
                                        return disabledHours;
                                    },
                                }}
                                format="YYYY-MM-DD HH:mm"
                                onChange={(dates) =>
                                    setFormData({
                                        ...formData,
                                        appointment_date: dates,
                                    })
                                }
                            />
                        </ConfigProvider>
                    </Col>
                    <Col span={12}>
                        <SaveButton onClick={handleClick} loading={loading} />
                    </Col>
                </Row>
            </Card>
            <Row gutter={[16, 16]}>
                <Col span={16}>
                    <Card>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} sm={12} lg={12}>
                                        <Form.Item
                                            label="Nom"
                                            name="nom"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Veuillez entrer votre nom !",
                                                },
                                            ]}
                                        >
                                            <Input
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        nom: e.target.value,
                                                    })
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} lg={12}>
                                        <Form.Item
                                            label="Prénom"
                                            name="prenom"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Veuillez entrer votre prénom !",
                                                },
                                            ]}
                                        >
                                            <Input
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        prenom: e.target.value,
                                                    })
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} sm={12} lg={12}>
                                        <Form.Item
                                            label="Nom de Société"
                                            name="nom_ste"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Veuillez entrer le nom de votre société !",
                                                },
                                            ]}
                                        >
                                            <Input
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        nom_ste: e.target.value,
                                                    })
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} lg={12}>
                                        <Form.Item
                                            defaultValue="BE"
                                            label="TVA"
                                            name="tva"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Veuillez entrer votre numéro de TVA !",
                                                },
                                                {
                                                    validator: (_, value) => {
                                                        const regex =
                                                            /^[B][E]\d+$/; // Regular expression for validating TVA number format (starts with "BE" followed by one or more digits)
                                                        if (
                                                            value &&
                                                            !regex.test(value)
                                                        ) {
                                                            return Promise.reject(
                                                                'Le numéro de TVA doit commencer par "BE" suivi de chiffres.'
                                                            );
                                                        }
                                                        return Promise.resolve();
                                                    },
                                                },
                                            ]}
                                        >
                                            <Input
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        tva: e.target.value,
                                                    })
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} sm={12} lg={12}>
                                        <Form.Item
                                            label="Adresse"
                                            name="adresse"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Veuillez entrer votre adresse !",
                                                },
                                            ]}
                                        >
                                            <Input
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        adresse: e.target.value,
                                                    })
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} lg={12}>
                                        <Form.Item
                                            label="Code Postal"
                                            name="postal"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Veuillez entrer votre code postal !",
                                                },
                                                {
                                                    pattern: /^\d{4}$/, // Regex pattern to match exactly 4 digits
                                                    message:
                                                        "Veuillez entrer un code postal valide (4 chiffres).",
                                                },
                                            ]}
                                        >
                                            <Input
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        postal: e.target.value,
                                                    })
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} sm={12} lg={12}>
                                        <Form.Item
                                            name="tel"
                                            label="Téléphone"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Veuillez saisir votre numéro de téléphone!",
                                                },
                                                {
                                                    pattern: /^\d{8}$/, // Regex pattern to match +32 followed by 8 digits
                                                    message:
                                                        "Veuillez saisir un numéro de téléphone valide de 8 chiffres (ex: +32123456789).",
                                                },
                                            ]}
                                        >
                                            <Input
                                                addonBefore={
                                                    <span
                                                        style={{
                                                            padding: "0 8px",
                                                        }}
                                                    >
                                                        +32
                                                    </span>
                                                }
                                                style={{ width: "100%" }}
                                                defaultValue=""
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        tel: e.target.value,
                                                    })
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} lg={12}>
                                        <Form.Item
                                            label="GSM"
                                            name="gsm"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Veuillez entrer votre gsm !",
                                                },
                                                {
                                                    pattern: /^\d{8}$/, // Regex pattern to match +324 followed by 8 digits
                                                    message:
                                                        "Veuillez saisir un numéro de GSM valide de 8 chiffres(ex: +32412345678).",
                                                },
                                            ]}
                                        >
                                            <Input
                                                addonBefore={
                                                    <span
                                                        style={{
                                                            padding: "0 8px",
                                                        }}
                                                    >
                                                        +324
                                                    </span>
                                                }
                                                style={{ width: "100%" }}
                                                defaultValue=""
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        gsm: e.target.value,
                                                    })
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Nombre de Compteurs Électriques"
                                            name="nbr_comp_elect"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Veuillez sélectionner le nombre de compteurs Électriques !",
                                                },
                                            ]}
                                        >
                                            <Select
                                                onChange={(value) =>
                                                    setFormData({
                                                        ...formData,
                                                        nbr_comp_elect: value,
                                                    })
                                                }
                                                placeholder="Sélectionner le nombre de compteurs électriques"
                                            >
                                                <Select.Option value="1">
                                                    1
                                                </Select.Option>
                                                <Select.Option value="2">
                                                    2
                                                </Select.Option>
                                                <Select.Option value="3">
                                                    3
                                                </Select.Option>
                                                <Select.Option value="4">
                                                    4
                                                </Select.Option>
                                                <Select.Option value="+4">
                                                    +4
                                                </Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Nombre de Compteurs Gaz"
                                            name="nbr_comp_gaz"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Veuillez sélectionner le nombre de compteurs de gaz !",
                                                },
                                            ]}
                                        >
                                            <Select
                                                onChange={(value) =>
                                                    setFormData({
                                                        ...formData,
                                                        nbr_comp_gaz: value,
                                                    })
                                                }
                                                placeholder="Sélectionner le nombre de compteurs gaz"
                                            >
                                                <Select.Option value="1">
                                                    1
                                                </Select.Option>
                                                <Select.Option value="2">
                                                    2
                                                </Select.Option>
                                                <Select.Option value="3">
                                                    3
                                                </Select.Option>
                                                <Select.Option value="4">
                                                    4
                                                </Select.Option>
                                                <Select.Option value="+4">
                                                    +4
                                                </Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label="Commentaire"
                                            name="commentaire"
                                        >
                                            <Input.TextArea rows={3} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Form.Item
                                    name="fournisseur"
                                    label="Fournisseur"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Veuillez sélectionner votre fournisseur actuel!",
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="sélectionner votre fournisseur"
                                        onChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                fournisseur: value,
                                            })
                                        }
                                    >
                                        <Option value="fournisseur1">
                                            Fournisseur 1
                                        </Option>
                                        <Option value="fournisseur2">
                                            Fournisseur 2
                                        </Option>
                                        <Option value="fournisseur3">
                                            Fournisseur 3
                                        </Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="PPV"
                                    name="ppv"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Veuillez sélectionner Oui ou Non pour PPV !",
                                        },
                                    ]}
                                >
                                    <Radio.Group
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                tarif: e.target.value,
                                            })
                                        }
                                    >
                                        <Radio value={true}>Oui</Radio>
                                        <Radio value={false}>Non</Radio>
                                    </Radio.Group>
                                </Form.Item>

                                {showAdditionalInput && (
                                    <Row>
                                        <Col span={24}>
                                            <Form.Item
                                                label="Additional Input"
                                                name="additionalInput"
                                                rules={[{ required: true }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                )}
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Tarif Social"
                                    name="tarif"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Veuillez sélectionner si vous avez un tarif social ou non !",
                                        },
                                    ]}
                                >
                                    <Radio.Group
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                tarif: e.target.value,
                                            })
                                        }
                                    >
                                        <Radio value={true}>Oui</Radio>
                                        <Radio value={false}>Non</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Haute Tension"
                                    name="haute_tension"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Veuillez sélectionner si vous êtes en haute tension ou non !",
                                        },
                                    ]}
                                >
                                    <Radio.Group
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                tarif: e.target.value,
                                            })
                                        }
                                    >
                                        <Radio value={true}>Oui</Radio>
                                        <Radio value={false}>Non</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Tarification"
                                    name="tarification"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Veuillez sélectionner votre type de tarification !",
                                        },
                                    ]}
                                >
                                    <Radio.Group
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                tarif: e.target.value,
                                            })
                                        }
                                    >
                                        <Radio value={true}>Variable</Radio>
                                        <Radio value={false}>Fixe</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Note" name="note">
                                    <Input.TextArea rows={3} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Form>
    );
};

export default AddAppointment;
