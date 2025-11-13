import React, { useMemo } from "react";
import formatMoney from "services/moneyFormatter";
import { Link } from "react-router-dom";

export default function BackToBackBills({ form }) {
  const bbBills = useMemo(() => {
    return (
      form?.lcs?.flatMap((lc) =>
        (lc.bills || []).map((bill) => ({
          ...bill,
          lc_number: lc.lc_number,
        }))
      ) || []
    );
  }, [form]);

  // ✅ Calculate totals
  const totals = useMemo(() => {
    return bbBills.reduce(
      (acc, bill) => {
        acc.contract += parseFloat(bill.contract_amount || 0);
        acc.bill += parseFloat(bill.bill_amount_liqd || 0);
        acc.charge += parseFloat(bill.charge_amount || 0);
        return acc;
      },
      { contract: 0, bill: 0, charge: 0 }
    );
  }, [bbBills]);

  // ✅ Group by `source_of_fund`
  const groupedFunds = useMemo(() => {
    const grouped = {};
    bbBills.forEach((bill) => {
      const key = bill.source_of_fund || "Unknown";
      const amount = parseFloat(bill.bill_amount_liqd || 0);
      grouped[key] = (grouped[key] || 0) + amount;
    });
    return grouped;
  }, [bbBills]);

  // ✅ Calculate total liquidation amount
  const totalLiquidation = useMemo(() => {
    return Object.values(groupedFunds).reduce((sum, val) => sum + val, 0);
  }, [groupedFunds]);

  // ✅ Prepare table data with percentages
  const tableData = Object.entries(groupedFunds).map(([source, amount]) => ({
    source,
    amount,
    percent: totalLiquidation
      ? ((amount / totalLiquidation) * 100).toFixed(2)
      : "0.00",
  }));

  return (
    <div className="bb_bils">
      <div className="text-center">
        <h5 className="summary-title text-uppercase">BB Bill</h5>
        <div className="summary-info">
          <strong>Contract/Export LC :</strong> {form.title}
          <br />
        </div>
        <br />
      </div>

      <div className="section table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>LC No.</th>
              <th>BC Contract No.</th>
              <th>User Ref. No</th>

              <th>Issue Date</th>
              <th className="text-end">Contract Amt.</th>
              <th className="text-end"> Bill Amt. LIQD.</th>
              <th className="text-end">Intt./Charge Amt.</th>
              <th>Maturity Date</th>
              <th>Paid Date</th>
              <th>Source of Fund</th>
            </tr>
          </thead>
          <tbody>
            {bbBills.length > 0 ? (
              <>
                {bbBills.map((bill) => (
                  <tr key={bill.id}>
                    <td>
                      <Link to={"/commercial/lcs-show/" + bill.lc_id}>
                        {bill.lc_number}
                      </Link>
                    </td>
                    <td>{bill.bc_contract_no}</td>
                    <td>{bill.user_ref_no}</td>
                    <td>{bill.issued_date}</td>
                    <td className="text-end">{formatMoney(bill.contract_amount)}</td>
                    <td className="text-end">{formatMoney(bill.bill_amount_liqd)}</td>
                    <td className="text-end">{formatMoney(bill.charge_amount)}</td>
                    <td>{bill.maturity_date}</td>
                    <td>{bill.paid_date}</td>
                    <td>{bill.source_of_fund}</td>
                  </tr>
                ))}

                {/* ✅ Totals Row */}
                <tr>
                  <td className="text-end" colSpan={4}>
                    <strong>TOTAL</strong>
                  </td>
                  <td className="text-end">
                    <strong>{formatMoney(totals.contract)}</strong>
                  </td>
                  <td className="text-end">
                    <strong>{formatMoney(totals.bill)}</strong>
                  </td>
                  <td className="text-end">
                    <strong>{formatMoney(totals.charge)}</strong>
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan={11} className="text-center text-muted">
                  No Back-to-Back Bills Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <br />
      <br />
      <div className="row">
        <div className="col-lg-4">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Payment Details (Liquidation Amount)</th>
                <th className="text-end">Amount</th>
                <th className="text-end">%</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length > 0 ? (
                tableData.map((item) => (
                  <tr key={item.source}>
                    <td>{item.source}</td>
                    <td className="text-end">{formatMoney(item.amount)}</td>
                    <td className="text-end">{item.percent}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center text-muted">
                    No Data Available
                  </td>
                </tr>
              )}

              {/* ✅ Total Row */}
              {tableData.length > 0 && (
                <tr>
                  <td className="text-end">
                    <strong>Total</strong>
                  </td>
                  <td className="text-end">
                    <strong>{formatMoney(totalLiquidation)}</strong>
                  </td>
                  <td className="text-end">
                    <strong>100%</strong>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
