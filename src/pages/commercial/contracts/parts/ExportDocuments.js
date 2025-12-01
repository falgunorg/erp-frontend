import React from "react";
import { Link } from "react-router-dom";
import api from "services/api";

export default function ExportDocuments({ form }) {
  const handleBulkFileUpload = async (e) => {
    const selectedFiles = e.target.files;

    if (!selectedFiles || selectedFiles.length === 0) {
      alert("No files selected!");
      return;
    }

    const formData = new FormData();
    formData.append("contract_id", form.id); // your contract id

    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files[]", selectedFiles[i]);
    }

    try {
      const res = await api.post(
        "/commercial/invoices/bulk-file-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        console.log("Uploaded Files:", res.data.files);
        alert("Bulk Files Uploaded Successfully!");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("File Upload Failed!");
    }
  };

  return (
    <div className="full_page">
      <div className="text-end">
        <label for="multipleFiles" className="btn btn-sm btn-success me-2">
          + UPLOAD MULTIPLE INVOICE FILES
        </label>
        <input
          onChange={handleBulkFileUpload}
          hidden
          id="multipleFiles"
          type="file"
          name="files[]"
          multiple
        />

        <Link
          to="/commercial/invoices-create"
          className="btn btn-sm btn-primary"
        >
          + New Invoice
        </Link>
      </div>
      <br />
      <div className="section  table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>SL</th>
              <th>INVOICE NO.</th>
              <th>BANK BILL NO</th>
              <th>QTY</th>
              <th>INVOICE VAL.</th>

              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {form.invoices?.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center text-muted py-4">
                  No invoices found
                </td>
              </tr>
            ) : (
              form.invoices?.map((inv, idx) => (
                <tr key={inv.id}>
                  <td>{idx + 1}</td>
                  <td>
                    <Link to={`/commercial/invoices-show/${inv.id}`}>
                      {inv.invoice_no}
                    </Link>
                  </td>
                  <td>{inv.bank_bill_no}</td>
                  <td>{inv.qty} PCS</td>
                  <td>$ {inv.exp_value ?? "-"}</td>
                  <td>
                    <a target="_blank" href={inv.file_path}>
                      Details
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
