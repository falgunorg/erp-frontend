import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logos/logo-short.png";
import Select, { components } from "react-select";
import api from "services/api";
import CustomSelect from "elements/CustomSelect";
import swal from "sweetalert";
import { useHistory, useParams } from "react-router-dom";

export default function EditBudget({ renderArea, setRenderArea }) {
  const history = useHistory();
  const params = useParams();

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

  useEffect(() => {
    getSizes();
    getColors();
    getUnits();
    getItems();
    getItemTypes();
    getSuppliers();
  }, []);

  const [materials, setMaterials] = useState([]);
  const handleInputChange = (index, name, value) => {
    setMaterials((prevMaterials) => {
      const updatedMaterials = [...prevMaterials];
      const row = { ...updatedMaterials[index], [name]: value };

      const itemType = itemTypes.find((type) => type.id === row.item_type_id);
      const isCM = itemType?.title === "CM";

      // If not CM, recalculate actual_total_price based on actual_unit_price * total
      if (!isCM) {
        const total = parseFloat(row.total) || 0;
        const actualUnitPrice =
          parseFloat(
            name === "actual_unit_price" ? value : row.actual_unit_price
          ) || 0;

        row.actual_total_price = (actualUnitPrice * total).toFixed(2);
      } else {
        // If it's CM and user is directly updating actual_total_price, allow it
        if (name === "actual_total_price") {
          row.actual_total_price = parseFloat(value) || 0;
        }
      }

      updatedMaterials[index] = row;
      return updatedMaterials;
    });
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

  const getBudget = async () => {
    setSpinner(true);
    const response = await api.post("/budgets-show", { id: params.id });
    if (response.status === 200 && response.data) {
      const data = response.data.data;

      // Set main form data from the costing/techpack
      setFormData((prev) => ({
        ...prev,
        id: data.id,
        ref_number: data.ref_number,
        factory_cpm: data.factory_cpm,
        costing_id: data.costing_id,
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
    setSpinner(false);
  };

  useEffect(() => {
    getBudget();
  }, [params.id]);

  const [totalFob, setTotalFob] = useState(0);
  const [totalCM, setTotalCM] = useState(0);
  useEffect(() => {
    const allItems = materials;

    // Calculate total FOB
    const totalFobValue = allItems.reduce((sum, item) => {
      const totalPrice = parseFloat(item.actual_total_price) || 0;
      return sum + totalPrice;
    }, 0);

    // Get CM item_type_id(s)
    const cmItemTypeIds = itemTypes
      .filter((type) => type.title === "CM")
      .map((type) => type.id);

    // Filter CM items and calculate total CM
    const totalCMValue = allItems
      .filter((item) => cmItemTypeIds.includes(item.item_type_id))
      .reduce((sum, item) => {
        const totalPrice = parseFloat(item.actual_total_price) || 0;
        return sum + totalPrice;
      }, 0);

    setTotalCM(totalCMValue.toFixed(2));
    setTotalFob(totalFobValue.toFixed(2));

    // Set both values
    setFormData((prev) => ({
      ...prev,
      fob: totalFob,
      cm: totalCM,
    }));
  }, [materials, itemTypes]);

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};

    if (!formData.costing_id) {
      formErrors.costing_id = "Costing is required";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const budget_items = materials;
    if (budget_items.length === 0) {
      swal({
        title: "Please Select items",
        icon: "error",
      });
      return; // Prevent form submission
    }

    if (validateForm()) {
      var data = new FormData();
      data.append("id", formData.id);
      data.append("costing_id", formData.costing_id);
      data.append("budget_items", JSON.stringify(budget_items));
      data.append("cm", totalCM);
      data.append("factory_cpm", formData.factory_cpm);
      data.append("fob", totalFob);
      setSpinner(true);
      var response = await api.post("/budgets-update", data);
      if (response.status === 200 && response.data) {
       
        history.push("/budget-sheets/" + response.data.data.id);
        setRenderArea("details");
         window.location.reload();

      } else {
        setErrors(response.data.errors);
      }
      setSpinner(false);
    }
  };

  const isCMType = (item_type_id) => {
    const type = itemTypes.find((t) => t.id === item_type_id);
    return type?.title === "CM";
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
              <span className="purchase_text">Edit Budget</span>
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
              <label className="form-label">Tech Pack/Costing Ref#</label>
            </div>
            <div className="col-lg-3">
              <input readOnly type="text" value={formData.ref_number} />
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
                type="text"
                readOnly
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
                type="number"
                readOnly
                min={0}
                step={0.1}
                value={totalFob}
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
                type="number"
                min={0}
                readOnly
                step={0.1}
                value={totalCM}
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
            // onClick={addRow}
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
              {materials.map((row, index) => {
                const isCM = isCMType(row.item_type_id);

                return (
                  <tr key={index}>
                    {/* Common Fields for All */}
                    <td>
                      <CustomSelect
                        isDisabled
                        placeholder="Item Type"
                        options={itemTypes.map(({ id, title }) => ({
                          value: id,
                          label: title,
                        }))}
                        value={itemTypes
                          .map(({ id, title }) => ({
                            value: id,
                            label: title,
                          }))
                          .find((option) => option.value === row.item_type_id)}
                      />
                    </td>

                    <td>
                      <CustomSelect
                        isDisabled
                        placeholder="Item"
                        options={items.map(({ id, title }) => ({
                          value: id,
                          label: title,
                        }))}
                        value={items
                          .map(({ id, title }) => ({
                            value: id,
                            label: title,
                          }))
                          .find((option) => option.value === row.item_id)}
                      />
                    </td>

                    {isCM ? (
                      <>
                        <td colSpan={14}></td>

                        <td>
                          <input
                            style={{ width: "100px" }}
                            type="number"
                            value={row.actual_total_price}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "actual_total_price",
                                e.target.value
                              )
                            }
                          />
                        </td>
                      </>
                    ) : (
                      // Show all fields for non-CM
                      <>
                        <td>
                          <input
                            readOnly
                            style={{ width: "100px" }}
                            type="text"
                            value={row.item_details}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "item_details",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <CustomSelect
                            isDisabled
                            placeholder="Supplier"
                            options={suppliers.map(({ id, company_name }) => ({
                              value: id,
                              label: company_name,
                            }))}
                            value={suppliers
                              .map(({ id, company_name }) => ({
                                value: id,
                                label: company_name,
                              }))
                              .find(
                                (option) => option.value === row.supplier_id
                              )}
                          />
                        </td>
                        <td>
                          <CustomSelect
                            isDisabled
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
                              .find((option) => option.value === row.title)}
                          />
                        </td>
                        <td>
                          <input
                            readOnly
                            style={{ width: "100px" }}
                            type="text"
                            value={row.position}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "position",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <CustomSelect
                            isDisabled
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
                              .find((option) => option.value === row.size)}
                          />
                        </td>
                        <td>
                          <CustomSelect
                            isDisabled
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
                              .find((option) => option.value === row.unit)}
                          />
                        </td>
                        <td>
                          <input
                            style={{ width: "100px" }}
                            value={row.size_breakdown}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "size_breakdown",
                                e.target.value
                              )
                            }
                            type="text"
                          />
                        </td>
                        <td>
                          <input
                            style={{ width: "100px" }}
                            type="number"
                            value={row.quantity}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "quantity",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            style={{ width: "100px" }}
                            type="number"
                            value={row.consumption}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            style={{ width: "100px" }}
                            type="number"
                            value={row.wastage}
                            readOnly
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
                            readOnly
                            value={row.unit_price}
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
                        <td>
                          <input
                            style={{ width: "100px" }}
                            type="number"
                            readOnly
                            value={row.actual_total_price}
                          />
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}

              <tr>
                <td colSpan={16}>
                  <strong>FOB</strong>
                </td>
                <td className="text-end">
                  <strong>${totalFob}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
