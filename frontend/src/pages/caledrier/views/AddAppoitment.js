import React, { useState } from "react";
import { Form, Input, Button, DatePicker, Radio, Row, Col, Card, Space,ConfigProvider } from "antd";
import DynamicSelect from "../../../constants/SearchSelect";
import moment from "moment";
import frFR from "antd/lib/locale/fr_FR";
import SaveButton from '../../../constants/SaveButton';

const { RangePicker } = DatePicker;
const AddAppointment = ({ selectedDate, onFormSubmit }) => {
    const [showAdditionalInput, setShowAdditionalInput] = useState(false);
    const [ppvValue, setPpvValue] = useState("");

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

    const handleFormSubmit = (values) => {
        onFormSubmit({
            ...values,
            start: values.startTime.toDate(),
            end: values.endTime.toDate(),
        });
    };

    return (
        <Form layout="vertical" onFinish={handleFormSubmit}>
            <Card style={{  marginBottom: "10px" }}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <ConfigProvider locale={frFR}>
                            <DatePicker.RangePicker
                            showTime={true}
                                defaultValue={moment("2015-01-01", "YYYY-MM-DD")}
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
                            <Input />
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
                            <Input />
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
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Form.Item label="Société" name="societe">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Form.Item label="Code Postal" name="codeP">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Form.Item label="Adress" name="adress">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Form.Item label="TVA" name="tva">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Form.Item label="Téléphone" name="tel">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Form.Item label="GSM" name="gsm">
                            <Input />
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
                            name="compteurElectrique"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Veuillez sélectionner le nombre de compteurs de gaz !",
                                },
                            ]}
                        >
                            <DynamicSelect
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
                            name="compteurGaz"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Veuillez sélectionner le nombre de compteurs de gaz !",
                                },
                            ]}
                        >
                            <DynamicSelect
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
                            <Radio.Group onChange={handlePpvChange}>
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
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        )}
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Form.Item
                            label="Tarif Social"
                            name="tarifSocial"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Veuillez sélectionner si vous avez un tarif social ou non !",
                                },
                            ]}
                        >
                            <Radio.Group>
                                <Radio value={true}>Oui</Radio>
                                <Radio value={false}>Non</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Form.Item
                            label="Haute Tension"
                            name="hauteTension"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Veuillez sélectionner si vous êtes en haute tension ou non !",
                                },
                            ]}
                        >
                            <Radio.Group>
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
                            <Radio.Group>
                                <Radio value="fixe">Fixe</Radio>
                                <Radio value="variable">Variable</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={16}>
                        <Form.Item label="Commentaire" name="commentaire">
                            <Input.TextArea rows={2} />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
        </Form>
    );
};

export default AddAppointment;
