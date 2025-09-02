import React, { useState, useEffect, Fragment } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import swal from "sweetalert";
import Select from "react-select";

import UnitModal from "../../../elements/modals/UnitModal";
import SizeModal from "../../../elements/modals/SizeModal";
import ColorModal from "../../../elements/modals/ColorModal";
import StyleModal from "../../../elements/modals/StyleModal";

export default function CreatePurchase(props) {
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);
  const userInfo = props.userData;

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

  const [purchaseItems, setPurchaseItems] = useState([]);

  const removeRow = (index) => {
    const updatedItems = [...purchaseItems];
    updatedItems.splice(index, 1);
    setPurchaseItems(updatedItems);
  };

  const addRow = () => {
    const newItem = {
      description: "",
      size: "",
      color: "",
      qty: 0,
      unit_price: 0,
      total: 0,
    };
    setPurchaseItems([...purchaseItems, newItem]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...purchaseItems];
    if (field === "unit_price" || field === "qty") {
      const unit_price =
        field === "unit_price" ? value : updatedItems[index].unit_price;
      const qty = field === "qty" ? value : updatedItems[index].qty;
      updatedItems[index][field] = value;

      // Calculate total and format it to 2 decimal places
      const total = (unit_price * qty).toFixed(2);
      updatedItems[index].total = parseFloat(total); // Convert string to float
    } else {
      updatedItems[index][field] = value;
    }

    setPurchaseItems(updatedItems);
  };

  const netTotal = purchaseItems.reduce(
    (total, item) => total + parseFloat(item.total),
    0
  );
  const netQty = purchaseItems.reduce(
    (total, item) => total + parseFloat(item.qty),
    0
  );

  const [errors, setErrors] = useState({});
  const [formDataSet, setFormDataSet] = useState({
    contract_id: "",
    po_number: "",
    techpack_id: "",
    sizes: [],
    colors: [],
    shipping_method: "",
    order_date: "",
    shipment_date: "",
    lead_time: 0,
    booking_time: 0,
    material_inhouse_time: 0,
    production_time: 0,
    save_time: 0,
    delivery_address: "",
    packing_instructions: "",
    packing_method: "",
    comment: "",
  });
  const handleChange = (name, value) => {
    if (name === "contract_id") {
      getTechpacks(value);
    }

    // Update form data
    let updatedFormData = { ...formDataSet, [name]: value };

    // Calculate lead time when order_date or shipment_date changes
    if (name === "order_date" || name === "shipment_date") {
      const { order_date, shipment_date } = updatedFormData;
      if (order_date && shipment_date) {
        const orderDate = new Date(order_date);
        const shipmentDate = new Date(shipment_date);
        const timeDiff = shipmentDate.getTime() - orderDate.getTime();
        const dayDiff = timeDiff / (1000 * 3600 * 24);

        if (dayDiff < 20) {
          alert("Shipment Date must be at least 20 days after Order Date");
          return;
        }

        // Update lead time
        updatedFormData = { ...updatedFormData, lead_time: dayDiff };
      }
    }

    // Recalculate save_time when any of the times change
    if (
      name === "booking_time" ||
      name === "material_inhouse_time" ||
      name === "production_time"
    ) {
      // Parse input values as floats
      const bookingTime = parseFloat(updatedFormData.booking_time);
      const materialInhouse = parseFloat(updatedFormData.material_inhouse_time);
      const productionTime = parseFloat(updatedFormData.production_time);

      // Calculate sum of times
      const sumOfTimes = bookingTime + materialInhouse + productionTime;

      // Update save time if sum doesn't exceed lead time
      const leadTime = parseFloat(updatedFormData.lead_time) || 0;
      if (sumOfTimes <= leadTime) {
        updatedFormData = {
          ...updatedFormData,
          save_time: leadTime - sumOfTimes,
        };
      } else if (sumOfTimes > leadTime) {
        alert("Total time cannot exceed lead time");
        return;
      }
    }
    // Update form data state
    setFormDataSet(updatedFormData);
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

    if (!formDataSet.contract_id) {
      formErrors.contract_id = "Purchase Contract is required";
    }

    if (!formDataSet.po_number) {
      formErrors.po_number = "PO Number is required";
    }

    if (!formDataSet.techpack_id) {
      formErrors.techpack_id = "Techpack/Style is required";
    }

    if (!formDataSet.order_date) {
      formErrors.order_date = "Order Date is required";
    }

    if (!formDataSet.shipment_date) {
      formErrors.shipment_date = "Shipment Date is required";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (purchaseItems.length === 0) {
      swal({
        title: "There is no item's on this PO",
        icon: "error",
      });
      return; // Prevent form submission
    }
    if (validateForm()) {
      var data = new FormData();
      data.append("contract_id", formDataSet.contract_id);
      data.append("po_number", formDataSet.po_number);
      data.append("techpack_id", formDataSet.techpack_id);
      data.append("sizes", formDataSet.sizes);
      data.append("colors", formDataSet.colors);
      data.append("shipping_method", formDataSet.shipping_method);
      data.append("order_date", formDataSet.order_date);
      data.append("shipment_date", formDataSet.shipment_date);

      data.append("lead_time", formDataSet.lead_time);
      data.append("booking_time", formDataSet.booking_time);
      data.append("material_inhouse_time", formDataSet.material_inhouse_time);
      data.append("production_time", formDataSet.production_time);
      data.append("save_time", formDataSet.save_time);

      data.append("delivery_address", formDataSet.delivery_address);
      data.append("packing_instructions", formDataSet.packing_instructions);
      data.append("packing_method", formDataSet.packing_method);
      data.append("comment", formDataSet.comment);

      data.append("purchase_items", JSON.stringify(purchaseItems));
      for (let i = 0; i < selectedFiles.length; i++) {
        data.append("attatchments[]", selectedFiles[i]);
      }
      setSpinner(true);
      var response = await api.post("/merchandising/purchases-create", data);
      if (response.status === 200 && response.data) {
        history.push(
          "/merchandising/purchases-details/" + response.data.data.id
        );
      } else {
        setErrors(response.data.errors);
      }
      setSpinner(false);
    }
  };

  const [purchaseContracts, setPurchaseContracts] = useState([]);
  const getPurchaseContracts = async () => {
    var response = await api.post("/merchandising/purchase-contracts");
    if (response.status === 200 && response.data) {
      setPurchaseContracts(response.data.data);
    }
  };

  // addition
  const [colors, setColors] = useState([]);
  const getColors = async () => {
    setSpinner(true);
    var response = await api.post("/common/colors");
    if (response.status === 200 && response.data) {
      setColors(response.data.data);
    }
    setSpinner(false);
  };

  const [sizes, setSizes] = useState([]);
  const getSizes = async () => {
    setSpinner(true);
    var response = await api.post("/common/sizes");
    if (response.status === 200 && response.data) {
      setSizes(response.data.data);
    }
    setSpinner(false);
  };

  const [techpacks, setTechpacks] = useState([]);
  const getTechpacks = async (contract_id) => {
    setSpinner(true);
    var response = await api.post("/merchandising/techpacks", {
      status: "Costing Done",
      view: "team",
      department: userInfo.department_title,
      designation: userInfo.designation_title,
      contract_id: contract_id,
    });

    if (response.status === 200 && response.data) {
      setTechpacks(response.data.data);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getSizes();
    getColors();
    getPurchaseContracts();
  }, []);

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
          <div className="page_name">Add New PO</div>
          <div className="actions">
            <button
              type="supmit"
              className="publish_btn btn btn-warning bg-falgun"
            >
              Save
            </button>
            <Link
              to="/merchandising/purchases"
              className="btn btn-danger rounded-circle"
            >
              <i className="fal fa-times"></i>
            </Link>
          </div>
        </div>

        <div className="col-lg-12">
          <div className="personal_data">
            <div className="row">
              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    PO Number <sup>*</sup>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="po_number"
                    value={formDataSet.po_number}
                    onChange={(event) =>
                      handleChange("po_number", event.target.value)
                    }
                  />
                  {errors.po_number && (
                    <div className="errorMsg">{errors.po_number}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    PC/JOB NO. <sup>*</sup>
                  </label>
                  <select
                    name="contract_id"
                    value={formDataSet.contract_id}
                    onChange={(event) =>
                      handleChange("contract_id", event.target.value)
                    }
                    className="form-select"
                  >
                    <option value="">Select</option>
                    {purchaseContracts.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.tag_number} | {item.title}
                      </option>
                    ))}
                  </select>
                  {errors.contract_id && (
                    <div className="errorMsg">{errors.contract_id}</div>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    Style/Techpack <sup>*</sup>
                  </label>
                  <div style={{ position: "relative" }}>
                    <Select
                      placeholder="Select"
                      value={
                        techpacks.find(
                          (item) => item.id === formDataSet.techpack_id
                        )
                          ? {
                              value: formDataSet.techpack_id,
                              label:
                                techpacks.find(
                                  (item) => item.id === formDataSet.techpack_id
                                ).title || "",
                            }
                          : null
                      }
                      onChange={(selectedOption) =>
                        handleChange("techpack_id", selectedOption.value)
                      }
                      name="techpack_id"
                      options={techpacks.map((item) => ({
                        value: item.id,
                        label: item.title,
                      }))}
                    />
                  </div>

                  {errors.techpack_id && (
                    <div className="errorMsg">{errors.techpack_id}</div>
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
                <br />
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label>Shipping Method</label>
                  <select
                    name="shipping_method"
                    value={formDataSet.shipping_method}
                    onChange={(event) =>
                      handleChange("shipping_method", event.target.value)
                    }
                    className="form-select"
                  >
                    <option value="">Select One</option>
                    <option value="Ocean">Ocean</option>
                    <option value="Air">Air</option>
                    <option value="Transport">Transport</option>
                    <option value="Courier">Courier</option>
                  </select>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label>Order Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="order_date"
                    value={formDataSet.order_date}
                    onChange={(event) =>
                      handleChange("order_date", event.target.value)
                    }
                  />
                  {errors.order_date && (
                    <>
                      <div className="errorMsg">{errors.order_date}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label>Shipment Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="shipment_date"
                    value={formDataSet.shipment_date}
                    onChange={(event) =>
                      handleChange("shipment_date", event.target.value)
                    }
                  />
                  {errors.shipment_date && (
                    <>
                      <div className="errorMsg">{errors.shipment_date}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>
            </div>

            {formDataSet.order_date && formDataSet.shipment_date ? (
              <Fragment>
                <br />
                <div
                  className="timeline"
                  style={{
                    border: "2px dotted gray",
                    padding: "15px",
                    borderRadius: "15px",
                    background: "#f1f1f1",
                  }}
                >
                  <h6 className="text-center">
                    <u>T N A</u>
                  </h6>
                  <br />
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label>Lead Time</label>
                        <input
                          type="number"
                          onWheel={(event) => event.target.blur()}
                          readOnly
                          className="form-control"
                          name="lead_time"
                          value={formDataSet.lead_time}
                          onChange={(event) =>
                            handleChange("lead_time", event.target.value)
                          }
                        />
                        {errors.lead_time && (
                          <div className="errorMsg">{errors.lead_time}</div>
                        )}
                      </div>
                    </div>

                    <div className="col">
                      <div className="form-group">
                        <label>
                          Booking Time<sup>*</sup>
                        </label>
                        <input
                          type="number"
                          onWheel={(event) => event.target.blur()}
                          className="form-control"
                          name="booking_time"
                          value={formDataSet.booking_time}
                          min={0}
                          onChange={(event) =>
                            handleChange("booking_time", event.target.value)
                          }
                        />
                        {errors.booking_time && (
                          <div className="errorMsg">{errors.booking_time}</div>
                        )}
                      </div>
                    </div>

                    <div className="col">
                      <div className="form-group">
                        <label>
                          Material Inhouse<sup>*</sup>
                        </label>
                        <input
                          type="number"
                          onWheel={(event) => event.target.blur()}
                          className="form-control"
                          name="material_inhouse_time"
                          min={0}
                          value={formDataSet.material_inhouse_time}
                          onChange={(event) =>
                            handleChange(
                              "material_inhouse_time",
                              event.target.value
                            )
                          }
                        />
                        {errors.material_inhouse_time && (
                          <div className="errorMsg">
                            {errors.material_inhouse_time}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label>
                          Production Time<sup>*</sup>
                        </label>
                        <input
                          type="number"
                          onWheel={(event) => event.target.blur()}
                          className="form-control"
                          name="production_time"
                          min={0}
                          value={formDataSet.production_time}
                          onChange={(event) =>
                            handleChange("production_time", event.target.value)
                          }
                        />
                        {errors.production_time && (
                          <div className="errorMsg">
                            {errors.production_time}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col">
                      <div className="form-group">
                        <label>Save Time</label>
                        <input
                          type="number"
                          onWheel={(event) => event.target.blur()}
                          readOnly
                          className="form-control"
                          name="save_time"
                          value={formDataSet.save_time}
                          onChange={(event) =>
                            handleChange("save_time", event.target.value)
                          }
                        />
                        {errors.save_time && (
                          <div className="errorMsg">{errors.save_time}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <br />
              </Fragment>
            ) : (
              ""
            )}

            <div className="row">
              <div className="col-lg-12">
                <h6 className="text-center">
                  <u>ITEM'S</u>
                </h6>
                <hr></hr>
                <div className="Import_purchase_item_table">
                  <table className="table">
                    <thead className="bg-dark text-white">
                      <tr>
                        <th>Particular</th>
                        <th>Size</th>
                        <th>Color</th>
                        <th>Unit Price</th>
                        <th>QTY</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchaseItems.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              className="form-control"
                              type="text"
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

                          <td style={{ position: "relative" }}>
                            <select
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
                                right: 3,
                                top: 5,
                                padding: "10px 7px",
                                fontSize: "13px",
                              }}
                              className="fa fa-plus bg-falgun"
                            ></i>
                          </td>
                          <td style={{ position: "relative" }}>
                            <select
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
                                right: 3,
                                top: 5,
                                padding: "10px 7px",
                                fontSize: "13px",
                              }}
                              className="fa fa-plus bg-falgun"
                            ></i>
                          </td>

                          <td>
                            <input
                              className="form-control"
                              step=".01"
                              min={0}
                              type="number"
                              onWheel={(event) => event.target.blur()}
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
                              className="form-control"
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
                            <div className="d-flex gap_10">
                              <input
                                className="form-control"
                                readOnly
                                step=".01"
                                min={0}
                                type="number"
                                onWheel={(event) => event.target.blur()}
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

                      <tr className="border_bottom_none">
                        <td colSpan={5}></td>
                        <td>
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
                        <td colSpan={4}>
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
                </div>
              </div>
            </div>
            <br />
            <br />
            <div className="row">
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
                  <label>Packing Instructions </label>
                  <textarea
                    value={formDataSet.packing_instructions}
                    onChange={(event) =>
                      handleChange("packing_instructions", event.target.value)
                    }
                    name="packing_instructions"
                    className="form-control"
                  ></textarea>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="form-group">
                  <label>Packing Method </label>
                  <textarea
                    value={formDataSet.packing_method}
                    onChange={(event) =>
                      handleChange("packing_method", event.target.value)
                    }
                    name="packing_method"
                    className="form-control"
                  ></textarea>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="form-group">
                  <label>Comment </label>
                  <textarea
                    value={formDataSet.comment}
                    onChange={(event) =>
                      handleChange("comment", event.target.value)
                    }
                    name="comment"
                    className="form-control"
                  ></textarea>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="form-group">
                  <label htmlFor="attachments">attachments:</label>
                  <small className="text-muted">
                    {" "}
                    (PDF,Word,Excel,JPEG,PNG file.Recommend minimum file 200px *
                    200px.)
                  </small>
                  <div className="d-flex mb-10">
                    <input
                      type="file"
                      className="form-control"
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
                        className="form-control"
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
          <br />
          <br />
        </div>
      </form>

      <UnitModal {...props} />
      <StyleModal {...props} />
      <SizeModal {...props} />
      <ColorModal {...props} />
    </div>
  );
}
