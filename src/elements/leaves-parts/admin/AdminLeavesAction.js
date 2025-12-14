import React, { useState, useEffect } from "react";
import Pagination from "../../Pagination";
import api from "../../../services/api";
import Select from "react-select";
import moment from "moment";
import { Modal, Button } from "react-bootstrap";

export default function AdminLeavesAction({ employees, props }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [total, setTotal] = useState(0);
  const [links, setLinks] = useState([]);
  const [leaves, setLeaves] = useState([]);

  const [employeeId, setEmployeeId] = useState("");
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
    setEmployeeId("");
    setValidationErrors({});
  };

  const getLeaves = async () => {
    try {
      const response = await api.post("/hr/admin-leaves-actions", {
        page: currentPage,
        from_date: filterData.from_date,
        to_date: filterData.to_date,
        leave_type: filterData.leave_type,
        status: filterData.status,
        employee_id: employeeId,
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
  }, [currentPage, filterData, employeeId]);

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
        <>
          <button
            onClick={() => toogleLeave(item.id, "Recommended")}
            className="btn btn-sm btn-info me-1"
          >
            Recommend
          </button>
          <button
            onClick={() => toogleLeave(item.id, "Rejected")}
            className="btn btn-sm btn-danger"
          >
            Reject
          </button>
        </>
      );
    }
    if (item.status === "Recommended") {
      return (
        <>
          <button
            onClick={() => {
              setFormData(item);
              openModal();
            }}
            className="btn btn-sm btn-info me-1"
          >
            Change Leave Type
          </button>
          <button
            onClick={() => toogleLeave(item.id, "Approved")}
            className="btn btn-sm btn-success me-1"
          >
            Approve
          </button>
          <button
            onClick={() => toogleLeave(item.id, "Rejected")}
            className="btn btn-sm btn-danger"
          >
            Reject
          </button>
        </>
      );
    }
    return null;
  };

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    leave_type: "",
    total_days: "",
    reason: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setFormData({
      start_date: "",
      end_date: "",
      leave_type: "",
      total_days: "",
      reason: "",
    });
    setValidationErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    if (name === "start_date" || name === "end_date") {
      const { start_date, end_date } = {
        ...updatedFormData,
        [name]: value,
      };

      // Default validation for start_date and end_date
      if (start_date && end_date) {
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        // Check if start_date and end_date are in the same year
        if (startDate.getFullYear() !== endDate.getFullYear()) {
          updatedFormData.total_days = "";
          validationErrors.message =
            "Start and End dates must be in the same year.";
        } else {
          if (endDate >= startDate) {
            updatedFormData.total_days = Math.ceil(
              (endDate - startDate) / (1000 * 60 * 60 * 24) + 1
            );
          } else {
            updatedFormData.total_days = "";
          }
        }
      }

      // If the start and end dates are not in the same year, disable the end_date field
      if (start_date) {
        const startDate = new Date(start_date);
        const endDate = new Date(updatedFormData.end_date);

        if (
          updatedFormData.end_date &&
          startDate.getFullYear() !== endDate.getFullYear()
        ) {
          updatedFormData.end_date = ""; // Reset the end_date value if years don't match
        }
      }
    }

    setFormData(updatedFormData);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.start_date) errors.start_date = "Start date is required.";
    if (!formData.end_date) errors.end_date = "End date is required.";
    if (
      formData.start_date &&
      formData.end_date &&
      formData.end_date < formData.start_date
    ) {
      errors.end_date = "End date cannot be earlier than start date.";
    }
    if (!formData.leave_type) errors.leave_type = "Leave type is required.";
    if (!formData.reason) errors.reason = "Reason is required.";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const updateLeave = async (id) => {
    if (!validateForm()) return;

    const response = await api.post("/hr/leaves-type-update", {
      id: id,
      start_date: formData.start_date,
      end_date: formData.end_date,
      leave_type: formData.leave_type,
      total_days: formData.total_days,
      reason: formData.reason,
    });
    if (response.status === 200) {
      setFilterData({
        start_date: "",
        end_date: "",
        leave_type: "",
        total_days: "",
        reason: "",
      });
      closeModal();
      getLeaves();
    }
  };

  return (
    <div className="h-100 bg-white rounded p-3 box_shadow_card">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h4 className="mb-0">Leave Applications</h4>
        <div className="d-flex">
          <div className="me-2" style={{ minWidth: "250px" }}>
            <Select
              placeholder="Select Specific User"
              value={
                employees.find((item) => item.id === employeeId)
                  ? {
                      value: employeeId,
                      label:
                        employees.find((item) => item.id === employeeId)
                          .full_name || "",
                    }
                  : null
              }
              onChange={(selectedOption) => setEmployeeId(selectedOption.value)}
              name="employee_id"
              options={employees.map((item) => ({
                value: item.id,
                label: item.full_name,
              }))}
            />
          </div>
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
                <td className={item.status}>{item.status}</td>
                <td>{item.recommanded_by_name}</td>
                <td>{renderActionButton(item)}</td>
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

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Leave Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-6">
              <div className="form-group mb-3">
                <label>Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="form-control"
                  readOnly
                />
                {validationErrors.start_date && (
                  <small className="text-danger">
                    {validationErrors.start_date}
                  </small>
                )}
              </div>
            </div>
            <div className="col-6">
              <div className="form-group mb-3">
                <label>End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="form-control"
                  readOnly
                />
                {validationErrors.end_date && (
                  <small className="text-danger">
                    {validationErrors.end_date}
                  </small>
                )}
              </div>
            </div>
            <div className="col-6">
              <div className="form-group mb-3">
                <label>Leave Type</label>

                <select
                  name="leave_type"
                  value={formData.leave_type}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="">Type</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Earn Leave">Earn Leave</option>
                  <option value="Maternity Leave">Maternity Leave</option>
                </select>

                {validationErrors.leave_type && (
                  <small className="text-danger">
                    {validationErrors.leave_type}
                  </small>
                )}
              </div>
            </div>
            <div className="col-6">
              <div className="form-group mb-3">
                <label>Total Days</label>
                <input
                  type="number"
                  readOnly
                  name="total_days"
                  value={formData.total_days}
                  onChange={handleInputChange}
                  className="form-control"
                />
                {validationErrors.total_days && (
                  <small className="text-danger">
                    {validationErrors.total_days}
                  </small>
                )}
              </div>
            </div>
            <div className="col-12">
              <div className="form-group mb-3">
                <label>Reason</label>
                <textarea
                  readOnly
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="form-control"
                />
                {validationErrors.reason && (
                  <small className="text-danger">
                    {validationErrors.reason}
                  </small>
                )}
              </div>
            </div>

            {validationErrors.message && (
              <small className="text-danger">{validationErrors.message}</small>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={closeModal}>
            Close
          </Button>
          <Button variant="success" onClick={() => updateLeave(formData.id)}>
            Update Leave
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
