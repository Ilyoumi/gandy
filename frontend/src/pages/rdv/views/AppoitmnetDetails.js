import React, { useEffect, useState, useRef } from "react";
import { Card, Col, Row, message, Alert, Space, Typography, Tag } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import "./rdv.css";
import { axiosClient } from "../../../api/axios";

const { Text } = Typography;

const AppointmentDetails = ({ selectedRowData }) => {
    const { start_date, end_date, note, commentaire, nom, prenom, pro, status, nom_ste, tva, tel, gsm, adresse, postal, fournisseur, nbr_comp_elect, nbr_comp_gaz, ppv, tarif, tarification, haute_tension } = selectedRowData;
    const [agentName, setAgentName] = useState("N/A");
    const [cardHeight, setCardHeight] = useState("auto");

    const clientInfoCardRef = useRef(null);
    const appointmentInfoCardRef = useRef(null);
    const notesCardRef = useRef(null);

    useEffect(() => {
        fetchAgentName();
        updateCardHeight(); // Calculate initial card heights
    }, []);

    useEffect(() => {
        updateCardHeight(); // Recalculate card heights when data changes
    }, [selectedRowData]);

    const fetchAgentName = async () => {
        try {
            const agentResponse = await axiosClient.get(`/api/users/${selectedRowData.id_agent}`);
            const agent = agentResponse.data;
            const name = `${agent.nom} ${agent.prenom}`;
            setAgentName(name);
        } catch (error) {
            console.error("Error fetching agent name:", error);
            message.error("Failed to fetch agent name");
        }
    };

    const updateCardHeight = () => {
        const clientInfoCardHeight = clientInfoCardRef.current.offsetHeight;
        const appointmentInfoCardHeight = appointmentInfoCardRef.current.offsetHeight;
        const notesCardHeight = notesCardRef.current.offsetHeight;
    
        const maxHeight = Math.max(clientInfoCardHeight, appointmentInfoCardHeight, notesCardHeight);
        setCardHeight(maxHeight + "px");
    };
    
    

    let statusColor = "#000";
    const clientType = pro ? "Professionnel" : "Residential";
    switch (status) {
        case "encours":
            statusColor = "purple";
            break;
        case "confirmer":
            statusColor = "green";
            break;
        case "annuler":
            statusColor = "red";
            break;
        default:
            break;
    }
    const clientTypeColor = pro ? "geekblue" : "gold";

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    };

    return (
        <div>
            <Card bordered={false} className="carddisplayrdvdate">
                <Row justify="space-between" align="middle">
                    <Col>
                        <Text strong>Date de rendez-vous:</Text>
                        <Text>{formatDate(start_date)}</Text>
                    </Col>
                    <Col>
                        <Tag color={statusColor}>{status}</Tag>
                    </Col>
                </Row>
            </Card>

            <Row gutter={[16, 16]} >
                <Col span={10}>
                    <Card size="small" className="carddisplayrdv" ref={clientInfoCardRef} style={{ height: cardHeight  }}>
                        <Row>
                            <Col span={12}>
                                <p><strong>Client:</strong> {nom} {prenom}</p>
                            </Col>
                            <Col span={12}>
                                <Tag color={clientTypeColor}>{clientType}</Tag>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <p><strong>Téléphone:</strong> +32{tel}</p>
                            </Col>
                            <Col span={12}>
                                <p><strong>GSM:</strong>+324{gsm}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <p><strong>Adresse:</strong> {adresse}</p>
                            </Col>
                            
                        </Row>
                        <Row>
                        <Col span={12}>
                                <p><strong>Code postal:</strong> {agentName}</p>
                            </Col>
                            <Col span={12}>
                                <p><strong>Société:</strong> {nom_ste}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <p><strong>TVA:</strong>BE0{tva}</p>
                            </Col>
                            <Col span={12}>
                            <p><strong>Agent:</strong> {agentName}</p>
                            </Col>
                        </Row>
                        
                    </Card>
                </Col>
                <Col span={14}>
                    <Card size="small" className="carddisplayrdv" ref={appointmentInfoCardRef} style={{ height: cardHeight }}>
                        <Row>
                            <Col span={24}>
                                <p><strong>Fournisseur:</strong> {fournisseur}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <p><strong>Nombre de compteur électronique:</strong> {nbr_comp_elect}</p>
                            </Col>
                            <Col span={24}>
                                <p><strong>Nombre de compteur gaz:</strong> {nbr_comp_gaz}</p>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                {commentaire ? <Alert message={commentaire} type="info" /> : <Alert message="Aucun commentaire" type="warning" />}
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
                            <Col span={24}>
                                <Space size="large">
                                    <Space align="baseline">
                                        <Text strong>PPV:</Text>
                                        {ppv ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <CloseCircleTwoTone twoToneColor="#eb2f96" />}
                                    </Space>
                                    <Space align="baseline">
                                        <Text strong>Tarif social:</Text>
                                        {tarif ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <CloseCircleTwoTone twoToneColor="#eb2f96" />}
                                    </Space>
                                    <Space align="baseline">
                                        <Text strong>Haute Tension:</Text>
                                        {haute_tension ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <CloseCircleTwoTone twoToneColor="#eb2f96" />}
                                    </Space>
                                    <Space align="baseline">
                                        <Text strong>Tarification:</Text>
                                        <Text type={tarification === "fixe" ? "default" : tarification === "Variable" ? "success" : "default"}>{tarification}</Text>
                                    </Space>
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col span={24}>
                    <Card title="Notes" size="small" bordered={false} className="carddisplayrdvnote" ref={notesCardRef} style={{ backgroundColor: "#FFF2F0" , }}>
                        <p>{note}</p>
                    </Card>
                </Col>
                
                
            </Row>
        </div>
    );
};

export default AppointmentDetails;
