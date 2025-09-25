import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logos/logo-short.png";
import { Modal, Button, Spinner } from "react-bootstrap";
import MultipleFileInput from "./MultipleFileInput";
import api from "services/api";
import swal from "sweetalert";
import CustomSelect from "elements/CustomSelect";

import { ArrowRightIcon, ArrowDownIcon } from "../../elements/SvgIcons";

import { useHistory } from "react-router-dom";

export default function CreateTechnicalPackage({
  setRenderArea,
  toggleTechpackExpanded,
}) {
  const history = useHistory();

  const [buyers, setBuyers] = useState([]);
  const getBuyers = async () => {
    var response = await api.post("/common/buyers");
    if (response.status === 200 && response.data) {
      setBuyers(response.data.data);
    } else {
      console.log(response.data);
    }
  };

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
    { id: 4, title: "School Wear" },
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
    var response = await api.post("/common/item-types");
    if (response.status === 200 && response.data) {
      setMaterialTypes(response.data.data);
    }
    setSpinner(false);
  };

  const [items, setItems] = useState([]);
  const getItems = async () => {
    setSpinner(true);
    var response = await api.post("/common/items");
    if (response.status === 200 && response.data) {
      setItems(response.data.data);
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

  const [pos, setPos] = useState([]);
  const getPos = async () => {
    const response = await api.post("/merchandising/pos-public");
    if (response.status === 200 && response.data) {
      const data = response.data.data;
      setPos(data);
    }
  };

  const [workOrders, setWorkOrders] = useState([]);
  const getWorkOrders = async () => {
    const response = await api.post("/merchandising/workorders-public");
    if (response.status === 200 && response.data) {
      const data = response.data.data;
      setWorkOrders(data);
    }
  };

  useEffect(() => {
    getItems();
    getUnits();
    getMaterialTypes();
    getPos();
    getWorkOrders();
    getBuyers();
  }, []);

  const [collapsedMaterialTypes, setCollapsedMaterialTypes] = useState({});

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
      item_name: "",
      item_details: "",
      unit: "",
      size: "",
      color: "",
      consumption: 0,
      wastage: 0,
      total: 0,
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
      if (field === "consumption" || field === "wastage") {
        const consumption =
          parseFloat(updatedMaterialTypeItems[index]["consumption"]) || 0;
        const wastagePercentage =
          parseFloat(updatedMaterialTypeItems[index]["wastage"]) || 0;
        updatedMaterialTypeItems[index]["total"] =
          consumption + (consumption * wastagePercentage) / 100;
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const tp_items = Object.values(consumptionItems).flat();

    if (tp_items.length === 0) {
      swal({
        title: "Please Select Materials",
        icon: "error",
      });
      return;
    }

    if (frontImageFile === null) {
      swal({
        title: "Please Select Front Part Image",
        icon: "error",
      });
      return;
    }

    if (backImageFile === null) {
      swal({
        title: "Please Select Back Part Image",
        icon: "error",
      });
      return;
    }

    if (validateForm()) {
      const data = new FormData();

      // Helper to safely append values
      const appendIfValid = (key, value) => {
        if (value !== null && value !== undefined && value !== "") {
          data.append(key, value);
        } else {
          data.append(key, ""); // Laravel will treat empty string as null if handled
        }
      };

      // Append form data safely
      appendIfValid("po_id", formDataSet.po_id);
      appendIfValid("wo_id", formDataSet.wo_id);
      appendIfValid("received_date", formDataSet.received_date);
      appendIfValid("techpack_number", formDataSet.techpack_number);
      appendIfValid("buyer_id", formDataSet.buyer_id);
      appendIfValid("buyer_style_name", formDataSet.buyer_style_name);
      appendIfValid("brand", formDataSet.brand);
      appendIfValid("item_name", formDataSet.item_name);
      appendIfValid("season", formDataSet.season);
      appendIfValid("item_type", formDataSet.item_type);
      appendIfValid("department", formDataSet.department);
      appendIfValid("description", formDataSet.description);
      appendIfValid("company_id", formDataSet.company_id);
      appendIfValid("wash_details", formDataSet.wash_details);

      // Special operations can be an array, stringify before appending
      data.append(
        "special_operation",
        JSON.stringify(formDataSet.special_operations)
      );

      // Techpack item list
      data.append("tp_items", JSON.stringify(tp_items));

      // File uploads
      if (frontImageFile) {
        data.append("front_photo", frontImageFile);
      }
      if (backImageFile) {
        data.append("back_photo", backImageFile);
      }

      // Attachments
      allFiles.forEach((file) => {
        data.append("attatchments[]", file); // actual file
        data.append("file_types[]", file.file_type); // custom property
      });

      setSpinner(true);
      const response = await api.post(
        "/merchandising/technical-packages-create",
        data
      );

      if (response.status === 200 && response.data) {
        history.push("/technical-packages/" + response.data.techpack.id);
        setRenderArea("details");
        window.location.reload();
      } else {
        setErrors(response.data.errors);
      }
    }
  };

  const [itemModal, setItemModal] = useState(false);
  const [itemForm, setItemForm] = useState({
    title: "",
    item_type_id: "",
    unit: "",
  });

  // ✅ Open modal and set item_type_id
  const openItemModal = (item_type_id) => {
    setItemForm((prev) => ({
      ...prev,
      item_type_id: item_type_id,
    }));
    setItemModal(true);
  };

  const [itemErrors, setItemErrors] = useState({});

  const handleSaveItem = async () => {
    let errors = {};

    // ✅ Basic validation rules
    if (!itemForm.title || itemForm.title.trim() === "") {
      errors.title = "Title is required";
    }
    if (!itemForm.unit || itemForm.unit.trim() === "") {
      errors.unit = "Unit is required";
    }
    if (!itemForm.item_type_id || itemForm.item_type_id === "") {
      errors.item_type_id = "Item type is required";
    }

    // ✅ If validation fails, stop and show errors
    if (Object.keys(errors).length > 0) {
      setItemErrors(errors);
      return;
    }

    try {
      const response = await api.post("/common/items-create", itemForm);
      if (response.status === 200 && response.data) {
        getItems();
        setItemModal(false);
        setItemForm({
          title: "",
          item_type_id: "",
          unit: "",
        });
        setItemErrors({});
      } else {
        setItemErrors(
          response.data.errors || { general: "Something went wrong" }
        );
      }
    } catch (err) {
      setItemErrors({ general: "Failed to save item. Please try again." });
    }
  };

  return (
    <div className="create_technical_pack">
      <div className="row create_tp_header align-items-center">
        <div className="col-lg-10">
          <div className="row align-items-baseline">
            <div className="col-lg-4">
              <i
                onClick={toggleTechpackExpanded}
                style={{
                  fontSize: "25px",
                  marginRight: "15px",
                  cursor: "pointer",
                }}
                className="fa fa-angle-left"
              ></i>
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
              <CustomSelect
                isDisabled
                className="select_wo"
                placeholder="PO"
                options={pos.map(({ id, po_number }) => ({
                  value: id,
                  label: po_number,
                }))}
                onChange={(selectedOption) =>
                  handleInputChange("po_id", selectedOption.value)
                }
                name="po_id"
              />
            </div>

            <div className="col-lg-2">
              <label className="form-label">WO Number</label>
            </div>
            <div className="col-lg-2">
              <CustomSelect
                isDisabled
                className="select_wo"
                placeholder="WO"
                options={workOrders.map(({ id, wo_number }) => ({
                  value: id,
                  label: wo_number,
                }))}
                onChange={(selectedOption) =>
                  handleInputChange("wo_id", selectedOption.value)
                }
                name="wo_id"
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
              <CustomSelect
                className="select_wo"
                placeholder="Buyer"
                options={buyers.map(({ id, name }) => ({
                  value: id,
                  label: name,
                }))}
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
              <CustomSelect
                className="select_wo"
                placeholder="Brand"
                options={brands.map(({ id, title }) => ({
                  value: title,
                  label: title,
                }))}
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
              <CustomSelect
                className="select_wo"
                placeholder="Season"
                options={seasons.map(({ title }) => ({
                  value: title,
                  label: title,
                }))}
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
              <CustomSelect
                className="select_wo"
                placeholder="Type"
                options={itemTypes.map(({ id, title }) => ({
                  value: title,
                  label: title,
                }))}
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
              <CustomSelect
                className="select_wo"
                placeholder="Department"
                options={departments.map(({ id, title }) => ({
                  value: title,
                  label: title,
                }))}
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
              <CustomSelect
                className="select_wo"
                placeholder="Factory"
                options={companies.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
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
              <CustomSelect
                className="select_wo"
                placeholder="Wash Detail"
                options={washes.map(({ id, title }) => ({
                  value: title,
                  label: title,
                }))}
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
              <CustomSelect
                isMulti
                className="select_wo"
                placeholder="Operation"
                options={specialOperations.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
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
          label="Special Operation Attachment"
          inputId="special_operation"
          selectedFiles={selectedSpecialOperationFiles}
          setSelectedFiles={setSelectedSpecialOperationFiles}
        />
      </div>

      <div className="create_tp_materials_area create_tp_body">
        <h6>Material Descriptions</h6>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Item Type</th>
                <th>Item Name</th>
                <th>Item Details</th>
                <th>Color/Shade/Pantom</th>
                <th>Size/Width/Dimension</th>
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
                          <td className="d-flex">
                            <CustomSelect
                              className="select_wo"
                              placeholder="Select Item"
                              options={items
                                .filter(
                                  (it) => it.item_type_id === materialType.id
                                )
                                .map(({ id, title }) => ({
                                  value: id,
                                  label: title,
                                }))}
                              value={(() => {
                                const selectedId = item.item_id;
                                return (
                                  items
                                    .filter(
                                      (it) =>
                                        it.item_type_id === materialType.id
                                    )
                                    .map(({ id, title }) => ({
                                      value: id,
                                      label: title,
                                    }))
                                    .find((opt) => opt.value === selectedId) ||
                                  null
                                );
                              })()}
                              onChange={(selectedOption) =>
                                handleItemChange(
                                  materialType.id,
                                  index,
                                  "item_id",
                                  selectedOption?.value
                                )
                              }
                            />
                            <span
                              style={{
                                background: "green",
                                cursor: "pointer",
                                borderRadius: "0 3px 3px 0",
                                height: "21px",
                                width: "21px",
                                textAlign: "center",
                                lineHeight: "17px",
                                fontSize: "14px",
                                color: "white",
                              }}
                              onClick={() => openItemModal(materialType.id)}
                            >
                              +
                            </span>
                          </td>

                          <td>
                            <input
                              type="text"
                              style={{ minWidth: "150px" }}
                              value={item.item_name}
                              onChange={(e) =>
                                handleItemChange(
                                  materialType.id,
                                  index,
                                  "item_name",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <textarea
                              style={{ minWidth: "150px" }}
                              value={item.item_details}
                              onChange={(e) =>
                                handleItemChange(
                                  materialType.id,
                                  index,
                                  "item_details",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          <td>
                            <input
                              style={{ width: "100px" }}
                              type="text"
                              value={item.color}
                              onChange={(e) =>
                                handleItemChange(
                                  materialType.id,
                                  index,
                                  "color",
                                  e.target.value.toUpperCase()
                                )
                              }
                            />
                          </td>

                          <td>
                            <input
                              style={{ width: "100px" }}
                              type="text"
                              value={item.size}
                              onChange={(e) =>
                                handleItemChange(
                                  materialType.id,
                                  index,
                                  "size",
                                  e.target.value.toUpperCase()
                                )
                              }
                            />
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
                            <CustomSelect
                              className="select_wo"
                              placeholder="Unit"
                              options={units.map(({ title }) => ({
                                value: title,
                                label: title,
                              }))}
                              value={units
                                .map(({ title }) => ({
                                  value: title,
                                  label: title,
                                }))
                                .find((option) => option.value === item.unit)}
                              onChange={(selectedOption) =>
                                handleItemChange(
                                  materialType.id,
                                  index,
                                  "unit",
                                  selectedOption?.value
                                )
                              }
                            />
                          </td>

                          <td>
                            <input
                              style={{ width: "70px" }}
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.consumption}
                              onChange={(e) =>
                                handleItemChange(
                                  materialType.id,
                                  index,
                                  "consumption",
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
                              value={item.wastage}
                              onChange={(e) =>
                                handleItemChange(
                                  materialType.id,
                                  index,
                                  "wastage",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          <td className="">
                            <input
                              style={{ width: "70px" }}
                              type="text"
                              min="0"
                              readOnly
                              value={item.total}
                              className="me-2"
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

      <Modal show={itemModal} onHide={() => setItemModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create An Item</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="row">
            {/* Title Input */}
            <div className="col-12 mb-3">
              <label>Title (Uppercase)</label>
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="Item name"
                value={itemForm.title}
                onChange={(e) =>
                  setItemForm((prev) => ({
                    ...prev,
                    title: e.target.value.toUpperCase(), // force uppercase
                  }))
                }
              />
              {itemErrors.title && (
                <small className="text-danger">{itemErrors.title}</small>
              )}
            </div>

            {/* Unit Select */}
            <div className="col-6 mb-3">
              <label>Unit</label>
              <CustomSelect
                className="select_wo"
                placeholder="Unit"
                options={units.map(({ title }) => ({
                  value: title,
                  label: title,
                }))}
                value={units
                  .map(({ title }) => ({
                    value: title,
                    label: title,
                  }))
                  .find((option) => option.value === itemForm.unit)}
                onChange={(selectedOption) =>
                  setItemForm((prev) => ({
                    ...prev,
                    unit: selectedOption?.value || "",
                  }))
                }
              />
              {itemErrors.unit && (
                <small className="text-danger">{itemErrors.unit}</small>
              )}
            </div>

            {/* Item Type Select */}
            <div className="col-6 mb-3">
              <label>Item Type</label>
              <CustomSelect
                className="select_wo"
                placeholder="Select Item Type"
                options={materialTypes.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
                value={materialTypes
                  .map(({ id, title }) => ({
                    value: id,
                    label: title,
                  }))
                  .find((option) => option.value === itemForm.item_type_id)}
                onChange={(selectedOption) =>
                  setItemForm((prev) => ({
                    ...prev,
                    item_type_id: selectedOption?.value || "",
                  }))
                }
              />
              {itemErrors.item_type_id && (
                <small className="text-danger">{itemErrors.item_type_id}</small>
              )}
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setItemModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveItem}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
