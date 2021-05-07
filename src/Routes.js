import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./components/Login/Login";
import AdminHome from "./pages/AdminHome";
import AddMall from "./pages/AddMall";
import AdminMalls from './pages/AdminMalls';
import MallInfo from './pages/MallInfo';
import AddShop from "./pages/AddShop";
import AdminShopInfo from "./pages/AdminShopsInfo";

function Routes() {
  return (
    <div className="routes">
      <Router>
        <Switch>
          <Route path="/" exact>
            <LandingPage />
          </Route>
          <Route path="/admin-home" exact>
            <AdminHome />
          </Route>
          <Route path="/admin/add-mall" exact>
            <AddMall />
          </Route>
          <Route path="/admin/malls" exact>
            <AdminMalls />
          </Route>
          <Route path="/login" exact>
            <Login />
          </Route>
          <Route path="/admin/mall-info" exact>
            <MallInfo />
          </Route>
          <Route path="/admin/mall/add-shop" exact>
            <AddShop />
          </Route>
          <Route path="/admin/shop-info" exact>
            <AdminShopInfo />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default Routes;
