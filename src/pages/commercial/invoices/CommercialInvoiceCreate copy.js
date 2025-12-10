import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "services/api";
import CustomSelect from "elements/CustomSelect";

// ALL form fields

const emptyForm = {
  contract_id: "",
  style_po_no: "",
  item_name: "",
  order_buyer: "",
  export_lc_contract_no: "",
  bank_name: "",
  invoice_no: "",
  inv_date: "",
  pcs_qty: "",
  ctns_qty: "",
  exp_no: "",
  exp_date: "",
  exp_value: "",
  ep_no: "",
  ep_date: "",
  export_shipping_bill_no: "",
  shipping_bill_date: "",
  ex_factory_date: "",
  mode_of_shpment: "",
  destination_country: "",
  carrier_forwarder_name: "",
  bl_no: "",
  shipped_onboard_date: "",
  bl_release_date: "",
  container_no: "",
  vessel_name: "",
  bank_docs_sub_date: "",
  bank_bill_no: "",
  bank_to_bank_sending_docs_courier_awb_no: "",
  courier_awb_date: "",
  export_proceed_realization_value: "",
  proceed_realization_date: "",
  short_realization_value: "",
  short_realization_percentage: "",
  freight_charges_air_prepaid: "",
  fob_value: "",
  discount_value: "",
  gross_weight_kg: "",
  net_weight_kg: "",
  payment_tenor: "",
  packing_list_rcvd_date: "",
  ic_received_date: "",
  remarks: "",
};

