import React, { useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import api from "../../services/api";

export default function UnitModal(props) {
  // unit modal start

  const closeUnitModal = () => {
    props.setUnitModal(false);
    setUnitError("");
    setUnitTitle("");
  };
  const [unitTitle, setUnitTitle] = useState("");
  const [unitError, setUnitError] = useState("");

  const submitUnit = async () => {
    if (!unitTitle) {
      setUnitError("Title is required");
    } else {
      var response = await api.post("/units-create", { title: unitTitle });
      if (response.status === 200 && response.data) {
        // getUnits();
        setUnitError("");
        setUnitTitle("");
        props.setUnitModal(false);
        props.setCallUnits(true);
        setTimeout(() => {
          props.setCallUnits(false);
        }, 500); // 500 milliseconds delay
      } else {
        setUnitError(response.data.errors.title);
      }
    }
  };
  return (
    <Modal size="sm" show={props.unitModal} onHide={closeUnitModal}>
      <Modal.Header closeButton>
        <Modal.Title>Add Unit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <label>Title</label>
          <input
            value={unitTitle}
            onChange={(e) => setUnitTitle(e.target.value)}
            type="text"
            className="form-control"
          />
          {unitError && <div className="errorMsg">{unitError}</div>}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="default" onClick={closeUnitModal}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submitUnit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
