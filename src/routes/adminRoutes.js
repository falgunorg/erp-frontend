import React from "react";
import PrivateRoute from "./PrivateRoute";

/* ================= ROLE & PERMISSION ================= */
import RolePermissionManager from "pages/admin/role-permissions/RolePermissionManager";

/* ================= EMPLOYEES ================= */
import Employees from "pages/admin/employees/Employees";
import CreateEmployee from "pages/admin/employees/CreateEmployee";
import EditEmployee from "pages/admin/employees/EditEmployee";

/* ================= TEAMS ================= */
import Teams from "pages/admin/teams/Teams";
import CreateTeam from "pages/admin/teams/CreateTeam";
import EditTeam from "pages/admin/teams/EditTeam";

/* ================= SUPPLIERS ================= */
import Suppliers from "pages/admin/suppliers/Suppliers";
import CreateSupplier from "pages/admin/suppliers/CreateSupplier";
import EditSupplier from "pages/admin/suppliers/EditSupplier";

/* ================= BUYERS ================= */
import Buyers from "pages/admin/buyers/Buyers";

/* ================= TERMS ================= */
import Terms from "pages/terms/Terms";

/* ================= SAMPLE STORE ================= */
import AdminSampleStore from "pages/admin/sample-store/AdminSampleStore";
import SampleTypes from "pages/samples/sample_types/SampleTypes";

/* ================= SORS ================= */
import AdminSors from "pages/admin/sors/AdminSors";
import AdminSorDetails from "pages/admin/sors/AdminSorDetails";

/* ================= DESIGNS ================= */
import AdminDesigns from "pages/admin/designs/AdminDesigns";
import AdminDesignDetails from "pages/admin/designs/AdminDesignDetails";

/* ================= MERCHANDISING ================= */
import AdminBookings from "pages/admin/merchandising/bookings/AdminBookings";
import AdminBookingDetails from "pages/admin/merchandising/bookings/AdminBookingDetails";
import AdminPurchases from "pages/admin/merchandising/purchases/AdminPurchases";
import AdminPurchaseDetails from "pages/admin/merchandising/purchases/AdminPurchaseDetails";

/* ================= PURCHASE CONTRACTS ================= */
import AdminPurchaseContracts from "pages/admin/purchase_contracts/AdminPurchaseContracts";
import AdminPurchaseContractDetails from "pages/admin/purchase_contracts/AdminPurchaseContractDetails";

/* ================= STORES ================= */
import AdminStore from "pages/admin/stores/AdminStore";
import AdminStoreDetails from "pages/admin/stores/AdminStoreDetails";
import AdminIssues from "pages/admin/stores/AdminIssues";
import AdminReceives from "pages/admin/stores/AdminReceives";
import AdminLeftOverStores from "pages/admin/stores/AdminLeftOverStores";
import AdminLeftOverStoreDetails from "pages/admin/stores/AdminLeftOverStoreDetails";

/* ================= SUBSTORE ================= */
import AdminSubstore from "pages/admin/substore/AdminSubstore";
import AdminSubstoreSettings from "pages/admin/substore/AdminSubstoreSettings";
import AdminRequisitions from "pages/admin/substore/AdminRequisitions";
import AdminEditRequisition from "pages/admin/substore/AdminEditRequisition";
import AdminSubstoreParts from "pages/admin/substore/AdminSubstoreParts";
import AdminSubstoreReceives from "pages/admin/substore/AdminSubstoreReceives";
import AdminSubstoreIssues from "pages/admin/substore/AdminSubstoreIssues";

const prefix = "/admin";

