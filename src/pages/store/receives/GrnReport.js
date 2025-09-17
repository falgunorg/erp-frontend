import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import api from "services/api";

export default function GrnReport() {
  const [filters, setFilters] = useState({
    report_type: "daily",
    year: "",
    month: "",
    from_date: "",
    to_date: "",
    supplier_id: "",
    buyer_id: "",
    technical_package_id: "",
    garment_color: "",
    booking_id: "",
    item_type_id: "",
    booked_by: "",
    invoice_number: "",
    challan_number: "",
  });
  const [rows, setRows] = useState([]);

  // fetch report
  const fetchReport = async () => {
    try {
      const response = await api.get("/store/grn/report", {
        report_type: filters.report_type,
        year: filters.year,
        month: filters.month,
        from_date: filters.from_date,
        to_date: filters.to_date,
        supplier_id: filters.supplier_id,
        buyer_id: filters.buyer_id,
        technical_package_id: filters.technical_package_id,
        garment_color: filters.garment_color,
        booking_id: filters.booking_id,
        item_type_id: filters.item_type_id,
        booked_by: filters.booked_by,
        invoice_number: filters.invoice_number,
        challan_number: filters.challan_number,
      });
      setRows(response.data);
    } catch (error) {
      console.error("Error fetching report", error);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [filters.report_type]);

  // export excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "GrnReport.xlsx");
  };

  // export pdf
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("GRN Report", 14, 10);
    doc.autoTable({
      startY: 20,
      head: [Object.keys(rows[0] || {})],
      body: rows.map((row) => Object.values(row)),
      styles: { fontSize: 8 },
    });
    doc.save("GrnReport.pdf");
  };

  // print
  const printReport = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      document.getElementById("report-table").outerHTML
    );
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>GRN Report</h2>

      {/* Filters */}
      <div style={{ marginBottom: "15px" }}>
        {/* Report Type */}
        <label>
          Report Type:{" "}
          <select
            value={filters.report_type}
            onChange={(e) =>
              setFilters({ ...filters, report_type: e.target.value })
            }
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="custom">Custom Range</option>
          </select>
        </label>

        {/* Date Fields for Custom Range */}
        {filters.report_type === "custom" && (
          <>
            <label style={{ marginLeft: "10px" }}>
              From:{" "}
              <input
                type="date"
                value={filters.from_date}
                onChange={(e) =>
                  setFilters({ ...filters, from_date: e.target.value })
                }
              />
            </label>
            <label style={{ marginLeft: "10px" }}>
              To:{" "}
              <input
                type="date"
                value={filters.to_date}
                onChange={(e) =>
                  setFilters({ ...filters, to_date: e.target.value })
                }
              />
            </label>
          </>
        )}

        {/* Year and Month for Monthly/Yearly reports */}
        {(filters.report_type === "monthly" ||
          filters.report_type === "yearly") && (
          <>
            <label style={{ marginLeft: "10px" }}>
              Year:{" "}
              <input
                type="number"
                placeholder="YYYY"
                value={filters.year}
                onChange={(e) =>
                  setFilters({ ...filters, year: e.target.value })
                }
              />
            </label>
            {filters.report_type === "monthly" && (
              <label style={{ marginLeft: "10px" }}>
                Month:{" "}
                <input
                  type="number"
                  placeholder="MM"
                  min="1"
                  max="12"
                  value={filters.month}
                  onChange={(e) =>
                    setFilters({ ...filters, month: e.target.value })
                  }
                />
              </label>
            )}
          </>
        )}

        {/* Other Filters */}
        <label style={{ marginLeft: "10px" }}>
          Supplier ID:{" "}
          <input
            type="text"
            value={filters.supplier_id}
            onChange={(e) =>
              setFilters({ ...filters, supplier_id: e.target.value })
            }
          />
        </label>
        <label style={{ marginLeft: "10px" }}>
          Buyer ID:{" "}
          <input
            type="text"
            value={filters.buyer_id}
            onChange={(e) =>
              setFilters({ ...filters, buyer_id: e.target.value })
            }
          />
        </label>
        <label style={{ marginLeft: "10px" }}>
          Technical Package ID:{" "}
          <input
            type="text"
            value={filters.technical_package_id}
            onChange={(e) =>
              setFilters({ ...filters, technical_package_id: e.target.value })
            }
          />
        </label>
        <label style={{ marginLeft: "10px" }}>
          Garment Color:{" "}
          <input
            type="text"
            value={filters.garment_color}
            onChange={(e) =>
              setFilters({ ...filters, garment_color: e.target.value })
            }
          />
        </label>
        <label style={{ marginLeft: "10px" }}>
          Booking ID:{" "}
          <input
            type="text"
            value={filters.booking_id}
            onChange={(e) =>
              setFilters({ ...filters, booking_id: e.target.value })
            }
          />
        </label>
        <label style={{ marginLeft: "10px" }}>
          Item Type ID:{" "}
          <input
            type="text"
            value={filters.item_type_id}
            onChange={(e) =>
              setFilters({ ...filters, item_type_id: e.target.value })
            }
          />
        </label>
        <label style={{ marginLeft: "10px" }}>
          Booked By:{" "}
          <input
            type="text"
            value={filters.booked_by}
            onChange={(e) =>
              setFilters({ ...filters, booked_by: e.target.value })
            }
          />
        </label>
        <label style={{ marginLeft: "10px" }}>
          Invoice Number:{" "}
          <input
            type="text"
            value={filters.invoice_number}
            onChange={(e) =>
              setFilters({ ...filters, invoice_number: e.target.value })
            }
          />
        </label>
        <label style={{ marginLeft: "10px" }}>
          Challan Number:{" "}
          <input
            type="text"
            value={filters.challan_number}
            onChange={(e) =>
              setFilters({ ...filters, challan_number: e.target.value })
            }
          />
        </label>

        {/* Apply Button */}
        <button className="me-2" onClick={fetchReport}>
          Apply Filters
        </button>
        <button onClick={exportExcel} style={{ marginRight: "10px" }}>
          Export Excel
        </button>
        <button onClick={exportPDF} style={{ marginRight: "10px" }}>
          Export PDF
        </button>
        <button onClick={printReport}>Print</button>
      </div>

      {/* Export Buttons */}
      <div style={{ marginBottom: "15px" }}></div>

      {/* Table */}
      <table
        id="report-table"
        border="1"
        cellPadding="5"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>GRN No</th>
            <th>Invoice</th>
            <th>Challan</th>
            <th>Received Date</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.grn_number}</td>
                <td>{row.invoice_number}</td>
                <td>{row.challan_number}</td>
                <td>{row.received_date}</td>
                <td>{row.qty}</td>
                <td>{row.unit}</td>
                <td>{row.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
