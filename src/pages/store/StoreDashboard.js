import React, { useState, useMemo, useEffect, useCallback } from "react";
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
  Drawer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControlLabel,
  Typography,
  Badge,
  Tabs,
  Tab,
  Box,
  Pagination,
} from "@mui/material";
import PackageIcon from "@mui/icons-material/Inventory2";
import InboxIcon from "@mui/icons-material/Inbox";
import ArchiveIcon from "@mui/icons-material/Archive";
import DownloadIcon from "@mui/icons-material/Download";
import SendIcon from "@mui/icons-material/Send";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import VerifiedIcon from "@mui/icons-material/Verified";
import api from "services/api";
import { Link } from "react-router-dom";

const departments = ["Cutting", "Sewing", "Finishing", "Washing", "QC"];

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

export default function StoreDashboard(props) {
  //real stocks
  const [stocks, setStocks] = useState([]);
  const [techpacks, setTechpacks] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [receives, setReceives] = useState([]);
  const getReceives = async () => {
    try {
      const res = await api.post("/store/recent-five-grn-items");
      setReceives(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchOptions = useCallback(async () => {
    try {
      const [buyerRes, techPackRes, itemTypeRes] = await Promise.all([
        api.post("/common/buyers"),
        api.post("/merchandising/technical-packages-all-desc"),
        api.post("/common/item-types"),
      ]);
      setBuyers(buyerRes.data.data || []);
      setItemTypes(itemTypeRes.data.data || []);
      setTechpacks(techPackRes.data.data || []);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  }, []);

  useEffect(() => {
    fetchOptions();
    getReceives();
  }, []);

  const [filterData, setFilterData] = useState({
    technical_package_id: "all",
    buyer_id: "all",
    item_type_id: "all",
    search: "",
    color: "",
    stock_only: false,
    sort_by: "",
  });

  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 50,
    total: 0,
  });

  const handleFilterChange = (name, value) =>
    setFilterData((prev) => ({ ...prev, [name]: value }));

  const getStocks = async (page = 1) => {
    try {
      const payload = {
        ...filterData,
        technical_package_id:
          filterData.technical_package_id === "all"
            ? ""
            : filterData.technical_package_id,
        buyer_id: filterData.buyer_id === "all" ? "" : filterData.buyer_id,
        item_type_id:
          filterData.item_type_id === "all" ? "" : filterData.item_type_id,
        page,
        per_page: pagination.per_page,
      };

      const res = await api.post("/store/stocks", payload);
      setStocks(res.data.data || []);
      setPagination({
        current_page: res.data.current_page,
        per_page: res.data.per_page,
        total: res.data.total,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getStocks();
  }, [filterData]);

  console.log("STOCKS", stocks);

  const [bookings, setBookings] = useState([]);
  const [issueOpen, setIssueOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const totals = useMemo(() => {
    const totalReceived = 400;
    const totalIssued = 500;
    const issuedToday = 260;
    const completed = 200;
    const checked = 200;
    const delayed = 200;
    const verified = 200;
    const available = 600;
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
  }, []);

  const [issueForm, setIssueForm] = useState({
    dept: departments[0],
    issue_to: "",
    qty: "",
    requisition_number: "",
    ref: "",
    remarks: "",
  });

  const handleIssueFormChange = (field, value) => {
    setIssueForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleIssueSubmit = () => {
    const qty = Number(issueForm.qty || 0);
    if (!activeItem || !qty) return setIssueOpen(false);

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
                value={totals.totalReceived}
                hint="Received"
                sx={{ p: 0.5, fontSize: "0.75rem" }}
              />
            </Grid>
            <Grid item xs={4} md={1.5}>
              <StatCard
                icon={InboxIcon}
                title="Total Issues"
                value={totals.totalIssued}
                hint="Issued"
                sx={{ p: 0.5, fontSize: "0.75rem" }}
              />
            </Grid>
            <Grid item xs={4} md={1.5}>
              <StatCard
                icon={ArchiveIcon}
                title="Available"
                value={totals.available}
                hint="Received - Issued"
                sx={{ p: 0.5, fontSize: "0.75rem" }}
              />
            </Grid>
            <Grid item xs={4} md={1.5}>
              <StatCard
                icon={SendIcon}
                title="Issued Today"
                value={totals.issuedToday}
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
                  value={filterData.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </Grid>

              {/* 🔹 Technical Package ID */}
              <Grid item xs={6} md={1}>
                <FormControl size="small" fullWidth>
                  <InputLabel>TECHPACK</InputLabel>
                  <Select
                    value={filterData.technical_package_id}
                    onChange={(e) =>
                      handleFilterChange("technical_package_id", e.target.value)
                    }
                    label="TECHPACK"
                  >
                    <MenuItem value="all">All</MenuItem>
                    {techpacks.map((pkg) => (
                      <MenuItem key={pkg.id} value={pkg.id}>
                        {pkg.techpack_number}
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
                    value={filterData.buyer_id}
                    label="BUYER"
                    onChange={(e) =>
                      handleFilterChange("buyer_id", e.target.value)
                    }
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
                  value={filterData.color}
                  onChange={(e) => handleFilterChange("color", e.target.value)}
                />
              </Grid>

              <Grid item xs={6} md={1}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filterData.item_type_id}
                    label="Category"
                    onChange={(e) =>
                      handleFilterChange("item_type_id", e.target.value)
                    }
                  >
                    <MenuItem value="all">All</MenuItem>
                    {itemTypes.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.title}
                      </MenuItem>
                    ))}
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
                      checked={filterData.stock_only}
                      onChange={(e) =>
                        handleFilterChange("stock_only", e.target.checked)
                      }
                    />
                  }
                />
              </Grid>
              <Grid item xs={6} md={1}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={filterData.sort_by}
                    label="Sort By"
                    onChange={(e) =>
                      handleFilterChange("sort_by", e.target.value)
                    }
                  >
                    <MenuItem value="name-asc">Name ↑</MenuItem>
                    <MenuItem value="name-desc">Name ↓</MenuItem>
                    <MenuItem value="stock-asc">Stock ↑</MenuItem>
                    <MenuItem value="stock-desc">Stock ↓</MenuItem>
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
                  <TableCell sx={{ fontSize: "0.8rem", py: 0.5 }}>
                    <strong>#BUYER</strong>
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8rem", py: 0.5 }}>
                    <strong>#STYLE</strong>
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8rem", py: 0.5 }}>
                    <strong>GARMENT COLOR</strong>
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8rem", py: 0.5 }}>
                    <strong>TYPE</strong>
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8rem", py: 0.5 }}>
                    <strong>ITEM</strong>
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
                    <strong>RECEIVED</strong>
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8rem", py: 0.5 }}>
                    <strong>STOCK</strong>
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8rem", py: 0.5 }}>
                    <strong>ISSUES</strong>
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8rem", py: 0.5 }}>
                    <strong>ACTIONS</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stocks.map((item) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{ "& td": { fontSize: "0.8rem", py: 0.5 } }}
                  >
                    <TableCell>{item.buyer?.name}</TableCell>
                    <TableCell>{item.techpack?.techpack_number}</TableCell>
                    <TableCell>{item.garment_color}</TableCell>
                    <TableCell>{item.item_type?.title}</TableCell>
                    <TableCell>{item.item?.title}</TableCell>
                    <TableCell>{item.item_description}</TableCell>
                    <TableCell>{item.item_color}</TableCell>
                    <TableCell>{item.item_size}</TableCell>
                    <TableCell>
                      {(item.grns ?? [])
                        .reduce((sum, grn) => sum + parseFloat(grn.qty ?? 0), 0)
                        .toLocaleString()}
                    </TableCell>

                    <TableCell>
                      {item.balance_qty} {item.unit}
                    </TableCell>
                    <TableCell>N/A</TableCell>

                    <TableCell>
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
            <Pagination
              count={Math.ceil(pagination.total / pagination.per_page)}
              page={pagination.current_page}
              onChange={(e, value) => getStocks(value)}
            />
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
                  {receives.map((r, index) => (
                    <Card key={index} className="mb-2 border">
                      <CardContent className="p-2">
                        <div className="d-flex justify-content-between">
                          <Typography variant="caption" fontWeight={500}>
                            {r.item.title}
                          </Typography>
                          <Badge bg="primary">{r.grn_number}</Badge>
                        </div>
                        <div className="row text-secondary small mt-1">
                          <div className="col-6">
                            <Typography variant="caption">
                              <strong>Qty:</strong> {r.qty} {r.unit}
                            </Typography>
                          </div>
                          <div className="col-6">
                            <Typography variant="caption">
                              <strong>Supplier:</strong>{" "}
                              {r.supplier?.company_name}
                            </Typography>
                          </div>
                          <div className="col-6">
                            <Typography variant="caption">
                              <strong>Date:</strong> {r.received_date}
                            </Typography>
                          </div>
                          <div className="col-6">
                            <Typography variant="caption">
                              <strong>Received By:</strong> {r.user?.full_name}
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
                            <strong>Required:</strong> {b.requiredQty} {b.uom}
                          </small>
                        </Typography>

                        <hr />
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Drawer
        anchor="left"
        open={issueOpen}
        onClose={() => setIssueOpen(false)}
      >
        <Box
          sx={{
            width: 500,
            p: 3,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Title */}
          <Typography variant="h6" gutterBottom>
            Issue Item: {activeItem?.item?.title}
          </Typography>

          <Card
            variant="outlined"
            sx={{ mb: 2, borderRadius: 2, boxShadow: 1 }}
          >
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Buyer:</strong> {activeItem?.buyer?.name || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Style/Techpack:</strong>{" "}
                    {activeItem?.techpack?.techpack_number || "-"} /{" "}
                    {activeItem?.garment_color} / {activeItem?.size_range}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Item Name:</strong> {activeItem?.item?.title || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Color:</strong> {activeItem?.item_color || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Item Size/Width/Dimention:</strong>{" "}
                    {activeItem?.item_size || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Balance QTY:</strong>{" "}
                    {activeItem?.balance_qty || "0"} / {activeItem?.unit}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Grid container spacing={1}>
            <Grid item xs={6}>
              {" "}
              <TextField
                fullWidth
                margin="normal"
                label="Issue To"
                value={issueForm.issue_to}
                onChange={(e) =>
                  handleIssueFormChange("issue_to", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Department</InputLabel>
                <Select
                  value={issueForm.dept}
                  onChange={(e) =>
                    handleIssueFormChange("dept", e.target.value)
                  }
                  label="Department"
                >
                  {departments.map((d) => (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Quantity"
                type="number"
                value={issueForm.qty}
                onChange={(e) => handleIssueFormChange("qty", e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Reference"
                value={issueForm.ref}
                onChange={(e) => handleIssueFormChange("ref", e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Requisition Number"
                value={issueForm.requisition_number}
                onChange={(e) =>
                  handleIssueFormChange("requisition_number", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12}>
              {" "}
              <TextField
                fullWidth
                margin="normal"
                label="Remarks"
                multiline
                rows={3}
                value={issueForm.remarks}
                onChange={(e) =>
                  handleIssueFormChange("remarks", e.target.value)
                }
              />
            </Grid>
          </Grid>

          {/* Actions */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              mt: "auto", // push buttons to the bottom
            }}
          >
            <Button onClick={() => setIssueOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleIssueSubmit}>
              Submit
            </Button>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
}
