//Auth module
import PrivateRoute from "routes/PrivateRoute";
import OpenRoute from "routes/OpenRoute";
import React, { Component } from "react";
import { BrowserRouter, Switch, Redirect } from "react-router-dom";
// AUTH
import Login from "pages/auth/Login";
import Chat from "../pages/chat/Chat";

//Parcel

import Parcels from "../pages/parcels/Parcels";
import CreateParcel from "../pages/parcels/CreateParcel";
import ParcelDetails from "../pages/parcels/ParcelDetails";

import Dashboard from "pages/Dashboard";
import Mailbox from "../pages/mail/Mailbox";

import Schedules from "../pages/schedule/Schedules";
import Test from "../pages/Test";

// TERMS
import Terms from "../pages/terms/Terms";

// BUYERS
import Buyers from "../pages/buyers/Buyers";

// profile
import Profile from "pages/auth/Profile";

import Filemanager from "../pages/files/Filemanager";

// ROLE PERMISSION (SETTINGS)
import Roles from "pages/roles/Roles";
import CreateRoles from "pages/roles/CreateRoles";
import EditRoles from "pages/roles/EditRoles";

// EMPORT SETTINGS
import Settings from "../pages/settings/Settings";
import ImportList from "pages/settings/ImportList";
import Instructions from "../pages/settings/Instructions";
// SAMPLE TYPES
import SampleTypes from "../pages/samples/sample_types/SampleTypes";

// ****MERCHENDISING DEPARTMENT ROUTES START HERE ******

//Techpack

import Techpacks from "../pages/merchandising/techpacks/Techpacks";
import PurchaseContracts from "../pages/merchandising/purchase_contracts/PurchaseContracts";
import PurchaseContractDetails from "../pages/merchandising/purchase_contracts/PurchaseContractDetails";
// PURCHASE ORDER
import CreatePurchase from "../pages/merchandising/purchases/CreatePurchase";
import Purchases from "../pages/merchandising/purchases/Purchases";
import EditPurchase from "../pages/merchandising/purchases/EditPurchase";
import PurchaseDetails from "../pages/merchandising/purchases/PurchaseDetails";
// BOOKINGS
import CreateBooking from "../pages/merchandising/bookings/CreateBooking";
import CreateBookingAuto from "../pages/merchandising/bookings/CreateBookingAuto";
import Bookings from "../pages/merchandising/bookings/Bookings";
import EditBooking from "../pages/merchandising/bookings/EditBooking";
import BookingDetails from "../pages/merchandising/bookings/BookingDetails";
import BookingsOverview from "../pages/merchandising/bookings/BookingsOverview";

// SAMPLE ORDER REQUEST
import Sors from "../pages/merchandising/sor/Sors";
import CreateSor from "../pages/merchandising/sor/CreateSor";
import EditSor from "../pages/merchandising/sor/EditSor";
import SorDetails from "../pages/merchandising/sor/SorDetails";

// Costing
import Costings from "../pages/merchandising/costing/Costings";
import CreateCosting from "../pages/merchandising/costing/CreateCosting";
import EditCosting from "../pages/merchandising/costing/EditCosting";
import CostingDetails from "../pages/merchandising/costing/CostingDetails";

// BUDGET
import Budgets from "../pages/merchandising/budgets/Budgets";
import CreateBudget from "../pages/merchandising/budgets/CreateBudget";
import EditBudget from "../pages/merchandising/budgets/EditBudget";
import BudgetsDetails from "../pages/merchandising/budgets/BudgetDetails";

// PI
import Proformas from "../pages/merchandising/proformas/Proformas";
import CreateProforma from "../pages/merchandising/proformas/CreateProforma";
import CreateProformaAuto from "../pages/merchandising/proformas/CreateProformaAuto";
import EditProforma from "../pages/merchandising/proformas/EditProforma";
import ProformaDetails from "../pages/merchandising/proformas/ProformaDetails";
import ProformaOverview from "../pages/merchandising/proformas/ProformaOverview";

// ******** Development Department Routes Start Here ********
import Designs from "../pages/development/designs/Designs";
import DesignCreate from "../pages/development/designs/DesignCreate";
import DesignEdit from "../pages/development/designs/DesignEdit";
import DesignDetails from "../pages/development/designs/DesignDetails";
// Development ROUTES ENDS

