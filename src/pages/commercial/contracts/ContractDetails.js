import React, { useEffect, useRef, useState } from "react";
import Logo from "../../../assets/images/logos/logo-short.png";
import { useHistory } from "react-router-dom";
import html2pdf from "html2pdf.js";

export default function ContractDetails() {
  const history = useHistory();
  const goBack = () => history.goBack();

  const [activeTab, setActiveTab] = useState("overview");

  const printRef = useRef();

  const [form, setForm] = useState({});
  const [goods, setGoods] = useState([]);

  useEffect(() => {
    setForm({
      contract_no: "BASSPRO-MBL-FALL-25",
      contract_date: "19 January 2025",
      buyer_name: "BASS PRO INC.",
      buyer_address:
        "Sportsman’s Park Center, 2500 E. Kearney, Springfield, Missouri 65898, USA",
      buyer_phone: "(417) 873-5000",
      buyer_email: "chellappa@hot-source.net",
      notify_party:
        "1) BASS PRO INC., SPORTSMAN’S PARK CENTER, 2500 E. KEARNEY, SPRINGFIELD, MISSOURI 65898, USA & EXPEDITORS INTERNATIONAL FREIGHT SERVICE LTD.\n\n2) Cabela's Canada Calgary DC, 12290 18th Street NE, Calgary, ALBERTA T3K 0Y7 CANADA & BORDER BROKERS, 1063 SHERWIN ROAD, WINNIPEG MB R3H 0T8 CANADA",
      buyer_bank:
        "BANK OF AMERICA, 1 Fleetway, Scranton, PA 18507-1999, USA\nSWIFT: BOFAUS3N\nTEL: (570) 330-4573",
      agent_name:
        "SORCOM INVESTMENTS LTD, 4TH FLOOR, 299QRC, 287-299, QUEENS ROAD CENTRAL, HONG KONG\nTEL: 00 852 2218 2203",
      agent_bank:
        "STANDARD CHARTERED BANK, 4-4A DES VOEUX ROAD CENTRAL, HONG KONG\nACCOUNT NO: 447-2-060162-5\nSWIFT: SCBLHKHHXXX",
      beneficiary_name:
        "Modiste (BANGLADESH) Ltd.\n51/C (A) SAGORIKA ROAD, FOUZDERHAT HEAVY INDUSTRIAL AREA, CHITTAGONG 4102, BANGLADESH",
      beneficiary_bank:
        "DHAKA BANK LIMITED, AGRABAD BRANCH, WORLD TRADE CENTER, 102-103 AGRABAD C/A, CHITTAGONG 4100, BANGLADESH\nSWIFT: DHBLBDDH201",
      payment_terms:
        "1) DOCUMENTARY COLLECTIONS (DP)\n2) TT PAYMENT (FOR CANADA SHIPMENT)",
      port_of_discharge:
        "1) SEATTLE TACOMA (FINAL DESTINATION: PUYALLUP, WA – USA)\n2) VANCOUVER, CALGARY, CANADA",
      port_of_loading: "CHITTAGONG, BANGLADESH",
      mode_of_shipment: "SEA / AIR",
      documents_required:
        "a) INVOICE, \nb) PACKING LIST, \nc) CERTIFICATE OF ORIGIN, \nd) SUPPLEMENTARY INVOICE, \ne) BILL OF LADING, \nf) MULTIPLE COUNTRY OF DECLARATION, \ng) MANUFACTURER’S CERTIFICATE, \nh) GCC & BENEFICIARY STATEMENT",
      transshipment: "ALLOWED",
      tolerance: "+/-5% IS ACCEPTABLE",
      defective_allowance:
        "0.5% defective & 0.5% store allowance must be shown in invoice.",
      expiry_date: "15 August 2025",
      reimbursement_instructions:
        "We hereby undertake on behalf of the buyer to honor all documents in compliance with the terms of this contract and remit full invoice payments as per instructions. Shipper will send bank-endorsed OBLs to customer upon receipt of payment.",
      amendment_clause:
        "Any amendment to this Purchase Contract must be signed and sealed by both parties.",
      agent_commission_clause:
        "Agent commission to be remitted to SORCOM INVESTMENTS LTD, 4th Floor, 299QRC, Queens Road Central, Hong Kong, Account No. 447-2-060162-5, Standard Chartered Bank, Hong Kong.",
      buyer_signatory: "M. Chellappa, Director",
      seller_signatory: "Aziz Uddin Ahammed, General Manager, Finance",
    });

    setGoods([
      {
        style: "652NRF252481W",
        description: "Plaid Jacket",
        quantity: 4188,
        unit_price: 15.5,
        total_fob: 64914,
        comm_pc: 1.07,
        total_comm: 4481.16,
        shipment_date: "30-Jul-25",
      },
      {
        style: "652NRF252726K",
        description: "Plaid Shirt Jac",
        quantity: 6816,
        unit_price: 21.95,
        total_fob: 149611.2,
        comm_pc: 1.51,
        total_comm: 10292.16,
        shipment_date: "30-Jul-25",
      },
    ]);
  }, []);

  const handlePrint = () => window.print();

  const handleDownloadPDF = () => {
    const element = printRef.current;
    html2pdf()
      .from(element)
      .set({
        margin: 0.3,
        filename: `${form.contract_no}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .save();
  };

  return (
    <div className="contract-page">
      <div className="no-print">
        <h5>{form.contract_no}</h5>
      </div>
      <hr />
      <div className="mb-4 d-flex no-print">
        {["overview", "backToBack", "documents", "pos"].map((tab) => (
          <div
            key={tab}
            className={`flex-fill text-center py-2 ${
              tab === activeTab ? "bg-primary text-white" : "bg-light"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "overview"
              ? "Overview"
              : tab === "backToBack"
              ? "Back to Back LC"
              : tab === "documents"
              ? "Documents"
              : "PO's"}
          </div>
        ))}
      </div>

      {activeTab === "overview" && (
        <>
          <div className="contract-actions no-print">
            <button onClick={goBack}>← Back</button>
            <button onClick={handlePrint}>🖨️ Print</button>
            <button onClick={handleDownloadPDF}>⬇️ Download PDF</button>
          </div>

          <div className="contract-wrapper" ref={printRef}>
            <p className="buyer-header">
              {form.buyer_name},<br />
              {form.buyer_address}
              <br />
              Ph: {form.buyer_phone}, Email: {form.buyer_email}
            </p>
            <h3 className="sub-title">PURCHASE CONTRACT</h3>

            <div className="contract-body">
              {[
                ["Purchase Contract No", form.contract_no],
                ["Date", form.contract_date],
                ["Buyer", `${form.buyer_name}\n${form.buyer_address}`],
                ["Notify Party", form.notify_party],
                ["Buyer’s Bank", form.buyer_bank],
                ["Agent Name", form.agent_name],
                ["Agent’s Bank", form.agent_bank],
                ["Beneficiary", form.beneficiary_name],
                ["Beneficiary’s Bank", form.beneficiary_bank],
                ["Payment Terms", form.payment_terms],
                ["Port of Discharge", form.port_of_discharge],
                ["Port of Loading", form.port_of_loading],
                ["Mode of Shipment", form.mode_of_shipment],
                ["Documents Required", form.documents_required],
                ["Trans-shipment/Part Shipment", form.transshipment],
                ["Tolerance", form.tolerance],
                ["Defective Allowance", form.defective_allowance],
                ["Expiry Date", form.expiry_date],
              ].map(([label, value], i) => (
                <div className="row mb-1" key={i}>
                  <div className="col-4">
                    <strong>
                      {i + 1}. {label}:
                    </strong>
                  </div>
                  <div className="col-8">
                    <p>{value}</p>
                  </div>
                </div>
              ))}

              <div className="mt-3">
                <strong>19. Particulars of Goods / Services:</strong>
                <table className="contract-table">
                  <thead>
                    <tr>
                      <th>Style</th>
                      <th>Description</th>
                      <th>Qty (PCS)</th>
                      <th>FOB Value</th>
                      <th>Agent Comm/PC</th>
                      <th>Total Comm</th>
                      <th>Ship Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {goods.map((g, i) => (
                      <tr key={i}>
                        <td>{g.style}</td>
                        <td>{g.description}</td>
                        <td>{g.quantity}</td>
                        <td>${g.total_fob.toLocaleString()}</td>
                        <td>${g.comm_pc}</td>
                        <td>${g.total_comm.toLocaleString()}</td>
                        <td>{g.shipment_date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="section-title">REIMBURSEMENT INSTRUCTIONS:</p>
            {form.reimbursement_instructions}
            <p>
              <strong>21.</strong> {form.amendment_clause}
            </p>
            <p>
              <strong>22.</strong> {form.agent_commission_clause}
            </p>

            <div className="signatures">
              <div>
                <p>
                  <strong>For and on behalf of</strong>
                  <br />
                  BASS PRO INC.
                </p>
                <br />
                <p>{form.buyer_signatory}</p>
              </div>
              <div>
                <p>
                  <strong>For and on behalf of</strong>
                  <br />
                  Modiste (BANGLADESH) Ltd.
                </p>
                <br />
                <p>{form.seller_signatory}</p>
              </div>
            </div>
          </div>
        </>
      )}
      {activeTab === "backToBack" && (
        <div className="mt-3">
          <strong>BACK TO BACK LC'S</strong>
          <hr />
          <table className="table table-striped">
            <thead>
              <tr>
                <th>LC</th>
                <th>SUPPLIER</th>
                <th>Commodity</th>
                <th>PI'S</th>

                <th>Created</th>
                <th>Expiry</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>LC001</td>
                <td>ABC Traders</td>
                <td>Fabric</td>
                <td>PI1001, PI2001</td>
                <td>2025-10-01</td>
                <td>2025-12-31</td>
                <td>$15,000</td>
              </tr>
              <tr>
                <td>LC002</td>
                <td>XYZ Imports</td>
                <td>Thread</td>
                <td>PI1002</td>

                <td>2025-09-15</td>
                <td>2025-11-30</td>
                <td>$20,500</td>
              </tr>
              <tr>
                <td>LC003</td>
                <td>Global Traders</td>
                <td>Button</td>
                <td>PI1003</td>

                <td>2025-10-10</td>
                <td>2026-01-15</td>
                <td>$12,750</td>
              </tr>
              <tr>
                <td className="text-center" colSpan={6}>
                  <strong>TOTAL</strong>
                </td>
                <td>
                  <strong>$4585.60</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {activeTab === "documents" && (
        <>
          <strong>DOCUMENTS</strong>
          <hr />
          <div>
            {[
              "INVOICE",
              "PACKING LIST",
              "CERTIFICATE OF ORIGIN",
              "SUPPLEMENTARY INVOICE",
              "BILL OF LADING",
              "MULTIPLE COUNTRY OF DECLARATION",
              "MANUFACTURER’S CERTIFICATE",
              "GCC & BENEFICIARY STATEMENT",
            ].map((title, index) => {
              const docData = {
                files:
                  index % 2 === 0
                    ? [
                        {
                          name: `${title}_file1.pdf`,
                          url: "#",
                          user: { full_name: "John Doe" },
                        },
                        {
                          name: `${title}_file2.pdf`,
                          url: "#",
                          user: { full_name: "Jane Smith" },
                        },
                      ]
                    : [],
              };

              return (
                <div
                  key={index}
                  style={{ border: "1px dashed gray" }}
                  className="list-group-item mb-3 rounded p-4"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => console.log(`Dropped on ${title}`)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{title}</strong>
                      <div className="small text-muted">
                        {docData.files.length > 0
                          ? `${docData.files.length} file(s)`
                          : "No files uploaded"}
                      </div>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                      <label className="btn btn-sm btn-outline-secondary mb-0">
                        Upload
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          multiple
                          hidden
                          onChange={(e) =>
                            console.log(`Upload for ${title}`, e.target.files)
                          }
                        />
                      </label>
                    </div>
                  </div>

                  {docData.files.length > 0 && (
                    <div className="mb-3">
                      {docData.files.map((f, i) => (
                        <div
                          key={i}
                          style={{
                            float: "left",
                            border: "1px solid grey",
                            marginRight: "10px",
                            padding: "5px",
                          }}
                          className="d-flex gap-2 mb-3 rounded bg-light"
                        >
                          <small
                            style={{ cursor: "pointer" }}
                            onClick={() => window.open(f.url, "_blank")}
                          >
                            {f.name} ({f.user?.full_name})
                          </small>
                          <div className="d-flex gap-2">
                            <i
                              style={{ cursor: "pointer" }}
                              onClick={() => window.open(f.url, "_blank")}
                              className="fa fa-eye text-success"
                            ></i>
                            <i
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                console.log(`Delete file ${i} from ${title}`)
                              }
                              className="fa fa-times text-danger"
                            ></i>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === "pos" && (
        <div className="mt-3">
          <strong>PO'S</strong>
          <hr />
          <table className="table table-striped">
            <thead>
              <tr>
                <th>PO</th>
                <th>STYLE</th>
                <th>ISSUE Date</th>
                <th>DELIVERY DATE</th>
                <th>QTY</th>
                <th>FOB</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>PO001</td>
                <td>Casual Shirt</td>
                <td>2025-10-01</td>
                <td>2025-12-01</td>
                <td>500</td>
                <td>$10</td>
                <td>$5,000</td>
              </tr>
              <tr>
                <td>PO002</td>
                <td>Formal Pants</td>
                <td>2025-09-15</td>
                <td>2025-11-15</td>
                <td>300</td>
                <td>$15</td>
                <td>$4,500</td>
              </tr>
              <tr>
                <td>PO003</td>
                <td>Denim Jacket</td>
                <td>2025-10-10</td>
                <td>2026-01-10</td>
                <td>200</td>
                <td>$20</td>
                <td>$4,000</td>
              </tr>
              <tr>
                <td className="text-center" colSpan={4}>
                  <strong>TOTAL</strong>
                </td>
                <td>
                  <strong>1000 PCS</strong>
                </td>
                <td></td>
                <td>
                  <strong>$13,500</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
