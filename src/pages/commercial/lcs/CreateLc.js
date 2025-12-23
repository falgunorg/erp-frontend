import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import swal from "sweetalert";
import CustomSelect from "elements/CustomSelect";
import moment from "moment";
import MultipleFileInput from "elements/techpack/MultipleFileInput";
import QuailEditor from "elements/QuailEditor";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export default function CreateLc(props) {
  const userData = props.userData;
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [proformas, setProformas] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [errors, setErrors] = useState({});

  const bangladeshPorts = [
    {
      title: "Chittagong Port (Chattogram)",
      type: "sea",
      district: "Chattogram",
    },
    { title: "Mongla Port", type: "sea", district: "Bagerhat" },
    { title: "Payra Port", type: "sea", district: "Patuakhali" },
    { title: "Matarbari Deep Sea Port", type: "sea", district: "Cox’s Bazar" },

    { title: "Benapole Land Port", type: "road", district: "Jashore" },
    { title: "Burimari Land Port", type: "road", district: "Lalmonirhat" },
    { title: "Hilli Land Port", type: "road", district: "Dinajpur" },
    { title: "Bhomra Land Port", type: "road", district: "Satkhira" },
    { title: "Akhaura Land Port", type: "road", district: "Brahmanbaria" },
    { title: "Tamabil Land Port", type: "road", district: "Sylhet" },
    { title: "Sonahat Land Port", type: "road", district: "Kurigram" },
    { title: "Darshana Land Port", type: "road", district: "Chuadanga" },
    {
      title: "Teknaf Land Port (with Myanmar)",
      type: "road",
      district: "Cox’s Bazar",
    },
    { title: "Banglabandha Land Port", type: "road", district: "Panchagarh" },
    {
      title: "Gobrakura–Karaitali Land Port",
      type: "road",
      district: "Mymensingh",
    },
    { title: "Bibir Bazar Land Port", type: "road", district: "Cumilla" },
    { title: "Nangalkot Land Port", type: "road", district: "Cumilla" },
    { title: "Kawkhali Land Port", type: "road", district: "Rangamati" },

    {
      title: "Hazrat Shahjalal International Airport",
      type: "air",
      district: "Dhaka",
    },
    {
      title: "Shah Amanat International Airport",
      type: "air",
      district: "Chattogram",
    },
    { title: "Osmani International Airport", type: "air", district: "Sylhet" },
    { title: "Barisal Airport", type: "air", district: "Barisal" },
    { title: "Cox’s Bazar Airport", type: "air", district: "Cox’s Bazar" },
    { title: "Jessore Airport (Jashore)", type: "air", district: "Jashore" },
    { title: "Saidpur Airport", type: "air", district: "Nilphamari" },
    { title: "Rajshahi Airport", type: "air", district: "Rajshahi" },
    {
      title: "Thakurgaon Airport (non-operational)",
      type: "air",
      district: "Thakurgaon",
    },
    { title: "Ishurdi Airport", type: "air", district: "Pabna" },
    { title: "APPLICANT'S FACTORY", type: "road", district: "" },
  ];

  const foreignPorts = [
    { title: "Port of Shanghai", type: "sea", country: "China" },
    { title: "Port of Ningbo-Zhoushan", type: "sea", country: "China" },
    { title: "Port of Shenzhen", type: "sea", country: "China" },
    { title: "Port of Guangzhou", type: "sea", country: "China" },
    { title: "Port of Qingdao", type: "sea", country: "China" },
    { title: "Port of Tianjin", type: "sea", country: "China" },
    { title: "Any Port of China", type: "sea", country: "China" },
    {
      title: "Shanghai Pudong International Airport",
      type: "air",
      country: "China",
    },
    {
      title: "Guangzhou Baiyun International Airport",
      type: "air",
      country: "China",
    },
    {
      title: "Shenzhen Bao'an International Airport",
      type: "air",
      country: "China",
    },

    // --- VIETNAM ---
    {
      title: "Port of Ho Chi Minh City (Cat Lai)",
      type: "sea",
      country: "Vietnam",
    },
    { title: "Port of Hai Phong", type: "sea", country: "Vietnam" },
    { title: "Port of Da Nang", type: "sea", country: "Vietnam" },
    {
      title: "Cai Mep International Terminal",
      type: "sea",
      country: "Vietnam",
    },

    {
      title: "Any Port Of Vietnam",
      type: "sea",
      country: "Vietnam",
    },
    {
      title: "Tan Son Nhat International Airport",
      type: "air",
      country: "Vietnam",
    },
    { title: "Noi Bai International Airport", type: "air", country: "Vietnam" },

    // --- TAIWAN ---
    { title: "Port of Kaohsiung", type: "sea", country: "Taiwan" },
    { title: "Port of Keelung", type: "sea", country: "Taiwan" },
    { title: "Port of Taichung", type: "sea", country: "Taiwan" },
    { title: "Any Port of Taiwan", type: "sea", country: "Taiwan" },
    { title: "Taoyuan International Airport", type: "air", country: "Taiwan" },
    {
      title: "Kaohsiung International Airport",
      type: "air",
      country: "Taiwan",
    },

    // --- INDIA ---
    {
      title: "Jawaharlal Nehru Port (Nhava Sheva)",
      type: "sea",
      country: "India",
    },
    {
      title: "Syama Prasad Mookerjee Port (Kolkata)",
      type: "sea",
      country: "India",
    },
    { title: "Mundra Port", type: "sea", country: "India" },
    { title: "Chennai Port", type: "sea", country: "India" },
    { title: "Haldia Dock Complex", type: "sea", country: "India" },
    {
      title: "Indira Gandhi International Airport (Delhi)",
      type: "air",
      country: "India",
    },
    {
      title: "Chhatrapati Shivaji Maharaj International Airport (Mumbai)",
      type: "air",
      country: "India",
    },
    { title: "Chennai International Airport", type: "air", country: "India" },
    {
      title: "Netaji Subhash Chandra Bose International Airport (Kolkata)",
      type: "air",
      country: "India",
    },

    {
      title: "Petrapole Land Port (Benapole side)",
      type: "road",
      country: "India",
    },
    {
      title: "Ghojadanga Land Customs Station (Bhomra side)",
      type: "road",
      country: "India",
    },
    {
      title: "Changrabandha Land Port (Burimari side)",
      type: "road",
      country: "India",
    },
    {
      title: "Mahadipur Land Port (Sonamasjid side)",
      type: "road",
      country: "India",
    },
    { title: "Hili Land Port (Hili side)", type: "road", country: "India" },
    {
      title: "Fulbari Land Port (Banglabandha side)",
      type: "road",
      country: "India",
    },
    {
      title: "Ramnagar/Agartala Land Port (Akhaura side)",
      type: "road",
      country: "India",
    },
    { title: "Dauki Land Port (Tamabil side)", type: "road", country: "India" }, // Connects to Sylhet region (Meghalaya border)
    {
      title: "Sutarkandi Land Port (Sheola side)",
      type: "road",
      country: "India",
    },
    {
      title: "Gede Land Customs Station (Darshana side)",
      type: "road",
      country: "India",
    },
    {
      title: "BENEFICIARY'S FACTORY",
      type: "road",
      country: "",
    },
  ];

  const epzs = [
    {
      title: "Chattogram Export Processing Zone",
      type: "road",
      district: "Chattogram",
    },
    { title: "Dhaka Export Processing Zone", type: "road", district: "Dhaka" },
    {
      title: "Cumilla Export Processing Zone",
      type: "road",
      district: "Cumilla",
    },
    {
      title: "Adamjee Export Processing Zone",
      type: "road",
      district: "Narayanganj",
    },
    {
      title: "Karnaphuli Export Processing Zone",
      type: "road",
      district: "Chattogram",
    },
    {
      title: "Mongla Export Processing Zone",
      type: "road",
      district: "Bagerhat",
    },
    {
      title: "Ishwardi Export Processing Zone",
      type: "road",
      district: "Pabna",
    },

    {
      title: "Uttara Export Processing Zone",
      type: "road",
      district: "Nilphamari",
    },
  ];

  const [formDataSet, setFormDataSet] = useState({
    contract_id: "",
    supplier_id: "",
    proformas: [],
    lc_number: "",
    draft_at: "",
    apply_date: "",
    bb_type: "",
    issued_date: "",
    commodity: "",
    mode_of_shipment: "",
    port_of_loading: "",
    port_of_discharge: "",
    net_weight: "",
    gross_weight: "",
    freight_charge: "",
    description: "",
  });

  console.log("gerdgh", formDataSet);

  // --- Fetchers ---
  const getContracts = async () => {
    setSpinner(true);
    try {
      const res = await api.post("/merchandising/purchase-contracts");
      if (res.status === 200 && res.data) setContracts(res.data.data || []);
    } catch (err) {
      console.error("getContracts:", err);
    } finally {
      setSpinner(false);
    }
  };

  const getSuppliers = async () => {
    setSpinner(true);
    try {
      const res = await api.post("/admin/suppliers");
      if (res.status === 200 && res.data) setSuppliers(res.data.data || []);
    } catch (err) {
      console.error("getSuppliers:", err);
    } finally {
      setSpinner(false);
    }
  };

  // Only fetch proformas when both contract_id and supplier_id are set
  const getProformas = async () => {
    if (!formDataSet.contract_id || !formDataSet.supplier_id) {
      setProformas([]);
      return;
    }
    setSpinner(true);
    try {
      const res = await api.post("/merchandising/proformas", {
        status: "Received",
        department: userData?.department_title,
        designation: userData?.designation_title,
        contract_id: formDataSet.contract_id,
        supplier_id: formDataSet.supplier_id,
      });
      if (res.status === 200 && res.data) setProformas(res.data.data || []);
    } catch (err) {
      console.error("getProformas:", err);
    } finally {
      setSpinner(false);
    }
  };

  useEffect(() => {
    getContracts();
    getSuppliers();
    // do NOT call getProformas here — wait until contract & supplier selected
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // whenever contract_id or supplier_id changes, refresh proformas
    getProformas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formDataSet.contract_id, formDataSet.supplier_id]);

  // --- Handlers ---
  const handleChange = (name, value) => {
    setFormDataSet((prev) => ({ ...prev, [name]: value }));
  };

  const handleProformaChange = (selectedOptions = []) => {
    const selectedIds = selectedOptions.map((opt) => opt.value);
    handleChange("proformas", selectedIds);
  };

  // --- Derived data ---
  const filteredProformas = proformas.filter((p) =>
    formDataSet.proformas.includes(p.id)
  );

  const getFilteredPorts = () => {
    const mode = formDataSet.mode_of_shipment;

    if (!mode) return [];

    switch (mode) {
      case "Sea":
        return bangladeshPorts.filter((p) => p.type === "sea");

      case "Air":
        return bangladeshPorts.filter((p) => p.type === "air");

      case "Land":
        return bangladeshPorts.filter((p) => p.type === "road");

      case "Sea/Air":
        return bangladeshPorts.filter(
          (p) => p.type === "sea" || p.type === "air"
        );

      case "Sea/Air/Road":
        return bangladeshPorts.filter(
          (p) => p.type === "sea" || p.type === "air" || p.type === "road"
        );

      default:
        return [];
    }
  };

  const getFilteredForeignPorts = () => {
    const mode = formDataSet.mode_of_shipment;

    if (!mode) return [];

    switch (mode) {
      case "Sea":
        return foreignPorts.filter((p) => p.type === "sea");

      case "Air":
        return foreignPorts.filter((p) => p.type === "air");

      case "Land":
        return foreignPorts.filter((p) => p.type === "road");

      case "Sea/Air":
        return foreignPorts.filter((p) => p.type === "sea" || p.type === "air");

      case "Sea/Air/Road":
        return foreignPorts.filter(
          (p) => p.type === "sea" || p.type === "air" || p.type === "road"
        );

      default:
        return [];
    }
  };

  const filteredPorts = getFilteredPorts();
  const filteredForeignPorts = getFilteredForeignPorts();
  const totalNetWeight = filteredProformas.reduce((sum, p) => {
    // normalize p.total to a number safely
    const raw = p && p.net_weight != null ? String(p.net_weight) : "0";
    const cleaned = raw.replace(/,/g, "").replace(/[^0-9.-]+/g, "");
    const n = parseFloat(cleaned);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  const totalGrossWeight = filteredProformas.reduce((sum, p) => {
    // normalize p.total to a number safely
    const raw = p && p.gross_weight != null ? String(p.gross_weight) : "0";
    const cleaned = raw.replace(/,/g, "").replace(/[^0-9.-]+/g, "");
    const n = parseFloat(cleaned);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  const totalFreightCharge = filteredProformas.reduce((sum, p) => {
    // normalize p.total to a number safely
    const raw = p && p.freight_charge != null ? String(p.freight_charge) : "0";
    const cleaned = raw.replace(/,/g, "").replace(/[^0-9.-]+/g, "");
    const n = parseFloat(cleaned);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  const totalAmount = filteredProformas.reduce((sum, p) => {
    // normalize p.total to a number safely
    const raw = p && p.total != null ? String(p.total) : "0";
    const cleaned = raw.replace(/,/g, "").replace(/[^0-9.-]+/g, "");
    const n = parseFloat(cleaned);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  // --- Validation ---
  const validateForm = () => {
    const requiredFields = [
      "contract_id",
      "supplier_id",
      "proformas",
      "lc_number",
      "commodity",
      "mode_of_shipment",
    ];

    const newErrors = {};
    requiredFields.forEach((f) => {
      const val = formDataSet[f];
      if (Array.isArray(val)) {
        if (val.length === 0)
          newErrors[f] = `${f.replace(/_/g, " ")} is required`;
      } else if (!val && val !== 0) {
        newErrors[f] = `${f.replace(/_/g, " ")} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // require at least one attachment or not? original required softcopy — original Create required selectedFiles check earlier.
    if ((selectedFiles?.length || 0) === 0) {
      // If you want to enforce, uncomment below:
      // swal("Please Upload LC copy (PDF)", { icon: "error" });
      // return;
    }

    const formData = new FormData();
    // append scalar fields
    Object.keys(formDataSet).forEach((k) => {
      const v = formDataSet[k];
      if (Array.isArray(v)) {
        // for arrays (proformas) send as JSON string
        formData.append(k, JSON.stringify(v));
      } else {
        formData.append(k, v ?? "");
      }
    });

    // attachments
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("attatchments[]", selectedFiles[i]);
    }

    setSpinner(true);
    try {
      const res = await api.post("/commercial/lcs-create", formData);
      if (res.status === 200 && res.data) {
        swal("Success", "LC Created Successfully", "success");
        history.push("/commercial/lcs");
      } else {
        setErrors(res.data?.errors || {});
      }
    } catch (err) {
      console.error("handleSubmit:", err);
      swal("Error", err.message || "Something went wrong", "error");
    } finally {
      setSpinner(false);
    }
  };

  // --- Access control ---
  useEffect(() => {
    if (userData?.department_title !== "Commercial") {
      swal({
        icon: "error",
        text: "You cannot access this section.",
        closeOnClickOutside: false,
      }).then(() => history.push("/commercial/lcs"));
    }
  }, [userData, history]);

  useEffect(async () => {
    props.setHeaderData({
      pageName: "NEW BBLC",
      isNewButton: true,
      newButtonLink: "",
      newButtonText: "New BB",
      isInnerSearch: true,
      innerSearchValue: "",
    });
  }, []);

  return (
    <div className="create_edit_page create_technical_pack">
      {spinner && <Spinner />}
      <form onSubmit={handleSubmit} className="create_tp_body">
        <div className="d-flex align-items-end justify-content-end">
          <button
            type="submit"
            className="publish_btn btn btn-warning bg-falgun me-4"
          >
            Save
          </button>
          <Link to="/commercial/lcs" className="btn btn-danger rounded-circle">
            <i className="fal fa-times"></i>
          </Link>
        </div>
        <hr />
        <div className="col-lg-12">
          <div className="personal_data">
            <div className="row">
              {/* Purchase Contract */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">
                    Purchase Contract <span className="text-danger">*</span>
                  </label>
                  <CustomSelect
                    placeholder="Select or Search"
                    onChange={(opt) =>
                      handleChange("contract_id", opt?.value || "")
                    }
                    value={
                      contracts.find((c) => c.id === formDataSet.contract_id)
                        ? {
                            value: formDataSet.contract_id,
                            label:
                              contracts.find(
                                (c) => c.id === formDataSet.contract_id
                              ).title || "",
                          }
                        : null
                    }
                    name="contract_id"
                    options={contracts.map((c) => ({
                      value: c.id,
                      label: c.title,
                    }))}
                  />
                  {errors.contract_id && (
                    <div className="errorMsg">{errors.contract_id}</div>
                  )}
                </div>
              </div>

              {/* Supplier */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">
                    Supplier <span className="text-danger">*</span>
                  </label>
                  <CustomSelect
                    placeholder="Select or Search"
                    onChange={(opt) =>
                      handleChange("supplier_id", opt?.value || "")
                    }
                    value={
                      suppliers.find((s) => s.id === formDataSet.supplier_id)
                        ? (() => {
                            const selected = suppliers.find(
                              (s) => s.id === formDataSet.supplier_id
                            );
                            return {
                              value: selected.id,
                              label: `${selected.company_name || ""} — ${
                                selected.country || ""
                              }`,
                            };
                          })()
                        : null
                    }
                    name="supplier_id"
                    options={suppliers.map((s) => ({
                      value: s.id,
                      label: `${s.company_name || ""} — ${s.country || ""}`,
                    }))}
                  />

                  {errors.supplier_id && (
                    <div className="errorMsg">{errors.supplier_id}</div>
                  )}
                </div>
              </div>

              {/* Proformas (multi) */}
              <div className="col-lg-6">
                <div className="form-group">
                  <label className="form-label">
                    Proforma Invoices <span className="text-danger">*</span>
                  </label>
                  <CustomSelect
                    isMulti
                    name="proformas"
                    placeholder="Select or Search"
                    value={formDataSet.proformas.map((id) => {
                      const pf = proformas.find((p) => p.id === id);
                      return {
                        value: id,
                        label: pf ? `${pf.title} | ${pf.total}` : id,
                      };
                    })}
                    onChange={handleProformaChange}
                    options={proformas.map((p) => ({
                      value: p.id,
                      label: `${p.title} | ${p.total}`,
                    }))}
                  />
                  {errors.proformas && (
                    <div className="errorMsg">{errors.proformas}</div>
                  )}
                </div>
              </div>

              {/* LC Number */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">
                    LC Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="lc_number"
                    value={formDataSet.lc_number}
                    onChange={(e) => handleChange("lc_number", e.target.value)}
                    className="form-control"
                  />
                  {errors.lc_number && (
                    <div className="errorMsg">{errors.lc_number}</div>
                  )}
                </div>
              </div>

              {/* LC Validity */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">Drafts At</label>
                  <select
                    tabIndex={0}
                    value={formDataSet.draft_at}
                    onChange={(e) => handleChange("draft_at", e.target.value)}
                    name="draft_at"
                    className="form-select"
                  >
                    <option value="">Select One</option>
                    <option value="AT SIGHT">AT SIGHT</option>
                    <option value="60 DAYS">60 DAYS</option>
                    <option value="90 DAYS">90 DAYS</option>
                    <option value="120 DAYS">120 DAYS</option>
                    <option value="160 DAYS">160 DAYS</option>
                  </select>
                </div>
              </div>

              {/* Apply Date */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">Apply Date</label>
                  <input
                    type="date"
                    name="apply_date"
                    value={formDataSet.apply_date}
                    onChange={(e) => handleChange("apply_date", e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Issued Date */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">Issued Date</label>
                  <input
                    type="date"
                    name="issued_date"
                    value={formDataSet.issued_date}
                    onChange={(e) =>
                      handleChange("issued_date", e.target.value)
                    }
                    className="form-control"
                  />
                </div>
              </div>
              {/* Commodity */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">
                    Commodity <span className="text-danger">*</span>
                  </label>
                  <select
                    tabIndex={0}
                    onChange={(e) => handleChange("commodity", e.target.value)}
                    name="commodity"
                    value={formDataSet.commodity}
                    className="form-select"
                  >
                    <option value="">Select Commodity</option>
                    <option value="Fabric">Fabric</option>
                    <option value="Sewing Trims">Sewing Trims</option>
                    <option value="Finishing Trims">Finishing Trims</option>
                    <option value="Packing Trims">Packing Trims</option>
                  </select>
                  {errors.commodity && (
                    <div className="errorMsg">{errors.commodity}</div>
                  )}
                </div>
              </div>

              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">
                    BB Type <span className="text-danger">*</span>
                  </label>
                  <select
                    tabIndex={0}
                    onChange={(e) => handleChange("bb_type", e.target.value)}
                    name="bb_type"
                    value={formDataSet.bb_type}
                    className="form-select"
                  >
                    <option value="">Select Type</option>
                    <option value="Local">Local</option>
                    <option value="Foreign">Foreign</option>
                    <option value="Local (EPZ)">Local (EPZ)</option>
                  </select>
                  {errors.bb_type && (
                    <div className="errorMsg">{errors.bb_type}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-3">
                <label className="form-label">
                  Mode of Shipment <span className="text-danger">*</span>
                </label>
                <select
                  tabIndex={0}
                  className="form-select"
                  value={formDataSet.mode_of_shipment}
                  onChange={(e) =>
                    handleChange("mode_of_shipment", e.target.value)
                  }
                >
                  <option value="">Select One</option>
                  <option value="Sea">Sea</option>
                  <option value="Air">Air</option>
                  <option value="Land">Road</option>

                  <option value="Sea/Air">Sea/Air</option>
                  <option value="Sea/Air/Road">Sea/Air/Road</option>
                </select>
                {errors.mode_of_shipment && (
                  <div className="errorMsg">{errors.mode_of_shipment}</div>
                )}
              </div>

              <div className="col-lg-3">
                <label className="form-label">Port of Loading</label>

                <Autocomplete
                  className="recepient_AutoComplete"
                  freeSolo
                  // Corrected: Use template literal to join title and country
                  options={
                    formDataSet.bb_type === "Local (EPZ)"
                      ? epzs.map((e) => e.title)
                      : filteredForeignPorts.map(
                          (item) => `${item.title} | ${item.country}`
                        )
                  }
                  // Ensure value is always a string to prevent controlled/uncontrolled warnings
                  value={formDataSet.port_of_loading || ""}
                  onChange={(event, newValue) =>
                    handleChange("port_of_loading", newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select ports"
                      variant="outlined"
                      // Ensure the TextField handles the value properly
                      onChange={(e) =>
                        handleChange("port_of_loading", e.target.value)
                      }
                      InputLabelProps={{
                        shrink: true,
                        className: "custom-label",
                      }}
                    />
                  )}
                />
              </div>

              <div className="col-lg-3">
                <label className="form-label">Port of Discharge</label>
                <Autocomplete
                  className="recepient_AutoComplete"
                  freeSolo
                  // Corrected: Use template literal to join title and country

                  options={filteredPorts.map(
                    (item) => `${item.title} | ${item.district}`
                  )}
                  // Ensure value is always a string to prevent controlled/uncontrolled warnings
                  value={formDataSet.port_of_discharge || ""}
                  onChange={(event, newValue) =>
                    handleChange("port_of_discharge", newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select ports"
                      // Ensure the TextField handles the value properly
                      onChange={(e) =>
                        handleChange("port_of_discharge", e.target.value)
                      }
                      InputLabelProps={{
                        shrink: true,
                        className: "custom-label",
                      }}
                    />
                  )}
                />
              </div>

              {/* Net Weight */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">Net Weight(KG)</label>
                  <input
                    readOnly
                    type="text"
                    value={totalNetWeight.toFixed(2)}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Gross Weight */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">Gross Weight(KG)</label>
                  <input
                    readOnly
                    type="text"
                    value={totalGrossWeight.toFixed(2)}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Freight Charge */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">Freight Charge</label>
                  <input
                    readOnly
                    value={totalFreightCharge.toFixed(2)}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">Total LC Value</label>
                  <input
                    readOnly
                    type="number"
                    value={totalAmount.toFixed(2)}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-lg-9">
                <div className="form-group">
                  <label className="form-label">Attatchments</label>
                  <MultipleFileInput
                    label="Attatchments"
                    inputId="Attatchments"
                    selectedFiles={selectedFiles}
                    setSelectedFiles={setSelectedFiles}
                  />
                </div>
              </div>
            </div>
            <hr />
            {/* Proforma table */}
            <h6 className="text-center">
              <u>Proforma Invoices</u>
            </h6>
            <div className="Import_booking_item_table">
              <table className="table text-start align-middle table-bordered table-hover mb-0">
                <thead className="bg-dark text-white">
                  <tr>
                    <th>SL</th>
                    <th>PI</th>
                    <th>Responsible MR</th>
                    <th>Issued Date</th>
                    <th>Validity</th>
                    <th>Status</th>
                    <th>Net Weight(KG)</th>
                    <th>Gross Weight(KG)</th>
                    <th>Freight Charge</th>
                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProformas.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.title}</td>
                      <td>{item.user}</td>
                      <td>
                        {item.issued_date
                          ? moment(item.issued_date).format("ll")
                          : ""}
                      </td>
                      <td>{item.pi_validity}</td>
                      <td>{item.status}</td>
                      <td>{item.net_weight}</td>
                      <td>{item.gross_weight}</td>
                      <td>{item.freight_charge}</td>
                      <td>{item.total}</td>
                    </tr>
                  ))}

                  <tr>
                    <td colSpan={6}>
                      <strong>TOTAL</strong>
                    </td>
                    <td>
                      <strong>{Number(totalNetWeight).toFixed(2)} (KG)</strong>
                    </td>
                    <td>
                      <strong>
                        {Number(totalGrossWeight).toFixed(2)} (KG)
                      </strong>
                    </td>
                    <td>
                      <strong>
                        {Number(totalFreightCharge).toFixed(2)} (USD)
                      </strong>
                    </td>
                    <td>
                      <strong>{Number(totalAmount).toFixed(2)} (USD)</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <hr />
            {/* Payment / Shipping / Ports / Description */}
            <div className="card-body row g-3">
              <div className="col-lg-12 mt-3">
                <label className="form-label">Description</label>
                <QuailEditor
                  content={formDataSet.description}
                  onContentChange={(val) => handleChange("description", val)}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
