import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Modal, Button, Badge } from "react-bootstrap";
import api from "services/api";
import Spinner from "elements/Spinner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import moment from "moment/moment";
import swal from "sweetalert";

export default function AdminPurchaseContractDetails(props) {
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
    window.print();
  };

  const [purchaseContract, setPurchaseContract] = useState({});
  const [purchaseContractItems, setPurchaseContractItems] = useState([]);

  const [purchases, setPurchases] = useState([]);
  const [proformas, setProformas] = useState([]);
  const getContract = async () => {
    setSpinner(true);
    var response = await api.post("/merchandising/purchase-contracts-show", {
      id: params.id,
    });
    if (response.status === 200 && response.data) {
      setPurchaseContract(response.data.data);
      setPurchaseContractItems(response.data.data.lc_items);
      setPurchases(response.data.purchases);
      setProformas(response.data.proformas);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getContract();
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      const allowedDepartments = [
        "Merchandising",
        "Sample",
        "Planing",
        "Management",
        "Commercial",
        "Accounts & Finance",
        "IT",
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
        <div className="page_name">Purchase Contarct Details</div>
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
          <Link
            to="/merchandising/purchase-contracts"
            className="btn btn-danger"
          >
            <i className="fal fa-times"></i>
          </Link>
        </div>
      </div>

      <div className="preview_print page" id="pdf_container">
        <div className="border" style={{ padding: "15px" }}>
          <h6 className="text-center">
            <u>PC/JOB/MASTER DETAILS</u>
          </h6>
          <br />
          <div className="row">
            <div className="col-lg-6">
              <table className="table text-start align-middle table-bordered table-hover mb-0">
                <tbody>
                  <tr>
                    <td>
                      <strong>TAG/ORDER NO</strong>
                    </td>
                    <td>
                      <strong>ORDER QTY</strong>
                    </td>
                    <td>
                      <strong>VALUE</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>{purchaseContract.tag_number}</td>
                    <td>{purchaseContract.total_qty} PCS</td>
                    <td>
                      {purchaseContract.total_amount}{" "}
                      {purchaseContract.currency}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <strong>BUYER</strong>
                    </td>

                    <td>
                      <strong>SHIPMENT</strong>
                    </td>
                    <td>
                      <strong>EXPIRY</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>{purchaseContract.buyer}</td>
                    <td>
                      {purchaseContract.shipment_date
                        ? moment(purchaseContract.shipment_date).format("ll")
                        : ""}
                    </td>
                    <td>
                      {purchaseContract.expiry_date
                        ? moment(purchaseContract.expiry_date).format("ll")
                        : ""}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <hr />
          <h6>PO's</h6>
          <div className="lists">
            {purchases.map((purchase, index) => (
              <div
                key={index}
                style={{
                  background: "rgb(223 223 223)",
                  border: "1px solid grey",
                  padding: "15px",
                  marginBottom: "15px",
                  borderRadius: "5px",
                }}
                className="jumbotron"
              >
                <div
                  className="d-flex"
                  style={{ justifyContent: "space-between" }}
                >
                  <div className="item">
                    <h6>BUDGET</h6>
                    <p>{purchase.budget?.budget_number}</p>
                  </div>
                  <div className="item">
                    <h6>PO</h6>
                    <p>{purchase.po_number}</p>
                  </div>
                  <div className="item">
                    <h6>STYLE/TECHPACK</h6>
                    <p>{purchase.techpack}</p>
                  </div>
                  <div className="item">
                    <h6>QTY(PCS)</h6>
                    <p>{purchase.qty}</p>
                  </div>
                  <div className="item">
                    <h6>VALUE</h6>
                    <p>{purchase.value} USD</p>
                  </div>
                </div>
                <h6>PO ITEMS</h6>
                <div className="table-responsive">
                  <table className="table text-start align-middle table-bordered table-hover mb-0">
                    <thead className="bg-dark text-white">
                      <tr>
                        <th>#</th>
                        <th>Particular</th>
                        <th>Size </th>
                        <th>Color</th>
                        <th>Unit Price</th>
                        <th>Qty</th>
                        <th>Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchase?.purchase_items &&
                        purchase.purchase_items.length > 0 &&
                        purchase.purchase_items.map((item, index2) => (
                          <tr key={index2}>
                            <td>{index2 + 1}</td>
                            <td>{item.description}</td>
                            <td>{item.size}</td>
                            <td>{item.color}</td>
                            <td>{item.unit_price}</td>
                            <td>{item.qty}</td>
                            <td>{item.total}</td>
                          </tr>
                        ))}

                      <tr>
                        <td colSpan={5}></td>
                        <td>
                          <strong>{purchase.qty} PCS</strong>
                        </td>
                        <td>
                          <strong>{purchase.value} USD</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <br />
                <h6>BOOKING ITEMS FOR THIS PO</h6>
                <div className="table-responsive">
                  <table className="table text-start align-middle table-bordered table-hover mb-0">
                    <thead className="bg-dark text-white">
                      <tr>
                        <th>#</th>
                        <th>B.N</th>
                        <th>Supplier</th>
                        <th>ITEM</th>
                        <th>Size</th>
                        <th>Color</th>
                        <th>Unit</th>
                        <th>Unit Price</th>
                        <th>Qty</th>
                        <th>Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchase?.booking_items &&
                        purchase.booking_items.length > 0 &&
                        purchase.booking_items.map((item, index2) => (
                          <tr key={index2}>
                            <td>{index2 + 1}</td>
                            <td>{item.booking_number}</td>
                            <td>{item.supplier}</td>
                            <td>{item.item_name}</td>
                            <td>{item.size}</td>
                            <td>{item.color}</td>
                            <td>{item.unit}</td>
                            <td>{item.unit_price}</td>
                            <td>{item.qty}</td>
                            <td>{item.total}</td>
                          </tr>
                        ))}

                      <tr>
                        <td colSpan={9}></td>
                        <td>
                          <strong>{purchase.total_booking} USD</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
          <hr />

          <h6>PI's</h6>
          <div className="lists">
            {proformas.map((proforma, index) => (
              <div
                key={index}
                style={{
                  background: "rgb(223 223 223)",
                  border: "1px solid grey",
                  padding: "15px",
                  marginBottom: "15px",
                  borderRadius: "5px",
                }}
                className="jumbotron"
              >
                <div
                  className="d-flex"
                  style={{ justifyContent: "space-between" }}
                >
                  <div className="item">
                    <h6>PI NO.</h6>
                    <p>
                      {proforma.title} | {proforma.proforma_number}
                    </p>
                  </div>
                  <div className="item">
                    <h6>SUPPLIER</h6>
                    <p>{proforma.supplier}</p>
                  </div>
                  <div className="item">
                    <h6>Placed By</h6>
                    <p>{proforma.placed_user}</p>
                  </div>
                  <div className="item">
                    <h6>TOTAL</h6>
                    <p>{proforma.total}</p>
                  </div>
                </div>

                <h6>PI ITEMS</h6>
                <div className="table-responsive">
                  <table className="table text-start align-middle table-bordered table-hover mb-0">
                    <thead className="bg-dark text-white">
                      <tr>
                        <th>#</th>
                        <th>ITEM</th>
                        <th>Unit</th>
                        <th>Unit Price</th>
                        <th>Qty</th>
                        <th>Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proforma?.pi_items.map((item, index2) => (
                        <tr key={index2}>
                          <td>{index2 + 1}</td>
                          <td>{item.item_name}</td>
                          <td>{item.unit}</td>
                          <td>{item.unit_price}</td>
                          <td>{item.qty}</td>
                          <td>{item.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
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
                    <td>{item.bank_name}</td>
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
                        <span key={piIndex}>{pi.title}, </span>
                      ))}
                    </td>
                    <td>{item.total_value}</td>
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
