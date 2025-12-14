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
import Leaves from "pages/leaves/Leaves";

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

// TERMS
import Terms from "../pages/terms/Terms";

// Administration

// BUYERS
import Buyers from "../pages/buyers/Buyers";

// EMPORT SETTINGS
import Settings from "../pages/settings/Settings";
import ImportList from "pages/settings/ImportList";
import Instructions from "../pages/settings/Instructions";
// SAMPLE TYPES
import SampleTypes from "../pages/samples/sample_types/SampleTypes";
// SAMPLE ORDER REQUEST
import Sors from "../pages/merchandising/sor/Sors";
import CreateSor from "../pages/merchandising/sor/CreateSor";
import EditSor from "../pages/merchandising/sor/EditSor";
import SorDetails from "../pages/merchandising/sor/SorDetails";
// ******** Development Department Routes Start Here ********
import Designs from "../pages/development/designs/Designs";
import DesignCreate from "../pages/development/designs/DesignCreate";
import DesignEdit from "../pages/development/designs/DesignEdit";
import DesignDetails from "../pages/development/designs/DesignDetails";
// Development ROUTES ENDS
// LEFTOVERS

// ****STORE DEPARTMENT ROUTES START HERE ******
// STORE

// RETURN TO STORE

import ReturnRequest from "../pages/store/return-request/ReturnRequest";

// LEFTOVERS STORE
import LeftOverStores from "../pages/store/left-overs/LeftOverStores";
import CreateLeftOverStore from "../pages/store/left-overs/CreateLeftOverStore";
import LeftOverStoreDetails from "../pages/store/left-overs/LeftOverStoreDetails";

//CONSUMPTIONS
import Consumptions from "../pages/samples/consumptions/Consumptions";
import CreateConsumption from "../pages/samples/consumptions/CreateConsumption";

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

// Store Routes

import PurchaseContractsList from "../pages/PurchaseContractsList";

import TimeAndActions from "../pages/merchandising/tna/TimeAndActions";
// CNF Phases
import Jobs from "pages/cnf/Jobs";
import JobDetails from "pages/cnf/JobDetails";
// Commercial Contract Phases

//Back to Back Bills
import BackToBackBills from "pages/accounts/backtobackbills/BackToBackBills";
import CreateBackToBackBill from "pages/accounts/backtobackbills/CreateBackToBackBill";


//role permission

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
            path="/purchase-contracts/:id?"
            component={PurchaseContractsList}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/time-and-actions"
            component={TimeAndActions}
          ></PrivateRoute>
          {/* end v-101.1 */}
          {/* MERCHENDISING DEPT */}
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
          {/* SETTINGS */}
          <PrivateRoute
            exact
            path="/sors-types"
            component={SampleTypes}
          ></PrivateRoute>
          <PrivateRoute exact path="/buyers" component={Buyers}></PrivateRoute>
          <PrivateRoute exact path="/terms" component={Terms}></PrivateRoute>
          <PrivateRoute exact path="/messages" component={Chat}></PrivateRoute>
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
          <PrivateRoute exact path="/cnf/jobs" component={Jobs}></PrivateRoute>
          <PrivateRoute
            exact
            path="/cnf/job-details/:jobId?"
            component={JobDetails}
          ></PrivateRoute>
          {/* LC */}
          //bbbills
          <PrivateRoute
            exact
            path="/accounts/bb-bills"
            component={BackToBackBills}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/accounts/bb-bills-create"
            component={CreateBackToBackBill}
          ></PrivateRoute>
          <Redirect path="*" to="/dashboard" />
        </Switch>
      </BrowserRouter>
    );
  }
}

export { OpenRoutes, PrivateRoutes };
