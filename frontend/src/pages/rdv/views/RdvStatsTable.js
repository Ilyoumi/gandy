import React, { useState, useEffect } from "react";
import { Table } from "antd";

import { fetchRdvData } from "../services/api";
import { useCalendar } from "../../../CalendarContext";


const RdvStatsTable = ({ tableData, setTableData }) => {
	const {
			rdvLoading, setRdvLoading,
			selectedAgent,
			selectedAgenda,
			selectedDateRange,
	} = useCalendar();
	const [filtersChanged, setFiltersChanged] = useState(false);

	useEffect(() => {
			if (filtersChanged) {
					fetchRdvData(selectedAgent, selectedAgenda, selectedDateRange, setTableData, setRdvLoading);
					setFiltersChanged(false);
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
					title: "Appointments by Day",
					dataIndex: "appointmentsByDay",
					key: "appointmentsByDay",
					render: (_, record) => <span>{record.appointmentsByDay || 0}</span>,
			},
			{
					title: "Appointments by Week",
					dataIndex: "appointmentsByWeek",
					key: "appointmentsByWeek",
					render: (_, record) => <span>{record.appointmentsByWeek || 0}</span>,
			},
			{
					title: "Appointments by Month",
					dataIndex: "appointmentsByMonth",
					key: "appointmentsByMonth",
					render: (_, record) => <span>{record.appointmentsByMonth || 0}</span>,
			},
	];

	const columnStyle = {
			fontSize: "12px",
			verticalAlign: "middle",
			wordBreak: "normal",
			fontWeight: "bold",
	};
	console.log("tableData", tableData);
	return (
			<>
					<Table columns={columns} dataSource={tableData} loading={rdvLoading} pagination={{ pageSize: 5 }} />
			</>
	);
};

export default RdvStatsTable;

