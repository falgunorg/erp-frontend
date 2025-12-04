import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "services/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Logo from "../../../assets/images/logos/logo-short.png";

const Row = ({ label, value }) => (
  <tr className="border-b border-gray-400">
    <td className="p-1 font-semibold w-[180px]">{label}</td>
    <td className="p-1">{value || "-"}</td>
  </tr>
);

const CommercialInvoiceDetails = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const load = async () => {
      const res = await api.get(`/commercial/commercial-invoices/${id}`);
      const data = await res.data;
      setInvoice(data);
    };
    load();
  }, [id]);

  if (!invoice) return <p className="p-10">Loading invoice…</p>;

  const handlePdf = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, { scale: 3 });
    const imgData = canvas.toDataURL("image/jpeg", 1);
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;
    pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, imgHeight);
    pdf.save(`Commercial-Invoice-${invoice.invoice_no}.pdf`);
  };

  return (
    <div className="container-fluid bg-light py-4">
      <div className="d-flex justify-content-end mb-3 gap-2">
        <button
          onClick={() => window.print()}
          className="btn btn-success btn-sm"
        >
          PRINT
        </button>
        <button onClick={handlePdf} className="btn btn-primary btn-sm">
          DOWNLOAD PDF
        </button>
      </div>

      <div
        className="bg-white p-4 shadow mx-auto"
        style={{ width: "210mm", minHeight: "297mm" }}
        ref={printRef}
      >
        {/* Company Header */}
        <div className="d-flex border-bottom pb-3">
          <img src={Logo} alt="logo" width={90} className="me-3" />
          <div>
            <h4 className="fw-bold text-uppercase mb-1">
              {invoice.contract.company.title}
            </h4>
            <div className="small">{invoice.contract.company.address}</div>
            <div className="small">
              SWIFT: {invoice.contract.bank.swift_code}
            </div>
          </div>
        </div>

        {/* Invoice Title */}
        <h3 className="text-center text-decoration-underline fw-bold mt-3">
          COMMERCIAL INVOICE
        </h3>

        {/* Invoice Basic Info */}
        <table className="table table-bordered table-sm mt-3 align-middle">
          <tbody>
            <tr>
              <th style={{ width: "22%" }}>INVOICE NO</th>
              <td>{invoice.invoice_no}</td>
            </tr>
            <tr>
              <th>INVOICE DATE</th>
              <td>{invoice.inv_date}</td>
            </tr>
            <tr>
              <th>CONTRACT NO</th>
              <td>{invoice.contract.title}</td>
            </tr>
            <tr>
              <th>ORDER BUYER NO</th>
              <td>{invoice.order_buyer}</td>
            </tr>
            <tr>
              <th>EXPORT LC CONTRACT</th>
              <td>{invoice.export_lc_contract_no}</td>
            </tr>
          </tbody>
        </table>

        {/* Applicant & Beneficiary */}
        <div className="row mt-4">
          <div className="col-6">
            <div className="border p-3">
              <h6 className="fw-bold text-decoration-underline">
                APPLICANT DETAILS
              </h6>
              <p className="mb-1">
                <strong>Name:</strong> {invoice.contract.buyer.name}
              </p>
              <p className="mb-1">
                <strong>Address:</strong> {invoice.contract.buyer_address}
              </p>
              <p className="mb-1">
                <strong>Phone:</strong> {invoice.contract.buyer_phone}
              </p>
              <p className="mb-1">
                <strong>Email:</strong> {invoice.contract.buyer_email}
              </p>
            </div>
          </div>

          <div className="col-6">
            <div className="border p-3">
              <h6 className="fw-bold text-decoration-underline">
                BENEFICIARY DETAILS
              </h6>
              <p className="mb-1">
                <strong>Name:</strong> {invoice.contract.company.title}
              </p>
              <p className="mb-1">
                <strong>Address:</strong> {invoice.contract.company.address}
              </p>
              <p className="mb-1">
                <strong>Phone:</strong> {invoice.user.staff_id}
              </p>
              <p className="mb-1">
                <strong>Email:</strong> {invoice.user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Notify Parties */}
        <div className="row mt-4">
          <div className="col-6">
            <div className="border p-3">
              <h6 className="fw-bold text-decoration-underline">
                NOTIFY PARTY 1
              </h6>
              <p className="mb-1">
                <strong>Name:</strong> {invoice.contract.buyer.name}
              </p>
              <p className="mb-1">
                <strong>Address:</strong> {invoice.contract.buyer.address}
              </p>
            </div>
          </div>

          <div className="col-6">
            <div className="border p-3">
              <h6 className="fw-bold text-decoration-underline">
                NOTIFY PARTY 2
              </h6>
              <p className="mb-1">
                <strong>Name:</strong> {invoice.carrier_forwarder_name}
              </p>
              <p className="mb-1">
                <strong>Address:</strong> {invoice.destination_country}
              </p>
            </div>
          </div>
        </div>

        {/* Shipment Info */}
        <div className="border p-3 mt-4">
          <h6 className="fw-bold text-decoration-underline">
            SHIPMENT INFORMATION
          </h6>
          <p className="mb-1">
            <strong>Port of Shipment:</strong>{" "}
            {invoice.contract.port_of_loading}
          </p>
          <p className="mb-1">
            <strong>Country of Origin:</strong> Bangladesh
          </p>
          <p className="mb-1">
            <strong>Mode of Shipment:</strong> {invoice.mode_of_shpment}
          </p>
          <p className="mb-1">
            <strong>BL No:</strong> {invoice.bl_no}
          </p>
          <p className="mb-1">
            <strong>On Board Date:</strong> {invoice.shipped_onboard_date}
          </p>
        </div>

        {/* Goods Table */}
        <h6 className="fw-bold text-decoration-underline mt-4">
          DETAILS OF PRODUCT
        </h6>

        <table className="table table-bordered table-sm text-center mt-2">
          <thead className="table-light">
            <tr>
              <th>ITEM NO</th>
              <th>STYLE</th>
              <th>DESCRIPTION</th>
              <th>PCS QTY</th>
              <th>CTN QTY</th>
              <th>UNIT PRICE</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>{invoice.item_name}</td>
              <td>{invoice.remarks}</td>
              <td>{invoice.pcs_qty}</td>
              <td>{invoice.ctns_qty}</td>
              <td>$ {invoice.exp_value}</td>
              <td className="fw-bold">$ {invoice.fob_value}</td>
            </tr>
          </tbody>
        </table>

        {/* Summary */}
        <div className="row mt-3">
          <div className="col-4">
            <div className="border p-2">
              <strong>Total Gross Weight:</strong> {invoice.gross_weight_kg} KG
            </div>
          </div>
          <div className="col-4">
            <div className="border p-2">
              <strong>Total Net Weight:</strong> {invoice.net_weight_kg} KG
            </div>
          </div>
          <div className="col-4">
            <div className="border p-2">
              <strong>Total CBM:</strong> 17.12
            </div>
          </div>
        </div>

        {/* Bank Info */}
        <div className="border p-3 mt-4">
          <h6 className="fw-bold text-decoration-underline">
            BANK INFORMATION
          </h6>
          <p className="mb-1">
            <strong>Bank:</strong> {invoice.contract.bank.title}
          </p>
          <p className="mb-1">
            <strong>Branch:</strong> {invoice.contract.bank.branch}
          </p>
          <p className="mb-1">
            <strong>Account No:</strong> {invoice.contract.bank.account_number}
          </p>
          <p className="mb-1">
            <strong>Swift:</strong> {invoice.contract.bank.swift_code}
          </p>
        </div>

        {/* Signature */}
        <div className="text-end mt-5">
          <p className="mb-0">_____________________________</p>
          <p className="fw-bold small">AUTHORIZED SIGNATORY</p>
        </div>
      </div>
    </div>
  );
};

export default CommercialInvoiceDetails;
