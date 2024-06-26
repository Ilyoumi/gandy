// UserContext.js
import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userRole, setUserRole] = useState("");
    const [userId, setUserId] = useState("");
    const [contactId, setContactId] = useState("");
    const [userName, setUserName] = useState("");

    return (
        <UserContext.Provider
            value={{ userRole, setUserRole, userId, setUserId, userName, setUserName,contactId, setContactId }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
