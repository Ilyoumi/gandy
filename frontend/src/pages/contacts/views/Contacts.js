import React, { useState } from "react";
import { Table, Space, Button, Row, Col } from "antd";

import { useHistory } from "react-router-dom";
import UpdateContactModal from "./UpdateContact";
import data from "../../../constants/contactsData"
import { pencil, deletebtn } from "../../../constants/icons";
import useColumnSearch from "../../../constants/tableSearchLogin";
const Contacts = () => {
    
    const [visible, setVisible] = useState(false);
    const history = useHistory();
    const { getColumnSearchProps } = useColumnSearch();


    const showUpdateModal = () => {
        setVisible(true);
    };

    const handleUpdate = () => {
        // Logic to update the agenda
        setVisible(false);
    };

    const handleButtonClick = () => {
        // Redirect to the desired route
        history.push("/creer-utilisateur");
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
            title: "EMAIL",
            dataIndex: "email",
            key: "email",
            ...getColumnSearchProps("email"),
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
            render: () => (
                <Space size="middle">
                    <Button type="link" className="darkbtn" onClick={showUpdateModal}>
                        {pencil}
                    </Button>
                    <Button type="link" className="darkbtn" onClick={showUpdateModal}>
                        {deletebtn}
                    </Button>
                </Space>
            ),
        },
    ];

    

    return (
        <>
            <div style={{ backgroundColor:"white", padding:"5px",boxShadow: "0px 20px 27px #0000000d", }}>

                <Row style={{ margin:"10px 20px" }}>
                    <Col span={12} style={{ textAlign: "left", fontWeight:"bold", fontSize:"20px" }}>
                        Ajouter Utilisateur
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            onClick={handleButtonClick}
                        >
                            Ajouter utilisateur
                        </Button>
                    </Col>
                </Row>
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={{ pageSize: 5}}
                scroll={{ x: "max-content" }}
                responsive={{
                    xs: 1, // 1 column for extra small screens (mobile)
                    sm: 3, // 3 columns for small screens (tablet)
                }}
                />
                <UpdateContactModal
                    visible={visible}
                    onCancel={() => setVisible(false)}
                    onUpdate={handleUpdate}
                />

            </div>
        </>
    );
};

export default Contacts;
