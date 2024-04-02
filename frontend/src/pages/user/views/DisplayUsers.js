import React, { useState, useEffect } from "react";
import { Avatar, Space, Table, Button , Row, Col, Card} from "antd";
import UpdateUser from "./UpdateUser";
import fetchUsers from "../services/apis/usersApi";
import { pencil, deletebtn } from "../../../constants/icons";
import { useHistory } from "react-router-dom";

import useColumnSearch from "../../../constants/tableSearchLogin";
const DisplayUsers = () => {
    const [users, setUsers] = useState([]);
    
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [updateData, setUpdateData] = useState({});
    const { getColumnSearchProps } = useColumnSearch();
    const history = useHistory();


    const handleButtonClick = () => {
        // Redirect to the desired route
        history.push("/creer-utilisateur");
    };

    useEffect(() => {
        // Fetch users data when component mounts
        fetchUsersData();
    }, []);

    const fetchUsersData = async () => {
        try {
            const userData = await fetchUsers();
            setUsers(userData);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };


    const showUpdateModal = (record) => {
        setUpdateData(record);
        setUpdateModalVisible(true);
    };

    const handleUpdate = (values) => {
        console.log("Updated user data:", values);
        setUpdateModalVisible(false);
    };

    const updateModalProps = {
        visible: updateModalVisible,
        onCancel: () => setUpdateModalVisible(false),
        onUpdate: handleUpdate,
        userData: updateData,
    };

    
    const columns = [
        {
            title: "NOM",
            dataIndex: "name",
            key: "name",
            width: "32%",
            ...getColumnSearchProps("name"),
            render: (text, record) => (
                <div>
                    <Avatar src={record.image} />
                    <span style={{ marginLeft: 8 }}>{text}</span>
                </div>
            ),
        },
        {
            title: "EMAIL",
            dataIndex: "email",
            key: "email",
            ...getColumnSearchProps("email"),
        },
        {
            title: "ROLE",
            dataIndex: "role",
            key: "role",
            ...getColumnSearchProps("role"),
            render: (text, record) => (
                <span>{record.role ? record.role.name : ""}</span>
            ),
        },
        {
            title: "ACTION",
            key: "action",
            render: (text, record) => (
                <Space>
                    <Button type="link" onClick={() => showUpdateModal(record)}>
                        {pencil}
                    </Button>
                    <Button
                        type="link"
                        onClick={() => console.log("Delete user:", record.id)}
                    >
                        {deletebtn}
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div
            style={{
                marginTop: "20px",
                marginBottom: "20px",
            }}
        >
            <Card style={{ marginBottom:"10px" }}>
            <Row style={{ margin:"10px 20px" }}>
                    <Col span={12} style={{ textAlign: "left", fontWeight:"bold", fontSize:"20px" }}>
                        Liste des Utilisateurs
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            onClick={handleButtonClick}
                        >
                            Nouveau utilisateur
                        </Button>
                    </Col>
                </Row>

        </Card>
            <Card>
            <Table
                columns={columns}
                dataSource={users}
                pagination={{ pageSize: 5}}
                scroll={{ x: "max-content" }}
                responsive={{
                    xs: 1, // 1 column for extra small screens (mobile)
                    sm: 3, // 3 columns for small screens (tablet)
                }}
                style={{
                    padding: "10px 1px",
                }}
            />
            </Card>
            <UpdateUser {...updateModalProps} />
        </div>
    );
};

export default DisplayUsers;
