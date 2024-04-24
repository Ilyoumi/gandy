import React, { useEffect, useState } from "react";
import { axiosClient } from "../../../api/axios";
import { Card, Checkbox, Empty } from "antd";
import { fetchAgentCommercialUsers } from "../../caledrier/services/api";
import { UserOutlined } from "@ant-design/icons";

function ContactList({
    agentCommercialUsers,
    selectedItems,
    setSelectedItems,
    agendas,
    agentId,
    setAgentId,
    agendaId,
    setAgendaId,
    role,
    contactAgendas, setContactAgendas
}) {
    const [agentSelectedItemId, setAgentSelectedItemId] = useState(null);

    useEffect(() => {
        console.log("Fetching agent commercial users...");
        fetchAgentCommercialUsers();
    }, []);

    useEffect(() => {
        console.log("Agendas updated:", agendas);
        if (agendas.length > 0) {
            setAgendaId(agendas[0].id);
            console.log("Setting agendaId:", agendas[0].id);
        }
    }, [agendas]);

    const handleCheckboxClick = async (userId) => {
        try {

            let updatedSelectedItems = [...selectedItems];

            if (role === "Agent") {

                setAgentSelectedItemId(userId);
                updatedSelectedItems = [userId];
                console.log("Selected user:", userId);
            } else {
                if (selectedItems.includes(userId)) {
                    updatedSelectedItems = updatedSelectedItems.filter(
                        (id) => id !== userId
                    );
                    console.log("Deselected user:", userId);
                } else {
                    updatedSelectedItems.push(userId);
                    console.log("Added user to selectedItems:", userId);
                }
            }

            // Fetch agendas for the selected user
            console.log("Fetching agendas for user:", userId);
            const response = await axiosClient.get(
                `/api/users/${userId}/agendas`
            );
            setContactAgendas(response.data.agendas)
            console.log("Fetched agendas:", contactAgendas);
            // Set the agendaId to the ID of the first agenda for the selected user
            if (contactAgendas.length > 0) {
                setAgendaId(contactAgendas[0].id);
                console.log("Setting agendaId for user:", contactAgendas[0].id);
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
                <Checkbox.Group value={selectedItems}>
                    {agentCommercialUsers.map((user, index) => (
                        <Checkbox
                            key={index}
                            value={user.id}
                            checked={
                                role === "agent"
                                    ? agentSelectedItemId === user.id
                                    : selectedItems.includes(user.id)
                            }
                            onClick={() => handleCheckboxClick(user.id)}
                            style={{ margin: 0 }}
                            disabled={
                                role === "agent" &&
                                agentSelectedItemId !== user.id &&
                                agentSelectedItemId !== null
                            }
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
