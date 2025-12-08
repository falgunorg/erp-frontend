import React, { useState, useEffect, useRef } from "react";
import api from "services/api";
import swal from "sweetalert";
import Logo from "../../../assets/images/logos/logo-short.png";
import { useHistory, Link } from "react-router-dom";
import CustomSelect from "elements/CustomSelect";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import JEditor from "elements/JEditor";

export default function CreateContracts(props) {
  const history = useHistory();

  const [buyers, setBuyers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [spinner, setSpinner] = useState(false);

  const [banks, setBanks] = useState([]);

  const bangladeshPorts = [
    {
      title: "Chittagong Port (Chattogram)",
      type: "sea",
      district: "Chattogram",
    },
    { title: "Mongla Port", type: "sea", district: "Bagerhat" },
    { title: "Payra Port", type: "sea", district: "Patuakhali" },
    { title: "Matarbari Deep Sea Port", type: "sea", district: "Cox’s Bazar" },

    { title: "Dhaka River Port (Sadarghat)", type: "river", district: "Dhaka" },
    { title: "Narayanganj River Port", type: "river", district: "Narayanganj" },
    { title: "Barisal River Port", type: "river", district: "Barisal" },
    { title: "Ashuganj River Port", type: "river", district: "Brahmanbaria" },
    { title: "Khulna River Port", type: "river", district: "Khulna" },
    { title: "Noapara River Port", type: "river", district: "Jashore" },
    { title: "Chandpur River Port", type: "river", district: "Chandpur" },
    { title: "Patuakhali River Port", type: "river", district: "Patuakhali" },
    { title: "Bhola River Port", type: "river", district: "Bhola" },
    { title: "Goalanda River Port", type: "river", district: "Rajbari" },
    { title: "Baghabari River Port", type: "river", district: "Sirajganj" },
    { title: "Sirajganj River Port", type: "river", district: "Sirajganj" },
    { title: "Narsingdi River Port", type: "river", district: "Narsingdi" },
    { title: "Kurigram River Port", type: "river", district: "Kurigram" },
    { title: "Aricha River Port", type: "river", district: "Manikganj" },

    { title: "Benapole Land Port", type: "land", district: "Jashore" },
    { title: "Burimari Land Port", type: "land", district: "Lalmonirhat" },
    { title: "Hilli Land Port", type: "land", district: "Dinajpur" },
    { title: "Bhomra Land Port", type: "land", district: "Satkhira" },
    { title: "Akhaura Land Port", type: "land", district: "Brahmanbaria" },
    { title: "Tamabil Land Port", type: "land", district: "Sylhet" },
    { title: "Sonahat Land Port", type: "land", district: "Kurigram" },
    { title: "Darshana Land Port", type: "land", district: "Chuadanga" },
    {
      title: "Teknaf Land Port (with Myanmar)",
      type: "land",
      district: "Cox’s Bazar",
    },
    { title: "Banglabandha Land Port", type: "land", district: "Panchagarh" },
    {
      title: "Gobrakura–Karaitali Land Port",
      type: "land",
      district: "Mymensingh",
    },
    { title: "Bibir Bazar Land Port", type: "land", district: "Cumilla" },
    { title: "Nangalkot Land Port", type: "land", district: "Cumilla" },
    { title: "Kawkhali Land Port", type: "land", district: "Rangamati" },

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
      title: "Tejgaon Airport (Dhaka, military)",
      type: "air",
      district: "Dhaka",
    },
    {
      title: "Thakurgaon Airport (non-operational)",
      type: "air",
      district: "Thakurgaon",
    },
    { title: "Ishurdi Airport", type: "air", district: "Pabna" },
    { title: "Comilla Airport", type: "air", district: "Cumilla" },
  ];

  const [docList, setDocList] = useState([
    "COMMERCIAL INVOICE",
    "PACKING LIST",
    "CERTIFICATE OF ORIGIN",
    "CERTIFICATE OF OEKO TEX",
    "BILL OF LADING",
    "AIR WAY BILL",
    "INSPECTION CERTIFICATE",
    "INSURANCE CERTIFICATE",
    "GSP FORM A",
    "FABRIC TEST REPORT",
    "GARMENT TEST REPORT",
    "SHIPPING INSTRUCTION",
    "EXPORT LICENSE",
    "LC COPY",
    "BANK CERTIFICATE",
    "SHIPPING ADVICE",
    "BOOKING CONFIRMATION",
    "PROFORMA INVOICE",
    "DELIVERY CHALLAN",
    "BUYER ORDER / PURCHASE ORDER",
    "PACKING DECLARATION",
    "PHYTOSANITARY CERTIFICATE",
    "FUMIGATION CERTIFICATE",
    "HEAT TREATMENT CERTIFICATE",
    "EXPORT DECLARATION (EXP FORM)",
    "QUOTA CERTIFICATE",
    "CARGO MANIFEST",
    "BENEFICIARY CERTIFICATE",
    "WEIGHT CERTIFICATE",
    "FABRIC COMPOSITION CERTIFICATE",
    "QUALITY CERTIFICATE",
    "SHIPPING BILL",
    "EXPORT PERMIT",
    "LAB TEST REPORT",
    "MSDS (MATERIAL SAFETY DATA SHEET)",
    "BUYER’S APPROVAL SHEET",
    "SAMPLE APPROVAL SHEET",
    "PI CONFIRMATION",
    "PAYMENT ADVICE",
  ]);

  const [form, setForm] = useState({
    title: "",
    contract_date: "",
    qty: "",
    contract_value: "",
    contract_type: "fob",
    buyer_id: "",
    buyer_address: "",
    buyer_phone: "",
    buyer_email: "",
    buyer_bank_name: "",
    buyer_bank_address: "",
    buyer_bank_phone: "",
    buyer_bank_swift: "",
    company_id: "",
    seller_address: "",
    seller_bank_id: "",
    seller_bank_address: "",
    seller_bank_swift: "",
    payment_terms: "",
    port_of_loading: "",
    port_of_discharge: "",
    mode_of_shipment: "",
    documents_required: [],
    reimbursement_instructions: "",
    amendment_clause: "",
    agent_commission_clause: "",
  });

  const [notifyParty, setNotifyParty] = useState("");
  const handleMsgChange = (value) => {
    setNotifyParty(value);
  };
  const steps = [
    "Contract Details",
    "Buyer Information",
    "Seller (Company) Information",
    "Payment & Shipment Information",
    "Clauses & Conditions",
  ];

  const [activeStep, setActiveStep] = useState(0);

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [b, c, bk] = await Promise.all([
          api.post("/common/buyers"),
          api.post("/common/companies", { type: "own" }),
          api.get("/common/banks"),
        ]);
        setBuyers(b.data?.data || []);
        setCompanies(c.data?.data || []);
        setBanks(bk.data || []);
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };
    fetchData();
  }, []);
  console.log("FORMDATA", form);

  const handleChange = async (name, value) => {
    try {
      let updatedFields = { [name]: value };

      // ✅ Handle buyer selection
      if (name === "buyer_id") {
        const buyer = buyers.find((b) => b.id == value);
        if (buyer) {
          updatedFields = {
            ...updatedFields,
            buyer_id: buyer.id,
            buyer_address: [buyer.address, buyer.city, buyer.country]
              .filter(Boolean)
              .join(", "),
            buyer_phone: buyer.phone || "",
            buyer_email: buyer.email || "",
          };
        }
      }

      // ✅ Handle company selection
      if (name === "company_id") {
        const company = companies.find((c) => c.id == value);
        if (company) {
          updatedFields = {
            ...updatedFields,
            company_id: company.id,
            seller_address: [company.address, company.city, company.country]
              .filter(Boolean)
              .join(", "),
          };
        }
      }

      // ✅ Handle seller bank selection
      if (name === "seller_bank_id") {
        const bank = banks.find((b) => b.id == value);
        if (bank) {
          updatedFields = {
            ...updatedFields,
            seller_bank_id: bank.id,
            seller_bank_address: [bank.branch, bank.address, bank.country]
              .filter(Boolean)
              .join(", "),
            seller_bank_swift: bank.swift_code || "",
          };
        }
      }

      // ✅ Single efficient state update
      setForm((prev) => ({
        ...prev,
        ...updatedFields,
      }));
    } catch (error) {
      console.error("Error updating form:", error);
    }
  };

  const getFilteredPorts = () => {
    const mode = form.mode_of_shipment;

    if (!mode) return [];

    switch (mode) {
      case "Sea":
        return bangladeshPorts.filter((p) => p.type === "sea");

      case "Air":
        return bangladeshPorts.filter((p) => p.type === "air");

      case "Land":
        return bangladeshPorts.filter((p) => p.type === "land");

      case "River":
        return bangladeshPorts.filter((p) => p.type === "river");

      case "Sea/Air":
        return bangladeshPorts.filter(
          (p) => p.type === "sea" || p.type === "air"
        );

      case "Sea/Air/Road":
        return bangladeshPorts.filter(
          (p) => p.type === "sea" || p.type === "air" || p.type === "land"
        );

      default:
        return [];
    }
  };

  const filteredPorts = getFilteredPorts();

  // Step validation logic
  const validateStep = () => {
    switch (activeStep) {
      case 0:
        return (
          form.title &&
          form.contract_date &&
          form.contract_type &&
          form.contract_value &&
          form.qty
        );
      case 1:
        return form.buyer_id && form.buyer_bank_name && form.buyer_bank_swift;
      case 2:
        return form.company_id && form.seller_bank_id && form.seller_bank_swift;
      case 3:
        return (
          form.payment_terms &&
          form.mode_of_shipment &&
          form.port_of_loading &&
          form.port_of_discharge
        );
      case 4:
        return true; // last step can be optional
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (!validateStep()) {
      swal("Error", "Please fill all required fields for this step!", "error");
      return;
    }
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSpinner(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v || ""));
      fd.append("notify_party", notifyParty);
      const res = await api.post("/commercial/contracts/create", fd);
      if (res.status === 200) {
        swal("Success!", "Purchase contract saved successfully.", "success");
        history.push(`/commercial/contracts`);
      }
    } catch (err) {
      console.error(err);
      swal("Error!", "Failed to save purchase contract.", "error");
    } finally {
      setSpinner(false);
    }
  };

  // Step render function
  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="card create_tp_body">
            <div className="card-header fw-bold bg-light">Contract Details</div>
            <div className="card-body row g-3">
              <div className="col-lg-4">
                <label className="form-label">
                  Contract / Export Lc No <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
              </div>
              <div className="col-lg-2">
                <label className="form-label">
                  Contract Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={form.contract_date}
                  onChange={(e) =>
                    handleChange("contract_date", e.target.value)
                  }
                />
              </div>

              <div className="col-lg-2">
                <label className="form-label">
                  QTY (PCS)<span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  step={0.1}
                  value={form.qty}
                  onChange={(e) => handleChange("qty", e.target.value)}
                />
              </div>
              <div className="col-lg-2">
                <label className="form-label">
                  Contract Value <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  step={0.1}
                  value={form.contract_value}
                  onChange={(e) =>
                    handleChange("contract_value", e.target.value)
                  }
                />
              </div>
              <div className="col-lg-2">
                <label className="form-label">
                  Contract Type <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={form.contract_type}
                  onChange={(e) =>
                    handleChange("contract_type", e.target.value)
                  }
                >
                  <option value="fob">FOB</option>
                  <option value="foc">FOC</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="card create_tp_body">
            <div className="card-header fw-bold bg-light">
              Buyer Information
            </div>

            <div className="row">
              <div className="col-lg-6">
                <div className="card-body row">
                  <div className="col-lg-4">
                    <label className="form-label">
                      Buyer <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={form.buyer_id}
                      onChange={(e) => handleChange("buyer_id", e.target.value)}
                    >
                      <option value="">Select Buyer</option>
                      {buyers.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-lg-4">
                    <label className="form-label">Buyer Phone</label>
                    <input
                      className="form-control"
                      value={form.buyer_phone}
                      onChange={(e) =>
                        handleChange("buyer_phone", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-lg-4">
                    <label className="form-label">Buyer Email</label>
                    <input
                      className="form-control"
                      value={form.buyer_email}
                      onChange={(e) =>
                        handleChange("buyer_email", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-lg-12">
                    <label className="form-label">Buyer Address</label>
                    <textarea
                      rows="2"
                      className="form-control"
                      value={form.buyer_address}
                      onChange={(e) =>
                        handleChange("buyer_address", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-lg-12">
                    <label className="form-label">Notify Party</label>
                    <JEditor onChange={handleMsgChange} />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card-body row">
                  <div className="col-lg-6">
                    <label className="form-label">Buyer Bank Name</label>
                    <input
                      className="form-control"
                      value={form.buyer_bank_name}
                      onChange={(e) =>
                        handleChange("buyer_bank_name", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-lg-6">
                    <label className="form-label">SWIFT Code</label>
                    <input
                      className="form-control"
                      value={form.buyer_bank_swift}
                      onChange={(e) =>
                        handleChange("buyer_bank_swift", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-lg-6">
                    <label className="form-label">Bank Address</label>
                    <textarea
                      rows="2"
                      className="form-control"
                      value={form.buyer_bank_address}
                      onChange={(e) =>
                        handleChange("buyer_bank_address", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-lg-6">
                    <label className="form-label">Phone</label>
                    <input
                      className="form-control"
                      value={form.buyer_bank_phone}
                      onChange={(e) =>
                        handleChange("buyer_bank_phone", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="card create_tp_body">
            <div className="card-header fw-bold bg-light">
              Seller (Company) Information
            </div>

            <div className="row">
              <div className="col-lg-6">
                {" "}
                <div className="card-body row">
                  <div className="col-lg-6">
                    <label className="form-label">
                      Company <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={form.company_id}
                      onChange={(e) =>
                        handleChange("company_id", e.target.value)
                      }
                    >
                      <option value="">Select Company</option>
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-lg-6">
                    <label className="form-label">Company Address</label>
                    <textarea
                      rows="2"
                      className="form-control"
                      value={form.seller_address}
                      onChange={(e) =>
                        handleChange("seller_address", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                {" "}
                <div className="card-body row">
                  <div className="col-lg-6">
                    <label className="form-label">
                      Bank Name <span className="text-danger">*</span>
                    </label>

                    <select
                      className="form-control"
                      value={form.seller_bank_id || ""}
                      onChange={(e) =>
                        handleChange("seller_bank_id", e.target.value)
                      }
                    >
                      <option value="">Select Bank</option>
                      {banks.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-lg-6">
                    <label className="form-label">
                      SWIFT <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      value={form.seller_bank_swift}
                      onChange={(e) =>
                        handleChange("seller_bank_swift", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Bank Address</label>
                    <textarea
                      rows="2"
                      className="form-control"
                      value={form.seller_bank_address}
                      onChange={(e) =>
                        handleChange("seller_bank_address", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="card create_tp_body">
            <div className="card-header fw-bold bg-light">
              Payment & Shipment Information
            </div>
            <div className="card-body row g-3">
              <div className="col-lg-3">
                <label className="form-label">
                  Payment Terms <span className="text-danger">*</span>
                </label>

                <select
                  value={form.payment_terms}
                  onChange={(e) =>
                    handleChange("payment_terms", e.target.value)
                  }
                  name="payment_terms"
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
              <div className="col-lg-3">
                <label className="form-label">
                  Mode of Shipment <span className="text-danger">*</span>
                </label>
                <select
                  className="form-control"
                  value={form.mode_of_shipment}
                  onChange={(e) =>
                    handleChange("mode_of_shipment", e.target.value)
                  }
                >
                  <option value="">Select One</option>
                  <option value="Sea">Sea</option>
                  <option value="Air">Air</option>
                  <option value="Land">Road</option>
                  <option value="River">River</option>
                  <option value="Sea/Air">Sea/Air</option>
                  <option value="Sea/Air/Road">Sea/Air/Road</option>
                </select>
              </div>

              <div className="col-lg-3">
                <label className="form-label">Port of Loading</label>
                <CustomSelect
                  placeholder="Select"
                  onChange={(selectedOption) =>
                    handleChange("port_of_loading", selectedOption.value)
                  }
                  value={
                    bangladeshPorts.find(
                      (item) => item.title === form.port_of_loading
                    )
                      ? {
                          value: form.port_of_loading,
                          label:
                            bangladeshPorts.find(
                              (item) => item.title === form.port_of_loading
                            ).title || "",
                        }
                      : null
                  }
                  name="port_of_loading"
                  options={filteredPorts.map((item) => ({
                    value: item.title,
                    label: `${item.title} (${item.district})`,
                  }))}
                />
              </div>

              <div className="col-lg-3">
                <label className="form-label">Port of Discharge</label>

                <Autocomplete
                  className="recepient_AutoComplete"
                  multiple
                  freeSolo
                  options={filteredPorts.map((item) => item.title)} // list of port names
                  value={form.port_of_discharge || []} // ensure array
                  onChange={(event, newValue) =>
                    handleChange("port_of_discharge", newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select ports"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                        className: "custom-label",
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="card create_tp_body">
            <div className="card-header fw-bold bg-light">
              Clauses & Conditions
            </div>
            <div className="card-body row g-3">
              <div className="col-lg-12">
                <div className="form-group">
                  <label className="form-label">Documents Required</label>

                  <Autocomplete
                    className="recepient_AutoComplete"
                    multiple
                    freeSolo
                    options={docList.map((item) => item)} // list of port names
                    value={form.documents_required || []} // ensure array
                    onChange={(event, newValue) =>
                      handleChange("documents_required", newValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Doc"
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                          className: "custom-label",
                        }}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12">
                <label className="form-label">Reimbursement Instructions</label>
                <textarea
                  rows="2"
                  className="form-control"
                  value={form.reimbursement_instructions}
                  onChange={(e) =>
                    handleChange("reimbursement_instructions", e.target.value)
                  }
                />
              </div>
              <div className="col-12">
                <label className="form-label">Amendment Clause</label>
                <textarea
                  rows="2"
                  className="form-control"
                  value={form.amendment_clause}
                  onChange={(e) =>
                    handleChange("amendment_clause", e.target.value)
                  }
                />
              </div>
              <div className="col-12">
                <label className="form-label">Agent Commission Clause</label>
                <textarea
                  rows="2"
                  className="form-control"
                  value={form.agent_commission_clause}
                  onChange={(e) =>
                    handleChange("agent_commission_clause", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  useEffect(async () => {
    props.setHeaderData({
      pageName: "NEW PC",
      isNewButton: true,
      newButtonLink: "",
      newButtonText: "New PC",
      isInnerSearch: true,
      innerSearchValue: "",
    });
  }, []);

  return (
    <div className="tna_page create_technical_pack">
      <div className="tna_page_topbar mb-4">
        {steps.map((s, i) => (
          <Link
            to="#"
            key={i}
            className={`step-link ${i === activeStep ? "active" : ""}`}
          >
            {s}
          </Link>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {renderStep()}
        <div className="d-flex justify-content-between mt-4">
          {activeStep > 0 && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={prevStep}
            >
              Back
            </button>
          )}
          {activeStep < steps.length - 1 && (
            <button
              type="button"
              className="btn btn-primary ms-auto"
              onClick={nextStep}
            >
              Next
            </button>
          )}
          {activeStep === steps.length - 1 && (
            <button
              type="submit"
              className="btn btn-success ms-auto"
              disabled={spinner}
            >
              {spinner ? "Saving..." : "Save"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
