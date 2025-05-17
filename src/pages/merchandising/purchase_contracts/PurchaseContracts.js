import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import { Modal, Button } from "react-bootstrap";
import swal from "sweetalert";
import moment from "moment";

export default function PurchaseContracts(props) {
  const history = useHistory();

  const [spinner, setSpinner] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // FILTER ITEMS

  const [filterData, setFilterData] = useState({
    from_date: "",
    to_date: "",
    buyer_id: "",
    company_id: "",
    num_of_row: 20,
  });
  const filterChange = (event) => {
    setFilterData({ ...filterData, [event.target.name]: event.target.value });
  };
  const clearFields = () => {
    setFilterData({
      from_date: "",
      to_date: "",
      buyer_id: "",
      company_id: "",
      num_of_row: 20,
    });
  };

  // get all contracts
  const [contracts, setContracts] = useState([]);
  const getContracts = async () => {
    setSpinner(true);
    var response = await api.post("/purchase-contracts", {
      company_id: filterData.company_id,
      buyer_id: filterData.buyer_id,
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      num_of_row: filterData.num_of_row,
    });
    if (response.status === 200 && response.data) {
      setContracts(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const [buyers, setBuyers] = useState([]);
  const getBuyers = async () => {
    setSpinner(true);
    var response = await api.post("/buyers");

    if (response.status === 200 && response.data) {
      setBuyers(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };
  const [currencies, setCurrencies] = useState([]);
  const getCurrencies = async () => {
    var response = await api.get("/currencies");
    if (response.status === 200 && response.data) {
      setCurrencies(response.data);
    }
  };

  const [companies, setCompanies] = useState([]);
  const getCompanies = async () => {
    var response = await api.post("/companies", { type: "Own" });
    if (response.status === 200 && response.data) {
      setCompanies(response.data.data);
    }
  };

  // Contract Modal
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear - 1; year <= currentYear + 10; year++) {
    years.push(year);
  }
  const [contractModal, setContractModal] = useState(false);
  const closeContractModal = () => {
    setContractModal(false);
    setContractForm({
      buyer_id: "",
      company_id: "",
      season: "",
      year: "",
      currency: "",
      title: "",

      pcc_avail: "",
      shipment_date: "",
      issued_date: "",
      expiry_date: "",
    });
  };

  const [contractError, setContractError] = useState({});

  const [contractForm, setContractForm] = useState({
    buyer_id: "",
    company_id: "",
    season: "",
    year: "",
    currency: "",
    title: "",
    pcc_avail: "",
    shipment_date: "",
    issued_date: "",
    expiry_date: "",
  });

  const contractChange = (ev) => {
    setContractForm({
      ...contractForm,
      [ev.target.name]: ev.target.value,
    });
  };

  const validateContractForm = () => {
    let formErrors = {};

    if (!contractForm.buyer_id) {
      formErrors.buyer_id = "Buyer is required";
    }
    if (!contractForm.company_id) {
      formErrors.company_id = "Company is required";
    }
    if (!contractForm.season) {
      formErrors.season = "Season is required";
    }

    if (!contractForm.year) {
      formErrors.year = "Year is required";
    }
    if (!contractForm.currency) {
      formErrors.currency = "Currency is required";
    }

    if (!contractForm.title) {
      formErrors.title = "PC/EXP LC NO is required";
    }

    if (!contractForm.issued_date) {
      formErrors.issued_date = "Issued Date is required";
    }

    if (!contractForm.shipment_date) {
      formErrors.shipment_date = "Shipment date is required";
    }
    if (!contractForm.expiry_date) {
      formErrors.expiry_date = "Expiry date is required";
    }

    setContractError(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const submitContract = async () => {
    if (validateContractForm()) {
      setSpinner(true);
      var response = await api.post("/purchase-contracts-create", contractForm);
      if (response.status === 200 && response.data) {
        setContractModal(false);
        setContractForm({
          buyer_id: "",
          company_id: "",
          season: "",
          year: "",
          currency: "",
          title: "",
          pcc_avail: "",
          shipment_date: "",
          issued_date: "",
          expiry_date: "",
        });
        getContracts();
      } else {
        setContractError(response.data.errors);
      }
      setSpinner(false);
    }
  };

  //   Edit on modal

  // Contract Modal
  const [editModal, setEditModal] = useState(false);

  const openEditForm = async (id) => {
    setSpinner(true);
    var response = await api.post("/purchase-contracts-show", { id: id });
    if (response.status === 200 && response.data) {
      setEditForm(response.data.data);
      setEditModal(true);
    } else {
      console.log(response.data.errors);
    }
    setSpinner(false);
  };
  const closeEditModal = () => {
    setEditModal(false);
  };

  const [editError, setEditError] = useState({});

  const [editForm, setEditForm] = useState({});

  const editContractChange = (ev) => {
    setEditForm({
      ...editForm,
      [ev.target.name]: ev.target.value,
    });
  };

  const validateEditForm = () => {
    let formErrors = {};

    if (!editForm.title) {
      formErrors.title = "PC/EXP LC NO is required";
    }
    if (!editForm.buyer_id) {
      formErrors.buyer_id = "Buyer is required";
    }
    if (!editForm.year) {
      formErrors.year = "Issued Date is required";
    }
    if (!editForm.issued_date) {
      formErrors.issued_date = "Issued Date is required";
    }
    if (!editForm.currency) {
      formErrors.currency = "Currency is required";
    }
    if (!editForm.shipment_date) {
      formErrors.shipment_date = "Shipment date is required";
    }
    if (!editForm.expiry_date) {
      formErrors.expiry_date = "Expiry date is required";
    }
    if (!editForm.company_id) {
      formErrors.company_id = "Company is required";
    }
    setEditError(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const submitEditContract = async () => {
    if (validateEditForm()) {
      setSpinner(true);
      var response = await api.post("/purchase-contracts-update", editForm);
      if (response.status === 200 && response.data) {
        setEditModal(false);
        getContracts();
      } else {
        setContractError(response.data.errors);
      }
      setSpinner(false);
    }
  };

  useEffect(async () => {
    getBuyers();
    getCurrencies();
    getCompanies();
  }, []);

  useEffect(async () => {
    getContracts();
  }, [filterData]);

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
        <div className="page_name">Purchase Contracts</div>
        <div className="actions">
          <input
            type="search"
            onChange={(e) => setSearchValue(e.target.value)}
            // type="text"
            value={searchValue}
            className="form-control"
            placeholder="Search"
          />

          {props.userData?.department_title === "Merchandising" &&
          props.userData?.designation_title === "Deputy General Manager" ? (
            <Link
              to="#"
              onClick={setContractModal}
              className="btn btn-warning bg-falgun rounded-circle"
            >
              <i className="fal fa-plus"></i>
            </Link>
          ) : null}
        </div>
      </div>
      <div className="employee_lists">
        <div className="datrange_filter">
          <div className="row">
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
                <label>Buyer</label>
                <select
                  onChange={filterChange}
                  value={filterData.buyer_id}
                  name="buyer_id"
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
                <label>Company</label>
                <select
                  onChange={filterChange}
                  value={filterData.company_id}
                  name="company_id"
                  className="form-select"
                >
                  <option value="">Select Company</option>
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
        <div className="table-responsive">
          <table className="table text-start align-middle table-bordered table-hover mb-0">
            <thead className="bg-dark text-white">
              <tr>
                <th>#</th>
                <th>Tag No.</th>
                <th>PC/EXP. LC</th>
                <th>Season</th>
                <th>Issued Date</th>
                <th>Expiry Date</th>
                <th>Buyer</th>
                <th>Company</th>
                <th>Purchases</th>
                <th>Total QTY</th>
                <th>Total Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchValue ? (
                <>
                  {contracts
                    .filter((item) => {
                      if (!searchValue) return false;
                      const lowerCaseSearchValue = searchValue.toLowerCase();
                      return (
                        item.title
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.tag_number
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.buyer.toLowerCase().includes(lowerCaseSearchValue)
                      );
                    })
                    .map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.tag_number}</td>
                        <td>{item.title}</td>
                        <td>{item.season}</td>
                        <td>{moment(item.issued_date).format("ll")}</td>
                        <td>{moment(item.expiry_date).format("ll")}</td>
                        <td>{item.buyer}</td>
                        <td>{item.company}</td>
                        <td>
                          {item.purchases.map((purchase, purchaseIndex) => (
                            <span key={purchaseIndex}>
                              <Link
                                to={
                                  "/merchandising/purchases-details/" +
                                  purchase.id
                                }
                              >
                                {purchase.po_number}
                              </Link>{" "}
                              ,{" "}
                            </span>
                          ))}
                        </td>
                        <td>{item.total_qty}</td>
                        <td>
                          {item.currency} {item.total_amount}
                        </td>
                        <td>
                          <>
                            <Link
                              to={
                                "/merchandising/purchase-contracts-details/" +
                                item.id
                              }
                            >
                              <i className="fa fa-eye mr-10 text-success"></i>
                            </Link>

                            {props.userData.userId === item.user_id && (
                              <Link
                                to="#"
                                onClick={(id) => openEditForm(item.id)}
                              >
                                <i className="fa fa-pen"></i>
                              </Link>
                            )}
                          </>
                        </td>
                      </tr>
                    ))}
                </>
              ) : (
                <>
                  {contracts.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.tag_number}</td>
                      <td>{item.title}</td>
                      <td>{item.season}</td>
                      <td>{moment(item.issued_date).format("ll")}</td>
                      <td>{moment(item.expiry_date).format("ll")}</td>
                      <td>{item.buyer}</td>
                      <td>{item.company}</td>
                      <td>
                        {item.purchases.map((purchase, purchaseIndex) => (
                          <span key={purchaseIndex}>
                            <Link
                              to={
                                "/merchandising/purchases-details/" +
                                purchase.id
                              }
                            >
                              {purchase.po_number}
                            </Link>{" "}
                            ,{" "}
                          </span>
                        ))}
                      </td>
                      <td>{item.total_qty}</td>
                      <td>
                        {item.currency} {item.total_amount}
                      </td>
                      <td>
                        <>
                          <Link
                            to={
                              "/merchandising/purchase-contracts-details/" +
                              item.id
                            }
                          >
                            <i className="fa fa-eye mr-10 text-success"></i>
                          </Link>

                          {props.userData.userId === item.user_id && (
                            <Link to="#" onClick={(id) => openEditForm(item.id)}>
                              <i className="fa fa-pen"></i>
                            </Link>
                          )}
                        </>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
        <Modal size="lg" show={contractModal} onHide={closeContractModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add PC/JOB NO</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    Buyer <sup>*</sup>
                  </label>
                  <select
                    name="buyer_id"
                    value={contractForm.buyer_id}
                    onChange={contractChange}
                    className="form-select"
                  >
                    <option value="">Select Buyer</option>
                    {buyers.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  {contractError.buyer_id && (
                    <div className="errorMsg">{contractError.buyer_id}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    Factory <sup>*</sup>
                  </label>
                  <select
                    name="company_id"
                    value={contractForm.company_id}
                    onChange={contractChange}
                    className="form-select"
                  >
                    <option value="">Select company</option>
                    {companies.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                  {contractError.company_id && (
                    <div className="errorMsg">{contractError.company_id}</div>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    Season<sup>*</sup>
                  </label>

                  <select
                    name="season"
                    value={contractForm.season}
                    onChange={contractChange}
                    className="form-select"
                  >
                    <option value="">Select Season</option>
                    <option value="SPRING">SPRING</option>
                    <option value="SUMMER">SUMMER</option>
                    <option value="FALL">FALL</option>
                    <option value="HOLIDAY">HOLIDAY</option>
                  </select>

                  {contractError.season && (
                    <>
                      <div className="errorMsg">{contractError.season}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    Year<sup>*</sup>
                  </label>

                  <select
                    name="year"
                    value={contractForm.year}
                    onChange={contractChange}
                    className="form-select"
                  >
                    <option value="">Select Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>

                  {contractError.year && (
                    <>
                      <div className="errorMsg">{contractError.year}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    Currency <sup>*</sup>
                  </label>
                  <select
                    onChange={contractChange}
                    value={contractForm.currency}
                    name="currency"
                    className="form-select"
                  >
                    <option value="">Select currency</option>
                    {currencies.map((item, index) => (
                      <option key={index} value={item.code}>
                        {item.code}
                      </option>
                    ))}
                  </select>
                  {contractError.currency && (
                    <div className="errorMsg">{contractError.currency}</div>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    PC/EXP LC NO<sup>*</sup>
                  </label>
                  <input
                    value={contractForm.title}
                    name="title"
                    onChange={contractChange}
                    type="text"
                    className="form-control"
                  />
                  {contractError.title && (
                    <div className="errorMsg">{contractError.title}</div>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label>PCC/ECC/STL</label>
                  <input
                    value={contractForm.pcc_avail}
                    name="pcc_avail"
                    onChange={contractChange}
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    Issued Date <sup>*</sup>
                  </label>
                  <input
                    value={contractForm.issued_date}
                    name="issued_date"
                    onChange={contractChange}
                    type="date"
                    className="form-control"
                  />
                  {contractError.issued_date && (
                    <div className="errorMsg">{contractError.issued_date}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    Shipment Date <sup>*</sup>
                  </label>
                  <input
                    value={contractForm.shipment_date}
                    name="shipment_date"
                    onChange={contractChange}
                    type="date"
                    className="form-control"
                  />
                  {contractError.shipment_date && (
                    <div className="errorMsg">
                      {contractError.shipment_date}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    Expiry Date <sup>*</sup>
                  </label>
                  <input
                    value={contractForm.expiry_date}
                    name="expiry_date"
                    onChange={contractChange}
                    type="date"
                    className="form-control"
                  />
                  {contractError.expiry_date && (
                    <div className="errorMsg">{contractError.expiry_date}</div>
                  )}
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="default" onClick={closeContractModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={submitContract}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal size="lg" show={editModal} onHide={closeEditModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Purchase Contract</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-lg-4">
                <div className="form-group">
                  <label>Buyer</label>
                  <select
                    name="buyer_id"
                    value={editForm.buyer_id}
                    onChange={editContractChange}
                    className="form-select"
                  >
                    <option value="">Select Buyer</option>
                    {buyers.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  {editError.buyer_id && (
                    <div className="errorMsg">{editError.buyer_id}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <label>Factory</label>
                  <select
                    name="company_id"
                    value={editForm.company_id}
                    onChange={editContractChange}
                    className="form-select"
                  >
                    <option value="">Select company</option>
                    {companies.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                  {editError.company_id && (
                    <div className="errorMsg">{editError.company_id}</div>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    Season<sup>*</sup>
                  </label>

                  <select
                    name="season"
                    value={editForm.season}
                    onChange={editContractChange}
                    className="form-select"
                  >
                    <option value="">Select Season</option>
                    <option value="SPRING">SPRING</option>
                    <option value="SUMMER">SUMMER</option>
                    <option value="FALL">FALL</option>
                    <option value="HOLIDAY">HOLIDAY</option>
                  </select>

                  {editError.season && (
                    <>
                      <div className="errorMsg">{editError.season}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    Year<sup>*</sup>
                  </label>

                  <select
                    name="year"
                    value={editForm.year}
                    onChange={editContractChange}
                    className="form-select"
                  >
                    <option value="">Select Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>

                  {editError.season && (
                    <>
                      <div className="errorMsg">{editError.season}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label>PC/EXP LC NO:</label>
                  <input
                    value={editForm.title}
                    name="title"
                    onChange={editContractChange}
                    type="text"
                    className="form-control"
                  />
                  {editError.title && (
                    <div className="errorMsg">{editError.title}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <label>Currency</label>
                  <select
                    onChange={editContractChange}
                    value={editForm.currency}
                    name="currency"
                    className="form-select"
                  >
                    <option value="">Select currency</option>
                    {currencies.map((item, index) => (
                      <option key={index} value={item.code}>
                        {item.code}
                      </option>
                    ))}
                  </select>
                  {editError.currency && (
                    <div className="errorMsg">{editError.currency}</div>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label>PCC/ECC/STL</label>
                  <input
                    value={editForm.pcc_avail}
                    name="pcc_avail"
                    onChange={editContractChange}
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <label>Issued Date</label>
                  <input
                    value={editForm.issued_date}
                    name="issued_date"
                    onChange={editContractChange}
                    type="date"
                    className="form-control"
                  />
                  {editError.issued_date && (
                    <div className="errorMsg">{editError.issued_date}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <label>Shipment Date</label>
                  <input
                    value={editForm.shipment_date}
                    name="shipment_date"
                    onChange={editContractChange}
                    type="date"
                    className="form-control"
                  />
                  {editError.shipment_date && (
                    <div className="errorMsg">{editError.shipment_date}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    value={editForm.expiry_date}
                    name="expiry_date"
                    onChange={editContractChange}
                    type="date"
                    className="form-control"
                  />
                  {editError.expiry_date && (
                    <div className="errorMsg">{editError.expiry_date}</div>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label>Revised Date</label>
                  <input
                    value={editForm.revised_date}
                    name="revised_date"
                    onChange={editContractChange}
                    type="date"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="col-lg-8">
                <div className="form-group">
                  <label>Revised Note</label>
                  <textarea
                    className="form-control"
                    name="revised_note"
                    value={editForm.revised_note}
                    onChange={editContractChange}
                  ></textarea>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="default" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={submitEditContract}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <br />
      <br />
    </div>
  );
}
