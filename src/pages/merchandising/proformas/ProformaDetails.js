import React, { useState, useEffect, Fragment } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import moment from "moment/moment";
import swal from "sweetalert";

export default function ProformaDetails(props) {
  const userInfo = props.userData;
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };
  const [spinner, setSpinner] = useState(false);
  const params = useParams();

  const generatePdf = () => {
    const input = document.getElementById("pdf_container");
    // Hide all elements except the pdf_container
    const elementsToHide = document.body.querySelectorAll(
      ":not(#pdf_container)"
    );
    elementsToHide.forEach((element) => {
      element.style.display = "none";
    });

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      // Calculate dimensions for the PDF
      const pdf = new jsPDF("p", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Add image to PDF
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Show all elements again after generating PDF
      elementsToHide.forEach((element) => {
        element.style.display = ""; // Restore default display property
      });

      // Save PDF
      pdf.save("proforma.pdf");
    });
  };

  const PrintPdf = () => {
    window.print();
  };

  const [proforma, setProforma] = useState({});
  const [proformaItems, setProformaItems] = useState([]);
  const getProforma = async () => {
    setSpinner(true);
    var response = await api.post("/merchandising/proformas-show", {
      id: params.id,
    });
    if (response.status === 200 && response.data) {
      setProforma(response.data.data);
      setProformaItems(response.data.data.items);
    }
    setSpinner(false);
  };

  console.log("PROFORMA", proforma);
  const toggleStatus = async (status) => {
    setSpinner(true);
    var response = await api.post("/merchandising/proformas-toggle-status", {
      id: proforma.id,
      status: status,
    });

    if (response.status === 200 && response.data) {
      swal({
        title: "Status Updated Success!",
        icon: "success",
      });
      getProforma();
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getProforma();
  }, []);

  useEffect(async () => {
    props.setSection("merchandising");
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      const allowedDepartments = [
        "Merchandising",
        "Audit",
        "Accounts & Finance",
        "Commercial",
        "Management",
      ];
      if (!allowedDepartments.includes(props.userData?.department_title)) {
        await swal({
          icon: "error",
          text: "You Cannot Access This Section.",
          closeOnClickOutside: false,
        });
        history.push("/dashboard");
      }
    };
    checkAccess();
  }, [props.userData?.department_title, history]);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Proforma Details</div>
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

          {props.userData.userId === proforma.user_id &&
          (proforma.status === "Pending" || proforma.status === "Rejected") ? (
            <Fragment>
              <Link
                to={"/merchandising/proformas-edit/" + proforma.id}
                className="btn btn-warning"
              >
                <i className="fal fa-pen"></i>
              </Link>
              <button
                onClick={() => toggleStatus("Placed")}
                className="btn btn-success"
              >
                Submit to Team Leader
              </button>
            </Fragment>
          ) : null}

          {userInfo.department_title === "Merchandising" &&
          userInfo.designation_title === "Assistant Manager" &&
          proforma.status === "Placed" ? (
            <Fragment>
              <button
                onClick={() => toggleStatus("Confirmed")}
                className="btn btn-success"
              >
                Confirmed
              </button>
              <button
                onClick={() => toggleStatus("Rejected")}
                className="btn btn-danger"
              >
                Reject
              </button>
            </Fragment>
          ) : null}
          {userInfo.department_title === "Merchandising" &&
          userInfo.designation_title === "Deputy General Manager" &&
          proforma.status === "Confirmed" ? (
            <Fragment>
              <button
                onClick={() => toggleStatus("Submitted")}
                className="btn btn-success"
              >
                Submit To Audit
              </button>
              <button
                onClick={() => toggleStatus("Rejected")}
                className="btn btn-danger"
              >
                Reject
              </button>
            </Fragment>
          ) : null}

          {userInfo.department_title === "Audit" &&
          userInfo.designation_title === "Manager" &&
          proforma.status === "Submitted" ? (
            <Fragment>
              <button
                onClick={() => toggleStatus("Checked")}
                className="btn btn-success"
              >
                Checked
              </button>
              <button
                onClick={() => toggleStatus("Rejected")}
                className="btn btn-danger"
              >
                Reject
              </button>
            </Fragment>
          ) : null}

          {userInfo.department_title === "Accounts & Finance" &&
          userInfo.designation_title === "Manager" &&
          proforma.status === "Checked" ? (
            <Fragment>
              <button
                onClick={() => toggleStatus("Cost-Approved")}
                className="btn btn-success"
              >
                Cost-Approved
              </button>
              <button
                onClick={() => toggleStatus("Rejected")}
                className="btn btn-danger"
              >
                Reject
              </button>
            </Fragment>
          ) : null}

          {userInfo.department_title === "Accounts & Finance" &&
          userInfo.designation_title === "General Manager" &&
          proforma.status === "Cost-Approved" ? (
            <Fragment>
              <button
                onClick={() => toggleStatus("Finalized")}
                className="btn btn-success"
              >
                Finalized
              </button>
              <button
                onClick={() => toggleStatus("Rejected")}
                className="btn btn-danger"
              >
                Reject
              </button>
            </Fragment>
          ) : null}

          {userInfo.department_title === "Management" &&
          userInfo.designation_title === "Managing Director" &&
          proforma.status === "Finalized" ? (
            <Fragment>
              <button
                onClick={() => toggleStatus("Approved")}
                className="btn btn-success"
              >
                Approved & Send For LC
              </button>
              <button
                onClick={() => toggleStatus("Rejected")}
                className="btn btn-danger"
              >
                Reject
              </button>
            </Fragment>
          ) : null}

          {userInfo.department_title === "Commercial" &&
          userInfo.designation_title === "Asst. General Manager" &&
          proforma.status === "Approved" ? (
            <Fragment>
              <button
                onClick={() => toggleStatus("Received")}
                className="btn btn-success"
              >
                Receive
              </button>
              <button
                onClick={() => toggleStatus("Rejected")}
                className="btn btn-danger"
              >
                Reject
              </button>
            </Fragment>
          ) : null}

          <Link to="/merchandising/proformas" className="btn btn-danger">
            <i className="fal fa-times"></i>
          </Link>
        </div>
      </div>

      <div
        className="preview_print page create_technical_pack "
        id="pdf_container"
      >
        <div className="create_tp_body container-fluid">
          <br />
          <h4 className="text-center">{proforma.supplier?.company_name}</h4>
          <h6 className="text-center text-underline">
            <u>PROFORMA INVOICE</u>
          </h6>
          <br />

          <div className="row">
            <div className="col-sm-6 col-md-6 col-lg-6">
              <div className="row">
                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">PI Number:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">{proforma.title}</div>
                </div>
                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">Company:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">
                    {proforma.booking?.workorder?.techpack?.company?.title}{" "}
                    <br />
                    {proforma.booking?.workorder?.techpack?.company?.address}
                  </div>
                </div>

                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">Responsible MR:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">
                    {proforma.user?.full_name} <br />
                    {proforma.user?.employee_id}
                  </div>
                </div>

                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">Net Weight:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">{proforma.net_weight}(KG)</div>
                </div>

                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">Gross Weight:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">{proforma.gross_weight}(KG)</div>
                </div>

                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">Freight Charge:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">{proforma.freight_charge}</div>
                </div>

                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">Total PI Value:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">{proforma.total}</div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-6 col-lg-6">
              <div className="row">
                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">Booking Ref:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">
                    <Link
                      to={"/merchandising/bookings/" + proforma.booking?.id}
                    >
                      {proforma.booking?.booking_number}
                    </Link>
                  </div>
                </div>

                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">Issued date:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">
                    {moment(proforma.issued_date).format("ll")}
                  </div>
                </div>

                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">Delivery date:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">
                    {moment(proforma.delivery_date).format("ll")}
                  </div>
                </div>

                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">PI Validity:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">{proforma.pi_validity}</div>
                </div>

                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">Supplier:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">
                    {proforma.supplier?.company_name} <br />
                    {proforma.supplier?.address},{proforma.supplier?.city},
                    {proforma.supplier?.country}
                  </div>
                </div>

                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">Responsible:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">
                    {proforma.supplier?.attention_person} <br />
                    {proforma.supplier?.mobile_number}
                  </div>
                </div>

                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">Status:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">{proforma.status}</div>
                </div>
              </div>
            </div>
          </div>
          <br />
          <h6 className="text-center">ITEM'S</h6>
          <div className="Import_booking_item_table">
            <table className="table text-start align-middle table-bordered mb-0">
              <thead className="bg-dark text-white">
                <tr>
                  <th>SL</th>
                  <th>Item</th>
                  <th>Item Details</th>
                  <th>Unit</th>
                  <th>QTY</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {proformaItems.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{proforma.booking?.item?.title || "-"}</td>
                    <td>
                      {item.item_description}
                      <br />
                      <small>
                        Color: {item.item_color || "-"} | Size:{" "}
                        {item.item_size || "-"}
                        <br />
                        HS Code: {item.hscode || "-"}
                      </small>
                    </td>
                    <td>{item.unit || "-"}</td>
                    <td>{item.booking_qty || 0}</td>
                    <td>{item.unit_price}</td>
                    <td>{(item.booking_qty * item.unit_price).toFixed(2)}</td>
                  </tr>
                ))}

                {/* ✅ Total Row */}
                <tr>
                  <td colSpan={6} className="text-end">
                    <strong>Total</strong>
                  </td>
                  <td>
                    <strong>{proforma.total}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
          </div>
          <h6 className="text-center">Terms & Beneficiery</h6>
          <hr></hr>
          <div className="row">
            <div className="col-6">
              <div className="row">
                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">Payment Terms:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">{proforma.payment_terms}</div>
                </div>

                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">Mode Of Shipment:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">{proforma.mode_of_shipment}</div>
                </div>

                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">Port of Loading:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">{proforma.port_of_loading}</div>
                </div>

                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">Port of Discharge:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">{proforma.port_of_discharge}</div>
                </div>

                <br />
                <div className="soft_copy_div">
                  <h6>Soft Copy From Supplier </h6>
                  <hr />
                  <ul
                    style={{
                      padding: "0",
                      margin: "0",
                    }}
                  >
                    {proforma?.files?.map((f, i) => (
                      <li
                        key={i}
                        onClick={() => window.open(f.file_source, "_blank")}
                        style={{
                          border: "1px solid grey",
                          padding: "5px",
                          cursor: "pointer",
                        }}
                        className="rounded bg-light"
                      >
                        <small>{f.filename}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-6">
              <table className="table table-bordered mb-0">
                <thead>
                  <tr>
                    <th colSpan={2} className="text-center">
                      <strong>BENEFICIERY DETAILS</strong>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ACCOUNT NAME</td>

                    <td>{proforma.bank_account_name}</td>
                  </tr>
                  <tr>
                    <td>BANK NAME</td>

                    <td>{proforma.bank_name}</td>
                  </tr>
                  <tr>
                    <td>ACCOUNT NUMBER</td>

                    <td>{proforma.bank_account_number}</td>
                  </tr>
                  <tr>
                    <td>BRANCH NAME</td>

                    <td>{proforma.bank_brunch_name}</td>
                  </tr>
                  <tr>
                    <td>BRANCH ADDRESS</td>

                    <td>{proforma.bank_address}</td>
                  </tr>
                  <tr>
                    <td>SWIFT CODE</td>

                    <td>{proforma.bank_swift_code}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="col-lg-12">
              <br />
              <div
                dangerouslySetInnerHTML={{ __html: proforma.description }}
                className="form-value"
              ></div>
            </div>
          </div>
          <div className="signature_block">
            {proforma.placed_by > 0 && (
              <div className="item">
                <img
                  className="signature"
                  src={proforma.placed_by_sign}
                  defalt
                />
                <div className="sign_time">
                  {proforma.placed_by_name}
                  <br />
                  {moment(proforma.placed_at).format("lll")}
                </div>
              </div>
            )}
            {proforma.confirmed_by > 0 && (
              <div className="item">
                <img className="signature" src={proforma.confirmed_by_sign} />
                <div className="sign_time">
                  {proforma.confirmed_by_name}
                  <br />
                  {moment(proforma.confirmed_at).format("lll")}
                </div>
              </div>
            )}

            {proforma.submitted_by > 0 && (
              <div className="item">
                <img className="signature" src={proforma.submitted_by_sign} />
                <div className="sign_time">
                  {proforma.submitted_by_name}
                  <br />
                  {moment(proforma.submitted_at).format("lll")}
                </div>
              </div>
            )}

            {proforma.checked_by > 0 && (
              <div className="item">
                <img className="signature" src={proforma.checked_by_sign} />
                <div className="sign_time">
                  {proforma.checked_by_name}
                  <br />
                  {moment(proforma.checked_at).format("lll")}
                </div>
              </div>
            )}

            {proforma.cost_approved_by > 0 && (
              <div className="item">
                <img
                  className="signature"
                  src={proforma.cost_approved_by_sign}
                />
                <div className="sign_time">
                  {proforma.cost_approved_by_name}
                  <br />
                  {moment(proforma.cost_approved_at).format("lll")}
                </div>
              </div>
            )}

            {proforma.finalized_by > 0 && (
              <div className="item">
                <img className="signature" src={proforma.finalized_by_sign} />
                <div className="sign_time">
                  {proforma.finalized_by_name}
                  <br />
                  {moment(proforma.finalized_at).format("lll")}
                </div>
              </div>
            )}

            {proforma.approved_by > 0 && (
              <div className="item">
                <img className="signature" src={proforma.approved_by_sign} />
                <div className="sign_time">
                  {proforma.approved_by_name}
                  <br />
                  {moment(proforma.approved_at).format("lll")}
                </div>
              </div>
            )}

            {proforma.received_by > 0 && (
              <div className="item">
                <img className="signature" src={proforma.received_by_sign} />
                <div className="sign_time">
                  {proforma.received_by_name}
                  <br />
                  {moment(proforma.received_at).format("lll")}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
