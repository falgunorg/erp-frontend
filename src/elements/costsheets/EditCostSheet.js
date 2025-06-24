import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logos/logo-short.png";
import Select, { components } from "react-select";
import { Modal, Button, Spinner } from "react-bootstrap";
import api from "services/api";

import { ArrowRightIcon, ArrowDownIcon } from "../../elements/SvgIcons";

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
      background: "#ECECEC",
      lineHeight: "19px",
      boxShadow: "inset 0px 0px 6px rgba(0, 0, 0, 0.18)",
      boxShadow: state.isFocused ? "" : "",
    }),

    valueContainer: (provided, state) => ({
      ...provided,
      height: "21px",
      padding: "0 6px",
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
      padding: "3px", // Ensure padding is a maximum of 3px
    }),

    option: (provided, state) => ({
      ...provided,
      fontSize: "12px", // Ensure each option has 12px font size
      padding: "3px", // Limit option padding to 3px
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

  const buyers = [
    { id: 1, title: "NSLBD" },
    { id: 2, title: "WALMART" },
    { id: 3, title: "FIVE STAR LLC" },
  ];

  const brands = [
    { id: 1, title: "NEXT" },
    { id: 2, title: "GARAN" },
    { id: 3, title: "MANGO" },
  ];

  const season = [
    { id: 1, title: "FAL 24" },
    { id: 2, title: "SUMMER 25" },
    { id: 3, title: "SPRING 25" },
  ];

  const departments = [
    { id: 1, title: "Mens" },
    { id: 2, title: "Womens" },
    { id: 3, title: "Kids" },
  ];

  const companies = [
    { id: 1, title: "JMS" },
    { id: 2, title: "MCL" },
    { id: 3, title: "MBL" },
  ];

  const itemTypes = [
    { id: 1, title: "TOP" },
    { id: 2, title: "BOTTOM" },
    { id: 3, title: "SWIMWEAR" },
  ];

  const washes = [
    { id: 1, title: "Garment Wash" },
    { id: 2, title: "Enzyme Wash" },
    { id: 3, title: "Bleach Wash" },
    { id: 4, title: "Stone Wash" },
    { id: 5, title: "Acid Wash" },
    { id: 6, title: "Rinse Wash" },
    { id: 7, title: "Sand Wash" },
    { id: 8, title: "Silicon Wash" },
    { id: 9, title: "Moonshine Wash" },
    { id: 10, title: "Distressed Wash" },
  ];

  const specialOperations = [
    { id: 1, title: "Embroadary" },
    { id: 2, title: "Printing" },
    { id: 3, title: "Fusing" },
    { id: 4, title: "Dying" },
  ];

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

  useEffect(() => {
    getItems();
    getSizes();
    getColors();
    getUnits();
    getMaterialTypes();
    getSuppliers();
  }, []);

  const [collapsedMaterialTypes, setCollapsedMaterialTypes] = useState({}); // Track collapsed state

  const toggleMaterialType = (materialTypeId) => {
    setCollapsedMaterialTypes((prev) => ({
      ...prev,
      [materialTypeId]: !prev[materialTypeId], // Toggle collapse state
    }));
  };

  const [consumptionItems, setConsumptionItems] = useState([]);

  console.log("ADDED ITEMS", consumptionItems);

  // Function to remove row
  const removeRow = (materialTypeId, index) => {
    setConsumptionItems((prevItems) => {
      const updatedMaterialTypeItems = [...(prevItems[materialTypeId] || [])];
      updatedMaterialTypeItems.splice(index, 1);
      return { ...prevItems, [materialTypeId]: updatedMaterialTypeItems };
    });
  };

  // Function to add a row within the respective materialType
  const addRow = (materialTypeId) => {
    const newItem = {
      item_id: "",
      item_name: "",
      description: "",
      color: "",
      size: "",
      unit: "",
      position: "",
      actual: "",
      wastage_parcentage: 0,
      cons_total: "",
      unit_price: "",
      total_price: "",
    };

    setConsumptionItems((prevItems) => ({
      ...prevItems,
      [materialTypeId]: [...(prevItems[materialTypeId] || []), newItem],
    }));
  };

  // Function to handle changes in an item
  const handleItemChange = (materialTypeId, index, field, value) => {
    setConsumptionItems((prevItems) => {
      const updatedMaterialTypeItems = [...(prevItems[materialTypeId] || [])];
      const currentItem = {
        ...updatedMaterialTypeItems[index],
        [field]: value,
      };

      // Parse values
      const actual = parseFloat(currentItem.actual) || 0;
      const wastagePercentage = parseFloat(currentItem.wastage_parcentage) || 0;
      const unitPrice = parseFloat(currentItem.unit_price) || 0;
      // Recalculate cons_total
      const consTotal = actual + (actual * wastagePercentage) / 100;
      currentItem.cons_total = consTotal.toFixed(2);

      // Recalculate total_price
      const totalPrice = consTotal * unitPrice;
      currentItem.total_price = totalPrice.toFixed(2);

      updatedMaterialTypeItems[index] = currentItem;

      return {
        ...prevItems,
        [materialTypeId]: updatedMaterialTypeItems,
      };
    });
  };

  const getGroupTotalPrice = (materialTypeId) => {
    const items = consumptionItems[materialTypeId] || [];
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

  // Validate title presence
  const [titleValidation, setTitleValidation] = useState({});
  const validateTitle = () => {
    const validation = {};
    Object.keys(consumptionItems).forEach((materialTypeId) => {
      validation[materialTypeId] = consumptionItems[materialTypeId].every(
        (item) => !!item.item_id
      );
    });
    setTitleValidation(validation);
  };

  useEffect(() => {
    validateTitle();
  }, [consumptionItems]);

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
              <input type="text" />
            </div>

            <div className="col-lg-2">
              <label className="form-label">WO Number</label>
            </div>
            <div className="col-lg-2">
              <input type="text" />
            </div>
          </div>
        </div>
        <div className="col-lg-2">
          <button className="btn btn-default submit_button"> Update </button>
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
              <Select
                className="select_wo"
                placeholder="Buyer"
                options={buyers.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
                styles={customStyles}
                components={{ DropdownIndicator }}
              />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Tech Pack#</label>
            </div>
            <div className="col-lg-5">
              <input type="text" placeholder="Tech Pack Number" />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Brand</label>
            </div>
            <div className="col-lg-3">
              <Select
                className="select_wo"
                placeholder="Brand"
                options={brands.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
                styles={customStyles}
                components={{ DropdownIndicator }}
              />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Buyer Style Name</label>
            </div>
            <div className="col-lg-5">
              <input type="text" placeholder="Buyer Style Name" />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Season</label>
            </div>
            <div className="col-lg-3">
              <Select
                className="select_wo"
                placeholder="Season"
                options={season.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
                styles={customStyles}
                components={{ DropdownIndicator }}
              />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Name</label>
            </div>
            <div className="col-lg-5">
              <input type="text" placeholder="Chino Trouser" />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Department</label>
            </div>
            <div className="col-lg-3">
              <Select
                className="select_wo"
                placeholder="Department"
                options={departments.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
                styles={customStyles}
                components={{ DropdownIndicator }}
              />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Type</label>
            </div>
            <div className="col-lg-5">
              <Select
                className="select_wo"
                placeholder="Type"
                options={itemTypes.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
                styles={customStyles}
                components={{ DropdownIndicator }}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Factory CPM/Eft</label>
            </div>
            <div className="col-lg-3">
              <Select
                className="select_wo"
                placeholder="Factory"
                options={companies.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
                styles={customStyles}
                components={{ DropdownIndicator }}
              />
            </div>

            <div className="col-lg-2">
              <label className="form-label">Description</label>
            </div>
            <div className="col-lg-5">
              <input
                type="text"
                placeholder="97% Cotton 3% Elastane Ps Chino Trouser"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">FOB</label>
            </div>
            <div className="col-lg-3">
              <input type="text" placeholder="$7.05" />
            </div>

            <div className="col-lg-2">
              <label className="form-label">Wash Detail</label>
            </div>
            <div className="col-lg-5">
              <Select
                className="select_wo"
                placeholder="Wash Detail"
                options={washes.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
                styles={customStyles}
                components={{ DropdownIndicator }}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">CM</label>
            </div>
            <div className="col-lg-3">
              <input type="text" placeholder="$1.00" />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Special Operation</label>
            </div>
            <div className="col-lg-5">
              <Select
                isMulti
                className="select_wo"
                placeholder="Operation"
                options={specialOperations.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
                styles={customStyles}
                components={{ DropdownIndicator }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="create_tp_materials_area create_tp_body">
        <h6>Material Descriptions</h6>
        <table className="table table-bordered">
          <thead>
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
            {materialTypes.map((materialType) => (
              <React.Fragment key={materialType.id}>
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
                      className="materialType"
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
                          onClick={() => toggleMaterialType(materialType.id)}
                          style={{ cursor: "pointer" }}
                        >
                          {collapsedMaterialTypes[materialType.id] ? (
                            <ArrowRightIcon />
                          ) : (
                            <ArrowDownIcon />
                          )}
                        </span>{" "}
                        <span
                          onClick={() => toggleMaterialType(materialType.id)}
                          className="me-2"
                        >
                          <strong>{materialType.title}</strong>
                        </span>
                        <span
                          onClick={() => addRow(materialType.id)}
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
                        <strong>$ {getGroupTotalPrice(materialType.id)}</strong>
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Show items only if the materialType is expanded */}
                {!collapsedMaterialTypes[materialType.id] &&
                  (consumptionItems[materialType.id] || []).map(
                    (item, index) => (
                      <tr key={`${materialType.id}-${index}`}>
                        <td>
                          <select
                            required
                            value={item.item_id}
                            onChange={(e) =>
                              handleItemChange(
                                materialType.id,
                                index,
                                "item_id",
                                e.target.value
                              )
                            }
                            className="form-select"
                          >
                            <option value="">Select Item</option>

                            {items
                              .filter(
                                (it) => it.item_type_id === materialType.id
                              ) // Filter items based on materialType.id
                              .map((it) => (
                                <option key={it.id} value={it.id}>
                                  {it.title}
                                </option>
                              ))}
                          </select>
                        </td>

                        <td>
                          <input
                            type="text"
                            value={item.item_name}
                            onChange={(e) =>
                              handleItemChange(
                                materialType.id,
                                index,
                                "item_name",
                                e.target.value
                              )
                            }
                          />
                        </td>

                        <td>
                          <textarea
                            value={item.description}
                            onChange={(e) =>
                              handleItemChange(
                                materialType.id,
                                index,
                                "description",
                                e.target.value
                              )
                            }
                          />
                        </td>

                        <td>
                          <select
                            value={item.color}
                            onChange={(e) =>
                              handleItemChange(
                                materialType.id,
                                index,
                                "color",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select</option>
                            {colors.map((it) => (
                              <option key={it.id} value={it.title}>
                                {it.title}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td>
                          <select
                            value={item.size}
                            onChange={(e) =>
                              handleItemChange(
                                materialType.id,
                                index,
                                "size",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select</option>
                            {sizes.map((it) => (
                              <option key={it.id} value={it.title}>
                                {it.title}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td>
                          <input
                            style={{ width: "80px" }}
                            type="text"
                            value={item.position}
                            onChange={(e) =>
                              handleItemChange(
                                materialType.id,
                                index,
                                "position",
                                e.target.value
                              )
                            }
                          />
                        </td>

                        <td>
                          <select
                            value={item.supplier}
                            onChange={(e) =>
                              handleItemChange(
                                materialType.id,
                                index,
                                "supplier",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select Supplier</option>
                            {suppliers.map((it) => (
                              <option key={it.id} value={it.id}>
                                {it.company_name}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td>
                          <select
                            className="text-lowercase"
                            value={item.unit}
                            onChange={(e) =>
                              handleItemChange(
                                materialType.id,
                                index,
                                "unit",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select</option>
                            {units.map((it) => (
                              <option key={it.id} value={it.title}>
                                {it.title}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td>
                          <input
                            style={{ width: "70px" }}
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.actual}
                            onChange={(e) =>
                              handleItemChange(
                                materialType.id,
                                index,
                                "actual",
                                e.target.value
                              )
                            }
                          />
                        </td>

                        <td>
                          <input
                            style={{ width: "50px" }}
                            type="number"
                            min="0"
                            value={item.wastage_parcentage}
                            onChange={(e) =>
                              handleItemChange(
                                materialType.id,
                                index,
                                "wastage_parcentage",
                                e.target.value
                              )
                            }
                          />
                        </td>

                        <td>
                          <input
                            style={{ width: "70px" }}
                            type="text"
                            min="0"
                            readOnly
                            value={item.cons_total}
                            className="me-1"
                          />
                        </td>

                        <td>
                          <input
                            style={{ width: "50px" }}
                            type="number"
                            min="0"
                            value={item.unit_price}
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

                        <td className="d-flex align-items-center">
                          <input
                            style={{ width: "70px" }}
                            type="text"
                            min="0"
                            readOnly
                            value={item.total_price}
                            className="me-1"
                          />
                          <i
                            style={{ cursor: "pointer" }}
                            onClick={() => removeRow(materialType.id, index)}
                            className="fa fa-times text-danger me-2"
                          ></i>
                        </td>
                      </tr>
                    )
                  )}
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
  );
}
