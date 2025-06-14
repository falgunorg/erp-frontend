import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logos/logo-short.png";
import Select, { components } from "react-select";
import api from "services/api";
import html2pdf from "html2pdf.js";

export default function WorkOrderDetails({ selectedWo }) {
  const poRef = React.useRef();
  const handleGeneratePDF = () => {
    const element = poRef.current;
    const opt = {
      margin: 0.2,
      filename: selectedWo.po_number + ".pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="create_technical_pack" ref={poRef}>
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
              <div className="form-value">{selectedWo.po_number}</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">WO Number</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{selectedWo.wo_id}</div>
            </div>
          </div>
        </div>
        <div className="col-lg-2">
          <button
            onClick={handleGeneratePDF}
            className="btn btn-default submit_button"
          >
            {" "}
            PDF{" "}
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
              <div className="form-value">{selectedWo.issued_date}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Tech Pack</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">
                {selectedWo.technical_package?.techpack_number}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Destination</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{selectedWo.destination}</div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">PO Delivery</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{selectedWo.delivery_date}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Buyer Style Name</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{selectedWo.buyer_style_name}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Ship Mode</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{selectedWo.ship_mode}</div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">PC/LC</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">
                {selectedWo.purchase_contract?.title ||
                  selectedWo.purchase_contract_id}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Name</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{selectedWo.item_name}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Terms of Shipping</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{selectedWo.shipping_terms}</div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Factory</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{selectedWo.company?.title}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Type</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{selectedWo.item_type}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Packing Method</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{selectedWo.packing_method}</div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Buyer</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{selectedWo.buyer?.name}</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Department</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{selectedWo.department}</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Payment Terms</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{selectedWo.payment_terms}</div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Brand</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{selectedWo.brand}</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Wash Detail</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{selectedWo.wash_details}</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Total Quantity</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{selectedWo.total_qty}</div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Season</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{selectedWo.season}</div>
            </div>

            <div className="col-lg-2"></div>
            <div className="col-lg-2"></div>

            <div className="col-lg-2">
              <label className="form-label">Total Value</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{selectedWo.total_value}</div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Description</label>
            </div>
            <div className="col-lg-4">
              <div className="form-value">{selectedWo.description}</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Special Operation</label>
            </div>
            <div className="col-lg-4">
              <div className="form-value">{selectedWo.special_operations}</div>
            </div>
          </div>
        </div>
      </div>

      <br />
      <div
        style={{ padding: "0 15px" }}
        className="create_tp_materials_area create_tp_body"
      >
        <div className="d-flex justify-content-between">
          <h6>PO Details</h6>
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
            {selectedWo.items?.map((item, index) => (
              <tr key={index}>
                <td>{item.color}</td>
                <td>{item.size}</td>
                <td>{item.inseam}</td>
                <td>{item.qty}</td>
                <td>{item.fob}</td>
                <td>{item.total}</td>
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
                <strong>{selectedWo.total_qty}</strong>
              </td>
              <td></td>
              <td>
                $ <strong>{selectedWo.total_value}</strong>
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
              <b>Merchant:</b> {selectedWo.user?.full_name}{" "}
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
