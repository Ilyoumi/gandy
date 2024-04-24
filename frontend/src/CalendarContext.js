// CalendarContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const CalendarContext = createContext();

export const useCalendar = () => useContext(CalendarContext);

export const CalendarProvider = ({ children }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addAgendaModalVisible, setAddAgendaModalVisible] = useState(false);
    const [agentCommercialUsers, setAgentCommercialUsers] = useState([]);
    const [agendas, setAgendas] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [agentId, setAgentId] = useState(null);
    const [agendaId, setAgendaId] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDetailsModal, setShowDetailModal] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [appointmentDetails, setAppointmentDetails] = useState(null);
    const [contactName, setContactName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [agentName, setAgentName] = useState("");
    const [selectedContacts, setSelectedContacts] = useState(null);
    const [contactAgendas, setContactAgendas] = useState([]);




    useEffect(() => {
        // Fetch initial data or perform any setup here
    }, []);

    return (
        <CalendarContext.Provider
            value={{
                showAddModal,
                setShowAddModal,
                appointments,
                setAppointments,
                selectedItems,
                setSelectedItems,
                agentId,
                setAgentId,
                agendaId,
                setAgendaId,
                selectedAppointment,
                setSelectedAppointment,
                showUpdateModal,
                setShowUpdateModal,
                showDetailsModal,
                setShowDetailModal,
                selectedRowData,
                setSelectedRowData,
                appointmentDetails,
                setAppointmentDetails,
                selectedDate,
                setSelectedDate,
                loading,
                setLoading,
                addAgendaModalVisible,
                setAddAgendaModalVisible,
                agentCommercialUsers,
                setAgentCommercialUsers,
                agendas,
                setAgendas,
                contactName,
                setContactName,
                contactEmail,
                setContactEmail,
                agentName, setAgentName, selectedContacts, setSelectedContacts,contactAgendas, setContactAgendas
            }}
        >
            {children}
        </CalendarContext.Provider>
    );
};
