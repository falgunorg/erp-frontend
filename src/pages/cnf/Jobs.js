import React, { useState, useEffect } from "react";

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
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}

export default function Jobs() {
  const [jobs, setJobs] = useLocalStorage("dms_jobs_v1", []);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [filterType, setFilterType] = useState("ALL");

  function createJob({ jobType, jobNumber, title }) {
    const newJob = {
      id: uid(),
      type: jobType,
      number: jobNumber,
      title: title || `${jobType} - ${jobNumber}`,
      createdAt: new Date().toISOString(),
      operations: [],
    };
    setJobs([newJob, ...jobs]);
    setSelectedJobId(newJob.id);
    setShowJobForm(false);
  }

  function updateJob(jobId, patch) {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, ...patch } : j))
    );
  }

  function deleteJob(jobId) {
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
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <header className="max-w-7xl mx-auto mb-6">
        <h1 className="text-2xl font-bold">
          Document Management System (DMS) — Jobs
        </h1>
        <p className="text-sm text-slate-600">
          Create jobs, attach operations, upload docs and track status & costs.
        </p>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* Left column - jobs list */}
        <aside className="col-span-4 bg-white rounded-2xl shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <strong>Jobs</strong>
            <div className="space-x-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="text-sm p-1 border rounded"
              >
                <option value="ALL">All</option>
                <option value="IMPORT">Import</option>
                <option value="EXPORT">Export</option>
              </select>
              <button onClick={() => setShowJobForm(true)} className="btn">
                + New Job
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-[60vh] overflow-auto">
            {jobs.filter((j) =>
              filterType === "ALL" ? true : j.type === filterType
            ).length === 0 && (
              <div className="text-sm text-slate-500">
                No jobs yet. Create one.
              </div>
            )}
            {jobs
              .filter((j) =>
                filterType === "ALL" ? true : j.type === filterType
              )
              .map((j) => (
                <div
                  key={j.id}
                  className={`p-3 rounded-lg border cursor-pointer ${
                    selectedJobId === j.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-100"
                  }`}
                  onClick={() => setSelectedJobId(j.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-medium">{j.title}</div>
                      <div className="text-xs text-slate-500">
                        {j.type} • {j.number}
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      <div>{j.operations.length} ops</div>
                      <div className="text-slate-400">
                        {new Date(j.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteJob(j.id);
                      }}
                      className="text-xs text-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedJobId(j.id);
                        setShowJobForm(true);
                      }}
                      className="text-xs text-indigo-600"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </aside>

        {/* Right column - job details */}
        <section className="col-span-8">
          {!selectedJob ? (
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-medium">No job selected</h2>
              <p className="text-sm text-slate-500">
                Select a job on the left or create a new one.
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
        </section>
      </main>

      {showJobForm && (
        <JobModal
          onClose={() => setShowJobForm(false)}
          onCreate={(payload) => createJob(payload)}
        />
      )}

      <style>{`
        .btn{ padding:6px 10px; background:#4f46e5; color:white; border-radius:8px; font-size:13px }
        input,select,textarea{ border:1px solid #e6e9ef; padding:8px; border-radius:8px }
      `}</style>
    </div>
  );
}

function JobModal({ onClose, onCreate }) {
  const [jobType, setJobType] = useState("IMPORT");
  const [jobNumber, setJobNumber] = useState("");
  const [title, setTitle] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl p-5 shadow">
        <h3 className="text-lg font-semibold mb-3">Create Job</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs">Job Type</label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full"
            >
              <option value="IMPORT">IMPORT</option>
              <option value="EXPORT">EXPORT</option>
            </select>
          </div>
          <div>
            <label className="text-xs">Job Number (unique)</label>
            <input
              value={jobNumber}
              onChange={(e) => setJobNumber(e.target.value)}
              placeholder="e.g. MBL-2025-001"
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs">Title (optional)</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short description"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 rounded border">
            Cancel
          </button>
          <button
            onClick={() => {
              if (!jobNumber.trim()) return alert("Please enter a job number");
              onCreate({
                jobType,
                jobNumber: jobNumber.trim(),
                title: title.trim(),
              });
            }}
            className="px-3 py-1 rounded btn"
          >
            Create
          </button>
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

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{job.title}</h2>
          <div className="text-sm text-slate-500">
            {job.type} • {job.number}
          </div>
        </div>
        <div className="text-right text-sm">
          <div>Created: {new Date(job.createdAt).toLocaleString()}</div>
          <div className="mt-2">Operations: {job.operations.length}</div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button onClick={() => setShowAddOp(true)} className="btn">
          + Add Operation
        </button>
        <label className="text-sm">Filter by sector:</label>
        <select
          value={filterSector}
          onChange={(e) => setFilterSector(e.target.value)}
          className="text-sm p-1 border rounded"
        >
          <option value="">All</option>
          {Object.keys(CHECKLIST[job.type] || {}).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
          <option value="OPTIONAL">Optional</option>
        </select>
      </div>

      <div className="mt-4 space-y-3">
        {job.operations.filter((o) =>
          filterSector
            ? filterSector === "OPTIONAL"
              ? o.sector === "OPTIONAL"
              : o.sector === filterSector
            : true
        ).length === 0 && (
          <div className="text-sm text-slate-500">
            No operations added. Click "Add Operation" to begin.
          </div>
        )}

        {job.operations
          .filter((o) =>
            filterSector
              ? filterSector === "OPTIONAL"
                ? o.sector === "OPTIONAL"
                : o.sector === filterSector
              : true
          )
          .map((op) => (
            <OperationCard
              key={op.id}
              op={op}
              onUpdate={(patch) => updateOperation(op.id, patch)}
              onDelete={() => deleteOperation(op.id)}
            />
          ))}
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

function OperationCard({ op, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border rounded p-3">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium">{op.name}</div>
          <div className="text-xs text-slate-500">
            {op.sector} •{" "}
            {op.date ? new Date(op.date).toLocaleDateString() : "No date"}
          </div>
        </div>
        <div className="text-right text-sm">
          <div
            className={`px-2 py-0.5 rounded text-xs ${
              op.status === "Done"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {op.status || "Pending"}
          </div>
          <div className="mt-2">{op.cost ? `Cost: ${op.cost}` : ""}</div>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setExpanded((s) => !s)}
          className="text-sm text-indigo-600"
        >
          {expanded ? "Collapse" : "Edit"}
        </button>
        <button onClick={onDelete} className="text-sm text-red-600">
          Delete
        </button>
      </div>

      {expanded && (
        <div className="mt-3 bg-slate-50 p-3 rounded">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs">Date</label>
              <input
                type="date"
                defaultValue={op.date ? op.date.slice(0, 10) : ""}
                onChange={(e) => onUpdate({ date: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs">Responsible</label>
              <input
                defaultValue={op.responsible || ""}
                onBlur={(e) => onUpdate({ responsible: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs">Cost</label>
              <input
                defaultValue={op.cost || ""}
                onBlur={(e) => onUpdate({ cost: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="text-xs">Status</label>
            <select
              defaultValue={op.status || "Pending"}
              onChange={(e) => onUpdate({ status: e.target.value })}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
          </div>

          <div className="mt-3">
            <label className="text-xs">Files</label>
            <FileList
              files={op.files || []}
              onRemove={(index) =>
                onUpdate({
                  files: (op.files || []).filter((_, i) => i !== index),
                })
              }
            />

            <FileUploader
              onFiles={(files) =>
                onUpdate({ files: [...(op.files || []), ...files] })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

function FileList({ files, onRemove }) {
  if (!files || files.length === 0)
    return <div className="text-sm text-slate-500">No files</div>;
  return (
    <div className="mt-2 space-y-2">
      {files.map((f, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-2 bg-white rounded border"
        >
          <div className="text-sm">
            <div className="font-medium">{f.name}</div>
            <div className="text-xs text-slate-400">
              {f.type} • {(f.size / 1024).toFixed(1)} KB
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {f.preview && (
              <a
                href={f.preview}
                target="_blank"
                rel="noreferrer"
                className="text-xs"
              >
                Preview
              </a>
            )}
            <button
              onClick={() => onRemove(i)}
              className="text-xs text-red-600"
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
        // For large files you may want to avoid base64 previews in production
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then((arr) => onFiles(arr));
  }

  return (
    <div className="mt-2">
      <input type="file" multiple onChange={handleFiles} />
      <div className="text-xs text-slate-400">
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl p-5 shadow">
        <h3 className="text-lg font-semibold mb-3">Add Operation</h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs">Sector</label>
            <select value={sector} onChange={(e) => setSector(e.target.value)}>
              {Object.keys(CHECKLIST[jobType] || {}).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
              <option value="OPTIONAL">Optional / Company Internal</option>
            </select>
          </div>

          <div>
            <label className="text-xs">Operation Name</label>
            <select value={name} onChange={(e) => setName(e.target.value)}>
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
                CHECKLIST.OPTIONAL.map((n) => <option key={n}>{n}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs">Responsible</label>
            <input
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              placeholder="Name"
            />
          </div>

          <div>
            <label className="text-xs">Cost</label>
            <input
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="e.g. 1200"
            />
          </div>

          <div>
            <label className="text-xs">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="text-xs">Files</label>
            <FileUploader onFiles={handleFiles} />
            <FileList
              files={files}
              onRemove={(i) => setFiles(files.filter((_, idx) => idx !== i))}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 rounded border">
            Cancel
          </button>
          <button onClick={submit} className="px-3 py-1 rounded btn">
            Add Operation
          </button>
        </div>
      </div>
    </div>
  );
}
