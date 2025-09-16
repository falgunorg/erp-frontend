import React, { useEffect, useState } from "react";
import api from "services/api";
import {
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
        api.post("/admin/suppliers"),
        api.post("/common/item-types"),
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
  const fetchIssues = async (overridePage) => {
    setLoading(true);
    try {
      const page = Number(overridePage ?? filters.page) || 1;
      const per_page = Number(filters.per_page) || 10;
      const { data } = await api.get("/store/issues", {
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
      });

      // normalize response
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
    // call fetchIssues using the current filters state
    fetchIssues();
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
      pageName: "ISSUE",
      isNewButton: false,
      newButtonLink: "",
      isInnerSearch: false,
      innerSearchValue: "",
      isDropdown: false,
      DropdownMenu: [],
    });
  }, []);
  return (
    <Box p={3}>
      {/* Filters */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={6} sm={1.2}>
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
              <MenuItem value="stock-asc">Stock ASC</MenuItem>
              <MenuItem value="stock-desc">Stock DESC</MenuItem>
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

        <Grid item xs={6} sm={1.2}>
          <Button variant="contained" color="secondary" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Grid>
      </Grid>

      <Divider />

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
    </Box>
  );
};

export default Issues;
