import React, { useState, useEffect, useCallback } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import swal from "sweetalert";
import CustomSelect from "elements/CustomSelect";
import moment from "moment";
import MultipleFileInput from "elements/techpack/MultipleFileInput";
import QuailEditor from "elements/QuailEditor";

export default function EditLc({ userData, setHeaderData }) {
  const { id } = useParams();
  const history = useHistory();

  const [spinner, setSpinner] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [proformas, setProformas] = useState([]);
  const [errors, setErrors] = useState({});

  const [formDataSet, setFormDataSet] = useState({
    contract_id: "",
    supplier_id: "",
    proformas: [],
    lc_number: "",
    lc_validity: "",
    apply_date: "",
    issued_date: "",
    maturity_date: "",
    paid_date: "",
    commodity: "",
    pcc_avail: "",
    payment_terms: "",
    mode_of_shipment: "",
    port_of_loading: "",
    port_of_discharge: "",
    net_weight: "",
    gross_weight: "",
    freight_charge: "",
    description: "",
  });

  // 🧩 Utility: single handler for updates
  const handleChange = useCallback((name, value) => {
    setFormDataSet((prev) => ({ ...prev, [name]: value }));
  }, []);

  // 🧩 Validate required fields
  const validateForm = useCallback(() => {
    const required = [
      "contract_id",
      "supplier_id",
      "proformas",
      "lc_number",
      "commodity",
      "payment_terms",
      "mode_of_shipment",
    ];
    const newErrors = {};
    for (const key of required) {
      const val = formDataSet[key];
      if (Array.isArray(val) ? !val.length : !val)
        newErrors[key] = `${key.replace(/_/g, " ")} is required`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formDataSet]);

  // --- Fetchers ---
  const getContracts = useCallback(async () => {
    try {
      const res = await api.post("/merchandising/purchase-contracts");
      if (res.status === 200) setContracts(res.data?.data || []);
    } catch (err) {
      console.error("getContracts:", err);
    }
  }, []);

  const getSuppliers = useCallback(async () => {
    try {
      const res = await api.post("/admin/suppliers");
      if (res.status === 200) setSuppliers(res.data?.data || []);
    } catch (err) {
      console.error("getSuppliers:", err);
    }
  }, []);

  const getProformas = useCallback(
    async (contract_id, supplier_id) => {
      if (!contract_id || !supplier_id) return setProformas([]);
      try {
        const res = await api.post("/merchandising/proformas", {
          status: "Received",
          department: userData?.department_title,
          designation: userData?.designation_title,
          contract_id,
          supplier_id,
        });
        if (res.status === 200) setProformas(res.data?.data || []);
      } catch (err) {
        console.error("getProformas:", err);
      }
    },
    [userData]
  );

  const getLcDetails = useCallback(async () => {
    setSpinner(true);
    try {
      const res = await api.post("/commercial/lcs-show", { id });
      if (res.status === 200 && res.data?.data) {
        const lc = res.data.data;

        // ✅ Handle proformas correctly (stringified JSON in backend)
        let parsedProformas = [];
        try {
          parsedProformas = JSON.parse(lc.proformas);
        } catch {
          // fallback if it's comma separated
          parsedProformas = lc.proformas
            ? lc.proformas.replace(/\[|\]/g, "").split(",").map(Number)
            : [];
        }

        setFormDataSet({
          contract_id: lc.contract_id || "",
          supplier_id: lc.supplier_id || "",
          proformas: parsedProformas,
          lc_number: lc.lc_number || "",
          lc_validity: lc.lc_validity || "",
          apply_date: lc.apply_date || "",
          issued_date: lc.issued_date || "",
          maturity_date: lc.maturity_date || "",
          paid_date: lc.paid_date || "",
          commodity: lc.commodity || "",
          pcc_avail: lc.pcc_avail || "",
          payment_terms: lc.payment_terms || "",
          mode_of_shipment: lc.mode_of_shipment || "",
          port_of_loading: lc.port_of_loading || "",
          port_of_discharge: lc.port_of_discharge || "",
          net_weight: lc.net_weight || "",
          gross_weight: lc.gross_weight || "",
          freight_charge: lc.freight_charge || "",
          description: lc.description || "",
        });

        // ✅ Prefer LC response piList over separate fetch (less API load)
        if (lc.piList?.length) {
          setProformas(lc.piList);
        } else if (lc.contract_id && lc.supplier_id) {
          await getProformas(lc.contract_id, lc.supplier_id);
        }
      } else {
        swal("Error", "LC not found", "error");
        history.push("/commercial/lcs");
      }
    } catch (err) {
      console.error("getLcDetails:", err);
    } finally {
      setSpinner(false);
    }
  }, [id, getProformas, history]);

  // --- Lifecycle ---
  useEffect(() => {
    getContracts();
    getSuppliers();
    getLcDetails();
  }, [getContracts, getSuppliers, getLcDetails]);

  // If user changes contract/supplier manually
  useEffect(() => {
    if (!formDataSet.proformas.length) {
      getProformas(formDataSet.contract_id, formDataSet.supplier_id);
    }
  }, [formDataSet.contract_id, formDataSet.supplier_id, getProformas]);

  // --- Access control ---
  useEffect(() => {
    if (userData?.department_title !== "Commercial") {
      swal({
        icon: "error",
        text: "You cannot access this section.",
        closeOnClickOutside: false,
      }).then(() => history.push("/dashboard"));
    }
  }, [userData, history]);

  // --- Header setup ---
  useEffect(() => {
    setHeaderData({
      pageName: "EDIT BBLC",
      isNewButton: true,
      newButtonLink: "",
      newButtonText: "New BB",
      isInnerSearch: true,
      innerSearchValue: "",
    });
  }, [setHeaderData]);

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    for (const [key, val] of Object.entries(formDataSet)) {
      formData.append(
        key,
        Array.isArray(val) ? JSON.stringify(val) : val || ""
      );
    }
    selectedFiles.forEach((file) => formData.append("attatchments[]", file));
    formData.append("id", id);

    setSpinner(true);
    try {
      const res = await api.post("/commercial/lcs-update", formData);
      if (res.status === 200) {
        swal("Success", "LC Updated Successfully", "success");
        history.push("/commercial/lcs");
      } else {
        setErrors(res.data?.errors || {});
      }
    } catch (err) {
      console.error("handleSubmit:", err);
      swal("Error", err.message || "Something went wrong", "error");
    } finally {
      setSpinner(false);
    }
  };

  // --- Derived Calculations ---
  const filteredProformas = proformas.filter((p) =>
    formDataSet.proformas.includes(p.id)
  );

  const sumField = (field) =>
    filteredProformas.reduce((sum, p) => sum + (parseFloat(p[field]) || 0), 0);

  const totalNetWeight = sumField("net_weight");
  const totalGrossWeight = sumField("gross_weight");
  const totalFreightCharge = sumField("freight_charge");
  const totalAmount = sumField("total");

  // --- JSX ---
  return (
    <div className="create_edit_page create_technical_pack">
      {spinner && <Spinner />}
      <form onSubmit={handleSubmit} className="create_tp_body">
        <div className="d-flex align-items-end justify-content-end">
          <button
            type="submit"
            className="publish_btn btn btn-warning bg-falgun me-4"
          >
            Update
          </button>
          <Link to="/commercial/lcs" className="btn btn-danger rounded-circle">
            <i className="fal fa-times"></i>
          </Link>
        </div>
        <hr />

        <div className="col-lg-12">
          <div className="personal_data">
            <div className="row">
              {/* Purchase Contract */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">
                    Purchase Contract <span className="text-danger">*</span>
                  </label>
                  <CustomSelect
                    placeholder="Select or Search"
                    onChange={(opt) =>
                      handleChange("contract_id", opt?.value || "")
                    }
                    value={
                      contracts.find((c) => c.id === formDataSet.contract_id)
                        ? {
                            value: formDataSet.contract_id,
                            label:
                              contracts.find(
                                (c) => c.id === formDataSet.contract_id
                              ).title || "",
                          }
                        : null
                    }
                    name="contract_id"
                    options={contracts.map((c) => ({
                      value: c.id,
                      label: c.title,
                    }))}
                  />
                  {errors.contract_id && (
                    <div className="errorMsg">{errors.contract_id}</div>
                  )}
                </div>
              </div>

              {/* Supplier */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">
                    Supplier <span className="text-danger">*</span>
                  </label>
                  <CustomSelect
                    placeholder="Select or Search"
                    onChange={(opt) =>
                      handleChange("supplier_id", opt?.value || "")
                    }
                    value={
                      suppliers.find((s) => s.id === formDataSet.supplier_id)
                        ? {
                            value: formDataSet.supplier_id,
                            label:
                              suppliers.find(
                                (s) => s.id === formDataSet.supplier_id
                              ).company_name || "",
                          }
                        : null
                    }
                    name="supplier_id"
                    options={suppliers.map((s) => ({
                      value: s.id,
                      label: s.company_name,
                    }))}
                  />
                  {errors.supplier_id && (
                    <div className="errorMsg">{errors.supplier_id}</div>
                  )}
                </div>
              </div>

              {/* Proformas (multi) */}
              <div className="col-lg-6">
                <div className="form-group">
                  <label className="form-label">
                    Proforma Invoices <span className="text-danger">*</span>
                  </label>

                  <CustomSelect
                    isMulti
                    name="proformas"
                    placeholder="Select or Search"
                    options={proformas.map((proforma) => ({
                      value: proforma.id,
                      label: `${proforma.title || "N/A"} | ${
                        proforma.total || 0
                      }`,
                    }))}
                    value={proformas
                      .filter((p) => formDataSet.proformas.includes(p.id))
                      .map((p) => ({
                        value: p.id,
                        label: `${p.title || "N/A"} | ${
                          p.total || 0
                        }`,
                      }))}
                    onChange={(selectedOptions) => {
                      const selectedIds = selectedOptions
                        ? selectedOptions.map((opt) => opt.value)
                        : [];
                      setFormDataSet((prev) => ({
                        ...prev,
                        proformas: selectedIds,
                      }));
                    }}
                    error={errors.proformas}
                  />

                  {errors.proformas && (
                    <div className="errorMsg">{errors.proformas}</div>
                  )}
                </div>
              </div>

              {/* LC Number */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">
                    LC Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="lc_number"
                    value={formDataSet.lc_number}
                    onChange={(e) => handleChange("lc_number", e.target.value)}
                    className="form-control"
                  />
                  {errors.lc_number && (
                    <div className="errorMsg">{errors.lc_number}</div>
                  )}
                </div>
              </div>

              {/* LC Validity */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">LC Validity</label>
                  <select
                    value={formDataSet.lc_validity}
                    onChange={(e) =>
                      handleChange("lc_validity", e.target.value)
                    }
                    name="lc_validity"
                    className="form-select"
                  >
                    <option value="">Select One</option>
                    <option value="60 DAYS">60 DAYS</option>
                    <option value="90 DAYS">90 DAYS</option>
                    <option value="120 DAYS">120 DAYS</option>
                    <option value="160 DAYS">160 DAYS</option>
                  </select>
                </div>
              </div>

              {/* Apply Date */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">Apply Date</label>
                  <input
                    type="date"
                    name="apply_date"
                    value={formDataSet.apply_date}
                    onChange={(e) => handleChange("apply_date", e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Issued Date */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">Issued Date</label>
                  <input
                    type="date"
                    name="issued_date"
                    value={formDataSet.issued_date}
                    onChange={(e) =>
                      handleChange("issued_date", e.target.value)
                    }
                    className="form-control"
                  />
                </div>
              </div>

              {/* Maturity Date */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">Maturity Date</label>
                  <input
                    type="date"
                    name="maturity_date"
                    value={formDataSet.maturity_date}
                    onChange={(e) =>
                      handleChange("maturity_date", e.target.value)
                    }
                    className="form-control"
                  />
                </div>
              </div>

              {/* Paid Date */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">Paid Date</label>
                  <input
                    type="date"
                    name="paid_date"
                    value={formDataSet.paid_date}
                    onChange={(e) => handleChange("paid_date", e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Commodity */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">
                    Commodity <span className="text-danger">*</span>
                  </label>
                  <select
                    onChange={(e) => handleChange("commodity", e.target.value)}
                    name="commodity"
                    value={formDataSet.commodity}
                    className="form-control"
                  >
                    <option value="">Select Commodity</option>
                    <option value="Fabric">Fabric</option>
                    <option value="Sewing Trims">Sewing Trims</option>
                    <option value="Finishing Trims">Finishing Trims</option>
                    <option value="Packing Trims">Packing Trims</option>
                  </select>
                  {errors.commodity && (
                    <div className="errorMsg">{errors.commodity}</div>
                  )}
                </div>
              </div>

              {/* PCC Avail */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">PCC Avail</label>
                  <input
                    type="text"
                    name="pcc_avail"
                    value={formDataSet.pcc_avail}
                    onChange={(e) => handleChange("pcc_avail", e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Net Weight */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">Net Weight(KG)</label>
                  <input
                    readOnly
                    type="text"
                    value={totalNetWeight.toFixed(2)}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Gross Weight */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">Gross Weight(KG)</label>
                  <input
                    readOnly
                    type="text"
                    value={totalGrossWeight.toFixed(2)}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Freight Charge */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">Freight Charge</label>
                  <input
                    readOnly
                    value={totalFreightCharge.toFixed(2)}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">Total LC Value</label>
                  <input
                    readOnly
                    type="number"
                    value={totalAmount.toFixed(2)}
                    className="form-control"
                  />
                </div>
              </div>
            </div>

            <hr />

            {/* Proforma table */}
            <h6 className="text-center">
              <u>Proforma Invoices</u>
            </h6>
            <div className="Import_booking_item_table">
              <table className="table text-start align-middle table-bordered table-hover mb-0">
                <thead className="bg-dark text-white">
                  <tr>
                    <th>SL</th>
                    <th>PI</th>
                    <th>Responsible MR</th>
                    <th>Issued Date</th>
                    <th>Validity</th>
                    <th>Status</th>
                    <th>Net Weight(KG)</th>
                    <th>Gross Weight(KG)</th>
                    <th>Freight Charge</th>
                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProformas.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.title}</td>
                      <td>{item.user}</td>
                      <td>
                        {item.issued_date
                          ? moment(item.issued_date).format("ll")
                          : ""}
                      </td>
                      <td>{item.pi_validity}</td>
                      <td>{item.status}</td>
                      <td>{item.net_weight}</td>
                      <td>{item.gross_weight}</td>
                      <td>{item.freight_charge}</td>
                      <td>{item.total}</td>
                    </tr>
                  ))}

                  <tr>
                    <td colSpan={6}>
                      <strong>TOTAL</strong>
                    </td>
                    <td>
                      <strong>{Number(totalNetWeight).toFixed(2)} (KG)</strong>
                    </td>
                    <td>
                      <strong>
                        {Number(totalGrossWeight).toFixed(2)} (KG)
                      </strong>
                    </td>
                    <td>
                      <strong>
                        {Number(totalFreightCharge).toFixed(2)} (USD)
                      </strong>
                    </td>
                    <td>
                      <strong>{Number(totalAmount).toFixed(2)} (USD)</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <hr />

            {/* Payment / Shipping / Ports / Description */}
            <div className="card-body row g-3">
              <div className="col-lg-3">
                <label className="form-label">
                  Payment Terms <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  value={formDataSet.payment_terms}
                  onChange={(e) =>
                    handleChange("payment_terms", e.target.value)
                  }
                />
                {errors.payment_terms && (
                  <div className="errorMsg">{errors.payment_terms}</div>
                )}
              </div>

              <div className="col-lg-3">
                <label className="form-label">
                  Mode of Shipment <span className="text-danger">*</span>
                </label>
                <select
                  className="form-control"
                  value={formDataSet.mode_of_shipment}
                  onChange={(e) =>
                    handleChange("mode_of_shipment", e.target.value)
                  }
                >
                  <option value="">Select One</option>
                  <option value="Sea">Sea</option>
                  <option value="Air">Air</option>
                  <option value="Road">Road</option>
                </select>
                {errors.mode_of_shipment && (
                  <div className="errorMsg">{errors.mode_of_shipment}</div>
                )}
              </div>

              <div className="col-lg-3">
                <label className="form-label">Port of Loading</label>
                <input
                  className="form-control"
                  value={formDataSet.port_of_loading}
                  onChange={(e) =>
                    handleChange("port_of_loading", e.target.value)
                  }
                />
              </div>

              <div className="col-lg-3">
                <label className="form-label">Port of Discharge</label>
                <input
                  className="form-control"
                  value={formDataSet.port_of_discharge}
                  onChange={(e) =>
                    handleChange("port_of_discharge", e.target.value)
                  }
                />
              </div>

              <div className="col-lg-12 mt-3">
                <label className="form-label">Description</label>
                <QuailEditor
                  content={formDataSet.description}
                  onContentChange={(val) => handleChange("description", val)}
                />
              </div>
            </div>
            <div className="col-lg-12 mt-3">
              <MultipleFileInput
                label="Attatchments"
                inputId="Attatchments"
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
