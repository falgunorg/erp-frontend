import React, { useState, useEffect } from "react";
import { Link ,useHistory} from "react-router-dom";
import api from "../../../services/api";
import Spinner from "../../../elements/Spinner";
import Pagination from "../../../elements/Pagination";
import moment from "moment/moment";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import swal from "sweetalert";


export default function Recevies(props) {
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
    });
  };
  // get all receives
  const [receives, setReceives] = useState([]);
  const getReceives = async () => {
    setSpinner(true);
    var response = await api.post("/receives", {
      buyer_id: filterData.buyer_id,
      supplier_id: filterData.supplier_id,
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      num_of_row: filterData.num_of_row,
      booking_id: filterData.booking_id,
      techpack_id: filterData.techpack_id,
    });

    if (response.status === 200 && response.data) {
      setReceives(response.data.data);
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
      setTechpacks(response.data.all_items);
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

  // receiveModal
  const [receiveModal, setReceiveModal] = useState(false);
  const [store, setStore] = useState({});
  const openReceiveModal = async (item_id) => {
    setSpinner(true);
    var response = await api.post("/receives-show", { id: item_id });
    if (response.status === 200 && response.data) {
      setStore(response.data.data);
      setReceiveModal(true);
    }
    setSpinner(false);
  };
  const closeReceiveModal = () => {
    setStore({});
    setReceiveModal(false);
  };

  useEffect(async () => {
    getSuppliers();
    getBuyers();
    getTechpacks();
    getBookings();
  }, []);

  useEffect(async () => {
    getReceives();
  }, [filterData]);

  useEffect(async () => {
    props.setSection("stores");
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      if (props.userData?.department_title !== "Store") {
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
        <div className="page_name">Store (Receives)</div>
        <div className="actions">
          <input
            type="search"
            onChange={(e) => setSearchValue(e.target.value)}
            // type="text"
            value={searchValue}
            className="form-control"
            placeholder="Search"
          />
          <Link
            to="/store/receives-create"
            className="btn btn-warning bg-falgun rounded-circle"
          >
            <i className="fal fa-plus"></i>
          </Link>
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
                            techpacks.find((item) => item.id === filterData.techpack_id)
                              .title || "",
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
                  <Link to="#" className="btn btn-warning" onClick={clearFields}>
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
                <th>MRR</th>
                <th>B. NO.</th>
                <th>Date</th>
                <th>Photo</th>
                <th>Buyer</th>
                <th>Style/Techpack</th>
                <th>Supplier</th>
                <th>Item</th>
                <th>Details</th>
                <th>Qty</th>
                <th>Received By</th>
                <th>Challan No</th>
                <th>Gate In </th>
                <th>Booked By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {searchValue ? (
                <>
                  {receives
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
                        item.mrr_number
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.received_by
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.booked_by
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
                        <td>{item.mrr_number}</td>
                        <td>{item.booking_number}</td>
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
                        <td>{item.received_by}</td>
                        <td>
                          <a target="_blank" href={item.challan_file} download>
                            {item.challan_no}
                          </a>
                        </td>
                        <td>{item.gate_pass}</td>
                        <td>{item.booked_by}</td>
                        <td>
                          <div className="text-center">
                            <Link to="#" onClick={() => openReceiveModal(item.id)}>
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
                  {receives.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.mrr_number}</td>
                      <td>{item.booking_number}</td>
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
                      <td>{item.received_by}</td>
                      <a target="_blank" href={item.challan_file} download>
                        {item.challan_no}
                      </a>
                      <td>{item.gate_pass}</td>
                      <td>{item.booked_by}</td>
                      <td>
                        <div className="text-center">
                          <Link to="#" onClick={() => openReceiveModal(item.id)}>
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
      <Modal size="lg" show={receiveModal} onHide={closeReceiveModal}>
        <Modal.Header closeButton>
          <Modal.Title>Item Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <img style={{ width: "150px" }} src={store.image_source} />
          </div>
          <br />
          <table className="table table-bordered">
            <tr style={{ padding: "10px" }}>
              <th>Date</th>
              <th>MRR</th>
              <th>Challan</th>
              <th>Gate In</th>
              <th>QTY</th>
            </tr>
            <tr>
              <td>{moment(store.created_at).format("ll")}</td>
              <td>{store.mrr_number}</td>
              <td>
                <a target="_blank" href={store.challan_file} download>
                  {store.challan_no}
                </a>
              </td>
              <td>{store.gate_pass}</td>
              <td>
                {store.qty} {store.unit}
              </td>
            </tr>

            <tr>
              <th>Item</th>
              <th>Buyer</th>
              <th>Style</th>
              <th>Supplier</th>
              <th>Booking Number</th>
            </tr>
            <tr>
              <td>{store.item_name}</td>
              <td>{store.buyer}</td>
              <td>{store.techpack}</td>
              <td>{store.supplier}</td>
              <td>{store.booking_number}</td>
            </tr>

            <tr>
              <th colSpan={2}>Details</th>
              <th>Remarks</th>
              <th>Received By</th>
              <th>Booked By</th>
            </tr>
            <tr>
              <td colSpan={2}>{store.description}</td>
              <td>{store.remarks}</td>
              <td>{store.received_by}</td>
              <td>{store.booked_by}</td>
            </tr>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeReceiveModal}>
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
