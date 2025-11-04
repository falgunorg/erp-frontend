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
    var response = await api.post("/commercial/lcs-show", { id: params.id });
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

  useEffect(async () => {
    props.setHeaderData({
      pageName: "BBLC DETAILS",
      isNewButton: true,
      newButtonLink: "",
      newButtonText: "New BB",
      isInnerSearch: true,
      innerSearchValue: "",
    });
  }, []);

  return (
    <div className="create_edit_page contract-page tna_page">
      {spinner && <Spinner />}
      <div className="d-flex justify-content-end no-print">
        <Link onClick={PrintPdf} className="btn btn-info btn-sm me-2">
          <i className="fas fa-print"></i>
        </Link>
        <Link onClick={generatePdf} className="btn btn-warning btn-sm me-2 ">
          <i className="fas fa-download"></i>
        </Link>
        <Link to="/commercial/lcs" className="btn btn-danger btn-sm me-2">
          <i className="fal fa-times"></i>
        </Link>
      </div>

      <div
        className="preview_print page create_technical_pack"
        id="pdf_container"
      >
        <div className="create_tp_body container-fluid">
          <br />
          <h4 className="text-center">BANK NAME </h4>
          <h6 className="text-center text-underline">
            <u>LETTER OF CREDIT</u>
          </h6>
          <br />

          <div className="row">
            <div className="col-sm-6 col-md-6 col-lg-6">
              <div className="row">
                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">LC Number:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">{lc.lc_number}</div>
                </div>
                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">Applicant:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">
                    {lc.contract?.company?.title} <br />
                    {lc.contract?.company?.address}
                  </div>
                </div>

                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">Responsible:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">
                    {lc.user?.full_name} <br />
                    {lc.user?.employee_id}
                  </div>
                </div>

                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">Net Weight:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">{lc.net_weight}(KG)</div>
                </div>

                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">Gross Weight:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">{lc.gross_weight}(KG)</div>
                </div>

                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">Freight Charge:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">{lc.freight_charge}</div>
                </div>

                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">Total LC Value:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">{lc.total}</div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-6 col-lg-6">
              <div className="row">
                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">PC/MASTER:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">
                    <Link
                      to={"/commercial/contracts/details/" + lc.contract?.id}
                    >
                      {lc.contract?.title}
                    </Link>
                  </div>
                </div>

                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">Issued date:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">
                    {moment(lc.issued_date).format("ll")}
                  </div>
                </div>

                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">Delivery date:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">
                    {moment(lc.delivery_date).format("ll")}
                  </div>
                </div>

                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">LC Validity:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">{lc.lc_validity}</div>
                </div>

                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">Supplier:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">
                    {lc.supplier?.company_name} <br />
                    {lc.supplier?.address},{lc.supplier?.city},
                    {lc.supplier?.country}
                  </div>
                </div>

                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">Responsible:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">
                    {lc.supplier?.attention_person} <br />
                    {lc.supplier?.mobile_number}
                  </div>
                </div>

                <div className="col-sm-4 col-md-4 col-lg-4">
                  <div className="form-label">Status:</div>
                </div>
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="form-value">{lc.status}</div>
                </div>
              </div>
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
                  <th>Net Weight(KG)</th>
                  <th>Gross Weight(KG)</th>
                  <th>Freight Charge(USD)</th>
                  <th>Total(USD)</th>
                </tr>
              </thead>
              <tbody>
                {lcItems.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <Link to={"/merchandising/lcs-details/" + item.id}>
                        {item.title}
                      </Link>
                    </td>
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
                  <td colSpan={5}>
                    <strong>Items Summary</strong>
                  </td>
                  <td>
                    <strong>{lc.net_weight}</strong>
                  </td>
                  <td>
                    <strong>{lc.gross_weight}</strong>
                  </td>
                  <td>
                    <strong>{lc.freight_charge}</strong>
                  </td>
                  <td>
                    <strong>{lc.total}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
          </div>

          <div className="row">
            <div className="col-sm-2 col-md-2 col-lg-2">
              <div className="form-label">Payment Terms:</div>
            </div>
            <div className="col-sm-4 col-md-4 col-lg-4">
              <div className="form-value">{lc.payment_terms}</div>
            </div>

            <div className="col-sm-2 col-md-2 col-lg-2">
              <div className="form-label">Mode Of Shipment:</div>
            </div>
            <div className="col-sm-4 col-md-4 col-lg-4">
              <div className="form-value">{lc.mode_of_shipment}</div>
            </div>

            <div className="col-sm-2 col-md-2 col-lg-2">
              <div className="form-label">Port of Loading:</div>
            </div>
            <div className="col-sm-4 col-md-4 col-lg-4">
              <div className="form-value">{lc.port_of_loading}</div>
            </div>

            <div className="col-sm-2 col-md-2 col-lg-2">
              <div className="form-label">Port of Discharge:</div>
            </div>
            <div className="col-sm-4 col-md-4 col-lg-4">
              <div className="form-value">{lc.port_of_discharge}</div>
            </div>
          </div>

          <div
            dangerouslySetInnerHTML={{ __html: lc.description }}
            className="form-value"
          ></div>
        </div>
      </div>
    </div>
  );
}
