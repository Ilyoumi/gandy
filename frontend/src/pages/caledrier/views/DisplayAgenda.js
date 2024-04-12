import React, { useState, useEffect } from "react";
import { Button, Col, Row, Table, Modal, Space } from "antd";
import { pencil, deletebtn } from "../../../constants/icons";
import AddAgendaModal from "./AddAgenda";
import UpdateForm from "./UpdateAgenda";
import { axiosClient } from "../../../api/axios";
import fetchUserData from "../../../api/acces";
import { useUser } from "../../../GlobalContext";

const DisplayAgenda = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [addAgendaModalVisible, setAddAgendaModalVisible] = useState(false);
    const [agendas, setAgendas] = useState([]);
    const userContext = useUser();

    useEffect(() => {
        // Fetch user data when the component mounts
        fetchUserData(userContext);

        // Fetch agendas
        fetchAgendas();
    }, []);
    const updateAgendas = (updatedAgendas) => {
        setAgendas(updatedAgendas);
    };

    const fetchAgendas = async () => {
        try {
            const response = await axiosClient.get("/api/agendas");
            const fetchedAgendas = response.data.agendas;
    
            console.log("Fetched agendas:", fetchedAgendas);
    
            // Fetch contact name and number of appointments for each agenda
            const updatedAgendas = await Promise.all(
                fetchedAgendas.map(async (agenda) => {
                    try {
                        // Fetch user data for the contact
                        const contactResponse = await axiosClient.get(
                            `/api/users/${agenda.contact_id}`
                        );
            
                        console.log("Contact response:", contactResponse.data);
            
                        const contactName = `${contactResponse.data.prenom} ${contactResponse.data.nom}`;
            
                        // Fetch appointments for the agenda
                        const appointmentsResponse = await axiosClient.get(
                            `/api/agendas/${agenda.id}/appointments`
                        );
                        const numAppointments = appointmentsResponse.data.rdvs.length;
            
                        return {
                            ...agenda,
                            contactName,
                            numAppointments,
                        };
                    } catch (error) {
                        console.error("Error fetching contact or appointments:", error);
                        return null;
                    }
                })
            );
            
    
            console.log("Updated agendas:", updatedAgendas);
    
            // Filter out any null values (agendas with errors)
            const filteredAgendas = updatedAgendas.filter((agenda) => agenda !== null);
    
            console.log("Filtered agendas:", filteredAgendas);
    
            setAgendas(filteredAgendas);
        } catch (error) {
            console.error("Error fetching agendas:", error);
        }
    };


const deleteRecord = async (record) => {
    Modal.confirm({
        title: "Confirmation",
        content: "Voulez-vous vraiment supprimer cet agenda ?",
        okText: "Oui",
        cancelText: "Non",
        onOk: async () => {
            try {
                await axiosClient.delete(`/api/agendas/${record.id}`);
                Modal.success({
                    title: "Suppression réussie",
                    content: "L'agenda a été supprimé avec succès.",
                });
                // Refetch data after deletion
                fetchAgendas();
            } catch (error) {
                console.error("Erreur lors de la suppression de l'agenda :", error);
                console.log("Réponse d'erreur :", error.response);
                Modal.error({
                    title: "Échec",
                    content: "Une erreur s'est produite lors de la suppression de l'agenda.",
                });
            }
        },
    });
};

    

    const handleOpenAddAgendaModal = () => {
        setAddAgendaModalVisible(true);
    };

    const handleUpdate = (record) => {
        setSelectedRowData(record);
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: "NOM",
            dataIndex: "name",
            key: "name",
            width: "25%",
        },
        {
            title: "AGENT",
            dataIndex: "contactName",
            key: "contactName",
        },
        {
            title: "NOMBRE D'APPOINTMENTS",
            dataIndex: "numAppointments",
            key: "numAppointments",
        },
        {
            title: "ACTION",
            key: "action",
            render: (text, record) => (
                <Space size="middle">
                    <Button type="link" danger onClick={()=> {deleteRecord(record)}}>
                        {deletebtn}
                    </Button>
                    <Button
                        type="link"
                        className="darkbtn"
                        onClick={() => handleUpdate(record)}
                    >
                        {pencil}
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div
            style={{
                backgroundColor: "white",
                padding: "5px",
                boxShadow: "0px 20px 27px #0000000d",
            }}
        >
            <Row style={{ margin: "10px 20px" }}>
                <Col
                    span={12}
                    style={{
                        textAlign: "left",
                        fontWeight: "bold",
                        fontSize: "20px",
                    }}
                >
                    Ajouter Agenda
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        onClick={handleOpenAddAgendaModal}
                    >
                        Ajouter Agenda
                    </Button>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={agendas}
                pagination={{ pageSize: 5 }}
                responsive={{ xs: 1, sm: 3 }}
                style={{ padding: "10px 1px" }}
            />
            <Modal
                title="Update Record"
                visible={isModalVisible}
                onCancel={handleModalCancel}
                footer={null}
            >
                <UpdateForm
                    initialValues={selectedRowData}
                    onSubmit={(values) => console.log(values)}
                    onClose={handleModalCancel}
                    updateAgendas={fetchAgendas} 
                />
            </Modal>
            <AddAgendaModal
                visible={addAgendaModalVisible}
                onCancel={() => setAddAgendaModalVisible(false)}
            />
        </div>
    );
};

export default DisplayAgenda;
