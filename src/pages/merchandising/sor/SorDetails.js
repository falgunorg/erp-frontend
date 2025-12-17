import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Modal, Button, Badge } from "react-bootstrap";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import moment from "moment/moment";
import QRCode from "react-qr-code";
import swal from "sweetalert";
import finalConfig from "../../../configs/config";

export default function SorDetails(props) {
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);
  const params = useParams();
  const appURL = finalConfig.appUrl;

  const generatePdf = () => {
    const input = document.getElementById("pdf_container");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("sor.pdf");
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

  const [sor, setSor] = useState({});
  const [sorItems, setSorItems] = useState([]);
  const getSor = async () => {
    setSpinner(true);
    var response = await api.post("/merchandising/sors-show", { id: params.id });
    if (response.status === 200 && response.data) {
      setSor(response.data.data);
      setSorItems(response.data.data.sor_items);
    }
    setSpinner(false);
  };

  const submitSample = async (item_id) => {
    setSpinner(true);
    var response = await api.post("/merchandising/sors-togglestatus", {
      id: item_id,
      status: "Confirmed",
    });
    if (response.status === 200 && response.data) {
      swal({
        title: "Submitted Success",
        icon: "success",
      });
    }
    setSpinner(false);
  };
  const deleteSor = async (item_id) => {
    setSpinner(true);
    var response = await api.post("/merchandising/sors-delete", {
      id: item_id,
    });
    if (response.status === 200 && response.data) {
      swal({
        title: "Deleted Success",
        icon: "success",
      });
      history.push("/merchandising/sors");
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getSor();
  }, []);

  useEffect(async () => {
    props.setSection("merchandising");
  }, []);

  

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">SOR Details</div>
        <div className="actions">
          {props.userData.userId === sor.user_id && sor.status === "Pending" ? (
            <>
              <Button onClick={() => submitSample(sor.id)} variant="success">
                Send to Sample Dept
              </Button>
              <Button onClick={() => deleteSor(sor.id)} variant="danger">
                Delete
              </Button>
            </>
          ) : null}

          <Link to="#" onClick={PrintPdf} className="btn btn-info btn-sm">
            <i className="fas fa-print"></i>
          </Link>
          <Link to="#" onClick={generatePdf} className="btn btn-warning bg-falgun ">
            <i className="fas fa-download"></i>
          </Link>
          <Link  to="/merchandising/sors" className="btn btn-danger">
            <i className="fal fa-times"></i>
          </Link>
        </div>
      </div>

      <div className="preview_print page" id="pdf_container">
        <div className="container border">
          <br />
          <h4 className="text-center">Sample Order Request</h4>
          <br />
          <div className="row">
            <div className="col-lg-12">
              <table className="table table-striped text-start align-middle table-bordered table-hover mb-0">
                <tbody>
                  <tr>
                    <td>
                      <strong>SOR NUMBER</strong>
                    </td>
                    <td>
                      <strong>Thumbnail</strong>
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                  <tr>
                    <td>{sor.sor_number}</td>
                    <td className="text-center">
                      <img src={sor.image_source} />
                    </td>
                    <td colSpan={2} className="text-center">
                      <QRCode
                        size={50}
                        value={`${appURL}/merchandising/sors-edit/${sor.id}`}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <strong>BUYER</strong>
                    </td>
                    <td>
                      <strong>STYLE / TECHPACK</strong>
                    </td>
                    <td>
                      <strong>SEASON</strong>
                    </td>
                  </tr>

                  <tr>
                    <td>{sor.buyer}</td>
                    <td>{sor.techpack}</td>
                    <td>{sor.season}</td>
                  </tr>

                  <tr>
                    <td>
                      <strong>ISSUED DATE</strong>
                    </td>
                    <td>
                      <strong>DELIVERY DATE </strong>
                    </td>
                    <td>
                      <strong>ISSUED BY</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {" "}
                      {sor.issued_date
                        ? moment(sor.issued_date).format("ll")
                        : ""}
                    </td>
                    <td>
                      {" "}
                      {sor.delivery_date
                        ? moment(sor.delivery_date).format("ll")
                        : ""}
                    </td>
                    <td>{sor.user}</td>
                  </tr>

                  <tr>
                    <td>
                      <strong>QTY</strong>
                    </td>
                    <td>
                      <strong>SIZE</strong>
                    </td>
                    <td>
                      <strong>COLOR</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>{sor.qty} PCS</td>
                    <td>
                      {sor.sizeList &&
                        sor.sizeList.map((item) => (
                          <span style={{ paddingRight: "5px" }} key={item.id}>
                            {item.title}
                            {","}
                          </span>
                        ))}
                    </td>
                    <td>
                      {sor.colorList &&
                        sor.colorList.map((item) => (
                          <span style={{ paddingRight: "5px" }} key={item.id}>
                            {item.title}
                            {","}
                          </span>
                        ))}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>OPERATIONS</strong>
                    </td>
                    <td>
                      <strong>STATUS</strong>
                    </td>
                    <td>
                      <strong>TECHPACK / REF</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>{sor.operations}</td>
                    <td>{sor.status}</td>
                    <td>{sor.techpack}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <br />
          <h5 className="text-center">SAMPLE BOM</h5>
          <div className="Import_sor_item_table">
            <table className="table text-start align-middle table-bordered table-hover mb-0">
              <thead className="bg-dark text-white">
                <tr>
                  <th>SL</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Color</th>
                  <th>Unit</th>
                  <th>Size</th>
                  <th>Per PC Cons.</th>
                  <th>Total Cons.</th>
                  {/* <th>Material Status</th> */}
                </tr>
              </thead>
              <tbody>
                {sorItems.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {item.store_number}/{item.title}/{sor.techpack}
                    </td>
                    <td>
                      <pre>{item.description}</pre>
                    </td>
                    <td>{item.color}</td>
                    <td>{item.unit}</td>
                    <td>{item.size}</td>
                    <td>{item.per_pc_cons}</td>
                    <td>{item.total}</td>
                    {/* <td>{item.status}</td> */}
                  </tr>
                ))}
              </tbody>
            </table>
            <br />
            <hr></hr>
            <div className="row">
              <div className="col-lg-6">
                <div className="attachment_list" style={{ marginTop: 0 }}>
                  <h5>Images</h5>
                  {sor && sor.attachments && sor.attachments.length > 0
                    ? sor.attachments.map((value, index) => (
                        <a href={value.file_source} target="blank">
                          <img
                            style={{
                              height: "150px",
                              width: "150px",
                              margin: 5,
                            }}
                            src={value.file_source}
                          />
                        </a>
                      ))
                    : "No Attachment Here"}
                </div>
              </div>
              <div className="col-lg-6">
                <h5>Remarks / Note</h5>
                <div
                  dangerouslySetInnerHTML={{
                    __html: sor.remarks,
                  }}
                />
              </div>
            </div>

            <br />
          </div>
        </div>
      </div>
    </div>
  );
}
