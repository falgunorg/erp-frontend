import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";


const CHECKLIST = {
  IMPORT: {
    "Core Shipping & Trade": [
      "Commercial Invoice",
      "Packing List",
      "Bill of Lading / Air Waybill",
      "Import Permit / LC Authorization Form",
      "IGM Declaration (Import General Manifest)",
      "Bill of Entry",
      "Agent Delivery Order (DO)",
      "Shed Delivery Order",
      "Cart Ticket",
      "Original Documents (Invoice, BL, PL)",
    ],
    "Banking & Financial": [
      "Letter of Credit (LC) / TT Payment Copy",
      "BTB LC Copy",
      "Insurance Certificate",
      "Import Registration Certificate (IRC)",
      "VAT Registration Certificate (BIN)",
      "Bank Endorsement Copy",
    ],
    "Customs & Regulatory": [
      "Customs Permission / NOC",
      "Risk Bond / Bond License",
      "Utilization Declaration",
      "C&F Agent Authorization",
      "Scouting Copy / Gate Pass",
      "Undertaken by Stamp Paper",
    ],
    "Additional / Conditional Documents": [
      "Certificate of Origin",
      "PSI (Pre-Shipment Inspection) Report",
      "Phytosanitary / Fumigation Certificate",
      "Test or Quality Certificate",
      "Country-Specific Certificates",
      "Import License (for restricted goods)",
      "Health or Food Safety Certificates",
      "HS Code Declaration Sheet",
      "Customs Container Permission",
      "Tailor / Transport Challan",
      "Shipping Agent DO",
      "C&F Bill and Statement",
    ],
  },
  EXPORT: {
    "Commercial & Shipping Documents": [
      "Commercial Invoice",
      "Packing List",
      "Bill of Lading / Air Waybill",
      "Export Permit / EXP Form",
      "Shipping Instructions / Booking Confirmation",
      "Export Declaration (EPB)",
      "Forwarder’s Certificate of Receipt (FCR)",
      "Export Delivery Challan",
      "Certificate of Shipment",
    ],
    "Financial & Contractual Documents": [
      "Proforma Invoice (PI)",
      "Letter of Credit (LC) / Sales Contract / TT Copy",
      "BTB LC (Back-to-Back LC)",
      "Bill of Exchange (Draft)",
      "Beneficiary Certificate",
      "EXP Number Endorsement from Bank",
    ],
    "Quality, Inspection & Compliance": [
      "Certificate of Origin (COO)",
      "GSP Form A / REX Declaration",
      "Inspection Certificate (if required)",
      "Phytosanitary / Fumigation Certificate",
      "Test Report / Lab Test Certificate",
    ],
    "Customs & Government": [
      "Customs Export Declaration (EXP)",
      "Export Permission / Utilization Declaration (UD)",
      "Risk Bond (if export incentives claimed)",
      "Export License (if restricted goods)",
      "EPB (Export Promotion Bureau) Registration Copy",
    ],
  },
  OPTIONAL: [
    "Purchase Order (PO) / Work Order",
    "Internal GRN (Goods Received Note)",
    "Cost Sheet or Shipment Costing",
    "Import/Export Job Register Sheet",
    "Factory Gate Pass",
    "Delivery Confirmation",
  ],
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch (e) {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      // ignore
    }
  }, [key, state]);
  return [state, setState];
}

