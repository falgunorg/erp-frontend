import React from "react";
import PrivateRoute from "./PrivateRoute";

// Requisition ROUTES
import Requisitions from "../pages/substores/requisitions/Requisitions";
import RequisitionsSpecial from "../pages/substores/requisitions/RequisitionsSpecial";
import CreateRequisition from "../pages/substores/requisitions/CreateRequisition";
import CreateQuickRequisition from "../pages/substores/requisitions/CreateQuickRequisition";
import EditRequisition from "../pages/substores/requisitions/EditRequisition";
import RequisitionDetails from "../pages/substores/requisitions/RequisitionDetails";
import ReviseRequisition from "../pages/substores/requisitions/ReviseRequisition";
import PendingRequisitions from "../pages/substores/requisitions/PendingRequisitions";

// SubStore routes
import SubStore from "../pages/substores/SubStore";
import SpecialSubstore from "../pages/substores/SpecialSubstore";
import SubStoreReport from "../pages/substores/SubStoreReport";
import SubStoreReceive from "../pages/substores/SubStoreReceive";
import SubStorePendingReceive from "../pages/substores/SubStorePendingReceive";
import SubStoreDetails from "../pages/substores/SubStoreDetails";
import OpenSubstore from "../pages/substores/OpenSubstore";
import SubStoreReceiveReport from "../pages/substores/SubStoreReceiveReport";
import SubStoreIssueReport from "../pages/substores/SubStoreIssueReport";
import Parts from "../pages/substores/Parts";

const prefix = "/substore";

const substoreRoutes = [
  
  <PrivateRoute
    exact
    path={`${prefix}/requisitions`}
    component={Requisitions}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/requisitions/special/:company_id`}
    component={RequisitionsSpecial}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/requisitions-create`}
    component={CreateRequisition}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/requisitions-create-quick`}
    component={CreateQuickRequisition}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/requisitions-edit/:id?`}
    component={EditRequisition}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/requisitions-revise/:id?`}
    component={ReviseRequisition}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/requisitions-details/:id?`}
    component={RequisitionDetails}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/requisitions-pending`}
    component={PendingRequisitions}
  />,

  <PrivateRoute
    exact
    path={`${prefix}/sub-stores/:type?`}
    component={SubStore}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/sub-stores/special/:company_id`}
    component={SpecialSubstore}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/sub-stores-pending-receive`}
    component={SubStorePendingReceive}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/sub-stores-receive/:requisition_id?`}
    component={SubStoreReceive}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/sub-stores-details/:id?`}
    component={SubStoreDetails}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/open-substore`}
    component={OpenSubstore}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/substores-report`}
    component={SubStoreReport}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/substores-receive-report`}
    component={SubStoreReceiveReport}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/substores-issue-report`}
    component={SubStoreIssueReport}
  />,

  <PrivateRoute exact path={`${prefix}/parts`} component={Parts} />,
];

export default substoreRoutes;
