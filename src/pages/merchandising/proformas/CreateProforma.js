import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import swal from "sweetalert";
import QuillEditor from "elements/QuailEditor";
import CustomSelect from "elements/CustomSelect";
import Logo from "../../../assets/images/logos/logo-short.png";
import MultipleFileInput from "elements/techpack/MultipleFileInput";
// modals

export default function CreateProforma(props) {
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);

  // retrive data
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const getBookings = async () => {
    try {
      setSpinner(true);
      const response = await api.post("/merchandising/bookings-public");
      if (response.status === 200 && response.data) {
        setBookings(response.data.data);
      } else {
        console.log("Unexpected response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setSpinner(false);
    }
  };

  // suppliers
  const [suppliers, setSuppliers] = useState([]);
  const getSuppliers = async () => {
    try {
      setSpinner(true);
      const response = await api.post("/admin/suppliers");
      if (response.status === 200 && response.data) {
        setSuppliers(response.data.data);
      } else {
        console.log("Unexpected response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setSpinner(false);
    }
  };

  const [errors, setErrors] = useState({});
  const [formDataSet, setFormDataSet] = useState({
    booking_id: "",
    supplier_id: "",
    booking_item: "",
    title: "",
    issued_date: "",
    delivery_date: "",
    pi_validity: "",
    net_weight: "",
    gross_weight: "",
    freight_charge: "",
    bank_account_name: "",
    bank_account_number: "",
    bank_name: "",
    bank_brunch_name: "",
    bank_address: "",
    bank_swift_code: "",
    payment_terms: "",
    mode_of_shipment: "",
    port_of_loading: "",
    port_of_discharge: "",
    description: "",
  });

  const [piItems, setPiItems] = useState([]);

  console.log("PI-ITEMS", formDataSet);

  const handleChange = async (name, value) => {
    const updatedForm = { ...formDataSet, [name]: value };

    if (name === "booking_id" && value) {
      try {
        const response = await api.get("/merchandising/bookings/" + value);
        if (response.status === 200 && response.data) {
          const data = response.data.data;
          setPiItems(data.items || []);
          updatedForm.supplier_id = data.supplier_id || "";
          updatedForm.booking_item = data.item.title || "";
        } else {
          setPiItems([]);
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setPiItems([]);
      }
    }

    setFormDataSet(updatedForm);
  };

  // ✅ Handle item field change (Qty, Unit Price, etc.)
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...piItems];
    const item = { ...updatedItems[index] };

    item[field] = value;

    // If qty or unit_price changes, recalc total
    if (field === "booking_qty" || field === "unit_price") {
      const qty = parseFloat(item.booking_qty || 0);
      const price = parseFloat(item.unit_price || 0);
      item.total_price = (qty * price).toFixed(2);
    }

    updatedItems[index] = item;
    setPiItems(updatedItems);
  };

  // ✅ Totals
  const netTotalAmount = piItems.reduce(
    (total, item) => total + parseFloat(item.total_price || 0),
    0
  );
  const netTotalQty = piItems.reduce(
    (total, item) => total + parseFloat(item.booking_qty || 0),
    0
  );

  const validateForm = () => {
    let formErrors = {};
    // personal info

    if (!formDataSet.booking_id) {
      formErrors.booking_id = "Please Select A Booking";
    }
    if (!formDataSet.supplier_id) {
      formErrors.supplier_id = "Please Select Supplier";
    }

    if (!formDataSet.title) {
      formErrors.title = "PI Number is required";
    }
    if (!formDataSet.issued_date) {
      formErrors.issued_date = "Issued Date is required";
    }

    if (!formDataSet.delivery_date) {
      formErrors.delivery_date = "Delivery Date is required";
    }
    if (!formDataSet.pi_validity) {
      formErrors.pi_validity = "PI Validity is required";
    }
    if (!formDataSet.net_weight) {
      formErrors.net_weight = "Net Weight is required";
    }
    if (!formDataSet.gross_weight) {
      formErrors.gross_weight = "Gross Weight is required";
    }

    if (!formDataSet.payment_terms) {
      formErrors.payment_terms = "Payment Terms is Required";
    }
    if (!formDataSet.mode_of_shipment) {
      formErrors.mode_of_shipment = "Shipment mode is required";
    }

    if (!formDataSet.bank_account_name) {
      formErrors.bank_account_name = "Bank Account is Required";
    }
    if (!formDataSet.bank_account_number) {
      formErrors.bank_account_number = "Bank Account Number is Required";
    }
    if (!formDataSet.bank_name) {
      formErrors.bank_name = "Bank Name is Required";
    }
    if (!formDataSet.bank_brunch_name) {
      formErrors.bank_brunch_name = "Bank Brunch Name is Required";
    }
    if (!formDataSet.bank_swift_code) {
      formErrors.bank_swift_code = "Bank Swift Code is Required";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      if (selectedFiles.length === 0) {
        swal({
          title: "Please Upload PI copy (PDF)",
          icon: "error",
        });
        return; // Prevent form submission
      }
      if (piItems.length === 0) {
        swal({
          title:
            "There are no Items's in this PI, click on Add Row and fill the data",
          icon: "error",
        });
        return; // Prevent form submission
      }

      var data = new FormData();
      data.append("booking_id", formDataSet.booking_id);
      data.append("supplier_id", formDataSet.supplier_id);
      data.append("title", formDataSet.title);
      data.append("issued_date", formDataSet.issued_date);
      data.append("delivery_date", formDataSet.delivery_date);
      data.append("pi_validity", formDataSet.pi_validity);
      data.append("net_weight", formDataSet.net_weight);
      data.append("gross_weight", formDataSet.gross_weight);
      data.append("freight_charge", formDataSet.freight_charge);
      data.append("payment_terms", formDataSet.payment_terms);
      data.append("mode_of_shipment", formDataSet.mode_of_shipment);
      data.append("port_of_loading", formDataSet.port_of_loading);
      data.append("port_of_discharge", formDataSet.port_of_discharge);
      data.append("description", formDataSet.description);
      data.append("bank_account_name", formDataSet.bank_account_name);
      data.append("bank_account_number", formDataSet.bank_account_number);
      data.append("bank_brunch_name", formDataSet.bank_brunch_name);
      data.append("bank_name", formDataSet.bank_name);
      data.append("bank_address", formDataSet.bank_address);
      data.append("bank_swift_code", formDataSet.bank_swift_code);
      data.append("proforma_items", JSON.stringify(piItems));
      for (let i = 0; i < selectedFiles.length; i++) {
        data.append("attatchments[]", selectedFiles[i]);
      }
      setSpinner(true);
      var response = await api.post("/merchandising/proformas-create", data);
      if (response.status === 200 && response.data) {
        history.push("/merchandising/proformas");
      } else {
        setErrors(response.data.errors);
      }
      setSpinner(false);
    }
  };

  useEffect(async () => {
    getBookings();
    getSuppliers();
  }, []);

  return (
    <div className="create_edit_page create_technical_pack">
      {spinner && <Spinner />}
      <form onSubmit={handleSubmit} className="create_tp_body">
        <div className="d-flex align-items-end justify-content-between">
          <div className="d-flex align-items-end">
            <img src={Logo} alt="Logo" style={{ width: 35, marginRight: 10 }} />
            <h4 className="m-0">ADD NEW PI</h4>
          </div>
          <div className="d-flex align-items-end">
            <button
              type="supmit"
              className="publish_btn btn btn-warning bg-falgun me-4"
            >
              Save
            </button>
            <Link
              to="/merchandising/proformas"
              className="btn btn-danger rounded-circle"
            >
              <i className="fal fa-times"></i>
            </Link>
          </div>
        </div>
        <hr />
        <div className="col-lg-12">
          <div className="personal_data">
            <div className="row">
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">
                    Booking Number <sup>*</sup>
                  </label>
                  <CustomSelect
                    placeholder="Select"
                    onChange={(selectedOption) =>
                      handleChange("booking_id", selectedOption.value)
                    }
                    value={
                      bookings.find(
                        (item) => item.id === formDataSet.booking_id
                      )
                        ? {
                            value: formDataSet.booking_id,
                            label:
                              bookings.find(
                                (item) => item.id === formDataSet.booking_id
                              ).booking_number || "",
                          }
                        : null
                    }
                    name="booking_id"
                    options={bookings.map((item) => ({
                      value: item.id,
                      label: item.booking_number,
                    }))}
                  />

                  {errors.booking_id && (
                    <>
                      <div className="errorMsg">{errors.booking_id}</div>
                    </>
                  )}
                </div>
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">
                    Supplier <sup>*</sup>
                  </label>
                  <CustomSelect
                    isDisabled
                    placeholder="Select"
                    onChange={(selectedOption) =>
                      handleChange("supplier_id", selectedOption.value)
                    }
                    value={
                      suppliers.find(
                        (item) => item.id === formDataSet.supplier_id
                      )
                        ? {
                            value: formDataSet.supplier_id,
                            label:
                              suppliers.find(
                                (item) => item.id === formDataSet.supplier_id
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

                  {errors.supplier_id && (
                    <>
                      <div className="errorMsg">{errors.supplier_id}</div>
                    </>
                  )}
                </div>
              </div>

              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">
                    PI NO.<sup>*</sup>
                  </label>
                  <input
                    className="form-control"
                    name="title"
                    value={formDataSet.title}
                    onChange={(event) =>
                      handleChange("title", event.target.value)
                    }
                  />
                  {errors.title && (
                    <>
                      <div className="errorMsg">{errors.title}</div>
                    </>
                  )}
                </div>
              </div>

              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">Issued Date</label>
                  <input
                    type="date"
                    name="issued_date"
                    value={formDataSet.issued_date}
                    onChange={(event) =>
                      handleChange("issued_date", event.target.value)
                    }
                    className="form-control"
                  />
                  {errors.issued_date && (
                    <>
                      <div className="errorMsg">{errors.issued_date}</div>
                    </>
                  )}
                </div>
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">Delivery Date</label>
                  <input
                    type="date"
                    name="delivery_date"
                    value={formDataSet.delivery_date}
                    onChange={(event) =>
                      handleChange("delivery_date", event.target.value)
                    }
                    className="form-control"
                  />
                  {errors.delivery_date && (
                    <>
                      <div className="errorMsg">{errors.delivery_date}</div>
                    </>
                  )}
                </div>
              </div>

              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">Validity</label>
                  <input
                    type="text"
                    name="pi_validity"
                    value={formDataSet.pi_validity}
                    onChange={(event) =>
                      handleChange("pi_validity", event.target.value)
                    }
                    className="form-control"
                  />
                  {errors.pi_validity && (
                    <>
                      <div className="errorMsg">{errors.pi_validity}</div>
                    </>
                  )}
                </div>
              </div>
              <div className="col-lg-6 ">
                <label className="form-label">
                  SoftCopy From Supplier (PDF Only)
                </label>
                <div className="create_tp_attatchment">
                  <MultipleFileInput
                    label="Attatchments"
                    inputId="Attatchments"
                    selectedFiles={selectedFiles}
                    setSelectedFiles={setSelectedFiles}
                  />
                </div>
              </div>
            </div>
            <hr></hr>
            <h6>ITEM'S</h6>
            <div className="Import_booking_item_table">
              <table className="table text-start align-middle table-bordered">
                <thead className="bg-dark text-white">
                  <tr className="text-center">
                    <th>Item</th>
                    <th>Item Details</th>
                    <th>Color</th>
                    <th>Unit</th>
                    <th>Unit Price</th>
                    <th>QTY</th>
                    <th>Total</th>
                    <th>Hscodes</th>
                  </tr>
                </thead>
                <tbody>
                  {piItems.map((item, index) => (
                    <tr key={index} style={{ verticalAlign: "top" }}>
                      <td>{formDataSet.booking_item || ""}</td>
                      <td>{item.item_description || ""}</td>
                      <td>{item.item_color || ""}</td>
                      <td>{item.unit || ""}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={item.unit_price || ""}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "unit_price",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={item.booking_qty || ""}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "booking_qty",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="text-end">
                        {parseFloat(item.total_price || 0).toFixed(2)}
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={item.hscode || ""}
                          onChange={(e) =>
                            handleItemChange(index, "hscode", e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}

                  <tr>
                    <td colSpan={5}>
                      <strong>TOTAL</strong>
                    </td>
                    <td>
                      <strong>{netTotalQty}</strong>
                    </td>
                    <td>
                      <strong>{netTotalAmount}</strong>
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <br />

            <hr />
            <h5 className="text-center">Term & Beneficiery Details</h5>
            <hr />
            <div className="row">
              <div className="col-lg-8">
                <div className="row">
                  <div className="col-lg-3">
                    <div className="form-group">
                      <label className="form-label">Net Weight</label>
                      <input
                        type="text"
                        onChange={(event) =>
                          handleChange("net_weight", event.target.value)
                        }
                        value={formDataSet.net_weight}
                        name="net_weight"
                        className="form-control"
                      />
                      {errors.net_weight && (
                        <>
                          <div className="errorMsg">{errors.net_weight}</div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="form-group">
                      <label className="form-label">Gross Weight</label>
                      <input
                        type="text"
                        onChange={(event) =>
                          handleChange("gross_weight", event.target.value)
                        }
                        value={formDataSet.gross_weight}
                        name="gross_weight"
                        className="form-control"
                      />
                      {errors.gross_weight && (
                        <>
                          <div className="errorMsg">{errors.gross_weight}</div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="form-group">
                      <label className="form-label">Freight Charge</label>
                      <input
                        type="number"
                        onWheel={(event) => event.target.blur()}
                        min={0}
                        onChange={(event) =>
                          handleChange("freight_charge", event.target.value)
                        }
                        value={formDataSet.freight_charge}
                        name="freight_charge"
                        className="form-control"
                      />
                      {errors.freight_charge && (
                        <>
                          <div className="errorMsg">
                            {errors.freight_charge}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="col-lg-3">
                    <label className="form-label">
                      Payment Terms <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      value={formDataSet.payment_terms}
                      onChange={(e) =>
                        handleChange("payment_terms", e.target.value)
                      }
                    />
                    {errors.payment_terms && (
                      <>
                        <div className="errorMsg">{errors.payment_terms}</div>
                      </>
                    )}
                  </div>
                  <div className="col-lg-3">
                    <label className="form-label">
                      Mode of Shipment <span className="text-danger">*</span>
                    </label>

                    <select
                      className="form-control"
                      value={formDataSet.mode_of_shipment}
                      onChange={(e) =>
                        handleChange("mode_of_shipment", e.target.value)
                      }
                    >
                      <option value="">Select One</option>
                      <option value="Sea">Sea</option>
                      <option value="Air">Air</option>
                      <option value="Road">Road</option>
                    </select>
                    {errors.mode_of_shipment && (
                      <>
                        <div className="errorMsg">
                          {errors.mode_of_shipment}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="col-lg-3">
                    <label className="form-label">
                      Port of Loading <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      value={formDataSet.port_of_loading}
                      onChange={(e) =>
                        handleChange("port_of_loading", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-lg-3">
                    <label className="form-label">
                      Port of Discharge <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      value={formDataSet.port_of_discharge}
                      onChange={(e) =>
                        handleChange("port_of_discharge", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        value={formDataSet.description}
                        onChange={(e) =>
                          handleChange("description", e.target.value)
                        }
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label className="form-label">Beneficiery Details</label>
                  <input
                    type="text"
                    onChange={(event) =>
                      handleChange("bank_account_name", event.target.value)
                    }
                    value={formDataSet.bank_account_name}
                    name="bank_account_name"
                    className="form-control"
                    placeholder="Account Name"
                  />
                  {errors.bank_account_name && (
                    <div className="errorMsg">{errors.bank_account_name}</div>
                  )}
                  <br />
                  <input
                    type="number"
                    onWheel={(event) => event.target.blur()}
                    onChange={(event) =>
                      handleChange("bank_account_number", event.target.value)
                    }
                    value={formDataSet.bank_account_number}
                    name="bank_account_number"
                    className="form-control"
                    placeholder="Account Number"
                  />
                  {errors.bank_account_number && (
                    <div className="errorMsg">{errors.bank_account_number}</div>
                  )}
                  <br />
                  <input
                    type="text"
                    onChange={(event) =>
                      handleChange("bank_name", event.target.value)
                    }
                    value={formDataSet.bank_name}
                    name="bank_name"
                    className="form-control"
                    placeholder="Bank Name"
                  />
                  {errors.bank_name && (
                    <div className="errorMsg">{errors.bank_name}</div>
                  )}
                  <br />
                  <input
                    type="text"
                    onChange={(event) =>
                      handleChange("bank_brunch_name", event.target.value)
                    }
                    value={formDataSet.bank_brunch_name}
                    name="bank_brunch_name"
                    className="form-control"
                    placeholder="Brunch Name"
                  />
                  {errors.bank_brunch_name && (
                    <div className="errorMsg">{errors.bank_brunch_name}</div>
                  )}
                  <br />
                  <input
                    type="text"
                    onChange={(event) =>
                      handleChange("bank_address", event.target.value)
                    }
                    value={formDataSet.bank_address}
                    name="bank_address"
                    className="form-control"
                    placeholder="Bank Address"
                  />
                  {errors.bank_address && (
                    <div className="errorMsg">{errors.bank_address}</div>
                  )}
                  <br />
                  <input
                    type="text"
                    onChange={(event) =>
                      handleChange("bank_swift_code", event.target.value)
                    }
                    value={formDataSet.bank_swift_code}
                    name="bank_swift_code"
                    className="form-control"
                    placeholder="Swift Code"
                  />
                  {errors.bank_swift_code && (
                    <div className="errorMsg">{errors.bank_swift_code}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
      </form>
    </div>
  );
}
