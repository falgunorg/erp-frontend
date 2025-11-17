import React, { useState } from "react";
import axios from "axios";

const CreateCommercialInvoice = () => {
  const [formData, setFormData] = useState({
    invoice_no: "",
    contract_id: "",
    pos: "",
    inv_date: "",
    exp_value: "",
    inv_discount_value: "",
    exp_no: "",
    exp_date: "",
    buyer: "",
    bank_name: "",
    bank_ref: "",
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
    firight_charge: "",
    bl_no: "",
    bl_relase_date: "",
    container_no: "",
    vessel_name: "",
    ic_received_date: "",
    bank_docs_submit_date: "",
    bank_bill_no: "",
    bank_tobank_sending_docs_courier_awb_no: "",
    buyer_bank_docs_receiveing_date: "",
    payment_tenor: "",
    proceed_realization_due_date: "",
    export_proceed_realization_value: "",
    proceed_realization_date: "",
    short_realization_value: "",
    short_realization_percentage: "",
    remarks: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    try {
      const res = await axios.post(
        "http://localhost:8000/api/commercial-invoices",
        formData
      );

      setSuccess("Invoice created successfully!");
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Create Commercial Invoice</h3>

      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="row g-3">
        {/* INVOICE NO */}
        <div className="col-md-4">
          <label className="form-label">Invoice No *</label>
          <input
            type="text"
            name="invoice_no"
            className="form-control"
            value={formData.invoice_no}
            onChange={handleChange}
          />
          {errors.invoice_no && (
            <div className="text-danger small">{errors.invoice_no[0]}</div>
          )}
        </div>

        {/* CONTRACT ID */}
        <div className="col-md-4">
          <label className="form-label">Contract ID</label>
          <input
            type="number"
            name="contract_id"
            className="form-control"
            value={formData.contract_id}
            onChange={handleChange}
          />
        </div>

        {/* POS */}
        <div className="col-md-4">
          <label className="form-label">POS</label>
          <input
            type="number"
            name="pos"
            className="form-control"
            value={formData.pos}
            onChange={handleChange}
          />
        </div>

        {/* INV DATE */}
        <div className="col-md-4">
          <label className="form-label">Invoice Date</label>
          <input
            type="date"
            name="inv_date"
            className="form-control"
            value={formData.inv_date}
            onChange={handleChange}
          />
        </div>

        {/* EXP VALUE */}
        <div className="col-md-4">
          <label className="form-label">Export Value</label>
          <input
            type="number"
            step="0.01"
            name="exp_value"
            className="form-control"
            value={formData.exp_value}
            onChange={handleChange}
          />
        </div>

        {/* INV DISCOUNT */}
        <div className="col-md-4">
          <label className="form-label">Invoice Discount Value</label>
          <input
            type="number"
            step="0.01"
            name="inv_discount_value"
            className="form-control"
            value={formData.inv_discount_value}
            onChange={handleChange}
          />
        </div>

        {/* EXP NO */}
        <div className="col-md-4">
          <label className="form-label">EXP No</label>
          <input
            type="text"
            name="exp_no"
            className="form-control"
            value={formData.exp_no}
            onChange={handleChange}
          />
        </div>

        {/* EXP DATE */}
        <div className="col-md-4">
          <label className="form-label">EXP Date</label>
          <input
            type="date"
            name="exp_date"
            className="form-control"
            value={formData.exp_date}
            onChange={handleChange}
          />
        </div>

        {/* BUYER */}
        <div className="col-md-4">
          <label className="form-label">Buyer</label>
          <input
            type="text"
            name="buyer"
            className="form-control"
            value={formData.buyer}
            onChange={handleChange}
          />
        </div>

        {/* BANK NAME */}
        <div className="col-md-4">
          <label className="form-label">Bank Name</label>
          <input
            type="text"
            name="bank_name"
            className="form-control"
            value={formData.bank_name}
            onChange={handleChange}
          />
        </div>

        {/* BANK REF */}
        <div className="col-md-4">
          <label className="form-label">Bank Reference</label>
          <input
            type="text"
            name="bank_ref"
            className="form-control"
            value={formData.bank_ref}
            onChange={handleChange}
          />
        </div>

        {/* QTY */}
        <div className="col-md-4">
          <label className="form-label">Quantity</label>
          <input
            type="number"
            step="0.01"
            name="qty"
            className="form-control"
            value={formData.qty}
            onChange={handleChange}
          />
        </div>

        {/* CTNS QTY */}
        <div className="col-md-4">
          <label className="form-label">CTNS Quantity</label>
          <input
            type="number"
            step="0.01"
            name="ctns_qty"
            className="form-control"
            value={formData.ctns_qty}
            onChange={handleChange}
          />
        </div>

        {/* EP NO */}
        <div className="col-md-4">
          <label className="form-label">EP No</label>
          <input
            type="text"
            name="ep_no"
            className="form-control"
            value={formData.ep_no}
            onChange={handleChange}
          />
        </div>

        {/* EP DATE */}
        <div className="col-md-4">
          <label className="form-label">EP Date</label>
          <input
            type="date"
            name="ep_date"
            className="form-control"
            value={formData.ep_date}
            onChange={handleChange}
          />
        </div>

        {/* EXPORT SHIPPING BILL NO */}
        <div className="col-md-4">
          <label className="form-label">Export Shipping Bill No</label>
          <input
            type="text"
            name="export_shipping_bill_no"
            className="form-control"
            value={formData.export_shipping_bill_no}
            onChange={handleChange}
          />
        </div>

        {/* SHIPPING BILL DATE */}
        <div className="col-md-4">
          <label className="form-label">Shipping Bill Date</label>
          <input
            type="date"
            name="shipping_bill_date"
            className="form-control"
            value={formData.shipping_bill_date}
            onChange={handleChange}
          />
        </div>

        {/* EX FACTORY DATE */}
        <div className="col-md-4">
          <label className="form-label">Ex Factory Date</label>
          <input
            type="date"
            name="ex_factory_date"
            className="form-control"
            value={formData.ex_factory_date}
            onChange={handleChange}
          />
        </div>

        {/* MODE OF SHIPMENT */}
        <div className="col-md-4">
          <label className="form-label">Mode of Shipment</label>
          <input
            type="text"
            name="mode_of_shipment"
            className="form-control"
            value={formData.mode_of_shipment}
            onChange={handleChange}
          />
        </div>

        {/* DESTINATION COUNTRY */}
        <div className="col-md-4">
          <label className="form-label">Destination Country</label>
          <input
            type="text"
            name="destination_country"
            className="form-control"
            value={formData.destination_country}
            onChange={handleChange}
          />
        </div>

        {/* FORWARDER */}
        <div className="col-md-4">
          <label className="form-label">Forwarder</label>
          <input
            type="text"
            name="forwarder"
            className="form-control"
            value={formData.forwarder}
            onChange={handleChange}
          />
        </div>

        {/* ONBOARD DATE */}
        <div className="col-md-4">
          <label className="form-label">Onboard Date</label>
          <input
            type="date"
            name="onboard_date"
            className="form-control"
            value={formData.onboard_date}
            onChange={handleChange}
          />
        </div>

        {/* FREIGHT CHARGE */}
        <div className="col-md-4">
          <label className="form-label">Freight Charge</label>
          <input
            type="number"
            step="0.01"
            name="firight_charge"
            className="form-control"
            value={formData.firight_charge}
            onChange={handleChange}
          />
        </div>

        {/* BL NO */}
        <div className="col-md-4">
          <label className="form-label">BL No</label>
          <input
            type="text"
            name="bl_no"
            className="form-control"
            value={formData.bl_no}
            onChange={handleChange}
          />
        </div>

        {/* BL RELEASE DATE */}
        <div className="col-md-4">
          <label className="form-label">BL Release Date</label>
          <input
            type="date"
            name="bl_relase_date"
            className="form-control"
            value={formData.bl_relase_date}
            onChange={handleChange}
          />
        </div>

        {/* CONTAINER NO */}
        <div className="col-md-4">
          <label className="form-label">Container No</label>
          <input
            type="text"
            name="container_no"
            className="form-control"
            value={formData.container_no}
            onChange={handleChange}
          />
        </div>

        {/* VESSEL NAME */}
        <div className="col-md-4">
          <label className="form-label">Vessel Name</label>
          <input
            type="text"
            name="vessel_name"
            className="form-control"
            value={formData.vessel_name}
            onChange={handleChange}
          />
        </div>

        {/* IC RECEIVED DATE */}
        <div className="col-md-4">
          <label className="form-label">IC Received Date</label>
          <input
            type="date"
            name="ic_received_date"
            className="form-control"
            value={formData.ic_received_date}
            onChange={handleChange}
          />
        </div>

        {/* BANK DOC SUBMIT DATE */}
        <div className="col-md-4">
          <label className="form-label">Bank Docs Submit Date</label>
          <input
            type="date"
            name="bank_docs_submit_date"
            className="form-control"
            value={formData.bank_docs_submit_date}
            onChange={handleChange}
          />
        </div>

        {/* BANK BILL NO */}
        <div className="col-md-4">
          <label className="form-label">Bank Bill No</label>
          <input
            type="text"
            name="bank_bill_no"
            className="form-control"
            value={formData.bank_bill_no}
            onChange={handleChange}
          />
        </div>

        {/* COURIER AWB NO */}
        <div className="col-md-4">
          <label className="form-label">Courier AWB No</label>
          <input
            type="text"
            name="bank_tobank_sending_docs_courier_awb_no"
            className="form-control"
            value={formData.bank_tobank_sending_docs_courier_awb_no}
            onChange={handleChange}
          />
        </div>

        {/* BUYER BANK DOC RECEIVING DATE */}
        <div className="col-md-4">
          <label className="form-label">Buyer Bank Docs Receiving Date</label>
          <input
            type="date"
            name="buyer_bank_docs_receiveing_date"
            className="form-control"
            value={formData.buyer_bank_docs_receiveing_date}
            onChange={handleChange}
          />
        </div>

        {/* PAYMENT TENOR */}
        <div className="col-md-4">
          <label className="form-label">Payment Tenor</label>
          <input
            type="text"
            name="payment_tenor"
            className="form-control"
            value={formData.payment_tenor}
            onChange={handleChange}
          />
        </div>

        {/* PROCEED REALIZATION DUE DATE */}
        <div className="col-md-4">
          <label className="form-label">Proceed Realization Due Date</label>
          <input
            type="date"
            name="proceed_realization_due_date"
            className="form-control"
            value={formData.proceed_realization_due_date}
            onChange={handleChange}
          />
        </div>

        {/* EXPORT PROCEED REALIZATION VALUE */}
        <div className="col-md-4">
          <label className="form-label">Export Proceed Realization Value</label>
          <input
            type="number"
            step="0.01"
            name="export_proceed_realization_value"
            className="form-control"
            value={formData.export_proceed_realization_value}
            onChange={handleChange}
          />
        </div>

        {/* PROCEED REALIZATION DATE */}
        <div className="col-md-4">
          <label className="form-label">Proceed Realization Date</label>
          <input
            type="date"
            name="proceed_realization_date"
            className="form-control"
            value={formData.proceed_realization_date}
            onChange={handleChange}
          />
        </div>

        {/* SHORT REALIZATION VALUE */}
        <div className="col-md-4">
          <label className="form-label">Short Realization Value</label>
          <input
            type="number"
            step="0.01"
            name="short_realization_value"
            className="form-control"
            value={formData.short_realization_value}
            onChange={handleChange}
          />
        </div>

        {/* SHORT REALIZATION % */}
        <div className="col-md-4">
          <label className="form-label">Short Realization %</label>
          <input
            type="number"
            step="0.01"
            name="short_realization_percentage"
            className="form-control"
            value={formData.short_realization_percentage}
            onChange={handleChange}
          />
        </div>

        {/* REMARKS */}
        <div className="col-md-12">
          <label className="form-label">Remarks</label>
          <textarea
            name="remarks"
            className="form-control"
            rows="3"
            value={formData.remarks}
            onChange={handleChange}
          />
        </div>

        {/* SUBMIT BUTTON */}
        <div className="col-12">
          <button type="submit" className="btn btn-primary px-4">
            Create Invoice
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCommercialInvoice;
