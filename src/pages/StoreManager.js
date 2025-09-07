// src/pages/StoreManagementSystem.js
import React, { useState, useMemo } from "react";
import {
  Container,
  Grid,
  Button,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Checkbox,
  FormControlLabel,
  CardHeader,
  Typography,
  Badge,
  Tabs,
  Tab,
  Box,
} from "@mui/material";

import WarehouseIcon from "@mui/icons-material/Warehouse";
import PackageIcon from "@mui/icons-material/Inventory2";
import InboxIcon from "@mui/icons-material/Inbox";
import ArchiveIcon from "@mui/icons-material/Archive";
import SendIcon from "@mui/icons-material/Send";
import UploadIcon from "@mui/icons-material/Upload";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";

// -----------------------------
// Mock Data
// -----------------------------
const CATEGORIES = [
  "Fabric",
  "Trims",
  "Accessories",
  "Packaging",
  "Labels",
  "Thread",
];
const DEPARTMENTS = [
  "Cutting",
  "Sewing",
  "Finishing",
  "Washing",
  "QC",
  "Store Return",
];

const seedItems = [
  {
    id: "SKU-1001",
    name: "Cotton Twill Fabric",
    category: "Fabric",
    color: "Navy",
    size: "152cm",
    unit: "yard",
    stock: 1200,
    status: "In Stock",
    description: "High-quality cotton twill fabric for shirts and jackets.",
    wo_number: "WO-2001",
    total_received: 900,
    total_issues: 300,
  },
  {
    id: "SKU-1002",
    name: "Poly Button 4-hole",
    category: "Accessories",
    color: "Black",
    size: "18L",
    unit: "pcs",
    stock: 4500,
    status: "In Stock",
    description: "Durable poly buttons for garments.",
    wo_number: "WO-2002",
    total_received: 3300,
    total_issues: 1200,
  },
  {
    id: "SKU-1003",
    name: "Woven Label Main",
    category: "Labels",
    color: "White",
    size: "25mm",
    unit: "pcs",
    stock: 200,
    status: "Low",
    description: "Custom woven labels for branding.",
    wo_number: "WO-2003",
    total_received: 380,
    total_issues: 180,
  },
  {
    id: "SKU-1004",
    name: "Carton Box 5ply",
    category: "Packaging",
    color: "Brown",
    size: "60x40x40",
    unit: "pcs",
    stock: 0,
    status: "Out of Stock",
    description: "Strong 5-ply cartons for shipping.",
    wo_number: "WO-2004",
    total_received: 0,
    total_issues: 0,
  },
  {
    id: "SKU-1005",
    name: "Tex Thread 40/2",
    category: "Thread",
    color: "Royal Blue",
    size: "5000m",
    unit: "cone",
    stock: 650,
    status: "In Stock",
    description: "High strength sewing thread.",
    wo_number: "WO-2005",
    total_received: 740,
    total_issues: 90,
  },
  {
    id: "SKU-1006",
    name: "Zipper #5 Nylon",
    category: "Trims",
    color: "Silver",
    size: "20cm",
    unit: "pcs",
    stock: 3200,
    status: "In Stock",
    description: "Durable nylon zipper for jackets and pants.",
    wo_number: "WO-2006",
    total_received: 4200,
    total_issues: 1000,
  },
  {
    id: "SKU-1007",
    name: "Denim Fabric",
    category: "Fabric",
    color: "Blue",
    size: "160cm",
    unit: "yard",
    stock: 800,
    status: "In Stock",
    description: "Premium denim fabric for jeans.",
    wo_number: "WO-2007",
    total_received: 1000,
    total_issues: 200,
  },
  {
    id: "SKU-1008",
    name: "Metal Snap Button",
    category: "Accessories",
    color: "Silver",
    size: "12mm",
    unit: "pcs",
    stock: 2500,
    status: "In Stock",
    description: "Strong metal snaps for jackets.",
    wo_number: "WO-2008",
    total_received: 3000,
    total_issues: 500,
  },
  {
    id: "SKU-1009",
    name: "Polyester Lining",
    category: "Fabric",
    color: "White",
    size: "150cm",
    unit: "yard",
    stock: 600,
    status: "In Stock",
    description: "Smooth polyester lining for garments.",
    wo_number: "WO-2009",
    total_received: 800,
    total_issues: 200,
  },
  {
    id: "SKU-1010",
    name: "Elastic Band 2cm",
    category: "Trims",
    color: "Black",
    size: "2cm",
    unit: "meter",
    stock: 1200,
    status: "In Stock",
    description: "Elastic band for waistbands and cuffs.",
    wo_number: "WO-2010",
    total_received: 1500,
    total_issues: 300,
  },
  {
    id: "SKU-1011",
    name: "Cotton Poplin Fabric",
    category: "Fabric",
    color: "White",
    size: "150cm",
    unit: "yard",
    stock: 1000,
    status: "In Stock",
    description: "Smooth cotton poplin for shirts.",
    wo_number: "WO-2011",
    total_received: 1200,
    total_issues: 200,
  },
  {
    id: "SKU-1012",
    name: "Plastic Buckle 30mm",
    category: "Accessories",
    color: "Black",
    size: "30mm",
    unit: "pcs",
    stock: 1800,
    status: "In Stock",
    description: "Durable plastic buckle for bags.",
    wo_number: "WO-2012",
    total_received: 2000,
    total_issues: 200,
  },
  {
    id: "SKU-1013",
    name: "Woven Label Care",
    category: "Labels",
    color: "White",
    size: "30mm",
    unit: "pcs",
    stock: 400,
    status: "In Stock",
    description: "Woven care labels.",
    wo_number: "WO-2013",
    total_received: 500,
    total_issues: 100,
  },
  {
    id: "SKU-1014",
    name: "Carton Box 3ply",
    category: "Packaging",
    color: "Brown",
    size: "50x35x35",
    unit: "pcs",
    stock: 100,
    status: "Low",
    description: "Lightweight carton boxes.",
    wo_number: "WO-2014",
    total_received: 200,
    total_issues: 100,
  },
  {
    id: "SKU-1015",
    name: "Tex Thread 30/2",
    category: "Thread",
    color: "White",
    size: "5000m",
    unit: "cone",
    stock: 500,
    status: "In Stock",
    description: "Strong sewing thread.",
    wo_number: "WO-2015",
    total_received: 600,
    total_issues: 100,
  },
  {
    id: "SKU-1016",
    name: "Zipper #3 Nylon",
    category: "Trims",
    color: "Black",
    size: "15cm",
    unit: "pcs",
    stock: 1500,
    status: "In Stock",
    description: "Small nylon zippers for shirts.",
    wo_number: "WO-2016",
    total_received: 1800,
    total_issues: 300,
  },
  {
    id: "SKU-1017",
    name: "Silk Fabric",
    category: "Fabric",
    color: "Red",
    size: "140cm",
    unit: "yard",
    stock: 300,
    status: "Low",
    description: "Luxury silk fabric.",
    wo_number: "WO-2017",
    total_received: 350,
    total_issues: 50,
  },
  {
    id: "SKU-1018",
    name: "Metal Button 2-hole",
    category: "Accessories",
    color: "Silver",
    size: "15mm",
    unit: "pcs",
    stock: 1200,
    status: "In Stock",
    description: "Shiny metal buttons.",
    wo_number: "WO-2018",
    total_received: 1500,
    total_issues: 300,
  },
  {
    id: "SKU-1019",
    name: "Poly Label Main",
    category: "Labels",
    color: "White",
    size: "25mm",
    unit: "pcs",
    stock: 300,
    status: "Low",
    description: "Durable polyester labels.",
    wo_number: "WO-2019",
    total_received: 400,
    total_issues: 100,
  },
  {
    id: "SKU-1020",
    name: "Carton Box 7ply",
    category: "Packaging",
    color: "Brown",
    size: "70x50x50",
    unit: "pcs",
    stock: 50,
    status: "Low",
    description: "Extra strong shipping cartons.",
    wo_number: "WO-2020",
    total_received: 100,
    total_issues: 50,
  },
];

