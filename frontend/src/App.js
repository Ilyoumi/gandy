// App.js
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Home from "./pages/Home";
import Tables from "./pages/rdv/views/Tables";
import SignIn from "./pages/login/Login";
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
import axios from 'axios';


axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';


axios.defaults.withCredentials = true;


axios.interceptors.request.use(function (config){
  const token = localStorage.getItem('auth_token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});
function App() {
  return (
    <Router>
      <AuthProvider>
        <SidebarProvider>
          <div className="App">
            <Switch>
              <Route path="/login" exact component={SignIn} />
              <Route path="/" exact component={Card} />
              <Main>
                <Route exact path="/dashboard" component={Home} />
                <Route exact path="/calendrier" component={MyCalendar} />
                <Route exact path="/mycl" component={MyCalendar} />
                <Route exact path="/rdv" component={Tables} />
                <Route exact path="/history" component={History} />
                <Route exact path="/contact" component={Contacts} />
                <Route exact path="/agenda" component={Agenda} />
                <Route exact path="/creer-utilisateur" component={AddUserForm} />
                <Route exact path="/utilisateurs" component={DisplayUsers} />
                <Redirect from="*" to="/calendrier" />
              </Main>
            </Switch>
          </div>
        </SidebarProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
