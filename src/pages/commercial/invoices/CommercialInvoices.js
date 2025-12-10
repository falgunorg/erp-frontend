import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "services/api";
import CustomSelect from "elements/CustomSelect";
import Pagination from "elements/Pagination";

const PAGE_SIZE = 10;

const CommercialInvoices = (props) => {
  const [invoices, setInvoices] = useState([]);
  const [page, setPage] = useState(1);

  const [contracts, setContracts] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [banks, setBanks] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [b, c, bk, con] = await Promise.all([
          api.post("/common/buyers"),
          api.post("/common/companies", { type: "own" }),
          api.get("/common/banks"),
          api.post("/commercial/contracts"),
        ]);
        setBuyers(b.data?.data || []);
        setCompanies(c.data?.data || []);
        setBanks(bk.data || []);
        setContracts(con.data.data || []);
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };
    fetchOptions();
  }, []);

  const shippingModes = ["Sea", "Air", "Land", "River", "Sea/Air"];

  const [form, setForm] = useState({
    search: "",
    contract_id: "",
    buyer_id: "",
    company_id: "",
    bank_id: "",
    from_date: "",
    to_date: "",
    mode_of_shipment: "",
  });

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const renderSelect = (name, label, options) => (
    <div className="col create_tp_body">
      <label className="form-label">{label}</label>

      <CustomSelect
        isMulti={false}
        options={options}
        className="select_wo"
        placeholder={`Select ${label}`}
        value={
          options.find((opt) => String(opt.value) === String(form[name])) ||
          null
        }
        onChange={(selected) =>
          handleChange(name, selected ? String(selected.value) : "")
        }
      />
    </div>
  );

  const renderInput = (name, label, type = "text") => (
    <div className="col create_tp_body">
      <label className="form-label">{label}</label>

      <input
        type={type}
        className="form-control"
        name={name}
        value={form[name] ?? ""}
        onChange={(e) => handleChange(name, e.target.value)}
      />
    </div>
  );

  const [currentPage, setCurrentPage] = useState(1);

  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [total, setTotal] = useState(0);
  const [links, setLinks] = useState([]);
  const fetchData = async () => {
    try {
      const res = await api.get(
        "/commercial/commercial-invoices?page=" + currentPage,
        form
      );
      const data = await res.data.data;
      setInvoices(Array.isArray(data) ? data.reverse() : []);

      setLinks(res.data.links);
      setFrom(res.data.from);
      setTo(res.data.to);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
      alert("Failed to load invoices");
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, form]);

  console.log("INCOICES", invoices);

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

  const handleBulkFileUpload = async (e) => {
    const file = e.target.files[0]; // only one file

    if (!file) {
      alert("No file selected!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // single file only

    try {
      const res = await api.post("/commercial/invoices/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        console.log("Uploaded File:", res.data.file);
        alert("File Imported Successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("File Upload Failed!");
    }
  };

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
    <div className="create_technical_pack">
      <div className="d-flex justify-content-end gap-2 ">
        <label htmlFor="singleFile" className="btn btn-sm btn-success me-2">
          + IMPORT EXCEL
        </label>

        <input
          onChange={handleBulkFileUpload}
          hidden
          id="singleFile"
          type="file"
          name="file"
          accept=".xlsx,.xls" // optional but recommended
        />
        <Link to="/commercial/invoices-create" className="btn btn-primary">
          + New Invoice
        </Link>
      </div>
      <hr />
      <div className="row">
        {renderInput("search", "Search")}
        {renderSelect(
          "contract_id",
          "Contract",
          contracts.map((c) => ({ value: c.id, label: c.title }))
        )}
        {renderSelect(
          "buyer_id",
          "Buyer",
          buyers.map((c) => ({ value: c.id, label: c.name }))
        )}
        {renderSelect(
          "company_id",
          "Company",
          companies.map((c) => ({ value: c.id, label: c.title }))
        )}
        {renderSelect(
          "bank_id",
          "Bank",
          banks.map((c) => ({ value: c.id, label: c.title }))
        )}
        {renderInput("from_date", "From Date", "date")}
        {renderInput("to_date", "To Date", "date")}
        {renderSelect(
          "mode_of_shipment",
          "Shipping Mode",
          shippingModes.map((c) => ({ value: c, label: c }))
        )}
      </div>
      <br />

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Invoice No</th>
              <th>Contract</th>
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
            {invoices.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center text-muted py-4">
                  No invoices found
                </td>
              </tr>
            ) : (
              invoices.map((inv, idx) => (
                <tr key={inv.id}>
                  <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>

                  {/* Invoice Number */}
                  <td>
                    <Link to={`/commercial/invoices-show/${inv.id}`}>
                      {inv.invoice_no}
                    </Link>
                  </td>

                  {/* Contract Title */}
                  <td>
                    {inv.contract ? (
                      <Link
                        to={`/commercial/contracts/details/${inv.contract.id}`}
                      >
                        {inv.contract.title}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* Invoice Date */}
                  <td>
                    {inv.inv_date
                      ? new Date(inv.inv_date).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* Quantity */}
                  <td>{inv.pcs_qty ? `${inv.pcs_qty} PCS` : "-"}</td>

                  {/* Export Value */}
                  <td>$ {inv.exp_value ?? "-"}</td>

                  {/* Buyer */}
                  <td>{inv.contract?.buyer?.name ?? "-"}</td>

                  {/* Destination */}
                  <td>{inv.destination_country ?? "-"}</td>

                  {/* Company */}
                  <td>{inv.contract?.company?.title ?? "-"}</td>

                  {/* Actions */}
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
      <h6 className="text-center">
        Showing {from} To {to} From {total}
      </h6>

      <Pagination
        links={links}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
};

export default CommercialInvoices;
