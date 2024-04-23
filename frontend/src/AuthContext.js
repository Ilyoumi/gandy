import React, { createContext, useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import NotAuthorizedPage from "./pages/NotAuthorizedPage";
import { message } from "antd";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);


export const AuthProvider = ({ children }) => {
    const [isLogged, setIsLogged] = useState(localStorage.getItem("auth_token") !== null);
    const [userId, setUserId] = useState(localStorage.getItem("user_id"));
    const [username, setUsername] = useState(localStorage.getItem("auth_name"));
    const [userRole, setUserRole] = useState(null); // Initially set to null

    const history = useHistory();

   
    const handleLoginSuccess = (id, name, role) => {
        setIsLogged(true);
        setUserId(id);
        setUsername(name);
        setUserRole(role); 
        history.push("/calendrier");
    };

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("auth_name");
        localStorage.removeItem("user_role");
        setIsLogged(false);
        setUsername(null);
        setUserRole(null);
    };

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const role = localStorage.getItem("user_role");
                if (role) {
                    setUserRole(role);
                }
            } catch (error) {
                console.error("Error fetching user role:", error);
            }
        };

        fetchUserRole();
    }, [isLogged]); 

    useEffect(() => {
        const currentPath = history.location.pathname;
        const allowedPaths = ["/login", "/not-authorized", "/"];
        if (!isLogged && !allowedPaths.includes(currentPath)) {
            history.push("/not-authorized");
        }
    }, [isLogged, history]);

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
