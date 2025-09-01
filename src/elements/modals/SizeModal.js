import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import api from "../../services/api";

export default function SizeModal(props) {
  const [sizeTitle, setSizeTitle] = useState("");
  const [sizeError, setSizeError] = useState("");
  const closeSizeModal = () => {
    props.setSizeModal(false);
    setSizeError("");
    setSizeTitle("");
  };
  const submitSize = async () => {
    if (!sizeTitle) {
      setSizeError("Title is required");
    } else {
      var response = await api.post("/common/sizes-create", { title: sizeTitle });
      if (response.status === 200 && response.data) {
        setSizeError("");
        setSizeTitle("");
        props.setSizeModal(false);
        props.setCallSizes(true);
        setTimeout(() => {
          props.setCallSizes(false);
        }, 500); // 500 milliseconds delay
      } else {
        setSizeError(response.data.errors.title);
      }
    }
  };

  return (
    <Modal size="sm" show={props.sizeModal} onHide={closeSizeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Add Size</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <label>Title</label>
          <input
            value={sizeTitle}
            onChange={(e) => setSizeTitle(e.target.value)}
            type="text"
            className="form-control"
          />
          {sizeError && <div className="errorMsg">{sizeError}</div>}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="default" onClick={closeSizeModal}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submitSize}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
