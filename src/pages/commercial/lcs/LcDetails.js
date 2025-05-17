import React, { useState, useEffect, Fragment } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import moment from "moment/moment";
import swal from "sweetalert";

export default function LcDetails(props) {
  const userInfo = props.userData;
  const history = useHistory();
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
      pdf.save("lc.pdf");
    });
  };

  const PrintPdf = () => {
    window.print();
  };

  const [lc, setLc] = useState({});
  const [lcItems, setLcItems] = useState([]);
  const getLc = async () => {
    setSpinner(true);
    var response = await api.post("/lcs-show", { id: params.id });
    if (response.status === 200 && response.data) {
      setLc(response.data.data);
      setLcItems(response.data.data.piList);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getLc();
  }, []);
  useEffect(async () => {
    props.setSection("merchandising");
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      const allowedDepartments = ["Commercial", "Management"];
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
        <div className="page_name">LC Details</div>
        <div className="actions">
          <Link onClick={PrintPdf} className="btn btn-info btn-sm">
            <i className="fas fa-print"></i>
          </Link>
          <Link onClick={generatePdf} className="btn btn-warning bg-falgun ">
            <i className="fas fa-download"></i>
          </Link>
          <Link to="/commercial/lcs" className="btn btn-danger">
            <i className="fal fa-times"></i>
          </Link>
        </div>
      </div>

      <div className="preview_print page" id="pdf_container">
        <div className="container border ">
          <br />
          <h4 className="text-center">{lc.supplier}</h4>
          <br />
          <h6 className="text-center text-underline">
            <u>LETTER OF CREDIT</u>
          </h6>

          <div className="row">
            <div className="col">
              <table className="table table-bordered mb-0">
                <tr>
                  <td>SL</td>
                  <td>{lc.serial_number}</td>
                </tr>
                <tr>
                  <td>LC Number</td>
                  <td>{lc.lc_number}</td>
                </tr>
                <tr>
                  <td>APPLICANT</td>
                  <td>
                    {lc.company} <br />
                    {lc.company_address}
                  </td>
                </tr>
                <tr>
                  <td>BANK</td>
                  <td>
                    {lc.bank_name}
                    <br />
                    {lc.bank_branch}, {lc.bank_address},{lc.bank_country}
                  </td>
                </tr>
                <tr>
                  <td>SUPPLIER</td>

                  <td>
                    {lc.supplier} <br />
                    {lc.supplier_address},{lc.supplier_city},
                    {lc.supplier_country}
                  </td>
                </tr>
              </table>
            </div>

            <div className="col">
              <table className="table table-bordered mb-0">
                <tr>
                  <td>PC/MASTER</td>
                  <td>
                    {lc.tag_number} | {lc.contract_number} | ({lc.buyer})
                  </td>
                </tr>
                <tr>
                  <td>ISSUED DATE</td>

                  <td>{moment(lc.issued_date).format("ll")}</td>
                </tr>
                <tr>
                  <td>DELIVERY DATE</td>

                  <td>{moment(lc.delivery_date).format("ll")}</td>
                </tr>
                <tr>
                  <td>PI VALIDITY</td>

                  <td>{lc.lc_validity}</td>
                </tr>

                <tr>
                  <td>RESPONSIBLE</td>

                  <td>
                    {lc.supplier_attention} <br />
                    {lc.supplier_contact}
                  </td>
                </tr>
                <tr>
                  <td>TOTAL VALUE</td>

                  <td>
                    {lc.total_value} {lc.currency}
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <br />
          <h6 className="text-center text-underline">
            <u>PROFORMA INVOICES</u>
          </h6>
          <div className="Import_booking_item_table">
            <table className="table text-start align-middle table-bordered table-hover mb-0">
              <thead className="bg-dark text-white">
                <tr>
                  <th>SL</th>
                  <th>PI</th>
                  <th>Issued</th>
                  <th>Delivery</th>
                  <th>Validity</th>
                  <th>Net Weight</th>
                  <th>Gross Weight</th>
                  <th>Freight Charge</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {lcItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.proforma_number}</td>
                    <td>{item.title}</td>
                    <td> {moment(item.issued_date).format("ll")}</td>
                    <td> {moment(item.delivery_date).format("ll")}</td>
                    <td>{item.pi_validity}</td>
                    <td>{item.net_weight}</td>
                    <td>{item.gross_weight}</td>
                    <td>{item.freight_charge}</td>
                    <td>{item.total}</td>
                  </tr>
                ))}
                <tr className="">
                  <td colSpan={8}>
                    <h6>Items Summary</h6>
                  </td>
                  <td>
                    <h6>
                      {lc.total_value} {lc.currency}
                    </h6>
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
