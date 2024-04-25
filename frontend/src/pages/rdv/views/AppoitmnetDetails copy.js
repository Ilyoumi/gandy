import React, {useEffect,useState} from "react";
import {  List, message } from "antd";
import { axiosClient } from "../../../api/axios";

const AppointmentDetails = ({ selectedRowData }) => {
    const { nom, prenom,pro, nom_ste, tva, tel, gsm, adresse, postal, fournisseur, nbr_comp_elect, nbr_comp_gaz, ppv, tarif,tarification, haute_tension , start_date, end_date, note, commentaire } = selectedRowData;
    const [agentName, setAgentName] = useState("N/A");

    useEffect(() => {
        fetchAgentName();
    }, []);

    const fetchAgentName = async () => {
        try {
            const agentResponse = await axiosClient.get(`/api/users/${selectedRowData.id_agent}`);
            const agent = agentResponse.data;
            const name = `${agent.nom} ${agent.prenom}`;
            setAgentName(name);
            console.log("agentResponse", agentResponse)
        } catch (error) {
            console.error("Error fetching agent name:", error);
            message.error("Failed to fetch agent name");
        }
    };

    const data = [
        { title: "Date de début", content: start_date },
        { title: "Nom", content: `${nom}${prenom ? ' ' + prenom : ''}` },

        { title: "Agent", content: agentName },
        { title: "Adresse", content: adresse || "N/A" },
        { title: "Code Postal", content: postal || "N/A" },
        { title: "Société", content: nom_ste || "N/A" },
        { title: "TVA", content: tva || "N/A" },
        { title: "Date de fin", content: end_date },
        { title: "Téléphone", content: tel || "N/A" },
        { title: "Pro", content: pro ? "Yes" : "No" },
        { title: "GSM", content: gsm || "N/A" },
        { title: "Fournisseur", content: fournisseur || "N/A" },
        { title: "Nombre de compteur électronique", content: nbr_comp_elect },
        { title: "Nombre de compteur gaz", content: nbr_comp_gaz },
        { title: "PPV", content: ppv ? "Yes" : "No" },
        { title: "Tarif", content: tarif ? "Yes" : "No" },
        { title: "Tarification", content: tarification || "N/A" },
        { title: "Haute Tension", content: haute_tension ? "Yes" : "No" },
        { title: "Commentaire", content: commentaire || "N/A" },
        { title: "Note", content: note || "N/A" },
    ];
    

    // Split the data into three parts
    const splitIndex = Math.ceil(data.length / 3);
    const firstData = data.slice(0, splitIndex);
    const secondData = data.slice(splitIndex, splitIndex * 2);
    const thirdData = data.slice(splitIndex * 2);

    return (
        <div style={{ display: "flex" }}>
            {/* First List */}
            <List
                style={{ flex: 1, marginRight: "20px" }}
                dataSource={firstData}
                renderItem={(item) => (
                    <List.Item>
                        <strong>{item.title}: </strong> {item.content}
                    </List.Item>
                )}
            />
            {/* Second List */}
            <List
                style={{ flex: 1, marginRight: "20px" }}
                dataSource={secondData}
                renderItem={(item) => (
                    <List.Item>
                        <strong>{item.title}: </strong> {item.content}
                    </List.Item>
                )}
            />
            {/* Third List */}
            <List
                style={{ flex: 1 }}
                dataSource={thirdData}
                renderItem={(item) => (
                    <List.Item>
                        <strong>{item.title}: </strong> {item.content}
                    </List.Item>
                )}
            />
        </div>
    );
};

export default AppointmentDetails;
