import React from "react";
import { Link } from "react-router-dom";
import formatMoney from "services/moneyFormatter";

export default function BackToBack({ form }) {
  const allCategories = [
    "FABRIC",
    "SEWING TRIMS",
    "FINISHING TRIMS",
    "PACKING TRIMS",
  ];

  const groupedByCategory =
    form?.lcs?.reduce((acc, item) => {
      const category = item?.commodity?.toUpperCase() || "UNKNOWN";
      const amount = parseFloat(item?.total || 0);
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {}) || {};

  const totalAmount = Object.values(groupedByCategory).reduce(
    (a, b) => a + b,
    0
  );

  const totalLcValue = (
    form?.lcs?.reduce((sum, l) => sum + (parseFloat(l?.total) || 0), 0) || 0
  ).toFixed(2);

  const totalPercentageUsed =
    form?.contract_value && parseFloat(form.contract_value) > 0
      ? (
          (parseFloat(totalLcValue) / parseFloat(form.contract_value)) *
          100
        ).toFixed(2)
      : "0.00";

  // Step 3: Prepare category rows with percentage
  const categoryRows = allCategories.map((cat) => {
    const amount = groupedByCategory[cat] || 0;
    const percent =
      totalAmount > 0 ? ((amount / totalAmount) * 100).toFixed(2) : "0.00";
    return { category: cat, amount, percent };
  });

  return (
    <div className="bb">
      <div className="text-center">
        <h5 className="summary-title text-uppercase">BBLC</h5>
        <div className="summary-info">
          <strong>Contract/Export LC :</strong> {form?.title}
          <br />
        </div>
        <br />
      </div>
      <div className="text-end">
        <Link className="btn btn-info btn-sm" to="/commercial/lcs-create">
          Add New
        </Link>
      </div>
      <br />
      <div className="section  table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>LC Number</th>
              <th>Issue Date</th>
              <th className="text-end">Contract Amt.</th>
              <th className="text-end">Tole.(%)</th>
              <th className="text-end">Closed Amt.</th>
              <th className="text-end">BB Bill Submitted</th>
              <th className="text-end">BB Bill LIQD</th>
              <th className="text-end">Current Availabily</th>
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
                    <Link to={`/commercial/lcs-show/${lc.id}`}>
                      {lc.lc_number}
                    </Link>
                  </td>
                  <td>{lc.issued_date}</td>
                  <td className="text-end">{formatMoney(lc.total)} USD</td>
                  <td>0.00</td>
                  <td>0.00</td>
                  <td className="text-end">
                    {formatMoney(
                      lc.bills.reduce(
                        (sum, b) => sum + parseFloat(b.contract_amount || 0),
                        0
                      )
                    )}
                  </td>
                  <td className="text-end">
                    {formatMoney(
                      lc.bills.reduce(
                        (sum, b) => sum + parseFloat(b.bill_amount_liqd || 0),
                        0
                      )
                    )}
                  </td>
                  <td className="text-end">
                    {formatMoney(
                      lc.bills.reduce(
                        (sum, b) => sum + parseFloat(b.contract_amount || 0),
                        0
                      ) -
                        lc.bills.reduce(
                          (sum, b) => sum + parseFloat(b.bill_amount_liqd || 0),
                          0
                        )
                    )}
                  </td>
                  <td>{lc.commodity}</td>

                  <td>
                    <ol>
                      {lc.lc_items?.map((item2, index2) => (
                        <li key={index2}>
                          <Link
                            to={`/merchandising/proformas-details/${item2.id}`}
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

            {/* ✅ TOTAL ROW */}
            <tr>
              <td className="text-end" colSpan={2}>
                <strong>TOTAL</strong>
              </td>

              {/* Total LC amount */}
              <td className="text-end">
                <strong>
                  {formatMoney(
                    form?.lcs?.reduce(
                      (sum, lc) => sum + parseFloat(lc.total || 0),
                      0
                    )
                  )}{" "}
                  USD
                </strong>
              </td>

              {/* Optional empty columns */}
              <td></td>
              <td></td>

              {/* ✅ Total Contract Amount */}
              <td className="text-end">
                <strong>
                  {formatMoney(
                    form?.lcs?.reduce(
                      (sum, lc) =>
                        sum +
                        lc.bills.reduce(
                          (sub, b) => sub + parseFloat(b.contract_amount || 0),
                          0
                        ),
                      0
                    )
                  )}
                </strong>
              </td>

              {/* ✅ Total Bill Liquidation Amount */}
              <td className="text-end">
                <strong>
                  {formatMoney(
                    form?.lcs?.reduce(
                      (sum, lc) =>
                        sum +
                        lc.bills.reduce(
                          (sub, b) => sub + parseFloat(b.bill_amount_liqd || 0),
                          0
                        ),
                      0
                    )
                  )}
                </strong>
              </td>

              {/* ✅ Total Remaining (Contract - Bill Liquidation) */}
              <td className="text-end">
                <strong>
                  {formatMoney(
                    form?.lcs?.reduce((sum, lc) => {
                      const totalContract = lc.bills.reduce(
                        (sub, b) => sub + parseFloat(b.contract_amount || 0),
                        0
                      );
                      const totalLiquidated = lc.bills.reduce(
                        (sub, b) => sub + parseFloat(b.bill_amount_liqd || 0),
                        0
                      );
                      return sum + (totalContract - totalLiquidated);
                    }, 0)
                  )}
                </strong>
              </td>

              <td colSpan={3}></td>
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
