import React, { useState, useEffect } from "react";
import { Avatar, Space, Table, Button , Row, Col, Card, message, Tag, Modal} from "antd";
import UpdateUser from "./UpdateUser";
import {fetchUsers} from "../services/api";
import { pencil, deletebtn } from "../../../constants/icons";
import { useHistory } from "react-router-dom";

import useColumnSearch from "../../../constants/tableSearchLogin";
import { axiosClient } from "../../../api/axios";
const DisplayUsers = () => {
    const [users, setUsers] = useState([]);
    
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [updateData, setUpdateData] = useState({});
    const { getColumnSearchProps } = useColumnSearch();
    const [loading, setLoading] = useState(false);

    const history = useHistory();

    const handleUpdate = async (values) => {
        try {
            // Send a PUT request to update user data
            const response = await fetch(`http://localhost:8000/api/users/${updateData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
            if (response.ok) {
                // If the request is successful, update the user in the frontend
                const updatedUser = await response.json();
                // Update the user in the users state
                const updatedUsers = users.map((user) =>
                    user.id === updatedUser.id ? updatedUser : user
                );
                setUsers(updatedUsers);
                // Hide the modal
                setUpdateModalVisible(false);
                message.success("User updated successfully");
                fetchUsersData();
            } else {
                // Handle errors
                const errorMessage = await response.text();
                console.error('Error:', errorMessage);
                message.error("Failed to update user: " + errorMessage);
            }
        } catch (error) {
            console.error('Error:', error.message);
            message.error("Failed to update user");
        }
    };
    

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
        setLoading(true);

            const userData = await fetchUsers();
            console.log('Type of users:', typeof userData.users);
            console.log('Users data:', userData.users)
            console.log('Response data:', userData);

            setUsers(userData.users);
        } catch (error) {
            console.error("Error fetching users:", error);
        }finally {
            setLoading(false);
        }
    };


    const showUpdateModal = (record) => {
        setUpdateData(record);
        setUpdateModalVisible(true);
    };

    

    const updateModalProps = {
        visible: updateModalVisible,
        onCancel: () => setUpdateModalVisible(false),
        onUpdate: handleUpdate,
        userData: updateData,
    };

    

    const roleColors = {
        1: 'success', 
        2: 'processing',
        3: 'error',
        4: 'warning',
    };

const handleDeleteUser = async (id) => {
    Modal.confirm({
        title: "Confirmation de suppression",
        content: "Êtes-vous sûr de vouloir supprimer cet utilisateur ?",
        okText: "Oui",
        okType: "danger",
        cancelText: "Annuler",
        onOk: async () => {
            try {
                // Send a request to delete the user with the specified ID
                await axiosClient.delete(`/api/users/${id}`);
                fetchUsersData()

                // Display success message
                Modal.success({
                    title: "Suppression réussie",
                    content: "L'utilisateur a été supprimé avec succès.",
                });
            } catch (error) {
                // Display error message
                Modal.error({
                    title: "Erreur de suppression",
                    content: "Une erreur s'est produite lors de la suppression de l'utilisateur.",
                });
                console.error("Error deleting user:", error);
            }
        },
        onCancel() {
            console.log("Suppression annulée");
        },
    });
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
                <Tag color={roleColors[record.role_id]}>
            {text}
        </Tag>
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
                        onClick={() => handleDeleteUser(record.id)}
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
                loading={loading}
                dataSource={users}
                pagination={{ pageSize: 5}}
                responsive={{
                    xs: 1, // 1 column for extra small screens (mobile)
                    sm: 3, // 3 columns for small screens (tablet)
                }}
                style={{
                    padding: "10px 1px",
                }}
            />
            </Card>
            <UpdateUser {...updateModalProps} onUpdate={handleUpdate} />
        </div>
    );
};

export default DisplayUsers;