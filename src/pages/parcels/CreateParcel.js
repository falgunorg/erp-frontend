import React, { useState, useEffect, useRef } from "react";
import Spinner from "../../elements/Spinner";
import Select from "react-select";
import CameraFileInput from "../../elements/CameraFileInput";
import api from "../../services/api";
// import "quill/dist/quill.snow.css";
import "quill-better-table/dist/quill-better-table.css";
import Quill from "quill";
import QuillBetterTable from "quill-better-table";
import ImageResize from "quill-image-resize-module-react";
import { Link, useHistory } from "react-router-dom";

const CreateParcel = () => {
  Quill.register("modules/better-table", QuillBetterTable);
  Quill.register("modules/imageResize", ImageResize);
  const history = useHistory();
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

  const [companies, setCompanies] = useState([]);
  const getCompanies = async () => {
    setSpinner(true);
    var response = await api.post("/companies", { type: "Own" });
    if (response.status === 200 && response.data) {
      setCompanies(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const [employees, setEmployees] = useState([]);
  const getEmployees = async (company_id) => {
    setSpinner(true);
    var response = await api.post("/employees", {
      company_id: company_id,
      without_me: true,
    });
    if (response.status === 200 && response.data) {
      setEmployees(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const itemTypes = [
    "Documents",
    "Trims & Accesories",
    "Fabric",
    "Swatch Card",
    "Furniture",
    "Cartoon",
    "Computer & Gadgets",
    "Electronics",
    "Thread",
    "RMG",
    "Sample",
    "Others",
  ];

  const deliveryMedia = [
    "Company Vehicle",
    "Purchase Team",
    "Desh Bangla",
    "DPS",
    "DHL",
    "Fedex",
    "SCS",
    "Sundarban",
    "Intelligent Express",
    "Excelsior",
    "Motherland",
    "Faradar Express",
    "SAB",
    "Aramex",
    "A&E",
    "Sears",
    "Well Group",
    "Trims Fair",
    "Avanta",
    "YKK",
    "AR Express",
    "Others",
  ];

  const [spinner, setSpinner] = useState(false);

  //DATA STATE
  const [newParcel, setNewParcel] = useState({
    title: "",
    item_type: "",
    destination: "",
    destination_person: "",
    challan_no: "",
    reference: "",
    qty: "",
    buyer_id: "",
    method: "",
  });
  const [errors, setErrors] = useState({});
  const [isDestinationSelected, setIsDestinationSelected] = useState(false);
  const handleChange = (name, value) => {
    if (name === "destination") {
      getEmployees(value);
      setIsDestinationSelected(true); // Set destination as selected
      setNewParcel((prevParcel) => ({
        ...prevParcel,
        destination: value,
        destination_person: "",
      }));
    } else {
      setNewParcel((prevParcel) => ({
        ...prevParcel,
        [name]: value,
      }));
    }
  };

  //FORM VALIDATION

  const validateForm = () => {
    let newErrors = {};
    if (!newParcel.item_type) {
      newErrors.item_type = "Please Select Item Type";
    }

    if (!newParcel.title) {
      newErrors.title = "Please Enter Title";
    }
    if (!newParcel.qty) {
      newErrors.qty = "Please Enter QTY";
    }
    if (!newParcel.destination) {
      newErrors.destination = "Please Select Destination";
    }
    if (!newParcel.destination_person) {
      newErrors.destination_person = "Please Select Receiver";
    }
    // if (!newParcel.buyer_id) {
    //   newErrors.buyer_id = "Please Select Buyer";
    // }
    if (!newParcel.method) {
      newErrors.method = "Please Select Delivery Media";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //DESCRIPTION
  const [message, setMessage] = useState("");
  const handleMsgChange = (value) => {
    setMessage(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const data = new FormData();
      data.append("item_type", newParcel.item_type);
      data.append("title", newParcel.title);
      data.append("qty", newParcel.qty);
      data.append("destination", newParcel.destination);
      data.append("destination_person", newParcel.destination_person);
      data.append("buyer", newParcel.buyer_id);
      data.append("method", newParcel.method);
      data.append("challan_no", newParcel.challan_no);
      data.append("reference", newParcel.reference);
      data.append("description", message);
      data.append("photo", imageFile ? imageFile : capturedPhoto);
      setSpinner(true);
      var response = await api.post("/parcels-create", data);
      if (response.status === 200 && response.data) {
        setNewParcel({
          title: "",
          item_type: "",
          destination: "",
          destination_person: "",
          challan_no: "",
          reference: "",
          qty: "",
          buyer_id: "",
          method: "",
        });
        setErrors({});
        history.push("/parcels-details/" + response.data.data.tracking_number);
      } else {
        setErrors(response.data.errors);
      }
      setSpinner(false);
    }
  };

  useEffect(async () => {
    getBuyers();
    getEmployees();
    getCompanies();
  }, []);

  const editorRef = useRef(null);
  useEffect(() => {
    const quill = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: "Start typing here...",
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline"],
          ["blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          [{ table: "insertTable" }], // Custom button for inserting a table
          ["clean"],
        ],
        imageResize: {
          parchment: Quill.import("parchment"),
          modules: ["Resize", "DisplaySize"],
        },
        "better-table": {
          operationMenu: {
            items: {
              insertColumnRight: { text: "Insert Column Right" },
              insertColumnLeft: { text: "Insert Column Left" },
              insertRowUp: { text: "Insert Row Up" },
              insertRowDown: { text: "Insert Row Down" },
              deleteColumn: { text: "Delete Column" },
              deleteRow: { text: "Delete Row" },
            },
          },
        },
      },
    });

    // Add table insertion functionality
    const toolbar = quill.getModule("toolbar");
    toolbar.addHandler("table", function () {
      quill.getModule("better-table").insertTable(3, 3);
    });
  }, []);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <form onSubmit={handleSubmit}>
        <div className="create_page_heading">
          <div className="page_name">Book A Parcel</div>
          <div className="actions">
            <button
              type="submit"
              className="publish_btn btn btn-warning bg-falgun"
            >
              <strong>Book</strong>
            </button>
            <Link to="/parcels" className="btn btn-danger rounded-circle">
              <i className="fal fa-times"></i>
            </Link>
          </div>
        </div>

        <div className="row">
          <div className="col-3">
            <div className="form-group">
              {errors.item_type ? (
                <div className="text-danger">{errors.item_type}</div>
              ) : (
                <label>Item Type *</label>
              )}
              <Select
                className={
                  errors.item_type
                    ? "border-danger margin_bottom_15"
                    : "margin_bottom_15"
                }
                placeholder="Search Or Select"
                value={
                  itemTypes.find((item) => item === newParcel.item_type)
                    ? { value: newParcel.item_type, label: newParcel.item_type }
                    : null
                }
                onChange={(selectedOption) =>
                  handleChange("item_type", selectedOption.value)
                }
                name="item_type"
                options={itemTypes.map((item) => ({
                  value: item,
                  label: item,
                }))}
              />
            </div>
          </div>
          <div className="col-6">
            <div className="form-group">
              {errors.title ? (
                <div className="text-danger">{errors.title}</div>
              ) : (
                <label>Item Name *</label>
              )}

              <input
                type="text"
                placeholder="Ex: Cherry Fabric, Payroll Documents"
                className={
                  errors.title ? "form-control border-danger" : "form-control"
                }
                name="title"
                value={newParcel.title}
                onChange={(event) => handleChange("title", event.target.value)}
              />
            </div>
          </div>
          <div className="col-3">
            <div className="form-group">
              {errors.qty ? (
                <div className="text-danger">{errors.qty}</div>
              ) : (
                <label>OTY *</label>
              )}

              <input
                className={
                  errors.qty ? "form-control border-danger" : "form-control"
                }
                placeholder="Ex: 2 Pcs, 2 Dzn"
                type="text"
                name="qty"
                value={newParcel.qty}
                onChange={(event) => handleChange("qty", event.target.value)}
              />
            </div>
          </div>
          <div className="col-4">
            <div className="form-group">
              {errors.destination ? (
                <div className="text-danger">{errors.destination}</div>
              ) : (
                <label>Destination *</label>
              )}

              <Select
                className={
                  errors.destination
                    ? "border-danger margin_bottom_15"
                    : "margin_bottom_15"
                }
                placeholder="Search Or Select"
                value={
                  companies.find((item) => item.id === newParcel.destination)
                    ? {
                        value: newParcel.destination,
                        label:
                          companies.find(
                            (item) => item.id === newParcel.destination
                          ).title || "",
                      }
                    : null
                }
                onChange={(selectedOption) =>
                  handleChange("destination", selectedOption.value)
                }
                name="destination"
                options={companies.map((item) => ({
                  value: item.id,
                  label: item.title,
                }))}
              />
            </div>
          </div>
          <div className="col-5">
            <div className="form-group">
              {errors.destination_person ? (
                <div className="text-danger">{errors.destination_person}</div>
              ) : (
                <label>Receiver *</label>
              )}

              <Select
                isDisabled={!isDestinationSelected}
                className={
                  errors.destination_person
                    ? "border-danger margin_bottom_15"
                    : "margin_bottom_15"
                }
                placeholder="Search Or Select"
                value={
                  employees.find(
                    (item) => item.id === newParcel.destination_person
                  )
                    ? {
                        value: newParcel.destination_person,
                        label: `${
                          employees.find(
                            (item) => item.id === newParcel.destination_person
                          ).full_name
                        } | ${
                          employees.find(
                            (item) => item.id === newParcel.destination_person
                          ).department_title
                        } | ${
                          employees.find(
                            (item) => item.id === newParcel.destination_person
                          ).designation_title
                        }`,
                      }
                    : null
                }
                onChange={(selectedOption) =>
                  handleChange("destination_person", selectedOption.value)
                }
                name="destination_person"
                options={employees.map((item) => ({
                  value: item.id,
                  label: `${item.full_name} | ${item.department_title} | ${item.designation_title}`,
                }))}
              />
            </div>
          </div>
          <div className="col-3">
            <div className="form-group">
              {errors.buyer_id ? (
                <div className="text-danger">{errors.buyer_id}</div>
              ) : (
                <label>Buyer (If Applicable)</label>
              )}

              <Select
                className={
                  errors.buyer_id
                    ? "border-danger margin_bottom_15"
                    : "margin_bottom_15"
                }
                placeholder="Select"
                value={
                  buyers.find((item) => item.id === newParcel.buyer_id)
                    ? {
                        value: newParcel.buyer_id,
                        label:
                          buyers.find((item) => item.id === newParcel.buyer_id)
                            .name || "",
                      }
                    : null
                }
                onChange={(selectedOption) =>
                  handleChange("buyer_id", selectedOption.value)
                }
                name="buyer_id"
                options={buyers.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
              />
            </div>
          </div>
          <div className="col-4">
            <div className="form-group">
              {errors.method ? (
                <div className="text-danger">{errors.method}</div>
              ) : (
                <label>Delivery Via/Media *</label>
              )}

              <Select
                className={
                  errors.method
                    ? "border-danger margin_bottom_15"
                    : "margin_bottom_15"
                }
                placeholder="Select"
                value={
                  deliveryMedia.find((item) => item === newParcel.method)
                    ? { value: newParcel.method, label: newParcel.method }
                    : null
                }
                onChange={(selectedOption) =>
                  handleChange("method", selectedOption.value)
                }
                name="method"
                options={deliveryMedia.map((item) => ({
                  value: item,
                  label: item,
                }))}
              />
            </div>
          </div>
          <div className="col-4">
            <div className="form-group">
              <label>Challan No</label>
              <input
                placeholder="Ex: 3456"
                type="text"
                className="form-control"
                name="challan_no"
                value={newParcel.challan_no}
                onChange={(event) =>
                  handleChange("challan_no", event.target.value)
                }
              />
            </div>
          </div>
          <div className="col-4">
            <div className="form-group">
              <label>Reference</label>
              <input
                placeholder="Ex: For Washing Purpose"
                type="text"
                className="form-control"
                name="reference"
                value={newParcel.reference}
                onChange={(event) =>
                  handleChange("reference", event.target.value)
                }
              />
            </div>
          </div>
          <div className="col-12">
            <div className="form-group">
              <label>Description</label>
              <div ref={editorRef} style={{ minHeight: "200px" }}></div>
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
            <hr />
          </div>
          <div className="col-lg-5">
            <br />
            <CameraFileInput onFileChange={handleCapturePhoto} />
          </div>
        </div>
        <br />
        <div className="text-center">
          <button
            type="submit"
            className="publish_btn btn btn-warning bg-falgun"
          >
            <strong>Book</strong>
          </button>
        </div>
        <hr />
      </form>
    </div>
  );
};

export default CreateParcel;
