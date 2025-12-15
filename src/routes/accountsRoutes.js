import React from "react";
import PrivateRoute from "./PrivateRoute";

// get components

// Back to Back Bills
import BackToBackBills from "pages/accounts/backtobackbills/BackToBackBills";
import CreateBackToBackBill from "pages/accounts/backtobackbills/CreateBackToBackBill";

const prefix = "/accounts";

const accountsRoutes = [
  <PrivateRoute
    exact
    path={`${prefix}/bb-bills`}
    component={BackToBackBills}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/bb-bills-create`}
    component={CreateBackToBackBill}
  />,
];

export default accountsRoutes;
