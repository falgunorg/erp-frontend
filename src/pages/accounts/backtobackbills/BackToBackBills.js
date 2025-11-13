import React, { useState, useEffect, useCallback } from "react";
import api from "services/api";
import { Link } from "react-router-dom";
import formatMoney from "services/moneyFormatter";

export default function BackToBackBills({ setHeaderData }) {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filterData, setFilterData] = useState({
    contract_id: "",
    lc_id: "",
    bc_bill_no: "",
    user_ref_no: "",
    source_of_fund: "",
  });

  // ✅ Handle input change efficiently
  const handleChange = (field, value) => {
    setFilterData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ✅ Fetch bills (wrapped in useCallback for stability)
  const getBills = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/accounts/back-to-back-bills", {
        params: filterData, // ✅ Pass filters as query params
      });

      // ✅ Assuming your Laravel controller returns pagination (response.data.data)
      if (response.status === 200 && response.data?.data) {
        setBills(response.data.data);
      } else if (response.status === 200 && Array.isArray(response.data)) {
        // In case controller returns a plain list instead of paginator
        setBills(response.data);
      } else {
        setBills([]);
      }
    } catch (error) {
      console.error("Error fetching bills:", error);
      setBills([]);
    } finally {
      setLoading(false);
    }
  }, [filterData]);

  // ✅ Fetch initial data on mount
  useEffect(() => {
    getBills();
  }, [getBills]);

  const resetFilter = () => {
    setFilterData({
      contract_id: "",
      lc_id: "",
      bc_bill_no: "",
      user_ref_no: "",
      source_of_fund: "",
    });
  };

  // ✅ Set header once
  useEffect(() => {
    setHeaderData({
      pageName: "BB BILLS",
      isNewButton: true,
      newButtonLink: "",
      newButtonText: "New Bill",
      isInnerSearch: true,
      innerSearchValue: "",
    });
  }, [setHeaderData]);

  return (
    <div className="bb_bills">
      {/* ✅ Filter Section */}
      <div className="card mb-4 p-3">
        <div className="row g-3">
          {[
            {
              key: "contract_id",
              label: "Purchase Contract",
              placeholder: "Enter Contract ID",
            },
            { key: "lc_id", label: "LC No.", placeholder: "Enter LC ID" },
            {
              key: "bc_bill_no",
              label: "BC Bill No.",
              placeholder: "Enter Bill No",
            },
            {
              key: "user_ref_no",
              label: "User Ref No.",
              placeholder: "Enter Ref No",
            },
            {
              key: "source_of_fund",
              label: "Source of Fund",
              placeholder: "Enter Source of Fund",
            },
          ].map(({ key, label, placeholder }) => (
            <div className="col-lg-2" key={key}>
              <label className="form-label">{label}</label>
              <input
                type="text"
                className="form-control"
                value={filterData[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
              />
            </div>
          ))}
          <div className="col-lg-2 d-flex align-items-center">
            <button
              className="btn btn-primary me-2"
              onClick={getBills}
              disabled={loading}
            >
              <i className="fa fa-search"></i>
            </button>
            <button
              className="btn btn-danger me-4"
              onClick={resetFilter}
              disabled={loading}
            >
              <i className="fas fa-hourglass"></i>
            </button>
            <Link to="/accounts/bb-bills-create" className="btn btn-success">
              Add New
            </Link>
          </div>
        </div>
      </div>

      {/* ✅ Data Table */}
      <div className="section table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>PC/Export LC No.</th>
              <th>LC No.</th>
              <th>BC Bill No.</th>
              <th>User Ref. No</th>
              <th>Issue Date</th>
              <th className="text-end">Bill Amt.</th>
              <th className="text-end">Bill Amt. LIQD.</th>
              <th className="text-end">Intt./Charge Amt.</th>
              <th>Maturity Date</th>
              <th>Paid Date</th>
              <th>Source of Fund</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="12" className="text-center text-muted py-3">
                  Loading bills...
                </td>
              </tr>
            ) : bills.length > 0 ? (
              bills.map((bill, i) => (
                <tr key={i}>
                  <td>{bill.contract?.title || "-"}</td>
                  <td>{bill.lc?.lc_number || "-"}</td>
                  <td>{bill.bc_contract_no || "-"}</td>
                  <td>{bill.user_ref_no || "-"}</td>

                  <td>{bill.issued_date || "-"}</td>
                  <td className="text-end">
                    {formatMoney(bill.contract_amount)}
                  </td>
                  <td className="text-end">
                    {formatMoney(bill.bill_amount_liqd)}
                  </td>
                  <td className="text-end">
                    {formatMoney(bill.charge_amount)}
                  </td>
                  <td>{bill.maturity_date || "-"}</td>
                  <td>{bill.paid_date || "-"}</td>
                  <td>{bill.source_of_fund || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="text-center text-muted py-3">
                  No bills found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
