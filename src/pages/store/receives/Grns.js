import React, { useEffect, useState } from "react";
import api from "services/api";
import {
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
} from "@mui/material";

const Grns = () => {
  const [grns, setGrns] = useState([]);
  const [filters, setFilters] = useState({
    technical_package_id: "",
    buyer_id: "",
    item_type_id: "",
    search: "",
    color: "",
    sort_by: "",
    per_page: 10,
    page: 1,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  });

  const fetchGrns = async () => {
    try {
      const { data } = await api.get("/store/grns", {
        technical_package_id: filters.technical_package_id,
        buyer_id: filters.buyer_id,
        item_type_id: filters.item_type_id,
        search: filters.search,
        color: filters.color,
        sort_by: filters.sort_by,
        per_page: filters.per_page,
        page: filters.page,
      });
      setGrns(data.data);
      setPagination({
        total: data.total,
        per_page: data.per_page,
        current_page: data.current_page,
        last_page: data.last_page,
      });
    } catch (err) {
      console.error("Error fetching GRNs", err);
    }
  };

  useEffect(() => {
    fetchGrns();
  }, [filters]);

  const handleChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1, // reset to first page on filter change
    }));
  };

  return (
    <Box p={3}>
      <Grid container spacing={2} mb={2}>
        {/* Filters */}
        <Grid item xs={12} sm={4}>
          <TextField
            label="Technical Package ID"
            value={filters.technical_package_id}
            onChange={(e) =>
              handleChange("technical_package_id", e.target.value)
            }
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="Buyer ID"
            value={filters.buyer_id}
            onChange={(e) => handleChange("buyer_id", e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="Item Type ID"
            value={filters.item_type_id}
            onChange={(e) => handleChange("item_type_id", e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="Search"
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="Color"
            value={filters.color}
            onChange={(e) => handleChange("color", e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={4}>
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

        <Grid item xs={12} sm={4}>
          <TextField
            label="Per Page"
            type="number"
            value={filters.per_page}
            onChange={(e) => handleChange("per_page", e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() =>
              setFilters({
                technical_package_id: "",
                buyer_id: "",
                item_type_id: "",
                search: "",
                color: "",
                sort_by: "",
                per_page: 10,
                page: 1,
              })
            }
          >
            Clear Filters
          </Button>
        </Grid>
      </Grid>

      {/* Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>GRN Number</TableCell>
            <TableCell>Item</TableCell>
            <TableCell>Color</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Buyer</TableCell>
            <TableCell>Balance Qty</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {grns.length > 0 ? (
            grns.map((grn) => (
              <TableRow key={grn.id}>
                <TableCell>{grn.grn_number}</TableCell>
                <TableCell>{grn.item?.title}</TableCell>
                <TableCell>{grn.item_color}</TableCell>
                <TableCell>{grn.item_size}</TableCell>
                <TableCell>{grn.buyer?.name}</TableCell>
                <TableCell>{grn.balance_qty}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No GRNs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <Box mt={2} display="flex" justifyContent="center">
        <Pagination
          count={pagination.last_page}
          page={pagination.current_page}
          onChange={(e, page) => handleChange("page", page)}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default Grns;
