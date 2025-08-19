import React, { useEffect, useState } from "react";
import Logo from "assets/images/logos/logo-short.png";
import { Modal, Button, Spinner } from "react-bootstrap";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useParams, useHistory } from "react-router-dom";
import api from "services/api";
export default function BookingDetails() {
  const params = useParams();
  const history = useHistory();

  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [imageModal, setImageModal] = useState(false);
  // Open Image Modal
  const openImageModal = (previewUrl) => {
    setFullScreenImage(previewUrl);
    setImageModal(true);
  };

  // Close Image Modal
  const closeImageModal = () => {
    setFullScreenImage(null);
    setImageModal(false);
  };

  //added
  const [spinner, setSpinner] = useState(false);
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
        const fileName = techpack.techpack_number;
        pdf.save(`${fileName}.pdf`);
      });
    }, 100); // Slight delay for DOM to reflow
  };

  const [techpack, setTechpack] = useState({});

  const getTechpack = async () => {
    setSpinner(true);
    const response = await api.post("/technical-package-show", {
      id: params.id,
    });
    if (response.status === 200 && response.data) {
      const techpackData = response.data;
      setTechpack(techpackData);
    }
    setSpinner(false);
  };

  const buyerTechpackFiles = Array.isArray(techpack?.files)
    ? techpack.files.filter((file) => file.file_type === "technical_package")
    : [];

  const selectedSpecSheetFiles = Array.isArray(techpack?.files)
    ? techpack.files.filter((file) => file.file_type === "spec_sheet")
    : [];

  const selectedBlockPatternFiles = Array.isArray(techpack?.files)
    ? techpack.files.filter((file) => file.file_type === "block_pattern")
    : [];

  const selectedSpecialOperationFiles = Array.isArray(techpack?.files)
    ? techpack.files.filter((file) => file.file_type === "special_operation")
    : [];

  useEffect(() => {
    getTechpack();
  }, [params.id]);

  return (
    <div className="create_technical_pack" id="pdf-content">
      <div className="row create_tp_header align-items-center">
        <div className="col-lg-10">
          <div className="row align-items-center">
            <div className="col-lg-4">
              <img
                style={{ width: "30px", marginRight: "8px" }}
                src={Logo}
                alt="Logo"
              />
              <span className="purchase_text">Booking</span>
            </div>
            <div className="col-lg-2">
              <label className="form-label">BK Number</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">BKNXT873254</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">WO Number</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">
                {techpack.wo ? techpack.wo.wo_number : "N/A"}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-2">
          <button
            onClick={handleGeneratePDF}
            className="btn btn-default submit_button non_printing_area"
          >
            {" "}
            PDF{" "}
          </button>
        </div>
      </div>
      <br />
      <div className="row create_tp_body">
        <div className="col-lg-10">
          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Received Date</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">{techpack.received_date}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Tech Pack</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">{techpack.techpack_number}</div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Buyer</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">{techpack.buyer?.name}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Buyer Style Name</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">{techpack.buyer_style_name}</div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Brand</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">{techpack.brand}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Name</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">{techpack.item_name}</div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Season</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">{techpack.season}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Type</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">{techpack.item_type}</div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Department</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">{techpack.department}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Description</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">{techpack.description}</div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Factory</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">{techpack.company?.title}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Wash Detail</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">{techpack.wash_details}</div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Special Operation</label>
            </div>
            <div className="col-lg-10">
              <div className="form-value">
                {(() => {
                  try {
                    const ops = JSON.parse(techpack.special_operation);
                    return Array.isArray(ops) ? ops.join(", ") : "";
                  } catch {
                    return "";
                  }
                })()}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-2">
          <div className="photo_upload_area">
            <div className="photo">
              <label htmlFor="front_image">
                {techpack.front_photo_url ? (
                  <img
                    onClick={() => openImageModal(techpack.front_photo_url)}
                    src={techpack.front_photo_url}
                    alt="Frontside Preview"
                  />
                ) : (
                  <p>Garment Frontside Image</p>
                )}
              </label>
            </div>
            <div className="photo">
              <label htmlFor="back_image">
                {techpack.back_photo_url ? (
                  <img
                    onClick={() => openImageModal(techpack.back_photo_url)}
                    src={techpack.back_photo_url}
                    alt="Backside Preview"
                  />
                ) : (
                  <p>Garment Backside Image</p>
                )}
              </label>
            </div>
          </div>
        </div>
      </div>

      <br />

      <div
        style={{ padding: "0 15px" }}
        className="create_tp_materials_area create_tp_body"
      >
        <h6>Material Descriptions</h6>

        {Array.isArray(techpack.materials) && techpack.materials.length > 0 ? (
          (() => {
            const grouped = {};

            techpack.materials.forEach((material) => {
              const type = material.item_type?.title || "Others";
              if (!grouped[type]) {
                grouped[type] = [];
              }
              grouped[type].push(material);
            });

            const itemTypeList = Object.entries(grouped);

            return (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Item Name</th>
                    <th>Item Details</th>
                    <th>Color</th>
                    <th>Size</th>
                    <th>Position</th>
                    <th>Unit</th>
                    <th>Consmp</th>
                    <th>Wstg %</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {itemTypeList.map(([typeTitle, items], groupIndex) => (
                    <React.Fragment key={`group-${groupIndex}`}>
                      <tr className="bg-light">
                        <td className="form-value" colSpan={11}>
                          <strong>{typeTitle}</strong>
                        </td>
                      </tr>
                      {items.map((material, index) => (
                        <tr key={`material-${groupIndex}-${index}`}>
                          <td>{index + 1}</td>

                          <td>{material.item?.title}</td>
                          <td>{material.item_details}</td>
                          <td>{material.color}</td>
                          <td>{material.size}</td>
                          <td>{material.position}</td>
                          <td>{material.unit}</td>
                          <td>{material.consumption}</td>
                          <td>{material.wastage}</td>
                          <td>{material.total}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            );
          })()
        ) : (
          <p>There is no Costing Added for this Techpack</p>
        )}
      </div>
      <br />

      <table className="table table-bordered">
        <tbody>
          <tr>
            <td>
              <b>Merchant:</b> {techpack.user?.full_name}
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

      <Modal show={imageModal} onHide={closeImageModal}>
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img style={{ width: "100%" }} src={fullScreenImage} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeImageModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