const seedBookings = [
  {
    bookingNo: "BK-240915-01",
    itemId: "SKU-1006",
    itemName: "Zipper #5 Nylon",
    requiredQty: 1500,
    uom: "pcs",
    orderRef: "PO-8891",
    buyer: "H&M",
    deliveryDate: "2025-09-15",
  },
  {
    bookingNo: "BK-240920-02",
    itemId: "SKU-1002",
    itemName: "Poly Button 4-hole",
    requiredQty: 2000,
    uom: "pcs",
    orderRef: "PO-8892",
    buyer: "PVH",
    deliveryDate: "2025-09-20",
  },
  {
    bookingNo: "BK-240925-03",
    itemId: "SKU-1001",
    itemName: "Cotton Twill Fabric",
    requiredQty: 800,
    uom: "yard",
    orderRef: "PO-8893",
    buyer: "Zara",
    deliveryDate: "2025-09-25",
  },
];

// -----------------------------
// Helper Components
// -----------------------------
const StatCard = ({ icon: Icon, title, value, hint }) => (
  <Card variant="outlined">
    <CardContent>
      <Typography
        variant="subtitle2"
        color="textSecondary"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <Icon fontSize="small" /> {title}
      </Typography>
      <Typography variant="h5">{value}</Typography>
      {hint && (
        <Typography variant="caption" color="textSecondary">
          {hint}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const StatusBadge = ({ status }) => {
  const colorMap = {
    "In Stock": "success",
    Low: "warning",
    "Out of Stock": "error",
  };
  return (
    <Chip label={status} color={colorMap[status] || "default"} size="small" />
  );
};

// -----------------------------
// Filter Hook
// -----------------------------
function useFilters(items) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("name-asc");

  const filtered = useMemo(() => {
    let out = [...items];
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter(
        (i) =>
          i.id.toLowerCase().includes(q) ||
          i.name.toLowerCase().includes(q) ||
          i.color.toLowerCase().includes(q) ||
          i.wo_number.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      );
    }
    if (category !== "all") out = out.filter((i) => i.category === category);
    if (status !== "all") out = out.filter((i) => i.status === status);
    if (inStockOnly) out = out.filter((i) => i.stock > 0);

    const [key, dir] = sortBy.split("-");
    out.sort((a, b) => {
      const mul = dir === "asc" ? 1 : -1;
      if (key === "name") return a.name.localeCompare(b.name) * mul;
      if (key === "stock") return (a.stock - b.stock) * mul;
      if (key === "available")
        return (a.stock - a.booked - (b.stock - b.booked)) * mul;
      return 0;
    });
    return out;
  }, [items, query, category, status, inStockOnly, sortBy]);

  return {
    query,
    setQuery,
    category,
    setCategory,
    status,
    setStatus,
    inStockOnly,
    setInStockOnly,
    sortBy,
    setSortBy,
    filtered,
  };
}

// -----------------------------
// Main Component
// -----------------------------
export default function StoreManagementSystem() {
  const [items, setItems] = useState(seedItems);
  const [bookings, setBookings] = useState(seedBookings);
  const [selected, setSelected] = useState([]);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [issueOpen, setIssueOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const filters = useFilters(items);

  const totals = useMemo(() => {
    const totalReceived = items.reduce((s, i) => s + i.total_received, 0);
    const totalIssued = items.reduce((s, i) => s + i.total_issues, 0);
    const issuedToday = 260;
    const available = items.reduce(
      (s, i) => s + Math.max(0, i.total_received - i.total_issues),
      0
    );
    return { totalReceived, totalIssued, issuedToday, available };
  }, [items]);

  const toggleSelected = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const [receiveForm, setReceiveForm] = useState({
    bookingNo: "",
    qty: "",
    supplier: "",
    grn: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [issueForm, setIssueForm] = useState({
    dept: DEPARTMENTS[0],
    qty: "",
    remarks: "",
  });

  const computeStatus = (stock, booked) => {
    if (stock <= 0) return "Out of Stock";
    if (stock - booked < 150) return "Low";
    return "In Stock";
  };

  const handleReceiveSubmit = () => {
    const qty = Number(receiveForm.qty || 0);
    if (!activeItem || !qty) return setReceiveOpen(false);
    setItems((prev) =>
      prev.map((it) =>
        it.id === activeItem.id
          ? {
              ...it,
              stock: it.stock + qty,
              status: computeStatus(it.stock + qty, it.booked),
            }
          : it
      )
    );
    if (receiveForm.bookingNo) {
      setBookings((prev) =>
        prev.map((b) =>
          b.bookingNo === receiveForm.bookingNo
            ? { ...b, requiredQty: Math.max(0, b.requiredQty - qty) }
            : b
        )
      );
    }
    setReceiveOpen(false);
  };

  const handleIssueSubmit = () => {
    const qty = Number(issueForm.qty || 0);
    if (!activeItem || !qty) return setIssueOpen(false);
    setItems((prev) =>
      prev.map((it) =>
        it.id === activeItem.id
          ? {
              ...it,
              stock: Math.max(0, it.stock - qty),
              status: computeStatus(Math.max(0, it.stock - qty), it.booked),
            }
          : it
      )
    );
    setIssueOpen(false);
  };

  const [tab, setTab] = useState("upcoming");

  return (
    <div>
      <div className="row">
        <div className="col-lg-10">
          <Grid container spacing={1} alignItems="center" sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <WarehouseIcon /> Store Management
              </Typography>
              <Typography variant="body2" color="textSecondary">
                View inventory, receive bookings, and issue to departments.
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                justifyContent: { xs: "flex-start", md: "flex-end" },
                gap: 1,
              }}
            >
              <Button variant="outlined" startIcon={<DownloadIcon />}>
                Export
              </Button>
              <Button variant="contained" startIcon={<AddIcon />}>
                New Item
              </Button>
            </Grid>
          </Grid>

          {/* Stats */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={3}>
              <StatCard
                icon={PackageIcon}
                title="Total Received"
                value={totals.totalReceived.toLocaleString()}
                hint="Received"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard
                icon={InboxIcon}
                title="Total Issues"
                value={totals.totalIssued.toLocaleString()}
                hint="Issued"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard
                icon={ArchiveIcon}
                title="Available"
                value={totals.available.toLocaleString()}
                hint="Received - Issued"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard
                icon={SendIcon}
                title="Issued Today"
                value={totals.issuedToday.toLocaleString()}
                hint="Departments"
              />
            </Grid>
          </Grid>

          {/* Filters */}
          <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Search SKU, Name, Color..."
                  value={filters.query}
                  onChange={(e) => filters.setQuery(e.target.value)}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filters.category}
                    label="Category"
                    onChange={(e) => filters.setCategory(e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    {CATEGORIES.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={(e) => filters.setStatus(e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="In Stock">In Stock</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={filters.inStockOnly}
                      onChange={(e) => filters.setInStockOnly(e.target.checked)}
                    />
                  }
                  label="In Stock Only"
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={filters.sortBy}
                    label="Sort By"
                    onChange={(e) => filters.setSortBy(e.target.value)}
                  >
                    <MenuItem value="name-asc">Name ↑</MenuItem>
                    <MenuItem value="name-desc">Name ↓</MenuItem>
                    <MenuItem value="stock-asc">Stock ↑</MenuItem>
                    <MenuItem value="stock-desc">Stock ↓</MenuItem>
                    <MenuItem value="available-asc">Available ↑</MenuItem>
                    <MenuItem value="available-desc">Available ↓</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Card>
          <Card variant="outlined" sx={{ maxHeight: 500, overflow: "auto" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.length === filters.filtered.length}
                      onChange={() =>
                        setSelected(
                          selected.length === filters.filtered.length
                            ? []
                            : filters.filtered.map((i) => i.id)
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <strong>#WO</strong>
                  </TableCell>
                  <TableCell>
                    <strong>#STYLE</strong>
                  </TableCell>
                  <TableCell>
                    <strong> ITEM NAME NAME</strong>
                  </TableCell>
                  <TableCell>
                    <strong>TYPE</strong>
                  </TableCell>
                  <TableCell>
                    <strong>ITEM DETAILS</strong>
                  </TableCell>
                  <TableCell>
                    <strong>ITEM COLOR</strong>
                  </TableCell>
                  <TableCell>
                    <strong>ITEM SIZE</strong>
                  </TableCell>
                  <TableCell>
                    <strong>UNIT</strong>
                  </TableCell>
                  <TableCell>
                    <strong>STOCK</strong>
                  </TableCell>
                  <TableCell>
                    <strong>TOTAL RECEIVED</strong>
                  </TableCell>
                  <TableCell>
                    <strong>ITEM ISSUES</strong>
                  </TableCell>
                  <TableCell>
                    <strong>STATUS</strong>
                  </TableCell>
                  <TableCell>
                    <strong>ACTIONS</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filters.filtered.map((item) => (
                  <TableRow
                    key={item.id}
                    hover
                    selected={selected.includes(item.id)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(item.id)}
                        onChange={() => toggleSelected(item.id)}
                      />
                    </TableCell>

                    <TableCell>{item.wo_number}</TableCell>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.color}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{item.stock.toLocaleString()}</TableCell>
                    <TableCell>{item.total_received}</TableCell>
                    <TableCell>{item.total_issues}</TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1 }}
                        onClick={() => {
                          setActiveItem(item);
                          setReceiveOpen(true);
                        }}
                      >
                        Receive
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => {
                          setActiveItem(item);
                          setIssueOpen(true);
                        }}
                      >
                        Issue
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
        <div className="col-lg-2">
          {/* Tabs */}
          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            variant="fullWidth"
            className="mb-3"
          >
            <Tab label="Upcoming" value="upcoming" />
            <Tab label="History" value="history" />
          </Tabs>

          <Card className="mb-4">
            {/* Upcoming Items */}
            {tab === "upcoming" && (
              <CardContent style={{ maxHeight: "750px", overflowY: "auto" }}>
                {bookings.map((b) => (
                  <Card key={b.bookingNo} className="mb-2 border">
                    <CardContent>
                      <div className="d-flex justify-content-between">
                        <Typography fontWeight={500}>{b.itemName}</Typography>
                      </div>

                      <div className="row text-secondary small mt-1">
                        <div className="col-6">
                          <small>
                            <strong>Item:</strong> {b.itemId}
                          </small>
                        </div>
                        <div className="col-6">
                          <small>
                            <strong>Buyer:</strong> {b.buyer}
                          </small>
                        </div>
                        <div className="col-6">
                          <small>
                            <strong>Order:</strong> {b.orderRef}
                          </small>
                        </div>
                        <div className="col-6">
                          <small>
                            <strong>Delivery:</strong> {b.deliveryDate}
                          </small>
                        </div>
                      </div>

                      <Typography variant="body2" className="mt-1">
                        <small>
                          <strong>Required:</strong>{" "}
                          {b.requiredQty.toLocaleString()} {b.uom}
                        </small>
                      </Typography>

                      <hr />

                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setActiveItem(b);
                          setReceiveOpen(true);
                        }}
                        startIcon={<AddIcon />}
                      >
                        <small>Receive</small>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            )}

            {/* History Items */}
            {tab === "history" && (
              <CardContent style={{ maxHeight: "750px", overflowY: "auto" }}>
                {/* Receipts */}
                {[1, 2, 3].map((r) => (
                  <Card key={r} className="mb-2 border">
                    <CardContent className="p-2">
                      <div className="d-flex justify-content-between">
                        <Typography variant="caption" fontWeight={500}>
                          Cotton Twill Fabric
                        </Typography>
                        <Badge bg="primary">{`GRN-${9000 + r}`}</Badge>
                      </div>
                      <div className="row text-secondary small mt-1">
                        <div className="col-6">
                          <Typography variant="caption">
                            <strong>Qty:</strong>{" "}
                            {Math.floor(Math.random() * 500) + 50} yard
                          </Typography>
                        </div>
                        <div className="col-6">
                          <Typography variant="caption">
                            <strong>Supplier:</strong> Supplier {r}
                          </Typography>
                        </div>
                        <div className="col-6">
                          <Typography variant="caption">
                            <strong>Date:</strong> 2025-09-{10 + r}
                          </Typography>
                        </div>
                        <div className="col-6">
                          <Typography variant="caption">
                            <strong>Received By:</strong> Store Dept
                          </Typography>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Issues */}
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="mb-2 border">
                    <CardContent className="p-2">
                      <div className="d-flex justify-content-between">
                        <Typography variant="caption" fontWeight={500}>
                          Zipper #5 Nylon
                        </Typography>
                        <Badge bg="warning">{`ISS-${100 + i}`}</Badge>
                      </div>
                      <div className="row text-secondary small mt-1">
                        <div className="col-6">
                          <Typography variant="caption">
                            <strong>Qty:</strong>{" "}
                            {Math.floor(Math.random() * 300) + 10} pcs
                          </Typography>
                        </div>
                        <div className="col-6">
                          <Typography variant="caption">
                            <strong>Department:</strong> Sewing
                          </Typography>
                        </div>
                        <div className="col-6">
                          <Typography variant="caption">
                            <strong>Date:</strong> 2025-09-{12 + i}
                          </Typography>
                        </div>
                        <div className="col-6">
                          <Typography variant="caption">
                            <strong>Issued By:</strong> Store Dept
                          </Typography>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      <Dialog open={receiveOpen} onClose={() => setReceiveOpen(false)}>
        <DialogTitle>Receive Item: {activeItem?.name}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Booking No (Optional)</InputLabel>
            <Select
              value={receiveForm.bookingNo}
              onChange={(e) =>
                setReceiveForm((f) => ({ ...f, bookingNo: e.target.value }))
              }
              label="Booking No"
            >
              <MenuItem value="">-- None --</MenuItem>
              {bookings.map((b) => (
                <MenuItem key={b.bookingNo} value={b.bookingNo}>
                  {b.bookingNo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Quantity Received"
            type="number"
            value={receiveForm.qty}
            onChange={(e) =>
              setReceiveForm((f) => ({ ...f, qty: e.target.value }))
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Supplier Name"
            value={receiveForm.supplier}
            onChange={(e) =>
              setReceiveForm((f) => ({ ...f, supplier: e.target.value }))
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="GRN No"
            value={receiveForm.grn}
            onChange={(e) =>
              setReceiveForm((f) => ({ ...f, grn: e.target.value }))
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Date"
            type="date"
            value={receiveForm.date}
            onChange={(e) =>
              setReceiveForm((f) => ({ ...f, date: e.target.value }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReceiveOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleReceiveSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={issueOpen} onClose={() => setIssueOpen(false)}>
        <DialogTitle>Issue Item: {activeItem?.name}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Department</InputLabel>
            <Select
              value={issueForm.dept}
              onChange={(e) =>
                setIssueForm((f) => ({ ...f, dept: e.target.value }))
              }
              label="Department"
            >
              {DEPARTMENTS.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Quantity"
            type="number"
            value={issueForm.qty}
            onChange={(e) =>
              setIssueForm((f) => ({ ...f, qty: e.target.value }))
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Remarks"
            multiline
            rows={2}
            value={issueForm.remarks}
            onChange={(e) =>
              setIssueForm((f) => ({ ...f, remarks: e.target.value }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIssueOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleIssueSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
