import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Quill from "quill";
import QuillBetterTable from "quill-better-table";
import Spinner from "../../../elements/Spinner";
import api from "../../../services/api";
import Select from "react-select";
import swal from "sweetalert";
import CameraFileInput from "../../../elements/CameraFileInput";
import BuyerModal from "../../../elements/modals/BuyerModal";
import ItemModal from "../../../elements/modals/ItemModal";
import SizeModal from "../../../elements/modals/SizeModal";
import ColorModal from "../../../elements/modals/ColorModal";
import UnitModal from "../../../elements/modals/UnitModal";

export default function DesignCreate(props) {
  const history = useHistory();
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
  const [description, setDescription] = useState("");
  const handleDscChange = (value) => {
    setDescription(value);
  };

  const [formData, setFormData] = useState({
    title: "",
    design_type: "",
    buyers: [],
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const handleImageChange = (ev) => {
    const file = ev.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(file);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview("");
    }
  };

  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const handleCapturePhoto = (file) => {
    setCapturedPhoto(file);
  };

  const [errors, setErrors] = useState({});
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleBuyerChange = (selectedOptions) => {
    const selectedBuyerIds = selectedOptions.map((option) => option.value);
    setFormData((prevData) => ({
      ...prevData,
      buyers: selectedBuyerIds,
    }));
  };

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

  const [units, setUnits] = useState([]);
  const getUnits = async () => {
    setSpinner(true);
    var response = await api.post("/common/units");
    if (response.status === 200 && response.data) {
      setUnits(response.data.data);
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

  const [designItems, setDesignItems] = useState([]);
  const removeRow = (index) => {
    const updatedItems = [...designItems];
    updatedItems.splice(index, 1);
    setDesignItems(updatedItems);
  };
  const addRow = () => {
    const newItem = {
      item_id: "",
      description: "",
      color: "",
      unit: "",
      size: "",
      qty: 0,
      rate: 0,
      total: 0,
    };
    setDesignItems([...designItems, newItem]);
  };
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...designItems];
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
    if (field === "qty" || field === "rate") {
      const itemQty = parseFloat(updatedItems[index]["qty"]) || 0;
      const itemRate = parseFloat(updatedItems[index]["rate"]) || 0;
      updatedItems[index]["total"] = (itemQty * itemRate).toFixed(2);
    }
    const updatedItem = {
      ...updatedItems[index], // Copy the existing item
      [field]: value, // Update the specific field
    };

    const newItems = [...updatedItems]; // Create a new array with the updated item
    newItems[index] = updatedItem;

    setDesignItems(newItems);
  };

  const netTotal = designItems.reduce(
    (total, item) => total + parseFloat(item.total),
    0
  );

  const [titleValidation, setTitleValidation] = useState({});
  const validateTitle = () => {
    const validation = {};
    designItems.forEach((item, index) => {
      validation[index] = !!item.item_id;
    });
    setTitleValidation(validation);
  };

  useEffect(() => {
    validateTitle();
  }, [designItems]);

  useEffect(
    () => {
      validateTitle();
    },
    designItems.map((item) => item.item_id)
  );

  const validateForm = () => {
    let newErrors = {};

    if (!formData.title) {
      newErrors.title = "Title is required";
    }
    if (!formData.buyers.length > 0) {
      newErrors.buyers = "Releted Buyer is required";
    }
    if (!formData.design_type) {
      newErrors.design_type = "Article Type is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      if (designItems.length === 0) {
        swal({
          title:
            "There are no Items's in this Articles, click on Add Row and fill the data",
          icon: "error",
        });
        return; // Prevent form submission
      }

      const isAnyInvalid = designItems.some((item) => !item.item_id);

      if (isAnyInvalid) {
        swal({
          title: "Please Select Item for each row",
          icon: "error",
        });
        return; // Prevent form submission
      }

      const data = new FormData();
      data.append("description", description);
      data.append("title", formData.title);
      data.append("design_type", formData.design_type);
      data.append("buyers", formData.buyers);
      data.append("photo", imageFile ? imageFile : capturedPhoto);
      data.append("design_items", JSON.stringify(designItems));
      for (let i = 0; i < selectedFiles.length; i++) {
        data.append("attatchments[]", selectedFiles[i]);
      }
      setSpinner(true);
      var response = await api.post("/designs-create", data);
      console.log(response.data);
      if (response.data.status == "success") {
        history.push("/development/designs");
      } else {
        setErrors(response.data.errors);
      }
      setSpinner(false);
    }
  };

  const [buyers, setBuyers] = useState([]);
  const getBuyers = async () => {
    setSpinner(true);
    var response = await api.post("/common/buyers");
    if (response.status === 200 && response.data) {
      setBuyers(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getBuyers();
    getSizes();
    getUnits();
    getColors();
    getItems();
  }, []);

  useEffect(async () => {
    getItems();
  }, [props.callItems]);
  useEffect(async () => {
    getBuyers();
  }, [props.callBuyers]);
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
    props.setSection("development");
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      if (props.userData?.department_title !== "Development") {
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
          <div className="page_name">Submit New Article</div>
          <div className="actions">
            <button
              type="submit"
              className="publish_btn btn btn-warning bg-falgun"
            >
              Submit
            </button>
            <Link
              to="/development/designs"
              className="btn btn-danger rounded-circle"
            >
              <i className="fal fa-times"></i>
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3">
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-control"
              />
              {errors.title && <div className="errorMsg">{errors.title}</div>}
            </div>
          </div>
          <div className="col-lg-2">
            <div className="form-group">
              <label>Article Type:</label>
              <select
                value={formData.design_type}
                onChange={handleChange}
                className="form-select"
                name="design_type"
              >
                <option value="">Select One</option>
                <option value="Jacket">Jacket</option>
                <option value="Dress">Dress</option>
                <option value="Jeggings">Jeggings</option>
                <option value="Leggings">Leggings</option>
                <option value="Shirt">Shirt</option>
                <option value="Trouser">Trouser</option>
                <option value="Chino">Chino</option>
                <option value="Denim">Denim</option>
                <option value="Blouse">Blouse</option>
                <option value="Swimwear">Swimwear</option>
                <option value="Rain Gear">Rain Gear</option>
                <option value="Pant">Pant</option>
                <option value="T-Shirt">T-Shirt</option>
              </select>
              {errors.design_type && (
                <div className="errorMsg">{errors.design_type}</div>
              )}
            </div>
          </div>
          <div className="col-lg-5">
            <div className="form-group">
              <label>Buyers:</label>
              <div style={{ position: "relative" }}>
                <Select
                  isMulti
                  name="buyers"
                  value={formData.buyers.map((buyerId) => {
                    const selectedBuyer = buyers.find(
                      (buyer) => buyer.id === buyerId
                    );
                    return {
                      value: buyerId,
                      label: selectedBuyer ? selectedBuyer.name : "",
                    };
                  })}
                  onChange={handleBuyerChange}
                  options={buyers.map((buyer) => ({
                    value: buyer.id,
                    label: buyer.name,
                  }))}
                />
                <i
                  onClick={() => props.setBuyerModal(true)}
                  style={{
                    color: "white",
                    background: "green",
                    padding: "2px",
                    cursor: "pointer",
                    borderRadius: "0px 5px 5px 0px",
                    position: "absolute",
                    right: 0,
                    top: 0,
                    padding: "12px 10px",
                    fontSize: "13px",
                  }}
                  className="fa fa-plus bg-falgun"
                ></i>
              </div>
              {errors.buyers && <div className="errorMsg">{errors.buyers}</div>}
            </div>
          </div>
          <div className="col-lg-12">
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <div id="editor"></div>
              <Quill className="text_area" onChange={handleDscChange} />
            </div>
            <br />
          </div>
          <div className="col-lg-8">
            <div className="form-group">
              <label htmlFor="attachments">Attachments:</label>
              <small className="text-muted">
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
        <div className="row align-items-center">
          <h5>Thumbnail/Sketch:</h5>
          <div className="col-lg-5">
            <br />
            <div className="form-group text-center">
              <label className="btn btn-success" for="fileInput">
                Upload From Computer
              </label>
              <br />
              <input
                id="fileInput"
                onChange={handleImageChange}
                hidden
                type="file"
                accept="image/*"
              />
              <div
                className="file_preview"
                style={{
                  margin: "10px auto 0",
                  border: "2px solid #3498db",
                  borderRadius: " 8px",
                  width: "320px",
                  height: "240px",
                  backgroundColor: "#f0f0f0",
                  overflow: "hidden",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: "100%", marginTop: "10px" }}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-2">
            <hr />
            <h1 className="text-center">OR</h1>
            {errors.photo && (
              <>
                <div className="errorMsg">{errors.photo}</div>
              </>
            )}
            <hr />
          </div>
          <div className="col-lg-5">
            <br />
            <CameraFileInput onFileChange={handleCapturePhoto} />
          </div>
        </div>
        <hr></hr>
        <h6>Use Items</h6>
        <div className="Import_booking_item_table">
          <table className="table text-start align-middle table-bordered table-hover mb-0">
            <thead className="bg-dark text-white">
              <tr className="text-center">
                <th>Item</th>
                <th>Description</th>
                <th>Color</th>
                <th>Unit</th>
                <th>Size</th>
                <th>QTY</th>
                <th>Rate (Approx)</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {designItems.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div style={{ position: "relative" }}>
                      <select
                        value={item.item_id}
                        onChange={(e) =>
                          handleItemChange(index, "item_id", e.target.value)
                        }
                        className={`form-select ${
                          titleValidation[index] === false ? "is-invalid" : ""
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
                        handleItemChange(index, "description", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <div style={{ position: "relative" }}>
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
                      className="form-control"
                      style={{ maxWidth: "100px" }}
                      type="number"
                      onWheel={(event) => event.target.blur()}
                      min="0"
                      step=".01"
                      value={item.qty}
                      onChange={(e) =>
                        handleItemChange(index, "qty", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="form-control"
                      style={{ maxWidth: "100px" }}
                      type="number"
                      onWheel={(event) => event.target.blur()}
                      min="0"
                      step=".01"
                      value={item.rate}
                      onChange={(e) =>
                        handleItemChange(index, "rate", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <div className="d-flex gap_10 align-items-center">
                      <input
                        className="form-control"
                        style={{ maxWidth: "100px" }}
                        step=".01"
                        min={0}
                        type="number"
                        onWheel={(event) => event.target.blur()}
                        readOnly
                        value={item.total}
                        onChange={(e) =>
                          handleItemChange(index, "total", e.target.value)
                        }
                      />
                      <Link>
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
                <td className="border_none" colSpan={7}></td>
                <td className="border_none">
                  <div className="add_row text-end">
                    <Link className="btn btn-info btn-sm" onClick={addRow}>
                      Add Row
                    </Link>
                  </div>
                </td>
              </tr>
              <br />

              <tr className="text-center">
                <td colSpan={7}>
                  <h6>Items Summary</h6>
                </td>
                <td>
                  <h6>{netTotal.toFixed(2)}</h6>
                </td>
              </tr>
              <br />
              <br />
            </tbody>
          </table>
        </div>
      </form>

      <ItemModal {...props} />
      <BuyerModal {...props} />
      <ColorModal {...props} />
      <SizeModal {...props} />
      <UnitModal {...props} />
    </div>
  );
}
