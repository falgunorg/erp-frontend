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

const SummaryDashboard = ({ data, form }) => {
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

  return (
    <div style={{ padding: 20 }}>
      <div className="text-center">
        <h5 className="summary-title text-uppercase">Summary Position</h5>
        <div className="summary-info">
          <strong>Contract :</strong> {form.title}
          <br />
          <strong>Company :</strong> {form.company?.title}
        </div>
        <br />
      </div>
      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={3}>
        {/* LEFT SIDE: Tables */}
        <Grid item xs={6} md={6}>
          {renderTable("Export", data.export.rows)}
          {renderTable("BB Import", data.import.rows)}
          {renderTable("Packing Credit (PC)", data.packingCredit.rows)}
          {renderTable("EDF Loan", data.edfLoan.rows)}
          {renderTable("Force Loan", data.forceLoan.rows)}
          {renderTable("Other Demand Loan", data.otherLoan.rows)}
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
