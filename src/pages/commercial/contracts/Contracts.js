import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import Logo from "../../../assets/images/logos/logo-short.png";

export default function Contracts() {
  const history = useHistory();

  const [contracts, setContracts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    buyer: "",
    year: "",
  });

  useEffect(() => {
    // 🔹 Demo dataset until backend ready
    const demoData = [
      {
        id: 1,
        contract_no: "BASSPRO-MBL-FALL-25",
        date: "2025-01-19",
        buyer: "BASS PRO INC.",
        port_of_loading: "Chittagong, Bangladesh",
        port_of_discharge: "Seattle Tacoma",
        amount: "$941,762.40",
      },
      {
        id: 2,
        contract_no: "FALCON-MBL-SPRING-25",
        date: "2025-03-10",
        buyer: "Falcon Garments Ltd.",
        port_of_loading: "Chittagong, Bangladesh",
        port_of_discharge: "New York, USA",
        amount: "$522,400.00",
      },
      {
        id: 3,
        contract_no: "TARGET-MBL-SUMMER-25",
        date: "2025-05-05",
        buyer: "Target Corporation",
        port_of_loading: "Chittagong, Bangladesh",
        port_of_discharge: "Los Angeles, USA",
        amount: "$780,125.00",
      },
    ];

    setContracts(demoData);
    setFiltered(demoData);
  }, []);

  const handleFilterChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = () => {
    let result = contracts;

    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.contract_no.toLowerCase().includes(s) ||
          c.buyer.toLowerCase().includes(s)
      );
    }

    if (filters.buyer) {
      result = result.filter((c) => c.buyer === filters.buyer);
    }

    if (filters.year) {
      result = result.filter((c) => c.date.startsWith(filters.year.toString()));
    }

    setFiltered(result);
  };

  const clearFilters = () => {
    setFilters({ search: "", buyer: "", year: "" });
    setFiltered(contracts);
  };

  const viewDetails = (id) => {
    history.push(`/contracts/${id}`);
  };

  const buyers = [...new Set(contracts.map((c) => c.buyer))];
  const years = [...new Set(contracts.map((c) => c.date.split("-")[0]))];

  return (
    <div className="contract-list-page">
      <div className="header d-flex align-items-center mb-3">
        <img src={Logo} alt="Logo" className="me-2" style={{ width: 35 }} />
        <h4 className="m-0">Purchase Contracts</h4>
      </div>

      {/* 🔍 Filter Section */}
      <div className="filter-section card p-3 mb-4">
        <div className="row">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Contract No or Buyer..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={filters.buyer}
              onChange={(e) => handleFilterChange("buyer", e.target.value)}
            >
              <option value="">All Buyers</option>
              {buyers.map((b, i) => (
                <option key={i} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={filters.year}
              onChange={(e) => handleFilterChange("year", e.target.value)}
            >
              <option value="">All Years</option>
              {years.map((y, i) => (
                <option key={i} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <button className="btn btn-primary me-2" onClick={handleSearch}>
              Search
            </button>
            <button className="btn btn-secondary me-2" onClick={clearFilters}>
              Clear
            </button>
            <Link to="/commercial/contracts/create" className="btn btn-success">
              Add New
            </Link>
          </div>
        </div>
      </div>

      {/* 📋 Contracts Table */}
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Contract No</th>
              <th>Date</th>
              <th>Buyer</th>
              <th>Port of Loading</th>
              <th>Port of Discharge</th>
              <th>Total Value</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((c, i) => (
                <tr key={c.id}>
                  <td>{i + 1}</td>
                  <td>
                    <Link to={"/commercial/contracts/details/" + c.id}>
                      {c.contract_no}
                    </Link>
                  </td>
                  <td>{c.date}</td>
                  <td>{c.buyer}</td>
                  <td>{c.port_of_loading}</td>
                  <td>{c.port_of_discharge}</td>
                  <td>{c.amount}</td>
                  <td className="text-center">
                    <Link
                      to={"/commercial/contracts/details/" + c.id}
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      View Details
                    </Link>
                    <Link
                      to={"/commercial/contracts/edit/" + c.id}
                      className="btn btn-sm btn-outline-warning"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-muted">
                  No contracts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
