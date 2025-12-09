import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Grid,
  Divider,
} from "@mui/material";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const SummaryDashboard = ({ form }) => {
  const totalInvoicesValue = form.invoices?.reduce(
    (sum, item) => sum + Number(item.exp_value || 0),
    0
  );
  const totalBacktoBackValue = form.lcs?.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );

  const totalBacktoBackBillsValue = form.bills?.reduce(
    (sum, item) => sum + Number(item.contract_amount || 0),
    0
  );

  const data = {
    export: {
      totalValue: form.contract_value,
      rows: [
        {
          desc: "TOTAL EXPORT LC/CONTRACT VALUE",
          ccy: "USD",
          amount: form.contract_value,
        },
        {
          desc: "TOTAL EXPORT BILL SUBMITTED",
          ccy: "USD",
          amount: totalInvoicesValue,
        },
        {
          desc: "REPATAITE AMOUNT",
          ccy: "USD",
          amount: totalInvoicesValue,
        },
        {
          desc: "REMAINING EXPORT",
          ccy: "USD",
          amount: form.contract_value - totalInvoicesValue,
        },
      ],
    },
    import: {
      totalImport: totalBacktoBackValue,
      rows: [
        {
          desc: "TOTAL BBLC AMOUNT FOR IMPORT",
          ccy: "USD",
          amount: totalBacktoBackValue,
        },

        {
          desc: "TOTAL BB BILL",
          ccy: "USD",
          amount: totalBacktoBackBillsValue,
        },
        { desc: "TOTAL BB BILL SETTLED", ccy: "USD", amount: 77011.61 },
        {
          desc: "BB BILL OUTSTANDING",
          ccy: "USD",
          amount: totalBacktoBackValue - totalBacktoBackBillsValue,
        },
        {
          desc: "% BB IMPORT",
          ccy: "%",
          amount: form.contract_value
            ? ((totalBacktoBackValue / form.contract_value) * 100).toFixed(2)
            : 0,
        },
        { desc: "TOTAL IMPORT", ccy: "USD", amount: totalBacktoBackValue },
      ],
    },
    packingCredit: {
      rows: [
        { desc: "PC DISBURSED", ccy: "BDT", amount: 0.0 },
        { desc: "PC OUTSTANDING (PR.+INT.+Cal.)", ccy: "BDT", amount: 0.0 },
      ],
    },
    edfLoan: {
      rows: [
        { desc: "EDF LOAN DISBURSED", ccy: "USD", amount: 0.0 },
        {
          desc: "EDF LOAN OUTSTANDING (PR.+INT.+Cal.)",
          ccy: "USD",
          amount: 0.0,
        },
      ],
    },
    forceLoan: {
      rows: [
        { desc: "FORCE LOAN DISBURSED", ccy: "BDT", amount: 217372.28 },
        {
          desc: "FORCE LOAN OUTSTANDING (PR.+INT.+Cal.)",
          ccy: "BDT",
          amount: 0.0,
        },
      ],
    },
    otherLoan: {
      rows: [
        { desc: "TOTAL OTHER LOAN DISBURSED", ccy: "BDT", amount: 0.0 },
        {
          desc: "TOTAL OTHER LOAN OUTSTANDING (PR.+INT.+Cal.)",
          ccy: "BDT",
          amount: 0.0,
        },
      ],
    },
    dfc: {
      rows: [
        { desc: "TOTAL CREDIT TO DFC", ccy: "USD", amount: 68112.93 },
        {
          desc: "TOTAL CREDIT FROM EXP. PROCEED",
          ccy: "USD",
          amount: 68112.93,
        },
        { desc: "TOTAL CREDIT FROM OTHERS", ccy: "USD", amount: 0.0 },
        { desc: "TOTAL DEBIT FROM DFC", ccy: "USD", amount: 78814.04 },
        { desc: "TOTAL BB PAYMENT", ccy: "USD", amount: 77011.61 },
        { desc: "OTHER DEBIT", ccy: "USD", amount: 1802.43 },
        { desc: "CURRENT DFC BALANCE", ccy: "USD", amount: -10701.11 },
      ],
    },
  };

  // Pie Chart: Export vs Import
  const exportImportChart = {
    labels: ["Export Value", "Import Value"],
    datasets: [
      {
        data: [data.export.totalValue, data.import.totalImport],
        backgroundColor: ["#1976d2", "#2e7d32"],
      },
    ],
  };

  // Bar Chart for Export
  const exportChart = {
    labels: data.export.rows.map((r) => r.desc),
    datasets: [
      {
        label: "Export (USD)",
        data: data.export.rows.map((r) => r.amount),
        backgroundColor: "#42a5f5",
      },
    ],
  };

  // Bar Chart for BB Import
  const importChart = {
    labels: data.import.rows.map((r) => r.desc),
    datasets: [
      {
        label: "BB Import (USD)",
        data: data.import.rows.map((r) => r.amount),
        backgroundColor: "#81c784",
      },
    ],
  };

  // Bar Chart for DFC
  const dfcChart = {
    labels: data.dfc.rows.map((r) => r.desc),
    datasets: [
      {
        label: "DFC (USD)",
        data: data.dfc.rows.map((r) => r.amount),
        backgroundColor: "#ffb74d",
      },
    ],
  };

  // Common Table Renderer
  const renderTable = (title, rows) => (
    <Card variant="outlined" sx={{ mb: 3, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ textTransform: "uppercase" }}
        >
          {title}
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>Description</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.desc}</TableCell>
                <TableCell>{row.ccy}</TableCell>
                <TableCell align="right">
                  {Number(row.amount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const formatChange = (num) => {
    if (num === null) return "—";
    if (num > 0) return `+${num.toFixed(2)}`;
    if (num < 0) return `${num.toFixed(2)}`;
    return num;
  };
  return (
    <div style={{ padding: 20 }}>
      <div className="text-center">
        <h5 className="summary-title text-uppercase">Summary Position</h5>
        <div className="summary-info">
          <strong>Contract/Export LC :</strong> {form.title}
          <br />
          <strong>Company :</strong> {form.company?.title}
        </div>
        <br />
      </div>
      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={3}>
        {/* LEFT SIDE: Tables */}
        <Grid item xs={6} md={6}>
          <div className="table-responsive mt-3">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Date</th>
                  <th>Revision No</th>
                  <th>Qty</th>
                  <th>Change</th>
                  <th>Contract Value</th>
                  <th>Change</th>
                  <th>Agent Commission</th>
                  <th>Change</th>
                </tr>
              </thead>

              <tbody>
                {form.revision_history?.map((rev, index) => {
                  const isInitial = rev.revision_no === "initial";
                  const isCurrent = rev.revision_no === "current";

                  const qtyChangeColor =
                    rev.qty_change > 0
                      ? "text-success"
                      : rev.qty_change < 0
                      ? "text-danger"
                      : "";

                  const valueChangeColor =
                    rev.value_change > 0
                      ? "text-success"
                      : rev.value_change < 0
                      ? "text-danger"
                      : "";

                  const commissionChangeColor =
                    rev.commission_change > 0
                      ? "text-success"
                      : rev.commission_change < 0
                      ? "text-danger"
                      : "";

                  return (
                    <tr key={index}>
                      {/* DATE */}
                      <td>
                        {rev.date
                          ? new Date(rev.date).toLocaleDateString()
                          : "—"}
                      </td>

                      {/* Revision No */}
                      <td style={{ fontWeight: "bold" }}>
                        {isInitial
                          ? "Initial"
                          : isCurrent
                          ? "Current"
                          : `Amendment ${rev.revision_no}`}
                      </td>

                      {/* QTY */}
                      <td>{rev.qty.toLocaleString()}</td>

                      {/* Qty Change */}
                      <td className={qtyChangeColor}>
                        {rev.qty_change === null
                          ? "—"
                          : rev.qty_change > 0
                          ? `+${rev.qty_change.toLocaleString()}`
                          : rev.qty_change.toLocaleString()}
                      </td>

                      {/* Contract Value */}
                      <td>{Number(rev.value).toLocaleString()}</td>

                      {/* Contract Value Change */}
                      <td className={valueChangeColor}>
                        {rev.value_change === null
                          ? "—"
                          : rev.value_change > 0
                          ? `+${Number(rev.value_change).toLocaleString()}`
                          : Number(rev.value_change).toLocaleString()}
                      </td>

                      {/* Agent Commission */}
                      <td>{Number(rev.agent_commission).toLocaleString()}</td>

                      {/* Agent Commission Change */}
                      <td className={commissionChangeColor}>
                        {rev.commission_change === null
                          ? "—"
                          : rev.commission_change > 0
                          ? `+${Number(rev.commission_change).toLocaleString()}`
                          : Number(rev.commission_change).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {renderTable("Export", data.export.rows)}
          {renderTable("BB Import", data.import.rows)}
          {renderTable("Packing Credit (PC)", data.packingCredit.rows)}
          {renderTable("EDF Loan", data.edfLoan.rows)}
          {renderTable("Force Loan", data.forceLoan.rows)}
          {renderTable("DFC", data.dfc.rows)}
        </Grid>

        {/* RIGHT SIDE: Charts */}
        <Grid item xs={6} md={6}>
          <div className="row">
            <div className="col-lg-3">
              {" "}
              <Card sx={{ mb: 3, p: 2, boxShadow: 3, borderRadius: 2 }}>
                <Typography align="center" variant="subtitle1" gutterBottom>
                  Export vs Import
                </Typography>
                <Pie data={exportImportChart} height={150} />
              </Card>
            </div>
            <div className="col-lg-9">
              {" "}
              <Card sx={{ mb: 3, p: 2, boxShadow: 3, borderRadius: 2 }}>
                <Typography align="center" variant="subtitle1" gutterBottom>
                  Export Breakdown
                </Typography>
                <Bar
                  data={exportChart}
                  options={{ plugins: { legend: { display: false } } }}
                />
              </Card>
            </div>
          </div>

          <Card sx={{ mb: 3, p: 2, boxShadow: 3, borderRadius: 2 }}>
            <Typography align="center" variant="subtitle1" gutterBottom>
              BB Import Breakdown
            </Typography>
            <Bar
              data={importChart}
              options={{ plugins: { legend: { display: false } } }}
            />
          </Card>

          <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
            <Typography align="center" variant="subtitle1" gutterBottom>
              DFC Summary
            </Typography>
            <Bar
              data={dfcChart}
              options={{ plugins: { legend: { display: false } } }}
            />
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default SummaryDashboard;
