import React, { useEffect, useRef, useState } from "react";
import Logo from "../../../assets/images/logos/logo-short.png";
import { useHistory, Link, useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
// import components
import SummaryDashboard from "./parts/SummaryDashboard";
import BackToBack from "./parts/BackToBack";
import PurchaseOrders from "./parts/PurchaseOrders";
import BackToBackBills from "./parts/BackToBackBills";
import ExportDocuments from "./parts/ExportDocuments";
import api from "services/api";
import swal from "sweetalert";

export default function ContractDetails(props) {
  const history = useHistory();
  const params = useParams();
  const goBack = () => history.goBack();
  const [spinner, setSpinner] = useState(false);

  const [activeTab, setActiveTab] = useState(
    sessionStorage.getItem("activeTab") || "Summary"
  );

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    sessionStorage.setItem("activeTab", tab);
  };

  const printRef = useRef();
  const [form, setForm] = useState({});

  const handlePrint = () => window.print();

  // ✅ Download Excel
  const handleDownloadExcel = () => {
    // Find the first table inside the printRef
    const table = printRef.current.querySelector("table");
    if (!table) {
      alert("No table found to export.");
      return;
    }

    // Convert table to worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.table_to_sheet(table);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Save as Excel file
    XLSX.writeFile(workbook, `${form.title}.xlsx`);
  };

  const handleDownloadPDF = () => {
    const element = printRef.current;
    html2pdf()
      .from(element)
      .set({
        margin: 0.3,
        filename: `${form.title}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .save();
  };

  const importDocs = [
    {
      lc: "LC24",
      documents: [
        {
          docNo: "505",
          value: 600,
          issueDate: "20-10-2025",
          expiryDate: "20-10-2025",
          files: ["1.pdf", "4.pdf"],
        },
        {
          docNo: "506",
          value: 900,
          issueDate: "20-10-2025",
          expiryDate: "20-10-2025",
          files: ["1.pdf", "4.pdf"],
        },
        {
          docNo: "507",
          value: 500,
          issueDate: "20-10-2025",
          expiryDate: "20-10-2025",
          files: ["1.pdf", "4.pdf"],
        },
      ],
    },
    {
      lc: "LC25",
      documents: [
        {
          docNo: "509",
          value: 200,
          issueDate: "20-10-2025",
          expiryDate: "20-10-2025",
          files: ["1.pdf", "4.pdf"],
        },
        {
          docNo: "510",
          value: 200,
          issueDate: "20-10-2025",
          expiryDate: "20-10-2025",
          files: ["1.pdf", "4.pdf"],
        },
        {
          docNo: "511",
          value: 1000,
          issueDate: "20-10-2025",
          expiryDate: "20-10-2025",
          files: ["1.pdf", "4.pdf"],
        },
      ],
    },
  ];

  useEffect(async () => {
    props.setHeaderData({
      pageName: "PC DETAILS",
      isNewButton: true,
      newButtonLink: "",
      newButtonText: "New PC",
      isInnerSearch: true,
      innerSearchValue: "",
    });
  }, []);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        setSpinner(true);
        const res = await api.post("/commercial/contracts/show", {
          id: params.id,
        });
        if (res.status === 200 && res.data?.data) {
          setForm((prev) => ({
            ...prev,
            ...res.data.data,
          }));
        } else {
          swal("Error", "Failed to load contract details.", "error");
        }
      } catch (err) {
        console.error("Error loading contract:", err);
        swal("Error", "Something went wrong while fetching contract.", "error");
      } finally {
        setSpinner(false);
      }
    };
    if (params.id) fetchContract();
  }, [params.id]);

  return (
    <div className="contract-page tna_page">
      <div className="no-print tna_page_topbar justify-content-between">
        <div>
          {[
            "Summary",
            "Export Bill",
            "BBLC",
            "BB Bill",
            "Loan",
            "DFC Transaction",
            "Contract Overview",
            "PO'S",
            "Import Documents",
            "Export Documents",
          ].map((tab) => (
            <Link
              key={tab}
              to="#"
              className={activeTab === tab ? "active" : ""}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </Link>
          ))}
        </div>
        <div>
          <Link to="#" onClick={handlePrint}>
            Print
          </Link>
          <Link to="#" onClick={handleDownloadPDF}>
            Download PDF
          </Link>
          <Link to="#" onClick={handleDownloadExcel}>
            Download Excel
          </Link>
        </div>
      </div>

      <div className="p-3 bg-white">
        {activeTab === "Summary" && (
          <div className="summary_details_area contract-wrapper" ref={printRef}>
            <SummaryDashboard form={form} />
          </div>
        )}

        {activeTab === "Export Bill" && (
          <div className="summary_details_area contract-wrapper" ref={printRef}>
            <div className="row">
              <div className="col-lg-12">
                <div className="text-center">
                  <h5 className="summary-title text-uppercase">Export Bill</h5>
                  <div className="summary-info">
                    <strong>Contract/Export LC :</strong> {form.title}
                    <br />
                  </div>
                  <br />
                </div>
                {/* Export Section */}
                <div className="section">
                  <table className="table table-bordered align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Export Bill Contract</th>
                        <th>User Ref. No.</th>
                        <th>Export LC/Contract No.</th>
                        <th>Issue Date</th>
                        <th>Currency</th>
                        <th>Bill Amount</th>
                        <th>Purchase Amt.</th>
                        <th>Bill Amt Liqd.</th>
                        <th>DFC</th>
                        <th>ERQ</th>
                        <th>Expire Date</th>
                        <th>Liqd Date</th>
                        <th>%DFC</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>016FCBC241890501</td>
                        <td>01620240265</td>
                        <td>BASSPRO-MCL-SP25</td>
                        <td>11/21/2024</td>
                        <td>USD</td>
                        <td>55163.22</td>
                        <td></td>
                        <td>54553.54</td>
                        <td>51825.86</td>
                        <td>0.00</td>
                        <td>12/12/2024</td>
                        <td>12/22/2024</td>
                        <td>93.95</td>
                      </tr>
                      <tr>
                        <td>016FCBC241890501</td>
                        <td>01620240265</td>
                        <td>BASSPRO-MCL-SP25</td>
                        <td>11/21/2024</td>
                        <td>USD</td>
                        <td>55163.22</td>
                        <td></td>
                        <td>54553.54</td>
                        <td>51825.86</td>
                        <td>0.00</td>
                        <td>12/12/2024</td>
                        <td>12/22/2024</td>
                        <td>93.95</td>
                      </tr>
                      <tr>
                        <td>016FCBC241890501</td>
                        <td>01620240265</td>
                        <td>BASSPRO-MCL-SP25</td>
                        <td>11/21/2024</td>
                        <td>USD</td>
                        <td>55163.22</td>
                        <td></td>
                        <td>54553.54</td>
                        <td>51825.86</td>
                        <td>0.00</td>
                        <td>12/12/2024</td>
                        <td>12/22/2024</td>
                        <td>93.95</td>
                      </tr>

                      <tr>
                        <td className="text-end" colSpan={5}>
                          <strong>TOTAL</strong>
                        </td>
                        <td>
                          <strong>2284572.54</strong>
                        </td>
                        <td></td>
                        <td>
                          <strong>283206.66</strong>
                        </td>
                        <td>
                          <strong>283206.66</strong>
                        </td>
                        <td>
                          <strong>0.00</strong>
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "BBLC" && (
          <div className="summary_details_area contract-wrapper" ref={printRef}>
            <BackToBack form={form} />
          </div>
        )}

        {activeTab === "BB Bill" && (
          <div className="summary_details_area contract-wrapper" ref={printRef}>
            <BackToBackBills form={form} />
          </div>
        )}

        {activeTab === "Loan" && (
          <div className="summary_details_area contract-wrapper" ref={printRef}>
            <div className="text-center">
              <h5 className="summary-title text-uppercase">Loan</h5>
              <div className="summary-info">
                <strong>Contract/Export LC :</strong> {form.title}
                <br />
              </div>
              <br />
            </div>

            <div className="section  table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Contract Ref. No.</th>
                    <th>User Ref. No</th>
                    <th>Disburs. Date</th>
                    <th>Currency</th>
                    <th>Contract Amt.</th>
                    <th>Prin OS</th>
                    <th>Accr Intt</th>
                    <th>Calculated Amt</th>
                    <th>Maturity Date</th>
                    <th>Prin Adj.</th>
                    <th>Intt. Adj.</th>
                    <th>Total Due </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>016FLAB251530004</td>
                    <td>140425270003</td>
                    <td>6/2/2025</td>
                    <td>BDT</td>
                    <td>13561024.14</td>
                    <td>13561024.14</td>
                    <td>13561024.14</td>
                    <td>13561024.14</td>
                    <td>9/12/2024</td>
                    <td>0.00</td>
                    <td>0.00</td>
                    <td>13870032.20161</td>
                  </tr>
                  <tr>
                    <td>016FLAB251530004</td>
                    <td>140425270003</td>
                    <td>6/2/2025</td>
                    <td>BDT</td>
                    <td>13561024.14</td>
                    <td>13561024.14</td>
                    <td>13561024.14</td>
                    <td>13561024.14</td>
                    <td>9/12/2024</td>
                    <td>0.00</td>
                    <td>0.00</td>
                    <td>13870032.20161</td>
                  </tr>
                  <tr>
                    <td>016FLAB251530004</td>
                    <td>140425270003</td>
                    <td>6/2/2025</td>
                    <td>BDT</td>
                    <td>13561024.14</td>
                    <td>13561024.14</td>
                    <td>13561024.14</td>
                    <td>13561024.14</td>
                    <td>9/12/2024</td>
                    <td>0.00</td>
                    <td>0.00</td>
                    <td>13870032.20161</td>
                  </tr>
                  <tr>
                    <td>016FLAB251530004</td>
                    <td>140425270003</td>
                    <td>6/2/2025</td>
                    <td>BDT</td>
                    <td>13561024.14</td>
                    <td>13561024.14</td>
                    <td>13561024.14</td>
                    <td>13561024.14</td>
                    <td>9/12/2024</td>
                    <td>0.00</td>
                    <td>0.00</td>
                    <td>13870032.20161</td>
                  </tr>

                  <tr>
                    <td className="text-end" colSpan={4}>
                      <strong>TOTAL</strong>
                    </td>
                    <td>
                      <strong>2284572.54</strong>
                    </td>
                    <td>
                      <strong>2284572.54</strong>
                    </td>
                    <td>
                      <strong>2284572.54</strong>
                    </td>
                    <td>
                      <strong>2284572.54</strong>
                    </td>
                    <td></td>
                    <td>
                      <strong>0.00</strong>
                    </td>
                    <td>
                      <strong>0.00</strong>
                    </td>
                    <td>
                      <strong>2284572.54</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "DFC Transaction" && (
          <div className="summary_details_area contract-wrapper" ref={printRef}>
            <div className="text-center">
              <h5 className="summary-title text-uppercase">
                {" "}
                DFC A/C No: 0161300000107
              </h5>
              <div className="summary-info">
                <strong>Contract/Export LC :</strong> {form.title}
                <br />
              </div>
              <br />
            </div>

            <div className="section  table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Txn Date</th>
                    <th>Value Date</th>
                    <th>Txn Ref No.</th>
                    <th>Txn Desc</th>
                    <th>Currency</th>
                    <th>Dr</th>
                    <th>Cr</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>9/12/2024</td>
                    <td>9/12/2024</td>
                    <td>016BC25242120501</td>
                    <td>IMPORT BILL LIQUIDATION</td>
                    <td>USD</td>
                    <td>13572</td>
                    <td>13572</td>
                  </tr>
                  <tr>
                    <td>9/12/2024</td>
                    <td>9/12/2024</td>
                    <td>016BC25242120501</td>
                    <td>IMPORT BILL LIQUIDATION</td>
                    <td>USD</td>
                    <td>13572</td>
                    <td>13572</td>
                  </tr>
                  <tr>
                    <td>9/12/2024</td>
                    <td>9/12/2024</td>
                    <td>016BC25242120501</td>
                    <td>IMPORT BILL LIQUIDATION</td>
                    <td>USD</td>
                    <td>13572</td>
                    <td>13572</td>
                  </tr>
                  <tr>
                    <td>9/12/2024</td>
                    <td>9/12/2024</td>
                    <td>016BC25242120501</td>
                    <td>IMPORT BILL LIQUIDATION</td>
                    <td>USD</td>
                    <td>13572</td>
                    <td>13572</td>
                  </tr>

                  <tr>
                    <td className="text-end" colSpan={5}>
                      <strong>TOTAL</strong>
                    </td>
                    <td>
                      <strong>2284572.54</strong>
                    </td>
                    <td>
                      <strong>2284572.54</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <br />
            <br />
            <div className="row">
              <div className="col-lg-4">
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Particulars</th>
                      <th>Currency</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Total Dr</td>
                      <td>USD</td>
                      <td>1297411.44</td>
                    </tr>
                    <tr>
                      <td>Total Cr</td>
                      <td>USD</td>
                      <td>1290707.27</td>
                    </tr>
                    <tr>
                      <td>Net Balance</td>
                      <td>USD</td>
                      <td>6704.17</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Contract Overview" && (
          <div className="summary_details_area contract-wrapper">
            <div className="">
              <p className="buyer-header">
                {form.buyer?.name}
                <br />
                {form.buyer?.address}
                <br />
                Ph: {form.buyer_phone}, Email: {form.buyer_email}
              </p>
              <h5 className="sub-title">PURCHASE CONTRACT</h5>

              <div className="contract-body">
                <div className="row mb-1">
                  <div className="col-4 text-uppercase">
                    <strong>1. Purchase Contract No:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.title}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4 text-uppercase">
                    <strong>2. Date:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.contract_date}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4 text-uppercase">
                    <strong>3. Buyer:</strong>
                  </div>
                  <div className="col-8">
                    <p>
                      {form.buyer?.name}
                      <br />
                      {form.buyer?.address}
                    </p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4 text-uppercase">
                    <strong>4. Notify Party:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.notify_party}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4 text-uppercase">
                    <strong>5. Buyer’s Bank:</strong>
                  </div>
                  <div className="col-8">
                    <p>
                      {form.buyer_bank_name}
                      <br />
                      {form.buyer_bank_address} <br />
                      {form.buyer_bank_phone}, SWIFT: {form.buyer_bank_swift}
                    </p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4 text-uppercase">
                    <strong>6. Agent Name:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.agent_name}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4 text-uppercase">
                    <strong>7. Agent’s Bank:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.agent_bank}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4 text-uppercase">
                    <strong>8. Beneficiary:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.beneficiary_name}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4 text-uppercase">
                    <strong>9. Beneficiary’s Bank:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.beneficiary_bank}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4 text-uppercase">
                    <strong>10. Payment Terms:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.payment_terms}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4 text-uppercase">
                    <strong>11. Port of Discharge:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.port_of_discharge}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4 text-uppercase">
                    <strong>12. Port of Loading:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.port_of_loading}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4 text-uppercase">
                    <strong>13. Mode of Shipment:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.mode_of_shipment}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4 text-uppercase">
                    <strong>14. Documents Required:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.documents_required}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4 text-uppercase">
                    <strong>15. Trans-shipment/Part Shipment:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.transshipment}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4 text-uppercase">
                    <strong>16. Tolerance:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.tolerance}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4 text-uppercase">
                    <strong>17. Defective Allowance:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.defective_allowance}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4 text-uppercase">
                    <strong>18. Expiry Date:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.expiry_date}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4 text-uppercase">
                    <strong>19. REIMBURSEMENT INSTRUCTIONS:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.reimbursement_instructions}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4 text-uppercase">
                    <strong>20. Amendment Clause:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.amendment_clause}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4 text-uppercase">
                    <strong>20. Agent Commission Clause:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.agent_commission_clause}</p>
                  </div>
                </div>
              </div>

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
          </div>
        )}

        {activeTab === "PO'S" && (
          <div className="summary_details_area contract-wrapper" ref={printRef}>
            <PurchaseOrders form={form} />
          </div>
        )}

        {activeTab === "Import Documents" && (
          <div className="summary_details_area contract-wrapper" ref={printRef}>
            <div className="text-center">
              <h5 className="summary-title text-uppercase">Import Documents</h5>
              <div className="summary-info">
                <strong>Contract/Export LC :</strong> {form.title}
                <br />
              </div>
              <br />
            </div>
            <div className="section  table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>LC</th>
                    <th>Document No.</th>
                    <th>Document Value</th>
                    <th>Issue Date</th>
                    <th>Expiry Date</th>
                    <th>Files</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {importDocs.map((group, groupIndex) => {
                    const total = group.documents.reduce(
                      (sum, doc) => sum + doc.value,
                      0
                    );
                    return group.documents.map((doc, docIndex) => (
                      <tr key={`${group.lc}-${doc.docNo}`}>
                        {/* LC cell only shown on first document of the group */}
                        {docIndex === 0 ? (
                          <td rowSpan={group.documents.length}>
                            <Link to="#">{group.lc}</Link>
                          </td>
                        ) : null}

                        <td>{doc.docNo}</td>
                        <td>{doc.value}</td>
                        <td>{doc.issueDate}</td>
                        <td>{doc.expiryDate}</td>
                        <td>{doc.files.join(", ")}</td>

                        {/* Total only shown on last document of the group */}
                        {docIndex === group.documents.length - 1 ? (
                          <td rowSpan={1}>{total}</td>
                        ) : (
                          <td></td>
                        )}
                      </tr>
                    ));
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "Export Documents" && (
          <div className="summary_details_area contract-wrapper" ref={printRef}>
            <div className="text-center">
              <h5 className="summary-title text-uppercase">Export Documents</h5>
              <div className="summary-info">
                <strong>Contract/Export LC :</strong> {form.title}
                <br />
              </div>
              <br />
            </div>
            <ExportDocuments form={form} />
          </div>
        )}
      </div>
    </div>
  );
}
