import React from "react";
import PrivateRoute from "./PrivateRoute";
import AdminLeaves from "pages/leaves/AdminLeaves";
import Attendance from "pages/attendance/Attendance";
import CreateSalarySheet from "pages/attendance/CreateSalarySheet";
import Payrolls from "pages/payrolls/Payrolls";

const prefix = "/hr";

const hrRoutes = [
  <PrivateRoute exact path={`${prefix}/leaves`} component={AdminLeaves} />,

  <PrivateRoute exact path={`${prefix}/attendance`} component={Attendance} />,

  <PrivateRoute
    exact
    path={`${prefix}/salary-sheet/create`}
    component={CreateSalarySheet}
  />,

  <PrivateRoute exact path={`${prefix}/payrolls`} component={Payrolls} />,
];

export default hrRoutes;
