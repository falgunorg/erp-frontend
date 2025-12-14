import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import * as XLSX from "xlsx";
import Select from "react-select";

export default function YearlyReport({ employees }) {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [data, setData] = useState([]);
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const [employeeId, setEmployeeId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.post("/hr/admin-leaves-report-yearly", {
          year: year,
          employee_id: employeeId,
        });
        setData(response.data.data); // Assumes data contains the structure you provided
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    };

    fetchData();
  }, [year, employeeId]);

  const exportToExcel = () => {
    const table = document.querySelector(".print-table"); // Select the table element
    const workbook = XLSX.utils.table_to_book(table, { sheet: "Sheet 1" });
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(data);
    link.download = `YearlyLeave_${new Date().getTime()}.xlsx`;
    link.click();
  };

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
      <div className="yearly_report_view">
        <div className="d-flex justify-content-between">
          <h4>Leave Report of {year}</h4>
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
              <th>Jan</th>
              <th>Feb</th>
              <th>Mar</th>
              <th>Apr</th>
              <th>May</th>
              <th>Jun</th>
              <th>Jul</th>
              <th>Aug</th>
              <th>Sep</th>
              <th>Oct</th>
              <th>Nov</th>
              <th>Dec</th>
            </tr>
          </thead>
          <tbody>
            {data.map((employee) => {
              const monthlyData = employee.monthly_leave_data;
              const totalLeave = employee.total;
              return (
                <tr key={employee.id}>
                  <td>
                    {employee.user} | {employee.staff_id}
                  </td>
                  <td>
                    <strong>{totalLeave}</strong>
                  </td>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <td key={month}>
                      {monthlyData[month] > 0 ? monthlyData[month] : ""}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
