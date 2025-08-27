import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Logo from "../../../../../assets/images/logos/logo-short.png"; // Adjust path if needed
import CustomSelect from "elements/CustomSelect";

export default function FabricBooking(props) {
  const params = useParams();
  const history = useHistory();

  const [workorder, setWorkorder] = useState({});
  const [formData, setFormData] = useState({});
  const [variationItems, setVariationItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [lcTerms, setLcTerms] = useState([
    { id: 1, title: "At Sight" },
    { id: 2, title: "30 Days, C&F Ctg" },
    { id: 3, title: "60 Days, C&F Ctg" },
    { id: 4, title: "90 Days, C&F Ctg" },
    { id: 5, title: "120 Days, C&F Ctg" },
    { id: 6, title: "150 Days, C&F Ctg" },
    { id: 7, title: "FOB" },
    { id: 8, title: "Ex Factory" },
    { id: 9, title: "TT, 10 Days" },
    { id: 10, title: "TT, 20 Days" },
    { id: 11, title: "TT, 30 Days" },
    { id: 12, title: "TT, 60 Days" },
  ]);

  const getWorkOrder = async () => {
    const response = await api.post("/workorder-details-for-booking", {
      id: params.wo_id,
    });

    if (response.status === 200 && response.data) {
      const data = response.data.workorder;

      // Filter specific costing item
      const filteredCostingItem = (data.costing?.items || []).find(
        (item) => item.id === parseInt(params.costing_item_id)
      );

      setFormData({
        costing_item_id: filteredCostingItem?.id,
        costing_id: filteredCostingItem.costing_id,
        wo_id: data.id,
        item_id: filteredCostingItem?.item_id,
        item_type_id: filteredCostingItem?.item_type_id,
        item: filteredCostingItem.item,
        unit: filteredCostingItem?.unit || "",
        unit_price: filteredCostingItem?.unit_price || 0,
        supplier_id: filteredCostingItem.supplier_id || "",
        supplier: filteredCostingItem.supplier || "",
        pp_sample_requirement: "",
        item_details: filteredCostingItem.item_details,
        total_price: "",
        lc_term: "",
        etd: "",
        eta: "",
        eid: "",
        remarks: "",
      });

      // Group PO items by color
      const allItems = data.pos.flatMap((po) => po.items || []);
      const groupedVariations = Object.values(
        allItems.reduce((acc, item) => {
          const key = item.color;
          if (!acc[key]) {
            acc[key] = { color: item.color, qty: 0 };
          }
          acc[key].qty += item.qty;
          return acc;
        }, {})
      );

      // Prepare variation items for table
      const initialVariations = groupedVariations.map((v) => {
        const consumption = parseFloat(filteredCostingItem?.consumption || 0);
        const item_details = filteredCostingItem.item_details || "";
        const allow = parseFloat(filteredCostingItem?.wastage || 0);
        const total = v.qty * consumption;
        const actualTotal = total + (total * allow) / 100;
        return {
          garment_color: v.color,
          garment_qty: v.qty,
          fabric_code: "",
          fabric_details: item_details,
          width: "",
          consumption: consumption,
          total: total,
          wastage: allow,
          actual_total: actualTotal,
          final_qty: actualTotal, // Initially same
          booking_qty: actualTotal,
          range: "",
        };
      });

      setVariationItems(initialVariations);
      setWorkorder(data);
    }
  };

  useEffect(() => {
    getWorkOrder();
  }, [params]);

  const handleFormDataChange = (name, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Recalculate total_price when unit_price changes
      if (name === "unit_price") {
        const unitPrice = parseFloat(value) || 0;
        updated.total_price = (unitPrice * totalBookingQty).toFixed(2);
      } else {
        // If other fields change, still ensure total_price is correct
        const unitPrice = parseFloat(updated.unit_price) || 0;
        updated.total_price = (unitPrice * totalBookingQty).toFixed(2);
      }

      return updated;
    });
  };

  const handleVariationInputChange = (index, field, value) => {
    setVariationItems((prev) => {
      const updated = [...prev];
      updated[index][field] = value;

      if (
        field === "consumption" ||
        field === "wastage" ||
        field === "garment_qty"
      ) {
        const qty = parseFloat(updated[index].garment_qty || 0);
        const cons = parseFloat(updated[index].consumption || 0);
        const allow = parseFloat(updated[index].wastage || 0);

        const total = qty * cons;
        const actualTotal = total + (total * allow) / 100;

        updated[index].total = total;
        updated[index].actual_total = actualTotal;
        updated[index].final_qty = actualTotal;
        updated[index].booking_qty = actualTotal;
      }

      return updated;
    });
  };

  const [errors, setErrors] = useState({});

  const saveBooking = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        user_id: 1, // Replace with actual logged user ID
        items: variationItems.map((item) => ({
          garment_color: item.garment_color,
          garment_qty: item.garment_qty,
          fabric_code: item.fabric_code,
          fabric_details: item.fabric_details,
          width: item.width,
          consumption: parseFloat(item.consumption),
          wastage: parseFloat(item.wastage),
          actual_total: parseFloat(item.actual_total),
          final_qty: parseFloat(item.final_qty),
          booking_qty: parseFloat(item.booking_qty),
        })),
      };

      const response = await api.post("/merchandising/fabric/booking", payload);

      if (response.status === 201) {
        alert("Fabric booking saved successfully!");
        history.push("/work-orders/" + workorder.id);
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        console.error("Error saving booking:", error);
        alert("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  const totalGarmentQty = variationItems.reduce(
    (sum, row) => sum + (Number(row.garment_qty) || 0),
    0
  );
  const totalFabric = variationItems.reduce(
    (sum, row) => sum + (Number(row.total) || 0),
    0
  );
  const totalFinalQty = variationItems.reduce(
    (sum, row) => sum + (Number(row.final_qty) || 0),
    0
  );
  const totalBookingQty = variationItems.reduce(
    (sum, row) => sum + (Number(row.booking_qty) || 0),
    0
  );

  useEffect(async () => {
    props.setHeaderData({
      pageName: "Booking",
      isNewButton: true,
      newButtonLink: "",
      newButtonText: "New WO",
      isInnerSearch: true,
      innerSearchValue: "",
    });
  }, []);

  useEffect(() => {
    setFormData((prev) => {
      const unitPrice = parseFloat(prev.unit_price) || 0;
      return {
        ...prev,
        total_price: (unitPrice * totalBookingQty).toFixed(2),
      };
    });
  }, [totalBookingQty]);

  return (
    <div className="create_technical_pack">
      <div className="row create_tp_header align-items-center">
        <div className="col-lg-10">
          <div className="row align-items-baseline">
            <div className="col-lg-4">
              <img
                style={{ width: "30px", marginRight: "8px" }}
                src={Logo}
                alt="Logo"
              />
              <span className="purchase_text">
                Booking {formData.item?.title}
              </span>
            </div>
          </div>
        </div>

        <div className="col-lg-2">
          <button
            onClick={saveBooking}
            className="btn btn-default submit_button"
            disabled={loading}
          >
            {loading ? "Saving..." : "Submit"}
          </button>
        </div>
      </div>
      <br />
      <div className="create_tp_body">
        <div className="row">
          <div className="col-lg-2">
            <label className="form-label">Buyer</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">
              {workorder.techpack?.buyer?.name || "-"}
            </div>
          </div>
          <div className="col-lg-2">
            <label className="form-label">Tech Pack/Style#</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">
              {workorder.techpack?.techpack_number || "-"}
            </div>
          </div>
          <div className="col-lg-2">
            <label className="form-label">Company</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">
              {workorder.techpack?.company?.title || "-"}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-2">
            <label className="form-label">Garment QTY</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">{totalGarmentQty}</div>
          </div>
          <div className="col-lg-2">
            <label className="form-label">
              WO Required Qty. (allow included){" "}
            </label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">{totalFinalQty}</div>
          </div>
          <div className="col-lg-2">
            <label className="form-label">Actual Booking</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">{totalBookingQty}</div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-2">
            <label className="form-label">Actual %</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">5%</div>
          </div>
          <div className="col-lg-2">
            <label className="form-label">PP Sample Requirement </label>
          </div>
          <div className="col-lg-2">
            <input
              value={formData.pp_sample_requirement}
              name="pp_sample_requirement"
              onChange={(e) =>
                handleFormDataChange("pp_sample_requirement", e.target.value)
              }
              type="text"
            />
          </div>
          <div className="col-lg-2">
            <label className="form-label">Unit</label>
          </div>
          <div className="col-lg-2">
            <select
              value={formData.unit}
              name="unit"
              onChange={(e) => handleFormDataChange("unit", e.target.value)}
            >
              <option value="YDS">YDS</option>
              <option value="MTR">MTR</option>
              <option value="KG">KG</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-2">
            <label className="form-label">Unit Price</label>
          </div>
          <div className="col-lg-2">
            <input
              value={formData.unit_price}
              name="unit_price"
              onChange={(e) =>
                handleFormDataChange("unit_price", e.target.value)
              }
              type="number"
              min={0}
              step={0.1}
            />
          </div>
          <div className="col-lg-2">
            <label className="form-label">Total Amount</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">${formData.total_price}</div>
          </div>
          <div className="col-lg-2">
            <label className="form-label">Supplier</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">{formData.supplier?.company_name}</div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-2">
            <label className="form-label">LC Terms</label>
          </div>
          <div className="col-lg-2">
            <CustomSelect
              className="select_wo"
              placeholder="LC Terms"
              options={lcTerms.map(({ title }) => ({
                value: title,
                label: title,
              }))}
              value={
                lcTerms
                  .map(({ title }) => ({
                    value: title,
                    label: title,
                  }))
                  .find((opt) => opt.value === formData.lc_term) || null
              }
              onChange={(selectedOption) =>
                handleFormDataChange("lc_term", selectedOption?.value)
              }
            />
          </div>
          <div className="col-lg-2">
            <label className="form-label">ETD</label>
          </div>
          <div className="col-lg-2">
            <input
              value={formData.etd}
              name="etd"
              onChange={(e) => handleFormDataChange("etd", e.target.value)}
              type="date"
            />
          </div>
          <div className="col-lg-2">
            <label className="form-label">ETA</label>
          </div>
          <div className="col-lg-2">
            <input
              value={formData.eta}
              name="eta"
              onChange={(e) => handleFormDataChange("eta", e.target.value)}
              type="date"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-2">
            <label className="form-label">EID</label>
          </div>
          <div className="col-lg-2">
            <input
              value={formData.eid}
              name="eid"
              onChange={(e) => handleFormDataChange("eid", e.target.value)}
              type="date"
            />
          </div>
          <div className="col-lg-2">
            <label className="form-label">Remarks</label>
          </div>
          <div className="col-lg-2">
            <input
              value={formData.remarks}
              name="remarks"
              onChange={(e) => handleFormDataChange("remarks", e.target.value)}
              type="text"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-2">
            <label className="form-label">Po</label>
          </div>
          <div className="col-lg-10">
            <div className="form-value">
              {workorder.pos?.map((item, index) => (
                <Link to={"/purchase-orders/" + item.id} key={index}>
                  {item.po_number}
                  {index !== workorder.pos.length - 1 ? ", " : ""}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="table-responsive mt-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Garment Color</th>
                <th>Fabric Code/Color</th>
                <th>Fabric Details</th>
                <th>Width</th>
                <th>Garment QTY</th>
                <th>Consumption</th>
                <th>Fabric</th>
                <th>Allow %</th>
                <th>Final</th>
                <th>Booking QTY</th>
              </tr>
            </thead>
            <tbody>
              {variationItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.garment_color}</td>

                  <td>
                    <input
                      className="form-control"
                      value={item.fabric_code}
                      onChange={(e) =>
                        handleVariationInputChange(
                          index,
                          "fabric_code",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <textarea
                      onChange={(e) =>
                        handleVariationInputChange(
                          index,
                          "fabric_details",
                          e.target.value
                        )
                      }
                      className="form-control"
                      value={item.fabric_details || ""}
                    />
                  </td>
                  <td>
                    <input
                      className="form-control"
                      value={item.width}
                      onChange={(e) =>
                        handleVariationInputChange(
                          index,
                          "width",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>{item.garment_qty}</td>
                  <td>
                    <input
                      className="form-control"
                      type="number"
                      value={item.consumption}
                      onChange={(e) =>
                        handleVariationInputChange(
                          index,
                          "consumption",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>{item.total.toFixed(2)}</td>
                  <td>
                    <input
                      className="form-control"
                      type="number"
                      value={item.wastage}
                      onChange={(e) =>
                        handleVariationInputChange(
                          index,
                          "wastage",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>{item.final_qty.toFixed(2)}</td>
                  <td>
                    <input
                      className="form-control"
                      type="number"
                      value={item.booking_qty}
                      onChange={(e) =>
                        handleVariationInputChange(
                          index,
                          "booking_qty",
                          e.target.value
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: "right", fontWeight: "bold" }}
                >
                  Total:
                </td>
                <td>{totalGarmentQty.toFixed(2)}</td>
                <td></td>
                <td>{totalFabric.toFixed(2)}</td>
                <td></td>
                <td>{totalFinalQty.toFixed(2)}</td>
                <td>{totalBookingQty.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
