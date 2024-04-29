import React, { useState } from "react";
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
import AgentCommercialCal from './pages/caledrier/views/AgentCommercialCal'
import { CalendarProvider } from "./CalendarContext";
import { UserProvider } from "./GlobalContext";
import NotAuthorizedPage from "./pages/NotAuthorizedPage";
import PrivateRoute from "./PrivateRoute"; // Import PrivateRoute component

function App() {
  const [loading, setLoading] = useState(true);

  // Simulate loading for demonstration purposes
  setTimeout(() => {
    setLoading(false);
  }, 2000);

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
                      <Route exact path="/agent-commercial-calendrier" component={AgentCommercialCal} />
                      <PrivateRoute exact path="/rdv" component={Tables} allowedRoles={["Admin", "Superviseur"]} />
                      <PrivateRoute exact path="/history" component={History} allowedRoles={["Admin"]} />
                      <PrivateRoute exact path="/contact" component={Contacts} allowedRoles={["Admin", "Superviseur"]} />
                      <PrivateRoute exact path="/agenda" component={Agenda} allowedRoles={["Admin", "Superviseur"]} />
                      <PrivateRoute exact path="/creer-utilisateur" component={AddUserForm} allowedRoles={["Admin", "Superviseur"]} />
                      <PrivateRoute exact path="/utilisateurs" component={DisplayUsers} allowedRoles={["Admin", "Superviseur"]} />
                      <PrivateRoute exact path="/agent-calendrier" component={DisplayUsers} allowedRoles={["Admin", "Superviseur", ]} />

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
