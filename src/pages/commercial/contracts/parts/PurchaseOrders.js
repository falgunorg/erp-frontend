import React from "react";

export default function PurchaseOrders({ form }) {
  return (
    <div className="pos">
      <div className="text-center">
        <h5 className="summary-title text-uppercase">PO'S</h5>
        <div className="summary-info">
          <strong>Contract :</strong> {form.title}
          <br />
        </div>
        <br />
      </div>
      <div className="section  table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>PO</th>
              <th>STYLE</th>
              <th>ISSUE Date</th>
              <th>DELIVERY DATE</th>
              <th>QTY (PCS)</th>
              <th>TOTAL (USD)</th>
            </tr>
          </thead>
          <tbody>
            {form?.pos?.length > 0 ? (
              form?.pos?.map((po, i) => (
                <tr key={i}>
                  <td>{po.po_number}</td>
                  <td>{po.techpack?.techpack_number}</td>
                  <td>{po.issued_date}</td>
                  <td>{po.delivery_date}</td>
                  <td>{po.total_qty}</td>
                  <td>{po.total_value}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  No contracts found.
                </td>
              </tr>
            )}

            <tr>
              <td className="text-center" colSpan={4}>
                <strong>TOTAL</strong>
              </td>
              <td>
                <strong>
                  {form?.pos?.reduce(
                    (sum, p) => sum + (parseFloat(p.total_qty) || 0),
                    0
                  )}
                </strong>
              </td>
              <td>
                <strong>
                  {form?.pos
                    ?.reduce(
                      (sum, p) => sum + (parseFloat(p.total_value) || 0),
                      0
                    )
                    .toFixed(2)}
                </strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
