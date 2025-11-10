import React from "react";
import formatMoney from "services/moneyFormatter";

export default function PurchaseOrders({ form }) {
  return (
    <div className="pos">
      <div className="text-center">
        <h5 className="summary-title text-uppercase">PO'S</h5>
        <div className="summary-info">
          <strong>Contract/Export LC :</strong> {form.title}
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
              <th className="text-end">TOTAL (USD)</th>
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
                  <td>{po.total_qty} PCS</td>
                  <td className="text-end"> {formatMoney(po.total_value)}</td>
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
              <td className="text-end" colSpan={4}>
                <strong>TOTAL</strong>
              </td>
              <td>
                <strong>
                  {form?.pos?.reduce(
                    (sum, p) => sum + (parseFloat(p.total_qty) || 0),
                    0
                  )} PCS
                </strong>
              </td>
              <td className="text-end">
                <strong>
                  {formatMoney(
                    Array.isArray(form?.pos)
                      ? form.pos.reduce(
                          (sum, p) => sum + (parseFloat(p.total_value) || 0),
                          0
                        )
                      : 0
                  )}{" "}
                  USD
                </strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
