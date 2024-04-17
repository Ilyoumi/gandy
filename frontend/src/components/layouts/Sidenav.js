import React, { useEffect, useState } from "react";
import AgentAccess from "./accessUser/AgentAcess";
import logo from "../../assets/images/gy-noir.png";
import AdminAcess from "./accessUser/AdminAccess";
import AgentCommAccess from "./accessUser/AgentComAccess";
import SupervisorAccess from "./accessUser/SupervisorAccess";
import { axiosClient } from "../../api/axios";

function Sidenav({ color }) {
    const [role, setRole] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const authToken = localStorage.getItem("auth_token");
                if (!authToken) {
                    console.log("User is not logged in");
                    return;
                }
        
                const response = await axiosClient.get("/api/user", {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                const { role } = response.data;
                setRole(role);
                console.log("User role:", role);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData(); // Call the function immediately on mount

        // Clean-up function not needed here
    }, []); // No dependencies, as we only need to fetch user data once on mount

    return (
        <div>
            <div className="brand">
                <img
                    src={logo}
                    alt=""
                    style={{
                        width: "70px",
                        height: "auto",
                        marginTop: "-10px",
                    }}
                />
            </div>
            {role === "Admin" && <AdminAcess color={color} />}
            {role === "Agent Commercial" && <AgentCommAccess color={color} />}
            {role === "Superviseur" && <SupervisorAccess color={color} />}
            {role === "Agent" && <AgentAccess color={color} />}
        </div>
    );
}

export default Sidenav;
