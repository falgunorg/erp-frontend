import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import CheckList from "./Checklist.json";
import { PDFDocument } from "pdf-lib";
import CustomSelect from "elements/CustomSelect";
import api from "services/api";
import moment from "moment";

export default function JobDetails() {
  const { jobId } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [job, setJob] = useState(null);

  const getJob = async () => {
    if (!jobId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/cnf/jobs/${jobId}`);
      if (response.status === 200 && response.data) {
        setJob(response.data);
      } else {
        setError(response.data?.errors || "Failed to fetch job");
        console.error(response.data?.errors);
      }
    } catch (err) {
      setError(err.response?.data?.errors || err.message);
      console.error("Error fetching job:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getJob();
  }, [jobId]);

  const [activeTab, setActiveTab] = useState("documents");
  const [documents, setDocuments] = useState([]);
  const [costs, setCosts] = useState([]);

  const [timeline, setTimeline] = useState([]);

  const importDocuments = CheckList["IMPORT"];
  const exportDocuments = CheckList["EXPORT"];
  const costLists = CheckList["COST"];

  const saveJob = (updatedJob) => setJob(updatedJob);

  const docList = job?.type === "IMPORT" ? importDocuments : exportDocuments;

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

  /* -------------------- Document Handling -------------------- */
  const handleFileUpload = async (docTitle, files) => {
    if (!jobId) return;

    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-GB");

    for (const file of files) {
      const formData = new FormData();
      formData.append("job_id", jobId);
      formData.append("title", docTitle);
      formData.append("file", file);

      try {
        const res = await api.post("/cnf/add-job-document", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.status === 200) {
          // Append newly uploaded document to state
          const uploadedDoc = res.data.data;
          setDocuments((prevDocs) => {
            const existing = prevDocs.find((d) => d.title === docTitle);
            if (existing) {
              existing.files.push({
                id: uploadedDoc.id,
                name: uploadedDoc.filename,
                type: uploadedDoc.file_type,
              });
              return [...prevDocs];
            } else {
              return [
                ...prevDocs,
                {
                  title: docTitle,
                  files: [
                    {
                      id: uploadedDoc.id,
                      name: uploadedDoc.filename,
                      type: uploadedDoc.file_type,
                    },
                  ],
                },
              ];
            }
          });

          // Update timeline
          setTimeline((prev) => [
            ...prev,
            {
              date: formattedDate,
              message: `Uploaded ${file.name} for ${docTitle}`,
            },
          ]);
        }
      } catch (err) {
        console.error("Upload failed:", err);
        alert("Failed to upload file: " + file.name);
      }
    }
  };

  const handleDeleteFile = async (docTitle, fileIndex) => {
    if (!window.confirm("Delete this File?")) return;
    const docData = documents.find((d) => d.title === docTitle);
    if (!docData) return;

    const file = docData.files[fileIndex];
    if (!file?.id) return alert("File ID missing");

    try {
      const res = await api.post("/cnf/delete-job-document", { id: file.id });
      if (res.status === 200) {
        const updatedDocs = documents.map((d) => {
          if (d.title === docTitle) {
            const newFiles = d.files.filter((_, i) => i !== fileIndex);
            return { ...d, files: newFiles };
          }
          return d;
        });

        // ✅ Update local state only
        setDocuments(updatedDocs);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete document");
    }
  };

  const handlePreviewFile = (file) => {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, "_blank");
  };

  /* -------------------- Cost Handling -------------------- */
  const [newCost, setNewCost] = useState({
    name: "",
    amount: "",
    files: [], // store multiple files
  });

  const handleAddCost = async () => {
    if (!newCost.name || !newCost.amount) {
      alert("Enter cost name and amount");
      return;
    }
    if (!jobId) return;

    const formData = new FormData();
    formData.append("job_id", jobId);
    formData.append("title", newCost.name);
    formData.append("amount", newCost.amount);

    // ✅ Append multiple files
    if (newCost.files && newCost.files.length > 0) {
      newCost.files.forEach((file) => {
        formData.append("files[]", file);
      });
    }

    try {
      const res = await api.post("/cnf/add-job-cost", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        const addedCost = res.data.data;
        setCosts((prev) => [...prev, addedCost]);
        setNewCost({ name: "", amount: "", files: [] });

        const date = new Date().toLocaleDateString("en-GB");
        setTimeline((prev) => [
          ...prev,
          {
            date,
            message: `Added cost "${newCost.name}"${
              newCost.files?.length ? " with attachments" : ""
            }`,
          },
        ]);
      }
    } catch (err) {
      console.error("Add cost failed:", err);
      alert("Failed to add cost");
    }
  };

  const handleDeleteCost = async (id) => {
    if (!window.confirm("Delete this Cost?")) return;
    if (!id) return;
    try {
      const res = await api.post("/cnf/delete-job-cost", { id });
      if (res.status === 200) {
        setCosts((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error("Delete cost failed:", err);
      alert("Failed to delete cost");
    }
  };

  useEffect(() => {
    if (job?.documents) {
      // Group documents by title
      const groupedDocs = job.documents.reduce((acc, doc) => {
        const existing = acc.find((d) => d.title === doc.title);
        const fileObj = {
          id: doc.id,
          name: doc.filename,
          type: doc.file_type,
          url: doc.file_url,
        };
        if (existing) {
          existing.files.push(fileObj);
        } else {
          acc.push({
            title: doc.title,
            files: [fileObj],
          });
        }
        return acc;
      }, []);

      setDocuments(groupedDocs);
    }
  }, [job]);

  useEffect(() => {
    if (job?.costs) {
      const formattedCosts = job.costs.map((cost) => ({
        id: cost.id,
        title: cost.title,
        amount: cost.amount,
        created_at: cost.created_at,
        files:
          cost.files?.map((f) => ({
            id: f.id,
            name: f.filename,
            url: f.file_url,
          })) || [],
      }));
      setCosts(formattedCosts);
    }
  }, [job]);

  useEffect(() => {
    if (!job) return;

    const events = [];

    // Include uploaded documents
    if (job.documents && job.documents.length > 0) {
      job.documents.forEach((doc) => {
        events.push({
          date: new Date(doc.created_at).toLocaleDateString("en-GB"),
          message: `Uploaded ${doc.filename} for ${doc.title}`,
        });
      });
    }

    // Include added costs
    if (job.costs && job.costs.length > 0) {
      job.costs.forEach((cost) => {
        events.push({
          date: new Date(cost.created_at).toLocaleDateString("en-GB"),
          message: `Added cost "${cost.title}" (${cost.amount} TK)${
            cost.filename ? " with attachments" : ""
          }`,
        });
      });
    }

    // Sort by date (latest first)
    events.sort((a, b) => new Date(b.date) - new Date(a.date));

    setTimeline(events);
  }, [job]);

  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    let urlObject = null;

    const generatePdf = async () => {
      if (!documents?.length) {
        setPreviewUrl(null);
        return;
      }

      try {
        const allFiles = documents.flatMap((doc) => doc.files || []);

        if (!allFiles.length) {
          setPreviewUrl(null);
          return;
        }

        const pdfDoc = await PDFDocument.create();

        for (const file of allFiles) {
          try {
            // 🟢 PDF Files
            if (file.type === "application/pdf") {
              const response = await api.get(
                `/cnf/get-document-file/${file.name}`
              );
              const arrayBuffer = await response.arrayBuffer();
              const existingPdf = await PDFDocument.load(arrayBuffer);

              const copiedPages = await pdfDoc.copyPages(
                existingPdf,
                existingPdf.getPageIndices()
              );
              copiedPages.forEach((page) => pdfDoc.addPage(page));
            }

            // 🟢 Image Files
            else if (file.type.startsWith("image/")) {
              const response = await api.get(
                `/cnf/get-document-file/${file.name}`
              );
              const imageBytes = await response.arrayBuffer();

              const image =
                file.type === "image/jpeg"
                  ? await pdfDoc.embedJpg(imageBytes)
                  : await pdfDoc.embedPng(imageBytes);

              const page = pdfDoc.addPage([595, 842]); // A4 size

              // Optional: Scale image to fit page
              const scale = Math.min(595 / image.width, 842 / image.height, 1);
              const width = image.width * scale;
              const height = image.height * scale;

              page.drawImage(image, {
                x: (595 - width) / 2,
                y: (842 - height) / 2,
                width,
                height,
              });
            }
          } catch (err) {
            console.error("File processing failed:", file.filename, err);
          }
        }

        // 🟢 Save and create preview URL
        const pdfBytes = await pdfDoc.save();
        urlObject = URL.createObjectURL(
          new Blob([pdfBytes], { type: "application/pdf" })
        );
        setPreviewUrl(urlObject);
      } catch (error) {
        console.error("Error generating PDF:", error);
        setPreviewUrl(null);
      }
    };

    generatePdf();

    return () => {
      if (urlObject) URL.revokeObjectURL(urlObject);
    };
  }, [documents]);

  console.log("previewUrl", previewUrl);

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
          <h5 className="mb-3">{job?.type} Job Information</h5>
          <div className="row g-2">
            {[
              ["pc_id", "PC ID"],
              ["lc_id", "LC ID"],
              ["booking_id", "Booking ID"],
              ["bill_of_landing_number", "BL No"],
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
                  <strong>{label}:</strong> {job?.[key] || "—"}
                </div>
              </div>
            ))}

            <div className="col-md-4">
              <div className="border p-2 rounded bg-light">
                <strong>Remarks:</strong> {job?.remarks}
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
                        {Array.isArray(docData?.files) &&
                        docData.files.length > 0
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

                  {Array.isArray(docData?.files) &&
                    docData.files.length > 0 && (
                      <div className="mb-3">
                        {docData.files.map((f, i) => (
                          <div
                            key={i}
                            style={{
                              float: "left",
                              border: "1px solid grey",
                              marginRight: "10px",
                              padding: "5px",
                            }}
                            className="d-flex gap-2 mb-3 rounded bg-light"
                          >
                            <small
                              style={{ cursor: "pointer" }}
                              onClick={() => window.open(f.url, "_blank")}
                            >
                              {f.name}
                            </small>
                            <div className="d-flex gap-2">
                              <i
                                style={{ cursor: "pointer" }}
                                onClick={() => window.open(f.url, "_blank")}
                                className="fa fa-eye text-success"
                              ></i>
                              <i
                                style={{ cursor: "pointer" }}
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
                    <th>Date</th>
                    <th>Cost Name</th>
                    <th>Amount</th>
                    <th>Files</th>
                    <th width="80">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {costs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        No costs added yet.
                      </td>
                    </tr>
                  ) : (
                    costs.map((c) => (
                      <tr key={c.id}>
                        <td>{moment(c.created_at).format("MMM Do YYYY")}</td>
                        <td>{c.title}</td>
                        <td>{c.amount}</td>
                        <td>
                          {Array.isArray(c?.files) && c.files.length > 0 && (
                            <div className="mb-3">
                              {c.files.map((f, i) => (
                                <div
                                  key={i}
                                  style={{
                                    float: "left",
                                    border: "1px solid grey",
                                    marginRight: "10px",
                                    padding: "5px",
                                  }}
                                  className="d-flex gap-2 rounded bg-light align-items-center"
                                >
                                  <small
                                    style={{ cursor: "pointer" }}
                                    onClick={() => window.open(f.url, "_blank")}
                                  >
                                    {f.name}
                                  </small>
                                  <div className="d-flex gap-2">
                                    <i
                                      style={{ cursor: "pointer" }}
                                      onClick={() =>
                                        window.open(f.url, "_blank")
                                      }
                                      className="fa fa-eye text-success"
                                    ></i>
                                  </div>
                                </div>
                              ))}
                            </div>
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
                  multiple // ✅ allow multiple files
                  onChange={(e) =>
                    setNewCost({
                      ...newCost,
                      files: Array.from(e.target.files),
                    })
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
