import React from "react";
import PrivateRoute from "./PrivateRoute";
//get components
import RolePermissionManager from "pages/admin/role-permissions/RolePermissionManager";

const prefix = "/admin";
const adminRoutes = [
  <PrivateRoute
    exact
    path={`${prefix}/role-permission`}
    component={RolePermissionManager}
  />,
];

export default adminRoutes;