export default function Jobs() {
  const [jobs, setJobs] = useLocalStorage("dms_jobs_v1", []);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [filterType, setFilterType] = useState("ALL");
  const [opSearch, setOpSearch] = useState("");

  const importDocuments = CheckList["IMPORT"];
  const exportDocuments = CheckList["EXPORT"];
  const costLists = CheckList["COST"];

  console.log("COSTLIST", costLists);

  useEffect(() => {
    // if there's at least one job and no selection, pick the first
    if (jobs.length && !selectedJobId) setSelectedJobId(jobs[0].id);
  }, []); // intentional empty — only on mount

  function createJob({ jobType, jobNumber, title }) {
    const newJob = {
      id: uid(),
      type: jobType,
      number: jobNumber,
      title: title || `${jobType} - ${jobNumber}`,
      createdAt: new Date().toISOString(),
      operations: [],
    };
    setJobs((prev) => [newJob, ...prev]);
    setSelectedJobId(newJob.id);
    setShowJobForm(false);
  }

  function updateJob(jobId, patch) {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, ...patch } : j))
    );
  }

  function deleteJob(jobId) {
    if (!window.confirm("Delete this job and all operations?")) return;
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    if (selectedJobId === jobId) setSelectedJobId(null);
  }

  function addOperation(jobId, operation) {
    const op = { id: uid(), ...operation };
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId ? { ...j, operations: [op, ...j.operations] } : j
      )
    );
  }

  function updateOperation(jobId, opId, patch) {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              operations: j.operations.map((o) =>
                o.id === opId ? { ...o, ...patch } : o
              ),
            }
          : j
      )
    );
  }

  function deleteOperation(jobId, opId) {
    if (!window.confirm("Delete this operation?")) return;
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? { ...j, operations: j.operations.filter((o) => o.id !== opId) }
          : j
      )
    );
  }

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || null;

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <header className="mb-4 text-center">
        <h2 className="fw-bold">Document Management System (DMS) — Jobs</h2>
        <p className="text-muted">
          Create jobs, add operations, upload docs and track progress.
        </p>
      </header>

      <div className="row g-4">
        {/* Jobs list */}
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">Jobs</h5>
                <div className="d-flex gap-2">
                  <select
                    className="form-select form-select-sm"
                    style={{ width: 110 }}
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="ALL">All</option>
                    <option value="IMPORT">Import</option>
                    <option value="EXPORT">Export</option>
                  </select>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowJobForm(true)}
                  >
                    + New Job
                  </button>
                </div>
              </div>

              <div
                className="list-group overflow-auto"
                style={{ maxHeight: "65vh" }}
              >
                {jobs.filter(
                  (j) => filterType === "ALL" || j.type === filterType
                ).length === 0 && (
                  <div className="text-muted small">
                    No jobs yet. Create one.
                  </div>
                )}
                {jobs
                  .filter((j) => filterType === "ALL" || j.type === filterType)
                  .map((j) => (
                    <div
                      key={j.id}
                      className={`list-group-item list-group-item-action rounded-3 mb-2 ${
                        selectedJobId === j.id ? "active" : ""
                      }`}
                      onClick={() => setSelectedJobId(j.id)}
                    >
                      <div className="d-flex justify-content-between">
                        <div>
                          <div className="fw-semibold">{j.title}</div>
                          <small className="text-muted">
                            {j.type} • {j.number}
                          </small>
                        </div>
                        <div className="text-end small">
                          <div>{j.operations.length} ops</div>
                          <div className="text-muted">
                            {new Date(j.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteJob(j.id);
                          }}
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedJobId(j.id);
                            setShowJobForm(true);
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Job details with operations management */}
        <div className="col-lg-8">
          {!selectedJob ? (
            <div className="card shadow-sm p-5 text-center">
              <h5 className="text-secondary">No job selected</h5>
              <p className="text-muted small">
                Select a job on the left or create a new one to begin.
              </p>
            </div>
          ) : (
            <JobDetails
              job={selectedJob}
              updateJob={(patch) => updateJob(selectedJob.id, patch)}
              addOperation={(op) => addOperation(selectedJob.id, op)}
              updateOperation={(opId, patch) =>
                updateOperation(selectedJob.id, opId, patch)
              }
              deleteOperation={(opId) => deleteOperation(selectedJob.id, opId)}
            />
          )}
        </div>
      </div>

      {showJobForm && (
        <JobModal
          onClose={() => setShowJobForm(false)}
          onCreate={(payload) => createJob(payload)}
        />
      )}
    </div>
  );
}