const CommercialInvoiceCreate = (props) => {
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const history = useHistory();
  const [contracts, setContracts] = useState([]);
  const [pos, setPos] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [banks, setBanks] = useState([]);

  const [shippingModes, setShippingModes] = useState([
    "Sea",
    "Air",
    "Land",
    "River",
    "Sea/Air",
    "Sea/Air/Road",
  ]);

  const [draftAts, setDraftAts] = useState([
    "AT SIGHT",
    "60 DAYS",
    "90 DAYS",
    "120 DAYS",
    "160 DAYS",
    "190 DAYS",
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [b, bk] = await Promise.all([
          api.post("/common/buyers"),
          api.get("/common/banks"),
        ]);
        setBuyers(b.data?.data || []);
        setBanks(bk.data || []);
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };
    fetchData();
  }, []);

  /** 🔥 UNIVERSAL CHANGE HANDLER (input + select + textarea) */
  const handleChange = (name, value) => {
    if (name === "contract_id") {
      // Find contract details from already-fetched contracts
      const selectedContract = contracts.find(
        (item) => item.id === parseInt(value)
      );

      setForm((prev) => ({
        ...prev,
        contract_id: value,
        buyer_id: selectedContract?.buyer?.id || "",
        bank_id: selectedContract?.seller_bank_id || "",
      }));
      setPos(selectedContract.pos);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleInputChange = (e) => {
    handleChange(e.target.name, e.target.value);
  };

  /** Fetch contracts */
  const getContracts = async () => {
    try {
      const res = await api.post("/commercial/contracts");
      if (res.status === 200) setContracts(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getContracts();
  }, []);

  const [invItems, setInvItems] = useState([]);

  const getInvItems = async () => {
    if (!form.pos) return;

    try {
      const res = await api.post(
        "/commercial/get-invoiceable-po-items-by-pos",
        {
          ids: form.pos,
        }
      );
      const items = (res.data || []).map((item) => {
        const qty = Number(item.left_qty || 0);
        const fob = Number(item.fob || 0);

        return {
          ...item,
          total: qty * fob, // <-- auto calculate here
        };
      });

      setInvItems(items);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getInvItems();
  }, [form.pos]);

  const handleItemChange = (index, field, value) => {
    setInvItems((prev) => {
      const updated = [...prev];
      updated[index][field] = Number(value);

      const qty = Number(updated[index].left_qty || 0);
      const fob = Number(updated[index].fob || 0);

      updated[index].total = qty * fob;

      return updated;
    });
  };

  /** Validate */
  const validate = () => {
    let newErrors = {};
    if (!form.contract_id) newErrors.contract_id = "Contract ID is required";
    if (!form.invoice_no) newErrors.invoice_no = "Invoice No is required";
    if (!form.inv_date) newErrors.inv_date = "Invoice Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  console.log("POS", pos);

  /** Submit Handler */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const formData = new FormData();

    // append all simple form fields
    Object.entries(form).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // POS ARRAY
        value.forEach((v) => formData.append(`${key}[]`, v));
      } else {
        formData.append(key, value ?? "");
      }
    });

    // append invoice items as JSON
    formData.append("invoice_items", JSON.stringify(invItems));
    formData.append("pos_items", JSON.stringify(form.pos));

    setSaving(true);

    try {
      const res = await api.post("/commercial/commercial-invoices", formData);

      if (res.status !== 201) {
        alert("Failed to create invoice");
        setSaving(false);
        return;
      }

      history.push("/commercial/invoices");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  /** Render Helpers */
  const renderInput = (name, label, type = "text", note = null) => (
    <div className="col-md-2 create_tp_body">
      <label className="form-label">{label}</label>

      <input
        type={type}
        className={`form-control ${errors[name] ? "red-border" : ""}`}
        name={name}
        value={form[name] ?? ""}
        onChange={handleInputChange}
      />

      {errors[name] && <small className="text-danger">{errors[name]}</small>}

      {note && <div className="form-text">{note}</div>}
    </div>
  );

  const renderSelect = (
    name,
    label,
    options = [],
    isMulti = false,
    col = 2
  ) => (
    <div className={`col-md-${col} create_tp_body`}>
      <label className="form-label">{label}</label>
      <CustomSelect
        isMulti={isMulti}
        className={errors[name] ? "select_wo red-border" : "select_wo"}
        placeholder={`Select ${label}`}
        options={options}
        value={
          isMulti
            ? options.filter((opt) =>
                (form[name] ?? []).includes(String(opt.value))
              )
            : options.find((opt) => String(opt.value) === String(form[name])) ||
              null
        }
        onChange={(selected) =>
          handleChange(
            name,
            isMulti
              ? selected
                ? selected.map((o) => String(o.value))
                : []
              : selected
              ? String(selected.value)
              : ""
          )
        }
      />

      {errors[name] && <small className="text-danger">{errors[name]}</small>}
    </div>
  );

  useEffect(() => {
    props.setHeaderData({
      pageName: "NEW INVOICE",
      isNewButton: true,
      newButtonLink: "",
      newButtonText: "NEW INVOICE",
      isInnerSearch: true,
      innerSearchValue: "",
    });
  }, []);

  return (
    <div className="create_technical_pack">
      <form onSubmit={handleSubmit}>
        <div className="d-flex gap-2 justify-content-end">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "SAVING..." : "SAVE"}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => {
              setForm({ ...emptyForm });
              setErrors({});
            }}
          >
            Reset
          </button>
        </div>
        <br />
        <div className="row">
          {renderSelect(
            "contract_id",
            "EXP LC / CONTRACT *",
            contracts.map((c) => ({
              value: c.id,
              label: c.title,
            })),
            false
          )}
          {renderSelect(
            "pos",
            "POs",
            pos.map((p) => ({
              value: p.id,
              label: p.po_number,
            })),
            true,
            6
          )}

          {renderInput("style_po_no", "Style / PO No")}
          {renderInput("item_name", "Item Name")}
          {renderInput("order_buyer", "Order Buyer")}
          {renderInput("export_lc_contract_no", "Export LC / Contract No")}
          {renderSelect(
            "bank_id",
            "Bank",
            banks.map((b) => ({
              value: b.id,
              label: b.title,
            })),
            false
          )}
          {renderInput("invoice_no", "Invoice No *")}
          {renderInput("inv_date", "Invoice Date *", "date")}

          {renderInput("pcs_qty", "PCS Qty", "number")}
          {renderInput("ctns_qty", "CTNS Qty", "number")}

          {renderInput("exp_no", "EXP No")}
          {renderInput("exp_date", "EXP Date", "date")}
          {renderInput("exp_value", "EXP Value", "number")}

          {renderInput("ep_no", "EP No")}
          {renderInput("ep_date", "EP Date", "date")}

          {renderInput("export_shipping_bill_no", "Export Shipping Bill No")}
          {renderInput("shipping_bill_date", "Shipping Bill Date", "date")}
          {renderInput("ex_factory_date", "Ex Factory Date", "date")}

          {renderSelect(
            "mode_of_shipment",
            "Mode Of Shipment",
            shippingModes.map((s) => ({
              value: s,
              label: s,
            })),
            false
          )}

          {renderInput("destination_country", "Destination Country")}

          {renderInput("carrier_forwarder_name", "Carrier / Forwarder Name")}
          {renderInput("shipped_onboard_date", "Shipped Onboard Date", "date")}
          {renderInput("bl_no", "BL No")}
          {renderInput("bl_release_date", "BL Release Date", "date")}
          {renderInput(
            "bl_relase_date",
            "BL Relase Date (typo from backend)",
            "date"
          )}

          {renderInput("container_no", "Container No")}
          {renderInput("vessel_name", "Vessel Name")}
          {renderInput("bank_docs_sub_date", "Bank Docs Submit Date")}
          {renderInput("bank_bill_no", "Bank Bill No")}
          {renderInput(
            "bank_to_bank_sending_docs_courier_awb_no",
            "Courier AWB No"
          )}
          {renderInput("courier_awb_date", "Courier AWB Date", "date")}

          {renderInput(
            "export_proceed_realization_value",
            "Export Proceed Realization Value",
            "number"
          )}

          {renderInput(
            "proceed_realization_due_date",
            "Proceed Realization Due Date",
            "date"
          )}

          {renderInput(
            "short_realization_value",
            "Short Realization Value",
            "number"
          )}

          {renderInput(
            "proceed_realization_date",
            "Proceed Realization Date",
            "date"
          )}

          {renderInput(
            "freight_charges_air_prepaid",
            "Freight Charges Air Prepaid",
            "number"
          )}
          {renderInput(
            "short_realization_percentage",
            "Short Realization %",
            "number"
          )}

          {renderInput("fob_value", "FOB Value", "number")}
          {renderInput("discount_value", "Discount Value", "number")}

          {renderInput("gross_weight_kg", "Gross Weight (KG)", "number")}
          {renderInput("net_weight_kg", "Net Weight (KG)", "number")}
          {renderSelect(
            "payment_tenor",
            "Payment Tenor",
            draftAts.map((d) => ({
              value: d,
              label: d,
            })),
            false
          )}

          {renderInput(
            "packing_list_rcvd_date",
            "Packing List Received Date",
            "date"
          )}
          {renderInput("ic_received_date", "IC Received Date", "date")}

          {/* Remarks */}
          <div className="mb-3 col-12">
            <label className="form-label">Remarks</label>
            <textarea
              className={`form-control ${errors.remarks ? "red-border" : ""}`}
              name="remarks"
              rows={3}
              value={form.remarks}
              onChange={handleInputChange}
            ></textarea>

            {errors.remarks && (
              <small className="text-danger">{errors.remarks}</small>
            )}
          </div>
        </div>

        <div className="row">
          <h6 className="text-center">
            <u>DETAILS OF ORDER AND PRODUCT</u>
          </h6>
          <div className="Import_booking_item_table create_tp_body">
            <table className="table text-start align-middle table-bordered mb-0">
              <thead className="bg-dark text-white">
                <tr>
                  <th>SL</th>
                  <th>PO</th>
                  <th>ITEM</th>
                  <th>COLOR</th>
                  <th>SIZE</th>
                  <th>QTY(PCS)</th>
                  <th>PACK QTY</th>
                  <th>CTN. QTY</th>
                  <th>FOB(USD)</th>
                  <th>TOTAL (USD)</th>
                </tr>
              </thead>

              <tbody>
                {invItems.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.po?.po_number}</td>
                    <td>{item.po?.techpack?.techpack_number}</td>
                    <td>{item.color}</td>
                    <td>{item.size}</td>

                    {/* QTY */}
                    <td>
                      <input
                        className="form-control"
                        type="number"
                        value={item.left_qty}
                        onChange={(e) =>
                          handleItemChange(index, "left_qty", e.target.value)
                        }
                      />
                    </td>

                    {/* PACK QTY */}
                    <td>
                      <input
                        className="form-control"
                        type="number"
                        value={item.pack_qty}
                        onChange={(e) =>
                          handleItemChange(index, "pack_qty", e.target.value)
                        }
                      />
                    </td>

                    {/* CTN QTY */}
                    <td>
                      <input
                        className="form-control"
                        type="number"
                        value={item.ctns_qty}
                        onChange={(e) =>
                          handleItemChange(index, "ctns_qty", e.target.value)
                        }
                      />
                    </td>

                    {/* FOB */}
                    <td>
                      <input
                        className="form-control"
                        readOnly
                        type="number"
                        value={item.fob}
                        onChange={(e) =>
                          handleItemChange(index, "fob", e.target.value)
                        }
                      />
                    </td>

                    {/* TOTAL */}
                    <td>
                      <input
                        className="form-control"
                        type="number"
                        readOnly
                        value={item.total || 0}
                      />
                    </td>
                  </tr>
                ))}

                {/* ===== TOTAL CALCULATION ROW ===== */}
                <tr>
                  <td colSpan={5}>
                    <strong>TOTAL</strong>
                  </td>

                  {/* TOTAL QTY */}
                  <td>
                    <strong>
                      {invItems.reduce(
                        (sum, i) => sum + Number(i.left_qty || 0),
                        0
                      )}{" "}
                      PCS
                    </strong>
                  </td>

                  {/* TOTAL PACK QTY */}
                  <td>
                    <strong>
                      {invItems.reduce(
                        (sum, i) => sum + Number(i.pack_qty || 0),
                        0
                      )}
                    </strong>
                  </td>

                  {/* TOTAL CTN QTY */}
                  <td>
                    <strong>
                      {invItems.reduce(
                        (sum, i) => sum + Number(i.ctns_qty || 0),
                        0
                      )}
                    </strong>
                  </td>

                  {/* TOTAL AMOUNT (USD) */}
                  <td></td>
                  <td>
                    <strong>
                      {invItems
                        .reduce((sum, i) => sum + Number(i.total || 0), 0)
                        .toFixed(2)}{" "}
                      USD
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommercialInvoiceCreate;
