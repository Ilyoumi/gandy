import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Spin } from "antd";

const PrivateRoute = ({ component: Component, allowedRoles, ...rest }) => {
  const { isLogged } = useAuth();
    const [userRole, setUserRole] = useState(null);

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
    }, []); // Run once on component mount
  


    // Inside your PrivateRoute component
    if (userRole === null || userRole === undefined) {
        return <Spin size="large" />;
    }
    

  // Once userRole is defined, proceed with authentication logic
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isLogged) {
          return <Redirect to="/login" />;
        } else if (!allowedRoles.includes(userRole)) {
          // If user role is not allowed, redirect to not authorized page
          return <Redirect to="/not-authorized" />;
        } else {
          // If user is logged in and role is allowed, render the component
          return <Component {...props} />;
        }
      }}
    />
  );
};

export default PrivateRoute;
