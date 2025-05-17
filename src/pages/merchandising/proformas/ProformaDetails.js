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
    var response = await api.post("/proformas-show", { id: params.id });
    if (response.status === 200 && response.data) {
      setProforma(response.data.data);
      setProformaItems(response.data.data.proforma_items);
    }
    setSpinner(false);
  };

  const toggleStatus = async (status) => {
    setSpinner(true);
    var response = await api.post("/proformas-toggle-status", {
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
          <Link to="#" onClick={generatePdf} className="btn btn-warning bg-falgun ">
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

          <Link to="#" onClick={goBack} className="btn btn-danger">
            <i className="fal fa-times"></i>
          </Link>
        </div>
      </div>

      <div className="preview_print page" id="pdf_container">
        <div className="container border ">
          <br />
          <h4 className="text-center">{proforma.supplier}</h4>
          <br />
          <h6 className="text-center text-underline">
            <u>PROFORMA INVOICE</u>
          </h6>

          <div className="row">
            <div className="col">
              <table className="table table-bordered mb-0">
                <tr>
                  <td>SL</td>
                  <td>{proforma.proforma_number}</td>
                </tr>
                <tr>
                  <td>PI</td>
                  <td>{proforma.title}</td>
                </tr>
                <tr>
                  <td>COMPANY</td>
                  <td>
                    {proforma.company} <br />
                    {proforma.company_address}
                  </td>
                </tr>
                <tr>
                  <td>RESPONSIBLE</td>

                  <td>
                    {proforma.user} <br />
                    {proforma.user_staff_id}
                  </td>
                </tr>
                <tr>
                  <td>NET WEIGHT</td>

                  <td>{proforma.net_weight}</td>
                </tr>
                <tr>
                  <td>GROSS WEIGHT</td>

                  <td>{proforma.gross_weight}</td>
                </tr>
              </table>
            </div>

            <div className="col">
              <table className="table table-bordered mb-0">
                <tr>
                  <td>PC/MASTER</td>
                  <td>
                    {proforma.tag_number} | {proforma.contract_number} | (
                    {proforma.buyer})
                  </td>
                </tr>
                <tr>
                  <td>ISSUED DATE</td>

                  <td>{moment(proforma.issued_date).format("ll")}</td>
                </tr>
                <tr>
                  <td>DELIVERY DATE</td>

                  <td>{moment(proforma.delivery_date).format("ll")}</td>
                </tr>
                <tr>
                  <td>PI VALIDITY</td>

                  <td>{proforma.pi_validity}</td>
                </tr>
                <tr>
                  <td>SUPPLIER</td>

                  <td>
                    {proforma.supplier} <br />
                    {proforma.supplier_address},{proforma.supplier_city},
                    {proforma.supplier_country}
                  </td>
                </tr>
                <tr>
                  <td>RESPONSIBLE</td>

                  <td>
                    {proforma.supplier_attention} <br />
                    {proforma.supplier_contact}
                  </td>
                </tr>
                <tr>
                  <td>TOTAL VALUE</td>

                  <td>
                    {proforma.total} {proforma.currency}
                  </td>
                </tr>
                <tr>
                  <td>STATUS</td>

                  <td>{proforma.status}</td>
                </tr>
              </table>
            </div>
          </div>
          <br />
          <h6 className="text-center">ITEM'S</h6>
          <div className="Import_booking_item_table">
            <table className="table text-start align-middle table-bordered table-hover mb-0">
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
                    <td>{item.title}</td>
                    <td>
                      {item.description}
                      <br/>
                      Color: {item.color} | Size: {item.size} | Shade:{" "}
                      {item.shade} | Tex: {item.tex}
                      <div>HS:</div>
                      <small>
                        {item.code_8} | {item.code_10}
                      </small>
                      <br />
                      <small>{item.hs_description}</small>
                    </td>
                    <td>{item.unit}</td>
                    <td>{item.qty}</td>
                    <td>{item.unit_price}</td>
                    <td>{item.total}</td>
                  </tr>
                ))}
                <tr className="">
                  <td colSpan={6}>
                    <h6>Items Summary</h6>
                  </td>
                  <td>
                    <h6>
                      {proforma.total} {proforma.currency}
                    </h6>
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
              <div dangerouslySetInnerHTML={{ __html: proforma.description }} />
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
              <br />
              <div className="soft_copy_div">
                <h6>Soft Copy From Supplier </h6>
                <hr />
                <ol>
                  {proforma?.attachments?.map((item, index) => (
                    <li className="text-primary" key={index}>
                      <a
                        // className="text-muted"
                        target="_blank"
                        href={item.file_source}
                        download
                      >
                        {item.filename}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
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
                  {moment(proforma.placed_at).format("lll")}
                </div>
              </div>
            )}
            {proforma.confirmed_by > 0 && (
              <div className="item">
                <img className="signature" src={proforma.confirmed_by_sign} />
                <div className="sign_time">
                  {moment(proforma.confirmed_at).format("lll")}
                </div>
              </div>
            )}

            {proforma.submitted_by > 0 && (
              <div className="item">
                <img className="signature" src={proforma.submitted_by_sign} />
                <div className="sign_time">
                  {moment(proforma.submitted_at).format("lll")}
                </div>
              </div>
            )}

            {proforma.checked_by > 0 && (
              <div className="item">
                <img className="signature" src={proforma.checked_by_sign} />
                <div className="sign_time">
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
                  {moment(proforma.cost_approved_at).format("lll")}
                </div>
              </div>
            )}

            {proforma.finalized_by > 0 && (
              <div className="item">
                <img className="signature" src={proforma.finalized_by_sign} />
                <div className="sign_time">
                  {moment(proforma.finalized_at).format("lll")}
                </div>
              </div>
            )}

            {proforma.approved_by > 0 && (
              <div className="item">
                <img className="signature" src={proforma.approved_by_sign} />
                <div className="sign_time">
                  {moment(proforma.approved_at).format("lll")}
                </div>
              </div>
            )}

            {proforma.received_by > 0 && (
              <div className="item">
                <img className="signature" src={proforma.received_by_sign} />
                <div className="sign_time">
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
