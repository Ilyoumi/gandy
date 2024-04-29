import React, { useState, useEffect } from "react";
import { Table, Select, DatePicker, Card, Row, Col } from "antd";

import moment from "moment";
import { fetchRdvData, fetchAgentOptions, fetchAgendaOptions } from "../services/api";
import { useCalendar } from "../../../CalendarContext";
import { axiosClient } from "../../../api/axios";

const { Option } = Select;
const { RangePicker } = DatePicker;

const History = () => {
    const [tableData, setTableData] = useState([]);
    const [modifiedUserInfo, setModifiedUserInfo] = useState({});

    const {
        rdvLoading, setRdvLoading,
        selectedAgent, setSelectedAgent,
        selectedAgenda, setSelectedAgenda,
        selectedDateRange, setSelectedDateRange,
        agentOptions, setAgentOptions,
        agendaOptions, setAgendaOptions,
    } = useCalendar();
    const [filtersChanged, setFiltersChanged] = useState(false);


    useEffect(() => {
        fetchRdvData(selectedAgent, selectedAgenda, selectedDateRange, setTableData, setRdvLoading,);
        fetchAgentOptions(setAgentOptions);
        fetchAgendaOptions(setAgendaOptions);
    }, []);

    useEffect(() => {
        if (filtersChanged) {
            fetchRdvData(selectedAgent, selectedAgenda, selectedDateRange, setTableData, setRdvLoading,);
            setFiltersChanged(false);
        }
    }, [filtersChanged]);

    const columns = [
        {
            title: "Client",
            dataIndex: "client",
            key: "client",
            render: (_, record) => (
                <span>
                    {record.nom}
                    &nbsp;
                    {record.prenom}
                </span>
            ),
        },
        {
            title: "Agent",
            dataIndex: "agent",
            key: "agent",
            render: (_, record) => (
                <span>
                    {record.agent ? (record.agent.nom) : "N/A"}
                    &nbsp;
                    {record.agent ? (record.agent.prenom) : ""}
                </span>
            ),
        },
        {
            title: "Agent Commercial",
            dataIndex: "agentCommercial",
            key: "agentCommercial",
            render: (_, record) => (
                <span>
                    {record.agentCommercial ? (record.agentCommercial.nom) : "N/A"}
                    &nbsp;
                    {record.agentCommercial ? (record.agentCommercial.prenom) : ""}
                </span>
            ),
        },
        {
            title: "Date",
            dataIndex: "start_date",
            key: "start_date",
            render: (text) => {
                const formattedDate = text ? new Date(text).toLocaleString() : "-";
                return (formattedDate);
            },
        },
        {
            title: "Créé le",
            dataIndex: "createdAt",
            render: (text) => moment(text).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
            title: "Dernière modification",
            dataIndex: "updated_at",
            render: (text) => moment(text).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
            title: "Modifié par",
            dataIndex: "modifiedBy",
            render: (text, record) => {
                if (record.modifiedBy) {
                    return record.modifiedBy;
                } else {
                    return "N/A";
                }
            },
        },
    ];

    return (
        <div style={{ overflowX: "auto" }}>
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
            <Table columns={columns} dataSource={tableData} loading={rdvLoading} pagination={{ pageSize: 5 }} />
        </div>
    );
};

export default History;
