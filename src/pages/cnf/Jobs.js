import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

function uid() {
  // Get the last used ID from localStorage (default to 0 if none)
  const lastId = parseInt(
    localStorage.getItem("dms_job_id_counter") || "0",
    10
  );
  const nextId = lastId + 1;

  // Save the next ID for future use
  localStorage.setItem("dms_job_id_counter", nextId.toString());

  // Return as number
  return nextId;
}

function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [key, state]);

  return [state, setState];
}

export default function Jobs() {
  const [jobs, setJobs] = useLocalStorage("dms_jobs_v2", []);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [filterType, setFilterType] = useState("ALL");

  // Filter jobs by import/export
  const filteredJobs =
    filterType === "ALL" ? jobs : jobs.filter((j) => j.type === filterType);

  function handleSave(jobData) {
    if (editJob) {
      setJobs((prev) =>
        prev.map((j) => (j.id === editJob.id ? { ...j, ...jobData } : j))
      );
      setEditJob(null);
    } else {
      const newJob = {
        id: uid(),
        createdAt: new Date().toISOString(),
        ...jobData,
      };
      setJobs((prev) => [newJob, ...prev]);
    }
    setShowJobForm(false);
  }

  function handleDelete(id) {
    if (window.confirm("Delete this job?")) {
      setJobs((prev) => prev.filter((j) => j.id !== id));
    }
  }

  return (
    <div className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Job List</h4>
        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm"
            style={{ width: 120 }}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
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

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>PC ID</th>
              <th>LC ID</th>
              <th>Booking ID</th>
              <th>BL No</th>
              <th>Invoice No</th>
              <th>PI No</th>
              <th>Invoice Value</th>
              <th>Gross Wt.</th>
              <th>Total Qty</th>
              <th>Unit</th>
              <th>Created</th>
              <th style={{ width: "110px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.length === 0 ? (
              <tr>
                <td colSpan="14" className="text-center text-muted">
                  No jobs found.
                </td>
              </tr>
            ) : (
              filteredJobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.id}</td>
                  <td>{job.type}</td>
                  <td>{job.pc_id || "-"}</td>
                  <td>{job.lc_id || "-"}</td>
                  <td>{job.booking_id || "-"}</td>
                  <td>{job.bill_of_landing_no || "-"}</td>
                  <td>{job.invoice_number || "-"}</td>
                  <td>{job.pi_number || "-"}</td>
                  <td>{job.invoice_value || "-"}</td>
                  <td>{job.gross_weight || "-"}</td>
                  <td>{job.total_qty || "-"}</td>
                  <td>{job.unit || "-"}</td>
                  <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <Link
                        className="btn btn-outline-success"
                        to={"/cnf/job-details/" + job.id}
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

function JobModal({ onClose, onSave, initialData }) {
  const [form, setForm] = useState(
    initialData || {
      type: "IMPORT",
      pc_id: "",
      lc_id: "",
      booking_id: "",
      bill_of_landing_no: "",
      invoice_number: "",
      pi_number: "",
      invoice_value: "",
      gross_weight: "",
      total_qty: "",
      unit: "",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
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
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Job Type</label>
                <select
                  className="form-select"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                >
                  <option value="IMPORT">IMPORT</option>
                  <option value="EXPORT">EXPORT</option>
                </select>
              </div>

              {[
                ["pc_id", "PC / Marter LC / Sales Contract"],
                ["lc_id", "BTB LC"],
                ["booking_id", "Booking Number"],
                ["bill_of_landing_no", "Bill of Lading Number"],
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
                    className="form-control"
                    name={key}
                    value={form[key]}
                    onChange={handleChange}
                  />
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
            <button className="btn btn-outline-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={() => onSave(form)}>
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
