import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Button, Offcanvas } from "react-bootstrap";
import api from "../../services/api";
import swal from "sweetalert";
import Spinner from "../Spinner";
import { useHistory } from "react-router-dom";

export default function SubstoreReceiveCanvas(props) {
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);
  const [errors, setErrors] = useState({});
  const [formDataSet, setFormDataSet] = useState({
    receive_date: new Date().toISOString().split("T")[0],
    receive_qty: 0,
    supplier_id: "",
    challan_no: "",
    mrr_no: "",
    gate_pass: "",
    challan_copy: null,
  });

  const [suppliers, setSuppliers] = useState([]);

  const maxDate = new Date().toISOString().split("T")[0];
  const minDate = new Date();
  minDate.setDate(minDate.getDate() - 20);
  const minDateString = minDate.toISOString().split("T")[0];

  const handleClose = () => {
    props.setSubstoreReceiveCanvas(false);
    setErrors({});
  };

  const clearInputs = () => {
    setFormDataSet({
      receive_date: new Date().toISOString().split("T")[0],
      receive_qty: 0,
      supplier_id: "",
      challan_no: "",
      mrr_no: "",
      gate_pass: "",
      challan_copy: null,
    });
  };

  const handleChange = (name, value, event) => {
    // Copy current errors state
    let formErrors = { ...errors };

    // Validate receive_qty if necessary
    if (name === "receive_qty") {
      if (parseInt(value) > parseInt(formDataSet.left_received_qty)) {
        formErrors.receive_qty = "Cannot receive over purchase qty";
      } else {
        // Clear the error if value is valid
        delete formErrors.receive_qty;
      }
    }

    // Update formDataSet based on input type
    if (name === "challan_copy") {
      // Store the selected file
      setFormDataSet({
        ...formDataSet,
        challan_copy: event.target.files[0],
      });
    } else {
      // Update other input values
      setFormDataSet({
        ...formDataSet,
        [name]: value,
      });
    }

    // Update errors state with new validation status
    setErrors(formErrors);
  };

  const validateForm = () => {
    let formErrors = {};

    if (!formDataSet.receive_qty) {
      formErrors.receive_qty = "Please insert receiving QTY";
    }

    if (Number(formDataSet.receive_qty) > formDataSet.left_received_qty) {
      formErrors.receive_qty = "Cannot insert over purchase qty";
    }

    if (!formDataSet.challan_no) {
      formErrors.challan_no = "Please insert Challan No";
    }

    if (!formDataSet.mrr_no) {
      formErrors.mrr_no = "Please insert MRR No";
    }

    if (!formDataSet.supplier_id) {
      formErrors.supplier_id = "Please insert Supplier";
    }

    if (!formDataSet.gate_pass) {
      formErrors.gate_pass = "Please insert Gate In No";
    }

    if (!formDataSet.receive_date) {
      formErrors.receive_date = "Please select Receive Date";
    } else {
      const dateValue = new Date(formDataSet.receive_date);
      const minDateValue = new Date(minDateString);
      const maxDateValue = new Date(maxDate);

      if (dateValue < minDateValue || dateValue > maxDateValue) {
        formErrors.receive_date = `Date must be between ${minDateString} and ${maxDate}`;
      }
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      setSpinner(true);
      var formData = new FormData();
      formData.append("id", formDataSet.id);
      formData.append("requisition_id", formDataSet.requisition_id);
      formData.append("part_id", formDataSet.part_id);
      formData.append("company_id", formDataSet.company_id);
      formData.append("qty", formDataSet.qty);
      formData.append("receive_date", formDataSet.receive_date);
      formData.append("receive_qty", formDataSet.receive_qty);
      formData.append("supplier_id", formDataSet.supplier_id);
      formData.append("challan_no", formDataSet.challan_no);
      formData.append("gate_pass", formDataSet.gate_pass);
      formData.append("mrr_no", formDataSet.mrr_no);
      formData.append("challan_copy", formDataSet.challan_copy);
      try {
        const response = await api.post("/substores-receive", formData);
        if (response.status === 200 && response.data) {
          swal({ title: "Successfully Receive Item", icon: "success" });
          setErrors({});
          props.setSubstoreReceiveCanvas(false);
          history.push(
            `/sub-stores-receive/${response.data.data.requisition_id}`
          );
          props.setCallRequisition(true);
          setTimeout(() => {
            props.setCallRequisition(false);
          }, 500); // 500 milliseconds delay
        } else {
          setErrors(response.data.errors || {});
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setErrors({ submit: "Error submitting form. Please try again." });
      } finally {
        setSpinner(false);
      }
    }
  };

  const getRequisitionItem = async () => {
    try {
      setSpinner(true);
      const response = await api.post("/requisitions-single-item", {
        id: props.requisitionItemId,
      });

      if (response.status === 200 && response.data && response.data.data) {
        const fetchedData = response.data.data;

        // Ensure receive_date is always set
        if (!fetchedData.receive_date) {
          fetchedData.receive_date = new Date().toISOString().split("T")[0];
        }

        // Merge fetched data with existing formDataSet, preserving certain fields
        setFormDataSet((prevState) => ({
          ...prevState,
          ...fetchedData,
          challan_no: prevState.challan_no || fetchedData.challan_no,
          mrr_no: prevState.mrr_no || fetchedData.mrr_no,
          gate_pass: prevState.gate_pass || fetchedData.gate_pass,
          supplier_id: prevState.supplier_id || fetchedData.supplier_id,
          purchase_qty: fetchedData.purchase_qty,
          received_qty: fetchedData.received_qty,
          left_received_qty: fetchedData.left_received_qty,
        }));
      }
    } catch (error) {
      console.error("Error fetching requisition item:", error);
    } finally {
      setSpinner(false);
    }
  };

  const getSuppliers = async () => {
    try {
      setSpinner(true);
      const response = await api.post("/suppliers");

      if (response.status === 200 && response.data && response.data.data) {
        setSuppliers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setSpinner(false);
    }
  };

  console.log("FORMDATASET", formDataSet);

  useEffect(() => {
    getSuppliers();
  }, []);

  useEffect(() => {
    if (props.requisitionItemId) {
      getRequisitionItem();
    }
  }, [props.requisitionItemId]);

  return (
    <>
      {spinner && <Spinner />}
      <Offcanvas
        style={{ minHeight: "400px" }}
        show={props.substoreReceiveCanvas}
        onHide={handleClose}
        placement="top"
      >
        <Offcanvas.Header className="bg-success" closeButton>
          <Offcanvas.Title>{formDataSet.part_name}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ minHeight: "338px" }}>
          <div className="row">
            <div className="col-lg-2">
              <div className="form-group">
                <label>Receive Date</label>
                <input
                  type="date"
                  required
                  onChange={(event) =>
                    handleChange("receive_date", event.target.value)
                  }
                  max={maxDate}
                  min={minDateString}
                  name="receive_date"
                  value={formDataSet.receive_date}
                  className="form-select"
                />
                {errors.receive_date && (
                  <div className="errorMsg">{errors.receive_date}</div>
                )}
              </div>
            </div>
            <div className="col-lg-2">
              <div className="form-group">
                <label>Receiving QTY</label>
                <input
                  type="number"
                  className="form-control"
                  name="receive_qty"
                  min={1}
                  value={formDataSet.receive_qty}
                  onChange={(event) =>
                    handleChange("receive_qty", event.target.value)
                  }
                />
                {errors.receive_qty && (
                  <div className="errorMsg">{errors.receive_qty}</div>
                )}
              </div>
            </div>

            <div className="col-lg-4">
              <div className="form-group">
                <label>Supplier</label>

                <Select
                  placeholder="Select Or Search"
                  onChange={(selectedOption) =>
                    handleChange("supplier_id", selectedOption.value)
                  }
                  value={
                    suppliers.find(
                      (item) => item.id === formDataSet.supplier_id
                    )
                      ? {
                          value: formDataSet.supplier_id,
                          label: suppliers.find(
                            (item) => item.id === formDataSet.supplier_id
                          ).company_name,
                        }
                      : null
                  }
                  name="supplier_id"
                  options={suppliers.map((item) => ({
                    value: item.id,
                    label: item.company_name,
                  }))}
                />

                {errors.supplier_id && (
                  <div className="errorMsg">{errors.supplier_id}</div>
                )}
              </div>
            </div>

            <div className="col-lg-2">
              <div className="form-group">
                <label>Challan No</label>
                <input
                  type="text"
                  className="form-control"
                  name="challan_no"
                  value={formDataSet.challan_no}
                  onChange={(event) =>
                    handleChange("challan_no", event.target.value)
                  }
                />
                {errors.challan_no && (
                  <div className="errorMsg">{errors.challan_no}</div>
                )}
              </div>
            </div>
            <div className="col-lg-2">
              <div className="form-group">
                <label>MRR No</label>
                <input
                  type="text"
                  className="form-control"
                  name="mrr_no"
                  value={formDataSet.mrr_no}
                  onChange={(event) =>
                    handleChange("mrr_no", event.target.value)
                  }
                />
                {errors.mrr_no && (
                  <div className="errorMsg">{errors.mrr_no}</div>
                )}
              </div>
            </div>
            <div className="col-lg-2">
              <div className="form-group">
                <label>Gate Pass/Gate MRR</label>
                <input
                  type="text"
                  className="form-control"
                  name="gate_pass"
                  value={formDataSet.gate_pass}
                  onChange={(event) =>
                    handleChange("gate_pass", event.target.value)
                  }
                />
                {errors.gate_pass && (
                  <div className="errorMsg">{errors.gate_pass}</div>
                )}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group">
                <label>Chalan/Bill Copy (PDF or images)</label>
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

            <div className="col-lg-2">
              <div className="form-group">
                <label>Final QTY</label>
                <input
                  type="number"
                  className="form-control"
                  name="final_qty"
                  value={formDataSet.final_qty}
                  readOnly
                  disabled
                />
              </div>
            </div>
            <div className="col-lg-2">
              <div className="form-group">
                <label>Already Received QTY</label>
                <input
                  type="number"
                  className="form-control"
                  name="received_qty"
                  value={formDataSet.received_qty}
                  readOnly
                  disabled
                />
              </div>
            </div>
            <div className="col-lg-2">
              <div className="form-group">
                <label>Left QTY</label>
                <input
                  type="number"
                  className="form-control"
                  name="left_received_qty"
                  value={formDataSet.left_received_qty}
                  readOnly
                  disabled
                />
              </div>
            </div>
          </div>

          <hr />

          <div className="text-center">
            <Button variant="success" className="me-2" onClick={handleSubmit}>
              RECEIVE
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
