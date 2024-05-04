import React, { useState, useEffect } from "react";
import { Table, Select, DatePicker, Card, Row, Col, Upload, Button, message, Modal } from "antd";
import { pencil } from "../../../constants/icons";

import moment from "moment";
import { fetchRdvData, fetchAgentOptions, fetchAgendaOptions } from "../services/api";
import { useCalendar } from "../../../CalendarContext";
import {
	DownloadOutlined,EyeOutlined
} from "@ant-design/icons";
import AppointmentDetails from "./AppoitmnetDetails";

const { Option } = Select;
const { RangePicker } = DatePicker;

const History = () => {
	const [tableData, setTableData] = useState({
		appointments: [],
		modifiedAppointments: [],
		appointmentsByDay: 0,
		appointmentsByWeek: 0,
		appointmentsByMonth: 0,
		totalAppointments: 0,
	});



	const {
		rdvLoading, setRdvLoading,
		selectedAgent, setSelectedAgent,
		selectedAgenda, setSelectedAgenda,
		selectedDateRange, setSelectedDateRange,
		agentOptions, setAgentOptions,
		agendaOptions, setAgendaOptions,
	} = useCalendar();
	const [filtersChanged, setFiltersChanged] = useState(false);
	const [filtersApplied, setFiltersApplied] = useState(false);
	const [selectedRowData, setSelectedRowData] = useState(null);
	const [detailsModalVisible, setDetailsModalVisible] = useState(false);


	useEffect(() => {
		fetchRdvData(selectedAgent, selectedAgenda, selectedDateRange, setTableData, setRdvLoading, tableData);
		fetchAgentOptions(setAgentOptions);
		fetchAgendaOptions(setAgendaOptions);
	}, []);

	useEffect(() => {
		if (filtersChanged) {
			fetchRdvData(selectedAgent, selectedAgenda, selectedDateRange, setTableData, setRdvLoading, tableData);
			setFiltersChanged(false);
			setFiltersApplied(true);
		}
	}, [filtersChanged]);

	const columns = [
		{
			title: "Agent",
			dataIndex: "agent",
			key: "agent",
			render: (_, record) => (
				<span style={columnStyle}>
					{record.agent ? record.agent.nom : "N/A"}
					&nbsp;
					{record.agent ? record.agent.prenom : ""}
				</span>
			),
		},
		{
			title: "Agent Commercial",
			dataIndex: "agentCommercial",
			key: "agentCommercial",
			render: (_, record) => (
					<span style={columnStyle}>
							{record.agentCommercial ? record.agentCommercial.nom : "N/A"}
							&nbsp;
							{record.agentCommercial ? record.agentCommercial.prenom : ""}
					</span>
			),
	},
	
		{
			title: "Date",
			dataIndex: "start_date",
			key: "start_date",
			render: (text) => (
				<span style={columnStyle}>
					{text ? new Date(text).toLocaleString() : "-"}
				</span>
			),
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			render: (status) => {
				let color = "#EC9D34";
				let underline = "3px solid";

				if (status === "confirmer") {
					color = "#4CD9C4";
				} else if (status === "annuler") {
					color = "#FE97AB";
				} else if (status === "NRP") {
					color = "#51A7EA";
				}

				const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);


				return (
					<>
						<span style={{ ...columnStyle, color, borderBottom: `${underline} ${color}` }}>
							{capitalizedStatus}
						</span>
					</>

				);
			},
		},
		{
			title: "Dernière modification",
			dataIndex: "updated_at",
			render: (text) => (
				<span style={columnStyle}>
					{moment(text).format("YYYY-MM-DD HH:mm:ss")}
				</span>
			),
		},
		{
			title: "Modifié par",
			dataIndex: "modifiedBy",
			render: (text, record) => (
				<span style={{ ...columnStyle, color: text === "Pas encore modifié" ? "#BEBEBE" : "inherit", }}>
					{text} 
				</span>
			),
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
							
							
					</div>
			),
	},

	];
	const handleDetailsClick = (record) => {
		setSelectedRowData(record);
		setDetailsModalVisible(true);
};

	const columnStyle = {
		fontSize: "12px",
		verticalAlign: "middle",
		wordBreak: "normal",
		fontWeight: "bold",
	};

	const uploadProps = {
		name: "file",
		action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
		headers: {
			authorization: "authorization-text",
		},
		onChange(info) {
			if (info.file.status !== "uploading") {
			}
			if (info.file.status === "done") {
				message.success(`${info.file.name} file uploaded successfully`);
			} else if (info.file.status === "error") {
				message.error(`${info.file.name} file upload failed.`);
			}
		},
	};

	function getWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

	const columns2 = [
		{
			title: "Agent",
			dataIndex: "agent",
			key: "agent",
			render: (agent) => {
					return (
							<span style={columnStyle}>
									{agent ? `${agent.nom} ${agent.prenom}` : null}
							</span>
					);
			},
	},
	
    {
        title: "Agent Commercial",
        dataIndex: "agentCommercial",
        key: "agentCommercial",
        render: (_, record) => (
            <span style={columnStyle}>
                {record.agentCommercial ? `${record.agentCommercial.nom} ${record.agentCommercial.prenom}` : "N/A"}
            </span>
        ),
    },
    {
        title: "Rendez-vous/jour",
        dataIndex: "appointmentsByDay",
        key: "appointmentsByDay",
        render: (appointmentsByDay) => {
            const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' });
            return appointmentsByDay && appointmentsByDay[today] ? appointmentsByDay[today] : 0;
        },
    },
    {
        title: "Rendez-vous/semaine",
        dataIndex: "appointmentsByWeek",
        key: "appointmentsByWeek",
        render: (appointmentsByWeek) => {
            const currentWeek = `W${getWeekNumber(new Date())}-${new Date().getFullYear()}`;
            return appointmentsByWeek && appointmentsByWeek[currentWeek] ? appointmentsByWeek[currentWeek] : 0;
        },
    },
    {
        title: "Rendez-vous/mois",
        dataIndex: "appointmentsByMonth",
        key: "appointmentsByMonth",
        render: (appointmentsByMonth) => {
            const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long' });
            return appointmentsByMonth && appointmentsByMonth[currentMonth] ? appointmentsByMonth[currentMonth] : 0;
        },
    },
  
];
const filteredData = tableData.modifiedAppointmentsWithAgentsAndCommercials?.filter(record => record.agent);









	return (
		<>
			<Card style={{ marginBottom: "20px" }}>
			<Row style={{alignItems:"center"}}>

					<Col span={6}>
					<h4>Les rendez-vous modifiés</h4>
					</Col>
					<Col span={6}>
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
					</Col>
					<Col span={6}>
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
					</Col>
					<Col span={6}>
						<RangePicker
							style={{ marginRight: "10px" }}
							placeholder={['Date de début', 'Date de fin']}
							onChange={(dates) => {
								setSelectedDateRange(dates)
								setFiltersChanged(true);
							}}
							value={selectedDateRange}
						/>
					</Col>
				</Row>
				<Table columns={columns} dataSource={tableData.modifiedAppointmentsWithAgentsAndCommercials} loading={rdvLoading} pagination={{ pageSize: 5 }} />
				<div className="uploadfile shadow-none" style={{ marginBottom: "20px" }}  >
				<Upload {...uploadProps}>
					<Button
						type="dashed"
						className="ant-full-box"
						icon={<DownloadOutlined />}
					>
						<span className="click">Cliquer pour télécharger</span>
					</Button>
				</Upload>
			</div>
			</Card>


			
			<Card>
				<Row style={{alignItems:"center"}}>
				<Col span={6}>
					<h4>Les statistiques des rendez-vous</h4>
					</Col>
					<Col span={6}>
						<Select
							style={{ width: 200, marginRight: "10px"}}
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
					</Col>
					<Col span={6}>
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
					</Col>
					<Col span={6}>
						<RangePicker
							style={{ marginRight: "10px" }}
							placeholder={['Date de début', 'Date de fin']}
							onChange={(dates) => {
								setSelectedDateRange(dates)
								setFiltersChanged(true);
							}}
							value={selectedDateRange}
						/>
					</Col>
				</Row>
				<Table columns={columns2} dataSource={filteredData} loading={rdvLoading} pagination={{ pageSize: 5 }} />
			</Card>
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


		</>
	);
};


export default History;
