import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "../../../services/api";
import Spinner from "../../../elements/Spinner";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Button } from "react-bootstrap";
import swal from "sweetalert";
export default function AdminDesigns(props) {
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filterData, setFilterData] = useState({
    from_date: "",
    to_date: "",
    status: "",
    num_of_row: 20,
    buyer_id: "",
  });
  const clearFields = () => {
    setFilterData({
      from_date: "",
      to_date: "",
      status: "",
      num_of_row: 20,
      buyer_id: "",
    });
  };

  const filterChange = (event) => {
    setFilterData({ ...filterData, [event.target.name]: event.target.value });
  };
  const [selectedItems, setSelectedItems] = useState([]);
  const [options, setOptions] = useState([]);

  const handleCheckboxChange = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === options.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(options.map((option) => option.id));
    }
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleDropdownSelect = (eventKey) => {
    setDropdownOpen(false);
  };
  const handleFilterClick = () => {
    getDesigns();
    setDropdownOpen(false);
  };
  // get all sors
  const [designs, setDesigns] = useState([]);
  const getDesigns = async () => {
    setSpinner(true);
    var response = await api.post("/admin/designs", {
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      status: filterData.status,
      num_of_row: filterData.num_of_row,
      filter_items: selectedItems,
      buyer_id: filterData.buyer_id,
    });
    if (response.status === 200 && response.data) {
      setDesigns(response.data.data);
      setOptions(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const approveDesign = async (design_id) => {
    setSpinner(true);
    var response = await api.post("/admin/designs-approve", { id: design_id });
    if (response.status === 200 && response.data) {
      swal({
        icon: "success",
        text: "Design Approved Success.",
      });
      getDesigns();
    }
    setSpinner(false);
  };

  const [buyers, setBuyers] = useState([]);
  const getBuyers = async () => {
    setSpinner(true);
    var response = await api.post("/common/buyers");
    if (response.status === 200 && response.data) {
      setBuyers(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getDesigns();
    getBuyers();
  }, []);
  useEffect(async () => {
    getDesigns();
  }, [filterData]);

  useEffect(async () => {
    props.setSection("development");
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      if (props.userData?.role !== "Admin") {
        await swal({
          icon: "error",
          text: "You Cannot Access This Section.",
          closeOnClickOutside: false,
        });

        history.push("/dashboard");
      }
    };
    checkAccess();
  }, [props, history]);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Articles</div>
        <div className="actions">
          <input
            type="search"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            className="form-control"
            placeholder="Search"
          />
        </div>
      </div>
      <div className="employee_lists">
        <div className="datrange_filter">
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label>From Date</label>
                <input
                  value={filterData.from_date}
                  onChange={filterChange}
                  name="from_date"
                  className="form-control"
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
                  className="form-control"
                  type="date"
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>Status</label>
                <select
                  onChange={filterChange}
                  value={filterData.status}
                  name="status"
                  className="form-select"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Making Sample">Making Sample</option>
                  <option value="Testing">Testing</option>
                  <option value="Finishing">Finishing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>Buyer</label>
                <select
                  onChange={filterChange}
                  value={filterData.buyer_id}
                  name="buyer_id"
                  className="form-select"
                >
                  <option value="">Select Buyer</option>
                  {buyers.length > 0 ? (
                    buyers.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    ))
                  ) : (
                    <option value="">No buyer found</option>
                  )}
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
                  className="form-select"
                >
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="75">75</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label></label>
                <NavDropdown
                  title="Filter by SOR No"
                  id="stores"
                  show={dropdownOpen}
                  onToggle={(isOpen) => setDropdownOpen(isOpen)}
                >
                  <div
                    style={{ paddingLeft: 10, paddingRight: 10 }}
                    className="dropdown-checkbox-list"
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.length === options.length}
                      onChange={handleSelectAll}
                    />{" "}
                    Select All
                    {options.map((option) => (
                      <div style={{ paddingLeft: 10 }} key={option.id}>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(option.id)}
                          onChange={() => handleCheckboxChange(option.id)}
                        />{" "}
                        <small>{option.design_number}</small>
                      </div>
                    ))}
                    <br />
                    <div className="d-flex justify-content-between">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={handleDropdownSelect}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleFilterClick}
                      >
                        Filter
                      </Button>
                    </div>
                  </div>
                </NavDropdown>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>Refresh</label>
                <div>
                  <Link to="#" className="btn btn-warning" onClick={clearFields}>
                    <i className="fas fa-retweet"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table text-start align-middle table-bordered table-hover mb-0">
            <thead className="bg-dark text-white">
              <tr>
                <th>#</th>
                <th>Article Number</th>
                <th>Status</th>
                <th>Title</th>
                <th>Type</th>
                <th>Buyers</th>
                <th>Cost Per Unit (Approx)</th>
                <th>Issued By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchValue ? (
                <>
                  {designs
                    .filter((item) => {
                      if (!searchValue) return false;
                      const lowerCaseSearchValue = searchValue.toLowerCase();
                      return (
                        item.title
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.design_number
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.design_type
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.status.toLowerCase().includes(lowerCaseSearchValue)
                      );
                    })
                    .map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.design_number}</td>
                        <td>{item.status}</td>
                        <td>{item.title}</td>
                        <td>{item.design_type}</td>

                        <td>
                          {item.buyersLists &&
                            item.buyersLists.map((item2) => (
                              <span
                                style={{ paddingRight: "5px" }}
                                key={item2.id}
                              >
                                {item2.name}
                                {","}
                              </span>
                            ))}
                        </td>
                        <td>{item.total}</td>
                        <td>{item.user_name}</td>

                        <td>
                          <>
                            {item.status === "Pending" && (
                              <button
                                className="btn btn-primary btn-sm mr-10"
                                onClick={() => approveDesign(item.id)}
                              >
                                Approve
                              </button>
                            )}

                            <Link
                              className="btn btn-success btn-sm"
                              to={"/admin/designs-details/" + item.id}
                            >
                              Details
                            </Link>
                          </>
                        </td>
                      </tr>
                    ))}
                </>
              ) : (
                <>
                  {designs.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.design_number}</td>
                      <td>{item.status}</td>
                      <td>{item.title}</td>
                      <td>{item.design_type}</td>
                      <td>
                        {item.buyersLists &&
                          item.buyersLists.map((item2) => (
                            <span
                              style={{ paddingRight: "5px" }}
                              key={item2.id}
                            >
                              {item2.name}
                              {","}
                            </span>
                          ))}
                      </td>
                      <td>{item.total}</td>
                      <td>{item.user_name}</td>
                      <td>
                        <>
                          {item.status === "Pending" && (
                            <button
                              className="btn btn-primary btn-sm mr-10"
                              onClick={() => approveDesign(item.id)}
                            >
                              Approve
                            </button>
                          )}
                          <Link
                            className="btn btn-success btn-sm"
                            to={"/admin/designs-details/" + item.id}
                          >
                            Details
                          </Link>
                        </>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
