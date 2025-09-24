import React, { useEffect, useState } from "react";
import api from "services/api";
import { useHistory, Link } from "react-router-dom";
import {
  Drawer,
  Card,
  CardContent,
  Typography,
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

const Grns = (props) => {
  const history = useHistory();
  const [grns, setGrns] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dropdown options
  const [techpacks, setTechpacks] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const perPageOptions = [2, 10, 25, 50, 100, 200, 500];

  const [filters, setFilters] = useState({
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
    supplier_id: null,
  });

  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
  });

  // helper to read id from Autocomplete option (or raw value)
  const getId = (val) => {
    if (!val && val !== 0) return "";
    if (typeof val === "object") return val.id ?? val.value ?? "";
    return val;
  };

  /** 🔹 Fetch Dropdown Data */
  const fetchDropdownData = async () => {
    try {
      const [techRes, buyerRes, itemTypeRes, supplierRes] = await Promise.all([
        api.post("/merchandising/technical-packages-all-desc"),
        api.post("/common/buyers"),
        api.post("/common/item-types"),
        api.post("/admin/suppliers"),
      ]);
      setTechpacks(techRes.data?.data || []);
      setBuyers(buyerRes.data?.data || []);
      setItemTypes(itemTypeRes.data?.data || []);
      setSuppliers(supplierRes.data.data || []);
    } catch (err) {
      console.error("Error fetching dropdown data", err);
    }
  };

  /** 🔹 Fetch GRNs (uses filters state) */
  const fetchGrns = async (overridePage) => {
    setLoading(true);
    try {
      const page = Number(overridePage ?? filters.page) || 1;
      const per_page = Number(filters.per_page) || 10;

      // <-- IMPORTANT: pass filters inside `params`
      const { data } = await api.get("/store/grns", {
        technical_package_id: getId(filters.technical_package_id),
        buyer_id: getId(filters.buyer_id),
        item_type_id: getId(filters.item_type_id),
        from_date: filters.from_date || "",
        to_date: filters.to_date || "",
        search: filters.search || "",
        color: filters.color || "",
        sort_by: filters.sort_by || "",
        per_page,
        page,
        supplier_id: getId(filters.supplier_id),
      });

      // normalize response
      setGrns(data.data || []);

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
      console.error("Error fetching GRNs", err);
    } finally {
      setLoading(false);
    }
  };

  // initial dropdown fetch
  useEffect(() => {
    fetchDropdownData();
  }, []);

  // re-fetch whenever relevant filters change
  useEffect(() => {
    // call fetchGrns using the current filters state
    fetchGrns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.technical_package_id,
    filters.buyer_id,
    filters.item_type_id,
    filters.from_date,
    filters.to_date,
    filters.search,
    filters.color,
    filters.sort_by,
    filters.per_page,
    filters.page,
    filters.supplier_id,
  ]);

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
      pageName: "GRN",
      isNewButton: false,
      newButtonLink: "",
      isInnerSearch: false,
      innerSearchValue: "",
      isDropdown: false,
      DropdownMenu: [],
    });
  }, []);

  const goBack = () => {
    history.goBack();
  };

  const deleteGrn = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this issue?"
    );
    if (!confirmDelete) return;

    try {
      const response = await api.delete(`/store/grns/${id}`);

      if (response.status === 200 || response.status === 204) {
        fetchGrns();
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

  const handleFormChange = (e) =>
    setEditItem((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const [errors, setErrors] = useState({});

  const handleSubmitGrn = async () => {
    try {
      const response = await api.put(`/store/grns/${editItem.id}`, {
        ...editItem,
        stock_id: editItem.stock_id ?? "",
        unit: editItem.unit ?? "",
      });

      if (response.status === 200 || response.status === 204) {
        fetchGrns();
        setDrawerOpen(false);
        editItem({});
        setErrors({});
      } else {
        alert("Failed to update the GRN. Please try again.");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <Box p={3}>
      {/* Filters */}
      <Grid className="create_tp_body" container spacing={2} mb={2}>
        <Grid create_tp_body item xs={6} sm={1.2}>
          <Autocomplete
            options={buyers}
            getOptionLabel={(option) => option.name || ""}
            value={filters.buyer_id}
            onChange={(e, newValue) => handleChange("buyer_id", newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Buyer" fullWidth />
            )}
          />
        </Grid>

        <Grid item xs={6} sm={1.2}>
          <Autocomplete
            options={techpacks}
            getOptionLabel={(option) => option.techpack_number || ""}
            value={filters.technical_package_id}
            onChange={(e, newValue) =>
              handleChange("technical_package_id", newValue)
            }
            renderInput={(params) => (
              <TextField {...params} label="Technical Package" fullWidth />
            )}
          />
        </Grid>

        <Grid item xs={6} sm={1.2}>
          <Autocomplete
            options={itemTypes}
            getOptionLabel={(option) => option.title || ""}
            value={filters.item_type_id}
            onChange={(e, newValue) => handleChange("item_type_id", newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Item Type" fullWidth />
            )}
          />
        </Grid>
        <Grid item xs={6} sm={1.2}>
          <Autocomplete
            options={suppliers}
            getOptionLabel={(option) => option.company_name || ""}
            value={filters.supplier_id}
            onChange={(e, newValue) => handleChange("supplier_id", newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Supplier" fullWidth />
            )}
          />
        </Grid>

        <Grid item xs={6} sm={1.2}>
          <TextField
            type="date"
            label="From Date"
            InputLabelProps={{ shrink: true }}
            value={filters.from_date}
            onChange={(e) => handleChange("from_date", e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={6} sm={1.2}>
          <TextField
            type="date"
            label="To Date"
            InputLabelProps={{ shrink: true }}
            value={filters.to_date}
            onChange={(e) => handleChange("to_date", e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={6} sm={1.2}>
          <TextField
            label="Search"
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={6} sm={1.2}>
          <TextField
            label="Color"
            value={filters.color}
            onChange={(e) => handleChange("color", e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={6} sm={1.2}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sort_by}
              onChange={(e) => handleChange("sort_by", e.target.value)}
            >
              <MenuItem value="">Default</MenuItem>
              <MenuItem value="name-asc">Name ASC</MenuItem>
              <MenuItem value="name-desc">Name DESC</MenuItem>
              <MenuItem value="stock-asc">QTY ASC</MenuItem>
              <MenuItem value="stock-desc">QTY DESC</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6} sm={1.2}>
          <Autocomplete
            options={perPageOptions}
            getOptionLabel={(option) => option.toString()}
            value={filters.per_page}
            onChange={(e, newValue) => handleChange("per_page", newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Per Page" fullWidth />
            )}
          />
        </Grid>

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
          <Link className="btn btn-success" to="/store/receives/report">
            Report
          </Link>
        </Grid>
      </Grid>

      <Divider />

      {/* Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#WO</TableCell>
            <TableCell>Buyer</TableCell>
            <TableCell>Techpack</TableCell>
            <TableCell>Garment Color</TableCell>
            <TableCell>Supplier</TableCell>
            <TableCell>GRN Number</TableCell>
            <TableCell>Booking No.</TableCell>
            <TableCell>Booking By</TableCell>
            <TableCell>Item Type</TableCell>
            <TableCell>Item</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Color</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Receive QTY</TableCell>
            <TableCell>Consignment</TableCell>
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
                <TableCell>{grn.workorder?.wo_number}</TableCell>
                <TableCell>{grn.buyer?.name}</TableCell>
                <TableCell>{grn.techpack?.techpack_number}</TableCell>
                <TableCell>{grn.garment_color}</TableCell>
                <TableCell>{grn.supplier?.company_name}</TableCell>
                <TableCell>{grn.grn_number}</TableCell>
                <TableCell>{grn.booking?.booking_number}</TableCell>
                <TableCell>{grn.booked_by_user?.full_name}</TableCell>
                <TableCell>{grn.item_type?.title}</TableCell>
                <TableCell>{grn.item?.title}</TableCell>
                <TableCell sx={{ maxWidth: "150px" }}>
                  {grn.item_description}
                </TableCell>
                <TableCell>{grn.item_color}</TableCell>
                <TableCell>{grn.item_size}</TableCell>
                <TableCell>
                  {grn.qty}/{grn.unit}
                </TableCell>
                <TableCell>{grn.consignment}</TableCell>
                <TableCell>
                  <button
                    onClick={() => handleEdit(grn)}
                    className="btn btn-sm btn-warning me-2"
                  >
                    <i className="fa fa-pen"></i>
                  </button>
                  <button
                    onClick={() => deleteGrn(grn.id)}
                    className="btn btn-sm btn-danger"
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={13} align="center">
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
                {editItem?.booking?.booking_number}
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Buyer:</strong> {editItem?.buyer?.name || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Style/Techpack:</strong>{" "}
                    {editItem?.techpack?.techpack_number || "-"} /{" "}
                    {editItem.garment_color} / {editItem.size_range}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Item Name:</strong> {editItem?.item?.title || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Color:</strong> {editItem?.item_color || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Item Size/Width/Dimention:</strong>{" "}
                    {editItem?.item_size || "-"}
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
                value={editItem.invoice_number}
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
                value={editItem.challan_number}
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
                value={editItem.received_date}
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
                value={editItem.qty}
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
                label="Remarks"
                name="remarks"
                value={editItem.remarks}
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
              ✅ Update GRN
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Grns;
