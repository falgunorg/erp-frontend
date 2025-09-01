import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import swal from "sweetalert";
import Quill from "quill";
// modals

export default function EditProforma(props) {
  const params = useParams();
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);

  // retrive data
  const [selectedFiles, setSelectedFiles] = useState([]);
  const handleFileSelection = (event) => {
    const files = event.target.files;
    setSelectedFiles([...selectedFiles, ...files]);
  };
  const handleFileDelete = (index) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
  };

  // Contracts
  const [contracts, setContracts] = useState([]);
  const getContracts = async () => {
    setSpinner(true);
    var response = await api.post("/purchase-contracts");
    if (response.status === 200 && response.data) {
      setContracts(response.data.data);
    } else {
    }
    setSpinner(false);
  };

  // bookings
  const [bookings, setBookings] = useState([]);
  const getBookings = async (supplier_id) => {
    setSpinner(true);
    var response = await api.post("/bookings", { supplier_id: supplier_id });
    if (response.status === 200 && response.data) {
      setBookings(response.data.data);
    } else {
    }
    setSpinner(false);
  };

  // unit
  const [units, setUnits] = useState([]);
  const getUnits = async () => {
    setSpinner(true);
    var response = await api.post("/common/units");
    if (response.status === 200 && response.data) {
      setUnits(response.data.data);
    }
    setSpinner(false);
  };

  // suppliers
  const [suppliers, setSuppliers] = useState([]);
  const getSuppliers = async () => {
    setSpinner(true);
    var response = await api.post("/suppliers");
    if (response.status === 200 && response.data) {
      setSuppliers(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  // item showing and adding
  const [errors, setErrors] = useState({});
  const [formDataSet, setFormDataSet] = useState({
    purchase_contract_id: "",
    supplier_id: "",
    company_id: "",
    title: "",
    currency: "",
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
  });

  const handleChange = (ev) => {
    if (ev.target.name === "supplier_id") {
      getBookings(ev.target.value);
    }
    setFormDataSet({
      ...formDataSet,
      [ev.target.name]: ev.target.value,
    });
  };

  const validateForm = () => {
    let formErrors = {};
    // personal info
    if (!formDataSet.purchase_contract_id) {
      formErrors.purchase_contract_id = "Please Select A Contract";
    }
    if (!formDataSet.supplier_id) {
      formErrors.supplier_id = "Please Select Supplier";
    }
    if (!formDataSet.company_id) {
      formErrors.company_id = "Company is required";
    }

    if (!formDataSet.title) {
      formErrors.title = "PI Number is required";
    }

    if (!formDataSet.currency) {
      formErrors.currency = "Currency is required";
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
    if (!formDataSet.freight_charge) {
      formErrors.freight_charge = "Freight charge is required";
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

  const [piItems, setPiItems] = useState([]);

  const removeRow = (index) => {
    const updatedItems = [...piItems];
    updatedItems.splice(index, 1);
    setPiItems(updatedItems);
  };

  const addRow = () => {
    const newItem = {
      booking_id: "",
      bookingItems: [],
      booking_item_id: "",
      item_id: "",
      description: "",
      qty: 0,
      unit: "",
      unit_price: 0,
      total: 0,
      // for limitation
      booking_qty: 0,
      booking_unit_price: 0,
      booking_total: 0,
      already_added: 0,
    };

    setPiItems([...piItems, newItem]);
  };

  const handleItemChange = async (index, field, value) => {
    const updatedItems = [...piItems];

    if (field === "booking_id") {
      setSpinner(true);
      var response = await api.post("/bookings-show", { id: value });
      if (response.status === 200 && response.data) {
        updatedItems[index].bookingItems = response.data.data.booking_items;
      } else {
        updatedItems[index].bookingItems = [];
      }
      setSpinner(false);
      updatedItems[index].booking_id = value;
    } else if (field === "booking_item_id") {
      setSpinner(true);
      try {
        const response = await api.post("/single-booking-item", { id: value });
        if (response.status === 200 && response.data) {
          const singleItem = response.data.data;

          updatedItems[index].booking_item_id = singleItem.id;
          updatedItems[index].item_id = singleItem.item_id;
          updatedItems[index].description = singleItem.description;
          updatedItems[index].unit = singleItem.unit;
          updatedItems[index].unit_price = singleItem.unit_price;
          updatedItems[index].qty = singleItem.qty;
          updatedItems[index].total = singleItem.unit_price * singleItem.qty;
          updatedItems[index].already_added = singleItem.already_added;

          // for not excced
          updatedItems[index].booking_qty = parseInt(singleItem.qty);
          updatedItems[index].booking_unit_price = parseFloat(
            singleItem.unit_price
          );
          updatedItems[index].booking_total = parseFloat(singleItem.total);
        } else {
          updatedItems[index].item_id = "";
          updatedItems[index].booking_item_id = "";
          updatedItems[index].description = "";
          updatedItems[index].unit = "";
          updatedItems[index].unit_price = 0;
          updatedItems[index].qty = 0;
          updatedItems[index].total = 0;

          // for not excced
          updatedItems[index].booking_qty = 0;
          updatedItems[index].booking_unit_price = 0;
          updatedItems[index].booking_total = 0;
        }
      } catch (error) {
        console.error("Error fetching budget item:", error);
      } finally {
        setSpinner(false);
      }
    } else if (field === "qty") {
      const qtyLimit = updatedItems[index].booking_qty;
      if (value > qtyLimit) {
        return;
      } else {
        updatedItems[index].qty = value;
      }
    } else if (field === "unit_price") {
      const unitPriceLimit = updatedItems[index].booking_unit_price;
      if (value > unitPriceLimit) {
        return;
      } else {
        updatedItems[index].unit_price = value;
      }
    } else if (field === "total") {
      const totalLimit = updatedItems[index].booking_total;

      if (value > totalLimit) {
        return;
      } else {
        updatedItems[index].total = value;
      }
    }

    // Update items with value
    updatedItems[index][field] = value;

    // Calculate total for the row
    const qty = parseFloat(updatedItems[index].qty) || 0;
    const unitPrice = parseFloat(updatedItems[index].unit_price) || 0;
    updatedItems[index].total = qty * unitPrice;

    setPiItems(updatedItems);
  };

  const netTotalAmount = piItems.reduce(
    (total, item) => total + parseFloat(item.total),
    0
  );

  const netTotalQty = piItems.reduce(
    (total, item) => total + parseFloat(item.qty),
    0
  );

  const [message, setMessage] = useState("");
  const handleMsgChange = (value) => {
    setMessage(value);
  };

  // Retrive PROFORMA INVOICE

  const getPI = async () => {
    setSpinner(true);
    var response = await api.post("/proformas-show", { id: params.id });
    if (response.status === 200 && response.data) {
      setFormDataSet(response.data.data);
      getBookings(response.data.data.supplier_id);
      setPiItems(response.data.data.proforma_items);
      setMessage(response.data.data.description);
    }
    setSpinner(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      if (piItems.length === 0) {
        swal({
          title:
            "There are no Items's in this PI, click on Add Row and fill the data",
          icon: "error",
        });
        return; // Prevent form submission
      }

      var data = new FormData();
      data.append("purchase_contract_id", formDataSet.purchase_contract_id);
      data.append("supplier_id", formDataSet.supplier_id);
      data.append("company_id", formDataSet.company_id);
      data.append("title", formDataSet.title);
      data.append("currency", formDataSet.currency);
      data.append("issued_date", formDataSet.issued_date);
      data.append("delivery_date", formDataSet.delivery_date);
      data.append("pi_validity", formDataSet.pi_validity);
      data.append("net_weight", formDataSet.net_weight);
      data.append("gross_weight", formDataSet.gross_weight);
      data.append("freight_charge", formDataSet.freight_charge);
      data.append("description", message);
      data.append("bank_account_name", formDataSet.bank_account_name);
      data.append("bank_account_number", formDataSet.bank_account_number);
      data.append("bank_brunch_name", formDataSet.bank_brunch_name);
      data.append("bank_name", formDataSet.bank_name);
      data.append("bank_address", formDataSet.bank_address);
      data.append("bank_swift_code", formDataSet.bank_swift_code);
      data.append("proforma_items", JSON.stringify(piItems));
      data.append("id", formDataSet.id);
      for (let i = 0; i < selectedFiles.length; i++) {
        data.append("attatchments[]", selectedFiles[i]);
      }
      setSpinner(true);
      var response = await api.post("/proformas-update", data);
      if (response.status === 200 && response.data) {
        history.push("/merchandising/proformas");
      } else {
        setErrors(response.data.errors);
      }
      setSpinner(false);
    }
  };

  const [companies, setCompanies] = useState([]);
  const getCompanies = async () => {
    var response = await api.post("/common/companies", { type: "Own" });
    if (response.status === 200 && response.data) {
      setCompanies(response.data.data);
    }
  };
  const [currencies, setCurrencies] = useState([]);
  const getCurrencies = async () => {
    var response = await api.get("/common/currencies");
    if (response.status === 200 && response.data) {
      setCurrencies(response.data);
    }
  };

  useEffect(async () => {
    getContracts();
    getCompanies();
    getCurrencies();
    getUnits();
    getSuppliers();
    getPI();
    getBookings();
  }, []);

  useEffect(async () => {
    props.setSection("merchandising");
  }, []);

  useEffect(() => {
    const validateDuplicatePiItem = () => {
      const itemMap = new Map();
      let isDuplicate = false;

      piItems.forEach((item, index) => {
        const { booking_item_id } = item;
        const key = `${booking_item_id}`;

        if (itemMap.has(key)) {
          isDuplicate = true;
          itemMap.get(key).push(index);
        } else {
          itemMap.set(key, [index]);
        }
      });

      if (isDuplicate) {
        itemMap.forEach((indices, key) => {
          if (indices.length > 1) {
            swal({
              title: "Duplicate Booking item",
              text: "Item Already Selected",
              icon: "warning",
            }).then(() => {
              const updatedItems = [...piItems];
              indices.reverse().forEach((index, i) => {
                if (i !== 0) {
                  updatedItems.splice(index, 1);
                }
              });
              setPiItems(updatedItems);
            });
          }
        });
      }
    };

    validateDuplicatePiItem();
  }, [piItems]);

  useEffect(() => {
    const checkAccess = async () => {
      if (props.userData?.department_title !== "Merchandising") {
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
      <form onSubmit={handleSubmit}>
        <div className="create_page_heading">
          <div className="page_name">Update PI</div>
          <div className="actions">
            <button
              type="supmit"
              className="publish_btn btn btn-warning bg-falgun"
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
        <div className="col-lg-12">
          <div className="personal_data">
            <div className="row">
              <div className="col-lg-3">
                <div className="form-group">
                  <label>
                    Purchase Contract<sup>*</sup>
                  </label>

                  <select
                    name="purchase_contract_id"
                    value={formDataSet.purchase_contract_id}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Select Contract</option>
                    {contracts.length > 0 ? (
                      contracts.map((item, index) => (
                        <option key={index} value={item.id}>
                          {item.title}
                        </option>
                      ))
                    ) : (
                      <option value="">No Contract found</option>
                    )}
                  </select>
                  {errors.purchase_contract_id && (
                    <>
                      <div className="errorMsg">
                        {errors.purchase_contract_id}
                      </div>
                      <br />
                    </>
                  )}
                </div>
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label>
                    Supplier <sup>*</sup>
                  </label>

                  <select
                    name="supplier_id"
                    value={formDataSet.supplier_id}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.length > 0 ? (
                      suppliers.map((item, index) => (
                        <option key={index} value={item.id}>
                          {item.company_name}
                        </option>
                      ))
                    ) : (
                      <option value="">No Contract found</option>
                    )}
                  </select>
                  {errors.supplier_id && (
                    <>
                      <div className="errorMsg">{errors.supplier_id}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label>
                    Company <sup>*</sup>
                  </label>
                  <select
                    name="company_id"
                    value={formDataSet.company_id}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Select Company</option>
                    {companies.length > 0 ? (
                      companies.map((item, index) => (
                        <option key={index} value={item.id}>
                          {item.title}
                        </option>
                      ))
                    ) : (
                      <option value="">No company found</option>
                    )}
                  </select>
                  {errors.company_id && (
                    <>
                      <div className="errorMsg">{errors.company_id}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label>
                    PI NO.<sup>*</sup>
                  </label>
                  <input
                    className="form-control"
                    name="title"
                    value={formDataSet.title}
                    onChange={handleChange}
                  />
                  {errors.title && (
                    <>
                      <div className="errorMsg">{errors.title}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label>Currency</label>
                  <select
                    onChange={handleChange}
                    value={formDataSet.currency}
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
                  {errors.currency && (
                    <>
                      <div className="errorMsg">{errors.currency}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>

              <div className="col-lg-3">
                <div className="form-group">
                  <label>Issued Date</label>
                  <input
                    type="date"
                    name="issued_date"
                    value={formDataSet.issued_date}
                    onChange={handleChange}
                    className="form-control"
                  />
                  {errors.issued_date && (
                    <>
                      <div className="errorMsg">{errors.issued_date}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label>Delivery Date</label>
                  <input
                    type="date"
                    name="delivery_date"
                    value={formDataSet.delivery_date}
                    onChange={handleChange}
                    className="form-control"
                  />
                  {errors.delivery_date && (
                    <>
                      <div className="errorMsg">{errors.delivery_date}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>

              <div className="col-lg-3">
                <div className="form-group">
                  <label>Validity</label>
                  <input
                    type="text"
                    name="pi_validity"
                    value={formDataSet.pi_validity}
                    onChange={handleChange}
                    className="form-control"
                  />
                  {errors.pi_validity && (
                    <>
                      <div className="errorMsg">{errors.pi_validity}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>

              <div className="col-lg-6">
                <div className="form-group">
                  <label htmlFor="attachments">SoftCopy From Supplier: </label>
                  <small className="text-muted"> (PDF Only)</small>
                  <div className="d-flex mb-10">
                    <input
                      type="file"
                      className="form-control margin_bottom_0"
                      multiple
                      onChange={handleFileSelection}
                      id="input_files"
                    />
                    <div className="d-flex margin_left_30">
                      <label
                        for="input_files"
                        className="btn btn-warning bg-falgun rounded-circle btn-xs"
                      >
                        <i className="fal fa-plus"></i>
                      </label>
                    </div>
                  </div>

                  {selectedFiles.map((file, index) => (
                    <div key={file.name} className="d-flex mb-10">
                      <input
                        className="form-control margin_bottom_0"
                        disabled
                        value={file.name}
                      />
                      <div className="d-flex">
                        <Link
                          to="#"
                          onClick={() => handleFileDelete(index)}
                          className="btn btn-danger rounded-circle margin_left_15 btn-xs"
                        >
                          <i className="fa fa-times"></i>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <hr></hr>
            <h6>ITEM'S</h6>
            <div className="Import_booking_item_table">
              <table className="table text-start align-middle table-bordered table-hover mb-0">
                <thead className="bg-dark text-white">
                  <tr className="text-center">
                    <th>B.N</th>
                    <th>Item | PO | BGD</th>
                    <th>Item Details</th>
                    <th>Unit</th>
                    <th>QTY</th>
                    <th>Unit Price/Unit</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {piItems.map((item, index) => (
                    <tr
                      key={index}
                      style={{
                        verticalAlign: "top",
                      }}
                    >
                      <td>
                        <select
                          value={item.booking_id}
                          required
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "booking_id",
                              e.target.value
                            )
                          }
                          className="form-select"
                        >
                          <option value="">Select B.N</option>
                          {bookings.map((item, index) => (
                            <option key={index} value={item.id}>
                              {item.booking_number}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <select
                          required
                          style={{ paddingLeft: "2px" }}
                          value={item.booking_item_id}
                          className="form-select"
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "booking_item_id",
                              e.target.value
                            )
                          }
                        >
                          <option value="">Select</option>
                          {item.bookingItems.map((item2, index2) => (
                            <option key={index2} value={item2.id}>
                              {item2.item_name} | {item2.po_number} |
                              {item2.budget_number}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <textarea
                          className="form-control"
                          value={item.description}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <select
                          value={item.unit}
                          required
                          onChange={(e) =>
                            handleItemChange(index, "unit", e.target.value)
                          }
                          className="form-select"
                        >
                          <option value="">Select</option>
                          {units.map((item, index) => (
                            <option key={index} value={item.title}>
                              {item.title}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <input
                          required
                          type="number"
                          onWheel={(event) => event.target.blur()}
                          min="0"
                          className="form-control"
                          onChange={(e) =>
                            handleItemChange(index, "qty", e.target.value)
                          }
                          value={item.qty}
                        />
                      </td>

                      <td>
                        <input
                          required
                          type="number"
                          onWheel={(event) => event.target.blur()}
                          min="0"
                          step=".01"
                          className="form-control"
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "unit_price",
                              e.target.value
                            )
                          }
                          value={item.unit_price}
                        />
                      </td>
                      <td>
                        <div className="d-flex">
                          <input
                            required
                            type="number"
                            onWheel={(event) => event.target.blur()}
                            min="0"
                            readOnly
                            className="form-control"
                            onChange={(e) =>
                              handleItemChange(index, "total", e.target.value)
                            }
                            value={item.total}
                          />
                          <Link to="#">
                            <i
                              style={{
                                marginLeft: "10px",
                                fontSize: "17px",
                                marginTop: "5px",
                              }}
                              onClick={() => removeRow(index)}
                              className="fa fa-times text-danger mr-10 ml-10"
                            ></i>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}

                  <tr className="border_none">
                    <td className="border_none" colSpan={6}></td>
                    <td className="border_none">
                      <div className="add_row text-end">
                        <Link
                          to="#"
                          className="btn btn-info btn-sm"
                          onClick={addRow}
                        >
                          Add Row
                        </Link>
                      </div>
                    </td>
                  </tr>
                  <br />
                  <tr className="text-center">
                    <td colSpan={3}>
                      <h6>Items Summary</h6>
                    </td>
                    <td></td>
                    <td>
                      <h6>{netTotalQty.toFixed(2)}</h6>
                    </td>
                    <td></td>
                    <td>
                      <h6>{netTotalAmount.toFixed(2)}</h6>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <br />

            <hr />
            <h5 className="text-center">Term & Beneficiery Details</h5>
            <hr />
            <div className="row">
              <div className="col-lg-3">
                <div className="form-group">
                  <label>Net Weight</label>
                  <input
                    type="text"
                    onChange={handleChange}
                    value={formDataSet.net_weight}
                    name="net_weight"
                    className="form-control"
                  />
                  {errors.net_weight && (
                    <>
                      <div className="errorMsg">{errors.net_weight}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label>Gross Weight</label>
                  <input
                    type="text"
                    onChange={handleChange}
                    value={formDataSet.gross_weight}
                    name="gross_weight"
                    className="form-control"
                  />
                  {errors.gross_weight && (
                    <>
                      <div className="errorMsg">{errors.gross_weight}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label>Freight Charge</label>
                  <input
                    type="number"
                    onWheel={(event) => event.target.blur()}
                    min={0}
                    onChange={handleChange}
                    value={formDataSet.freight_charge}
                    name="freight_charge"
                    className="form-control"
                  />
                  {errors.freight_charge && (
                    <>
                      <div className="errorMsg">{errors.freight_charge}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>
              <div className="col-lg-8">
                <div className="form-group">
                  <label>Description</label>
                  <Quill
                    className="text_area"
                    onChange={handleMsgChange}
                    value={message}
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <label>Beneficiery Details</label>
                  <input
                    type="text"
                    onChange={handleChange}
                    value={formDataSet.bank_account_name}
                    name="bank_account_name"
                    className="form-control"
                    placeholder="Account Name"
                  />
                  {errors.bank_account_name && (
                    <div className="errorMsg">{errors.bank_account_name}</div>
                  )}
                  <input
                    type="number"
                    onWheel={(event) => event.target.blur()}
                    onChange={handleChange}
                    value={formDataSet.bank_account_number}
                    name="bank_account_number"
                    className="form-control"
                    placeholder="Account Number"
                  />
                  {errors.bank_account_number && (
                    <div className="errorMsg">{errors.bank_account_number}</div>
                  )}
                  <input
                    type="text"
                    onChange={handleChange}
                    value={formDataSet.bank_name}
                    name="bank_name"
                    className="form-control"
                    placeholder="Bank Name"
                  />
                  {errors.bank_name && (
                    <div className="errorMsg">{errors.bank_name}</div>
                  )}
                  <input
                    type="text"
                    onChange={handleChange}
                    value={formDataSet.bank_brunch_name}
                    name="bank_brunch_name"
                    className="form-control"
                    placeholder="Brunch Name"
                  />
                  {errors.bank_brunch_name && (
                    <div className="errorMsg">{errors.bank_brunch_name}</div>
                  )}
                  <input
                    type="text"
                    onChange={handleChange}
                    value={formDataSet.bank_address}
                    name="bank_address"
                    className="form-control"
                    placeholder="Bank Address"
                  />
                  {errors.bank_address && (
                    <div className="errorMsg">{errors.bank_address}</div>
                  )}
                  <input
                    type="text"
                    onChange={handleChange}
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
