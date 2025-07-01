import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logos/logo-short.png";
import Select, { components } from "react-select";
import api from "services/api";
import CustomSelect from "elements/CustomSelect";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";

export default function CreateBudget({ renderArea, setRenderArea }) {
  const history = useHistory();
  const [buyers, setBuyers] = useState([]);
  const getBuyers = async () => {
    setSpinner(true);
    var response = await api.post("/buyers");
    if (response.status === 200 && response.data) {
      setBuyers(response.data.data);
    }
    setSpinner(false);
  };

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

  const [costings, setCostings] = useState([]);

  const getCostings = async () => {
    setSpinner(true);
    var response = await api.post("/public-costings");
    if (response.status === 200 && response.data) {
      setCostings(response.data.costings);
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
    getBuyers();
    getCostings();
  }, []);

  const [materials, setMaterials] = useState([]);
  console.log("items", materials);

  const addRow = () => {
    setMaterials((prev) => [
      ...prev,
      {
        item_type_id: "",
        item_id: "",
        item_details: "",
        color: "",
        size: "",
        unit: "",
        size_breakdown: "",
        position: "",
        supplier_id: "",
        consumption: "",
        wastage: "",
        total: 0,
        unit_price: "",
        actual_unit_price: 0,
        total_booking: "",
        total_price: 0,
        actual_total_price: 0,
      },
    ]);
  };

  const removeRow = (index) => {
    setMaterials((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...materials];
    updated[index][field] = value;

    const consumption = parseFloat(updated[index].consumption) || 0;
    const wastage = parseFloat(updated[index].wastage) || 0;
    const actualUnitPrice = parseFloat(updated[index].actual_unit_price) || 0;

    const total = consumption + (consumption * wastage) / 100;
    updated[index].total = total;

    updated[index].actual_total_price = total * actualUnitPrice;

    setMaterials(updated);
  };

  const [formData, setFormData] = useState({
    po_id: "",
    wo_id: "",
    costing_id: "",
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
    fob: 0,
    cm: 0,
  });

  const handleFormChange = async (name, value) => {
    if (name === "costing_id") {
      try {
        const response = await api.post("/costings-show", {
          id: value,
        });

        if (response.status === 200 && response.data) {
          const data = response.data.data;

          setFormData((prev) => ({
            ...prev,
            costing_id: value,
            buyer: data.techpack?.buyer.name || "",
            buyer_style_name: data.techpack?.buyer_style_name || "",
            brand: data.techpack?.brand || "",
            season: data.techpack?.season || "",
            item_name: data.techpack?.item_name || "",
            department: data.techpack?.department || "",
            item_type: data.techpack?.item_type || "",
            description: data.techpack?.description || "",
            wash_details: data.techpack?.wash_details || "",
            special_operations: data.techpack?.special_operation || "",
          }));

          setMaterials(data.items);
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

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};

    if (!formData.costing_id) {
      formErrors.costing_id = "Costing is required";
    }
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
    const tp_items = Object.values(materials).flat();
    if (tp_items.length === 0) {
      swal({
        title: "Please Select items",
        icon: "error",
      });
      return; // Prevent form submission
    }

    if (validateForm()) {
      var data = new FormData();
      data.append("costing_id", formData.costing_id);
      data.append("costing_items", JSON.stringify(tp_items));
      data.append("cm", formData.cm);
      data.append("factory_cpm", formData.factory_cpm);
      data.append("fob", formData.fob);
      setSpinner(true);
      var response = await api.post("/costings-create", data);
      if (response.status === 200 && response.data) {
        history.push("/cost-sheets/" + response.data.data.id);
        setRenderArea("details");
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
              <label className="form-label">Tech Pack#</label>
            </div>
            <div className="col-lg-3">
              <CustomSelect
                className={
                  errors.costing_id ? "select_wo red-border" : "select_wo"
                }
                placeholder="Techpack"
                options={costings.map(({ id, costing_ref }) => ({
                  value: id,
                  label: costing_ref,
                }))}
                onChange={(selectedOption) =>
                  handleFormChange("costing_id", selectedOption?.value)
                }
              />
              {errors.costing_id && (
                <small className="text-danger">{errors.costing_id}</small>
              )}
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
                className={errors.factory_cpm ? "red-border" : ""}
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
                className={errors.fob ? "red-border" : ""}
                onChange={(e) => handleFormChange("fob", e.target.value)}
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
              <input readOnly type="text" value={formData.wash_details} />
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
                readOnly
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
                      value={row.item_type_id}
                      onChange={(e) =>
                        handleInputChange(index, "item_type_id", e.target.value)
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
                      value={row.item_id}
                      onChange={(e) =>
                        handleInputChange(index, "item_id", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      style={{ width: "100px" }}
                      type="text"
                      value={row.item_details}
                      onChange={(e) =>
                        handleInputChange(index, "item_details", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <select
                      style={{ width: "100px" }}
                      value={row.supplier_id}
                      onChange={(e) =>
                        handleInputChange(index, "supplier_id", e.target.value)
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
                      value={row.size_breakdown}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "size_breakdown",
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
                      value={row.consumption}
                      onChange={(e) =>
                        handleInputChange(index, "consumption", e.target.value)
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
                      value={row.total}
                    />
                  </td>
                  <td>
                    <input
                      style={{ width: "100px" }}
                      type="number"
                      value={row.total_booking}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "total_booking",
                          e.target.value
                        )
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
                      value={row.actual_unit_price}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "actual_unit_price",
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
                      value={row.total_price}
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
                    {materials.reduce(
                      (sum, row) => sum + parseFloat(row.total_price || 0),
                      0
                    )}
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
