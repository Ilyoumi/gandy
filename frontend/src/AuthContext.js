import React, { createContext, useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import NotAuthorizedPage from "./pages/NotAuthorizedPage";
import { message } from "antd";

// Create a new context for authentication
const AuthContext = createContext();

// Custom hook to access the authentication context
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to provide authentication context to the app
export const AuthProvider = ({ children }) => {
    const [isLogged, setIsLogged] = useState(localStorage.getItem("auth_token") !== null);
    const [userId, setUserId] = useState(localStorage.getItem("user_id"));
    const [username, setUsername] = useState(localStorage.getItem("auth_name"));
    const [userRole, setUserRole] = useState(localStorage.getItem("user_role"));

    const history = useHistory();

    // Function to handle successful login
    const handleLoginSuccess = (id, name, role) => {
        setIsLogged(true);
        setUserId(id);
        setUsername(name);
        setUserRole(role);
        history.push("/calendrier");
    };

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("auth_name");
        localStorage.removeItem("user_role");
        setIsLogged(false);
        setUsername(null);
        setUserRole(null);
    };

    // Check authentication when component mounts
    useEffect(() => {
        // Récupérer le chemin actuel
        const currentPath = history.location.pathname;
    
        // Liste des chemins autorisés pour les utilisateurs non connectés
        const allowedPaths = ["/login", "/not-authorized", "/"];
    
        // Vérifier si l'utilisateur est connecté ou si le chemin est autorisé
        if (!isLogged && !allowedPaths.includes(currentPath)) {
            // Rediriger vers la page non autorisée
            history.push("/not-authorized");
        }
    }, [isLogged, history]);

    // Value object to provide to consumers of the context
    const value = {
        isLogged,
        userId,
        username,
        userRole,
        handleLoginSuccess,
        handleLogout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
