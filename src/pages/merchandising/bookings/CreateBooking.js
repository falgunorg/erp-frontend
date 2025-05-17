import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import swal from "sweetalert";
import UnitModal from "../../../elements/modals/UnitModal";
import ColorModal from "../../../elements/modals/ColorModal";
import SizeModal from "../../../elements/modals/SizeModal";
import Select from "react-select";

export default function CreateBooking(props) {
  const history = useHistory();
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

  const handleChange = (name, value) => {
    if (name === "supplier_id") {
      const selectedSupplier = suppliers.find(
        (supplier) => supplier.id === parseInt(value)
      );
      setFormDataSet((prevFormDataSet) => ({
        ...prevFormDataSet,
        booking_to: selectedSupplier.attention_person,
        supplier_id: value,
      }));
    }
    if (name === "company_id") {
      const selectedCompany = companies.find(
        (company) => company.id === parseInt(value)
      );
      setFormDataSet((prevFormDataSet) => ({
        ...prevFormDataSet,
        company_id: value,
        billing_address: selectedCompany ? selectedCompany.address : "",
        delivery_address: selectedCompany ? selectedCompany.address : "",
      }));
    }
    // Move this line outside if statements
    setFormDataSet((prevFormDataSet) => ({
      ...prevFormDataSet,
      [name]: value,
    }));
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

  const [budgets, setBudgets] = useState([]);
  const getBudgets = async () => {
    setSpinner(true);
    var response = await api.post("/budgets", {
      status: "Approved",
      view: "team",
      department: userInfo.department_title,
      designation: userInfo.designation_title,
    });
    if (response.status === 200 && response.data) {
      setBudgets(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const [bookingItems, setBookingItems] = useState([]);
  const removeRow = (index) => {
    const updatedItems = [...bookingItems];
    updatedItems.splice(index, 1);
    setBookingItems(updatedItems);
  };
  const addRow = () => {
    const newItem = {
      budget_id: "",
      budgetItems: [],
      budget_item_id: "",
      description: "",
      photo: null,
      remarks: "",
      unit: "",
      color: "",
      size: "",
      shade: "",
      tex: "",
      unit_price: 0,
      qty: 0,
      total: 0,

      // FOR VALIDATION
      unit_price_limit: 0,
      qty_limit: 0,
      total_amount_limit: 0,
    };
    setBookingItems([...bookingItems, newItem]);
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

    if (field === "budget_id") {
      setSpinner(true);
      var response = await api.post("/budgets-show", { id: value });
      if (response.status === 200 && response.data) {
        updatedItems[index].budgetItems = response.data.data.budget_items;
      } else {
        updatedItems[index].budgetItems = [];
      }
      setSpinner(false);
      updatedItems[index].budget_id = value;
    } else if (field === "budget_item_id") {
      setSpinner(true);
      try {
        const response = await api.post("/single-budgets-item", { id: value });
        if (response.status === 200 && response.data) {
          const singleItem = response.data.data;
          if (
            singleItem.order_total_cost === singleItem.already_booking_total
          ) {
            swal({
              title: "Already Finish Booking Budget",
              text: "Item Already Finish Booking Budget",
              icon: "warning",
            }).then(() => {
              const updatedItemsCopy = [...bookingItems];
              updatedItemsCopy.splice(index, 1);
              setBookingItems(updatedItemsCopy);
            });
          } else {
            updatedItems[index].budget_item_id = singleItem.id;
            updatedItems[index].description = singleItem.description;
            updatedItems[index].unit = singleItem.unit;
            updatedItems[index].color = singleItem.color;
            updatedItems[index].size = singleItem.size;
            updatedItems[index].unit_price = singleItem.unit_price;
            updatedItems[index].qty = singleItem.left_booking_qty;
            updatedItems[index].total =
              singleItem.unit_price * singleItem.left_booking_qty;

            // FOR VALIDATION
            updatedItems[index].unit_price_limit = singleItem.unit_price;
            updatedItems[index].qty_limit = singleItem.left_booking_qty;
            updatedItems[index].total_amount_limit =
              singleItem.left_booking_total;
          }
        } else {
          updatedItems[index].budget_item_id = "";
          updatedItems[index].description = "";
          updatedItems[index].unit = "";
          updatedItems[index].color = "";
          updatedItems[index].size = "";
          updatedItems[index].unit_price = 0;
          updatedItems[index].qty = 0;
          updatedItems[index].total = 0;
        }
      } catch (error) {
        console.error("Error fetching budget item:", error);
      } finally {
        setSpinner(false);
      }
    } else if (field === "qty") {
      const qtyLimit = updatedItems[index].qty_limit;
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
      const totalLimit = updatedItems[index].total_amount_limit;
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

  const [budgetIdValidation, setBudgetIdValidation] = useState({});
  const validateBudgetId = () => {
    const validation = {};
    bookingItems.forEach((item, index) => {
      validation[index] = !!item.budget_id; // Check if purchase_id is not empty
    });
    setBudgetIdValidation(validation);
  };

  useEffect(() => {
    validateBudgetId();
  }, [bookingItems]);
  useEffect(
    () => {
      validateBudgetId();
    },
    bookingItems.map((item) => item.budget_id)
  );
  const handleSubmit = async (event) => {
    event.preventDefault();

    const isAnyInvalid = bookingItems.some((item) => !item.budget_id);
    if (isAnyInvalid) {
      swal({
        title: "Please select Budget Number for all items",
        icon: "error",
      });
      return; // Prevent form submission
    }

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
    getSuppliers();
    getCurrencies();
    getCompanies();
    getBudgets();
    getSizes();
    getUnits();
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

  useEffect(() => {
    const validateDuplicateBudgetItem = () => {
      const itemMap = new Map();
      let isDuplicate = false;

      bookingItems.forEach((item, index) => {
        const { budget_id, budget_item_id } = item;
        const key = `${budget_id}_${budget_item_id}`;

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
              title: "Duplicate budget item",
              text: "A budget item has been selected multiple times.",
              icon: "warning",
            }).then(() => {
              const updatedItems = [...bookingItems];
              indices.reverse().forEach((index, i) => {
                if (i !== 0) {
                  updatedItems.splice(index, 1);
                }
              });
              setBookingItems(updatedItems);
            });
          }
        });
      }
    };

    validateDuplicateBudgetItem();
  }, [bookingItems]);

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
              to="/merchandising/bookings"
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

                  <Select
                    placeholder="Select"
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
                    onChange={(selectedOption) =>
                      handleChange("supplier_id", selectedOption.value)
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
                  <Select
                    placeholder="Select"
                    value={
                      currencies.find(
                        (item) => item.code === formDataSet.currency
                      )
                        ? {
                            value: formDataSet.currency,
                            label:
                              currencies.find(
                                (item) => item.code === formDataSet.currency
                              ).code || "",
                          }
                        : null
                    }
                    onChange={(selectedOption) =>
                      handleChange("currency", selectedOption.value)
                    }
                    name="currency"
                    options={currencies.map((item) => ({
                      value: item.code,
                      label: item.code,
                    }))}
                  />

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
                    onChange={(event) =>
                      handleChange("booking_from", event.target.value)
                    }
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
                    onChange={(event) =>
                      handleChange("booking_to", event.target.value)
                    }
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
                    onChange={(event) =>
                      handleChange("booking_date", event.target.value)
                    }
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
                    onChange={(event) =>
                      handleChange("delivery_date", event.target.value)
                    }
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
                    onChange={(event) =>
                      handleChange("company_id", event.target.value)
                    }
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
                    onChange={(event) =>
                      handleChange("billing_address", event.target.value)
                    }
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
                    onChange={(event) =>
                      handleChange("delivery_address", event.target.value)
                    }
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
                    onChange={(event) =>
                      handleChange("remark", event.target.value)
                    }
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
                      <th>Tex</th>
                      <th>Unit Price</th>
                      <th>QTY</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingItems.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <select
                            required
                            style={{ paddingLeft: "2px" }}
                            value={item.budget_id}
                            className={`form-select ${
                              budgetIdValidation[index] === false
                                ? "is-invalid"
                                : ""
                            }`}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "budget_id",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select Budget</option>
                            {budgets.map((item, index) => (
                              <option key={index} value={item.id}>
                                {item.budget_number} | {item.po_number} |{" "}
                                {item.techpack}
                              </option>
                            ))}
                          </select>
                          {budgetIdValidation[index] === false && (
                            <div className="invalid-feedback">
                              Please select a valid Budget.
                            </div>
                          )}
                        </td>

                        <td>
                          <select
                            required
                            style={{ paddingLeft: "2px" }}
                            value={item.budget_item_id}
                            className="form-select"
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "budget_item_id",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select</option>
                            {item.budgetItems.map((item2, index2) => (
                              <option key={index2} value={item2.id}>
                                {item2.item_name}
                              </option>
                            ))}
                          </select>
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

                    <tr className="border_none">
                      <td className="border_none" colSpan={12}></td>
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
                    <br />
                    <tr className="text-center">
                      <td colSpan={11}>
                        <h6>Items Summary</h6>
                      </td>
                      <td>
                        <h6>{netQty}</h6>
                      </td>
                      <td>
                        <h6>{netTotal}</h6>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br />
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
