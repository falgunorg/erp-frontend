import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logos/logo-short.png";
import api from "services/api";
import html2pdf from "html2pdf.js";

import { ArrowRightIcon, ArrowDownIcon } from "../../elements/SvgIcons";

export default function BudgetDetails(props) {
  const [spinner, setSpinner] = useState(false);
  const [materialTypes, setMaterialTypes] = useState([]);
  const getMaterialTypes = async () => {
    setSpinner(true);
    var response = await api.post("/item-types");
    if (response.status === 200 && response.data) {
      setMaterialTypes(response.data.data);
    }
    setSpinner(false);
  };

  useEffect(() => {
    getMaterialTypes();
  }, []);

  const [collapsedMaterialTypes, setCollapsedMaterialTypes] = useState({}); // Track collapsed state

  const toggleMaterialType = (materialTypeId) => {
    setCollapsedMaterialTypes((prev) => ({
      ...prev,
      [materialTypeId]: !prev[materialTypeId], // Toggle collapse state
    }));
  };

  const [consumptionItems, setConsumptionItems] = useState({});

  const getGroupTotalPrice = (materialTypeId) => {
    const items = consumptionItems[materialTypeId] || [];
    return items
      .reduce((sum, item) => {
        const totalPrice = parseFloat(item.total_price) || 0;
        return sum + totalPrice;
      }, 0)
      .toFixed(2);
  };

  useEffect(() => {
    const dummyConsumptionItems = {
      1: [
        {
          item_id: "FAB001",
          name: "Cotton Twill",
          description: "Soft cotton twill fabric",
          color: "Navy",
          size: "M",
          position: "Body",
          supplier: "ABC Textiles",
          unit: "Yard",
          actual: "1.5",
          wastage_parcentage: "5",
          cons_total: "1.575",
          unit_price: "2.00",
          total_price: "3.15",
        },
      ],
      2: [
        {
          item_id: "TRIM004",
          name: "Button",
          description: "Wood button",
          color: "Black",
          size: "L",
          position: "Front",
          supplier: "Button Co",
          unit: "Dozen",
          actual: "0.1",
          wastage_parcentage: "2",
          cons_total: "0.102",
          unit_price: "0.50",
          total_price: "0.051",
        },
        {
          item_id: "TRIM001",
          name: "Button",
          description: "Plastic button",
          color: "Black",
          size: "L",
          position: "Front",
          supplier: "Button Co",
          unit: "Dozen",
          actual: "0.1",
          wastage_parcentage: "2",
          cons_total: "0.102",
          unit_price: "0.50",
          total_price: "0.051",
        },
      ],
      3: [
        // Another regular item type
        {
          item_id: "TRIM001",
          name: "Button",
          description: "Plastic button",
          color: "Black",
          size: "L",
          position: "Front",
          supplier: "Button Co",
          unit: "Dozen",
          actual: "0.1",
          wastage_parcentage: "2",
          cons_total: "0.102",
          unit_price: "0.50",
          total_price: "0.051",
        },
        {
          item_id: "TRIM001",
          name: "Button",
          description: "Plastic button",
          color: "Black",
          size: "L",
          position: "Front",
          supplier: "Button Co",
          unit: "Dozen",
          actual: "0.1",
          wastage_parcentage: "2",
          cons_total: "0.102",
          unit_price: "0.50",
          total_price: "0.051",
        },
      ],
      4: [
        // Another regular item type
        {
          item_id: "CM001",
          total_price: "1.00",
        },
        {
          item_id: "CM001",
          total_price: "8.00",
        },
      ],
    };
    setConsumptionItems(dummyConsumptionItems);
  }, []);

  const costSheetRef = React.useRef();
  const handleGeneratePDF = () => {
    const element = costSheetRef.current;
    const opt = {
      margin: 0.2,
      filename: "cost-sheet.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  const getGrandTotalFob = () => {
    const items = Object.values(consumptionItems).flat(); // Get all items across material types into one array

    return items
      .reduce((sum, item) => {
        const totalPrice = parseFloat(item.total_price) || 0;
        return sum + totalPrice;
      }, 0)
      .toFixed(2);
  };

  return (
    <div className="create_technical_pack" ref={costSheetRef}>
      <div className="row create_tp_header align-items-center">
        <div className="col-lg-10">
          <div className="row align-items-baseline">
            <div className="col-lg-4">
              <img
                style={{ width: "30px", marginRight: "8px" }}
                src={Logo}
                alt="Logo"
              />
              <span className="purchase_text">Budget</span>
            </div>
            <div className="col-lg-2">
              <label className="form-label">PO Number</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">#PONXT5875</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">WO Number</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">#WONXT5875</div>
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
              <div className="form-value">NSLBD</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Tech Pack#</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">#TPNXT5875</div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Brand</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">NEXT</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Buyer Style Name</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">Ps Chino Trouser</div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Season</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">S-25</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Name</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">Chino Trouser</div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Department</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">Mens</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Type</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">Bottom</div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Factory CPM/Eft</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">58</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Description</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                97% Cotton 3% Elastane Ps Chino Trouser
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">FOB</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">$7.5</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Wash Detail</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">Garment Wash</div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">CM</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">$1.00</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Special Operation</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">Dying, Printing</div>
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
                <th>Unit Price From Open Costing</th>
                <th>Actual Unit Price</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Fabric</td>
                <td>Pocketing</td>
                <td>Composition</td>
                <td>Abc</td>
                <td>black</td>
                <td>body</td>
                <td>xl</td>
                <td>yards</td>
                <td>xl</td>
                <td>5</td>
                <td>1.00</td>
                <td>5%</td>
                <td>1.5</td>
                <td>5</td>
                <td>$0.60</td>
                <td>$0.60</td>
                <td>$5.00</td>
              </tr>
              <tr>
                <td>Fabric</td>
                <td>Pocketing</td>
                <td>Composition</td>
                <td>Abc</td>
                <td>black</td>
                <td>body</td>
                <td>xl</td>
                <td>yards</td>
                <td>xl</td>
                <td>5</td>
                <td>1.00</td>
                <td>5%</td>
                <td>1.5</td>
                <td>5</td>
                <td>$0.60</td>
                <td>$0.60</td>
                <td>$5.00</td>
              </tr>
              <tr>
                <td>Fabric</td>
                <td>Pocketing</td>
                <td>Composition</td>
                <td>Abc</td>
                <td>black</td>
                <td>body</td>
                <td>xl</td>
                <td>yards</td>
                <td>xl</td>
                <td>5</td>
                <td>1.00</td>
                <td>5%</td>
                <td>1.5</td>
                <td>5</td>
                <td>$0.60</td>
                <td>$0.60</td>
                <td>$5.00</td>
              </tr>
              <tr>
                <td>Fabric</td>
                <td>Pocketing</td>
                <td>Composition</td>
                <td>Abc</td>
                <td>black</td>
                <td>body</td>
                <td>xl</td>
                <td>yards</td>
                <td>xl</td>
                <td>5</td>
                <td>1.00</td>
                <td>5%</td>
                <td>1.5</td>
                <td>5</td>
                <td>$0.60</td>
                <td>$0.60</td>
                <td>$5.00</td>
              </tr>

              <tr>
                <td>Fabric</td>
                <td>Pocketing</td>
                <td>Composition</td>
                <td>Abc</td>
                <td>black</td>
                <td>body</td>
                <td>xl</td>
                <td>yards</td>
                <td>xl</td>
                <td>5</td>
                <td>1.00</td>
                <td>5%</td>
                <td>1.5</td>
                <td>5</td>
                <td>$0.60</td>
                <td>$0.60</td>
                <td>$5.00</td>
              </tr>

              <tr>
                <td colSpan={16}>
                  <strong>FOB</strong>
                </td>
                <td className="text-end">
                  <strong>$8.00</strong>
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
