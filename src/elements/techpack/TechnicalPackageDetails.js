import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logos/logo-short.png";
import Select, { components } from "react-select";
import { Modal, Button, Spinner } from "react-bootstrap";
import MultipleFileView from "./MultipleFileView";
import html2pdf from "html2pdf.js";
export default function TechnicalPackageDetails({ tpDetails }) {
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

  ///added

  const [spinner, setSpinner] = useState(false);

  const tpRef = React.useRef();
  const handleGeneratePDF = () => {
    const element = tpRef.current;
    const opt = {
      margin: 0.2,
      filename: tpDetails.techpack_number + ".pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  const buyerTechpackFiles = tpDetails?.files?.filter(
    (file) => file.file_type === "technical_package"
  );

  const selectedSpecSheetFiles = tpDetails?.files?.filter(
    (file) => file.file_type === "spec_sheet"
  );

  const selectedBlockPatternFiles = tpDetails?.files?.filter(
    (file) => file.file_type === "block_pattern"
  );

  const selectedSpecialOperationFiles = tpDetails?.files?.filter(
    (file) => file.file_type === "special_operation"
  );

  console.log("Materials", tpDetails.materials);

  return (
    <div className="create_technical_pack" ref={tpRef}>
      <div className="row create_tp_header align-items-center">
        <div className="col-lg-10">
          <div className="row align-items-baseline">
            <div className="col-lg-4">
              <img
                style={{ width: "30px", marginRight: "8px" }}
                src={Logo}
                alt="Logo"
              />
              <span className="purchase_text">Tech Pack</span>
            </div>
            <div className="col-lg-2">
              <label className="form-label">PO Number</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{tpDetails.po?.po_number}</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">WO Number</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{tpDetails.wo_id}</div>
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
              <div className="form-value">{tpDetails.received_date}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Tech Pack</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">{tpDetails.techpack_number}</div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Buyer</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">{tpDetails.buyer?.name}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Buyer Style Name</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">{tpDetails.buyer_style_name}</div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Brand</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">{tpDetails.brand}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Name</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">{tpDetails.item_name}</div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Season</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">{tpDetails.season}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Type</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">{tpDetails.item_type}</div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Department</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">{tpDetails.department}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Description</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">{tpDetails.description}</div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Factory</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">{tpDetails.company?.title}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Wash Detail</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">{tpDetails.wash_details}</div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Special Operation</label>
            </div>
            <div className="col-lg-10">
              <div className="form-value">{tpDetails.special_operation}</div>
            </div>
          </div>
        </div>
        <div className="col-lg-2">
          <div className="photo_upload_area">
            <div className="photo">
              <label htmlFor="front_image">
                {tpDetails.front_photo_url ? (
                  <img
                    onClick={() => openImageModal(tpDetails.front_photo_url)}
                    src={tpDetails.front_photo_url}
                    alt="Frontside Preview"
                  />
                ) : (
                  <p>Garment Frontside Image</p>
                )}
              </label>
            </div>
            <div className="photo">
              <label htmlFor="back_image">
                {tpDetails.back_photo_url ? (
                  <img
                    onClick={() => openImageModal(tpDetails.back_photo_url)}
                    src={tpDetails.back_photo_url}
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

      <div className="create_tp_attatchment">
        <MultipleFileView
          label="Buyer Tech Pack Attachment"
          inputId="buyer_techpacks"
          selectedFiles={buyerTechpackFiles}
        />
        <MultipleFileView
          label="Spec Sheet Attachment"
          inputId="specsheet"
          selectedFiles={selectedSpecSheetFiles}
        />
        <MultipleFileView
          label="Block Pattern Attachment"
          inputId="block_pattern"
          selectedFiles={selectedBlockPatternFiles}
        />

        <MultipleFileView
          label="Block Pattern Attachment"
          inputId="special_operation"
          selectedFiles={selectedSpecialOperationFiles}
        />
      </div>

      <div className="create_tp_materials_area create_tp_body">
        <h6>Material Descriptions</h6>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Item Type</th>
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
            {tpDetails?.materials.length > 0 &&
              tpDetails?.materials.map((material) => (
                <tr>
                  <td>{material.item_type?.title}</td>
                  <td>{material.item_name}</td>
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
          </tbody>
        </table>
      </div>

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
