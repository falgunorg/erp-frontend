import React, { useEffect, useState } from "react";

import MonthlyReport from "../../elements/leaves-parts/admin/MonthlyReport";
import YearlyReport from "../../elements/leaves-parts/admin/YearlyReport";
import api from "../../services/api";
import AdminLeavesAction from "../../elements/leaves-parts/admin/AdminLeavesAction";
import moment from "moment";

export default function AdminLeaves(props) {
  const [todayData, setTodayData] = useState([]);
  const [tomorrowData, setTomorrowData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await api.post("/hr/admin-leaves-summary");
      if (response.status === 200 && response.data) {
        setTodayData(response.data.data.today || []);
        setTomorrowData(response.data.data.tomorrow || []);
      }
    } catch (error) {
      console.error("Error fetching leave summary:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const [employees, setEmployees] = useState([]);
  const getEmployees = async (issue_type) => {
    var response = await api.post("/employees");
    if (response.status === 200 && response.data) {
      setEmployees(response.data.data);
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

  const [period, setPeriod] = useState("Monthly");
  const togglePeriod = (item) => {
    setPeriod(item);
  };

  return (
    <div className="leaves_page">
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="h-100 bg-white rounded p-3 box_shadow_card">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h4 className="mb-0">Today Leave</h4>
            </div>
            <hr />
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {todayData.length > 0 ? (
                  todayData.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {item.user_name} | {item.staff_id}
                      </td>
                      <td>{item.leave_type}</td>

                      <td>{moment(item.start_date).format("DD-MM-YYYY")}</td>
                      <td>{moment(item.end_date).format("DD-MM-YYYY")}</td>
                      <td>{item.total_days} Days</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
                      No leave records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="h-100 bg-white rounded p-3 box_shadow_card">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h4 className="mb-0">Tomorrow Leave</h4>
            </div>
            <hr />
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {tomorrowData.length > 0 ? (
                  tomorrowData.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {item.user_name} | {item.staff_id}
                      </td>
                      <td>{item.leave_type}</td>
                      <td>{moment(item.start_date).format("DD-MM-YYYY")}</td>
                      <td>{moment(item.end_date).format("DD-MM-YYYY")}</td>
                      <td>{item.total_days} Days</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
                      No leave records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="row g-4">
        <div className="pt-4">
          <AdminLeavesAction employees={employees} />
        </div>
      </div>
      <div className="row g-4">
        <div className="col-12">
          <div style={{ margin: "50px 0 15px" }} className="tab_area">
            <button
              onClick={() => togglePeriod("Monthly")}
              className={
                period === "Monthly"
                  ? "btn btn-sm btn-success me-2 uppercase"
                  : "btn btn-sm btn-default uppercase"
              }
            >
              Monthly
            </button>
            <button
              onClick={() => togglePeriod("Yearly")}
              className={
                period === "Yearly"
                  ? "btn btn-sm btn-success me-2 uppercase"
                  : "btn btn-sm btn-default uppercase"
              }
            >
              Yearly
            </button>
          </div>

          {period === "Monthly" && <MonthlyReport employees={employees} />}
          {period === "Yearly" && <YearlyReport employees={employees} />}
        </div>
      </div>
    </div>
  );
}
