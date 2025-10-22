import React, { useState, useEffect } from "react";
import api from "services/api";
import Logo from "../../../assets/images/logos/logo-short.png";
import { useHistory, useParams } from "react-router-dom";

export default function ContractDetails() {
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  const [form, setForm] = useState({});
  const [goods, setGoods] = useState([]);

  useEffect(() => {
    // 🔹 Demo dataset
    const demoContract = {
      contract_no: "PC-2025-001",
      contract_date: "2025-10-22",
      buyer_name: "Falgun Textiles Ltd.",
      buyer_phone: "+880 1234 567890",
      buyer_email: "buyer@example.com",
      buyer_address: "House 12, Road 34, Dhaka, Bangladesh",
      notify_party: "Falgun Logistics Ltd., Chittagong Port",
      buyer_bank_name: "Dhaka Bank Ltd.",
      buyer_bank_address: "123 Motijheel, Dhaka",
      buyer_bank_phone: "+880 9876 543210",
      buyer_bank_swift: "DBLBBDDH",
      company_name: "Falgun Export Ltd.",
      seller_address: "Plot 56, EPZ, Chittagong",
      seller_bank_name: "Bangladesh Bank Ltd.",
      seller_bank_address: "Head Office, Dhaka",
      seller_bank_swift: "BBLBDDH",
      payment_terms: "LC at sight",
      mode_of_shipment: "Sea",
      port_of_loading: "Chittagong",
      port_of_discharge: "Hamburg",
      documents_required:
        "Invoice, Packing List, Bill of Lading, Certificate of Origin",
      reimbursement_instructions: "All reimbursements should be made via LC",
      amendment_clause: "Any amendment requires mutual consent",
      agent_commission_clause: "Agent commission is 2% of FOB",
    };

    const demoGoods = [
      {
        style: "ST-001",
        po: "PO-1001",
        description: "Men's T-Shirts, Cotton, Blue",
        quantity: 1000,
        unit_price: 5.5,
        shipment_date: "2025-11-15",
      },
      {
        style: "ST-002",
        po: "PO-1002",
        description: "Women's Shirts, Silk, Red",
        quantity: 500,
        unit_price: 12,
        shipment_date: "2025-11-20",
      },
      {
        style: "ST-003",
        po: "PO-1003",
        description: "Kids Shorts, Cotton, Green",
        quantity: 800,
        unit_price: 4.75,
        shipment_date: "2025-11-25",
      },
    ];

    setForm(demoContract);
    setGoods(demoGoods);
  }, []);

  return (
    <div className="purchase_contract_details">
      <div className="d-flex align-items-center mb-4">
        <i
          onClick={goBack}
          className="fa fa-angle-left me-3"
          style={{ fontSize: 25, cursor: "pointer" }}
        />
        <img src={Logo} alt="Logo" style={{ width: 35, marginRight: 10 }} />
        <h4 className="m-0">Purchase Contract Details</h4>
      </div>

      <div className="row">
        {/* Contract Details */}
        <div className="col-md-12 col-lg-6">
          <div className="card mb-3">
            <div className="card-header fw-bold bg-light">Contract Details</div>
            <div className="card-body row">
              <div className="col-lg-6">
                <strong>Contract No:</strong> {form.contract_no || "-"}
              </div>
              <div className="col-lg-6">
                <strong>Contract Date:</strong> {form.contract_date || "-"}
              </div>
            </div>
          </div>

          {/* Buyer Information */}
          <div className="card mb-3">
            <div className="card-header fw-bold bg-light">
              Buyer Information
            </div>
            <div className="card-body">
              <p>
                <strong>Buyer:</strong> {form.buyer_name || "-"}
              </p>
              <p>
                <strong>Phone:</strong> {form.buyer_phone || "-"}
              </p>
              <p>
                <strong>Email:</strong> {form.buyer_email || "-"}
              </p>
              <p>
                <strong>Address:</strong> {form.buyer_address || "-"}
              </p>
              <p>
                <strong>Notify Party:</strong> {form.notify_party || "-"}
              </p>
            </div>
          </div>

          {/* Buyer Bank Information */}
          <div className="card mb-3">
            <div className="card-header fw-bold bg-light">
              Buyer Bank Information
            </div>
            <div className="card-body">
              <p>
                <strong>Bank Name:</strong> {form.buyer_bank_name || "-"}
              </p>
              <p>
                <strong>SWIFT:</strong> {form.buyer_bank_swift || "-"}
              </p>
              <p>
                <strong>Address:</strong> {form.buyer_bank_address || "-"}
              </p>
              <p>
                <strong>Phone:</strong> {form.buyer_bank_phone || "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-12 col-lg-6">
          {/* Seller Information */}
          <div className="card mb-3">
            <div className="card-header fw-bold bg-light">
              Seller Information
            </div>
            <div className="card-body">
              <p>
                <strong>Company:</strong> {form.company_name || "-"}
              </p>
              <p>
                <strong>Address:</strong> {form.seller_address || "-"}
              </p>
            </div>
          </div>

          {/* Seller Bank Information */}
          <div className="card mb-3">
            <div className="card-header fw-bold bg-light">
              Seller Bank Information
            </div>
            <div className="card-body">
              <p>
                <strong>Bank Name:</strong> {form.seller_bank_name || "-"}
              </p>
              <p>
                <strong>SWIFT:</strong> {form.seller_bank_swift || "-"}
              </p>
              <p>
                <strong>Address:</strong> {form.seller_bank_address || "-"}
              </p>
            </div>
          </div>

          {/* Payment & Shipment Info */}
          <div className="card mb-3">
            <div className="card-header fw-bold bg-light">
              Payment & Shipment Information
            </div>
            <div className="card-body">
              <p>
                <strong>Payment Terms:</strong> {form.payment_terms || "-"}
              </p>
              <p>
                <strong>Mode of Shipment:</strong>{" "}
                {form.mode_of_shipment || "-"}
              </p>
              <p>
                <strong>Port of Loading:</strong> {form.port_of_loading || "-"}
              </p>
              <p>
                <strong>Port of Discharge:</strong>{" "}
                {form.port_of_discharge || "-"}
              </p>
              <p>
                <strong>Documents Required:</strong>{" "}
                {form.documents_required || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Goods Table */}
        <div className="col-12">
          <div className="card mb-3">
            <div className="card-header fw-bold bg-light">
              Particulars of Goods / Services
            </div>
            <div className="card-body table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Style</th>
                    <th>PO</th>
                    <th>Description</th>
                    <th>Qty (PCS)</th>
                    <th>Unit Price</th>
                    <th>Total FOB</th>
                    <th>Shipment Date</th>
                  </tr>
                </thead>
                <tbody>
                  {goods.length > 0 ? (
                    goods.map((row, i) => (
                      <tr key={i}>
                        <td>{row.style}</td>
                        <td>{row.po}</td>
                        <td>{row.description}</td>
                        <td>{row.quantity}</td>
                        <td>{row.unit_price}</td>
                        <td>
                          {(
                            parseFloat(row.quantity || 0) *
                            parseFloat(row.unit_price || 0)
                          ).toFixed(2)}
                        </td>
                        <td>{row.shipment_date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No goods added
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="table-light fw-bold">
                  <tr>
                    <td colSpan="3" className="text-end">
                      Grand Total:
                    </td>
                    <td>
                      {goods.reduce(
                        (sum, row) => sum + (parseFloat(row.quantity) || 0),
                        0
                      )}
                    </td>
                    <td></td>
                    <td>
                      {goods
                        .reduce(
                          (sum, row) =>
                            sum +
                            (parseFloat(row.quantity) || 0) *
                              (parseFloat(row.unit_price) || 0),
                          0
                        )
                        .toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Clauses */}
        <div className="col-12">
          <div className="card mb-3">
            <div className="card-header fw-bold bg-light">
              Clauses & Conditions
            </div>
            <div className="card-body">
              <p>
                <strong>Reimbursement Instructions:</strong>{" "}
                {form.reimbursement_instructions || "-"}
              </p>
              <p>
                <strong>Amendment Clause:</strong>{" "}
                {form.amendment_clause || "-"}
              </p>
              <p>
                <strong>Agent Commission Clause:</strong>{" "}
                {form.agent_commission_clause || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
