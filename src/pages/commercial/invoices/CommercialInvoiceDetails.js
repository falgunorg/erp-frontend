import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import api from "services/api";

const CompanyHeader = ({ invoice }) => (
  <div className="d-flex justify-content-between align-items-start mb-3">
    <div className="d-flex align-items-center">
      <img
        src="/logo192.png"
        alt="logo"
        style={{ width: 80, height: 80, objectFit: "contain" }}
        className="me-3"
      />
      <div>
        <h5 className="mb-0">Your Company Name</h5>
        <div className="small text-muted">
          Address line 1 · Address line 2 · City, Country
        </div>
        <div className="small text-muted">
          Phone: +88 0123456789 · Email: info@company.com
        </div>
      </div>
    </div>

    <div className="text-end">
      <h6 className="mb-0">COMMERCIAL INVOICE</h6>
      {invoice && (
        <>
          <div>
            Invoice: <strong>{invoice.invoice_no}</strong>
          </div>
          <div>
            Date: <strong>{invoice.inv_date}</strong>
          </div>
        </>
      )}
    </div>
  </div>
);

const InvoiceTableRow = ({ label, value }) => (
  <tr>
    <th style={{ width: 220 }}>{label}</th>
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
        setInvoice(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load invoice");
      }
    };
    load();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handlePdf = async () => {
    if (!printRef.current) return;
    const element = printRef.current;
    const originalBg = element.style.backgroundColor;
    // give a white background for PDF
    element.style.backgroundColor = "#fff";

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    // calculate image height to keep aspect ratio
    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pageWidth - 20; // margin
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
    pdf.addImage(imgData, "JPEG", 10, 10, imgWidth, imgHeight);
    pdf.save(`invoice-${invoice?.invoice_no || id}.pdf`);

    element.style.backgroundColor = originalBg;
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
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Invoice Details</h4>
        <div>
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
      </div>

      <div
        ref={printRef}
        className="p-4"
        style={{ background: "#f9fafb", borderRadius: 6 }}
      >
        <div className="card p-4 border-0 shadow-sm">
          <CompanyHeader invoice={invoice} />

          <div className="row mb-3">
            <div className="col-md-6">
              <h6 className="mb-2">Consignee / Buyer</h6>
              <table className="table table-borderless mb-0">
                <tbody>
                  <InvoiceTableRow label="Buyer ID" value={invoice.buyer_id} />
                  <InvoiceTableRow
                    label="Destination Country"
                    value={invoice.destination_country}
                  />
                  <InvoiceTableRow
                    label="Forwarder"
                    value={invoice.forwarder}
                  />
                </tbody>
              </table>
            </div>

            <div className="col-md-6">
              <h6 className="mb-2">Shipment & Bank</h6>
              <table className="table table-borderless mb-0">
                <tbody>
                  <InvoiceTableRow label="Bank" value={invoice.bank_id} />
                  <InvoiceTableRow
                    label="Mode of Shipment"
                    value={invoice.mode_of_shipment}
                  />
                  <InvoiceTableRow
                    label="Onboard Date"
                    value={invoice.onboard_date}
                  />
                </tbody>
              </table>
            </div>
          </div>

          <h6 className="mb-2">Summary</h6>
          <div className="table-responsive mb-3">
            <table className="table table-striped">
              <thead className="table-light">
                <tr>
                  <th>Contract</th>
                  <th>Invoice No</th>
                  <th>Invoice Date</th>
                  <th>Qty</th>
                  <th>Exp. Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{invoice.contract_id}</td>
                  <td>{invoice.invoice_no}</td>
                  <td>{invoice.inv_date}</td>
                  <td>{invoice.qty}</td>
                  <td>{invoice.exp_value ?? "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="row mt-3">
            <div className="col-md-6">
              <h6>Export / Shipping Details</h6>
              <table className="table table-sm table-borderless">
                <tbody>
                  <InvoiceTableRow label="EXP No" value={invoice.exp_no} />
                  <InvoiceTableRow label="EXP Date" value={invoice.exp_date} />
                  <InvoiceTableRow label="BL No" value={invoice.bl_no} />
                  <InvoiceTableRow
                    label="Container No"
                    value={invoice.container_no}
                  />
                </tbody>
              </table>
            </div>

            <div className="col-md-6">
              <h6>Realization</h6>
              <table className="table table-sm table-borderless">
                <tbody>
                  <InvoiceTableRow
                    label="Bank Bill No"
                    value={invoice.bank_bill_no}
                  />
                  <InvoiceTableRow
                    label="Payment Tenor"
                    value={invoice.payment_tenor}
                  />
                  <InvoiceTableRow
                    label="Proceed Realization Due"
                    value={invoice.proceed_realization_due_date}
                  />
                  <InvoiceTableRow
                    label="Export Proceed Realization Value"
                    value={invoice.export_proceed_realization_value}
                  />
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-3">
            <h6>Remarks</h6>
            <p style={{ whiteSpace: "pre-wrap" }}>{invoice.remarks}</p>
          </div>

          <div className="text-end mt-4">
            <small className="text-muted">Generated by Your Company</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommercialInvoiceDetails;
