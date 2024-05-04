import React, { useState, useEffect } from "react";
import { Button, Modal, Table, message, Select, DatePicker, Card } from "antd";
import { pencil, deletebtn } from "../../../constants/icons";
import UpdateRdv from "./UpdateRdv";
import { axiosClient } from "../../../api/axios";
import { EyeOutlined } from "@ant-design/icons";
import AppointmentDetails from "./AppoitmnetDetails";
import SearchInput from "../../../constants/SearchInput";
import { useCalendar } from "../../../CalendarContext";
import { fetchRdvData,fetchAgentOptions,fetchAgendaOptions } from "../services/api";

const { Option } = Select;
const { RangePicker } = DatePicker;

const DataTable = () => {
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [tableData, setTableData] = useState({
			appointments: [],
			appointmentsByDay: 0,
			appointmentsByWeek: 0,
			appointmentsByMonth: 0,
			totalAppointments: 0,
		});
    const [filtersChanged, setFiltersChanged] = useState(false);
    const [searchText, setSearchText] = useState("");
    const {
        rdvLoading, setRdvLoading,
        selectedAgent, setSelectedAgent,
        selectedAgenda, setSelectedAgenda,
        selectedDateRange, setSelectedDateRange,
        agentOptions, setAgentOptions,
        agendaOptions, setAgendaOptions,
    } = useCalendar();


    useEffect(() => {
        fetchRdvData(selectedAgent,selectedAgenda,selectedDateRange,setTableData, setRdvLoading,);
        fetchAgentOptions(setAgentOptions);
        fetchAgendaOptions(setAgendaOptions);
    }, []);

    useEffect(() => {
        if (filtersChanged) {
            fetchRdvData(selectedAgent,selectedAgenda,selectedDateRange,setTableData, setRdvLoading,);
            setFiltersChanged(false);
        }
    }, [filtersChanged]);



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
                    fetchRdvData(selectedAgent,selectedAgenda,selectedDateRange,setTableData, setRdvLoading,);
                } catch (error) {
                    console.error("Erreur lors de la suppression du Rdv :", error);
                    console.error("Réponse d'erreur :", error.response);
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
					title: "Total par jour",
					dataIndex: "totalPerDay",
					key: "totalPerDay",
					width: "15%",
			},
			{
					title: "Total par semaine",
					dataIndex: "totalPerWeek",
					key: "totalPerWeek",
					width: "15%",
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


		const calculateTotalPerDay = (date) => {
			if (!date) return 0;
			const currentDate = new Date(date);
			const totalPerDay = tableData.appointmentsWithAgentsAndCommercials.filter(item => {
					const itemDate = new Date(item.start_date);
					return itemDate.getDate() === currentDate.getDate() &&
							itemDate.getMonth() === currentDate.getMonth() &&
							itemDate.getFullYear() === currentDate.getFullYear();
			}).length;
			return totalPerDay;
	};
	
	const calculateTotalPerWeek = (date) => {
			if (!date) return 0;
			const currentDate = new Date(date);
			const weekStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
			const weekEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 6);
			const totalPerWeek = tableData.appointmentsWithAgentsAndCommercials.filter(item => {
					const itemDate = new Date(item.start_date);
					return itemDate >= weekStart && itemDate <= weekEnd;
			}).length;
			return totalPerWeek;
	};

	const filteredTableData = searchText
    ? tableData.appointmentsWithAgentsAndCommercials?.filter(item =>
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
    : tableData.appointmentsWithAgentsAndCommercials?.map(item => ({
        ...item,
        totalPerDay: calculateTotalPerDay(item.start_date),
        totalPerWeek: calculateTotalPerWeek(item.start_date),
    })) || [];

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
                loading={rdvLoading}
                pagination={{ pageSize: 5 }}

            />
            <Modal
                title="Update Data"
                visible={updateModalVisible}
                onCancel={() => setUpdateModalVisible(false)}
                footer={null}
                destroyOnClose
                width="80%"

            >
                <UpdateRdv initialValues={selectedRowData} onSubmit={handleUpdateFormSubmit} />
            </Modal>
            <Modal
                title="Consulter rendez-vous"
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
