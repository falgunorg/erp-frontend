import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logos/logo-short.png";
import { Modal, Button, Spinner } from "react-bootstrap";
import MultipleFileInput from "./MultipleFileInput";
import MultipleFileView from "./MultipleFileView";
import api from "services/api";
import swal from "sweetalert";
import CustomSelect from "elements/CustomSelect";
import { ArrowRightIcon, ArrowDownIcon } from "../../elements/SvgIcons";
import { useHistory, useParams } from "react-router-dom";

export default function EditTechnicalPackage({
  renderArea,
  setRenderArea,
  toggleTechpackExpanded,
}) {
  const history = useHistory();
  const params = useParams();
  const [techpack, setTechpack] = useState({});
  const getTechpack = async () => {
    setSpinner(true);
    const response = await api.post("/merchandising/technical-packages-show", {
      id: params.id,
    });
    if (response.status === 200 && response.data) {
      const techpackData = response.data;
      setTechpack(techpackData);
    }
    setSpinner(false);
  };
  useEffect(() => {
    getTechpack();
  }, [params.id]);

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

  console.log("TP_ITEMS", Object.values(consumptionItems).flat());

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

    if (validateForm()) {
      const data = new FormData();

      // Helper to safely append values
      const appendIfValid = (key, value) => {
        if (value !== null && value !== undefined && value !== "") {
          data.append(key, value);
        } else {
          data.append(key, ""); // Laravel handles empty string as null
        }
      };

      // ID for update
      appendIfValid("id", techpack.id);

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

      // Special operations - stringify if array
      data.append(
        "special_operation",
        JSON.stringify(formDataSet.special_operations)
      );

      // Techpack item list
      data.append("tp_items", JSON.stringify(tp_items));

      // Optional file uploads
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
        "/merchandising/technical-packages-update",
        data
      );

      if (response.status === 200 && response.data) {
        history.push("/technical-packages/" + response.data.techpack.id);
        setRenderArea("details");
        window.location.reload();
      } else {
        setErrors(response.data.errors);
      }

      setSpinner(false);
    }
  };

  useEffect(() => {
    if (techpack) {
      const {
        po_id,
        wo_id,
        received_date,
        techpack_number,
        buyer_id,
        buyer_style_name,
        brand,
        item_name,
        season,
        item_type,
        department,
        description,
        company_id,
        wash_details,
        special_operation,
        materials,
      } = techpack;

      let specialOps = [];
      try {
        specialOps = JSON.parse(special_operation || "[]"); // ✅ correct way
      } catch (err) {
        console.error("Failed to parse special_operation:", err);
        specialOps = [];
      }

      setFormDataSet({
        po_id,
        wo_id,
        received_date,
        techpack_number,
        buyer_id,
        buyer_style_name,
        brand,
        item_name,
        season,
        item_type,
        department,
        description,
        company_id,
        wash_details,
        special_operations: specialOps, // ✅ now clean array like ["Printing", "Dying"]
      });
    }
  }, [techpack]);

  useEffect(() => {
    if (Array.isArray(techpack?.materials) && techpack.materials.length > 0) {
      const groupedByType = {};

      techpack.materials.forEach((mat) => {
        const item = {
          item_type_id: mat.item_type_id,
          item_id: mat.item_id,
          item_name: mat.item_name || "",
          item_details: mat.item_details || "",
          color: mat.color || "",
          size: mat.size || "",
          position: mat.position || "",
          unit: mat.unit || "",
          consumption: parseFloat(mat.consumption) || 0,
          wastage: parseFloat(mat.wastage) || 0,
          total: parseFloat(mat.total) || 0,
        };

        if (!groupedByType[mat.item_type_id]) {
          groupedByType[mat.item_type_id] = [];
        }

        groupedByType[mat.item_type_id].push(item);
      });

      setConsumptionItems(groupedByType);
    }
  }, [techpack?.materials]);

  useEffect(() => {
    const expanded = {};
    materialTypes.forEach((type) => {
      expanded[type.id] = false;
    });
    setCollapsedMaterialTypes(expanded);
  }, [materialTypes]);

  const techpackFiles = Array.isArray(techpack?.files) ? techpack.files : [];

  const existingTechpackFiles = techpackFiles.filter(
    (file) => file.file_type === "technical_package"
  );

  const existingSpecSheetFiles = techpackFiles.filter(
    (file) => file.file_type === "spec_sheet"
  );

  const existingBlockPatternFiles = techpackFiles.filter(
    (file) => file.file_type === "block_pattern"
  );

  const existingSpecialOperationFiles = techpackFiles.filter(
    (file) => file.file_type === "special_operation"
  );

  console.log("FORM DATA", formDataSet);
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
              <span className="purchase_text">Edit Tech Pack</span>
            </div>
            <div className="col-lg-2">
              <label className="form-label">PO Number</label>
            </div>
            <div className="col-lg-2">
              <CustomSelect
                className="select_wo"
                placeholder="PO"
                options={pos.map(({ id, po_number }) => ({
                  value: id,
                  label: po_number,
                }))}
                value={pos
                  .map(({ id, po_number }) => ({
                    value: id,
                    label: po_number,
                  }))
                  .find((option) => option.value === formDataSet.po_id)}
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
                className="select_wo"
                placeholder="PO"
                options={workOrders.map(({ id, wo_number }) => ({
                  value: id,
                  label: wo_number,
                }))}
                value={workOrders
                  .map(({ id, wo_number }) => ({
                    value: id,
                    label: wo_number,
                  }))
                  .find((option) => option.value === formDataSet.wo_id)}
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
            Update{" "}
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
                options={buyers.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
                value={buyers
                  .map(({ id, title }) => ({
                    value: id,
                    label: title,
                  }))
                  .find((option) => option.value === formDataSet.buyer_id)}
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
                value={brands
                  .map(({ title }) => ({
                    value: title,
                    label: title,
                  }))
                  .find((option) => option.value === formDataSet.brand)}
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
                options={seasons.map(({ id, title }) => ({
                  value: title,
                  label: title,
                }))}
                value={seasons
                  .map(({ title }) => ({
                    value: title,
                    label: title,
                  }))
                  .find((option) => option.value === formDataSet.season)}
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
                value={itemTypes
                  .map(({ title }) => ({
                    value: title,
                    label: title,
                  }))
                  .find((option) => option.value === formDataSet.item_type)}
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
                value={departments
                  .map(({ title }) => ({
                    value: title,
                    label: title,
                  }))
                  .find((option) => option.value === formDataSet.department)}
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
                value={companies
                  .map(({ id, title }) => ({
                    value: id,
                    label: title,
                  }))
                  .find((option) => option.value === formDataSet.company_id)}
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
                value={washes
                  .map(({ id, title }) => ({
                    value: title,
                    label: title,
                  }))
                  .find((option) => option.value === formDataSet.wash_details)}
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
                value={
                  formDataSet.special_operations?.map((op) =>
                    specialOperations
                      .map(({ id, title }) => ({ value: id, label: title }))
                      .find((option) => option.label === op)
                  ) || []
                }
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
                ) : techpack?.front_photo_url ? (
                  <img src={techpack.front_photo_url} alt="Frontside Preview" />
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
                ) : techpack?.back_photo_url ? (
                  <img src={techpack.back_photo_url} alt="Backside Preview" />
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
        {existingTechpackFiles?.length > 0 && (
          <MultipleFileView
            filled={true}
            label="Existing Tech Pack Files"
            inputId="buyer_techpacks"
            selectedFiles={existingTechpackFiles}
          />
        )}

        <MultipleFileInput
          label="Buyer Tech Pack Attachment"
          inputId="technical_package"
          selectedFiles={selectedTechpackFiles}
          setSelectedFiles={setSelectedTechpackFiles}
        />
        <hr />
        {existingSpecSheetFiles?.length > 0 && (
          <MultipleFileView
            filled={true}
            label="Existing Spec Sheet Files"
            inputId="spec_sheet"
            selectedFiles={existingSpecSheetFiles}
          />
        )}

        <MultipleFileInput
          label="Spec Sheet Attachment"
          inputId="spec_sheet"
          selectedFiles={selectedSpecSheetFiles}
          setSelectedFiles={setSelectedSpecSheetFiles}
        />
        <hr />
        {existingBlockPatternFiles?.length > 0 && (
          <MultipleFileView
            filled={true}
            label="Existing Block Pattern Files"
            inputId="block_pattern"
            selectedFiles={existingBlockPatternFiles}
          />
        )}
        <MultipleFileInput
          label="Block Pattern Attachment"
          inputId="block_pattern"
          selectedFiles={selectedBlockPatternFiles}
          setSelectedFiles={setSelectedBlockPatternFiles}
        />
        <hr />
        {existingSpecialOperationFiles?.length > 0 && (
          <MultipleFileView
            filled={true}
            label="Existing Special Operation Files"
            inputId="special_operation"
            selectedFiles={existingSpecialOperationFiles}
          />
        )}
        <MultipleFileInput
          label="Special Operation Attachment"
          inputId="special_operation"
          selectedFiles={selectedSpecialOperationFiles}
          setSelectedFiles={setSelectedSpecialOperationFiles}
        />
      </div>
      <br />

      <div className="create_tp_materials_area create_tp_body">
        <h6>Material Descriptions</h6>
        <div className="table-responsive">
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
                            <CustomSelect
                              style={{ width: "100px" }}
                              className="select_wo"
                              placeholder="Item"
                              options={items
                                .filter(
                                  (it) => it.item_type_id === materialType.id
                                )
                                .map(({ id, title }) => ({
                                  value: id,
                                  label: title,
                                }))}
                              value={items
                                .filter(
                                  (it) => it.item_type_id === materialType.id
                                )
                                .map(({ id, title }) => ({
                                  value: id,
                                  label: title,
                                }))
                                .find(
                                  (option) =>
                                    option.value ===
                                    (consumptionItems[materialType.id]?.[index]
                                      ?.item_id || null)
                                )}
                              onChange={(selectedOption) =>
                                handleItemChange(
                                  materialType.id,
                                  index,
                                  "item_id",
                                  selectedOption?.value
                                )
                              }
                            />
                          </td>

                          <td>
                            <input
                              type="text"
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

                          <td className="d-flex align-items-center">
                            <input
                              style={{ width: "70px" }}
                              type="text"
                              min="0"
                              readOnly
                              value={item.total}
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
