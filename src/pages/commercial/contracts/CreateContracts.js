import React, { useState, useEffect } from "react";
import api from "services/api";
import swal from "sweetalert";
import Select from "react-select";
import Logo from "../../../assets/images/logos/logo-short.png";
import { useHistory } from "react-router-dom";

export default function CreatePurchaseContract({ toggleExpanded }) {
  const history = useHistory();
  const goBack = () => history.goBack();

  const [buyers, setBuyers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [banks, setBanks] = useState([]);
  const [agents, setAgents] = useState([]);
  const [spinner, setSpinner] = useState(false);

  const [form, setForm] = useState({
    contract_no: "",
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
    seller_bank_name: "",
    seller_bank_address: "",
    seller_bank_swift: "",
    payment_terms: "",
    port_of_loading: "",
    port_of_discharge: "",
    mode_of_shipment: "",
    documents_required: "",
    reimbursement_instructions: "",
    amendment_clause: "",
    agent_commission_clause: "",
  });

  const [goods, setGoods] = useState([
    {
      style: "",
      po: "",
      description: "",
      quantity: "",
      unit_price: "",
      total_fob: "",
      shipment_date: "",
    },
  ]);

  const steps = [
    "Contract Details",
    "Buyer Information",
    "Buyer Bank Information",
    "Seller (Company) Information",
    "Seller Bank Information",
    "Payment & Shipment Information",
    "Particulars of Goods / Services",
    "Clauses & Conditions",
  ];

  const [activeStep, setActiveStep] = useState(0);

  // Fetch common data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [b, c, a, bk] = await Promise.all([
          api.post("/common/buyers"),
          api.post("/common/companies"),
          api.post("/common/agents"),
          api.post("/common/banks"),
        ]);
        setBuyers(b.data.data || []);
        setCompanies(c.data.data || []);
        setAgents(a.data.data || []);
        setBanks(bk.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleGoodsChange = (index, name, value) => {
    setGoods((prevGoods) => {
      const updated = [...prevGoods];
      const row = { ...updated[index], [name]: value };
      if (name === "quantity" || name === "unit_price") {
        const quantity = parseFloat(row.quantity) || 0;
        const unit_price = parseFloat(row.unit_price) || 0;
        row.total_fob = (quantity * unit_price).toFixed(2);
      }
      updated[index] = row;
      return updated;
    });
  };

  const addGoodsRow = () =>
    setGoods((prev) => [
      ...prev,
      {
        style: "",
        po: "",
        description: "",
        quantity: "",
        unit_price: "",
        total_fob: "",
        shipment_date: "",
      },
    ]);

  const removeGoodsRow = (index) =>
    setGoods((prev) => prev.filter((_, i) => i !== index));

  // Step validation
  const validateStep = () => {
    switch (activeStep) {
      case 0:
        return form.contract_no && form.contract_date && form.contract_type;
      case 1:
        return form.buyer_id && form.buyer_phone && form.buyer_email;
      case 2:
        return form.buyer_bank_name && form.buyer_bank_swift;
      case 3:
        return form.company_id && form.seller_address;
      case 4:
        return form.seller_bank_name && form.seller_bank_swift;
      case 5:
        return form.payment_terms && form.mode_of_shipment;
      case 6:
        return (
          goods.length > 0 &&
          goods.every((g) => g.description && g.quantity && g.unit_price)
        );
      case 7:
        return (
          form.reimbursement_instructions ||
          form.amendment_clause ||
          form.agent_commission_clause
        );
      default:
        return true;
    }
  };

  const nextStep = () => {
    // if (!validateStep()) {
    //   swal("Error", "Please fill all required fields for this step!", "error");
    //   return;
    // }
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSpinner(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v || ""));
      fd.append("goods", JSON.stringify(goods));
      const res = await api.post(
        "/merchandising/purchase-contracts-create",
        fd
      );
      if (res.status === 200)
        swal("Success!", "Purchase contract saved.", "success");
    } catch (err) {
      swal("Error!", "Failed to save purchase contract.", "error");
    } finally {
      setSpinner(false);
    }
  };

  // Step rendering
  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="card create_tp_body">
            <div className="card-header fw-bold bg-light">Contract Details</div>
            <div className="card-body row">
              <div className="col-lg-6">
                <label className="form-label">Contract No</label>
                <input
                  className="form-control"
                  value={form.contract_no}
                  onChange={(e) => handleChange("contract_no", e.target.value)}
                />
              </div>
              <div className="col-lg-3">
                <label className="form-label">Contract Date</label>
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
                <label className="form-label">Contract Type</label>
                <select
                  className="form-control"
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
            <div className="card-body row g-3">
              <div className="col-lg-4">
                <label className="form-label">Buyer</label>
                <Select
                  options={buyers.map((b) => ({ value: b.id, label: b.name }))}
                  onChange={(opt) => handleChange("buyer_id", opt.value)}
                />
              </div>
              <div className="col-lg-4">
                <label className="form-label">Buyer Phone</label>
                <input
                  className="form-control"
                  value={form.buyer_phone}
                  onChange={(e) => handleChange("buyer_phone", e.target.value)}
                />
              </div>
              <div className="col-lg-4">
                <label className="form-label">Buyer Email</label>
                <input
                  className="form-control"
                  value={form.buyer_email}
                  onChange={(e) => handleChange("buyer_email", e.target.value)}
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
                  onChange={(e) => handleChange("notify_party", e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="card create_tp_body">
            <div className="card-header fw-bold bg-light">
              Buyer Bank Information
            </div>
            <div className="card-body row g-3">
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
        );
      case 3:
        return (
          <div className="card create_tp_body">
            <div className="card-header fw-bold bg-light">
              Seller (Company) Information
            </div>
            <div className="card-body row g-3">
              <div className="col-lg-6">
                <label className="form-label">Company</label>
                <Select
                  options={companies.map((c) => ({
                    value: c.id,
                    label: c.title,
                  }))}
                  onChange={(opt) => handleChange("company_id", opt.value)}
                />
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
        );
      case 4:
        return (
          <div className="card create_tp_body">
            <div className="card-header fw-bold bg-light">
              Seller Bank Information
            </div>
            <div className="card-body row g-3">
              <div className="col-lg-6">
                <label className="form-label">Bank Name</label>
                <input
                  className="form-control"
                  value={form.seller_bank_name}
                  onChange={(e) =>
                    handleChange("seller_bank_name", e.target.value)
                  }
                />
              </div>
              <div className="col-lg-6">
                <label className="form-label">SWIFT</label>
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
        );
      case 5:
        return (
          <div className="card create_tp_body">
            <div className="card-header fw-bold bg-light">
              Payment & Shipment Information
            </div>
            <div className="card-body row g-3">
              <div className="col-lg-3">
                <label className="form-label">Payment Terms</label>
                <input
                  className="form-control"
                  value={form.payment_terms}
                  onChange={(e) =>
                    handleChange("payment_terms", e.target.value)
                  }
                />
              </div>
              <div className="col-lg-3">
                <label className="form-label">Mode of Shipment</label>
                <input
                  className="form-control"
                  value={form.mode_of_shipment}
                  onChange={(e) =>
                    handleChange("mode_of_shipment", e.target.value)
                  }
                />
              </div>
              <div className="col-lg-3">
                <label className="form-label">Port of Loading</label>
                <input
                  className="form-control"
                  value={form.port_of_loading}
                  onChange={(e) =>
                    handleChange("port_of_loading", e.target.value)
                  }
                />
              </div>
              <div className="col-lg-3">
                <label className="form-label">Port of Discharge</label>
                <input
                  className="form-control"
                  value={form.port_of_discharge}
                  onChange={(e) =>
                    handleChange("port_of_discharge", e.target.value)
                  }
                />
              </div>
              <div className="col-12">
                <label className="form-label">Documents Required</label>
                <textarea
                  rows="2"
                  className="form-control"
                  value={form.documents_required}
                  onChange={(e) =>
                    handleChange("documents_required", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="card create_tp_body">
            <div className="card-header fw-bold bg-light">
              Particulars of Goods / Services
            </div>
            <div className="card-body table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Style</th>
                    <th>PO</th>
                    <th>Description</th>
                    <th>Qty (PCS)</th>
                    <th>Unit Price</th>
                    <th>Total FOB</th>
                    <th>Shipment Date</th>
                    <th style={{ width: "50px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {goods.map((row, i) => (
                    <tr key={i}>
                      <td>
                        <input
                          className="form-control"
                          value={row.style}
                          onChange={(e) =>
                            handleGoodsChange(i, "style", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          value={row.po}
                          onChange={(e) =>
                            handleGoodsChange(i, "po", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          value={row.description}
                          onChange={(e) =>
                            handleGoodsChange(i, "description", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          value={row.quantity}
                          onChange={(e) =>
                            handleGoodsChange(i, "quantity", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="form-control"
                          value={row.unit_price}
                          onChange={(e) =>
                            handleGoodsChange(i, "unit_price", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="form-control"
                          value={row.total_fob}
                          readOnly
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          className="form-control"
                          value={row.shipment_date}
                          onChange={(e) =>
                            handleGoodsChange(
                              i,
                              "shipment_date",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="text-center">
                        {i > 0 && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeGoodsRow(i)}
                          >
                            ✕
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="table-light fw-bold">
                  <tr>
                    <td colSpan="3" className="text-end">
                      Grand Total:
                    </td>
                    <td>
                      {goods.reduce(
                        (sum, r) => sum + (parseFloat(r.quantity) || 0),
                        0
                      )}
                    </td>
                    <td></td>
                    <td>
                      {goods
                        .reduce(
                          (sum, r) =>
                            sum +
                            (parseFloat(r.quantity) || 0) *
                              (parseFloat(r.unit_price) || 0),
                          0
                        )
                        .toFixed(2)}
                    </td>
                    <td colSpan="2"></td>
                  </tr>
                </tfoot>
              </table>
              <div className="text-end">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={addGoodsRow}
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="card create_tp_body">
            <div className="card-header fw-bold bg-light">
              Clauses & Conditions
            </div>
            <div className="card-body row g-3">
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

  return (
    <div className="">
      <div className="d-flex align-items-center mb-4">
        <i
          onClick={goBack}
          className="fa fa-angle-left me-3"
          style={{ fontSize: 25, cursor: "pointer" }}
        />
        <img src={Logo} alt="Logo" style={{ width: 35, marginRight: 10 }} />
        <h4 className="m-0">Create Purchase Contract</h4>
      </div>

      {/* Step Indicator */}
      <div className="mb-4 d-flex">
        {steps.map((s, i) => (
          <div
            key={i}
            className={`flex-fill text-center py-2 ${
              i === activeStep ? "bg-primary text-white" : "bg-light"
            }`}
          >
            {s}
          </div>
        ))}
      </div>
      <hr />

      <form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between mt-3">
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
              {spinner ? "Saving..." : "Create Purchase Contract"}
            </button>
          )}
        </div>
        {renderStep()}
      </form>
    </div>
  );
}
