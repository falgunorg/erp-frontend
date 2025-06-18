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
              <span className="purchase_text">WO</span>
            </div>
            <div className="col-lg-2"></div>
            <div className="col-lg-2"></div>

            <div className="col-lg-2">
              <label className="form-label">PC/LC</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{selectedWo.pc?.title}</div>
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
              <label className="form-label">Buyer</label>
            </div>
            <div className="col-lg-4">
              <div className="form-value">{selectedWo.buyer?.name}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Factory</label>
            </div>
            <div className="col-lg-4">
              <div className="form-value">{selectedWo.company?.title}</div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Season</label>
            </div>
            <div className="col-lg-4">
              <div className="form-value">{selectedWo.season}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Year</label>
            </div>
            <div className="col-lg-4">
              <div className="form-value">{selectedWo.year}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Description</label>
            </div>
            <div className="col-lg-10">
              <div className="form-value">{selectedWo.description}</div>
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
          <h6>PO's</h6>
        </div>

        {selectedWo.pos?.length > 0 ? (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Brand</th>
                <th>Department</th>
                <th>Techpack</th>
                <th>Item name</th>
                <th>Quantity</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody>
              {selectedWo.pos?.map((item, index) => (
                <tr key={index}>
                  <td>{item.brand}</td>
                  <td>{item.department}</td>
                  <td>{item.technical_package?.techpack_number}</td>
                  <td>{item.item_name}</td>
                  <td>{item.total_qty}</td>
                  <td>${item.total_value}</td>
                </tr>
              ))}
              <br />
              <tr>
                <td>
                  <strong>Grand Total</strong>
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <strong>
                    {selectedWo.pos?.reduce(
                      (sum, item) => sum + (Number(item.total_qty) || 0),
                      0
                    )}{" "}
                    PCS
                  </strong>
                </td>
                <td>
                  $
                  <strong>
                    {selectedWo.pos
                      ?.reduce(
                        (sum, item) => sum + (Number(item.total_value) || 0),
                        0
                      )
                      .toFixed(2)}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>No Po is associated to this WorkOrder</p>
        )}
      </div>
    </div>
  );
}
