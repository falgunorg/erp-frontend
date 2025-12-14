import React, { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import Spinner from "../../elements/Spinner";
import Select from "react-select";
import { Link, useHistory } from "react-router-dom";
import moment from "moment";
import { Button } from "react-bootstrap";
import * as XLSX from "xlsx";

export default function SubStoreReport(props) {
  const history = useHistory();

  const handleGoBack = () => {
    history.goBack();
  };
  const [spinner, setSpinner] = useState(false);
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push(
        <option key={i} value={i.toString()}>
          {i}
        </option>
      );
    }
    return years;
  };

  const months = [
    { id: 1, title: "Jan" },
    { id: 2, title: "Feb" },
    { id: 3, title: "Mar" },
    { id: 4, title: "Apr" },
    { id: 5, title: "May" },
    { id: 6, title: "Jun" },
    { id: 7, title: "July" },
    { id: 8, title: "Aug" },
    { id: 9, title: "Sep" },
    { id: 10, title: "Oct" },
    { id: 11, title: "Nov" },
    { id: 12, title: "Dec" },
  ];

  const [companies, setCompanies] = useState([]);
  const getCompanies = async () => {
    setSpinner(true);

    // Send the correct page parameter to the API request
    var response = await api.post("/companies", {
      type: "Own",
    });

    if (response.status === 200 && response.data) {
      setCompanies(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const [substores, setSubstores] = useState([]);
  const getSubstores = async () => {
    setSpinner(true);
    var response = await api.post("/substores");
    if (response.status === 200 && response.data) {
      setSubstores(response.data.company_wise);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const [filterData, setFilterData] = useState({
    company_id: "",
    period: "",
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    from_date: "",
    to_date: "",
    type: "",
    item_id: "",
  });
  const clearFields = () => {
    setFilterData({
      company_id: "",
      period: "",
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      from_date: "",
      to_date: "",
      type: "",
      item_id: "",
    });
  };

  const filterChange = (name, value) => {
    setFilterData({
      ...filterData,
      [name]: value,
    });
  };
  const [errors, setErrors] = useState([]);

  const validateForm = () => {
    let formErrors = {};

    if (!filterData.period) {
      formErrors.period = "Please Select Period";
    }

    if (filterData.period === "Yearly" && !filterData.year) {
      formErrors.year = "Please Select Year";
    }

    if (filterData.period === "Monthly") {
      if (!filterData.year) {
        formErrors.year = "Please Select Year";
      }
      if (!filterData.month) {
        formErrors.month = "Please Select Month";
      }
    }

    if (filterData.period === "Custom") {
      if (!filterData.from_date) {
        formErrors.from_date = "Please Select From Date";
      }
      if (!filterData.to_date) {
        formErrors.to_date = "Please Select To Date";
      }
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // get all reports items
  const [reportSummary, setReportSummary] = useState({});
  const [reports, setReports] = useState([]);
  const getReports = async () => {
    if (validateForm()) {
      setSpinner(true);
      var response = await api.post("/substores-report", filterData);
      if (response.status === 200 && response.data) {
        setReports(response.data.data);
        setReportSummary(response.data.reportSummary);
        setErrors([]);
      } else {
        console.log(response.data);
        setErrors(response.data.errors);
      }
      setSpinner(false);
    }
  };

  const printPDF = () => {
    window.print();
  };

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
    link.download = `SubStoreReport_${new Date().getTime()}.xlsx`;
    link.click();
  };

  useEffect(() => {
    getSubstores();
    getCompanies();
  }, []);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">SubStore Report</div>
        <div className="actions">
          <Link
            onClick={handleGoBack}
            className="btn btn-danger rounded-circle"
          >
            <i className="fal fa-times"></i>
          </Link>
        </div>
      </div>

      <div className="datrange_filter non_printing_area">
        <div className="row">
          {props.userData.company_id === 4 &&
            [4, 5, 9, 10, 27].includes(props.userData.department) && (
              <div className="col">
                <div className="form-group">
                  <label>Vendor</label>
                  <select
                    value={filterData.company_id}
                    className="form-select"
                    name="company_id"
                    onChange={(event) =>
                      filterChange("company_id", event.target.value)
                    }
                  >
                    <option value="">All</option>
                    {companies.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

          <div className="col">
            <div className="form-group">
              <label>Period</label>
              <select
                value={filterData.period}
                className="form-select"
                name="period"
                onChange={(event) => filterChange("period", event.target.value)}
              >
                <option value="">Select</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                <option value="Custom">Custom</option>
              </select>
              {errors.period && (
                <div className="text-danger">{errors.period}</div>
              )}
            </div>
          </div>

          {filterData.period === "Monthly" && (
            <>
              <div className="col">
                <div className="form-group">
                  <label>Year</label>
                  <select
                    value={filterData.year}
                    className="form-select"
                    name="year"
                    onChange={(event) =>
                      filterChange("year", event.target.value)
                    }
                  >
                    {generateYearOptions()}
                  </select>
                  {errors.year && (
                    <div className="text-danger">{errors.year}</div>
                  )}
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label>Month</label>
                  <select
                    value={filterData.month}
                    className="form-select"
                    name="month"
                    onChange={(event) =>
                      filterChange("month", event.target.value)
                    }
                  >
                    {months.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                  {errors.month && (
                    <div className="text-danger">{errors.month}</div>
                  )}
                </div>
              </div>
            </>
          )}

          {filterData.period === "Yearly" && (
            <>
              <div className="col">
                <div className="form-group">
                  <label>Year</label>
                  <select
                    value={filterData.year}
                    className="form-select"
                    name="year"
                    onChange={(event) =>
                      filterChange("year", event.target.value)
                    }
                  >
                    {generateYearOptions()}
                  </select>
                  {errors.year && (
                    <div className="text-danger">{errors.year}</div>
                  )}
                </div>
              </div>
            </>
          )}

          {filterData.period === "Custom" && (
            <>
              <div className="col">
                <div className="form-group">
                  <label>From Date</label>
                  <input
                    value={filterData.from_date}
                    name="from_date"
                    className="form-control"
                    type="date"
                    onChange={(event) =>
                      filterChange("from_date", event.target.value)
                    }
                  />
                  {errors.from_date && (
                    <div className="text-danger">{errors.from_date}</div>
                  )}
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label>To Date</label>
                  <input
                    value={filterData.to_date}
                    name="to_date"
                    className="form-control"
                    type="date"
                    onChange={(event) =>
                      filterChange("to_date", event.target.value)
                    }
                  />
                  {errors.to_date && (
                    <div className="text-danger">{errors.to_date}</div>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="col">
            <div className="form-group">
              <label>Item Type</label>
              <select
                value={filterData.type}
                className="form-select"
                name="type"
                onChange={(event) => filterChange("type", event.target.value)}
              >
                <option value="">All</option>
                <option value="Stationery">Stationery</option>
                <option value="Spare Parts">Spare Parts</option>
                <option value="Electrical">Electrical</option>
                <option value="Needle">Needle</option>
                <option value="Medical">Medical</option>
                <option value="Fire">Fire</option>
                <option value="Compressor & boiler">Compressor & boiler</option>
                <option value="Chemical">Chemical</option>
                <option value="Printing">Printing</option>
                <option value="It">It</option>
                <option value="WTP">WTP</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Compliance">Compliance</option>
                <option value="Mechanical">Mechanical</option>
              </select>
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>Item</label>

              <Select
                placeholder="Select"
                value={
                  substores.find((item) => item.id === filterData.item_id)
                    ? {
                        value: filterData.item_id,
                        label:
                          substores.find(
                            (item) => item.id === filterData.item_id
                          ).part_name || "",
                      }
                    : null
                }
                onChange={(selectedOption) =>
                  filterChange("item_id", selectedOption.value)
                }
                name="item_id"
                options={substores.map((item) => ({
                  value: item.id,
                  label: item.part_name,
                }))}
              />
            </div>
          </div>

          <div className="col">
            <br />
            <Button
              onClick={getReports}
              className="btn btn-success btn-sm me-2"
            >
              <i class="fas fa-search"></i>
            </Button>
            <Button onClick={clearFields} className="btn btn-warning btn-sm">
              <i className="fas fa-retweet"></i>
            </Button>{" "}
          </div>
        </div>
      </div>
      <hr />
      <br />
      {reportSummary.report_type && (
        <>
          <div className="text-end non_printing_area">
            <Button
              onClick={exportToExcel}
              className="btn btn-success btn-sm me-2"
            >
              Export to Excel
            </Button>
            <Button onClick={printPDF} className="btn btn-primary btn-sm">
              Print/PDF
            </Button>
          </div>

          <br />
          <div className="table-container preview_print">
            <div className="table-responsive">
              <div className="text-center">
                <h4>FALGUN | ERP</h4>
                <h5>SubStore {reportSummary.part_type} Statement</h5>
                <h6>
                  {reportSummary.report_type === "Monthly" && (
                    <>
                      {reportSummary.report_month}, {reportSummary.report_year}
                    </>
                  )}
                  {reportSummary.report_type === "Yearly" &&
                    reportSummary.report_year}
                  {reportSummary.report_type === "Custom" && (
                    <>
                      {reportSummary.report_from_date} To{" "}
                      {reportSummary.report_to_date}
                    </>
                  )}
                </h6>
                <h6>
                  {moment().format("lll")} , by {props.userData.full_name}
                </h6>
                <h5>{reportSummary.company_name}</h5>
              </div>

              <table
                className={
                  "table table-bordered table-striped print-table " +
                  reportSummary.report_type
                }
              >
                <thead className="print-thead thead-dark">
                  {reportSummary.report_type === "Monthly" ||
                  reportSummary.report_type === "Yearly" ? (
                    <>
                      <tr className="table_heading_tr">
                        <th rowSpan="2">SL</th>
                        <th rowSpan="2">ITEM DETAILS</th>

                        {Array.from(
                          { length: reportSummary.report_length },
                          (_, i) => (
                            <th key={i} colSpan="2">
                              {reportSummary.report_type === "Monthly"
                                ? i + 1
                                : months[i].title}
                            </th>
                          )
                        )}

                        <th rowSpan="2">O. B.</th>
                        <th rowSpan="2">R.</th>
                        <th rowSpan="2">T.</th>
                        <th rowSpan="2">I.</th>
                        <th rowSpan="2">BL</th>
                      </tr>
                      <tr>
                        {Array.from(
                          { length: reportSummary.report_length },
                          (_, i) => (
                            <React.Fragment key={i}>
                              <th>R</th>
                              <th>I</th>
                            </React.Fragment>
                          )
                        )}
                      </tr>
                    </>
                  ) : (
                    <tr className="table_heading_tr">
                      <th>SL</th>
                      <th>ITEM DETAILS </th>
                      <th>OPENING BL</th>
                      <th>RECEIVES</th>
                      <th>TOTAL</th>
                      <th>ISSUES</th>
                      <th>BALANCE</th>
                    </tr>
                  )}
                </thead>

                <tbody>
                  <>
                    {reports.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <strong>{item.item_title}</strong>
                          <br />
                          UNIT: {item.unit}, TYPE: {item.type}
                        </td>

                        {item.records.map((record, idx) => (
                          <React.Fragment key={idx}>
                            <td>
                              {record.receives > 0 ? (
                                <strong>{record.receives}</strong>
                              ) : (
                                <>{record.receives}</>
                              )}
                            </td>
                            <td>
                              {record.issues > 0 ? (
                                <strong>{record.issues}</strong>
                              ) : (
                                <>{record.issues}</>
                              )}
                            </td>
                          </React.Fragment>
                        ))}
                        <td>
                          <strong>{item.opening_balance}</strong>
                        </td>
                        <td>
                          <strong>{item.total_receives}</strong>
                        </td>
                        <td>
                          <strong>{item.total}</strong>
                        </td>
                        <td>
                          <strong>{item.total_issues}</strong>
                        </td>
                        <td>
                          <strong>{item.balance}</strong>
                        </td>
                      </tr>
                    ))}
                  </>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
