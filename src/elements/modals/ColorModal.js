import React, { useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import api from "../../services/api";
export default function ColorModal(props) {
  const [colorTitle, setColorTitle] = useState("");
  const [colorError, setColorError] = useState("");
  const closeColorModal = () => {
    props.setColorModal(false);
    setColorError("");
    setColorTitle("");
  };

  const submitColor = async () => {
    if (!colorTitle) {
      setColorError("Title is required");
    } else {
      var response = await api.post("/common/colors-create", { title: colorTitle });
      if (response.status === 200 && response.data) {
        // getColors();
        setColorError("");
        setColorTitle("");
        props.setColorModal(false);
        props.setCallColors(true);
        setTimeout(() => {
          props.setCallColors(false);
        }, 500); // 500 milliseconds delay
      } else {
        setColorError(response.data.errors.title);
      }
    }
  };

  return (
    <Modal size="sm" show={props.colorModal} onHide={closeColorModal}>
      <Modal.Header closeButton>
        <Modal.Title>Add Color</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <label>Title</label>
          <input
            value={colorTitle}
            onChange={(e) => setColorTitle(e.target.value)}
            type="text"
            className="form-control"
          />
          {colorError && <div className="errorMsg">{colorError}</div>}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="default" onClick={closeColorModal}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submitColor}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
