import React, { useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import api from "../../services/api";

export default function ItemModal(props) {
  const [units, setUnits] = useState([]);
  const getUnits = async () => {
    var response = await api.post("/units");
    if (response.status === 200 && response.data) {
      setUnits(response.data.data);
    } else {
      console.log(response.data);
    }
  };
  // add items on modal
  const closeItemModal = () => {
    props.setItemModal(false);
  };
  const [itemForm, setItemForm] = useState({
    title: "",
    unit: "",
  });
  const [itemErrors, setItemErrors] = useState({});

  const validateItemInputs = () => {
    let formErrors = {};
    // personal info
    if (!itemForm.title) {
      formErrors.title = "Title is required";
    }
    if (!itemForm.unit) {
      formErrors.unit = "Unit is required";
    }
    setItemErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const itemChange = (ev) => {
    setItemForm({
      ...itemForm,
      [ev.target.name]: ev.target.value,
    });
  };

  const submitItem = async () => {
    const valid = validateItemInputs();
    if (valid) {
      var response = await api.post("/items-create", itemForm);
      if (response.status === 200 && response.data) {
        setItemErrors({
          title: "",
          unit: "",
        });
        setItemForm({
          title: "",
          unit: "",
        });
        props.setItemModal(false);
        props.setCallItems(true);
        props.setCallColors(true);
        setTimeout(() => {
          props.setCallItems(false);
          props.setCallColors(false);
        }, 500); // 500 milliseconds delay
      } else {
        setItemErrors(response.data.errors);
      }
    }
  };
  useEffect(async () => {
    getUnits();
  }, []);

  return (
    <Modal size="sm" show={props.itemModal} onHide={closeItemModal}>
      <Modal.Header closeButton>
        <Modal.Title>Add Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <label>Item Title</label>
          <input
            value={itemForm.title}
            onChange={itemChange}
            name="title"
            type="text"
            className="form-control"
          />
          {itemErrors.title && (
            <div className="errorMsg">{itemErrors.title}</div>
          )}
        </div>
        <div className="form-group">
          <label>Item Unit</label>
          <select
            name="unit"
            value={itemForm.unit}
            onChange={itemChange}
            className="form-select"
          >
            <option value="">Select unit</option>
            {units.length > 0 ? (
              units.map((item, index) => (
                <option key={index} value={item.title}>
                  {item.title}
                </option>
              ))
            ) : (
              <option value="">No unit found</option>
            )}
          </select>
          {itemErrors.unit && <div className="errorMsg">{itemErrors.unit}</div>}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="default" onClick={closeItemModal}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submitItem}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
