import React, { useEffect } from "react";
import { axiosClient } from "../../../api/axios";
import { Card, Checkbox, Empty } from "antd"; // Import Empty component from Ant Design
import { fetchAgentCommercialUsers } from "../../caledrier/services/api";
import { UserOutlined } from "@ant-design/icons"; // Import icons if necessary

function ContactList({
    agentCommercialUsers,
    selectedItems,
    setSelectedItems,
    agendas,
    agentId,
    setAgentId,
    agendaId,
    setAgendaId,
}) {
    
    useEffect(() => {
        console.log("Fetching agent commercial users...");
        fetchAgentCommercialUsers();
    }, []);

    useEffect(() => {
        // Set the agendaId to the ID of the first agenda when agendas are available
        console.log("Agendas updated:", agendas);
        if (agendas.length > 0) {
            setAgendaId(agendas[0].id);
            console.log("Setting agendaId:", agendas[0].id);
        }
    }, [agendas]);

    const handleCheckboxClick = async (userId) => {
        try {
            console.log("Checkbox clicked for user:", userId);
            let updatedSelectedItems = [...selectedItems];
            if (selectedItems.includes(userId)) {
                // Remove the user if already selected
                updatedSelectedItems = updatedSelectedItems.filter(
                    (id) => id !== userId
                );
                console.log("User removed from selectedItems:", userId);
                // If there are no selected items, clear the agendaId
                if (updatedSelectedItems.length === 0) {
                    setAgendaId(null);
                    console.log("Cleared agendaId as there are no selected items");
                }
            } else {
                // Add the user if not already selected
                updatedSelectedItems.push(userId);
                console.log("User added to selectedItems:", userId);
                // Fetch agendas for the selected user
                console.log("Fetching agendas for user:", userId);
                const response = await axiosClient.get(
                    `/api/users/${userId}/agendas`
                );
                const userAgendas = response.data.agendas;
                console.log("Fetched agendas:", userAgendas);
                // Set the agendaId to the ID of the first agenda for the selected user
                if (userAgendas.length > 0) {
                    setAgendaId(userAgendas[0].id);
                    console.log("Setting agendaId for user:", userAgendas[0].id);
                }
            }
            setSelectedItems(updatedSelectedItems);
            console.log("Updated selectedItems:", updatedSelectedItems);
        } catch (error) {
            console.error("Error fetching agendas:", error);
        }
    };

    return (
        <Card title="Contacts" style={{ width: "15%" }}>
            {agentCommercialUsers.length === 0 ? (
                <Empty
                    image={<UserOutlined style={{ fontSize: 48 }} />}
                    description="No data"
                />
            ) : (
                <Checkbox.Group
                    onChange={setSelectedItems}
                    value={selectedItems}
                >
                    {agentCommercialUsers.map((user, index) => (
                        <Checkbox
                            key={index}
                            value={user.id}
                            checked={selectedItems.includes(user.id)}
                            onClick={() => handleCheckboxClick(user.id)}
                            style={{ margin: 0 }} 
                        >
                            {user.prenom} {user.nom}
                        </Checkbox>
                    ))}
                </Checkbox.Group>
            )}
        </Card>
    );
}

export default ContactList;
