import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Spinner from "../../elements/Spinner";
import jsPDF from "jspdf";
import "jspdf-autotable";
import MonthlyAttendanceTable from "../../elements/attendance-parts/MonthlyAttendanceTable";
import YearlyAttendanceTable from "../../elements/attendance-parts/YearlyAttendanceTable";
import Holidays from "../../elements/attendance-parts/Holidays";
import MonthlyPayrolls from "../../elements/attendance-parts/MonthlyPayrolls";

export default function Attendance(props) {
  const [spinner, setSpinner] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [companyId, setCompanyId] = useState("");
  const [filterStatus, setFilterStatus] = useState(""); 
  const [data, setData] = useState([]);

  const increaseDate = () => {
    const currentDate = new Date(date);
    const nextDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    setDate(nextDate.toISOString().split("T")[0]);
  };

  const decreaseDate = () => {
    const currentDate = new Date(date);
    const previousDate = new Date(
      currentDate.setDate(currentDate.getDate() - 1)
    );
    setDate(previousDate.toISOString().split("T")[0]);
  };

  const getData = async () => {
    try {
      setSpinner(true);
      const response = await api.post("/hr/get-attendance-data", {
        request_date: date,
        company_id: companyId,
      });
      if (response.status === 200 && response.data) {
        setData(response.data.data || []);
      }
      setSpinner(false);
    } catch (error) {
      console.error("Error fetching leave summary:", error);
    }
  };

  useEffect(() => {
    getData();
  }, [date, companyId]);

  const filteredData = data.filter((item) => {
    if (!filterStatus) return true; // If no filter, show all
    return filterStatus === "P"
      ? item.present_status === 1
      : item.present_status === 0;
  });

  const handlePrint = () => {
    const doc = new jsPDF();
    const tableColumn = ["SL", "ID", "Name", "Date", "Status"];
    const tableRows = [];

    filteredData.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.staff_id,
        item.name,
        item.date,
        item.present_status === 1 ? "Present" : "Absent",
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    // Generate the PDF as a blob
    const pdfBlob = doc.output("blob");

    // Create an object URL for the PDF
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Open the PDF in a new tab
    window.open(pdfUrl, "_blank");

    // Clean up the URL after it's used (optional, but recommended)
    setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["SL", "ID", "Name", "Date", "Status"];
    const tableRows = [];

    filteredData.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.staff_id,
        item.name,
        item.date,
        item.present_status === 1 ? "Present" : "Absent",
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save(`Attendance_${date}.pdf`);
  };

  return (
    <div className="leaves_page">
      {spinner && <Spinner />}
      <div className="row">
        <div className="col-sm-12 col-md-6 col-xl-4">
          <div className="bg-white rounded p-1 box_shadow_card">
            <h6>
              <strong>Daily Attendance</strong>
            </h6>

            <div className="date_filter d-flex justify-content-between">
              <div className="left_items">
                <input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  type="date"
                  className="me-2"
                />
                <button
                  onClick={decreaseDate}
                  className="btn btn-outline-secondary btn-sm me-2"
                  style={{ maxHeight: "25px", padding: "2px 5px 2px 5px" }}
                >
                  <i className="fa fa-chevron-left"></i>
                </button>
                <button
                  onClick={increaseDate}
                  className="btn btn-outline-secondary btn-sm me-2"
                  style={{ maxHeight: "25px", padding: "2px 5px 2px 5px" }}
                >
                  <i className="fa fa-chevron-right"></i>
                </button>
              </div>
              <div className="right_items">
                <select
                  onChange={(e) => setCompanyId(e.target.value)}
                  value={companyId}
                  className="me-2"
                >
                  <option value="">All</option>
                  <option value="1">JMS</option>
                  <option value="2">MCL</option>
                  <option value="3">MBL</option>
                  <option value="4">H/O</option>
                </select>
                <select
                  onChange={(e) => setFilterStatus(e.target.value)}
                  value={filterStatus}
                  className="me-2"
                >
                  <option value="">All</option>
                  <option value="P">Present</option>
                  <option value="A">Absent</option>
                </select>
                <button
                  onClick={handlePrint}
                  className="btn btn-outline-secondary btn-sm me-2"
                  style={{ maxHeight: "25px", padding: "2px 5px 2px 5px" }}
                >
                  <i className="fa fa-print"></i>
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="btn btn-outline-secondary btn-sm"
                  style={{ maxHeight: "25px", padding: "2px 5px 2px 5px" }}
                >
                  <i className="fa fa-file-pdf"></i>
                </button>
              </div>
            </div>
            <hr />

            <div className="attendance_table_area">
              <table
                className="table"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead
                  className="table-dark"
                  style={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "white",
                    zIndex: 1,
                    width: "100%",
                  }}
                >
                  <tr>
                    <th>SL</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData && filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr key={item.staff_id || index}>
                        <td>{index + 1}</td>
                        <td>{item.staff_id}</td>
                        <td>{item.name}</td>
                        <td>{item.date}</td>
                        <td
                          className={
                            item.present_status === 1
                              ? "text-success"
                              : "text-danger"
                          }
                        >
                          <strong>
                            {item.present_status === 1 ? "P" : "A"}
                          </strong>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-md-6 col-xl-5">
          <MonthlyAttendanceTable {...props} />
        </div>
        <div className="col-sm-12 col-md-6 col-xl-3">
          <Holidays {...props} />
        </div>
      </div>
      <div className="row pt-4">
        <div className="col-lg-6">
          <YearlyAttendanceTable {...props} />
        </div>
        <div className="col-lg-6">
          <MonthlyPayrolls {...props} />
        </div>
      </div>
    </div>
  );
}
