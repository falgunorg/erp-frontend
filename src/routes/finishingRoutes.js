import React from "react";
import PrivateRoute from "./PrivateRoute";

// get components
import LeftOvers from "../pages/finishing/left-overs/LeftOvers";
import LeftOverDetails from "../pages/finishing/left-overs/LeftOverDetails";
import CreateLeftOver from "../pages/finishing/left-overs/CreateLeftOver";
import EditLeftOver from "../pages/finishing/left-overs/EditLeftOver";

import PackingLists from "../pages/finishing/packing-lists/PackingLists";
import CreatePackingList from "../pages/finishing/packing-lists/CreatePackingList";
import EditPackingList from "../pages/finishing/packing-lists/EditPackingList";
import PackingListDetails from "../pages/finishing/packing-lists/PackingListDetails";

const prefix = "/finishing";

const finishingRoutes = [
  <PrivateRoute exact path={`${prefix}/left-overs`} component={LeftOvers} />,
  <PrivateRoute
    exact
    path={`${prefix}/left-overs-create`}
    component={CreateLeftOver}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/left-overs-edit/:id?`}
    component={EditLeftOver}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/left-overs-details/:id?`}
    component={LeftOverDetails}
  />,

  <PrivateRoute
    exact
    path={`${prefix}/packing-lists`}
    component={PackingLists}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/packing-lists-create`}
    component={CreatePackingList}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/packing-lists-edit/:id?`}
    component={EditPackingList}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/packing-lists-details/:id?`}
    component={PackingListDetails}
  />,
];

export default finishingRoutes;
