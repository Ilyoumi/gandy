import React, { useState, useEffect } from "react";
import { Button, Modal, Table, message, Select, DatePicker, Card } from "antd";
import { pencil, deletebtn } from "../../../constants/icons";
import UpdateRdv from "./UpdateRdv";
import { axiosClient } from "../../../api/axios";
import { EyeOutlined } from "@ant-design/icons";
import AppointmentDetails from "./AppoitmnetDetails";
import SearchInput from "../../../constants/SearchInput";

const { Option } = Select;
const { RangePicker } = DatePicker;

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
    const [selectedDateRange, setSelectedDateRange] = useState([]);
    const [filtersChanged, setFiltersChanged] = useState(false);
    const [searchText, setSearchText] = useState("");


    useEffect(() => {
        fetchData();
        fetchAgentOptions();
        fetchAgendaOptions();
    }, []);

    useEffect(() => {
        if (filtersChanged) {
            fetchData();
            setFiltersChanged(false);
        }
    }, [filtersChanged]);

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

            // Map through agendas and fetch contact name for each agenda
            const agendaOptionsWithContactNames = await Promise.all(
                agendas.map(async (agenda) => {
                    try {
                        const contactResponse = await axiosClient.get(`/api/users/${agenda.contact_id}`);
                        const contact = contactResponse.data;
                        return { ...agenda, contact_nom: contact.nom, contact_prenom: contact.prenom };
                    } catch (error) {
                        console.error("Error fetching contact details for agenda:", agenda.id, error);
                        throw error;
                    }
                })
            );

            console.log("Agendas with contact names:", agendaOptionsWithContactNames);

            // Set the agenda options with contact names
            setAgendaOptions(agendaOptionsWithContactNames);
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
                console.log("selectedAgent", selectedAgent)

            }
            if (selectedAgenda) {
                queryParams.agenda_id = selectedAgenda;
                console.log("selectedAgenda", selectedAgenda)

            }
            if (selectedDateRange.length === 1) {
                const startDate = selectedDateRange[0].startOf('day').toISOString();
                queryParams.start_date = startDate;
            }

            if (selectedDateRange.length === 2) {
                const startDate = selectedDateRange[0].startOf('day').toISOString();
                const endDate = selectedDateRange[1].endOf('day').toISOString();
                queryParams.start_date = startDate;
                queryParams.end_date = endDate;
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
            render: (_, record) => (
                <span>
                    {highlightText(record.nom)}
                    &nbsp;
                    {highlightText(record.prenom)}
                </span>
            ),
        },
        {
            title: "Agent",
            dataIndex: "agent",
            key: "agent",
            width: "15%",
            render: (_, record) => (
                <span>
                    {record.agent ? highlightText(record.agent.nom) : "N/A"}
                    &nbsp;
                    {record.agent ? highlightText(record.agent.prenom) : ""}
                </span>
            ),
        },
        {
            title: "Agent Commercial",
            dataIndex: "agentCommercial",
            key: "agentCommercial",
            width: "20%",
            render: (_, record) => (
                <span>
                    {record.agentCommercial ? highlightText(record.agentCommercial.nom) : "N/A"}
                    &nbsp;
                    {record.agentCommercial ? highlightText(record.agentCommercial.prenom) : ""}
                </span>
            ),
        },
        {
            title: "TEL",
            dataIndex: "tel",
            key: "tel",
            width: "10%",
            render: (text) => highlightText(text || "N/A"),
        },
        {
            title: "Postal",
            dataIndex: "postal",
            key: "postal",
            width: "10%",
            render: (text) => highlightText(text || "N/A"),
        },
        {
            title: "Date Debut",
            dataIndex: "start_date",
            key: "start_date",
            width: "20%",
            render: (text) => {
                const formattedDate = text ? new Date(text).toLocaleString() : "-";
                return highlightText(formattedDate);
            },
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
    
    const highlightText = (text) => {
        if (!text || !searchText) return text;
        const searchWords = searchText.toLowerCase().split(' ');
        // Escape special characters in the search text and join with '|'
        const escapedSearchWords = searchWords.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const regex = new RegExp(`(${escapedSearchWords.join('|')})`, 'gi');
        return text.toString().split(regex).map((part, index) => {
            return searchWords.includes(part.toLowerCase()) ? (
                <span key={index} style={{ backgroundColor: "#FB6D48", fontWeight: "bold" }}>{part}</span>
            ) : (
                part
            );
        });
    };
    
    
    
    
    const filteredTableData = searchText
    ? tableData.filter(item =>
        searchText
            .toLowerCase()
            .split(' ')
            .every(word =>
                Object.values(item).some(value => {
                    if (!value) return false;
                    const lowerCaseValue = typeof value === "string" ? value.toLowerCase() : value.toLocaleString().toLowerCase();
                    const trimmedWord = word.trim();
                    const wordParts = trimmedWord.split('/');
                    const includesWord = lowerCaseValue.includes(trimmedWord);
                    const includesWordWithSlash = lowerCaseValue.includes(wordParts[0]);
                    const includesWordWithAnotherValue = wordParts.length > 1 && lowerCaseValue.includes(wordParts[1]);
                    return includesWord || includesWordWithSlash || includesWordWithAnotherValue;
                })
            )
    )
    : tableData;









    return (
        <div>
            <Card style={{ marginBottom: "20px" }}>
                <Select
                    style={{ width: 200, marginRight: "10px" }}
                    placeholder="Sélectionner un Agent"
                    onChange={(value) => {
                        setSelectedAgent(value);
                        setFiltersChanged(true);
                    }}
                    allowClear
                    value={selectedAgent}
                >
                    {agentOptions.map(agent => (
                        <Option key={agent.id} value={agent.id}>{`${agent.nom} ${agent.prenom}`}</Option>
                    ))}
                </Select>
                <Select
                    style={{ width: 200, marginRight: "10px" }}
                    placeholder="Sélectionner un Agenda"
                    onChange={(value) => {
                        setSelectedAgenda(value);
                        setFiltersChanged(true);
                    }}
                    allowClear
                    value={selectedAgenda}
                >
                    {agendaOptions.map(agenda => (
                        <Option key={agenda.id} value={agenda.id}>
                            {`${agenda.contact_nom} ${agenda.contact_prenom}`}
                        </Option>
                    ))}
                </Select>

                <RangePicker
                    style={{ marginRight: "10px" }}
                    placeholder={['Date de début', 'Date de fin']}
                    onChange={(dates) => {
                        setSelectedDateRange(dates)
                        setFiltersChanged(true);
                    }}
                    value={selectedDateRange}
                />
            </Card>
            <SearchInput onChange={(value) => setSearchText(value)} />




            <Table
                columns={columns}
                dataSource={filteredTableData}
                loading={loading}
                pagination={{ pageSize: 5 }}
            
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
