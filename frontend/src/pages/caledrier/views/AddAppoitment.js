import React, { useState } from "react";
import {
    Form,
    Input,
    DatePicker,
    Radio,
    Row,
    Col,
    Card,
    ConfigProvider,
} from "antd";
import DynamicSelect from "../../../constants/SearchSelect";
import moment from "moment";
import frFR from "antd/lib/locale/fr_FR";
import SaveButton from "../../../constants/SaveButton";
import { axiosClient } from "../../../api/axios";

const AddAppointment = ({ selectedDate, onFormSubmit,contactId }) => {
    const [showAdditionalInput, setShowAdditionalInput] = useState(false);
    const [value, setValue] = useState("");
    const [tarifSocial, setTarifSocial] = useState(true);
    const [hauteTension, setHauteTension] = useState(true);
    const [tarif, setTarif] = useState(true);

    const handleTarifSocialChange = (e) => {
        setTarifSocial(e.target.value);
    };
    const handleTarifChange = (e) => {
        setTarif(e.target.value);
    };

    const handleHauteTensionChange = (e) => {
        setHauteTension(e.target.value);
    };

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
        ppv: "",
        commentaire: "",
    });

    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    const handlePpvChange = (value) => {
        setFormData({
            ...formData,
            ppv: value,
        });
        setShowAdditionalInput(value === "oui");
    };
    const handleSelectChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFormSubmit = () => {
        setLoading(true); // Set loading state while making the request

        // Log the form data being sent
        const formDataToSend = {
            ...formData,
            fournisseur: formData.fournisseur === "true", // Assuming formData.fournisseur is a string
            tarif: tarif, // Using the state variable directly
            haute_tension: hauteTension, // Using the state variable directly
            tarification: tarifSocial === "true" ? "true" : "false", 
            contactId: contactId,
        };
        console.log("Sending form data:", formDataToSend,);


        axiosClient
            .post("/api/rdvs", formDataToSend)
            .then((response) => {
                setLoading(false);
                console.log(
                    "Form submission successful. Response:",
                    response.data
                );
                console.log("Form submission successful with:", formDataToSend);
                onFormSubmit(response.data);
            })
            .catch((error) => {
                setLoading(false); // Reset loading state if an error occurs
                console.error("Error adding appointment:", error);
                console.log("Response data:", error.response.data); // Log the error response data
            });
    };

    return (
        <Form layout="vertical" onFinish={handleFormSubmit}>
            <Card style={{ marginBottom: "10px" }}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <ConfigProvider locale={frFR}>
                            <DatePicker.RangePicker
                                showTime={true}
                                defaultValue={moment(
                                    "2015-01-01",
                                    "YYYY-MM-DD"
                                )}
                            />
                        </ConfigProvider>
                    </Col>
                    <Col span={12}>
                        <SaveButton onClick={handleClick} loading={loading} />
                    </Col>
                </Row>
            </Card>
            <Card>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={8}>
                        <Form.Item
                            label="Titre"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: "Veuillez entrer le titre !",
                                },
                            ]}
                        >
                            <Input
                                value={formData.title}
                                onChange={(e) =>
                                    handleSelectChange("title", e.target.value)
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Form.Item
                            label="Nom"
                            name="nom"
                            rules={[
                                {
                                    required: true,
                                    message: "Veuillez entrer votre nom !",
                                },
                            ]}
                        >
                            <Input
                                value={formData.nom}
                                onChange={(e) =>
                                    handleSelectChange("nom", e.target.value)
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Form.Item
                            label="Prénom"
                            name="prenom"
                            rules={[
                                {
                                    required: true,
                                    message: "Veuillez entrer votre prénom !",
                                },
                            ]}
                        >
                            <Input
                                value={formData.prenom}
                                onChange={(e) =>
                                    handleSelectChange("prenom", e.target.value)
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Form.Item label="Société" name="nom_ste">
                            <Input
                                value={formData.nom_ste}
                                onChange={(e) =>
                                    handleSelectChange(
                                        "nom_ste",
                                        e.target.value
                                    )
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Form.Item label="Code Postal" name="postal">
                            <Input
                                value={formData.codeP}
                                onChange={(e) =>
                                    handleSelectChange("postal", e.target.value)
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Form.Item label="Adress" name="adresse">
                            <Input
                                value={formData.adress}
                                onChange={(e) =>
                                    handleSelectChange("adresse", e.target.value)
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Form.Item label="TVA" name="tva">
                            <Input
                                value={formData.tva}
                                onChange={(e) =>
                                    handleSelectChange("tva", e.target.value)
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Form.Item label="Téléphone" name="tel">
                            <Input
                                value={formData.tel}
                                onChange={(e) =>
                                    handleSelectChange("tel", e.target.value)
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Form.Item label="GSM" name="gsm">
                            <Input
                                value={formData.gsm}
                                onChange={(e) =>
                                    handleSelectChange("gsm", e.target.value)
                                }
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={8}>
                        <Form.Item
                            label="Fournisseur"
                            name="fournisseur"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Veuillez sélectionner votre fournisseur actuel !",
                                },
                            ]}
                        >
                            <DynamicSelect
                                value={value}
                                onChange={(value) =>
                                    handleSelectChange("fournisseur", value)
                                }
                                placeholder="Sélectionner un fournisseur"
                                options={[
                                    {
                                        value: "fournisseur1",
                                        label: "Fournisseur 1",
                                    },
                                    {
                                        value: "fournisseur2",
                                        label: "Fournisseur 2",
                                    },
                                    {
                                        value: "fournisseur3",
                                        label: "Fournisseur 3",
                                    },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Form.Item
                            label="Nombre de Compteurs Électriques"
                            name="nbr_comp_elect"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Veuillez sélectionner le nombre de compteurs de gaz !",
                                },
                            ]}
                        >
                            <DynamicSelect
                                value={value} // Ensure value and onChange are passed
                                onChange={(value) =>
                                    handleSelectChange("nbr_comp_elect", value)
                                }
                                placeholder="Sélectionner le nombre de compteurs électriques"
                                options={[
                                    { value: "1", label: "1" },
                                    { value: "2", label: "2" },
                                    { value: "3", label: "3" },
                                    { value: "4", label: "4" },
                                    { value: "+4", label: "+4" },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
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
                            <DynamicSelect
                                value={value} // Ensure value and onChange are passed
                                onChange={(value) =>
                                    handleSelectChange("nbr_comp_gaz", value)
                                }
                                placeholder="Sélectionner le nombre de compteurs gaz"
                                options={[
                                    { value: "1", label: "1" },
                                    { value: "2", label: "2" },
                                    { value: "3", label: "3" },
                                    { value: "4", label: "4" },
                                    { value: "+4", label: "+4" },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Form.Item
                            label="PPV"
                            name="ppv"
                            rules={[{ required: true }]}
                        >
                            <Radio.Group
                                onChange={(e) =>
                                    handlePpvChange(e.target.value)
                                }
                            >
                                <Radio value="oui">Oui</Radio>
                                <Radio value="non">Non</Radio>
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
                                        <Input
                                            value={formData.additionalInput}
                                            onChange={(e) =>
                                                handleSelectChange(
                                                    "additionalInput",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        )}
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
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
                                onChange={handleTarifSocialChange}
                                value={tarifSocial}
                            >
                                <Radio value={true}>Oui</Radio>
                                <Radio value={false}>Non</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
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
                                onChange={handleHauteTensionChange}
                                value={tarifSocial}
                            >
                                <Radio value={true}>Oui</Radio>
                                <Radio value={false}>Non</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
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
                                onChange={handleTarifChange}
                                value={tarifSocial}
                            >
                                <Radio value={true}>Oui</Radio>
                                <Radio value={false}>Non</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={16}>
                        <Form.Item label="Commentaire" name="commentaire">
                            <Input.TextArea
                                value={formData.commentaire}
                                onChange={(e) =>
                                    handleSelectChange(
                                        "commentaire",
                                        e.target.value
                                    )
                                }
                                rows={2}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
        </Form>
    );
};

export default AddAppointment;
