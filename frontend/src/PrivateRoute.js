import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ component: Component, allowedRoles, ...rest }) => {
  const { isLogged, userRole } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isLogged) {
          // If user is not logged in, redirect to login page
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
