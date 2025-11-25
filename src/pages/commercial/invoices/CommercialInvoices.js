import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "services/api";

const PAGE_SIZE = 10;

const CommercialInvoices = (props) => {
  const [invoices, setInvoices] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    try {
      const res = await api.get("/commercial/commercial-invoices");
      const data = await res.data;
      setInvoices(Array.isArray(data) ? data.reverse() : []);
    } catch (err) {
      console.error(err);
      alert("Failed to load invoices");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteInvoice = async (id) => {
    if (!window.confirm("Delete this invoice?")) return;
    try {
      await api.delete(`/commercial/commercial-invoices/${id}`, {
        method: "DELETE",
      });
      fetchData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // client-side search
  const filtered = invoices.filter((inv) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      (inv.invoice_no || "").toString().toLowerCase().includes(q) ||
      (inv.contract_id || "").toString().toLowerCase().includes(q) ||
      (inv.buyer_id || "").toString().toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  useEffect(() => {
    props.setHeaderData({
      pageName: "INVOICES",
      isNewButton: true,
      newButtonLink: "",
      newButtonText: "NEW INVOICE",
      isInnerSearch: true,
      innerSearchValue: "",
    });
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-end gap-2">
        <Link to="/commercial/invoices-create" className="btn btn-primary">
          + New Invoice
        </Link>
      </div>

      <div className="card p-3 mb-3">
        <div className="row g-2">
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Search by invoice no, contract id or buyer id..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="col-md-6 text-end">
            <small className="text-muted">
              Total: {filtered.length} result(s)
            </small>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Invoice No</th>
              <th>Contract ID</th>
              <th>Invoice Date</th>
              <th>Qty</th>
              <th>Export Value</th>
              <th>Buyer</th>
              <th>Destination</th>
              <th>Company</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shown.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center text-muted py-4">
                  No invoices found
                </td>
              </tr>
            ) : (
              shown.map((inv, idx) => (
                <tr key={inv.id}>
                  <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                  <td>
                    <Link to={`/commercial/invoices-show/${inv.id}`}>
                      {inv.invoice_no}
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`/commercial/contracts/details/${inv.contract?.id}`}
                    >
                      {inv.contract?.title}
                    </Link>
                  </td>
                  <td>{inv.inv_date}</td>
                  <td>{inv.qty} PCS</td>
                  <td>$ {inv.exp_value ?? "-"}</td>
                  <td>{inv.buyer?.name}</td>
                  <td>{inv.destination_country}</td>
                  <td>{inv.contract?.company?.title}</td>
                  <td className="text-end">
                    <Link
                      className="btn btn-sm btn-outline-info me-1"
                      to={`/commercial/invoices-show/${inv.id}`}
                    >
                      View
                    </Link>
                    <Link
                      className="btn btn-sm btn-outline-warning me-1"
                      to={`/commercial/invoices-edit/${inv.id}`}
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteInvoice(inv.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          <small className="text-muted">
            Showing {Math.min(filtered.length, (page - 1) * PAGE_SIZE + 1)} -{" "}
            {Math.min(filtered.length, page * PAGE_SIZE)} of {filtered.length}
          </small>
        </div>

        <div>
          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </button>
              </li>

              {Array.from({ length: totalPages }).map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${page === i + 1 ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => setPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}

              <li
                className={`page-item ${page === totalPages ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default CommercialInvoices;
