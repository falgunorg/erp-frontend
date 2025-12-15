import React from "react";
import PrivateRoute from "./PrivateRoute";
//get components
import Jobs from "pages/cnf/Jobs";
import JobDetails from "pages/cnf/JobDetails";

const prefix = "/cnf";
const cnfRoutes = [
  <PrivateRoute exact path={`${prefix}/jobs`} component={Jobs} />,
  <PrivateRoute
    exact
    path={`${prefix}/job-details/:jobId?`}
    component={JobDetails}
  />,
];

export default cnfRoutes;
