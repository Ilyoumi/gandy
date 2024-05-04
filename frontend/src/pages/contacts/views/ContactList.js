import React, { useEffect, useState } from "react"
import { axiosClient } from "../../../api/axios"
import { Card, Checkbox, Empty } from "antd"
import { fetchAgentCommercialUsers } from "../../caledrier/services/api"
import { UserOutlined } from "@ant-design/icons"

function ContactList({
	agentCommercialUsers,
	selectedItems,
	setSelectedItems,
	agendas,
	setAgendaId,
	role,
	setContactAgendas
}) {
	const [agentSelectedItemId, setAgentSelectedItemId] = useState(null);

	useEffect(() => {
		fetchAgentCommercialUsers();
	}, []);

	useEffect(() => {
		if (agendas.length > 0) {
			setAgendaId(agendas[0].id);
		}
	}, [agendas]);

	const handleCheckboxClick = async (userId) => {
		try {
			let updatedSelectedItems = [];


			if (role === "Agent") {
				setAgentSelectedItemId(userId);
				updatedSelectedItems = [userId];
			} else {
				setAgentSelectedItemId(null);

				if (selectedItems.includes(userId)) {
					updatedSelectedItems = selectedItems.filter(
						(id) => id !== userId
					);
				} else {
					updatedSelectedItems = [...selectedItems, userId];
				}
			}
			const response = await axiosClient.get(`/api/users/${userId}/agendas`);
			const agendas = response.data.agendas;
			setContactAgendas(agendas);
			if (agendas.length > 0) {
				setAgendaId(agendas[0].id);
			}

			setSelectedItems(updatedSelectedItems);
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
