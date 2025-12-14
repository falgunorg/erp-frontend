import React from "react";
import PrivateRoute from "./PrivateRoute";
//get components
import RolePermissionManager from "pages/admin/role-permissions/RolePermissionManager";

const prefix = "/sewing";
const sewingRoutes = [
  <PrivateRoute
    exact
    path={`${prefix}/role-permission`}
    component={RolePermissionManager}
  />,
];

export default sewingRoutes;
