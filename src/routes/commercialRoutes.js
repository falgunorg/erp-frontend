import React from "react";
import PrivateRoute from "./PrivateRoute";

// get components

import Lcs from "../pages/commercial/lcs/Lcs";
import CreateLc from "../pages/commercial/lcs/CreateLc";
import EditLc from "../pages/commercial/lcs/EditLc";
import LcDetails from "../pages/commercial/lcs/LcDetails";

import Hscodes from "../pages/commercial/hscodes/Hscodes";
import CreateHscode from "../pages/commercial/hscodes/CreateHscode";

import Contracts from "pages/commercial/contracts/Contracts";
import CreateContracts from "pages/commercial/contracts/CreateContracts";
import EditContracts from "pages/commercial/contracts/EditContracts";
import ContractDetails from "pages/commercial/contracts/ContractDetails";

// Commercial Invoices
import CommercialInvoices from "pages/commercial/invoices/CommercialInvoices";
import CommercialInvoiceCreate from "pages/commercial/invoices/CommercialInvoiceCreate";
import CommercialInvoiceDetails from "pages/commercial/invoices/CommercialInvoiceDetails";
import CommercialInvoiceEdit from "pages/commercial/invoices/CommercialInvoiceEdit";

const prefix = "/commercial";

const commercialRoutes = [
  <PrivateRoute exact path={`${prefix}/hscodes`} component={Hscodes} />,
  <PrivateRoute
    exact
    path={`${prefix}/hscodes-create`}
    component={CreateHscode}
  />,

  <PrivateRoute exact path={`${prefix}/contracts`} component={Contracts} />,
  <PrivateRoute
    exact
    path={`${prefix}/contracts/create`}
    component={CreateContracts}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/contracts/details/:id?`}
    component={ContractDetails}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/contracts/edit/:id?`}
    component={EditContracts}
  />,

  <PrivateRoute exact path={`${prefix}/lcs`} component={Lcs} />,
  <PrivateRoute exact path={`${prefix}/lcs-create`} component={CreateLc} />,
  <PrivateRoute exact path={`${prefix}/lcs-edit/:id?`} component={EditLc} />,
  <PrivateRoute exact path={`${prefix}/lcs-show/:id?`} component={LcDetails} />,

  <PrivateRoute
    exact
    path={`${prefix}/invoices`}
    component={CommercialInvoices}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/invoices-create`}
    component={CommercialInvoiceCreate}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/invoices-edit/:id?`}
    component={CommercialInvoiceEdit}
  />,
  <PrivateRoute
    exact
    path={`${prefix}/invoices-show/:id?`}
    component={CommercialInvoiceDetails}
  />,
];

export default commercialRoutes;