function JobModal({ onClose, onCreate }) {
  const [jobType, setJobType] = useState("IMPORT");
  const [jobNumber, setJobNumber] = useState("");
  const [title, setTitle] = useState("");

  return (
    <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create Job</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Job Type</label>
                <select
                  className="form-select"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                >
                  <option value="IMPORT">IMPORT</option>
                  <option value="EXPORT">EXPORT</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Job Number (unique)</label>
                <input
                  className="form-control"
                  value={jobNumber}
                  onChange={(e) => setJobNumber(e.target.value)}
                  placeholder="e.g. MBL-2025-001"
                />
              </div>
              <div className="col-12">
                <label className="form-label">Title (optional)</label>
                <input
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Short description"
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (!jobNumber.trim())
                  return alert("Please enter a job number");
                onCreate({
                  jobType,
                  jobNumber: jobNumber.trim(),
                  title: title.trim(),
                });
              }}
            >
              Create Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function JobDetails({
  job,
  updateJob,
  addOperation,
  updateOperation,
  deleteOperation,
}) {
  const [showAddOp, setShowAddOp] = useState(false);
  const [filterSector, setFilterSector] = useState("");
  const [search, setSearch] = useState("");

  const sectors = [...Object.keys(CHECKLIST[job.type] || {}), "OPTIONAL"];

  const opsFiltered = job.operations.filter((o) => {
    const bySector = filterSector
      ? filterSector === "OPTIONAL"
        ? o.sector === "OPTIONAL"
        : o.sector === filterSector
      : true;
    const bySearch = search
      ? (o.name || "").toLowerCase().includes(search.toLowerCase())
      : true;
    return bySector && bySearch;
  });

  return (
    <div className="card shadow-sm p-4">
      <div className="d-flex align-items-start justify-content-between">
        <div>
          <h4 className="fw-semibold mb-0">{job.title}</h4>
          <div className="text-muted small">
            {job.type} • {job.number}
          </div>
        </div>
        <div className="text-end small">
          <div>Created: {new Date(job.createdAt).toLocaleDateString()}</div>
          <div className="mt-2">Operations: {job.operations.length}</div>
        </div>
      </div>

      <div className="row align-items-center mt-4">
        <div className="col-auto">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowAddOp(true)}
          >
            + Add Operation
          </button>
        </div>
        <div className="col-auto d-flex align-items-center">
          <label className="me-2 mb-0 small">Filter</label>
          <select
            className="form-select form-select-sm"
            style={{ width: 220 }}
            value={filterSector}
            onChange={(e) => setFilterSector(e.target.value)}
          >
            <option value="">All</option>
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="col">
          <input
            className="form-control form-control-sm"
            placeholder="Search operations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4">
        {opsFiltered.length === 0 ? (
          <div className="text-muted small">
            No operations match the filters. Add one to get started.
          </div>
        ) : (
          <div className="row">
            {opsFiltered.map((op) => (
              <OperationCard
                key={op.id}
                op={op}
                onUpdate={(patch) => updateOperation(op.id, patch)}
                onDelete={() => deleteOperation(op.id)}
              />
            ))}
          </div>
        )}
      </div>

      {showAddOp && (
        <OperationModal
          jobType={job.type}
          onClose={() => setShowAddOp(false)}
          onSave={(payload) => {
            addOperation(payload);
            setShowAddOp(false);
          }}
        />
      )}
    </div>
  );
}

function statusBadge(status) {
  if (!status) status = "Pending";
  if (status === "Done") return <span className="badge bg-success">Done</span>;
  if (status === "In Progress")
    return <span className="badge bg-warning text-dark">In Progress</span>;
  return <span className="badge bg-secondary">{status}</span>;
}

