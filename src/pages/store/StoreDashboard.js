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
  Divider,
  Tab,
  Box,
  Pagination,
} from "@mui/material";
import api from "services/api";
import { Link } from "react-router-dom";
import CustomSelect from "elements/CustomSelect";

const departments = ["Cutting", "Sewing", "Finishing", "Washing", "QC"];

export default function StoreDashboard(props) {
  //real stocks
  const [stocks, setStocks] = useState([]);
  const [techpacks, setTechpacks] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [receives, setReceives] = useState([]);
  const [issues, setIssues] = useState([]);
  const [issueUsers, setIssueUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const getBookings = async () => {
    try {
      const res = await api.post("/store/waiting-for-grn-items");
      setBookings(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const getReceives = async () => {
    try {
      const res = await api.post("/store/recent-five-grn-items");
      setReceives(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const getIssues = async () => {
    try {
      const res = await api.post("/store/recent-five-issue-items");
      setIssues(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOptions = useCallback(async () => {
    try {
      const [buyerRes, techPackRes, itemTypeRes, companyRes, usersRef] =
        await Promise.all([
          api.post("/common/buyers"),
          api.post("/merchandising/technical-packages-all-desc"),
          api.post("/common/item-types"),
          api.post("/common/companies", {
            type: issueForm.issue_type === "Stock-Lot" ? "Other" : "Own",
          }),
          api.post("/admin/employees", {
            issue_type: "Self",
          }),
        ]);
      setBuyers(buyerRes.data.data || []);
      setItemTypes(itemTypeRes.data.data || []);
      setTechpacks(techPackRes.data.data || []);
      setCompanies(companyRes.data.data || []);
      setIssueUsers(usersRef.data.data || []);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  }, []);

  useEffect(() => {
    fetchOptions();
    getReceives();
    getIssues();
    getBookings();
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
    issue_type: "Self",
    issue_date: new Date().toISOString().split("T")[0],
    department: "",
    issue_to: "",
    issuing_company: "",
    line: "",
    qty: "",
    ref: "",
    requisition_number: "",
    delivery_challan: "",
    remarks: "",
  });

  const issueTypes = [
    "Self",
    "Sister-Factory",
    "Sub-Contract",
    "Sample",
    "Stock-Lot",
  ];

  const handleIssueFormChange = (field, value) => {
    setIssueForm((prev) => ({ ...prev, [field]: value }));
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Quantity validation
    const qty = parseFloat(issueForm.qty);
    if (issueForm.qty === "" || isNaN(qty) || qty < 0) {
      newErrors.qty = "Quantity must be 0 or greater";
    }

    // Issue type validation
    if (!issueForm.issue_type) {
      newErrors.issue_type = "Issue Type is required";
    }

    if (!issueForm.requisition_number) {
      newErrors.requisition_number = "Requisition Number is required";
    }

    // Conditional validations
    if (issueForm.issue_type === "Self") {
      if (!issueForm.department) {
        newErrors.department = "Department To is required for Self";
      }
      if (!issueForm.issue_to) {
        newErrors.issue_to = "Issue To is required for Self";
      }
      if (!issueForm.line) {
        newErrors.line = "Line is required for Self";
      }
    }

    if (
      ["Sister-Factory", "Sub-Contract", "Sample"].includes(
        issueForm.issue_type
      )
    ) {
      if (!issueForm.issuing_company) {
        newErrors.issuing_company = "Issuing Company is required";
      }
    }

    return newErrors;
  };

  const handleIssueSubmit = async () => {
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return; // Stop submit if errors exist
    }
    try {
      const response = await api.post("/store/issues", {
        ...issueForm,
        stock_id: activeItem.id ?? "",
        unit: activeItem.unit ?? "",
      });

      if (response.status === 201) {
        alert("Issues created successfully!");
        setIssueOpen(false);
        getStocks();
        getIssues();
        setErrors({});
      } else {
        setErrors(response.data.errors);
      }
    } catch (err) {
      console.error(err);
    }
  };

  console.log("ISSUE FORM", issueForm);

  const [tab, setTab] = useState("receives");

  // GRN FORM
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState({});

  const [grnForm, setGrnForm] = useState({
    invoice_number: "",
    challan_number: "",
    remarks: "",
    consignment: "",
    received_date: "",
    qty: 0,
  });

  const handleReceiveClick = (item) => {
    setCurrentItem(item);
    setGrnForm({
      invoice_number: "",
      challan_number: "",
      consignment: "",
      received_date: new Date().toISOString().split("T")[0],
      qty: item.balance_qty || 0,
    });
    setDrawerOpen(true);
  };

  const handleFormChange = (e) =>
    setGrnForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmitGrn = async () => {
    try {
      const response = await api.post("/store/grns", {
        ...grnForm,
        batch_no: currentItem.batch_no ?? "",
        booked_by: currentItem.booking?.user_id ?? "",
        booking_id: currentItem.booking_id ?? "",
        booking_item_id: currentItem.id ?? "",
        buyer_id: currentItem.workorder?.techpack?.buyer_id ?? "",
        company_id: currentItem.workorder?.techpack?.company_id ?? "",
        garment_color: currentItem.garment_color ?? "",
        item_brand: currentItem.item_brand ?? "",
        item_color: currentItem.item_color ?? "",
        item_description: currentItem.item_description ?? "",
        item_id: currentItem.item_id ?? "",
        item_size: currentItem.item_size ?? "",
        item_type_id: currentItem.booking?.item_type_id ?? "",
        size_range: currentItem.size_range ?? "",
        supplier_id: currentItem.booking?.supplier_id ?? "",
        technical_package_id: currentItem.workorder?.technical_package_id ?? "",
        unit: currentItem.booking.unit ?? "",
        warehouse_location: currentItem.warehouse_location ?? "",
        wo_id: currentItem.wo_id ?? "",
        position: currentItem.position ?? "",
      });

      if (response.status === 201) {
        alert("GRN created successfully!");
        setDrawerOpen(false);
        getBookings();
        setErrors({});
      } else {
        setErrors(response.data.errors);
      }
    } catch (err) {
      console.error(err);
    }
  };

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
    <div className="">
      <div className="row">
        <div className="col-lg-10 col-xl-9">
          {/* Filters */}
          <div className="create_technical_pack">
            <div className="row align-items-end">
              {/* 🔹 Search */}
              <div className="col create_tp_body">
                <label className="form-label">Search SKU, Name, Color...</label>
                <input
                  type="text"
                  className="form-control"
                  value={filterData.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>

              {/* 🔹 Buyer */}
              <div className="col create_tp_body">
                <label className="form-label">Buyer</label>
                <CustomSelect
                  className="form-value"
                  options={[
                    { value: "all", label: "All" },
                    ...buyers.map((buyer) => ({
                      value: buyer.id,
                      label: buyer.name,
                    })),
                  ]}
                  value={
                    filterData.buyer_id !== "all"
                      ? {
                          value: filterData.buyer_id,
                          label: buyers.find(
                            (b) => b.id === filterData.buyer_id
                          )?.name,
                        }
                      : { value: "all", label: "All" }
                  }
                  onChange={(selected) =>
                    handleFilterChange("buyer_id", selected?.value || "all")
                  }
                />
              </div>

              {/* 🔹 Techpack */}
              <div className="col create_tp_body">
                <label className="form-label">Techpack</label>
                <CustomSelect
                  className="form-value"
                  options={[
                    { value: "all", label: "All" },
                    ...techpacks.map((pkg) => ({
                      value: pkg.id,
                      label: pkg.techpack_number,
                    })),
                  ]}
                  value={
                    filterData.technical_package_id !== "all"
                      ? {
                          value: filterData.technical_package_id,
                          label: techpacks.find(
                            (tp) => tp.id === filterData.technical_package_id
                          )?.techpack_number,
                        }
                      : { value: "all", label: "All" }
                  }
                  onChange={(selected) =>
                    handleFilterChange(
                      "technical_package_id",
                      selected?.value || "all"
                    )
                  }
                />
              </div>

              {/* 🔹 Category */}
              <div className="col create_tp_body">
                <label className="form-label">Category</label>
                <CustomSelect
                  className="form-value"
                  options={[
                    { value: "all", label: "All" },
                    ...itemTypes.map((c) => ({
                      value: c.id,
                      label: c.title,
                    })),
                  ]}
                  value={
                    filterData.item_type_id !== "all"
                      ? {
                          value: filterData.item_type_id,
                          label: itemTypes.find(
                            (c) => c.id === filterData.item_type_id
                          )?.title,
                        }
                      : { value: "all", label: "All" }
                  }
                  onChange={(selected) =>
                    handleFilterChange("item_type_id", selected?.value || "all")
                  }
                />
              </div>

              {/* 🔹 Stock Only (Switch stays same) */}
              <div className="col create_tp_body">
                <FormControlLabel
                  className="form-label"
                  label="Stock Only"
                  control={
                    <Switch
                      size="small"
                      checked={filterData.stock_only}
                      onChange={(e) =>
                        handleFilterChange("stock_only", e.target.checked)
                      }
                    />
                  }
                />
              </div>

              {/* 🔹 Sort By */}
              <div className="col create_tp_body">
                <label className="form-label">Sort By</label>
                <CustomSelect
                  className="form-value"
                  options={[
                    { value: "name-asc", label: "Name ↑" },
                    { value: "name-desc", label: "Name ↓" },
                    { value: "stock-asc", label: "Stock ↑" },
                    { value: "stock-desc", label: "Stock ↓" },
                  ]}
                  value={
                    filterData.sort_by
                      ? {
                          value: filterData.sort_by,
                          label:
                            filterData.sort_by === "name-asc"
                              ? "Name ↑"
                              : filterData.sort_by === "name-desc"
                              ? "Name ↓"
                              : filterData.sort_by === "stock-asc"
                              ? "Stock ↑"
                              : "Stock ↓",
                        }
                      : null
                  }
                  onChange={(selected) =>
                    handleFilterChange("sort_by", selected?.value || "")
                  }
                />
              </div>
              <div className="col create_tp_body">
                <Link
                  to="/store/receives-create"
                  size="small"
                  className="btn btn-sm btn-primary me-2"
                >
                  + Receive
                </Link>
                <Link
                  to="/store/stock/report"
                  className="btn btn-sm btn-success"
                >
                  Report
                </Link>
              </div>
            </div>
            <br />

            <Card variant="outlined" sx={{ maxHeight: 573, overflow: "auto" }}>
              <Table size="small">
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
                      <TableCell sx={{ maxWidth: "200px" }}>
                        {item.item_description}
                      </TableCell>
                      <TableCell>{item.item_color}</TableCell>
                      <TableCell>{item.item_size}</TableCell>
                      <TableCell>
                        {(item.grns ?? [])
                          .reduce(
                            (sum, grn) => sum + parseFloat(grn.qty ?? 0),
                            0
                          )
                          .toLocaleString()}
                      </TableCell>

                      <TableCell>
                        {item.balance_qty} {item.unit}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {(item.issues ?? [])
                          .reduce(
                            (sum, iss) => sum + parseFloat(iss.qty ?? 0),
                            0
                          )
                          .toLocaleString()}
                      </TableCell>

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

          {/* Actions */}
        </div>

        <div className="col-lg-2 col-xl-3">
          {/* Tabs */}

          <Card
            style={{ height: "calc(100vh - 155px)", overflowY: "auto" }}
            className="mb-4"
          >
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
                          <div className="col-12">
                            <Typography variant="caption">
                              <strong>
                                {r.techpack?.techpack_number} /{" "}
                                {r.garment_color} /{r.size_range}
                              </strong>
                            </Typography>
                          </div>
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
                          <div className="col-12">
                            <Typography variant="caption">
                              <strong>Consignment:</strong> {r.consignment}
                            </Typography>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Link to="/store/receives" className="btn btn-info">
                    See All Receives
                  </Link>
                </>
              )}

              {tab === "issues" && (
                <>
                  {issues.map((i, index) => (
                    <Card key={i} className="mb-2 border">
                      <CardContent className="p-2">
                        <div className="d-flex justify-content-between">
                          <Typography variant="caption" fontWeight={500}>
                            {i.stock?.item?.title}
                          </Typography>
                          <Badge bg="warning">{i.issue_number}</Badge>
                        </div>
                        <div className="row text-secondary small mt-1">
                          <div className="col-12">
                            <Typography variant="caption">
                              <strong>
                                {i.stock?.techpack?.techpack_number} /{" "}
                                {i.stock?.garment_color} /{i.stock?.size_range}
                              </strong>
                            </Typography>
                          </div>
                          <div className="col-6">
                            <Typography variant="caption">
                              <strong>Issue Type:</strong>{" "}
                              {i.issue_type ?? "N/A"}
                            </Typography>
                          </div>
                          <div className="col-6">
                            <Typography variant="caption">
                              <strong>Qty:</strong> {i.qty} {i.unit}
                            </Typography>
                          </div>
                          <div className="col-6">
                            <Typography variant="caption">
                              <strong>Department:</strong>{" "}
                              {i.department ?? "N/A"}
                            </Typography>
                          </div>
                          <div className="col-6">
                            <Typography variant="caption">
                              <strong>Date:</strong> {i.issue_date}
                            </Typography>
                          </div>
                          <div className="col-6">
                            <Typography variant="caption">
                              <strong>Issued By:</strong> {i.user?.full_name}
                            </Typography>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Link to="/store/issues" className="btn btn-primary">
                    See All Issues
                  </Link>
                </>
              )}

              {tab === "upcoming" && (
                <>
                  {bookings.map((r) => (
                    <Card key={r.id} className="mb-2 border">
                      <CardContent className="p-2">
                        <div className="d-flex justify-content-between">
                          <Typography variant="caption" fontWeight={500}>
                            {r.item.title}
                          </Typography>
                          <Badge bg="primary">{r.grn_number}</Badge>
                        </div>
                        <div className="row text-secondary small mt-1">
                          <div className="col-12">
                            <Typography variant="caption">
                              <strong>
                                {r.workorder?.techpack?.techpack_number} /{" "}
                                {r.garment_color} /{r.size_range}
                              </strong>
                            </Typography>
                          </div>

                          <div className="col-6">
                            <Typography variant="caption">
                              <strong>Item Color:</strong> {r.item_color}
                            </Typography>
                          </div>
                          <div className="col-6">
                            <Typography variant="caption">
                              <strong>Item Size:</strong> {r.item_size}
                            </Typography>
                          </div>
                          <div className="col-6">
                            <Typography variant="caption">
                              <strong>Booking Qty:</strong> {r.booking_qty}{" "}
                              {r.booking?.unit}
                            </Typography>
                          </div>
                          <div className="col-6">
                            <Typography variant="caption">
                              <strong>Received Qty:</strong>{" "}
                              {r.allready_received_qty} {r.booking?.unit}
                            </Typography>
                          </div>
                          <div className="col-6">
                            <Typography variant="caption">
                              <strong>Left Qty:</strong>{" "}
                              {r.booking_qty - r.allready_received_qty}{" "}
                              {r.booking?.unit}
                            </Typography>
                          </div>

                          <div className="col-12">
                            <Typography variant="caption">
                              <strong>Supplier:</strong>{" "}
                              {r.booking?.supplier?.company_name}
                            </Typography>
                          </div>
                          <div className="col-6">
                            <Typography variant="caption">
                              <strong>ETA:</strong> {r.booking?.eta}
                            </Typography>
                          </div>
                          <div className="col-6">
                            <Typography variant="caption">
                              <strong>EID:</strong> {r.booking?.eid}
                            </Typography>
                          </div>
                          <div className="col-12">
                            <Typography variant="caption">
                              <strong>Booked By:</strong>{" "}
                              {r.booking?.user?.full_name}
                            </Typography>
                          </div>
                        </div>
                        <Button
                          size="small"
                          sx={{ bgcolor: "green" }}
                          variant="contained"
                          onClick={() => handleReceiveClick(r)}
                        >
                          Receive
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

      {/* GRN DRAWER */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          width={500}
          p={3}
          display="flex"
          flexDirection="column"
          // height="100%"
        >
          {/* Header */}
          <Typography variant="h6" gutterBottom>
            📦 Receive GRN
          </Typography>

          {/* Item Info Section */}
          <Card
            variant="outlined"
            sx={{ mb: 2, borderRadius: 2, boxShadow: 1 }}
          >
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                {currentItem?.booking?.booking_number}
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Buyer:</strong>{" "}
                    {currentItem?.workorder?.techpack?.buyer?.name || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Style/Techpack:</strong>{" "}
                    {currentItem?.workorder?.techpack?.techpack_number || "-"} /{" "}
                    {currentItem.garment_color} / {currentItem.size_range}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Item Name:</strong>{" "}
                    {currentItem?.item?.title || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Color:</strong> {currentItem?.item_color || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Item Size/Width/Dimention:</strong>{" "}
                    {currentItem?.item_size || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Booking QTY:</strong>{" "}
                    {currentItem?.booking_qty || "0"} /{" "}
                    {currentItem.booking?.unit}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={1}>
            <Grid item xs={6}>
              {" "}
              <TextField
                label="Invoice Number"
                name="invoice_number"
                value={grnForm.invoice_number}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
              {errors.invoice_number && (
                <small className="text-danger">{errors.invoice_number}</small>
              )}
            </Grid>
            <Grid item xs={6}>
              {" "}
              <TextField
                label="Challan Number"
                name="challan_number"
                value={grnForm.challan_number}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
              {errors.challan_number && (
                <small className="text-danger">{errors.challan_number}</small>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Received Date"
                name="received_date"
                type="date"
                value={grnForm.received_date}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              {" "}
              <TextField
                label="Quantity"
                name="qty"
                type="number"
                value={grnForm.qty}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
              {errors.qty && (
                <small className="text-danger">{errors.qty}</small>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Consignment"
                name="consignment"
                value={grnForm.consignment}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Remarks"
                name="remarks"
                value={grnForm.remarks}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                multiline
                rows={3}
              />
            </Grid>
          </Grid>

          {/* GRN Form Fields */}

          {/* Submit Button */}
          <Box mt="auto">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitGrn}
              fullWidth
              sx={{ py: 1.5, borderRadius: 2 }}
            >
              ✅ Submit GRN
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Issue Drawer */}
      <Drawer
        anchor="right"
        open={issueOpen}
        onClose={() => setIssueOpen(false)}
      >
        <Box
          sx={{
            width: 600,
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

          {/* Stock Info Card */}
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
                    <strong>Item Size/Width/Dimension:</strong>{" "}
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

          {/* Issue Form */}
          <Grid container spacing={1}>
            {/* Issue Type */}
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Issue Type</InputLabel>
                <Select
                  value={issueForm.issue_type || ""}
                  onChange={(e) =>
                    handleIssueFormChange("issue_type", e.target.value)
                  }
                  label="Issue Type"
                >
                  {issueTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {errors.issue_type && (
                  <small className="text-danger">{errors.issue_type}</small>
                )}
              </FormControl>
            </Grid>
            {/* Conditionally render fields based on issue_type */}
            {issueForm.issue_type === "Self" && (
              <>
                <Grid item xs={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={issueForm.department || ""}
                      onChange={(e) =>
                        handleIssueFormChange("department", e.target.value)
                      }
                      label="Department"
                    >
                      {departments.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.department && (
                      <small className="text-danger">{errors.department}</small>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Line"
                    value={issueForm.line || ""}
                    onChange={(e) =>
                      handleIssueFormChange("line", e.target.value)
                    }
                  />
                  {errors.line && (
                    <small className="text-danger">{errors.line}</small>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Issuing To</InputLabel>
                    <Select
                      value={issueForm.issue_to || ""}
                      onChange={(e) =>
                        handleIssueFormChange("issue_to", e.target.value)
                      }
                      label="Issue To"
                    >
                      {issueUsers.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                          {c.full_name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.issue_to && (
                      <small className="text-danger">{errors.issue_to}</small>
                    )}
                  </FormControl>
                </Grid>
              </>
            )}
            {["Sister-Factory", "Sub-Contract", "Sample"].includes(
              issueForm.issue_type
            ) && (
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Issuing Company</InputLabel>
                  <Select
                    value={issueForm.issuing_company || ""}
                    onChange={(e) =>
                      handleIssueFormChange("issuing_company", e.target.value)
                    }
                    label="Issuing Company"
                  >
                    {companies.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.title}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.issuing_company && (
                    <small className="text-danger">
                      {errors.issuing_company}
                    </small>
                  )}
                </FormControl>
              </Grid>
            )}

            {issueForm.issue_type && (
              <>
                <Grid item xs={6}>
                  <TextField
                    label="Issue Date"
                    name="issue_date"
                    type="date"
                    value={issueForm.issue_date}
                    onChange={(e) =>
                      handleIssueFormChange("issue_date", e.target.value)
                    }
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                  {errors.issue_date && (
                    <small className="text-danger">{errors.issue_to}</small>
                  )}
                </Grid>
                {/* Common fields */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Quantity"
                    type="number"
                    value={issueForm.qty || ""}
                    onChange={(e) => {
                      let val = parseFloat(e.target.value);
                      if (isNaN(val) || val < 0) {
                        val = 0; // enforce min 0
                      }
                      handleIssueFormChange("qty", val);
                    }}
                    inputProps={{
                      min: 0,
                      step: "any", // allows decimals
                    }}
                  />
                  {errors.qty && (
                    <small className="text-danger">{errors.qty}</small>
                  )}
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Delivery Challan"
                    value={issueForm.delivery_challan || ""}
                    onChange={(e) =>
                      handleIssueFormChange("delivery_challan", e.target.value)
                    }
                  />
                  {errors.delivery_challan && (
                    <small className="text-danger">
                      {errors.delivery_challan}
                    </small>
                  )}
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Reference"
                    value={issueForm.ref || ""}
                    onChange={(e) =>
                      handleIssueFormChange("ref", e.target.value)
                    }
                  />
                  {errors.ref && (
                    <small className="text-danger">{errors.ref}</small>
                  )}
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Requisition Number"
                    value={issueForm.requisition_number || ""}
                    onChange={(e) =>
                      handleIssueFormChange(
                        "requisition_number",
                        e.target.value
                      )
                    }
                  />
                  {errors.requisition_number && (
                    <small className="text-danger">
                      {errors.requisition_number}
                    </small>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Remarks"
                    multiline
                    rows={3}
                    value={issueForm.remarks || ""}
                    onChange={(e) =>
                      handleIssueFormChange("remarks", e.target.value)
                    }
                  />
                  {errors.remarks && (
                    <small className="text-danger">{errors.remarks}</small>
                  )}
                </Grid>
              </>
            )}
          </Grid>

          {/* Actions */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              mt: "auto",
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
