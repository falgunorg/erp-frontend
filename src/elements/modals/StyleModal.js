import React, { useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import api from "../../services/api";

export default function StyleModal(props) {
  // get all buyers
  const [buyers, setBuyers] = useState([]);
  const getBuyers = async () => {
    var response = await api.post("/common/buyers");
    if (response.status === 200 && response.data) {
      setBuyers(response.data.data);
    } else {
      console.log(response.data);
    }
  };

  const [styleForm, setStyleForm] = useState({
    title: "",
    buyer_id: "",
  });
  const [styleModal, setStyleModal] = useState(false);
  const [styleError, setStyleError] = useState({});
  const closeStyleModal = () => {
    props.setStyleModal(false);
    setStyleForm({
      title: "",
      buyer_id: "",
    });
    setStyleError({});
  };
  const handleStyleFormChange = (ev) => {
    setStyleForm({
      ...styleForm,
      [ev.target.name]: ev.target.value,
    });
  };
  const validateStyleForm = () => {
    let formErrors = {};

    if (!styleForm.title) {
      formErrors.title = "Title is required";
    }
    if (!styleForm.buyer_id) {
      formErrors.buyer_id = "Buyer is required";
    }
    setStyleError(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const submitStyle = async () => {
    const valid = validateStyleForm();
    if (valid) {
      var response = await api.post("/merchandising/styles-create", styleForm);
      if (response.status === 200 && response.data) {
        setStyleForm({
          title: "",
          buyer_id: "",
        });
        setStyleError({
          title: "",
          buyer_id: "",
        });
        props.setStyleModal(false);
        props.setCallStyles(true);
        setTimeout(() => {
          props.setCallStyles(false);
        }, 500); // 500 milliseconds delay
      } else {
        setStyleError(response.data.errors);
      }
    }
  };
  useEffect(async () => {
    getBuyers();
  }, []);
  return (
    <Modal size="sm" show={props.styleModal} onHide={closeStyleModal}>
      <Modal.Header closeButton>
        <Modal.Title>Add Style</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <label>
            Style Title <sup>*</sup>
          </label>
          <input
            name="title"
            value={styleForm.title}
            onChange={handleStyleFormChange}
            type="text"
            className="form-control"
          />
          {styleError.title && (
            <div className="errorMsg">{styleError.title}</div>
          )}
        </div>
        <div className="form-group">
          <label>
            Buyer<sup>*</sup>
          </label>
          <select
            name="buyer_id"
            value={styleForm.buyer_id}
            onChange={handleStyleFormChange}
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
          {styleError.buyer_id && (
            <div className="errorMsg">{styleError.buyer_id}</div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="default" onClick={closeStyleModal}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submitStyle}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
