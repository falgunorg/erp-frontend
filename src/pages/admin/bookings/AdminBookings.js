import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import swal from "sweetalert";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import moment from "moment/moment";

export default function AdminBookings(props) {
  const history = useHistory();

  const [spinner, setSpinner] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filterData, setFilterData] = useState({
    from_date: "",
    to_date: "",
    num_of_row: 20,
    status: "",
    supplier_id: "",
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
    });
  };

  // get all bookings
  const [bookings, setBookings] = useState([]);
  const getBookings = async () => {
    setSpinner(true);
    var response = await api.post("/admin/bookings", {
      status: filterData.status,
      supplier_id: filterData.supplier_id,
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      num_of_row: filterData.num_of_row,
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
    var response = await api.post("/admin/suppliers");
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
      if (props.userData?.role !== "Admin") {
        await swal({
          icon: "error",
          text: "You Cannot Access This Section.",
          closeOnClickOutside: false,
        });

        history.push("/dashboard");
      }
    };
    checkAccess();
  }, [props, history]);

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
        </div>
      </div>
      <div className="employee_lists">
        <div className="datrange_filter">
          <div className="row">
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
                  <Link className="btn btn-warning" onClick={clearFields}>
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
                <th>Currency</th>
                <th>Booking Date</th>
                <th>Delivery Date</th>
                <th>Total Amount</th>
                <th>Status</th>
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
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.booking_number}</td>
                        <td>{item.supplier}</td>
                        <td>{item.currency}</td>
                        <td> {moment(item.booking_date).format("ll")}</td>
                        <td>{moment(item.delivery_date).format("ll")}</td>
                        <td>{item.total_amount}</td>
                        <td>{item.status}</td>
                        <td>
                          <div className="d-flex gap_10">
                            <Link
                              className="btn btn-success btn-sm"
                              to={"/admin/bookings-details/" + item.id}
                            >
                              Details
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                </>
              ) : (
                <>
                  {bookings.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.booking_number}</td>
                      <td>{item.supplier}</td>
                      <td>{item.currency}</td>
                      <td> {moment(item.booking_date).format("ll")}</td>
                      <td>{moment(item.delivery_date).format("ll")}</td>
                      <td>{item.total_amount}</td>
                      <td>{item.status}</td>
                      <td>
                        <div className="d-flex gap_10">
                          <Link
                            className="btn btn-success btn-sm"
                            to={"/admin/bookings-details/" + item.id}
                          >
                            Details
                          </Link>
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
