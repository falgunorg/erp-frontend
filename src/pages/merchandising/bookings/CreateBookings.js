import React, { useState, useEffect, useMemo } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Logo from "../../../assets/images/logos/logo-short.png";
import CustomSelect from "elements/CustomSelect";
import QuailEditor from "elements/QuailEditor";

export default function CreateBookings(props) {
  const params = useParams();
  const history = useHistory();

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [displayRows, setDisplayRows] = useState([]);
  const [errors, setErrors] = useState({});

  const [expandedVariations, setExpandedVariations] = useState([]);
  const [groups, setGroups] = useState({});

  const norm = (v) =>
    String(v ?? "")
      .trim()
      .toUpperCase();
  const uniq = (arr) => Array.from(new Set(arr));

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
  const [units, setUnits] = useState([]);
  const getUnits = async () => {
    var response = await api.post("/common/units");
    if (response.status === 200 && response.data) {
      setUnits(response.data.data);
    }
  };

  const getWorkOrder = async () => {
    const response = await api.post(
      "/merchandising/workorders-details-for-booking",
      {
        id: params.wo_id,
      }
    );

    if (response.status === 200 && response.data) {
      const data = response.data.workorder;

      // Filter specific costing item
      const filteredCostingItem = (data.costing?.items || []).find(
        (item) => item.id === parseInt(params.costing_item_id)
      );

      setFormData({
        pos: data.pos || [],
        techpack: data.techpack,
        consumption: filteredCostingItem?.consumption,
        item_details: filteredCostingItem?.item_details,
        wastage: filteredCostingItem.wastage,
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
        item_details: filteredCostingItem.item_details,
        total_price: "",
        lc_term: "",
        etd: "",
        eta: "",
        eid: "",
        remarks: "",
        description: "",
      });

      // Group PO items by color
      const allItems = data.pos.flatMap((po) => po.items || []);
      // ---- build color+size variations (unique) ----
      const colorWiseVariations = Object.values(
        allItems.reduce((acc, item) => {
          const color = norm(item.color);
          const size = norm(item.size);
          const key = `${color}__${size}`;
          if (!acc[key]) acc[key] = { color, size, qty: 0 };
          acc[key].qty += Number(item.qty) || 0;
          return acc;
        }, {})
      );

      setExpandedVariations(colorWiseVariations);
      // ---- initialize groups: one group per color with ALL unique sizes ----
      const initialGroups = colorWiseVariations.reduce(
        (acc, { color, size }) => {
          if (!acc[color]) acc[color] = [[size]];
          else if (!acc[color][0].includes(size)) acc[color][0].push(size);
          return acc;
        },
        {}
      );
      setGroups(initialGroups);
    }
  };

  useEffect(() => {
    getWorkOrder();
    getUnits();
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
    setDisplayRows((prev) => {
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

  const saveBooking = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        items: displayRows.map((item) => ({
          size_range: item.sizeRange,
          garment_color: item.garment_color,
          garment_qty: item.garment_qty,
          item_type: item.item_type,
          item_description: item.item_description,
          position: item.position,
          item_size: item.item_size,
          item_color: item.item_color,
          item_brand: item.item_brand,
          consumption: parseFloat(item.consumption),
          wastage: parseFloat(item.wastage),
          actual_total: parseFloat(item.actual_total),
          final_qty: parseFloat(item.final_qty),
          booking_qty: parseFloat(item.booking_qty),
          sample_requirement: parseFloat(item.sample_requirement),
          comment: item.comment,
        })),
      };

      const response = await api.post("/merchandising/bookings", payload);

      if (response.status === 201) {
        alert("Fabric booking saved successfully!");
        history.push("/merchandising/bookings");
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

  const totalGarmentQty = displayRows.reduce(
    (sum, row) => sum + (Number(row.garment_qty) || 0),
    0
  );
  const totalFabric = displayRows.reduce(
    (sum, row) => sum + (Number(row.total) || 0),
    0
  );
  const totalFinalQty = displayRows.reduce(
    (sum, row) => sum + (Number(row.final_qty) || 0),
    0
  );
  const totalBookingQty = displayRows.reduce(
    (sum, row) => sum + (Number(row.booking_qty) || 0),
    0
  );
  const totalSampleRequiremnt = displayRows.reduce(
    (sum, row) => sum + (Number(row.sample_requirement) || 0),
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

  //NEW SIZE RANGE FORMULA

  const handleGroupChange = (color, groupIndex, selected) => {
    const selectedSizes = uniq((selected || []).map((s) => norm(s)));

    setGroups((prev) => {
      const next = { ...prev };
      const allColorSizes = expandedVariations
        .filter((v) => v.color === color)
        .map((v) => v.size);

      // clone existing groups
      let colorGroups = (next[color] || []).map((g) => [...g]);

      // update the edited group
      colorGroups[groupIndex] = selectedSizes;

      // remove those sizes from other groups of this color
      colorGroups = colorGroups.map((g, i) =>
        i === groupIndex ? uniq(g) : g.filter((s) => !selectedSizes.includes(s))
      );

      // remove empty groups
      colorGroups = colorGroups.filter((g) => g.length > 0);

      // find sizes not used anywhere
      const used = new Set(colorGroups.flat());
      const leftovers = allColorSizes.filter((s) => !used.has(s));

      // ✅ instead of splitting leftovers, group them together
      if (leftovers.length) {
        colorGroups.push(leftovers);
      }

      next[color] = colorGroups;
      return next;
    });
  };

  useEffect(() => {
    const rows = [];
    Object.entries(groups).forEach(([color, colorGroups]) => {
      colorGroups.forEach((sizeGroup, i) => {
        const qty = expandedVariations
          .filter((v) => v.color === color && sizeGroup.includes(v.size))
          .reduce((sum, v) => sum + v.qty, 0);

        const consumption = parseFloat(formData?.consumption || 0);
        const item_details = formData.item_details || "";
        const allow = parseFloat(formData?.wastage || 0);
        const total = qty * consumption;
        const actualTotal = total + (total * allow) / 100;

        // 🔑 Find if this row already exists in displayRows
        const existingRow = displayRows.find(
          (r) => r.color === color && r.groupIndex === i
        );

        rows.push({
          garment_color: color,
          color,
          sizes: uniq(sizeGroup),
          sizeRange: uniq(sizeGroup).join(", "),
          garment_qty: qty,
          item_type: existingRow?.item_type || "",
          position: existingRow?.position || "", // ✅ ensure not null
          item_size: existingRow?.item_size || "", // ✅ ensure not null
          item_color: existingRow?.item_color || "", // ✅ ensure not null
          item_material: existingRow?.item_material || "",
          item_brand: existingRow?.item_brand || "", // ✅ ensure not null
          item_description: existingRow?.item_description || item_details,
          consumption: existingRow?.consumption ?? consumption,
          total: qty * (existingRow?.consumption ?? consumption),
          wastage: existingRow?.wastage ?? allow,
          actual_total:
            qty *
            (existingRow?.consumption ?? consumption) *
            (1 + (existingRow?.wastage ?? allow) / 100),
          final_qty:
            existingRow?.final_qty ??
            qty *
              (existingRow?.consumption ?? consumption) *
              (1 + (existingRow?.wastage ?? allow) / 100),
          booking_qty:
            existingRow?.booking_qty ??
            qty *
              (existingRow?.consumption ?? consumption) *
              (1 + (existingRow?.wastage ?? allow) / 100),
          range: existingRow?.range || "",
          sample_requirement: existingRow?.sample_requirement || 0,
          comment: existingRow?.comment || "",
          groupIndex: i,
        });
      });
    });

    setDisplayRows(rows);
  }, [expandedVariations, groups, formData]);

  console.log("displayROWS", displayRows);

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
              {formData.techpack?.buyer?.name || "-"}
            </div>
          </div>
          <div className="col-lg-2">
            <label className="form-label">Tech Pack/Style#</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">
              {formData.techpack?.techpack_number || "-"}
            </div>
          </div>
          <div className="col-lg-2">
            <label className="form-label">Company</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">
              {formData.techpack?.company?.title || "-"}
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
            <label className="form-label">Unit</label>
          </div>
          <div className="col-lg-2">
            <CustomSelect
              className="select_wo"
              placeholder="Unit"
              options={units.map(({ title }) => ({
                value: title,
                label: title,
              }))}
              value={units
                .map(({ title }) => ({
                  value: title,
                  label: title,
                }))
                .find((option) => option.value === formData.unit)}
              onChange={(selectedOption) =>
                handleFormDataChange("unit", selectedOption?.value)
              }
            />
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
              {formData.pos?.map((item, index) => (
                <Link to={"/purchase-orders/" + item.id} key={index}>
                  {item.po_number}
                  {index !== formData.pos.length - 1 ? ", " : ""}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="table-responsive mt-3">
          <table className="table table-bordered create_tp_body">
            <thead>
              <tr>
                <th>Garment Color</th>
                <th>Size Ranges</th>
                <th>Size / Dimension/Width</th>
                <th>Description / Specification/Composition</th>
                <th>Color / Pantone /Code</th>

                {/* ✅ Conditionally show these headers */}
                {formData.item_type_id !== 1 && (
                  <>
                    <th>Material Type</th>
                    <th>Position</th>
                    <th>Brand / Logo</th>
                  </>
                )}

                <th>Garment QTY</th>
                <th>Consumption</th>
                <th>Total</th>
                <th>Allow %</th>
                <th>Final</th>
                <th>Booking QTY</th>
                <th>Sample Requirement</th>
                <th>Comment/Remarks</th>
              </tr>
            </thead>

            <tbody>
              {displayRows.map((row, index) => {
                const sizeOptions = uniq(
                  expandedVariations
                    .filter((i) => i.color === row.color)
                    .map((i) => i.size)
                ).map((s) => ({ value: s, label: s }));

                return (
                  <tr key={`${row.color}-${row.groupIndex}`}>
                    <td>{row.garment_color}</td>
                    <td style={{ minWidth: "400px" }}>
                      <CustomSelect
                        className="select_wo"
                        isMulti
                        options={sizeOptions}
                        value={row.sizes.map((s) => ({ value: s, label: s }))}
                        onChange={(selected) =>
                          handleGroupChange(
                            row.color,
                            row.groupIndex,
                            selected ? selected.map((s) => s.value) : []
                          )
                        }
                      />
                    </td>
                    <td style={{ width: "150px" }}>
                      <input
                        className="form-value"
                        value={row.item_size}
                        onChange={(e) =>
                          handleVariationInputChange(
                            index,
                            "item_size",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td style={{ minWidth: "200px" }}>
                      <textarea
                        className="form-value"
                        value={row.item_description || ""}
                        onChange={(e) =>
                          handleVariationInputChange(
                            index,
                            "item_description",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td style={{ width: "150px" }}>
                      <input
                        className="form-value"
                        value={row.item_color}
                        onChange={(e) =>
                          handleVariationInputChange(
                            index,
                            "item_color",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    {/* ✅ Conditionally render next 3 fields */}
                    {formData.item_type_id !== 1 && (
                      <>
                        <td style={{ width: "150px" }}>
                          <input
                            className="form-value"
                            value={row.item_type}
                            onChange={(e) =>
                              handleVariationInputChange(
                                index,
                                "item_type",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td style={{ width: "150px" }}>
                          <input
                            className="form-value"
                            value={row.position}
                            onChange={(e) =>
                              handleVariationInputChange(
                                index,
                                "position",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td style={{ width: "150px" }}>
                          <input
                            className="form-value"
                            value={row.item_brand}
                            onChange={(e) =>
                              handleVariationInputChange(
                                index,
                                "item_brand",
                                e.target.value
                              )
                            }
                          />
                        </td>
                      </>
                    )}

                    <td>{row.garment_qty}</td>
                    <td style={{ width: "60px" }}>
                      <input
                        className="form-value"
                        type="number"
                        min={0}
                        step="0.1"
                        value={row.consumption ?? ""}
                        onChange={(e) =>
                          handleVariationInputChange(
                            index,
                            "consumption",
                            e.target.value === ""
                              ? ""
                              : parseFloat(e.target.value)
                          )
                        }
                      />
                    </td>
                    <td>{row.total.toFixed(2)}</td>
                    <td style={{ width: "60px" }}>
                      <input
                        className="form-value"
                        type="number"
                        value={row.wastage}
                        onChange={(e) =>
                          handleVariationInputChange(
                            index,
                            "wastage",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>{row.final_qty.toFixed(2)}</td>
                    <td style={{ width: "120px" }}>
                      <input
                        className="form-value"
                        type="number"
                        value={row.booking_qty}
                        onChange={(e) =>
                          handleVariationInputChange(
                            index,
                            "booking_qty",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td style={{ width: "80px" }}>
                      <input
                        value={row.sample_requirement}
                        className="form-value"
                        type="number"
                        min={0}
                        onChange={(e) =>
                          handleVariationInputChange(
                            index,
                            "sample_requirement",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={row.comment}
                        className="form-value"
                        type="text"
                        onChange={(e) =>
                          handleVariationInputChange(
                            index,
                            "comment",
                            e.target.value
                          )
                        }
                      />
                    </td>
                  </tr>
                );
              })}

              {/* ✅ Totals Row */}
              <tr>
                <td
                  colSpan={formData.item_type_id === 1 ? "5" : "8"}
                  style={{ textAlign: "right" }}
                >
                  <strong>Total:</strong>
                </td>
                <td>
                  <strong>{totalGarmentQty.toFixed(2)}</strong>
                </td>
                <td></td>
                <td>
                  <strong>{totalFabric.toFixed(2)}</strong>
                </td>
                <td></td>
                <td>
                  <strong>{totalFinalQty.toFixed(2)}</strong>
                </td>
                <td>
                  <strong>{totalBookingQty.toFixed(2)}</strong>
                </td>
                <td>
                  <strong>{totalSampleRequiremnt.toFixed(2)}</strong>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <br />
      <hr />

      <div className="row">
        <QuailEditor
          content={formData.description}
          onContentChange={(value) =>
            handleFormDataChange("description", value)
          }
        />
      </div>
    </div>
  );
}
