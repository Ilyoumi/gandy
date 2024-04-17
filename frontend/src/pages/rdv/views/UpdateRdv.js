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
    Alert,
} from "antd";
import frFR from "antd/lib/locale/fr_FR";
import SaveButton from "../../../constants/SaveButton";
import moment from "moment";
import { axiosClient } from "../../../api/axios";
import SupprimerButton from "../../../constants/SupprimerButton";
import ModifierButton from "../../../constants/ModifierButton";
const { Option } = Select;

const UpdateRdv = ({ initialValues, agendaId, onFormSubmit }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [showAdditionalInput, setShowAdditionalInput] = useState(false);
    const [userId, setUserId] = useState(null);
    const [showAlert, setShowAlert] = useState(false);

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

        const startDate = new Date(formData.appointment_date[0]);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Add 1 hour
        const formDataToSend = {
            ...formData,
            start_date: startDate.toISOString().slice(0, 19).replace('T', ' '), // Convert to YYYY-MM-DD HH:mm:ss format
            end_date: endDate.toISOString().slice(0, 19).replace('T', ' '), // Convert to YYYY-MM-DD HH:mm:ss format
            id_agent: userId,
            id_agenda: agendaId,
            tarification: formData.tarif ? "Variable" : "Fixe",
        };
        console.log("sending data =", formDataToSend);


        try {
            const response = await axiosClient.put(
                `/api/rdvs/${initialValues.id}`,
                formDataToSend
            );
            setLoading(false);
            console.log("Form submission successful. Response:", response.data);
            onFormSubmit({ ...response.data, id: response.data.id });
            message.success("Rendez-vous modifié avec succès !");

        } catch (error) {
            if (error.response && error.response.status === 409) {
                setShowAlert(true);
                setLoading(false);
                return;
            }
            setLoading(false);
            console.error("Error updating appointment:", error);
        }
    };


    return (
        <Form layout="vertical" onFinish={handleFormSubmit}>
            {showAlert && (
                <Alert
                    message="La date sélectionnée est déjà réservée."
                    type="warning"
                    showIcon
                    closable
                    onClose={() => setShowAlert(false)}
                />
            )}
            <Card style={{ marginBottom: "10px" }}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <ConfigProvider locale={frFR}>
                            <DatePicker.RangePicker
                                name="appointment_date"
                                value={
                                    formData.appointment_date && [
                                        moment(formData.appointment_date[0]),
                                        moment(formData.appointment_date[1]),
                                    ]
                                }
                                onChange={(dates) => {
                                    console.log("new date", dates);
                                    // Check if dates array is not empty and contains valid start and end dates
                                    if (dates && dates.length === 2) {
                                        setFormData(prevState => ({
                                            ...prevState,
                                            appointment_date: dates,
                                        }));
                                        
                                    } else {
                                        setFormData({
                                            ...formData,
                                            appointment_date: null, // Reset appointment_date if no valid dates selected
                                        });
                                    }
                                }}
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
                                
                            />
                        </ConfigProvider>
                    </Col>
                    <Col span={4}>
                        <ModifierButton loading={loading} buttonText="Modifier" />
                    </Col>

                    <Col span={4}> 
                        <SupprimerButton loading={loading} buttonText="Annuler" danger />
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
                                            initialValue={initialValues.adresse}
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
                                            initialValue={initialValues.postal}
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
                                            initialValue={initialValues.tel}
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
                                        placeholder="Sélectionner votre fournisseur"
                                        onChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                fournisseur: value,
                                            })
                                        }
                                    >
                                        {[
                                            "Aspiravi Energy",
                                            "Bolt",
                                            "COCITER",
                                            "DATS 24",
                                            "EBEM",
                                            "Ecopower",
                                            "Elegant",
                                            "Eneco",
                                            "Energie.be",
                                            "ENGIE",
                                            "Frank Energie",
                                            "Luminus",
                                            "Mega",
                                            "OCTA+",
                                            "TotalEnergies",
                                            "Trevion",
                                            "Wind voor A",
                                        ].map((fournisseur, index) => (
                                            <Option
                                                key={index}
                                                value={fournisseur}
                                            >
                                                {fournisseur}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="PPV"
                                    name="ppv"
                                    initialValue={initialValues.ppv}
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

export default UpdateRdv;
