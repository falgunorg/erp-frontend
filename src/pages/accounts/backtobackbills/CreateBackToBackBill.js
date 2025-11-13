import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import CustomSelect from "elements/CustomSelect";
import Spinner from "elements/Spinner";
import api from "services/api";
import swal from "sweetalert";

export default function CreateBackToBackBill(props) {
  const history = useHistory();
  const [lcs, setLcs] = useState([]);
  const [contracts, setContracts] = useState([]);
  // ✅ Fetch contracts
  const getContracts = async () => {
    try {
      const response = await api.post("/commercial/contracts"); // ✅ use GET
      if (response.data.status === "success") {
        const data = response.data.data || [];
        setContracts(data);
      } else {
        console.error("Unexpected response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };

  useEffect(() => {
    getContracts();
  }, []);
  const [spinner, setSpinner] = useState(false);
  const [errors, setErrors] = useState({});
  const [formDataSet, setFormDataSet] = useState({
    contract_id: "",
    lc_id: "",
    bc_contract_no: "",
    user_ref_no: "",
    issued_date: "",
    contract_amount: "",
    bill_amount: "",
    bill_amount_liqd: "",
    charge_amount: "",
    maturity_date: "",
    paid_date: "",
    source_of_fund: "",
  });

  const handleChange = (name, value) => {
    setFormDataSet((prev) => ({ ...prev, [name]: value }));
  };

  const getLcs = async () => {
    try {
      const response = await api.post("/commercial/lcs", {
        contract_id: formDataSet.contract_id,
      });
      if (response.data.status === "success") {
        const data = response.data.data || [];
        setLcs(data);
      } else {
        console.error("Unexpected response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };

  useEffect(() => {
    getLcs();
  }, [formDataSet.contract_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSpinner(true);
    setErrors({});

    try {
      const response = await api.post(
        "/accounts/back-to-back-bills",
        formDataSet
      );
      if (response.status === 201) {
        swal("Success", "LC Created Successfully", "success");

        history.push("/accounts/bb-bills");
      } else {
        console.error("Unexpected response:", response.data);
      }
    } catch (err) {
      setErrors({ submit: "Something went wrong." });
    } finally {
      setSpinner(false);
    }
  };

  useEffect(async () => {
    props.setHeaderData({
      pageName: "ADD BB BILLS",
      isNewButton: true,
      newButtonLink: "",
      newButtonText: "New PC",
      isInnerSearch: true,
      innerSearchValue: "",
    });
  }, []);

  return (
    <div className="create_edit_page create_technical_pack">
      {spinner && <Spinner />}

      <form onSubmit={handleSubmit} className="create_tp_body">
        {/* Header Buttons */}
        <div className="d-flex align-items-end justify-content-end">
          <button
            type="submit"
            className="publish_btn btn btn-warning bg-falgun me-4"
          >
            Save
          </button>
          <Link
            to="/accounts/bb-bills"
            className="btn btn-danger rounded-circle"
          >
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

              {/* LC ID */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">
                    LC No. <span className="text-danger">*</span>
                  </label>
                  <CustomSelect
                    placeholder="Select or Search"
                    onChange={(opt) => handleChange("lc_id", opt?.value || "")}
                    value={
                      lcs.find((l) => l.id === formDataSet.lc_id)
                        ? {
                            value: formDataSet.lc_id,
                            label:
                              lcs.find((l) => l.id === formDataSet.lc_id)
                                .lc_number || "",
                          }
                        : null
                    }
                    name="lc_id"
                    options={lcs.map((l) => ({
                      value: l.id,
                      label: l.lc_number,
                    }))}
                  />
                  {errors.lc_id && (
                    <div className="errorMsg">{errors.lc_id}</div>
                  )}
                </div>
              </div>

              {/* BC Contract No */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">BC Contract No</label>
                  <input
                    type="text"
                    name="bc_contract_no"
                    value={formDataSet.bc_contract_no}
                    onChange={(e) =>
                      handleChange("bc_contract_no", e.target.value)
                    }
                    className="form-control"
                  />
                </div>
              </div>

              {/* User Ref. No */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">User Ref. No</label>
                  <input
                    type="text"
                    name="user_ref_no"
                    value={formDataSet.user_ref_no}
                    onChange={(e) =>
                      handleChange("user_ref_no", e.target.value)
                    }
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

              {/* Contract Amount */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">Contract Amount</label>
                  <input
                    type="number"
                    name="contract_amount"
                    value={formDataSet.contract_amount}
                    onChange={(e) =>
                      handleChange("contract_amount", e.target.value)
                    }
                    className="form-control text-end"
                  />
                </div>
              </div>

              {/* Bill Amount */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">Bill Amount</label>
                  <input
                    type="number"
                    name="bill_amount"
                    value={formDataSet.bill_amount}
                    onChange={(e) =>
                      handleChange("bill_amount", e.target.value)
                    }
                    className="form-control text-end"
                  />
                </div>
              </div>

              {/* {Bill Amount Liquid} */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">Bill Amount LIQD.</label>
                  <input
                    type="number"
                    name="bill_amount_liqd"
                    value={formDataSet.bill_amount_liqd}
                    onChange={(e) =>
                      handleChange("bill_amount_liqd", e.target.value)
                    }
                    className="form-control text-end"
                  />
                </div>
              </div>

              {/* Charge Amount */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">Charge Amount</label>
                  <input
                    type="number"
                    name="charge_amount"
                    value={formDataSet.charge_amount}
                    onChange={(e) =>
                      handleChange("charge_amount", e.target.value)
                    }
                    className="form-control text-end"
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

              {/* Source of Fund */}
              <div className="col-lg-3">
                <div className="form-group">
                  <label className="form-label">Source of Fund</label>
                  <input
                    type="text"
                    name="source_of_fund"
                    value={formDataSet.source_of_fund}
                    onChange={(e) =>
                      handleChange("source_of_fund", e.target.value)
                    }
                    className="form-control"
                  />
                </div>
              </div>
            </div>

            <hr />

            {errors.submit && (
              <div className="errorMsg text-danger mt-2">{errors.submit}</div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
