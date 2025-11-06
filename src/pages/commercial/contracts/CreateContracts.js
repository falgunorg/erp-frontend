import React, { useState, useEffect } from "react";
import api from "services/api";
import swal from "sweetalert";
import Logo from "../../../assets/images/logos/logo-short.png";
import { useHistory, Link } from "react-router-dom";
import CustomSelect from "elements/CustomSelect";

export default function CreateContracts(props) {
  const history = useHistory();

  const [buyers, setBuyers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [spinner, setSpinner] = useState(false);

  const [banks, setBanks] = useState([]);

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
    contract_type: "fob",
    buyer_id: "",
    buyer_address: "",
    buyer_phone: "",
    buyer_email: "",
    notify_party: "",
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

  // Step validation logic
  const validateStep = () => {
    switch (activeStep) {
      case 0:
        return form.title && form.contract_date && form.contract_type;
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
      const res = await api.post("/commercial/contracts/create", fd);
      if (res.status === 200) {
        swal("Success!", "Purchase contract saved successfully.", "success");
        history.push(`/commercial/contracts/details/${res.data?.id || 0}`);
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
              <div className="col-lg-6">
                <label className="form-label">
                  Contract No <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
              </div>
              <div className="col-lg-3">
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
              <div className="col-lg-3">
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
                  <div className="col-lg-6">
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
                  <div className="col-lg-6">
                    <label className="form-label">Notify Party</label>
                    <textarea
                      rows="2"
                      className="form-control"
                      value={form.notify_party}
                      onChange={(e) =>
                        handleChange("notify_party", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card-body row">
                  <div className="col-lg-6">
                    <label className="form-label">Bank Name</label>
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
                <input
                  className="form-control"
                  value={form.payment_terms}
                  onChange={(e) =>
                    handleChange("payment_terms", e.target.value)
                  }
                />
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
                  <option value="Road">Road</option>
                </select>
              </div>
              <div className="col-lg-3">
                <label className="form-label">
                  Port of Loading <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  value={form.port_of_loading}
                  onChange={(e) =>
                    handleChange("port_of_loading", e.target.value)
                  }
                />
              </div>
              <div className="col-lg-3">
                <label className="form-label">
                  Port of Discharge <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  value={form.port_of_discharge}
                  onChange={(e) =>
                    handleChange("port_of_discharge", e.target.value)
                  }
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
                  <CustomSelect
                    isMulti
                    name="documents_required"
                    placeholder="Select or Search"
                    value={(form.documents_required || []).map((d) => ({
                      value: d,
                      label: d,
                    }))}
                    onChange={(selected) =>
                      handleChange(
                        "documents_required",
                        selected ? selected.map((s) => s.value) : []
                      )
                    }
                    options={docList.map((doc) => ({
                      value: doc,
                      label: doc,
                    }))}
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
