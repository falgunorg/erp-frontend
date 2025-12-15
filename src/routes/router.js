//Auth module
import PrivateRoute from "routes/PrivateRoute";
import OpenRoute from "routes/OpenRoute";
import React, { Component } from "react";
import { BrowserRouter, Switch, Redirect } from "react-router-dom";
import accountsRoutes from "./accountsRoutes";
import administrationRoutes from "./administrationRoutes";
import adminRoutes from "./adminRoutes";
import auditRoutes from "./auditRoutes";
import commercialRoutes from "./commercialRoutes";
import cnfRoutes from "./cnfRoutes";
import cuttingRoutes from "./cuttingRoutes";
import developmentRoutes from "./developmentRoutes";
import electricRoutes from "./electricRoutes";
import embroideryRoutes from "./embroideryRoutes";
import finishingRoutes from "./finishingRoutes";
import hrRoutes from "./hrRoutes";
import itRoutes from "./itRoutes";
import maintenanceRoutes from "./maintenanceRoutes";
import managementRoutes from "./managementRoutes";
import marketingRoutes from "./marketingRoutes";
import merchandisingRoutes from "./merchandisingRoutes";
import planningRoutes from "./planningRoutes";
import productionRoutes from "./productionRoutes";
import purchaseRoutes from "./purchaseRoutes";
import sampleRoutes from "./sampleRoutes";
import sewingRoutes from "./sewingRoutes";
import storeRoutes from "./storeRoutes";
import substoreRoutes from "./substoreRoutes";
import washingRoutes from "./washingRoutes";

// Leaves and Attendance Area

// AUTH
import Login from "pages/auth/Login";
import Chat from "../pages/chat/Chat";
import Profile from "pages/auth/Profile";
// Dashboard
import Dashboard from "pages/Dashboard";
// {External}
import Mailbox from "../pages/mail/Mailbox";
import Schedules from "../pages/schedule/Schedules";
import Tasks from "../pages/Tasks";
import Filemanager from "../pages/files/Filemanager";
//Parcels
import Parcels from "../pages/parcels/Parcels";
import CreateParcel from "../pages/parcels/CreateParcel";
import ParcelDetails from "../pages/parcels/ParcelDetails";
import Leaves from "pages/leaves/Leaves";
import TimeAndActions from "../pages/merchandising/tna/TimeAndActions";

function OpenRoutes() {
  return (
    <BrowserRouter>
      <Switch>
        <OpenRoute exact path="/login" component={Login}></OpenRoute>
        <Redirect path="*" to="/login" />
      </Switch>
    </BrowserRouter>
  );
}

class PrivateRoutes extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <PrivateRoute
            exact
            path="/dashboard"
            component={Dashboard}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/profile"
            component={Profile}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/mailbox/:id?"
            component={Mailbox}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/schedules"
            component={Schedules}
          ></PrivateRoute>
          <PrivateRoute exact path="/tasks" component={Tasks}></PrivateRoute>
          <PrivateRoute
            exact
            path="/files"
            component={Filemanager}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/parcels"
            component={Parcels}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/parcels-issue"
            component={CreateParcel}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/parcels-details/:tracking_number?"
            component={ParcelDetails}
          ></PrivateRoute>
          <PrivateRoute exact path="/leaves" component={Leaves}></PrivateRoute>
          {accountsRoutes}
          {administrationRoutes}
          {adminRoutes}
          {auditRoutes}
          {commercialRoutes}
          {cnfRoutes}
          {cuttingRoutes}
          {developmentRoutes}
          {electricRoutes}
          {embroideryRoutes}
          {finishingRoutes}
          {hrRoutes}
          {itRoutes}
          {maintenanceRoutes}
          {managementRoutes}
          {marketingRoutes}
          {merchandisingRoutes}
          {planningRoutes}
          {productionRoutes}
          {purchaseRoutes}
          {sampleRoutes}
          {sewingRoutes}
          {storeRoutes}
          {substoreRoutes}
          {washingRoutes}
          {/* end store routes */}

          <PrivateRoute
            exact
            path="/time-and-actions"
            component={TimeAndActions}
          ></PrivateRoute>

          <Redirect path="*" to="/dashboard" />
        </Switch>
      </BrowserRouter>
    );
  }
}

export { OpenRoutes, PrivateRoutes };
