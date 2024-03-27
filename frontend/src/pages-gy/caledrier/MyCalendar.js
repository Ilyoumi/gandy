import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
    Modal,
    Form,
    Input,
    Button,
    DatePicker,
    Select,
    Radio,
    message,
    Row,
    Col,Card ,
} from "antd";
import { ClockCircleOutlined } from '@ant-design/icons';
const { Option } = Select;

const CalendarComponent = () => {
    const [showModal, setShowModal] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showAdditionalInput, setShowAdditionalInput] = useState(false);
    const [ppvValue, setPpvValue] = useState("");

    const handlePpvChange = (value) => {
        setPpvValue(value);
        if (value === "oui") {
            setShowAdditionalInput(true);
        } else {
            setShowAdditionalInput(false);
        }
    };

    const handleDateClick = (arg) => {
        setSelectedDate(arg.date);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const getRandomColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const handleFormSubmit = (values) => {
        const { title, description, startTime, endTime } = values;
        const color = getRandomColor();
        const newAppointment = {
            title,
            description,
            start: startTime.toDate(),
            end: endTime.toDate(),
            color,
        };
        setAppointments([...appointments, newAppointment]);
        message.success("Rendez-vous ajouté avec succès !");
        handleCloseModal();
    };

    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                weekends={true}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                dateClick={handleDateClick}
                events={appointments} // Display appointments on the calendar
                eventDisplay="block" // Display events as blocks
                eventBackgroundColor="#52c41a" // Custom color for added appointments
                eventBorderColor="#87d068" // Custom border color for added appointments
            />
            <Modal
                visible={showModal}
                title="Ajouter un rendez-vous"
                onCancel={handleCloseModal}
                footer={null}
                width={1000}
                
            >
                <Form layout="vertical" onFinish={handleFormSubmit} >
                <Card style={{     padding: "0 !important", marginBottom: "10px"}} >
                    <Row gutter={[16, 16]}
                        style={{
                            // padding: "9px 16px"
                            // border: "1px solid rgb(0 0 0 / 8%)",
                            // boxShadow: "0 20px 27px rgb(0 0 0 / 8%)",
                            // borderRadius: "8px",
                            // height:"48px",
                            // padding:"3px 0",
                            // backgroundColor:"white", 
                            // boxShadow:"0 20px 27px rgb(0 0 0 / 5%)",
                        }}
                    >
                        {/* <Col span={1} >
                            <ClockCircleOutlined style={{color:"#D9D9D9", marginRight:"10px"}} />
                        
                        </Col> */}
                        <Col span={6} >
                            <Form.Item
                                name="startTime"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Veuillez sélectionner l'heure de début !",
                                    },
                                ]}
                            >
                            <DatePicker showTime style={{ borderRadius:"6px", fontWeight:"600px", height:"40px"}} />
                            </Form.Item>

                        </Col>
                        <Col span={6} >
                        <Form.Item
                            name="endTime"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Veuillez sélectionner l'heure de fin !",
                                },
                            ]}
                        >
                        <DatePicker showTime style={{ borderRadius:"6px", fontWeight:"600px", height:"40px",}} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                            <Form.Item style={{position: "absolute", right: "20px"}}>
                                <Button  htmlType="submit" style={{backgroundColor:"#00CC6A"}}>
                                    Ajouter un rendez-vous
                                </Button>
                            </Form.Item>
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
                                        message:
                                            "Veuillez entrer votre prénom !",
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
                                <Select>
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
                                <Select>
                                    <Option value="1">1</Option>
                                    <Option value="2">2</Option>
                                    <Option value="3">3</Option>
                                    <Option value="4">4</Option>
                                    <Option value="+4">+4</Option>
                                </Select>
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
                                <Select>
                                    <Option value="1">1</Option>
                                    <Option value="2">2</Option>
                                    <Option value="3">3</Option>
                                    <Option value="4">4</Option>
                                    <Option value="+4">+4</Option>
                                </Select>
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
                        {/* <Col xs={24}>
                            <Form.Item>
                                <Button  htmlType="submit" style={{backgroundColor:"#00CC6A"}}>
                                    Ajouter un rendez-vous
                                </Button>
                            </Form.Item>
                        </Col> */}

                    </Row>
                </Card>
                </Form>
            </Modal>
        </div>
    );
};

export default CalendarComponent;
