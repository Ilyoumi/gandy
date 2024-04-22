import React, { useState, useEffect } from "react";
import { Button, Modal, Table, message } from "antd";
import { pencil, deletebtn } from "../../../constants/icons";

import useColumnSearch from "../../../constants/tableSearchLogin";
import UpdateRdv from "./UpdateRdv";
import { axiosClient } from "../../../api/axios";
import { EyeOutlined } from "@ant-design/icons";
import AppointmentDetails from "./AppoitmnetDetails";

const DataTable = () => {
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { getColumnSearchProps } = useColumnSearch();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get("/api/rdvs");
            const appointments = response.data;
            const agentIds = appointments.map(appointment => appointment.id_agent);
            // Fetch unique agents based on agent IDs
            const uniqueAgentIds = [...new Set(agentIds)];
            const agentPromises = uniqueAgentIds.map(async (agentId) => {
                const agentResponse = await axiosClient.get(`/api/users/${agentId}`);
                return agentResponse.data;
            });
            const agents = await Promise.all(agentPromises);
            // Map appointments to their corresponding agents
            const appointmentsWithAgents = appointments.map(appointment => {
                const agent = agents.find(agent => agent.id === appointment.id_agent);
                return { ...appointment, agent };
            });
            setTableData(appointmentsWithAgents);
        } catch (error) {
            console.error("Error fetching appointments:", error);
            message.error("Failed to fetch appointments");
        } finally {
            setLoading(false);
        }
    };






    const handleUpdateClick = (record) => {
        setSelectedRowData(record);
        setUpdateModalVisible(true);
    };

    const handleDetailsClick = (record) => {
        setSelectedRowData(record);
        setDetailsModalVisible(true);
    };

    const handleUpdateFormSubmit = (updatedData) => {
        const updatedTableData = tableData.map((item) => {
            if (item.key === selectedRowData.key) {
                return {
                    ...item,
                    ...updatedData,
                };
            }
            return item;
        });
        setTableData(updatedTableData);
        setUpdateModalVisible(false);
    };

    const handleDeleteClick = (record) => {
        Modal.confirm({
            title: "Confirmer la suppression",
            content: "Voulez-vous vraiment supprimer cet élément ?",
            okText: "Oui",
            okType: "danger",
            cancelText: "Non",
            onOk() {
                deleteRecord(record);
            },
        });
    };


    const deleteRecord = async (record) => {
        Modal.confirm({
            title: "Confirmation",
            content: "Voulez-vous vraiment supprimer ce Rdv ?",
            okText: "Oui",
            cancelText: "Non",
            onOk: async () => {
                try {
                    await axiosClient.delete(`/api/rdvs/${record.id}`);
                    Modal.success({
                        title: "Suppression réussie",
                        content: "Le Rdv a été supprimé avec succès.",
                    });
                    // Refetch data after deletion
                    fetchData();
                } catch (error) {
                    console.error("Erreur lors de la suppression du Rdv :", error);
                    console.log("Réponse d'erreur :", error.response);
                    message.error("Échec de la suppression du Rdv");
                }
            },
        });
    };


    const columns = [
        {
            title: "CLIENT",
            dataIndex: "client",
            key: "client",
            width: "32%",
            ...getColumnSearchProps("client"),
            render: (_, record) => (
                <span>
                    {record.nom} {record.prenom}
                </span>
            ),
        },
        {
            title: "AGENT",
            dataIndex: "agent",
            key: "agent",
            render: (_, record) => record.agent ? `${record.agent.nom} ${record.agent.prenom}` : "N/A",
        },
        {
            title: "SOCIETE",
            dataIndex: "nom_ste",
            key: "nom_ste",
            ...getColumnSearchProps("nom_ste"),
        },
        {
            title: "TEL",
            key: "tel",
            dataIndex: "tel",
            ...getColumnSearchProps("tel"),
        },
        {
            title: "GSM",
            key: "gsm",
            dataIndex: "gsm",
            ...getColumnSearchProps("gsm"),
        },
        {
            title: "DEBUT DU RDV",
            dataIndex: "start_date",
            key: "start_date",
            render: (text) => (text ? new Date(text).toLocaleString() : "-"),
        },
        {
            title: "FIN DU RDV",
            dataIndex: "end_date",
            key: "end_date",
            render: (text) => (text ? new Date(text).toLocaleString() : "-"),
        },
        {
            title: "ACTION",
            key: "action",
            dataIndex: "action",
            render: (_, record) => (
                <div>
                    <Button
                        type="link"
                        onClick={() => handleDetailsClick(record)}
                    >
                        <EyeOutlined />
                    </Button>
                    <Button
                        type="link"
                        onClick={() => handleUpdateClick(record)}
                    >
                        {pencil}
                    </Button>

                    <Button
                        type="link"
                        onClick={() => handleDeleteClick(record)}
                    >
                        {deletebtn}
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <Table
                columns={columns}
                dataSource={tableData}
                loading={loading}
                pagination={{ pageSize: 5 }}
                style={{
                    boxShadow: "0px 20px 27px #0000000d",
                    padding: "10px 1px",
                    overflowX: "auto",
                }}
            />
            <Modal
                title="Update Data"
                visible={updateModalVisible}
                onCancel={() => setUpdateModalVisible(false)}
                footer={null}
                destroyOnClose
            >
                <UpdateRdv initialValues={selectedRowData} onSubmit={handleUpdateFormSubmit} />
            </Modal>
            <Modal
                title="Modifier rendez-vous"
                visible={detailsModalVisible}
                onCancel={() => setDetailsModalVisible(false)}
                footer={null}
                style={{ marginTop: "-50px" }}
                width="80%"
                destroyOnClose
            >
                {selectedRowData && (
                    <AppointmentDetails
                        selectedRowData={selectedRowData}
                        
                    />
                )}
            </Modal>

        </div>
    );
};

export default DataTable;
