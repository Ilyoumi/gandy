import React, { useState, useEffect } from "react";
import { Button, Modal, Table, message,Select, DatePicker, Card } from "antd";
import { pencil, deletebtn } from "../../../constants/icons";

import useColumnSearch from "../../../constants/tableSearchLogin";
import UpdateRdv from "./UpdateRdv";
import { axiosClient } from "../../../api/axios";
import { EyeOutlined } from "@ant-design/icons";
import AppointmentDetails from "./AppoitmnetDetails";
const { Option } = Select;

const DataTable = () => {
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [agentOptions, setAgentOptions] = useState([]);
    const [agendaOptions, setAgendaOptions] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState(undefined);
    const [selectedAgenda, setSelectedAgenda] = useState(undefined);
    const [selectedDate, setSelectedDate] = useState(undefined);
    const { getColumnSearchProps } = useColumnSearch();

    useEffect(() => {
        fetchData();
        fetchAgentOptions();
        fetchAgendaOptions();
    }, []);

    const fetchAgentOptions = async () => {
        try {
            const response = await axiosClient.get("/api/superviseur-and-agent-users");
            setAgentOptions(response.data.users);
        } catch (error) {
            console.error("Error fetching agent options:", error);
        }
    };
    

    const fetchAgendaOptions = async () => {
        try {
            const response = await axiosClient.get("/api/agendas");
            const agendas = response.data.agendas;
            setAgendaOptions(agendas);
        } catch (error) {
            console.error("Error fetching agenda options:", error);
        }
    };
    

    const fetchData = async () => {
        setLoading(true);
        try {
            // Construct the query parameters based on selected filters
            const queryParams = {};
            if (selectedAgent) {
                queryParams.agent_id = selectedAgent;
            }
            if (selectedAgenda) {
                queryParams.agenda_id = selectedAgenda;
            }
            if (selectedDate) {
                // Assuming selectedDate is a string in ISO format (YYYY-MM-DD)
                queryParams.start_date = selectedDate.toISOString();
            }
            console.log("query", queryParams)
    
            // Make the API request with the constructed query parameters
            const response = await axiosClient.get("/api/rdvs", {
                params: queryParams,
            });
    
            const appointments = response.data;
    
            // Fetch additional data if necessary and process appointments
            const agentIds = appointments.map(appointment => appointment.id_agent);
            // Fetch unique agents based on agent IDs
            const uniqueAgentIds = [...new Set(agentIds)];
            const agentPromises = uniqueAgentIds.map(async (agentId) => {
                try {
                    const agentResponse = await axiosClient.get(`/api/users/${agentId}`);
                    return agentResponse.data;
                } catch (error) {
                    console.error("Error fetching agent details:", error);
                    throw error;
                }
            });
            const agents = await Promise.all(agentPromises);
    
            // Fetch agent commercial names using agenda IDs
            const agendaIds = appointments.map(appointment => appointment.id_agenda);
            const uniqueAgendaIds = [...new Set(agendaIds)];
            const agentCommercialPromises = uniqueAgendaIds.map(async (agendaId) => {
                try {
                    const agendaResponse = await axiosClient.get(`/api/agendas/${agendaId}`);
                    console.log("agenda det", agendaResponse.data)
                    const contactId = agendaResponse.data.agenda.contact_id;
                    try {
                        const contactResponse = await axiosClient.get(`/api/users/${contactId}`);
                        console.log("comm det", contactResponse.data)
    
                        return contactResponse.data;
                    } catch (error) {
                        console.error("Error fetching agent commercial details:", error);
                        throw error;
                    }
                } catch (error) {
                    console.error("Error fetching agenda details:", error);
                    throw error;
                }
            });
            const agentCommercials = await Promise.all(agentCommercialPromises);
    
            // Map appointments to their corresponding agents and agent commercials
            const appointmentsWithAgentsAndCommercials = appointments.map(appointment => {
                const agent = agents.find(agent => agent.id === appointment.id_agent);
                const agentCommercial = agentCommercials.find(contact => contact.id === appointment.id_agenda);
                return { ...appointment, agent, agentCommercial };
            });
    
            // Log the filtered appointments
            console.log("Filtered Appointments:", appointmentsWithAgentsAndCommercials);
    
            // Update the state with the filtered appointments
            setTableData(appointmentsWithAgentsAndCommercials);
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
            title: "Client",
            dataIndex: "client",
            key: "client",
            width: "25%",
            ...getColumnSearchProps("client"),
            render: (_, record) => (
                <span>
                    {record.nom} {record.prenom}
                </span>
            ),
        },
        {
            title: "Agent",
            dataIndex: "agent",
            key: "agent",
            width: "15%",
            ...getColumnSearchProps("agent"),
            render: (_, record) => record.agent ? `${record.agent.nom} ${record.agent.prenom}` : "N/A",
        },
        {
            title: "Agent Commercial",
            dataIndex: "agentCommercial",
            key: "agentCommercial",
            width: "20%",
            ...getColumnSearchProps("agentCommercial"),
            render: (_, record) => record.agentCommercial ? `${record.agentCommercial.nom} ${record.agentCommercial.prenom}` : "N/A",
        },
        {
            title: "TEL",
            dataIndex: "tel",
            key: "tel",
            width: "10%",
            ...getColumnSearchProps("tel"),
            render: (text) => text || "N/A",
        },
        {
            title: "Code P",
            dataIndex: "postal",
            key: "postal",
            width: "10%",
            ...getColumnSearchProps("postal"),
            render: (text) => text || "N/A",
        },
        {
            title: "Date Debut",
            dataIndex: "start_date",
            key: "start_date",
            width: "20%",
            ...getColumnSearchProps("start_date"),
            render: (text) => (text ? new Date(text).toLocaleString() : "-"),
        },
        {
            title: "Action",
            key: "action",
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
            <Card style={{ marginBottom: "20px" }}>
                <Select
                    style={{ width: 200, marginRight: "10px" }}
                    placeholder="Select Agent"
                    onChange={setSelectedAgent}
                    value={selectedAgent}
                >
                    {agentOptions.map(agent => (
                        <Option key={agent.id} value={agent.id}>{`${agent.nom} ${agent.prenom}`}</Option>
                    ))}
                </Select>
                <Select
                    style={{ width: 200, marginRight: "10px" }}
                    placeholder="Select Agenda"
                    onChange={setSelectedAgenda}
                    value={selectedAgenda}
                >
                    {agendaOptions.map(agenda => (
                        <Option key={agenda.id} value={agenda.id}>{agenda.name}</Option>
                    ))}
                </Select>
                <DatePicker
                    style={{ marginRight: "10px" }}
                    placeholder="Select Date"
                    onChange={setSelectedDate}
                    value={selectedDate}
                />
                <Button type="primary" onClick={fetchData}>Apply Filters</Button>
            </Card>
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
