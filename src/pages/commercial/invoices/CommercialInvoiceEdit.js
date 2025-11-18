import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

const emptyForm = {
  user_id: "",
  contract_id: "",
  invoice_no: "",
  inv_date: "",
  exp_value: "",
  inv_discount_value: "",
  exp_no: "",
  exp_date: "",
  pos: "",
  buyer_id: "",
  bank_id: "",
  qty: "",
  ctns_qty: "",
  ep_no: "",
  ep_date: "",
  export_shipping_bill_no: "",
  shipping_bill_date: "",
  ex_factory_date: "",
  mode_of_shipment: "",
  destination_country: "",
  forwarder: "",
  onboard_date: "",
  freight_charge: "",
  bl_no: "",
  bl_relase_date: "",
  container_no: "",
  vessel_name: "",
  ic_received_date: "",
  bank_docs_submit_date: "",
  bank_bill_no: "",
  bank_to_bank_sending_docs_courier_awb_no: "",
  buyer_bank_docs_receiveing_date: "",
  payment_tenor: "",
  proceed_realization_due_date: "",
  export_proceed_realization_value: "",
  proceed_realization_date: "",
  short_realization_value: "",
  short_realization_percentage: "",
  remarks: "",
};

const CommercialInvoiceEdit = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/commercial/commercial-invoices/${id}`);
        const data = await res.json();
        setForm({ ...emptyForm, ...data });
      } catch (err) {
        alert("Failed to load invoice");
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.contract_id) return "Contract ID is required";
    if (!form.invoice_no) return "Invoice No is required";
    if (!form.inv_date) return "Invoice Date is required";
    if (!form.qty) return "Quantity is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      alert(err);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/commercial/commercial-invoices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        alert("Update failed: " + (body.message || res.statusText));
        setSaving(false);
        return;
      }

      alert("Invoice updated");
      history.push(`/commercial/invoices/${id}`);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <p>Loading...</p>;

  const renderInput = (name, label, type = "text") => (
    <div className="mb-3 col-md-6" key={name}>
      <label className="form-label">{label}</label>
      <input
        type={type}
        className="form-control"
        name={name}
        value={form[name] ?? ""}
        onChange={handleChange}
      />
    </div>
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Edit Invoice #{form.invoice_no}</h4>
      </div>

      <div className="card p-3">
        <form onSubmit={handleSubmit}>
          <div className="row">
            {Object.keys(form).map((key) =>
              ["id", "created_at", "updated_at"].includes(key)
                ? null
                : renderInput(
                    key,
                    key.replace(/_/g, " ").toUpperCase(),
                    key.includes("date")
                      ? "date"
                      : key === "qty" ||
                        key.includes("value") ||
                        key.includes("charge") ||
                        key.includes("percentage")
                      ? "number"
                      : "text"
                  )
            )}
            <div className="mb-3 col-12">
              <label className="form-label">Remarks</label>
              <textarea
                className="form-control"
                name="remarks"
                value={form.remarks ?? ""}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Update Invoice"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => history.goBack(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommercialInvoiceEdit;
