import React, { useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import api from "../../services/api";
import CameraFileInput from "../CameraFileInput";
import swal from "sweetalert";

export default function PartModal(props) {
  const [units, setUnits] = useState([]);
  const getUnits = async () => {
    var response = await api.post("/units");
    if (response.status === 200 && response.data) {
      setUnits(response.data.data);
    } else {
      console.log(response.data);
    }
  };
  // add parts on modal
  const closePartModal = () => {
    props.setPartModal(false);
  };
  const [partForm, setPartForm] = useState({
    title: "",
    unit: "",
    type: "",
    brand: "",
    model: "",
    min_balance: 5,
  });
  const [partErrors, setPartErrors] = useState({});

  const validatePartInputs = () => {
    let formErrors = {};
    // personal info
    if (!partForm.title) {
      formErrors.title = "Title is required";
    }
    if (!partForm.unit) {
      formErrors.unit = "Unit is required";
    }
    if (!partForm.type) {
      formErrors.type = "Type is required";
    }
    if (!partForm.min_balance) {
      formErrors.min_balance = "Minimum Balance is required";
    }
    setPartErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const partChange = (ev) => {
    setPartForm({
      ...partForm,
      [ev.target.name]: ev.target.value,
    });
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

  const submitPart = async () => {
    const valid = validatePartInputs();
    if (valid) {
      var data = new FormData();
      data.append("title", partForm.title);
      data.append("unit", partForm.unit);
      data.append("type", partForm.type);
      data.append("brand", partForm.brand);
      data.append("model", partForm.model);
      data.append("min_balance", partForm.min_balance);
      data.append("photo", imageFile ? imageFile : capturedPhoto);
      var response = await api.post("/parts-create", data);
      if (response.status === 200 && response.data) {
        setPartErrors({
          title: "",
          unit: "",
          type: "",
        });
        setPartForm({
          title: "",
          unit: "",
          type: "",
          brand: "",
          model: "",
          min_balance: 5,
        });
        props.setPartModal(false);
        props.setCallParts(true);
        setTimeout(() => {
          props.setCallParts(false);
        }, 500); // 500 milliseconds delay
        swal({
          title: "Part Added Success",
          icon: "success",
        });
      } else {
        setPartErrors(response.data.errors);
      }
    }
  };
  useEffect(async () => {
    getUnits();
  }, []);

  return (
    <Modal size="lg" show={props.partModal} onHide={closePartModal}>
      <Modal.Header closeButton>
        <Modal.Title>Add Part</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-lg-12">
            <div className="form-group">
              <label>Part Title</label>
              <input
                value={partForm.title}
                onChange={partChange}
                name="title"
                type="text"
                className="form-control"
                style={{ textTransform: "uppercase" }}
              />
              {partErrors.title && (
                <div className="errorMsg">{partErrors.title}</div>
              )}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="form-group">
              <label>Part Unit</label>
              <select
                name="unit"
                value={partForm.unit}
                onChange={partChange}
                className="form-select"
              >
                <option value="">Select unit</option>
                {units.length > 0 ? (
                  units.map((unit, index) => (
                    <option key={index} value={unit.title}>
                      {unit.title}
                    </option>
                  ))
                ) : (
                  <option value="">No unit found</option>
                )}
              </select>
              {partErrors.unit && (
                <div className="errorMsg">{partErrors.unit}</div>
              )}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="form-group">
              <label>Part Type</label>
              <select
                name="type"
                value={partForm.type}
                onChange={partChange}
                className="form-select"
              >
                <option value="Stationery">Stationery</option>
                <option value="Spare Parts">Spare Parts</option>
                <option value="Electrical">Electrical</option>
                <option value="Needle">Needle</option>
                <option value="Medical">Medical</option>
                <option value="Fire">Fire</option>
                <option value="Compressor & boiler">Compressor & boiler</option>
                <option value="Chemical">Chemical</option>
                <option value="Printing">Printing</option>
                <option value="It">It</option>
                <option value="WTP">WTP</option><option value="Vehicle">Vehicle</option>
              </select>
              {partErrors.type && (
                <div className="errorMsg">{partErrors.type}</div>
              )}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="form-group">
              <label>Minimum Balance</label>
              <input
                value={partForm.min_balance}
                onChange={partChange}
                name="min_balance"
                type="number"
                min={1}
                className="form-control"
              />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="form-group">
              <label>Brand</label>
              <input
                value={partForm.brand}
                onChange={partChange}
                name="brand"
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="form-group">
              <label>Model</label>
              <input
                value={partForm.model}
                onChange={partChange}
                name="model"
                type="text"
                className="form-control"
              />
            </div>
          </div>
        </div>

        <div className="row align-items-center">
          <div className="col-lg-5">
            <br />
            <div className="form-group text-center">
              <label className="btn btn-success" for="fileInput">
                Upload From Device
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
            {partErrors.photo && (
              <>
                <div className="errorMsg">{partErrors.photo}</div>
              </>
            )}
            <hr />
          </div>
          <div className="col-lg-5">
            <br />
            <CameraFileInput onFileChange={handleCapturePhoto} />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="default" onClick={closePartModal}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submitPart}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
