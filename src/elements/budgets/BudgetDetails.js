import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logos/logo-short.png";
import api from "services/api";
import html2pdf from "html2pdf.js";
import { useParams } from "react-router-dom";

import { ArrowRightIcon, ArrowDownIcon } from "../../elements/SvgIcons";

export default function BudgetDetails(props) {
  const params = useParams();

  const [spinner, setSpinner] = useState(false);

  const [budget, setBudget] = useState([]);
  const getBudget = async () => {
    setSpinner(true);
    const response = await api.post("/budgets-show", { id: params.id });
    if (response.status === 200 && response.data) {
      const budgetData = response.data.data;
      setBudget(budgetData);
    }
    setSpinner(false);
  };

  useEffect(() => {
    getBudget();
  }, [params.id]);

  const budgetRef = React.useRef();
  const handleGeneratePDF = () => {
    const element = budgetRef.current;
    const opt = {
      margin: 0.2,
      filename: "cost-sheet.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="create_technical_pack" ref={budgetRef}>
      <div className="row create_tp_header align-items-center">
        <div className="col-lg-10">
          <div className="row align-items-baseline">
            <div className="col-lg-4">
              <img
                style={{ width: "30px", marginRight: "8px" }}
                src={Logo}
                alt="Logo"
              />
              <span className="purchase_text">Cost Sheet</span>
            </div>
            <div className="col-lg-2">
              <label className="form-label">PO Number</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{budget.po?.po_number || "N/A"}</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">WO Number</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{budget.po?.wo_number || "N/A"}</div>
            </div>
          </div>
        </div>
        <div className="col-lg-2">
          <button
            className="btn btn-default submit_button"
            onClick={handleGeneratePDF}
          >
            PDF
          </button>
        </div>
      </div>
      <br />
      <div className="row create_tp_body">
        <div className="col-lg-12">
          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Buyer</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">
                {budget.techpack?.buyer?.name || "N/A"}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Tech Pack#</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {budget.techpack?.techpack_number || "N/A"}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Brand</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">
                {budget.techpack?.brand || "N/A"}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Buyer Style Name</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {budget.techpack?.buyer_style_name || "N/A"}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Season</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">
                {budget.techpack?.season || "N/A"}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Name</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {budget.techpack?.item_name || "N/A"}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Department</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">
                {budget.techpack?.department || "N/A"}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Type</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {budget.techpack?.item_type || "N/A"}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Factory CPM/Eft</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">{budget.factory_cpm || "N/A"}</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Description</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {budget.techpack?.description || "N/A"}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">FOB</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">{budget.fob || "N/A"}</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Wash Detail</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {budget.techpack?.wash_details || "N/A"}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">CM</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">{budget.cm || "N/A"}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Special Operation</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {budget.techpack?.special_operation || "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="create_tp_materials_area create_tp_body">
        <h6>Material Descriptions</h6>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead style={{ verticalAlign: "middle" }}>
              <tr>
                <th>Item Type</th>
                <th>Item Name</th>
                <th>Item Details</th>
                <th>Supplier</th>
                <th>Color</th>
                <th>Position</th>
                <th>Size</th>
                <th>Unit</th>
                <th>Size Breakdown From PO</th>
                <th>Quantity</th>
                <th>Actual Consumption</th>
                <th>Wastage</th>
                <th>Total Consum- ption</th>
                <th>Total Booking</th>
                <th>Unit Price From Open Budget</th>
                <th>Actual Unit Price</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {budget.items?.length > 0 &&
                budget.items?.map((item, index) => (
                  <tr>
                    <td>{item.item_type?.title}</td>
                    <td>{item.item?.title}</td>
                    <td>{item.item_details}</td>
                    <td>{item.supplier?.company_name}</td>
                    <td>{item.color}</td>
                    <td>{item.position}</td>
                    <td>{item.size}</td>
                    <td>{item.unit}</td>
                    <td>{item.size_breakdown}</td>
                    <td>{item.quantity}</td>
                    <td>{item.consumption}</td>
                    <td>{item.wastage}</td>
                    <td>{item.total}</td>
                    <td>{item.total_booking}</td>
                    <td>{item.unit_price}</td>
                    <td>{item.actual_unit_price}</td>
                    <td>{item.actual_total_price}</td>
                  </tr>
                ))}

              <tr>
                <td colSpan={16}>
                  <strong>FOB</strong>
                </td>
                <td className="text-end">
                  <strong>
                    $
                    {budget.items?.reduce(
                      (sum, row) =>
                        sum + parseFloat(row.actual_total_price || 0),
                      0
                    ).toFixed(2)}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <br></br>
      </div>
    </div>
  );
}
