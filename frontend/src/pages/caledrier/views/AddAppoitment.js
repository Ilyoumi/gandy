import React, { useState } from "react";
import { Form, Input, Button, DatePicker,Switch, Radio, Row, Col, Card, Space,ConfigProvider,Select } from "antd";
import DynamicSelect from "../../../constants/SearchSelect";
import moment from "moment";
import frFR from "antd/lib/locale/fr_FR";
import SaveButton from '../../../constants/SaveButton';
import { axiosClient } from "../../../api/axios";

const { RangePicker } = DatePicker;
const { Option } = Select;
const AddAppointment = ({ selectedDate , onFormSubmit }) => {
    const [showAdditionalInput, setShowAdditionalInput] = useState(false);
    const [ppvValue, setPpvValue] = useState("");
    const [value, setValue] = useState(""); // Define value state
    const [error, setError] = useState(null);

    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    const handlePpvChange = (value) => {
        setPpvValue(value);
        setShowAdditionalInput(value === "oui");
    };
    const handleSelectChange = (value) => {
        setValue(value);
        setError(null); // Clear error when selecting an option
    };

    // const handleFormSubmit = () => {
    //     Form.valisateFields().then((values) => {
    //         const data = {
    //             nom: values.nom,
    //             prenom: values.prenom,
    //             nom_ste: values.nom_ste,
    //             tva: values.tva,
    //             adresse: values.adresse,
    //             postal: values.postal,
    //             tel: values.tel,
    //             gsm: values.gsm,
    //             fournisseur: values.fournisseur,
    //             tarification: values.tarification,
    //             nbr_comp_elect: values.nbr_comp_elect,
    //             nbr_comp_gaz: values.nbr_comp_gaz,
    //             tarif: values.tarif,
    //             haute_tension: values.haute_tension,
    //             commentaire: values.commentaire,
    //             ppv: values.ppv,
    //             id_agent: values.id_agent,
    //             id_agenda: values.id_agenda,               
    //         };
    //         axiosClient
    //         .get("/sanctum/csrf-cookie")
    //         .then((response) => {
    //             axiosClient
    //                 .post(`api/login`, data)
    //                 .then((res) => {
    //                     if (res.data.status === 200) {
    //                         localStorage.setItem(
    //                             "auth_token",
    //                             res.data.token
    //                         );
    //                         localStorage.setItem(
    //                             "auth_name",
    //                             res.data.username
    //                         );
    //                         handleLoginSuccess(res.data.username);
    //                         fetchAndUpdateRole(res.data.token);
    //                         console.log("res:", res.data);
    //                         console.log(localStorage);
    //                         setName(res.data.username);
    //                         message.success(
    //                             `Bienvenue: ${localStorage.getItem(
    //                                 "user_role"
    //                             )} ${localStorage.getItem("auth_name")}`
    //                         );
    //                     } else if (res.data.status === 401) {
    //                         setAlertVisible(true); // Show error message
    //                         setAlertMessage(<p key="error-message">L'adresse e-mail ou le mot de passe est incorrect. <br></br> Veuillez réessayer.</p>);

    //                     } else {
    //                         // Handle other status codes or validation errors
    //                         console.error(
    //                             "Login failed:",
    //                             res.data.message
    //                         );
    //                     }
    //                 })
    //                 .catch((error) => {
    //                     console.error(
    //                         "An error occurred during login:",
    //                         error
    //                     );
    //                     // Log the error
    //                     // You can also handle the error or display an error message to the user if needed
    //                 });
    //         })
    //         .catch((error) => {
    //             console.error(
    //                 "An error occurred while fetching CSRF token:",
    //                 error
    //             );
    //             // Log the error
    //             // You can also handle the error or display an error message to the user if needed
    //         });

    //     })

    // }

        const handleFormSubmit = async (values) => {
        if (!value) {
            setError("Please select an option"); // Set error if no option selected
            return;
        }
        setLoading(true); // Set loading state while making the request
        axiosClient.post('/api/rdvs', values) // Assuming your API endpoint for creating appointments is '/api/rdvs'
            .then(response => {
                setLoading(false); // Reset loading state after the request is completed
                onFormSubmit(response.data); // Pass the created appointment data to the parent component
            })
            .catch(error => {
                setLoading(false); // Reset loading state if an error occurs
                console.error('Error adding appointment:', error);
            });
    };

    // 
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
            <Card style={{  marginBottom: "10px" }}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <ConfigProvider locale={frFR}>
                            <DatePicker.RangePicker
                            showTime={true}
                            defaultValue={[moment("2015-01-01", "YYYY-MM-DD"), moment("2015-01-01", "YYYY-MM-DD")]}
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
                                            rules={[{ required: true, message: "Veuillez entrer votre nom !" }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} lg={12}>
                                        <Form.Item
                                            label="Prénom"
                                            name="prenom"
                                            rules={[{ required: true, message: "Veuillez entrer votre prénom !" }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} sm={12} lg={12}>
                                        <Form.Item label="Nom de Société" name="nom_ste">
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} lg={12}>
                                        <Form.Item label="TVA" name="tva">
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} sm={12} lg={12}>
                                        <Form.Item label="Adresse" name="adresse">
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} lg={12}>
                                        <Form.Item label="Code Postal" name="postal">
                                            <Input />
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
                                            rules={[{ required: true, message: 'Veuillez saisir votre numéro de téléphone!' }]}
                                        >
                                            <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} lg={12}>
                                        <Form.Item label="GSM" name="gsm">
                                            <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
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
                                            rules={[{ required: true, message: "Veuillez sélectionner le nombre de compteurs de gaz !" }]}
                                        >
                                            <Select
                                                value={value} // Assurez-vous que value et onChange sont transmis
                                                onChange={handleSelectChange}
                                                placeholder="Sélectionner le nombre de compteurs électriques"
                                            >
                                                <Select.Option value="1">1</Select.Option>
                                                <Select.Option value="2">2</Select.Option>
                                                <Select.Option value="3">3</Select.Option>
                                                <Select.Option value="4">4</Select.Option>
                                                <Select.Option value="+4">+4</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Nombre de Compteurs Gaz"
                                            name="nbr_comp_gaz"
                                            rules={[{ required: true, message: "Veuillez sélectionner le nombre de compteurs de gaz !" }]}
                                        >
                                            <Select
                                                value={value} // Assurez-vous que value et onChange sont transmis
                                                onChange={handleSelectChange}
                                                placeholder="Sélectionner le nombre de compteurs gaz"
                                            >
                                                <Select.Option value="1">1</Select.Option>
                                                <Select.Option value="2">2</Select.Option>
                                                <Select.Option value="3">3</Select.Option>
                                                <Select.Option value="4">4</Select.Option>
                                                <Select.Option value="+4">+4</Select.Option>
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
                                            rules={[{ required: true, message: 'Veuillez sélectionner votre fournisseur actuel!' }]}
                                        >
                                            <Select placeholder="sélectionner votre fournisseur">
                                                <Option value="fournisseur1">Fournisseur 1</Option>
                                                <Option value="fournisseur2">Fournisseur 2</Option>
                                                <Option value="fournisseur3">Fournisseur 3</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="PPV"
                                    name="ppv"
                                    rules={[{ required: true }]}
                                >
                                <Switch checkedChildren="Oui" unCheckedChildren="Non" />

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
                                    rules={[{ required: true, message: "Veuillez sélectionner si vous avez un tarif social ou non !" }]}
                                >
                                    <Switch checkedChildren="Oui" unCheckedChildren="Non" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Haute Tension"
                                    name="haute_tension"
                                    rules={[{ required: true, message: "Veuillez sélectionner si vous êtes en haute tension ou non !" }]}
                                >
                                    <Switch checkedChildren="Oui" unCheckedChildren="Non" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Tarification"
                                    name="tarification"
                                    rules={[{ required: true, message: "Veuillez sélectionner votre type de tarification !" }]}
                                >
                                    <Switch checkedChildren="Fixe" unCheckedChildren="Variable" />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Commentaire" name="commentaire">
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

export default AddAppointment;
