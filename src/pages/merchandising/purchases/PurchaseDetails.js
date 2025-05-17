import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import swal from "sweetalert";
import moment from "moment";

export default function PurchaseDetails(props) {
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

  const [purchase, setPurchase] = useState({});
  const [purchaseItems, setPurchaseItems] = useState([]);

  const getPurchase = async () => {
    setSpinner(true);
    var response = await api.post("/purchases-show", { id: params.id });
    if (response.status === 200 && response.data) {
      setPurchase(response.data.data);
      setPurchaseItems(response.data.data.purchase_items);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getPurchase();
  }, []);
  useEffect(async () => {
    props.setSection("merchandising");
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      const allowedDepartments = [
        "Merchandising",
        "Planing",
        "Commercial",
        "Management",
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
        <div className="page_name">Purchase Details</div>
        <div className="actions">
          <Link to="#" onClick={PrintPdf} className="btn btn-info btn-sm">
            <i className="fas fa-print"></i>
          </Link>

          <Link to="#" onClick={generatePdf} className="btn btn-warning bg-falgun ">
            <i className="fas fa-download"></i>
          </Link>
          <Link
            to={"/merchandising/purchases-edit/" + purchase.id}
            className="btn btn-warning"
          >
            <i className="fal fa-pen"></i>
          </Link>
          <Link to="/merchandising/purchases" className="btn btn-danger">
            <i className="fal fa-times"></i>
          </Link>
        </div>
      </div>

      <div className="preview_print page" id="pdf_container">
        <div className="container border ">
          <br />
          <h4 className="text-center">Purchase Order</h4>
          <br />
          <div className="row">
            <div className="col-lg-12">
              <table className="table table-striped text-start align-middle table-bordered table-hover mb-0">
                <tbody>
                  <tr>
                    <td>
                      <strong>PO(SYSTEM DEFAULT)</strong>
                    </td>
                    <td>
                      <strong>PO NUMBER</strong>
                    </td>
                    <td>
                      <strong>PURCHASE CONTRACT</strong>
                    </td>
                    <td>
                      <strong>BUYER</strong>
                    </td>
                    <td>
                      <strong>STYLE/TECHPACK</strong>
                    </td>
                    <td>
                      <strong>SEASON</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>{purchase.sd_po}</td>
                    <td>{purchase.po_number}</td>
                    <td>{purchase.purchase_contarct}</td>
                    <td>{purchase.buyer}</td>
                    <td>{purchase.techpack}</td>
                    <td>{purchase.season}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>VENDOR</strong>
                    </td>
                    <td>
                      <strong>CURRENCY</strong>
                    </td>
                    <td>
                      <strong>OTY</strong>
                    </td>
                    <td>
                      <strong>TOTAL AMOUNT</strong>
                    </td>
                    <td>
                      <strong>SHIPPING METHOD</strong>
                    </td>
                    <td colSpan={1}></td>
                  </tr>
                  <tr>
                    <td>{purchase.vendor}</td>
                    <td>{purchase.currency}</td>
                    <td>{purchase.total_qty}</td>
                    <td>{purchase.total_amount}</td>
                    <td>{purchase.shipping_method}</td>
                    <td colSpan={1}></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>ISSUED DATE</strong>
                    </td>
                    <td>
                      <strong>SHIPMENT DATE</strong>
                    </td>
                    <td>
                      <strong>DELIVERY DATE</strong>
                    </td>
                    <td>
                      <strong>REVISED DATE</strong>
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                  <tr>
                    <td>{moment(purchase.order_date).format("ll")}</td>
                    <td>{moment(purchase.shipment_date).format("ll")}</td>
                    <td>{purchase.delivery_date}</td>
                    <td>{purchase.revised_date}</td>
                    <td colSpan={2}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <br />
          <h6>ITEM'S</h6>
          <div className="Import_purchase_item_table">
            <table className="table text-start align-middle table-bordered table-hover mb-0">
              <thead className="bg-dark text-white">
                <tr>
                  <th>#</th>
                  <th>Particulars</th>
                  <th>Size</th>
                  <th>Color</th>
                  <th>Unit Price</th>
                  <th>QTY</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {purchaseItems.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>

                    <td>
                      <pre>{item.description}</pre>
                    </td>
                    <td>{item.size}</td>
                    <td>{item.color}</td>
                    <td>{item.unit_price}</td>
                    <td>{item.qty}</td>
                    <td>{item.total}</td>
                  </tr>
                ))}

                <br />
                <br />
                <tr className="text-center">
                  <td colSpan={5}>
                    <h6>Items Summary</h6>
                  </td>

                  <td>
                    <h6>{purchase.total_qty}</h6>
                  </td>
                  <td>
                    <h6>{purchase.total_amount}</h6>
                  </td>
                </tr>
              </tbody>
            </table>
            <br />

            <div className="row">
              <div className="col-lg-2">
                <h6>Revised Note:</h6>
              </div>
              <div className="col-lg-8">
                <div
                  dangerouslySetInnerHTML={{
                    __html: purchase.revised_note,
                  }}
                />
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-lg-2">
                <h6>Packing Instructions:</h6>
              </div>
              <div className="col-lg-8">
                <div
                  dangerouslySetInnerHTML={{
                    __html: purchase.packing_instructions,
                  }}
                />
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-lg-2">
                <h6>Packing Method:</h6>
              </div>
              <div className="col-lg-8">
                <div
                  dangerouslySetInnerHTML={{
                    __html: purchase.packing_method,
                  }}
                />
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-lg-2">
                <h6>Comment:</h6>
              </div>
              <div className="col-lg-8">
                <div
                  dangerouslySetInnerHTML={{
                    __html: purchase.comment,
                  }}
                />
              </div>
            </div>
            <br />

            <div className="row">
              <div className="col-lg-2">
                <h6>Attachment's:</h6>
              </div>
              <div className="col-lg-8">
                <div className="attachment_list">
                  {purchase &&
                  purchase.attachments &&
                  purchase.attachments.length > 0
                    ? purchase.attachments.map((value, index) => (
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
                          <a target="_blank" href={value.file_source} download>
                            <div className="item">
                              <div className="text-muted">{value.filename}</div>
                              {/* <div className="text-muted">200 kb</div> */}
                            </div>
                          </a>
                        </div>
                      ))
                    : "No Attachment Here"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
