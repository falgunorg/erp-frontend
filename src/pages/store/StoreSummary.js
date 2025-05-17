import React, { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import { Link, useHistory } from "react-router-dom";
import Spinner from "../../elements/Spinner";
import { Modal, Button } from "react-bootstrap";
import moment from "moment";
import Select from "react-select";

import $ from "jquery";
import "datatables.net";
import "datatables.net-buttons";
import "datatables.net-buttons/js/buttons.html5.min.js";
import "datatables.net-buttons/js/buttons.print.min.js";
import "datatables.net-buttons/js/buttons.colVis.mjs";

export default function StoreSummary(props) {
  const userInfo = props.userData;


  const dataTableRef = useRef(null);
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

  const [filterData, setFilterData] = useState({
    from_date: "",
    to_date: "",
    buyer_id: "",
    supplier_id: "",
    booking_id: "",
    techpack_id: "",
    view: userInfo.designation_title === "Assistant Manager" ? "team" : "self",
  });
  const filterChange = (name, value) => {
    setFilterData({ ...filterData, [name]: value });
  };
  const clearFields = () => {
    setFilterData({
      from_date: "",
      to_date: "",
      buyer_id: "",
      supplier_id: "",
      booking_id: "",
      techpack_id: "",
      view:
        userInfo.designation_title === "Assistant Manager" ? "team" : "self",
    });
  };

  // suppliers
  const [suppliers, setSuppliers] = useState([]);
  const getSuppliers = async () => {
    setSpinner(true);
    var response = await api.post("/suppliers");
    if (response.status === 200 && response.data) {
      setSuppliers(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  // buyers
  const [buyers, setBuyers] = useState([]);
  const getBuyers = async () => {
    setSpinner(true);
    var response = await api.post("/buyers");
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
    var response = await api.post("/techpacks");
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
    var response = await api.post("/bookings", { status: "Confirmed" });
    if (response.status === 200 && response.data) {
      setBookings(response.data.all_bookings);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  // get all items
  const [items, setItems] = useState([]);
  const getItems = async () => {
    setSpinner(true);
    var response = await api.post("/stores-summary", {
      department: userInfo.department_title,
      designation: userInfo.designation_title,
      buyer_id: filterData.buyer_id,
      supplier_id: filterData.supplier_id,
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      booking_id: filterData.booking_id,
      techpack_id: filterData.techpack_id,
      view: filterData.view,
    });
    if (response.status === 200 && response.data) {
      setItems(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const [storeModal, setStoreModal] = useState(false);
  const [store, setStore] = useState({});
  const [receives, setReceives] = useState([]);
  const [issues, setIssues] = useState([]);

  const getStore = async (id) => {
    setSpinner(true);
    var response = await api.post("/stores-show", { id: id });
    if (response.status === 200 && response.data) {
      setStore(response.data.data);
      setReceives(response.data.data.receives);
      setIssues(response.data.data.issues);
      setStoreModal(true);
    }
    setSpinner(false);
  };

  const closeStoreModal = () => {
    setStoreModal(false);
    setStore({});
    setReceives([]);
    setIssues([]);
  };

  useEffect(async () => {
    getItems();
  }, [filterData]);

  useEffect(async () => {
    getSuppliers();
    getBuyers();
    getTechpacks();
    getBookings();
  }, []);

  useEffect(() => {
    const fetchDataAndInitializeDataTable = async () => {
      setSpinner(true);
      await getItems();
      if ($.fn.DataTable.isDataTable(dataTableRef.current)) {
        $(dataTableRef.current).DataTable().destroy();
      }
      const dataTable = $(dataTableRef.current).DataTable({
        dom: "Bfrtip",
        buttons: [
          {
            extend: "copy",
            exportOptions: { columns: ":visible" },
          },
          {
            extend: "excel",
            exportOptions: { columns: ":visible" },
          },
          {
            extend: "print",
            exportOptions: {
              columns: function (idx, data, node) {
                // Exclude the second (index 1) and last columns
                return (
                  idx !== 1 && idx !== dataTable.columns().indexes().length - 1
                );
              },
            },
          },
        ],
        // DataTable options go here
      });

      setSpinner(false); // Move this line inside the function
      // Destroy DataTable when the component unmounts
      return () => {
        dataTable.destroy();
      };
    };

    fetchDataAndInitializeDataTable();
  }, []);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Store Summary</div>
      </div>

      <div className="datrange_filter">
        <div className="row">
          {userInfo.department_title === "Merchandising" && (
            <div className="col">
              <div className="form-group">
                <label>View Mode</label>
                <select
                  onChange={(event) => filterChange("view", event.target.value)}
                  value={filterData.view}
                  name="view"
                  className="form-select"
                >
                  <option value="self">Self</option>
                  <option value="team">Team</option>
                </select>
              </div>
            </div>
          )}

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
                          buyers.find((item) => item.id === filterData.buyer_id)
                            .name || "",
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
              <br />
              <Link to="#" className="btn btn-warning" onClick={clearFields}>
                <i className="fas fa-retweet"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="supplier_table">
        <table ref={dataTableRef} className="display table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>THUMB</th>
              <th>ITEM</th>
              <th>DETAILS</th>
              <th>PC | BUYER</th>
              <th>B.N</th>
              <th>STYLE | PO</th>
              <th>SUPPLIER</th>
              <th>B. DATE</th>
              <th>E.D. DATE</th>
              <th>B. QTY</th>
              <th>RECEIVED</th>
              <th>LEFT</th>
              <th>USED</th>
              <th>STOCK</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
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
                <td>
                  <strong>{item.item_name}</strong>
                </td>
                <td>
                  <pre>{item.description}</pre>
                </td>
                <td>
                  {item.contract} | {item.buyer}
                </td>
                <td>{item.booking_number}</td>
                <td>
                  {item.techpack} | {item.po_number}
                </td>
                <td>{item.supplier}</td>
                <td>{moment(item.booking_date).format("ll")}</td>
                <td>{moment(item.delivery_date).format("ll")}</td>
                <td>
                  <strong>{item.booking_qty}</strong>
                </td>
                <td className="text-primary">
                  <strong>{item.total_received}</strong>
                </td>
                <td className="text-danger">
                  <strong>{item.left_receive}</strong>
                </td>
                <td className="text-warning">
                  <strong>{item.total_used}</strong>
                </td>
                <td className="text-success">
                  <strong>{item.balance}</strong>
                </td>
                <td>
                  {item.qty === item.left_receive ? (
                    ""
                  ) : (
                    <button
                      onClick={() => getStore(item.id)}
                      className="btn btn-success btn-sm"
                    >
                      Details
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

      <Modal size="lg" show={storeModal} onHide={closeStoreModal}>
        <Modal.Header closeButton>
          <Modal.Title>Store Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="employee_lists">
            <div className="row">
              <div className="col-3">
                <img style={{ width: "100%" }} src={store.image_source} />
              </div>
              <div className="col-9">
                <h5>Item Details</h5>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>S.N</th>
                      <th>B.N</th>
                      <th>RECEIVED</th>
                      <th>ISSUED</th>
                      <th>RETURN</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{store.store_number}</td>
                      <td>{store.booking_number}</td>
                      <td>
                        {store.total_received} {store.unit}
                      </td>
                      <td>
                        {store.total_issued} {store.unit}
                      </td>
                      <td>
                        {store.returned_qty} {store.unit}
                      </td>
                    </tr>
                  </tbody>
                  <thead>
                    <tr>
                      <th>BALANCE</th>
                      <th>ITEM</th>
                      <th>BUYER</th>
                      <th>STYLE</th>
                      <th>SUPPLIER</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {store.qty} {store.unit}
                      </td>
                      <td>{store.item_name}</td>
                      <td>{store.buyer}</td>
                      <td>{store.techpack}</td>
                      <td>{store.supplier}</td>
                    </tr>
                  </tbody>

                  <thead>
                    <tr>
                      <th colSpan={2}>DETAILS</th>
                      <th colSpan={2}>REMARKS</th>
                      <th>BOOKED BY</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={2}>{store.description}</td>
                      <td colSpan={2}>{store.remarks}</td>
                      <td>{store.booked_by}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-6">
                <h5>Received</h5>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>MRR</th>
                        <th>Challan</th>
                        <th>QTY</th>
                        <th>Received By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receives.map((item, index) => (
                        <tr key={index}>
                          <td>{moment(item.created_at).format("ll")}</td>
                          <td>{item.mrr_number}</td>
                          <td>
                            <a
                              target="_blank"
                              href={item.challan_file}
                              download
                            >
                              {item.challan_no}
                            </a>
                          </td>
                          <td>{item.qty}</td>
                          <td>{item.received_by}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-6">
                <h5>Issued</h5>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>DCN</th>
                        <th>Reference</th>
                        <th>QTY</th>
                        <th>Issue By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {issues.map((item, index) => (
                        <tr key={index}>
                          <td>{moment(item.created_at).format("ll")}</td>
                          <td>{item.issue_type}</td>

                          <td>
                            <a
                              target="_blank"
                              href={item.challan_file}
                              download
                            >
                              {item.delivery_challan}
                            </a>
                          </td>
                          <td>{item.reference}</td>
                          <td>{item.qty}</td>
                          <td>{item.issue_by}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeStoreModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
