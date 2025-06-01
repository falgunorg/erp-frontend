import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logos/logo-short.png";
import Select, { components } from "react-select";
import MultipleFileInput from "./MultipleFileInput";
import api from "services/api";
import swal from "sweetalert";

export default function CreatePurchaseOrder(props) {
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

  const season = [
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

  const techpacks = [
    { id: 1, title: "TPNXMCLX001" },
    { id: 2, title: "TPNXMCLX002" },
    { id: 3, title: "TPNXMCLX003" },
    { id: 4, title: "TPNXMCLX004" },
    { id: 5, title: "TPNXMCLX005" },
    { id: 6, title: "TPNXMCLX006" },
    { id: 7, title: "TPNXMCLX007" },
    { id: 8, title: "TPNXMCLX008" },
  ];

  const destinations = [
    { id: 1, title: "UK" },
    { id: 2, title: "USA" },
    { id: 3, title: "TURKEY" },
    { id: 4, title: "UAE" },
  ];

  const contracts = [
    { id: 1, title: "PCNXTMCLX001" },
    { id: 2, title: "PCNXTMCLX002" },
    { id: 3, title: "PCNXTMCLX003" },
    { id: 4, title: "PCNXTMCLX004" },
    { id: 5, title: "PCNXTMCLX005" },
    { id: 6, title: "PCNXTMCLX006" },
    { id: 7, title: "PCNXTMCLX007" },
    { id: 8, title: "PCNXTMCLX008" },
  ];

  const terms = [
    { id: 1, title: "FALTR001" },
    { id: 2, title: "FALTR002" },
    { id: 3, title: "FALTR003" },
    { id: 4, title: "FALTR004" },
    { id: 5, title: "FALTR005" },
    { id: 6, title: "FALTR006" },
    { id: 7, title: "FALTR007" },
    { id: 8, title: "FALTR008" },
  ];

  const packings = [
    { id: 1, title: "Dozen in Box" },
    { id: 2, title: "Dozen in Poly" },
    { id: 3, title: "Single in Poly" },
    { id: 4, title: "Single in Hanger" },
    { id: 5, title: "Pair In Poly" },
    { id: 6, title: "Other" },
  ];

  const [selectedTechpackFiles, setSelectedTechpackFiles] = useState([]);

  const [spinner, setSpinner] = useState(false);

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
    getSizes();
    getColors();
  }, []);

  const [formData, setFormData] = useState({
    po_number: "",
    wo_id: "",
    issued_date: "",
    delivery_date: "",
    purchase_contract_id: "",
    company_id: "",
    buyer_id: "",
    brand: "",
    season: "",
    description: "",
    technical_package_id: "",
    buyer_style_name: "",
    item_name: "",
    item_type: "",
    department: "",
    wash_details: "",
    destination: "",
    ship_mode: "",
    shipping_terms: "",
    packing_method: "",
    payment_terms: "",
    total_qty: "",
    total_value: "",
    special_operations: [],
  });

  const handleChange = (name, value) => {
    setFormData((prevDataSet) => ({
      ...prevDataSet,
      [name]: value,
    }));
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const formErrors = {};

    if (!formData.po_number) {
      formErrors.po_number = "Please insert a PO number.";
    }
    if (!formData.issued_date) {
      formErrors.issued_date = "Please insert the issue date.";
    }
    if (!formData.technical_package_id) {
      formErrors.technical_package_id = "Please select a technical package.";
    }
    if (!formData.destination) {
      formErrors.destination = "Please select a destination.";
    }
    if (!formData.delivery_date) {
      formErrors.delivery_date = "Delivery date is required.";
    }
    if (!formData.buyer_style_name) {
      formErrors.buyer_style_name = "Buyer style name is required.";
    }
    if (!formData.ship_mode) {
      formErrors.ship_mode = "Please select a shipping mode.";
    }
    if (!formData.purchase_contract_id) {
      formErrors.purchase_contract_id = "Please select a purchase contract.";
    }
    if (!formData.item_name) {
      formErrors.item_name = "Item name is required.";
    }
    if (!formData.shipping_terms) {
      formErrors.shipping_terms = "Please select shipping terms.";
    }
    if (!formData.company_id) {
      formErrors.company_id = "Company is required.";
    }
    if (!formData.item_type) {
      formErrors.item_type = "Item type is required.";
    }
    if (!formData.packing_method) {
      formErrors.packing_method = "Please select a packing method.";
    }
    if (!formData.buyer_id) {
      formErrors.buyer_id = "Buyer is required.";
    }
    if (!formData.department) {
      formErrors.department = "Department is required.";
    }
    if (!formData.payment_terms) {
      formErrors.payment_terms = "Please select payment terms.";
    }
    if (!formData.brand) {
      formErrors.brand = "Brand is required.";
    }
    if (!formData.season) {
      formErrors.season = "Season is required.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const [poItems, setPoItems] = useState([]);

  const handleAddItem = () => {
    setPoItems([
      ...poItems,
      {
        color: "",
        size: "",
        inseam: "",
        qty: "",
        fob: "",
        total: 0,
      },
    ]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...poItems];
    updatedItems[index][field] = value;

    // Calculate total if qty or fob changes
    if (field === "qty" || field === "fob") {
      const qty = parseFloat(updatedItems[index].qty) || 0;
      const fob = parseFloat(updatedItems[index].fob) || 0;
      updatedItems[index].total = qty * fob;
    }

    setPoItems(updatedItems);
  };

  const removeRow = (index) => {
    const updatedItems = [...poItems];
    updatedItems.splice(index, 1);
    setPoItems(updatedItems);
  };

  const totalQuantity = poItems.reduce(
    (sum, item) => sum + Number(item.qty || 0),
    0
  );
  const grandTotalFob = poItems.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (poItems.length === 0) {
      swal({
        title: "Please select items.",
        icon: "error",
      });
      return;
    }

    if (!validateForm()) return;

    try {
      const data = new FormData();

      // Append form fields
      data.append("po_number", formData.po_number);
      data.append("wo_id", formData.wo_id);
      data.append("issued_date", formData.issued_date);
      data.append("delivery_date", formData.delivery_date);
      data.append("purchase_contract_id", formData.purchase_contract_id);
      data.append("company_id", formData.company_id);
      data.append("buyer_id", formData.buyer_id);
      data.append("brand", formData.brand);
      data.append("season", formData.season);
      data.append("description", formData.description);
      data.append("technical_package_id", formData.technical_package_id);
      data.append("buyer_style_name", formData.buyer_style_name);
      data.append("item_name", formData.item_name);
      data.append("item_type", formData.item_type);
      data.append("department", formData.department);
      data.append("wash_details", formData.wash_details);
      data.append("destination", formData.destination);
      data.append("ship_mode", formData.ship_mode);
      data.append("shipping_terms", formData.shipping_terms);
      data.append("packing_method", formData.packing_method);
      data.append("payment_terms", formData.payment_terms);
      data.append("total_qty", totalQuantity);
      data.append("total_value", grandTotalFob);
      data.append("special_operations", formData.special_operations);
      data.append("po_items", JSON.stringify(poItems));

      // Append selected files
      selectedTechpackFiles.forEach((file) => {
        data.append("attachments[]", file); // Fixed typo here
      });

      setSpinner(true);

      const response = await api.post("/pos-create", data);

      if (response.status === 200 && response.data) {
        window.location.reload();
      } else {
        setErrors(response.data.errors || {});
      }
    } catch (error) {
      console.error("Form submission failed:", error);
      swal({
        title: "Submission Failed",
        text: "Something went wrong while submitting the form.",
        icon: "error",
      });
    } finally {
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
              <span className="purchase_text">PO</span>
            </div>
            <div className="col-lg-2">
              <label className="form-label">PO Number</label>
            </div>
            <div className="col-lg-2">
              <input
                value={formData.po_number}
                name="po_number"
                className={errors.po_number ? "red-border" : ""}
                onChange={(e) => handleChange("po_number", e.target.value)}
                type="text"
              />
            </div>

            <div className="col-lg-2">
              <label className="form-label">WO Number</label>
            </div>
            <div className="col-lg-2">
              <input
                className={errors.wo_id ? "red-border" : ""}
                value={formData.wo_id}
                name="wo_id"
                onChange={(e) => handleChange("wo_id", e.target.value)}
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
      <div style={{ padding: "0 15px" }} className="row create_tp_body">
        <div className="col-lg-12">
          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">PO Issue</label>
            </div>
            <div className="col-lg-2">
              <input
                className={errors.issued_date ? "red-border" : ""}
                name="issued_date"
                value={formData.issued_date}
                onChange={(e) => handleChange("issued_date", e.target.value)}
                type="date"
              />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Tech Pack</label>
            </div>
            <div className="col-lg-2">
              <Select
                className={
                  errors.technical_package_id
                    ? "select_wo red-border"
                    : "select_wo"
                }
                placeholder="Techpack"
                options={techpacks.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
                onChange={(selectedOption) =>
                  handleChange("technical_package_id", selectedOption.value)
                }
                styles={customStyles}
                components={{ DropdownIndicator }}
              />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Destination</label>
            </div>
            <div className="col-lg-2">
              <Select
                className={
                  errors.destination ? "select_wo red-border" : "select_wo"
                }
                placeholder="Destination"
                options={destinations.map(({ id, title }) => ({
                  value: title,
                  label: title,
                }))}
                onChange={(selectedOption) =>
                  handleChange("destination", selectedOption.value)
                }
                styles={customStyles}
                components={{ DropdownIndicator }}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">PO Delivery</label>
            </div>
            <div className="col-lg-2">
              <input
                name="delivery_date"
                className={errors.delivery_date ? "red-border" : ""}
                value={formData.delivery_date}
                onChange={(e) => handleChange("delivery_date", e.target.value)}
                type="date"
              />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Buyer Style Name</label>
            </div>
            <div className="col-lg-2">
              <input
                name="buyer_style_name"
                className={errors.buyer_style_name ? "red-border" : ""}
                value={formData.buyer_style_name}
                onChange={(e) =>
                  handleChange("buyer_style_name", e.target.value)
                }
                type="text"
                placeholder="Buyer Style Name"
              />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Ship Mode</label>
            </div>
            <div className="col-lg-2">
              <select
                className={errors.buyer_style_name ? "red-border" : ""}
                name="ship_mode"
                value={formData.ship_mode}
                onChange={(e) => handleChange("ship_mode", e.target.value)}
              >
                <option value="Ocean">Ocean</option>
                <option value="Air">Air</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">PC/LC</label>
            </div>
            <div className="col-lg-2">
              <Select
                className={
                  errors.purchase_contract_id
                    ? "select_wo red-border"
                    : "select_wo"
                }
                placeholder="PC/LC"
                options={contracts.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
                onChange={(selectedOption) =>
                  handleChange("purchase_contract_id", selectedOption.value)
                }
                styles={customStyles}
                components={{ DropdownIndicator }}
              />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Name</label>
            </div>
            <div className="col-lg-2">
              <input
                name="item_name"
                value={formData.item_name}
                onChange={(e) => handleChange("item_name", e.target.value)}
                type="text"
                placeholder="Buyer Style Name"
                className={errors.item_name ? "red-border" : ""}
              />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Terms of Shipping</label>
            </div>
            <div className="col-lg-2">
              <Select
                className={
                  errors.shipping_terms ? "select_wo red-border" : "select_wo"
                }
                placeholder="FCA Ctg"
                options={terms.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
                onChange={(selectedOption) =>
                  handleChange("shipping_terms", selectedOption.value)
                }
                styles={customStyles}
                components={{ DropdownIndicator }}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Factory</label>
            </div>
            <div className="col-lg-2">
              <Select
                className={
                  errors.company_id ? "select_wo red-border" : "select_wo"
                }
                placeholder="Factory"
                options={companies.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
                onChange={(selectedOption) =>
                  handleChange("company_id", selectedOption.value)
                }
                styles={customStyles}
                components={{ DropdownIndicator }}
              />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Type</label>
            </div>
            <div className="col-lg-2">
              <Select
                className={
                  errors.item_type ? "select_wo red-border" : "select_wo"
                }
                placeholder="Type"
                options={itemTypes.map(({ id, title }) => ({
                  value: title,
                  label: title,
                }))}
                onChange={(selectedOption) =>
                  handleChange("item_type", selectedOption.value)
                }
                styles={customStyles}
                components={{ DropdownIndicator }}
              />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Packing Method</label>
            </div>
            <div className="col-lg-2">
              <Select
                className={
                  errors.packing_method ? "select_wo red-border" : "select_wo"
                }
                placeholder="Packing Method"
                options={packings.map(({ id, title }) => ({
                  value: title,
                  label: title,
                }))}
                onChange={(selectedOption) =>
                  handleChange("packing_method", selectedOption.value)
                }
                styles={customStyles}
                components={{ DropdownIndicator }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Buyer</label>
            </div>
            <div className="col-lg-2">
              <Select
                className={
                  errors.buyer_id ? "select_wo red-border" : "select_wo"
                }
                placeholder="Buyer"
                options={buyers.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
                onChange={(selectedOption) =>
                  handleChange("buyer_id", selectedOption.value)
                }
                styles={customStyles}
                components={{ DropdownIndicator }}
              />
            </div>

            <div className="col-lg-2">
              <label className="form-label">Department</label>
            </div>
            <div className="col-lg-2">
              <Select
                className={
                  errors.department ? "select_wo red-border" : "select_wo"
                }
                placeholder="Department"
                options={departments.map(({ id, title }) => ({
                  value: title,
                  label: title,
                }))}
                onChange={(selectedOption) =>
                  handleChange("department", selectedOption.value)
                }
                styles={customStyles}
                components={{ DropdownIndicator }}
              />
            </div>

            <div className="col-lg-2">
              <label className="form-label">Payment Terms</label>
            </div>
            <div className="col-lg-2">
              <Select
                className={
                  errors.payment_terms ? "select_wo red-border" : "select_wo"
                }
                placeholder="Terms"
                options={terms.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
                onChange={(selectedOption) =>
                  handleChange("payment_terms", selectedOption.value)
                }
                styles={customStyles}
                components={{ DropdownIndicator }}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Brand</label>
            </div>
            <div className="col-lg-2">
              <Select
                className={errors.brand ? "select_wo red-border" : "select_wo"}
                placeholder="Brand"
                options={brands.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
                onChange={(selectedOption) =>
                  handleChange("brand", selectedOption.value)
                }
                styles={customStyles}
                components={{ DropdownIndicator }}
              />
            </div>

            <div className="col-lg-2">
              <label className="form-label">Wash Detail</label>
            </div>
            <div className="col-lg-2">
              <Select
                className={
                  errors.wash_details ? "select_wo red-border" : "select_wo"
                }
                placeholder="Wash Detail"
                options={washes.map(({ id, title }) => ({
                  value: title,
                  label: title,
                }))}
                onChange={(selectedOption) =>
                  handleChange("wash_details", selectedOption.value)
                }
                styles={customStyles}
                components={{ DropdownIndicator }}
              />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Total Quantity</label>
            </div>
            <div className="col-lg-2">
              <input
                type="number"
                readOnly
                value={totalQuantity}
                placeholder="5000"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Season</label>
            </div>
            <div className="col-lg-2">
              <Select
                className={errors.season ? "select_wo red-border" : "select_wo"}
                placeholder="Season"
                options={season.map(({ id, title }) => ({
                  value: title,
                  label: title,
                }))}
                onChange={(selectedOption) =>
                  handleChange("season", selectedOption.value)
                }
                styles={customStyles}
                components={{ DropdownIndicator }}
              />
            </div>

            <div className="col-lg-2"></div>
            <div className="col-lg-2"></div>

            <div className="col-lg-2">
              <label className="form-label">Total Value $</label>
            </div>
            <div className="col-lg-2">
              <input
                value={grandTotalFob.toFixed(2)}
                readOnly
                type="number"
                placeholder="$50000"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Description</label>
            </div>
            <div className="col-lg-10">
              <input
                value={formData.description}
                name="description"
                onChange={(e) => handleChange("description", e.target.value)}
                type="text"
                placeholder="97% Cotton 3% Elastane Ps Chino Trouser"
              />
            </div>

            <div className="col-lg-2">
              <label className="form-label">Special Operation</label>
            </div>
            <div className="col-lg-10">
              <Select
                isMulti
                className={
                  errors.special_operations
                    ? "select_wo red-border"
                    : "select_wo"
                }
                placeholder="Operation"
                options={specialOperations.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
                styles={customStyles}
                components={{ DropdownIndicator }}
                onChange={(selectedOptions) =>
                  handleChange(
                    "special_operations",
                    selectedOptions
                      ? selectedOptions.map((option) => option.label)
                      : []
                  )
                }
                name="special_operations"
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 15px" }} className="create_tp_attatchment">
        <MultipleFileInput
          label="PO Attachments"
          inputId="buyer_techpacks"
          selectedFiles={selectedTechpackFiles}
          setSelectedFiles={setSelectedTechpackFiles}
        />
      </div>
      <br />

      <div
        style={{ padding: "0 15px" }}
        className="create_tp_materials_area create_tp_body"
      >
        <div className="d-flex justify-content-between">
          <h6>PO Details</h6>
          <div
            onClick={handleAddItem}
            style={{
              background: "#f1a655",
              height: "17px",
              width: "17px",
              borderRadius: "50%",
              textAlign: "center",
              lineHeight: "17px",
              fontSize: "11px",
              color: "white",
              cursor: "pointer",
            }}
          >
            <i className="fa fa-plus"></i>
          </div>
        </div>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Color</th>
              <th>Size</th>
              <th>Inseam</th>
              <th>Quantity</th>
              <th>FOB</th>
              <th>Total FOB</th>
            </tr>
          </thead>
          <tbody>
            {poItems.map((item, index) => (
              <tr key={index}>
                <td>
                  <select
                    style={{ width: "200px" }}
                    value={item.color}
                    onChange={(e) =>
                      handleItemChange(index, "color", e.target.value)
                    }
                  >
                    <option value="">Select Color</option>
                    {colors.map((it) => (
                      <option key={it.id} value={it.title}>
                        {it.title}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    style={{ width: "150px" }}
                    value={item.size}
                    onChange={(e) =>
                      handleItemChange(index, "size", e.target.value)
                    }
                  >
                    <option value="">Select Size</option>
                    {sizes.map((it) => (
                      <option key={it.id} value={it.title}>
                        {it.title}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    value={item.inseam}
                    onChange={(e) =>
                      handleItemChange(index, "inseam", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) =>
                      handleItemChange(index, "qty", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.fob}
                    onChange={(e) =>
                      handleItemChange(index, "fob", e.target.value)
                    }
                  />
                </td>

                <td className="d-flex align-items-center">
                  <input
                    readOnly
                    type="number"
                    className="me-2"
                    value={item.total.toFixed(2)}
                  />
                  <i
                    style={{ cursor: "pointer" }}
                    onClick={() => removeRow(index)}
                    className="fa fa-times text-danger me-2"
                  ></i>
                </td>
              </tr>
            ))}
            <br />

            {/* GRAND TOTAL */}
            <tr>
              <td>
                <strong>Grand Total</strong>
              </td>
              <td></td>
              <td></td>
              <td>
                <strong>{totalQuantity}</strong>
              </td>
              <td></td>
              <td>
                <strong>{grandTotalFob.toFixed(2)}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <br></br>
      <br></br>

      <table className="table table-bordered">
        <tbody>
          <tr>
            <td>
              <b>Merchant:</b> Anik Das{" "}
            </td>
            <td>
              <b>FG ID:</b>
            </td>
            <td>
              <b>FG Pass:</b>
            </td>
            <td>
              <b>Buyer Confirmation Mail:</b>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
