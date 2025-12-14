import React, { useState, useEffect } from "react";
import api from "../../services/api";
import jsPDF from "jspdf";
import "jspdf-autotable";

const YearlyAttendanceTable = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [companyId, setCompanyId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);

  // Generate year options (last 6 years)
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);

  // Get all months for table headers based on the selected year
  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(year, i, 1).toLocaleString("default", { month: "long" })
  );

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.post("/common/departments"); // Fixed API call to GET
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
  }, [year, companyId, department, status]);

  const fetchAttendance = async () => {
    try {
      setSpinner(true);
      const response = await api.post("/hr/get-attendance-yearly", {
        year,
        companyId,
        department,
        status,
      }); // Passed filters correctly
      if (response.status === 200 && response.data) {
        setAttendanceData(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setSpinner(false);
    }
  };

  const filteredData = attendanceData.filter((item) =>
    item.name.toLowerCase().includes(searchValue.trim().toLowerCase())
  );

  const generatePDFData = () => {
    const tableColumn = [
      "SL",
      "Name",
      ...months.map((month) => month.slice(0, 3)),
      "Total P",
      "Total A",
    ];

    const tableRows = filteredData.map((user, index) => {
      const row = [index + 1];
      row.push(user.name);

      months.forEach((monthName) => {
        const monthData = user.monthly?.[monthName] || {
          Absent: 0,
          Present: 0,
        };
        row.push(`A:${monthData.Absent}\nP:${monthData.Present}`);
      });
      row.push(user.total?.Absent || 0);
      row.push(user.total?.Present || 0);
      return row;
    });
    return { tableColumn, tableRows };
  };

  const handlePrint = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    const { tableColumn, tableRows } = generatePDFData();

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8, cellPadding: 2, valign: "middle" },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      columnStyles: {
        0: { halign: "left" }, // Align "Name" to the left
        // Add more column styles if needed (e.g., center alignment for other columns)
      },
    });

    const pdfUrl = doc.output("bloburl");
    window.open(pdfUrl, "_blank");
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    const { tableColumn, tableRows } = generatePDFData();

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8, cellPadding: 2, valign: "middle" },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      columnStyles: {
        0: { halign: "left" }, // Align "Name" to the left
        // Add more column styles if needed (e.g., center alignment for other columns)
      },
    });

    doc.save(`Yearly_Attendance_${year}.pdf`);
  };

  return (
    <div className="container bg-white rounded p-1 box_shadow_card">
      <h6>
        <strong>Yearly Attendance</strong>
      </h6>
      <div className="d-flex flex-wrap gap-3  align-items-center">
        <select
          className=""
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
          className=""
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
          className=""
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">All</option>
          {departments.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
        <select
          className=""
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        {!spinner && (
          <>
            <button
              onClick={handlePrint}
              className="btn btn-outline-secondary btn-sm me-2"
            >
              <i className="fa fa-print"></i>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="btn btn-outline-secondary btn-sm"
            >
              <i className="fa fa-file-pdf"></i>
            </button>
          </>
        )}
      </div>
      <hr />
      {spinner ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredData.length > 0 ? (
        <div className="table-responsive attendance_table_area">
          <table className="table table-bordered table-striped print-table">
            <thead
              style={{
                position: "sticky",
                top: 0,
                backgroundColor: "white",
                zIndex: 1,
                width: "100%",
              }}
              className="print-thead thead-dark table-dark"
            >
              <tr className="table_heading_tr">
                <th rowSpan="2">Name</th>
                {months.map((month, i) => {
                  const monthName = new Date(year, i, 1)
                    .toLocaleString("default", { month: "long" })
                    .slice(0, 3);

                  return (
                    <th key={i} colSpan="2" className="text-center">
                      {monthName}
                    </th>
                  );
                })}

                <th colSpan="2" className="text-center">
                  Total
                </th>
              </tr>
              <tr>
                {months.map((month, i) => (
                  <>
                    <th className="text-success" key={`r-${i}`}>
                      P
                    </th>
                    <th className="text-danger" key={`i-${i}`}>
                      A
                    </th>
                  </>
                ))}
                <th className="text-success">P</th>
                <th className="text-danger">A</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  {months.map((month) => (
                    <>
                      <td className="text-success">
                        {user.monthly?.[month]?.Present || 0}
                      </td>
                      <td className="text-danger">
                        {user.monthly?.[month]?.Absent || 0}
                      </td>
                    </>
                  ))}
                  <td className="text-success">{user.total?.Present || 0}</td>
                  <td className="text-danger">{user.total?.Absent || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-warning text-center mb-0">
          No attendance records found
        </div>
      )}
    </div>
  );
};

export default YearlyAttendanceTable;
