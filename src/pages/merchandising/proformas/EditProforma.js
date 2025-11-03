import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import api from "services/api";
import Spinner from "elements/Spinner";
import swal from "sweetalert";
import CustomSelect from "elements/CustomSelect";
import Logo from "../../../assets/images/logos/logo-short.png";
import MultipleFileInput from "elements/techpack/MultipleFileInput";
import QuailEditor from "elements/QuailEditor";

export default function EditProforma() {
  const params = useParams();
  const history = useHistory();

  const [spinner, setSpinner] = useState(false);
  const [errors, setErrors] = useState({});
  const [bookings, setBookings] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]); // new uploads
  const [existingFiles, setExistingFiles] = useState([]); // files already on server
  const [piItems, setPiItems] = useState([]);

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

  // fetch bookings & suppliers
  const getBookings = async () => {
    try {
      setSpinner(true);
      const res = await api.post("/merchandising/bookings-public");
      if (res.status === 200 && res.data) setBookings(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSpinner(false);
    }
  };

  const getSuppliers = async () => {
    try {
      setSpinner(true);
      const res = await api.post("/admin/suppliers");
      if (res.status === 200 && res.data) setSuppliers(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSpinner(false);
    }
  };

  // fetch proforma details
  const fetchProformaDetails = async () => {
    try {
      setSpinner(true);
      var res = await api.post("/merchandising/proformas-show", {
        id: params.id,
      });
      if (res.status === 200 && res.data.data) {
        const d = res.data.data;
        setFormDataSet({
          id: d.id || "",
          booking_id: d.booking_id || "",
          supplier_id: d.supplier_id || "",
          booking_item: d.booking_item || d.item?.title || "",
          title: d.title || "",
          issued_date: d.issued_date || "",
          delivery_date: d.delivery_date || "",
          pi_validity: d.pi_validity || "",
          net_weight: d.net_weight || "",
          gross_weight: d.gross_weight || "",
          freight_charge: d.freight_charge || "",
          bank_account_name: d.bank_account_name || "",
          bank_account_number: d.bank_account_number || "",
          bank_name: d.bank_name || "",
          bank_brunch_name: d.bank_brunch_name || "",
          bank_address: d.bank_address || "",
          bank_swift_code: d.bank_swift_code || "",
          payment_terms: d.payment_terms || "",
          mode_of_shipment: d.mode_of_shipment || "",
          port_of_loading: d.port_of_loading || "",
          port_of_discharge: d.port_of_discharge || "",
          description: d.description || "",
        });

        // items expected as array of proforma items
        const items = (d.items || []).map((it) => ({
          id: it.id ?? null,
          booking_id: it.booking_id ?? "",
          item_id: it.item_id ?? "",
          garment_color: it.garment_color ?? "",
          size_range: it.size_range ?? "",
          item_description: it.item_description ?? "",
          item_size: it.item_size ?? "",
          item_color: it.item_color ?? "",
          garment_qty: it.garment_qty ?? "",
          consumption: it.consumption ?? "",
          wastage: it.wastage ?? "",
          final_qty: it.final_qty ?? "",
          booking_qty: it.booking_qty ?? "",
          unit: it.unit ?? "",
          unit_price: it.unit_price ?? "",
          total_price: it.total_price ?? "0.00",
          sample_requirement: it.sample_requirement ?? "",
          comment: it.comment ?? "",
          hscode: it.hscode ?? "",
        }));
        setPiItems(items);

        // files
        setExistingFiles(d.files || []);
      } else {
        swal("Error", "Proforma not found", "error");
        history.push("/merchandising/proformas");
      }
    } catch (err) {
      console.error(err);
      swal("Error", "Failed to fetch proforma", "error");
    } finally {
      setSpinner(false);
    }
  };

  useEffect(() => {
    getBookings();
    getSuppliers();
    fetchProformaDetails();
  }, []);

  const handleChange = async (name, value) => {
    setFormDataSet((prev) => ({ ...prev, [name]: value }));

    if (name === "booking_id" && value) {
      try {
        setSpinner(true);
        const res = await api.get(`/merchandising/bookings/${value}`);
        if (res.status === 200 && res.data.data) {
          const data = res.data.data;
          setPiItems(data.items || []);
          setFormDataSet((prev) => ({
            ...prev,
            supplier_id: data.supplier_id || prev.supplier_id,
            booking_item: data.item?.title || prev.booking_item,
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSpinner(false);
      }
    }
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...piItems];
    const item = { ...updated[index] };
    item[field] = value;

    if (field === "booking_qty" || field === "unit_price") {
      const qty = parseFloat(item.booking_qty || 0);
      const price = parseFloat(item.unit_price || 0);
      item.total_price = (qty * price || 0).toFixed(2);
    }

    updated[index] = item;
    setPiItems(updated);
  };

  // totals
  const netTotalAmount = piItems.reduce(
    (total, itm) => total + parseFloat(itm.total_price || 0),
    0
  );
  const netTotalQty = piItems.reduce(
    (total, itm) => total + parseFloat(itm.booking_qty || 0),
    0
  );

  // remove an existing file (mark for deletion)
  const handleRemoveExistingFile = (fileId) => {
    // optimistic UI remove: move from existingFiles to deleted list in state
    setExistingFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const validateForm = () => {
    let formErrors = {};

    if (!formDataSet.booking_id)
      formErrors.booking_id = "Please Select A Booking";
    if (!formDataSet.supplier_id)
      formErrors.supplier_id = "Please Select Supplier";
    if (!formDataSet.title) formErrors.title = "PI Number is required";
    if (!formDataSet.issued_date)
      formErrors.issued_date = "Issued Date is required";
    if (!formDataSet.delivery_date)
      formErrors.delivery_date = "Delivery Date is required";
    if (!formDataSet.pi_validity)
      formErrors.pi_validity = "PI Validity is required";
    if (!formDataSet.net_weight)
      formErrors.net_weight = "Net Weight is required";
    if (!formDataSet.gross_weight)
      formErrors.gross_weight = "Gross Weight is required";
    if (!formDataSet.payment_terms)
      formErrors.payment_terms = "Payment Terms is Required";
    if (!formDataSet.mode_of_shipment)
      formErrors.mode_of_shipment = "Shipment mode is required";
    if (!formDataSet.bank_account_name)
      formErrors.bank_account_name = "Bank Account is Required";
    if (!formDataSet.bank_account_number)
      formErrors.bank_account_number = "Bank Account Number is Required";
    if (!formDataSet.bank_name) formErrors.bank_name = "Bank Name is Required";
    if (!formDataSet.bank_brunch_name)
      formErrors.bank_brunch_name = "Bank Brunch Name is Required";
    if (!formDataSet.bank_swift_code)
      formErrors.bank_swift_code = "Bank Swift Code is Required";
    if (!piItems || piItems.length === 0)
      formErrors.piItems = "Please add at least one item";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // At least one copy should exist (either existingFiles or selectedFiles)
    if (existingFiles.length === 0 && selectedFiles.length === 0) {
      swal("Please Upload PI copy (PDF)", { icon: "error" });
      return;
    }

    // build form data
    const formData = new FormData();
    Object.keys(formDataSet).forEach((k) => {
      formData.append(k, formDataSet[k] ?? "");
    });

    // append items JSON
    formData.append("proforma_items", JSON.stringify(piItems));

    // include IDs of files that remain (server should remove any not included) - we'll send remaining file ids
    // If your backend expects file deletion separately, adjust accordingly.
    const remainingFileIds = existingFiles.map((f) => f.id);
    formData.append("existing_file_ids", JSON.stringify(remainingFileIds));

    // new attachments
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("attatchments[]", selectedFiles[i]);
    }

    try {
      setSpinner(true);
      var res = await api.post("/merchandising/proformas-update", formData);

      if (res.status === 200) {
        swal("Success", "Proforma updated successfully", "success");
        history.push("/merchandising/proformas");
      } else if (res.data && res.data.errors) {
        setErrors(res.data.errors);
      } else {
        swal("Error", "Failed to update proforma", "error");
      }
    } catch (err) {
      console.error(err);
      swal("Error", err.message || "Update failed", "error");
    } finally {
      setSpinner(false);
    }
  };

  return (
    <div className="create_edit_page create_technical_pack">
      {spinner && <Spinner />}
      <form onSubmit={handleSubmit} className="create_tp_body">
        <div className="d-flex align-items-end justify-content-between">
          <div className="d-flex align-items-end">
            <img src={Logo} alt="Logo" style={{ width: 35, marginRight: 10 }} />
            <h4 className="m-0">EDIT PI</h4>
          </div>
          <div className="d-flex align-items-end">
            <button
              type="submit"
              className="publish_btn btn btn-warning bg-falgun me-4"
            >
              Update
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
              {/* Booking */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">
                    Booking Number <sup>*</sup>
                  </label>
                  <CustomSelect
                    placeholder="Select"
                    onChange={(selectedOption) =>
                      handleChange("booking_id", selectedOption?.value || "")
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
                    <div className="errorMsg">{errors.booking_id}</div>
                  )}
                </div>
              </div>

              {/* Supplier */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">
                    Supplier <sup>*</sup>
                  </label>
                  <CustomSelect
                    placeholder="Select"
                    onChange={(selectedOption) =>
                      handleChange("supplier_id", selectedOption?.value || "")
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
                    isDisabled
                  />
                  {errors.supplier_id && (
                    <div className="errorMsg">{errors.supplier_id}</div>
                  )}
                </div>
              </div>

              {/* PI No */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">
                    PI NO.<sup>*</sup>
                  </label>
                  <input
                    className="form-control"
                    name="title"
                    value={formDataSet.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                  />
                  {errors.title && (
                    <div className="errorMsg">{errors.title}</div>
                  )}
                </div>
              </div>

              {/* Issued Date */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">Issued Date</label>
                  <input
                    type="date"
                    name="issued_date"
                    value={formDataSet.issued_date}
                    onChange={(e) =>
                      handleChange("issued_date", e.target.value)
                    }
                    className="form-control"
                  />
                  {errors.issued_date && (
                    <div className="errorMsg">{errors.issued_date}</div>
                  )}
                </div>
              </div>

              {/* Delivery Date */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">Delivery Date</label>
                  <input
                    type="date"
                    name="delivery_date"
                    value={formDataSet.delivery_date}
                    onChange={(e) =>
                      handleChange("delivery_date", e.target.value)
                    }
                    className="form-control"
                  />
                  {errors.delivery_date && (
                    <div className="errorMsg">{errors.delivery_date}</div>
                  )}
                </div>
              </div>

              {/* Validity */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">Validity</label>
                  <input
                    type="text"
                    name="pi_validity"
                    value={formDataSet.pi_validity}
                    onChange={(e) =>
                      handleChange("pi_validity", e.target.value)
                    }
                    className="form-control"
                  />
                  {errors.pi_validity && (
                    <div className="errorMsg">{errors.pi_validity}</div>
                  )}
                </div>
              </div>

              {/* Attachments input area */}
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

            <hr />
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
                      <td>
                        {formDataSet.booking_item ||
                          item.item_description ||
                          ""}
                      </td>
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
                    <td className="text-end">
                      <strong>{netTotalAmount.toFixed(2)}</strong>
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
                  {/* Net weight */}
                  <div className="col-lg-3">
                    <div className="form-group">
                      <label className="form-label">Net Weight(KG)</label>
                      <input
                        type="number"
                        onChange={(e) =>
                          handleChange("net_weight", e.target.value)
                        }
                        value={formDataSet.net_weight}
                        name="net_weight"
                        className="form-control"
                      />
                      {errors.net_weight && (
                        <div className="errorMsg">{errors.net_weight}</div>
                      )}
                    </div>
                  </div>

                  {/* Gross weight */}
                  <div className="col-lg-3">
                    <div className="form-group">
                      <label className="form-label">Gross Weight(KG)</label>
                      <input
                        type="number"
                        onChange={(e) =>
                          handleChange("gross_weight", e.target.value)
                        }
                        value={formDataSet.gross_weight}
                        name="gross_weight"
                        className="form-control"
                      />
                      {errors.gross_weight && (
                        <div className="errorMsg">{errors.gross_weight}</div>
                      )}
                    </div>
                  </div>

                  {/* Freight */}
                  <div className="col-lg-3">
                    <div className="form-group">
                      <label className="form-label">Freight Charge</label>
                      <input
                        type="number"
                        onWheel={(event) => event.target.blur()}
                        min={0}
                        onChange={(e) =>
                          handleChange("freight_charge", e.target.value)
                        }
                        value={formDataSet.freight_charge}
                        name="freight_charge"
                        className="form-control"
                      />
                      {errors.freight_charge && (
                        <div className="errorMsg">{errors.freight_charge}</div>
                      )}
                    </div>
                  </div>

                  {/* Payment terms */}
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
                      <div className="errorMsg">{errors.payment_terms}</div>
                    )}
                  </div>

                  {/* Mode of shipment */}
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
                      <div className="errorMsg">{errors.mode_of_shipment}</div>
                    )}
                  </div>

                  {/* Port of loading */}
                  <div className="col-lg-3">
                    <label className="form-label">Port of Loading</label>
                    <input
                      className="form-control"
                      value={formDataSet.port_of_loading}
                      onChange={(e) =>
                        handleChange("port_of_loading", e.target.value)
                      }
                    />
                  </div>

                  {/* Port of discharge */}
                  <div className="col-lg-3">
                    <label className="form-label">Port of Discharge</label>
                    <input
                      className="form-control"
                      value={formDataSet.port_of_discharge}
                      onChange={(e) =>
                        handleChange("port_of_discharge", e.target.value)
                      }
                    />
                  </div>

                  {/* Description */}
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <QuailEditor
                        content={formDataSet.description}
                        onContentChange={(e) => handleChange("description", e)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Beneficiary details */}
              <div className="col-lg-4">
                <div className="form-group">
                  <label className="form-label">Beneficiery Details</label>
                  <input
                    type="text"
                    onChange={(e) =>
                      handleChange("bank_account_name", e.target.value)
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
                    onChange={(e) =>
                      handleChange("bank_account_number", e.target.value)
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
                    onChange={(e) => handleChange("bank_name", e.target.value)}
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
                    onChange={(e) =>
                      handleChange("bank_brunch_name", e.target.value)
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
                    onChange={(e) =>
                      handleChange("bank_address", e.target.value)
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
                    onChange={(e) =>
                      handleChange("bank_swift_code", e.target.value)
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

        {/* Existing attachments list with remove option */}
        {existingFiles.length > 0 && (
          <>
            <hr />
            <h6>Existing Attachments</h6>
            <ul>
              {existingFiles.map((f) => (
                <li key={f.id ?? f.filename} style={{ marginBottom: 6 }}>
                  <a href={f.file_source} target="_blank" rel="noreferrer">
                    {f.filename}
                  </a>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger ms-2"
                    onClick={() => handleRemoveExistingFile(f.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        <hr />
        <h6>Upload New Attachments</h6>
        <MultipleFileInput
          label="Attachments"
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
        />

        <br />
        <br />
      </form>
    </div>
  );
}
