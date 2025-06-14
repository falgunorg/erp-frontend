import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logos/logo-short.png";
import Select, { components } from "react-select";
import api from "services/api";
import swal from "sweetalert";
export default function CreateWorkOrder({ renderArea, setRenderArea }) {
  console.log("RENDERaREA", renderArea);

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
    { id: 1, title: "FAL" },
    { id: 2, title: "SUMMER" },
    { id: 3, title: "SPRING" },
  ];

  const years = [
    { id: 1, title: "2025" },
    { id: 2, title: "2024" },
    { id: 3, title: "2023" },
    { id: 4, title: "2022" },
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

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    purchase_contract_id: "",
    company_id: "",
    buyer_id: "",
    season: "",
    year: "",
    description: "",
  });

  const handleChange = async (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = {
      purchase_contract_id: "Please select a purchase contract.",
      company_id: "Company is required.",
      buyer_id: "Buyer is required.",
      season: "Season is required.",
      year: "Year is required",
    };

    const formErrors = {};

    for (const field in requiredFields) {
      if (!formData[field]) {
        formErrors[field] = requiredFields[field];
      }
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      const data = new FormData();
      // Append form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          data.append(key, JSON.stringify(value));
        } else {
          data.append(key, value);
        }
      });

      const response = await api.post("/workorders-create", data);
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
              <span className="purchase_text">WO</span>
            </div>
            <div className="col-lg-2">
              {/* <label className="form-label">PO Number</label> */}
            </div>
            <div className="col-lg-2">
              {/* <input
                value={formData.po_number}
                name="po_number"
                className={errors.po_number ? "red-border" : ""}
                onChange={(e) => handleChange("po_number", e.target.value)}
                type="text"
              /> */}
            </div>

            <div className="col-lg-2">
              {/* <label className="form-label">WO Number</label> */}
            </div>
            <div className="col-lg-2">
              {/* <input
                className={errors.wo_id ? "red-border" : ""}
                value={formData.wo_id}
                name="wo_id"
                onChange={(e) => handleChange("wo_id", e.target.value)}
                type="text"
              /> */}
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
        <div className="row">
          <div className="col-lg-2">
            <label className="form-label">PC/LC</label>
          </div>
          <div className="col-lg-4">
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
            <label className="form-label">Factory</label>
          </div>
          <div className="col-lg-4">
            <Select
              className={
                errors.company_id ? "select_wo red-border" : "select_wo"
              }
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
                .find((option) => option.value === formData.company_id)}
              styles={customStyles}
              components={{ DropdownIndicator }}
              onChange={(selectedOption) =>
                handleChange("company_id", selectedOption.value)
              }
              name="company_id"
            />
          </div>
          <div className="col-lg-2">
            <label className="form-label">Buyer</label>
          </div>
          <div className="col-lg-4">
            <Select
              className={errors.buyer_id ? "select_wo red-border" : "select_wo"}
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
                .find((option) => option.value === formData.buyer_id)}
              onChange={(selectedOption) =>
                handleChange("buyer_id", selectedOption.value)
              }
              styles={customStyles}
              components={{ DropdownIndicator }}
            />
          </div>
          <div className="col-lg-2">
            <label className="form-label">Season</label>
          </div>
          <div className="col-lg-4">
            <Select
              className={errors.season ? "select_wo red-border" : "select_wo"}
              placeholder="Season"
              options={seasons.map(({ id, title }) => ({
                value: title,
                label: title,
              }))}
              value={seasons
                .map(({ id, title }) => ({
                  value: title,
                  label: title,
                }))
                .find((option) => option.value === formData.season)}
              onChange={(selectedOption) =>
                handleChange("season", selectedOption.value)
              }
              styles={customStyles}
              components={{ DropdownIndicator }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-2">
            <label className="form-label">Year</label>
          </div>
          <div className="col-lg-2">
            <Select
              className={errors.year ? "select_wo red-border" : "select_wo"}
              placeholder="Year"
              options={years.map(({ id, title }) => ({
                value: title,
                label: title,
              }))}
              value={years
                .map(({ id, title }) => ({
                  value: title,
                  label: title,
                }))
                .find((option) => option.value === formData.season)}
              onChange={(selectedOption) =>
                handleChange("year", selectedOption.value)
              }
              styles={customStyles}
              components={{ DropdownIndicator }}
            />
          </div>

          <div className="col-lg-2">
            <label className="form-label">Description</label>
          </div>

          <div className="col-lg-6">
            <input
              value={formData.description}
              name="description"
              onChange={(e) => handleChange("description", e.target.value)}
              type="text"
              placeholder="97% Cotton 3% Elastane Ps Chino Trouser"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
