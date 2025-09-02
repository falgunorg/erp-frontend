import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "../../../services/api";
import Spinner from "../../../elements/Spinner";
import moment from "moment/moment";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Modal, Button } from "react-bootstrap";
import swal from "sweetalert";

export default function Sors(props) {
  const userInfo = props.userData;
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);

  const [imageURL, setImageUrl] = useState(null);
  const [imageModal, setImageModal] = useState(false);
  const openImageModal = (url) => {
    setImageUrl(url);
    setImageModal(true);
  };
  const closeImageModal = () => {
    setImageUrl(null);
    setImageModal(false);
  };
  const [searchValue, setSearchValue] = useState("");
  const [filterData, setFilterData] = useState({
    from_date: "",
    to_date: "",
    status: "",
    num_of_row: 20,
    buyer_id: "",
    view: userInfo.designation_title === "Assistant Manager" ? "team" : "self",
  });
  const clearFields = () => {
    setFilterData({
      from_date: "",
      to_date: "",
      status: "",
      num_of_row: 20,
      buyer_id: "",
      view:
        userInfo.designation_title === "Assistant Manager" ? "team" : "self",
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
    var response = await api.post("/merchandising/sors", {
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      status: filterData.status,
      num_of_row: filterData.num_of_row,
      filter_items: selectedItems,
      buyer_id: filterData.buyer_id,
      view: filterData.view,
      department: props.userData.department_title,
      designation: props.userData.designation_title,
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
    props.setSection("merchandising");
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      const allowedDepartments = [
        "Merchandising",
        "Sample",
        "Planing",
        "Management",
        "Commercial",
        "Accounts & Finance",
        "IT",
      ];
      if (!allowedDepartments.includes(props.userData?.department_title)) {
        await swal({
          icon: "error",
          text: "You Cannot Access This Section.",
          closeOnClickOutside: false,
        });
        history.push("/dashboard");
      }
    };
    checkAccess();
  }, [props.userData?.department_title, history]);
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

          {userInfo.department_title === "Merchandising" &&
          userInfo.designation_title !== "Deputy General Manager" ? (
            <Link
              to="/merchandising/sors-create"
              className="btn btn-warning bg-falgun rounded-circle"
            >
              <i className="fal fa-plus"></i>
            </Link>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="employee_lists">
        <div className="datrange_filter">
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label>View Mode</label>
                <select
                  onChange={filterChange}
                  value={filterData.view}
                  name="view"
                  className="form-select"
                >
                  <option value="self">Self</option>
                  <option value="team">Team</option>
                </select>
              </div>
            </div>
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
                <th>Thumbnail</th>
                <th>SOR Number</th>
                <th>Status</th>
                <th>Buyer</th>
                <th>Style/Techpack</th>
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
                        <td>
                          <img
                            onClick={() => openImageModal(item.image_source)}
                            style={{
                              width: "50px",
                              height: "50px",
                              border: "1px solid gray",
                              borderRadius: "3px",
                              cursor: "pointer",
                            }}
                            src={item.image_source}
                          />
                        </td>
                        <td>
                          <Link to={"/merchandising/sors-details/" + item.id}>
                            {item.sor_number}
                          </Link>
                        </td>
                        <td>{item.status}</td>
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
                          <Link to={"/merchandising/sors-details/" + item.id}>
                            <i className="fa fa-eye mr-10 text-success"></i>
                          </Link>
                          {/* {props.userData?.userId === item.user_id &&
                            item.status === "Pending" && (
                              <Link to={"/merchandising/sors-edit/" + item.id}>
                                <i className="fa fa-pen mr-10 text-info"></i>
                              </Link>
                            )} */}
                        </td>
                      </tr>
                    ))}
                </>
              ) : (
                <>
                  {sors.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <img
                          onClick={() => openImageModal(item.image_source)}
                          style={{
                            width: "50px",
                            height: "50px",
                            border: "1px solid gray",
                            borderRadius: "3px",
                            cursor: "pointer",
                          }}
                          src={item.image_source}
                        />
                      </td>
                      <td>
                        <Link to={"/merchandising/sors-details/" + item.id}>
                          {item.sor_number}
                        </Link>
                      </td>
                      <td>{item.status}</td>
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
                        <Link to={"/merchandising/sors-details/" + item.id}>
                          <i className="fa fa-eye mr-10 text-success"></i>
                        </Link>
                        {/* {props.userData?.userId === item.user_id &&
                        item.status === "Pending" && (
                          <Link to={"/merchandising/sors-edit/" + item.id}>
                            <i className="fa fa-pen mr-10 text-info"></i>
                          </Link>
                        )} */}
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
        <Modal show={imageModal} onHide={closeImageModal}>
          <Modal.Header closeButton>
            <Modal.Title>Thumbnail</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img style={{ width: "100%" }} src={imageURL} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeImageModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <br />
      <br />
    </div>
  );
}
