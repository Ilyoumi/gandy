import React, { useState, useEffect } from "react";
import {
    Form,
    Input,
    DatePicker,
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
            ppv: Boolean(initialValues.ppv),
            tarif: Boolean(initialValues.tarif),
            haute_tension: Boolean(initialValues.haute_tension),
            tarification: initialValues.tarification === "Variable" ? true : false,
            commentaire: initialValues.commentaire,
            note: initialValues.note,

        };
        form.setFieldsValue(formattedInitialValues);
        setFormData(formattedInitialValues);
    }, [initialValues, form]);

    useEffect(() => {
        fetchUserData();
    }, []);


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
        let startDate, endDate;

        // Check if formData and formData.appointment_date are defined
        if (formData && formData.appointment_date && formData.appointment_date.length === 2) {
            // If new dates are selected, use them
            startDate = new Date(formData.appointment_date[0]);
            endDate = new Date(formData.appointment_date[1]);
        } else {
            // Otherwise, use initial values
            startDate = new Date(initialValues.start_date);
            endDate = new Date(initialValues.end_date);
        }

        console.log("Start Date selected:", startDate);
        console.log("End Date selected:", endDate);
        console.log("Start Date initial value:", formData.appointment_date[0]);
        console.log("End Date initial value:", formData.appointment_date[1]);

        const startDateFormatted = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
        const endDateFormatted = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);

        // Convert dates to UTC format before sending
        const formDataToSend = {
            ...formData,
            start_date: startDateFormatted.toISOString().slice(0, 19).replace("T", " "),
            end_date: endDateFormatted.toISOString().slice(0, 19).replace("T", " "),
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
            const newAppointment = {
                ...response.data,
                id: response.data.id,
            };
            setLoading(false);
            console.log("Form submission successful. Response:", response.data);
            onFormSubmit({ ...response.data, newAppointment });
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


    const handleValidation = async () => {
        setLoading(true);
        let startDate, endDate;

        // Check if formData and formData.appointment_date are defined
        if (formData && formData.appointment_date && formData.appointment_date.length === 2) {
            // If new dates are selected, use them
            startDate = new Date(formData.appointment_date[0]);
            endDate = new Date(formData.appointment_date[1]);
        } else {
            // Otherwise, use initial values
            startDate = new Date(initialValues.start_date);
            endDate = new Date(initialValues.end_date);
        }

        console.log("Start Date selected:", startDate);
        console.log("End Date selected:", endDate);

        const startDateFormatted = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
        const endDateFormatted = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);


        const formDataToSend = {
            ...formData,
            start_date: startDateFormatted.toISOString().slice(0, 19).replace("T", " "),
            end_date: endDateFormatted.toISOString().slice(0, 19).replace("T", " "),
            id_agent: userId,
            id_agenda: agendaId,
            tarification: formData.tarif ? "Variable" : "Fixe",
            status: "valider",
        };

        try {
            const response = await axiosClient.put(
                `/api/rdvs/${initialValues.id}`,
                formDataToSend
            );
            const newAppointment = {
                ...response.data,
                id: response.data.id,
            };
            setLoading(false);
            console.log("Form submission successful. Response:", response.data);
            onFormSubmit({ ...response.data, newAppointment });

            // You may add any further action you want after validation
            message.success("Rendez-vous validé avec succès !");

        } catch (error) {
            setLoading(false);
            console.error("Error validating appointment:", error);
            // Handle error if needed
        }
    };

    const handleAnnuler = async () => {
        setLoading(true);
        let startDate, endDate;

        if (formData && formData.appointment_date && formData.appointment_date.length === 2) {
            startDate = new Date(formData.appointment_date[0]);
            endDate = new Date(formData.appointment_date[1]);
        } else {
            startDate = new Date(initialValues.start_date);
            endDate = new Date(initialValues.end_date);
        }
        console.log("Start Date selected:", startDate);
        console.log("End Date selected:", endDate);

        const startDateFormatted = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
        const endDateFormatted = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);


        const formDataToSend = {
            ...formData,
            start_date: startDateFormatted.toISOString().slice(0, 19).replace("T", " "),
            end_date: endDateFormatted.toISOString().slice(0, 19).replace("T", " "),
            id_agent: userId,
            id_agenda: agendaId,
            tarification: formData.tarif ? "Variable" : "Fixe",
            status: "annuler",
        };

        try {
            const response = await axiosClient.put(
                `/api/rdvs/${initialValues.id}`,
                formDataToSend
            );
            const newAppointment = {
                ...response.data,
                id: response.data.id,
            };
            setLoading(false);
            console.log("Form submission successful. Response:", response.data);
            onFormSubmit({ ...response.data, newAppointment });
            message.success("Rendez-vous annulé avec succès !");
        } catch (error) {
            setLoading(false);
            console.error("Error canceling appointment:", error);
        }
    };




    return (
        <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
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
                                defaultValue={[
                                    moment(initialValues.start_date, "YYYY-MM-DD HH:mm:ss"),
                                    moment(initialValues.end_date, "YYYY-MM-DD HH:mm:ss")
                                ]}
                                onChange={(dates) => {
                                    console.log("New dates:", dates);
                                    if (dates && dates.length === 2) {
                                        setFormData((prevState) => ({
                                            ...prevState,
                                            appointment_date: [
                                                dates[0].toDate(),
                                                dates[1].toDate(),
                                            ],
                                        }));
                                    } else {
                                        setFormData({
                                            ...formData,
                                            appointment_date: null,
                                        });
                                    }
                                }}
                                onCalendarChange={(value) =>
                                    console.log("Calendar value:", value)
                                }
                                showTime={{
                                    format: "HH:mm",
                                    minuteStep: 15,
                                    disabledHours: () => {
                                        const disabledHours = [];
                                        for (let i = 0; i < 9; i++) {
                                            disabledHours.push(i);
                                        }
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
                        <ModifierButton
                            loading={loading}
                            buttonText="Valider"
                            onClick={handleValidation}

                        />
                    </Col>

                    <Col span={4}>
                        <SupprimerButton
                            loading={loading}
                            buttonText="Annuler"
                            onClick={handleAnnuler}

                            danger
                        />
                    </Col>
                    <Col span={4}>
                        <SaveButton
                            loading={loading}
                            buttonText="Enregistrer"
                        />
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
                                                            /^[B][E]\d+$/;
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
                                                ppv: e.target.value === "true",
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
                                                tarif:
                                                    e.target.value === "true",
                                            })
                                        }


                                    >
                                        <Radio value={true} >Oui</Radio>
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
                                                haute_tension: e.target.value,
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
                                                tarification: e.target.value,
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
