import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";

export default function PowerMerchandising() {
  const [spinner, setSpinner] = useState(false);
  // get all budgets
  const [report, setReport] = useState({});
  const getReport = async () => {
    setSpinner(true);
    var response = await api.post("/power/merchandising");
    if (response.status === 200 && response.data) {
      setReport(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getReport();
  }, []);
  return (
    <div className="row g-4 pt-4">
      <div className="col-sm-6 col-xl-2">
        <Link to="/power/merchandising/contracts">
          <div className="bg-falgun-light rounded d-flex align-items-center justify-content-between p-3">
            <i className="fa fa-list text-falgun"></i>
            <div className="ms-3">
              <h6 className="mb-2">PC/JOBS</h6>
              <h4 className="mb-2">{report.contracts}</h4>
            </div>
          </div>
        </Link>
      </div>
      <div className="col-sm-6 col-xl-2">
        <Link to="/power/merchandising/techpacks">
          <div className="bg-falgun-light rounded d-flex align-items-center justify-content-between p-3">
            <i className="fa fa-list text-falgun"></i>
            <div className="ms-3">
              <h6 className="mb-2">TECHPACKS</h6>
              <h4 className="mb-2">{report.techpacks}</h4>
            </div>
          </div>
        </Link>
      </div>
      <div className="col-sm-6 col-xl-2">
        <Link to="/power/merchandising/sors">
          <div className="bg-falgun-light rounded d-flex align-items-center justify-content-between p-3">
            <i className="fa fa-list text-falgun"></i>
            <div className="ms-3">
              <h6 className="mb-2">SOR</h6>
              <h4 className="mb-2">{report.sors}</h4>
            </div>
          </div>
        </Link>
      </div>
      <div className="col-sm-6 col-xl-3">
        <Link to="/power/merchandising/costings">
          <div className="bg-falgun-light rounded d-flex align-items-center justify-content-between p-3">
            <i className="fa fa-list text-falgun"></i>
            <div className="ms-3">
              <h6 className="mb-2">BOM & COSTING</h6>
              <h4 className="mb-2">{report.costings}</h4>
            </div>
          </div>
        </Link>
      </div>
      <div className="col-sm-6 col-xl-2">
        <Link to="/power/merchandising/purchases">
          <div className="bg-falgun-light rounded d-flex align-items-center justify-content-between p-3">
            <i className="fa fa-list text-falgun"></i>
            <div className="ms-3">
              <h6 className="mb-2">PO</h6>
              <h4 className="mb-2">{report.purchases}</h4>
            </div>
          </div>
        </Link>
      </div>
      <div className="col-sm-6 col-xl-2">
        <Link to="/power/merchandising/budgets">
          <div className="bg-falgun-light rounded d-flex align-items-center justify-content-between p-3">
            <i className="fa fa-list text-falgun"></i>
            <div className="ms-3">
              <h6 className="mb-2">BUDGETS</h6>
              <h4 className="mb-2">{report.budgets}</h4>
            </div>
          </div>
        </Link>
      </div>
      <div className="col-sm-6 col-xl-2">
        <Link to="/power/merchandising/bookings">
          <div className="bg-falgun-light rounded d-flex align-items-center justify-content-between p-3">
            <i className="fa fa-list text-falgun"></i>
            <div className="ms-3">
              <h6 className="mb-2">BOOKINGS</h6>
              <h4 className="mb-2">{report.bookings}</h4>
            </div>
          </div>
        </Link>
      </div>
      <div className="col-sm-6 col-xl-2">
        <Link to="/power/merchandising/proformas">
          <div className="bg-falgun-light rounded d-flex align-items-center justify-content-between p-3">
            <i className="fa fa-list text-falgun"></i>
            <div className="ms-3">
              <h6 className="mb-2">PI</h6>
              <h4 className="mb-2">{report.proformas}</h4>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
