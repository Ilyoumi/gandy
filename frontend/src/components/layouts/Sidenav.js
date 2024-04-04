/* eslint-disable react/prop-types */
/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// import { useState } from "react";
import { useAuth } from "../../AuthContext";

import {  useLocation } from "react-router-dom";
import logo from "../../assets/images/gy-noir.png";
import React, { useState } from "react";
import AdminAcess from "./accessUser/AdminAccess";
import AgentCommAccess from "./accessUser/AgentComAccess";
import SupervisorAccess from "./accessUser/AgentComAccess";
function Sidenav({ color }) {
    const { pathname } = useLocation();
    const page = pathname.replace("/", "");
    const [expanded, setExpanded] = useState(true);
    const { userRole } = useAuth();




    

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
                        marginTop:"-10px"
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
