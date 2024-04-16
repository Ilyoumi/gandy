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
} from "antd";
import frFR from "antd/lib/locale/fr_FR";
import SaveButton from "../../../constants/SaveButton";
import moment from "moment";
import { axiosClient } from "../../../api/axios";
import NewButton from "../../../constants/NewButton";
import SupprimerButton from "../../../constants/SupprimerButton";
import ModifierButton from "../../../constants/ModifierButton";
const { Option } = Select;

const UpdateRdv = ({ initialValues, agendaId, onFormSubmit }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
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

    useEffect(() => {
        const formattedInitialValues = {
            ...initialValues,
            startTime: moment(initialValues.start_date),
            endTime: moment(initialValues.end_date),
        };
        form.setFieldsValue(formattedInitialValues);
        setFormData(formattedInitialValues);
    }, [initialValues, form]);

    useEffect(() => {
        fetchUserData();
    }, []);

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

    const handleFormSubmit = async () => {
        setLoading(true);

        console.log("Form data before submission:", formData);

        // Merge updated fields from formData with initialValues
        const formDataToSend = {
            ...initialValues,
            ...formData,
            id_agent: userId,
            id_agenda: agendaId,
            tarification: formData.tarification.toString(),
        };

        console.log("Form data to send:", formDataToSend);

        try {
            const response = await axiosClient.put(
                `/api/rdvs/${initialValues.id}`,
                formDataToSend
            );
            setLoading(false);
            console.log("Form submission successful. Response:", response.data);
            onFormSubmit({ ...response.data, id: response.data.id });
        } catch (error) {
            setLoading(false);
            console.error("Error updating appointment:", error);
        }
    };

    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
            <Select style={{ width: 70 }}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        </Form.Item>
    );

    return (
        <Form layout="vertical" onFinish={handleFormSubmit}>
            <Card style={{ marginBottom: "10px" }}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <ConfigProvider locale={frFR}>
                            <DatePicker.RangePicker
                                name="appointment_date"
                                value={[
                                    moment(initialValues.start_date),
                                    moment(initialValues.end_date),
                                ]}
                                onChange={(dates) => {
                                    setFormData({
                                        ...formData,
                                        appointment_date: dates,
                                    });
                                }}
                                showTime={true}
                                defaultValue={[moment(), moment()]}
                            />
                        </ConfigProvider>
                    </Col>
                    
                    <Col span={4}>
                        <SaveButton loading={loading} buttonText="Enregistrer" />
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
                                            initialValue={initialValues.nom}
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
                                            initialValue={initialValues.prenom}
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
                                            initialValue={initialValues.nom_ste}
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
                                            label="TVA"
                                            name="tva"
                                            initialValue={initialValues.tva}
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
                                            initialValue={initialValues.adresse}
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
                                            initialValue={initialValues.postal}
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
                                            initialValue={initialValues.tel}
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Veuillez saisir votre numéro de téléphone!",
                                                },
                                            ]}
                                        >
                                            <Input
                                                addonBefore={prefixSelector}
                                                style={{ width: "100%" }}
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
                                            initialValue={initialValues.gsm}
                                        >
                                            <Input
                                                addonBefore={prefixSelector}
                                                style={{ width: "100%" }}
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
                                            initialValue={
                                                initialValues.nbr_comp_elect
                                            }
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
                                            initialValue={
                                                initialValues.nbr_comp_gaz
                                            }
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
                                    initialValue={initialValues.fournisseur}
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
                            <Col span={12}>
                                <Form.Item
                                    label="PPV"
                                    name="ppv"
                                    initialValue={initialValues.ppv}
                                    rules={[{ required: true }]}
                                >
                                    <Switch
                                        checkedChildren="Oui"
                                        unCheckedChildren="Non"
                                        checked={initialValues.ppv}
                                        onChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                ppv: value,
                                            })
                                        }
                                    />
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
                            <Col span={12}>
                                <Form.Item
                                    label="Tarif Social"
                                    name="tarif"
                                    initialValue={initialValues.tarif}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Veuillez sélectionner si vous avez un tarif social ou non !",
                                        },
                                    ]}
                                >
                                    <Switch
                                        checkedChildren="Oui"
                                        unCheckedChildren="Non"
                                        checked={initialValues.tarif}
                                        onChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                tarif: value,
                                            })
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Haute Tension"
                                    name="haute_tension"
                                    initialValue={initialValues.haute_tension}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Veuillez sélectionner si vous êtes en haute tension ou non !",
                                        },
                                    ]}
                                >
                                    <Switch
                                        checkedChildren="Oui"
                                        unCheckedChildren="Non"
                                        checked={initialValues.haute_tension}
                                        onChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                haute_tension: value,
                                            })
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Tarification"
                                    name="tarification"
                                    initialValue={initialValues.tarification}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Veuillez sélectionner votre type de tarification !",
                                        },
                                    ]}
                                >
                                    <Switch
                                        checkedChildren="Fixe"
                                        unCheckedChildren="Variable"
                                        checked={initialValues.tarification}
                                        onChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                tarification: value,
                                            })
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Commentaire"
                                    name="commentaire"
                                >
                                    <Input.TextArea rows={5} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Form>
    );
};

export default UpdateRdv;
