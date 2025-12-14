import React, { useState, useEffect } from "react";
import api from "../../services/api";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Link } from "react-router-dom";

const MonthlyPayrolls = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [companyId, setCompanyId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [spinner, setSpinner] = useState(false);
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.post("/common/departments");
        if (response.status === 200 && response.data) {
          setDepartments(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [month, year, companyId, department, status]);

  const fetchAttendance = async () => {
    try {
      setSpinner(true);
      const response = await api.post("/hr/get-payroll-monthly", {
        year,
        month,
        company_id: companyId,
        department,
        status,
      });
      if (response.status === 200 && response.data) {
        setAttendanceData(response.data.data || []);
      }
      setSpinner(false);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const filteredData = attendanceData.filter((item) =>
    item.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  const handlePrint = () => {};
  const handleDownloadPDF = () => {};

  return (
    <div className="container bg-white rounded p-1 box_shadow_card">
      <h6>
        <strong>Monthly Payroll</strong>
      </h6>
      <div className="d-inline justify-content-start align-items-center gap-3">
        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <select
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value, 10))}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <select
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
        >
          <option value="">All</option>
          <option value="1">JMS</option>
          <option value="2">MCL</option>
          <option value="3">MBL</option>
          <option value="4">H/O</option>
        </select>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">Department</option>
          {departments.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <input
          type="search"
          className="me-2"
          value={searchValue}
          style={{ maxWidth: "100px", fontSize: "12px" }}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        {!spinner && (
          <>
            <button
              onClick={handlePrint}
              style={{ maxHeight: "25px", padding: "2px 5px 2px 5px" }}
              className="btn btn-outline-secondary btn-sm me-2"
            >
              <i className="fa fa-print"></i>
            </button>
            <button
              onClick={handleDownloadPDF}
              style={{ maxHeight: "25px", padding: "2px 5px 2px 5px" }}
              className="btn btn-outline-secondary btn-sm me-2"
            >
              <i className="fa fa-file-pdf"></i>
            </button>

            <Link
              to="/admin/salary-sheet/create"
              style={{ maxHeight: "25px", padding: "2px 5px 2px 5px" }}
              className="btn btn-outline-success btn-sm"
            >
              Salary Sheet
            </Link>
          </>
        )}
      </div>
      <hr />

      {/* Table */}
      {spinner ? (
        <p>Loading...</p>
      ) : (
        <div className="table-responsive attendance_table_area">
          <table className="table table-bordered table-hover">
            <thead
              style={{
                position: "sticky",
                top: 0,
                backgroundColor: "white",
                zIndex: 1,
                width: "100%",
              }}
              className="table-dark"
            >
              <tr>
                <th>Name</th>
                <th>Present</th>
                <th>Holidays</th>
                <th>Leaves</th>
                <th>Payroll Dates</th>
                <th>Absent</th>
                <th>Dates Of Month</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((user, index) => (
                <tr key={index}>
                  <td>
                    <strong>{user.name}</strong>
                  </td>
                  <td className="text-success">{user.present}</td>
                  <td className="text-info">{user.holiday}</td>
                  <td className="text-warning">{user.leave}</td>
                  <td className="text-primary">{user.payroll_dates}</td>
                  <td className="text-danger">{user.absent}</td>
                  <td>{user.daysInMonth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MonthlyPayrolls;
