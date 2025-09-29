import React, { useState, useEffect } from "react";
import api from "services/api";
import CustomSelect from "elements/CustomSelect";
import {
  Box,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Stack,
  Drawer,
  Typography,
  Divider,
  Chip,
  Grid,
} from "@mui/material";

import { Link, useHistory } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const Bookings = (props) => {
  const history = useHistory();
  const [filters, setFilters] = useState({
    wo_id: "",
    supplier_id: "",
    technical_package_id: "",
    buyer_id: "",
    item_type_id: "",
    search: "",
    eta_from: "",
    eta_to: "",
    etd_from: "",
    etd_to: "",
    eid_from: "",
    eid_to: "",
    garment_color: "",
  });

  // 🔹 Options for select inputs
  const [woOptions, setWoOptions] = useState([]);
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [itemTypeOptions, setItemTypeOptions] = useState([]);
  const [techPackOptions, setTechPackOptions] = useState([]);
  const [buyerOptions, setBuyerOptions] = useState([]);

  // 🔹 Bookings & Pagination
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(0);

  // 🔹 Sorting
  const [sort, setSort] = useState({
    sort_by: "created_at",
    sort_order: "desc",
  });

  // 🔹 Fetch options for select inputs
  const fetchOptions = async () => {
    try {
      const [woRes, supplierRes, itemTypeRes, techPackRes, buyerRes] =
        await Promise.all([
          api.post("/merchandising/workorders-public"),
          api.post("/admin/suppliers"),
          api.post("/common/item-types"),
          api.post("/merchandising/technical-packages-all-desc"),
          api.post("/common/buyers"),
        ]);
      setWoOptions(woRes.data.data || []);
      setSupplierOptions(supplierRes.data.data || []);
      setItemTypeOptions(itemTypeRes.data.data || []);
      setTechPackOptions(techPackRes.data.data || []);
      setBuyerOptions(buyerRes.data.data || []);
    } catch (error) {
      console.error("Error fetching select options:", error);
    }
  };

  // 🔹 Fetch bookings
  const fetchBookings = async () => {
    try {
      const params = {
        ...filters,
        page: page + 1,
        per_page: rowsPerPage,
        sort_by: sort.sort_by,
        sort_order: sort.sort_order,
      };
      const response = await api.get("/merchandising/bookings", { params });
      setBookings(response.data.data.data || []);
      setTotal(response.data.data.total || 0);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [filters, page, rowsPerPage, sort]);

  // 🔹 Handle filter input
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Apply filters
  const applyFilters = () => {
    setPage(0); // triggers useEffect
  };

  // 🔹 Reset filters
  const resetFilters = () => {
    setFilters({
      wo_id: "",
      supplier_id: "",
      technical_package_id: "",
      buyer_id: "",
      item_type_id: "",
      search: "",
      eta_from: "",
      eta_to: "",
      etd_from: "",
      etd_to: "",
      eid_from: "",
      eid_to: "",
      garment_color: "",
    });
    setPage(0); // triggers useEffect
  };

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleRowDoubleClick = (booking) => {
    setSelectedBooking(booking);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedBooking(null);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "⚠️ Are you sure you want to delete this booking?"
    );
    if (!confirmed) return;

    try {
      const response = await api.delete("/merchandising/bookings/" + id);
      if (response.status === 200) {
        alert("Booking deleted successfully ✅");
        window.location.reload();
      } else {
        alert("Failed to delete booking ❌");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong while deleting ❌");
    }
  };

  useEffect(async () => {
    props.setHeaderData({
      pageName: "Booking",
      isNewButton: true,
      newButtonLink: "",
      newButtonText: "New BK",
      isInnerSearch: true,
      innerSearchValue: "",
    });
  }, []);
  return (
    <Box className="create_technical_pack" p={3}>
      <div className="row align-items-end create_tp_body">
        <div className="col create_tp_body">
          <label className="form-label">WO</label>
          <CustomSelect
            options={[
              { value: "", label: "All" },
              ...woOptions.map((wo) => ({
                value: wo.id,
                label: wo.wo_number,
              })),
            ]}
            value={
              filters.wo_id
                ? {
                    value: filters.wo_id,
                    label: woOptions.find((w) => w.id === filters.wo_id)
                      ?.wo_number,
                  }
                : { value: "", label: "All" }
            }
            onChange={(selected) =>
              handleFilterChange({
                target: { name: "wo_id", value: selected?.value || "" },
              })
            }
          />
        </div>

        <div className="col create_tp_body">
          <label className="form-label">Supplier</label>
          <CustomSelect
            options={[
              { value: "", label: "All" },
              ...supplierOptions.map((s) => ({
                value: s.id,
                label: s.company_name,
              })),
            ]}
            value={
              filters.supplier_id
                ? {
                    value: filters.supplier_id,
                    label: supplierOptions.find(
                      (so) => so.id === filters.supplier_id
                    )?.company_name,
                  }
                : { value: "", label: "All" }
            }
            onChange={(selected) =>
              handleFilterChange({
                target: { name: "supplier_id", value: selected?.value || "" },
              })
            }
          />
        </div>

        {/* Buyer */}
        <div className="col create_tp_body">
          <label className="form-label">Buyer</label>
          <CustomSelect
            options={[
              { value: "", label: "All" },
              ...buyerOptions.map((b) => ({
                value: b.id,
                label: b.name,
              })),
            ]}
            value={
              filters.buyer_id
                ? {
                    value: filters.buyer_id,
                    label: buyerOptions.find((bo) => bo.id === filters.buyer_id)
                      ?.name,
                  }
                : { value: "", label: "All" }
            }
            onChange={(selected) =>
              handleFilterChange({
                target: { name: "buyer_id", value: selected?.value || "" },
              })
            }
          />
        </div>

        {/* Techpack */}
        <div className="col create_tp_body">
          <label className="form-label">Techpack</label>
          <CustomSelect
            options={[
              { value: "", label: "All" },
              ...techPackOptions.map((t) => ({
                value: t.id,
                label: t.techpack_number,
              })),
            ]}
            value={
              filters.technical_package_id
                ? {
                    value: filters.technical_package_id,
                    label: techPackOptions.find(
                      (tp) => tp.id === filters.technical_package_id
                    )?.techpack_number,
                  }
                : { value: "", label: "All" }
            }
            onChange={(selected) =>
              handleFilterChange({
                target: {
                  name: "technical_package_id",
                  value: selected?.value || "",
                },
              })
            }
          />
        </div>

        {/* Item Type */}
        <div className="col create_tp_body">
          <label className="form-label">Item Type</label>
          <CustomSelect
            options={[
              { value: "", label: "All" },
              ...itemTypeOptions.map((it) => ({
                value: it.id,
                label: it.title,
              })),
            ]}
            value={
              filters.item_type_id
                ? {
                    value: filters.item_type_id,
                    label: itemTypeOptions.find(
                      (io) => io.id === filters.item_type_id
                    )?.title,
                  }
                : { value: "", label: "All" }
            }
            onChange={(selected) =>
              handleFilterChange({
                target: { name: "item_type_id", value: selected?.value || "" },
              })
            }
          />
        </div>

        {/* Search */}
        <div className="col create_tp_body">
          <label className="form-label">Search</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            className="form-control"
          />
        </div>

        {/* Dates */}
        {["eta", "etd", "eid"].map((field) => (
          <React.Fragment key={field}>
            <div className="col create_tp_body">
              <label className="form-label">{field.toUpperCase()} From</label>
              <input
                type="date"
                name={`${field}_from`}
                value={filters[`${field}_from`]}
                onChange={handleFilterChange}
                className="form-control"
              />
            </div>
            <div className="col create_tp_body">
              <label className="form-label">{field.toUpperCase()} To</label>
              <input
                type="date"
                name={`${field}_to`}
                value={filters[`${field}_to`]}
                onChange={handleFilterChange}
                className="form-control"
              />
            </div>
          </React.Fragment>
        ))}

        {/* Garment Color */}
        <div className="col create_tp_body">
          <label className="form-label">Garment Color</label>
          <input
            type="text"
            name="garment_color"
            value={filters.garment_color}
            onChange={handleFilterChange}
            className="form-control"
          />
        </div>

        <div className="col create_tp_body">
          <button
            className="btn btn-success btn-sm me-2"
            onClick={applyFilters}
          >
            <i className="fa fa-search"></i>
          </button>
          <button className="btn btn-warning btn-sm" onClick={resetFilters}>
            <i className="fa fa-times"></i>
          </button>
        </div>
      </div>

      <hr />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>ID</strong>
            </TableCell>
            <TableCell>
              <strong>BUYER</strong>
            </TableCell>
            <TableCell>
              <strong>WO</strong>
            </TableCell>
            <TableCell>
              <strong>STYLE</strong>
            </TableCell>
            <TableCell>
              <strong>SUPPLIER</strong>
            </TableCell>
            <TableCell>
              <strong>ITEM TYPE</strong>
            </TableCell>
            <TableCell>
              <strong>ITEM</strong>
            </TableCell>
            <TableCell>
              <strong>TOTAL QTY</strong>
            </TableCell>
            <TableCell>
              <strong>ETA</strong>
            </TableCell>
            <TableCell>
              <strong>ETD</strong>
            </TableCell>
            <TableCell>
              <strong>EID</strong>
            </TableCell>
            <TableCell>
              <strong>VENDOR</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow
              key={booking.id}
              hover
              onClick={() => handleRowDoubleClick(booking)}
              sx={{ cursor: "pointer" }}
            >
              <TableCell>#{booking.booking_number}</TableCell>
              <TableCell>{booking.workorder?.techpack?.buyer?.name}</TableCell>
              <TableCell>{booking.workorder?.wo_number}</TableCell>
              <TableCell>
                {booking.workorder?.techpack?.techpack_number}
              </TableCell>
              <TableCell>
                {booking.supplier?.company_name || booking.supplier_id}
              </TableCell>
              <TableCell>{booking.item_type?.title}</TableCell>
              <TableCell>{booking.item?.title}</TableCell>
              <TableCell>
                {booking.total_booking_qty} {booking.unit}
              </TableCell>
              <TableCell>{booking.eta}</TableCell>
              <TableCell>{booking.etd}</TableCell>
              <TableCell>{booking.eid}</TableCell>
              <TableCell>
                {booking.workorder?.techpack?.company?.title}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{
          sx: { width: 500, borderRadius: "16px 0 0 16px", bgcolor: "#fafafa" },
        }}
      >
        {selectedBooking && (
          <>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                bgcolor: "#f6a33f",
                color: "white",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Quick View #{selectedBooking?.booking_number}
              </Typography>
              <Button onClick={handleCloseDrawer} sx={{ color: "white" }}>
                <CloseIcon />
              </Button>
            </Box>

            {/* Details Section */}
            <Box sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Buyer
                  </Typography>
                  <Typography fontWeight="500">
                    {selectedBooking?.workorder?.techpack?.buyer?.name}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Work Order
                  </Typography>
                  <Typography fontWeight="500">
                    {selectedBooking?.workorder?.wo_number}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Supplier
                  </Typography>
                  <Typography fontWeight="500">
                    {selectedBooking?.supplier?.company_name ||
                      selectedBooking?.supplier_id}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Item Type
                  </Typography>
                  <Typography fontWeight="500">
                    {selectedBooking?.item_type?.title}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Item
                  </Typography>
                  <Typography fontWeight="500">
                    {selectedBooking?.item?.title}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <InventoryIcon
                    sx={{
                      color: "#f6a33f",
                    }}
                  />
                  <Typography fontWeight="500">
                    {selectedBooking?.total_booking_qty} {selectedBooking?.unit}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <CalendarMonthIcon
                    sx={{
                      color: "#f6a33f",
                    }}
                  />
                  <Typography fontWeight="500">
                    {selectedBooking?.eta}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <LocalShippingIcon
                    sx={{
                      color: "#f6a33f",
                    }}
                  />
                  <Typography fontWeight="500">
                    {selectedBooking?.etd}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography fontWeight="500">Quick Links</Typography>
              <Link
                to={
                  "/merchandising/bookings-supplier-copy/" + selectedBooking?.id
                }
                className="btn btn-sm btn-success btn-rounded me-2"
              >
                Supplier Copy
              </Link>
              <Link
                to={"/merchandising/bookings/" + selectedBooking?.id}
                className="btn btn-sm btn-primary btn-rounded me-2"
              >
                Details
              </Link>
              <Link
                to={"/merchandising/edit-bookings/" + selectedBooking?.id}
                className="btn btn-sm btn-warning btn-rounded me-2"
              >
                Edit
              </Link>
              <Link
                to="#"
                onClick={() => handleDelete(selectedBooking?.id)}
                className="btn btn-sm btn-danger btn-rounded"
              >
                Delete
              </Link>
              <Divider sx={{ my: 3 }} />

              {/* Tags / Chips */}
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  label={`EID: ${selectedBooking?.eid}`}
                  sx={{
                    bgcolor: "#f6a33f",
                  }}
                />
                <Chip
                  label={
                    selectedBooking?.workorder?.techpack?.company?.title ||
                    "Vendor"
                  }
                  color="secondary"
                  variant="outlined"
                />
              </Box>
            </Box>

            <Box sx={{ p: 3 }}>
              <Typography variant="h6">Items</Typography>
              {selectedBooking?.items?.length > 0 ? (
                selectedBooking.items.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      mt: 1,
                      p: 1,
                      border: "1px solid #ddd",
                      borderRadius: 1,
                    }}
                  >
                    <Typography>
                      <strong>Garment Color:</strong> {item.garment_color}
                    </Typography>
                    <Typography>
                      <strong>Size Range:</strong> {item.size_range}
                    </Typography>
                    <Typography>
                      Color: {item.item_color}, Size: {item.item_size}
                    </Typography>
                    <Typography>Booking Qty: {item.booking_qty}</Typography>
                    <Typography>Comment: {item.comment}</Typography>
                  </Box>
                ))
              ) : (
                <Typography>No items found</Typography>
              )}
            </Box>
          </>
        )}
      </Drawer>

      {/* Pagination */}
      <hr />
      <Stack spacing={2} alignItems="center" mt={2}>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 20, 50, 100, 200, 500]}
          sx={{
            "& .MuiTablePagination-toolbar": {
              backgroundColor: "#f9fafb",
              borderRadius: "12px",
              padding: "8px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            },
            "& .MuiTablePagination-actions button": {
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              margin: "0 4px",
            },
            "& .MuiTablePagination-select": {
              borderRadius: "8px",
              padding: "4px 8px",
            },
          }}
        />
      </Stack>
    </Box>
  );
};

export default Bookings;
