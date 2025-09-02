import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import moment from "moment/moment";
import { Modal, Button } from "react-bootstrap";
import swal from "sweetalert";

export default function SampleSorDetails(props) {
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);
  const params = useParams();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const handleFileSelection = (event) => {
    const files = event.target.files;
    setSelectedFiles([...selectedFiles, ...files]);
  };
  const handleFileDelete = (index) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
  };

  const [sor, setSor] = useState({});
  const [sorItems, setSorItems] = useState([]);
  const getSor = async () => {
    setSpinner(true);
    var response = await api.post("/merchandising/sors-show", { id: params.id });
    if (response.status === 200 && response.data) {
      setSor(response.data.data);
      setStatusForm(response.data.data);
      setSorItems(response.data.data.sor_items);
    }
    setSpinner(false);
  };

  const [statusModal, setStatusModal] = useState(false);
  const [statusForm, setStatusForm] = useState({});

  const statusChange = (event) => {
    setStatusForm({ ...statusForm, [event.target.name]: event.target.value });
  };

  const openStatusModal = () => {
    setSpinner(true);
    setStatusModal(true);
    setSpinner(false);
  };
  const closeStatusModal = () => {
    setStatusModal(false);
  };

  const submitStatus = async () => {
    setSpinner(true);
    var data = new FormData();
    data.append("id", statusForm.id);
    data.append("status", statusForm.status);
    data.append("remarks", statusForm.remarks);
    for (let i = 0; i < selectedFiles.length; i++) {
      data.append("attatchments[]", selectedFiles[i]);
    }
    var response = await api.post("/merchandising/sors-togglestatus", data);
    if (response.status === 200 && response.data) {
      getSor();
      setStatusModal(false);
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
  useEffect(async () => {
    getSor();
  }, []);

  useEffect(async () => {
    props.setSection("sample");
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      if (props.userData?.department_title !== "Sample") {
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
        <div className="page_name">SOR Details</div>
        <div className="actions">
          <Link to="#" onClick={PrintPdf} className="btn btn-info btn-sm">
            <i className="fas fa-print"></i>
          </Link>
          <Link
            to="#"
            onClick={generatePdf}
            className="btn btn-warning bg-falgun "
          >
            <i className="fas fa-download"></i>
          </Link>
          <Link to="#" onClick={openStatusModal} className="btn btn-warning">
            <i className="fal fa-cog"></i>
          </Link>
          <Link to="/sample/sors" className="btn btn-danger">
            <i className="fal fa-times"></i>
          </Link>
        </div>
      </div>

      <div className="preview_print page" id="pdf_container">
        <div className="container border ">
          <br />
          <h2 className="text-center">Sample Order Request</h2>
          <br />
          <div className="row">
            <div className="col-lg-12">
              <table className="table table-striped table-hover">
                <tbody>
                  <tr>
                    <td>
                      <strong>SOR NUMBER</strong>
                    </td>
                    <td>
                      <strong>SAMPLE TYPE</strong>
                    </td>

                    <td colSpan={2}></td>
                  </tr>
                  <tr>
                    <td>{sor.sor_number}</td>
                    <td>{sor.sample_type_name}</td>
                    <td colSpan={2}></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>BUYER</strong>
                    </td>
                    <td>
                      <strong>STYLE</strong>
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
                    <td>
                      {sor.qty} {sor.unit}
                    </td>
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
          <h3 className="text-center">SAMPLE BOM</h3>
          <div className="Import_sor_item_table">
            <table className="table">
              <thead className="bg-dark text-white">
                <tr>
                  <th>SL</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Color</th>
                  <th>Unit</th>
                  <th>Size</th>
                  <th>Per PC Cons.</th>
                  <th>QTY</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sorItems.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.title}</td>
                    <td>
                      <pre>{item.description}</pre>
                    </td>
                    <td>{item.color}</td>
                    <td>{item.unit}</td>
                    <td>{item.size}</td>
                    <td>{item.per_pc_cons}</td>
                    <td>{item.qty}</td>
                    <td>{item.status}</td>
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
        <Modal show={statusModal} onHide={closeStatusModal}>
          <Modal.Header closeButton>
            <Modal.Title>Change Status</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label>Status</label>
              <select
                onChange={statusChange}
                value={statusForm.status}
                name="status"
                className="form-select"
              >
                {sor.status === "Confirmed" && (
                  <>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Received With Material">
                      Received With Material
                    </option>
                    <option value="Not Received">Not Received</option>
                    <option value="Others">Others</option>
                  </>
                )}

                {sor.status === "Not Received" && (
                  <>
                    <option value="Not Received">Not Received</option>
                    <option value="Received With Material">
                      Received With Material
                    </option>
                    <option value="Others">Others</option>
                  </>
                )}

                {sor.status === "Received With Material" && (
                  <>
                    <option value="Received With Material">
                      Received With Material
                    </option>
                    <option value="Making Pattern">Making Pattern</option>
                    <option value="Others">Others</option>
                  </>
                )}

                {sor.status === "Making Pattern" && (
                  <>
                    <option value="Making Pattern">Making Pattern</option>
                    <option value="On Cutting">On Cutting</option>
                    <option value="Others">Others</option>
                  </>
                )}
                {sor.status === "On Cutting" && (
                  <>
                    <option value="On Cutting">On Cutting</option>
                    <option value="On Sewing">On Sewing</option>
                    <option value="Others">Others</option>
                  </>
                )}

                {sor.status === "On Sewing" && (
                  <>
                    <option value="On Sewing">On Sewing</option>
                    <option value="Testing">Testing</option>
                    <option value="Others">Others</option>
                  </>
                )}

                {sor.status === "Testing" && (
                  <>
                    <option value="Testing">Testing</option>
                    <option value="On Finishing">On Finishing</option>
                    <option value="Others">Others</option>
                  </>
                )}

                {sor.status === "On Finishing" && (
                  <>
                    <option value="On Finishing">On Finishing</option>
                    <option value="Completed">Completed</option>
                    <option value="Others">Others</option>
                  </>
                )}
                {sor.status === "Completed" && (
                  <>
                    <option value="Completed">Completed</option>
                  </>
                )}

                {sor.status === "Others" && (
                  <>
                    <option value="Others">Others</option>
                    <option value="Received With Material">
                      Received With Material
                    </option>
                    <option value="Not Received">Not Received</option>
                    <option value="Making Pattern">Making Pattern</option>
                    <option value="On Cutting">On Cutting</option>
                    <option value="On Sewing">On Sewing</option>
                    <option value="Testing">Testing</option>
                    <option value="On Finishing">On Finishing</option>
                    <option value="Completed">Completed</option>
                  </>
                )}
              </select>
            </div>
            <div className="form-group">
              <label>Remarks</label>
              <textarea
                onChange={statusChange}
                value={statusForm.remarks}
                name="remarks"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="attachments">Current Status Images:</label>
              <small className="text-muted"> (JPEG,PNG)</small>
              <div className="d-flex mb-10">
                <input
                  type="file"
                  className="form-control"
                  multiple
                  onChange={handleFileSelection}
                  id="input_files"
                />
                <div className="d-flex margin_left_30">
                  <label
                    for="input_files"
                    className="btn btn-warning bg-falgun rounded-circle btn-xs"
                  >
                    <i className="fal fa-plus"></i>
                  </label>
                </div>
              </div>

              {selectedFiles.map((file, index) => (
                <div key={file.name} className="d-flex mb-10">
                  <input className="form-control" disabled value={file.name} />
                  <div className="d-flex">
                    <Link
                      to="#"
                      onClick={() => handleFileDelete(index)}
                      className="btn btn-danger rounded-circle margin_left_15 btn-xs"
                    >
                      <i className="fa fa-times"></i>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="default" onClick={closeStatusModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={submitStatus}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
