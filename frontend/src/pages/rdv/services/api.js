import { message } from "antd";
import { axiosClient } from "../../../api/axios";

export const fetchRdvData = async (selectedAgent,selectedAgenda,selectedDateRange,setTableData, setRdvLoading,) => {
	setRdvLoading(true);
	try {
					const queryParams = {};
					if (selectedAgent) {
									queryParams.agent_id = selectedAgent;
									console.log("selectedAgent", selectedAgent)

					}
					if (selectedAgenda) {
									queryParams.agenda_id = selectedAgenda;
									console.log("selectedAgenda", selectedAgenda)

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

					console.log("query", queryParams)

					const response = await axiosClient.get("/api/rdvs", {
									params: queryParams,
					});

					const appointments = response.data;

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
													console.log("agenda det", agendaResponse.data)
													const contactId = agendaResponse.data.agenda.contact_id;
													try {
																	const contactResponse = await axiosClient.get(`/api/users/${contactId}`);
																	console.log("comm det", contactResponse.data)

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

					const appointmentsWithAgentsAndCommercials = appointments.map(appointment => {
									const agent = agents.find(agent => agent.id === appointment.id_agent);
									const agentCommercial = agentCommercials.find(contact => contact.id === appointment.id_agenda);
									return { ...appointment, agent, agentCommercial };
					});

					console.log("Filtered Appointments:", appointmentsWithAgentsAndCommercials);

					setTableData(appointmentsWithAgentsAndCommercials);
	} catch (error) {
					console.error("Error fetching appointments:", error);
					message.error("Failed to fetch appointments");
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

					// Map through agendas and fetch contact name for each agenda
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

					console.log("Agendas with contact names:", agendaOptionsWithContactNames);

					// Set the agenda options with contact names
					setAgendaOptions(agendaOptionsWithContactNames);
	} catch (error) {
					console.error("Error fetching agenda options:", error);
	}
};
