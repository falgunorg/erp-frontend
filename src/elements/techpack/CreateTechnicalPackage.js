import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logos/logo-short.png";
import Select, { components } from "react-select";
import { Modal, Button, Spinner } from "react-bootstrap";
import MultipleFileInput from "./MultipleFileInput";
import api from "services/api";
import swal from "sweetalert";

import { ArrowRightIcon, ArrowDownIcon } from "../../elements/SvgIcons";

export default function CreateTechnicalPackage(props) {
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="9"
          height="7"
          viewBox="0 0 9 7"
        >
          <path
            id="Polygon_60"
            data-name="Polygon 60"
            d="M3.659,1.308a1,1,0,0,1,1.682,0L8.01,5.459A1,1,0,0,1,7.168,7H1.832A1,1,0,0,1,.99,5.459Z"
            transform="translate(9 7) rotate(180)"
            fill="#707070"
          />
        </svg>
      </components.DropdownIndicator>
    );
  };
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "none",
      border: "none",
      minHeight: "21px",
      fontSize: "12px",
      height: "21px",
      background: "#ECECEC",
      lineHeight: "19px",
      boxShadow: "inset 0px 0px 6px rgba(0, 0, 0, 0.18)",
      boxShadow: state.isFocused ? "" : "",
    }),

    valueContainer: (provided, state) => ({
      ...provided,
      height: "21px",
      padding: "0 6px",
    }),

    input: (provided, state) => ({
      ...provided,
      margin: "0px",
      fontSize: "12px", // Ensure input text is also 12px
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),

    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: "21px",
    }),

    menu: (provided) => ({
      ...provided,
      fontSize: "12px", // Set menu font size to 12px
      padding: "3px", // Ensure padding is a maximum of 3px
    }),

    option: (provided, state) => ({
      ...provided,
      fontSize: "12px", // Ensure each option has 12px font size
      padding: "3px", // Limit option padding to 3px
      backgroundColor: state.isSelected
        ? "#ef9a3e"
        : state.isFocused
        ? "#f0f0f0"
        : "#fff",
      color: state.isSelected ? "#fff" : "#333",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#ef9a3e",
        color: "#fff",
      },
    }),
  };

  const buyers = [
    { id: 1, title: "NSLBD" },
    { id: 2, title: "WALMART" },
    { id: 3, title: "FIVE STAR LLC" },
  ];

  const brands = [
    { id: 1, title: "NEXT" },
    { id: 2, title: "GARAN" },
    { id: 3, title: "MANGO" },
  ];

  const seasons = [
    { id: 1, title: "FAL 24" },
    { id: 2, title: "SUMMER 25" },
    { id: 3, title: "SPRING 25" },
  ];

  const departments = [
    { id: 1, title: "Mens" },
    { id: 2, title: "Womens" },
    { id: 3, title: "Kids" },
  ];

  const companies = [
    { id: 1, title: "JMS" },
    { id: 2, title: "MCL" },
    { id: 3, title: "MBL" },
  ];

  const itemTypes = [
    { id: 1, title: "TOP" },
    { id: 2, title: "BOTTOM" },
    { id: 3, title: "SWIMWEAR" },
  ];

  const washes = [
    { id: 1, title: "Garment Wash" },
    { id: 2, title: "Enzyme Wash" },
    { id: 3, title: "Bleach Wash" },
    { id: 4, title: "Stone Wash" },
    { id: 5, title: "Acid Wash" },
    { id: 6, title: "Rinse Wash" },
    { id: 7, title: "Sand Wash" },
    { id: 8, title: "Silicon Wash" },
    { id: 9, title: "Moonshine Wash" },
    { id: 10, title: "Distressed Wash" },
  ];

  const specialOperations = [
    { id: 1, title: "Embroadary" },
    { id: 2, title: "Printing" },
    { id: 3, title: "Fusing" },
    { id: 4, title: "Dying" },
  ];
  //image uploading area
  const [frontImageFile, setFrontImageFile] = useState(null);
  const [backImageFile, setBackImageFile] = useState(null);
  const [frontImagePreviewUrl, setFrontImagePreviewUrl] = useState(null);
  const [backImagePreviewUrl, setBackImagePreviewUrl] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [imageModal, setImageModal] = useState(false);

  // Handle Front Image Change
  const handleFrontImageChange = (event) => {
    const file = event.target.files[0];
    setFrontImageFile(file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFrontImagePreviewUrl(imageUrl);
    }
  };

  // Handle Back Image Change
  const handleBackImageChange = (event) => {
    const file = event.target.files[0];
    setBackImageFile(file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBackImagePreviewUrl(imageUrl);
    }
  };

  // Remove Front Image Preview
  const removeFrontImagePreviewUrl = () => {
    setFrontImagePreviewUrl(null);
    setFrontImageFile(null);
    document.getElementById("front_image").value = ""; // Reset input value
  };

  // Remove Back Image Preview
  const removeBackImagePreviewUrl = () => {
    setBackImagePreviewUrl(null);
    setBackImageFile(null);
    document.getElementById("back_image").value = ""; // Reset input value
  };

  // Open Image Modal
  const openImageModal = (previewUrl) => {
    setFullScreenImage(previewUrl);
    setImageModal(true);
  };

  // Close Image Modal
  const closeImageModal = () => {
    setFullScreenImage(null);
    setImageModal(false);
  };

  const [selectedTechpackFiles, setSelectedTechpackFiles] = useState([]);
  const [selectedSpecSheetFiles, setSelectedSpecSheetFiles] = useState([]);
  const [selectedBlockPatternFiles, setSelectedBlockPatternFiles] = useState(
    []
  );

  const [selectedSpecialOperationFiles, setSelectedSpecialOperationFiles] =
    useState([]);

  const allFiles = [
    ...selectedTechpackFiles,
    ...selectedSpecSheetFiles,
    ...selectedBlockPatternFiles,
    ...selectedSpecialOperationFiles,
  ];
  ///added

  const [spinner, setSpinner] = useState(false);
  const [materialTypes, setMaterialTypes] = useState([]);
  const getMaterialTypes = async () => {
    setSpinner(true);
    var response = await api.post("/item-types");
    if (response.status === 200 && response.data) {
      setMaterialTypes(response.data.data);
    }
    setSpinner(false);
  };

  const [items, setItems] = useState([]);
  const getItems = async () => {
    setSpinner(true);
    var response = await api.post("/items");
    if (response.status === 200 && response.data) {
      setItems(response.data.data);
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

  useEffect(() => {
    getItems();
    getSizes();
    getColors();
    getUnits();
    getMaterialTypes();
  }, []);

  const [collapsedMaterialTypes, setCollapsedMaterialTypes] = useState({}); // Track collapsed state

  const toggleMaterialType = (materialTypeId) => {
    setCollapsedMaterialTypes((prev) => ({
      ...prev,
      [materialTypeId]: !prev[materialTypeId], // Toggle collapse state
    }));
  };

  const [consumptionItems, setConsumptionItems] = useState({});

  // Function to remove row
  const removeRow = (materialTypeId, index) => {
    setConsumptionItems((prevItems) => {
      const updatedMaterialTypeItems = [...(prevItems[materialTypeId] || [])];
      updatedMaterialTypeItems.splice(index, 1);
      return { ...prevItems, [materialTypeId]: updatedMaterialTypeItems };
    });
  };

  // Function to add a row within the respective materialType
  const addRow = (materialTypeId) => {
    const newItem = {
      item_type_id: materialTypeId,
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

    setConsumptionItems((prevItems) => ({
      ...prevItems,
      [materialTypeId]: [...(prevItems[materialTypeId] || []), newItem],
    }));
  };

  // Function to handle changes in an item
  const handleItemChange = (materialTypeId, index, field, value) => {
    setConsumptionItems((prevItems) => {
      const updatedMaterialTypeItems = [...(prevItems[materialTypeId] || [])];
      updatedMaterialTypeItems[index] = {
        ...updatedMaterialTypeItems[index],
        [field]: value,
      };

      // Auto-calculate values
      if (field === "actual" || field === "wastage_parcentage") {
        const actual =
          parseFloat(updatedMaterialTypeItems[index]["actual"]) || 0;
        const wastagePercentage =
          parseFloat(updatedMaterialTypeItems[index]["wastage_parcentage"]) ||
          0;
        updatedMaterialTypeItems[index]["cons_total"] =
          actual + (actual * wastagePercentage) / 100;
      }

      if (field === "cons_total" || field === "unit_price") {
        const consTotal =
          parseFloat(updatedMaterialTypeItems[index]["cons_total"]) || 0;
        const unitPrice =
          parseFloat(updatedMaterialTypeItems[index]["unit_price"]) || 0;
        updatedMaterialTypeItems[index]["total"] = consTotal * unitPrice;
      }

      return { ...prevItems, [materialTypeId]: updatedMaterialTypeItems };
    });
  };

  const [formDataSet, setFormDataSet] = useState({
    po_id: "",
    wo_id: "",
    received_date: "",
    techpack_number: "",
    buyer_id: "",
    buyer_style_name: "",
    brand: "",
    item_name: "",
    season: "",
    item_type: "",
    department: "",
    description: "",
    company_id: "",
    wash_details: "",
    special_operations: [],
  });

  const handleInputChange = (name, value) => {
    setFormDataSet((prevDataSet) => ({
      ...prevDataSet,
      [name]: value,
    }));
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};

    if (!formDataSet.received_date) {
      formErrors.received_date = "Received date is required";
    }
    if (!formDataSet.techpack_number) {
      formErrors.techpack_number = "Techpack Number is required";
    }
    if (!formDataSet.buyer_id) {
      formErrors.buyer_id = "Buyer is required";
    }
    if (!formDataSet.buyer_style_name) {
      formErrors.buyer_style_name = "Buyer style name is required";
    }

    if (!formDataSet.brand) {
      formErrors.brand = "Brand is required";
    }
    if (!formDataSet.item_name) {
      formErrors.item_name = "Item name is required";
    }
    if (!formDataSet.season) {
      formErrors.season = "Season is required";
    }
    if (!formDataSet.item_type) {
      formErrors.item_type = "Item type is required";
    }

    if (!formDataSet.department) {
      formErrors.department = "Department is required";
    }
    if (!formDataSet.company_id) {
      formErrors.company_id = "Company is required";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  console.log("ALL FILES", allFiles);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const tp_items = Object.values(consumptionItems).flat();
    if (tp_items.length === 0) {
      swal({
        title: "Please Select Materials",
        icon: "error",
      });
      return; // Prevent form submission
    }

    if (frontImageFile === null) {
      swal({
        title: "Please Select Front Part Image",
        icon: "error",
      });
      return; // Prevent form submission
    }

    if (backImageFile === null) {
      swal({
        title: "Please Select Back Part Image",
        icon: "error",
      });
      return; // Prevent form submission
    }

    if (validateForm()) {
      var data = new FormData();
      data.append("po_id", formDataSet.po_id);
      data.append("wo_id", formDataSet.wo_id);
      data.append("received_date", formDataSet.received_date);
      data.append("techpack_number", formDataSet.techpack_number);
      data.append("buyer_id", formDataSet.buyer_id);
      data.append("buyer_style_name", formDataSet.buyer_style_name);
      data.append("brand", formDataSet.brand);
      data.append("item_name", formDataSet.item_name);
      data.append("season", formDataSet.season);
      data.append("item_type", formDataSet.item_type);
      data.append("department", formDataSet.department);
      data.append("description", formDataSet.description);
      data.append("company_id", formDataSet.company_id);
      data.append("wash_details", formDataSet.wash_details);
      data.append("special_operation", formDataSet.special_operations);
      data.append("tp_items", JSON.stringify(tp_items));

      data.append("front_photo", frontImageFile);
      data.append("back_photo", backImageFile);
      allFiles.forEach((file) => {
        data.append("attatchments[]", file); // real file
        data.append("file_types[]", file.file_type); // custom property
      });

      setSpinner(true);
      var response = await api.post("/technical-package-create", data);
      if (response.status === 200 && response.data) {
        alert("Successfully Added");
      } else {
        setErrors(response.data.errors);
      }
      setSpinner(false);
    }
  };

  return (
    <div className="create_technical_pack">
      <div className="row create_tp_header align-items-center">
        <div className="col-lg-10">
          <div className="row align-items-baseline">
            <div className="col-lg-4">
              <img
                style={{ width: "30px", marginRight: "8px" }}
                src={Logo}
                alt="Logo"
              />
              <span className="purchase_text">Tech Pack</span>
            </div>
            <div className="col-lg-2">
              <label className="form-label">PO Number</label>
            </div>
            <div className="col-lg-2">
              <input
                type="text"
                name="po_id"
                value={formDataSet.po_id}
                onChange={(e) => handleInputChange("po_id", e.target.value)}
              />
            </div>

            <div className="col-lg-2">
              <label className="form-label">WO Number</label>
            </div>
            <div className="col-lg-2">
              <input
                name="wo_id"
                value={formDataSet.wo_id}
                onChange={(e) => handleInputChange("wo_id", e.target.value)}
                type="text"
              />
            </div>
          </div>
        </div>
        <div className="col-lg-2">
          <button
            onClick={handleSubmit}
            className="btn btn-default submit_button"
          >
            {" "}
            Submit{" "}
          </button>
        </div>
      </div>
      <br />
      <div className="row create_tp_body">
        <div className="col-lg-10">
          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Received Date</label>
            </div>
            <div className="col-lg-3">
              <input
                name="received_date"
                value={formDataSet.received_date}
                onChange={(e) =>
                  handleInputChange("received_date", e.target.value)
                }
                type="date"
              />
              {errors.received_date && (
                <small className="form-label text-danger">
                  {errors.received_date}
                </small>
              )}
            </div>
            <div className="col-lg-2">
              <label className="form-label">Tech Pack#</label>
            </div>
            <div className="col-lg-5">
              <input
                name="techpack_number"
                value={formDataSet.techpack_number}
                onChange={(e) =>
                  handleInputChange("techpack_number", e.target.value)
                }
                type="text"
                placeholder="Tech Pack Number"
              />
              {errors.techpack_number && (
                <small className="form-label text-danger">
                  {errors.techpack_number}
                </small>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Buyer</label>
            </div>
            <div className="col-lg-3">
              <Select
                className="select_wo"
                placeholder="Buyer"
                options={buyers.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
                styles={customStyles}
                components={{ DropdownIndicator }}
                onChange={(selectedOption) =>
                  handleInputChange("buyer_id", selectedOption.value)
                }
                name="buyer_id"
              />
              {errors.buyer_id && (
                <small className="form-label text-danger">
                  {errors.buyer_id}
                </small>
              )}
            </div>
            <div className="col-lg-2">
              <label className="form-label">Buyer Style Name</label>
            </div>
            <div className="col-lg-5">
              <input
                name="buyer_style_name"
                value={formDataSet.buyer_style_name}
                onChange={(e) =>
                  handleInputChange("buyer_style_name", e.target.value)
                }
                type="text"
                placeholder="Buyer Style Name"
              />

              {errors.buyer_style_name && (
                <small className="form-label text-danger">
                  {errors.buyer_style_name}
                </small>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Brand</label>
            </div>
            <div className="col-lg-3">
              <Select
                className="select_wo"
                placeholder="Brand"
                options={brands.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
                styles={customStyles}
                components={{ DropdownIndicator }}
                onChange={(selectedOption) =>
                  handleInputChange("brand", selectedOption.value)
                }
                name="brand"
              />

              {errors.brand && (
                <small className="form-label text-danger">{errors.brand}</small>
              )}
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Name</label>
            </div>
            <div className="col-lg-5">
              <input
                name="item_name"
                value={formDataSet.item_name}
                onChange={(e) => handleInputChange("item_name", e.target.value)}
                type="text"
                placeholder="Item Name"
              />
              {errors.item_name && (
                <small className="form-label text-danger">
                  {errors.item_name}
                </small>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Season</label>
            </div>
            <div className="col-lg-3">
              <Select
                className="select_wo"
                placeholder="Season"
                options={seasons.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
                styles={customStyles}
                components={{ DropdownIndicator }}
                onChange={(selectedOption) =>
                  handleInputChange("season", selectedOption.value)
                }
                name="season"
              />
              {errors.season && (
                <small className="form-label text-danger">
                  {errors.season}
                </small>
              )}
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Type</label>
            </div>
            <div className="col-lg-5">
              <Select
                className="select_wo"
                placeholder="Type"
                options={itemTypes.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
                styles={customStyles}
                components={{ DropdownIndicator }}
                onChange={(selectedOption) =>
                  handleInputChange("item_type", selectedOption.value)
                }
                name="item_type"
              />
              {errors.item_type && (
                <small className="form-label text-danger">
                  {errors.item_type}
                </small>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Department</label>
            </div>
            <div className="col-lg-3">
              <Select
                className="select_wo"
                placeholder="Department"
                options={departments.map(({ id, title }) => ({
                  value: title,
                  label: title,
                }))}
                styles={customStyles}
                components={{ DropdownIndicator }}
                onChange={(selectedOption) =>
                  handleInputChange("department", selectedOption.value)
                }
                name="department"
              />

              {errors.department && (
                <small className="form-label text-danger">
                  {errors.department}
                </small>
              )}
            </div>
            <div className="col-lg-2">
              <label className="form-label">Description</label>
            </div>
            <div className="col-lg-5">
              <input
                type="text"
                placeholder="97% Cotton 3% Elastane Ps Chino Trouser"
                name="description"
                value={formDataSet.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
              {errors.description && (
                <small className="form-label text-danger">
                  {errors.description}
                </small>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Factory</label>
            </div>
            <div className="col-lg-3">
              <Select
                className="select_wo"
                placeholder="Factory"
                options={companies.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
                styles={customStyles}
                components={{ DropdownIndicator }}
                onChange={(selectedOption) =>
                  handleInputChange("company_id", selectedOption.value)
                }
                name="company_id"
              />
              {errors.company_id && (
                <small className="form-label text-danger">
                  {errors.company_id}
                </small>
              )}
            </div>
            <div className="col-lg-2">
              <label className="form-label">Wash Detail</label>
            </div>
            <div className="col-lg-5">
              <Select
                className="select_wo"
                placeholder="Wash Detail"
                options={washes.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
                styles={customStyles}
                components={{ DropdownIndicator }}
                onChange={(selectedOption) =>
                  handleInputChange("wash_details", selectedOption.value)
                }
                name="wash_details"
              />
              {errors.wash_details && (
                <small className="form-label text-danger">
                  {errors.wash_details}
                </small>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Special Operation</label>
            </div>
            <div className="col-lg-10">
              <Select
                isMulti
                className="select_wo"
                placeholder="Operation"
                options={specialOperations.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
                styles={customStyles}
                components={{ DropdownIndicator }}
                onChange={(selectedOptions) =>
                  handleInputChange(
                    "special_operations",
                    selectedOptions
                      ? selectedOptions.map((option) => option.label)
                      : []
                  )
                }
                name="special_operations"
              />
              {errors.special_operations && (
                <small className="form-label text-danger">
                  {errors.special_operations}
                </small>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-2">
          <div className="photo_upload_area">
            <div className="photo">
              <label htmlFor="front_image">
                {frontImagePreviewUrl ? (
                  <img src={frontImagePreviewUrl} alt="Frontside Preview" />
                ) : (
                  <p>Garment Frontside Image</p>
                )}
              </label>
              <input
                onChange={handleFrontImageChange}
                accept="image/*"
                hidden
                type="file"
                id="front_image"
              />

              {frontImagePreviewUrl ? (
                <div className="action_buttons">
                  <i
                    onClick={removeFrontImagePreviewUrl}
                    className="fa fa-trash text-danger"
                    style={{ cursor: "pointer" }}
                  ></i>
                  <i
                    onClick={() => openImageModal(frontImagePreviewUrl)}
                    class="fa fa-expand text-falgun"
                    style={{ cursor: "pointer" }}
                  ></i>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="photo">
              <label htmlFor="back_image">
                {backImagePreviewUrl ? (
                  <img src={backImagePreviewUrl} alt="Backside Preview" />
                ) : (
                  <p>Garment Backside Image</p>
                )}
              </label>
              <input
                onChange={handleBackImageChange}
                accept="image/*"
                hidden
                type="file"
                id="back_image"
              />

              {backImagePreviewUrl ? (
                <div className="action_buttons">
                  <i
                    onClick={removeBackImagePreviewUrl}
                    className="fa fa-trash text-danger"
                    style={{ cursor: "pointer" }}
                  ></i>
                  <i
                    onClick={() => openImageModal(backImagePreviewUrl)}
                    class="fa fa-expand text-falgun"
                    style={{ cursor: "pointer" }}
                  ></i>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="create_tp_attatchment">
        <MultipleFileInput
          label="Buyer Tech Pack Attachment"
          inputId="technical_package"
          selectedFiles={selectedTechpackFiles}
          setSelectedFiles={setSelectedTechpackFiles}
        />
        <MultipleFileInput
          label="Spec Sheet Attachment"
          inputId="spec_sheet"
          selectedFiles={selectedSpecSheetFiles}
          setSelectedFiles={setSelectedSpecSheetFiles}
        />
        <MultipleFileInput
          label="Block Pattern Attachment"
          inputId="block_pattern"
          selectedFiles={selectedBlockPatternFiles}
          setSelectedFiles={setSelectedBlockPatternFiles}
        />

        <MultipleFileInput
          label="Block Pattern Attachment"
          inputId="special_operation"
          selectedFiles={selectedSpecialOperationFiles}
          setSelectedFiles={setSelectedSpecialOperationFiles}
        />
      </div>

      <div className="create_tp_materials_area create_tp_body">
        <h6>Material Descriptions</h6>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Item Type</th>
              <th>Item Name</th>
              <th>Item Details</th>
              <th>Color</th>
              <th>Size</th>
              <th>Position</th>
              <th>Unit</th>
              <th>Consmp</th>
              <th>Wstg %</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {materialTypes.map((materialType) => (
              <React.Fragment key={materialType.id}>
                <tr>
                  <td
                    colSpan={10}
                    style={{
                      background: "#ECECEC",
                      cursor: "pointer",
                      height: "20px",
                    }}
                  >
                    <div
                      className="materialType"
                      style={{
                        padding: "0 5px",
                        display: "flex",
                        gap: "5px",
                        alignItems: "center",
                        fontSize: "12px",
                      }}
                    >
                      <span
                        onClick={() => toggleMaterialType(materialType.id)}
                        style={{ cursor: "pointer" }}
                      >
                        {collapsedMaterialTypes[materialType.id] ? (
                          <ArrowRightIcon />
                        ) : (
                          <ArrowDownIcon />
                        )}
                      </span>
                      <span
                        onClick={() => toggleMaterialType(materialType.id)}
                        className="me-2"
                      >
                        {materialType.title}
                      </span>
                      <span
                        onClick={() => addRow(materialType.id)}
                        style={{
                          background: "#f1a655",
                          height: "17px",
                          width: "17px",
                          borderRadius: "50%",
                          textAlign: "center",
                          lineHeight: "17px",
                          fontSize: "11px",
                          color: "white",
                        }}
                      >
                        <i className="fa fa-plus"></i>
                      </span>
                    </div>
                  </td>
                </tr>

                {/* Show items only if the materialType is expanded */}
                {!collapsedMaterialTypes[materialType.id] &&
                  (consumptionItems[materialType.id] || []).map(
                    (item, index) => (
                      <tr key={`${materialType.id}-${index}`}>
                        <td>
                          <select
                            required
                            value={item.item_id}
                            onChange={(e) =>
                              handleItemChange(
                                materialType.id,
                                index,
                                "item_id",
                                e.target.value
                              )
                            }
                            className="form-select"
                          >
                            <option value="">Select Item</option>

                            {items
                              .filter(
                                (it) => it.item_type_id === materialType.id
                              ) // Filter items based on materialType.id
                              .map((it) => (
                                <option key={it.id} value={it.id}>
                                  {it.title}
                                </option>
                              ))}
                          </select>
                        </td>

                        <td>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) =>
                              handleItemChange(
                                materialType.id,
                                index,
                                "name",
                                e.target.value
                              )
                            }
                          />
                        </td>

                        <td>
                          <textarea
                            value={item.description}
                            onChange={(e) =>
                              handleItemChange(
                                materialType.id,
                                index,
                                "description",
                                e.target.value
                              )
                            }
                          />
                        </td>

                        <td>
                          <select
                            value={item.color}
                            onChange={(e) =>
                              handleItemChange(
                                materialType.id,
                                index,
                                "color",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select</option>
                            {colors.map((it) => (
                              <option key={it.id} value={it.title}>
                                {it.title}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td>
                          <select
                            value={item.size}
                            onChange={(e) =>
                              handleItemChange(
                                materialType.id,
                                index,
                                "size",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select</option>
                            {sizes.map((it) => (
                              <option key={it.id} value={it.title}>
                                {it.title}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td>
                          <input
                            style={{ width: "80px" }}
                            type="text"
                            value={item.position}
                            onChange={(e) =>
                              handleItemChange(
                                materialType.id,
                                index,
                                "position",
                                e.target.value
                              )
                            }
                          />
                        </td>

                        <td>
                          <select
                            className="text-lowercase"
                            value={item.unit}
                            onChange={(e) =>
                              handleItemChange(
                                materialType.id,
                                index,
                                "unit",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select</option>
                            {units.map((it) => (
                              <option key={it.id} value={it.title}>
                                {it.title}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td>
                          <input
                            style={{ width: "70px" }}
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.actual}
                            onChange={(e) =>
                              handleItemChange(
                                materialType.id,
                                index,
                                "actual",
                                e.target.value
                              )
                            }
                          />
                        </td>

                        <td>
                          <input
                            style={{ width: "50px" }}
                            type="number"
                            min="0"
                            value={item.wastage_parcentage}
                            onChange={(e) =>
                              handleItemChange(
                                materialType.id,
                                index,
                                "wastage_parcentage",
                                e.target.value
                              )
                            }
                          />
                        </td>

                        <td className="d-flex align-items-center">
                          <input
                            style={{ width: "70px" }}
                            type="text"
                            min="0"
                            readOnly
                            value={item.cons_total}
                            className="me-1"
                          />
                          <i
                            style={{ cursor: "pointer" }}
                            onClick={() => removeRow(materialType.id, index)}
                            className="fa fa-times text-danger me-2"
                          ></i>
                        </td>
                      </tr>
                    )
                  )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={imageModal} onHide={closeImageModal}>
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img style={{ width: "100%" }} src={fullScreenImage} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeImageModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
