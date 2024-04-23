import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { Spin } from "antd";
import { AuthProvider } from "./AuthContext";
import Home from "./pages/Home";
import Tables from "./pages/rdv/views/Tables";
import SignIn from "./pages/login/Login";
import Main from "./components/layouts/Main";
import "antd/dist/antd.min.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import AddUserForm from "./pages/user/views/AddUserForm";
import History from "./pages/rdv/views/History";
import Contacts from "./pages/contacts/views/Contacts";
import { SidebarProvider } from "./SidebarContext";
import Agenda from "./pages/caledrier/views/DisplayAgenda";
import HomeCompanies from "./pages/home/HomeCompanies";
import DisplayUsers from "./pages/user/views/DisplayUsers";
import MyCalendar from "./pages/caledrier/views/MyCalendar";
import axios from "axios";
import { CalendarProvider } from "./CalendarContext";
import { UserProvider } from "./GlobalContext";
import NotAuthorizedPage from "./pages/NotAuthorizedPage";
import PrivateRoute from "./PrivateRoute"; // Import PrivateRoute component

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["Accept"] = "application/json";

axios.defaults.withCredentials = true;

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("auth_token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for demonstration purposes
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Clean up timer
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Router>
      <UserProvider>
        <CalendarProvider>
          <AuthProvider>
            <SidebarProvider>
              <div className="App">
                {loading ? (
                  // Display the Spin component while loading
                  <div style={{ textAlign: "center", paddingTop: "50vh" }}>
                    <Spin size="large" />
                  </div>
                ) : (
                  <Switch>
                    <Route path="/login" exact component={SignIn} />
                    <Route path="/" exact component={HomeCompanies} />
                    <Route path="/not-authorized" component={NotAuthorizedPage} />
                    <Main>
                      <PrivateRoute exact path="/dashboard" component={Home} allowedRoles={["Admin"]}  />
                      <Route exact path="/calendrier" component={MyCalendar} />
                      <PrivateRoute exact path="/rdv" component={Tables} allowedRoles={["Admin", "Superviseur"]} />
                      <PrivateRoute exact path="/history" component={History} allowedRoles={["Admin"]} />
                      <PrivateRoute exact path="/contact" component={Contacts} allowedRoles={["Admin", "Superviseur"]} />
                      <PrivateRoute exact path="/agenda" component={Agenda} allowedRoles={["Admin", "Superviseur"]} />
                      <PrivateRoute exact path="/creer-utilisateur" component={AddUserForm} allowedRoles={["Admin", "Superviseur"]} />
                      <PrivateRoute exact path="/utilisateurs" component={DisplayUsers} allowedRoles={["Admin", "Superviseur"]} />
                      <PrivateRoute exact path="/agent-calendrier" component={DisplayUsers} allowedRoles={["Admin", "Superviseur", "Agent Commercial"]} />
                      {/* <Redirect from="*" to="/calendrier" /> */}
                    </Main>
                  </Switch>
                )}
              </div>
            </SidebarProvider>
          </AuthProvider>
        </CalendarProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
