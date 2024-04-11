import React, { useState } from "react";
import { pencil, deletebtn } from "../../../constants/icons";

import useColumnSearch from "../../../constants/tableSearchLogin";
import { Table, Button, Modal } from "antd";
import data from "../../../constants/data";
import UpdateRdv from "./UpdateRdv";

const DataTable = () => {
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [tableData, setTableData] = useState([]);
    const { getColumnSearchProps } = useColumnSearch();

    const handleUpdateClick = (record) => {
        setSelectedRowData(record);
        setUpdateModalVisible(true);
    };
    const handleUpdateFormSubmit = (updatedData) => {
        // Implement logic to update the table data
        const updatedTableData = tableData.map((item) => {
            if (item.key === selectedRowData.key) {
                return {
                    ...item,
                    ...updatedData,
                };
            }
            return item;
        });
        setTableData(updatedTableData); // Update the table data
        setUpdateModalVisible(false); // Close the update modal
    };

    const columns = [
        {
            title: "NOM",
            dataIndex: "name",
            key: "name",
            width: "32%",
            ...getColumnSearchProps("name"),
        },
        {
            title: "SOCIETE",
            dataIndex: "societe",
            key: "societe",
            ...getColumnSearchProps("societe"),
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
            title: "DATE RDV",
            key: "date",
            dataIndex: "date",
            ...getColumnSearchProps("date"),
        },
        {
            title: "AGENT",
            key: "agent",
            dataIndex: "agent",
            ...getColumnSearchProps("agent"),
        },
        {
            title: "AGENDA",
            key: "agenda",
            dataIndex: "agenda",
            ...getColumnSearchProps("agenda"),
        },
        {
            title: "ACTION",
            key: "action",
            dataIndex: "action",
            render: (_, record) => (
                <div>
                    <Button
                        type="link"
                        onClick={() => handleUpdateClick(record)}
                    >
                        {pencil}
                    </Button>
                    <Button
                        type="link"
                        onClick={() => handleUpdateClick(record)}
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
                dataSource={data}
                pagination={{ pageSize: 5}}
                scroll={{ x: "max-content" }}
                responsive={{
                    xs: 1, // 1 column for extra small screens (mobile)
                    sm: 3, // 3 columns for small screens (tablet)
                }}
                
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
                style={{ marginTop: "-50px" }}
            >
                <UpdateRdv
                    initialValues={selectedRowData}
                    onSubmit={handleUpdateFormSubmit}
                />
            </Modal>
        </div>
    );
};

export default DataTable;
