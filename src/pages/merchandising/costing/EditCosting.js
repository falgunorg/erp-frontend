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

export default function EditCosting(props) {
  const history = useHistory();
  const userInfo = props.userData;

  const params = useParams();
  const [spinner, setSpinner] = useState(false);

  const [techpacks, setTechpacks] = useState([]);
  const getTechpacks = async () => {
    setSpinner(true);
    var response = await api.post("/techpacks", {
      // status: "Consumption Done",
      view: "team",
      department: userInfo.department_title,
      designation: userInfo.designation_title,
    });
    if (response.status === 200 && response.data) {
      setTechpacks(response.data.data);
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
    techpack_id: "",
  });

  const getTechpack = async (techpack_id) => {
    setSpinner(true);
    var response = await api.post("/techpacks-show", { id: techpack_id });
    if (response.status === 200 && response.data) {
      setCostingItems(response.data.data.consumption_items);
    }
    setSpinner(false);
  };

  const handleChange = (name, value) => {
    if (name === "techpack_id") {
      getTechpack(value);
    }
    setFormDataSet({ ...formDataSet, [name]: value });
  };

  const validateForm = () => {
    let formErrors = {};
    // personal info
    if (!formDataSet.techpack_id) {
      formErrors.techpack_id = "Techpack is required";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const [costingItems, setCostingItems] = useState([]);
  const removeRow = (index) => {
    const updatedItems = [...costingItems];
    updatedItems.splice(index, 1);
    setCostingItems(updatedItems);
  };
  const addRow = () => {
    const newItem = {
      item_id: "",
      description: "",
      unit: "",
      size: "",
      color: "",
      actual: "",
      wastage_parcentage: 0,
      cons_total: "",
      unit_price: "",
      total: "",
    };

    setCostingItems([...costingItems, newItem]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...costingItems];
    updatedItems[index][field] = value;

    // Calculate cons_total if the changed field is "actual" or "wastage_parcentage"
    if (field === "actual" || field === "wastage_parcentage") {
      const actual = parseFloat(updatedItems[index]["actual"]) || 0;
      const wastagePercentage =
        parseFloat(updatedItems[index]["wastage_parcentage"]) || 0;
      updatedItems[index]["cons_total"] =
        actual + (actual * wastagePercentage) / 100;
    }
    if (field === "cons_total" || field === "unit_price") {
      const consTotal = parseFloat(updatedItems[index]["cons_total"]) || 0;
      const unitPrice = parseFloat(updatedItems[index]["unit_price"]) || 0;
      updatedItems[index]["total"] = consTotal * unitPrice;
    }

    if (field === "actual") {
      const consTotal = parseFloat(updatedItems[index]["cons_total"]) || 0;
      const unitPrice = parseFloat(updatedItems[index]["unit_price"]) || 0;
      updatedItems[index]["total"] = consTotal * unitPrice;
    }

    if (field === "wastage_parcentage") {
      const consTotal = parseFloat(updatedItems[index]["cons_total"]) || 0;
      const unitPrice = parseFloat(updatedItems[index]["unit_price"]) || 0;
      updatedItems[index]["total"] = consTotal * unitPrice;
    }
    if (field === "item_id") {
      const selectedItem = items.find((item) => item.id === parseInt(value)); // Ensure value is parsed as an integer
      if (selectedItem) {
        updatedItems[index].item_id = parseInt(value);
        updatedItems[index].unit = selectedItem.unit;
      } else {
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
    setCostingItems(newItems);
  };

  const netTotalCost = costingItems.reduce((total, item) => {
    const itemTotal = parseFloat(item.total);
    return isNaN(itemTotal) ? total : total + itemTotal;
  }, 0);

  const [titleValidation, setTitleValidation] = useState({});
  const validateTitle = () => {
    const validation = {};
    costingItems.forEach((item, index) => {
      validation[index] = !!item.item_id;
    });
    setTitleValidation(validation);
  };

  const getCosting = async () => {
    setSpinner(true);
    var response = await api.post("/costings-show", { id: params.id });
    if (response.status === 200 && response.data) {
      setFormDataSet(response.data.data);
      setCostingItems(response.data.data.costing_items);
    }
    setSpinner(false);
  };

  useEffect(() => {
    validateTitle();
  }, [costingItems]);
  useEffect(
    () => {
      validateTitle();
    },
    costingItems.map((item) => item.item_id)
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      if (costingItems.length === 0) {
        swal({
          title:
            "There are no Items's in this Costing, click on Add Row and fill the data",
          icon: "error",
        });
        return; // Prevent form submission
      }

      const isAnyInvalid = costingItems.some((item) => !item.item_id);
      if (isAnyInvalid) {
        swal({
          title: "Please add Item for all row",
          icon: "error",
        });
        return; // Prevent form submission
      }
      var data = new FormData();
      data.append("techpack_id", formDataSet.techpack_id);
      data.append("id", formDataSet.id);
      data.append("costing_items", JSON.stringify(costingItems));
      setSpinner(true);
      var response = await api.post("/costings-update", data);
      if (response.status === 200 && response.data) {
        history.push("/merchandising/costings");
      } else {
        setErrors(response.data.errors);
      }
      setSpinner(false);
    }
  };

  useEffect(async () => {
    getTechpacks();
    getItems();
    getUnits();
    getCosting();
  }, []);
  useEffect(async () => {
    getItems();
  }, [props.callItems]);
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
          <div className="page_name">Update Costing Files</div>
          <div className="actions">
            <button
              type="supmit"
              className="publish_btn btn btn-warning bg-falgun"
            >
              Update
            </button>
            <Link
              to="/merchandising/costings"
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
                    Techpack/Style<sup>*</sup>
                  </label>

                  <Select
                    isDisabled={true}
                    placeholder="Select"
                    onChange={(selectedOption) =>
                      handleChange("techpack_id", selectedOption.value)
                    }
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
                    name="techpack_id"
                    options={techpacks.map((item) => ({
                      value: item.id,
                      label: item.title,
                    }))}
                  />

                  {errors.techpack_id && (
                    <>
                      <div className="errorMsg">{errors.techpack_id}</div>
                      <br />
                    </>
                  )}
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
                    <th>Unit</th>
                    <th>Size</th>
                    <th>Color</th>
                    <th>Actual Cons</th>
                    <th>Wastage %</th>
                    <th>Unit Cons</th>
                    <th>Unit Price/Unit</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {costingItems.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div style={{ position: "relative" }}>
                          <select
                            required
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
                        <div style={{ position: "relative" }}>
                          <select
                            required
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
                            value={item.size}
                            // style={{ width: "80px", padding: "0.375rem 2px" }}
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
                            // style={{ width: "80px", padding: "0.375rem 2px" }}
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
                          type="number"
                          onWheel={(event) => event.target.blur()}
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
                          required
                          type="number"
                          onWheel={(event) => event.target.blur()}
                          min="0"
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
                        <div className="d-flex gap_10 align-items-center">
                          <input
                            required
                            readOnly
                            className="form-control"
                            step=".01"
                            min={0}
                            type="number"
                            onWheel={(event) => event.target.blur()}
                            value={item.total}
                            onChange={(e) =>
                              handleItemChange(index, "total", e.target.value)
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
                    <td className="border_none" colSpan={9}></td>
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
                    <td colSpan={9}>
                      <h6>Items Summary</h6>
                    </td>
                    <td>
                      <h6>{netTotalCost.toFixed(2)}</h6>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <br />
            <br />
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
