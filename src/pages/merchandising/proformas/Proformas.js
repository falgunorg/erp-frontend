import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import moment from "moment/moment";
import swal from "sweetalert";
import formatMoney from "services/moneyFormatter";
export default function Proformas(props) {
  const userInfo = props.userData;
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [filterData, setFilterData] = useState({
    from_date: "",
    to_date: "",
    status: "",
    num_of_row: 20,
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
    });
  };

  // get all proformas
  const [proformas, setProformas] = useState([]);
  const getProformas = async () => {
    setSpinner(true);
    var response = await api.post("/merchandising/proformas", {
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      status: filterData.status,
      num_of_row: filterData.num_of_row,
      department: userInfo.department_title,
      designation: userInfo.designation_title,
    });
    if (response.status === 200 && response.data) {
      setProformas(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getProformas();
  }, []);
  useEffect(async () => {
    getProformas();
  }, [filterData]);
  useEffect(async () => {
    props.setSection("merchandising");
  }, []);

 

  useEffect(async () => {
    props.setHeaderData({
      pageName: "PI'S",
      isNewButton: true,
      newButtonLink: "",
      newButtonText: "New PI",
      isInnerSearch: true,
      innerSearchValue: "",
    });
  }, []);

  return (
    <div className="create_edit_page create_technical_pack">
      {spinner && <Spinner />}

      <div className="employee_lists">
        <div className="datrange_filter ">
          <div className="row create_tp_body">
            <div className="col-lg-2">
              <div className="form-group">
                <label className="form-label">Search</label>
                <input
                  type="search"
                  onChange={(e) => setSearchValue(e.target.value)}
                  value={searchValue}
                  className="form-control"
                  placeholder="Search"
                />
              </div>
            </div>
            <div className="col-lg-2">
              <div className="form-group">
                <label className="form-label">From Date</label>
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
                <label className="form-label">To Date</label>
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
                <label className="form-label">Status</label>
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
                <label className="form-label">NUM Of Rows</label>
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
                <label className="form-label">Refresh</label>
                <div>
                  <Link
                    to="#"
                    className="btn btn-warning btn-sm me-4"
                    onClick={clearFields}
                  >
                    <i className="fas fa-retweet"></i>
                  </Link>
                  <Link
                    to="/merchandising/proformas-create"
                    className="btn btn-success btn-sm me-2"
                  >
                    Create New PI
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table text-start align-middle table-bordered table-hover mb-0">
            <thead className="bg-light text-white">
              <tr>
                <th>SL</th>
                <th>PI</th>
                <th>Responsible MR</th>
                <th>Issued Date</th>
                <th>Validity</th>
                <th>Status</th>
                <th>Supplier</th>
                <th>Net Weight(KG)</th>
                <th>Gross Weight(KG)</th>
                <th>Freight Charge</th>
                <th className="text-end">Total Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchValue ? (
                <>
                  {proformas
                    .filter((item) => {
                      if (!searchValue) return false;
                      const lowerCaseSearchValue = searchValue.toLowerCase();
                      return (
                        item.supplier
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.proforma_number
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.contract_number
                          .toLowerCase()
                          .includes(lowerCaseSearchValue)
                      );
                    })
                    .map((item, index) => (
                      <tr key={index} className={item.status}>
                        <td>{index + 1}</td>
                        <td>
                          <Link
                            to={"/merchandising/proformas-details/" + item.id}
                          >
                            {item.title}
                          </Link>{" "}
                        </td>
                        <td>{item.user}</td>
                        <td>{moment(item.issued_date).format("ll")}</td>
                        <td>{item.pi_validity}</td>
                        <td>{item.status}</td>
                        <td>{item.supplier}</td>
                        <td>{item.net_weight} KG</td>
                        <td>{item.gross_weight} KG</td>
                        <td>{item.freight_charge} USD</td>
                        <td className="text-end">
                          {formatMoney(item.total)} USD
                        </td>
                        <td>
                          <Link
                            to={"/merchandising/proformas-details/" + item.id}
                          >
                            <i className="fa fa-eye mr-10 text-white"></i>
                          </Link>
                          {props.userData.userId === item.user_id &&
                          (item.status === "Pending" ||
                            item.status === "Rejected") ? (
                            <Link
                              to={"/merchandising/proformas-edit/" + item.id}
                            >
                              <i className="fa fa-pen"></i>
                            </Link>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                </>
              ) : (
                <>
                  {proformas.map((item, index) => (
                    <tr key={index} className={item.status}>
                      <td>{index + 1}</td>
                      <td>
                        <Link
                          style={{ color: "white" }}
                          to={"/merchandising/proformas-details/" + item.id}
                        >
                          {item.title}
                        </Link>{" "}
                      </td>
                      <td>{item.user}</td>
                      <td>{moment(item.issued_date).format("ll")}</td>
                      <td>{item.pi_validity}</td>

                      <td>{item.status}</td>
                      <td>{item.supplier}</td>
                      <td>{item.net_weight} KG</td>
                      <td>{item.gross_weight} KG</td>
                      <td>{item.freight_charge} USD</td>
                      <td className="text-end">
                        {formatMoney(item.total)} USD
                      </td>
                      <td>
                        <Link
                          to={"/merchandising/proformas-details/" + item.id}
                        >
                          <i className="fa fa-eye mr-10 text-white"></i>
                        </Link>
                        {props.userData.userId === item.user_id &&
                        (item.status === "Pending" ||
                          item.status === "Rejected") ? (
                          <Link to={"/merchandising/proformas-edit/" + item.id}>
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
