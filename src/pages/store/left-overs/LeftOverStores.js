import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import moment from "moment/moment";
import { Modal, Button } from "react-bootstrap";
import swal from "sweetalert";

export default function LeftOverStores(props) {
  const [spinner, setSpinner] = useState(false);

  const history = useHistory();

  const [imageURL, setImageUrl] = useState(null);
  const [imageModal, setImageModal] = useState(false);
  const openImageModal = (url) => {
    setImageUrl(url);
    setImageModal(true);
  };
  const closeImageModal = () => {
    setImageUrl(null);
    setImageModal(false);
  };
  const [searchValue, setSearchValue] = useState("");
  const [filterData, setFilterData] = useState({
    from_date: "",
    to_date: "",
    buyer_id: "",
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
      buyer_id: "",
    });
  };

  // get all bookings
  const [overs, setOvers] = useState([]);
  const getOvers = async () => {
    setSpinner(true);
    var response = await api.post("/left-overs-balance", {
      buyer_id: filterData.buyer_id,
      from_date: filterData.from_date,
      to_date: filterData.to_date,
    });
    if (response.status === 200 && response.data) {
      setOvers(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
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

  //   Companies

  const [companies, setCompanies] = useState([]);
  const getCompanies = async () => {
    setSpinner(true);
    var response = await api.post("/common/companies");
    if (response.status === 200 && response.data) {
      setCompanies(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  //   ISSUE ITEM
  //issuing items
  const [issueModal, setIssueModal] = useState(false);
  const openIssueModal = async (item_id) => {
    setSpinner(true);
    var response = await api.post("/left-overs-balance-details", {
      id: item_id,
    });
    if (response.status === 200 && response.data) {
      setFormDataSet(response.data.data);
      setIssueModal(true);
    }
    setSpinner(false);
  };

  const closeIssueModal = () => {
    setFormDataSet({});
    setErrors({});
    setIssueModal(false);
  };

  const [errors, setErrors] = useState({});
  const [formDataSet, setFormDataSet] = useState({});
  const [showSisterCompany, setShowSisterCompany] = useState(true);
  const [file, setFile] = useState(null);
  const handleChange = (ev) => {
    let formErrors = {};
    const name = ev.target.name;
    const value = ev.target.value;

    if (name === "issue_qty" && Number(value) > formDataSet.qty) {
      formErrors.issue_qty = "Cannot insert over balance qty";
    }

    if (name === "issue_carton" && Number(value) > formDataSet.carton) {
      formErrors.issue_carton = "Cannot insert over carton qty";
    }

    if (name === "challan_copy") {
      setFile(ev.target.files[0]); // Store the selected file
      if (!ev.target.files[0]) {
        formErrors.challan_copy = "Please select a PDF file";
      } else {
        formErrors.challan_copy = ""; // Clear any previous error
      }
    }

    setFormDataSet({
      ...formDataSet,
      [name]: value,
    });

    // Update visibility and required status based on issue_type
    if (name === "issue_type") {
      setShowSisterCompany(value === "Sister-Factory");
    }

    setErrors(formErrors);
  };

  const validateForm = () => {
    let formErrors = {};

    if (!formDataSet.issue_carton) {
      formErrors.issue_carton = "Please Insert Carton QTY";
    }
    if (Number(formDataSet.issue_carton) > formDataSet.carton) {
      formErrors.issue_carton = "Cannot insert over carton qty";
    }

    if (!formDataSet.issue_qty) {
      formErrors.issue_qty = "Please Insert Issue QTY";
    }
    if (Number(formDataSet.issue_qty) > formDataSet.qty) {
      formErrors.issue_qty = "Cannot insert over qty";
    }
    if (!formDataSet.issue_type) {
      formErrors.issue_type = "Please Select Issue Type";
    }
    if (showSisterCompany && !formDataSet.issue_to_company_id) {
      formErrors.issue_to_company_id = "Please Insert Company";
    }
    if (!formDataSet.reference) {
      formErrors.reference = "Please Insert Reference";
    }

    if (!formDataSet.challan_copy) {
      formErrors.challan_copy = "Please select a PDF file";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      // Create a FormData object
      var formData = new FormData();
      // Append form data to the FormData object
      for (const key in formDataSet) {
        formData.append(key, formDataSet[key]);
      }
      // Append the file to the FormData object
      formData.append("challan_copy", file);
      var response = await api.post("/left-overs-balance-issue", formData);
      if (response.status === 200 && response.data) {
        setFormDataSet({});
        setErrors({});
        setIssueModal(false);
        swal({
          title: "Successfully Issue Item",
          icon: "success",
        });
        // history.push("/store/left-overs");
        getOvers();
      } else {
        setErrors(response.data.errors);
      }
    }
  };

  useEffect(async () => {
    getBuyers();
    getCompanies();
  }, []);

  useEffect(async () => {
    getOvers();
  }, [filterData]);

  useEffect(async () => {
    props.setSection("stores");
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      if (props.userData?.department_title !== "Store") {
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
        <div className="page_name">Left Overs (Ready Made)</div>
        <div className="actions">
          <input
            type="search"
            onChange={(e) => setSearchValue(e.target.value)}
            // type="text"
            value={searchValue}
            className="form-control"
            placeholder="Search"
          />
          <Link
            to="/store/left-overs-create"
            className="btn btn-warning bg-falgun rounded-circle"
          >
            <i className="fal fa-plus"></i>
          </Link>
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
                  <option value="">Select Buyer</option>
                  {buyers.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table text-start align-middle table-bordered table-hover mb-0">
            <thead className="bg-dark text-white">
              <tr>
                <th>#</th>
                <th>Photo</th>
                <th>LO</th>
                <th>Last Update</th>
                <th>Buyer</th>
                <th>Style</th>
                <th>Season</th>
                <th>Type</th>
                <th>Item</th>
                <th>Carton Qty</th>
                <th>Balance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {overs.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      onClick={() => openImageModal(item.image_source)}
                      style={{
                        width: "50px",
                        height: "50px",
                        border: "1px solid gray",
                        borderRadius: "3px",
                        cursor: "pointer",
                      }}
                      src={item.image_source}
                    />
                  </td>
                  <td>{item.lo_number}</td>
                  <td>{moment(item.updated_at).format("ll")}</td>
                  <td>{item.buyer}</td>
                  <td>{item.techpack}</td>
                  <td>{item.season}</td>
                  <td>{item.item_type}</td>
                  <td>{item.title}</td>
                  <td>{item.carton}</td>
                  <td>{item.qty}</td>
                  <td>
                    <div className="text-center">
                      <Link
                        className="btn btn-primary mr-10"
                        to={"/store/left-overs-details/" + item.id}
                      >
                        Details
                      </Link>
                      {item.qty > 0 && (
                        <button
                          onClick={() => openIssueModal(item.id)}
                          className="btn btn-warning"
                        >
                          Issue
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal show={issueModal} onHide={closeIssueModal}>
        <Modal.Header closeButton>
          <Modal.Title>Issue Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-lg-3">
              <img style={{ width: "100px" }} src={formDataSet.image_source} />
            </div>
            <div className="col-lg-9">
              <div className="form-group">
                <label>
                  <strong>Issue Type</strong>
                </label>
                <select
                  onChange={handleChange}
                  name="issue_type"
                  value={formDataSet.issue_type}
                  className="form-select"
                >
                  <option value="">Select Type</option>
                  <option value="Sister-Factory">Sister Factory</option>
                  <option value="Stock-Lot">Stock-Lot</option>
                </select>
                {errors.issue_type && (
                  <div className="errorMsg">{errors.issue_type}</div>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group">
                <br />
                <label>Carton Balance</label>
                <input
                  type="number"
onWheel={(event) => event.target.blur()}
                  disabled
                  className="form-control"
                  name="carton"
                  min={1}
                  value={formDataSet.carton}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group">
                <br />
                <label>Issue Carton QTY</label>
                <input
                  type="number"
onWheel={(event) => event.target.blur()}
                  className="form-control"
                  name="issue_carton"
                  min={1}
                  value={formDataSet.issue_carton}
                  onChange={handleChange}
                />
                {errors.issue_carton && (
                  <div className="errorMsg">{errors.issue_carton}</div>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group">
                <br />
                <label> Balance QTY</label>
                <input
                  type="number"
onWheel={(event) => event.target.blur()}
                  disabled
                  min={1}
                  className="form-control"
                  name="qty"
                  value={formDataSet.qty}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="form-group">
                <br />
                <label>Issue QTY</label>
                <input
                  type="number"
onWheel={(event) => event.target.blur()}
                  className="form-control"
                  min={1}
                  name="issue_qty"
                  value={formDataSet.issue_qty}
                  onChange={handleChange}
                />
                {errors.issue_qty && (
                  <div className="errorMsg">{errors.issue_qty}</div>
                )}
              </div>
            </div>
            {showSisterCompany && (
              <div className="col-lg-6">
                <div className="form-group">
                  <label>Company</label>
                  <select
                    name="issue_to_company_id"
                    value={formDataSet.issue_to_company_id}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Select One</option>
                    {companies.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                  {errors.issue_to_company_id && (
                    <div className="errorMsg">{errors.issue_to_company_id}</div>
                  )}
                </div>
              </div>
            )}

            <div className="col-lg-6">
              <div className="form-group">
                <label>Reference</label>
                <input
                  type="text"
                  className="form-control"
                  name="reference"
                  value={formDataSet.reference}
                  onChange={handleChange}
                />
                {errors.reference && (
                  <div className="errorMsg">{errors.reference}</div>
                )}
              </div>
            </div>
            <div className="col-lg-12">
              <div className="form-group">
                <label>Remarks</label>
                <textarea
                  type="text"
                  className="form-control"
                  name="remarks"
                  value={formDataSet.remarks}
                  onChange={handleChange}
                ></textarea>
                {errors.remarks && (
                  <div className="errorMsg">{errors.remarks}</div>
                )}
              </div>
            </div>

            <div className="col-lg-12">
              <div className="form-group">
                <label>Chalan/Requisition (PDF only)</label>
                <input
                  type="file"
                  className="form-control"
                  name="challan_copy"
                  value={formDataSet.challan_copy}
                  onChange={handleChange}
                  accept=".pdf"
                  required
                />
                {errors.challan_copy && (
                  <div className="errorMsg">{errors.challan_copy}</div>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmit}>
            Issue
          </Button>
          <Button variant="secondary" onClick={closeIssueModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={imageModal} onHide={closeImageModal}>
        <Modal.Header closeButton>
          <Modal.Title>Item Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img style={{ width: "100%" }} src={imageURL} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeImageModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <br />
      <br />
    </div>
  );
}
