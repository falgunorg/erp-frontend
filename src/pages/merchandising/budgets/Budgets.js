import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import moment from "moment/moment";
import swal from "sweetalert";

export default function Budgets(props) {
  const history = useHistory();
  const userInfo = props.userData;
  const [spinner, setSpinner] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [filterData, setFilterData] = useState({
    from_date: "",
    to_date: "",
    status: "",
    num_of_row: 20,
    view: userInfo.designation_title === "Assistant Manager" ? "team" : "self",
  });
  const filterChange = (event) => {
    setFilterData({ ...filterData, [event.target.name]: event.target.value });
  };
  const clearFields = () => {
    setFilterData({
      from_date: "",
      to_date: "",
      status: "",
      num_of_row: 20,
      view:
        userInfo.designation_title === "Assistant Manager" ? "team" : "self",
    });
  };

  // get all budgets
  const [budgets, setBudgets] = useState([]);
  const getBudgets = async () => {
    setSpinner(true);
    var response = await api.post("/merchandising/budgets", {
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      status: filterData.status,
      num_of_row: filterData.num_of_row,
      department: userInfo.department_title,
      designation: userInfo.designation_title,
      view: filterData.view,
    });
    if (response.status === 200 && response.data) {
      setBudgets(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getBudgets();
  }, []);
  useEffect(async () => {
    getBudgets();
  }, [filterData]);
  useEffect(async () => {
    props.setSection("merchandising");
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      const allowedDepartments = [
        "Merchandising",
        "Audit",
        "Accounts & Finance",
        "Management",
        "Planing",
      ];
      if (!allowedDepartments.includes(props.userData?.department_title)) {
        await swal({
          icon: "error",
          text: "You Cannot Access This Section.",
          closeOnClickOutside: false,
        });
        history.push("/dashboard");
      }
    };
    checkAccess();
  }, [props.userData?.department_title, history]);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Budget Files</div>
        <div className="actions">
          <input
            type="search"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            className="form-control"
            placeholder="Search"
          />

          {userInfo.department_title === "Merchandising" &&
          userInfo.designation_title !== "Deputy General Manager" ? (
            <Link
              to="/merchandising/budgets-create"
              className="btn btn-warning bg-falgun rounded-circle"
            >
              <i className="fal fa-plus"></i>
            </Link>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="employee_lists">
        <div className="datrange_filter">
          <div className="row">
            {userInfo.department_title === "Merchandising" && (
              <div className="col-lg-2">
                <div className="form-group">
                  <label>View Mode</label>
                  <select
                    onChange={filterChange}
                    value={filterData.view}
                    name="view"
                    className="form-select"
                  >
                    <option value="self">Self</option>
                    <option value="team">Team</option>
                  </select>
                </div>
              </div>
            )}
            <div className="col-lg-2">
              <div className="form-group">
                <label>From Date</label>
                <input
                  value={filterData.from_date}
                  onChange={filterChange}
                  name="from_date"
                  className="form-control"
                  type="date"
                />
              </div>
            </div>
            <div className="col-lg-2">
              <div className="form-group">
                <label>To Date</label>
                <input
                  onChange={filterChange}
                  value={filterData.to_date}
                  name="to_date"
                  className="form-control"
                  type="date"
                />
              </div>
            </div>
            <div className="col-lg-2">
              <div className="form-group">
                <label>Status</label>
                <select
                  onChange={filterChange}
                  value={filterData.status}
                  name="status"
                  className="form-select"
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Approved">Approved</option>
                </select>
              </div>
            </div>
            <div className="col-lg-2">
              <div className="form-group">
                <label>NUM Of Rows</label>
                <select
                  onChange={filterChange}
                  value={filterData.num_of_row}
                  name="num_of_row"
                  className="form-select"
                >
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="75">75</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
            <div className="col-lg-2">
              <div className="form-group">
                <label>Refresh</label>
                <div>
                  <Link to="#" className="btn btn-warning" onClick={clearFields}>
                    <i className="fas fa-retweet"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table text-start align-middle table-bordered table-hover mb-0">
            <thead className="bg-dark text-white">
              <tr>
                <th>#</th>
                <th>JOB/TAG</th>
                <th>Budget Number</th>
                <th>PO</th>
                <th>Style/Techpack</th>
                <th>Status</th>
                <th>Buyer</th>
                <th>Season</th>
                <th>Brand</th>
                <th>Qty (Pcs)</th>
                <th>Unit Cost</th>
                <th>Total Cost</th>
                <th>Total Value</th>
                <th>Cost (%)</th>
                <th>Balance</th>
                <th>Issued By</th>
                <th>Issued Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchValue ? (
                <>
                  {budgets
                    .filter((item) => {
                      if (!searchValue) return false;
                      const lowerCaseSearchValue = searchValue.toLowerCase();
                      return (
                        item.buyer
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.budget_number
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.brand.toLowerCase().includes(lowerCaseSearchValue)
                      );
                    })
                    .map((item, index) => (
                      <tr key={index} className={item.status}>
                        <td>{index + 1}</td>
                        <td>{item.tag_number}</td>
                        <td>{item.budget_number}</td>
                        <td>{item.po_number}</td>
                        <td>{item.techpack}</td>
                        <td>{item.status}</td>
                        <td>{item.buyer}</td>
                        <td>{item.season}</td>
                        <td>{item.brand}</td>
                        <td>{item.qty}</td>
                        <td>
                          {item.unit_cost} {item.currency}
                        </td>
                        <td>
                          {item.total_cost} {item.currency}
                        </td>
                        <td>
                          {item.total_order_value} {item.currency}
                        </td>
                        <td>{item.used_percentage.toFixed(2)} %</td>
                        <td>
                          {item.balance} {item.currency}
                        </td>
                        <td>{item.user}</td>
                        <td>{moment(item.issued_date).format("ll")}</td>

                        <td>
                          <Link
                            to={"/merchandising/budgets-details/" + item.id}
                          >
                            <i className="fa fa-eye mr-10 text-success"></i>
                          </Link>
                          {props.userData.userId === item.user_id &&
                          item.status === "Pending" ? (
                            <Link to={"/merchandising/budgets-edit/" + item.id}>
                              <i className="fa fa-pen"></i>
                            </Link>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                </>
              ) : (
                <>
                  {budgets.map((item, index) => (
                    <tr key={index} className={item.status}>
                      <td>{index + 1}</td>
                      <td>{item.tag_number}</td>
                      <td>{item.budget_number}</td>
                      <td>{item.po_number}</td>
                      <td>{item.techpack}</td>
                      <td>{item.status}</td>
                      <td>{item.buyer}</td>
                      <td>{item.season}</td>
                      <td>{item.brand}</td>
                      <td>{item.qty}</td>
                      <td>
                        {item.unit_cost} {item.currency}
                      </td>
                      <td>
                        {item.total_cost} {item.currency}
                      </td>
                      <td>
                        {item.total_order_value} {item.currency}
                      </td>
                      <td>{item.used_percentage.toFixed(2)} %</td>
                      <td>
                        {item.balance} {item.currency}
                      </td>
                      <td>{item.user}</td>
                      <td>{moment(item.issued_date).format("ll")}</td>

                      <td>
                        <Link to={"/merchandising/budgets-details/" + item.id}>
                          <i className="fa fa-eye mr-10 text-success"></i>
                        </Link>
                        {props.userData.userId === item.user_id &&
                        item.status === "Pending" ? (
                          <Link to={"/merchandising/budgets-edit/" + item.id}>
                            <i className="fa fa-pen"></i>
                          </Link>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <br />
      <br />
    </div>
  );
}
