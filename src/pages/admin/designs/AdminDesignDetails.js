import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import swal from "sweetalert";

export default function AdminDesignDetails(props) {
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);
  const params = useParams();

  const approveDesign = async (design_id) => {
    setSpinner(true);
    var response = await api.post("/admin/designs-approve", { id: design_id });
    if (response.status === 200 && response.data) {
      swal({
        icon: "success",
        text: "Design Approved Success.",
      });
      getDesign();
    }
    setSpinner(false);
  };

  const generatePdf = () => {
    const input = document.getElementById("pdf_container");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("design.pdf");
    });
  };

  const PrintPdf = () => {
    const input = document.getElementById("pdf_container");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Open the print dialog
      pdf.autoPrint();
      window.open(pdf.output("bloburl"), "_blank");
    });
  };

  const [designItems, setDesignItems] = useState([]);
  const [design, setDesign] = useState({});
  const getDesign = async () => {
    setSpinner(true);
    var response = await api.post("/designs-show", { id: params.id });
    if (response.status === 200 && response.data) {
      setDesign(response.data.data);
      setDesignItems(response.data.data.design_items);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getDesign();
  }, []);
  useEffect(async () => {
    props.setSection("development");
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      if (props.userData?.role !== "Admin") {
        await swal({
          icon: "error",
          text: "You Cannot Access This Section.",
          closeOnClickOutside: false,
        });

        history.push("/dashboard");
      }
    };
    checkAccess();
  }, [props, history]);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}

      <div className="create_page_heading">
        <div className="page_name">Article Details</div>
        <div className="actions">
          <Link onClick={PrintPdf} className="btn btn-info btn-sm">
            <i className="fas fa-print"></i>
          </Link>
          <Link onClick={generatePdf} className="btn btn-warning bg-falgun ">
            <i className="fas fa-download"></i>
          </Link>

          {design.status === "Pending" ? (
            <button
              onClick={() => approveDesign(design.id)}
              className="btn btn-success"
            >
              Approve
            </button>
          ) : null}

          <Link to="/admin/designs" className="btn btn-danger">
            <i className="fal fa-times"></i>
          </Link>
        </div>
      </div>

      <div className="preview_print page" id="pdf_container">
        <div className="container border ">
          <br />
          <h6 className="text-center">Article Details</h6>
          <br />
          <table className="table text-start align-middle table-bordered table-hover mb-0 table-striped">
            <tbody>
              <tr>
                <td colSpan={1}>
                  <strong>ARTICLE NUMBER</strong>
                </td>
                <td colSpan={1}>
                  <strong>ARTICLE NAME</strong>
                </td>
                <td colSpan={1}>
                  <strong>ARTICLE TYPE</strong>
                </td>
              </tr>
              <tr>
                <td colSpan={1}>{design.design_number}</td>
                <td colSpan={1}>{design.title}</td>
                <td colSpan={1}>{design.design_type}</td>
              </tr>
              <tr>
                <td colSpan={1}>
                  <strong>UPLOADED BY</strong>
                </td>
                <td colSpan={1}>
                  <strong>STATUS</strong>
                </td>
                <td colSpan={1}>
                  <strong>COST PER UNIT (APPROX)</strong>
                </td>
              </tr>
              <tr>
                <td colSpan={1}>{design.user_name}</td>
                <td colSpan={1}>{design.status}</td>
                <td colSpan={1}>
                  <strong>{design.total}</strong>
                </td>
              </tr>

              <tr>
                <td colSpan={2}>
                  <strong>DESCRIPTION</strong>
                </td>
                <td colSpan={1}>
                  <strong>RELATED BUYER'S</strong>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: design.description,
                    }}
                  />
                </td>
                <td colSpan={1}>
                  {design.buyersLists &&
                    design.buyersLists.map((item) => (
                      <span style={{ paddingRight: "5px" }} key={item.id}>
                        {item.name}
                        {","}
                      </span>
                    ))}
                </td>
              </tr>

              <tr>
                <td colSpan={3}>
                  <div className="attachment_list">
                    {design &&
                    design.attachments &&
                    design.attachments.length > 0
                      ? design.attachments.map((value, index) => (
                          <div key={index} className="single_attachment">
                            {value.filename.endsWith(".txt") ? (
                              <div className="item">
                                <i className="fal fa-text"></i>
                              </div>
                            ) : value.filename.endsWith(".pdf") ? (
                              <div className="item">
                                <i className="fal fa-file-pdf"></i>
                              </div>
                            ) : value.filename.endsWith(".docx") ? (
                              <div className="item">
                                <i className="fal fa-file-word"></i>
                              </div>
                            ) : value.filename.endsWith(".doc") ? (
                              <div className="item">
                                <i className="fal fa-file-word"></i>
                              </div>
                            ) : value.filename.endsWith(".xls") ? (
                              <div className="item">
                                <i className="fal fa-file-excel"></i>
                              </div>
                            ) : value.filename.endsWith(".png") ? (
                              <div className="item">
                                <i className="fal fa-image"></i>
                              </div>
                            ) : value.filename.endsWith(".jpg") ? (
                              <div className="item">
                                <i className="fal fa-image"></i>
                              </div>
                            ) : value.filename.endsWith(".jpeg") ? (
                              <div className="item">
                                <i className="fal fa-image"></i>
                              </div>
                            ) : value.filename.endsWith(".gif") ? (
                              <div className="item">
                                <i className="fal fa-image"></i>
                              </div>
                            ) : (
                              <div className="item">
                                <i className="fal fa-file"></i>
                              </div>
                            )}
                            <a
                              target="_blank"
                              href={value.file_source}
                              download
                            >
                              <div className="item">
                                <div className="text-muted">
                                  {value.filename}
                                </div>
                              </div>
                            </a>
                          </div>
                        ))
                      : "No Attachment Here"}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <h5 className="text-center">Items & Costing </h5>
          <div className="Import_design_item_table">
            <table className="table text-start align-middle table-bordered table-hover mb-0">
              <thead className="bg-dark text-white">
                <tr>
                  <th>SL</th>
                  <th>Item</th>
                  <th>Description</th>

                  <th>Color</th>
                  <th>Unit</th>
                  <th>Size</th>
                  <th>QTY</th>
                  <th>Rate</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {designItems.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.title}</td>
                    <td>
                      <pre>{item.description}</pre>
                    </td>
                    <td>{item.color}</td>
                    <td>{item.unit}</td>
                    <td>{item.size}</td>
                    <td>{item.qty}</td>
                    <td>{item.rate}</td>
                    <td>{item.total}</td>
                  </tr>
                ))}
                <tr className="text-center">
                  <td colSpan={8}>
                    <h6>Items & Costing Summary</h6>
                  </td>
                  <td>
                    <h6>{design.total}</h6>
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
          </div>
        </div>
      </div>
    </div>
  );
}
