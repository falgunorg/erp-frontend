import React, { useState, useEffect } from "react";
import Pagination from "../Pagination";
import api from "../../services/api";
import moment from "moment";
import { Link } from "react-router-dom";
export default function LeaveActions(props) {
  const userInfo = props.userData;
  const [currentPage, setCurrentPage] = useState(1);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [total, setTotal] = useState(0);
  const [links, setLinks] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [filterData, setFilterData] = useState({
    from_date: "",
    to_date: "",
    leave_type: "",
    status: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    // Input validation for date fields
    if (
      name === "from_date" &&
      filterData.to_date &&
      value > filterData.to_date
    ) {
      setValidationErrors({
        from_date: "From date cannot be later than To date.",
      });
      return;
    }
    if (
      name === "to_date" &&
      filterData.from_date &&
      value < filterData.from_date
    ) {
      setValidationErrors({
        to_date: "To date cannot be earlier than From date.",
      });
      return;
    }

    setFilterData({ ...filterData, [name]: value });
    setValidationErrors({});
  };

  const resetFilters = () => {
    setFilterData({
      from_date: "",
      to_date: "",
      leave_type: "",
      status: "",
    });
    setValidationErrors({});
  };

  const getLeaves = async () => {
    try {
      const response = await api.post("/hr/leaves-actions", {
        page: currentPage,
        department: userInfo.department_title,
        designation: userInfo.designation_title,
        from_date: filterData.from_date,
        to_date: filterData.to_date,
        leave_type: filterData.leave_type,
        status: filterData.status,
      });
      if (response.status === 200 && response.data) {
        const { data, links, from, to, total } = response.data.leaves;
        setLeaves(data);
        setLinks(links);
        setFrom(from);
        setTo(to);
        setTotal(total);
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  useEffect(() => {
    getLeaves();
  }, [currentPage, filterData, userInfo]);

  const toogleLeave = async (id, status) => {
    if (window.confirm("Are you sure you want to change this leave?")) {
      try {
        const response = await api.post("/hr/leaves-toggle", { id, status });
        if (response.status === 200) {
          getLeaves();
        }
      } catch (error) {
        console.error("Error toggling leave:", error);
      }
    }
  };

  const renderActionButton = (item) => {
    if (item.status === "Pending") {
      return (
        <button
          onClick={() => toogleLeave(item.id, "Recommended")}
          className="btn btn-sm btn-info me-1"
        >
          Recommend
        </button>
      );
    }
    if (item.status === "Recommended") {
      return (
        <button
          onClick={() => toogleLeave(item.id, "Approved")}
          className="btn btn-sm btn-success me-1"
        >
          Approve
        </button>
      );
    }
    return null;
  };

  return (
    <div className="h-100 bg-white rounded p-3 box_shadow_card">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h4 className="mb-0">To Do</h4>
        <div className="d-flex">
          <input
            type="date"
            name="from_date"
            value={filterData.from_date}
            onChange={handleFilterChange}
            className="me-2"
            aria-label="From Date"
          />
          <input
            type="date"
            name="to_date"
            value={filterData.to_date}
            onChange={handleFilterChange}
            className="me-2"
            aria-label="To Date"
          />
          <select
            name="leave_type"
            value={filterData.leave_type}
            onChange={handleFilterChange}
            className="me-2"
          >
            <option value="">Type</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Earn Leave">Earn Leave</option>
            <option value="Maternity Leave">Maternity Leave</option>
          </select>
          <select
            name="status"
            value={filterData.status}
            onChange={handleFilterChange}
            className="me-2"
          >
            <option value="">Status</option>
            <option value="Pending">Pending</option>
            <option value="Recommended">Recommended</option>
            <option value="Approved">Approved</option>
          </select>
          <button onClick={resetFilters} className="btn btn-warning btn-sm">
            <i className="fa fa-retweet"></i>
          </button>
        </div>
      </div>
      <hr />
      <table className="table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>ID</th>
            <th>Department</th>
            <th>Start</th>
            <th>End</th>
            <th>Duration</th>
            <th>Type</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Recommended By</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaves.length > 0 ? (
            leaves.map((item) => (
              <tr key={item.id}>
                <td>{item.user_name}</td>
                <td>{item.user_staff_id}</td>
                <td>{item.user_department}</td>
                <td>{moment(item.start_date).format("DD-MM-YYYY")}</td>
                <td>{moment(item.end_date).format("DD-MM-YYYY")}</td>
                <td>{item.total_days} Days</td>
                <td>{item.leave_type}</td>
                <td>{item.reason}</td>
                <td className={item.status}>{item.status}</td>
                <td>{item.recommanded_by_name}</td>
                <td>
                  {renderActionButton(item)}
                  <button
                    onClick={() => toogleLeave(item.id, "Rejected")}
                    className="btn btn-sm btn-danger"
                  >
                    Reject
                  </button>
                </td>
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
      <h6 className="text-center">
        Showing {from} to {to} of {total}
      </h6>
      <Pagination
        links={links}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
}
