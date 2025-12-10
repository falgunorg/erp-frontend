import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "services/api";
import CustomSelect from "elements/CustomSelect";

const emptyForm = {
  contract_id: "",
  style_po_no: "",
  item_name: "",
  order_buyer: "",
  export_lc_contract_no: "",
  bank_name: "",
  invoice_no: "",
  inv_date: "",
  pcs_qty: "",
  ctns_qty: "",
  exp_no: "",
  exp_date: "",
  exp_value: "",
  ep_no: "",
  ep_date: "",
  export_shipping_bill_no: "",
  shipping_bill_date: "",
  ex_factory_date: "",
  mode_of_shipment: "",
  destination_country: "",
  carrier_forwarder_name: "",
  bl_no: "",
  shipped_onboard_date: "",
  bl_release_date: "",
  container_no: "",
  vessel_name: "",
  bank_docs_sub_date: "",
  bank_bill_no: "",
  bank_to_bank_sending_docs_courier_awb_no: "",
  courier_awb_date: "",
  export_proceed_realization_value: "",
  proceed_realization_date: "",
  short_realization_value: "",
  short_realization_percentage: "",
  freight_charges_air_prepaid: "",
  fob_value: "",
  discount_value: "",
  gross_weight_kg: "",
  net_weight_kg: "",
  payment_tenor: "",
  packing_list_rcvd_date: "",
  ic_received_date: "",
  remarks: "",
};

export default function CommercialInvoiceCreate(props) {
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [contracts, setContracts] = useState([]);
  const history = useHistory();

  const shippingModes = ["Sea", "Air", "Land", "River", "Sea/Air"];
  const draftAts = ["AT SIGHT", "60 DAYS", "90 DAYS", "120 DAYS"];

  useEffect(() => {
    props.setHeaderData({
      pageName: "NEW INVOICE",
      isNewButton: true,
      newButtonText: "NEW INVOICE",
    });
  }, []);

  /** Load Contracts */
  useEffect(() => {
    api
      .post("/commercial/contracts")
      .then((res) => setContracts(res.data.data || []))
      .catch(() => {});
  }, []);

  /** Change Handler */
  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleInputChange = (e) => {
    handleChange(e.target.name, e.target.value);
  };

  /** Basic Validate */
  const validate = () => {
    let e = {};
    if (!form.contract_id) e.contract_id = "Contract ID is required";
    if (!form.invoice_no) e.invoice_no = "Invoice No is required";
    if (!form.inv_date) e.inv_date = "Invoice date required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /** Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      formData.append(key, val ?? "");
    });

    setSaving(true);
    try {
      const res = await api.post("/commercial/commercial-invoices", formData);

      if (res.status === 201) {
        history.push("/commercial/invoices");
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        alert("Something went wrong");
      }
    } finally {
      setSaving(false);
    }
  };

  /** Render Helpers */
  const renderInput = (name, label, type = "text") => (
    <div className="col-md-2 create_tp_body">
      <label className="form-label">{label}</label>
      <input
        className={`form-control ${errors[name] ? "is-invalid" : ""}`}
        type={type}
        name={name}
        value={form[name] || ""}
        onChange={handleInputChange}
      />
      {errors[name] && <small className="text-danger">{errors[name]}</small>}
    </div>
  );

  const renderSelect = (name, label, options) => (
    <div className="col-md-2 create_tp_body">
      <label className="form-label">{label}</label>
      <CustomSelect
        options={options}
        value={options.find((x) => String(x.value) === String(form[name]))}
        onChange={(e) => handleChange(name, e ? e.value : "")}
        placeholder={`Select ${label}`}
      />
      {errors[name] && <small className="text-danger">{errors[name]}</small>}
    </div>
  );

  return (
    <div className="container-fluid create_technical_pack">
      <form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-end mb-3">
          <button className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setForm({ ...emptyForm });
              setErrors({});
            }}
          >
            Reset
          </button>
        </div>

        <div className="row">
          {renderSelect(
            "contract_id",
            "EXP LC / CONTRACT *",
            contracts.map((c) => ({ value: c.id, label: c.title }))
          )}

          {renderInput("style_po_no", "Style / PO No")}
          {renderInput("item_name", "Item Name")}
          {renderInput("order_buyer", "Order Buyer")}
          {renderInput("export_lc_contract_no", "Export LC / Contract No")}
          {renderInput("bank_name", "Bank Name")}

          {renderInput("invoice_no", "Invoice No *")}
          {renderInput("inv_date", "Invoice Date *", "date")}

          {renderInput("pcs_qty", "PCS Qty", "number")}
          {renderInput("ctns_qty", "CTNS Qty", "number")}

          {renderInput("exp_no", "EXP No")}
          {renderInput("exp_date", "EXP Date", "date")}
          {renderInput("exp_value", "EXP Value", "number")}

          {renderInput("ep_no", "EP No")}
          {renderInput("ep_date", "EP Date", "date")}

          {renderInput("export_shipping_bill_no", "Shipping Bill No")}
          {renderInput("shipping_bill_date", "Shipping Bill Date", "date")}
          {renderInput("ex_factory_date", "Ex-Factory Date", "date")}

          {renderSelect(
            "mode_of_shipment",
            "Mode Of Shipment",
            shippingModes.map((m) => ({ value: m, label: m }))
          )}

          {renderInput("destination_country", "Destination Country")}
          {renderInput("carrier_forwarder_name", "Carrier / Forwarder")}
          {renderInput("bl_no", "BL No")}
          {renderInput("shipped_onboard_date", "Shipped Onboard Date", "date")}
          {renderInput("bl_release_date", "BL Release Date", "date")}
          {renderInput("container_no", "Container No")}
          {renderInput("vessel_name", "Vessel Name")}

          {renderInput("bank_docs_sub_date", "Bank Docs Submit Date", "date")}
          {renderInput("bank_bill_no", "Bank Bill No")}
          {renderInput(
            "bank_to_bank_sending_docs_courier_awb_no",
            "Courier AWB No"
          )}
          {renderInput("courier_awb_date", "Courier AWB Date", "date")}

          {renderInput(
            "export_proceed_realization_value",
            "Export Proceed Realization Value",
            "number"
          )}
          {renderInput(
            "proceed_realization_date",
            "Proceed Realization Date",
            "date"
          )}
          {renderInput(
            "short_realization_value",
            "Short Realization Value",
            "number"
          )}
          {renderInput(
            "short_realization_percentage",
            "Short Realization %",
            "number"
          )}

          {renderInput(
            "freight_charges_air_prepaid",
            "Freight Prepaid",
            "number"
          )}
          {renderInput("fob_value", "FOB Value", "number")}
          {renderInput("discount_value", "Discount Value", "number")}
          {renderInput("gross_weight_kg", "Gross Weight (KG)", "number")}
          {renderInput("net_weight_kg", "Net Weight (KG)", "number")}

          {renderSelect(
            "payment_tenor",
            "Payment Tenor",
            draftAts.map((d) => ({ value: d, label: d }))
          )}

          {renderInput(
            "packing_list_rcvd_date",
            "Packing List Received",
            "date"
          )}
          {renderInput("ic_received_date", "IC Received", "date")}

          {/* Remarks */}
          <div className="col-12 mb-3">
            <label>Remarks</label>
            <textarea
              name="remarks"
              className={`form-control ${errors.remarks ? "is-invalid" : ""}`}
              rows="3"
              value={form.remarks}
              onChange={handleInputChange}
            />
            {errors.remarks && (
              <small className="text-danger">{errors.remarks}</small>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
