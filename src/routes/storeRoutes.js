import React from "react";
import PrivateRoute from "./PrivateRoute";

import StoreDashboard from "pages/store/StoreDashboard";
import ReceiveItem from "../pages/store/receives/ReceiveItem";
import Grns from "../pages/store/receives/Grns";
import GrnReport from "pages/store/receives/GrnReport";
import StockReport from "pages/store/StockReport";

import Stores from "../pages/store/Store";
import StoreDetails from "../pages/store/StoreDetails";
import StoreSummary from "../pages/store/StoreSummary";

// RECEIVES
import Receives from "../pages/store/receives/Grns";

// ISSUES
import Issues from "../pages/store/issues/Issues";
import IssueItem from "../pages/store/issues/IssueItem";
import IssueReport from "../pages/store/issues/IssueReport";

// RETURNS
import ReturnRequest from "../pages/store/return-request/ReturnRequest";

// LEFT OVER STORE
import LeftOverStores from "../pages/store/left-overs/LeftOverStores";
import CreateLeftOverStore from "../pages/store/left-overs/CreateLeftOverStore";
import LeftOverStoreDetails from "../pages/store/left-overs/LeftOverStoreDetails";

const prefix = "/store";

const storeRoutes = [
  <PrivateRoute
    exact
    path={`${prefix}/dashboard`}
    component={StoreDashboard}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/stock/report`}
    component={StockReport}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/receives-create`}
    component={ReceiveItem}
  />,
  <PrivateRoute exact path={`${prefix}/receives`} component={Grns} />,
  <PrivateRoute
    exact
    path={`${prefix}/receives/report`}
    component={GrnReport}
  />,

  <PrivateRoute
    exact
    path={`${prefix}/store-summary`}
    component={StoreSummary}
  />,

  <PrivateRoute exact path="/stores" component={Stores} />,
  <PrivateRoute exact path="/stores-details/:id?" component={StoreDetails} />,

  <PrivateRoute exact path={`${prefix}/receives`} component={Receives} />,

  <PrivateRoute exact path={`${prefix}/returns`} component={ReturnRequest} />,

  <PrivateRoute exact path={`${prefix}/issues`} component={Issues} />,
  <PrivateRoute exact path={`${prefix}/issues-create`} component={IssueItem} />,
  <PrivateRoute
    exact
    path={`${prefix}/issue/report`}
    component={IssueReport}
  />,

  <PrivateRoute
    exact
    path={`${prefix}/left-overs`}
    component={LeftOverStores}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/left-overs-details/:id?`}
    component={LeftOverStoreDetails}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/left-overs-create`}
    component={CreateLeftOverStore}
  />,
];

export default storeRoutes;
