import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

export default function CreateSalarySheet(props) {
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

  const handlePrint = () => {};
  const handleDownloadPDF = () => {};

  return (
    <div className="row">
      <div className="col-lg-6">
        <div className="bg-white rounded p-1 box_shadow_card">
          <h6>
            <strong>Salary Sheet</strong>
          </h6>
          <div className="d-inline justify-content-start align-items-center gap-3">
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
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
              </>
            )}
          </div>
          <hr />

          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Payble Dates</th>
                  <th>Gross Salary</th>
                  <th>Absent</th>
                  <th>Deduction</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>SM Jewel Sadek | 185533</td>
                  <td>29</td>
                  <td>50000</td>
                  <td>2</td>
                  <td>1500</td>
                  <td>48500</td>
                </tr>
                <tr>
                  <td>Faisal Hosen | 203478</td>
                  <td>29</td>
                  <td>50000</td>
                  <td>2</td>
                  <td>1500</td>
                  <td>48500</td>
                </tr>

                <tr>
                  <td>Shaheed Kaiser | 875422</td>
                  <td>29</td>
                  <td>50000</td>
                  <td>2</td>
                  <td>1500</td>
                  <td>48500</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
