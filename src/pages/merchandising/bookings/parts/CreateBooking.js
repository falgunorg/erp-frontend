import React, { useState, useEffect } from "react";
import Logo from "assets/images/logos/logo-short.png";
import api from "services/api";
import CustomSelect from "elements/CustomSelect";
import { useHistory, Link, useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import FabricBooking from "./templates/FabricBooking";

export default function CreateBooking({ setRenderArea }) {
  const history = useHistory();
  const params = useParams();

  const [spinner, setSpinner] = useState(false);
  const [materialTypes, setMaterialTypes] = useState([]);
  const getMaterialTypes = async () => {
    setSpinner(true);
    var response = await api.post("/common/item-types");
    if (response.status === 200 && response.data) {
      setMaterialTypes(response.data.data);
    }
    setSpinner(false);
  };
  const [workOrders, setWorkOrders] = useState([]);
  const getWorkOrders = async () => {
    const response = await api.post("/merchandising/workorders-public");
    if (response.status === 200 && response.data) {
      const data = response.data.data;
      setWorkOrders(data);
    }
  };

  const [suppliers, setSuppliers] = useState([]);
  const getSuppliers = async () => {
    setSpinner(true);
    var response = await api.post("/admin/suppliers");
    if (response.status === 200 && response.data) {
      setSuppliers(response.data.data);
    }
    setSpinner(false);
  };

  useEffect(() => {
    getMaterialTypes();
    getWorkOrders();
    getSuppliers();
  }, []);

  const [lcTerms, setLcTerms] = useState([
    { id: 1, title: "At Sight" },
    { id: 2, title: "30, C&F Ctg" },
    { id: 3, title: "60, C&F Ctg" },
    { id: 4, title: "90, C&F Ctg" },
    { id: 5, title: "120, C&F Ctg" },
    { id: 6, title: "150, C&F Ctg" },
    { id: 7, title: "FOB" },
    { id: 8, title: "Ex Factory" },
    { id: 9, title: "TT, 10" },
    { id: 10, title: "TT, 20" },
    { id: 11, title: "TT, 30" },
    { id: 12, title: "TT, 60" },
  ]);

  const [formDataSet, setFormDataSet] = useState({
    wo_id: "",
    technical_package_id: "",
    wo_delivery_date: "",
    wo_qty: "",
    techpack: {}, // ✅ added
    pos: [], // ✅ added
    costing: {},
  });

  const [variations, setVariations] = useState([]);
  const handleInputChange = async (name, value) => {
    if (name === "wo_id") {
      try {
        const response = await api.post("/merchandising/workorders-details-for-booking", {
          id: value,
        });

        if (response.status === 200 && response.data) {
          const data = response.data.workorder;

          setFormDataSet((prev) => ({
            ...prev,
            wo_id: value,
            wo_delivery_date: data.delivery_date || "",
            wo_qty: data.wo_qty || "",
            technical_package_id: data.technical_package_id || "",
            techpack: data.techpack || {}, // ✅ correct spelling
            pos: data.pos || [],
            consting: data.costing || {},
          }));

          // ✅ Filter only fabric or item_type_id == 1
          const filteredMaterials = (data.costing?.items || []).filter(
            (item) => item.item_type_id === 1
          );

          // ✅ Group only the filtered materials
          const groupedItems = groupMaterialsByItemType(filteredMaterials);

          // ✅ Set the filtered and grouped items
          setConsumptionItems(groupedItems);

          const allItems = data.pos.flatMap((po) => po.items || []);
          const groupedVariations = Object.values(
            allItems.reduce((acc, item) => {
              const key = item.color; // Group only by color
              if (!acc[key]) {
                acc[key] = { color: item.color, qty: 0 }; // Remove size
              }
              acc[key].qty += item.qty;
              return acc;
            }, {})
          );

          // Push to state
          setVariations(groupedVariations);
        }
      } catch (error) {
        console.error("Error fetching technical package data:", error);
      }
    } else {
      setFormDataSet((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const groupMaterialsByItemType = (materials) => {
    return materials.reduce((acc, item) => {
      const itemTypeId = item.item_type_id;
      if (!acc[itemTypeId]) {
        acc[itemTypeId] = [];
      }

      // Convert API fields to match frontend structure (if needed)
      acc[itemTypeId].push({
        item_type_id: item.item_type_id,
        item_id: item.item_id || "",
        item_name: item.item_name || "",
        item_details: item.item_details || "",
        color: item.color || "",
        size: item.size || "",
        position: item.position || "",
        unit: item.unit || "",
        supplier_id: item.supplier_id || "",
        consumption: item.consumption || "",
        allow: item.wastage || 0,
        total: item.total || "",
        unit_price: item.unit_price || "",
        total_price: item.total_price || "",
        item_type: item.item_type || "",
        material: item.item || "",
      });

      return acc;
    }, {});
  };

  const [consumptionItems, setConsumptionItems] = useState({});

  // Handle changes for an item
  const handleItemChange = (materialTypeId, index, field, value) => {
    setConsumptionItems((prevItems) => {
      const updated = [...(prevItems[materialTypeId] || [])];

      if (!updated[index]) updated[index] = {};

      // keep value as-is (string) so inputs stay controlled; we'll parse numbers for calculations
      updated[index] = { ...updated[index], [field]: value };

      const item = updated[index];

      // parse numeric values safely
      const garmentQty = parseFloat(item.qty) || 0; // garment_qty
      const allowPercent = parseFloat(item.allow_percent) || 0; // allow %
      const actualBooking = parseFloat(item.actual_booking) || 0; // actual booking
      const unitPrice = parseFloat(item.unit_price) || 0; // unit price

      // 1) WO required qty = garment_qty + (garment_qty * allow% / 100)
      item.wo_required_qty = Number(
        (garmentQty + (garmentQty * allowPercent) / 100).toFixed(2)
      );

      // 2) total_price = actual_booking * unit_price
      item.total_price = Number((actualBooking * unitPrice).toFixed(2));

      // 3) actual % = ((actual_booking - garment_qty) / garment_qty) * 100
      item.actual_percent =
        garmentQty > 0
          ? Number(
              (((actualBooking - garmentQty) / garmentQty) * 100).toFixed(2)
            )
          : 0;

      // put back the modified item
      updated[index] = item;

      return { ...prevItems, [materialTypeId]: updated };
    });
  };
  const [errors, setErrors] = useState({});
  const handleSubmit = async (event) => {
    alert("Hello");
  };

  const [activeTab, setActiveTab] = useState("table");

  const [showSizeModal, setShowSizeModal] = useState(false);
  const [modalData, setModalData] = useState([]); // This will hold merged rows for modal
  const [activeItemIndex, setActiveItemIndex] = useState(null);
  const [activeMaterialTypeId, setActiveMaterialTypeId] = useState(null);

  const openSizeModal = (index, item, materialTypeId) => {
    setActiveItemIndex(index);
    setActiveMaterialTypeId(materialTypeId);

    // Generate modal data from variations
    const initialModalData = variations.map((v) => ({
      garment_color: v.color,
      range: "",
      fabric_code: item.color, // or item.material?.title
      item_details: item.item_details,
      width: item.width || "",
      consumption: item.consumption,
      qty: v.qty,
      fabric: parseFloat(v.qty) * parseFloat(item.consumption),
      allow: parseFloat(item.allow || 0),
      final_qty:
        parseFloat(v.qty) * parseFloat(item.consumption) +
        (parseFloat(v.qty) *
          parseFloat(item.consumption) *
          (parseFloat(item.allow) || 0)) /
          100,
      booking_qty: 0,
    }));

    setModalData(initialModalData);
    setShowSizeModal(true);
  };

  const saveModalData = () => {
    setConsumptionItems((prev) => {
      const currentArray = prev[activeMaterialTypeId] || []; // fallback
      const updated = [...currentArray];

      updated[activeItemIndex] = {
        ...updated[activeItemIndex],
        modal_items: modalData,
      };

      return { ...prev, [activeMaterialTypeId]: updated };
    });
    setShowSizeModal(false);
  };

  const closeSizeModal = () => {
    setShowSizeModal(false);
  };

  const handleModalInputChange = (index, field, value) => {
    setModalData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };

      const qty = parseFloat(updated[index].qty) || 0;
      const consumption = parseFloat(updated[index].consumption) || 0;
      const allow = parseFloat(updated[index].allow) || 0;

      // fabric = qty * consumption
      updated[index].fabric = qty * consumption;

      // final_qty = fabric + (allow%)
      updated[index].final_qty =
        updated[index].fabric + (updated[index].fabric * allow) / 100;

      return updated;
    });
  };

  const saveAll = async () => {
    const payload = [];

    Object.keys(consumptionItems).forEach((materialTypeId) => {
      consumptionItems[materialTypeId].forEach((item) => {
        payload.push({
          wo_id: formDataSet.wo_id,
          item_type_id: materialTypeId,
          item_id: item.item_id || null,
          unit: item.unit || "",
          sample_requirement: item.sample_requirement || 0,
          unit_price: item.unit_price || 0,
          supplier_id: item.supplier_id || null,
          lc_term: item.lc_term || "",
          etd: item.etd || "",
          eta: item.eta || "",
          inhouse_date: item.inhouse_date || "",
          remarks: item.remarks || "",
          modal_items: item.modal_items || [],
        });
      });
    });

    try {
      const response = await api.post("/save-consumption", payload);
      if (response.status === 200) {
        alert("Saved Successfully!");
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // const saveAll = async () => {
  //   const payload = [];

  //   Object.keys(consumptionItems).forEach((materialTypeId) => {
  //     consumptionItems[materialTypeId].forEach((item) => {
  //       payload.push({
  //         wo_id: formDataSet.wo_id,
  //         item_type_id: materialTypeId,
  //         item_id: item.item_id,
  //         unit_price: item.unit_price,
  //         total_price: item.total_price,
  //         supplier_id: item.supplier_id,
  //         lc_term: item.lc_term,
  //         etd: item.etd,
  //         eta: item.eta,
  //         inhouse_date: item.inhouse_date,
  //         remarks: item.remarks,
  //         modal_items: item.modal_items || [], // Attach variations
  //       });
  //     });
  //   });

  //   try {
  //     const response = await api.post("/save-consumption", payload);
  //     if (response.status === 200) {
  //       alert("Saved Successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Error saving data:", error);
  //   }
  // };

  const totalGarmentQty = modalData.reduce(
    (sum, row) => sum + (Number(row.qty) || 0),
    0
  );
  const totalFabric = modalData.reduce(
    (sum, row) => sum + (Number(row.fabric) || 0),
    0
  );
  const totalFinalQty = modalData.reduce(
    (sum, row) => sum + (Number(row.final_qty) || 0),
    0
  );
  const totalBookingQty = modalData.reduce(
    (sum, row) => sum + (Number(row.booking_qty) || 0),
    0
  );

  console.log("CONSUMPTION", consumptionItems);

  console.log("VARIATIONS", variations);

  return (
    <div className="render_area">
      {params?.wo_id && params?.costing_item_id ? (
        <FabricBooking />
      ) : (
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
                  <span className="purchase_text">Booking</span>
                </div>
                <div className="col-lg-2"></div>
                <div className="col-lg-2"></div>

                <div className="col-lg-2">
                  <label className="form-label">WO Number</label>
                </div>
                <div className="col-lg-2">
                  <CustomSelect
                    className="select_wo"
                    placeholder="WO"
                    options={workOrders.map(({ id, wo_number }) => ({
                      value: id,
                      label: wo_number,
                    }))}
                    onChange={(selectedOption) =>
                      handleInputChange("wo_id", selectedOption.value)
                    }
                    name="wo_id"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-2">
              <button
                onClick={saveAll}
                className="btn btn-default submit_button"
              >
                {" "}
                Submit{" "}
              </button>
            </div>
          </div>
          <br />
          <div className="create_tp_body">
            <div className="row">
              <div className="col-lg-2">
                <label className="form-label"> WO Del Date</label>
              </div>
              <div className="col-lg-3">
                <div className="form-value">{formDataSet.wo_delivery_date}</div>
              </div>
              <div className="col-lg-2">
                <label className="form-label">Tech Pack#</label>
              </div>
              <div className="col-lg-5">
                <div className="form-value">
                  {formDataSet.techpack?.techpack_number || "-"}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-2">
                <label className="form-label">Buyer</label>
              </div>
              <div className="col-lg-3">
                <div className="form-value">
                  {formDataSet.techpack?.buyer?.name || "-"}
                </div>
              </div>
              <div className="col-lg-2">
                <label className="form-label">Buyer Style Name</label>
              </div>
              <div className="col-lg-5">
                <div className="form-value">
                  {formDataSet.techpack?.buyer_style_name || "-"}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-2">
                <label className="form-label">Brand</label>
              </div>
              <div className="col-lg-3">
                <div className="form-value">
                  {formDataSet.techpack?.brand || "-"}
                </div>
              </div>
              <div className="col-lg-2">
                <label className="form-label">Item Name</label>
              </div>
              <div className="col-lg-5">
                <div className="form-value">
                  {" "}
                  {formDataSet.techpack?.item_name || "-"}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-2">
                <label className="form-label">Season</label>
              </div>
              <div className="col-lg-3">
                <div className="form-value">
                  {" "}
                  {formDataSet.techpack?.season || "-"}
                </div>
              </div>
              <div className="col-lg-2">
                <label className="form-label">Item Type</label>
              </div>
              <div className="col-lg-5">
                <div className="form-value">
                  {" "}
                  {formDataSet.techpack?.item_type || "-"}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-2">
                <label className="form-label">Department</label>
              </div>
              <div className="col-lg-3">
                <div className="form-value">
                  {" "}
                  {formDataSet.techpack?.department || "-"}
                </div>
              </div>
              <div className="col-lg-2">
                <label className="form-label">Description</label>
              </div>
              <div className="col-lg-5">
                <div className="form-value">
                  {formDataSet.techpack?.description || "-"}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-2">
                <label className="form-label">Factory</label>
              </div>
              <div className="col-lg-3">
                <div className="form-value">
                  {formDataSet.techpack?.company?.nickname || "-"}
                </div>
              </div>
              <div className="col-lg-2">
                <label className="form-label">Wash Detail</label>
              </div>
              <div className="col-lg-5">
                <div className="form-value">
                  {formDataSet.techpack?.wash_details || "-"}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-2">
                <label className="form-label">WO Quantity</label>
              </div>
              <div className="col-lg-3">
                <div className="form-value">
                  <div className="form-value">
                    {(
                      formDataSet.pos?.reduce((poAcc, po) => {
                        const poTotal =
                          po.items?.reduce((itemAcc, item) => {
                            return itemAcc + (parseInt(item.qty) || 0);
                          }, 0) || 0;

                        return poAcc + poTotal;
                      }, 0) || 0
                    ).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="col-lg-2">
                <label className="form-label">Special Operation</label>
              </div>
              <div className="col-lg-5">
                <div className="form-value">
                  {(() => {
                    try {
                      const ops = JSON.parse(
                        formDataSet.techpack?.special_operation
                      );
                      return Array.isArray(ops) ? ops.join(", ") : "";
                    } catch {
                      return "";
                    }
                  })()}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-2">
                <label className="form-label">Po</label>
              </div>
              <div className="col-lg-10">
                <div className="form-value">
                  {formDataSet.pos?.map((item, index) => (
                    <Link to={"/purchase-orders/" + item.id} key={index}>
                      {item.po_number}
                      {index !== formDataSet.pos.length - 1 ? ", " : ""}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <br />
          <div className="create_tp_materials_area create_tp_body">
            <div className="d-flex justify-content-between">
              <h6>Color Wise Size Breakdown</h6>
            </div>

            {formDataSet.pos?.length > 0 ? (
              (() => {
                // Step 1: Collect items from all POs
                const allItems = formDataSet.pos.flatMap(
                  (po) => po.items || []
                );
                // Step 2: Collect sizes with qty > 0
                const sizeSet = new Set();
                allItems.forEach((item) => {
                  if (item.qty > 0) {
                    sizeSet.add(item.size);
                  }
                });
                const displaySizes = Array.from(sizeSet);

                // Step 3: Group by color and accumulate size-wise quantities
                const colorMap = {}; // { color: { total, sizes: { size: qty } } }
                allItems.forEach(({ color, size, qty }) => {
                  if (qty <= 0) return;
                  if (!colorMap[color]) {
                    colorMap[color] = { total: 0, sizes: {} };
                  }
                  colorMap[color].total += qty;
                  colorMap[color].sizes[size] =
                    (colorMap[color].sizes[size] || 0) + qty;
                });

                // Step 4: Calculate grand totals
                let grandTotalQty = 0;
                const grandSizeTotals = {};
                displaySizes.forEach((size) => {
                  grandSizeTotals[size] = 0;
                });

                const colorEntries = Object.entries(colorMap);

                return (
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Color</th>
                        <th>Total</th>
                        {displaySizes.map((size) => (
                          <th key={size}>{size}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {colorEntries.map(([color, details], index) => {
                        grandTotalQty += details.total;
                        displaySizes.forEach((size) => {
                          grandSizeTotals[size] += details.sizes[size] || 0;
                        });

                        return (
                          <tr key={color}>
                            <td>{index + 1}</td>
                            <td>{color}</td>
                            <td>{details.total}</td>
                            {displaySizes.map((size) => (
                              <td key={size}>{details.sizes[size] || ""}</td>
                            ))}
                          </tr>
                        );
                      })}

                      {/* Grand Total Row */}
                      <tr className="bg-light">
                        <td colSpan={2}>
                          <strong>Grand Total</strong>
                        </td>
                        <td>
                          <strong>{grandTotalQty}</strong>
                        </td>
                        {displaySizes.map((size) => (
                          <td key={`grand-${size}`}>
                            {grandSizeTotals[size] > 0 ? (
                              <strong>{grandSizeTotals[size]}</strong>
                            ) : (
                              ""
                            )}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                );
              })()
            ) : (
              <p>No PO is associated to this WorkOrder</p>
            )}
          </div>
          <br />
          <div className="create_tp_materials_area create_tp_body">
            <h6>Material Descriptions</h6>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead style={{ verticalAlign: "middle" }}>
                  <tr>
                    <th>SL</th>
                    <th>Item Name</th>
                    <th>Variations</th>
                    <th>Garment Qty</th>
                    <th>WO Required Qty. (allow included)</th>
                    <th>Actual Booking</th>
                    <th>Actual %</th>
                    <th>PP Sample Requirement</th>
                    <th>Unit</th>
                    <th>Unit Price (Unit)</th>
                    <th>Total Price</th>
                    <th>Supplier</th>
                    <th>LC Term</th>
                    <th>ETD</th>
                    <th>ETA</th>
                    <th>EID</th>
                    <th>Remarks</th>
                  </tr>
                </thead>

                <tbody>
                  {materialTypes.map((materialType) => {
                    // Skip rendering if title is "CM"
                    if (materialType.title !== "Fabric") return null;

                    return (
                      <React.Fragment key={materialType.id}>
                        <tr>
                          <td
                            colSpan={23}
                            style={{
                              background: "#ECECEC",
                              cursor: "pointer",
                              height: "20px",
                            }}
                          >
                            <div
                              className="materialType"
                              style={{
                                padding: "0 5px",
                                display: "flex",
                                gap: "5px",
                                alignItems: "center",
                                fontSize: "12px",
                              }}
                            >
                              {materialType.title}
                            </div>
                          </td>
                        </tr>

                        {/* items */}
                        {(consumptionItems[materialType.id] || []).map(
                          (item, index) => (
                            <tr key={`${materialType.id}-${index}`}>
                              <td>{index + 1}</td>
                              {/* Item Name */}
                              <td>
                                <input
                                  style={{ width: "150px" }}
                                  type="text"
                                  value={item.material?.title}
                                />
                              </td>

                              <td>
                                <button
                                  onClick={() =>
                                    openSizeModal(index, item, materialType.id)
                                  }
                                  className="btn btn-info btn-sm"
                                >
                                  Set
                                </button>
                              </td>

                              {/* Garment Qty */}
                              <td>
                                <input
                                  style={{ width: "80px" }}
                                  type="number"
                                  min="0"
                                  value={totalGarmentQty}
                                  readOnly
                                />
                              </td>
                              {/* WO Required Qty (read-only, calculated) */}
                              <td>
                                <input
                                  style={{ width: "80px" }}
                                  type="number"
                                  min="0"
                                  readOnly
                                  value={totalFinalQty}
                                />
                              </td>

                              {/* Actual Booking */}
                              <td>
                                <input
                                  style={{ width: "80px" }}
                                  type="number"
                                  min="0"
                                  value={totalBookingQty}
                                  readOnly
                                />
                              </td>

                              {/* Actual % (read-only) */}
                              <td>
                                <input
                                  style={{ width: "80px" }}
                                  type="number"
                                  readOnly
                                  value={item.actual_percent ?? ""}
                                />
                              </td>

                              {/* PP Sample Requirement */}
                              <td>
                                <input
                                  type="number"
                                  min="0"
                                  value={item.sample_requirement ?? ""}
                                  onChange={(e) =>
                                    handleItemChange(
                                      materialType.id,
                                      index,
                                      "sample_requirement",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>

                              {/* Unit */}
                              <td>
                                <select
                                  onChange={(e) =>
                                    handleItemChange(
                                      materialType.id,
                                      index,
                                      "unit",
                                      e.target.value
                                    )
                                  }
                                  style={{ width: "70px" }}
                                  className="form-control form-value"
                                >
                                  <option value="YDS">YDS</option>
                                  <option value="MTR">MTR</option>
                                  <option value="KG">KG</option>
                                </select>
                              </td>

                              {/* Unit Price */}
                              <td>
                                <input
                                  style={{ width: "100px" }}
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.unit_price ?? ""}
                                  onChange={(e) =>
                                    handleItemChange(
                                      materialType.id,
                                      index,
                                      "unit_price",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>

                              {/* Total Price (read-only) */}
                              <td>
                                <input
                                  style={{ width: "100px" }}
                                  type="number"
                                  min="0"
                                  readOnly
                                  value={item.total_price ?? ""}
                                />
                              </td>

                              {/* Supplier */}
                              <td>
                                <CustomSelect
                                  className="select_wo"
                                  placeholder="Select Supplier"
                                  options={suppliers.map(
                                    ({ id, company_name }) => ({
                                      value: id,
                                      label: company_name,
                                    })
                                  )}
                                  value={suppliers
                                    .map(({ id, company_name }) => ({
                                      value: id,
                                      label: company_name,
                                    }))
                                    .find(
                                      (option) =>
                                        option.value === item.supplier_id
                                    )}
                                  onChange={(selectedOption) =>
                                    handleItemChange(
                                      materialType.id,
                                      index,
                                      "supplier_id",
                                      selectedOption?.value
                                    )
                                  }
                                />
                              </td>

                              {/* LC Term */}
                              <td>
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
                                      .find(
                                        (opt) => opt.value === item.lc_term
                                      ) || null
                                  }
                                  onChange={(selectedOption) =>
                                    handleItemChange(
                                      materialType.id,
                                      index,
                                      "lc_term",
                                      selectedOption?.value
                                    )
                                  }
                                />
                              </td>

                              {/* ETD */}
                              <td>
                                <input
                                  type="date"
                                  value={item.etd ?? ""}
                                  onChange={(e) =>
                                    handleItemChange(
                                      materialType.id,
                                      index,
                                      "etd",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>

                              {/* ETA */}
                              <td>
                                <input
                                  type="date"
                                  value={item.eta ?? ""}
                                  onChange={(e) =>
                                    handleItemChange(
                                      materialType.id,
                                      index,
                                      "eta",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>

                              {/* EID / In-house date */}
                              <td>
                                <input
                                  type="date"
                                  value={item.inhouse_date ?? ""}
                                  onChange={(e) =>
                                    handleItemChange(
                                      materialType.id,
                                      index,
                                      "inhouse_date",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>

                              {/* Remarks */}
                              <td>
                                <input
                                  style={{ width: "100px" }}
                                  type="text"
                                  value={item.remarks ?? ""}
                                  onChange={(e) =>
                                    handleItemChange(
                                      materialType.id,
                                      index,
                                      "remarks",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                            </tr>
                          )
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
              <Modal show={showSizeModal} size="xl" onHide={closeSizeModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Shell Fabric </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="row">
                    {variations.length > 0 && (
                      <div className="table-responsive mt-3">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Garment Color</th>
                              <th>Range</th>
                              <th>Fabric Code Or Reference No. & Color name</th>
                              <th>Fabric Details</th>
                              <th>Width</th>
                              <th>Consumption</th>
                              <th>Garment QTY</th>
                              <th>Fabric</th>
                              <th>Allow %</th>
                              <th>Final</th>
                              <th>Booking QTY</th>
                            </tr>
                          </thead>
                          <tbody>
                            {modalData.map((item, index) => (
                              <tr key={index}>
                                <td>{item.garment_color}</td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={item.range}
                                    onChange={(e) =>
                                      handleModalInputChange(
                                        index,
                                        "range",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={item.fabric_code}
                                    onChange={(e) =>
                                      handleModalInputChange(
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
                                      handleModalInputChange(
                                        index,
                                        "item_details",
                                        e.target.value
                                      )
                                    }
                                    className="form-area form-control"
                                    value={item.item_details || ""}
                                  />
                                </td>

                                <td>
                                  <input
                                    className="form-control"
                                    value={item.width}
                                    onChange={(e) =>
                                      handleModalInputChange(
                                        index,
                                        "width",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="number"
                                    value={item.consumption}
                                    onChange={(e) =>
                                      handleModalInputChange(
                                        index,
                                        "consumption",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="number"
                                    value={item.qty}
                                    readOnly
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="number"
                                    value={item.fabric.toFixed(2)}
                                    readOnly
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="number"
                                    value={item.allow}
                                    onChange={(e) =>
                                      handleModalInputChange(
                                        index,
                                        "allow",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="number"
                                    value={item.final_qty.toFixed(2)}
                                    readOnly
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="number"
                                    value={item.booking_qty}
                                    onChange={(e) =>
                                      handleModalInputChange(
                                        index,
                                        "booking_qty",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td
                                colSpan="6"
                                style={{
                                  textAlign: "right",
                                  fontWeight: "bold",
                                }}
                              >
                                Total:
                              </td>

                              <td>{totalGarmentQty.toFixed(2)}</td>
                              <td>{totalFabric.toFixed(2)}</td>
                              <td></td>
                              <td>{totalFinalQty.toFixed(2)}</td>
                              <td>{totalBookingQty.toFixed(2)}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    )}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={closeSizeModal}>
                    Close
                  </Button>
                  <Button onClick={saveModalData} variant="primary">
                    Save
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
