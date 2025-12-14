import React from "react";
import PrivateRoute from "./PrivateRoute";
import RolePermissionManager from "pages/admin/role-permissions/RolePermissionManager";

const prefix = "/marketing";

const marketingRoutes = [
  <PrivateRoute
    exact
    path={`${prefix}/role-permission`}
    component={RolePermissionManager}
  />,
];

export default marketingRoutes;
