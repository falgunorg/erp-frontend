import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logos/logo-short.png";
import MultipleFileView from "./MultipleFileView";
import api from "services/api";
import { useParams, useHistory } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function PurchaseOrderDetails() {
  const params = useParams();
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);
  const [po, setPo] = useState({});
  const getPo = async () => {
    setSpinner(true);
    const response = await api.post("/pos-show", { id: params.id });
    if (response.status === 200 && response.data) {
      const poData = response.data.po;
      setPo(poData);
    }
    setSpinner(false);
  };

  useEffect(() => {
    getPo();
  }, [params.id]);

  const handleGeneratePDF = () => {
    const element = document.getElementById("pdf-content");
    const responsiveTables = element.querySelectorAll(".table-responsive");
    // Temporarily remove overflow and set height to auto
    responsiveTables.forEach((table) => {
      table.dataset.originalStyle = table.getAttribute("style") || "";
      table.style.overflow = "visible";
      table.style.maxHeight = "unset";
      table.style.height = "auto";
    });

    // Wait for layout to update
    setTimeout(() => {
      html2canvas(element, {
        scale: 2, // High quality
        useCORS: true,
        scrollY: -window.scrollY, // Optional: remove scroll offset
      }).then((canvas) => {
        // Restore original styles
        responsiveTables.forEach((table) => {
          table.setAttribute("style", table.dataset.originalStyle);
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        const fileName = po.po_number;
        pdf.save(`${fileName}.pdf`);
      });
    }, 100); // Slight delay for DOM to reflow
  };

  return (
    <div className="create_technical_pack" id="pdf-content">
      <div className="row create_tp_header align-items-center">
        <div className="col-lg-10">
          <div className="row align-items-baseline">
            <div className="col-lg-3">
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
              <div className="form-value" style={{ fontSize: "10px" }}>
                {po.po_number}
              </div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">WO Number</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value" style={{ fontSize: "10px" }}>
                {po.wo?.wo_number}
              </div>
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
              <div className="form-value" style={{ fontSize: "10px" }}>
                {po.issued_date}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Tech Pack</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value" style={{ fontSize: "10px" }}>
                {po.techpack?.techpack_number}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Destination</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value" style={{ fontSize: "10px" }}>
                {po.destination}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">PO Delivery</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value" style={{ fontSize: "10px" }}>
                {po.delivery_date}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Buyer Style Name</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value" style={{ fontSize: "10px" }}>
                {po.techpack?.buyer_style_name}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Ship Mode</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value" style={{ fontSize: "10px" }}>
                {po.ship_mode}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">PC/LC</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value" style={{ fontSize: "10px" }}>
                {po.contract?.title || "N/A"}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Name</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value" style={{ fontSize: "10px" }}>
                {po.techpack?.item_name}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Terms of Shipping</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value" style={{ fontSize: "10px" }}>
                {po.shipping_term?.title}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Factory</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value" style={{ fontSize: "10px" }}>
                {po.techpack?.company?.title}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Type</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value" style={{ fontSize: "10px" }}>
                {po.techpack?.item_type}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Packing Method</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value" style={{ fontSize: "10px" }}>
                {po.packing_method}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Buyer</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value" style={{ fontSize: "10px" }}>
                {po.techpack?.buyer?.name}
              </div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Department</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value" style={{ fontSize: "10px" }}>
                {po.techpack?.department}
              </div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Payment Terms</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value" style={{ fontSize: "10px" }}>
                {po.payment_term?.title}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Brand</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value" style={{ fontSize: "10px" }}>
                {po.techpack?.brand}
              </div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Wash Detail</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value" style={{ fontSize: "10px" }}>
                {po.techpack?.wash_details}
              </div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Total Quantity</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value" style={{ fontSize: "10px" }}>
                {po.total_qty}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Season</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value" style={{ fontSize: "10px" }}>
                {po.techpack?.season}
              </div>
            </div>

            <div className="col-lg-2"></div>
            <div className="col-lg-2"></div>

            <div className="col-lg-2">
              <label className="form-label">Total Value</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value" style={{ fontSize: "10px" }}>
                {po.total_value}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Description</label>
            </div>
            <div className="col-lg-4">
              <div className="form-value" style={{ fontSize: "10px" }}>
                {po.techpack?.description}
              </div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Special Operation</label>
            </div>
            <div className="col-lg-4">
              <div className="form-value" style={{ fontSize: "10px" }}>
                {(() => {
                  try {
                    const ops = JSON.parse(po.techpack?.special_operation);
                    return Array.isArray(ops) ? ops.join(", ") : "";
                  } catch {
                    return "";
                  }
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 15px" }} className="create_tp_attatchment">
        {/* <MultipleFileView
          label="PO Attachments"
          inputId="buyer_techpacks"
          selectedFiles={po?.files}
        /> */}
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
            {po.items?.map((item, index) => (
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
                <strong>{po.total_qty}</strong>
              </td>
              <td></td>
              <td>
                $ <strong>{po.total_value}</strong>
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
              <b>Merchant:</b> {po.user?.full_name}{" "}
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
