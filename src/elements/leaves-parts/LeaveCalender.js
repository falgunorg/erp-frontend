import React, { useState, useEffect } from "react";
import api from "../../services/api";

export default function LeaveCalender() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [monthlyLeaves, setMonthlyLeaves] = useState([]);
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear + 1 - i);

  const getCalendar = async () => {
    try {
      const response = await api.post("/hr/my-leaves-calendar", { year });
      if (response.status === 200 && response.data) {
        setMonthlyLeaves(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching leave summary:", error);
    }
  };

  useEffect(() => {
    getCalendar();
  }, [year]);
  const renderMonthRows = () => {
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

    return months.map((month, monthIndex) => {
      const monthData = monthlyLeaves.find((m) => m.month === month);
      const totalDays = monthData ? monthData.total_days : 31;
      const dateList = monthData ? monthData.date_list : [];

      return (
        <tr key={month}>
          <td>{month}</td>
          {Array.from({ length: totalDays }, (_, i) => {
            const date = i + 1;
            const formattedDate = `${year}-${String(monthIndex + 1).padStart(
              2,
              "0"
            )}-${String(date).padStart(2, "0")}`;
            const leave = dateList.find((d) => d.date === formattedDate);

            return (
              <td
                key={date}
                className={leave && leave.type ? "leave-day" : ""}
                style={
                  leave && leave.type
                    ? { backgroundColor: "#fd7e14", cursor: "pointer" }
                    : {}
                }
                title={leave ? leave.type : ""}
              >
                {date}
              </td>
            );
          })}
        </tr>
      );
    });
  };

  return (
    <div className="h-100 rounded p-3 box_shadow_card">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h4 className="mb-0">My Leaves (Calendar)</h4>
        <div className="filters_area d-flex">
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
        </div>
      </div>
      <hr />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Month</th>
            {Array.from({ length: 31 }, (_, i) => (
              <th key={i + 1}>{i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>{renderMonthRows()}</tbody>
      </table>
    </div>
  );
}
