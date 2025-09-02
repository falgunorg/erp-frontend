import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import swal from "sweetalert";
import Select from "react-select";

import SampleTypeModal from "../../../elements/modals/SampleTypeModal";
import StyleModal from "../../../elements/modals/StyleModal";
import ColorModal from "../../../elements/modals/ColorModal";
import SizeModal from "../../../elements/modals/SizeModal";
import CameraFileInput from "../../../elements/CameraFileInput";

export default function EditSor(props) {
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

  // retrive data

  const [techpacks, setTechpacks] = useState([]);
  const getTechpacks = async () => {
    setSpinner(true);
    var response = await api.post("/merchandising/techpacks", {
      view: "team",
      department: userInfo.department_title,
      designation: userInfo.designation_title,
    });
    if (response.status === 200 && response.data) {
      setTechpacks(response.data.data);
    }
    setSpinner(false);
  };

  const [sampleTypes, setSampleTypes] = useState([]);
  const getSampleTypes = async () => {
    setSpinner(true);
    var response = await api.post("/merchandising/sors-types");
    if (response.status === 200 && response.data) {
      setSampleTypes(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
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

  const getStores = async () => {
    setSpinner(true);
    var response = await api.post("/sample/sample-stores");
    if (response.status === 200 && response.data) {
      setSorItems(response.data.data);
    }
    setSpinner(false);
  };

  const [sorItems, setSorItems] = useState([]);
  const removeRow = (index) => {
    const updatedItems = [...sorItems];
    updatedItems.splice(index, 1);
    setSorItems(updatedItems);
  };

  const [tooltipMessages, setTooltipMessages] = useState(
    Array(sorItems.length).fill("")
  );
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...sorItems];
    const totalBalance = parseFloat(updatedItems[index]["balance"]);

    if (field === "per_pc_cons") {
      const sampleQty = parseFloat(formDataSet.qty) || 0;
      const qtyPerPc = parseFloat(value) || 0;
      const total = (sampleQty * qtyPerPc).toFixed(2);

      if (total > totalBalance) {
        const newTooltipMessages = [...tooltipMessages];
        newTooltipMessages[index] = "exceed total balance.";
        setTooltipMessages(newTooltipMessages);
        return;
      }
      updatedItems[index]["current_balance"] = (totalBalance - total).toFixed(
        2
      );
      updatedItems[index]["total"] = total;
    }
    updatedItems[index][field] = value;
    setSorItems(updatedItems);
    const newTooltipMessages = [...tooltipMessages];
    newTooltipMessages[index] = "";
    setTooltipMessages(newTooltipMessages);
  };
  const Tooltip = ({ index }) => (
    <div className={`tooltip ${tooltipMessages[index] ? "visible" : ""}`}>
      {tooltipMessages[index]}
    </div>
  );
  const [errors, setErrors] = useState({});
  const operations = ["Printing", "Washing", "Embroidery", "Dyeing"];
  const [selectedOperations, setSelectedOperations] = useState([]);
  const handleCheckboxChange = (operation) => {
    if (selectedOperations.includes(operation)) {
      setSelectedOperations(
        selectedOperations.filter((op) => op !== operation)
      );
    } else {
      setSelectedOperations([...selectedOperations, operation]);
    }
  };

  const [formDataSet, setFormDataSet] = useState({
    techpack_id: "",
    sample_type: "",
    qty: 1,
    sizes: [],
    colors: [],
    issued_date: "",
    delivery_date: "",
    remarks: "",
  });

  const handleChange = (name, value) => {
    setFormDataSet({ ...formDataSet, [name]: value });
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

  const validateForm = () => {
    let formErrors = {};
    // personal info
    if (!formDataSet.techpack_id) {
      formErrors.techpack_id = "Buyer is required";
    }
    if (!formDataSet.sample_type) {
      formErrors.sample_type = "Sample Type is required";
    }

    if (!formDataSet.qty || parseInt(formDataSet.qty) <= 0) {
      formErrors.qty = "Qty must be greater than 0";
    }
    if (!formDataSet.sizes.length > 0) {
      formErrors.sizes = "Size is required";
    }
    if (!formDataSet.colors.length > 0) {
      formErrors.colors = "Color is required";
    }
    if (!formDataSet.issued_date) {
      formErrors.issued_date = "Issued Date is required";
    }
    if (!formDataSet.delivery_date) {
      formErrors.delivery_date = "Delivery date is required";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      if (sorItems.length === 0) {
        swal({
          title:
            "No BOM in this SOR, no items in store for this buyer/sample type/style.",
          icon: "error",
        });
        return; // Prevent form submission
      }

      const isAnyInvalid = sorItems.some((item) => !item.per_pc_cons);
      if (isAnyInvalid) {
        swal({
          title: "Please Enter Per Pc Cons for each row",
          icon: "error",
        });
        return; // Prevent form submission
      }

      var data = new FormData();
      data.append("techpack_id", formDataSet.techpack_id);
      data.append("sample_type", formDataSet.sample_type);
      data.append("qty", formDataSet.qty);
      data.append("sizes", formDataSet.sizes);
      data.append("colors", formDataSet.colors);
      data.append("issued_date", formDataSet.issued_date);
      data.append("delivery_date", formDataSet.delivery_date);
      data.append("remarks", formDataSet.remarks);
      data.append("operations", selectedOperations);
      data.append("sor_items", JSON.stringify(sorItems));
      data.append("photo", imageFile ? imageFile : capturedPhoto);
      for (let i = 0; i < selectedFiles.length; i++) {
        data.append("attatchments[]", selectedFiles[i]);
      }
      setSpinner(true);
      var response = await api.post("/merchandising/sors-create", data);
      if (response.status === 200 && response.data) {
        history.push("/merchandising/sors");
      } else {
        setErrors(response.data.errors);
      }
      setSpinner(false);
    }
  };

  useEffect(async () => {
    getSizes();
    getColors();
    getTechpacks();
    getSampleTypes();
  }, []);

  useEffect(async () => {
    getSizes();
  }, [props.callSizes]);
  useEffect(async () => {
    getColors();
  }, [props.callColors]);
  useEffect(async () => {
    getTechpacks();
  }, [props.callStyles]);
  useEffect(async () => {
    getSampleTypes();
  }, [props.callSampleTypes]);
  useEffect(async () => {
    getStores();
  }, []);
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
          <div className="page_name">Add Sample Order Request</div>
          <div className="actions">
            <button
              type="supmit"
              className="publish_btn btn btn-warning bg-falgun"
            >
              Save
            </button>
            <Link
              to="/merchandising/sors"
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
                    TechPack<sup>*</sup>
                  </label>
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
                  {errors.techpack_id && (
                    <div className="errorMsg">{errors.techpack_id}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    Sample Type<sup>*</sup>
                  </label>

                  <div style={{ position: "relative" }}>
                    <Select
                      placeholder="Select"
                      value={
                        sampleTypes.find(
                          (item) => item.id === formDataSet.sample_type
                        )
                          ? {
                              value: formDataSet.sample_type,
                              label:
                                sampleTypes.find(
                                  (item) => item.id === formDataSet.sample_type
                                ).title || "",
                            }
                          : null
                      }
                      onChange={(selectedOption) =>
                        handleChange("sample_type", selectedOption.value)
                      }
                      name="sample_type"
                      options={sampleTypes.map((item) => ({
                        value: item.id,
                        label: item.title,
                      }))}
                    />
                    <i
                      onClick={() => {
                        props.setSampleTypeModal(true);
                      }}
                      style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        padding: "10px",
                        color: "white",
                        borderRadius: "0 5px 5px 0",
                      }}
                      className="fa fa-plus bg-falgun"
                    ></i>
                  </div>
                  {errors.sample_type && (
                    <div className="errorMsg">{errors.sample_type}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    QTY <sup>*</sup>
                  </label>
                  <input
                    type="text"
                    name="qty"
                    min={0}
                    value={formDataSet.qty}
                    onChange={(event) =>
                      handleChange("qty", event.target.value)
                    }
                    className="form-control"
                  />
                  {errors.qty && <div className="errorMsg">{errors.qty}</div>}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group" style={{ position: "relative" }}>
                  <label>
                    Sizes <sup>*</sup>
                  </label>
                  <Select
                    isMulti
                    placeholder="Select or Search"
                    name="sizes"
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
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "25px",
                      padding: "10px",
                      color: "white",
                      borderRadius: "0 5px 5px 0",
                    }}
                    className="fa fa-plus bg-falgun"
                    onClick={() => {
                      props.setSizeModal(true);
                    }}
                  ></i>
                  {errors.sizes && (
                    <div className="errorMsg">{errors.sizes}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group" style={{ position: "relative" }}>
                  <label>
                    Colors <sup>*</sup>
                  </label>

                  <Select
                    isMulti
                    placeholder="Select or Search"
                    name="colors"
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
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "25px",
                      padding: "10px",
                      color: "white",
                      borderRadius: "0 5px 5px 0",
                    }}
                    className="fa fa-plus bg-falgun"
                    onClick={() => {
                      props.setColorModal(true);
                    }}
                  ></i>

                  {errors.colors && (
                    <div className="errorMsg">{errors.colors}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    Issued Date <sup>*</sup>
                  </label>
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
                    <div className="errorMsg">{errors.issued_date}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    Delivery Date <sup>*</sup>
                  </label>
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
                    <div className="errorMsg">{errors.delivery_date}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group">
                  <label>Operations</label>
                  <br />
                  {operations.map((operation) => (
                    <span
                      key={operation}
                      className={`d-flex gap_10 border ${
                        selectedOperations.includes(operation) ? "selected" : ""
                      }`}
                      style={{
                        padding: "0 5px",
                        background: "#ddd",
                        margin: "5px",
                        float: "left",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedOperations.includes(operation)}
                        onChange={() => handleCheckboxChange(operation)}
                      />
                      <span>{operation}</span>
                    </span>
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
            <br />
            <div className="row">
              <div className="col-lg-6">
                <div className="form-group">
                  <label htmlFor="attachments">attachments:</label>
                  <small className="text-muted">
                    {" "}
                    (PDF,Word,Excel,JPEG,PNG)
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
              <div className="col-lg-6">
                <div className="form-group">
                  <label>Remarks</label>
                  <textarea
                    value={formDataSet.remarks}
                    onChange={(event) =>
                      handleChange("remarks", event.target.value)
                    }
                    name="remarks"
                    className="form-control"
                  />
                </div>
              </div>
            </div>
            <hr></hr>
            <h6>SAMPLE BOM</h6>
            <div className="Import_booking_item_table">
              <table className="table text-start align-middle table-bordered table-hover mb-0">
                <thead className="bg-dark text-white">
                  <tr className="text-center">
                    <th>Photo</th>
                    <th>Item</th>
                    <th>Color</th>
                    <th>Unit</th>
                    <th>Size</th>
                    <th>Description</th>
                    <th>Per PC Cons.</th>
                    <th>Total</th>
                    <th>Less Balance</th>
                    <th>Stock Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {sorItems.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          style={{
                            height: "50px",
                            width: "50px",
                          }}
                          src={item.file_source}
                        />
                      </td>
                      <td>
                        {item.store_number} | {item.item_type_name} |{" "}
                        {item.title}
                      </td>
                      <td>{item.color}</td>
                      <td>{item.unit}</td>
                      <td>{item.size}</td>
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
                        <input
                          className="form-control"
                          type="number"
                          onWheel={(event) => event.target.blur()}
                          min={1}
                          step=".01"
                          value={item.per_pc_cons}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "per_pc_cons",
                              e.target.value
                            )
                          }
                        />
                        <Tooltip index={index} />
                      </td>

                      <td>
                        <input
                          className="form-control"
                          readOnly
                          value={item.total}
                          onChange={(e) =>
                            handleItemChange(index, "total", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          readOnly
                          value={item.current_balance}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "current_balance",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <div className="d-flex gap_10 align-items-center">
                          <input
                            className="form-control"
                            step=".01"
                            readOnly
                            min={0}
                            type="number"
                            onWheel={(event) => event.target.blur()}
                            value={item.balance}
                            onChange={(e) =>
                              handleItemChange(index, "balance", e.target.value)
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
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <br />
        <br />
      </form>

      <SampleTypeModal {...props} />
      <StyleModal {...props} />
      <ColorModal {...props} />
      <SizeModal {...props} />
    </div>
  );
}
