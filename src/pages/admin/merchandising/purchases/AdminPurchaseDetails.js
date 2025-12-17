import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../../elements/Spinner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import swal from "sweetalert";

export default function AdminPurchaseDetails(props) {
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
    var response = await api.post("/merchandising/purchases-show", { id: params.id });
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

  

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}

      <div className="create_page_heading">
        <div className="page_name">Purchase Details</div>
        <div className="actions">
          <Link onClick={PrintPdf} className="btn btn-info btn-sm">
            <i className="fas fa-print"></i>
          </Link>

          <Link onClick={generatePdf} className="btn btn-warning bg-falgun ">
            <i className="fas fa-download"></i>
          </Link>
          <Link to="/admin/purchases" className="btn btn-danger">
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
                      <strong>STYLE</strong>
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
                      <strong>TOTAL AMOUNT</strong>
                    </td>
                    <td>
                      <strong>SHIPPING METHOD</strong>
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                  <tr>
                    <td>{purchase.vendor}</td>
                    <td>{purchase.currency}</td>
                    <td>{purchase.total_amount}</td>
                    <td>{purchase.shipping_method}</td>
                    <td colSpan={2}></td>
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
                    <td>{purchase.issued_date}</td>
                    <td>{purchase.shipment_date}</td>
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
                  <th>STYLE / SKU</th>
                  <th>Vendor PN</th>
                  <th>UPC/GTIN</th>
                  <th>Description Of Items</th>
                  <th>Size</th>
                  <th>Color</th>
                  <th>Unit</th>
                  <th>Marks & Number</th>
                  <th>UOM</th>
                  <th>Unit Price</th>
                  <th>QTY</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {purchaseItems.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.sku}</td>
                    <td>{item.vendor_pn}</td>
                    <td>{item.upc_gtin}</td>
                    <td>
                      <pre>{item.description}</pre>
                    </td>
                    <td>{item.size}</td>
                    <td>{item.color}</td>
                    <td>{item.unit}</td>
                    <td>{item.marks_number}</td>
                    <td>{item.uom}</td>
                    <td>{item.unit_price}</td>
                    <td>{item.qty}</td>
                    <td>{item.total}</td>
                  </tr>
                ))}

                <br />
                <br />
                <tr className="text-center">
                  <td colSpan={10}>
                    <h5>Items Summary</h5>
                  </td>
                  <td></td>
                  <td>
                    <h5>{purchase.total_qty}</h5>
                  </td>
                  <td>
                    <h5>{purchase.total_amount}</h5>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="row">
              <div className="col-lg-2">
                <h5>Payment Terms:</h5>
              </div>
              <div className="col-lg-8">
                <div
                  dangerouslySetInnerHTML={{
                    __html: purchase.payment_term_details?.description,
                  }}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-lg-2">
                <h5>Delivery Terms:</h5>
              </div>
              <div className="col-lg-8">
                <div
                  dangerouslySetInnerHTML={{
                    __html: purchase.delivery_term_details?.description,
                  }}
                />
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-lg-2">
                <h5>Revised Note:</h5>
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
                <h5>Packing Instructions:</h5>
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
                <h5>Packing Method:</h5>
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
                <h5>Comment:</h5>
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
                <h5>Attachment's:</h5>
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
