import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import Select from "react-select";
import Pagination from "../../../elements/Pagination";
import moment from "moment";
import swal from "sweetalert";

// import Offcanvas from "react-bootstrap";

export default function PowerIssues(props) {
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

  // get all store items
  const [issues, setIssues] = useState([]);
  const getReports = async () => {
    setSpinner(true);

    // Send the correct page parameter to the API request
    var response = await api.post("/power/substores/issues", {
      period: filterData.period,
      year: filterData.year,
      month: filterData.month,
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      company_id: filterData.company_id,

      user_id: filterData.user_id,
      page: currentPage,
    });

    if (response.status === 200 && response.data) {
      // Update the state with pagination data
      setIssues(response.data.issues.data);
      setLinks(response.data.issues.links);
      setFrom(response.data.issues.from);
      setTo(response.data.issues.to);
      setTotal(response.data.issues.total);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getReports();
  }, [currentPage]);

  useEffect(async () => {
    getReports();
  }, []);

  const handleUndoIssue = (id) => {
    swal({
      title: "Are you sure?",
      text: "Do you really want to Undo this item?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // Create an async function inside the then block to handle the async operation
        (async () => {
          try {
            var response = await api.post("/substores-issue-undo", {
              id: id,
            });

            if (response.status === 200 && response.data) {
              swal({
                title: "Undo Success",
                text: "Item Undo successfully",
                icon: "success",
              });
              getReports();
            } else {
              swal({
                title: "Undo Failed",
                text: response.data.errors.message,
                icon: "error",
              });
            }
          } catch (error) {
            swal({
              title: "Undo Failed",
              text: "An error occurred while undo the item",
              icon: "error",
            });
          }
        })();
      } else {
        swal("Item is safe!");
      }
    });
  };

  useEffect(async () => {
    getCompanies();
    getEmployees();
  }, []);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}

      {userInfo.userId === 1 ? (
        <>
          <div className="create_page_heading">
            <div className="page_name">Issues</div>
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
                  <label>TYPE</label>
                  <select
                    value={filterData.type}
                    className="form-select"
                    name="type"
                    onChange={(event) =>
                      filterChange("type", event.target.value)
                    }
                  >
                    <option value="">All</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Spare Parts">Spare Parts</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Needle">Needle</option>
                    <option value="Medical">Medical</option>
                    <option value="Fire">Fire</option>
                    <option value="Compressor & boiler">
                      Compressor & boiler
                    </option>
                    <option value="Chemical">Chemical</option>
                    <option value="Printing">Printing</option>
                    <option value="It">It</option>
                    <option value="WTP">WTP</option><option value="Vehicle">Vehicle</option>
<option value="Compliance">Compliance</option>
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
            <table
              className={"table table-bordered table-striped print-table "}
            >
              <thead className="print-thead thead-dark">
                <tr className="table_heading_tr">
                  <th>SL</th>
                  <th>DATE</th>
                  <th>TYPE</th>
                  <th>STORE REQ </th>
                  <th>VENDOR</th>
                  <th>ITEM DETAILS </th>
                  <th>ISSUE TO </th>
                  <th>LINE/SEC </th>
                  <th>REF</th>
                  <th>ISSUE/DEL BY</th>
                  <th>QTY</th>
                </tr>
              </thead>

              <tbody>
                <>
                  {issues.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <strong>{index + 1}</strong>{" "}
                        <button
                          onClick={() => handleUndoIssue(item.id)}
                          className="btn btn-sm btn-danger"
                        >
                          <i className="fa fa-times"></i>
                        </button>
                      </td>
                      <td>
                        <strong>{moment(item.issue_date).format("ll")}</strong>
                      </td>
                      <td>
                        <strong>{item.issue_type}</strong>
                      </td>
                      <td>
                        <strong>{item.request_number}</strong>
                      </td>
                      <td>
                        <strong>{item.company}</strong>
                      </td>
                      <td>
                        <strong>{item.part_name}</strong>
                        <br />
                        UNIT: {item.unit}, TYPE:{item.type}
                      </td>
                      <td>
                        <strong>{item.issue_to_show}</strong>
                      </td>

                      <td>
                        <strong>{item.line}</strong>
                      </td>
                      <td>
                        <strong>{item.reference}</strong>
                      </td>
                      <td>
                        <strong>{item.user}</strong>
                      </td>
                      <td>
                        <strong>{item.qty}</strong>
                      </td>
                    </tr>
                  ))}
                </>
              </tbody>
            </table>

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
