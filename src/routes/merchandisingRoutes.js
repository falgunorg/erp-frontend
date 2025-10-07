import React from "react";
import { PrivateRoute } from "./PrivateRoute";
import TechnicalPackages from "pages/TechnicalPackages";
import CostSheets from "pages/CostSheets";
import BudgetSheets from "pages/BudgetSheets";
import PurchaseOrders from "pages/PurchaseOrders";
import WorkOrders from "pages/WorkOrders";
import Bookings from "pages/merchandising/bookings/Bookings";
import BookingManager from "pages/BookingManager";

const prefix = "/merchandising";
const merchandisingRoutes = [
  <PrivateRoute
    exact
    path={`${prefix}/technical-packages/:id?`}
    component={TechnicalPackages}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/cost-sheets/:id?`}
    component={CostSheets}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/budget-sheets/:id?`}
    component={BudgetSheets}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/purchase-orders/:id?`}
    component={PurchaseOrders}
  />,

  <PrivateRoute
    exact
    path={`${prefix}/work-orders/:id?`}
    component={WorkOrders}
  />,
  <PrivateRoute exact path={`${prefix}/bookings/:id?`} component={Bookings} />,
  <PrivateRoute
    exact
    path={`${prefix}/bookings-manager/:id?`}
    component={BookingManager}
  />,

  <PrivateRoute
    exact
    path={`${prefix}/bookings-manager/:id?`}
    component={BookingManager}
  />,
];

export default merchandisingRoutes;
