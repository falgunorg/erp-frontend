import React from "react";
import { Link, useHistory } from "react-router-dom";

export default function Power(props) {
  const userInfo = props.userData;
  return (
    <div>
      {userInfo.userId === 1 ? (
        <div className="row g-4">
          <div className="col-sm-6 col-xl-3">
            <Link to="/power/substore/settings">
              <div className="bg-falgun-light rounded d-flex align-items-center justify-content-between p-3">
                <i className="fa fa-store fa-3x text-falgun"></i>
                <div className="ms-3">
                  <h4 className="mb-2">Sub-Stores</h4>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-sm-6 col-xl-3">
            <Link to="/power/employees">
              <div className="bg-falgun-light rounded d-flex align-items-center justify-content-between p-3">
                <i className="fa fa-users fa-3x text-falgun"></i>
                <div className="ms-3">
                  <h4 className="mb-2">Employees</h4>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-sm-6 col-xl-3">
            <Link to="/power/teams">
              <div className="bg-falgun-light rounded d-flex align-items-center justify-content-between p-3">
                <i className="fa fa-users fa-3x text-falgun"></i>
                <div className="ms-3">
                  <h4 className="mb-2">Teams</h4>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-sm-6 col-xl-3">
            <Link to="/power/suppliers">
              <div className="bg-falgun-light rounded d-flex align-items-center justify-content-between p-3">
                <i className="fa fa-users fa-3x text-falgun"></i>
                <div className="ms-3">
                  <h4 className="mb-2">Suppliers</h4>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-sm-6 col-xl-3">
            <Link to="/power/merchandising">
              <div className="bg-falgun-light rounded d-flex align-items-center justify-content-between p-3">
                <i className="fa fa-users fa-3x text-falgun"></i>
                <div className="ms-3">
                  <h4 className="mb-2">Merchandising</h4>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="bg-modiste-blue-light rounded d-flex align-items-center justify-content-between p-3">
              <i className="fa fa-chart-pie fa-3x text-falgun"></i>
              <div className="ms-3">
                <p className="mb-2">Total Revenue</p>
                <h6 className="mb-0">$1234</h6>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h1 className="text-uppercase text-danger">
          You are on wrong place baby! Beware of dogs.
        </h1>
      )}
    </div>
  );
}