// ****COMMERCIAL DEPARTMENT ROUTES START HERE ******
// LETTER OF CREDIT
import Lcs from "../pages/commercial/lcs/Lcs";
import CreateLc from "../pages/commercial/lcs/CreateLc";
import EditLc from "../pages/commercial/lcs/EditLc";
import LcDetails from "../pages/commercial/lcs/LcDetails";

import Hscodes from "../pages/commercial/hscodes/Hscodes";
import CreateHscode from "../pages/commercial/hscodes/CreateHscode";

// Finishing Department
// LEFTOVERS
import LeftOvers from "../pages/finishing/left-overs/LeftOvers";
import LeftOverDetails from "../pages/finishing/left-overs/LeftOverDetails";
import CreateLeftOver from "../pages/finishing/left-overs/CreateLeftOver";
import EditLeftOver from "../pages/finishing/left-overs/EditLeftOver";

import PackingLists from "../pages/finishing/packing-lists/PackingLists";
import CreatePackingList from "../pages/finishing/packing-lists/CreatePackingList";
import EditPackingList from "../pages/finishing/packing-lists/EditPackingList";
import PackingListDetails from "../pages/finishing/packing-lists/PackingListDetails";

// ****STORE DEPARTMENT ROUTES START HERE ******
// STORE

import Stores from "../pages/store/Store";
import StoreDetails from "../pages/store/StoreDetails";
import StoreSummary from "../pages/store/StoreSummary";

// RECEIVES
import Receives from "../pages/store/receives/Receives";
import ReceiveItem from "../pages/store/receives/ReceiveItem";

// RETURN TO STORE

import ReturnRequest from "../pages/store/return-request/ReturnRequest";

// ISSUES
import Issues from "../pages/store/issues/Issues";
import IssueItem from "../pages/store/issues/IssueItem";

// LEFTOVERS STORE
import LeftOverStores from "../pages/store/left-overs/LeftOverStores";
import CreateLeftOverStore from "../pages/store/left-overs/CreateLeftOverStore";
import LeftOverStoreDetails from "../pages/store/left-overs/LeftOverStoreDetails";

// ****SAMPLE DEPARTMENT ROUTES START HERE ******
import SampleSors from "../pages/samples/sor/SampleSors";
import SampleSorDetails from "../pages/samples/sor/SampleSorDetails";

//CONSUMPTIONS
import Consumptions from "../pages/samples/consumptions/Consumptions";
import CreateConsumption from "../pages/samples/consumptions/CreateConsumption";

// Sample Stores
import SampleStore from "../pages/samples/sample_store/SampleStore";
import SampleItemEntry from "../pages/samples/sample_store/SampleItemEntry";
import SampleItemEdit from "../pages/samples/sample_store/SampleItemEdit";

// Issue To Me and Return By Me

import IssuedToMe from "../pages/receive-return/IssuedToMe";
import ReturnByMe from "../pages/receive-return/ReturnByMe";

// Maintenance
import Machines from "../pages/maintenance/machines/Machines";
import MachineImport from "../pages/maintenance/machines/MachineImport";
import CreateMachine from "../pages/maintenance/machines/CreateMachine";
import EditMachine from "../pages/maintenance/machines/EditMachine";

// Admin Routes
import AdminSampleStore from "../pages/admin/sample-store/AdminSampleStore"; //sample store
import AdminSors from "../pages/admin/sors/AdminSors"; //sample order request
import AdminSorDetails from "../pages/admin/sors/AdminSorDetails"; //sample order details
import AdminDesigns from "../pages/admin/designs/AdminDesigns";
import AdminDesignDetails from "../pages/admin/designs/AdminDesignDetails";
import AdminBookings from "../pages/admin/bookings/AdminBookings";
import AdminBookingDetails from "../pages/admin/bookings/AdminBookingDetails";
import AdminPurchases from "../pages/admin/purchases/AdminPurchases";
import AdminPurchaseDetails from "../pages/admin/purchases/AdminPurchaseDetails";
import AdminStore from "../pages/admin/stores/AdminStore";
import AdminStoreDetails from "../pages/admin/stores/AdminStoreDetails";
import AdminIssues from "../pages/admin/stores/AdminIssues";
import AdminReceives from "../pages/admin/stores/AdminReceives";
import AdminLeftOverStores from "../pages/admin/stores/AdminLeftOverStores";
import AdminLeftOverStoreDetails from "../pages/admin/stores/AdminLeftOverStoreDetails";

