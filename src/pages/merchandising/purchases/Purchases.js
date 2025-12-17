import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import swal from "sweetalert";
import moment from "moment";

export default function Purchases(props) {
  const userInfo = props.userData;
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  // filtering

  const [filterData, setFilterData] = useState({
    from_date: "",
    to_date: "",
    status: "",
    num_of_row: 20,
    vendor: "",
    buyer: "",
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
      vendor: "",
      buyer: "",
      view:
        userInfo.designation_title === "Assistant Manager" ? "team" : "self",
    });
  };

  // get all purchases

  const [purchases, setPurchases] = useState([]);
  const getPurchases = async () => {
    setSpinner(true);
    var response = await api.post("/merchandising/purchases", {
      status: filterData.status,
      vendor: filterData.vendor,
      buyer: filterData.buyer,
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      num_of_row: filterData.num_of_row,
      view: filterData.view,
      department: userInfo.department_title,
      designation: userInfo.designation_title,
    });

    if (response.status === 200 && response.data) {
      setPurchases(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const [companies, setCompanies] = useState([]);
  const getCompanies = async () => {
    var response = await api.post("/common/companies", { type: "Own" });
    if (response.status === 200 && response.data) {
      setCompanies(response.data.data);
    }
  };

  const [buyers, setBuyers] = useState([]);
  const getBuyers = async () => {
    setSpinner(true);
    var response = await api.post("/common/buyers");
    if (response.status === 200 && response.data) {
      setBuyers(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getCompanies();
    getBuyers();
  }, []);
  useEffect(async () => {
    getPurchases();
  }, [filterData]);
  useEffect(async () => {
    props.setSection("merchandising");
  }, []);

  

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Purchases Orders</div>
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
              to="/merchandising/purchases-create"
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
            <div className="col">
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
            <div className="col">
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
            <div className="col">
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
            <div className="col">
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
                  <option value="Recieved">Recieved</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>Buyer</label>
                <select
                  onChange={filterChange}
                  value={filterData.buyer}
                  name="buyer"
                  className="form-select"
                >
                  <option value="">Select buyer</option>
                  {buyers.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>Vendor</label>
                <select
                  onChange={filterChange}
                  value={filterData.vendor}
                  name="vendor"
                  className="form-select"
                >
                  <option value="">Select vendor</option>
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
          <table className="table">
            <thead className="bg-dark text-white">
              <tr>
                <th>SL</th>
                <th>PO Number</th>
                <th>Techpack/Style</th>
                <th>Buyer</th>
                <th>Vendor</th>
                <th>Season</th>
                <th>Order Date</th>
                <th>Shipment Date</th>
                <th>QTY</th>
                <th>Total Value</th>
                <th>Status</th>
                <th>Issue By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchValue ? (
                <>
                  {purchases
                    .filter((item) => {
                      if (!searchValue) return false;
                      const lowerCaseSearchValue = searchValue.toLowerCase();
                      return (
                        item.po_number
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.vendor
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.buyer
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.currency
                          .toLowerCase()
                          .includes(lowerCaseSearchValue)
                      );
                    })
                    .map((item, index) => (
                      <tr key={index}>
                        <td>{item.sd_po}</td>
                        <td>{item.po_number}</td>
                        <td>{item.techpack}</td>
                        <td>{item.buyer}</td>
                        <td>{item.vendor}</td>
                        <td>{item.season}</td>
                        <td>{moment(item.order_date).format("ll")}</td>
                        <td>{moment(item.shipment_date).format("ll")}</td>
                        <td>{item.total_qty}</td>
                        <td>
                          {item.total_amount} {item.currency}
                        </td>
                        <td>{item.status}</td>
                        <td>{item.user}</td>
                        <td>
                          <div className="d-flex gap_10">
                            {props.userData.userId === item.user_id && (
                              <Link
                                to={"/merchandising/purchases-edit/" + item.id}
                              >
                                <i className="fa fa-pen text-warning"></i>
                              </Link>
                            )}
                            <Link
                              to={"/merchandising/purchases-details/" + item.id}
                            >
                              <i className="fas fa-eye text-info"></i>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                </>
              ) : (
                <>
                  {purchases.map((item, index) => (
                    <tr key={index}>
                      <td>{item.sd_po}</td>
                      <td>{item.po_number}</td>
                      <td>{item.techpack}</td>
                      <td>{item.buyer}</td>
                      <td>{item.vendor}</td>
                      <td>{item.season}</td>
                      <td>{moment(item.order_date).format("ll")}</td>
                      <td>{moment(item.shipment_date).format("ll")}</td>
                      <td>{item.total_qty}</td>
                      <td>
                        {item.total_amount} {item.currency}
                      </td>
                      <td>{item.status}</td>
                      <td>{item.user}</td>
                      <td>
                        <div className="d-flex gap_10">
                          {props.userData.userId === item.user_id && (
                            <Link
                              to={"/merchandising/purchases-edit/" + item.id}
                            >
                              <i className="fa fa-pen text-warning"></i>
                            </Link>
                          )}
                          <Link
                            to={"/merchandising/purchases-details/" + item.id}
                          >
                            <i className="fas fa-eye text-info"></i>
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
