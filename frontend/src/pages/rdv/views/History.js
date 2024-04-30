import React, { useState, useEffect } from "react";
import { Table, Select, DatePicker, Card, Row, Col, Upload, Button, message } from "antd";

import moment from "moment";
import { fetchRdvData, fetchAgentOptions, fetchAgendaOptions } from "../services/api";
import { useCalendar } from "../../../CalendarContext";
import {
  ToTopOutlined,
} from "@ant-design/icons";
import RdvStatsTable from "./RdvStatsTable";

const { Option } = Select;
const { RangePicker } = DatePicker;

const History = () => {
	const [tableData, setTableData] = useState({
    appointments: [], // Array of appointment objects
    appointmentsByDay: {},
    appointmentsByWeek: {},
    appointmentsByMonth: {},
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
	
	


	useEffect(() => {
		fetchRdvData(selectedAgent, selectedAgenda, selectedDateRange, setTableData, setRdvLoading,tableData);
		fetchAgentOptions(setAgentOptions);
		fetchAgendaOptions(setAgendaOptions);
	}, []);

	useEffect(() => {
		if (filtersChanged) {
			fetchRdvData(selectedAgent, selectedAgenda, selectedDateRange, setTableData, setRdvLoading,tableData);
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
					<span style={{ ...columnStyle, color: text === "Pas encore modifié" ? "#BEBEBE" : "inherit" ,}}>
							{text}
					</span>
			),
	},
	
];

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
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };



	return (
		<>
			<Card style={{ marginBottom: "20px" }}>
				<Row>
					<Col span={8}>
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
					<Col span={8}>
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
					<Col span={8}>
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
			</Card>
			<Table columns={columns} dataSource={tableData.appointments} loading={rdvLoading} pagination={{ pageSize: 5 }} />
										
			<div className="uploadfile shadow-none"  >
                <Upload {...uploadProps}>
                  <Button
                    type="dashed"
                    className="ant-full-box"
                    icon={<ToTopOutlined />}
                  >
                    <span className="click">Click to Upload</span>
                  </Button>
                </Upload>
              </div>
							<RdvStatsTable statistics={tableData} setStatistics={setTableData} />

		</>
	);
};


export default History;
