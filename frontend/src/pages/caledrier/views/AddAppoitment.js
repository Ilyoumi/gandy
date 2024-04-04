import React, { useState } from "react";
import { Form, Input, Button, DatePicker, Radio, Row, Col, Card, Space,ConfigProvider,Select } from "antd";
import DynamicSelect from "../../../constants/SearchSelect";
import moment from "moment";
import frFR from "antd/lib/locale/fr_FR";
import SaveButton from '../../../constants/SaveButton';

const { RangePicker } = DatePicker;
const { Option } = Select;
const AddAppointment = ({ selectedDate, onFormSubmit }) => {
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

    const handleFormSubmit = (values) => {
        if (!value) {
            setError("Please select an option"); // Set error if no option selected
            return;
        }
        onFormSubmit({
            ...values,
            start: values.startTime.toDate(),
            end: values.endTime.toDate(),
        });
    };
    // 
    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
        <Select
            style={{
            width: 70,
            }}
        >
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
                        {/* <Form.Item label="Téléphone" name="tel">
                            <Input />
                        </Form.Item> */}

                        
                    <Form.Item
                        name="phone"
                        label="Phone Number"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your phone number!',
                        },
                        ]}
                    >
                        <Input
                        addonBefore={prefixSelector}
                        style={{
                            width: '100%',
                        }}
                        />
                    </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Form.Item label="GSM" name="gsm">
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} lg={8}>
                    <Form.Item
                        name="gender"
                        label="Gender"
                        rules={[
                        {
                            required: true,
                            message: 'Please select gender!',
                        },
                        ]}
                    >
                        <Select placeholder="select your gender">
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                        <Option value="other">Other</Option>
                        </Select>
                    </Form.Item>
                        {/* <Form.Item
                            label="Fournisseur"
                            name="fournisseur"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Veuillez sélectionner votre fournisseur actuel !",
                                },
                            ]}
                        > */}
                            {/* <DynamicSelect
                                value={value} // Ensure value and onChange are passed
                                onChange={handleSelectChange}
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
                        </Form.Item> */}
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
                            value={value} // Ensure value and onChange are passed
                                onChange={handleSelectChange}
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
                            value={value} // Ensure value and onChange are passed
                                onChange={handleSelectChange}
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
