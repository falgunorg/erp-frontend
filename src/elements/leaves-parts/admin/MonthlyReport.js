import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import * as XLSX from "xlsx";
import Select from "react-select";

export default function MonthlyReport({ employees }) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [daysInMonth, setDaysInMonth] = useState(31); // Default to 31 days
  const [data, setData] = useState([]);
  const [employeeId, setEmployeeId] = useState("");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Generate a range of years dynamically
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Update days in the month when year or month changes
  useEffect(() => {
    const days = new Date(year, month, 0).getDate();
    setDaysInMonth(days);
  }, [year, month, employeeId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.post("/hr/admin-leaves-report-monthly", {
          year: year,
          month: month,
          employee_id: employeeId,
        });
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    };

    fetchData();
  }, [year, month, employeeId]);

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const sheetData = [];

    // Header row
    const headerRow = [
      "Name",
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
      "Total",
    ];
    sheetData.push(headerRow);

    // Data rows
    data.forEach((userData) => {
      const row = [];
      row.push(`${userData.user} | ${userData.staff_id}`); // Name column

      // Leave data columns
      for (let i = 1; i <= daysInMonth; i++) {
        const leaveDay = userData.daily_leave_data[i] || 0;
        row.push(leaveDay === 1 ? "A" : i);
      }

      // Total column
      row.push(userData.total);
      sheetData.push(row);
    });

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    // Apply basic styles (if supported)
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cellAddress]) continue;

        // Apply header styles
        if (R === 0) {
          worksheet[cellAddress].s = {
            font: { bold: true },
            alignment: { horizontal: "center", vertical: "center" },
            fill: { fgColor: { rgb: "D9D9D9" } }, // Light gray background
          };
        }

        // Apply leave day styles
        if (worksheet[cellAddress].v === "A") {
          worksheet[cellAddress].s = {
            fill: { fgColor: { rgb: "FFFF00" } }, // Yellow background
            alignment: { horizontal: "center", vertical: "center" },
          };
        }
      }
    }

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leave Report");

    // Write file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true, // Ensure styles are included
    });

    // Trigger download
    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(dataBlob);
    link.download = `LeaveReport${new Date().getTime()}.xlsx`;
    link.click();
  };

  // const exportToExcel = () => {
  //   const workbook = XLSX.utils.book_new();
  //   const sheetData = [];

  //   // Add header row
  //   const headerRow = [
  //     "Name",
  //     ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  //     "Total",
  //   ];
  //   sheetData.push(headerRow);

  //   // Add data rows
  //   data.forEach((userData) => {
  //     const row = [];
  //     const styledRow = [];

  //     // Name column
  //     row.push(`${userData.user} | ${userData.staff_id}`);
  //     styledRow.push({ v: `${userData.user} | ${userData.staff_id}` });

  //     // Leave data columns
  //     for (let i = 1; i <= daysInMonth; i++) {
  //       const leaveDay = userData.daily_leave_data[i] || 0;

  //       // Display "A" for leave days, otherwise show the date
  //       const cellValue = leaveDay === 1 ? "A" : i;
  //       row.push(cellValue);

  //       // Style the cell
  //       styledRow.push({
  //         v: cellValue,
  //         s: {
  //           fill: { fgColor: { rgb: leaveDay === 1 ? "FFFF00" : "FFFFFF" } }, // Yellow for leave days
  //           alignment: { horizontal: "center", vertical: "center" },
  //         },
  //       });
  //     }

  //     // Total column
  //     row.push(userData.total);
  //     styledRow.push({
  //       v: userData.total,
  //       s: {
  //         font: { bold: true },
  //         alignment: { horizontal: "center", vertical: "center" },
  //       },
  //     });

  //     sheetData.push(styledRow);
  //   });

  //   // Convert sheetData to worksheet
  //   const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  //   // Apply styles to cells
  //   sheetData.forEach((row, rowIndex) => {
  //     row.forEach((cell, colIndex) => {
  //       const cellAddress = XLSX.utils.encode_cell({
  //         r: rowIndex,
  //         c: colIndex,
  //       });
  //       worksheet[cellAddress] = { t: "s", v: cell.v, s: cell.s }; // Apply value and style
  //     });
  //   });

  //   // Add worksheet to workbook
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Leave Report");

  //   // Write workbook to file
  //   const excelBuffer = XLSX.write(workbook, {
  //     bookType: "xlsx",
  //     type: "array",
  //     cellStyles: true, // Ensure styles are included
  //   });

  //   // Trigger download
  //   const dataBlob = new Blob([excelBuffer], {
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  //   });
  //   const link = document.createElement("a");
  //   link.href = window.URL.createObjectURL(dataBlob);
  //   link.download = `LeaveReport${new Date().getTime()}.xlsx`;
  //   link.click();
  // };

  return (
    <div className="h-100 rounded p-3 box_shadow_card">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h4 className="mb-0">Leaves</h4>
        <div className="filters_area d-flex">
          <select
            className="me-2"
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
            className="me-2"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {months.map((m, index) => (
              <option key={index} value={index + 1}>
                {m}
              </option>
            ))}
          </select>
          <div style={{ minWidth: "250px" }}>
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
        </div>
      </div>
      <hr />
      <div className="monthly_report_view">
        <div className="d-flex justify-content-between">
          <h4>
            Leave Report of {months[month - 1]}-{year}
          </h4>
          <div className="text-end non_printing_area">
            <button
              onClick={exportToExcel}
              className="btn btn-success btn-sm me-2"
            >
              Export to Excel
            </button>
          </div>
        </div>

        <table className="table table-bordered print-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Total</th>
              {Array.from({ length: daysInMonth }, (_, i) => (
                <th key={i + 1}>{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((userData) => (
              <tr key={userData.staff_id}>
                <td>
                  {userData.user} | {userData.staff_id}
                </td>
                <td>
                  <strong>{userData.total}</strong>
                </td>
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const leaveDay = userData.daily_leave_data[i + 1] || 0;
                  return (
                    <td
                      key={i + 1}
                      style={{
                        backgroundColor:
                          leaveDay === 1 ? "yellow" : "transparent",
                      }}
                    >
                      {i + 1}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
