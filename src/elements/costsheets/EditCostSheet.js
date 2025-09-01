import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logos/logo-short.png";
import api from "services/api";
import swal from "sweetalert";
import CustomSelect from "elements/CustomSelect";
import { ArrowRightIcon, ArrowDownIcon } from "../../elements/SvgIcons";
import { useParams, useHistory } from "react-router-dom";

export default function EditCostSheet({ renderArea, setRenderArea }) {
  const params = useParams();
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);

  const [itemTypes, setItemTypes] = useState([]);

  const getItemTypes = async () => {
    setSpinner(true);
    var response = await api.post("/item-types");
    if (response.status === 200 && response.data) {
      setItemTypes(response.data.data);
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
    getItemTypes();
    getSuppliers();
  }, []);

  const [collapsedItemTypes, setCollapsedItemTypes] = useState({}); // Track collapsed state

  const toggleItemType = (itemTypeId) => {
    setCollapsedItemTypes((prev) => ({
      ...prev,
      [itemTypeId]: !prev[itemTypeId], // Toggle collapse state
    }));
  };

  const [consumptionItems, setConsumptionItems] = useState([]);

  // Function to remove row
  const removeRow = (itemTypeId, index) => {
    setConsumptionItems((prevItems) => {
      const updatedItemTypeItems = [...(prevItems[itemTypeId] || [])];
      updatedItemTypeItems.splice(index, 1);
      return { ...prevItems, [itemTypeId]: updatedItemTypeItems };
    });
  };

  // Function to add a row within the respective itemType
  const addRow = (itemTypeId) => {
    const newItem = {
      item_type_id: itemTypeId,
      item_id: "",
      item_name: "",
      item_details: "",
      color: "",
      size: "",
      unit: "",
      position: "",
      supplier_id: "",
      consumption: "",
      wastage: 0,
      total: "",
      unit_price: "",
      total_price: "",
    };

    setConsumptionItems((prevItems) => ({
      ...prevItems,
      [itemTypeId]: [...(prevItems[itemTypeId] || []), newItem],
    }));
  };

  // Function to handle changes in an item
  const handleItemChange = (itemTypeId, index, field, value) => {
    setConsumptionItems((prevItems) => {
      const updatedItemTypeItems = [...(prevItems[itemTypeId] || [])];
      const currentItem = {
        ...updatedItemTypeItems[index],
        [field]: value,
      };

      const itemType = itemTypes.find((it) => it.id === itemTypeId);
      const isCMType = itemType?.title === "CM";

      if (!isCMType) {
        const consumption = parseFloat(currentItem.consumption) || 0;
        const wastagePercentage = parseFloat(currentItem.wastage) || 0;
        const unitPrice = parseFloat(currentItem.unit_price) || 0;
        const consTotal = consumption + (consumption * wastagePercentage) / 100;
        currentItem.total = consTotal.toFixed(2);
        const totalPrice = consTotal * unitPrice;
        currentItem.total_price = totalPrice.toFixed(2);
      }

      updatedItemTypeItems[index] = currentItem;
      return {
        ...prevItems,
        [itemTypeId]: updatedItemTypeItems,
      };
    });
  };

  const getGroupTotalPrice = (itemTypeId) => {
    const items = consumptionItems[itemTypeId] || [];
    return items
      .reduce((sum, item) => {
        const totalPrice = parseFloat(item.total_price) || 0;
        return sum + totalPrice;
      }, 0)
      .toFixed(2);
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

  useEffect(() => {
    const allItems = Object.values(consumptionItems).flat();

    // Calculate total FOB
    const totalFob = allItems.reduce((sum, item) => {
      const totalPrice = parseFloat(item.total_price) || 0;
      return sum + totalPrice;
    }, 0);

    // Get CM item_type_id(s)
    const cmItemTypeIds = itemTypes
      .filter((type) => type.title === "CM")
      .map((type) => type.id);

    // Filter CM items and calculate total CM
    const totalCM = allItems
      .filter((item) => cmItemTypeIds.includes(item.item_type_id))
      .reduce((sum, item) => {
        const totalPrice = parseFloat(item.total_price) || 0;
        return sum + totalPrice;
      }, 0);

    // Set both values
    setFormData((prev) => ({
      ...prev,
      fob: totalFob.toFixed(2),
      cm: totalCM.toFixed(2),
    }));
  }, [consumptionItems, itemTypes]);
  const [formData, setFormData] = useState({
    technical_package_id: "",
    factory_cpm: "",
    fob: 0,
    cm: 0,
  });

  const handleFormChange = async (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [errors, setErrors] = useState({});
  const validateForm = () => {
    let formErrors = {};
    if (!formData.fob) {
      formErrors.fob = "fob is required";
    }
    if (!formData.cm) {
      formErrors.cm = "CM is required";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const tp_items = Object.values(consumptionItems).flat();
    if (tp_items.length === 0) {
      swal({
        title: "Please Select items",
        icon: "error",
      });
      return; // Prevent form submission
    }

    if (validateForm()) {
      var data = new FormData();
      data.append("id", formData.id);
      data.append("costing_items", JSON.stringify(tp_items));
      data.append("cm", formData.cm);
      data.append("factory_cpm", formData.factory_cpm);
      data.append("fob", formData.fob);
      setSpinner(true);
      var response = await api.post("/costings-update", data);
      if (response.status === 200 && response.data) {
        history.push("/cost-sheets/" + response.data.data.id);
        setRenderArea("details");
         window.location.reload();
      } else {
        setErrors(response.data.errors);
      }
      setSpinner(false);
    }
  };

  const [costing, setCosting] = useState({});
  const getCosting = async () => {
    setSpinner(true);
    const response = await api.post("/costings-show", { id: params.id });
    if (response.status === 200 && response.data) {
      const costingData = response.data.data;
      setCosting(costingData);
      setFormData(costingData);

      // Group items by item_type_id
      const groupedItems = {};
      for (const item of costingData.items) {
        if (!groupedItems[item.item_type_id]) {
          groupedItems[item.item_type_id] = [];
        }

        groupedItems[item.item_type_id].push({
          ...item,
        });
      }
      setConsumptionItems(groupedItems);
    }
    setSpinner(false);
  };
  useEffect(() => {
    getCosting();
  }, [params.id]);

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
              <span className="purchase_text">Edit Cost Sheet</span>
            </div>
            <div className="col-lg-2">
              <label className="form-label">PO Number</label>
            </div>
            <div className="col-lg-2">
              <input disabled type="text" />
            </div>
            <div className="col-lg-2">
              <label className="form-label">WO Number</label>
            </div>
            <div className="col-lg-2">
              <input disabled type="text" />
            </div>
          </div>
        </div>
        <div className="col-lg-2">
          <button
            onClick={handleSubmit}
            className="btn btn-default submit_button"
          >
            {" "}
            Update{" "}
          </button>
        </div>
      </div>
      <br />
      <div className="row create_tp_body">
        <div className="col-lg-12">
          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Tech Pack#</label>
            </div>
            <div className="col-lg-3">
              <input
                readOnly
                type="text"
                value={costing.techpack?.techpack_number}
              />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Buyer</label>
            </div>
            <div className="col-lg-5">
              <input
                readOnly
                type="text"
                value={costing.techpack?.buyer?.name}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Brand</label>
            </div>
            <div className="col-lg-3">
              <input readOnly type="text" value={costing.techpack?.brand} />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Buyer Style Name</label>
            </div>
            <div className="col-lg-5">
              <input
                readOnly
                type="text"
                value={costing.techpack?.buyer_style_name}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Season</label>
            </div>
            <div className="col-lg-3">
              <input readOnly type="text" value={costing.techpack?.season} />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Name</label>
            </div>
            <div className="col-lg-5">
              <input readOnly type="text" value={costing.techpack?.item_name} />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Department</label>
            </div>
            <div className="col-lg-3">
              <input
                readOnly
                type="text"
                value={costing.techpack?.department}
              />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Type</label>
            </div>
            <div className="col-lg-5">
              <input readOnly type="text" value={costing.techpack?.item_type} />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Factory CPM/Eft</label>
            </div>
            <div className="col-lg-3">
              <input
                readOnly
                className={errors.factory_cpm ? "red-border" : ""}
                type="text"
                value={formData.factory_cpm}
              />
            </div>

            <div className="col-lg-2">
              <label className="form-label">Description</label>
            </div>
            <div className="col-lg-5">
              <input
                readOnly
                type="text"
                value={costing.techpack?.description}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">FOB</label>
            </div>
            <div className="col-lg-3">
              <input
                className={errors.fob ? "red-border" : ""}
                type="number"
                readOnly
                min={0}
                step={0.1}
                value={formData.fob}
              />
            </div>

            <div className="col-lg-2">
              <label className="form-label">Wash Detail</label>
            </div>
            <div className="col-lg-5">
              <input
                readOnly
                type="text"
                value={costing.techpack?.wash_details}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">CM</label>
            </div>
            <div className="col-lg-3">
              <input
                className={errors.cm ? "red-border" : ""}
                onChange={(e) => handleFormChange("cm", e.target.value)}
                type="number"
                min={0}
                step={0.1}
                value={formData.cm}
                readOnly
              />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Special Operation</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {(() => {
                  try {
                    const ops = JSON.parse(costing.techpack?.special_operation);
                    return Array.isArray(ops) ? ops.join(", ") : "";
                  } catch {
                    return "";
                  }
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="create_tp_materials_area create_tp_body">
        <h6>Material Descriptions</h6>

        <div className="table-responsive">
          <table className="table table-bordered">
            <thead style={{ verticalAlign: "middle" }}>
              <tr>
                <th>Item Type</th>
                <th>Item Name</th>
                <th>Item Details</th>
                <th>Color</th>
                <th>Size</th>
                <th>Position</th>
                <th>Supplier</th>
                <th>Unit</th>
                <th>Consmp</th>
                <th>Wstg %</th>
                <th>Total</th>
                <th>Unit Price</th>
                <th>Price Total</th>
              </tr>
            </thead>
            <tbody>
              {itemTypes.map((itemType) => {
                const isCMType = itemType.title === "CM";

                return (
                  <React.Fragment key={itemType.id}>
                    <tr>
                      <td
                        colSpan={13}
                        style={{
                          background: "#ECECEC",
                          cursor: "pointer",
                          height: "20px",
                        }}
                      >
                        <div
                          className="itemType"
                          style={{
                            padding: "0 5px",
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "5px",
                            alignItems: "center",
                            fontSize: "12px",
                          }}
                        >
                          <div>
                            <span
                              onClick={() => toggleItemType(itemType.id)}
                              style={{ cursor: "pointer" }}
                            >
                              {collapsedItemTypes[itemType.id] ? (
                                <ArrowRightIcon />
                              ) : (
                                <ArrowDownIcon />
                              )}
                            </span>{" "}
                            <span
                              onClick={() => toggleItemType(itemType.id)}
                              className="me-2"
                            >
                              <strong>{itemType.title}</strong>
                            </span>
                            {isCMType && (
                              <span
                                onClick={() => addRow(itemType.id)}
                                style={{
                                  background: "#f1a655",
                                  height: "17px",
                                  width: "17px",
                                  borderRadius: "50%",
                                  textAlign: "center",
                                  lineHeight: "17px",
                                  fontSize: "11px",
                                  color: "white",
                                  display: "inline-block",
                                }}
                              >
                                <i className="fa fa-plus"></i>
                              </span>
                            )}
                          </div>
                          <div>
                            <strong>$ {getGroupTotalPrice(itemType.id)}</strong>
                          </div>
                        </div>
                      </td>
                    </tr>

                    {!collapsedItemTypes[itemType.id] &&
                      (consumptionItems[itemType.id] || []).map(
                        (item, index) => (
                          <tr key={`${itemType.id}-${index}`}>
                            {/* item_id (always shown) */}
                            <td>
                              <CustomSelect
                                style={{ width: "100px" }}
                                className="select_wo"
                                placeholder="Item"
                                options={items
                                  .filter(
                                    (it) => it.item_type_id === itemType.id
                                  )
                                  .map(({ id, title }) => ({
                                    value: id,
                                    label: title,
                                  }))}
                                value={items
                                  .filter(
                                    (it) => it.item_type_id === itemType.id
                                  )
                                  .map(({ id, title }) => ({
                                    value: id,
                                    label: title,
                                  }))
                                  .find(
                                    (option) =>
                                      option.value ===
                                      (consumptionItems[itemType.id]?.[index]
                                        ?.item_id || null)
                                  )}
                                onChange={(selectedOption) =>
                                  handleItemChange(
                                    itemType.id,
                                    index,
                                    "item_id",
                                    selectedOption?.value
                                  )
                                }
                              />
                            </td>

                            {!isCMType ? (
                              <>
                                <td>
                                  <input
                                    style={{ width: "100px" }}
                                    type="text"
                                    value={item.item_name}
                                    onChange={(e) =>
                                      handleItemChange(
                                        itemType.id,
                                        index,
                                        "item_name",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>

                                <td>
                                  <textarea
                                    style={{ width: "100px" }}
                                    value={item.item_details}
                                    onChange={(e) =>
                                      handleItemChange(
                                        itemType.id,
                                        index,
                                        "item_details",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>

                                <td>
                                  <CustomSelect
                                    className="select_wo"
                                    placeholder="Color"
                                    options={colors.map(({ title }) => ({
                                      value: title,
                                      label: title,
                                    }))}
                                    value={colors
                                      .map(({ title }) => ({
                                        value: title,
                                        label: title,
                                      }))
                                      .find(
                                        (option) => option.value === item.color
                                      )}
                                    onChange={(selectedOption) =>
                                      handleItemChange(
                                        itemType.id,
                                        index,
                                        "color",
                                        selectedOption?.value
                                      )
                                    }
                                  />
                                </td>

                                <td>
                                  <CustomSelect
                                    className="select_wo"
                                    placeholder="Size"
                                    options={sizes.map(({ title }) => ({
                                      value: title,
                                      label: title,
                                    }))}
                                    value={sizes
                                      .map(({ title }) => ({
                                        value: title,
                                        label: title,
                                      }))
                                      .find(
                                        (option) => option.value === item.size
                                      )}
                                    onChange={(selectedOption) =>
                                      handleItemChange(
                                        itemType.id,
                                        index,
                                        "size",
                                        selectedOption?.value
                                      )
                                    }
                                  />
                                </td>

                                <td>
                                  <input
                                    style={{ width: "100px" }}
                                    type="text"
                                    value={item.position}
                                    onChange={(e) =>
                                      handleItemChange(
                                        itemType.id,
                                        index,
                                        "position",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>

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
                                        itemType.id,
                                        index,
                                        "supplier_id",
                                        selectedOption?.value
                                      )
                                    }
                                  />
                                </td>

                                <td>
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
                                      .find(
                                        (option) => option.value === item.unit
                                      )}
                                    onChange={(selectedOption) =>
                                      handleItemChange(
                                        itemType.id,
                                        index,
                                        "unit",
                                        selectedOption?.value
                                      )
                                    }
                                  />
                                </td>

                                <td>
                                  <input
                                    style={{ width: "100px" }}
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={item.consumption}
                                    onChange={(e) =>
                                      handleItemChange(
                                        itemType.id,
                                        index,
                                        "consumption",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>

                                <td>
                                  <input
                                    style={{ width: "100px" }}
                                    type="number"
                                    min="0"
                                    value={item.wastage}
                                    onChange={(e) =>
                                      handleItemChange(
                                        itemType.id,
                                        index,
                                        "wastage",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>

                                <td>
                                  <input
                                    style={{ width: "100px" }}
                                    type="text"
                                    readOnly
                                    value={item.total}
                                    className="me-1"
                                  />
                                </td>

                                <td>
                                  <input
                                    style={{ width: "100px" }}
                                    type="number"
                                    min="0"
                                    value={item.unit_price}
                                    onChange={(e) =>
                                      handleItemChange(
                                        itemType.id,
                                        index,
                                        "unit_price",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                              </>
                            ) : (
                              <td colSpan={11}></td>
                            )}

                            {/* Total price field: editable only for CM */}
                            <td className="d-flex align-items-center">
                              <input
                                style={{ width: "100px" }}
                                type="number"
                                min="0"
                                readOnly={!isCMType}
                                value={item.total_price}
                                onChange={(e) =>
                                  handleItemChange(
                                    itemType.id,
                                    index,
                                    "total_price",
                                    e.target.value
                                  )
                                }
                                className="me-1"
                              />
                              <i
                                style={{ cursor: "pointer" }}
                                onClick={() => removeRow(itemType.id, index)}
                                className="fa fa-times text-danger me-2"
                              ></i>
                            </td>
                          </tr>
                        )
                      )}
                  </React.Fragment>
                );
              })}

              {/* Footer row for grand total */}
              <tr>
                <td colSpan={12}>
                  <strong>FOB</strong>
                </td>
                <td className="text-end">
                  <strong>$ {getGrandTotalFob()}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
