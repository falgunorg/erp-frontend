import React from "react";
import { Link } from "react-router-dom";
import api from "services/api";

export default function ExportDocuments({ form }) {


  
  const handleBulkFileUpload = async (e) => {
    const file = e.target.files[0]; // only one file

    if (!file) {
      alert("No file selected!");
      return;
    }

    const formData = new FormData();
    formData.append("contract_id", form.id); // your contract id
    formData.append("file", file); // single file only

    try {
      const res = await api.post("/commercial/invoices/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        console.log("Uploaded File:", res.data.file);
        alert("File Imported Successfully!");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("File Upload Failed!");
    }
  };

  return (
    <div className="full_page">
      <div className="text-end">
        <label htmlFor="singleFile" className="btn btn-sm btn-success me-2">
          + IMPORT EXCEL
        </label>

        <input
          onChange={handleBulkFileUpload}
          hidden
          id="singleFile"
          type="file"
          name="file"
          accept=".xlsx,.xls" // optional but recommended
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
