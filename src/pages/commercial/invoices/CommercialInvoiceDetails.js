import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import api from "services/api";
import Logo from "../../../assets/images/logos/logo-short.png";
import moment from "moment";

const InvoiceTableRow = ({ label, value }) => (
  <tr>
    <th style={{ width: 180, fontWeight: 500 }}>{label}</th>
    <td>{value ?? "-"}</td>
  </tr>
);

const CommercialInvoiceDetails = (props) => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/commercial/commercial-invoices/${id}`);
        const data = await res.data;
        data.pos = JSON.parse(data.pos || "[]");
        setInvoice(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load invoice");
      }
    };
    load();
  }, [id]);

  const handlePrint = () => window.print();

  const handlePdf = async () => {
    if (!printRef.current) return;
    const element = printRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pageWidth - 20;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
    pdf.addImage(imgData, "JPEG", 10, 10, imgWidth, imgHeight);
    pdf.save(`invoice-${invoice?.invoice_no || id}.pdf`);
  };

  useEffect(() => {
    props.setHeaderData({
      pageName: "INVOICE DETAILS",
      isNewButton: true,
      newButtonLink: "",
      newButtonText: "NEW INVOICE",
      isInnerSearch: true,
      innerSearchValue: "",
    });
  }, []);

  if (!invoice) return <p>Loading...</p>;

  return (
    <div className="contract-page">
      <div className="d-flex justify-content-end mb-3 no-print non_printing_area">
        <Link
          className="btn btn-outline-secondary me-2"
          to={`/commercial-invoices/${id}/edit`}
        >
          Edit
        </Link>
        <button className="btn btn-outline-success me-2" onClick={handlePdf}>
          Export PDF
        </button>
        <button className="btn btn-primary" onClick={handlePrint}>
          Print
        </button>
      </div>

      <div className="row">
        <div className="col-6">
          <div ref={printRef} style={{ background: "#fff", padding: "10px" }}>
            <div
              className="invoice-wrapper"
              style={{ fontSize: "13px", lineHeight: "1.4" }}
            >
              {/* Header */}
              <div className="d-flex justify-content-between align-items-start pb-3">
                <div className="d-flex gap_10">
                  <img
                    src={Logo}
                    alt="logo"
                    style={{ width: 70, height: "auto", marginBottom: 10 }}
                  />
                  <div className="text-uppercase">
                    <h4
                      className="fw-bold mb-1"
                      style={{ letterSpacing: "1px" }}
                    >
                      COMMERCIAL INVOICE
                    </h4>
                    <div>{invoice?.contract?.company?.title}</div>
                    <div>{invoice?.contract?.company?.address}</div>
                    <div>Phone: {invoice?.contract?.company?.phone}</div>
                  </div>
                </div>

                <table
                  className="table-borderless text-end text-uppercase"
                  style={{ fontSize: "14px" }}
                >
                  <tbody>
                    <tr>
                      <th className="text-end pe-3">Invoice No:</th>
                      <td>{invoice.invoice_no}</td>
                    </tr>
                    <tr>
                      <th className="text-end pe-3">Invoice Date:</th>
                      <td>{moment(invoice.inv_date).format("MMM Do YYYY")}</td>
                    </tr>
                    <tr>
                      <th className="text-end pe-3">Contract No:</th>
                      <td>{invoice.contract?.title}</td>
                    </tr>
                    <tr>
                      <th className="text-end pe-3">Export No:</th>
                      <td>{invoice.exp_no}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="row mb-4">
                {/* Buyer */}
                <div className="col-6 text-uppercase">
                  <h6 className="fw-bold border-bottom pb-1">
                    BUYER / CONSIGNEE
                  </h6>
                  <div>{invoice.buyer?.name}</div>
                  <div>
                    {invoice.buyer?.address}, {invoice.buyer?.country}
                  </div>
                  <div>Phone: {invoice.buyer?.phone}</div>
                </div>

                {/* Bank */}
                <div className="col-6">
                  <h6 className="fw-bold border-bottom pb-1">CONSIGNEE BANK</h6>
                  <div>{invoice.bank?.title}</div>
                  <div>{invoice.bank?.address}</div>
                  <div>SWIFT: {invoice.bank?.swift_code}</div>
                  <div>ACC: {invoice.bank?.account_number}</div>
                </div>
              </div>

              {/* Export / Shipping Info */}
              <div className="row mb-4 text-uppercase">
                <div className="col-6">
                  <h6 className="fw-bold border-bottom pb-1">
                    SHIPPING / EXPORT DETAILS
                  </h6>
                  <table className="table table-sm table-borderless">
                    <tbody>
                      <InvoiceTableRow
                        label="Mode of Shipment"
                        value={invoice.mode_of_shipment}
                      />
                      <InvoiceTableRow
                        label="Destination Country"
                        value={invoice.destination_country}
                      />
                      <InvoiceTableRow label="EP No" value={invoice.ep_no} />
                      <InvoiceTableRow
                        label="EP Date"
                        value={moment(invoice.ep_date).format("MMM Do YYYY")}
                      />
                    </tbody>
                  </table>
                </div>

                <div className="col-6">
                  <h6 className="fw-bold border-bottom pb-1">
                    LOGISTICS DETAILS
                  </h6>
                  <table className="table table-sm table-borderless">
                    <tbody>
                      <InvoiceTableRow label="BL No" value={invoice.bl_no} />
                      <InvoiceTableRow
                        label="Container No"
                        value={invoice.container_no}
                      />
                      <InvoiceTableRow
                        label="Vessel Name"
                        value={invoice.vessel_name}
                      />
                      <InvoiceTableRow
                        label="Onboard Date"
                        value={moment(invoice.onboard_date).format(
                          "MMM Do YYYY"
                        )}
                      />
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Items Table */}
              <h6 className="fw-bold border-bottom pb-1 mb-2">
                INVOICE ITEM DETAILS
              </h6>

              <table
                className="table table-bordered table-sm mb-4"
                style={{ fontSize: "13px" }}
              >
                <thead style={{ background: "#f2f2f2" }}>
                  <tr>
                    <th>PO No</th>
                    <th>ITEM</th>
                    <th>Color</th>
                    <th>Size</th>
                    <th className="text-end">Qty (PCS)</th>
                    <th className="text-end">FOB</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items?.map((it) => (
                    <tr key={it.id}>
                      <td>{it.po?.po_number}</td>
                      <td>{it.po?.techpack?.techpack_number}</td>
                      <td>{it.color}</td>
                      <td>{it.size}</td>
                      <td className="text-end">{it.qty}</td>
                      <td className="text-end">$ {it.fob}</td>
                      <td className="text-end">$ {it.total}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan="3" className="text-end">
                      TOTAL:
                    </th>
                    <th className="text-end">{invoice.qty} PCS</th>
                    <th></th>
                    <th className="text-end">$ {invoice.exp_value}</th>
                  </tr>
                </tfoot>
              </table>

              {/* Summary Section */}
              <div className="row mb-4 text-uppercase">
                <div className="col-6">
                  <h6 className="fw-bold border-bottom pb-1">SUMMARY</h6>
                  <div>
                    <strong>
                      Contract Value: $ {invoice.contract?.contract_value}
                    </strong>
                  </div>
                  <div>
                    <strong>Invoice Value: $ {invoice.exp_value}</strong>
                  </div>
                  <div>
                    <strong>Total Quantity: {invoice.qty} PCS</strong>
                  </div>
                  <br />
                  <div>
                    <strong>Gross Weight: {invoice.gross_weight ?? "-"}</strong>
                  </div>
                  <div>
                    <strong>Net Weight: {invoice.net_weight ?? "-"}</strong>
                  </div>
                  <div>
                    <strong>Total CBM: {invoice.total_cbm ?? "-"}</strong>
                  </div>
                  <div>
                    <strong>CTN SIZE: {invoice.ctn_size ?? "-"}</strong>
                  </div>
                </div>

                <div className="col-6">
                  <h6 className="fw-bold border-bottom pb-1">REMARKS</h6>
                  <p style={{ minHeight: "50px" }}>
                    {invoice.remarks ?? "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6">
          <div style={{ width: "100%", height: "calc(100vh - 125px)" }}>
            <iframe
              src={invoice.file_path}
              title="PDF Viewer"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommercialInvoiceDetails;