//Requisition ROUTES HERE
import Requisitions from "../pages/substores/requisitions/Requisitions";
import RequisitionsSpecial from "../pages/substores/requisitions/RequisitionsSpecial";
import CreateRequisition from "../pages/substores/requisitions/CreateRequisition";
import CreateQuickRequisition from "../pages/substores/requisitions/CreateQuickRequisition";
import EditRequisition from "../pages/substores/requisitions/EditRequisition";
import RequisitionDetails from "../pages/substores/requisitions/RequisitionDetails";
import ReviseRequisition from "../pages/substores/requisitions/ReviseRequisition";
import PendingRequisitions from "../pages/substores/requisitions/PendingRequisitions";

//SubStore Soutes
import SubStore from "../pages/substores/SubStore";
import SpecialSubstore from "../pages/substores/SpecialSubstore";
import SubStoreReport from "../pages/substores/SubStoreReport";
import SubStoreReceive from "../pages/substores/SubStoreReceive";
import SubStorePendingReceive from "../pages/substores/SubStorePendingReceive";
import SubStoreDetails from "../pages/substores/SubStoreDetails";
import OpenSubstore from "../pages/substores/OpenSubstore";
import SubStoreReceiveReport from "../pages/substores/SubStoreReceiveReport";
import SubStoreIssueReport from "../pages/substores/SubStoreIssueReport";

//PART REQUEST (SUBSTORE REQUEST)
import PartRequests from "../pages/substores/part-request/PartRequests";
import CreatePartRequest from "../pages/substores/part-request/CreatePartRequest";
import EditPartRequest from "../pages/substores/part-request/EditPartRequest";
import RevisePartRequest from "../pages/substores/part-request/RevisePartRequest";

//Part
import Parts from "../pages/substores/Parts";

//POWER ROUTES
import Power from "../pages/power/Power";
//substore
import SubstoreSettings from "../pages/power/substore/SubstoreSettings";
import PowerSubstore from "../pages/power/substore/PowerSubstore";
import PowerRequisitions from "../pages/power/substore/PowerRequisitions";
import PowerEditRequisition from "../pages/power/substore/PowerEditRequisition";
import PowerParts from "../pages/power/substore/PowerParts";
import PowerReceives from "../pages/power/substore/PowerReceives";
import PowerIssues from "../pages/power/substore/PowerIssues";

// EMPLOYEES
import PowerEmployees from "../pages/power/employees/PowerEmployees";
import PowerCreateEmployee from "../pages/power/employees/PowerCreateEmployee";
import PowerEditEmployee from "../pages/power/employees/PowerEditEmployee";

// TEAMS
import PowerTeams from "../pages/power/teams/PowerTeams";
import PowerCreateTeam from "../pages/power/teams/PowerCreateTeam";
import PowerEditTeam from "../pages/power/teams/PowerEditTeam";

//SUPPLIERS
import PowerSuppliers from "../pages/power/suppliers/PowerSuppliers";
import PowerCreateSupplier from "../pages/power/suppliers/PowerCreateSupplier";
import PowerEditSupplier from "../pages/power/suppliers/PowerEditSupplier";

//Merchandising main
import PowerMerchandising from "../pages/power/merchandising/PowerMerchandising";
//PC/JOBS
import PowerPurchaseContracts from "../pages/power/merchandising/purchase_contracts/PowerPurchaseContracts";
import PowerPurchaseContractDetails from "../pages/power/merchandising/purchase_contracts/PowerPurchaseContractDetails";

