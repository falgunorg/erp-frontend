import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Spinner from "../../../elements/Spinner";
import Select from "react-select";
import api from "services/api";
import { Modal, Button } from "react-bootstrap";
import moment from "moment/moment";
import swal from "sweetalert";

export default function IssueItem(props) {
  const history = useHistory();
  const [spinner, setSpinner] = useState();
  const [bookings, setBookings] = useState([]);
  const getBookings = async () => {
    setSpinner(true);
    var response = await api.post("/merchandising/bookings");
    if (response.status === 200 && response.data) {
      setBookings(response.data.all_bookings);
    }
    setSpinner(false);
  };

  const [techpacks, setTechpacks] = useState([]);
  const getTechpacks = async () => {
    setSpinner(true);
    var response = await api.post("/merchandising/techpacks");
    if (response.status === 200 && response.data) {
      setTechpacks(response.data.all_items);
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
  const [filterData, setFilterData] = useState({
    techpack_id: "",
    booking_id: "",
    from_date: "",
    to_date: "",
    num_of_row: 50,
    buyer_id: "",
    supplier_id: "",
  });
  const filterChange = (name, value) => {
    setFilterData({ ...filterData, [name]: value });
  };

  const clearFields = () => {
    setFilterData({
      techpack_id: "",
      booking_id: "",
      from_date: "",
      to_date: "",
      num_of_row: 50,
      buyer_id: "",
      supplier_id: "",
    });
  };
  const [stores, setStores] = useState([]);
  const getStores = async () => {
    setSpinner(true);
    var response = await api.post("/store/stores", {
      techpack_id: filterData.techpack_id,
      booking_id: filterData.booking_id,
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      num_of_row: filterData.num_of_row,
      buyer_id: filterData.buyer_id,
      supplier_id: filterData.supplier_id,
    });
    if (response.status === 200 && response.data) {
      setStores(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  //issuing items

  const [employees, setEmployees] = useState([]);
  const getEmployees = async (issue_type) => {
    setSpinner(true);
    var response = await api.post("/admin/employees", {
      issue_type: issue_type,
      without_me: true,
    });
    if (response.status === 200 && response.data) {
      setEmployees(response.data.data);
    }
    setSpinner(false);
  };

  const [companies, setCompanies] = useState([]);
  const getCompanies = async () => {
    setSpinner(true);
    var response = await api.post("/common/companies");
    if (response.status === 200 && response.data) {
      setCompanies(response.data.data);
    }
    setSpinner(false);
  };

  const [issueModal, setIssueModal] = useState(false);
  const openIssueModal = async (item_id) => {
    setSpinner(true);
    var response = await api.post("/store/stores-show", { id: item_id });
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
  const [showIssueToField, setShowIssueToField] = useState(false);
  const [showLineField, setShowLineField] = useState(false);
  const [showIssuingCompanyField, setShowIssuingCompanyField] = useState(true);

  const [errors, setErrors] = useState({});
  const [formDataSet, setFormDataSet] = useState({});
  const [file, setFile] = useState(null);
  const handleChange = (ev) => {
    let formErrors = {};
    const name = ev.target.name;
    const value = ev.target.value;
    if (name === "issue_qty" && Number(value) > formDataSet.qty) {
      formErrors.issue_qty = "Cannot insert over balance qty";
    }
    if (name === "issue_type") {
      if (value === "Self") {
        setShowLineField(true); // Show the "Line" field
      } else {
        setShowLineField(false); // Hide the "Line" field
      }
    }

    if (name === "issue_type") {
      if (value === "Self" || value === "Sample") {
        getEmployees(value);
        setShowIssueToField(true); // Show the "Issue To" field
        setShowIssuingCompanyField(false); // Hide the "Issuing Company" field
      } else {
        setShowIssuingCompanyField(true); // Show the "Issuing Company" field
        setShowIssueToField(false); // Hide the "Issue To" field
      }
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
    setErrors(formErrors);
  };
  const validateForm = () => {
    let formErrors = {};

    if (
      !formDataSet.issue_qty ||
      Number(formDataSet.issue_qty) > formDataSet.qty
    ) {
      formErrors.issue_qty = "Please insert a valid Issue QTY";
    }

    if (!formDataSet.issue_type) {
      formErrors.issue_type = "Please select Issue Type";
    }

    if (
      !formDataSet.issue_to &&
      (formDataSet.issue_type === "Self" || formDataSet.issue_type === "Sample")
    ) {
      formErrors.issue_to = "Please insert Section / Issue To";
    }

    if (!formDataSet.line && showLineField) {
      formErrors.line = "Please insert Line";
    }

    if (!formDataSet.reference) {
      formErrors.reference = "Please insert Reference";
    }

    if (!formDataSet.issuing_company && showIssuingCompanyField) {
      formErrors.issuing_company = "Please insert Company Name";
    }

    if (!formDataSet.challan_copy || !file) {
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
      var response = await api.post("/store/issues-create", formData);
      if (response.status === 200 && response.data) {
        setFormDataSet({});
        setErrors({});
        setIssueModal(false);
        swal({
          title: "Successfully Issue Item",
          icon: "success",
        });
        history.push("/store/issues");
      } else {
        setErrors(response.data.errors);
      }
    }
  };

  useEffect(async () => {
    getBookings();
    getTechpacks();
    getStores();
    getBuyers();
    getSuppliers();
    getCompanies();
  }, []);

  useEffect(async () => {
    getStores();
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
        <div className="page_name">Issue Items</div>
        <div className="actions">
          <Link to="/store/issues" className="btn btn-danger rounded-circle">
            <i className="fal fa-times"></i>
          </Link>
        </div>
      </div>

      <div className="datrange_filter">
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label>Booking No:</label>
              <Select
                className="basic-single"
                placeholder="Select or Search"
                value={
                  bookings.find((item) => item.id === filterData.booking_id)
                    ? {
                        value: filterData.booking_id,
                        label:
                          bookings.find(
                            (item) => item.id === filterData.booking_id
                          ).booking_number || "",
                      }
                    : null
                }
                name="booking_id"
                onChange={(selectedOption) =>
                  filterChange("booking_id", selectedOption.value)
                }
                options={bookings.map((item) => ({
                  value: item.id,
                  label: item.booking_number,
                }))}
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>Style:</label>
              <Select
                placeholder="Select or Search"
                value={
                  techpacks.find((item) => item.id === filterData.techpack_id)
                    ? {
                        value: filterData.techpack_id,
                        label:
                          techpacks.find(
                            (item) => item.id === filterData.techpack_id
                          ).title || "",
                      }
                    : null
                }
                onChange={(selectedOption) =>
                  filterChange("techpack_id", selectedOption.value)
                }
                name="techpack_id"
                options={techpacks.map((item) => ({
                  value: item.id,
                  label: item.title,
                }))}
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>Supplier</label>

              <Select
                placeholder="Select or Search"
                onChange={(selectedOption) =>
                  filterChange("supplier_id", selectedOption.value)
                }
                value={
                  suppliers.find((item) => item.id === filterData.supplier_id)
                    ? {
                        value: filterData.supplier_id,
                        label:
                          suppliers.find(
                            (item) => item.id === filterData.supplier_id
                          ).company_name || "",
                      }
                    : null
                }
                name="supplier_id"
                options={suppliers.map((item) => ({
                  value: item.id,
                  label: item.company_name,
                }))}
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>Buyer</label>

              <Select
                placeholder="Select or Search"
                onChange={(selectedOption) =>
                  filterChange("buyer_id", selectedOption.value)
                }
                value={
                  buyers.find((item) => item.id === filterData.buyer_id)
                    ? {
                        value: filterData.buyer_id,
                        label:
                          buyers.find((item) => item.id === filterData.buyer_id)
                            .name || "",
                      }
                    : null
                }
                name="buyer_id"
                options={buyers.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
              />
            </div>
          </div>

          <div className="col">
            <div className="form-group">
              <label>From Date</label>
              <input
                value={filterData.from_date}
                onChange={(event) =>
                  filterChange("from_date", event.target.value)
                }
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
                onChange={(event) =>
                  filterChange("to_date", event.target.value)
                }
                value={filterData.to_date}
                name="to_date"
                className="form-control"
                type="date"
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>NUM Of Rows</label>
              <div className="d-flex gap_10">
                <select
                  onChange={(event) =>
                    filterChange("num_of_row", event.target.value)
                  }
                  value={filterData.num_of_row}
                  name="num_of_row"
                  className="form-select"
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
      <br />
      <div className="row">
        <h6>Stores Item's</h6>
        <div className="Import_booking_item_table">
          <table className="table">
            <thead className="bg-dark text-white">
              <tr>
                <th>MRR</th>
                <th>B. NO.</th>
                <th>MRR Date</th>
                <th>Photo</th>
                <th>Buyer</th>
                <th>Style</th>
                <th>Supplier</th>
                <th>Item</th>
                <th>Details</th>
                <th>Balance</th>
                <th>Received By</th>
                <th>Booked By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((item, index) => (
                <tr key={index}>
                  <td>{item.store_number}</td>
                  <td>{item.booking_number}</td>
                  <td>{moment(item.created_at).format("ll")}</td>
                  <td>
                    <img
                      style={{
                        height: "50px",
                        width: "50px",
                      }}
                      src={item.image_source}
                    />
                  </td>
                  <td>{item.buyer}</td>
                  <td>{item.techpack}</td>
                  <td>{item.supplier}</td>
                  <td>{item.item_name}</td>
                  <td>{item.description}</td>
                  <td>
                    {item.qty} {item.unit}
                  </td>
                  <td>{item.received_by}</td>
                  <td>{item.booked_by}</td>
                  <td>
                    {item.qty > 0 && (
                      <div className="d-flex gap_10">
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() => openIssueModal(item.id)}
                        >
                          Issue
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <br />
          <br />
        </div>
      </div>
      <Modal show={issueModal} onHide={closeIssueModal}>
        <Modal.Header closeButton>
          <Modal.Title>Issue Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-lg-12 text-center">
              <img style={{ width: "100px" }} src={formDataSet.image_source} />
            </div>
            <div className="col-lg-6">
              <div className="form-group">
                <br />
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
                  <option value="Self">Self</option>
                  <option value="Sister-Factory">Sister-Factory</option>
                  <option value="Sample">Sample</option>
                  <option value="Sub-Contract">Sub-Contract</option>
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
                <label>Balance</label>
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
                <label>Issue QTY</label>
                <input
                  type="number"
                  onWheel={(event) => event.target.blur()}
                  className="form-control"
                  name="issue_qty"
                  min={1}
                  value={formDataSet.issue_qty}
                  onChange={handleChange}
                />
                {errors.issue_qty && (
                  <div className="errorMsg">{errors.issue_qty}</div>
                )}
              </div>
            </div>
            {showIssuingCompanyField && (
              <div className="col-lg-6">
                <div className="form-group">
                  <>
                    <label>Issue To (Company)</label>
                    <select
                      name="issuing_company"
                      value={formDataSet.issuing_company}
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
                  </>

                  {errors.issuing_company && showIssuingCompanyField && (
                    <div className="errorMsg">{errors.issuing_company}</div>
                  )}
                </div>
              </div>
            )}
            {showIssueToField && (
              <div className="col-lg-6">
                <div className="form-group">
                  <>
                    <label>Issue To / Section</label>
                    <select
                      name="issue_to"
                      value={formDataSet.issue_to}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select One</option>
                      {employees.map((item, index) => (
                        <option key={index} value={item.id}>
                          {item.full_name}
                        </option>
                      ))}
                    </select>
                  </>

                  {errors.issue_to && showIssueToField && (
                    <div className="errorMsg">{errors.issue_to}</div>
                  )}
                </div>
              </div>
            )}
            {showLineField && (
              <div className="col-lg-6">
                <div className="form-group">
                  <label>Line</label>
                  <>
                    <input
                      type="text"
                      className="form-control"
                      name="line"
                      value={formDataSet.line}
                      onChange={handleChange}
                    />
                    {errors.line && (
                      <div className="errorMsg">{errors.line}</div>
                    )}
                  </>
                </div>
              </div>
            )}
          </div>
          <div className="row">
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
            <div className="col-lg-6">
              <div className="form-group">
                <label>Remarks</label>
                <textarea
                  style={{
                    minHeight: "104px",
                  }}
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
    </div>
  );
}
