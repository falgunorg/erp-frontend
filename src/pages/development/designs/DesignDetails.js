import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import swal from "sweetalert";

export default function DesignDetails(props) {
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);
  const params = useParams();

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
    window.print();
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

          {props.userData.userId === design.user_id &&
          design.status === "Pending" ? (
            <Link
              to={"/development/designs-edit/" + design.id}
              className="btn btn-warning"
            >
              <i className="fal fa-pen"></i>
            </Link>
          ) : null}

          <Link to="/development/designs" className="btn btn-danger">
            <i className="fal fa-times"></i>
          </Link>
        </div>
      </div>

      <div className="preview_print page" id="pdf_container">
        <div className="container border ">
          <br />
          <h6 className="text-center text-underline">
            <u>ARTICLE DETAILS</u>
          </h6>
          <br />
          <div className="row">
            <div className="col-lg-8">
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
                    <td colSpan={3}>
                      <strong>RELATED BUYER'S</strong>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3}>
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
                      <strong>ATTACTHMENTS</strong>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3}>
                      <div
                        className="attachment_list"
                        style={{ marginTop: "0px" }}
                      >
                        {design &&
                        design.attachments &&
                        design.attachments.length > 0
                          ? design.attachments.map((value, index) => (
                              <div key={index} className="single_attachment">
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

                  <tr>
                    <td colSpan={3}>
                      <strong>DESCRIPTION</strong>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: design.description,
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-lg-4">
              <img
                style={{
                  width: "100%",
                  border: "1px solid gray",
                  borderRadius: "3px",
                }}
                src={design.image_source}
              />
            </div>
          </div>

          <br />
          <h6 className="text-center text-underline">
            <u>ITEMS & COSTING</u>
          </h6>
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
                    <h6>Summary</h6>
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
