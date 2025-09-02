import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logos/logo-short.png";
import MultipleFileInput from "./MultipleFileInput";
import api from "services/api";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";
import CustomSelect from "elements/CustomSelect";
export default function CreatePurchaseOrder({ renderArea, setRenderArea }) {
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);

  const destinations = [
    { id: 1, title: "UK" },
    { id: 2, title: "USA" },
    { id: 3, title: "TURKEY" },
    { id: 4, title: "UAE" },
  ];

  const [contracts, setContracts] = useState([]);

  const getContracts = async () => {
    setSpinner(true);
    var response = await api.post("/merchandising/purchase-contracts-public");
    if (response.status === 200 && response.data) {
      setContracts(response.data.data);
    }
    setSpinner(false);
  };

  const [terms, setTerms] = useState([]);
  const getTerms = async () => {
    setSpinner(true);
    var response = await api.post("/admin/terms");
    if (response.status === 200 && response.data) {
      setTerms(response.data.data);
    }
    setSpinner(false);
  };

  const packings = [
    { id: 1, title: "Dozen in Box" },
    { id: 2, title: "Dozen in Poly" },
    { id: 3, title: "Single in Poly" },
    { id: 4, title: "Single in Hanger" },
    { id: 5, title: "Pair In Poly" },
    { id: 6, title: "Other" },
  ];

  const [selectedPoFiles, setSelectedPoFiles] = useState([]);

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

  useEffect(() => {
    getSizes();
    getColors();
    getContracts();
    getTerms();
  }, []);

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    po_number: "",
    wo_id: "",
    issued_date: "",
    delivery_date: "",
    purchase_contract_id: "",
    brand: "",
    season: "",
    description: "",
    technical_package_id: "",
    buyer_style_name: "",
    item_name: "",
    item_type: "",
    department: "",
    wash_details: "",
    destination: "",
    ship_mode: "Ocean",
    shipping_terms: "",
    packing_method: "",
    payment_terms: "",
    total_qty: "",
    total_value: "",
    special_operations: [],
  });

  const handleChange = async (name, value) => {
    if (name === "technical_package_id") {
      try {
        const response = await api.post("/merchandising/technical-packages-show", {
          id: value,
        });

        if (response.status === 200 && response.data) {
          const data = response.data;

          setFormData((prev) => ({
            ...prev,
            technical_package_id: value,
            company_id: data.company_id || "",
            buyer_id: data.buyer_id || "",
            brand: data.brand || "",
            season: data.season || "",
            description: data.description || "",
            buyer_style_name: data.buyer_style_name || "",
            item_name: data.item_name || "",
            item_type: data.item_type || "",
            department: data.department || "",
            wash_details: data.wash_details || "",
            buyer: data.buyer,
            company: data.company,
            special_operations:
              data.special_operation?.split(",").filter(Boolean) || [],
          }));
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

  const validateForm = () => {
    const requiredFields = {
      po_number: "Please insert a PO number.",
      issued_date: "Please insert the issue date.",
      delivery_date: "Delivery date is required.",
      technical_package_id: "Please select a technical package.",
      destination: "Please select a destination.",
      ship_mode: "Please select a shipping mode.",
      purchase_contract_id: "Please select a purchase contract.",
      shipping_terms: "Please select shipping terms.",
      packing_method: "Please select a packing method.",
      payment_terms: "Please select payment terms.",
    };

    const formErrors = {};

    for (const field in requiredFields) {
      if (!formData[field]) {
        formErrors[field] = requiredFields[field];
      }
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (poItems.length === 0) {
      swal({
        title: "Please select items.",
        icon: "error",
      });
      return;
    }

    if (!validateForm()) return;

    try {
      const data = new FormData();
      // Append form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          data.append(key, JSON.stringify(value));
        } else {
          data.append(key, value);
        }
      });
      data.set("total_qty", totalQuantity);
      data.set("total_value", grandTotalFob);
      data.append("po_items", JSON.stringify(poItems));
      for (let i = 0; i < selectedPoFiles.length; i++) {
        data.append("attatchments[]", selectedPoFiles[i]);
      }
      setSpinner(true);
      const response = await api.post("/merchandising/pos-create", data);
      if (response.status === 200 && response.data) {
        history.push("/purchase-orders/" + response.data.po.id);
        window.location.reload();
      } else {
        setErrors(response.data.errors || {});
      }
    } catch (error) {
      console.error("Form submission failed:", error);
      swal({
        title: "Submission Failed",
        text: "Something went wrong while submitting the form.",
        icon: "error",
      });
    } finally {
      setSpinner(false);
    }
  };

  const [poItems, setPoItems] = useState([]);

  const handleAddItem = () => {
    setPoItems([
      ...poItems,
      {
        color: "",
        size: "",
        inseam: "",
        qty: "",
        fob: "",
        total: 0,
      },
    ]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...poItems];
    updatedItems[index][field] = value;

    const currentColor = field === "color" ? value : updatedItems[index].color;
    const currentSize = field === "size" ? value : updatedItems[index].size;

    const isDuplicate = updatedItems.some((item, idx) => {
      return (
        idx !== index &&
        item.color === currentColor &&
        item.size === currentSize &&
        currentColor !== "" &&
        currentSize !== ""
      );
    });

    if (isDuplicate) {
      alert("Duplicate entry: Same Color and Size combination already exists.");
      return;
    }

    // Calculate total if qty or fob changes
    if (field === "qty" || field === "fob") {
      const qty = parseFloat(updatedItems[index].qty) || 0;
      const fob = parseFloat(updatedItems[index].fob) || 0;
      updatedItems[index].total = qty * fob;
    }

    setPoItems(updatedItems);
  };

  const removeRow = (index) => {
    const updatedItems = [...poItems];
    updatedItems.splice(index, 1);
    setPoItems(updatedItems);
  };

  const totalQuantity = poItems.reduce(
    (sum, item) => sum + Number(item.qty || 0),
    0
  );
  const grandTotalFob = poItems.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );

  //fetch techpacks
  const [techpacks, setTechpacks] = useState([]);

  const getTechpacks = async () => {
    const response = await api.post("/merchandising/technical-packages-all-desc", {
      // mode: "self",
    });

    if (response.status === 200 && response.data) {
      setTechpacks(response.data.data);
    }
  };

  useEffect(() => {
    getTechpacks();
  }, []);

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
              <span className="purchase_text">PO</span>
            </div>
            <div className="col-lg-2">
              <label className="form-label">PO Number</label>
            </div>
            <div className="col-lg-2">
              <input
                value={formData.po_number}
                name="po_number"
                className={errors.po_number ? "red-border" : ""}
                onChange={(e) => handleChange("po_number", e.target.value)}
                type="text"
              />
            </div>

            <div className="col-lg-2">
              <label className="form-label">WO Number</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">
                {formData.wo?.wo_number || "N/A"}
              </div>
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
      <div style={{ padding: "0 15px" }} className="row create_tp_body">
        <div className="col-lg-12">
          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">PO Issue</label>
            </div>
            <div className="col-lg-2">
              <input
                className={errors.issued_date ? "red-border" : ""}
                name="issued_date"
                value={formData.issued_date}
                onChange={(e) => handleChange("issued_date", e.target.value)}
                type="date"
              />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Tech Pack</label>
            </div>
            <div className="col-lg-2">
              <CustomSelect
                className={
                  errors.technical_package_id
                    ? "select_wo red-border"
                    : "select_wo"
                }
                placeholder="Techpack"
                options={techpacks.map(({ id, techpack_number }) => ({
                  value: id,
                  label: techpack_number,
                }))}
                onChange={(selectedOption) =>
                  handleChange("technical_package_id", selectedOption.value)
                }
              />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Destination</label>
            </div>
            <div className="col-lg-2">
              <CustomSelect
                className={
                  errors.destination ? "select_wo red-border" : "select_wo"
                }
                placeholder="Destination"
                options={destinations.map(({ id, title }) => ({
                  value: title,
                  label: title,
                }))}
                onChange={(selectedOption) =>
                  handleChange("destination", selectedOption.value)
                }
              />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">PO Delivery</label>
            </div>
            <div className="col-lg-2">
              <input
                name="delivery_date"
                className={errors.delivery_date ? "red-border" : ""}
                value={formData.delivery_date}
                onChange={(e) => handleChange("delivery_date", e.target.value)}
                type="date"
              />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Buyer Style Name</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{formData.buyer_style_name}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Ship Mode</label>
            </div>
            <div className="col-lg-2">
              <select
                className={errors.ship_mode ? "red-border" : ""}
                name="ship_mode"
                value={formData.ship_mode}
                onChange={(e) => handleChange("ship_mode", e.target.value)}
              >
                <option value="Ocean">Ocean</option>
                <option value="Air">Air</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">PC/LC</label>
            </div>
            <div className="col-lg-2">
              <CustomSelect
                className={
                  errors.purchase_contract_id
                    ? "select_wo red-border"
                    : "select_wo"
                }
                placeholder="PC/LC"
                options={contracts.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
                onChange={(selectedOption) =>
                  handleChange("purchase_contract_id", selectedOption.value)
                }
              />
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Name</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{formData.item_name}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Terms of Shipping</label>
            </div>
            <div className="col-lg-2">
              <CustomSelect
                className={
                  errors.shipping_terms ? "select_wo red-border" : "select_wo"
                }
                placeholder="FCA Ctg"
                options={terms.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
                onChange={(selectedOption) =>
                  handleChange("shipping_terms", selectedOption.value)
                }
              />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Factory</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{formData.company?.title}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Type</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{formData.item_type}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Packing Method</label>
            </div>
            <div className="col-lg-2">
              <CustomSelect
                className={
                  errors.packing_method ? "select_wo red-border" : "select_wo"
                }
                placeholder="Packing Method"
                options={packings.map(({ id, title }) => ({
                  value: title,
                  label: title,
                }))}
                onChange={(selectedOption) =>
                  handleChange("packing_method", selectedOption.value)
                }
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Buyer</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{formData.buyer?.name}</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Department</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{formData.department}</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Payment Terms</label>
            </div>
            <div className="col-lg-2">
              <CustomSelect
                className={
                  errors.payment_terms ? "select_wo red-border" : "select_wo"
                }
                placeholder="Terms"
                options={terms.map(({ id, title }) => ({
                  value: id,
                  label: title,
                }))}
                onChange={(selectedOption) =>
                  handleChange("payment_terms", selectedOption.value)
                }
              />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Brand</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{formData.brand}</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Wash Detail</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{formData.wash_details}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Total Quantity</label>
            </div>
            <div className="col-lg-2">
              <input
                type="number"
                readOnly
                value={totalQuantity}
                placeholder="5000"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Season</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{formData.season}</div>
            </div>

            <div className="col-lg-2"></div>
            <div className="col-lg-2"></div>

            <div className="col-lg-2">
              <label className="form-label">Total Value $</label>
            </div>
            <div className="col-lg-2">
              <input
                value={grandTotalFob.toFixed(2)}
                readOnly
                type="number"
                placeholder="$50000"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Description</label>
            </div>
            <div className="col-lg-10">
              <div className="form-value">{formData.description}</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Special Operation</label>
            </div>
            <div className="col-lg-10">
              <div className="form-value">
                {(() => {
                  try {
                    const ops = JSON.parse(formData?.special_operations);
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

      <div style={{ padding: "0 15px" }} className="create_tp_attatchment">
        <MultipleFileInput
          label="PO Attachments"
          inputId="po_attatchments"
          selectedFiles={selectedPoFiles}
          setSelectedFiles={setSelectedPoFiles}
        />
      </div>

      <div
        style={{ padding: "0 15px" }}
        className="create_tp_materials_area create_tp_body"
      >
        <div className="d-flex justify-content-between">
          <h6>PO Details</h6>
          <div
            onClick={handleAddItem}
            style={{
              background: "#f1a655",
              height: "17px",
              width: "17px",
              borderRadius: "50%",
              textAlign: "center",
              lineHeight: "17px",
              fontSize: "11px",
              color: "white",
              cursor: "pointer",
            }}
          >
            <i className="fa fa-plus"></i>
          </div>
        </div>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Color</th>
              <th>Size</th>
              <th>Inseam</th>
              <th>Quantity</th>
              <th>FOB</th>
              <th>Total FOB</th>
            </tr>
          </thead>
          <tbody>
            {poItems.map((item, index) => (
              <tr key={index}>
                <td>
                  <select
                    style={{ width: "200px" }}
                    value={item.color}
                    onChange={(e) =>
                      handleItemChange(index, "color", e.target.value)
                    }
                  >
                    <option value="">Select Color</option>
                    {colors.map((it) => (
                      <option key={it.id} value={it.title}>
                        {it.title}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    style={{ width: "150px" }}
                    value={item.size}
                    onChange={(e) =>
                      handleItemChange(index, "size", e.target.value)
                    }
                  >
                    <option value="">Select Size</option>
                    {sizes.map((it) => (
                      <option key={it.id} value={it.title}>
                        {it.title}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    value={item.inseam}
                    onChange={(e) =>
                      handleItemChange(index, "inseam", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) =>
                      handleItemChange(index, "qty", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.fob}
                    onChange={(e) =>
                      handleItemChange(index, "fob", e.target.value)
                    }
                  />
                </td>

                <td className="d-flex align-items-center">
                  <input
                    readOnly
                    type="number"
                    className="me-2"
                    value={item.total.toFixed(2)}
                  />
                  <i
                    style={{ cursor: "pointer" }}
                    onClick={() => removeRow(index)}
                    className="fa fa-times text-danger me-2"
                  ></i>
                </td>
              </tr>
            ))}

            {poItems.length > 0 ? (
              <tr>
                <td>
                  <strong>Grand Total</strong>
                </td>
                <td></td>
                <td></td>
                <td>
                  <strong>{totalQuantity}</strong>
                </td>
                <td></td>
                <td>
                  <strong>{grandTotalFob.toFixed(2)}</strong>
                </td>
              </tr>
            ) : (
              ""
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
