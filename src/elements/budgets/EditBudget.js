import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logos/logo-short.png";
import CustomSelect from "elements/CustomSelect";
import api from "services/api";

export default function EditBudget(props) {
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

  const [materials, setMaterials] = useState([]);

  const addRow = () => {
    setMaterials((prev) => [
      ...prev,
      {
        itemType: "",
        itemName: "",
        itemDetails: "",
        supplier: "",
        color: "",
        position: "",
        size: "",
        unit: "",
        sizeBreakdown: "",
        quantity: "",
        actualConsumption: "",
        wastage: "",
        totalConsumption: 0,
        totalBooking: "",
        unitPriceOpen: "",
        actualUnitPrice: "",
        totalPrice: 0,
      },
    ]);
  };

  const removeRow = (index) => {
    setMaterials((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...materials];
    updated[index][field] = value;

    const actual = parseFloat(updated[index].actualConsumption) || 0;
    const wastage = parseFloat(updated[index].wastage) || 0;
    const booking = parseFloat(updated[index].totalBooking) || 0;
    const unitPrice = parseFloat(updated[index].actualUnitPrice) || 0;

    updated[index].totalConsumption = actual + (actual * wastage) / 100;
    updated[index].totalPrice = booking * unitPrice;

    setMaterials(updated);
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
              <span className="purchase_text">Budget</span>
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
          <button className="btn btn-default submit_button"> Submit </button>
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
              <CustomSelect
                className="select_wo"
                placeholder="Buyer"
                options={buyers.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
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
              <CustomSelect
                className="select_wo"
                placeholder="Brand"
                options={brands.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
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
              <CustomSelect
                className="select_wo"
                placeholder="Season"
                options={season.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
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
              <CustomSelect
                className="select_wo"
                placeholder="Department"
                options={departments.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
              />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Type</label>
            </div>
            <div className="col-lg-5">
              <CustomSelect
                className="select_wo"
                placeholder="Type"
                options={itemTypes.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Factory CPM/Eft</label>
            </div>
            <div className="col-lg-3">
              <CustomSelect
                className="select_wo"
                placeholder="Factory"
                options={companies.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
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
              <CustomSelect
                className="select_wo"
                placeholder="Wash Detail"
                options={washes.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
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
              <CustomSelect
                isMulti
                className="select_wo"
                placeholder="Operation"
                options={specialOperations.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
              />
            </div>
          </div>
        </div>
      </div>
      <br></br>

      <div className="create_tp_materials_area create_tp_body">
        <div className="d-flex justify-content-between">
          <h6>Material Descriptions</h6>
          <div
            onClick={addRow}
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
              cursor: "pointer",
            }}
          >
            <i className="fa fa-plus"></i>
          </div>
        </div>

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
                <th>Wastage (%)</th>
                <th>Total Consumption</th>
                <th>Total Booking</th>
                <th>Unit Price From Open Costing</th>
                <th>Actual Unit Price</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((row, index) => (
                <tr key={index}>
                  <td>
                    <select
                      style={{ width: "100px" }}
                      value={row.itemType}
                      onChange={(e) =>
                        handleInputChange(index, "itemType", e.target.value)
                      }
                    >
                      <option>Fabric</option>
                      <option>Thread</option>
                    </select>
                  </td>
                  <td>
                    <input
                      style={{ width: "100px" }}
                      type="text"
                      value={row.itemName}
                      onChange={(e) =>
                        handleInputChange(index, "itemName", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      style={{ width: "100px" }}
                      type="text"
                      value={row.itemDetails}
                      onChange={(e) =>
                        handleInputChange(index, "itemDetails", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <select
                      style={{ width: "100px" }}
                      value={row.supplier}
                      onChange={(e) =>
                        handleInputChange(index, "supplier", e.target.value)
                      }
                    >
                      <option>ABC Enterprise</option>
                      <option>RM Interliner</option>
                    </select>
                  </td>
                  <td>
                    <select
                      style={{ width: "100px" }}
                      value={row.color}
                      onChange={(e) =>
                        handleInputChange(index, "color", e.target.value)
                      }
                    >
                      <option>Red</option>
                      <option>Blue</option>
                    </select>
                  </td>
                  <td>
                    <input
                      style={{ width: "100px" }}
                      type="text"
                      value={row.position}
                      onChange={(e) =>
                        handleInputChange(index, "position", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <select
                      style={{ width: "100px" }}
                      value={row.size}
                      onChange={(e) =>
                        handleInputChange(index, "size", e.target.value)
                      }
                    >
                      <option>xl</option>
                      <option>M</option>
                    </select>
                  </td>
                  <td>
                    <select
                      style={{ width: "100px" }}
                      value={row.unit}
                      onChange={(e) =>
                        handleInputChange(index, "unit", e.target.value)
                      }
                    >
                      <option>yds</option>
                      <option>foot</option>
                    </select>
                  </td>
                  <td>
                    <select
                      style={{ width: "100px" }}
                      value={row.sizeBreakdown}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "sizeBreakdown",
                          e.target.value
                        )
                      }
                    >
                      <option>xl</option>
                      <option>M</option>
                    </select>
                  </td>
                  <td>
                    <input
                      style={{ width: "100px" }}
                      type="number"
                      value={row.quantity}
                      onChange={(e) =>
                        handleInputChange(index, "quantity", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      style={{ width: "100px" }}
                      type="number"
                      value={row.actualConsumption}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "actualConsumption",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      style={{ width: "100px" }}
                      type="number"
                      value={row.wastage}
                      onChange={(e) =>
                        handleInputChange(index, "wastage", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      style={{ width: "100px" }}
                      type="number"
                      readOnly
                      value={row.totalConsumption.toFixed(2)}
                    />
                  </td>
                  <td>
                    <input
                      style={{ width: "100px" }}
                      type="number"
                      value={row.totalBooking}
                      onChange={(e) =>
                        handleInputChange(index, "totalBooking", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      style={{ width: "100px" }}
                      type="number"
                      value={row.unitPriceOpen}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "unitPriceOpen",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      style={{ width: "100px" }}
                      type="number"
                      value={row.actualUnitPrice}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "actualUnitPrice",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td className="d-flex align-items-center">
                    <input
                      style={{ width: "100px" }}
                      type="number"
                      readOnly
                      value={row.totalPrice.toFixed(2)}
                      className="me-2"
                    />
                    <i
                      onClick={() => removeRow(index)}
                      className="fa fa-times text-danger"
                      style={{ cursor: "pointer" }}
                    ></i>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={16}>
                  <strong>FOB</strong>
                </td>
                <td className="text-end">
                  <strong>
                    $
                    {materials
                      .reduce(
                        (sum, row) => sum + parseFloat(row.totalPrice || 0),
                        0
                      )
                      .toFixed(2)}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
