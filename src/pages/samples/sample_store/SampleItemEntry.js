import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import ItemModal from "../../../elements/modals/ItemModal";
import BuyerModal from "../../../elements/modals/BuyerModal";
import StyleModal from "../../../elements/modals/StyleModal";
import ColorModal from "../../../elements/modals/ColorModal";
import SizeModal from "../../../elements/modals/SizeModal";
import UnitModal from "../../../elements/modals/UnitModal";
import CameraFileInput from "../../../elements/CameraFileInput";
import swal from "sweetalert";
import Select from "react-select";

export default function SampleItemEntry(props) {
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);

  // get all buyers
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

  //get all items
  const [items, setItems] = useState([]);
  const getItems = async () => {
    setSpinner(true);
    var response = await api.post("/common/items");
    if (response.status === 200 && response.data) {
      setItems(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };
  // get all styles
  const [techpacks, setTechpacks] = useState([]);
  const getTechpacks = async (buyer_id) => {
    setSpinner(true);
    var response = await api.post("/merchandising/techpacks", { buyer_id: buyer_id });
    if (response.status === 200 && response.data) {
      setTechpacks(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  // get all colors
  const [colors, setColors] = useState([]);
  const getColors = async () => {
    setSpinner(true);
    var response = await api.post("/common/colors");
    if (response.status === 200 && response.data) {
      setColors(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  // get all units
  const [units, setUnits] = useState([]);
  const getUnits = async () => {
    setSpinner(true);
    var response = await api.post("/common/units");
    if (response.status === 200 && response.data) {
      setUnits(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  // get all sizes
  const [sizes, setSizes] = useState([]);
  const getSizes = async () => {
    setSpinner(true);
    var response = await api.post("/common/sizes");
    if (response.status === 200 && response.data) {
      setSizes(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  // employees
  const [employees, setEmployees] = useState([]);
  const getEmployees = async () => {
    setSpinner(true);
    var response = await api.post("/admin/employees", { department: 16 });
    console.log(response.data);
    if (response.status === 200 && response.data) {
      setEmployees(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const [errors, setErrors] = useState({});
  const [formDataSet, setFormDataSet] = useState({
    title: "",
    item_type: "",
    code: "",
    buyer_id: "",
    techpack_id: "",
    color: "",
    size: "",
    qty: 0,
    unit: "",
    reference: "",
    description: "",
  });

  const handleChange = (name, value) => {
    if (name === "buyer_id") {
      getTechpacks(value);
    }
    if (name === "item_type") {
      const selectedItem = items.find((item) => item.id === parseInt(value));
      if (selectedItem) {
        setFormDataSet({
          ...formDataSet,
          unit: selectedItem.unit,
          item_type: parseInt(value),
        });
      } else {
        setFormDataSet({
          ...formDataSet,
          unit: "",
          item_type: "",
        });
      }
    }
    setFormDataSet({ ...formDataSet, [name]: value });
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
    //  validation logic
    if (!formDataSet.title) {
      formErrors.title = "Title Title is required";
    }
    if (!formDataSet.item_type) {
      formErrors.item_type = "Item Type is required";
    }
    if (!formDataSet.code) {
      formErrors.code = "Item Code is required";
    }
    if (!formDataSet.buyer_id) {
      formErrors.buyer_id = "Buyer is required";
    }
    if (!formDataSet.techpack_id) {
      formErrors.techpack_id = "Style is required";
    }
    if (!formDataSet.color) {
      formErrors.color = "Color is required";
    }
    if (!formDataSet.size) {
      formErrors.size = "Size is required";
    }
    if (!formDataSet.unit) {
      formErrors.unit = "Unit is required";
    }
    if (!formDataSet.reference) {
      formErrors.reference = "Destination Person is required";
    }
    if (!formDataSet.qty || parseInt(formDataSet.qty) <= 0) {
      formErrors.qty = "Qty must be greater than 0";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      setSpinner(true);

      const dataSet = new FormData();
      dataSet.append("title", formDataSet.title);
      dataSet.append("item_type", formDataSet.item_type);
      dataSet.append("code", formDataSet.code);
      dataSet.append("buyer_id", formDataSet.buyer_id);
      dataSet.append("techpack_id", formDataSet.techpack_id);
      dataSet.append("color", formDataSet.color);
      dataSet.append("qty", formDataSet.qty);
      dataSet.append("unit", formDataSet.unit);
      dataSet.append("size", formDataSet.size);
      dataSet.append("reference", formDataSet.reference);
      dataSet.append("description", formDataSet.description);
      dataSet.append("photo", imageFile ? imageFile : capturedPhoto);
      var response = await api.post("/sample/sample-stores-create", dataSet);
      if (response.status === 200 && response.data) {
        history.push("/sample/stores");
      } else {
        setErrors(response.data.errors);
      }
      setSpinner(false);
    }
  };

  useEffect(async () => {
    getBuyers();
    getItems();
    getSizes();
    getColors();
    getUnits();
    getEmployees();
    getTechpacks();
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
    props.setSection("sample");
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      const allowedDepartments = ["Merchandising", "Sample"];
      if (!allowedDepartments.includes(props.userData?.department_title)) {
        await swal({
          icon: "error",
          text: "You Cannot Access This Section.",
          closeOnClickOutside: false,
        });
        history.push("/dashboard");
      }
    };
    checkAccess();
  }, [props.userData?.department_title, history]);
  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Recieving Item </div>
        <div className="actions">
          <Link to="/sample/stores" className="btn btn-danger rounded-circle">
            <i className="fal fa-times"></i>
          </Link>
        </div>
      </div>

      <div className="col-lg-12">
        <form onSubmit={handleSubmit}>
          <div className="personal_data">
            <div className="row">
              <div className="col-lg-3">
                <div className="form-group">
                  <label>
                    Item Name<sup>*</sup>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formDataSet.title}
                    onChange={(event) =>
                      handleChange("title", event.target.value)
                    }
                  />
                  {errors.title && (
                    <div className="errorMsg">{errors.title}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label>
                    Item Type<sup>*</sup>
                  </label>

                  <div style={{ position: "relative" }}>
                    <Select
                      placeholder="Select"
                      onChange={(selectedOption) =>
                        handleChange("item_type", selectedOption.value)
                      }
                      value={
                        items.find((item) => item.id === formDataSet.item_type)
                          ? {
                              value: formDataSet.item_type,
                              label:
                                items.find(
                                  (item) => item.id === formDataSet.item_type
                                ).title || "",
                            }
                          : null
                      }
                      name="item_type"
                      options={items.map((item) => ({
                        value: item.id,
                        label: item.title,
                      }))}
                    />
                    <i
                      onClick={() => {
                        props.setItemModal(true);
                      }}
                      style={{
                        color: "white",
                        background: "green",
                        padding: "2px",
                        cursor: "pointer",
                        borderRadius: "0px 5px 5px 0px",
                        position: "absolute",
                        right: 0,
                        top: 0,
                        padding: "11px 9px",
                        fontSize: "13px",
                      }}
                      className="fa fa-plus bg-falgun"
                    ></i>
                  </div>
                  {errors.item_type && (
                    <div className="errorMsg">{errors.item_type}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label>
                    Item Code<sup>*</sup>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="code"
                    value={formDataSet.code}
                    onChange={(event) =>
                      handleChange("code", event.target.value)
                    }
                  />
                  {errors.code && <div className="errorMsg">{errors.code}</div>}
                </div>
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label>
                    Buyer<sup>*</sup>
                  </label>
                  <div style={{ position: "relative" }}>
                    <Select
                      placeholder="Select"
                      onChange={(selectedOption) =>
                        handleChange("buyer_id", selectedOption.value)
                      }
                      value={
                        buyers.find((item) => item.id === formDataSet.buyer_id)
                          ? {
                              value: formDataSet.buyer_id,
                              label:
                                buyers.find(
                                  (item) => item.id === formDataSet.buyer_id
                                ).name || "",
                            }
                          : null
                      }
                      name="buyer_id"
                      options={buyers.map((item) => ({
                        value: item.id,
                        label: item.name,
                      }))}
                    />

                    <i
                      onClick={() => {
                        props.setBuyerModal(true);
                      }}
                      style={{
                        color: "white",
                        background: "green",
                        padding: "2px",
                        cursor: "pointer",
                        borderRadius: "0px 5px 5px 0px",
                        position: "absolute",
                        right: 0,
                        top: 0,
                        padding: "11px 9px",
                        fontSize: "13px",
                      }}
                      className="fa fa-plus bg-falgun"
                    ></i>
                  </div>

                  {errors.buyer_id && (
                    <div className="errorMsg">{errors.buyer_id}</div>
                  )}
                </div>
              </div>

              <div className="col-lg-3">
                <div className="form-group">
                  <label>
                    Style/Techpack<sup>*</sup>
                  </label>
                  <div style={{ position: "relative" }}>
                    <Select
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
                  </div>
                  {errors.techpack_id && (
                    <div className="errorMsg">{errors.techpack_id}</div>
                  )}
                </div>
              </div>

              <div className="col-lg-3">
                <div className="form-group">
                  <label>
                    Color <sup>*</sup>
                  </label>
                  <div style={{ position: "relative" }}>
                    <Select
                      placeholder="Select"
                      onChange={(selectedOption) =>
                        handleChange("color", selectedOption.value)
                      }
                      value={
                        colors.find((item) => item.title === formDataSet.color)
                          ? {
                              value: formDataSet.color,
                              label:
                                colors.find(
                                  (item) => item.title === formDataSet.color
                                ).title || "",
                            }
                          : null
                      }
                      name="color"
                      options={colors.map((item) => ({
                        value: item.title,
                        label: item.title,
                      }))}
                    />

                    <i
                      onClick={() => {
                        props.setColorModal(true);
                      }}
                      style={{
                        color: "white",
                        background: "green",
                        padding: "2px",
                        cursor: "pointer",
                        borderRadius: "0px 5px 5px 0px",
                        position: "absolute",
                        right: 0,
                        top: 0,
                        padding: "11px 10px",
                        fontSize: "13px",
                      }}
                      className="fa fa-plus bg-falgun"
                    ></i>
                  </div>
                  {errors.color && (
                    <div className="errorMsg">{errors.color}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label>
                    Size <sup>*</sup>
                  </label>
                  <div style={{ position: "relative" }}>
                    <Select
                      placeholder="Select"
                      onChange={(selectedOption) =>
                        handleChange("size", selectedOption.value)
                      }
                      value={
                        sizes.find((item) => item.title === formDataSet.size)
                          ? {
                              value: formDataSet.size,
                              label:
                                sizes.find(
                                  (item) => item.title === formDataSet.size
                                ).title || "",
                            }
                          : null
                      }
                      name="size"
                      options={sizes.map((item) => ({
                        value: item.title,
                        label: item.title,
                      }))}
                    />
                    <i
                      onClick={() => {
                        props.setSizeModal(true);
                      }}
                      style={{
                        color: "white",
                        background: "green",
                        padding: "2px",
                        cursor: "pointer",
                        borderRadius: "0px 5px 5px 0px",
                        position: "absolute",
                        right: 0,
                        top: 0,
                        padding: "11px 10px",
                        fontSize: "13px",
                      }}
                      className="fa fa-plus bg-falgun"
                    ></i>
                  </div>
                  {errors.size && <div className="errorMsg">{errors.size}</div>}
                </div>
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label>
                    QTY<sup>*</sup>
                  </label>
                  <input
                    className="form-control"
                    step=".01"
                    min={0}
                    type="number"
onWheel={(event) => event.target.blur()}
                    name="qty"
                    value={formDataSet.qty}
                    onChange={(event) =>
                      handleChange("qty", event.target.value)
                    }
                  />
                  {errors.qty && <div className="errorMsg">{errors.qty}</div>}
                </div>
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label>
                    Unit<sup>*</sup>
                  </label>
                  <div style={{ position: "relative" }}>
                    <Select
                      placeholder="Select"
                      onChange={(selectedOption) =>
                        handleChange("unit", selectedOption.value)
                      }
                      value={
                        units.find((item) => item.title === formDataSet.unit)
                          ? {
                              value: formDataSet.unit,
                              label:
                                units.find(
                                  (item) => item.title === formDataSet.unit
                                ).title || "",
                            }
                          : null
                      }
                      name="unit"
                      options={units.map((item) => ({
                        value: item.title,
                        label: item.title,
                      }))}
                    />
                    <i
                      onClick={() => {
                        props.setUnitModal(true);
                      }}
                      style={{
                        color: "white",
                        background: "green",
                        padding: "2px",
                        cursor: "pointer",
                        borderRadius: "0px 5px 5px 0px",
                        position: "absolute",
                        right: 0,
                        top: 0,
                        padding: "11px 10px",
                        fontSize: "13px",
                      }}
                      className="fa fa-plus bg-falgun"
                    ></i>
                  </div>
                  {errors.unit && <div className="errorMsg">{errors.unit}</div>}
                </div>
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label>
                    Reference<sup>*</sup>
                  </label>

                  <Select
                    placeholder="Select"
                    onChange={(selectedOption) =>
                      handleChange("reference", selectedOption.value)
                    }
                    value={
                      employees.find(
                        (item) => item.id === formDataSet.reference
                      )
                        ? {
                            value: formDataSet.reference,
                            label:
                              employees.find(
                                (item) => item.id === formDataSet.reference
                              ).full_name || "",
                          }
                        : null
                    }
                    name="reference"
                    options={employees.map((item) => ({
                      value: item.id,
                      label: item.full_name,
                    }))}
                  />

                  {errors.reference && (
                    <div className="errorMsg">{errors.reference}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    onChange={(event) =>
                      handleChange("description", event.target.value)
                    }
                    value={formDataSet.description}
                    name="description"
                    className="form-control"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="row align-items-center">
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
            <div className="text-center">
              <button type="submit" className="btn btn-warning bg-falgun">
                Submit
              </button>
            </div>
            <hr></hr>
          </div>
        </form>
      </div>
      <ItemModal {...props} />
      <BuyerModal {...props} />
      <StyleModal {...props} />
      <ColorModal {...props} />
      <SizeModal {...props} />
      <UnitModal {...props} />
    </div>
  );
}
