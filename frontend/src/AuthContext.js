// Import necessary modules
import React, { createContext, useContext, useState } from "react";

// Create a new context for authentication
const AuthContext = createContext();

// Custom hook to access the authentication context
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to provide authentication context to the app
export const AuthProvider = ({ children }) => {
    const [isLogged, setIsLogged] = useState(localStorage.getItem("auth_token") !== null);
    const [username, setUsername] = useState(localStorage.getItem("auth_name"));
    const [userRole, setUserRole] = useState(localStorage.getItem("user_role"));

    // Function to handle successful login
    const handleLoginSuccess = (name, role) => {
        setIsLogged(true);
        setUsername(name);
        setUserRole(role);
    };

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_name");
        localStorage.removeItem("user_role");
        setIsLogged(false);
        setUsername(null);
        setUserRole(null);
    };

    // Value object to provide to consumers of the context
    const value = {
        isLogged,
        username,
        userRole,
        handleLoginSuccess,
        handleLogout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
