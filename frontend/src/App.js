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
import Tables from "./pages-gy/Tables";
import Billing from "./pages-gy/Billing";
import Rtl from "./pages-gy/Rtl";
import Profile from "./pages-gy/Profile";
import SignUp from "./pages-gy/SignUp";
import SignIn from "./pages-gy/SignIn";
import Main from "./components-gy/layouts/Main";
import MyCalendar from './pages-gy/MyCalendar'
// import "antd/dist/antd.css";
import 'antd/dist/antd.min.css'
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import AddUserForm from "./pages-gy/AddUserForm";
import History from "./pages-gy/History";
import Contacts from "./pages-gy/Contacts";
function App() {
  return (
      <div className="App">
        <Switch>
          <Route path="/sign-up" exact component={SignUp} />
          <Route path="/sign-in" exact component={SignIn} />
          <Main>
            <Route exact path="/dashboard" component={Home} />
            <Route exact path="/calendar" component={MyCalendar} />
            <Route exact path="/rdv" component={Tables} />
            <Route exact path="/history" component={History} />
            <Route exact path="/contact" component={Contacts} />
            <Route exact path="/billing" component={Billing} />
            <Route exact path="/rtl" component={Rtl} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/add-user" component={AddUserForm} />
            <Redirect from="*" to="/dashboard" />
          </Main>
        </Switch>
      </div>
  );
}

export default App;
