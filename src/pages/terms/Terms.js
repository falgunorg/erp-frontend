import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Spinner from "../../elements/Spinner";
import { Modal, Button } from "react-bootstrap";
import Quill from "quill";

export default function Terms(props) {
  const [spinner, setSpinner] = useState(false);

  const [searchValue, setSearchValue] = useState("");

  const [message, setMessage] = useState("");
  const handleMsgChange = (value) => {
    setMessage(value);
  };

  // get all terms
  const [terms, setTerms] = useState([]);
  const getTerms = async () => {
    setSpinner(true);
    var response = await api.post("/admin/terms");
    if (response.status === 200 && response.data) {
      setTerms(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  // term add on modal
  const [termModal, setTermModal] = useState(false);
  const closeTermModal = () => {
    setTermModal(false);
  };

  const [errors, setErrors] = useState({});
  const [formDataSet, setFormDataSet] = useState({
    title: "",
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
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      var data = new FormData();
      data.append("title", formDataSet.title);
      data.append("description", message);

      setSpinner(true);
      var response = await api.post("/admin/terms-create", data);
      if (response.status === 200 && response.data) {
        setTermModal(false);
        getTerms();
      } else {
        console.log(response.data.errors);
        setErrors(response.data.errors);
      }
      setSpinner(false);
    }
  };

  // term edit on modal

  const [editMessage, setEditMessage] = useState("");

  const handleEditMsgChange = (value) => {
    setEditMessage(value);
  };

  const [editModal, setEditModal] = useState(false);

  const closeEditModal = () => {
    setEditModal(false);
  };

  const [editForm, setEditForm] = useState({
    title: "",
  });
  const [editErrors, setEditErrors] = useState({});

  const handleEditChange = (ev) => {
    setEditForm({
      ...editForm,
      [ev.target.name]: ev.target.value,
    });
  };

  const validateEditForm = () => {
    let formErrors = {};
    if (!editForm.title) {
      formErrors.title = "Title is required";
    }
    setEditErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const openEditModal = async (id) => {
    setSpinner(true);

    var response = await api.post("/admin/terms-show", { id: id });
    if (response.status === 200 && response.data) {
      setEditModal(true);
      setEditForm(response.data.data);
      setSpinner(false);
      setEditMessage(response.data.data.description);
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (validateEditForm()) {
      var data = new FormData();
      data.append("title", editForm.title);
      data.append("description", editMessage);
      data.append("id", editForm.id);
      setSpinner(true);
      var response = await api.post("/admin/terms-update", data);
      if (response.status === 200 && response.data) {
        setEditModal(false);
        getTerms();
      } else {
        console.log(response.data.errors);
        setErrors(response.data.errors);
      }
      setSpinner(false);
    }
  };

  useEffect(async () => {
    getTerms();
  }, []);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Terms</div>
        <div className="actions">
          <input
            type="search"
            onChange={(e) => setSearchValue(e.target.value)}
            // type="text"
            value={searchValue}
            className="form-control"
            placeholder="Search"
          />

          {props.rolePermission?.Employee?.add_edit ? (
            <Link
              to="#"
              onClick={() => setTermModal(true)}
              className="btn btn-warning bg-falgun rounded-circle"
            >
              <i className="fal fa-plus"></i>
            </Link>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="employee_lists">
        <div className="table-responsive">
          <table className="table">
            <thead className="bg-dark text-white">
              <tr>
                <th>#</th>
                <th>title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchValue ? (
                <>
                  {terms
                    .filter((item) => {
                      if (!searchValue) return false;
                      const lowerCaseSearchValue = searchValue.toLowerCase();
                      return item.title
                        .toLowerCase()
                        .includes(lowerCaseSearchValue);
                    })
                    .map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.title}</td>
                        <td>
                          <>
                            <Link to="#" onClick={() => openEditModal(item.id)}>
                              <i className="fa fa-pen"></i>
                            </Link>
                          </>
                        </td>
                      </tr>
                    ))}
                </>
              ) : (
                <>
                  {terms.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.title}</td>
                      <td>
                        <>
                          <Link to="#" onClick={() => openEditModal(item.id)}>
                            <i className="fa fa-pen"></i>
                          </Link>
                        </>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <br />
      <br />

      <Modal size="lg" show={termModal} onHide={closeTermModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Term</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-lg-12">
              <div className="form-group">
                <label>
                  Term Title <sup>*</sup>
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
                <label>Description</label>
                <Quill className="text_area" onChange={handleMsgChange} />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeTermModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal size="lg" show={editModal} onHide={closeEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Term</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-lg-12">
              <div className="form-group">
                <label>
                  Term Name <sup>*</sup>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                />
                {editErrors.title && (
                  <div className="errorMsg">{editErrors.title}</div>
                )}
              </div>
            </div>
            <div className="col-lg-12">
              <div className="form-group">
                <label>Description</label>
                <Quill className="text_area" onChange={handleEditMsgChange}
                value={editMessage}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