const adminRoutes = [
  /* ================= ROLE ================= */
  <PrivateRoute
    key="role-management"
    exact
    path={`${prefix}/role-management`}
    component={RolePermissionManager}
  />,

  /* ================= EMPLOYEES ================= */
  <PrivateRoute
    key="employees"
    exact
    path={`${prefix}/employees`}
    component={Employees}
  />,
  <PrivateRoute
    key="employee-create"
    exact
    path={`${prefix}/employees/create`}
    component={CreateEmployee}
  />,
  <PrivateRoute
    key="employee-edit"
    exact
    path={`${prefix}/employees/edit/:id?`}
    component={EditEmployee}
  />,

  /* ================= TEAMS ================= */
  <PrivateRoute key="teams" exact path={`${prefix}/teams`} component={Teams} />,
  <PrivateRoute
    key="team-create"
    exact
    path={`${prefix}/teams/create`}
    component={CreateTeam}
  />,
  <PrivateRoute
    key="team-edit"
    exact
    path={`${prefix}/teams/edit/:id?`}
    component={EditTeam}
  />,

  /* ================= SUPPLIERS ================= */
  <PrivateRoute
    key="suppliers"
    exact
    path={`${prefix}/suppliers`}
    component={Suppliers}
  />,
  <PrivateRoute
    key="supplier-create"
    exact
    path={`${prefix}/suppliers/create`}
    component={CreateSupplier}
  />,
  <PrivateRoute
    key="supplier-edit"
    exact
    path={`${prefix}/suppliers/edit/:id?`}
    component={EditSupplier}
  />,

  /* ================= BUYERS ================= */
  <PrivateRoute
    key="buyers"
    exact
    path={`${prefix}/buyers`}
    component={Buyers}
  />,

  /* ================= TERMS ================= */
  <PrivateRoute key="terms" exact path={`${prefix}/terms`} component={Terms} />,

  /* ================= SAMPLE ================= */
  <PrivateRoute
    key="sample-store"
    exact
    path={`${prefix}/sample-stores`}
    component={AdminSampleStore}
  />,
  <PrivateRoute
    key="sample-types"
    exact
    path={`${prefix}/sample-types`}
    component={SampleTypes}
  />,

  /* ================= SORS ================= */
  <PrivateRoute
    key="sors"
    exact
    path={`${prefix}/sors`}
    component={AdminSors}
  />,
  <PrivateRoute
    key="sors-details"
    exact
    path={`${prefix}/sors-details/:id?`}
    component={AdminSorDetails}
  />,

  /* ================= DESIGNS ================= */
  <PrivateRoute
    key="designs"
    exact
    path={`${prefix}/designs`}
    component={AdminDesigns}
  />,
  <PrivateRoute
    key="design-details"
    exact
    path={`${prefix}/designs-details/:id?`}
    component={AdminDesignDetails}
  />,

  /* ================= MERCHANDISING ================= */
  <PrivateRoute
    key="bookings"
    exact
    path={`${prefix}/bookings`}
    component={AdminBookings}
  />,
  <PrivateRoute
    key="booking-details"
    exact
    path={`${prefix}/bookings-details/:id?`}
    component={AdminBookingDetails}
  />,
  <PrivateRoute
    key="purchases"
    exact
    path={`${prefix}/purchases`}
    component={AdminPurchases}
  />,
  <PrivateRoute
    key="purchase-details"
    exact
    path={`${prefix}/purchases-details/:id?`}
    component={AdminPurchaseDetails}
  />,

  /* ================= PURCHASE CONTRACTS ================= */
  <PrivateRoute
    key="purchase-contracts"
    exact
    path={`${prefix}/purchase-contracts`}
    component={AdminPurchaseContracts}
  />,
  <PrivateRoute
    key="purchase-contract-details"
    exact
    path={`${prefix}/purchase-contracts-details/:id?`}
    component={AdminPurchaseContractDetails}
  />,

  /* ================= STORES ================= */
  <PrivateRoute
    key="stores"
    exact
    path={`${prefix}/stores`}
    component={AdminStore}
  />,
  <PrivateRoute
    key="store-details"
    exact
    path={`${prefix}/stores-details/:id?`}
    component={AdminStoreDetails}
  />,
  <PrivateRoute
    key="store-issues"
    exact
    path={`${prefix}/store-issues`}
    component={AdminIssues}
  />,
  <PrivateRoute
    key="store-receives"
    exact
    path={`${prefix}/store-receives`}
    component={AdminReceives}
  />,
  <PrivateRoute
    key="left-overs"
    exact
    path={`${prefix}/store/left-overs`}
    component={AdminLeftOverStores}
  />,
  <PrivateRoute
    key="left-overs-details"
    exact
    path={`${prefix}/store/left-overs-details/:id?`}
    component={AdminLeftOverStoreDetails}
  />,

  /* ================= SUBSTORE ================= */
  <PrivateRoute
    key="substore"
    exact
    path={`${prefix}/substore`}
    component={AdminSubstore}
  />,
  <PrivateRoute
    key="substore-settings"
    exact
    path={`${prefix}/substore/settings`}
    component={AdminSubstoreSettings}
  />,
  <PrivateRoute
    key="substore-requisitions"
    exact
    path={`${prefix}/substore/requisitions`}
    component={AdminRequisitions}
  />,
  <PrivateRoute
    key="substore-requisition-edit"
    exact
    path={`${prefix}/substore/requisitions/edit/:id?`}
    component={AdminEditRequisition}
  />,
  <PrivateRoute
    key="substore-parts"
    exact
    path={`${prefix}/substore/parts`}
    component={AdminSubstoreParts}
  />,
  <PrivateRoute
    key="substore-receives"
    exact
    path={`${prefix}/substore/receives`}
    component={AdminSubstoreReceives}
  />,
  <PrivateRoute
    key="substore-issues"
    exact
    path={`${prefix}/substore/issues`}
    component={AdminSubstoreIssues}
  />,
];

export default adminRoutes;
