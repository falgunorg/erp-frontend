import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logos/logo-short.png";

import api from "services/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { useParams, useHistory, Link } from "react-router-dom";

export default function WorkOrderDetails() {
  const params = useParams();
  const history = useHistory();

  const [workorder, setWorkorder] = useState([]);
  const getWorkorder = async () => {
    const response = await api.post("/workorders-show", { id: params.id });
    if (response.status === 200 && response.data) {
      const data = response.data.workorder;
      setWorkorder(data);
    }
  };

  useEffect(() => {
    getWorkorder();
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
        const fileName = workorder.wo_number;
        pdf.save(`${fileName}.pdf`);
      });
    }, 100); // Slight delay for DOM to reflow
  };

  return (
    <div className="create_technical_pack" id="pdf-content">
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
              <label className="form-label"></label>
            </div>
            <div className="col-lg-2">
              {/* <div className="form-value"></div> */}
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
      <div className="row create_tp_body">
        <div className="col-lg-12">
          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Buyer</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">
                {workorder.techpack?.buyer?.name || "N/A"}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Tech Pack#</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {workorder.techpack?.techpack_number || "N/A"}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Brand</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">
                {workorder.techpack?.brand || "N/A"}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Buyer Style Name</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {workorder.techpack?.buyer_style_name || "N/A"}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Season</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">
                {workorder.techpack?.season || "N/A"}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Name</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {workorder.techpack?.item_name || "N/A"}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Department</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">
                {workorder.techpack?.department || "N/A"}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Type</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {workorder.techpack?.item_type || "N/A"}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Issued Date</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">{workorder.create_date || "N/A"}</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Description</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {workorder.techpack?.description || "N/A"}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Delivery Date</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">
                {workorder.delivery_date || "N/A"}
              </div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Wash Detail</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {workorder.techpack?.wash_details || "N/A"}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Swing SAM</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">{workorder.sewing_sam || "N/A"}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Special Operation</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {workorder.techpack?.special_operation || "N/A"}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">PO'S</label>
            </div>
            <div className="col-lg-10">
              <div className="form-value">
                {workorder.pos?.map((item, index) => (
                  <Link to={"/purchase-orders/" + item.id} key={index}>
                    {item.po_number}
                    {index !== workorder.pos.length - 1 ? ", " : ""}
                  </Link>
                ))}
              </div>
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

        {workorder.pos?.length > 0 ? (
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
              {workorder.pos?.map((item, index) => (
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
                    {workorder.pos?.reduce(
                      (sum, item) => sum + (Number(item.total_qty) || 0),
                      0
                    )}{" "}
                    PCS
                  </strong>
                </td>
                <td>
                  $
                  <strong>
                    {workorder.pos
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
