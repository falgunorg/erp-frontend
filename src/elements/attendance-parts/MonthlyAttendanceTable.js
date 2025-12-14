import React, { useState, useEffect } from "react";
import api from "../../services/api";
import jsPDF from "jspdf";
import "jspdf-autotable";

const MonthlyAttendanceTable = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Current month
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
      const response = await api.post("/hr/get-attendance-monthly", {
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

  const daysInMonth = () => new Date(year, month, 0).getDate();

  const handlePrint = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    const tableColumn = [
      "Name",
      ...[...Array(daysInMonth())].map((_, i) => i + 1),
      "Total",
    ];
    const tableRows = [];

    filteredData.forEach((user) => {
      const row = [user.name];
      [...Array(daysInMonth())].forEach((_, day) => {
        const date = `${String(day + 1).padStart(2, "0")}/${String(
          month
        ).padStart(2, "0")}/${year}`;
        row.push(user.days[date] === 1 ? "P" : "A");
      });
      row.push(user.total);
      tableRows.push(row);
    });

    doc.autoTable({
      theme: "grid", // Adding borders to table cells
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: {
        fontSize: 8, // Set smaller font size
        cellPadding: 2, // Add padding for better spacing
      },
    });

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
    setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    const tableColumn = [
      "Name",
      ...[...Array(daysInMonth())].map((_, i) => i + 1),
      "Total",
    ];
    const tableRows = [];

    filteredData.forEach((user) => {
      const row = [user.name];
      [...Array(daysInMonth())].forEach((_, day) => {
        const date = `${String(day + 1).padStart(2, "0")}/${String(
          month
        ).padStart(2, "0")}/${year}`;
        row.push(user.days[date] === 1 ? "P" : "A");
      });
      row.push(user.total);
      tableRows.push(row);
    });

    doc.autoTable({
      theme: "grid", // Adding borders to table cells
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: {
        fontSize: 8, // Set smaller font size
        cellPadding: 2, // Add padding for better spacing
      },
    });

    doc.save(`Attendance_${month}_${year}.pdf`);
  };

  return (
    <div className="container bg-white rounded p-1 box_shadow_card">
      <h6>
        <strong>Monthly Attendance</strong>
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
              className="btn btn-outline-secondary btn-sm"
            >
              <i className="fa fa-file-pdf"></i>
            </button>
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
                {[...Array(daysInMonth())].map((_, i) => (
                  <th key={i} className="text-center">
                    {i + 1}
                  </th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  {[...Array(daysInMonth())].map((_, day) => {
                    const date = `${String(day + 1).padStart(2, "0")}/${String(
                      month
                    ).padStart(2, "0")}/${year}`;
                    const isPresent = user.days[date] === 1;
                    return (
                      <td
                        key={day}
                        className={`text-center ${
                          isPresent ? "table-success" : "table-danger"
                        }`}
                      >
                        {isPresent ? "✓" : "✗"}
                      </td>
                    );
                  })}
                  <td className="text-center">{user.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MonthlyAttendanceTable;
