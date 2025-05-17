import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import swal from "sweetalert";
import Select from "react-select";

// modals
import StyleModal from "../../../elements/modals/StyleModal";
import BuyerModal from "../../../elements/modals/BuyerModal";
import SizeModal from "../../../elements/modals/SizeModal";
import ColorModal from "../../../elements/modals/ColorModal";
import ItemModal from "../../../elements/modals/ItemModal";
import UnitModal from "../../../elements/modals/UnitModal";

export default function EditBudget(props) {
  const history = useHistory();
  const params = useParams();
  const [spinner, setSpinner] = useState(false);
  const userInfo = props.userData;

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

  const [purchases, setPurchases] = useState([]);
  const getPurchases = async () => {
    setSpinner(true);
    var response = await api.post("/purchases", {
      view: "team",
      department: userInfo.department_title,
      designation: userInfo.designation_title,
    });
    if (response.status === 200 && response.data) {
      setPurchases(response.data.data);
    } else {
      console.log(response.data);
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

  const [sizes, setSizes] = useState([]);
  const getSizes = async () => {
    setSpinner(true);
    var response = await api.post("/sizes");
    if (response.status === 200 && response.data) {
      setSizes(response.data.data);
    }
    setSpinner(false);
  };

  const [colors, setColors] = useState([]);
  const getColors = async () => {
    setSpinner(true);
    var response = await api.post("/colors");
    if (response.status === 200 && response.data) {
      setColors(response.data.data);
    }
    setSpinner(false);
  };

  const getBudget = async () => {
    setSpinner(true);
    var response = await api.post("/budgets-show", { id: params.id });
    if (response.status === 200 && response.data) {
      const budgetData = response.data.data;
      setBudgetItems(budgetData.budget_items);
      setFormDataSet({
        purchase_id: budgetData.purchase_id,
        qty: budgetData.qty,
        total_order_value: budgetData.total_order_value,

        sizes: budgetData.sizes ? budgetData.sizes.split(",").map(Number) : [],

        colors: budgetData.colors
          ? budgetData.colors.split(",").map(Number)
          : [],
        brand: budgetData.brand,
        ratio: budgetData.ratio,
        issued_date: budgetData.issued_date,
        product_description: budgetData.product_description,
        note: budgetData.note,
        id: budgetData.id,
      });
    }
    setSpinner(false);
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

  // item showing and adding
  const [items, setItems] = useState([]);
  const getItems = async () => {
    setSpinner(true);
    var response = await api.post("/items");
    if (response.status === 200 && response.data) {
      setItems(response.data.data);
    }
    setSpinner(false);
  };
  const [errors, setErrors] = useState({});
  const [formDataSet, setFormDataSet] = useState({
    purchase_id: "",
    qty: 1,
    total_order_value: "",
    sizes: [],
    colors: [],
    brand: "",
    ratio: "",
    issued_date: "",
    product_description: "",
    note: "",
  });

  const handleChange = (name, value) => {
    if (name === "purchase_id") {
      getPurchase(value);
    }
    setFormDataSet({ ...formDataSet, [name]: value });
  };

  const getPurchase = async (purchase_id) => {
    setSpinner(true);
    var response = await api.post("/purchases-show", { id: purchase_id });
    if (response.status === 200 && response.data) {
      const poData = response.data.data;
      setBudgetItems(poData.costing_items);
      setFormDataSet({
        purchase_id: poData.id,
        qty: poData.total_qty,
        total_order_value: poData.total_amount,
        sizes: poData.sizes ? poData.sizes.split(",").map(Number) : [],
        colors: poData.colors ? poData.colors.split(",").map(Number) : [],
      });
    }
    setSpinner(false);
  };

  const handleSizeChange = (selectedOptions) => {
    const selectedSizeIds = selectedOptions.map((option) => option.value);
    setFormDataSet((prevData) => ({
      ...prevData,
      sizes: selectedSizeIds,
    }));
  };
  const handleColorChange = (selectedOptions) => {
    const selectedColorIds = selectedOptions.map((option) => option.value);
    setFormDataSet((prevData) => ({
      ...prevData,
      colors: selectedColorIds,
    }));
  };

  const validateForm = () => {
    let formErrors = {};
    // personal info
    if (!formDataSet.purchase_id) {
      formErrors.purchase_id = "Purchase is required";
    }

    if (!formDataSet.qty) {
      formErrors.qty = "QTY is required";
    }
    if (!formDataSet.total_order_value) {
      formErrors.total_order_value = "Order Value is required";
    }

    if (!formDataSet.brand) {
      formErrors.brand = "Brand is required";
    }

    if (!formDataSet.colors.length > 0) {
      formErrors.colors = "Colors is required";
    }
    if (!formDataSet.sizes.length > 0) {
      formErrors.sizes = "Sizes is required";
    }

    if (!formDataSet.issued_date) {
      formErrors.issued_date = "Issued Date is required";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const [budgetItems, setBudgetItems] = useState([]);
  const removeRow = (index) => {
    const updatedItems = [...budgetItems];
    updatedItems.splice(index, 1);
    setBudgetItems(updatedItems);
  };
  const addRow = () => {
    const newItem = {
      item_id: "",
      description: "",
      supplier_id: "",
      cuttable_width: "",
      actual: 0,
      wastage_parcentage: 0,
      cons_total: 0,
      unit: "",
      size: "",
      color: "",
      unit_price: 0,
      unit_total_cost: 0,
      total_req_qty: 0,
      used_budget: 0,
      order_total_cost: 0,
    };
    setBudgetItems([...budgetItems, newItem]);
  };
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...budgetItems];

    updatedItems[index][field] = value;

    // Calculate cons_total if the changed field is "actual" or "wastage_parcentage"
    if (field === "actual" || field === "wastage_parcentage") {
      const actual = parseFloat(updatedItems[index]["actual"]) || 0;
      const wastagePercentage =
        parseFloat(updatedItems[index]["wastage_parcentage"]) || 0;

      // Calculate cons_total based on the formula: actual + (actual * wastagePercentage / 100)
      updatedItems[index]["cons_total"] =
        actual + (actual * wastagePercentage) / 100;
    }
    if (field === "cons_total" || field === "unit_price") {
      const consTotal = parseFloat(updatedItems[index]["cons_total"]) || 0;
      const unitPrice = parseFloat(updatedItems[index]["unit_price"]) || 0;
      // Calculate unit_total_cost based on the formula: cons_total * unit_price
      updatedItems[index]["unit_total_cost"] = consTotal * unitPrice;
      updatedItems[index]["total_req_qty"] = consTotal * formDataSet.qty;
      const totalReqQty = parseFloat(updatedItems[index]["total_req_qty"]) || 0;
      updatedItems[index]["order_total_cost"] = unitPrice * totalReqQty;

      const totalOrderCost =
        parseFloat(updatedItems[index]["order_total_cost"]) || 0;

      updatedItems[index]["used_budget"] =
        (totalOrderCost / formDataSet.total_order_value) * 100;

      updatedItems[index]["balance"] = unitPrice * totalReqQty;
    }

    if (field === "actual") {
      const consTotal = parseFloat(updatedItems[index]["cons_total"]) || 0;
      const unitPrice = parseFloat(updatedItems[index]["unit_price"]) || 0;
      // Calculate unit_total_cost based on the formula: cons_total * unit_price
      updatedItems[index]["unit_total_cost"] = consTotal * unitPrice;
      updatedItems[index]["total_req_qty"] = consTotal * formDataSet.qty;
      const totalReqQty = parseFloat(updatedItems[index]["total_req_qty"]) || 0;
      updatedItems[index]["order_total_cost"] = unitPrice * totalReqQty;
      const totalOrderCost =
        parseFloat(updatedItems[index]["order_total_cost"]) || 0;

      updatedItems[index]["used_budget"] =
        (totalOrderCost / formDataSet.total_order_value) * 100;

      updatedItems[index]["balance"] = unitPrice * totalReqQty;
    }

    if (field === "wastage_parcentage") {
      const consTotal = parseFloat(updatedItems[index]["cons_total"]) || 0;
      const unitPrice = parseFloat(updatedItems[index]["unit_price"]) || 0;
      // Calculate unit_total_cost based on the formula: cons_total * unit_price
      updatedItems[index]["unit_total_cost"] = consTotal * unitPrice;
      updatedItems[index]["total_req_qty"] = consTotal * formDataSet.qty;
      const totalReqQty = parseFloat(updatedItems[index]["total_req_qty"]) || 0;
      updatedItems[index]["order_total_cost"] = unitPrice * totalReqQty;

      const totalOrderCost =
        parseFloat(updatedItems[index]["order_total_cost"]) || 0;

      updatedItems[index]["used_budget"] =
        (totalOrderCost / formDataSet.total_order_value) * 100;

      updatedItems[index]["balance"] = unitPrice * totalReqQty;
    }

    if (field === "purchased") {
      const totalOrderCost =
        parseFloat(updatedItems[index]["order_total_cost"]) || 0;
      const totalPurchased = parseFloat(value) || 0; // Use the new value of "purchased"
      const inputElement = document.getElementById(`purchased-input-${index}`); // Assuming you have unique IDs for input elements

      if (totalPurchased > totalOrderCost) {
        updatedItems[index]["balance"] = totalOrderCost - totalPurchased;
        // Add the "is-invalid" class to the input box
        inputElement.classList.add("is-invalid");
      } else {
        inputElement.classList.remove("is-invalid");
        inputElement.classList.add("is-valid");
        updatedItems[index]["balance"] = totalOrderCost - totalPurchased;
      }
    }

    if (field === "item_id") {
      // When the "item_id" changes, find the selected item and set its unit
      const selectedItem = items.find((item) => item.id === parseInt(value)); // Ensure value is parsed as an integer

      if (selectedItem) {
        updatedItems[index].item_id = parseInt(value); // Update the item_id
        updatedItems[index].unit = selectedItem.unit; // Set the unit based on the selected item
      } else {
        // Handle the case when no item is selected (optional)
        updatedItems[index].item_id = "";
        updatedItems[index].unit = "";
      }
    }

    const updatedItem = {
      ...updatedItems[index], // Copy the existing item
      [field]: value, // Update the specific field
    };

    const newItems = [...updatedItems]; // Create a new array with the updated item
    newItems[index] = updatedItem;

    setBudgetItems(newItems);
  };

  const netUnitTotalCost = budgetItems.reduce(
    (unit_total_cost, item) =>
      unit_total_cost + parseFloat(item.unit_total_cost),
    0
  );

  const netUsedBudget = budgetItems.reduce(
    (used_budget, item) => used_budget + parseFloat(item.used_budget),
    0
  );
  const netTotalCost = budgetItems.reduce(
    (order_total_cost, item) =>
      order_total_cost + parseFloat(item.order_total_cost),
    0
  );

  const [titleValidation, setTitleValidation] = useState({});
  const validateTitle = () => {
    const validation = {};
    budgetItems.forEach((item, index) => {
      validation[index] = !!item.item_id;
    });
    setTitleValidation(validation);
  };

  const [supplierValidation, setSupplierValidation] = useState({});
  const validateSupplierId = () => {
    const validation = {};
    budgetItems.forEach((item, index) => {
      validation[index] = !!item.supplier_id;
    });
    setSupplierValidation(validation);
  };
  useEffect(() => {
    validateTitle();
    validateSupplierId(); // Add this line
  }, [budgetItems]);
  useEffect(
    () => {
      validateTitle();
    },
    budgetItems.map((item) => item.item_id)
  );
  useEffect(
    () => {
      validateSupplierId();
    },
    budgetItems.map((item) => item.supplier_id)
  );
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      if (budgetItems.length === 0) {
        swal({
          title:
            "There are no Items's in this Budget, click on Add Row and fill the data",
          icon: "error",
        });
        return; // Prevent form submission
      }

      const isAnyInvalid = budgetItems.some((item) => !item.item_id);

      if (isAnyInvalid) {
        swal({
          title: "Please add Title for all items",
          icon: "error",
        });
        return; // Prevent form submission
      }

      const isAnyInvalidSupplier = budgetItems.some(
        (item) => !item.supplier_id
      );

      if (isAnyInvalidSupplier) {
        swal({
          title: "Please select supplier for each items",
          icon: "error",
        });
        return; // Prevent form submission
      }

      var data = new FormData();
      data.append("purchase_id", formDataSet.purchase_id);
      data.append("qty", formDataSet.qty);
      data.append("total_order_value", formDataSet.total_order_value);
      data.append("sizes", formDataSet.sizes);
      data.append("colors", formDataSet.colors);
      data.append("brand", formDataSet.brand);
      data.append("ratio", formDataSet.ratio);
      data.append("issued_date", formDataSet.issued_date);
      data.append("product_description", formDataSet.product_description);
      data.append("note", formDataSet.note);
      data.append("id", formDataSet.id);
      data.append("budget_items", JSON.stringify(budgetItems));
      for (let i = 0; i < selectedFiles.length; i++) {
        data.append("attatchments[]", selectedFiles[i]);
      }
      setSpinner(true);
      var response = await api.post("/budgets-update", data);
      if (response.status === 200 && response.data) {
        history.push("/merchandising/budgets");
      } else {
        setErrors(response.data.errors);
      }
      setSpinner(false);
    }
  };

  useEffect(async () => {
    getPurchases();
    getItems();
    getUnits();
    getSuppliers();
    getSizes();
    getColors();
    getBudget();
  }, []);
  useEffect(async () => {
    getItems();
  }, [props.callItems]);

  useEffect(async () => {
    getColors();
  }, [props.callColors]);
  useEffect(async () => {
    getSizes();
  }, [props.callSizes]);
  useEffect(async () => {
    getUnits();
  }, [props.callUnits]);

  useEffect(() => {
    const updatedItems = budgetItems.map((item) => {
      const consTotal = parseFloat(item.cons_total) || 0;
      const unitPrice = parseFloat(item.unit_price) || 0;
      const totalReqQty = consTotal * formDataSet.qty;
      const totalOrderCost = unitPrice * totalReqQty;
      item.unit_total_cost = consTotal * unitPrice;
      item.total_req_qty = totalReqQty;
      item.order_total_cost = totalOrderCost;
      item.used_budget = (totalOrderCost / formDataSet.total_order_value) * 100;
      item.balance = unitPrice * totalReqQty;

      return item;
    });

    setBudgetItems(updatedItems);
  }, [formDataSet.qty, formDataSet.total_order_value]);

  useEffect(async () => {
    props.setSection("merchandising");
  }, []);

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
          <div className="page_name">Update Budget Files</div>
          <div className="actions">
            <button
              type="supmit"
              className="publish_btn btn btn-warning bg-falgun"
            >
              Update
            </button>
            <Link
              to="/merchandising/budgets"
              className="btn btn-danger rounded-circle"
            >
              <i className="fal fa-times"></i>
            </Link>
          </div>
        </div>

        <div className="col-lg-12">
          <div className="personal_data">
            <div className="row">
              <div className="col-lg-6">
                <div className="form-group">
                  <label>
                    PO | TECHPACK/STYLE<sup>*</sup>
                  </label>
                  <Select
                    placeholder="Select"
                    onChange={(selectedOption) =>
                      handleChange("purchase_id", selectedOption.value)
                    }
                    value={
                      purchases.find(
                        (item) => item.id === formDataSet.purchase_id
                      )
                        ? {
                            value: formDataSet.purchase_id,
                            label: `${
                              purchases.find(
                                (item) => item.id === formDataSet.purchase_id
                              ).po_number || ""
                            } | ${
                              purchases.find(
                                (item) => item.id === formDataSet.purchase_id
                              ).techpack_number || ""
                            }`,
                          }
                        : null
                    }
                    name="purchase_id"
                    options={purchases.map((item) => ({
                      value: item.id,
                      label: `${item.po_number || ""} | ${
                        item.techpack_number || ""
                      }`,
                    }))}
                  />

                  {errors.purchase_id && (
                    <>
                      <div className="errorMsg">{errors.purchase_id}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>

              <div className="col-lg-3">
                <div className="form-group">
                  <label>QTY</label>
                  <input
                    readOnly
                    type="number"
                    onWheel={(event) => event.target.blur()}
                    name="qty"
                    onChange={(event) =>
                      handleChange("qty", event.target.value)
                    }
                    min="0"
                    value={formDataSet.qty}
                    className="form-control"
                  />

                  {errors.qty && (
                    <>
                      <div className="errorMsg">{errors.qty}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label>Order Value</label>
                  <input
                    readOnly
                    type="number"
                    onWheel={(event) => event.target.blur()}
                    name="total_order_value"
                    min="0"
                    onChange={(event) =>
                      handleChange("total_order_value", event.target.value)
                    }
                    value={formDataSet.total_order_value}
                    className="form-control"
                  />
                  {errors.total_order_value && (
                    <>
                      <div className="errorMsg">{errors.total_order_value}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>

              <div className="col-lg-6">
                <div className="form-group">
                  <label>Sizes</label>
                  <div style={{ position: "relative" }}>
                    <Select
                      isMulti
                      name="sizes"
                      placeholder="Select or Search"
                      value={formDataSet.sizes.map((sizeId) => {
                        const selectedSize = sizes.find(
                          (size) => size.id === sizeId
                        );
                        return {
                          value: sizeId,
                          label: selectedSize ? selectedSize.title : "",
                        };
                      })}
                      onChange={handleSizeChange}
                      options={sizes.map((size) => ({
                        value: size.id,
                        label: size.title,
                      }))}
                    />

                    <i
                      onClick={() => props.setSizeModal(true)}
                      style={{
                        color: "white",
                        background: "green",
                        padding: "2px",
                        cursor: "pointer",
                        borderRadius: "0px 5px 5px 0px",
                        position: "absolute",
                        right: 1,
                        top: 0,
                        padding: "12px",
                        fontSize: "13px",
                      }}
                      className="fa fa-plus bg-falgun"
                    ></i>
                  </div>

                  {errors.sizes && (
                    <>
                      <div className="errorMsg">{errors.sizes}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group">
                  <label>Colors</label>

                  <div style={{ position: "relative" }}>
                    <Select
                      isMulti
                      name="colors"
                      placeholder="Select or Search"
                      value={formDataSet.colors.map((colorId) => {
                        const selectedColor = colors.find(
                          (color) => color.id === colorId
                        );
                        return {
                          value: colorId,
                          label: selectedColor ? selectedColor.title : "",
                        };
                      })}
                      onChange={handleColorChange}
                      options={colors.map((color) => ({
                        value: color.id,
                        label: color.title,
                      }))}
                    />
                    <i
                      onClick={() => props.setColorModal(true)}
                      style={{
                        color: "white",
                        background: "green",
                        padding: "2px",
                        cursor: "pointer",
                        borderRadius: "0px 5px 5px 0px",
                        position: "absolute",
                        right: 1,
                        top: 0,
                        padding: "12px",
                        fontSize: "13px",
                      }}
                      className="fa fa-plus bg-falgun"
                    ></i>
                  </div>
                  {errors.colors && (
                    <>
                      <div className="errorMsg">{errors.colors}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <br />
                  <label>
                    Brand<sup>*</sup>
                  </label>
                  <input
                    className="form-control"
                    name="brand"
                    value={formDataSet.brand}
                    onChange={(event) =>
                      handleChange("brand", event.target.value)
                    }
                  />
                  {errors.brand && (
                    <>
                      <div className="errorMsg">{errors.brand}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <br />
                  <label>Ratio</label>
                  <input
                    className="form-control"
                    name="ratio"
                    value={formDataSet.ratio}
                    onChange={(event) =>
                      handleChange("ratio", event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <br />
                  <label>Issued Date</label>
                  <input
                    type="date"
                    name="issued_date"
                    value={formDataSet.issued_date}
                    className="form-control"
                    onChange={(event) =>
                      handleChange("issued_date", event.target.value)
                    }
                  />
                  {errors.issued_date && (
                    <>
                      <div className="errorMsg">{errors.issued_date}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label>Product Description</label>
                  <textarea
                    value={formDataSet.product_description}
                    name="product_description"
                    className="form-control"
                    onChange={(event) =>
                      handleChange("product_description", event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label>Note</label>
                  <textarea
                    value={formDataSet.note}
                    name="note"
                    className="form-control"
                    onChange={(event) =>
                      handleChange("note", event.target.value)
                    }
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <label htmlFor="attachments">Style Image </label>
                  <small className="text-muted">(JPEG,PNG)</small>
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
                    <th>Item</th>
                    <th>Item Details</th>
                    <th>Supplier</th>
                    <th>Cuttable Width</th>
                    <th>Actual Cons</th>
                    <th>Wastage %</th>
                    <th>Unit Cons</th>
                    <th>Unit</th>
                    <th>Size</th>
                    <th>Color</th>
                    <th>Unit Price/Unit</th>
                    <th>Total Req. Qty</th>
                    <th>Unit Total Cost</th>
                    <th>Used Budget (%)</th>
                    <th>Order Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetItems.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div style={{ position: "relative" }}>
                          <select
                            required
                            style={{ width: "80px", padding: "0.375rem 2px" }}
                            value={item.item_id}
                            onChange={(e) =>
                              handleItemChange(index, "item_id", e.target.value)
                            }
                            className={`form-select ${
                              titleValidation[index] === false
                                ? "is-invalid"
                                : ""
                            }`}
                          >
                            <option value="">Select Item</option>
                            {items.map((item, index) => (
                              <option key={index} value={item.id}>
                                {item.title}
                              </option>
                            ))}
                          </select>

                          <i
                            onClick={() => props.setItemModal(true)}
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
                          {titleValidation[index] === false && (
                            <div className="invalid-feedback">
                              Please add a Item.
                            </div>
                          )}
                        </div>
                      </td>

                      <td>
                        <textarea
                          style={{ minWidth: "80px", padding: "0.375rem 2px" }}
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
                          required
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "supplier_id",
                              e.target.value
                            )
                          }
                          value={item.supplier_id}
                          className={`form-select ${
                            supplierValidation[index] === false
                              ? "is-invalid"
                              : ""
                          }`}
                        >
                          <option value="">Select supplier</option>
                          {suppliers.map((item, index) => (
                            <option key={index} value={item.id}>
                              {item.company_name}
                            </option>
                          ))}
                        </select>
                        {supplierValidation[index] === false && (
                          <div className="invalid-feedback">
                            Please select a supplier.
                          </div>
                        )}
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          style={{ width: "60px", padding: "0.375rem 2px" }}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "cuttable_width",
                              e.target.value
                            )
                          }
                          value={item.cuttable_width}
                        />
                      </td>

                      <td>
                        <input
                          required
                          type="number"
                          onWheel={(event) => event.target.blur()}
                          style={{ width: "60px", padding: "0.375rem 2px" }}
                          min="0"
                          step="0.01"
                          className="form-control"
                          onChange={(e) =>
                            handleItemChange(index, "actual", e.target.value)
                          }
                          value={item.actual}
                        />
                      </td>

                      <td>
                        <input
                          required
                          type="number"
                          onWheel={(event) => event.target.blur()}
                          style={{ width: "60px", padding: "0.375rem 2px" }}
                          min="0"
                          className="form-control"
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "wastage_parcentage",
                              e.target.value
                            )
                          }
                          value={item.wastage_parcentage}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          onWheel={(event) => event.target.blur()}
                          min="0"
                          style={{ width: "50px", padding: "0.375rem 2px" }}
                          readOnly
                          className="form-control"
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "cons_total",
                              e.target.value
                            )
                          }
                          value={item.cons_total}
                        />
                      </td>

                      <td>
                        <div style={{ position: "relative" }}>
                          <select
                            required
                            value={item.unit}
                            style={{ width: "60px", padding: "0.375rem 2px" }}
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
                            value={item.size}
                            style={{ width: "60px", padding: "0.375rem 2px" }}
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
                        <div style={{ position: "relative" }}>
                          <select
                            required
                            value={item.color}
                            style={{ width: "60px", padding: "0.375rem 2px" }}
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
                        <input
                          required
                          type="number"
                          onWheel={(event) => event.target.blur()}
                          min="0"
                          step=".01"
                          style={{ width: "60px", padding: "0.375rem 2px" }}
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
                        <input
                          type="number"
                          onWheel={(event) => event.target.blur()}
                          min="0"
                          readOnly
                          style={{ width: "80px", padding: "0.375rem 2px" }}
                          className="form-control"
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "total_req_qty",
                              e.target.value
                            )
                          }
                          value={item.total_req_qty}
                        />
                      </td>

                      <td>
                        <input
                          readOnly
                          type="number"
                          onWheel={(event) => event.target.blur()}
                          min="0"
                          step=".01"
                          style={{ width: "80px", padding: "0.375rem 2px" }}
                          className="form-control"
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "unit_total_cost",
                              e.target.value
                            )
                          }
                          value={item.unit_total_cost}
                        />
                      </td>

                      <td>
                        <input
                          readOnly
                          type="number"
                          onWheel={(event) => event.target.blur()}
                          min="0"
                          step=".01"
                          style={{ width: "80px", padding: "0.375rem 2px" }}
                          className="form-control"
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "used_budget",
                              e.target.value
                            )
                          }
                          value={item.used_budget}
                        />
                      </td>

                      <td>
                        <div className="d-flex gap_10 align-items-center">
                          <input
                            readOnly
                            className="form-control"
                            step=".01"
                            min={0}
                            type="number"
                            onWheel={(event) => event.target.blur()}
                            style={{ width: "80px", padding: "0.375rem 2px" }}
                            value={item.order_total_cost}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "order_total_cost",
                                e.target.value
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
                          className="btn btn-info btn-sm d-none"
                          onClick={addRow}
                        >
                          Add Row
                        </Link>
                      </div>
                    </td>
                  </tr>
                  <br />
                  <tr className="text-center">
                    <td colSpan={12}>
                      <h6>Items Summary</h6>
                    </td>
                    <td>
                      <h6>{netUnitTotalCost.toFixed(2)}</h6>
                    </td>
                    <td>
                      <h6>{netUsedBudget.toFixed(2)}%</h6>
                    </td>
                    <td>
                      <h6>{netTotalCost.toFixed(2)}</h6>
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
              <br />
              <br />
              <br />
              <br />
            </div>
          </div>
        </div>
      </form>
      <BuyerModal {...props} />
      <StyleModal {...props} />
      <SizeModal {...props} />
      <ColorModal {...props} />
      <UnitModal {...props} />
      <ItemModal {...props} />
    </div>
  );
}
