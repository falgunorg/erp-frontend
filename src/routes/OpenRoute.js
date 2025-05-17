import React from "react";
import { Route } from "react-router-dom";
import FullLayout from "layouts/FullLayout";

const OpenRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest}>
      <FullLayout>{React.createElement(component, rest)}</FullLayout>
    </Route>
  );
};

export default OpenRoute;
