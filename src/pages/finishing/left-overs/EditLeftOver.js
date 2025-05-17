import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Spinner from "../../../elements/Spinner";
import api from "../../../services/api";
import CameraFileInput from "../../../elements/CameraFileInput";
import swal from "sweetalert";
import Select from "react-select";

export default function EditLeftOver(props) {
  const history = useHistory();
  const params = useParams();
  const [spinner, setSpinner] = useState(false);

  const [buyers, setBuyers] = useState([]);
  const getBuyers = async () => {
    setSpinner(true);
    var response = await api.post("/buyers");
    if (response.status === 200 && response.data) {
      setBuyers(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const [techpacks, setTechpacks] = useState([]);
  const getTechpacks = async (buyer_id) => {
    setSpinner(true);
    var response = await api.post("/techpacks", { buyer_id: buyer_id });
    if (response.status === 200 && response.data) {
      setTechpacks(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const [errors, setErrors] = useState({});
  const [formDataSet, setFormDataSet] = useState({
    buyer_id: "",
    techpack_id: "",
    title: "",
    carton: "",
    qty: "",
    season: "",
    item_type: "",
    reference: "",
    remarks: "",
  });

  const handleChange = (name, value) => {
    setFormDataSet({ ...formDataSet, [name]: value });
    if (name === "buyer_id") {
      getTechpacks(value);
    }
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
    if (!formDataSet.buyer_id) {
      formErrors.buyer_id = "Buyer is required";
    }
    if (!formDataSet.techpack_id) {
      formErrors.techpack_id = "Style is required";
    }
    if (!formDataSet.title) {
      formErrors.title = "Title Title is required";
    }
    if (!formDataSet.carton || parseInt(formDataSet.carton) <= 0) {
      formErrors.carton = "Carton QTY must be greater than 0";
    }
    if (!formDataSet.qty || parseInt(formDataSet.qty) <= 0) {
      formErrors.qty = "Qty must be greater than 0";
    }
    if (!formDataSet.season) {
      formErrors.season = "Please Insert Season";
    }
    if (!formDataSet.item_type) {
      formErrors.item_type = "Item Type is required";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      setSpinner(true);
      const dataSet = new FormData();
      dataSet.append("buyer_id", formDataSet.buyer_id);
      dataSet.append("techpack_id", formDataSet.techpack_id);
      dataSet.append("title", formDataSet.title);
      dataSet.append("carton", formDataSet.carton);
      dataSet.append("qty", formDataSet.qty);
      dataSet.append("season", formDataSet.season);
      dataSet.append("item_type", formDataSet.item_type);
      dataSet.append("reference", formDataSet.reference);
      dataSet.append("remarks", formDataSet.remarks);
      dataSet.append("photo", imageFile ? imageFile : capturedPhoto);
      dataSet.append("id", formDataSet.id);
      var response = await api.post("/left-overs-update", dataSet);
      if (response.status === 200 && response.data) {
        swal({
          title: "Record Updated Success",
          icon: "success",
        });
        history.push("/finishing/left-overs");
      } else {
        setErrors(response.data.errors);
      }
      setSpinner(false);
    }
  };

  const getLeftOver = async () => {
    setSpinner(true);
    var response = await api.post("/left-overs-show", { id: params.id });
    if (response.status === 200 && response.data) {
      setFormDataSet(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  useEffect(() => {
    getBuyers();
    getLeftOver();
    getTechpacks();
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      if (props.userData?.department_title !== "Finishing") {
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
      <div className="create_page_heading">
        <div className="page_name">Edit Left Over Item</div>
        <div className="actions">
          {props.rolePermission?.Employee?.add_edit ? (
            <Link
              to="/finishing/left-overs"
              className="btn btn-danger rounded-circle"
            >
              <i className="fal fa-times"></i>
            </Link>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4">
          <div className="form-group">
            <label>
              Buyer <sup>*</sup>
            </label>
            <Select
              placeholder="Select or Search"
              onChange={(selectedOption) =>
                handleChange("buyer_id", selectedOption.value)
              }
              value={
                buyers.find((item) => item.id === formDataSet.buyer_id)
                  ? {
                      value: formDataSet.buyer_id,
                      label:
                        buyers.find((item) => item.id === formDataSet.buyer_id)
                          .name || "",
                    }
                  : null
              }
              name="buyer_id"
              options={buyers.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
            />
            {errors.buyer_id && (
              <>
                <div className="errorMsg">{errors.buyer_id}</div>
              </>
            )}
          </div>
        </div>
        <div className="col-lg-4">
          <div className="form-group">
            <label>
              Style <sup>*</sup>
            </label>

            <Select
              placeholder="Select or Search"
              value={
                techpacks.find((item) => item.id === formDataSet.techpack_id)
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
              <>
                <div className="errorMsg">{errors.techpack_id}</div>
              </>
            )}
          </div>
        </div>
        <div className="col-lg-4">
          <div className="form-group">
            <label>
              Item <sup>*</sup>
            </label>
            <input
              onChange={(event) => handleChange("title", event.target.value)}
              value={formDataSet.title}
              name="title"
              type="text"
              className="form-control"
            />
            {errors.title && (
              <>
                <div className="errorMsg">{errors.title}</div>
              </>
            )}
          </div>
        </div>
        <div className="col-lg-4">
          <div className="form-group">
            <label>
              Carton QTY <sup>*</sup>
            </label>
            <input
              onChange={(event) => handleChange("carton", event.target.value)}
              value={formDataSet.carton}
              name="carton"
              type="number"
onWheel={(event) => event.target.blur()}
              min={0}
              className="form-control"
            />
            {errors.carton && (
              <>
                <div className="errorMsg">{errors.carton}</div>
              </>
            )}
          </div>
        </div>
        <div className="col-lg-4">
          <div className="form-group">
            <label>
              QTY (PCS) <sup>*</sup>
            </label>
            <input
              onChange={(event) => handleChange("qty", event.target.value)}
              value={formDataSet.qty}
              name="qty"
              type="number"
onWheel={(event) => event.target.blur()}
              min={0}
              className="form-control"
            />
            {errors.qty && (
              <>
                <div className="errorMsg">{errors.qty}</div>
              </>
            )}
          </div>
        </div>
        <div className="col-lg-4">
          <div className="form-group">
            <label>
              Season<sup>*</sup>
            </label>
            <select
              className="form-select"
              onChange={(event) => handleChange("season", event.target.value)}
              value={formDataSet.season}
              name="season"
            >
              <option value="">Select Season</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Fall">Fall</option>
              <option value="Holiday">Holiday</option>
            </select>
            {errors.season && (
              <>
                <div className="errorMsg">{errors.season}</div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4">
          <img style={{ width: "100%" }} src={formDataSet.image_source} />
        </div>
        <div className="col-lg-8">
          <div className="row">
            <div className="col-lg-6">
              <div className="form-group">
                <label>
                  Item Type <sup>*</sup>
                </label>
                <select
                  onChange={(event) =>
                    handleChange("item_type", event.target.value)
                  }
                  value={formDataSet.item_type}
                  name="item_type"
                  className="form-select"
                >
                  <option value="">Select Type</option>
                  <option value="Best">Best</option>
                  <option value="Good">Good</option>
                </select>
                {errors.item_type && (
                  <>
                    <div className="errorMsg">{errors.item_type}</div>
                  </>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group">
                <label>Reference</label>
                <input
                  onChange={(event) =>
                    handleChange("reference", event.target.value)
                  }
                  value={formDataSet.reference}
                  name="reference"
                  type="text"
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-lg-12">
              <div className="form-group">
                <label>Remarks</label>
                <textarea
                  onChange={(event) =>
                    handleChange("remarks", event.target.value)
                  }
                  value={formDataSet.remarks}
                  name="remarks"
                  type="text"
                  className="form-control"
                ></textarea>
              </div>
            </div>
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
      <div className="row">
        <div className="col-lg-12">
          <div className="text-center">
            <br />
            <button
              className="btn bg-falgun btn-warning btn-lg"
              onClick={handleSubmit}
            >
              SUBMIT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
