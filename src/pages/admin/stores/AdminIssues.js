import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "../../../services/api";
import Spinner from "../../../elements/Spinner";
import Pagination from "../../../elements/Pagination";
import moment from "moment/moment";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import swal from "sweetalert";
export default function AdminIssues(props) {
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
    num_of_row: 20,
    buyer_id: "",
    supplier_id: "",
    booking_id: "",
    techpack_id: "",
    issue_type: "",
    company_id: "",
  });
  const filterChange = (name, value) => {
    setFilterData({ ...filterData, [name]: value });
  };
  const clearFields = () => {
    setFilterData({
      from_date: "",
      to_date: "",
      num_of_row: 20,
      buyer_id: "",
      supplier_id: "",
      booking_id: "",
      techpack_id: "",
      issue_type: "",
      company_id: "",
    });
  };
  // get all issues
  const [issues, setIssues] = useState([]);
  const getIssues = async () => {
    setSpinner(true);
    var response = await api.post("/store/admin/issues", {
      buyer_id: filterData.buyer_id,
      supplier_id: filterData.supplier_id,
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      num_of_row: filterData.num_of_row,
      booking_id: filterData.booking_id,
      techpack_id: filterData.techpack_id,
      issue_type: filterData.issue_type,
      company_id: filterData.company_id,
    });

    if (response.status === 200 && response.data) {
      setIssues(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };
  const [suppliers, setSuppliers] = useState([]);
  const getSuppliers = async () => {
    setSpinner(true);
    var response = await api.post("/admin/suppliers");
    if (response.status === 200 && response.data) {
      setSuppliers(response.data.data);
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

  // techpacks
  const [techpacks, setTechpacks] = useState([]);
  const getTechpacks = async () => {
    setSpinner(true);
    var response = await api.post("/merchandising/techpacks");
    if (response.status === 200 && response.data) {
      setTechpacks(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  // bookings
  const [bookings, setBookings] = useState([]);
  const getBookings = async () => {
    setSpinner(true);
    var response = await api.post("/merchandising/bookings");
    if (response.status === 200 && response.data) {
      setBookings(response.data.all_bookings);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const [companies, setCompanies] = useState([]);
  const getCompanies = async () => {
    setSpinner(true);
    var response = await api.post("/common/companies");
    if (response.status === 200 && response.data) {
      setCompanies(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  // issueModal
  const [issueModal, setIssueModal] = useState(false);

  const [issue, setIssue] = useState({});
  const openIssueModal = async (item_id) => {
    setSpinner(true);
    var response = await api.post("/store/issues-show", { id: item_id });
    if (response.status === 200 && response.data) {
      setIssue(response.data.data);
      setIssueModal(true);
    }
    setSpinner(false);
  };
  const closeIssueModal = () => {
    setIssue({});
    setIssueModal(false);
  };

  useEffect(async () => {
    getSuppliers();
    getBuyers();
    getTechpacks();
    getBookings();
    getCompanies();
  }, []);

  useEffect(async () => {
    getIssues();
  }, [filterData]);

  useEffect(async () => {
    props.setSection("stores");
  }, []);

  

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Store (Issues)</div>
        <div className="actions">
          <input
            type="search"
            onChange={(e) => setSearchValue(e.target.value)}
            // type="text"
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
                  onChange={(event) =>
                    filterChange("from_date", event.target.value)
                  }
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
                  onChange={(event) =>
                    filterChange("to_date", event.target.value)
                  }
                  value={filterData.to_date}
                  name="to_date"
                  className="form-control"
                  type="date"
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>Supplier</label>
                <Select
                  placeholder="Select"
                  onChange={(selectedOption) =>
                    filterChange("supplier_id", selectedOption.value)
                  }
                  value={
                    suppliers.find((item) => item.id === filterData.supplier_id)
                      ? {
                          value: filterData.supplier_id,
                          label:
                            suppliers.find(
                              (item) => item.id === filterData.supplier_id
                            ).company_name || "",
                        }
                      : null
                  }
                  name="supplier_id"
                  options={suppliers.map((item) => ({
                    value: item.id,
                    label: item.company_name,
                  }))}
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>Buyer</label>
                <Select
                  placeholder="Select"
                  onChange={(selectedOption) =>
                    filterChange("buyer_id", selectedOption.value)
                  }
                  value={
                    buyers.find((item) => item.id === filterData.buyer_id)
                      ? {
                          value: filterData.buyer_id,
                          label:
                            buyers.find(
                              (item) => item.id === filterData.buyer_id
                            ).name || "",
                        }
                      : null
                  }
                  name="buyer_id"
                  options={buyers.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>Booking Number</label>
                <Select
                  className="basic-single"
                  placeholder="Select"
                  value={
                    bookings.find((item) => item.id === filterData.booking_id)
                      ? {
                          value: filterData.booking_id,
                          label:
                            bookings.find(
                              (item) => item.id === filterData.booking_id
                            ).booking_number || "",
                        }
                      : null
                  }
                  name="booking_id"
                  onChange={(selectedOption) =>
                    filterChange("booking_id", selectedOption.value)
                  }
                  options={bookings.map((item) => ({
                    value: item.id,
                    label: item.booking_number,
                  }))}
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>Style</label>
                <Select
                  placeholder="Select"
                  value={
                    techpacks.find((item) => item.id === filterData.techpack_id)
                      ? {
                          value: filterData.techpack_id,
                          label:
                            techpacks.find(
                              (item) => item.id === filterData.techpack_id
                            ).title || "",
                        }
                      : null
                  }
                  onChange={(selectedOption) =>
                    filterChange("techpack_id", selectedOption.value)
                  }
                  name="techpack_id"
                  options={techpacks.map((item) => ({
                    value: item.id,
                    label: item.title,
                  }))}
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>Company</label>
                <Select
                  placeholder="Select"
                  onChange={(selectedOption) =>
                    filterChange("company_id", selectedOption.value)
                  }
                  value={
                    companies.find((item) => item.id === filterData.company_id)
                      ? {
                          value: filterData.company_id,
                          label:
                            companies.find(
                              (item) => item.id === filterData.company_id
                            ).title || "",
                        }
                      : null
                  }
                  name="company_id"
                  options={companies.map((item) => ({
                    value: item.id,
                    label: item.title,
                  }))}
                />
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label>Type</label>
                <select
                  onChange={(event) =>
                    filterChange("issue_type", event.target.value)
                  }
                  name="issue_type"
                  value={filterData.issue_type}
                  className="form-select"
                >
                  <option value="">Select Type</option>
                  <option value="Self">Self</option>
                  <option value="Sister-Factory">Sister-Factory</option>
                  <option value="Sub-Contract">Sub-Contract</option>
                  <option value="Stock-Lot">Stock-Lot</option>
                </select>
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label>NUM Of Rows</label>
                <div className="d-flex gap_10">
                  <select
                    onChange={(event) =>
                      filterChange("num_of_row", event.target.value)
                    }
                    value={filterData.num_of_row}
                    name="num_of_row"
                    className="form-select"
                  >
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="75">75</option>
                    <option value="100">100</option>
                  </select>
                  <Link className="btn btn-warning" onClick={clearFields}>
                    <i className="fas fa-retweet"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead className="bg-dark text-white">
              <tr>
                <th>#</th>
                <th>DCN</th>
                <th>B.NO.</th>
                <th>Type</th>
                <th>Date</th>
                <th>Photo</th>
                <th>Buyer</th>
                <th>Style</th>
                <th>Supplier</th>
                <th>Item</th>
                <th>Details</th>
                <th>Qty</th>
                <th>Issued By</th>
                <th>Reference</th>
                <th>Section</th>
                <th>Line</th>
                <th>Iss. Company</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {searchValue ? (
                <>
                  {issues
                    .filter((item) => {
                      if (!searchValue) return false;
                      const lowerCaseSearchValue = searchValue.toLowerCase();
                      return (
                        item.booking_number
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.supplier
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.buyer
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.techpack
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.delivery_challan
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.issue_by
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.reference
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.item_name
                          .toLowerCase()
                          .includes(lowerCaseSearchValue)
                      );
                    })
                    .map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <a target="_blank" href={item.challan_file} download>
                            {item.delivery_challan}
                          </a>
                        </td>
                        <td>{item.booking_number}</td>
                        <td>{item.issue_type}</td>
                        <td>{moment(item.created_at).format("ll")}</td>
                        <td>
                          <img
                            onClick={() => openImageModal(item.image_source)}
                            style={{
                              height: "50px",
                              width: "50px",
                              border: "1px solid gray",
                              borderRadius: "3px",
                              cursor: "pointer",
                            }}
                            src={item.image_source}
                          />
                        </td>
                        <td>{item.buyer}</td>
                        <td>{item.techpack}</td>
                        <td>{item.supplier}</td>
                        <td>{item.item_name}</td>
                        <td>{item.description}</td>
                        <td>
                          {item.qty} {item.unit}
                        </td>
                        <td>{item.issue_by}</td>
                        <td>{item.reference}</td>
                        <td>{item.issue_to_user}</td>
                        <td>{item.line}</td>
                        <td>
                          {item.issuing_company
                            ? item.issuing_company
                            : item.company_name}
                        </td>
                        <td>
                          <div className="text-center">
                            <Link onClick={() => openIssueModal(item.id)}>
                              <i
                                style={{ fontSize: "20px" }}
                                className="fas fa-eye text-success"
                              ></i>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                </>
              ) : (
                <>
                  {issues.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <a target="_blank" href={item.challan_file} download>
                          {item.delivery_challan}
                        </a>
                      </td>
                      <td>{item.booking_number}</td>
                      <td>{item.issue_type}</td>
                      <td>{moment(item.created_at).format("ll")}</td>
                      <td>
                        <img
                          onClick={() => openImageModal(item.image_source)}
                          style={{
                            height: "50px",
                            width: "50px",
                            border: "1px solid gray",
                            borderRadius: "3px",
                            cursor: "pointer",
                          }}
                          src={item.image_source}
                        />
                      </td>
                      <td>{item.buyer}</td>
                      <td>{item.techpack}</td>
                      <td>{item.supplier}</td>
                      <td>{item.item_name}</td>
                      <td>{item.description}</td>
                      <td>
                        {item.qty} {item.unit}
                      </td>
                      <td>{item.issue_by}</td>
                      <td>{item.reference}</td>
                      <td>{item.issue_to_user}</td>
                      <td>{item.line}</td>
                      <td>
                        {item.issuing_company
                          ? item.issuing_company
                          : item.company_name}
                      </td>
                      <td>
                        <div className="text-center">
                          <Link onClick={() => openIssueModal(item.id)}>
                            <i
                              style={{ fontSize: "20px" }}
                              className="fas fa-eye text-success"
                            ></i>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Modal size="lg" show={issueModal} onHide={closeIssueModal}>
        <Modal.Header closeButton>
          <Modal.Title>Item Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <img style={{ width: "150px" }} src={issue.image_source} />
          </div>
          <br />
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>DATE</th>
                <th>DCN</th>
                <th>QTY</th>
                <th>TYPE</th>
                <th>REFERENCE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{moment(issue.created_at).format("ll")}</td>
                <td>
                  <a target="_blank" href={issue.challan_file} download>
                    {issue.delivery_challan}
                  </a>
                </td>
                <td>
                  {issue.qty} {issue.unit}
                </td>
                <td>{issue.issue_type}</td>
                <td>{issue.reference}</td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th>SECTION</th>
                <th>LINE</th>
                <th>ISSUING COMPANY</th>
                <th colSpan={2}>REMARKS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{issue.issue_to_user}</td>
                <td>{issue.line}</td>
                <td>{issue.issuing_company}</td>
                <td colSpan={2}>{issue.remarks}</td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th>ITEM</th>
                <th>BUYER</th>
                <th>STYLE</th>
                <th>SUPPLIER</th>
                <th>BOOKING NUMBER</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{issue.item_name}</td>
                <td>{issue.buyer}</td>
                <td>{issue.techpack}</td>
                <td>{issue.supplier}</td>
                <td>{issue.booking_number}</td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th colSpan={3}>Details</th>
                <th>Issue By</th>
                <th>Booked By</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={3}>{issue.description}</td>
                <td>{issue.issue_by}</td>
                <td>{issue.booked_by}</td>
              </tr>
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeIssueModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={imageModal} onHide={closeImageModal}>
        <Modal.Header closeButton>
          <Modal.Title>Item Image</Modal.Title>
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
      <br />
      <br />
    </div>
  );
}
