import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logos/logo-short.png";
import Select, { components } from "react-select";
import api from "services/api";
import swal from "sweetalert";

import { ArrowRightIcon, ArrowDownIcon } from "../../elements/SvgIcons";
import { Description } from "@mui/icons-material";

export default function CreateCostSheet(props) {
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="9"
          height="7"
          viewBox="0 0 9 7"
        >
          <path
            id="Polygon_60"
            data-name="Polygon 60"
            d="M3.659,1.308a1,1,0,0,1,1.682,0L8.01,5.459A1,1,0,0,1,7.168,7H1.832A1,1,0,0,1,.99,5.459Z"
            transform="translate(9 7) rotate(180)"
            fill="#707070"
          />
        </svg>
      </components.DropdownIndicator>
    );
  };
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "none",
      border: "none",
      minHeight: "21px",
      fontSize: "12px",
      height: "21px",
      minWidth: "100px",
      background: "#ECECEC",
      lineHeight: "19px",
      boxShadow: "inset 0px 0px 6px rgba(0, 0, 0, 0.18)",
      boxShadow: state.isFocused ? "" : "",
    }),

    valueContainer: (provided, state) => ({
      ...provided,
      height: "21px",
      padding: "0 3px",
    }),

    input: (provided, state) => ({
      ...provided,
      margin: "0px",
      fontSize: "12px", // Ensure input text is also 12px
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),

    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: "21px",
    }),

    menu: (provided) => ({
      ...provided,
      fontSize: "12px", // Set menu font size to 12px
      padding: "2px", // Ensure padding is a maximum of 3px
    }),

    option: (provided, state) => ({
      ...provided,
      fontSize: "12px", // Ensure each option has 12px font size
      padding: "2px", // Limit option padding to 3px
      backgroundColor: state.isSelected
        ? "#ef9a3e"
        : state.isFocused
        ? "#f0f0f0"
        : "#fff",
      color: state.isSelected ? "#fff" : "#333",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#ef9a3e",
        color: "#fff",
      },
    }),
  };

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
    var response = await api.post("/units");
    if (response.status === 200 && response.data) {
      setUnits(response.data.data);
    }
    setSpinner(false);
  };

  const [sizes, setSizes] = useState([]);
  const getSizes = async () => {
    setSpinner(true);
    var response = await api.post("/sizes");
    if (response.status === 200 && response.data) {
      setSizes(response.data.data);
    }
    setSpinner(false);
  };

  const [colors, setColors] = useState([]);
  const getColors = async () => {
    setSpinner(true);
    var response = await api.post("/colors");
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

  const [techpacks, setTechpacks] = useState([]);

  const getTechpacks = async () => {
    setSpinner(true);
    var response = await api.post("/technical-packages-all-desc");
    if (response.status === 200 && response.data) {
      setTechpacks(response.data.data);
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
    getTechpacks();
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

      // Parse values
      const consumption = parseFloat(currentItem.consumption) || 0;
      const wastagePercentage = parseFloat(currentItem.wastage) || 0;
      const unitPrice = parseFloat(currentItem.unit_price) || 0;
      // Recalculate total
      const consTotal = consumption + (consumption * wastagePercentage) / 100;
      currentItem.total = consTotal.toFixed(2);

      // Recalculate total_price
      const totalPrice = consTotal * unitPrice;
      currentItem.total_price = totalPrice.toFixed(2);

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

  const [formData, setFormData] = useState({
    po_id: "",
    wo_id: "",
    technical_package_id: "",
    buyer: "",
    buyer_style_name: "",
    brand: "",
    season: "",
    item_name: "",
    department: "",
    item_type: "",
    description: "",
    wash_details: "",
    special_operations: "",
    factory_cpm: "",
    fob: "",
    cm: "",
  });

  const handleFormChange = async (name, value) => {
    if (name === "technical_package_id") {
      try {
        const response = await api.post("/technical-package-show", {
          id: value,
        });

        if (response.status === 200 && response.data) {
          const data = response.data;

          setFormData((prev) => ({
            ...prev,

            technical_package_id: value,
            buyer: data.buyer.name || "",
            buyer_style_name: data.buyer_style_name || "",
            brand: data.brand || "",
            season: data.season || "",
            item_name: data.item_name || "",
            department: data.department || "",
            item_type: data.item_type || "",
            description: data.description || "",
            wash_details: data.wash_details || "",
            special_operations: data.special_operation || "",
          }));

          const groupedItems = groupMaterialsByItemType(data.materials || []);
          setConsumptionItems(groupedItems);
        }
      } catch (error) {
        console.error("Error fetching technical package data:", error);
      }
    } else {
      setFormData((prev) => ({
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

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};

    if (!formData.technical_package_id) {
      formErrors.technical_package_id = "Techpack is required";
    }
    if (!formData.fob) {
      formErrors.fob = "fob is required";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const tp_items = Object.values(consumptionItems).flat();
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
      data.append("technical_package_id", formData.po_id);
      data.append("tp_items", JSON.stringify(tp_items));
      data.append("cm", formData.cm);
      data.append("fob", formData.fob);
      data.append("costing_items", formData.factory_cpm);

      setSpinner(true);
      var response = await api.post("/costings-create", data);
      if (response.status === 200 && response.data) {
        window.location.reload();
      } else {
        setErrors(response.data.errors);
      }
      setSpinner(false);
    }
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
              <span className="purchase_text">Cost Sheet</span>
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
            Submit{" "}
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
              <Select
                className="select_wo"
                placeholder="Techpack"
                options={techpacks.map(({ id, techpack_number }) => ({
                  value: id,
                  label: techpack_number,
                }))}
                onChange={(selectedOption) =>
                  handleFormChange(
                    "technical_package_id",
                    selectedOption?.value
                  )
                }
                styles={customStyles}
                components={{ DropdownIndicator }}
              />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Buyer</label>
            </div>
            <div className="col-lg-5">
              <input readOnly type="text" value={formData.buyer} />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Brand</label>
            </div>
            <div className="col-lg-3">
              <input readOnly type="text" value={formData.brand} />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Buyer Style Name</label>
            </div>
            <div className="col-lg-5">
              <input readOnly type="text" value={formData.buyer_style_name} />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Season</label>
            </div>
            <div className="col-lg-3">
              <input readOnly type="text" value={formData.season} />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Name</label>
            </div>
            <div className="col-lg-5">
              <input readOnly type="text" value={formData.item_name} />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Department</label>
            </div>
            <div className="col-lg-3">
              <input readOnly type="text" value={formData.department} />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Type</label>
            </div>
            <div className="col-lg-5">
              <input readOnly type="text" value={formData.item_type} />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Factory CPM/Eft</label>
            </div>
            <div className="col-lg-3">
              <input
                onChange={(e) =>
                  handleFormChange("factory_cpm", e.target.value)
                }
                type="text"
                value={formData.factory_cpm}
              />
            </div>

            <div className="col-lg-2">
              <label className="form-label">Description</label>
            </div>
            <div className="col-lg-5">
              <input readOnly type="text" value={formData.description} />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">FOB</label>
            </div>
            <div className="col-lg-3">
              <input
                onChange={(e) => handleFormChange("fob", e.target.value)}
                type="number"
                min={0}
                step={0.1}
                value={formData.fob}
              />
            </div>

            <div className="col-lg-2">
              <label className="form-label">Wash Detail</label>
            </div>
            <div className="col-lg-5">
              <input readOnly type="text" value={formData.wash_details} />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">CM</label>
            </div>
            <div className="col-lg-3">
              <input
                onChange={(e) => handleFormChange("cm", e.target.value)}
                type="number"
                min={0}
                step={0.1}
                value={formData.cm}
              />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Special Operation</label>
            </div>
            <div className="col-lg-5">
              <input readOnly type="text" value={formData.special_operations} />
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
              {itemTypes.map((itemType) => (
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
                        </div>
                        <div>
                          <strong>$ {getGroupTotalPrice(itemType.id)}</strong>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Show items only if the itemType is expanded */}
                  {!collapsedItemTypes[itemType.id] &&
                    (consumptionItems[itemType.id] || []).map((item, index) => (
                      <tr key={`${itemType.id}-${index}`}>
                        <td>
                          <Select
                            style={{ width: "100px" }}
                            className="select_wo"
                            placeholder="Item"
                            options={items
                              .filter((it) => it.item_type_id === itemType.id)
                              .map(({ id, title }) => ({
                                value: id,
                                label: title,
                              }))}
                            value={items
                              .filter((it) => it.item_type_id === itemType.id)
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
                            styles={customStyles}
                            components={{ DropdownIndicator }}
                          />
                        </td>

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
                          <Select
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
                                (option) =>
                                  option.value ===
                                  (consumptionItems[itemType.id]?.[index]
                                    ?.color || null)
                              )}
                            onChange={(selectedOption) =>
                              handleItemChange(
                                itemType.id,
                                index,
                                "color",
                                selectedOption?.value
                              )
                            }
                            styles={customStyles}
                            components={{ DropdownIndicator }}
                          />
                        </td>

                        <td>
                          <Select
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
                                (option) =>
                                  option.value ===
                                  (consumptionItems[itemType.id]?.[index]
                                    ?.size || null)
                              )}
                            onChange={(selectedOption) =>
                              handleItemChange(
                                itemType.id,
                                index,
                                "size",
                                selectedOption?.value
                              )
                            }
                            styles={customStyles}
                            components={{ DropdownIndicator }}
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
                          <Select
                            className="select_wo"
                            placeholder="Select Supplier"
                            options={suppliers.map(({ id, company_name }) => ({
                              value: id,
                              label: company_name,
                            }))}
                            onChange={(selectedOption) =>
                              handleItemChange(
                                itemType.id,
                                index,
                                "supplier_id",
                                selectedOption?.value
                              )
                            }
                            styles={customStyles}
                            components={{ DropdownIndicator }}
                          />
                        </td>

                        <td>
                          <Select
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
                                (option) =>
                                  option.value ===
                                  (consumptionItems[itemType.id]?.[index]
                                    ?.unit || null)
                              )}
                            onChange={(selectedOption) =>
                              handleItemChange(
                                itemType.id,
                                index,
                                "unit",
                                selectedOption?.value
                              )
                            }
                            styles={customStyles}
                            components={{ DropdownIndicator }}
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
                            min="0"
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
                            required
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

                        <td className="d-flex align-items-center">
                          <input
                            style={{ width: "100px" }}
                            type="text"
                            min="0"
                            readOnly
                            value={item.total_price}
                            className="me-1"
                          />
                          <i
                            style={{ cursor: "pointer" }}
                            onClick={() => removeRow(itemType.id, index)}
                            className="fa fa-times text-danger me-2"
                          ></i>
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}

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
