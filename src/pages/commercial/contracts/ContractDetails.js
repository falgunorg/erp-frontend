import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Modal, Button, Badge } from "react-bootstrap";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import moment from "moment/moment";

export default function ContractDetails(props) {
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
      pdf.save("purchase-order.pdf");
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

  const [purchaseContract, setPurchaseContract] = useState({});
  const [purchaseContractItems, setPurchaseContractItems] = useState([]);

  const getContract = async () => {
    setSpinner(true);
    var response = await api.post("/merchandising/purchase-contracts-show", {
      id: params.id,
    });
    if (response.status === 200 && response.data) {
      setPurchaseContract(response.data.data);
      setPurchaseContractItems(response.data.data.lc_items);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getContract();
  }, []);

  // useEffect(() => {
  //   const checkAccess = async () => {
  //     if (props.userData?.department_title !== "Commercial") {
  //       await swal({
  //         icon: "error",
  //         text: "You Cannot Access This Section.",
  //         closeOnClickOutside: false,
  //       });

  //       history.push("/dashboard");
  //     }
  //   };
  //   checkAccess();
  // }, [props, history]);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}

      <div className="create_page_heading">
        <div className="page_name">Purchase Contarct Details</div>
        <div className="actions">
          <Link onClick={PrintPdf} className="btn btn-info btn-sm">
            <i className="fas fa-print"></i>
          </Link>

          <Link onClick={generatePdf} className="btn btn-warning bg-falgun ">
            <i className="fas fa-download"></i>
          </Link>
          <Link to="/commercial/contracts" className="btn btn-danger">
            <i className="fal fa-times"></i>
          </Link>
        </div>
      </div>

      <div className="preview_print page" id="pdf_container">
        <div className="border" style={{ padding: "15px" }}>
          <h4 className="text-center">Purchase Contarct</h4>
          <br />
          <br />
          <div className="row">
            <div className="col-lg-6">
              <table className="table text-start align-middle table-bordered table-hover mb-0">
                <tbody>
                  <tr>
                    <td>
                      <strong>{purchaseContract.title}</strong>
                    </td>
                    <td>
                      <strong>ORDER QTY</strong>
                    </td>
                    <td>
                      <strong>VALUE</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {purchaseContract.issued_date
                        ? moment(purchaseContract.issued_date).format("ll")
                        : ""}
                    </td>
                    <td>{purchaseContract.total_qty} PCS</td>
                    <td>
                      {purchaseContract.currency}{" "}
                      {purchaseContract.total_amount}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <strong>TOTAL</strong>
                    </td>

                    <td>
                      <strong>{purchaseContract.total_qty} PCS</strong>
                    </td>
                    <td>
                      <strong>
                        {" "}
                        {purchaseContract.currency}{" "}
                        {purchaseContract.total_amount}{" "}
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>TAG NO:{purchaseContract.tag_number}</strong>
                    </td>

                    <td>
                      Shipment:{" "}
                      {purchaseContract.shipment_date
                        ? moment(purchaseContract.shipment_date).format("ll")
                        : ""}
                    </td>
                    <td>
                      Expiry:{" "}
                      {purchaseContract.expiry_date
                        ? moment(purchaseContract.expiry_date).format("ll")
                        : ""}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <br />
          <br />

          <hr />
          <h6>BTB LC's</h6>
          <div className="Import_purchase_item_table">
            <table className="table text-start align-middle table-bordered table-hover mb-0">
              <thead className="bg-dark text-white">
                <tr>
                  <th>#</th>
                  <th>BTB LC</th>
                  <th>Apply Date</th>
                  <th>Issued Date</th>
                  <th>Bank</th>
                  <th>Value</th>
                  <th>Supplier</th>
                  <th>Drafts at</th>
                  <th>Commodity</th>
                  <th>PI NO.</th>
                  <th>Amount</th>
                  <th>Maturity Date</th>
                  <th>Paid Date</th>
                </tr>
              </thead>
              <tbody>
                {purchaseContractItems.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.lc_number}</td>
                    <td>
                      {" "}
                      {item.apply_date
                        ? moment(item.apply_date).format("ll")
                        : ""}
                    </td>
                    <td>
                      {" "}
                      {item.issued_date
                        ? moment(item.issued_date).format("ll")
                        : ""}
                    </td>
                    <td>{item.bank}</td>
                    <td>
                      {item.currency} {item.amount}
                    </td>
                    <td>
                      {item.supplier}, {item.supplier_city},
                      {item.supplier_country}
                    </td>
                    <td>{item.lc_validity}</td>
                    <td>{item.commodity}</td>
                    <td>
                      {item.proformas.map((pi, piIndex) => (
                        <span key={piIndex}>{pi.pi_number}, </span>
                      ))}
                    </td>
                    <td>{item.amount}</td>
                    <td>
                      {" "}
                      {item.maturity_date
                        ? moment(item.maturity_date).format("ll")
                        : ""}
                    </td>
                    <td>
                      {" "}
                      {item.paid_date
                        ? moment(item.paid_date).format("ll")
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
