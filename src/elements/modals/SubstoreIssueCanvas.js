import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { Button, Offcanvas } from "react-bootstrap";
import api from "../../services/api";
import swal from "sweetalert";
import Spinner from "../Spinner";

export default function SubstoreIssueCanvas(props) {
  const [spinner, setSpinner] = useState(false);
  //handle issue on canvas

  const itemId = props.substoreCanvasId;

  const handleClose = () => {
    props.setSubstoreIssueCanvas(false);
    setErrors({});
  };
  const clearInputs = () => {
    setFormDataSet({
      part_id: "",
      id: "",
      issue_type: "",
      issue_to: "",
      line: "",
      reference: "",
      issuing_company: "",
      company_id: "",
      remarks: "",
      qty: "",
      issue_qty: "",
      challan_copy: null,
      issue_date: new Date().toISOString().split("T")[0],
    });
  };

  const [substores, setSubstores] = useState([]);
  const getSubstores = async () => {
    setSpinner(true);
    var response = await api.post("/substore/substores");
    if (response.status === 200 && response.data) {
      setSubstores(response.data.company_wise);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const [employees, setEmployees] = useState([]);
  const getEmployees = async (issue_type) => {
    setSpinner(true);
    var response = await api.post("/admin/employees", {
      issue_type: issue_type,
    });
    if (response.status === 200 && response.data) {
      setEmployees(response.data.data);
    }
    setSpinner(false);
  };

  const [companies, setCompanies] = useState([]);
  const getCompanies = async () => {
    setSpinner(true);
    var response = await api.post("/common/companies", { type: "Own" });
    if (response.status === 200 && response.data) {
      setCompanies(response.data.data);
    }
    setSpinner(false);
  };
  const fetchSubstoreData = async (id) => {
    setSpinner(true);
    try {
      const response = await api.post("/substore/substores-show", { id });
      if (response.status === 200 && response.data) {
        const subStore = response.data.data;
        setFormDataSet((prevState) => ({
          ...prevState,
          id,
          qty: subStore.qty,
          part_id: subStore.part_id,
          company_id: subStore.company_id,
        }));
      }
    } catch (error) {
      console.error("Error fetching substore data:", error);
    } finally {
      setSpinner(false);
    }
  };

  const [showIssueToField, setShowIssueToField] = useState(false);
  const [showLineField, setShowLineField] = useState(false);
  const [showIssuingCompanyField, setShowIssuingCompanyField] = useState(true);

  const [errors, setErrors] = useState({});
  const [formDataSet, setFormDataSet] = useState({
    part_id: "",
    id: "",
    issue_type: "",
    issue_to: "",
    line: "",
    reference: "",
    issuing_company: "",
    company_id: "",
    remarks: "",
    qty: "",
    issue_qty: "",
    challan_copy: null,
    issue_date: new Date().toISOString().split("T")[0],
  });
  const [file, setFile] = useState(null);

  const handleChange = async (name, value, ev) => {
    let formErrors = { ...errors };

    if (name === "issue_qty" && parseInt(value) > parseInt(formDataSet.qty)) {
      formErrors.issue_qty = "Cannot insert over balance qty";
    }

    if (name === "issue_type") {
      setShowLineField(value === "Self");
      setShowIssueToField(value === "Self");
      setShowIssuingCompanyField(value !== "Self");

      if (value === "Self") {
        getEmployees(value);
      }
    }

    if (name === "id") {
      fetchSubstoreData(value);
    }

    if (name === "challan_copy") {
      setFile(ev.target.files[0]); // Store the selected file
    } else {
      setFormDataSet((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

    setErrors(formErrors);
  };

  const validateForm = () => {
    let formErrors = {};

    if (!formDataSet.issue_date) {
      formErrors.issue_date = "Please select Issue Date";
    } else {
      const dateValue = new Date(formDataSet.issue_date);
      const minDateValue = new Date(minDateString);
      const maxDateValue = new Date(maxDate);

      if (dateValue < minDateValue || dateValue > maxDateValue) {
        formErrors.issue_date = `Date must be between ${minDateString} and ${maxDate}`;
      }
    }
    if (!formDataSet.id) {
      formErrors.id = "Please select Item";
    }

    if (
      !formDataSet.issue_qty ||
      Number(formDataSet.issue_qty) > formDataSet.qty
    ) {
      formErrors.issue_qty = "Please insert a valid Issue QTY";
    }

    if (!formDataSet.issue_type) {
      formErrors.issue_type = "Please select Issue Type";
    }

    if (!formDataSet.issue_to && formDataSet.issue_type === "Self") {
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

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };
  const maxDate = new Date().toISOString().split("T")[0];

  const minDate = new Date();
  minDate.setDate(minDate.getDate() - 20);
  const minDateString = minDate.toISOString().split("T")[0];

  console.log("FORMDATA", formDataSet);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const formData = new FormData();
      formData.append("part_id", formDataSet.part_id); // part_id from substores-show
      formData.append("id", formDataSet.id);
      formData.append("issue_type", formDataSet.issue_type);
      formData.append("issue_to", formDataSet.issue_to);
      formData.append("line", formDataSet.line);
      formData.append("reference", formDataSet.reference);
      formData.append("issuing_company", formDataSet.issuing_company);
      formData.append("company_id", formDataSet.company_id); // company_id from substores-show
      formData.append("remarks", formDataSet.remarks);
      formData.append("qty", formDataSet.qty);
      formData.append("issue_qty", formDataSet.issue_qty);
      formData.append("challan_copy", file);
      formData.append("issue_date", formDataSet.issue_date);
      setSpinner(true);
      try {
        const response = await api.post("/substore/substores-issue", formData);
        if (response.status === 200 && response.data) {
          swal({ title: "Successfully Issued Item", icon: "success" });
          setErrors({});
          // props.setSubstoreIssueCanvas(false);

          props.setCallSubstores(true);
          setTimeout(() => {
            props.setCallSubstores(false);
          }, 500); // 500 milliseconds delay
        } else {
          setErrors(response.data.errors);
        }
      } catch (error) {
        console.error("Error issuing substore:", error);
      }
      setSpinner(false);
    }
  };

  useEffect(async () => {
    getEmployees();
    getCompanies();
    getSubstores();
  }, []);
  useEffect(async () => {
    getSubstores();
  }, [props.callSubstores]);

  useEffect(() => {
    if (itemId) {
      handleChange("id", itemId);
    }
  }, [itemId]);
  return (
    <>
      {spinner && <Spinner />}
      <Offcanvas
        style={{ minHeight: "400px" }}
        show={props.substoreIssueCanvas}
        onHide={handleClose}
        placement="top"
      >
        <Offcanvas.Header className="bg-falgun" closeButton>
          <Offcanvas.Title>ISSUE AN ITEM</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ minHeight: "338px" }}>
          <div className="row">
            <div className="col-lg-2">
              <div className="form-group">
                <label>Issue Date</label>
                <input
                  type="date"
                  required
                  onChange={(event) =>
                    handleChange("issue_date", event.target.value)
                  }
                  max={maxDate}
                  min={minDateString}
                  name="issue_date"
                  value={formDataSet.issue_date}
                  className="form-select"
                />
                {errors.issue_date && (
                  <div className="errorMsg">{errors.issue_date}</div>
                )}
              </div>
            </div>
            <div className="col-lg-5">
              <div className="form-group">
                <label>Item</label>
                <Select
                  placeholder="Select Or Search"
                  onChange={(selectedOption) =>
                    handleChange("id", selectedOption.value)
                  }
                  value={
                    substores.find((item) => item.id === formDataSet.id)
                      ? {
                          value: formDataSet.id,
                          label: substores.find(
                            (item) => item.id === formDataSet.id
                          ).part_name,
                        }
                      : null
                  }
                  name="id"
                  options={substores.map((item) => ({
                    value: item.id,
                    label: item.part_name,
                  }))}
                />

                {errors.id && <div className="errorMsg">{errors.id}</div>}
              </div>
            </div>
            <div className="col-lg-2">
              <div className="form-group">
                <label>Issue Type</label>
                <select
                  onChange={(event) =>
                    handleChange("issue_type", event.target.value)
                  }
                  name="issue_type"
                  value={formDataSet.issue_type}
                  className="form-select"
                >
                  <option value="">Select Type</option>
                  <option value="Self">Self</option>
                  <option value="Sister-Factory">Sister-Factory</option>
                </select>
                {errors.issue_type && (
                  <div className="errorMsg">{errors.issue_type}</div>
                )}
              </div>
            </div>
            {showIssuingCompanyField && (
              <div className="col-lg-3">
                <div className="form-group">
                  <>
                    <label>Issue To (Company)</label>
                    <select
                      name="issuing_company"
                      value={formDataSet.issuing_company}
                      onChange={(event) =>
                        handleChange("issuing_company", event.target.value)
                      }
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
              <div className="col-lg-3">
                <div className="form-group">
                  <>
                    <label>Issue To / Section</label>
                    <Select
                      placeholder="Select Or Search"
                      onChange={(selectedOption) =>
                        handleChange("issue_to", selectedOption.value)
                      }
                      value={
                        employees.find(
                          (item) => item.id === formDataSet.issue_to
                        )
                          ? {
                              value: formDataSet.issue_to,
                              label:
                                employees.find(
                                  (item) => item.id === formDataSet.issue_to
                                ).full_name || "",
                            }
                          : null
                      }
                      name="issue_to"
                      options={employees.map((item) => ({
                        value: item.id,
                        label: item.full_name,
                      }))}
                    />
                  </>

                  {errors.issue_to && showIssueToField && (
                    <div className="errorMsg">{errors.issue_to}</div>
                  )}
                </div>
              </div>
            )}

            <div className="col-lg-2">
              <div className="form-group">
                <label>Balance</label>
                <input
                  type="number"
                  onWheel={(event) => event.target.blur()}
                  disabled
                  min={1}
                  className="form-control"
                  name="qty"
                  value={formDataSet.qty}
                  onChange={(event) => handleChange("qty", event.target.value)}
                />
              </div>
            </div>
            <div className="col-lg-2">
              <div className="form-group">
                <label>Issue QTY</label>
                <input
                  type="number"
                  onWheel={(event) => event.target.blur()}
                  className="form-control"
                  name="issue_qty"
                  min={1}
                  value={formDataSet.issue_qty}
                  onChange={(event) =>
                    handleChange("issue_qty", event.target.value)
                  }
                />
                {errors.issue_qty && (
                  <div className="errorMsg">{errors.issue_qty}</div>
                )}
              </div>
            </div>

            {showLineField && (
              <div className="col-lg-2">
                <div className="form-group">
                  <label>Line/Dept</label>
                  <>
                    <input
                      type="text"
                      className="form-control"
                      name="line"
                      value={formDataSet.line}
                      onChange={(event) =>
                        handleChange("line", event.target.value)
                      }
                    />
                    {errors.line && (
                      <div className="errorMsg">{errors.line}</div>
                    )}
                  </>
                </div>
              </div>
            )}

            <div className="col-lg-2">
              <div className="form-group">
                <label>Reference</label>
                <input
                  type="text"
                  className="form-control"
                  name="reference"
                  value={formDataSet.reference}
                  onChange={(event) =>
                    handleChange("reference", event.target.value)
                  }
                />
                {errors.reference && (
                  <div className="errorMsg">{errors.reference}</div>
                )}
              </div>
            </div>
            <div className="col-lg-2">
              <div className="form-group">
                <label>Remarks</label>
                <input
                  type="text"
                  className="form-control"
                  name="remarks"
                  value={formDataSet.remarks}
                  onChange={(event) =>
                    handleChange("remarks", event.target.value)
                  }
                />
                {errors.remarks && (
                  <div className="errorMsg">{errors.remarks}</div>
                )}
              </div>
            </div>
            <div className="col-lg-2">
              <div className="form-group">
                <label>Chalan(PDF only)</label>
                <input
                  type="file"
                  className="form-control"
                  name="challan_copy"
                  onChange={(event) =>
                    handleChange("challan_copy", event.target.value, event)
                  }
                />

                {errors.challan_copy && (
                  <div className="errorMsg">{errors.challan_copy}</div>
                )}
              </div>
            </div>
          </div>
          <hr />
          <div className="text-center">
            <Button variant="success" className="me-2" onClick={handleSubmit}>
              ISSUE
            </Button>
            <Button variant="warning" className="me-2" onClick={clearInputs}>
              CLEAR
            </Button>
            <Button variant="danger" onClick={handleClose}>
              CLOSE
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
