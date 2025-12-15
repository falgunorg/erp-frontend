import React from "react";
import PrivateRoute from "./PrivateRoute";

// CONSUMPTIONS
import Consumptions from "../pages/samples/consumptions/Consumptions";
import CreateConsumption from "../pages/samples/consumptions/CreateConsumption";

const prefix = "/sample";

const sampleRoutes = [
  <PrivateRoute
    exact
    path={`${prefix}/consumptions`}
    component={Consumptions}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/consumptions-create/:techpack_id?`}
    component={CreateConsumption}
  />,
];

export default sampleRoutes;
