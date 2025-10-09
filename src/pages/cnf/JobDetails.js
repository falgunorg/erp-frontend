import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import CheckList from "./Checklist.json";
import { PDFDocument } from "pdf-lib";
import CustomSelect from "elements/CustomSelect";

export default function JobDetails() {
  const { jobId } = useParams();
  const history = useHistory();

  const [job, setJob] = useState({
    id: 25,
    type: "IMPORT",
    pc_id: "2342",
    lc_id: "4249",
    booking_id: "5874",
    bill_of_landing_no: "5874",
    invoice_number: "8745221",
    pi_number: "8745",
    invoice_value: "58,740",
    gross_weight: "600KG",
    total_qty: "6000",
    unit: "YDS",
  });

  const [activeTab, setActiveTab] = useState("documents");
  const [documents, setDocuments] = useState([]);
  const [costs, setCosts] = useState([]);

  const [newCost, setNewCost] = useState({ name: "", amount: "", file: null });
  const [timeline, setTimeline] = useState([]);

  const importDocuments = CheckList["IMPORT"];
  const exportDocuments = CheckList["EXPORT"];
  const costLists = CheckList["COST"];

  const saveJob = (updatedJob) => setJob(updatedJob);

  const docList = job.type === "IMPORT" ? importDocuments : exportDocuments;

  /* -------------------- Document Handling -------------------- */
  const handleDrop = (e, docTitle) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(docTitle, files);
  };

  const handleUpload = (e, docTitle) => {
    const files = Array.from(e.target.files);
    handleFileUpload(docTitle, files);
  };

  const handleFileUpload = (docTitle, files) => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-GB"); // DD/MM/YYYY
    const existing = documents.find((d) => d.title === docTitle);
    const newFiles = existing ? [...existing.files, ...files] : files;
    const updatedDocs = documents.filter((d) => d.title !== docTitle);
    updatedDocs.push({ title: docTitle, files: newFiles });
    setDocuments(updatedDocs);
    saveJob({ ...job, documents: updatedDocs });

    // Update timeline
    const newEntries = files.map((f) => ({
      date: formattedDate,
      message: `Uploaded ${f.name} for ${docTitle}`,
    }));
    setTimeline((prev) => [...prev, ...newEntries]);
  };

  const handleDeleteFile = (docTitle, index) => {
    const updatedDocs = documents.map((d) => {
      if (d.title === docTitle) {
        const newFiles = d.files.filter((_, i) => i !== index);
        return { ...d, files: newFiles };
      }
      return d;
    });
    setDocuments(updatedDocs);
    saveJob({ ...job, documents: updatedDocs });
  };

  const handlePreviewFile = (file) => {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, "_blank");
  };

  /* -------------------- Cost Handling -------------------- */
  const handleAddCost = () => {
    if (!newCost.name || !newCost.amount)
      return alert("Enter cost name and amount");

    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-GB");

    const newEntry = {
      id: Date.now(),
      name: newCost.name,
      amount: newCost.amount,
      file: newCost.file,
      date: formattedDate,
    };

    const updatedCosts = [...costs, newEntry];
    setCosts(updatedCosts);
    saveJob({ ...job, costs: updatedCosts });
    setNewCost({ name: "", amount: "", file: null });

    if (newCost.file) {
      setTimeline((prev) => [
        ...prev,
        {
          date: formattedDate,
          message: `Added cost "${newCost.name}" with attachment`,
        },
      ]);
    } else {
      setTimeline((prev) => [
        ...prev,
        { date: formattedDate, message: `Added cost "${newCost.name}"` },
      ]);
    }
  };

  const handleDeleteCost = (id) => {
    const updatedCosts = costs.filter((c) => c.id !== id);
    setCosts(updatedCosts);
    saveJob({ ...job, costs: updatedCosts });
  };

  const [previewUrl, setPreviewUrl] = useState(null);

  /* -------------------- MERGE & PREVIEW (Document Overview) -------------------- */
  // Generate a single merged PDF (images + pdfs) and set previewUrl

  const generateMergedPdf = async () => {
    try {
      if (!documents || documents.length === 0) return;

      // Create a new PDF document
      const mergedPdf = await PDFDocument.create();

      // Collect all files and sort by date
      const allFiles = documents.flatMap((doc) =>
        (doc.files || [])
          .filter((f) => f && f.type)
          .map((f) => ({
            title: doc.title,
            file: f,
            date: f.lastModified || Date.now(),
          }))
      );

      // allFiles.sort((a, b) => a.date - b.date);

      for (const { file } of allFiles) {
        const fileType = file.type || "";

        // Handle image files
        if (fileType.startsWith("image/")) {
          const imgData = await readFileAsArrayBuffer(file); // helper function
          let image;
          if (fileType === "image/png") {
            image = await mergedPdf.embedPng(imgData);
          } else {
            image = await mergedPdf.embedJpg(imgData);
          }
          const page = mergedPdf.addPage([image.width, image.height]);
          page.drawImage(image, {
            x: 0,
            y: 0,
            width: image.width,
            height: image.height,
          });
        }

        // Handle PDF files
        else if (fileType === "application/pdf") {
          const arrayBuffer = await file.arrayBuffer();
          const pdfToMerge = await PDFDocument.load(arrayBuffer);
          const copiedPages = await mergedPdf.copyPages(
            pdfToMerge,
            pdfToMerge.getPageIndices()
          );
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        }
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (err) {
      console.error("Error generating merged PDF:", err);
    }
  };

  // Helper function to read images as ArrayBuffer
  const readFileAsArrayBuffer = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });

  // regenerate preview when user navigates to Document Overview or documents change
  useEffect(() => {
    if (activeTab === "document-overview") {
      generateMergedPdf();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, documents]);

  console.log("JOB", job);

  return (
    <div className="py-3">
      <button
        className="btn btn-link mb-3"
        onClick={() => history.push("/cnf/jobs")}
      >
        &larr; Back to Jobs
      </button>

      {/* -------- Job Info -------- */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <h5 className="mb-3">{job.type} Job Information</h5>
          <div className="row g-2">
            {[
              ["pc_id", "PC ID"],
              ["lc_id", "LC ID"],
              ["booking_id", "Booking ID"],
              ["bill_of_landing_no", "BL No"],
              ["invoice_number", "Invoice No"],
              ["pi_number", "PI No"],
              ["invoice_value", "Invoice Value"],
              ["gross_weight", "Gross Weight"],
              ["net_weight", "Net Weight"],
              ["total_qty", "Total Qty"],
              ["unit", "Unit"],
            ].map(([key, label]) => (
              <div className="col-md-4" key={key}>
                <div className="border p-2 rounded bg-light">
                  <strong>{label}:</strong> {job[key] || "—"}
                </div>
              </div>
            ))}

            <div className="col-md-4">
              <div className="border p-2 rounded bg-light">
                <strong>Remarks:</strong> {job.remarks}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -------- Tabs -------- */}
      <ul className="nav nav-tabs">
        {["documents", "costs", "timeline", "summary", "document-overview"].map(
          (tab) => (
            <li className="nav-item" key={tab}>
              <button
                className={`nav-link ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          )
        )}
      </ul>

      {/* -------- Tab Contents -------- */}
      <div className="p-3 border border-top-0 rounded-bottom bg-white">
        {/* -------------------- DOCUMENTS -------------------- */}
        {activeTab === "documents" && (
          <div>
            {docList.map((item) => {
              const title = item.title;
              const docData = documents.find((d) => d.title === title);
              return (
                <div
                  key={item.id}
                  style={{
                    // borderStyle: "dashed",
                    border: "1px dashed gray",
                  }}
                  className="list-group-item mb-3 rounded p-4"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, title)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{title}</strong>
                      <div className="small text-muted">
                        {docData && docData.files.length > 0
                          ? `${docData.files.length} file(s)`
                          : "No files uploaded"}
                      </div>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                      <label className="btn btn-sm btn-outline-secondary mb-0">
                        Upload
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          multiple
                          hidden
                          onChange={(e) => handleUpload(e, title)}
                        />
                      </label>
                    </div>
                  </div>

                  {docData && docData.files.length > 0 && (
                    <div className="mb-3">
                      {docData.files.map((f, i) => (
                        <div
                          style={{
                            float: "left",
                            border: "1px solid grey",
                            marginRight: "10px",
                            padding: "5px",
                          }}
                          key={i}
                          className="d-flex gap-2 mb-3 rounded bg-light"
                        >
                          <small>{f.name}</small>
                          <div className="d-flex gap-2">
                            <i
                              onClick={() => handlePreviewFile(f)}
                              className="fa fa-link text-success"
                            ></i>
                            <i
                              onClick={() => handleDeleteFile(title, i)}
                              className="fa fa-times text-danger"
                            ></i>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* -------------------- COSTS -------------------- */}
        {activeTab === "costs" && (
          <div>
            <div className="table-responsive mb-3">
              <table className="table table-sm table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Cost Name</th>
                    <th>Amount</th>
                    <th>File</th>
                    <th width="80">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {costs.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        No costs added yet.
                      </td>
                    </tr>
                  ) : (
                    costs.map((c) => (
                      <tr key={c.id}>
                        <td>{c.name}</td>
                        <td>{c.amount}</td>
                        <td>
                          {c.file ? (
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handlePreviewFile(c.file)}
                            >
                              Preview
                            </button>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteCost(c.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="row g-2 align-items-center">
              <div className="col-md-4">
                <select
                  className="form-select"
                  value={newCost.name}
                  onChange={(e) =>
                    setNewCost({ ...newCost, name: e.target.value })
                  }
                >
                  <option value="">Select Cost</option>
                  {costLists.map((item) => (
                    <option key={item.id} value={item.title}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Amount"
                  value={newCost.amount}
                  min={0}
                  onChange={(e) =>
                    setNewCost({ ...newCost, amount: e.target.value })
                  }
                />
              </div>
              <div className="col-md-3">
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) =>
                    setNewCost({ ...newCost, file: e.target.files[0] })
                  }
                />
              </div>
              <div className="col-md-2 d-grid">
                <button className="btn btn-primary" onClick={handleAddCost}>
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- TIMELINE -------------------- */}
        {activeTab === "timeline" && (
          <div>
            {timeline.length === 0 ? (
              <p className="text-muted">No timeline events yet.</p>
            ) : (
              <ul className="list-group">
                {timeline.map((t, i) => (
                  <li key={i} className="list-group-item">
                    <strong>{t.date}:</strong> {t.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* -------------------- SUMMARY -------------------- */}
        {activeTab === "summary" && (
          <div>
            <h6 className="mb-2">Job Summary</h6>
            <p>
              <strong>Documents Uploaded:</strong> {documents.length}
            </p>
            <p>
              <strong>Costs Added:</strong> {costs.length}
            </p>
            <p>
              <strong>Total Cost:</strong>{" "}
              {costs.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0)} BDT
            </p>
          </div>
        )}

        {activeTab === "document-overview" && (
          <div>
            <h6 className="mb-3">Document Overview</h6>
            {documents.length === 0 ? (
              <p className="text-muted">No documents uploaded yet.</p>
            ) : (
              <>
                <div
                  className="border rounded p-3 bg-light"
                  style={{ height: "80vh", overflowY: "auto" }}
                >
                  <iframe
                    src={previewUrl}
                    title="All Documents Preview"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
