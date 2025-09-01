import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Quill from "quill";
import Spinner from "../../../elements/Spinner";
import api from "../../../services/api";
import CameraFileInput from "../../../elements/CameraFileInput";
import swal from "sweetalert";

export default function CreateMachine(props) {
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);

  const [description, setDescription] = useState("");
  const handleDscChange = (value) => {
    setDescription(value);
  };

  const [companies, setCompanies] = useState([]);
  const getCompanies = async () => {
    var response = await api.post("/common/companies", { type: "Own" });
    if (response.status === 200 && response.data) {
      setCompanies(response.data.data);
    }
  };

  console.log("COMPANIES", companies);

  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    model: "",
    type: "",
    unit: "",
    reference: "",
    efficiency: "",
    note: "",
    company_id: "",
    purchase_date: "",
    purchase_value: "",
    purchase_value_bdt: "",
    warranty_ends_at: "",
    guarantee_ends_at: "",
    ownership: "",
    category: "",
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
  const validateForm = () => {
    let newErrors = {};
    if (!formData.title) {
      newErrors.title = "Title is required";
    }
    if (!formData.brand) {
      newErrors.brand = "Brand is required";
    }
    if (!formData.model) {
      newErrors.model = "Model is required";
    }
    if (!formData.company_id) {
      newErrors.company_id = "Company is required";
    }
    if (!formData.type) {
      newErrors.type = "Type is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.ownership) {
      newErrors.ownership = "Ownership is required";
    }

    if (!formData.purchase_date) {
      newErrors.purchase_date = "Purchase Date is required";
    }
    if (!formData.purchase_value) {
      newErrors.purchase_value = "Purchase Value is required";
    }
    if (!formData.efficiency) {
      newErrors.efficiency = "Efficiency is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const itemPhoto = imageFile ? imageFile : capturedPhoto;

      if (!itemPhoto) {
        swal({
          title: "Please Upload Machine Photo",
          icon: "error",
        });
        return;
      }
      setSpinner(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("brand", formData.brand);
      data.append("model", formData.model);
      data.append("type", formData.type);
      data.append("unit", formData.unit);
      data.append("reference", formData.reference);
      data.append("efficiency", formData.efficiency);
      data.append("note", formData.note);
      data.append("company_id", formData.company_id);
      data.append("purchase_date", formData.purchase_date);
      data.append("purchase_value", formData.purchase_value);
      data.append("purchase_value_bdt", formData.purchase_value_bdt);
      data.append("warranty_ends_at", formData.warranty_ends_at);
      data.append("guarantee_ends_at", formData.guarantee_ends_at);
      data.append("ownership", formData.ownership);
      data.append("category", formData.category);
      data.append("description", description);
      data.append("photo", itemPhoto);
      var response = await api.post("/machines-create", data);
      if (response.data.status == "success") {
        history.push("/maintenance/machines");
      } else {
        setErrors(response.data.errors);
      }
      setSpinner(false);
    }
  };

  useEffect(async () => {
    getCompanies();
  }, []);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <form onSubmit={handleSubmit}>
        <div className="create_page_heading">
          <div className="page_name">Add New Machine</div>
          <div className="actions">
            <button
              type="submit"
              className="publish_btn btn btn-warning bg-falgun"
            >
              Submit
            </button>
            <Link
              to="/maintenance/machines"
              className="btn btn-danger rounded-circle"
            >
              <i className="fal fa-times"></i>
            </Link>
          </div>
        </div>

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
          <div className="col-lg-3">
            <div className="form-group">
              <label htmlFor="brand">Brand:</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="form-control"
              />
              {errors.brand && <div className="errorMsg">{errors.brand}</div>}
            </div>
          </div>

          <div className="col-lg-3">
            <div className="form-group">
              <label htmlFor="model">Model:</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="form-control"
              />
              {errors.model && <div className="errorMsg">{errors.model}</div>}
            </div>
          </div>

          <div className="col-lg-3">
            <div className="form-group">
              <label htmlFor="type">Type:</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select One</option>
                <option value="Auto">Auto</option>
                <option value="Manual">Manual</option>
              </select>

              {errors.type && <div className="errorMsg">{errors.type}</div>}
            </div>
          </div>

          <div className="col-lg-3">
            <div className="form-group">
              <label htmlFor="unit">Unit/Section:</label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="form-control"
              />
              {errors.unit && <div className="errorMsg">{errors.unit}</div>}
            </div>
          </div>
          <div className="col-lg-3">
            <div className="form-group">
              <label htmlFor="reference">Reference:</label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                className="form-control"
              />
              {errors.reference && (
                <div className="errorMsg">{errors.reference}</div>
              )}
            </div>
          </div>

          <div className="col-lg-3">
            <div className="form-group">
              <label htmlFor="efficiency">Efficiency (%):</label>
              <input
                type="number"
                onWheel={(event) => event.target.blur()}
                min={0}
                max={100}
                name="efficiency"
                value={formData.efficiency}
                onChange={handleChange}
                className="form-control"
              />
              {errors.efficiency && (
                <div className="errorMsg">{errors.efficiency}</div>
              )}
            </div>
          </div>

          <div className="col-lg-3">
            <div className="form-group">
              <label htmlFor="note">Note:</label>
              <input
                type="text"
                name="note"
                value={formData.note}
                onChange={handleChange}
                className="form-control"
              />
              {errors.note && <div className="errorMsg">{errors.note}</div>}
            </div>
          </div>

          <div className="col-lg-3">
            <div className="form-group">
              <label htmlFor="company_id">Company:</label>

              <select
                name="company_id"
                value={formData.company_id}
                onChange={handleChange}
                className="form-select"
              >
                <option value="0">Select One</option>
                {companies.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>

              {errors.company_id && (
                <div className="errorMsg">{errors.company_id}</div>
              )}
            </div>
          </div>

          <div className="col-lg-3">
            <div className="form-group">
              <label htmlFor="purchase_date">Purchase Date:</label>
              <input
                type="date"
                name="purchase_date"
                value={formData.purchase_date}
                onChange={handleChange}
                className="form-control"
              />
              {errors.purchase_date && (
                <div className="errorMsg">{errors.purchase_date}</div>
              )}
            </div>
          </div>

          <div className="col-lg-3">
            <div className="form-group">
              <label htmlFor="purchase_value">Purchase Value(USD):</label>
              <input
                type="number"
                onWheel={(event) => event.target.blur()}
                name="purchase_value"
                value={formData.purchase_value}
                onChange={handleChange}
                className="form-control"
              />
              {errors.purchase_value && (
                <div className="errorMsg">{errors.purchase_value}</div>
              )}
            </div>
          </div>
          <div className="col-lg-3">
            <div className="form-group">
              <label htmlFor="purchase_value">Purchase Value(BDT):</label>
              <input
                type="number"
                onWheel={(event) => event.target.blur()}
                name="purchase_value_bdt"
                value={formData.purchase_value_bdt}
                onChange={handleChange}
                className="form-control"
              />
              {errors.purchase_value_bdt && (
                <div className="errorMsg">{errors.purchase_value_bdt}</div>
              )}
            </div>
          </div>

          <div className="col-lg-3">
            <div className="form-group">
              <label htmlFor="warranty_ends_at">Warranty Ends At:</label>
              <input
                type="date"
                name="warranty_ends_at"
                value={formData.warranty_ends_at}
                onChange={handleChange}
                className="form-control"
              />
              {errors.warranty_ends_at && (
                <div className="errorMsg">{errors.warranty_ends_at}</div>
              )}
            </div>
          </div>

          <div className="col-lg-3">
            <div className="form-group">
              <label htmlFor="guarantee_ends_at">Guarantee Ends At:</label>
              <input
                type="date"
                name="guarantee_ends_at"
                value={formData.guarantee_ends_at}
                onChange={handleChange}
                className="form-control"
              />
              {errors.guarantee_ends_at && (
                <div className="errorMsg">{errors.guarantee_ends_at}</div>
              )}
            </div>
          </div>

          <div className="col-lg-3">
            <div className="form-group">
              <label htmlFor="ownership">Ownership:</label>
              <input
                type="text"
                name="ownership"
                value={formData.ownership}
                onChange={handleChange}
                className="form-control"
              />
              {errors.ownership && (
                <div className="errorMsg">{errors.ownership}</div>
              )}
            </div>
          </div>

          <div className="col-lg-3">
            <div className="form-group">
              <label htmlFor="category">Category:</label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select One</option>
                <option value="Usual">Usual</option>
                <option value="Special">Special</option>
                <option value="Others">Others</option>
              </select>

              {errors.category && (
                <div className="errorMsg">{errors.category}</div>
              )}
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
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="publish_btn btn btn-warning bg-falgun"
          >
            Submit
          </button>
        </div>

        <br />
        <br />
        <br />
      </form>
    </div>
  );
}
