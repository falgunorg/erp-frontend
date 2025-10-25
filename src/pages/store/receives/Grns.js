import React, { useEffect, useState } from "react";
import api from "services/api";
import { useHistory, Link } from "react-router-dom";
import CustomSelect from "elements/CustomSelect";
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

  // ✅ Helper: Extract ID or value safely
  const getId = (val) => {
    if (!val && val !== 0) return "";
    if (typeof val === "object") return val.id ?? val.value ?? "";
    return val;
  };

  // ✅ Fetch GRNs with current filters
  const fetchGrns = async (overridePage) => {
    setLoading(true);
    try {
      const page = Number(overridePage ?? filters.page) || 1;
      const per_page = Number(filters.per_page) || 10;

      const { data } = await api.get("/store/grns", {
        params: {
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
        },
      });

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

  // ✅ Fetch dropdowns once
  useEffect(() => {
    fetchDropdownData();
  }, []);

  // ✅ Re-fetch on filter change
  useEffect(() => {
    fetchGrns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // ✅ Handle filter changes (resets page unless changing page)
  const handleChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: name === "page" ? value : 1,
    }));
  };

  // ✅ Reset all filters
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
      supplier_id: null,
    });
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
  }, [filters]);

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
    <Box className="create_technical_pack" p={3}>
      {/* Filters */}

      <Grid className="create_tp_body" container spacing={2} mb={2}>
        {/* Buyer */}
        <Grid item xs={6} sm={1.2}>
          <label className="form-label">Buyer</label>
          <CustomSelect
            label="Buyer"
            options={buyers.map((b) => ({
              label: b.name,
              value: b.id,
            }))}
            value={
              buyers
                .map((b) => ({ label: b.name, value: b.id }))
                .find((opt) => opt.value === getId(filters.buyer_id)) || null
            }
            onChange={(selected) =>
              handleChange("buyer_id", selected ? selected.value : null)
            }
          />
        </Grid>

        {/* Technical Package */}
        <Grid item xs={6} sm={1.2}>
          <label className="form-label">Techpack/Style</label>
          <CustomSelect
            label="Technical Package"
            options={techpacks.map((tp) => ({
              label: tp.techpack_number,
              value: tp.id,
            }))}
            value={
              techpacks
                .map((tp) => ({ label: tp.techpack_number, value: tp.id }))
                .find(
                  (opt) => opt.value === getId(filters.technical_package_id)
                ) || null
            }
            onChange={(selected) =>
              handleChange(
                "technical_package_id",
                selected ? selected.value : null
              )
            }
          />
        </Grid>

        {/* Item Type */}
        <Grid item xs={6} sm={1.2}>
          <label className="form-label">Item Type</label>
          <CustomSelect
            label="Item Type"
            options={itemTypes.map((i) => ({
              label: i.title,
              value: i.id,
            }))}
            value={
              itemTypes
                .map((i) => ({ label: i.title, value: i.id }))
                .find((opt) => opt.value === getId(filters.item_type_id)) ||
              null
            }
            onChange={(selected) =>
              handleChange("item_type_id", selected ? selected.value : null)
            }
          />
        </Grid>

        {/* Supplier */}
        <Grid item xs={6} sm={1.2}>
          <label className="form-label">Supplier</label>
          <CustomSelect
            label="Supplier"
            options={suppliers.map((s) => ({
              label: s.company_name,
              value: s.id,
            }))}
            value={
              suppliers
                .map((s) => ({ label: s.company_name, value: s.id }))
                .find((opt) => opt.value === getId(filters.supplier_id)) || null
            }
            onChange={(selected) =>
              handleChange("supplier_id", selected ? selected.value : null)
            }
          />
        </Grid>

        {/* From Date */}
        <Grid item xs={6} sm={1.2}>
          <label className="form-label">From Date</label>
          <input
            type="date"
            className="form-control"
            value={filters.from_date}
            onChange={(e) => handleChange("from_date", e.target.value)}
          />
        </Grid>

        {/* To Date */}
        <Grid item xs={6} sm={1.2}>
          <label className="form-label">To Date</label>
          <input
            type="date"
            className="form-control"
            value={filters.to_date}
            onChange={(e) => handleChange("to_date", e.target.value)}
          />
        </Grid>

        {/* Search */}
        <Grid item xs={6} sm={1.2}>
          <label className="form-label">Search</label>
          <input
            type="text"
            className="form-control"
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
          />
        </Grid>

        {/* Color */}
        <Grid item xs={6} sm={1.2}>
          <label className="form-label">Color</label>
          <input
            type="text"
            className="form-control"
            value={filters.color}
            onChange={(e) => handleChange("color", e.target.value)}
          />
        </Grid>

        {/* Sort By */}
        <Grid item xs={6} sm={1.2}>
          <label className="form-label">Sort By</label>
          <CustomSelect
            label="Sort By"
            options={[
              { label: "Default", value: "" },
              { label: "Name ASC", value: "name-asc" },
              { label: "Name DESC", value: "name-desc" },
              { label: "QTY ASC", value: "stock-asc" },
              { label: "QTY DESC", value: "stock-desc" },
            ]}
            value={
              [
                { label: "Default", value: "" },
                { label: "Name ASC", value: "name-asc" },
                { label: "Name DESC", value: "name-desc" },
                { label: "QTY ASC", value: "stock-asc" },
                { label: "QTY DESC", value: "stock-desc" },
              ].find((opt) => opt.value === filters.sort_by) || null
            }
            onChange={(selected) =>
              handleChange("sort_by", selected?.value || "")
            }
          />
        </Grid>

        {/* Per Page */}
        <Grid item xs={6} sm={1.2}>
          <label className="form-label">Per page</label>
          <CustomSelect
            label="Per Page"
            options={perPageOptions.map((p) => ({
              label: p.toString(),
              value: p,
            }))}
            value={
              perPageOptions
                .map((p) => ({ label: p.toString(), value: p }))
                .find((opt) => opt.value === filters.per_page) || null
            }
            onChange={(selected) =>
              handleChange("per_page", selected?.value || 10)
            }
          />
        </Grid>

        {/* Buttons */}
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

      <hr />

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
