// App.js
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Home from "./pages/Home";
import Tables from "./pages/rdv/views/Tables";
import SignIn from "./pages/user/views/Login";
import Main from "./components/layouts/Main";
import 'antd/dist/antd.min.css';
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import AddUserForm from "./pages/user/views/AddUserForm";
import History from "./pages/rdv/views/History";
import Contacts from "./pages/contacts/views/Contacts";
import { SidebarProvider } from './SidebarContext';
import Agenda from "./pages/caledrier/views/DisplayAgenda";
import Card from "./pages/card/Card";
import DisplayUsers from "./pages/user/views/DisplayUsers";
import DisplayCalendar from "./pages/caledrier/views/DisplayCalendar";
import MyCalendar from "./pages/caledrier/views/MyCalendar";

function App() {
  return (
    <Router>
      <AuthProvider>
        <SidebarProvider>
          <div className="App">
            <Switch>
              <Route path="/sign-in" exact component={SignIn} />
              <Route path="/" exact component={Card} />
              <Main>
                <Route exact path="/dashboard" component={Home} />
                <Route exact path="/calendrier" component={DisplayCalendar} />
                <Route exact path="/mycl" component={MyCalendar} />
                <Route exact path="/rdv" component={Tables} />
                <Route exact path="/history" component={History} />
                <Route exact path="/contact" component={Contacts} />
                <Route exact path="/agenda" component={Agenda} />
                <Route exact path="/creer-utilisateur" component={AddUserForm} />
                <Route exact path="/utilisateurs" component={DisplayUsers} />
                <Redirect from="*" to="/dashboard" />
              </Main>
            </Switch>
          </div>
        </SidebarProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
