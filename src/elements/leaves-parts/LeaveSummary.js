import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function LeaveSummary() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [totalLeaves, setTotalLeaves] = useState(0);
  const [leavesSummary, setLeaveSummary] = useState({});

  const getSummary = async () => {
    try {
      const response = await api.post("/hr/my-leaves-summary-yearly", { year });
      if (response.status === 200 && response.data) {
        setTotalLeaves(response.data.total_leaves || 0);
        setLeaveSummary(response.data.leave_counts || {});
      }
    } catch (error) {
      console.error("Error fetching leave summary:", error);
    }
  };

  useEffect(() => {
    getSummary();
  }, [year]);

  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);

  return (
    <div className="h-100 rounded p-3 box_shadow_card">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h4 className="mb-0">My Leaves</h4>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <hr />
      <table className="table bg-info">
        <thead>
          <tr>
            <th>Type</th>
            <th>Taken</th>
            <th>Remaining</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(leavesSummary).map(([type, taken], index) => (
            <tr key={index}>
              <td>{type}</td>
              <td>{taken}</td>
              <td></td>
            </tr>
          ))}

          {Object.keys(leavesSummary).length !== 0 && (
            <tr>
              <td>
                <strong>TOTAL</strong>
              </td>
              <td>
                <strong>{totalLeaves}</strong>
              </td>
              <td></td>
            </tr>
          )}

          {Object.keys(leavesSummary).length === 0 && (
            <tr>
              <td colSpan="3" className="text-center">
                No leave data available for {year}.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
