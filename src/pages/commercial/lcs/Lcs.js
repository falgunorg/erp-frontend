import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "../../../services/api";
import Spinner from "../../../elements/Spinner";
import swal from "sweetalert";
import moment from "moment";
import Logo from "../../../assets/images/logos/logo-short.png";
import CustomSelect from "elements/CustomSelect";

export default function Lcs(props) {
  const [spinner, setSpinner] = useState(false);
  const history = useHistory();

  const [searchValue, setSearchValue] = useState("");
  const [filterData, setFilterData] = useState({
    from_date: "",
    to_date: "",
    supplier_id: "",
    status: "",
    num_of_row: 20,
    contract_id: "",
    commodity: "",
  });

  const [lcs, setLcs] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const isMounted = useRef(true);

  // const filterChange = (event) => {
  //   setFilterData({ ...filterData, [event.target.name]: event.target.value });
  // };

  // ✅ Updated filterChange function
  const filterChange = (nameOrEvent, value) => {
    if (typeof nameOrEvent === "string") {
      // Called manually, e.g., filterChange("supplier_id", opt?.value)
      setFilterData((prev) => ({ ...prev, [nameOrEvent]: value }));
    } else {
      // Called from onChange event, e.g., normal <input> or <select>
      const { name, value } = nameOrEvent.target;
      setFilterData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const clearFields = () => {
    setFilterData({
      from_date: "",
      to_date: "",
      supplier_id: "",
      status: "",
      num_of_row: 20,
      contract_id: "",
      commodity: "",
    });
    setSearchValue("");
    setCurrentPage(1);
    getLcs(1, "");
  };

  const getSuppliers = async () => {
    try {
      setSpinner(true);
      const response = await api.post("/admin/suppliers");
      if (response.status === 200 && response.data)
        setSuppliers(response.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      if (isMounted.current) setSpinner(false);
    }
  };

  const getContracts = async () => {
    setSpinner(true);
    try {
      const res = await api.post("/merchandising/purchase-contracts");
      if (res.status === 200 && res.data) setContracts(res.data.data || []);
    } catch (err) {
      console.error("getContracts:", err);
    } finally {
      setSpinner(false);
    }
  };

  const getLcs = async (page = 1, search = searchValue) => {
    try {
      setSpinner(true);
      const payload = {
        from_date: filterData.from_date,
        to_date: filterData.to_date,
        supplier_id: filterData.supplier_id,
        num_of_row: filterData.num_of_row,
        status: filterData.status,
        contract_id: filterData.contract_id,
        commodity: filterData.commodity,
        search,
        page,
      };

      const response = await api.post("/commercial/lcs", payload);
      if (response.status === 200 && response.data) {
        setLcs(response.data.data || []);
        // optional if backend returns total pages
        if (response.data.total_pages) setTotalPages(response.data.total_pages);
        setCurrentPage(page);
      } else {
        console.error(response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (isMounted.current) setSpinner(false);
    }
  };

  useEffect(() => {
    getSuppliers();
    getContracts();
    getLcs();
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    getLcs();
  }, [filterData]);

  useEffect(() => {
    const delay = setTimeout(() => {
      getLcs(1, searchValue);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchValue]);

  

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    getLcs(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(async () => {
    props.setHeaderData({
      pageName: "BBLC",
      isNewButton: true,
      newButtonLink: "",
      newButtonText: "New BB",
      isInnerSearch: true,
      innerSearchValue: "",
    });
  }, []);

  return (
    <div className="create_edit_page create_technical_pack">
      {spinner && <Spinner />}
      <div className="employee_lists">
        <div className="datrange_filter create_tp_body">
          <div className="row align-items-end">
            <div className="col">
              <div className="form-group">
                <label>Search</label>
                <input
                  type="search"
                  onChange={(e) => setSearchValue(e.target.value)}
                  value={searchValue}
                  className="form-control margin_bottom_0"
                  placeholder="Search By BBLC NO"
                />
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label>From Date</label>
                <input
                  value={filterData.from_date}
                  onChange={filterChange}
                  name="from_date"
                  className="form-control margin_bottom_0"
                  type="date"
                />
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label>To Date</label>
                <input
                  onChange={filterChange}
                  value={filterData.to_date}
                  name="to_date"
                  className="form-control margin_bottom_0"
                  type="date"
                />
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label>Contract</label>
                <CustomSelect
                  placeholder="Select or Search"
                  onChange={(opt) =>
                    filterChange("contract_id", opt?.value || "")
                  }
                  value={
                    contracts.find((c) => c.id === filterData.contract_id)
                      ? {
                          value: filterData.contract_id,
                          label:
                            contracts.find(
                              (c) => c.id === filterData.contract_id
                            ).title || "",
                        }
                      : null
                  }
                  name="contract_id"
                  options={contracts.map((c) => ({
                    value: c.id,
                    label: c.title,
                  }))}
                />
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label>Supplier</label>
                <CustomSelect
                  placeholder="Select or Search"
                  onChange={(opt) =>
                    filterChange("supplier_id", opt?.value || "")
                  }
                  value={
                    suppliers.find((s) => s.id === filterData.supplier_id)
                      ? {
                          value: filterData.supplier_id,
                          label:
                            suppliers.find(
                              (s) => s.id === filterData.supplier_id
                            ).company_name || "",
                        }
                      : null
                  }
                  name="supplier_id"
                  options={suppliers.map((s) => ({
                    value: s.id,
                    label: s.company_name,
                  }))}
                />
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label>Commodity</label>
                <select
                  onChange={filterChange}
                  value={filterData.commodity}
                  name="commodity"
                  className="form-select margin_bottom_0"
                >
                  <option value="">Select Commodity</option>
                  <option value="Fabric">Fabric</option>
                  <option value="Sewing Trims">Sewing Trims</option>
                  <option value="Finishing Trims">Finishing Trims</option>
                  <option value="Packing Trims">Packing Trims</option>
                </select>
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label>Status</label>
                <select
                  onChange={filterChange}
                  name="status"
                  value={filterData.status}
                  className="form-select margin_bottom_0"
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Material In housed">Material In housed</option>
                  <option value="Pending Payment">Pending Payment</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label>NUM Of Rows</label>
                <select
                  onChange={filterChange}
                  value={filterData.num_of_row}
                  name="num_of_row"
                  className="form-select margin_bottom_0"
                >
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={75}>75</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <button
                  className="btn btn-warning btn-sm me-4"
                  onClick={clearFields}
                >
                  <i className="fas fa-retweet"></i>
                </button>
                <Link
                  to="/commercial/lcs-create"
                  className="btn btn-sm btn-primary"
                >
                  Create New
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>SL</th>
                <th>LC No</th>
                <th>PC</th>
                <th>Apply Date</th>
                <th>Issued Date</th>
                <th>Supplier</th>
                <th>Draft AT</th>
                <th>PI'S</th>

                <th>Net Weight(KG)</th>
                <th>Gross Weight(KG)</th>
                <th className="text-end">Freight Charge(USD)</th>
                <th className="text-end">Total Value(USD)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lcs.map((item, index) => (
                <tr key={item.id || index}>
                  <td>{index + 1}</td>
                  <td>
                    <Link to={"/commercial/lcs-show/" + item.id}>
                      {item.lc_number}
                    </Link>{" "}
                  </td>
                  <td>
                    <Link
                      to={"/commercial/contracts/details/" + item.contract?.id}
                    >
                      {item.contract?.title}
                    </Link>
                  </td>
                  <td>
                    {item.apply_date
                      ? moment(item.apply_date).format("ll")
                      : "N/A"}
                  </td>
                  <td>
                    {item.issued_date
                      ? moment(item.issued_date).format("ll")
                      : "N/A"}
                  </td>
                  <td>{item.supplier?.company_name}</td>
                  <td>{item.draft_at}</td>
                  <td>
                    <ol>
                      {item.piList?.map((item2, index2) => (
                        <li key={index2}>
                          <Link
                            to={"/merchandising/proformas-details/" + item2.id}
                          >
                            {item2.title}
                          </Link>
                        </li>
                      ))}
                    </ol>
                  </td>

                  <td>{item.net_weight} KG</td>
                  <td>{item.gross_weight} KG</td>
                  <td className="text-end">{item.freight_charge} USD</td>
                  <td className="text-end">{item.total} USD</td>
                  <td>
                    <Link to={"/commercial/lcs-edit/" + item.id}>
                      <i className="fa fa-pen"></i>
                    </Link>
                    <Link
                      style={{ marginLeft: "10px" }}
                      to={"/commercial/lcs-show/" + item.id}
                    >
                      <i className="fa fa-eye text-success"></i>
                    </Link>
                  </td>
                </tr>
              ))}
              {lcs.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <div>
            <nav>
              <ul className="pagination mb-0">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const page = i + 1;
                  return (
                    <li
                      key={page}
                      className={`page-item ${
                        currentPage === page ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    </li>
                  );
                })}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
