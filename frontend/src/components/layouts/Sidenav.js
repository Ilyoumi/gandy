import React, { useEffect, useState } from "react";
import AgentAccess from "./accessUser/AgentAcess"
import logo from "../../assets/images/gy-noir.png";
import AdminAcess from "./accessUser/AdminAccess";
import AgentCommAccess from "./accessUser/AgentComAccess";
import SupervisorAccess from "./accessUser/SupervisorAccess";
import fetchUserData from '../../api/acces';



function Sidenav({ color }) {
    const [expanded, setExpanded] = useState(true);
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        // Initial fetch
        fetchUserData();

        // Periodically fetch user data every 5 minutes (5 * 60 * 1000 milliseconds)
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
            {userRole === "Superviseur" && <SupervisorAccess color={color} />}
            {userRole === "Agent" && <AgentAccess color={color} />}
        </div>
    );
}

export default Sidenav;
