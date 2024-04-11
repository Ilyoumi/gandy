import React from "react";
import { List } from "antd";

const AppointmentDetails = ({ selectedRowData }) => {
    const { nom, prenom, nom_ste, tva, tel, gsm, adresse, postal, fournisseur, nbr_comp_elect, nbr_comp_gaz, ppv, tarification, haute_tension, id_agenda, id_agent, start_date, end_date } = selectedRowData;

    const data = [
        { title: "Nom", content: nom },
        { title: "Prénom", content: prenom },
        { title: "Société", content: nom_ste },
        { title: "TVA", content: tva },
        { title: "Téléphone", content: tel },
        { title: "GSM", content: gsm },
        { title: "Adresse", content: adresse },
        { title: "Code Postal", content: postal },
        { title: "Fournisseur", content: fournisseur },
        { title: "Nombre de compagnie électronique", content: nbr_comp_elect },
        { title: "Nombre de compagnie gaz", content: nbr_comp_gaz },
        { title: "PPV", content: ppv ? "Yes" : "No" },
        { title: "Tarification", content: tarification },
        { title: "Haute Tension", content: haute_tension ? "Yes" : "No" },
        { title: "ID Agenda", content: id_agenda },
        { title: "ID Agent", content: id_agent },
        { title: "Date de début", content: start_date },
        { title: "Date de fin", content: end_date },
    ];

    const splitIndex = Math.ceil(data.length / 2);

    const leftData = data.slice(0, splitIndex);
    const rightData = data.slice(splitIndex);

    return (
        <div style={{ display: "flex" }}>
            <List
                style={{ flex: 1, marginRight: "20px" }}
                dataSource={leftData}
                renderItem={(item) => (
                    <List.Item>
                        <strong>{item.title}: </strong> {item.content}
                    </List.Item>
                )}
            />
            <List
                style={{ flex: 1 }}
                dataSource={rightData}
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
