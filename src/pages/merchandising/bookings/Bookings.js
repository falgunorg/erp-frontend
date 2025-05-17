import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import moment from "moment/moment";
import swal from "sweetalert";

export default function Bookings(props) {
  const history = useHistory();
  const userInfo = props.userData;
  const [spinner, setSpinner] = useState(false);

  const [searchValue, setSearchValue] = useState("");

  const [filterData, setFilterData] = useState({
    from_date: "",
    to_date: "",
    num_of_row: 20,
    status: "",
    supplier_id: "",
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
      status: "",
      supplier_id: "",
      view:
        userInfo.designation_title === "Assistant Manager" ? "team" : "self",
    });
  };

  // get all bookings

  const [bookings, setBookings] = useState([]);

  const getBookings = async () => {
    setSpinner(true);
    var response = await api.post("/bookings", {
      status: filterData.status,
      supplier_id: filterData.supplier_id,
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      num_of_row: filterData.num_of_row,
      department: userInfo.department_title,
      designation: userInfo.designation_title,
      view: filterData.view,
    });

    if (response.status === 200 && response.data) {
      setBookings(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const [suppliers, setSuppliers] = useState([]);
  const getSuppliers = async () => {
    setSpinner(true);
    var response = await api.post("/suppliers");
    if (response.status === 200 && response.data) {
      setSuppliers(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getSuppliers();
  }, []);

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
        <div className="page_name">Bookings</div>
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
                <label>Supplier</label>
                <select
                  onChange={filterChange}
                  value={filterData.supplier_id}
                  name="supplier_id"
                  className="form-select"
                >
                  <option value="">Select supplier</option>
                  {suppliers.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.company_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-lg-2">
              <div className="form-group">
                <label>Status</label>
                <select
                  onChange={filterChange}
                  name="status"
                  value={filterData.status}
                  className="form-select"
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
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
        <div className="table-responsive">
          <table className="table text-start align-middle table-bordered table-hover mb-0">
            <thead className="bg-dark text-white">
              <tr>
                <th>#</th>
                <th>Booking Number</th>
                <th>Supplier</th>
                <th>Booking Date</th>
                <th>Delivery Date</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Booking By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchValue ? (
                <>
                  {bookings
                    .filter((item) => {
                      if (!searchValue) return false;
                      const lowerCaseSearchValue = searchValue.toLowerCase();
                      return (
                        item.booking_number
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.supplier
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.currency
                          .toLowerCase()
                          .includes(lowerCaseSearchValue)
                      );
                    })
                    .map((item, index) => (
                      <tr key={index} className={item.status}>
                        <td>{index + 1}</td>
                        <td>{item.booking_number}</td>
                        <td>{item.supplier}</td>

                        <td> {moment(item.booking_date).format("ll")}</td>
                        <td>{moment(item.delivery_date).format("ll")}</td>
                        <td>
                          {item.total_amount} {item.currency}
                        </td>
                        <td>{item.status}</td>
                        <td>{item.user}</td>
                        <td>
                          <div className="d-flex gap_10">
                            <Link
                              to={"/merchandising/bookings-details/" + item.id}
                            >
                              <i className="fas fa-eye text-info"></i>
                            </Link>
                            {userInfo.userId === item.user_id &&
                            item.status === "Pending" ? (
                              <Link
                                to={"/merchandising/bookings-edit/" + item.id}
                              >
                                <i className="fa fa-pen text-warning"></i>
                              </Link>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                </>
              ) : (
                <>
                  {bookings.map((item, index) => (
                    <tr key={index} className={item.status}>
                      <td>{index + 1}</td>
                      <td>{item.booking_number}</td>
                      <td>{item.supplier}</td>

                      <td> {moment(item.booking_date).format("ll")}</td>
                      <td>{moment(item.delivery_date).format("ll")}</td>
                      <td>
                        {item.total_amount} {item.currency}
                      </td>
                      <td>{item.status}</td>
                      <td>{item.user}</td>
                      <td>
                        <div className="d-flex gap_10">
                          <Link
                            to={"/merchandising/bookings-details/" + item.id}
                          >
                            <i className="fas fa-eye text-info"></i>
                          </Link>
                          {userInfo.userId === item.user_id &&
                          item.status === "Pending" ? (
                            <Link
                              to={"/merchandising/bookings-edit/" + item.id}
                            >
                              <i className="fa fa-pen text-warning"></i>
                            </Link>
                          ) : null}
                        </div>
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
