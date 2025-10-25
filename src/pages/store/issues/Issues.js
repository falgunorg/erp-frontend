import React, { useEffect, useState } from "react";
import api from "services/api";
import { useHistory, Link } from "react-router-dom";
import CustomSelect from "../../../elements/CustomSelect";
import {
  Drawer,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  Divider,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

const Issues = (props) => {
  const [grns, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  // Dropdown options
  const [techpacks, setTechpacks] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [issueUsers, setIssueUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const issueTypes = [
    "Self",
    "Sister-Factory",
    "Sub-Contract",
    "Sample",
    "Stock-Lot",
  ];
  const departments = ["Cutting", "Sewing", "Finishing", "Washing", "QC"];

  const perPageOptions = [2, 10, 25, 50, 100, 200, 500];

  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
  });

  /** 🔹 Fetch Dropdown Data */
  const fetchDropdownData = async () => {
    try {
      const [techRes, buyerRes, itemTypeRes, supplierRes, companyRes, userRes] =
        await Promise.all([
          api.post("/merchandising/technical-packages-all-desc"),
          api.post("/common/buyers"),
          api.post("/common/item-types"),
          api.post("/admin/suppliers"),
          api.post("/common/companies", {
            type: editItem.issue_type === "Stock-Lot" ? "Other" : "Own",
          }),
          api.post("/admin/employees", {
            issue_type: "Self",
          }),
        ]);
      setTechpacks(techRes.data?.data || []);
      setBuyers(buyerRes.data?.data || []);
      setItemTypes(itemTypeRes.data?.data || []);
      setSuppliers(supplierRes.data?.data || []);
      setCompanies(companyRes.data?.data || []);
      setIssueUsers(userRes.data?.data || []);
    } catch (err) {
      console.error("Error fetching dropdown data", err);
    }
  };
  // initial dropdown fetch
  useEffect(() => {
    fetchDropdownData();
  }, []);

  /** 🔹 Fetch GRNs (uses filters state) */
  /** 🔹 Helper for safe ID extraction */
  const getId = (obj) => (obj && typeof obj === "object" ? obj.value : obj);

  /** 🔹 Filters State */
  const [filters, setFilters] = useState({
    technical_package_id: null,
    buyer_id: null,
    item_type_id: null,
    search: "",
    color: "",
    sort_by: null,
    from_date: "",
    to_date: "",
    per_page: { value: 10, label: "10" },
    page: 1,
  });

  /** 🔹 Fetch Issues (using filters) */
  const fetchIssues = async (overridePage) => {
    setLoading(true);
    try {
      const page = Number(overridePage ?? filters.page) || 1;
      const per_page = Number(getId(filters.per_page)) || 10;

      const params = {
        technical_package_id: getId(filters.technical_package_id) || "",
        buyer_id: getId(filters.buyer_id) || "",
        item_type_id: getId(filters.item_type_id) || "",
        from_date: filters.from_date || "",
        to_date: filters.to_date || "",
        search: filters.search || "",
        color: filters.color || "",
        sort_by: getId(filters.sort_by) || "",
        per_page,
        page,
      };

      const { data } = await api.get("/store/issues", { params });

      setIssues(data.data || []);
      setPagination({
        total: data.total ?? 0,
        per_page: data.per_page ?? per_page,
        current_page: data.current_page ?? page,
        last_page:
          data.last_page ??
          Math.max(
            1,
            Math.ceil((data.total ?? 0) / (data.per_page ?? per_page))
          ),
      });
    } catch (err) {
      console.error("Error fetching Issues:", err);
    } finally {
      setLoading(false);
    }
  };

  // re-fetch whenever relevant filters change
  useEffect(() => {
    // call fetchIssues using the current filters state
    fetchIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  /** 🔹 Handle filter change
   *  - when changing page, keep page value
   *  - otherwise reset to page 1
   */
  const handleChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: name === "page" ? value : 1,
    }));
  };

  /** 🔹 Clear all filters */
  const clearFilters = () => {
    setFilters({
      technical_package_id: null,
      buyer_id: null,
      item_type_id: null,
      search: "",
      color: "",
      sort_by: "",
      from_date: "",
      to_date: "",
      per_page: 10,
      page: 1,
    });
  };

  useEffect(async () => {
    props.setHeaderData({
      pageName: "ISSUE",
      isNewButton: false,
      newButtonLink: "",
      isInnerSearch: false,
      innerSearchValue: "",
      isDropdown: false,
      DropdownMenu: [],
    });
  }, []);

  const deleteIssue = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this issue?"
    );
    if (!confirmDelete) return;

    try {
      const response = await api.delete(`/store/issues/${id}`);

      if (response.status === 200 || response.status === 204) {
        fetchIssues();
      } else {
        alert("Failed to delete the issue. Please try again.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting the issue.");
    }
  };

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editItem, setEditItem] = useState({});

  const handleEdit = (item) => {
    setEditItem(item);
    setDrawerOpen(true);
  };

  const handleEditChange = (name, value) => {
    setEditItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Quantity validation
    const qty = parseFloat(editItem.qty);
    if (editItem.qty === "" || isNaN(qty) || qty < 0) {
      newErrors.qty = "Quantity must be 0 or greater";
    }

    // Issue type validation
    if (!editItem.issue_type) {
      newErrors.issue_type = "Issue Type is required";
    }

    if (!editItem.requisition_number) {
      newErrors.requisition_number = "Requisition Number is required";
    }

    // Conditional validations
    if (editItem.issue_type === "Self") {
      if (!editItem.department) {
        newErrors.department = "Department To is required for Self";
      }
      if (!editItem.issue_to) {
        newErrors.issue_to = "Issue To is required for Self";
      }
      if (!editItem.line) {
        newErrors.line = "Line is required for Self";
      }
    }

    if (
      ["Sister-Factory", "Sub-Contract", "Sample"].includes(editItem.issue_type)
    ) {
      if (!editItem.issuing_company) {
        newErrors.issuing_company = "Issuing Company is required";
      }
    }

    return newErrors;
  };

  const handleEditSubmitIssue = async () => {
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return; // Stop submit if errors exist
    }

    try {
      const response = await api.put(`/store/issues/${editItem.id}`, {
        ...editItem,
        stock_id: editItem.stock_id ?? "",
        unit: editItem.unit ?? "",
      });

      if (response.status === 200 || response.status === 204) {
        fetchIssues();
        setDrawerOpen(false);
        editItem({});
      } else {
        alert("Failed to delete the issue. Please try again.");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  console.log("ITEM", itemTypes);

  const goBack = () => {
    history.goBack();
  };

  console.log("FILTERDATA", filters);

  return (
    <Box className="create_technical_pack" p={3}>
      {/* Filters */}

      <Grid className="create_tp_body" container spacing={2} mb={2}>
        {/* Buyer */}
        <Grid item xs={6} sm={1.2}>
          <label className="form-label">Buyer</label>
          <CustomSelect
            label="Buyer"
            options={buyers.map((b) => ({ value: b.id, label: b.name }))}
            value={filters.buyer_id}
            onChange={(selected) => handleChange("buyer_id", selected)}
          />
        </Grid>

        {/* Technical Package */}
        <Grid item xs={6} sm={1.2}>
          <label className="form-label">Techpack/Style</label>
          <CustomSelect
            label="Technical Package"
            options={techpacks.map((t) => ({
              value: t.id,
              label: t.techpack_number,
            }))}
            value={filters.technical_package_id}
            onChange={(selected) =>
              handleChange("technical_package_id", selected)
            }
          />
        </Grid>

        {/* Item Type */}
        <Grid item xs={6} sm={1.2}>
          <label className="form-label">Item Type</label>
          <CustomSelect
            label="Item Type"
            options={itemTypes.map((i) => ({ value: i.id, label: i.title }))}
            value={filters.item_type_id}
            onChange={(selected) => handleChange("item_type_id", selected)}
          />
        </Grid>

        {/* From Date */}
        <Grid item xs={6} sm={1.2}>
          <label className="form-label">From Date</label>
          <input
            type="date"
            value={filters.from_date}
            onChange={(e) => handleChange("from_date", e.target.value)}
            className="form-control"
          />
        </Grid>

        {/* To Date */}
        <Grid item xs={6} sm={1.2}>
          <label className="form-label">To Date</label>
          <input
            type="date"
            value={filters.to_date}
            onChange={(e) => handleChange("to_date", e.target.value)}
            className="form-control"
          />
        </Grid>

        {/* Search */}
        <Grid item xs={6} sm={1.2}>
          <label className="form-label">Search</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            className="form-control"
          />
        </Grid>

        {/* Color */}
        <Grid item xs={6} sm={1.2}>
          <label className="form-label">Color</label>
          <input
            type="text"
            value={filters.color}
            onChange={(e) => handleChange("color", e.target.value)}
            className="form-control"
          />
        </Grid>

        {/* Sort By */}
        <Grid item xs={6} sm={1.2}>
          <label className="form-label">Sort By</label>
          <CustomSelect
            options={[
              { value: "", label: "Default" },
              { value: "name-asc", label: "Name ASC" },
              { value: "name-desc", label: "Name DESC" },
              { value: "stock-asc", label: "Stock ASC" },
              { value: "stock-desc", label: "Stock DESC" },
            ]}
            value={filters.sort_by}
            onChange={(selected) => handleChange("sort_by", selected)}
          />
        </Grid>

        {/* Per Page */}
        <Grid item xs={6} sm={1.2}>
          <label className="form-label">Per Page</label>
          <CustomSelect
            label="Per Page"
            options={perPageOptions.map((p) => ({ value: p, label: p }))}
            value={filters.per_page}
            onChange={(selected) => handleChange("per_page", selected)}
          />
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={6}>
          <Button
            className="me-2"
            variant="contained"
            color="secondary"
            onClick={clearFilters}
          >
            Reset
          </Button>
          <Button
            className="me-2"
            variant="contained"
            color="primary"
            onClick={goBack}
          >
            Back
          </Button>
          <Link to="/store/issue/report" className="btn btn-success">
            Report
          </Link>
        </Grid>
      </Grid>

      <hr />

      {/* Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Buyer</TableCell>
            <TableCell>Techpack</TableCell>
            <TableCell>Garment Color</TableCell>
            <TableCell>ISS Number</TableCell>
            <TableCell>Issue Type</TableCell>
            <TableCell>Issue To</TableCell>
            <TableCell>Item Type</TableCell>
            <TableCell>Item</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Color</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Issue QTY</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={12} align="center">
                Loading...
              </TableCell>
            </TableRow>
          ) : grns.length > 0 ? (
            grns.map((grn) => (
              <TableRow key={grn.id}>
                <TableCell>{grn.stock?.buyer?.name}</TableCell>
                <TableCell>{grn.stock?.techpack?.techpack_number}</TableCell>
                <TableCell>{grn.stock?.garment_color}</TableCell>
                <TableCell>{grn.issue_number}</TableCell>
                <TableCell>{grn.issue_type}</TableCell>
                <TableCell>
                  {grn.issue_type == "Self"
                    ? grn.issue_to_user?.full_name
                    : grn.issue_to_company.title}
                  {}
                </TableCell>
                <TableCell>{grn.stock?.item_type?.title}</TableCell>
                <TableCell>{grn.stock?.item?.title}</TableCell>
                <TableCell sx={{ maxWidth: "150px" }}>
                  {grn.stock?.item_description}
                </TableCell>
                <TableCell>{grn.stock?.item_color}</TableCell>
                <TableCell>{grn.stock?.item_size}</TableCell>
                <TableCell>
                  {grn.qty}/{grn.unit}
                </TableCell>

                <TableCell>
                  <button
                    onClick={() => handleEdit(grn)}
                    className="btn btn-sm me-2 btn-warning"
                  >
                    <i className="fa fa-pen"></i>
                  </button>
                  <button
                    onClick={() => deleteIssue(grn.id)}
                    className="btn btn-sm btn-danger"
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={15} align="center">
                No GRNs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <Box mt={2} display="flex" justifyContent="center">
        <Pagination
          count={
            pagination.last_page ||
            Math.max(1, Math.ceil(pagination.total / pagination.per_page))
          }
          page={pagination.current_page}
          onChange={(e, value) => handleChange("page", value)}
        />
      </Box>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
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
            Edit Issue Item: {editItem?.stock?.item?.title}
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
                    <strong>Buyer:</strong>{" "}
                    {editItem?.stock?.buyer?.name || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Style/Techpack:</strong>{" "}
                    {editItem?.stock?.techpack?.techpack_number || "-"} /{" "}
                    {editItem?.stock?.garment_color} /{" "}
                    {editItem?.stock?.size_range}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Item Name:</strong>{" "}
                    {editItem?.stock?.item?.title || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Color:</strong> {editItem?.stock?.item_color || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Item Size/Width/Dimension:</strong>{" "}
                    {editItem?.stock?.item_size || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Balance QTY:</strong>{" "}
                    {editItem?.stock?.balance_qty || "0"} /{" "}
                    {editItem?.stock?.unit}
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
                  value={editItem.issue_type || ""}
                  onChange={(e) =>
                    handleEditChange("issue_type", e.target.value)
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
            {editItem.issue_type === "Self" && (
              <>
                <Grid item xs={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={editItem.department || ""}
                      onChange={(e) =>
                        handleEditChange("department", e.target.value)
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
                    value={editItem.line || ""}
                    onChange={(e) => handleEditChange("line", e.target.value)}
                  />
                  {errors.line && (
                    <small className="text-danger">{errors.line}</small>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Issuing To</InputLabel>
                    <Select
                      value={editItem.issue_to || ""}
                      onChange={(e) =>
                        handleEditChange("issue_to", e.target.value)
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
              editItem.issue_type
            ) && (
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Issuing Company</InputLabel>
                  <Select
                    value={editItem.issuing_company || ""}
                    onChange={(e) =>
                      handleEditChange("issuing_company", e.target.value)
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

            {editItem.issue_type && (
              <>
                <Grid item xs={6}>
                  <TextField
                    label="Issue Date"
                    name="issue_date"
                    type="date"
                    value={editItem.issue_date}
                    onChange={(e) =>
                      handleEditChange("issue_date", e.target.value)
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
                    value={editItem.qty || ""}
                    onChange={(e) => {
                      let val = parseFloat(e.target.value);
                      if (isNaN(val) || val < 0) {
                        val = 0; // enforce min 0
                      }
                      handleEditChange("qty", val);
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
                    value={editItem.delivery_challan || ""}
                    onChange={(e) =>
                      handleEditChange("delivery_challan", e.target.value)
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
                    value={editItem.ref || ""}
                    onChange={(e) => handleEditChange("ref", e.target.value)}
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
                    value={editItem.requisition_number || ""}
                    onChange={(e) =>
                      handleEditChange("requisition_number", e.target.value)
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
                    value={editItem.remarks || ""}
                    onChange={(e) =>
                      handleEditChange("remarks", e.target.value)
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
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleEditSubmitIssue}>
              Submit
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Issues;
