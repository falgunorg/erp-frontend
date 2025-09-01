import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import Select from "react-select";
import Pagination from "../../../elements/Pagination";
import Accordion from "react-bootstrap/Accordion";
import moment from "moment";

export default function PowerRequisitions(props) {
  const userInfo = props.userData;
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
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [total, setTotal] = useState(0);
  const [links, setLinks] = useState([]);

  //FILTERING
  const [filterData, setFilterData] = useState({
    period: "",
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    from_date: "",
    to_date: "",
    company_id: "",
    department: "",
    status: "",
    user_id: "",
  });
  const clearFields = () => {
    setFilterData({
      period: "",
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      from_date: "",
      to_date: "",
      company_id: "",
      department: "",
      status: "",
      user_id: "",
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

  const [companies, setCompanies] = useState([]);
  const getCompanies = async () => {
    setSpinner(true);
    // Send the correct page parameter to the API request
    var response = await api.post("/common/companies", {
      type: "Own",
    });
    if (response.status === 200 && response.data) {
      setCompanies(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const [employees, setEmployees] = useState([]);
  const getEmployees = async (issue_type) => {
    setSpinner(true);
    var response = await api.post("/employees", {
      issue_type: "Self",
      without_me: true,
    });
    if (response.status === 200 && response.data) {
      setEmployees(response.data.data);
    }
    setSpinner(false);
  };

  const [departments, setDepartments] = useState([]);
  const getDepartments = async () => {
    setSpinner(true);
    // Send the correct page parameter to the API request
    var response = await api.post("/common/departments");
    if (response.status === 200 && response.data) {
      setDepartments(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  // get all store items
  const [requisitions, setSubstores] = useState([]);
  const getReports = async () => {
    setSpinner(true);

    // Send the correct page parameter to the API request
    var response = await api.post("/power/substores/requisitions", {
      search: searchValue,
      period: filterData.period,
      year: filterData.year,
      month: filterData.month,
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      company_id: filterData.company_id,
      department: filterData.department,
      status: filterData.status,
      user_id: filterData.user_id,
      page: currentPage,
    });

    if (response.status === 200 && response.data) {
      // Update the state with pagination data
      setSubstores(response.data.requisitions.data);
      setLinks(response.data.requisitions.links);
      setFrom(response.data.requisitions.from);
      setTo(response.data.requisitions.to);
      setTotal(response.data.requisitions.total);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getReports();
  }, [currentPage, searchValue]);

  useEffect(async () => {
    getReports();
  }, []);

  useEffect(async () => {
    getCompanies();
    getDepartments();
    getEmployees();
  }, []);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      {userInfo.userId === 1 ? (
        <>
          <div className="create_page_heading">
            <div className="page_name">Requisitions</div>
            <div className="actions">
              <Link
                to="/power/substore/settings"
                className="btn btn-danger rounded-circle"
              >
                <i className="fal fa-times"></i>
              </Link>
            </div>
          </div>

          <div className="datrange_filter non_printing_area">
            <div className="row">
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
              <div className="col">
                <div className="form-group">
                  <label>Period</label>
                  <select
                    value={filterData.period}
                    className="form-select"
                    name="period"
                    onChange={(event) =>
                      filterChange("period", event.target.value)
                    }
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
                  <label>Department</label>
                  <select
                    value={filterData.department}
                    className="form-select"
                    name="department"
                    onChange={(event) =>
                      filterChange("department", event.target.value)
                    }
                  >
                    <option value="">Select</option>
                    {departments.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={filterData.status}
                    className="form-select"
                    name="status"
                    onChange={(event) =>
                      filterChange("status", event.target.value)
                    }
                  >
                    <option value="">Select</option>
                    <option value="Pending">Pending</option>
                    <option value="Recommended">Recommended</option>
                    <option value="Valuated">Valuated</option>
                    <option value="Checked">Checked </option>
                    <option value="Finalized">Finalized</option>
                  </select>
                </div>
              </div>

              <div className="col">
                <div className="form-group">
                  <label>BY</label>
                  <Select
                    placeholder="Select"
                    value={
                      employees.find((item) => item.id === filterData.user_id)
                        ? {
                            value: filterData.user_id,
                            label:
                              employees.find(
                                (item) => item.id === filterData.user_id
                              ).full_name || "",
                          }
                        : null
                    }
                    onChange={(selectedOption) =>
                      filterChange("user_id", selectedOption.value)
                    }
                    name="user_id"
                    options={employees.map((item) => ({
                      value: item.id,
                      label: item.full_name,
                    }))}
                  />
                </div>
              </div>

              <div className="col">
                <br />
                <button
                  onClick={getReports}
                  className="btn btn-success btn-sm me-2"
                >
                  <i className="fas fa-search"></i>
                </button>{" "}
                <button
                  onClick={clearFields}
                  className="btn btn-warning btn-sm"
                >
                  <i className="fas fa-retweet"></i>
                </button>{" "}
              </div>
            </div>
          </div>
          <hr />
          <div className="employee_lists">
            <Accordion>
              <Accordion.Item>
                <Accordion.Header>
                  <div
                    className="accordion_table"
                    style={{
                      display: "grid",
                      gap: "15px",
                      gridTemplateColumns: "repeat(6, 1fr)",
                      width: "100%",
                    }}
                  >
                    <div className="item">
                      <strong>SL</strong>
                    </div>
                    <div className="item">
                      <strong>DATE</strong>
                    </div>
                    <div className="item">
                      <strong>VENDOR</strong>
                    </div>
                    <div className="item">
                      <strong>BY</strong>
                    </div>

                    <div className="item">
                      <strong>T.A</strong>
                    </div>
                    <div className="item">
                      <strong>STATUS</strong>
                    </div>
                  </div>
                </Accordion.Header>
              </Accordion.Item>

              {requisitions.map((requisition, index) => (
                <Accordion.Item eventKey={index} key={index}>
                  <Accordion.Header className={requisition.status}>
                    <div
                      className={requisition.status + " accordion_table"}
                      style={{
                        display: "grid",
                        gap: "15px",
                        gridTemplateColumns: "repeat(6, 1fr)",
                        width: "100%",
                      }}
                    >
                      <div className="item">
                        {requisition.requisition_number}
                      </div>
                      <div className="item">
                        {moment(requisition.created_at).format("lll")}
                      </div>
                      <div className="item">
                        {requisition.company} | {requisition.department_title}
                      </div>
                      <div className="item">{requisition.requisition_by}</div>
                      <div className="item">{requisition.total_amount}</div>
                      <div className="item">{requisition.status}</div>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <Link
                      className="btn btn-warning"
                      to={
                        "/power/substores/requisitions/edit/" + requisition.id
                      }
                    >
                      REVISE
                    </Link>
                    <br />
                    <div className="Import_booking_item_table">
                      <table className="table text-start align-middle table-bordered table-hover mb-0">
                        <thead className="bg-dark text-white">
                          <tr>
                            <th>SL</th>
                            <th>Item</th>
                            <th>Unit</th>
                            <th>Inhand QTY</th>
                            <th>Req QTY</th>
                            <th>Recommended QTY</th>
                            <th>Audited QTY</th>
                            <th>Final QTY</th>
                            <th>Purchase QTY</th>
                            <th>Aprox. Rate</th>
                            <th>Final Rate</th>
                            <th>Total</th>
                            <th>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requisition.requisition_items.map(
                            (item, itemIndex) => (
                              <tr key={itemIndex}>
                                <td>{itemIndex + 1}</td>
                                <td>{item.part_name}</td>
                                <td>{item.unit}</td>
                                <td>{item.stock_in_hand}</td>
                                <td>{item.qty}</td>
                                <td>
                                  {requisition.recommended_by > 0
                                    ? item.recommand_qty
                                    : ""}
                                </td>
                                <td>
                                  {requisition.checked_by > 0
                                    ? item.audit_qty
                                    : ""}
                                </td>
                                <td>
                                  {requisition.finalized_by > 0
                                    ? item.final_qty
                                    : ""}
                                </td>
                                <td>{item.purchase_qty}</td>
                                <td>{item.rate}</td>
                                <td>{item.final_rate}</td>
                                <td>{item.total}</td>
                                <td>{item.remarks}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan={11} className="text-center">
                              <h6>
                                <strong>TOTAL</strong>
                              </h6>
                            </td>
                            <td>
                              <strong>{requisition.total_amount}</strong>
                            </td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                      <br />
                    </div>
                    <div className="signature_block">
                      {requisition.placed_by > 0 && (
                        <div className="item">
                          <img
                            className="signature"
                            src={requisition.placed_by_sign}
                            alt="Placed By Signature"
                          />
                          <div className="sign_time">
                            {moment(requisition.placed_at).format("lll")}
                          </div>
                          <h6>Placed</h6>
                        </div>
                      )}
                      {requisition.rejected_by > 0 && (
                        <div className="item">
                          <img
                            className="signature"
                            src={requisition.rejected_by_sign}
                            alt="Rejected By Signature"
                          />
                          <div className="sign_time">
                            {moment(requisition.rejected_at).format("lll")}
                          </div>
                          <h6 className="text-danger">Rejected</h6>
                        </div>
                      )}
                      {requisition.recommended_by > 0 && (
                        <div className="item">
                          <img
                            className="signature"
                            src={requisition.recommended_by_sign}
                            alt="Recommended By Signature"
                          />
                          <div className="sign_time">
                            {moment(requisition.recommended_at).format("lll")}
                          </div>
                          <h6>Recommended</h6>
                        </div>
                      )}
                      {requisition.checked_by > 0 && (
                        <div className="item">
                          <img
                            className="signature"
                            src={requisition.checked_by_sign}
                            alt="Checked By Signature"
                          />
                          <div className="sign_time">
                            {moment(requisition.checked_at).format("lll")}
                          </div>
                          <h6 className="text-success">Checked</h6>
                        </div>
                      )}
                      {requisition.approved_by > 0 && (
                        <div className="item">
                          <img
                            className="signature"
                            src={requisition.approved_by_sign}
                            alt="Approved By Signature"
                          />
                          <div className="sign_time">
                            {moment(requisition.approved_at).format("lll")}
                          </div>
                          <h6>Approved</h6>
                        </div>
                      )}
                      {requisition.finalized_by > 0 && (
                        <div className="item">
                          <img
                            className="signature"
                            src={requisition.finalized_by_sign}
                            alt="Finalized By Signature"
                          />
                          <div className="sign_time">
                            {moment(requisition.finalized_at).format("lll")}
                          </div>
                          <h6>Finalized</h6>
                        </div>
                      )}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>

            <br />
            <h6 className="text-center">
              Showing {from} To {to} From {total}
            </h6>

            <Pagination
              links={links}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          </div>
        </>
      ) : (
        <h1 className="text-uppercase text-danger">
          You are on wrong place baby! Beware of dogs.
        </h1>
      )}
    </div>
  );
}
