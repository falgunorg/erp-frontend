import React, { useState } from "react";

const FieldRow = ({ number, label, children }) => (
  <div className="row mb-3">
    <div className="col-lg-4 fw-bold">
      {number}. {label}
    </div>
    <div className="col-lg-8">{children}</div>
  </div>
);

const CreateContracts = ({ onSubmit }) => {
  const [form, setForm] = useState({
    contractNo: "",
    contractDate: "",
    buyerName: "BASS PRO INC.",
    buyerAddress:
      "Sportsman’s Park Center, 2500 E. Kearney, Springfield, Missouri 65898, USA",
    buyerPhone: "(417) 873-5000",
    buyerEmail: "chellappa@hot-source.net",
    notifyParties: "",
    buyerBankName: "BANK OF AMERICA",
    buyerBankAddress:
      "1, FLEETWAY, SCRANTON, PA 18507-1999, USA. SPECIAL ATTN: SUPPORT UNIT, MAIL STOP: PA6-580-02-30",
    buyerBankPhone: "(570)330-4573",
    buyerBankSwift: "BOFAUS3N",
    agentName: "SORCOM INVESTMENTS LTD.",
    agentAddress: "4TH FLOOR, 299QRC, 287-299, QUEENS ROAD CENTRAL, HONG KONG",
    agentPhone: "00 852 2218 2203",
    agentBankName: "STANDARD CHARTERED BANK",
    agentBankAddress:
      "4-4A DES VOEUX ROAD CENTRAL, HONG KONG. ACCOUNT NO. USD S/A NO.447-2-060162-5",
    agentBankSwift: "SCBLHKHHXXX",
    beneficiaryName: "MODISTE (BANGLADESH) LTD.",
    beneficiaryAddress:
      "51/C (A) SAGORIKA ROAD, FOUZDERHAT HEAVY INDUSTRIAL AREA, CHITTAGONG 4102, BANGLADESH",
    beneficiaryBank: "DHAKA BANK LIMITED, AGRABAD BRANCH",
    beneficiaryBankAddress:
      "WORLD TRADE CENTER, 102-103 AGRABAD C/A, CHITTAGONG -4100, BANGLADESH",
    beneficiaryBankSwift: "DHBLBDDH201",
    paymentTerms: "",
    portOfDischarge: "",
    portOfLoading: "CHITTAGONG, BANGLADESH",
    modeOfShipment: "SEA/AIR",
    documentsRequired: "",
    transshipment: "Allowed",
    tolerance: "+/-5%",
    defectiveAllowance: "0.5%",
    storeAllowance: "0.5%",
    expiryDate: "",
    reimbursementInstructions: "",
    amendmentClause: "",
    agentCommissionClause: "",
    buyerRepresentative: "",
    sellerRepresentative: "",
    items: [
      {
        style: "",
        description: "",
        quantity: "",
        fobValue: "",
        totalFobValue: "",
        agentCommission: "",
        totalAgentCommission: "",
        latestShipmentDate: "",
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...form.items];
    newItems[index][name] = value;
    setForm({ ...form, items: newItems });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [
        ...form.items,
        {
          style: "",
          description: "",
          quantity: "",
          fobValue: "",
          totalFobValue: "",
          agentCommission: "",
          totalAgentCommission: "",
          latestShipmentDate: "",
        },
      ],
    });
  };

  const removeItem = (index) => {
    const newItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: newItems });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
    console.log("Bass Pro Purchase Contract Submitted:", form);
  };

  return (
    <form className="my-4" onSubmit={handleSubmit}>
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white text-center">
          <h4 className="mb-0">PURCHASE CONTRACT</h4>
        </div>

        <div className="card-body">
          {/* 1–18 Standard Fields */}
          <FieldRow number="1" label="Purchase Contract No.">
            <input
              type="text"
              className="form-control"
              name="contractNo"
              value={form.contractNo}
              onChange={handleChange}
            />
          </FieldRow>

          <FieldRow number="2" label="Purchase Contract Date">
            <input
              type="date"
              className="form-control"
              name="contractDate"
              value={form.contractDate}
              onChange={handleChange}
            />
          </FieldRow>

          <FieldRow number="3" label="Name & Address of Buyer">
            <textarea
              className="form-control"
              rows="2"
              name="buyerAddress"
              value={form.buyerAddress}
              onChange={handleChange}
            />
          </FieldRow>

          <FieldRow number="4" label="Notify Party">
            <textarea
              className="form-control"
              rows="3"
              name="notifyParties"
              value={form.notifyParties}
              onChange={handleChange}
            />
          </FieldRow>

          <FieldRow number="5" label="Name & Address of Buyer’s Bank">
            <textarea
              className="form-control"
              rows="3"
              name="buyerBankAddress"
              value={form.buyerBankAddress}
              onChange={handleChange}
            />
            <div className="row mt-2">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Phone"
                  name="buyerBankPhone"
                  value={form.buyerBankPhone}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="SWIFT Code"
                  name="buyerBankSwift"
                  value={form.buyerBankSwift}
                  onChange={handleChange}
                />
              </div>
            </div>
          </FieldRow>

          <FieldRow number="6" label="Agent Name & Address">
            <textarea
              className="form-control"
              rows="2"
              name="agentAddress"
              value={form.agentAddress}
              onChange={handleChange}
            />
          </FieldRow>

          <FieldRow number="7" label="Agent’s Bank Name & Address">
            <textarea
              className="form-control"
              rows="2"
              name="agentBankAddress"
              value={form.agentBankAddress}
              onChange={handleChange}
            />
            <input
              type="text"
              className="form-control mt-2"
              placeholder="SWIFT Code"
              name="agentBankSwift"
              value={form.agentBankSwift}
              onChange={handleChange}
            />
          </FieldRow>

          <FieldRow number="8" label="Beneficiary’s Name & Address">
            <textarea
              className="form-control"
              rows="2"
              name="beneficiaryAddress"
              value={form.beneficiaryAddress}
              onChange={handleChange}
            />
          </FieldRow>

          <FieldRow number="9" label="Beneficiary’s Bank Name & Address">
            <textarea
              className="form-control"
              rows="2"
              name="beneficiaryBankAddress"
              value={form.beneficiaryBankAddress}
              onChange={handleChange}
            />
            <input
              type="text"
              className="form-control mt-2"
              placeholder="SWIFT Code"
              name="beneficiaryBankSwift"
              value={form.beneficiaryBankSwift}
              onChange={handleChange}
            />
          </FieldRow>

          <FieldRow number="10" label="Payment Terms">
            <input
              type="text"
              className="form-control"
              name="paymentTerms"
              value={form.paymentTerms}
              onChange={handleChange}
            />
          </FieldRow>

          <FieldRow number="11" label="Port of Discharge / Destination">
            <input
              type="text"
              className="form-control"
              name="portOfDischarge"
              value={form.portOfDischarge}
              onChange={handleChange}
            />
          </FieldRow>

          <FieldRow number="12" label="Port of Loading">
            <input
              type="text"
              className="form-control"
              name="portOfLoading"
              value={form.portOfLoading}
              onChange={handleChange}
            />
          </FieldRow>

          <FieldRow number="13" label="Mode of Shipment">
            <input
              type="text"
              className="form-control"
              name="modeOfShipment"
              value={form.modeOfShipment}
              onChange={handleChange}
            />
          </FieldRow>

          <FieldRow number="14" label="Documents Required">
            <textarea
              className="form-control"
              rows="3"
              name="documentsRequired"
              value={form.documentsRequired}
              onChange={handleChange}
            />
          </FieldRow>

          <FieldRow number="15" label="Trans-shipment / Part shipment">
            <input
              type="text"
              className="form-control"
              name="transshipment"
              value={form.transshipment}
              onChange={handleChange}
            />
          </FieldRow>

          <FieldRow number="16" label="Tolerance">
            <input
              type="text"
              className="form-control"
              name="tolerance"
              value={form.tolerance}
              onChange={handleChange}
            />
          </FieldRow>

          <FieldRow number="17" label="Defective Allowance & Store Allowance">
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                name="defectiveAllowance"
                value={form.defectiveAllowance}
                onChange={handleChange}
              />
              <input
                type="text"
                className="form-control"
                name="storeAllowance"
                value={form.storeAllowance}
                onChange={handleChange}
              />
            </div>
          </FieldRow>

          <FieldRow number="18" label="Expiry Date of the Contract">
            <input
              type="date"
              className="form-control"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
            />
          </FieldRow>

          {/* 19 Full-width Goods Table */}
          <div className="row mb-3">
            <div className="col-12 fw-bold mb-2">
              19. Particulars of Goods / Services
            </div>
            <div className="col-12">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Style</th>
                    <th>Description</th>
                    <th>Qty (PCS)</th>
                    <th>FOB Value</th>
                    <th>Total FOB</th>
                    <th>Agent Comm/PC</th>
                    <th>Total Comm</th>
                    <th>Latest Ship Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {form.items.map((item, i) => (
                    <tr key={i}>
                      {[
                        "style",
                        "description",
                        "quantity",
                        "fobValue",
                        "totalFobValue",
                        "agentCommission",
                        "totalAgentCommission",
                        "latestShipmentDate",
                      ].map((field) => (
                        <td key={field}>
                          <input
                            type={
                              field === "latestShipmentDate" ? "date" : "text"
                            }
                            className="form-control"
                            name={field}
                            value={item[field]}
                            onChange={(e) => handleItemChange(i, e)}
                          />
                        </td>
                      ))}
                      <td>
                        {i > 0 && (
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => removeItem(i)}
                          >
                            ✕
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="button"
                className="btn btn-secondary mb-2"
                onClick={addItem}
              >
                + Add Row
              </button>
            </div>
          </div>
          <hr />

          {/* 20–22 Remaining */}
          <FieldRow number="20" label="Reimbursement Instructions">
            <textarea
              className="form-control"
              rows="2"
              name="reimbursementInstructions"
              value={form.reimbursementInstructions}
              onChange={handleChange}
            />
          </FieldRow>

          <FieldRow number="21" label="Amendment Clause">
            <textarea
              className="form-control"
              rows="2"
              name="amendmentClause"
              value={form.amendmentClause}
              onChange={handleChange}
            />
          </FieldRow>

          <FieldRow number="22" label="Agent Commission Clause">
            <textarea
              className="form-control"
              rows="2"
              name="agentCommissionClause"
              value={form.agentCommissionClause}
              onChange={handleChange}
            />
          </FieldRow>

          {/* Signatures */}
          <div className="row mb-3">
            <div className="col-lg-4 fw-bold">For and on behalf of Buyer:</div>
            <div className="col-lg-8">
              <input
                type="text"
                className="form-control mb-2"
                name="buyerRepresentative"
                placeholder="Buyer Representative Name"
                value={form.buyerRepresentative}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-lg-4 fw-bold">For and on behalf of Seller:</div>
            <div className="col-lg-8">
              <input
                type="text"
                className="form-control"
                name="sellerRepresentative"
                placeholder="Seller Representative Name"
                value={form.sellerRepresentative}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="text-end">
            <button type="submit" className="btn btn-primary px-5">
              Save Contract
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateContracts;
