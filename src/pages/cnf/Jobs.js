import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "services/api";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [filterType, setFilterType] = useState("ALL");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    fetchJobs();
  }, [filterType, search, sortBy, sortOrder, page]);

  const fetchJobs = async () => {
    try {
      const params = {
        page,
        sortBy,
        sortOrder,
        ...(filterType !== "ALL" && { type: filterType }),
        ...(search && { search }),
      };
      const res = await api.get("/cnf/jobs", { params });
      setJobs(res.data.data);
      setLastPage(res.data.last_page);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const handleSave = async (jobData, setErrors, onSuccess) => {
    try {
      setErrors({});
      let res;
      if (editJob) {
        res = await api.put(`/cnf/jobs/${editJob.id}`, jobData);
      } else {
        res = await api.post("/cnf/jobs", jobData);
      }

      if (res.status === 200 && res.data) {
        fetchJobs();
        onSuccess();
      } else {
        setErrors({ general: "Failed to save job. Please check your input." });
      }
    } catch (err) {
      const apiErrors = err.response?.data?.errors || {};
      const formatted = {};
      Object.keys(apiErrors).forEach(
        (key) => (formatted[key] = apiErrors[key][0])
      );
      setErrors(formatted);
      console.error("Error saving job:", err.response?.data || err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await api.delete(`/cnf/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Failed to delete job.");
    }
  };

  return (
    <div className="py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Job List</h4>
        <div className="d-flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="form-control form-control-sm"
            style={{ width: 180 }}
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
          <select
            className="form-select form-select-sm"
            style={{ width: 120 }}
            value={filterType}
            onChange={(e) => {
              setPage(1);
              setFilterType(e.target.value);
            }}
          >
            <option value="ALL">All</option>
            <option value="IMPORT">Import</option>
            <option value="EXPORT">Export</option>
          </select>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              setEditJob(null);
              setShowJobForm(true);
            }}
          >
            + New Job
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-light">
            <tr>
              {[
                "id",
                "type",
                "purchase_contract",
                "lc",
                "booking_number",
                "bill_of_landing_number",
                "invoice_number",
                "pi_number",
                "invoice_value",
                "gross_weight",
                "net_weight",
                "total_qty",
                "unit",
                "created_at",
              ].map((key) => (
                <th
                  key={key}
                  onClick={() => {
                    setSortBy(key);
                    setSortOrder((prev) =>
                      sortBy === key && prev === "asc" ? "desc" : "asc"
                    );
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {key.replace(/_/g, " ").toUpperCase()}
                  {sortBy === key ? (sortOrder === "asc" ? " ▲" : " ▼") : ""}
                </th>
              ))}
              <th style={{ width: "110px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan="15" className="text-center text-muted">
                  No jobs found.
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.job_number}</td>
                  <td>{job.type}</td>
                  <td>{job.pc?.title || "-"}</td>
                  <td>{job.lc?.title || "-"}</td>
                  <td>{job.booking?.booking_number || "-"}</td>
                  <td>{job.bill_of_landing_number || "-"}</td>
                  <td>{job.invoice_number || "-"}</td>
                  <td>{job.pi_number || "-"}</td>
                  <td>{job.invoice_value || "-"}</td>
                  <td>{job.gross_weight || "-"}</td>
                  <td>{job.net_weight || "-"}</td>
                  <td>{job.total_qty || "-"}</td>
                  <td>{job.unit || "-"}</td>
                  <td>
                    {new Date(job.created_at).toLocaleDateString("en-GB")}
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <Link
                        className="btn btn-outline-success"
                        to={`/cnf/job-details/${job.id}`}
                      >
                        Details
                      </Link>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setEditJob(job);
                          setShowJobForm(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleDelete(job.id)}
                      >
                        Del
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <small>
          Page {page} of {lastPage}
        </small>
        <div className="btn-group">
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page >= lastPage}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {showJobForm && (
        <JobModal
          onClose={() => {
            setShowJobForm(false);
            setEditJob(null);
          }}
          onSave={handleSave}
          initialData={editJob}
        />
      )}
    </div>
  );
}

// --------------------- Job Modal ----------------------

function JobModal({ onClose, onSave, initialData }) {
  const [form, setForm] = useState(
    initialData || {
      type: "IMPORT",
      pc_id: "",
      lc_id: "",
      booking_id: "",
      bill_of_landing_number: "",
      invoice_number: "",
      pi_number: "",
      invoice_value: "",
      gross_weight: "",
      net_weight: "",
      total_qty: "",
      unit: "",
      remarks: "",
    }
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
  };

  const validateForm = () => {
    const newErrors = {};
    const fieldsToCheck = [
      "pc_id",
      "invoice_number",
      "unit",
      "total_qty",
      "invoice_value",
    ];

    fieldsToCheck.forEach((key) => {
      const value = form[key] ?? ""; // ensure null/undefined becomes empty string
      if (value.toString().trim() === "") {
        newErrors[key] = `${key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase())} is required.`;
      }
    });

    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    await onSave(form, setErrors, () => {
      setSaving(false);
      onClose();
    });
    setSaving(false);
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {initialData ? "Edit Job" : "Create Job"}
            </h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {errors.general && (
              <div className="alert alert-danger py-2">{errors.general}</div>
            )}

            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Job Type</label>
                <select
                  className={`form-select ${errors.type ? "is-invalid" : ""}`}
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                >
                  <option value="IMPORT">IMPORT</option>
                  <option value="EXPORT">EXPORT</option>
                </select>
                {errors.type && (
                  <div className="invalid-feedback">{errors.type}</div>
                )}
              </div>

              {[
                ["pc_id", "PC / Master LC / Sales Contract"],
                ["lc_id", "BTB LC"],
                ["booking_id", "Booking Number"],
                ["bill_of_landing_number", "Bill of Lading Number"],
                ["invoice_number", "Invoice Number"],
                ["pi_number", "PI Number"],
                ["invoice_value", "Invoice Value"],
                ["gross_weight", "Gross Weight"],
                ["net_weight", "Net Weight"],
                ["total_qty", "Total Quantity"],
                ["unit", "Unit"],
              ].map(([key, label]) => (
                <div className="col-md-4" key={key}>
                  <label className="form-label">{label}</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors[key] ? "is-invalid" : ""
                    }`}
                    name={key}
                    value={form[key]}
                    onChange={handleChange}
                  />
                  {errors[key] && (
                    <div className="invalid-feedback">{errors[key]}</div>
                  )}
                </div>
              ))}

              <div className="col-md-12">
                <label className="form-label">Remarks</label>
                <textarea
                  className="form-control"
                  name="remarks"
                  value={form.remarks}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-outline-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? "Saving..." : initialData ? "Update Job" : "Create Job"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
