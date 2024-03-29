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
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./pages-gy/Home";
import Tables from "./pages-gy/rdv/views/Tables";
import SignIn from "./pages-gy/user/views/SignIn";
import Main from "./components-gy/layouts/Main";
import MyCalendar from './pages-gy/caledrier/MyCalendar'
// import "antd/dist/antd.css";
import 'antd/dist/antd.min.css'
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import AddUserForm from "./pages-gy/user/views/AddUserForm";
import History from "./pages-gy/rdv/views/History";
import Contacts from "./pages-gy/contacts/views/Contacts";
import { SidebarProvider } from './SidebarContext';
import Agenda from "./pages-gy/caledrier/Agenda";
import Card from "./pages-gy/card/Card";
function App() {
  return (
    <SidebarProvider>
      <div className="App">
        <Switch>
          <Route path="/sign-in" exact component={SignIn} />
          <Route path="/" exact component={Card} />
          <Main>
            <Route exact path="/dashboard" component={Home} />
            <Route exact path="/calendar" component={MyCalendar} />
            <Route exact path="/rdv" component={Tables} />
            <Route exact path="/history" component={History} />
            <Route exact path="/contact" component={Contacts} />
            <Route exact path="/agenda" component={Agenda} />
            <Route exact path="/add-user" component={AddUserForm} />
            <Redirect from="*" to="/dashboard" />
          </Main>
        </Switch>
      </div>
      </SidebarProvider>
  );
}

export default App;
