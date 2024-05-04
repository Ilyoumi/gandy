import React, { useState, useEffect } from "react";
import { Avatar, Space, Table, Button, Row, Col, Card, message, Tag, Modal } from "antd";
import UpdateUser from "./UpdateUser";
import { fetchUsers } from "../services/api";
import { pencil, deletebtn } from "../../../constants/icons";
import { useHistory } from "react-router-dom";
import { axiosClient } from "../../../api/axios";
import SearchInput from "../../../constants/SearchInput";
import { UserAddOutlined } from "@ant-design/icons";


const DisplayUsers = () => {
    const [users, setUsers] = useState([]);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [updateData, setUpdateData] = useState({});
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");

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
            setUsers(userData.users);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
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
            },
        });
    };
		function getColorForRole(role) {
			switch(role) {
					case 'Admin':
							return '#ABC9FF'; 
					case 'Agent':
							return '#74E291'; 
					case 'Superviseur':
							return '#FFA447';
							case 'Agent Commercial':
							return '#FF8F8F';
					default:
							return '#A5DD9B'; 
			}
	}

    const columns = [
        {
            title: "NOM",
            dataIndex: "nom",
            key: "name",
            width: "32%",
            render: (text, record) => (
                <div>
                    <Avatar src={`http://localhost:8000/images/${record.image}`} />
                    <span style={{ marginLeft: 8 }}>{highlightText(text)}</span>
                </div>
            ),
        },
        {
            title: "EMAIL",
            dataIndex: "email",
            key: "email",
            render: (text) => highlightText(text),
        },
				{
					title: "ROLE",
					dataIndex: "role",
					key: "role",
					render: (text) => (
							<span style={{ backgroundColor: getColorForRole(text), padding: '2px 8px', borderRadius: '4px', color: '#fff', fontSize:"12px" }}>
									{text}
							</span>
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
                    <Button type="link" onClick={() => handleDeleteUser(record.id)}>
                        {deletebtn}
                    </Button>
                </Space>
            ),
        },
    ];

    const modifiedUsers = users.map(user => {
        return {
            ...user,
            name: `${user.nom} ${user.prenom}`
        };
    });

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const highlightText = (text) => {
        if (!searchText) return text;
        const regex = new RegExp(`(${searchText})`, 'gi');
        return text.split(regex).map((part, index) => {
            return part.toLowerCase() === searchText.toLowerCase() ? <span key={index} style={{ backgroundColor: "#FB6D48", fontWeight: "bold" }}>{part}</span> : part;
        });
    };
    
    const filteredUsers = searchText ? modifiedUsers.filter(user =>
        user.nom.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase()) ||
        user.role.toLowerCase().includes(searchText.toLowerCase())
    ) : modifiedUsers;
    return (
        <div
            style={{
                marginTop: "20px",
                marginBottom: "20px",
            }}
        >
            <Card style={{ marginBottom: "10px" }}>
                <Row style={{ margin: "10px 20px" }}>
                    <Col span={12} style={{ textAlign: "left", fontWeight: "bold", fontSize: "20px" }}>
                        Liste des Utilisateurs
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            onClick={handleButtonClick}
                        >
                            Nouveau utilisateur
																												<UserAddOutlined />
                        </Button>
                    </Col>
                </Row>

            </Card>
            <Card>
                <SearchInput onChange={handleSearch} />
                <Table
                    columns={columns}
                    loading={loading}
                    dataSource={filteredUsers}
                    pagination={{ pageSize: 5 }}
                    responsive={{
                        xs: 1,
                        sm: 3,
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