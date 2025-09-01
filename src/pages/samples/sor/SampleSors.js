import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "../../../services/api";
import Spinner from "../../../elements/Spinner";
import moment from "moment/moment";
import { Modal, Button } from "react-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown";
import swal from "sweetalert";

export default function SampleSors(props) {
  const history = useHistory();

  const [spinner, setSpinner] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [selectedFiles, setSelectedFiles] = useState([]);
  const handleFileSelection = (event) => {
    const files = event.target.files;
    setSelectedFiles([...selectedFiles, ...files]);
  };
  const handleFileDelete = (index) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
  };

  const [statusModal, setStatusModal] = useState(false);
  const [statusForm, setStatusForm] = useState({
    id: 0,
    status: "",
    remarks: "",
  });

  const statusChange = (event) => {
    setStatusForm({ ...statusForm, [event.target.name]: event.target.value });
  };

  const [sor, setSor] = useState({});
  const openStatusModal = async (id) => {
    setSpinner(true);
    var response = await api.post("/sors-show", { id: id });
    if (response.status === 200 && response.data) {
      setSor(response.data.data);
      setStatusForm(response.data.data);
      setStatusModal(true);
    }
    setSpinner(false);
  };
  const closeStatusModal = () => {
    setStatusModal(false);
  };

  const submitStatus = async () => {
    setSpinner(true);
    var data = new FormData();
    data.append("id", statusForm.id);
    data.append("status", statusForm.status);
    data.append("remarks", statusForm.remarks);
    for (let i = 0; i < selectedFiles.length; i++) {
      data.append("attatchments[]", selectedFiles[i]);
    }
    var response = await api.post("/sors-togglestatus", data);
    if (response.status === 200 && response.data) {
      setStatusForm({
        id: 0,
        status: "",
        remarks: "",
      });
      getSors();
      setStatusModal(false);
    }
    setSpinner(false);
  };

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
    getSors();
    setDropdownOpen(false);
  };

  // get all sors

  const [sors, setSors] = useState([]);
  const getSors = async () => {
    setSpinner(true);
    var response = await api.post("/sample/sors", {
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      status: filterData.status,
      num_of_row: filterData.num_of_row,
      filter_items: selectedItems,
      buyer_id: filterData.buyer_id,
    });
    if (response.status === 200 && response.data) {
      setSors(response.data.data);
      setOptions(response.data.allData);
    } else {
      console.log(response.data);
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
    getSors();
    getBuyers();
  }, []);
  useEffect(async () => {
    getSors();
  }, [filterData]);

  useEffect(async () => {
    props.setSection("sample");
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      if (props.userData?.department_title !== "Sample") {
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
        <div className="page_name">Sample Order Requests</div>
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
                  <option value="Confirmed">Confirmed</option>
                  <option value="Received With Material">
                    Received With Material
                  </option>
                  <option value="Not Received">Not Received</option>
                  <option value="Making Pattern">Making Pattern</option>
                  <option value="On Cutting">On Cutting</option>
                  <option value="On Sewing">On Sewing</option>
                  <option value="Testing">Testing</option>
                  <option value="Others">Others</option>
                  <option value="On Finishing">On Finishing</option>
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
                        {option.sor_number}
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
                  <Link
                    to="#"
                    className="btn btn-warning"
                    onClick={clearFields}
                  >
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
                <th>SOR Number</th>
                <th>Status</th>
                <th>Action By</th>
                <th>Action Date</th>
                <th>Buyer</th>
                <th>Techpack/Style</th>
                <th>Season</th>
                <th>Sample Type</th>
                <th>Qty</th>
                <th>Sizes</th>
                <th>Colors</th>
                <th>Issued By</th>
                <th>Issued Date</th>
                <th>Delivery Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchValue ? (
                <>
                  {sors
                    .filter((item) => {
                      if (!searchValue) return false;
                      const lowerCaseSearchValue = searchValue.toLowerCase();
                      return (
                        item.buyer
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.techpack
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.sor_number
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.sample_type_name
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.status
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.season
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.issued_date
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.delivery_date
                          .toLowerCase()
                          .includes(lowerCaseSearchValue)
                      );
                    })
                    .map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.sor_number}</td>
                        <td>{item.status}</td>
                        <td>{item.action_by_name}</td>
                        <td>{moment(item.updated_at).format("ll")}</td>
                        <td>{item.buyer}</td>
                        <td>{item.techpack}</td>
                        <td>{item.season}</td>
                        <td>{item.sample_type_name}</td>
                        <td>{item.qty}</td>
                        <td>
                          {item.sizeList &&
                            item.sizeList.map((item2) => (
                              <span
                                style={{ paddingRight: "5px" }}
                                key={item2.id}
                              >
                                {item2.title}
                                {","}
                              </span>
                            ))}
                        </td>
                        <td>
                          {item.colorList &&
                            item.colorList.map((item2) => (
                              <span
                                style={{ paddingRight: "5px" }}
                                key={item2.id}
                              >
                                {item2.title}
                                {","}
                              </span>
                            ))}
                        </td>
                        <td>{item.user}</td>
                        <td>{moment(item.issued_date).format("ll")}</td>
                        <td>{moment(item.delivery_date).format("ll")}</td>
                        <td>
                          <Link to={"/sample/sor-details/" + item.id}>
                            <i className="fa fa-eye mr-10 text-success"></i>
                          </Link>
                          <Link to="#" onClick={() => openStatusModal(item.id)}>
                            <i className="fa fa-cog mr-10 text-info"></i>
                          </Link>
                        </td>
                      </tr>
                    ))}
                </>
              ) : (
                <>
                  {sors.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.sor_number}</td>
                      <td>{item.status}</td>
                      <td>{item.action_by_name}</td>
                      <td>{moment(item.updated_at).format("ll")}</td>
                      <td>{item.buyer}</td>

                      <td>{item.techpack}</td>
                      <td>{item.season}</td>
                      <td>{item.sample_type_name}</td>
                      <td>{item.qty}</td>
                      <td>
                        {item.sizeList &&
                          item.sizeList.map((item2) => (
                            <span
                              style={{ paddingRight: "5px" }}
                              key={item2.id}
                            >
                              {item2.title}
                              {","}
                            </span>
                          ))}
                      </td>
                      <td>
                        {item.colorList &&
                          item.colorList.map((item2) => (
                            <span
                              style={{ paddingRight: "5px" }}
                              key={item2.id}
                            >
                              {item2.title}
                              {","}
                            </span>
                          ))}
                      </td>
                      <td>{item.user}</td>
                      <td>{moment(item.issued_date).format("ll")}</td>
                      <td>{moment(item.delivery_date).format("ll")}</td>
                      <td>
                        <Link to={"/sample/sor-details/" + item.id}>
                          <i className="fa fa-eye mr-10 text-success"></i>
                        </Link>
                        <Link to="#" onClick={() => openStatusModal(item.id)}>
                          <i className="fa fa-cog mr-10 text-info"></i>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={statusModal} onHide={closeStatusModal}>
        <Modal.Header closeButton>
          <Modal.Title>Change Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Status</label>
            <select
              onChange={statusChange}
              value={statusForm.status}
              name="status"
              className="form-select"
            >
              {sor.status === "Confirmed" && (
                <>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Received With Material">
                    Received With Material
                  </option>
                  <option value="Not Received">Not Received</option>
                  <option value="Others">Others</option>
                </>
              )}

              {sor.status === "Not Received" && (
                <>
                  <option value="Not Received">Not Received</option>
                  <option value="Received With Material">
                    Received With Material
                  </option>
                  <option value="Others">Others</option>
                </>
              )}

              {sor.status === "Received With Material" && (
                <>
                  <option value="Received With Material">
                    Received With Material
                  </option>
                  <option value="Making Pattern">Making Pattern</option>
                  <option value="Others">Others</option>
                </>
              )}

              {sor.status === "Making Pattern" && (
                <>
                  <option value="Making Pattern">Making Pattern</option>
                  <option value="On Cutting">On Cutting</option>
                  <option value="Others">Others</option>
                </>
              )}
              {sor.status === "On Cutting" && (
                <>
                  <option value="On Cutting">On Cutting</option>
                  <option value="On Sewing">On Sewing</option>
                  <option value="Others">Others</option>
                </>
              )}

              {sor.status === "On Sewing" && (
                <>
                  <option value="On Sewing">On Sewing</option>
                  <option value="Testing">Testing</option>
                  <option value="Others">Others</option>
                </>
              )}

              {sor.status === "Testing" && (
                <>
                  <option value="Testing">Testing</option>
                  <option value="On Finishing">On Finishing</option>
                  <option value="Others">Others</option>
                </>
              )}

              {sor.status === "On Finishing" && (
                <>
                  <option value="On Finishing">On Finishing</option>
                  <option value="Completed">Completed</option>
                  <option value="Others">Others</option>
                </>
              )}
              {sor.status === "Completed" && (
                <>
                  <option value="Completed">Completed</option>
                </>
              )}

              {sor.status === "Others" && (
                <>
                  <option value="Others">Others</option>
                  <option value="Received With Material">
                    Received With Material
                  </option>
                  <option value="Not Received">Not Received</option>
                  <option value="Making Pattern">Making Pattern</option>
                  <option value="On Cutting">On Cutting</option>
                  <option value="On Sewing">On Sewing</option>
                  <option value="Testing">Testing</option>
                  <option value="On Finishing">On Finishing</option>
                  <option value="Completed">Completed</option>
                </>
              )}
            </select>
          </div>
          <div className="form-group">
            <label>Remarks</label>
            <textarea
              onChange={statusChange}
              value={statusForm.remarks}
              name="remarks"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="attachments">Current Status Images:</label>
            <small className="text-muted"> (JPEG,PNG)</small>
            <div className="d-flex mb-10">
              <input
                type="file"
                className="form-control"
                multiple
                onChange={handleFileSelection}
                id="input_files"
              />
              <div className="d-flex margin_left_30">
                <label
                  for="input_files"
                  className="btn btn-warning bg-falgun rounded-circle btn-xs"
                >
                  <i className="fal fa-plus"></i>
                </label>
              </div>
            </div>

            {selectedFiles.map((file, index) => (
              <div key={file.name} className="d-flex mb-10">
                <input className="form-control" disabled value={file.name} />
                <div className="d-flex">
                  <Link
                    to="#"
                    onClick={() => handleFileDelete(index)}
                    className="btn btn-danger rounded-circle margin_left_15 btn-xs"
                  >
                    <i className="fa fa-times"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="default" onClick={closeStatusModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submitStatus}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      <br />
      <br />
    </div>
  );
}
