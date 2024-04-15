import React, { useEffect } from "react";
import { axiosClient } from "../../../api/axios";
import { Card, Checkbox } from "antd";


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
        fetchAgentCommercialUsers();
    }, []);
    useEffect(() => {
        // Set the agendaId to the ID of the first agenda when agendas are available
        if (agendas.length > 0) {
            setAgendaId(agendas[0].id);
        }
    }, [agendas]);

    const fetchAgentCommercialUsers = async () => {
        try {
            const response = await axiosClient.get("/api/users/agent-commercial");
            // Update agentCommercialUsers state
        } catch (error) {
            console.error("Error fetching agent commercial users:", error);
        }
    };
    const handleCheckboxClick = async (userId) => {
        try {
            let updatedSelectedItems = [...selectedItems];
            if (selectedItems.includes(userId)) {
                // Remove the user if already selected
                updatedSelectedItems = updatedSelectedItems.filter(
                    (id) => id !== userId
                );
                // If there are no selected items, clear the agendaId
                if (updatedSelectedItems.length === 0) {
                    setAgendaId(null);
                }
            } else {
                // Add the user if not already selected
                updatedSelectedItems.push(userId);
                // Fetch agendas for the selected user
                const response = await axiosClient.get(
                    `/api/users/${userId}/agendas`
                );
                const userAgendas = response.data.agendas;
                console.log("agenda id id ", response.data.agendas);
                // Set the agendaId to the ID of the first agenda for the selected user
                if (userAgendas.length > 0) {
                    setAgendaId(userAgendas[0].id);
                }

                setAgendaId(userAgendas[0].id);
            }
            setSelectedItems(updatedSelectedItems);
        } catch (error) {
            console.error("Error fetching agendas:", error);
        }
    };

    return (
        <Card title="Contacts" style={{ width: "15%" }}>
            <Checkbox.Group onChange={setSelectedItems} value={selectedItems}>
                {agentCommercialUsers.map((user, index) => (
                    <div key={index} style={{ marginBottom: "8px" }}>
                        <Checkbox
                            value={user.id}
                            checked={selectedItems.includes(user.id)}
                            onChange={() => handleCheckboxClick(user.id)}
                        >
                            {user.prenom} {user.nom}
                        </Checkbox>
                    </div>
                ))}
            </Checkbox.Group>
        </Card>
    );
}

export default ContactList;
