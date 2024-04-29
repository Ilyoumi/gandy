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
		if (agendas.length > 0) {
			setAgendaId(agendas[0].id);
		}
	}, [agendas]);

	const handleCheckboxClick = async (userId) => {
    try {
        console.log("useeer **** ", userId);
        let updatedSelectedItems = [];

        console.log("Current role:", role);
        console.log("Current agentSelectedItemId:", agentSelectedItemId);

        if (role === "Agent") {
            setAgentSelectedItemId(userId);
            updatedSelectedItems = [userId];
            console.log("Selected user:", userId);
        } else {
            // Reset agentSelectedItemId when role is not "Agent"
            setAgentSelectedItemId(null);
            console.log("Resetting agentSelectedItemId to null");

            if (selectedItems.includes(userId)) {
                updatedSelectedItems = selectedItems.filter(
                    (id) => id !== userId
                );
                console.log("Deselected user:", userId);
            } else {
                updatedSelectedItems = [...selectedItems, userId];
                console.log("Added user to selectedItems:", userId);
            }
        }

        // Fetch agendas for the selected user
        const response = await axiosClient.get(`/api/users/${userId}/agendas`);
        console.log("id user for agenda **** ", userId);

        // Extract agendas from the response data
        const agendas = response.data.agendas;

        // Set the contactAgendas state with the agendas
        setContactAgendas(agendas);

        // Set the agendaId to the ID of the first agenda for the selected user
        if (agendas.length > 0) {
            setAgendaId(agendas[0].id);
            console.log("Setting agendaId for user:", agendas[0].id);
        }

        setSelectedItems(updatedSelectedItems);
        console.log("Updated selectedItems:", updatedSelectedItems);
    } catch (error) {
        console.error("Error fetching agendas:", error);
    }
};






	return (
		<Card title="Contacts" style={{ width: "18%" }}>
			{agentCommercialUsers.length === 0 ? (
				<Empty
					image={<UserOutlined style={{ fontSize: 48 }} />}
					description="No data"
				/>
			) : (
				<Checkbox.Group value={selectedItems}>
					{agentCommercialUsers.map((user, index) => (
						<Checkbox
							key={user.id}
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
