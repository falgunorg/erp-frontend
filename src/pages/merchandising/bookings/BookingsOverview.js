import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import moment from "moment/moment";
import swal from "sweetalert";

export default function BookingsOverview(props) {
  const history = useHistory();
  const userInfo = props.userData;
  const [spinner, setSpinner] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filterData, setFilterData] = useState({
    from_date: "",
    to_date: "",
    num_of_row: 20,
    purchase_id: "",
    view: userInfo.designation_title === "Assistant Manager" ? "team" : "self",
  });
  const filterChange = (event) => {
    setFilterData({ ...filterData, [event.target.name]: event.target.value });
  };

  const clearFields = () => {
    setFilterData({
      from_date: "",
      to_date: "",
      num_of_row: 20,
      purchase_id: "",
      view:
        userInfo.designation_title === "Assistant Manager" ? "team" : "self",
    });
  };

  // get all budgets
  const [budgets, setBudegts] = useState([]);
  const getBudgets = async () => {
    setSpinner(true);
    var response = await api.post("/merchandising/bookings-overview", {
      purchase_id: filterData.purchase_id,
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      num_of_row: filterData.num_of_row,
      department: userInfo.department_title,
      designation: userInfo.designation_title,
      view: filterData.view,
    });
    if (response.status === 200 && response.data) {
      setBudegts(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const [purchases, setPurchases] = useState([]);
  const getPurchases = async () => {
    setSpinner(true);
    var response = await api.post("/merchandising/purchases");
    if (response.status === 200 && response.data) {
      setPurchases(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getPurchases();
  }, []);

  useEffect(async () => {
    getBudgets();
  }, [filterData]);

  useEffect(async () => {
    props.setSection("merchandising");
  }, []);

  

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Booking Overview</div>
        <div className="actions">
          <input
            type="search"
            onChange={(e) => setSearchValue(e.target.value)}
            // type="text"
            value={searchValue}
            className="form-control"
            placeholder="Search"
          />

          {userInfo.department_title === "Merchandising" &&
          userInfo.designation_title !== "Deputy General Manager" ? (
            <Link
              to="/merchandising/bookings-create"
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
                <label>PO</label>
                <select
                  onChange={filterChange}
                  value={filterData.purchase_id}
                  name="purchase_id"
                  className="form-select"
                >
                  <option value="">Select PO</option>
                  {purchases.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.po_number}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-lg-2">
              <div className="form-group">
                <label>NUM Of Rows</label>
                <div className="d-flex gap_10">
                  <select
                    onChange={filterChange}
                    value={filterData.num_of_row}
                    name="num_of_row"
                    className="form-select margin_bottom_0"
                  >
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="75">75</option>
                    <option value="100">100</option>
                  </select>
                  <Link to="#" className="btn btn-warning" onClick={clearFields}>
                    <i className="fas fa-retweet"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr></hr>
        <div className="lists">
          {budgets.map((budget, index) => (
            <div
              key={index}
              style={{
                background: "rgb(223 223 223)",
                border: "1px solid grey",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "5px",
              }}
              className="jumbotron"
            >
              <div
                className="d-flex"
                style={{ justifyContent: "space-between" }}
              >
                <div className="item">
                  <h6>BUDGET</h6>
                  <p>{budget.budget_number}</p>
                </div>
                <div className="item">
                  <h6>PO</h6>
                  <p>{budget.po_number}</p>
                </div>
                <div className="item">
                  <h6>STYLE/TECHPACK</h6>
                  <p>{budget.techpack}</p>
                </div>
                <div className="item">
                  <h6>BUDGET BY</h6>
                  <p>{budget.user}</p>
                </div>
                <div className="item">
                  <h6>QTY(PCS)</h6>
                  <p>{budget.qty}</p>
                </div>
              </div>

              <hr className="my-4" />
              <div className="table-responsive">
                <table className="table text-start align-middle table-bordered table-hover mb-0">
                  <thead className="bg-dark text-white">
                    <tr>
                      <th>#</th>
                      <th>Item</th>
                      <th>Supplier</th>
                      <th>Budget Qty</th>
                      <th>Booking Qty</th>
                      <th>Left Booking</th>
                      <th>Inhoused Qty</th>
                      <th>Left Inhoused Qty</th>
                      <th>Used Qty</th>
                      <th>Stock Qty</th>
                      <th>Booking Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budget?.budget_items.map((item, index2) => (
                      <tr key={index2} className={item.booking_status}>
                        <td>{index + 1}</td>
                        <td>{item.item_name}</td>
                        <td>{item.supplier}</td>
                        <td>{item.total_req_qty}</td>
                        <td>{item.booking_qty}</td>
                        <td>{item.left_booking}</td>
                        <td>{item.received_qty}</td>
                        <td>{item.left_received_qty}</td>
                        <td>{item.used_qty}</td>
                        <td>{item.store_balance}</td>
                        <td>
                          {item.booking_status}
                          {budget.user_id === userInfo.userId &&
                            item.booking_status !== "Booked" && (
                              <>
                                {" "}
                                |{" "}
                                <Link
                                  to={
                                    "/merchandising/auto-bookings-create/" +
                                    item.supplier_id +
                                    "/" +
                                    item.budget_id
                                  }
                                  className="btn btn-success btn-sm"
                                >
                                  Book Now
                                </Link>
                              </>
                            )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
      <br />
      <br />
    </div>
  );
}
