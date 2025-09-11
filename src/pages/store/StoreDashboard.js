import React, { useState, useMemo, useEffect } from "react";
import {
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
import PackageIcon from "@mui/icons-material/Inventory2";
import InboxIcon from "@mui/icons-material/Inbox";
import ArchiveIcon from "@mui/icons-material/Archive";
import UploadIcon from "@mui/icons-material/Upload";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import SendIcon from "@mui/icons-material/Send";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import VerifiedIcon from "@mui/icons-material/Verified";

import { Link } from "react-router-dom";

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

// 🔹 Dummy Data for Dropdowns
const woList = [
  { id: 1, name: "WO-1001" },
  { id: 2, name: "WO-1002" },
  { id: 3, name: "WO-1003" },
  { id: 4, name: "WO-1004" },
];

const technicalPackages = [
  { id: 1, name: "TP-2001" },
  { id: 2, name: "TP-2002" },
  { id: 3, name: "TP-2003" },
  { id: 4, name: "TP-2004" },
];

const buyers = [
  { id: 1, name: "H&M" },
  { id: 2, name: "Zara" },
  { id: 3, name: "Nike" },
  { id: 4, name: "Adidas" },
];

// -----------------------------
// Helper Components
// -----------------------------
const StatCard = ({ icon: Icon, title, value, hint }) => (
  <Card variant="outlined">
    <CardContent>
      <Typography variant="subtitle2" color="textSecondary">
        <Icon style={{ color: "#f6a33f" }} fontSize="small" /> {title}
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
  const [woId, setWoId] = useState("all");
  const [technicalPackageId, setTechnicalPackageId] = useState("all");
  const [buyerId, setBuyerId] = useState("all");

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("name-asc");

  const filtered = useMemo(() => {
    let out = [...items];

    // 🔹 Work order, Technical Package, Buyer filters
    if (woId && woId !== "all") out = out.filter((i) => i.wo_id === woId);
    if (technicalPackageId && technicalPackageId !== "all")
      out = out.filter((i) => i.technical_package_id === technicalPackageId);
    if (buyerId && buyerId !== "all")
      out = out.filter(
        (i) =>
          i.buyer_id === buyerId || i.workorder?.techpack?.buyer_id === buyerId
      );

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
  }, [
    items,
    query,
    category,
    status,
    inStockOnly,
    sortBy,
    woId,
    technicalPackageId,
    buyerId,
  ]);

  return {
    filtered,
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
    woId,
    setWoId,
    technicalPackageId,
    setTechnicalPackageId,
    buyerId,
    setBuyerId,
  };
}

// -----------------------------
// Main Component
// -----------------------------

export default function StoreDashboard(props) {
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
    const completed = 200;
    const checked = 200;
    const delayed = 200;
    const verified = 200;

    const available = items.reduce(
      (s, i) => s + Math.max(0, i.total_received - i.total_issues),
      0
    );
    return {
      totalReceived,
      totalIssued,
      issuedToday,
      available,
      completed,
      checked,
      delayed,
      verified,
    };
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

  const [tab, setTab] = useState("receives");
  useEffect(async () => {
    props.setHeaderData({
      pageName: "Store Dashboard",
      isNewButton: false,
      newButtonLink: "",
      isInnerSearch: false,
      innerSearchValue: "",
      isDropdown: false,
      DropdownMenu: [],
    });
  }, []);
  return (
    <div>
      <div className="row">
        <div className="col-lg-10 col-xl-9">
          {/* Stat Cards */}
          <Grid container spacing={0.5} sx={{ mb: 1 }}>
            <Grid item xs={4} md={1.5}>
              <StatCard
                icon={PackageIcon}
                title="Total Received"
                value={totals.totalReceived.toLocaleString()}
                hint="Received"
                sx={{ p: 0.5, fontSize: "0.75rem" }}
              />
            </Grid>
            <Grid item xs={4} md={1.5}>
              <StatCard
                icon={InboxIcon}
                title="Total Issues"
                value={totals.totalIssued.toLocaleString()}
                hint="Issued"
                sx={{ p: 0.5, fontSize: "0.75rem" }}
              />
            </Grid>
            <Grid item xs={4} md={1.5}>
              <StatCard
                icon={ArchiveIcon}
                title="Available"
                value={totals.available.toLocaleString()}
                hint="Received - Issued"
                sx={{ p: 0.5, fontSize: "0.75rem" }}
              />
            </Grid>
            <Grid item xs={4} md={1.5}>
              <StatCard
                icon={SendIcon}
                title="Issued Today"
                value={totals.issuedToday.toLocaleString()}
                hint="Departments"
                sx={{ p: 0.5, fontSize: "0.75rem" }}
              />
            </Grid>

            {/* 🔹 New 4 StatCards */}
            <Grid item xs={4} md={1.5}>
              <StatCard
                icon={HourglassEmptyIcon}
                title="Pending"
                value={totals.delayed}
                hint="Waiting"
                sx={{ p: 0.5, fontSize: "0.75rem" }}
              />
            </Grid>
            <Grid item xs={4} md={1.5}>
              <StatCard
                icon={CheckCircleIcon}
                title="Completed"
                value={totals.completed}
                hint="Done"
                sx={{ p: 0.5, fontSize: "0.75rem" }}
              />
            </Grid>
            <Grid item xs={4} md={1.5}>
              <StatCard
                icon={WarningAmberIcon}
                title="Delayed"
                value={totals.delayed}
                hint="Alerts"
                sx={{ p: 0.5, fontSize: "0.75rem" }}
              />
            </Grid>
            <Grid item xs={4} md={1.5}>
              <StatCard
                icon={VerifiedIcon}
                title="Verified"
                value={totals.verified}
                hint="Checked"
                sx={{ p: 0.5, fontSize: "0.75rem" }}
              />
            </Grid>
          </Grid>

          {/* Filters */}
          <Card variant="outlined" sx={{ mb: 2, p: 1 }}>
            <Grid container spacing={1} alignItems="flex-end">
              {/* 🔹 WO ID */}
              <Grid item xs={12} md={4}>
                <TextField
                  size="small"
                  fullWidth
                  label="Search SKU, Name, Color..."
                  value={filters.query}
                  onChange={(e) => filters.setQuery(e.target.value)}
                />
              </Grid>
              <Grid item xs={6} md={1}>
                <FormControl size="small" fullWidth>
                  <InputLabel>WO</InputLabel>
                  <Select
                    value={filters.woId}
                    label="WO"
                    onChange={(e) => filters.setWoId(e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    {woList.map((wo) => (
                      <MenuItem key={wo.id} value={wo.id}>
                        {wo.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* 🔹 Technical Package ID */}
              <Grid item xs={6} md={1}>
                <FormControl size="small" fullWidth>
                  <InputLabel>TECHPACK</InputLabel>
                  <Select
                    value={filters.technicalPackageId}
                    label="TECHPACK"
                    onChange={(e) =>
                      filters.setTechnicalPackageId(e.target.value)
                    }
                  >
                    <MenuItem value="all">All</MenuItem>
                    {technicalPackages.map((pkg) => (
                      <MenuItem key={pkg.id} value={pkg.id}>
                        {pkg.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* 🔹 Buyer ID */}
              <Grid item xs={6} md={1}>
                <FormControl size="small" fullWidth>
                  <InputLabel>BUYER</InputLabel>
                  <Select
                    value={filters.buyerId}
                    label="BUYER"
                    onChange={(e) => filters.setBuyerId(e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    {buyers.map((buyer) => (
                      <MenuItem key={buyer.id} value={buyer.id}>
                        {buyer.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} md={1}>
                <TextField
                  size="small"
                  fullWidth
                  label="Color"
                  value={filters.color}
                  onChange={(e) => filters.setColor(e.target.value)}
                />
              </Grid>

              <Grid item xs={6} md={1}>
                <FormControl size="small" fullWidth>
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
              <Grid item xs={6} md={1}>
                <FormControl size="small" fullWidth>
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
              <Grid item xs={6} md={1}>
                <FormControlLabel
                  sx={{
                    marginLeft: "5px",
                    display: "block",
                    width: "100%",
                    fontSize: "10px",
                  }}
                  label="Stock Only"
                  control={
                    <Switch
                      size="small"
                      style={{ fontSize: "10px" }}
                      checked={filters.inStockOnly}
                      onChange={(e) => filters.setInStockOnly(e.target.checked)}
                    />
                  }
                />
              </Grid>
              <Grid item xs={6} md={1}>
                <FormControl size="small" fullWidth>
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

          {/* Actions */}
          <Grid
            sx={{
              display: "flex",
              mb: 2,
              justifyContent: { xs: "flex-start", md: "flex-end" },
              gap: 1,
            }}
          >
            <Link
              to="/store/receives-create"
              size="small"
              className="btn btn-small btn-primary"
            >
              + Receive New
            </Link>
            <Button
              size="small"
              variant="outlined"
              startIcon={<DownloadIcon />}
            >
              Export
            </Button>
          </Grid>
          <Card variant="outlined" sx={{ maxHeight: 573, overflow: "auto" }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      size="small"
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
                  <TableCell sx={{ fontSize: "0.8rem", py: 0.5 }}>
                    <strong>#WO</strong>
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8rem", py: 0.5 }}>
                    <strong>#STYLE</strong>
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8rem", py: 0.5 }}>
                    <strong>ITEM NAME</strong>
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8rem", py: 0.5 }}>
                    <strong>TYPE</strong>
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8rem", py: 0.5 }}>
                    <strong>ITEM DETAILS</strong>
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8rem", py: 0.5 }}>
                    <strong>ITEM COLOR</strong>
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8rem", py: 0.5 }}>
                    <strong>ITEM SIZE</strong>
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8rem", py: 0.5 }}>
                    <strong>UNIT</strong>
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8rem", py: 0.5 }}>
                    <strong>STOCK</strong>
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8rem", py: 0.5 }}>
                    <strong>TOTAL RECEIVED</strong>
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8rem", py: 0.5 }}>
                    <strong>ITEM ISSUES</strong>
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8rem", py: 0.5 }}>
                    <strong>STATUS</strong>
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8rem", py: 0.5 }}>
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
                    sx={{ "& td": { fontSize: "0.8rem", py: 0.5 } }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
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
                        sx={{ mr: 0.5 }}
                        onClick={() => {
                          setActiveItem(item);
                          setReceiveOpen(true);
                        }}
                      >
                        Receive
                      </Button>
                      <Button
                        size="small"
                        sx={{ bgcolor: "#f6a33f" }}
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

        <div className="col-lg-2 col-xl-3">
          {/* Tabs */}
          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            variant="fullWidth"
            className="mb-3"
          >
            <Tab label="RECEIVES" value="receives" />
            <Tab label="ISSUES" value="issues" />
            <Tab label="WAITING" value="upcoming" />
          </Tabs>

          <Card
            style={{ height: "calc(100vh - 155px)", overflowY: "auto" }}
            className="mb-4"
          >
            <CardContent>
              {tab === "receives" && (
                <>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((r) => (
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
                  <Link to="#" className="btn btn-info">
                    See All Receives
                  </Link>
                </>
              )}

              {tab === "issues" && (
                <>
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
                  <Link to="#" className="btn btn-primary">
                    See All Issues
                  </Link>
                </>
              )}

              {tab === "upcoming" && (
                <>
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
                </>
              )}
            </CardContent>
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
