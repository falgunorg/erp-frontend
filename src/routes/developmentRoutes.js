import React from "react";
import PrivateRoute from "./PrivateRoute";

// get components

import Designs from "../pages/development/designs/Designs";
import DesignCreate from "../pages/development/designs/DesignCreate";
import DesignEdit from "../pages/development/designs/DesignEdit";
import DesignDetails from "../pages/development/designs/DesignDetails";

const prefix = "/development";

const developmentRoutes = [
  <PrivateRoute exact path={`${prefix}/designs`} component={Designs} />,
  <PrivateRoute
    exact
    path={`${prefix}/designs-create`}
    component={DesignCreate}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/designs-edit/:id?`}
    component={DesignEdit}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/designs-details/:id?`}
    component={DesignDetails}
  />,
];

export default developmentRoutes;
