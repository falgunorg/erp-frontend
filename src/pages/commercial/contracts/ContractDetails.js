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

      <ul className="nav nav-tabs">
        {[
          "Summary",
          "Export Lc",
          "Export Bill",
          "BBLC",
          "Advanced Payment",
          "BB Bill",
          "Loan",
          "DFC Transaction",
          "Overview",
          "PO'S",
          "Documents",
        ].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      <div className="p-3 border border-top-0 rounded-bottom bg-white">
        {activeTab === "Summary" && (
          <div className="summary_details_area">
            <div className="row">
              <div className="col-lg-6">
                <div className="text-center">
                  <h3 className="summary-title">Summary Position</h3>
                  <div className="summary-info">
                    <strong>Tag Number :</strong> MOD24008
                    <br />
                    <strong>Customer ID :</strong> 385493
                    <br />
                    <strong>Customer Name :</strong> MODISTE ( CEPZ ) LTD
                  </div>
                  <br />
                </div>
                {/* Export Section */}
                <div className="section">
                  <table className="summary-table table table-bordered">
                    <thead>
                      <tr>
                        <th>Export</th>
                        <th>Currency</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Total Export L/C/Contract Value</td>
                        <td>USD</td>
                        <td>2,294,575.86</td>
                      </tr>
                      <tr>
                        <td>Total Export Bill Submitted</td>
                        <td>USD</td>
                        <td>2,115,594.54</td>
                      </tr>
                      <tr>
                        <td>Total Export Bill Liquidated</td>
                        <td>USD</td>
                        <td>2,110,583.52</td>
                      </tr>
                      <tr>
                        <td>Liquidated Amount</td>
                        <td>USD</td>
                        <td>2,110,583.52</td>
                      </tr>
                      <tr>
                        <td>Total Advance Payment Rec.</td>
                        <td>USD</td>
                        <td>0.00</td>
                      </tr>
                      <tr>
                        <td>Remaining Export</td>
                        <td>USD</td>
                        <td>165,575.03</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* BB Import Section */}
                <div className="section">
                  <table className="summary-table table table-bordered">
                    <thead>
                      <tr>
                        <th>BB Import</th>
                        <th>Currency</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Total Bill Amount for Import</td>
                        <td>USD</td>
                        <td>1,550,571.35</td>
                      </tr>
                      <tr>
                        <td>Total Advance Payment for Import</td>
                        <td>USD</td>
                        <td>0.00</td>
                      </tr>
                      <tr>
                        <td>Total Bill</td>
                        <td>USD</td>
                        <td>1,552,681.15</td>
                      </tr>
                      <tr>
                        <td>Total Bill Settled</td>
                        <td>USD</td>
                        <td>1,544,535.05</td>
                      </tr>
                      <tr>
                        <td>BB Bill Outstanding</td>
                        <td>USD</td>
                        <td>7,216.10</td>
                      </tr>
                      <tr>
                        <td>2% Import</td>
                        <td>USD</td>
                        <td>8,145.00</td>
                      </tr>
                      <tr>
                        <td>Total Import</td>
                        <td>USD</td>
                        <td>1,550,571.35</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Packing Credit Section */}
                <div className="section">
                  <table className="summary-table table table-bordered">
                    <thead>
                      <tr>
                        <th>Packing Credit ( PC )</th>
                        <th>Currency</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>PC Disbursed</td>
                        <td>BDT</td>
                        <td>0.00</td>
                      </tr>
                      <tr>
                        <td>PC Outstanding (F.R.-INT+CoA.)</td>
                        <td>BDT</td>
                        <td>0.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* EDF Loan Section */}
                <div className="section">
                  <table className="summary-table table table-bordered">
                    <thead>
                      <tr>
                        <th>EDF Loan</th>
                        <th>Currency</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>EDF Loan Disbursed</td>
                        <td>USD</td>
                        <td>0.00</td>
                      </tr>
                      <tr>
                        <td>EDF Loan Outstanding (F.R.-INT+CoA.)</td>
                        <td>USD</td>
                        <td>0.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* FDBP / FORCE Loan Section */}
                <div className="section">
                  <table className="summary-table table table-bordered">
                    <thead>
                      <tr>
                        <th>Force Loan</th>
                        <th>Currency</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Force Loan Disbursed</td>
                        <td>BDT</td>
                        <td>0.00</td>
                      </tr>
                      <tr>
                        <td>Force Loan Outstanding (F.R.-INT+CoA.)</td>
                        <td>BDT</td>
                        <td>0.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Other Demand Loan Section */}
                <div className="section">
                  <table className="summary-table table table-bordered">
                    <thead>
                      <tr>
                        <th>OTHERS DEMAND LOAN</th>
                        <th>Currency</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Total Other Loan Disbursed</td>
                        <td>BDT</td>
                        <td>0.00</td>
                      </tr>
                      <tr>
                        <td>Total Other Loan Outstanding (F.R.-INT+CoA.)</td>
                        <td>BDT</td>
                        <td>0.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* DFC Section */}
                <div className="section">
                  <table className="summary-table table table-bordered">
                    <thead>
                      <tr>
                        <th>DFC</th>
                        <th>Currency</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Total Credit from DFC</td>
                        <td>USD</td>
                        <td>1,677,855.56</td>
                      </tr>
                      <tr>
                        <td>Total Credit from EXP Proceed</td>
                        <td>USD</td>
                        <td>1,677,855.56</td>
                      </tr>
                      <tr>
                        <td>Total Credit from Others</td>
                        <td>USD</td>
                        <td>0.00</td>
                      </tr>
                      <tr>
                        <td>Total Debit from DFC</td>
                        <td>USD</td>
                        <td>1,544,535.05</td>
                      </tr>
                      <tr>
                        <td>Total Bill Payment</td>
                        <td>USD</td>
                        <td>1,544,535.05</td>
                      </tr>
                      <tr>
                        <td>Other Debit</td>
                        <td>USD</td>
                        <td>10.45</td>
                      </tr>
                      <tr>
                        <td>Current DFC Balance</td>
                        <td>USD</td>
                        <td>133,070.11</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Export Lc" && (
          <div className="summary_details_area">
            <div className="row">
              <div className="col-lg-12">
                <div className="text-center">
                  <h3 className="summary-title">Export LC/Contract</h3>
                  <div className="summary-info">
                    <strong>Tag Number :</strong> MOD24008
                    <br />
                  </div>
                  <br />
                </div>
                {/* Export Section */}
                <div className="section">
                  <table className="summary-table table table-bordered">
                    <thead>
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
                        <td className="text-end" colSpan={4}>
                          <strong>TOTAL</strong>
                        </td>
                        <td>2284572.54</td>
                        <td></td>
                        <td>283206.66</td>
                        <td>283206.66</td>
                        <td>283206.66</td>
                        <td></td>
                        <td></td>
                        <td>283206.66</td>
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
          <div className="summary_details_area">
            <div className="row">
              <div className="col-lg-12">
                <div className="text-center">
                  <h3 className="summary-title">Export Bill</h3>
                  <div className="summary-info">
                    <strong>Tag Number :</strong> MOD24008
                    <br />
                  </div>
                  <br />
                </div>
                {/* Export Section */}
                <div className="section">
                  <table className="summary-table table table-bordered">
                    <thead>
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
          <div className="summary_details_area">
            <div className="text-center">
              <h3 className="summary-title">BBLC</h3>
              <div className="summary-info">
                <strong>Tag Number :</strong> MOD24008
                <br />
              </div>
              <br />
            </div>

            <div className="section">
              <table className="summary-table table table-bordered">
                <thead>
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
                    <td>BUTTON</td>
                    <td>JINDAL POLY BUTTONS PVT. LTD.</td>
                  </tr>
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
                    <td>BUTTON</td>
                    <td>JINDAL POLY BUTTONS PVT. LTD.</td>
                  </tr>
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
                    <td>BUTTON</td>
                    <td>JINDAL POLY BUTTONS PVT. LTD.</td>
                  </tr>

                  <tr>
                    <td className="text-end" colSpan={4}>
                      <strong>TOTAL</strong>
                    </td>
                    <td>
                      <strong>2284572.54</strong>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <strong>283206.66</strong>
                    </td>
                    <td>
                      <strong>283206.66</strong>
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
                <table className="summary-table table table-bordered">
                  <tbody>
                    <tr>
                      <td>Total Closed Amount ( in Equivelent USD )</td>
                      <td>2637.6</td>
                    </tr>
                    <tr>
                      <td>Total EDF LC Amount ( in Equivelent USD )</td>
                      <td>0.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <br />
            <br />
            <div className="row">
              <div className="col-lg-4">
                <table className="summary-table table table-bordered">
                  <thead>
                    <tr>
                      <th>
                        Proudct Wise Amount Break-up ( in Equivelent USD )
                      </th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>LC24</td>
                      <td>6934.8</td>
                    </tr>
                    <tr>
                      <td>LC25</td>
                      <td>1484517.48</td>
                    </tr>
                    <tr>
                      <td>LC27</td>
                      <td>69065.1</td>
                    </tr>

                    <tr>
                      <td>
                        <strong>TOTAL</strong>
                      </td>
                      <td>
                        <strong>1560517.38</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <br />
            <br />
            <div className="row">
              <div className="col-lg-4">
                <table className="summary-table table table-bordered">
                  <thead>
                    <tr>
                      <th>COMMODITY CATEGORY</th>
                      <th>Amount</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>ACCESSORI & OTHERS</td>
                      <td>419943.17</td>
                      <td>26.91</td>
                    </tr>
                    <tr>
                      <td>FABRIC</td>
                      <td>1140574.21</td>
                      <td>73.09</td>
                    </tr>

                    <tr>
                      <td>
                        <strong>TOTAL</strong>
                      </td>
                      <td>
                        <strong>1560517.38</strong>
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

        {activeTab === "Advanced Payment" && (
          <div className="summary_details_area">
            <div className="text-center">
              <h3 className="summary-title">Advanced Payment</h3>
              <div className="summary-info">
                <strong>Tag Number :</strong> MOD24008
                <br />
              </div>
              <br />
            </div>

            <div className="section">
              <table className="summary-table table table-bordered">
                <thead>
                  <tr>
                    <th>Prod.</th>
                    <th>User Ref No.</th>
                    <th>Issue Date</th>
                    <th>Currency</th>
                    <th>Contract Amt.</th>
                    <th>Contract Amt. in USD</th>
                    <th>Import Amt.</th>
                    <th>Commidity</th>
                    <th>Source of fund</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>LC24</td>
                    <td>140424250034</td>
                    <td>2/6/2025</td>
                    <td>USD</td>
                    <td>132741.61</td>
                    <td>132741.61</td>
                    <td>132741.61</td>
                    <td>FABRIC</td>
                    <td>DFC</td>
                  </tr>
                  <tr>
                    <td>LC24</td>
                    <td>140424250034</td>
                    <td>2/6/2025</td>
                    <td>USD</td>
                    <td>132741.61</td>
                    <td>132741.61</td>
                    <td>132741.61</td>
                    <td>FABRIC</td>
                    <td>DFC</td>
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
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === "BB Bill" && (
          <div className="summary_details_area">
            <div className="text-center">
              <h3 className="summary-title">BB Bill</h3>
              <div className="summary-info">
                <strong>Tag Number :</strong> MOD24008
                <br />
              </div>
              <br />
            </div>

            <div className="section">
              <table className="summary-table table table-bordered">
                <thead>
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
                    <td>BUTTON</td>
                    <td>JINDAL POLY BUTTONS PVT. LTD.</td>
                  </tr>
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
                    <td>BUTTON</td>
                    <td>JINDAL POLY BUTTONS PVT. LTD.</td>
                  </tr>
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
                    <td>BUTTON</td>
                    <td>JINDAL POLY BUTTONS PVT. LTD.</td>
                  </tr>

                  <tr>
                    <td className="text-end" colSpan={4}>
                      <strong>TOTAL</strong>
                    </td>
                    <td>
                      <strong>2284572.54</strong>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <strong>283206.66</strong>
                    </td>
                    <td>
                      <strong>283206.66</strong>
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
                <table className="summary-table table table-bordered">
                  <tbody>
                    <tr>
                      <td>Total Closed Amount ( in Equivelent USD )</td>
                      <td>2637.6</td>
                    </tr>
                    <tr>
                      <td>Total EDF LC Amount ( in Equivelent USD )</td>
                      <td>0.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <br />
            <br />
            <div className="row">
              <div className="col-lg-4">
                <table className="summary-table table table-bordered">
                  <thead>
                    <tr>
                      <th>
                        Proudct Wise Amount Break-up ( in Equivelent USD )
                      </th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>LC24</td>
                      <td>6934.8</td>
                    </tr>
                    <tr>
                      <td>LC25</td>
                      <td>1484517.48</td>
                    </tr>
                    <tr>
                      <td>LC27</td>
                      <td>69065.1</td>
                    </tr>

                    <tr>
                      <td>
                        <strong>TOTAL</strong>
                      </td>
                      <td>
                        <strong>1560517.38</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <br />
            <br />
            <div className="row">
              <div className="col-lg-4">
                <table className="summary-table table table-bordered">
                  <thead>
                    <tr>
                      <th>COMMODITY CATEGORY</th>
                      <th>Amount</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>ACCESSORI & OTHERS</td>
                      <td>419943.17</td>
                      <td>26.91</td>
                    </tr>
                    <tr>
                      <td>FABRIC</td>
                      <td>1140574.21</td>
                      <td>73.09</td>
                    </tr>

                    <tr>
                      <td>
                        <strong>TOTAL</strong>
                      </td>
                      <td>
                        <strong>1560517.38</strong>
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

        {activeTab === "Overview" && (
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

        {activeTab === "PO'S" && (
          <div className="summary_details_area">
            <div className="text-center">
              <h3 className="summary-title">PO'S</h3>
              <div className="summary-info">
                <strong>Tag Number :</strong> MOD24008
                <br />
              </div>
              <br />
            </div>
            <div className="section">
              <table className="summary-table table table-bordered">
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
          </div>
        )}
      </div>
    </div>
  );
}
