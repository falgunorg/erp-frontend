import React, { useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import api from "../../services/api";

export default function BuyerModal(props) {
  const [countries, setCountries] = useState([]);
  const getCountries = async () => {
    var response = await api.get("/countries");
    if (response.status === 200 && response.data) {
      setCountries(response.data);
    }
  };

  const closeBuyerModal = () => {
    props.setBuyerModal(false);
  };

  const [errors, setErrors] = useState({});
  const [formDataSet, setFormDataSet] = useState({
    name: "",
    country: "",
    address: "",
    status: "",
  });

  const handleChange = (ev) => {
    setFormDataSet({
      ...formDataSet,
      [ev.target.name]: ev.target.value,
    });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formDataSet.name) {
      formErrors.name = "Name is required";
    }

    if (!formDataSet.country) {
      formErrors.country = "Country is required";
    }
    if (!formDataSet.status) {
      formErrors.status = "Status is required";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      var response = await api.post("/buyers-create", formDataSet);
      if (response.status === 200 && response.data) {
        setFormDataSet({
          name: "",
          country: "",
          address: "",
          status: "",
        });
        setErrors({});
        props.setBuyerModal(false);
        props.setCallBuyers(true);
        setTimeout(() => {
          props.setCallBuyers(false);
        }, 500); // 500 milliseconds delay
      } else {
        console.log(response.data.errors);
        setErrors(response.data.errors);
      }
    }
  };

  useEffect(async () => {
    getCountries();
  }, []);

  return (
    <Modal show={props.buyerModal} onHide={closeBuyerModal}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Buyer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-lg-12">
            <div className="form-group">
              <label>
                Buyer Name <sup>*</sup>
              </label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formDataSet.name}
                onChange={handleChange}
              />
              {errors.name && <div className="errorMsg">{errors.name}</div>}
            </div>
          </div>

          <div className="col-lg-6">
            <div className="form-group">
              <label>
                Country<sup>*</sup>
              </label>
              <select
                name="country"
                value={formDataSet.country}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select country</option>
                {countries.length > 0 ? (
                  countries.map((item, index) => (
                    <option key={index} value={item.nicename}>
                      {item.nicename}
                    </option>
                  ))
                ) : (
                  <option value="0">No country found</option>
                )}
              </select>
              {errors.country && (
                <div className="errorMsg">{errors.country}</div>
              )}
            </div>
          </div>

          <div className="col-lg-6">
            <div className="form-group">
              <label>
                Status<sup>*</sup>
              </label>
              <select
                name="status"
                value={formDataSet.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Job Status</option>
                <option value="Inactive">Inactive</option>
                <option value="Active">Active</option>
              </select>
              {errors.status && <div className="errorMsg">{errors.status}</div>}
            </div>
          </div>

          <div className="col-lg-12">
            <div className="form-group">
              <label>Address</label>

              <textarea
                value={formDataSet.address}
                onChange={handleChange}
                name="address"
                className="form-control"
              ></textarea>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeBuyerModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
