import React from "react";
import PrivateRoute from "./PrivateRoute";
//get components
import TechnicalPackages from "pages/merchandising/techpacks/TechnicalPackages";
import CostSheets from "pages/merchandising/costing/CostSheets";
import BudgetSheets from "pages/merchandising/budgets/BudgetSheets";
import PurchaseOrders from "pages/merchandising/purchases/PurchaseOrders";
import WorkOrders from "pages/merchandising/workorders/WorkOrders";
// bookings
import Bookings from "pages/merchandising/bookings/Bookings";
import CreateBookings from "pages/merchandising/bookings/CreateBookings";
import BookingDetails from "pages/merchandising/bookings/BookingDetails";
import EditBookings from "pages/merchandising/bookings/EditBookings";
import BookingForSupplier from "pages/merchandising/bookings/BookingForSupplier";
import BookingsOverview from "pages/merchandising/bookings/BookingsOverview";
import BookingManager from "pages/merchandising/bookings/BookingManager";

//pi
import Proformas from "../pages/merchandising/proformas/Proformas";
import CreateProforma from "../pages/merchandising/proformas/CreateProforma";
import CreateProformaAuto from "../pages/merchandising/proformas/CreateProformaAuto";
import EditProforma from "../pages/merchandising/proformas/EditProforma";
import ProformaDetails from "../pages/merchandising/proformas/ProformaDetails";
import ProformaOverview from "../pages/merchandising/proformas/ProformaOverview";


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

  <PrivateRoute exact path={`${prefix}/bookings`} component={Bookings} />,
  <PrivateRoute
    exact
    path={`${prefix}/create-booking/:wo_id?/:costing_item_id?`}
    component={CreateBookings}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/bookings/:id?`}
    component={BookingDetails}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/edit-bookings/:id?`}
    component={EditBookings}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/bookings-supplier-copy/:id?`}
    component={BookingForSupplier}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/bookings-overview`}
    component={BookingsOverview}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/bookings-manager/:id?`}
    component={BookingManager}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/proformas`}
    component={Proformas}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/proformas-create`}
    component={CreateProforma}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/proformas-create-auto/:supplier_id?`}
    component={CreateProformaAuto}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/proformas-overview`}
    component={ProformaOverview}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/proformas-edit/:id?`}
    component={EditProforma}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/proformas-details/:id?`}
    component={ProformaDetails}
  />,
];

export default merchandisingRoutes;
