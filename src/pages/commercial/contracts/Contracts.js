import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import api from "services/api";
import formatMoney from "services/moneyFormatter";
import { Modal, Button } from "react-bootstrap";

export default function Contracts(props) {
  const history = useHistory();

  const [contracts, setContracts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    buyer: "",
    year: "",
  });

  // ✅ Fetch contracts
  const getContracts = async () => {
    try {
      const response = await api.post("/commercial/contracts"); // ✅ use GET
      if (response.data.status === "success") {
        const data = response.data.data || [];
        setContracts(data);
        setFiltered(data); // ✅ show all by default
      } else {
        console.error("Unexpected response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };

  useEffect(() => {
    getContracts();
  }, []);

  // ✅ Handle filter change
  const handleFilterChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
  };

  // ✅ Execute filters
  const handleSearch = () => {
    let result = [...contracts];

    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.contract_no?.toLowerCase().includes(s) ||
          c.buyer?.name?.toLowerCase().includes(s)
      );
    }

    if (filters.buyer) {
      result = result.filter(
        (c) => String(c.buyer_id) === String(filters.buyer)
      );
    }

    if (filters.year) {
      result = result.filter((c) =>
        c.contract_date?.startsWith(filters.year.toString())
      );
    }

    setFiltered(result);
  };

  // ✅ Clear filters
  const clearFilters = () => {
    setFilters({ search: "", buyer: "", year: "" });
    setFiltered(contracts);
  };

  // ✅ Dropdown data
  const buyers = [
    ...new Map(
      contracts.filter((c) => c.buyer).map((c) => [c.buyer.id, c.buyer])
    ).values(),
  ];

  const years = [
    ...new Set(
      contracts
        .filter((c) => c.contract_date)
        .map((c) => c.contract_date.split("-")[0])
    ),
  ];

  //Revised area

  const [reviseModal, setReviseModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState({});

  // revise form data
  const [reviseForm, setReviseForm] = useState({
    qty: "",
    value: "",
    remarks: "",
  });

  const openReviseModal = (contract) => {
    setSelectedContract(contract);

    // preload current values
    setReviseForm({
      qty: contract.qty,
      value: contract.contract_value,
      remarks: contract.remarks ?? "",
    });

    setReviseModal(true);
  };

  const closeReviseModal = () => {
    setSelectedContract({});
    setReviseForm({ qty: "", value: "", remarks: "" });
    setReviseModal(false);
  };

  const handleReviseChange = (name, value) => {
    setReviseForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitRevisedModal = async () => {
    try {
      const response = await api.post(
        `/commercial/contracts/${selectedContract.id}/revision`,
        {
          qty: reviseForm.qty,
          value: reviseForm.value,
          remarks: reviseForm.remarks,
        }
      );

      if (response.status === 201) {
        alert("Revision created successfully!");

        // Optional: update the contract in UI without reload
        selectedContract.qty = reviseForm.qty;
        selectedContract.contract_value = reviseForm.value;

        closeReviseModal();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create revision!");
    }
  };

  // ✅ Set header data
  useEffect(() => {
    props.setHeaderData({
      pageName: "PC'S",
      isNewButton: true,
      newButtonLink: "",
      newButtonText: "New PC",
      isInnerSearch: true,
      innerSearchValue: "",
    });
  }, []);

  return (
    <div className="contract-list-page">
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
              {buyers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
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

      {/* 📋 Table Section */}
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
              <th className="text-end">QTY</th>
              <th className="text-end">Contract Value</th>
              <th className="text-end">PO Value</th>
              <th className="text-end">BBLC Value</th>
              <th className="text-end">EXP Value</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((c, i) => (
                <tr key={c.id}>
                  <td>{i + 1}</td>
                  <td>
                    <Link to={`/commercial/contracts/details/${c.id}`}>
                      {c.title}
                    </Link>
                  </td>
                  <td>{c.contract_date}</td>
                  <td>{c.buyer?.name}</td>
                  <td>{c.port_of_loading}</td>
                  <td>{c.port_of_discharge}</td>
                  <td className="text-end">{c.qty} PCS</td>
                  <td className="text-end">
                    {formatMoney(c.contract_value)} USD
                  </td>
                  <td className="text-end">{formatMoney(c.po_value)} USD</td>
                  <td className="text-end">{formatMoney(c.bblc_value)} USD</td>
                  <td className="text-end">{formatMoney(c.exp_value)} USD</td>
                  <td className="text-center">
                    <Link
                      to={`/commercial/contracts/details/${c.id}`}
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      View
                    </Link>
                    <Link
                      to={`/commercial/contracts/edit/${c.id}`}
                      className="btn btn-sm btn-outline-warning me-2"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => openReviseModal(c)}
                      className="btn btn-sm btn-outline-info"
                    >
                      Revise
                    </button>
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

      <Modal size="md" show={reviseModal} onHide={closeReviseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Revise Contract</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="row">
            <div className="col-6">
              <div className="form-group">
                <label>Current QTY</label>
                <input
                  readOnly
                  value={selectedContract.qty}
                  className="form-control"
                  type="number"
                />
              </div>
            </div>

            <div className="col-6">
              <div className="form-group">
                <label>Revise QTY</label>
                <input
                  className="form-control"
                  type="number"
                  value={reviseForm.qty}
                  onChange={(e) => handleReviseChange("qty", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <div className="form-group">
                <label>Current Value</label>
                <input
                  readOnly
                  value={selectedContract.contract_value}
                  className="form-control"
                  type="number"
                />
              </div>
            </div>

            <div className="col-6">
              <div className="form-group">
                <label>Revise Value</label>
                <input
                  className="form-control"
                  type="number"
                  value={reviseForm.value}
                  onChange={(e) => handleReviseChange("value", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Remarks</label>
            <textarea
              className="form-control"
              value={reviseForm.remarks}
              onChange={(e) => handleReviseChange("remarks", e.target.value)}
            ></textarea>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeReviseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submitRevisedModal}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
