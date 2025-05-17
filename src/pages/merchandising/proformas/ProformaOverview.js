import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import swal from "sweetalert";
import { Badge } from "react-bootstrap";

export default function ProformaOverview(props) {
  const history = useHistory();
  const userInfo = props.userData;
  const [spinner, setSpinner] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filterData, setFilterData] = useState({
    from_date: "",
    to_date: "",
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
      num_of_row: 20,
      view:
        userInfo.designation_title === "Assistant Manager" ? "team" : "self",
    });
  };

  // get all bookings
  const [bookings, setBookings] = useState([]);
  const getBookings = async () => {
    setSpinner(true);
    var response = await api.post("/booking-items-without-included-pi", {
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      department: userInfo.department_title,
      designation: userInfo.designation_title,
      view: filterData.view,
      booking_user: userInfo.userId,
    });
    if (response.status === 200 && response.data) {
      setBookings(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getBookings();
  }, [filterData]);

  useEffect(async () => {
    props.setSection("merchandising");
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      const allowedDepartments = [
        "Merchandising",
        "Sample",
        "Planing",
        "Management",
        "Commercial",
        "Accounts & Finance",
        "IT",
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
        <div className="page_name">Proforma Overview</div>
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
                  <Link
                    to="#"
                    className="btn btn-warning"
                    onClick={clearFields}
                  >
                    <i className="fas fa-retweet"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr></hr>
        <div className="lists">
          {bookings.map((booking, index) => (
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
                  <h6>BOOKING NO</h6>
                  <p>{booking.booking_number}</p>
                </div>
                <div className="item">
                  <h6>BOOKING BY</h6>
                  <p>{booking.user}</p>
                </div>
                <div className="item">
                  <h6>SUPPLIER</h6>
                  <p>{booking.supplier_name}</p>
                </div>
              </div>

              <hr className="my-4" />
              <div className="table-responsive">
                <table className="table text-start align-middle table-bordered table-hover mb-0">
                  <thead className="bg-dark text-white">
                    <tr>
                      <th>#</th>
                      <th>BUDGET</th>
                      <th>PO | TECHPACK</th>
                      <th>ITEM</th>
                      <th>DETAILS</th>
                      <th>UNIT</th>
                      <th>QTY</th>

                      <th>UNIT PRICE</th>
                      <th>TOTAL</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {booking?.booking_items.length > 0 &&
                      booking?.booking_items.map((item, index2) => (
                        <tr key={index2} className={item.booking_status}>
                          <td>{index + 1}</td>
                          <td>{item.budget_number}</td>
                          <td>
                            {item.po_number} | {item.techpack}
                          </td>
                          <td>{item.item_name}</td>
                          <td>
                            Buyer: {item.buyer} | Color:
                            {item.color} | Size: {item.size} | Shade:{" "}
                            {item.shade} | Tex: {item.tex}
                          </td>
                          <td>{item.unit}</td>
                          <td>{item.qty}</td>

                          <td>{item.unit_price}</td>
                          <td>{item.total}</td>

                          <td>
                            {booking.user_id === userInfo.userId &&
                            item.exist_proforma === 0 ? (
                              <>
                                <Link
                                  to={
                                    "/merchandising/proformas-create-auto/" +
                                    booking.supplier_id
                                  }
                                  className="btn btn-success btn-sm"
                                >
                                  SUBMIT PI
                                </Link>
                              </>
                            ) : (
                              <Badge>Already Submitted</Badge>
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
