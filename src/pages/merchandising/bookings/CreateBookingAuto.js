import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import swal from "sweetalert";
import UnitModal from "../../../elements/modals/UnitModal";
import ColorModal from "../../../elements/modals/ColorModal";
import SizeModal from "../../../elements/modals/SizeModal";

export default function CreateBookingAuto(props) {
  const history = useHistory();
  const params = useParams();
  const userInfo = props.userData;
  const [spinner, setSpinner] = useState(false);
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

  const [currencies, setCurrencies] = useState([]);
  const getCurrencies = async () => {
    var response = await api.get("/currencies");
    if (response.status === 200 && response.data) {
      setCurrencies(response.data);
    }
  };

  const [errors, setErrors] = useState({});
  const [formDataSet, setFormDataSet] = useState({
    supplier_id: "",
    supplier_name: "",
    booking_date: "",
    currency: "",
    company_id: "",
    delivery_date: "",
    billing_address: "",
    delivery_address: "",
    booking_from: userInfo.full_name,
    booking_to: "",
    remark: "",
  });

  const getSupplier = async () => {
    setSpinner(true);
    var response = await api.post("/suppliers-show", {
      id: params.supplier_id,
    });
    if (response.status === 200 && response.data) {
      setFormDataSet({
        ...formDataSet,
        booking_to: response.data.data.attention_person,
        supplier_id: response.data.data.id,
        supplier_name: response.data.data.company_name,
      });
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getSupplier();
  }, []);

  const handleChange = (ev) => {
    var inputName = ev.target.name;
    if (inputName === "company_id") {
      const selectedCompany = companies.find(
        (company) => company.id === parseInt(ev.target.value)
      );
      setFormDataSet({
        ...formDataSet,
        company_id: ev.target.value,
        billing_address: selectedCompany ? selectedCompany.address : "",
        delivery_address: selectedCompany ? selectedCompany.address : "",
      });
    } else {
      setFormDataSet({
        ...formDataSet,
        [inputName]: ev.target.value,
      });
    }
  };

  const validateForm = () => {
    let formErrors = {};

    if (!formDataSet.supplier_id) {
      formErrors.supplier_id = "Supplier is required";
    }
    if (!formDataSet.company_id) {
      formErrors.company_id = "Company is required";
    }
    if (!formDataSet.currency) {
      formErrors.currency = "Currency is required";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const [companies, setCompanies] = useState([]);
  const getCompanies = async () => {
    var response = await api.post("/companies", { type: "Own" });
    if (response.status === 200 && response.data) {
      setCompanies(response.data.data);
    }
  };

  // add items functionlity

  const [colors, setColors] = useState([]);
  const getColors = async () => {
    setSpinner(true);
    var response = await api.post("/colors");
    if (response.status === 200 && response.data) {
      setColors(response.data.data);
    }
    setSpinner(false);
  };

  const [sizes, setSizes] = useState([]);
  const getSizes = async () => {
    setSpinner(true);
    var response = await api.post("/sizes");
    if (response.status === 200 && response.data) {
      setSizes(response.data.data);
    }
    setSpinner(false);
  };

  const [units, setUnits] = useState([]);
  const getUnits = async () => {
    setSpinner(true);
    var response = await api.post("/units");
    if (response.status === 200 && response.data) {
      setUnits(response.data.data);
    }
    setSpinner(false);
  };

  const [bookingItems, setBookingItems] = useState([]);
  const getBookigItems = async () => {
    setSpinner(true);
    var response = await api.post("/budget-items-with-supplier-and-budget", {
      supplier_id: params.supplier_id,
      budget_id: params.budget_id,
    });
    if (response.status === 200 && response.data) {
      setBookingItems(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const removeRow = (index) => {
    const updatedItems = [...bookingItems];
    updatedItems.splice(index, 1);
    setBookingItems(updatedItems);
  };

  // upload photo function
  const [fileInputs, setFileInputs] = useState(
    Array(bookingItems.length).fill(null)
  );

  const [filePreviews, setFilePreviews] = useState(
    Array(bookingItems.length).fill(null)
  );

  // end upload photo

  const handleItemChange = async (index, field, value) => {
    const updatedItems = [...bookingItems];

    if (field === "qty") {
      const qtyLimit = updatedItems[index].left_booking_qty;
      if (value > qtyLimit) {
        return;
      } else {
        updatedItems[index].qty = value;
      }
    } else if (field === "unit_price") {
      const unitPriceLimit = updatedItems[index].unit_price_limit;
      if (value > unitPriceLimit) {
        return;
      } else {
        updatedItems[index].unit_price = value;
      }
    } else if (field === "total") {
      const totalLimit = updatedItems[index].left_booking_total;
      if (value > totalLimit) {
        return;
      } else {
        updatedItems[index].total = value;
      }
    } else if (field === "photo") {
      const newFileInputs = [...fileInputs];
      newFileInputs[index] = value.target.files[0];
      setFileInputs(newFileInputs);
      // Preview the selected image
      const reader = new FileReader();
      reader.onload = (event) => {
        const newFilePreviews = [...filePreviews];
        newFilePreviews[index] = event.target.result;
        setFilePreviews(newFilePreviews);
      };
      reader.readAsDataURL(value.target.files[0]);
      updatedItems[index].photo = value.target.files[0];
    } else {
      updatedItems[index][field] = value;
    }

    const qty = parseFloat(updatedItems[index].qty) || 0;
    const unitPrice = parseFloat(updatedItems[index].unit_price) || 0;
    updatedItems[index].total = qty * unitPrice;
    setBookingItems(updatedItems);
  };
  const netTotal = bookingItems.reduce(
    (total, item) => total + parseFloat(item.total),
    0
  );
  const netQty = bookingItems.reduce(
    (total, item) => total + parseFloat(item.qty),
    0
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (bookingItems.length === 0) {
      swal({
        title:
          "There are no items in this Booking, click on Add Row and fill the data",
        icon: "error",
      });
      return; // Prevent form submission
    }
    if (validateForm()) {
      var data = new FormData();
      data.append("supplier_id", formDataSet.supplier_id);
      data.append("currency", formDataSet.currency);
      data.append("booking_date", formDataSet.booking_date);
      data.append("delivery_date", formDataSet.delivery_date);
      data.append("company_id", formDataSet.company_id);
      data.append("billing_address", formDataSet.billing_address);
      data.append("delivery_address", formDataSet.delivery_address);
      data.append("booking_from", formDataSet.booking_from);
      data.append("booking_to", formDataSet.booking_to);
      data.append("remark", formDataSet.remark);

      for (let i = 0; i < selectedFiles.length; i++) {
        data.append("attatchments[]", selectedFiles[i]);
      }
      bookingItems.forEach((item, index) => {
        // Clone the item to avoid modifying the original
        const clonedItem = { ...item };
        // Check if a file was selected for this item
        if (clonedItem.photo instanceof File) {
          // Append the photo property as binary data
          data.append(`booking_items[${index}][photo]`, clonedItem.photo);
          // Remove the 'photo' property from the item to avoid redundant data
          delete clonedItem.photo;
        }

        // Append other properties of the item
        Object.keys(clonedItem).forEach((key) => {
          data.append(`booking_items[${index}][${key}]`, clonedItem[key]);
        });
      });
      setSpinner(true);
      var response = await api.post("/bookings-create", data);
      if (response.status === 200 && response.data) {
        history.push(
          "/merchandising/bookings-details/" + response.data.data.id
        );
      } else {
        setErrors(response.data.errors);
      }
      setSpinner(false);
    }
  };
  useEffect(async () => {
    getCurrencies();
    getCompanies();
    getSizes();
    getUnits();
    getBookigItems();
  }, []);

  useEffect(async () => {
    getUnits();
  }, [props.callUnits]);
  useEffect(async () => {
    getColors();
  }, [props.callColors]);

  useEffect(async () => {
    getSizes();
  }, [props.callSizes]);

  useEffect(async () => {
    props.setSection("merchandising");
  }, []);
  useEffect(() => {
    const checkAccess = async () => {
      if (userInfo?.department_title !== "Merchandising") {
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
          <div className="page_name">Add New Booking</div>
          <div className="actions">
            <button
              type="supmit"
              className="publish_btn btn btn-warning bg-falgun"
            >
              Save
            </button>
            <Link
              to="/merchandising/bookings-overview"
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
                    Supplier<sup>*</sup>
                  </label>

                  <div className="form-control">
                    {formDataSet.supplier_name}
                  </div>
                  <input
                    type="hidden"
                    value={formDataSet.supplier_id}
                    name="supplier_id"
                  />

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
                    Currency<sup>*</sup>
                  </label>
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
                  <label>Booking From</label>
                  <input
                    type="text"
                    className="form-control"
                    name="booking_from"
                    value={formDataSet.booking_from}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-lg-3">
                <div className="form-group">
                  <label>Booking To</label>
                  <input
                    type="text"
                    className="form-control"
                    name="booking_to"
                    value={formDataSet.booking_to}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label>Booking Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="booking_date"
                    value={formDataSet.booking_date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-lg-3">
                <div className="form-group">
                  <label>Delivery Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="delivery_date"
                    value={formDataSet.delivery_date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    Company / Delivery To<sup>*</sup>
                  </label>
                  <select
                    name="company_id"
                    value={formDataSet.company_id}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Select company</option>
                    {companies.length > 0 ? (
                      companies.map((item, index) => (
                        <option key={index} value={item.id}>
                          {item.title}
                        </option>
                      ))
                    ) : (
                      <option value="0">No company found</option>
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

              <div className="col-lg-6">
                <div className="form-group">
                  <label>Billing Address</label>
                  <textarea
                    value={formDataSet.billing_address}
                    onChange={handleChange}
                    name="billing_address"
                    className="form-control"
                  ></textarea>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group">
                  <label>Delivery Address</label>
                  <textarea
                    value={formDataSet.delivery_address}
                    onChange={handleChange}
                    name="delivery_address"
                    className="form-control"
                  ></textarea>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="form-group">
                  <label>Remark</label>
                  <textarea
                    value={formDataSet.remark}
                    onChange={handleChange}
                    name="remark"
                    className="form-control"
                  ></textarea>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <label htmlFor="attachments">Attachments:</label>
                  <small className="text-muted">
                    {" "}
                    (PDF,Word,Excel,JPEG,PNG file.)
                  </small>
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
          </div>
          <hr></hr>

          <h6>ITEM'S</h6>
          <div className="row">
            <div className="col-lg-12">
              <div className="Import_booking_item_table">
                <table className="table text-start align-middle table-bordered table-hover mb-0">
                  <thead className="bg-dark text-white">
                    <tr className="text-center">
                      <th>Budget | PO | Techpack</th>
                      <th>Item</th>
                      <th>Item Details</th>
                      <th>Attatchment</th>
                      <th>Remarks</th>
                      <th>Unit</th>
                      <th>Color</th>
                      <th>Size</th>
                      <th>Shade</th>
                      <th>TEX</th>
                      <th>Unit Price</th>
                      <th>QTY</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingItems.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="form-control">
                            {item.budget_number} | {item.po_number} |{" "}
                            {item.techpack}
                          </div>
                          <input type="hidden" value={item.budget_id} />
                        </td>
                        <td>
                          <div className="form-control">{item.item_name}</div>
                          <input type="hidden" value={item.budget_item_id} />
                        </td>
                        <td>
                          <textarea
                            value={item.description}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            className="form-control"
                          ></textarea>
                        </td>
                        <td>
                          <label className="file-label">
                            <input
                              required
                              className="file-input"
                              onChange={(e) =>
                                handleItemChange(index, "photo", e)
                              }
                              type="file"
                            />
                            <div className="camera-icon">
                              {!filePreviews[index] ? (
                                <i className="fa fa-camera"></i>
                              ) : null}
                            </div>
                            {filePreviews[index] && (
                              <img
                                src={filePreviews[index]}
                                alt={`Preview ${index}`}
                              />
                            )}
                          </label>
                        </td>
                        <td>
                          <textarea
                            value={item.remarks}
                            onChange={(e) =>
                              handleItemChange(index, "remarks", e.target.value)
                            }
                            className="form-control"
                          ></textarea>
                        </td>
                        <td>
                          <div style={{ position: "relative" }}>
                            <select
                              required
                              style={{ paddingLeft: "2px" }}
                              value={item.unit}
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

                            <i
                              onClick={() => props.setUnitModal(true)}
                              style={{
                                color: "white",
                                background: "green",
                                padding: "2px",
                                cursor: "pointer",
                                borderRadius: "0px 5px 5px 0px",
                                position: "absolute",
                                right: 0,
                                top: 0,
                                padding: "10px 7px",
                                fontSize: "13px",
                              }}
                              className="fa fa-plus bg-falgun"
                            ></i>
                          </div>
                        </td>
                        <td>
                          <div style={{ position: "relative" }}>
                            <select
                              required
                              style={{ paddingLeft: "2px" }}
                              value={item.color}
                              onChange={(e) =>
                                handleItemChange(index, "color", e.target.value)
                              }
                              className="form-select"
                            >
                              <option value="">Select</option>
                              {colors.map((item, index) => (
                                <option key={index} value={item.title}>
                                  {item.title}
                                </option>
                              ))}
                            </select>

                            <i
                              onClick={() => props.setColorModal(true)}
                              style={{
                                color: "white",
                                background: "green",
                                padding: "2px",
                                cursor: "pointer",
                                borderRadius: "0px 5px 5px 0px",
                                position: "absolute",
                                right: 0,
                                top: 0,
                                padding: "10px 7px",
                                fontSize: "13px",
                              }}
                              className="fa fa-plus bg-falgun"
                            ></i>
                          </div>
                        </td>

                        <td>
                          <div style={{ position: "relative" }}>
                            <select
                              required
                              style={{ paddingLeft: "2px" }}
                              value={item.size}
                              onChange={(e) =>
                                handleItemChange(index, "size", e.target.value)
                              }
                              className="form-select"
                            >
                              <option value="">Select</option>
                              {sizes.map((item, index) => (
                                <option key={index} value={item.title}>
                                  {item.title}
                                </option>
                              ))}
                            </select>
                            <i
                              onClick={() => props.setSizeModal(true)}
                              style={{
                                color: "white",
                                background: "green",
                                padding: "2px",
                                cursor: "pointer",
                                borderRadius: "0px 5px 5px 0px",
                                position: "absolute",
                                right: 0,
                                top: 0,
                                padding: "10px 7px",
                                fontSize: "13px",
                              }}
                              className="fa fa-plus bg-falgun"
                            ></i>
                          </div>
                        </td>
                        <td>
                          <input
                            required
                            className="form-control"
                            type="shade"
                            style={{ maxWidth: "100px", paddingLeft: "2px" }}
                            value={item.shade}
                            onChange={(e) =>
                              handleItemChange(index, "shade", e.target.value)
                            }
                          />
                        </td>

                        <td>
                          <select
                            value={item.tex}
                            onChange={(e) =>
                              handleItemChange(index, "tex", e.target.value)
                            }
                            className="form-select"
                            required
                          >
                            <option value="None">None</option>
                            <option value="18">18</option>
                            <option value="27">27</option>
                            <option value="35">35</option>
                            <option value="40">40</option>
                            <option value="60">60</option>
                            <option value="80">80</option>
                            <option value="100">100</option>
                            <option value="110">110</option>
                            <option value="120">120</option>
                            <option value="150">150</option>
                          </select>
                        </td>
                        <td>
                          <input
                            required
                            className="form-control"
                            step=".01"
                            min={0}
                            type="number"
                            onWheel={(event) => event.target.blur()}
                            style={{ maxWidth: "100px", paddingLeft: "2px" }}
                            value={item.unit_price}
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
                            required
                            className="form-control"
                            style={{ maxWidth: "100px", paddingLeft: "2px" }}
                            value={item.qty}
                            onChange={(e) =>
                              handleItemChange(index, "qty", e.target.value)
                            }
                            min={0}
                            type="number"
                            onWheel={(event) => event.target.blur()}
                          />
                        </td>

                        <td>
                          <div className="d-flex gap_10 align-items-center">
                            <input
                              required
                              className="form-control"
                              style={{ maxWidth: "100px", paddingLeft: "2px" }}
                              readOnly
                              step=".01"
                              min={0}
                              value={item.total}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "total",
                                  parseFloat(e.target.value)
                                )
                              }
                            />
                            <Link to="#">
                              <i
                                onClick={() => removeRow(index)}
                                className="fa fa-times text-danger"
                              ></i>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                    <br />
                    <tr className="text-center">
                      <td colSpan={11}>
                        <h6>Items Summary</h6>
                      </td>
                      <td>
                        <h6>{netQty}</h6>
                      </td>
                      <td>
                        <h6>{netTotal.toFixed(2)}</h6>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <br />
                <br />
              </div>
            </div>
          </div>
        </div>
      </form>
      <UnitModal {...props} />
      <ColorModal {...props} />
      <SizeModal {...props} />
    </div>
  );
}
