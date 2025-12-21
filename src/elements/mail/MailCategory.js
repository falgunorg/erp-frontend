import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { Modal, Button } from "react-bootstrap";

export default function MailCategory() {
  const [categories, setCategories] = useState([
    {
      id: 1,
      title: "Buyer",
      color: "#707070",
      emails: [
        "info@fashion-product.com",
        "info@garan.com",
        "info@next.com",
        "info@lcw.com",
      ],
    },
    {
      id: 2,
      title: "Supplier",
      color: "#FF5733",
      emails: [
        "supplier@textiles.com",
        "supplier@cottonworld.com",
        "info@fabricsupply.com",
      ],
    },
    {
      id: 3,
      title: "Logistics",
      color: "#337DFF",
      emails: [
        "shipping@logistics.com",
        "tracking@fastcargo.com",
        "support@freightline.com",
      ],
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [categoryData, setCategoryData] = useState({
    id: null,
    title: "",
    color: "#000000",
    emails: [],
  });

  const allEmails = [
    ...new Set(categories.flatMap((category) => category.emails)),
  ].map((email) => ({ value: email, label: email }));

  const openModal = (
    mode,
    category = { id: null, title: "", color: "#000000", emails: [] }
  ) => {
    setModalMode(mode);
    setCategoryData(category);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCategoryData({ id: null, title: "", color: "#000000", emails: [] });
  };

  const handleSave = () => {
    if (modalMode === "add") {
      setCategories([...categories, { id: Date.now(), ...categoryData }]);
    } else {
      setCategories(
        categories.map((category) =>
          category.id === categoryData.id ? categoryData : category
        )
      );
    }
    closeModal();
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  const selectCategory = (category) => {
    alert(category.title);
  };

  return (
    <div>
      <button
        style={{ fontSize: "12px", padding: "10px 0" }}
        className="btn btn-link"
        onClick={() => openModal("add")}
      >
        + Add New
      </button>
      <ul>
        {categories.length > 0 ? (
          categories.map((category) => (
            <li
              key={category.id}
              style={{ fontSize: "12px" }}
              className="d-flex justify-content-between align-items-center mb-2"
            >
              <div
                onClick={() => selectCategory(category)}
                style={{ cursor: "pointer" }}
              >
                <i
                  style={{ color: category.color }}
                  className="fa fa-square"
                ></i>{" "}
                {category.title}
              </div>

              <div style={{ fontSize: "9px", color: "#707070" }}>
                <i
                  style={{ cursor: "pointer" }}
                  className="fas fa-pen me-2"
                  onClick={() => openModal("edit", category)}
                ></i>
                <i
                  style={{ cursor: "pointer" }}
                  className="fa fa-trash text-danger"
                  onClick={() => handleDeleteCategory(category.id)}
                ></i>
              </div>
            </li>
          ))
        ) : (
          <p>No categories yet.</p>
        )}
      </ul>

      <Modal show={modalOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === "add" ? "Add Category" : "Edit Category"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label className="form-label">Title</label>
          <input
            type="text"
            placeholder="Category Title"
            className="form-control mb-2"
            value={categoryData.title}
            onChange={(e) =>
              setCategoryData({ ...categoryData, title: e.target.value })
            }
          />
          <br />
          <label className="form-label">Color</label>
          <input
            type="color"
            className="form-control mb-2"
            value={categoryData.color}
            onChange={(e) =>
              setCategoryData({ ...categoryData, color: e.target.value })
            }
          />
          <br />
          <label className="form-label">Emails</label>
          <CreatableSelect
            isMulti
            name="emails"
            placeholder="Select or Search Emails"
            value={categoryData.emails.map((email) => ({
              value: email,
              label: email,
            }))}
            onChange={(selectedOptions) =>
              setCategoryData({
                ...categoryData,
                emails: selectedOptions.map((option) => option.value),
              })
            }
            options={allEmails}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {modalMode === "add" ? "Add" : "Update"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
