import React from "react";
import PrivateRoute from "./PrivateRoute";

// Admin Routes
import RolePermissionManager from "pages/admin/role-permissions/RolePermissionManager";
import AdminSampleStore from "../pages/admin/sample-store/AdminSampleStore";
import AdminSors from "../pages/admin/sors/AdminSors";
import AdminSorDetails from "../pages/admin/sors/AdminSorDetails";
import AdminDesigns from "../pages/admin/designs/AdminDesigns";
import AdminDesignDetails from "../pages/admin/designs/AdminDesignDetails";
import AdminBookings from "../pages/admin/merchandising/bookings/AdminBookings";
import AdminBookingDetails from "../pages/admin/merchandising/bookings/AdminBookingDetails";
import AdminPurchases from "../pages/admin/merchandising/purchases/AdminPurchases";
import AdminPurchaseDetails from "../pages/admin/merchandising/purchases/AdminPurchaseDetails";
import AdminStore from "../pages/admin/stores/AdminStore";
import AdminStoreDetails from "../pages/admin/stores/AdminStoreDetails";
import AdminIssues from "../pages/admin/stores/AdminIssues";
import AdminReceives from "../pages/admin/stores/AdminReceives";
import AdminLeftOverStores from "../pages/admin/stores/AdminLeftOverStores";
import AdminLeftOverStoreDetails from "../pages/admin/stores/AdminLeftOverStoreDetails";

// EMPLOYEES
import Employees from "../pages/admin/employees/Employees";
import CreateEmployee from "../pages/admin/employees/CreateEmployee";
import EditEmployee from "../pages/admin/employees/EditEmployee";

// TEAMS
import Teams from "../pages/admin/teams/Teams";
import CreateTeam from "../pages/admin/teams/CreateTeam";
import EditTeam from "../pages/admin/teams/EditTeam";

//SUPPLIERS
import Suppliers from "../pages/admin/suppliers/Suppliers";
import CreateSupplier from "../pages/admin/suppliers/CreateSupplier";
import EditSupplier from "../pages/admin/suppliers/EditSupplier";

//BUYERS

import Buyers from "pages/admin/buyers/Buyers";

//PC/JOBS
import AdminPurchaseContracts from "../pages/admin/purchase_contracts/AdminPurchaseContracts";
import AdminPurchaseContractDetails from "../pages/admin/purchase_contracts/AdminPurchaseContractDetails";
import AdminSubstoreSettings from "../pages/admin/substore/AdminSubstoreSettings";
import AdminSubstore from "../pages/admin/substore/AdminSubstore";
import AdminRequisitions from "../pages/admin/substore/AdminRequisitions";
import AdminEditRequisition from "../pages/admin/substore/AdminEditRequisition";
import AdminSubstoreParts from "../pages/admin/substore/AdminSubstoreParts";
import AdminSubstoreReceives from "../pages/admin/substore/AdminSubstoreReceives";
import AdminSubstoreIssues from "../pages/admin/substore/AdminSubstoreIssues";

import SampleTypes from "../pages/samples/sample_types/SampleTypes";
import Terms from "../pages/terms/Terms";

const prefix = "/admin";

const adminRoutes = [
  <PrivateRoute
    exact
    path={`${prefix}/role-management`}
    component={RolePermissionManager}
  />,

  <PrivateRoute exact path={`${prefix}/employees`} component={Employees} />,
  <PrivateRoute
    exact
    path={`${prefix}/employees/create`}
    component={CreateEmployee}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/employees/edit/:id?`}
    component={EditEmployee}
  />,
  //teams
  <PrivateRoute exact path={`${prefix}/teams`} component={Teams} />,
  <PrivateRoute exact path={`${prefix}/teams/create`} component={CreateTeam} />,
  <PrivateRoute
    exact
    path={`${prefix}/teams/edit/:id?`}
    component={EditTeam}
  />,

  <PrivateRoute exact path={`${prefix}/suppliers`} component={Suppliers} />,
  <PrivateRoute
    exact
    path={`${prefix}/suppliers/create`}
    component={CreateSupplier}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/suppliers/edit/:id?`}
    component={EditSupplier}
  />,

  <PrivateRoute exact path={`${prefix}/buyers`} component={Buyers} />,

  <PrivateRoute
    exact
    path={`${prefix}/sample-stores`}
    component={AdminSampleStore}
  />,
  <PrivateRoute exact path={`${prefix}/sors`} component={AdminSors} />,
  <PrivateRoute
    exact
    path={`${prefix}/sors-details/:id?`}
    component={AdminSorDetails}
  />,

  <PrivateRoute exact path={`${prefix}/designs`} component={AdminDesigns} />,
  <PrivateRoute
    exact
    path={`${prefix}/designs-details/:id?`}
    component={AdminDesignDetails}
  />,

  <PrivateRoute exact path={`${prefix}/bookings`} component={AdminBookings} />,
  <PrivateRoute
    exact
    path={`${prefix}/bookings-details/:id?`}
    component={AdminBookingDetails}
  />,

  <PrivateRoute
    exact
    path={`${prefix}/purchases`}
    component={AdminPurchases}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/purchases-details/:id?`}
    component={AdminPurchaseDetails}
  />,

  <PrivateRoute exact path={`${prefix}/stores`} component={AdminStore} />,
  <PrivateRoute
    exact
    path={`${prefix}/stores-details/:id?`}
    component={AdminStoreDetails}
  />,

  <PrivateRoute
    exact
    path={`${prefix}/store-issues`}
    component={AdminIssues}
  />,

  <PrivateRoute
    exact
    path={`${prefix}/store-receives`}
    component={AdminReceives}
  />,

  <PrivateRoute
    exact
    path={`${prefix}/store/left-overs`}
    component={AdminLeftOverStores}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/store/left-overs-details/:id?`}
    component={AdminLeftOverStoreDetails}
  />,
];

export default adminRoutes;
