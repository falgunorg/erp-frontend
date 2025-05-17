import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import swal from "sweetalert";
import Select from "react-select";
import moment from "moment";

export default function CreateLc(props) {
  const history = useHistory();
  const userInfo = props.userData;
  const [spinner, setSpinner] = useState(false);

  // Contracts
  const [contracts, setContracts] = useState([]);
  const getContracts = async () => {
    setSpinner(true);
    var response = await api.post("/purchase-contracts");
    if (response.status === 200 && response.data) {
      setContracts(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const [banks, setBanks] = useState([]);
  const getBanks = async () => {
    setSpinner(true);
    var response = await api.get("/banks");
    if (response.status === 200 && response.data) {
      setBanks(response.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  // currencys
  const [currencies, setCurrencies] = useState([]);
  const getCurrencies = async () => {
    var response = await api.get("/currencies");
    if (response.status === 200 && response.data) {
      setCurrencies(response.data);
    }
  };

  // get all proformas
  const [proformas, setProformas] = useState([]);
  const getProformas = async () => {
    setSpinner(true);
    var response = await api.post("/proformas", {
      status: "Received",
      department: userInfo.department_title,
      designation: userInfo.designation_title,
      contract_id: formDataSet.contract_id,
      supplier_id: formDataSet.supplier_id,
    });
    if (response.status === 200 && response.data) {
      setProformas(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  // get all suppliers
  const [suppliers, setSuppliers] = useState([]);
  const getSuppliers = async () => {
    setSpinner(true);
    var response = await api.post("/suppliers");
    if (response.status === 200 && response.data) {
      setSuppliers(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const [errors, setErrors] = useState({});
  const [formDataSet, setFormDataSet] = useState({
    contract_id: "",
    supplier_id: "",
    proformas: [],
    currency: "",
    bank: "",
    lc_number: "",
    lc_validity: "",
    apply_date: "",
    issued_date: "",
    maturity_date: "",
    paid_date: "",
    commodity: "",
    pcc_avail: "",
  });

  const handleProformaChange = (selectedOptions) => {
    const selectedProformaIds = selectedOptions.map((option) => option.value);
    setFormDataSet((prevData) => ({
      ...prevData,
      proformas: selectedProformaIds,
    }));
  };

  const handleChange = (name, value) => {
    setFormDataSet({ ...formDataSet, [name]: value });
  };

  const filteredProformas = proformas.filter((proforma) =>
    formDataSet.proformas.includes(proforma.id)
  );
  const netTotal = filteredProformas.reduce(
    (total, proforma) => total + parseFloat(proforma.total),
    0
  );

  const validateForm = () => {
    let formErrors = {};
    // personal info
    if (!formDataSet.contract_id) {
      formErrors.contract_id = "Purchase Contract is required";
    }
    if (!formDataSet.supplier_id) {
      formErrors.supplier_id = "Supplier is required";
    }
    if (!formDataSet.lc_number) {
      formErrors.lc_number = "lc Number is required";
    }
    if (!formDataSet.currency) {
      formErrors.currency = "Currency is required";
    }
    if (!formDataSet.bank) {
      formErrors.bank = "Please Inter a Valid Bank Name";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };



  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      var data = new FormData();
      data.append("contract_id", formDataSet.contract_id);
      data.append("supplier_id", formDataSet.supplier_id);
      data.append("proformas", formDataSet.proformas);
      data.append("bank", formDataSet.bank);
      data.append("currency", formDataSet.currency);
      data.append("lc_number", formDataSet.lc_number);
      data.append("lc_validity", formDataSet.lc_validity);
      data.append("apply_date", formDataSet.apply_date);
      data.append("issued_date", formDataSet.issued_date);
      data.append("maturity_date", formDataSet.maturity_date);
      data.append("paid_date", formDataSet.paid_date);
      data.append("commodity", formDataSet.commodity);
      data.append("pcc_avail", formDataSet.pcc_avail);
      setSpinner(true);
      var response = await api.post("/lcs-create", data);
      if (response.status === 200 && response.data) {
        history.push("/commercial/lcs");
      } else {
        setErrors(response.data.errors);
      }
      setSpinner(false);
    }
  };

  useEffect(async () => {
    getContracts();
    getSuppliers();
    getProformas();
    getCurrencies();
    getBanks();
  }, []);

  useEffect(async () => {
    getProformas();
  }, [formDataSet.contract_id, formDataSet.supplier_id]);

  useEffect(() => {
    const checkAccess = async () => {
      if (props.userData?.department_title !== "Commercial") {
        await swal({
          icon: "error",
          text: "You Cannot Access This Section.",
          closeOnClickOutside: false,
        });

        history.push("/dashboard");
      }
    };
    checkAccess();
  }, [props, history]);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <form onSubmit={handleSubmit}>
        <div className="create_page_heading">
          <div className="page_name">Add New LC (Letter Of Credit)</div>
          <div className="actions">
            <button
              type="supmit"
              className="publish_btn btn btn-warning bg-falgun"
            >
              Save
            </button>
            <Link
              to="/commercial/lcs"
              className="btn btn-danger rounded-circle"
            >
              <i className="fal fa-times"></i>
            </Link>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="personal_data">
            <div className="row">
              <div className="col-lg-3">
                <div className="form-group">
                  <label>
                    Purchase Contract<sup>*</sup>
                  </label>
                  <Select
                    placeholder="Select or Search"
                    onChange={(selectedOption) =>
                      handleChange("contract_id", selectedOption.value)
                    }
                    value={
                      contracts.find(
                        (item) => item.id === formDataSet.contract_id
                      )
                        ? {
                            value: formDataSet.contract_id,
                            label:
                              contracts.find(
                                (item) => item.id === formDataSet.contract_id
                              ).tag_number || "",
                          }
                        : null
                    }
                    name="contract_id"
                    options={contracts.map((item) => ({
                      value: item.id,
                      label: item.tag_number,
                    }))}
                  />

                  {errors.contract_id && (
                    <div className="errorMsg">{errors.contract_id}</div>
                  )}
                </div>
              </div>

              <div className="col-lg-3">
                <div className="form-group">
                  <label>
                    Supplier <sup>*</sup>
                  </label>
                  <Select
                    placeholder="Select or Search"
                    onChange={(selectedOption) =>
                      handleChange("supplier_id", selectedOption.value)
                    }
                    value={
                      suppliers.find(
                        (item) => item.id === formDataSet.supplier_id
                      )
                        ? {
                            value: formDataSet.supplier_id,
                            label:
                              suppliers.find(
                                (item) => item.id === formDataSet.supplier_id
                              ).company_name || "",
                          }
                        : null
                    }
                    name="supplier_id"
                    options={suppliers.map((item) => ({
                      value: item.id,
                      label: item.company_name,
                    }))}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group">
                  <label>
                    Proforma Invoices<sup>*</sup>
                  </label>
                  <Select
                    isMulti
                    name="proformas"
                    placeholder="Select or Search"
                    value={formDataSet.proformas.map((proformaId) => {
                      const selectedProforma = proformas.find(
                        (proforma) => proforma.id === proformaId
                      );
                      return {
                        value: proformaId,
                        label: selectedProforma
                          ? selectedProforma.title +
                            " | " +
                            selectedProforma.proforma_number +
                            " | " +
                            selectedProforma.total +
                            " | " +
                            selectedProforma.currency
                          : "",
                      };
                    })}
                    onChange={handleProformaChange}
                    options={proformas.map((proforma) => ({
                      value: proforma.id,
                      label:
                        proforma.title +
                        " | " +
                        proforma.proforma_number +
                        " | " +
                        proforma.total +
                        " | " +
                        proforma.currency,
                    }))}
                  />

                  {errors.proformas && (
                    <>
                      <div className="errorMsg">{errors.proformas}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>

              <div className="col-lg-3">
                <div className="form-group">
                  <br />
                  <label>
                    Currency<sup>*</sup>
                  </label>

                  <Select
                    placeholder="Select or Search"
                    onChange={(selectedOption) =>
                      handleChange("currency", selectedOption.value)
                    }
                    value={
                      currencies.find(
                        (item) => item.code === formDataSet.currency
                      )
                        ? {
                            value: formDataSet.currency,
                            label:
                              currencies.find(
                                (item) => item.code === formDataSet.currency
                              ).code || "",
                          }
                        : null
                    }
                    name="currency"
                    options={currencies.map((item) => ({
                      value: item.code,
                      label: item.code,
                    }))}
                  />
                  {errors.currency && (
                    <div className="errorMsg">{errors.currency}</div>
                  )}
                </div>
              </div>

              <div className="col-lg-3">
                <div className="form-group">
                  <br />
                  <label>
                    Bank Name <sup>*</sup>
                  </label>
                  <select
                    name="bank"
                    value={formDataSet.bank}
                    onChange={(event) =>
                      handleChange("bank", event.target.value)
                    }
                    className="form-select"
                  >
                    <option value="">Select Bank</option>
                    {banks.length > 0 ? (
                      banks.map((item, index) => (
                        <option key={index} value={item.id}>
                          {item.title}
                        </option>
                      ))
                    ) : (
                      <option value="">No bank found</option>
                    )}
                  </select>
                  {errors.bank && <div className="errorMsg">{errors.bank}</div>}
                </div>
              </div>

              <div className="col-lg-3">
                <br />
                <div className="form-group">
                  <label>
                    LC Number <sup>*</sup>
                  </label>
                  <input
                    type="text"
                    name="lc_number"
                    value={formDataSet.lc_number}
                    onChange={(event) =>
                      handleChange("lc_number", event.target.value)
                    }
                    className="form-control"
                  />
                  {errors.lc_number && (
                    <div className="errorMsg">{errors.lc_number}</div>
                  )}
                </div>
              </div>

              <div className="col-lg-3">
                <div className="form-group">
                  <br />
                  <label>LC Validity</label>
                  <select
                    value={formDataSet.lc_validity}
                    onChange={(event) =>
                      handleChange("lc_validity", event.target.value)
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

              <div className="col-lg-3">
                <div className="form-group">
                  <label>Apply Date</label>
                  <input
                    type="date"
                    name="apply_date"
                    value={formDataSet.apply_date}
                    onChange={(event) =>
                      handleChange("apply_date", event.target.value)
                    }
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label>Issued Date</label>
                  <input
                    type="date"
                    name="issued_date"
                    value={formDataSet.issued_date}
                    onChange={(event) =>
                      handleChange("issued_date", event.target.value)
                    }
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label>Maturity Date</label>
                  <input
                    type="date"
                    name="maturity_date"
                    value={formDataSet.maturity_date}
                    onChange={(event) =>
                      handleChange("maturity_date", event.target.value)
                    }
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label>Paid Date</label>
                  <input
                    type="date"
                    name="paid_date"
                    value={formDataSet.paid_date}
                    onChange={(event) =>
                      handleChange("paid_date", event.target.value)
                    }
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label>Commodity</label>
                  <input
                    type="text"
                    onChange={(event) =>
                      handleChange("commodity", event.target.value)
                    }
                    name="commodity"
                    value={formDataSet.commodity}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="col-lg-3">
                <div className="form-group">
                  <label>PCC Avail</label>
                  <input
                    type="text"
                    name="pcc_avail"
                    value={formDataSet.pcc_avail}
                    onChange={(event) =>
                      handleChange("pcc_avail", event.target.value)
                    }
                    className="form-control"
                  />
                </div>
              </div>
            </div>
            <hr></hr>
            <h6 className="text-center">
              <u>Proforma Invoices</u>
            </h6>
            <hr />
            <div className="Import_booking_item_table">
              <table className="table text-start align-middle table-bordered table-hover mb-0">
                <thead className="bg-dark text-white">
                  <tr>
                    <th>SL</th>
                    <th>PI</th>
                    <th>Responsible MR</th>
                    <th>Issued Date</th>
                    <th>Validity</th>
                    <th>Purchase Contract</th>
                    <th>Status</th>
                    <th>Buyer</th>
                    <th>Net Weight</th>
                    <th>Gross Weight</th>
                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProformas.map((item, index) => (
                    <tr key={index}>
                      <td>{item.proforma_number}</td>
                      <td>{item.title}</td>
                      <td>{item.user}</td>
                      <td>{moment(item.issued_date).format("ll")}</td>
                      <td>{item.pi_validity}</td>
                      <td>{item.contract_number}</td>
                      <td>{item.status}</td>
                      <td>{item.buyer}</td>
                      <td>{item.net_weight}</td>
                      <td>{item.gross_weight}</td>
                      <td>
                        {item.total} {item.currency}
                      </td>
                    </tr>
                  ))}
                  <br />
                  <br />
                  <tr className="text-center">
                    <td colSpan={10}>
                      <h5>Items Value</h5>
                    </td>
                    <td>
                      <h5>{netTotal}</h5>
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
              <br />
              <br />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
