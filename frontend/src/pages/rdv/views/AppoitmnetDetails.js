import React from "react";
import {  List } from "antd";

const AppointmentDetails = ({ selectedRowData }) => {
    const { nom, prenom, nom_ste, tva, tel, gsm, adresse, postal, fournisseur, nbr_comp_elect, nbr_comp_gaz, ppv, tarification, haute_tension, agentName , start_date, end_date } = selectedRowData;

    const data = [
        { title: "Date de début", content: start_date },
        { title: "Nom", content: nom },
        { title: "Prénom", content: prenom },
        { title: "Adresse", content: adresse },
        { title: "Code Postal", content: postal },
        { title: "Société", content: nom_ste },
        { title: "Date de fin", content: end_date },

        { title: "TVA", content: tva },
        { title: "Téléphone", content: tel },
        { title: "GSM", content: gsm },
        
        { title: "Fournisseur", content: fournisseur },
        { title: "Nombre de compteur électronique", content: nbr_comp_elect },
        { title: "Nombre de compteur gaz", content: nbr_comp_gaz },
        { title: "PPV", content: ppv ? "Yes" : "No" },
        { title: "Tarification", content: tarification },
        { title: "Haute Tension", content: haute_tension ? "Yes" : "No" },
        { title: "Agent", content: agentName  },
        
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
