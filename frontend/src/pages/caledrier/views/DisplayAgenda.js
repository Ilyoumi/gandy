import React, { useState } from "react";
import { Button, Col, Row, Table, Modal, Space } from "antd";
import data from "../../../constants/data";
import { pencil, deletebtn } from "../../../constants/icons";
import AddAgendaModal from "./AddAgenda";
import UpdateForm from "./UpdateAgenda";

const DisplayAgenda = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [addAgendaModalVisible, setAddAgendaModalVisible] = useState(false);
    // const { getColumnSearchProps } = useColumnSearch();
    

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

    // const columns = [
    //     {
    //         title: "NOM",
    //         dataIndex: "name",
    //         key: "name",
    //         width: "32%",
    //         ...getColumnSearchProps("name"),
    //     },
    //     {
    //         title: "AGENT",
    //         key: "agent",
    //         dataIndex: "agent",
    //         ...getColumnSearchProps("agent"),
    //     },
    //     {
    //         title: "ACTION",
    //         key: "action",
    //         render: (text, record) => (
    //             <Space size="middle">
    //                 <Button type="link" danger>
    //                     {deletebtn}
    //                 </Button>
    //                 <Button
    //                     type="link"
    //                     className="darkbtn"
    //                     onClick={() => handleUpdate(record)}
    //                 >
    //                     {pencil}
    //                 </Button>
    //             </Space>
    //         ),
    //     },
    // ];

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
            {/* <Table
                columns={columns}
                dataSource={data}
                pagination={{ pageSize: 5 }}
                scroll={{ x: "max-content" }}
                responsive={{ xs: 1, sm: 3 }}
                style={{ padding: "10px 1px" }}
            /> */}
            <Modal
                title="Update Record"
                visible={isModalVisible}
                onCancel={handleModalCancel}
                footer={null}
            >
                <UpdateForm
                    initialValues={selectedRowData}
                    onSubmit={(values) => console.log(values)}
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
