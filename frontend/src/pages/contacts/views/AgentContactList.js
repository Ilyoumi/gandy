import React, { useEffect, useState } from "react";
import { axiosClient } from "../../../api/axios";
import { Card, Empty, Radio } from "antd";
import { fetchAgentCommercialUsers } from "../../caledrier/services/api";
import { UserOutlined } from "@ant-design/icons";

function AgentContactList({
    agentCommercialUsers,
    selectedContacts,
    setSelectedContacts,
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
        console.log("Agendas updated:", agendas);
        if (agendas.length > 0) {
            setAgendaId(agendas[0].id);
            console.log("Setting agendaId:", agendas[0].id);
        }
    }, [agendas]);
				useEffect(() => {
					// Set the initial selected contact to the ID of the first user
					if (agentCommercialUsers.length > 0 && !selectedContacts) {
									setSelectedContacts(agentCommercialUsers[0].id);
					}
	}, [agentCommercialUsers, selectedContacts, setSelectedContacts]);


    const handleRadioButtonClick = async (userId) => {
        try {
            console.log("Radio button clicked for user:", userId);

            // Check if the user is already selected
            if (selectedContacts === userId) {
                console.log("User already selected:", userId);
                return;
            }

            // Clear the previously selected contact if any
            setSelectedContacts(userId);
            console.log("Selected user:", userId);

            // Fetch agendas for the selected user
            console.log("Fetching agendas for user:", userId);
            const response = await axiosClient.get(`/api/users/${userId}/agendas`);
            const userAgendas = response.data.agendas;
            console.log("Fetched agendas:", userAgendas);

            // Set the agendaId to the ID of the first agenda for the selected user
            if (userAgendas.length > 0) {
                setAgendaId(userAgendas[0].id);
                console.log("Setting agendaId for user:", userAgendas[0].id);
            } else {
                console.log("No agendas found for user:", userId);
            }
        } catch (error) {
            console.error("Error fetching agendas for user:", userId, error);
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
                <Radio.Group
                    onChange={setSelectedContacts}
                    value={selectedContacts}
                >
                    {agentCommercialUsers.map((user, index) => (
                        <Radio
                            key={index}
                            value={user.id}
                            checked={selectedContacts === user.id}
                            onClick={() => handleRadioButtonClick(user.id)}
                            style={{ margin: 0 }} 
                        >
                            {user.prenom} {user.nom}
                        </Radio>
                    ))}
                </Radio.Group>
            )}
        </Card>
    );
}

export default AgentContactList;