function OperationCard({ op, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [local, setLocal] = useState(op);

  useEffect(() => setLocal(op), [op]);

  function savePatch(field, value) {
    setLocal((p) => ({ ...p, [field]: value }));
    onUpdate({ [field]: value });
  }

  return (
    <div className="col-12 col-md-6">
      <div className="card border">
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <div>
              <div className="fw-medium">{op.name}</div>
              <div className="small text-muted">
                {op.sector} •{" "}
                {op.date ? new Date(op.date).toLocaleDateString() : "No date"}
              </div>
            </div>
            <div className="text-end">
              <div>{statusBadge(op.status)}</div>
              <div className="mt-2 small">
                {op.cost ? `Cost: ${op.cost}` : ""}
              </div>
            </div>
          </div>

          <div className="mt-3 d-flex gap-2">
            <button
              className="btn btn-link btn-sm"
              onClick={() => setExpanded((s) => !s)}
            >
              {expanded ? "Collapse" : "Edit"}
            </button>
            <button
              className="btn btn-link btn-sm text-danger"
              onClick={onDelete}
            >
              Delete
            </button>
            <button
              className="btn btn-outline-success btn-sm ms-auto"
              onClick={() => onUpdate({ status: "Done" })}
            >
              Mark Done
            </button>
          </div>

          {expanded && (
            <div className="mt-3 bg-light p-3 rounded">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label small">Date</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={local.date ? local.date.slice(0, 10) : ""}
                    onChange={(e) => savePatch("date", e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small">Responsible</label>
                  <input
                    className="form-control form-control-sm"
                    value={local.responsible || ""}
                    onChange={(e) => savePatch("responsible", e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small">Cost</label>
                  <input
                    className="form-control form-control-sm"
                    value={local.cost || ""}
                    onChange={(e) => savePatch("cost", e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="form-label small">Status</label>
                <select
                  className="form-select form-select-sm"
                  value={local.status || "Pending"}
                  onChange={(e) => savePatch("status", e.target.value)}
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Done</option>
                </select>
              </div>

              <div className="mt-3">
                <label className="form-label small">Files</label>
                <FileList
                  files={local.files || []}
                  onRemove={(index) => {
                    const next = (local.files || []).filter(
                      (_, i) => i !== index
                    );
                    setLocal((p) => ({ ...p, files: next }));
                    onUpdate({ files: next });
                  }}
                />

                <FileUploader
                  onFiles={(files) => {
                    const next = [...(local.files || []), ...files];
                    setLocal((p) => ({ ...p, files: next }));
                    onUpdate({ files: next });
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FileList({ files, onRemove }) {
  if (!files || files.length === 0)
    return <div className="text-muted small">No files</div>;
  return (
    <div className="mt-2 d-grid gap-2">
      {files.map((f, i) => (
        <div
          key={i}
          className="d-flex align-items-center justify-content-between p-2 bg-white border rounded"
        >
          <div>
            <div className="fw-medium small">{f.name}</div>
            <div className="text-muted small">
              {f.type || "file"} • {(f.size / 1024).toFixed(1)} KB
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            {f.preview && (
              <a
                href={f.preview}
                target="_blank"
                rel="noreferrer"
                className="small"
              >
                Preview
              </a>
            )}
            <button
              className="btn btn-sm btn-link text-danger"
              onClick={() => onRemove(i)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function FileUploader({ onFiles }) {
  function handleFiles(ev) {
    const list = Array.from(ev.target.files || []);
    const readers = list.map((file) => {
      return new Promise((res) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          res({
            name: file.name,
            size: file.size,
            type: file.type || "file",
            preview: e.target.result,
          });
        };
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then((arr) => onFiles(arr));
  }

  return (
    <div className="mt-2">
      <input
        className="form-control form-control-sm"
        type="file"
        multiple
        onChange={handleFiles}
      />
      <div className="text-muted small mt-1">
        Supports images, pdf, excel, word — stored locally as preview (demo).
      </div>
    </div>
  );
}

function OperationModal({ jobType, onClose, onSave }) {
  const [sector, setSector] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [responsible, setResponsible] = useState("");
  const [cost, setCost] = useState("");
  const [status, setStatus] = useState("Pending");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const first = Object.keys(CHECKLIST[jobType] || {})[0];
    setSector(first || "");
  }, [jobType]);

  function handleFiles(arr) {
    setFiles((p) => [...p, ...arr]);
  }

  function submit() {
    if (!name.trim()) return alert("Please select an operation name");
    onSave({
      sector: sector || "OPTIONAL",
      name,
      date,
      responsible,
      cost,
      status,
      files,
    });
  }

  return (
    <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Operation</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Sector</label>
                <select
                  className="form-select"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                >
                  {Object.keys(CHECKLIST[jobType] || {}).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                  <option value="OPTIONAL">Optional / Company Internal</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Operation Name</label>
                <select
                  className="form-select"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                >
                  <option value="">-- choose operation --</option>
                  {(CHECKLIST[jobType] && sector !== "OPTIONAL"
                    ? CHECKLIST[jobType][sector] || []
                    : []
                  ).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                  {sector === "OPTIONAL" &&
                    CHECKLIST.OPTIONAL.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Responsible</label>
                <input
                  className="form-control"
                  value={responsible}
                  onChange={(e) => setResponsible(e.target.value)}
                  placeholder="Name"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Cost</label>
                <input
                  className="form-control"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="e.g. 1200"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Done</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Files</label>
                <FileUploader onFiles={handleFiles} />
                <FileList
                  files={files}
                  onRemove={(i) =>
                    setFiles(files.filter((_, idx) => idx !== i))
                  }
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={submit}>
              Add Operation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
