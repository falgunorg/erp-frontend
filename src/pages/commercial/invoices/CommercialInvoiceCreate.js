import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "services/api";
import CustomSelect from "elements/CustomSelect";

// ALL form fields
const emptyForm = {
  contract_id: "",
  invoice_no: "",
  inv_date: "",
  exp_no: "",
  exp_date: "",
  pos: [],
  buyer_id: "",
  bank_id: "",
  ep_no: "",
  ep_date: "",
  export_shipping_bill_no: "",
  shipping_bill_date: "",
  ex_factory_date: "",
  mode_of_shipment: "",
  destination_country: "",
  forwarder: "",
  onboard_date: "",
  freight_charge: "",
  bl_no: "",
  bl_relase_date: "",
  container_no: "",
  vessel_name: "",
  ic_received_date: "",
  bank_docs_submit_date: "",
  bank_bill_no: "",
  bank_to_bank_sending_docs_courier_awb_no: "",
  buyer_bank_docs_receiveing_date: "",
  payment_tenor: "",
  proceed_realization_due_date: "",
  export_proceed_realization_value: "",
  proceed_realization_date: "",
  short_realization_value: "",
  short_realization_percentage: "",
  gross_weight: "",
  net_weight: "",
  total_cbm: "",
  ctn_size: "",
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
  const handleChange = async (name, value) => {
    if (name === "contract_id") {
      try {
        const response = await api.post("/commercial/contracts/show", {
          id: value,
        });

        if (response.status === 200 && response.data) {
          const data = response.data.data;

          // Reset po_list when techpack changes
          setForm((prev) => ({
            ...prev,
            contract_id: value,
            buyer_id: data.buyer?.id || "",
            bank_id: data.seller_bank_id || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching technical package data:", error);
      }
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
      const res = await api.post("/merchandising/purchase-contracts");
      if (res.status === 200) setContracts(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  /** Fetch POs on contract change */
  const getPos = async () => {
    if (!form.contract_id) return;
    try {
      const res = await api.post("/merchandising/pos-public", {
        purchase_contract_id: form.contract_id,
      });
      if (res.status === 200) setPos(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getContracts();
  }, []);

  useEffect(() => {
    getPos();
  }, [form.contract_id]);

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
            "Contract ID *",
            contracts.map((c) => ({
              value: c.id,
              label: c.title,
            })),
            false
          )}

          {renderInput("invoice_no", "Invoice No *")}
          {renderInput("inv_date", "Invoice Date *", "date")}

          {renderSelect(
            "pos",
            "POS",
            pos.map((p) => ({
              value: p.id,
              label: p.po_number,
            })),
            true,
            6
          )}

          {renderSelect(
            "buyer_id",
            "Buyer",
            buyers.map((b) => ({
              value: b.id,
              label: b.name,
            })),
            false
          )}

          {renderSelect(
            "bank_id",
            "Bank",
            banks.map((b) => ({
              value: b.id,
              label: b.title,
            })),
            false
          )}

          {renderInput("exp_no", "EXP No")}
          {renderInput("exp_date", "EXP Date", "date")}
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
          {renderInput("forwarder", "Forwarder")}
          {renderInput("onboard_date", "Onboard Date", "date")}
          {renderInput("freight_charge", "Freight Charge", "number")}
          {renderInput("bl_no", "BL No")}
          {renderInput("bl_relase_date", "BL Release Date", "date")}
          {renderInput("container_no", "Container No")}
          {renderInput("vessel_name", "Vessel Name")}
          {renderInput("ic_received_date", "IC Received Date", "date")}
          {renderInput(
            "bank_docs_submit_date",
            "Bank Docs Submit Date",
            "date"
          )}
          {renderInput("bank_bill_no", "Bank Bill No")}
          {renderInput(
            "bank_to_bank_sending_docs_courier_awb_no",
            "Courier AWB No"
          )}
          {renderInput(
            "buyer_bank_docs_receiveing_date",
            "Buyer Bank Docs Receiving Date",
            "date"
          )}
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
            "proceed_realization_due_date",
            "Proceed Realization Due Date",
            "date"
          )}
          {renderInput(
            "export_proceed_realization_value",
            "Export Proceed Realization Value",
            "number"
          )}
          {renderInput(
            "proceed_realization_date",
            "Proceed Realization Date",
            "date"
          )}
          {renderInput(
            "short_realization_value",
            "Short Realization Value",
            "number"
          )}
          {renderInput(
            "short_realization_percentage",
            "Short Realization %",
            "number"
          )}
          {renderInput("gross_weight", "Total Gross Weight", "number")}
          {renderInput("net_weight", "Total Net Weight", "number")}
          {renderInput("total_cbm", "Total CBM")}
          {renderInput("ctn_size", "CTN Size")}

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
