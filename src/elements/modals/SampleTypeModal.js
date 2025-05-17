import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import api from "../../services/api";

export default function SampleTypeModal(props) {
  const [buyers, setBuyers] = useState([]);
  const getBuyers = async () => {
    var response = await api.post("/buyers");
    if (response.status === 200 && response.data) {
      setBuyers(response.data.data);
    } else {
      console.log(response.data);
    }
  };

  const closeSampleModal = () => {
    props.setSampleTypeModal(false);
  };

  const [errors, setErrors] = useState({});
  const [formDataSet, setFormDataSet] = useState({
    title: "",
    buyer_id: "",
  });

  const handleChange = (ev) => {
    setFormDataSet({
      ...formDataSet,
      [ev.target.name]: ev.target.value,
    });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formDataSet.title) {
      formErrors.title = "Title is required";
    }
    if (!formDataSet.buyer_id) {
      formErrors.buyer_id = "Buyer is required";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      var response = await api.post("/sors-types-create", formDataSet);
      if (response.status === 200 && response.data) {
        props.setSampleTypeModal(false);
        props.setCallSampleTypes(true);
        setTimeout(() => {
          props.setCallSampleTypes(false);
        }, 500); // 500 milliseconds delay
      } else {
        setErrors(response.data.errors);
      }
    }
  };
  useEffect(async () => {
    getBuyers();
  }, []);

  return (
    <Modal show={props.sampleTypeModal} onHide={closeSampleModal}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Sample Type</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-lg-12">
            <div className="form-group">
              <label>
                Sample Type Title <sup>*</sup>
              </label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={formDataSet.title}
                onChange={handleChange}
              />
              {errors.title && <div className="errorMsg">{errors.title}</div>}
            </div>
          </div>
          <div className="col-lg-12">
            <div className="form-group">
              <label>
                Buyer<sup>*</sup>
              </label>
              <select
                name="buyer_id"
                value={formDataSet.buyer_id}
                onChange={handleChange}
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
              {errors.buyer_id && (
                <div className="errorMsg">{errors.buyer_id}</div>
              )}
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={closeSampleModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
