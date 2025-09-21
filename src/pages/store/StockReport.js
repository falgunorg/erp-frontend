import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import api from "services/api";
import CustomSelect from "../../elements/CustomSelect";
import html2canvas from "html2canvas";
import moment from "moment";

export default function StockReport(props) {
  const [buyers, setBuyers] = useState([]);
  const [technicalPackages, setTechnicalPackages] = useState([]);
  const [garmentColors, setGarmentColors] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [items, setItems] = useState([]);

  const [filters, setFilters] = useState({
    report_type: "daily",
    year: "",
    month: "",
    from_date: "",
    to_date: "",
    buyer_id: "",
    technical_package_id: "",
    garment_color: "",
    item_type_id: "",
    item_id: "",
    search: "",
  });

  // Fetch dropdown options from backend
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [buy, tech, garmentColor, itemType, item] = await Promise.all([
          api.post("/common/buyers"),
          api.post("/merchandising/technical-packages-all-desc", {
            buyer_id: filters.buyer_id,
          }),
          api.post("/merchandising/get-garment-colors-by-techpack", {
            technical_package_id: filters.technical_package_id,
          }),
          api.post("/common/item-types"),
          api.post("/common/items", { item_type_id: filters.item_type_id }),
        ]);

        setBuyers(buy.data.data);
        setTechnicalPackages(tech.data.data);
        setGarmentColors(garmentColor.data.colors);
        setItemTypes(itemType.data.data);
        setItems(item.data.data);
      } catch (err) {
        console.error("Failed loading filter options", err);
      }
    };

    loadOptions();
  }, [filters.buyer_id, filters.technical_package_id, filters.item_type_id]);

  const [rows, setRows] = useState([]);

  // fetch report
  const fetchReport = async () => {
    try {
      const response = await api.post("/store/stock/report", {
        report_type: filters.report_type,
        year: filters.year,
        month: filters.month,
        from_date: filters.from_date,
        to_date: filters.to_date,
        buyer_id: filters.buyer_id,
        technical_package_id: filters.technical_package_id,
        garment_color: filters.garment_color,
        item_type_id: filters.item_type_id,
        item_id: filters.item_id,
        search: filters.search,
      });
      setRows(response.data.data);
    } catch (error) {
      console.error("Error fetching report", error);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  // export excel
  const exportExcel = () => {
    const table = document.getElementById("report-table");
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.table_to_sheet(table); // 👈 use table not JSON
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, "StockReport.xlsx");
  };

  // export pdf
  const handleGeneratePDF = () => {
    const element = document.getElementById("report-table");
    const responsiveTables = element.querySelectorAll(".table-responsive");

    // Temporarily remove overflow and set height to auto
    responsiveTables.forEach((table) => {
      table.dataset.originalStyle = table.getAttribute("style") || "";
      table.style.overflow = "visible";
      table.style.maxHeight = "unset";
      table.style.height = "auto";
    });

    // Wait for layout to update
    setTimeout(() => {
      html2canvas(element, {
        scale: 2, // High quality
        useCORS: true,
        scrollY: -window.scrollY, // Optional: remove scroll offset
      }).then((canvas) => {
        // Restore original styles
        responsiveTables.forEach((table) => {
          table.setAttribute("style", table.dataset.originalStyle);
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        const fileName = "StockReport";
        pdf.save(`${fileName}.pdf`);
      });
    }, 100); // Slight delay for DOM to reflow
  };

  // print
  const printReport = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
    <html>
      <head>
        <title>STOCK Report</title>
        <style>
          table { border-collapse: collapse; width: 100%; }
          table, th, td { border: 1px solid black; padding: 5px; }
          th { background: #f2f2f2; }
        </style>
      </head>
      <body>
        ${document.getElementById("report-table").outerHTML}
      </body>
    </html>
  `);
    printWindow.document.close();
    printWindow.print();
  };

  useEffect(async () => {
    props.setHeaderData({
      pageName: "STOCK REPORT",
      isNewButton: false,
      newButtonLink: "",
      isInnerSearch: false,
      innerSearchValue: "",
      isDropdown: false,
      DropdownMenu: [],
    });
  }, []);

  return (
    <div className="create_technical_pack create_tp_body">
      <div className="row g-3">
        {/* Report Type */}
        <div className="col create_tp_body">
          <label className="form-label">Report Type</label>
          <select
            className="form-select"
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
        </div>

        {/* Date Fields for Custom Range */}
        {filters.report_type === "custom" && (
          <>
            <div className="col create_tp_body">
              <label className="form-label">From</label>
              <input
                type="date"
                className="form-control"
                value={filters.from_date}
                onChange={(e) =>
                  setFilters({ ...filters, from_date: e.target.value })
                }
              />
            </div>
            <div className="col create_tp_body">
              <label className="form-label">To</label>
              <input
                type="date"
                className="form-control"
                value={filters.to_date}
                onChange={(e) =>
                  setFilters({ ...filters, to_date: e.target.value })
                }
              />
            </div>
          </>
        )}

        {/* Year / Month */}
        {(filters.report_type === "monthly" ||
          filters.report_type === "yearly") && (
          <>
            <div className="col create_tp_body">
              <label className="form-label">Year</label>
              <input
                type="number"
                className="form-control"
                placeholder="YYYY"
                value={filters.year}
                onChange={(e) =>
                  setFilters({ ...filters, year: e.target.value })
                }
              />
            </div>
            {filters.report_type === "monthly" && (
              <div className="col create_tp_body">
                <label className="form-label">Month</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="MM"
                  min="1"
                  max="12"
                  value={filters.month}
                  onChange={(e) =>
                    setFilters({ ...filters, month: e.target.value })
                  }
                />
              </div>
            )}
          </>
        )}

        {/* Searchable CustomSelects */}

        <div className="col create_tp_body">
          <label className="form-label">Buyer</label>
          <CustomSelect
            options={buyers.map((b) => ({ value: b.id, label: b.name }))}
            value={
              buyers.find((b) => b.id === filters.buyer_id)
                ? {
                    value: filters.buyer_id,
                    label: buyers.find((b) => b.id === filters.buyer_id).name,
                  }
                : null
            }
            onChange={(opt) =>
              setFilters({ ...filters, buyer_id: opt?.value || "" })
            }
            isClearable
          />
        </div>

        <div className="col create_tp_body">
          <label className="form-label">Techpack</label>
          <CustomSelect
            options={technicalPackages.map((t) => ({
              value: t.id,
              label: t.techpack_number,
            }))}
            value={
              technicalPackages.find(
                (t) => t.id === filters.technical_package_id
              )
                ? {
                    value: filters.technical_package_id,
                    label: technicalPackages.find(
                      (t) => t.id === filters.technical_package_id
                    ).techpack_number,
                  }
                : null
            }
            onChange={(opt) =>
              setFilters({
                ...filters,
                technical_package_id: opt?.value || "",
              })
            }
            isClearable
          />
        </div>
        <div className="col create_tp_body">
          <label className="form-label">Garment Color</label>

          <CustomSelect
            options={garmentColors.map((t) => ({
              value: t,
              label: t,
            }))}
            value={
              garmentColors.includes(filters.garment_color)
                ? {
                    value: filters.garment_color,
                    label: filters.garment_color,
                  }
                : null
            }
            onChange={(opt) =>
              setFilters({
                ...filters,
                garment_color: opt?.value || "",
              })
            }
            isClearable
          />
        </div>

        <div className="col create_tp_body">
          <label className="form-label">Item Type</label>
          <CustomSelect
            options={itemTypes.map((i) => ({ value: i.id, label: i.title }))}
            value={
              itemTypes.find((i) => i.id === filters.item_type_id)
                ? {
                    value: filters.item_type_id,
                    label: itemTypes.find((i) => i.id === filters.item_type_id)
                      .title,
                  }
                : null
            }
            onChange={(opt) =>
              setFilters({ ...filters, item_type_id: opt?.value || "" })
            }
            isClearable
          />
        </div>

        <div className="col create_tp_body">
          <label className="form-label">Item</label>
          <CustomSelect
            options={items.map((i) => ({ value: i.id, label: i.title }))}
            value={
              items.find((i) => i.id === filters.item_id)
                ? {
                    value: filters.item_id,
                    label: items.find((i) => i.id === filters.item_id).title,
                  }
                : null
            }
            onChange={(opt) =>
              setFilters({ ...filters, item_id: opt?.value || "" })
            }
            isClearable
          />
        </div>

        <div className="col create_tp_body">
          <label className="form-label">Search</label>
          <input
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            type="text"
            className="form-value"
            placeholder="Search..."
          />
        </div>

        {/* Text Inputs */}

        {/* Buttons */}
        <div className="col-12 d-flex justify-content-end  gap-2">
          <button className="btn btn-primary" onClick={fetchReport}>
            Apply Filters
          </button>
          <button className="btn btn-success" onClick={exportExcel}>
            Export Excel
          </button>
          <button className="btn btn-danger" onClick={handleGeneratePDF}>
            Export PDF
          </button>
          <button className="btn btn-secondary" onClick={printReport}>
            Print
          </button>
        </div>
      </div>
      <br />

      <table
        id="report-table"
        border="1"
        cellPadding="5"
        style={{ borderCollapse: "collapse", width: "100%" }}
        className="table table-borderd"
      >
        <thead>
          <tr>
            <th>Buyer</th>
            <th>Techpack</th>
            <th>Garment Color</th>
            <th>Item Type</th>
            <th>Item</th>
            <th>Size</th>
            <th>Color</th>
            <th>Unit</th>
            <th>Received QTY</th>
            <th>Issue QTY</th>
            <th>Balance Qty</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <tr key={row.id}>
                <td>{row.buyer}</td>
                <td>{row.technical_pack}</td>
                <td>{row.garment_color}</td>
                <td>{row.item_type}</td>
                <td>{row.item}</td>
                <td>{row.size}</td>
                <td>{row.color}</td>
                <td>{row.unit}</td>
                <td>{row.total_received}</td>
                <td>{row.total_issued}</td>
                <td>{row.balance}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12" style={{ textAlign: "center" }}>
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
