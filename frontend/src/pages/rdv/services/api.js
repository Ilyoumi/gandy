import { axiosClient } from "../../../api/axios";

function getWeekNumber(date) {
	const onejan = new Date(date.getFullYear(), 0, 1);
	const millisecsInDay = 86400000;
	return Math.ceil((((date - onejan) / millisecsInDay) + onejan.getDay() + 1) / 7);
}

export const fetchRdvData = async (selectedAgent, selectedAgenda, selectedDateRange, setTableData, setRdvLoading) => {
	setRdvLoading(true);
	try {
		const queryParams = {};
		if (selectedAgent) {
			queryParams.agent_id = selectedAgent;
		}
		if (selectedAgenda) {
			queryParams.agenda_id = selectedAgenda;
		}
		if (selectedDateRange.length === 1) {
			const startDate = selectedDateRange[0].startOf('day').toISOString();
			queryParams.start_date = startDate;
		}

		if (selectedDateRange.length === 2) {
			const startDate = selectedDateRange[0].startOf('day').toISOString();
			const endDate = selectedDateRange[1].endOf('day').toISOString();
			queryParams.start_date = startDate;
			queryParams.end_date = endDate;
		}

		const response = await axiosClient.get("/api/rdvs", {
			params: queryParams,
		});

		const appointments = response.data;

		let appointmentsByDay = {};
		let appointmentsByWeek = {};
		let appointmentsByMonth = {};

		appointments.forEach(appointment => {
			const agentId = appointment.id_agent;
			const date = new Date(appointment.start_date);
			const day = date.toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' });
			const week = getWeekNumber(date) + '-' + date.getFullYear();
			const month = date.toLocaleDateString('en-US', { month: 'long' });


			if (!appointmentsByDay[agentId]) appointmentsByDay[agentId] = {};
			if (!appointmentsByWeek[agentId]) appointmentsByWeek[agentId] = {};
			if (!appointmentsByMonth[agentId]) appointmentsByMonth[agentId] = {};

			appointmentsByDay[agentId][day] = (appointmentsByDay[agentId][day] || 0) + 1;
			appointmentsByWeek[agentId][week] = (appointmentsByWeek[agentId][week] || 0) + 1;
			appointmentsByMonth[agentId][month] = (appointmentsByMonth[agentId][month] || 0) + 1;

		});

		const agentIds = appointments.map(appointment => appointment.id_agent);
		
		const uniqueAgentIds = [...new Set(agentIds)];
		const agentPromises = uniqueAgentIds.map(async (agentId) => {
			try {
				const agentResponse = await axiosClient.get(`/api/users/${agentId}`);

				return agentResponse.data;

			} catch (error) {
				console.error("Error fetching agent details:", error);
				throw error;
			}
		});
		const agents = await Promise.all(agentPromises);

		const agendaIds = appointments.map(appointment => appointment.id_agenda);
		const uniqueAgendaIds = [...new Set(agendaIds)];
		const agentCommercialPromises = uniqueAgendaIds.map(async (agendaId) => {
			try {
				const agendaResponse = await axiosClient.get(`/api/agendas/${agendaId}`);
				const contactId = agendaResponse.data.agenda.contact_id;

				try {
					const contactResponse = await axiosClient.get(`/api/users/${contactId}`);

					return contactResponse.data;
				} catch (error) {
					console.error("Error fetching agent commercial details:", error);
					throw error;
				}
			} catch (error) {
				console.error("Error fetching agenda details:", error);
				throw error;
			}
		});

		const agentCommercials = await Promise.all(agentCommercialPromises);

		const modifiedByUserIds = appointments.map(appointment => appointment.modifiedBy);
		const uniqueModifiedByUserIds = [...new Set(modifiedByUserIds)];
		const modifiedByUserPromises = uniqueModifiedByUserIds
			.filter(userId => userId !== null)
			.map(async (userId) => {
				try {
					const userResponse = await axiosClient.get(`/api/users/${userId}`);

					return userResponse.data;
				} catch (error) {
					console.error("Error fetching user details:", error);
					throw error;
				}
			});

		const modifiedByUsers = await Promise.all(modifiedByUserPromises);
		const agendaPromises = uniqueAgendaIds.map(async (agendaId) => {
			try {
				const agendaResponse = await axiosClient.get(`/api/agendas/${agendaId}`);
				return agendaResponse.data;
			} catch (error) {
				console.error("Error fetching agenda details:", error);
				throw error;
			}
		});

		const agendas = await Promise.all(agendaPromises);
		const appointmentsWithAgentsAndCommercials = appointments
		.filter(appointment => appointment.modifiedBy !== null)
		.map(appointment => {
			const agent = agents.find(agent => agent.id === appointment.id_agent);

			const agenda = agendas.find(item => item.agenda.id === appointment.id_agenda);
			const contactId = agenda ? agenda.agenda.contact_id : null;
			const agentCommercial = agentCommercials.find(agent => {
				return agent.id === contactId;
			});
			const modifiedByUser = modifiedByUsers.find(user => user.id === appointment.modifiedBy);

			return {
				...appointment,
				agent,
				agentCommercial: agentCommercial ? `${agentCommercial.prenom} ${agentCommercial.nom}` : "Agent commercial non trouvé",
				modifiedBy: modifiedByUser ? `${modifiedByUser.prenom} ${modifiedByUser.nom}` : "Pas encore modifié",
			};
		});





		const modifiedAppointmentsWithAgentsAndCommercials = appointments
			.filter(appointment => appointment.modifiedBy !== null)
			.map(appointment => {
				const agentId = appointment.id_agent;
				const agentDetails = agents.find(agent => agent.id === agentId);
				const agentRole = agentDetails ? agentDetails.role : null;

				const agent = agentDetails && agentRole !== "Agent Commercial" ? agentDetails : null;

				const agenda = agendas.find(item => item.agenda.id === appointment.id_agenda);
				const contactId = agenda ? agenda.agenda.contact_id : null;
				const agentCommercial = agentCommercials.find(contact => contact.id === contactId);
				const modifiedByUser = modifiedByUsers.find(user => user.id === appointment.modifiedBy);

				return {
					...appointment,
					agent,
					agentCommercial,
					modifiedBy: modifiedByUser ? `${modifiedByUser.nom} ${modifiedByUser.prenom}` : "Pas encore modifié",
					appointmentsByDay: appointmentsByDay[agentId] || {},
					appointmentsByWeek: appointmentsByWeek[agentId] || {},
					appointmentsByMonth: appointmentsByMonth[agentId] || {},
				};
			});



		setTableData({
			appointmentsWithAgentsAndCommercials,
			modifiedAppointmentsWithAgentsAndCommercials,

		});

	} catch (error) {
		console.error("Error fetching appointments:", error);
	} finally {
		setRdvLoading(false);
	}
};


export const fetchAgentOptions = async (setAgentOptions) => {
	try {
		const response = await axiosClient.get("/api/superviseur-and-agent-users");
		setAgentOptions(response.data.users);
	} catch (error) {
		console.error("Error fetching agent options:", error);
	}
};


export const fetchAgendaOptions = async (setAgendaOptions) => {
	try {
		const response = await axiosClient.get("/api/agendas");
		const agendas = response.data.agendas;

		const agendaOptionsWithContactNames = await Promise.all(
			agendas.map(async (agenda) => {
				try {
					const contactResponse = await axiosClient.get(`/api/users/${agenda.contact_id}`);
					const contact = contactResponse.data;
					return { ...agenda, contact_nom: contact.nom, contact_prenom: contact.prenom };
				} catch (error) {
					console.error("Error fetching contact details for agenda:", agenda.id, error);
					throw error;
				}
			})
		);

		setAgendaOptions(agendaOptionsWithContactNames);
	} catch (error) {
		console.error("Error fetching agenda options:", error);
	}
};
