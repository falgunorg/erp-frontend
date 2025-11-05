import React, { useEffect, useRef, useState } from "react";
import Logo from "../../../assets/images/logos/logo-short.png";
import { useHistory, Link, useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import SummaryDashboard from "./parts/SummaryDashboard";
import api from "services/api";
import swal from "sweetalert";

export default function ContractDetails(props) {
  const history = useHistory();
  const params = useParams();
  const goBack = () => history.goBack();
  const [spinner, setSpinner] = useState(false);

  const [activeTab, setActiveTab] = useState("Summary");

  const printRef = useRef();

  const [form, setForm] = useState({});
  const [goods, setGoods] = useState([]);

  const summaryData = {
    export: {
      totalValue: 111078.92,
      rows: [
        {
          desc: "TOTAL EXPORT LC/CONTRACT VALUE",
          ccy: "USD",
          amount: 111078.92,
        },
        { desc: "TOTAL EXPORT BILL SUBMITTED", ccy: "USD", amount: 70219.52 },
        { desc: "TOTAL EXPORT BILL LIQUIDATED", ccy: "USD", amount: 70219.52 },
        { desc: "LIQUIDATED AMOUNT", ccy: "USD", amount: 70174.52 },
        { desc: "REMAINING EXPORT", ccy: "USD", amount: 40859.4 },
      ],
    },
    import: {
      totalImport: 77011.61,
      rows: [
        { desc: "TOTAL BBLC AMOUNT FOR IMPORT", ccy: "USD", amount: 77011.61 },
        { desc: "TOTAL ADVANCE PAYMENT FOR IMPORT", ccy: "USD", amount: 0.0 },
        { desc: "TOTAL BB BILL", ccy: "USD", amount: 77011.61 },
        { desc: "TOTAL BB BILL SETTLED", ccy: "USD", amount: 77011.61 },
        { desc: "BB BILL OUTSTANDING", ccy: "USD", amount: 0.0 },
        { desc: "% BB IMPORT", ccy: "%", amount: 69.33 },
        { desc: "TOTAL IMPORT", ccy: "USD", amount: 77011.61 },
      ],
    },
    packingCredit: {
      rows: [
        { desc: "PC DISBURSED", ccy: "BDT", amount: 0.0 },
        { desc: "PC OUTSTANDING (PR.+INT.+Cal.)", ccy: "BDT", amount: 0.0 },
      ],
    },
    edfLoan: {
      rows: [
        { desc: "EDF LOAN DISBURSED", ccy: "USD", amount: 0.0 },
        {
          desc: "EDF LOAN OUTSTANDING (PR.+INT.+Cal.)",
          ccy: "USD",
          amount: 0.0,
        },
      ],
    },
    forceLoan: {
      rows: [
        { desc: "FORCE LOAN DISBURSED", ccy: "BDT", amount: 217372.28 },
        {
          desc: "FORCE LOAN OUTSTANDING (PR.+INT.+Cal.)",
          ccy: "BDT",
          amount: 0.0,
        },
      ],
    },
    otherLoan: {
      rows: [
        { desc: "TOTAL OTHER LOAN DISBURSED", ccy: "BDT", amount: 0.0 },
        {
          desc: "TOTAL OTHER LOAN OUTSTANDING (PR.+INT.+Cal.)",
          ccy: "BDT",
          amount: 0.0,
        },
      ],
    },
    dfc: {
      rows: [
        { desc: "TOTAL CREDIT TO DFC", ccy: "USD", amount: 68112.93 },
        {
          desc: "TOTAL CREDIT FROM EXP. PROCEED",
          ccy: "USD",
          amount: 68112.93,
        },
        { desc: "TOTAL CREDIT FROM OTHERS", ccy: "USD", amount: 0.0 },
        { desc: "TOTAL DEBIT FROM DFC", ccy: "USD", amount: 78814.04 },
        { desc: "TOTAL BB PAYMENT", ccy: "USD", amount: 77011.61 },
        { desc: "OTHER DEBIT", ccy: "USD", amount: 1802.43 },
        { desc: "CURRENT DFC BALANCE", ccy: "USD", amount: -10701.11 },
      ],
    },
  };

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
            "Export Lc",
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
              to="#"
              className={`${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Link>
          ))}
        </div>
        <div>
          <Link to="#" onClick={goBack}>
            Back
          </Link>
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
            <SummaryDashboard data={summaryData} form={form} />
          </div>
        )}

        {activeTab === "Export Lc" && (
          <div className="summary_details_area contract-wrapper" ref={printRef}>
            <div className="row">
              <div className="col-lg-12">
                <div className="text-center">
                  <h5 className="summary-title text-uppercase">
                    Export LC/Contract
                  </h5>
                  <div className="summary-info">
                    <strong>Contract :</strong> {form.title}
                    <br />
                  </div>
                  <br />
                </div>
                {/* Export Section */}
                <div className="section">
                  <table className="table table-bordered align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>LC/Contract Ref. No.</th>
                        <th>Export LC/ Contract No</th>
                        <th>Issue Date</th>
                        <th>Currency</th>
                        <th>Contract Amt.</th>
                        <th>Tole. (%)</th>
                        <th>Transferred Amt</th>
                        <th>
                          Available Amount <br /> (with Tolerance )
                        </th>
                        <th>Closed Amount</th>
                        <th>Ship Date</th>
                        <th>Expire Date</th>
                        <th>Export Executed</th>
                        <th>Buyer</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>016FCBC241890501</td>
                        <td>BASSPRO-MCL-SP25</td>
                        <td>6/1/2024</td>
                        <td>USD</td>
                        <td>2,294,575.86</td>
                        <td>0%</td>
                        <td>2,294,575.86</td>
                        <td>2,294,575.86</td>
                        <td>2,294,575.86</td>
                        <td>3/15/2025</td>
                        <td>3/25/2025</td>
                        <td>2,294,575.86</td>
                        <td>Next</td>
                      </tr>
                      <tr>
                        <td>016FCBC241890501</td>
                        <td>BASSPRO-MCL-SP25</td>
                        <td>6/1/2024</td>
                        <td>USD</td>
                        <td>2,294,575.86</td>
                        <td>0%</td>
                        <td>2,294,575.86</td>
                        <td>2,294,575.86</td>
                        <td>2,294,575.86</td>
                        <td>3/15/2025</td>
                        <td>3/25/2025</td>
                        <td>2,294,575.86</td>
                        <td>Next</td>
                      </tr>

                      <tr>
                        <td className="text-end" colSpan={4}>
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
                          <strong>283206.66</strong>
                        </td>
                        <td></td>
                        <td></td>
                        <td>
                          <strong>283206.66</strong>
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Export Bill" && (
          <div className="summary_details_area contract-wrapper" ref={printRef}>
            <div className="row">
              <div className="col-lg-12">
                <div className="text-center">
                  <h5 className="summary-title text-uppercase">Export Bill</h5>
                  <div className="summary-info">
                    <strong>Contract :</strong> {form.title}
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
            <div className="text-center">
              <h5 className="summary-title text-uppercase">BBLC</h5>
              <div className="summary-info">
                <strong>Contract :</strong> {form.title}
                <br />
              </div>
              <br />
            </div>

            <div className="section  table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Prod.</th>
                    <th>LC Number</th>
                    <th>Issue Date</th>
                    <th>Currency</th>
                    <th>Contract Amt.</th>
                    <th>Tole.(%)</th>
                    <th>Ship Date</th>
                    <th>Expire Date</th>
                    <th>Closed Amt.</th>
                    <th>Current Availabily</th>
                    <th>Commidity</th>
                    <th>Exporter Seller</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>LC24</td>
                    <td>140424250034</td>
                    <td>2/6/2025</td>
                    <td>USD</td>
                    <td>132741.61</td>
                    <td>0.00</td>
                    <td>3/8/2025</td>
                    <td>3/23/2025</td>
                    <td>99.33</td>
                    <td>0.00</td>
                    <td>FABRIC</td>
                    <td>Z&Z</td>
                  </tr>
                  <tr>
                    <td>LC25</td>
                    <td>140424250034</td>
                    <td>2/6/2025</td>
                    <td>USD</td>
                    <td>132741.61</td>
                    <td>0.00</td>
                    <td>3/8/2025</td>
                    <td>3/23/2025</td>
                    <td>99.33</td>
                    <td>0.00</td>
                    <td>BUTTON</td>
                    <td>JINDAL POLY BUTTONS PVT. LTD.</td>
                  </tr>
                  <tr>
                    <td>LC26</td>
                    <td>140424250034</td>
                    <td>2/6/2025</td>
                    <td>USD</td>
                    <td>132741.61</td>
                    <td>0.00</td>
                    <td>3/8/2025</td>
                    <td>3/23/2025</td>
                    <td>99.33</td>
                    <td>0.00</td>
                    <td>THREAD</td>
                    <td>A&E</td>
                  </tr>

                  <tr>
                    <td className="text-end" colSpan={4}>
                      <strong>TOTAL</strong>
                    </td>
                    <td>
                      <strong>398,224.83</strong>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <strong>283206.66</strong>
                    </td>
                    <td>
                      <strong>0.00</strong>
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <br />
            <br />
            <div className="row">
              <div className="col-lg-5">
                <table className="table table-bordered align-middle">
                  <tbody>
                    <tr>
                      <td>Total Closed Amount ( in Equivelent USD )</td>
                      <td>2637.6</td>
                    </tr>
                    <tr>
                      <td>Total EDF LC Amount ( in Equivelent USD )</td>
                      <td>0.00</td>
                    </tr>

                    <tr>
                      <td>Total Perchantage Used From Contract</td>
                      <td>75%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <br />
            <br />
            <div className="row">
              <div className="col-lg-4">
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>COMMODITY CATEGORY</th>
                      <th>Amount</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>ACCESSORI & OTHERS</td>
                      <td>265,483.22</td>
                      <td>66.33</td>
                    </tr>
                    <tr>
                      <td>FABRIC</td>
                      <td>132,741.61 </td>
                      <td>33.33</td>
                    </tr>

                    <tr>
                      <td>
                        <strong>TOTAL</strong>
                      </td>
                      <td>
                        <strong>398,224.83</strong>
                      </td>
                      <td>
                        <strong>100.00</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "BB Bill" && (
          <div className="summary_details_area contract-wrapper" ref={printRef}>
            <div className="text-center">
              <h5 className="summary-title text-uppercase">BB Bill</h5>
              <div className="summary-info">
                <strong>Contract :</strong> {form.title}
                <br />
              </div>
              <br />
            </div>

            <div className="section  table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>LC No.</th>
                    <th>BC Contract No.</th>
                    <th>User Ref. No</th>
                    <th>Currency</th>
                    <th>Issue Date</th>
                    <th>Contract Amt.</th>
                    <th>Bill Amt. LIQD.</th>
                    <th>Intt./Charge Amt.</th>
                    <th>Maturity Date</th>
                    <th>Paid Date</th>
                    <th>Source of Fund</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>140424250025</td>
                    <td>016BC25242120501</td>
                    <td>140424250025B01</td>
                    <td>USD</td>
                    <td>7/30/2024</td>
                    <td>13572</td>
                    <td>13572</td>
                    <td></td>
                    <td>9/12/2024</td>
                    <td>9/12/2024</td>
                    <td>DFC</td>
                  </tr>
                  <tr>
                    <td>140424250025</td>
                    <td>016BC25242120501</td>
                    <td>140424250025B01</td>
                    <td>USD</td>
                    <td>7/30/2024</td>
                    <td>13572</td>
                    <td>13572</td>
                    <td></td>
                    <td>9/12/2024</td>
                    <td>9/12/2024</td>
                    <td>DFC</td>
                  </tr>
                  <tr>
                    <td>140424250025</td>
                    <td>016BC25242120501</td>
                    <td>140424250025B01</td>
                    <td>USD</td>
                    <td>7/30/2024</td>
                    <td>13572</td>
                    <td>13572</td>
                    <td></td>
                    <td>9/12/2024</td>
                    <td>9/12/2024</td>
                    <td>DFC</td>
                  </tr>
                  <tr>
                    <td>140424250025</td>
                    <td>016BC25242120501</td>
                    <td>140424250025B01</td>
                    <td>USD</td>
                    <td>7/30/2024</td>
                    <td>13572</td>
                    <td>13572</td>
                    <td></td>
                    <td>9/12/2024</td>
                    <td>9/12/2024</td>
                    <td>DFC</td>
                  </tr>
                  <tr>
                    <td>140424250025</td>
                    <td>016BC25242120501</td>
                    <td>140424250025B01</td>
                    <td>USD</td>
                    <td>7/30/2024</td>
                    <td>13572</td>
                    <td>13572</td>
                    <td></td>
                    <td>9/12/2024</td>
                    <td>9/12/2024</td>
                    <td>DFC</td>
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

            <br />
            <br />
            <div className="row">
              <div className="col-lg-4">
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Particulars</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Total Bill Amount ( in Equivelent USD )</td>
                      <td>1437189.22</td>
                    </tr>
                    <tr>
                      <td>Total Bill liquidated ( in Equivelent USD )</td>
                      <td>1399167.51</td>
                    </tr>
                    <tr>
                      <td>Outstanding Accepted Bill ( in Equivelent USD )</td>
                      <td>38021.71</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <br />
            <br />
            <div className="row">
              <div className="col-lg-4">
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Payment Details ( Liquidation Amount )</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Out of DFC</td>
                      <td>419943.17</td>
                    </tr>
                    <tr>
                      <td>Out of ERQ</td>
                      <td>1140574.21</td>
                    </tr>
                    <tr>
                      <td>EDF Loan</td>
                      <td>1140574.21</td>
                    </tr>
                    <tr>
                      <td>Other( Force Loan )</td>
                      <td>1140574.21</td>
                    </tr>
                    <tr>
                      <td>Multiple</td>
                      <td>0.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Loan" && (
          <div className="summary_details_area contract-wrapper" ref={printRef}>
            <div className="text-center">
              <h5 className="summary-title text-uppercase">Loan</h5>
              <div className="summary-info">
                <strong>Contract :</strong> {form.title}
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
                <strong>Contract :</strong> {form.title}
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
                  <div className="col-4">
                    <strong>1. Purchase Contract No:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.title}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4">
                    <strong>2. Date:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.contract_date}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4">
                    <strong>3. Buyer:</strong>
                  </div>
                  <div className="col-8">
                    <p>
                      {form.buyer_name}
                      <br />
                      {form.buyer_address}
                    </p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4">
                    <strong>4. Notify Party:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.notify_party}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4">
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
                  <div className="col-4">
                    <strong>6. Agent Name:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.agent_name}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4">
                    <strong>7. Agent’s Bank:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.agent_bank}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4">
                    <strong>8. Beneficiary:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.beneficiary_name}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4">
                    <strong>9. Beneficiary’s Bank:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.beneficiary_bank}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4">
                    <strong>10. Payment Terms:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.payment_terms}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4">
                    <strong>11. Port of Discharge:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.port_of_discharge}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4">
                    <strong>12. Port of Loading:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.port_of_loading}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4">
                    <strong>13. Mode of Shipment:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.mode_of_shipment}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4">
                    <strong>14. Documents Required:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.documents_required}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4">
                    <strong>15. Trans-shipment/Part Shipment:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.transshipment}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4">
                    <strong>16. Tolerance:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.tolerance}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4">
                    <strong>17. Defective Allowance:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.defective_allowance}</p>
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-4">
                    <strong>18. Expiry Date:</strong>
                  </div>
                  <div className="col-8">
                    <p>{form.expiry_date}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <strong>19. Particulars of Goods / Services:</strong>
                  <table className="contract-table">
                    <thead className="table-light">
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
          </div>
        )}

        {activeTab === "PO'S" && (
          <div className="summary_details_area contract-wrapper" ref={printRef}>
            <div className="text-center">
              <h5 className="summary-title text-uppercase">PO'S</h5>
              <div className="summary-info">
                <strong>Contract :</strong> {form.title}
                <br />
              </div>
              <br />
            </div>
            <div className="section  table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
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
          </div>
        )}

        {activeTab === "Import Documents" && (
          <div className="summary_details_area contract-wrapper" ref={printRef}>
            <div className="text-center">
              <h5 className="summary-title text-uppercase">Import Documents</h5>
              <div className="summary-info">
                <strong>Contract :</strong> {form.title}
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
                <strong>Contract :</strong> {form.title}
                <br />
              </div>
              <br />
            </div>
            <div className="section  table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>INVOICE NO.</th>
                    <th>INVOICE VAL.</th>
                    <th>SHIPMENT DATE</th>
                    <th>G.QTY</th>
                    <th>FILES</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Link to="#">INV-001</Link>
                    </td>
                    <td>$56000</td>
                    <td>25-10-2025</td>
                    <td>800 PCS</td>
                    <td>inv-1.pdf, inv-2.pdf</td>
                  </tr>
                  <tr>
                    <td>
                      <Link to="#">INV-002</Link>
                    </td>
                    <td>$56000</td>
                    <td>25-10-2025</td>
                    <td>800 PCS</td>
                    <td>inv-1.pdf, inv-2.pdf</td>
                  </tr>
                  <tr>
                    <td>
                      <Link to="#">INV-003</Link>
                    </td>
                    <td>$56000</td>
                    <td>25-10-2025</td>
                    <td>800 PCS</td>
                    <td>inv-1.pdf, inv-2.pdf</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
