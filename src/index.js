import React from "react";
import ReactDOM from "react-dom";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "services/msalConfig";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "quill/dist/quill.snow.css";
import "quill-better-table/dist/quill-better-table.css";

ReactDOM.render(
  <MsalProvider instance={msalInstance}>
    <App />
  </MsalProvider>,
  document.getElementById("root")
);
reportWebVitals();
