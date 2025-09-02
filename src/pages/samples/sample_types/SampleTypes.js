import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";
import Spinner from "../../../elements/Spinner";
import { Modal, Button } from "react-bootstrap";
import SampleTypeModal from "../../../elements/modals/SampleTypeModal";

export default function SampleTypes(props) {
  const [spinner, setSpinner] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // get all sampleTypes
  const [sampleTypes, setSampleTypes] = useState([]);
  const getSampleTypes = async () => {
    setSpinner(true);
    var response = await api.post("/merchandising/sors-types", {
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      buyer_id: filterData.buyer_id,
      num_of_row: filterData.num_of_row,
    });
    if (response.status === 200 && response.data) {
      setSampleTypes(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };
  const [buyers, setBuyers] = useState([]);
  const getBuyers = async () => {
    setSpinner(true);
    var response = await api.post("/common/buyers");
    if (response.status === 200 && response.data) {
      setBuyers(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const [filterData, setFilterData] = useState({
    from_date: "",
    to_date: "",
    buyer_id: "",
    num_of_row: 50,
  });
  const clearFields = () => {
    setFilterData({
      from_date: "",
      to_date: "",
      buyer_id: "",
      num_of_row: 20,
    });
  };

  const filterChange = (event) => {
    setFilterData({ ...filterData, [event.target.name]: event.target.value });
  };

  // term edit on modal

  const [editModal, setEditModal] = useState(false);
  const closeEditModal = () => {
    setEditModal(false);
  };
  const [editForm, setEditForm] = useState({
    title: "",
    buyer_id: "",
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
    if (!editForm.buyer_id) {
      formErrors.buyer_id = "Buyer is required";
    }
    setEditErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const openEditModal = async (id) => {
    setSpinner(true);
    var response = await api.post("/merchandising/sors-types-show", { id: id });
    if (response.status === 200 && response.data) {
      setEditModal(true);
      setEditForm(response.data.data);
      setSpinner(false);
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (validateEditForm()) {
      setSpinner(true);
      var response = await api.post("/merchandising/sors-types-update", editForm);
      if (response.status === 200 && response.data) {
        setEditModal(false);
        getSampleTypes();
      } else {
        setEditErrors(response.data.errors);
      }
      setSpinner(false);
    }
  };

  useEffect(async () => {
    getBuyers();
  }, []);

  useEffect(async () => {
    getSampleTypes();
  }, [filterData]);

  useEffect(async () => {
    getSampleTypes();
  }, [props.callSampleTypes]);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Sample Types</div>
        <div className="actions">
          <input
            type="search"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            className="form-control"
            placeholder="Search"
          />

          <Link
            to="#"
            onClick={() => props.setSampleTypeModal(true)}
            className="btn btn-warning bg-falgun rounded-circle"
          >
            <i className="fal fa-plus"></i>
          </Link>
        </div>
      </div>
      <div className="employee_lists">
        <div className="datrange_filter">
          <div className="row">
            <div className="col-lg-2">
              <div className="form-group">
                <label>From Date</label>
                <input
                  value={filterData.from_date}
                  onChange={filterChange}
                  name="from_date"
                  className="form-control"
                  type="date"
                />
              </div>
            </div>
            <div className="col-lg-2">
              <div className="form-group">
                <label>To Date</label>
                <input
                  onChange={filterChange}
                  value={filterData.to_date}
                  name="to_date"
                  className="form-control"
                  type="date"
                />
              </div>
            </div>
            <div className="col-lg-2">
              <label>Buyer</label>
              <select
                name="buyer_id"
                value={filterData.buyer_id}
                onChange={filterChange}
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
            </div>

            <div className="col-lg-2">
              <div className="form-group">
                <label>NUM Of Rows</label>
                <select
                  onChange={filterChange}
                  value={filterData.num_of_row}
                  name="num_of_row"
                  className="form-select"
                >
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="75">75</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>

            <div className="col-lg-2">
              <div className="form-group">
                <label>Refresh</label>
                <div>
                  <Link
                    to="#"
                    className="btn btn-warning"
                    onClick={clearFields}
                  >
                    <i className="fas fa-retweet"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table text-start align-middle table-bordered table-hover mb-0">
            <thead className="bg-dark text-white">
              <tr>
                <th>#</th>
                <th>title</th>
                <th>Buyer</th>
                <th>Added By </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchValue ? (
                <>
                  {sampleTypes
                    .filter((item) => {
                      if (!searchValue) return false;
                      const lowerCaseSearchValue = searchValue.toLowerCase();
                      return (
                        item.title
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.buyer?.name
                          .toLowerCase()
                          .includes(lowerCaseSearchValue)
                      );
                    })
                    .map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.title}</td>
                        <td>{item.buyer?.name} </td>
                        <td>{item.user?.full_name}</td>

                        <td>
                          {props.userData?.userId === item.user_id && (
                            <>
                              <Link
                                to="#"
                                onClick={() => openEditModal(item.id)}
                              >
                                <i className="fa fa-pen"></i>
                              </Link>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                </>
              ) : (
                <>
                  {sampleTypes.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.title}</td>
                      <td>{item.buyer?.name}</td>
                      <td>{item.user?.full_name}</td>
                      <td>
                        {props.userData?.userId === item.user_id && (
                          <>
                            <Link to="#" onClick={() => openEditModal(item.id)}>
                              <i className="fa fa-pen"></i>
                            </Link>
                          </>
                        )}
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
      <SampleTypeModal {...props} />

      <Modal show={editModal} onHide={closeEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Sample Type</Modal.Title>
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
                <label>
                  Buyer<sup>*</sup>
                </label>
                <select
                  name="buyer_id"
                  value={editForm.buyer_id}
                  onChange={handleEditChange}
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
                {editErrors.buyer_id && (
                  <div className="errorMsg">{editErrors.buyer_id}</div>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={closeEditModal}>
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
