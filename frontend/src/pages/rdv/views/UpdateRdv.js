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
const { Option } = Select;

const UpdateRdv = ({ initialValues, agendaId, onFormSubmit,agentId }) => {
    const [form] = Form.useForm();
    const [loadingValidation, setLoadingValidation] = useState(false);
    const [loadingAnnuler, setLoadingAnnuler] = useState(false);
    const [loadingEnregistrer, setLoadingEnregistrer] = useState(false);
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
        pro: false,
        haute_tension: false,
        tarification: "",
        commentaire: "",
        note: "",
        bloquer: false,
        appointment_date: null,
    });



    useEffect(() => {
        const formattedInitialValues = {
            ...initialValues,
            nom_prenom: `${initialValues.nom} ${initialValues.prenom}`,

            startTime: moment(initialValues.start_date),
            endTime: moment(initialValues.end_date),
            ppv: Boolean(initialValues.ppv),
            bloquer: Boolean(initialValues.bloquer),
            pro: Boolean(initialValues.pro),
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
        setLoadingEnregistrer(true);
        let startDate, endDate;

        if (formData && formData.appointment_date && formData.appointment_date.length === 2) {
            // If new dates are selected, use them
            startDate = new Date(formData.appointment_date[0]);
            endDate = new Date(formData.appointment_date[1]);
        } else {
            // Otherwise, use initial values
            startDate = new Date(initialValues.start_date);
            endDate = new Date(initialValues.end_date);
        }



        const startDateFormatted = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
        const endDateFormatted = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);
        const [nom, prenom] = formData.nom_prenom ? formData.nom_prenom.split(' ') : ['', ''];

        const formDataToSend = {
            ...formData,
            nom: nom,
            prenom: prenom,
            bloquer: false,
            start_date: startDateFormatted.toISOString().slice(0, 19).replace("T", " "),
            end_date: endDateFormatted.toISOString().slice(0, 19).replace("T", " "),
            id_agent: agentId,
            id_agenda: agendaId,
            tarification: formData.tarif ? "Variable" : "Fixe",
            note: formData.note,
            commentaire: formData.commentaire,
            modifiedBy: userId

        };


        try {

            const response = await axiosClient.put(
                `/api/rdvs/${initialValues.id}`,
                formDataToSend
            );
            const newAppointment = {
                ...response.data,
                id: response.data.id,
                bloquer: formDataToSend.bloquer,
            };
            setLoadingEnregistrer(false);
            onFormSubmit({ ...response.data, newAppointment });

            message.success("Rendez-vous modifié avec succès !");
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setShowAlert(true);
                setLoadingEnregistrer(false);
                return;
            }
            setLoadingEnregistrer(false);
            console.error("Error updating appointment:", error);
        }
    };



    const handleValidation = async (status) => {
        setLoadingValidation(true);
        let startDate, endDate;

        if (formData && formData.appointment_date && formData.appointment_date.length === 2) {
            startDate = new Date(formData.appointment_date[0]);
            endDate = new Date(formData.appointment_date[1]);
        } else {
            startDate = new Date(initialValues.start_date);
            endDate = new Date(initialValues.end_date);
        }


        const startDateFormatted = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
        const endDateFormatted = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);


        const formDataToSend = {
            ...formData,
            start_date: startDateFormatted.toISOString().slice(0, 19).replace("T", " "),
            end_date: endDateFormatted.toISOString().slice(0, 19).replace("T", " "),
            id_agent: userId,
            id_agenda: agendaId,
            tarification: formData.tarif ? "Variable" : "Fixe",
            status: status,
            bloquer: false,
            modifiedBy: userId

        };

        try {
            const response = await axiosClient.put(
                `/api/rdvs/${initialValues.id}`,
                formDataToSend
            );
            const newAppointment = {
                ...response.data,
                id: response.data.id,
                bloquer: formDataToSend.bloquer,

            };
            setLoadingValidation(false);

            onFormSubmit({ ...response.data, newAppointment });

            message.success(`Rendez-vous ${status === 'confirmer' ? 'confirmé' : 'enregistré comme non répondu'} avec succès!`);


        } catch (error) {
            setLoadingValidation(false);
            console.error("Error validating appointment:", error);
        }
    };

    const handleAnnuler = async () => {
        setLoadingAnnuler(true);
        try {
            await axiosClient.delete(`/api/rdvs/${initialValues.id}`);
            setLoadingAnnuler(false);
        } catch (error) {
            setLoadingAnnuler(false);
            if (error.response && error.response.status === 404) {
                console.error("Appointment not found delete:", error.response.data);
            } else {
                console.error("Error deleting appointment:", error);
            }
            return;
        }

        try {
            // Then, update the appointment status to "annuler"
            const response = await axiosClient.put(
                `/api/rdvs/${initialValues.id}`,
                {
                    ...initialValues,
                    status: "annuler",
                    bloquer: false,
                    modifiedBy: userId
                }
            );
            onFormSubmit(response.data);
            message.success("Rendez-vous annulé avec succès !");
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.error("Appointment not found update:", error.response.data);
            } else {
                console.error("Error updating appointment:", error);
            }
        }
    };



    const handleStatusChange = (value) => {
        handleValidation(value);
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

                        <Select
                            onChange={handleStatusChange}
                            placeholder="Statuer RDV"
                            style={{
                                width: '150px',
                                marginBottom: '20px',
                                height: "40px !important"
                            }}
                        >
                            <Select.Option value="confirmer">Confirmer</Select.Option>
                            <Select.Option value="NRP">NRP</Select.Option>
                        </Select>

                    </Col>

                    <Col span={4}>
                        <SupprimerButton
                            loading={loadingAnnuler}
                            buttonText="Annuler"
                            onClick={handleAnnuler}

                            danger
                        />
                    </Col>
                    <Col span={4}>
                        <SaveButton
                            loading={loadingEnregistrer}
                            buttonText="Modifier"
                        />
                    </Col>
                    <Col span={4}>

                    </Col>
                </Row>
            </Card>
            <Row gutter={[16, 16]}>
                <Col span={16}>
                    <Card>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Êtes-vous un professionnel ?"
                                            name="pro"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Veuillez sélectionner votre statut professionnel !",
                                                },
                                            ]}
                                        >
                                            <Radio.Group
                                                onChange={(e) => {
                                                    setFormData({
                                                        ...formData,
                                                        pro: e.target.value,
                                                    });
                                                    if (e.target.value) {
                                                        form.setFieldsValue({ nom_ste: "", tva: "" });
                                                    }

                                                }}
                                            >

                                                <Radio value={true}>Oui</Radio>
                                                <Radio value={false}>Non</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Nom et Prénom"
                                            name="nom_prenom"

                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Veuillez entrer votre nom et prénom !",
                                                },
                                            ]}
                                        >
                                            <Input
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        nom_prenom: e.target.value,
                                                    })
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>

                            <Col span={24}>
                                <Row gutter={[16, 16]}>
                                    {formData.pro && (
                                        <>
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
                                                            value={initialValues.tva ? initialValues.tva.replace(/^BE0/, '') : ''}
                                                            rules={[

                                                                {
                                                                    validator: (_, value) => {
                                                                        const regex = /^\d{9}$/;
                                                                        if (value && !regex.test(value)) {
                                                                            return Promise.reject(
                                                                                'Le numéro de TVA doit commencer par "BE0" suivi de 9 chiffres.'
                                                                            );
                                                                        }
                                                                        return Promise.resolve();
                                                                    },
                                                                },
                                                            ]}
                                                        >
                                                            <Input
                                                                addonBefore="BE0"
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
                                        </>
                                    )}
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
                                            <Input.TextArea rows={3} onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    commentaire: e.target.value,
                                                })} />
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
                                            "Luminus",
                                            "Mega",
                                            "OCTA+",
                                            "Eneco",
                                            "TotalEnergies",
                                            "Aspiravi Energy",
                                            "Bolt",
                                            "COCITER",
                                            "DATS 24",
                                            "EBEM",
                                            "Ecopower",
                                            "Elegant",
                                            "Energie.be",
                                            "Frank Energie",
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
                                    <Input.TextArea rows={3} onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            note: e.target.value,
                                        })
                                    } />
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
