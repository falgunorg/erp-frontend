import React, { Children, Component, Suspense } from "react";
import { Redirect, Route } from "react-router-dom";
import Spinner from "elements/Spinner";
import ChatLayout from "layouts/ChatLayout";

const ChatRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest}>
      <ChatLayout>{React.createElement(component, rest)}</ChatLayout>
    </Route>
  );
};

export default ChatRoute;
