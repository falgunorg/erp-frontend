import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import swal from "sweetalert";

export default function AdminPurchases(props) {
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);
  const [page, setPage] = useState(1);
  const onPageChange = (page) => {
    setPage(page);
  };
  const [paginationData, setPaginationData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  // filtering

  const [filterData, setFilterData] = useState({
    from_date: "",
    to_date: "",
    status: "",
    num_of_row: 20,
    vendor: "",
    buyer: "",
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
    });
  };

  // get all purchases

  const [purchases, setPurchases] = useState([]);
  const getPurchases = async () => {
    setSpinner(true);
    var response = await api.post("/admin/purchases", {
      status: filterData.status,
      vendor: filterData.vendor,
      buyer: filterData.buyer,
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      num_of_row: filterData.num_of_row,
    });

    if (response.status === 200 && response.data) {
      setPurchases(response.data.data);
      setPaginationData(response.data.paginationData);
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
  }, [page]);
  useEffect(async () => {
    getPurchases();
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
            <div className="col-lg-2">
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
            <div className="col-lg-2">
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
          <table className="table">
            <thead className="bg-dark text-white">
              <tr>
                <th>#</th>
                <th>PO Number</th>
                <th>Buyer</th>
                <th>Vendor</th>
                <th>Season</th>
                <th>Currency</th>
                <th>Issued Date</th>
                <th>Shipment Date</th>
                <th>Delivery Date</th>
                <th>Total Amount</th>
                <th>Status</th>
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
                        <td>{index + 1}</td>
                        <td>{item.po_number}</td>
                        <td>{item.buyer}</td>
                        <td>{item.vendor}</td>
                        <td>{item.season}</td>
                        <td>{item.currency}</td>

                        <td>{item.issued_date}</td>
                        <td>{item.shipment_date}</td>
                        <td>{item.delivery_date}</td>
                        <td>{item.total_amount}</td>
                        <td>{item.status}</td>
                        <td>
                          <div className="text-center">
                            <Link
                              className="btn btn-success btn-sm"
                              to={"/admin/purchases-details/" + item.id}
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
                  {purchases.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.po_number}</td>
                      <td>{item.buyer}</td>
                      <td>{item.vendor}</td>
                      <td>{item.season}</td>
                      <td>{item.currency}</td>
                      <td>{item.issued_date}</td>
                      <td>{item.shipment_date}</td>
                      <td>{item.delivery_date}</td>
                      <td>{item.total_amount}</td>
                      <td>{item.status}</td>
                      <td>
                        <div className="text-center">
                          <Link
                            className="btn btn-success btn-sm"
                            to={"/admin/purchases-details/" + item.id}
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