//v1.1.0
import PurchaseOrders from "../pages/PurchaseOrders";
import WorkOrders from "../pages/WorkOrders";
import PurchaseContractsList from "../pages/PurchaseContractsList";
import Tasks from "../pages/Tasks";
import BookingManager from "../pages/BookingManager";
import TimeAndActions from "../pages/TimeAndActions";
import TechnicalPackage from "../pages/TechnicalPackage";
import CostSheets from "pages/CostSheets";
import BudgetSheets from "pages/BudgetSheets";

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
            path="/mailbox/:id?"
            component={Mailbox}
          ></PrivateRoute>
          {/* v-1.1.0 */}
          <PrivateRoute
            exact
            path="/purchase-orders/:id?"
            component={PurchaseOrders}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/work-orders/:id?"
            component={WorkOrders}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/purchase-contracts/:id?"
            component={PurchaseContractsList}
          ></PrivateRoute>
          <PrivateRoute exact path="/tasks" component={Tasks}></PrivateRoute>
          <PrivateRoute
            exact
            path="/booking-manager"
            component={BookingManager}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/time-and-actions"
            component={TimeAndActions}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/technical-package"
            component={TechnicalPackage}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/cost-sheets"
            component={CostSheets}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/budget-sheets"
            component={BudgetSheets}
          ></PrivateRoute>
          {/* end v-101.1 */}
          <PrivateRoute
            exact
            path="/schedules"
            component={Schedules}
          ></PrivateRoute>
          <PrivateRoute exact path="/test" component={Test}></PrivateRoute>
          {/* MERCHENDISING DEPT */}
          <PrivateRoute
            exact
            path="/merchandising/techpacks"
            component={Techpacks}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/merchandising/sors"
            component={Sors}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/merchandising/sors-edit/:id?"
            component={EditSor}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/merchandising/sors-details/:id?"
            component={SorDetails}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/merchandising/sors-create"
            component={CreateSor}
          ></PrivateRoute>
          {/* Costing area */}
          <PrivateRoute
            exact
            path="/merchandising/costings"
            component={Costings}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/merchandising/costings-edit/:id?"
            component={EditCosting}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/merchandising/costings-details/:id?"
            component={CostingDetails}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/merchandising/costings-create"
            component={CreateCosting}
          ></PrivateRoute>
          {/* BUDGETS AREA /FINAL BUDGET */}
          <PrivateRoute
            exact
            path="/merchandising/budgets"
            component={Budgets}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/merchandising/budgets-edit/:id?"
            component={EditBudget}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/merchandising/budgets-details/:id?"
            component={BudgetsDetails}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/merchandising/budgets-create"
            component={CreateBudget}
          ></PrivateRoute>
          {/* AUDIT BUDGET */}
          <PrivateRoute
            exact
            path="/audits/budgets"
            component={Budgets}
          ></PrivateRoute>
          {/* Accounts BUDGET */}
          <PrivateRoute
            exact
            path="/accounts/budgets"
            component={Budgets}
          ></PrivateRoute>
          {/* Management BUDGET */}
          <PrivateRoute
            exact
            path="/admin/budgets"
            component={Budgets}
          ></PrivateRoute>
          {/* PURCHASE CONTRACTS FOR MERCHANDISING,COMMERCIAL,PLANING */}
          <PrivateRoute
            exact
            path="/merchandising/purchase-contracts"
            component={PurchaseContracts}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/merchandising/purchase-contracts-details/:id?"
            component={PurchaseContractDetails}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/merchandising/purchases"
            component={Purchases}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/merchandising/purchases-create"
            component={CreatePurchase}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/merchandising/purchases-edit/:id?"
            component={EditPurchase}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/merchandising/purchases-details/:id?"
            component={PurchaseDetails}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/merchandising/bookings"
            component={Bookings}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/merchandising/bookings-create"
            component={CreateBooking}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/merchandising/auto-bookings-create/:supplier_id?/:budget_id?"
            component={CreateBookingAuto}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/merchandising/bookings-edit/:id?"
            component={EditBooking}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/merchandising/bookings-details/:id?"
            component={BookingDetails}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/merchandising/bookings-overview"
            component={BookingsOverview}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/store/store-summary"
            component={StoreSummary}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/merchandising/proformas"
            component={Proformas}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/merchandising/proformas-create"
            component={CreateProforma}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/merchandising/proformas-create-auto/:supplier_id?"
            component={CreateProformaAuto}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/merchandising/proformas-overview"
            component={ProformaOverview}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/merchandising/proformas-edit/:id?"
            component={EditProforma}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/merchandising/proformas-details/:id?"
            component={ProformaDetails}
          ></PrivateRoute>
          {/* AUDIT PROFORMA */}
          <PrivateRoute
            exact
            path="/audits/proformas"
            component={Proformas}
          ></PrivateRoute>
          {/* Accounts PROFORMA */}
          <PrivateRoute
            exact
            path="/accounts/proformas"
            component={Proformas}
          ></PrivateRoute>
          {/* Management PROFORMA */}
          <PrivateRoute
            exact
            path="/admin/proformas"
            component={Proformas}
          ></PrivateRoute>
          {/* Commercial PROFORMA */}
          <PrivateRoute
            exact
            path="/commercial/proformas"
            component={Proformas}
          ></PrivateRoute>
          {/* Development Dept */}
          <PrivateRoute
            exact
            path="/development/designs"
            component={Designs}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/development/designs-create"
            component={DesignCreate}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/development/designs-edit/:id?"
            component={DesignEdit}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/development/designs-details/:id?"
            component={DesignDetails}
          ></PrivateRoute>
          {/* COMMERCIAL DEPT */}
          {/* HSCODE */}
          <PrivateRoute
            exact
            path="/commercial/hscodes"
            component={Hscodes}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/commercial/hscodes-create"
            component={CreateHscode}
          ></PrivateRoute>
          {/* LC */}
          <PrivateRoute
            exact
            path="/commercial/lcs"
            component={Lcs}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/commercial/lcs-create"
            component={CreateLc}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/commercial/lcs-edit/:id?"
            component={EditLc}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/commercial/lcs-show/:id?"
            component={LcDetails}
          ></PrivateRoute>
          {/* Department of Finishing */}
          {/* LEFTOVERS */}
          <PrivateRoute
            exact
            path="/finishing/left-overs"
            component={LeftOvers}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/finishing/left-overs-create"
            component={CreateLeftOver}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/finishing/left-overs-edit/:id?"
            component={EditLeftOver}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/finishing/left-overs-details/:id?"
            component={LeftOverDetails}
          ></PrivateRoute>
          {/* PACKING LISTS */}
          <PrivateRoute
            exact
            path="/finishing/packing-lists"
            component={PackingLists}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/finishing/packing-lists-create"
            component={CreatePackingList}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/finishing/packing-lists-edit/:id?"
            component={EditPackingList}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/finishing/packing-lists-details/:id?"
            component={PackingListDetails}
          ></PrivateRoute>
          {/* STORE DEPT */}
          {/* STORES */}
          <PrivateRoute exact path="/stores" component={Stores}></PrivateRoute>
          <PrivateRoute
            exact
            path="/stores-details/:id?"
            component={StoreDetails}
          ></PrivateRoute>
          {/* STORE RECEIVE */}
          <PrivateRoute
            exact
            path="/store/receives"
            component={Receives}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/store/receives-create"
            component={ReceiveItem}
          ></PrivateRoute>
          {/* Return to store */}
          <PrivateRoute
            exact
            path="/store/returns"
            component={ReturnRequest}
          ></PrivateRoute>
          {/* STORE ISSUES */}
          <PrivateRoute
            exact
            path="/store/issues"
            component={Issues}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/store/issues-create"
            component={IssueItem}
          ></PrivateRoute>
          {/* RECEIVE RETURN ROUTES */}
          {/* CUTTING */}
          <PrivateRoute
            exact
            path="/cutting/receives"
            component={IssuedToMe}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/cutting/returns"
            component={ReturnByMe}
          ></PrivateRoute>
          {/* SEWING */}
          <PrivateRoute
            exact
            path="/sewing/receives"
            component={IssuedToMe}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/sewing/returns"
            component={ReturnByMe}
          ></PrivateRoute>
          {/* Embroidery */}
          <PrivateRoute
            exact
            path="/embroidery/receives"
            component={IssuedToMe}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/embroidery/returns"
            component={ReturnByMe}
          ></PrivateRoute>
          {/* Finishing */}
          <PrivateRoute
            exact
            path="/finishing/receives"
            component={IssuedToMe}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/finishing/returns"
            component={ReturnByMe}
          ></PrivateRoute>
          {/* Merchandising / Ass. Merchangdiser */}
          <PrivateRoute
            exact
            path="/merchandising/receives"
            component={IssuedToMe}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/merchandising/returns"
            component={ReturnByMe}
          ></PrivateRoute>
          {/* LEFTOVER STORE */}
          <PrivateRoute
            exact
            path="/store/left-overs"
            component={LeftOverStores}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/store/left-overs-details/:id?"
            component={LeftOverStoreDetails}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/store/left-overs-create"
            component={CreateLeftOverStore}
          ></PrivateRoute>
          {/* Maintenance  DEPT*/}
          <PrivateRoute
            exact
            path="/maintenance/machines"
            component={Machines}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/maintenance/machines-create"
            component={CreateMachine}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/maintenance/machines-edit/:id?"
            component={EditMachine}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/maintenance/machines-import"
            component={MachineImport}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/maintenance/machines-create-bulk"
            component={MachineImport}
          ></PrivateRoute>
          {/* SAMPLE DEPT */}
          <PrivateRoute
            exact
            path="/sample/consumptions"
            component={Consumptions}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/sample/consumptions-create/:techpack_id?"
            component={CreateConsumption}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/sample/sors"
            component={SampleSors}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/sample/sor-details/:id?"
            component={SampleSorDetails}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/sample/stores"
            component={SampleStore}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/sample/stores-create"
            component={SampleItemEntry}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/sample/stores-edit/:id?"
            component={SampleItemEdit}
          ></PrivateRoute>
          {/* SETTINGS */}
          <PrivateRoute
            exact
            path="/sors-types"
            component={SampleTypes}
          ></PrivateRoute>
          <PrivateRoute exact path="/buyers" component={Buyers}></PrivateRoute>
          <PrivateRoute exact path="/terms" component={Terms}></PrivateRoute>
          <PrivateRoute
            exact
            path="/files"
            component={Filemanager}
          ></PrivateRoute>
          <PrivateRoute exact path="/messages" component={Chat}></PrivateRoute>
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
          <PrivateRoute exact path="/roles" component={Roles}></PrivateRoute>
          <PrivateRoute
            exact
            path="/roles-create"
            component={CreateRoles}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/roles-edit/:id?"
            component={EditRoles}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/import-list"
            component={ImportList}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/settings"
            component={Settings}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/how-to-import"
            component={Instructions}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/profile"
            component={Profile}
          ></PrivateRoute>
          {/* Requisition Route here  */}
          <PrivateRoute
            exact
            path="/requisitions"
            component={Requisitions}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/requisitions/special/:company_id"
            component={RequisitionsSpecial}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/requisitions-create"
            component={CreateRequisition}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/requisitions-create-quick"
            component={CreateQuickRequisition}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/requisitions-edit/:id?"
            component={EditRequisition}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/requisitions-revise/:id?"
            component={ReviseRequisition}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/requisitions-details/:id?"
            component={RequisitionDetails}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/requisitions-pending"
            component={PendingRequisitions}
          ></PrivateRoute>
          {/* Substore routes */}
          <PrivateRoute
            exact
            path="/sub-stores/:type?"
            component={SubStore}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/sub-stores/special/:company_id"
            component={SpecialSubstore}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/sub-stores-pending-receive"
            component={SubStorePendingReceive}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/sub-stores-receive/:requisition_id?"
            component={SubStoreReceive}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/sub-stores-details/:id?"
            component={SubStoreDetails}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/open-substore"
            component={OpenSubstore}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/substores-report"
            component={SubStoreReport}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/substores-receive-report"
            component={SubStoreReceiveReport}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/substores-issue-report"
            component={SubStoreIssueReport}
          ></PrivateRoute>
          {/* Part Request */}
          <PrivateRoute exact path="/parts" component={Parts}></PrivateRoute>
          <PrivateRoute
            exact
            path="/part-requests"
            component={PartRequests}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/part-requests-create"
            component={CreatePartRequest}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/part-requests-edit/:id?"
            component={EditPartRequest}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/part-requests-revise/:id?"
            component={RevisePartRequest}
          ></PrivateRoute>
          {/* ADMIN ROUTES */}
          {/* POWER ROUTES */}
          {/* Power panel */}
          <PrivateRoute
            exact
            path="/empire/power"
            component={Power}
          ></PrivateRoute>
          //subtores
          <PrivateRoute
            exact
            path="/power/substore/settings"
            component={SubstoreSettings}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/power/substores"
            component={PowerSubstore}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/power/substores/requisitions"
            component={PowerRequisitions}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/power/substores/requisitions/edit/:id"
            component={PowerEditRequisition}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/power/substores/parts"
            component={PowerParts}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/power/substores/receives"
            component={PowerReceives}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/power/substores/issues"
            component={PowerIssues}
          ></PrivateRoute>
          //power employees
          <PrivateRoute
            exact
            path="/power/employees"
            component={PowerEmployees}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/power/employees-create"
            component={PowerCreateEmployee}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/power/employees-edit/:id?"
            component={PowerEditEmployee}
          ></PrivateRoute>
          //Teams
          <PrivateRoute
            exact
            path="/power/teams"
            component={PowerTeams}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/power/teams-create"
            component={PowerCreateTeam}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/power/teams-edit/:id?"
            component={PowerEditTeam}
          ></PrivateRoute>
          {/* power suppliers */}
          <PrivateRoute
            exact
            path="/power/suppliers"
            component={PowerSuppliers}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/power/suppliers-create"
            component={PowerCreateSupplier}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/power/suppliers-edit/:id?"
            component={PowerEditSupplier}
          ></PrivateRoute>
          {/* MERCHANDISING */}
          <PrivateRoute
            exact
            path="/power/merchandising"
            component={PowerMerchandising}
          ></PrivateRoute>
          {/* PC/JOBS */}
          <PrivateRoute
            exact
            path="/power/merchandising/contracts"
            component={PowerPurchaseContracts}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/power/merchandising/contracts-details/:id?"
            component={PowerPurchaseContractDetails}
          ></PrivateRoute>
          {/* sample store */}
          <PrivateRoute
            exact
            path="/admin/sample-stores"
            component={AdminSampleStore}
          ></PrivateRoute>
          {/* SORS */}
          <PrivateRoute
            exact
            path="/admin/sors"
            component={AdminSors}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/admin/sors-details/:id?"
            component={AdminSorDetails}
          ></PrivateRoute>
          {/* DESIGN */}
          <PrivateRoute
            exact
            path="/admin/designs"
            component={AdminDesigns}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/admin/designs-details/:id?"
            component={AdminDesignDetails}
          ></PrivateRoute>
          {/* bookings */}
          <PrivateRoute
            exact
            path="/admin/bookings"
            component={AdminBookings}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/admin/bookings-details/:id?"
            component={AdminBookingDetails}
          ></PrivateRoute>
          {/* purchase Order */}
          <PrivateRoute
            exact
            path="/admin/purchases"
            component={AdminPurchases}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/admin/purchases-details/:id?"
            component={AdminPurchaseDetails}
          ></PrivateRoute>
          {/* Admin Store */}
          <PrivateRoute
            exact
            path="/admin/stores"
            component={AdminStore}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/admin/stores-details/:id?"
            component={AdminStoreDetails}
          ></PrivateRoute>
          {/* Admin Store Issues */}
          <PrivateRoute
            exact
            path="/admin/store-issues"
            component={AdminIssues}
          ></PrivateRoute>
          {/* Admin Store receives */}
          <PrivateRoute
            exact
            path="/admin/store-receives"
            component={AdminReceives}
          ></PrivateRoute>
          {/* Admin LeftOver */}
          <PrivateRoute
            exact
            path="/admin/store/left-overs"
            component={AdminLeftOverStores}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/admin/store/left-overs-details/:id?"
            component={AdminLeftOverStoreDetails}
          ></PrivateRoute>
          <Redirect path="*" to="/dashboard" />
        </Switch>
      </BrowserRouter>
    );
  }
}

export { OpenRoutes, PrivateRoutes };
