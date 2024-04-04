import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import logo from "../../assets/images/gy-noir.png";
import AdminAcess from "./accessUser/AdminAccess";
import AgentCommAccess from "./accessUser/AgentComAccess";
import SupervisorAccess from "./accessUser/SupervisorAccess";
import { axiosClient } from "../../api/axios"; // Import your axios instance

function Sidenav({ color }) {
    const { pathname } = useLocation();
    const [expanded, setExpanded] = useState(true);
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        // Function to fetch user data
        const fetchUserData = async () => {
            try {
                // Check if the user is logged in
                const authToken = localStorage.getItem("auth_token");
                if (!authToken) {
                    // User is not logged in, do nothing
                    console.log("User is not logged in")
                    return;
                }
        
                // User is logged in, fetch user data
                const response = await axiosClient.get("/api/user", {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                const { role } = response.data;
                setUserRole(role);
                console.log("User Role", role)

            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        

        // Initial fetch
        fetchUserData();

        // Periodically fetch user data every second
        const interval = setInterval(fetchUserData, 5 * 60 * 1000);

        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <div className="brand">
                <img
                    src={logo}
                    alt=""
                    style={{
                        width: expanded ? "70px" : "0",
                        height: expanded ? "auto" : "0",
                        overflow: "hidden",
                        transition: "all",
                        marginTop: "-10px",
                    }}
                />
            </div>
            {userRole === "Admin" && <AdminAcess color={color} />}
            {userRole === "Agent Commercial" && <AgentCommAccess color={color} />}
            {userRole === "Supperviseur" && <SupervisorAccess color={color} />}
        </div>
    );
}

export default Sidenav;
