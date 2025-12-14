import React, { useEffect, useState } from "react";

import MyRequests from "../../elements/leaves-parts/MyRequests";
import LeaveActions from "../../elements/leaves-parts/LeaveActions";
import LeaveCalender from "../../elements/leaves-parts/LeaveCalender";
import LeaveSummary from "../../elements/leaves-parts/LeaveSummary";
import api from "../../services/api";
import { Link } from "react-router-dom";

export default function Leaves(props) {
  const userInfo = props.userData;
  const [overView, setOverView] = useState({});

  const getOverview = async () => {
    try {
      const response = await api.post("/hr/my-leaves-summary-overview");
      if (response.status === 200 && response.data) {
        setOverView(response.data.data || {});
      }
    } catch (error) {
      console.error("Error fetching leave summary:", error);
    }
  };

  useEffect(() => {
    getOverview();
  }, []);

  return (
    <div className="leaves_page">
      <div className="row g-4">
        <div className="col-sm-6 col-md-3 col-lg-3 ">
          <div className="bg-success rounded d-flex align-items-center justify-content-between p-3">
            <i className="fa fa-suitcase-rolling fa-3x text-white"></i>
            <div className="ms-3 text-white">
              <p className="mb-2">Leaves (This Month)</p>
              <h3 className="mb-0">{overView.leaves_this_month}</h3>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-md-3 col-lg-3 ">
          <div className="bg-info rounded d-flex align-items-center justify-content-between p-3">
            <i className="fa fa-suitcase-rolling fa-3x text-white"></i>
            <div className="ms-3">
              <p className="mb-2">Leaves (This year)</p>
              <h3 className="mb-0">{overView.leaves_this_year}</h3>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-md-3 col-lg-3 ">
          <div className="bg-warning rounded d-flex align-items-center justify-content-between p-3">
            <i className="fa fa-spinner fa-3x text-white"></i>
            <div className="ms-3 text-white">
              <p className="mb-2">Pending (This Month)</p>
              <h3 className="mb-0">{overView.pending_leaves_this_month}</h3>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-md-3 col-lg-3 ">
          <div className="bg-danger rounded d-flex align-items-center justify-content-between p-3">
            <i className="fa fa-ban fa-3x text-white"></i>
            <div className="ms-3 text-white">
              <p className="mb-2">Rejected (This Year)</p>
              <h3 className="mb-0">{overView.rejected_leaves_this_year}</h3>
            </div>
          </div>
        </div>

        {((userInfo.department_title === "Administration" &&
          userInfo.designation_title === "Manager") ||
          (userInfo.department_title === "HR" &&
            userInfo.designation_title === "Manager") ||
          (userInfo.department_title === "IT" &&
            userInfo.designation_title === "Programmer")) && (
          <div className="col-sm-6 col-xl-3">
            <Link
              style={{ width: "100%", display: "block" }}
              to="/hr/leaves"
            >
              <div className="bg-primary rounded d-flex align-items-center justify-content-between p-3">
                <i className="fa fa-cog fa-3x text-white"></i>
                <div className="ms-3 text-white">
                  <p className="mb-2">Admin Panel</p>
                  <h3 className="mb-0">Manage All</h3>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
      <div className="row">
        <div className="col-sm-12 col-md-6 col-xl-5 pt-4">
          <MyRequests {...props} />
        </div>
        <div className="col-sm-12 col-md-12 col-xl-7 pt-4">
          <LeaveActions {...props} />
        </div>
        <div className="col-sm-12 col-md-12 col-xl-8 pt-4">
          <LeaveCalender {...props} />
        </div>
        <div className="col-sm-12 col-md-12 col-xl-4 pt-4">
          <LeaveSummary {...props} />
        </div>
      </div>
    </div>
  );
}
