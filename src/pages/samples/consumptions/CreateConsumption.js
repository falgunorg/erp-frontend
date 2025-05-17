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
import { Alert } from "react-bootstrap";

export default function CreateConsumption(props) {
  const history = useHistory();
  const params = useParams();

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

  const [techpacks, setTechpacks] = useState([]);
  const getTechpacks = async () => {
    setSpinner(true);
    var response = await api.post("/techpacks", { status: "Placed" });
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
    techpack_id: params.techpack_id ? params.techpack_id : "",
    description: "",
  });

  const handleChange = (name, value) => {
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

  const [consumptionItems, setConsumptionItems] = useState([]);
  const removeRow = (index) => {
    const updatedItems = [...consumptionItems];
    updatedItems.splice(index, 1);
    setConsumptionItems(updatedItems);
  };
  const addRow = () => {
    const newItem = {
      item_id: "",
      description: "",
      unit: "",
      color: "",
      size: "",
      qty: "",
    };

    setConsumptionItems([...consumptionItems, newItem]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...consumptionItems];

    updatedItems[index][field] = value;

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

    setConsumptionItems(newItems);
  };

  const [titleValidation, setTitleValidation] = useState({});
  const validateTitle = () => {
    const validation = {};
    consumptionItems.forEach((item, index) => {
      validation[index] = !!item.item_id;
    });
    setTitleValidation(validation);
  };

  useEffect(() => {
    validateTitle();
  }, [consumptionItems]);
  useEffect(
    () => {
      validateTitle();
    },
    consumptionItems.map((item) => item.item_id)
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      if (consumptionItems.length === 0) {
        swal({
          title:
            "There are no Items's in this Consumption, click on Add Row and fill the data",
          icon: "error",
        });
        return; // Prevent form submission
      }

      const isAnyInvalid = consumptionItems.some((item) => !item.item_id);

      if (isAnyInvalid) {
        swal({
          title: "Please add Item for each Row",
          icon: "error",
        });
        return; // Prevent form submission
      }

      var data = new FormData();
      data.append("techpack_id", formDataSet.techpack_id);
      data.append("description", formDataSet.description);
      data.append("consumption_items", JSON.stringify(consumptionItems));
      for (let i = 0; i < selectedFiles.length; i++) {
        data.append("attatchments[]", selectedFiles[i]);
      }
      setSpinner(true);
      var response = await api.post("/consumptions-create", data);
      if (response.status === 200 && response.data) {
        history.push("/sample/consumptions");
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
    getSizes();
    getColors();
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

  useEffect(async () => {
    props.setSection("sample");
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      if (props.userData?.department_title !== "Sample") {
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
          <div className="page_name">Add Consumption</div>
          <div className="actions">
            <button
              type="supmit"
              className="publish_btn btn btn-warning bg-falgun"
            >
              Save
            </button>
            <Link
              to="/sample/consumptions"
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
                  <label>Style/Techpack</label>
                  {params.techpack_id ? (
                    <Select
                      isDisabled={true}
                      placeholder="Select"
                      value={
                        techpacks.find(
                          (item) => item.id === parseInt(params.techpack_id)
                        )
                          ? {
                              value: parseInt(params.techpack_id),
                              label:
                                techpacks.find(
                                  (item) =>
                                    item.id === parseInt(params.techpack_id)
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
                  ) : (
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
                  )}

                  {errors.techpack_id && (
                    <>
                      <div className="errorMsg">{errors.techpack_id}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-lg-6">
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
              <div className="col-lg-6">
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formDataSet.description}
                    name="description"
                    className="form-control"
                    onChange={(event) =>
                      handleChange("description", event.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <hr></hr>
            <h6 className="text-center">
              <u>BOM'S</u>
            </h6>
            <div className="Import_booking_item_table">
              <table className="table text-start align-middle table-bordered table-hover mb-0">
                <thead className="bg-dark text-white">
                  <tr className="text-center">
                    <th>Item</th>
                    <th>Item Details</th>
                    <th>Unit</th>
                    <th>Size</th>
                    <th>Color</th>
                    <th>QTY</th>
                  </tr>
                </thead>
                <tbody>
                  {consumptionItems.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div style={{ position: "relative" }}>
                          <select
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
                            value={item.unit}
                            // style={{ width: "80px", padding: "0.375rem 2px" }}
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
                        <div className="d-flex gap_10 align-items-center">
                          <input
                            className="form-control"
                            step=".01"
                            min={0}
                            type="number"
                            onWheel={(event) => event.target.blur()}
                            value={item.qty}
                            onChange={(e) =>
                              handleItemChange(index, "qty", e.target.value)
                            }
                          />
                          <Link to="#">
                            <i
                              onClick={() => removeRow(index)}
                              className="fa fa-times text-danger"
                              style={{ marginRight: "10px" }}
                            ></i>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}

                  <tr className="border_none">
                    <td className="border_none" colSpan={5}></td>
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
                </tbody>
              </table>
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
