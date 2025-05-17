import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Spinner from "../../../elements/Spinner";
import Select from "react-select";
import api from "services/api";
import { Modal, Button } from "react-bootstrap";
import swal from "sweetalert";

export default function ReceiveItem(props) {
  const history = useHistory();
  const [spinner, setSpinner] = useState();
  const [bookings, setBookings] = useState([]);
  const getBookings = async () => {
    setSpinner(true);
    var response = await api.post("/bookings", { status: "Confirmed" });
    if (response.status === 200 && response.data) {
      setBookings(response.data.data);
    }
    setSpinner(false);
  };

  const [bookingItems, setBookingItems] = useState([]);
  const getBooking = async (booking_id) => {
    setSpinner(true);
    var response = await api.post("/bookings-show", { id: booking_id });
    if (response.status === 200 && response.data) {
      setBookingItems(response.data.data.booking_items);
    } else {
      setBookingItems([]);
    }
    setSpinner(false);
  };
  const bookingChange = (selectedOption) => {
    if (selectedOption) {
      getBooking(selectedOption.value);
    }
  };
  //receiving items
  const [receiveModal, setReceiveModal] = useState(false);
  const openReceiveModal = async (item_id) => {
    setSpinner(true);
    var response = await api.post("/single-booking-item", { id: item_id });
    if (response.status === 200 && response.data) {
      setFormDataSet(response.data.data);
      setReceiveModal(true);
    }
    setSpinner(false);
  };

  const closeReceiveModal = () => {
    setFormDataSet({});
    setErrors({});
    setReceiveModal(false);
  };

  const [errors, setErrors] = useState({});
  const [formDataSet, setFormDataSet] = useState({});
  const [file, setFile] = useState(null);

  const handleChange = (ev) => {
    let formErrors = {};
    const name = ev.target.name;
    const value = ev.target.value;

    if (name === "receive_qty" && Number(value) > formDataSet.left_balance) {
      formErrors.receive_qty = "Cannot insert over order qty";
    }

    if (name === "challan_copy") {
      setFile(ev.target.files[0]); // Store the selected file
      if (!ev.target.files[0]) {
        formErrors.challan_copy = "Please select a PDF file";
      } else {
        formErrors.challan_copy = ""; // Clear any previous error
      }
    }

    setFormDataSet({
      ...formDataSet,
      [name]: value,
    });
    setErrors(formErrors);
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formDataSet.receive_qty) {
      formErrors.receive_qty = "Please Insert Receiving QTY";
    }
    if (Number(formDataSet.receive_qty) > formDataSet.left_balance) {
      formErrors.receive_qty = "Cannot insert over order qty";
    }
    if (!formDataSet.challan_no) {
      formErrors.challan_no = "Please Insert Challan No";
    }
    if (!formDataSet.gate_pass) {
      formErrors.gate_pass = "Please Insert Gate In No";
    }
    if (!formDataSet.challan_copy) {
      formErrors.challan_copy = "Please select a PDF file";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      // Create a FormData object
      var formData = new FormData();

      // Append form data to the FormData object
      for (const key in formDataSet) {
        formData.append(key, formDataSet[key]);
      }

      // Append the file to the FormData object
      formData.append("challan_copy", file);

      // Send the FormData object in the API request
      var response = await api.post("/receives-create", formData);
      if (response.status === 200 && response.data) {
        setFormDataSet({});
        setErrors({});
        setReceiveModal(false);
        swal({
          title: "Successfully Received Item",
          icon: "success",
        });
        history.push("/store/receives");
      } else {
        setErrors(response.data.errors);
      }
    }
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   if (validateForm()) {
  //     var response = await api.post("/receives-create", formDataSet);
  //     if (response.status === 200 && response.data) {
  //       setFormDataSet({});
  //       setErrors({});
  //       setReceiveModal(false);
  //       swal({
  //         title: "Successfully Received Item",
  //         icon: "success",
  //       });
  //       history.push("/store/receives");
  //     } else {
  //       setErrors(response.data.errors);
  //     }
  //   }
  // };

  useEffect(async () => {
    getBookings();
  }, []);

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
        <div className="page_name">Receive Items</div>
        <div className="actions">
          <Link to="/store/receives" className="btn btn-danger rounded-circle">
            <i className="fal fa-times"></i>
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6">
          <div className="form-group">
            <label>Booking No:</label>

            <Select
              placeholder="Select or Search"
              onChange={bookingChange}
              options={bookings.map((item) => ({
                value: item.id,
                label: item.booking_number,
              }))}
            />
          </div>
        </div>
      </div>
      <br />
      <br />
      <div className="row">
        <h6>Bookings Item's</h6>
        <div className="Import_booking_item_table">
          <table className="table text-start align-middle table-bordered table-hover mb-0">
            <thead className="bg-dark text-white">
              <tr>
                <th>Booking No</th>
                <th>Style</th>
                <th>Item</th>
                <th>Item Details </th>
                <th>Attatchment</th>
                <th>Color</th>
                <th>Size</th>
                <th>Shade</th>
                <th>Tex</th>
                <th>Order QTY</th>
                <th>Received QTY</th>
                <th>Left QTY</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookingItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.booking_number}</td>
                  <td>{item.techpack}</td>
                  <td>{item.item_name}</td>
                  <td>
                    <pre>{item.description}</pre>
                  </td>
                  <td>
                    <img
                      style={{ height: "80px", width: "120px" }}
                      src={item.image_source}
                    />
                  </td>
                  <td>{item.color}</td>
                  <td>{item.size}</td>
                  <td>{item.shade}</td>
                  <td>{item.tex}</td>

                  <td>
                    {item.qty} {item.unit}
                  </td>
                  <td>
                    {item.already_received} {item.unit}
                  </td>
                  <td>
                    {item.left_balance} {item.unit}
                  </td>
                  <td>
                    {item.left_balance > 0 && (
                      <button
                        onClick={() => openReceiveModal(item.id)}
                        className="btn btn-sm btn-success"
                      >
                        Receive
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Modal show={receiveModal} onHide={closeReceiveModal}>
            <Modal.Header closeButton>
              <Modal.Title>Insert Received QTY</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <div className="col-lg-6 offset-lg-3">
                  <img
                    style={{ width: "100%" }}
                    src={formDataSet.image_source}
                  />
                </div>
                <br />

                <div className="col-lg-6">
                  <div className="form-group">
                    <br />
                    <label>Receiving QTY</label>
                    <input
                      type="number"
                      onWheel={(event) => event.target.blur()}
                      className="form-control"
                      name="receive_qty"
                      min={1}
                      value={formDataSet.receive_qty}
                      onChange={handleChange}
                    />
                    {errors.receive_qty && (
                      <div className="errorMsg">{errors.receive_qty}</div>
                    )}
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <br />
                    <label>Challan No</label>
                    <input
                      type="text"
                      className="form-control"
                      name="challan_no"
                      value={formDataSet.challan_no}
                      onChange={handleChange}
                    />
                    {errors.challan_no && (
                      <div className="errorMsg">{errors.challan_no}</div>
                    )}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group">
                    <label>Gate Pass</label>
                    <input
                      type="text"
                      className="form-control"
                      name="gate_pass"
                      value={formDataSet.gate_pass}
                      onChange={handleChange}
                    />
                    {errors.gate_pass && (
                      <div className="errorMsg">{errors.gate_pass}</div>
                    )}
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group">
                    <label>Challan Copy (PDF only)</label>
                    <input
                      type="file"
                      className="form-control"
                      name="challan_copy"
                      value={formDataSet.challan_copy}
                      onChange={handleChange}
                      accept=".pdf"
                      required
                    />
                    {errors.challan_copy && (
                      <div className="errorMsg">{errors.challan_copy}</div>
                    )}
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label>Order QTY</label>
                    <input
                      type="number"
                      onWheel={(event) => event.target.blur()}
                      disabled
                      className="form-control"
                      name="qty"
                      value={formDataSet.qty}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group">
                    <label>Already Received QTY</label>
                    <input
                      type="number"
                      onWheel={(event) => event.target.blur()}
                      disabled
                      className="form-control"
                      name="already_received"
                      value={formDataSet.already_received}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group">
                    <label>Left QTY</label>
                    <input
                      type="number"
                      onWheel={(event) => event.target.blur()}
                      disabled
                      className="form-control"
                      name="left_balance"
                      value={formDataSet.left_balance}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleSubmit}>
                Receive
              </Button>
              <Button variant="secondary" onClick={closeReceiveModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          <br />
          <br />
        </div>
      </div>
    </div>
  );
}
