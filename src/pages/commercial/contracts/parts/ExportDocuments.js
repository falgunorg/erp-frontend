import React from "react";
import { Link } from "react-router-dom";

export default function ExportDocuments({ form }) {
  console.log("CHECK INVOICES", form);
  return (
    <div className="full_page">
      <div className="text-end">
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
              <th>SHIPMENT DATE</th>
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
                  <td>{inv.inv_date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
