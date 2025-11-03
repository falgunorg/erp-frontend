import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "../../../services/api";
import Spinner from "../../../elements/Spinner";
import swal from "sweetalert";
import moment from "moment";
import Logo from "../../../assets/images/logos/logo-short.png";

export default function Lcs(props) {
  const [spinner, setSpinner] = useState(false);
  const history = useHistory();

  const [searchValue, setSearchValue] = useState("");
  const [filterData, setFilterData] = useState({
    from_date: "",
    to_date: "",
    supplier_id: "",
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
      supplier_id: "",
      status: "",
      num_of_row: 20,
    });
  };

  // get all lcs

  const [lcs, setLcs] = useState([]);
  const getLcs = async () => {
    setSpinner(true);
    var response = await api.post("/commercial/lcs", {
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      supplier_id: filterData.supplier_id,
      num_of_row: filterData.num_of_row,
      status: filterData.status,
    });
    if (response.status === 200 && response.data) {
      setLcs(response.data.data);
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
    getLcs();
    getSuppliers();
  }, []);
  useEffect(async () => {
    getLcs();
  }, [filterData]);

  useEffect(() => {
    const checkAccess = async () => {
      if (props.userData?.department_title !== "Commercial") {
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
    <div className="create_edit_page create_technical_pack">
      <div className="d-flex align-items-center">
        <img src={Logo} alt="Logo" style={{ width: 35, marginRight: 10 }} />
        <h4 className="m-0">BBLC</h4>
      </div>
      <hr />
      {spinner && <Spinner />}

      <div className="employee_lists">
        <div className="datrange_filter create_tp_body">
          <div className="row align-items-end">
            <div className="col">
              <div className="form-group">
                <label>Search</label>
                <input
                  type="search"
                  onChange={(e) => setSearchValue(e.target.value)}
                  value={searchValue}
                  className="form-control margin_bottom_0"
                  placeholder="Search By BBLC NO"
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>From Date</label>
                <input
                  value={filterData.from_date}
                  onChange={filterChange}
                  name="from_date"
                  className="form-control margin_bottom_0"
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
                  className="form-control margin_bottom_0"
                  type="date"
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>Supplier</label>
                <select
                  onChange={filterChange}
                  value={filterData.supplier_id}
                  name="supplier_id"
                  className="form-select margin_bottom_0"
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
            <div className="col">
              <div className="form-group">
                <label>Status</label>
                <select
                  onChange={filterChange}
                  name="status"
                  value={filterData.status}
                  className="form-select margin_bottom_0"
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Material In housed">Material In housed</option>
                  <option value="Pending Payment">Pending Payment</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>NUM Of Rows</label>

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
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <Link className="btn btn-warning me-4" onClick={clearFields}>
                  <i className="fas fa-retweet"></i>
                </Link>
                <Link to="/commercial/lcs-create" className="btn btn-primary">
                  Create New
                </Link>
              </div>
              <></>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>SL</th>
                <th>LC No</th>
                <th>PC</th>
                <th>Apply Date</th>
                <th>Issued Date</th>
                <th>Supplier</th>
                <th>Validity</th>
                <th>PI'S</th>
                <th>Maturity Date</th>
                <th>Paid Date</th>
                <th>Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchValue ? (
                <>
                  {lcs
                    .filter((item) => {
                      if (!searchValue) return false;
                      const lowerCaseSearchValue = searchValue.toLowerCase();
                      return (
                        item.contract_number
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.supplier
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.lc_number
                          .toLowerCase()
                          .includes(lowerCaseSearchValue)
                      );
                    })
                    .map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.lc_number}</td>
                        <td>{item.contract_number}</td>
                        <td>
                          {item.apply_date
                            ? moment(item.apply_date).format("ll")
                            : "N/A"}
                        </td>
                        <td>
                          {item.issued_date
                            ? moment(item.issued_date).format("ll")
                            : "N/A"}
                        </td>
                        <td>{item.supplier?.company_name}</td>
                        <td>{item.lc_validity}</td>
                        <td>
                          <ol>
                            {item.piList?.map((item2, index2) => (
                              <li key={index2}>
                                <Link
                                  to={
                                    "/merchandising/proformas-details/" +
                                    item2.id
                                  }
                                >
                                  {item2.title}
                                </Link>
                              </li>
                            ))}
                          </ol>
                        </td>
                        <td>
                          {item.maturity_date
                            ? moment(item.maturity_date).format("ll")
                            : "N/A"}
                        </td>
                        <td>
                          {item.paid_date
                            ? moment(item.paid_date).format("ll")
                            : "N/A"}
                        </td>
                        <td>{item.total_value}</td>
                        <td>
                          <>
                            <Link to={"/commercial/lcs-edit/" + item.id}>
                              <i className="fa fa-pen"></i>
                            </Link>
                            <Link
                              style={{ marginLeft: "10px" }}
                              to={"/commercial/lcs-show/" + item.id}
                            >
                              <i className="fa fa-eye text-success"></i>
                            </Link>
                          </>
                        </td>
                      </tr>
                    ))}
                </>
              ) : (
                <>
                  {lcs.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.lc_number}</td>
                      <td>{item.contract_number}</td>
                      <td>
                        {item.apply_date
                          ? moment(item.apply_date).format("ll")
                          : "N/A"}
                      </td>
                      <td>
                        {item.issued_date
                          ? moment(item.issued_date).format("ll")
                          : "N/A"}
                      </td>
                      <td>{item.supplier?.company_name}</td>
                      <td>{item.lc_validity}</td>
                      <td>
                        <ol>
                          {item.piList?.map((item2, index2) => (
                            <li key={index2}>
                              <Link
                                to={
                                  "/merchandising/proformas-details/" + item2.id
                                }
                              >
                                {item2.title}
                              </Link>
                            </li>
                          ))}
                        </ol>
                      </td>
                      <td>
                        {item.maturity_date
                          ? moment(item.maturity_date).format("ll")
                          : "N/A"}
                      </td>
                      <td>
                        {item.paid_date
                          ? moment(item.paid_date).format("ll")
                          : "N/A"}
                      </td>
                      <td>{item.total_value}</td>
                      <td>
                        <>
                          <Link to={"/commercial/lcs-edit/" + item.id}>
                            <i className="fa fa-pen"></i>
                          </Link>
                          <Link
                            style={{ marginLeft: "10px" }}
                            to={"/commercial/lcs-show/" + item.id}
                          >
                            <i className="fa fa-eye text-success"></i>
                          </Link>
                        </>
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
