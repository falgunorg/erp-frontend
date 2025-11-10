import React from "react";
import { Link } from "react-router-dom";
import formatMoney from "services/moneyFormatter";

export default function BackToBack({ form }) {
  const groupedByCategory = form?.lcs?.reduce((acc, item) => {
    const category = item.commodity?.toUpperCase() || "UNKNOWN";
    const amount = parseFloat(item.total || 0);
    if (!acc[category]) acc[category] = 0;
    acc[category] += amount;
    return acc;
  }, {});

  // Step 2: Calculate total amount
  const totalAmount = Object.values(groupedByCategory).reduce(
    (a, b) => a + b,
    0
  );

  const totalContractValue = form?.pos
    ?.reduce((sum, p) => sum + (parseFloat(p.total_value) || 0), 0)
    .toFixed(2);

  // Step 4: Calculate % of total contract value used
  const totalPercentageUsed = (
    (form.contract_value / totalContractValue) *
    100
  ).toFixed(2);

  // Step 3: Prepare category rows with percentage
  const categoryRows = Object.entries(groupedByCategory).map(
    ([category, amount]) => ({
      category,
      amount,
      percent: ((amount / totalAmount) * 100).toFixed(2),
    })
  );

  return (
    <div className="bb">
      <div className="text-center">
        <h5 className="summary-title text-uppercase">BBLC</h5>
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
              <th>LC Number</th>
              <th>Issue Date</th>
              <th className="text-end">Contract Amt.</th>
              <th>Tole.(%)</th>
              <th>Closed Amt.</th>
              <th>Current Availabily</th>
              <th>Commidity</th>
              <th>PI'S</th>
              <th>Exporter Seller</th>
            </tr>
          </thead>
          <tbody>
            {form?.lcs?.length > 0 ? (
              form?.lcs?.map((lc, i) => (
                <tr key={i}>
                  <td>
                    <Link to={"/commercial/lcs-show/" + lc.id}>
                      {lc.lc_number}
                    </Link>
                  </td>
                  <td>{lc.issued_date}</td>
                  <td className="text-end">{formatMoney(lc.total)} USD</td>
                  <td>0.00</td>

                  <td>0.00</td>
                  <td>0.00</td>
                  <td>{lc.commodity}</td>
                  <td>
                    <ol>
                      {lc.lc_items?.map((item2, index2) => (
                        <li key={index2}>
                          <Link
                            to={"/merchandising/proformas-details/" + item2.id}
                          >
                            {item2.title}
                          </Link>
                        </li>
                      ))}
                    </ol>
                  </td>
                  <td>{lc.supplier?.company_name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center text-muted">
                  No contracts found.
                </td>
              </tr>
            )}

            <tr>
              <td className="text-end" colSpan={2}>
                <strong>TOTAL</strong>
              </td>
              <td className="text-end">
                <strong>
                  {formatMoney(
                    Array.isArray(form?.lcs)
                      ? form.lcs.reduce(
                          (sum, p) => sum + (parseFloat(p.total) || 0),
                          0
                        )
                      : 0
                  )}{" "}
                  USD
                </strong>
              </td>
              <td></td>

              <td>
                <strong>0.00</strong>
              </td>
              <td>
                <strong>0.00</strong>
              </td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <br />
      <br />
      <div className="row">
        <div className="col-lg-5">
          <table className="table table-bordered align-middle">
            <tbody>
              <tr>
                <td>Total Perchantage Used From Contract</td>
                <td>{totalPercentageUsed} %</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <br />
      <br />
      <div className="row">
        <div className="col-lg-4">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>COMMODITY CATEGORY</th>
                <th className="text-end">Amount</th>
                <th className="text-end">%</th>
              </tr>
            </thead>
            <tbody>
              {categoryRows.map((row) => (
                <tr key={row.category}>
                  <td>{row.category}</td>
                  <td className="text-end">{formatMoney(row.amount)}</td>
                  <td className="text-end">{row.percent}</td>
                </tr>
              ))}

              {/* TOTAL ROW */}
              <tr>
                <td className="text-end">
                  <strong>TOTAL</strong>
                </td>
                <td className="text-end">
                  <strong>{Number(totalAmount).toLocaleString()}</strong>
                </td>
                <td className="text-end">
                  <strong>100.00</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
