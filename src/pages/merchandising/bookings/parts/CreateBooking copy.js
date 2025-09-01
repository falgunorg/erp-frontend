import React, { useState, useEffect } from "react";
import Logo from "assets/images/logos/logo-short.png";
import api from "services/api";
import CustomSelect from "elements/CustomSelect";
import { useHistory, Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

export default function CreateBooking({ setRenderArea }) {
  const history = useHistory();

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

  const [items, setItems] = useState([]);
  const getItems = async () => {
    setSpinner(true);
    var response = await api.post("/items");
    if (response.status === 200 && response.data) {
      setItems(response.data.data);
    }
    setSpinner(false);
  };

  const [units, setUnits] = useState([]);
  const getUnits = async () => {
    setSpinner(true);
    var response = await api.post("/common/units");
    if (response.status === 200 && response.data) {
      setUnits(response.data.data);
    }
    setSpinner(false);
  };

  const [sizes, setSizes] = useState([]);
  const getSizes = async () => {
    setSpinner(true);
    var response = await api.post("/common/sizes");
    if (response.status === 200 && response.data) {
      setSizes(response.data.data);
    }
    setSpinner(false);
  };

  const [colors, setColors] = useState([]);
  const getColors = async () => {
    setSpinner(true);
    var response = await api.post("/common/colors");
    if (response.status === 200 && response.data) {
      setColors(response.data.data);
    }
    setSpinner(false);
  };

  const [workOrders, setWorkOrders] = useState([]);
  const getWorkOrders = async () => {
    const response = await api.post("/public-workorders");
    if (response.status === 200 && response.data) {
      const data = response.data.data;
      setWorkOrders(data);
    }
  };

  const [suppliers, setSuppliers] = useState([]);
  const getSuppliers = async () => {
    setSpinner(true);
    var response = await api.post("/suppliers");
    if (response.status === 200 && response.data) {
      setSuppliers(response.data.data);
    }
    setSpinner(false);
  };

  useEffect(() => {
    getItems();
    getSizes();
    getColors();
    getUnits();
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
  console.log("Variations", variations);

  const handleInputChange = async (name, value) => {
    if (name === "wo_id") {
      try {
        const response = await api.post("/workorder-details-for-booking", {
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

          const groupedItems = groupMaterialsByItemType(
            data.costing?.items || []
          );
          setConsumptionItems(groupedItems);

          const allItems = data.pos.flatMap((po) => po.items || []);
          const groupedVariations = Object.values(
            allItems.reduce((acc, item) => {
              const key = `${item.color}-${item.size}`;
              if (!acc[key]) {
                acc[key] = { color: item.color, size: item.size, qty: 0 };
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
        wastage: item.wastage || 0,
        total: item.total || "",
        unit_price: item.unit_price || "",
        total_price: item.total_price || "",
      });

      return acc;
    }, {});
  };

  console.log("TECKPACK", formDataSet.techpack);

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

  const validateForm = () => {
    let formErrors = {};

    if (!formDataSet.wo_delivery_date) {
      formErrors.wo_delivery_date = "Received date is required";
    }
    if (!formDataSet.techpack_number) {
      formErrors.techpack_number = "Techpack Number is required";
    }
    if (!formDataSet.buyer_id) {
      formErrors.buyer_id = "Buyer is required";
    }
    if (!formDataSet.buyer_style_name) {
      formErrors.buyer_style_name = "Buyer style name is required";
    }

    if (!formDataSet.brand) {
      formErrors.brand = "Brand is required";
    }
    if (!formDataSet.item_name) {
      formErrors.item_name = "Item name is required";
    }
    if (!formDataSet.season) {
      formErrors.season = "Season is required";
    }
    if (!formDataSet.item_type) {
      formErrors.item_type = "Item type is required";
    }

    if (!formDataSet.department) {
      formErrors.department = "Department is required";
    }
    if (!formDataSet.company_id) {
      formErrors.company_id = "Company is required";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const data = new FormData();

      // Append form data safely
      data.append("technical_package_id", formDataSet.technical_package_id);
      data.append("wo_id", formDataSet.wo_id);
      data.append("wo_delivery_date", formDataSet.wo_delivery_date);
      data.append("wo_qty", formDataSet.wo_qty);

      setSpinner(true);
      const response = await api.post("/technical-package-create", data);

      if (response.status === 200 && response.data) {
        history.push("/merchandising/bookings/" + response.data.techpack.id);
        setRenderArea("details");
        window.location.reload();
      } else {
        setErrors(response.data.errors);
      }
    }
  };

  const [showSizeModal, setShowSizeModal] = useState(false);
  const openSizeModal = () => {
    setShowSizeModal(true);
  };
  const closeSizeModal = () => {
    setShowSizeModal(false);
  };

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
            onClick={handleSubmit}
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
            const allItems = formDataSet.pos.flatMap((po) => po.items || []);
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
                <th>Item Details</th>
                <th>Fabric Code Or Reference No. & Color name</th>
                <th>Garment Color</th>
                <th>Width</th>
                <th>Size</th>
                <th>Garment Qty.</th>
                <th>Consumption</th>
                <th>Allow %</th>
                <th>WO Required Qty. (allow included)</th>
                <th>Actual Booking</th>
                <th>Actual %</th>
                <th>PP Sample Requirement</th>
                <th>Unit</th>
                <th>Unit Price Yds/Kg</th>
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
                if (materialType.title === "CM") return null;

                return (
                  <React.Fragment key={materialType.id}>
                    {/* Material type header */}
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
                            <CustomSelect
                              style={{ width: "100%" }}
                              className="select_wo"
                              placeholder="Select Item"
                              options={items
                                .filter(
                                  (it) => it.item_type_id === materialType.id
                                )
                                .map(({ id, title }) => ({
                                  value: id,
                                  label: title,
                                }))}
                              value={
                                items
                                  .filter(
                                    (it) => it.item_type_id === materialType.id
                                  )
                                  .map(({ id, title }) => ({
                                    value: id,
                                    label: title,
                                  }))
                                  .find((opt) => opt.value === item.item_id) ||
                                null
                              }
                              onChange={(selectedOption) =>
                                handleItemChange(
                                  materialType.id,
                                  index,
                                  "item_id",
                                  selectedOption?.value
                                )
                              }
                            />
                          </td>

                          {/* Item Details */}
                          <td>
                            <textarea
                              style={{ minWidth: "150px" }}
                              value={item.item_details || ""}
                              onChange={(e) =>
                                handleItemChange(
                                  materialType.id,
                                  index,
                                  "item_details",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          {/* Fabric Code */}
                          <td>
                            <input
                              type="text"
                              style={{ width: "100px" }}
                              value={item.fabric_code || ""}
                              onChange={(e) =>
                                handleItemChange(
                                  materialType.id,
                                  index,
                                  "fabric_code",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          {/* Garment Color */}
                          <td>
                            <CustomSelect
                              className="select_wo"
                              placeholder="Color"
                              options={colors.map(({ title }) => ({
                                value: title,
                                label: title,
                              }))}
                              value={
                                colors
                                  .map(({ title }) => ({
                                    value: title,
                                    label: title,
                                  }))
                                  .find((opt) => opt.value === item.color) ||
                                null
                              }
                              onChange={(selectedOption) =>
                                handleItemChange(
                                  materialType.id,
                                  index,
                                  "color",
                                  selectedOption?.value
                                )
                              }
                            />
                          </td>

                          {/* Width */}
                          <td>
                            <input
                              style={{ width: "100px" }}
                              type="text"
                              value={item.width || ""}
                              onChange={(e) =>
                                handleItemChange(
                                  materialType.id,
                                  index,
                                  "width",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          {/* Size */}
                          <td>
                            <button
                              onClick={() => openSizeModal(index)}
                              style={{ minWidth: "100px" }}
                              className="btn btn-info"
                            >
                              Set Size
                            </button>
                          </td>

                          {/* Garment Qty */}
                          <td>
                            <input
                              style={{ width: "80px" }}
                              type="number"
                              min="0"
                              value={item.qty ?? ""}
                              onChange={(e) =>
                                handleItemChange(
                                  materialType.id,
                                  index,
                                  "qty",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          {/* Consumption */}
                          <td>
                            <input
                              style={{ width: "70px" }}
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.consumption ?? ""}
                              onChange={(e) =>
                                handleItemChange(
                                  materialType.id,
                                  index,
                                  "consumption",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          {/* Allow % */}
                          <td>
                            <input
                              style={{ width: "60px" }}
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.allow_percent ?? ""}
                              onChange={(e) =>
                                handleItemChange(
                                  materialType.id,
                                  index,
                                  "allow_percent",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          {/* WO Required Qty (read-only, calculated) */}
                          <td>
                            <input
                              style={{ width: "80px" }}
                              type="number"
                              min="0"
                              readOnly
                              value={item.wo_required_qty ?? ""}
                            />
                          </td>

                          {/* Actual Booking */}
                          <td>
                            <input
                              style={{ width: "80px" }}
                              type="number"
                              min="0"
                              value={item.actual_booking ?? ""}
                              onChange={(e) =>
                                handleItemChange(
                                  materialType.id,
                                  index,
                                  "actual_booking",
                                  e.target.value
                                )
                              }
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
                            <CustomSelect
                              className="select_wo"
                              placeholder="Unit"
                              options={units.map(({ title }) => ({
                                value: title,
                                label: title,
                              }))}
                              value={
                                units
                                  .map(({ title }) => ({
                                    value: title,
                                    label: title,
                                  }))
                                  .find((opt) => opt.value === item.unit) ||
                                null
                              }
                              onChange={(selectedOption) =>
                                handleItemChange(
                                  materialType.id,
                                  index,
                                  "unit",
                                  selectedOption?.value
                                )
                              }
                            />
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
                                  (option) => option.value === item.supplier_id
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
                                  .find((opt) => opt.value === item.lc_term) ||
                                null
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
        </div>
      </div>

      <Modal show={showSizeModal} onHide={closeSizeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Size Selection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            {variations.length > 0 && (
              <div className="table-responsive mt-3">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Color</th>
                      <th>Garment Size</th>
                      <th>Garment Qty</th>
                      <th>Material Size</th>
                      <th>Material Code/Ref</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variations.map((item, index) => (
                      <tr key={index}>
                        <td>{item.color}</td>
                        <td>{item.size}</td>
                        <td>{item.qty}</td>
                        <td>
                          <input className="form-control" type="text" />
                        </td>
                        <td>
                          <input className="form-control" type="text" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeSizeModal}>
            Close
          </Button>
          <Button variant="primary">Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
