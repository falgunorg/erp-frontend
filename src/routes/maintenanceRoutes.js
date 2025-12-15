import React from "react";
import PrivateRoute from "./PrivateRoute";

import Machines from "../pages/maintenance/machines/Machines";
import MachineImport from "../pages/maintenance/machines/MachineImport";
import CreateMachine from "../pages/maintenance/machines/CreateMachine";
import EditMachine from "../pages/maintenance/machines/EditMachine";

const prefix = "/maintenance";

const maintenanceRoutes = [
  <PrivateRoute exact path={`${prefix}/machines`} component={Machines} />,
  <PrivateRoute
    exact
    path={`${prefix}/machines-create`}
    component={CreateMachine}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/machines-edit/:id?`}
    component={EditMachine}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/machines-import`}
    component={MachineImport}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/machines-create-bulk`}
    component={MachineImport}
  />,
];

export default maintenanceRoutes;
