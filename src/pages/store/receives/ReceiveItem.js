import React, { useState, useEffect, useCallback } from "react";
import api from "services/api";
import CustomSelect from "elements/CustomSelect";
import {
  Box,
  Grid,
  Button,
  Drawer,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  CircularProgress,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import axios from "axios";

const FilterSelect = ({ label, options, value, onChange }) => (
  <Box>
    <Typography variant="caption" fontWeight={600} color="textSecondary">
      {label}
    </Typography>
    <CustomSelect
      placeholder={label}
      options={options}
      value={options.find((opt) => opt.value === value)}
      onChange={(opt) => onChange(opt?.value || "")}
    />
  </Box>
);

export default function ReceiveItem({ setHeaderData }) {
  const [errors, setErrors] = useState({});
  const [bookings, setBookings] = useState([]);
  const [workorders, setWorkorders] = useState([]);
  const [techpacks, setTechpacks] = useState([]);
  const [filterData, setFilterData] = useState({
    wo_id: "",
    id: "",
    technical_package_id: "",
  });

  const [receivableItems, setReceivableItems] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [expandedRow, setExpandedRow] = useState(null);
  const [loading, setLoading] = useState(false);

  const [grnForm, setGrnForm] = useState({
    invoice_number: "",
    challan_number: "",
    received_date: "",
    qty: 0,
  });

  const handleFilterChange = (name, value) =>
    setFilterData((prev) => ({ ...prev, [name]: value }));

  const fetchOptions = useCallback(async () => {
    try {
      const [bookingRes, woRes, techPackRes] = await Promise.all([
        api.post("/merchandising/bookings-public"),
        api.post("/merchandising/workorders-public"),
        api.post("/merchandising/technical-packages-all-desc"),
      ]);
      setBookings(bookingRes.data.data || []);
      setWorkorders(woRes.data.data || []);
      setTechpacks(techPackRes.data.data || []);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  }, []);

  const fetchReceivableItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.post("/store/receiveable-items", {
        id: filterData.id,
        wo_id: filterData.wo_id,
        technical_package_id: filterData.technical_package_id,
      });
      setReceivableItems(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filterData]);

  useEffect(() => {
    fetchOptions();
    setHeaderData({
      pageName: "GRN",
      isNewButton: true,
      newButtonText: "New GRN",
      isInnerSearch: true,
    });
  }, [fetchOptions, setHeaderData]);

  useEffect(() => {
    fetchReceivableItems();
  }, [fetchReceivableItems]);

  const handleReceiveClick = (item) => {
    setCurrentItem(item);
    setGrnForm({
      invoice_number: "",
      challan_number: "",
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
        fetchReceivableItems();
        setErrors({});
      } else {
        setErrors(response.data.errors);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box p={2}>
      {/* Filter Row */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={3} md={2}>
          <FilterSelect
            label="Booking"
            options={bookings.map(({ booking_number, id }) => ({
              value: id,
              label: booking_number,
            }))}
            value={filterData.id}
            onChange={(val) => handleFilterChange("id", val)}
          />
        </Grid>
        <Grid item xs={12} sm={3} md={2}>
          <FilterSelect
            label="Work Order"
            options={workorders.map(({ wo_number, id }) => ({
              value: id,
              label: wo_number,
            }))}
            value={filterData.wo_id}
            onChange={(val) => handleFilterChange("wo_id", val)}
          />
        </Grid>
        <Grid item xs={12} sm={3} md={2}>
          <FilterSelect
            label="Techpack / Style"
            options={techpacks.map(({ techpack_number, id }) => ({
              value: id,
              label: techpack_number,
            }))}
            value={filterData.technical_package_id}
            onChange={(val) => handleFilterChange("technical_package_id", val)}
          />
        </Grid>
      </Grid>
      <hr />

      {/* Items Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : receivableItems.length === 0 ? (
        <Typography color="textSecondary" align="center" mt={4}>
          No receivable items found.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>
                  <strong>BUYER</strong>
                </TableCell>
                <TableCell>
                  <strong>TECHPACK/STYLE</strong>
                </TableCell>
                <TableCell>
                  <strong>G. COLOR</strong>
                </TableCell>
                <TableCell>
                  <strong>SIZE RANGE</strong>
                </TableCell>
                <TableCell>
                  <strong>ITEM TYPE</strong>
                </TableCell>
                <TableCell>
                  <strong>ITEM</strong>
                </TableCell>
                <TableCell>
                  <strong>COLOR/PANTON/CODE</strong>
                </TableCell>
                <TableCell>
                  <strong>SIZE/WIDTH/DIMENSION</strong>
                </TableCell>
                <TableCell>
                  <strong>QTY BOOKED</strong>
                </TableCell>
                <TableCell>
                  <strong>QTY RECEIVED</strong>
                </TableCell>
                <TableCell>
                  <strong>QTY LEFT</strong>
                </TableCell>
                <TableCell>
                  <strong>ACTION</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {receivableItems.map((item) => {
                const isExpanded = expandedRow === item.id;
                return (
                  <React.Fragment key={item.id}>
                    <TableRow hover>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() =>
                            setExpandedRow(isExpanded ? null : item.id)
                          }
                        >
                          {isExpanded ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        {item.workorder?.techpack?.buyer?.name}
                      </TableCell>

                      <TableCell>
                        {item.workorder?.techpack?.techpack_number}
                      </TableCell>
                      <TableCell>{item.garment_color}</TableCell>
                      <TableCell>{item.size_range}</TableCell>
                      <TableCell>{item.item?.item_type?.title}</TableCell>
                      <TableCell>{item.item?.title}</TableCell>
                      <TableCell>{item.item_color}</TableCell>
                      <TableCell>{item.item_size}</TableCell>
                      <TableCell>
                        {item.booking_qty} / {item.booking?.unit}
                      </TableCell>
                      <TableCell>{item.allready_received_qty || "0"}</TableCell>
                      <TableCell>
                        {item.booking_qty - item.allready_received_qty}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleReceiveClick(item)}
                        >
                          Receive
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={14} sx={{ p: 0 }}>
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <Box p={2} bgcolor="grey.50">
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="caption">WO</Typography>
                                <Typography>
                                  {item.workorder?.wo_number}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="caption">
                                  BOOKING NO.
                                </Typography>
                                <Typography>
                                  {item.booking?.booking_number}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="caption">
                                  Booked By
                                </Typography>
                                <Typography>
                                  {item.booking?.user?.full_name}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="caption">
                                  Item Type
                                </Typography>
                                <Typography>
                                  {item.item?.item_type?.title}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="caption">
                                  Item Name
                                </Typography>
                                <Typography>{item.item?.title}</Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="caption">
                                  Description
                                </Typography>
                                <Typography>{item.item_description}</Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="caption">
                                  Position
                                </Typography>
                                <Typography>{item.position}</Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="caption">Size</Typography>
                                <Typography>{item.item_size}</Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="caption">Color</Typography>
                                <Typography>{item.item_color}</Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="caption">Brand</Typography>
                                <Typography>{item.item_brand}</Typography>
                              </Grid>
                            </Grid>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body2" color="textSecondary">
                              Warehouse: {item.warehouse_location || "N/A"} |
                              Batch No: {item.batch_no || "N/A"} | Unit:{" "}
                              {item.booking?.unit}
                            </Typography>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Drawer Form */}
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
    </Box>
  );
}
