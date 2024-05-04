import React, { useState, useEffect } from "react";
import { Table, Space, Button, Row, Col, Modal, Avatar } from "antd";
import { useHistory } from "react-router-dom";
import UpdateContactModal from "./UpdateContact";
import { axiosClient } from "../../../api/axios";
import { pencil, deletebtn } from "../../../constants/icons";
import useColumnSearch from "../../../constants/tableSearchLogin";
import { EyeOutlined,UserAddOutlined } from "@ant-design/icons";

const Contacts = () => {
    const [visible, setVisible] = useState(false);
    const [agentCommercialUsers, setAgentCommercialUsers] = useState([]);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);

    const history = useHistory();
    const { getColumnSearchProps } = useColumnSearch();

    useEffect(() => {
        fetchAgentCommercialUsers();
    }, []);
    const handleDetailsClick = (record) => {
        setSelectedRowData(record);
        setDetailsModalVisible(true);
    };

    const fetchAgentCommercialUsers = async () => {
        try {
        setLoading(true);

            const response = await axiosClient.get(
                "/api/users/agent-commercial"
            );
            setAgentCommercialUsers(response.data.users);
        } catch (error) {
            console.error("Error fetching agent commercial users:", error);
        }finally {
            setLoading(false);
        }
    };

    const showUpdateModal = (record) => {
        setSelectedRowData(record);
        setVisible(true);
    };

    const handleButtonClick = () => {
        // Redirect to the desired route
        history.push("/creer-utilisateur");
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

                    // After successful deletion, fetch the updated list of agent commercial users
                    fetchAgentCommercialUsers();

                    // Display success message
                    Modal.success({
                        title: "Suppression réussie",
                        content: "L'utilisateur a été supprimé avec succès.",
                    });
                } catch (error) {
                    // Display error message
                    Modal.error({
                        title: "Erreur de suppression",
                        content:
                            "Une erreur s'est produite lors de la suppression de l'utilisateur.",
                    });
                    console.error("Error deleting user:", error);
                }
            },
            onCancel() {
            },
        });
    };

    const columns = [
        {
            title: "Agent Commercial",
            dataIndex: "name",
            key: "name",
            width: "32%",
            ...getColumnSearchProps("name"),
            render: (_, record) => (
                <div>
                    <Avatar src={record.image} />
                    <span style={{ marginLeft: 8 }}>{record.prenom} {record.nom}</span>
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
            title: "ACTION",
            key: "action",
            dataIndex: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        onClick={() => handleDetailsClick(record)}
                    >
                        <EyeOutlined />
                    </Button>
                    <Button
                        type="link"
                        className="darkbtn"
                        onClick={() => showUpdateModal(record)}
                    >
                        {pencil}
                    </Button>
                    <Button
                        type="link"
                        className="darkbtn"
                        onClick={() => handleDeleteUser(record.id)}
                    >
                        {deletebtn}
                    </Button>
                </Space>
            ),
        },
    ];

    const dataSource = agentCommercialUsers.map((user) => ({
        ...user,
        name: `${user.prenom} ${user.nom}`,
    }));

    return (
        <>
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
                        Ajouter Utilisateur
																								
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            onClick={handleButtonClick}
                        >
                            Ajouter utilisateur
																												<UserAddOutlined />

                        </Button>
                    </Col>
                </Row>
                <Table
                    columns={columns}
                loading={loading}

                    dataSource={dataSource}
                    pagination={{ pageSize: 5 }}
                    responsive={{ xs: 1, sm: 3 }}
                />
                <UpdateContactModal
                    open={visible}
                    onCancel={() => setVisible(false)}
                    onUpdate={fetchAgentCommercialUsers}
                    initialValues={selectedRowData}
                />
            </div>
        </>
    );
};

export default Contacts;
