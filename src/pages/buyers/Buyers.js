import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { faEllipsisH, faL } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../../services/api";
import Spinner from "../../elements/Spinner";
import { Modal, Button } from "react-bootstrap";
import Pagination from "../../elements/Pagination";
import BuyerModal from "../../elements/modals/BuyerModal";

export default function Buyers(props) {
  const [spinner, setSpinner] = useState(false);
  const history = useHistory();
  const [page, setPage] = useState(1);
  const onPageChange = (page) => {
    setPage(page);
  };

  const [paginationData, setPaginationData] = useState([]);

  // filtering
  const [filterModal, setFilterModal] = useState(false);
  const openFilterModal = () => {
    setFilterModal(true);
  };
  const closeFilterModal = () => {
    setFilterModal(false);
  };
  const [filterData, setFilterData] = useState({
    status: "",
    country: "",
  });
  const filterChange = (event) => {
    setFilterData({ ...filterData, [event.target.name]: event.target.value });
  };

  const clearFields = () => {
    setFilterData({
      status: "",
      country: "",
    });
  };

  // get all buyers
  const [buyers, setBuyers] = useState([]);
  const getBuyers = async () => {
    setSpinner(true);
    var response = await api.post("/common/buyers", {
      page: page,
      perPage: 50,
      country: filterData.country,
      status: filterData.status,
    });

    if (response.status === 200 && response.data) {
      setBuyers(response.data.data);
      setPaginationData(response.data.paginationData);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const [countries, setCountries] = useState([]);
  const getCountries = async () => {
    var response = await api.get("/common/countries");
    if (response.status === 200 && response.data) {
      setCountries(response.data);
    }
  };

  const [editModal, setEditModal] = useState(false);

  const closeEditModal = () => {
    setEditModal(false);
  };

  const [editForm, setEditForm] = useState({
    name: "",
    country: "",
    status: "",
    address: "",
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
    if (!editForm.name) {
      formErrors.name = "Name is required";
    }

    if (!editForm.country) {
      formErrors.country = "Country is required";
    }
    if (!editForm.status) {
      formErrors.status = "Status is required";
    }
    setEditErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const openEditModal = async (id) => {
    setSpinner(true);
    var response = await api.post("/common/buyers-show", { id: id });
    if (response.status === 200 && response.data) {
      setEditModal(true);
      setEditForm(response.data.data);
      setSpinner(false);
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (validateEditForm()) {
      var data = new FormData();
      data.append("name", editForm.name);
      data.append("country", editForm.country);
      data.append("address", editForm.address);
      data.append("status", editForm.status);
      data.append("id", editForm.id);
      setSpinner(true);
      var response = await api.post("/common/buyers-update", data);
      if (response.status === 200 && response.data) {
        setEditModal(false);
        getBuyers();
      } else {
        console.log(response.data.errors);
        setEditErrors(response.data.errors);
      }
      setSpinner(false);
    }
  };

  useEffect(async () => {
    getCountries();
  }, []);

  useEffect(async () => {
    getBuyers();
  }, [page]);
  useEffect(async () => {
    getBuyers();
  }, [filterData]);

  useEffect(async () => {
    getBuyers();
  }, [props.callBuyers]);

  useEffect(async () => {
    props.setHeaderData({
      pageName: "Buyers",
      isModalButton: true,
      modalButtonRef: "buyerModal",
      isNewButton: false,
      newButtonLink: "",
      isInnerSearch: true,
      innerSearchValue: "",
      isDropdown: false,
      DropdownMenu: [],
    });
  }, []);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="actions">
          <button onClick={openFilterModal}>
            <FontAwesomeIcon icon={faEllipsisH} />
          </button>
          {/* {props.rolePermission?.Employee?.add_edit ? (
            <Link
              onClick={() => {
                props.setBuyerModal(true);
              }}
              className="btn btn-warning bg-falgun rounded-circle"
            >
              <i className="fal fa-plus"></i>
            </Link>
          ) : (
            ""
          )} */}
        </div>
      </div>
      <div className="employee_lists">
        <div className="table-responsive">
          <table className="table text-start align-middle table-bordered table-hover mb-0">
            <thead className="bg-dark text-white">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Country</th>
                <th>Address</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {props.headerData?.innerSearchValue ? (
                <>
                  {buyers
                    .filter((item) => {
                      if (!props.headerData?.innerSearchValue) return false;
                      const lowerCaseinnerSearchValue =
                        props.headerData?.innerSearchValue.toLowerCase();
                      return item.name
                        .toLowerCase()
                        .includes(lowerCaseinnerSearchValue);
                    })
                    .map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.country}</td>
                        <td>{item.address}</td>
                        <td>{item.status}</td>
                        <td>
                          <>
                            <Link onClick={() => openEditModal(item.id)}>
                              <i className="fa fa-pen"></i>
                            </Link>
                          </>
                        </td>
                      </tr>
                    ))}
                </>
              ) : (
                <>
                  {buyers.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.country}</td>
                      <td>{item.address}</td>
                      <td>{item.status}</td>
                      <td>
                        <>
                          <Link onClick={() => openEditModal(item.id)}>
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
      <div className="text-center">
        {/* <Pagination data={paginationData} onPageChange={onPageChange} /> */}
      </div>

      <BuyerModal {...props} />

      <Modal show={filterModal} onHide={closeFilterModal}>
        <Modal.Header closeButton>
          <Modal.Title>Filter Buyers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Status</label>
            <select
              onChange={filterChange}
              name="status"
              value={filterData.status}
              className="form-select"
            >
              <option value="">Select Status</option>
              <option value="Inactive">Inactive</option>
              <option value="Active">Active</option>
            </select>
          </div>

          <div className="form-group">
            <label>Country</label>
            <select
              onChange={filterChange}
              value={filterData.country}
              name="country"
              className="form-select"
            >
              <option value="">Select country</option>
              {countries.map((item, index) => (
                <option key={index} value={item.nicename}>
                  {item.nicename}
                </option>
              ))}
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="default" onClick={clearFields}>
            Clear
          </Button>
          <Button variant="primary" onClick={closeFilterModal}>
            Filter
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={editModal} onHide={closeEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Buyer</Modal.Title>
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
                  value={editForm.name}
                  onChange={handleEditChange}
                />
                {editErrors.name && (
                  <div className="errorMsg">{editErrors.name}</div>
                )}
              </div>
            </div>

            <div className="col-lg-6">
              <div className="form-group">
                <label>
                  Country<sup>*</sup>
                </label>
                <select
                  name="country"
                  value={editForm.country}
                  onChange={handleEditChange}
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
                {editErrors.country && (
                  <div className="errorMsg">{editErrors.country}</div>
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
                  value={editForm.status}
                  onChange={handleEditChange}
                  className="form-select"
                >
                  <option value="">Select Status</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Active">Active</option>
                </select>
                {editErrors.status && (
                  <div className="errorMsg">{editErrors.status}</div>
                )}
              </div>
            </div>

            <div className="col-lg-12">
              <div className="form-group">
                <label>Address</label>

                <textarea
                  value={editForm.address}
                  onChange={handleEditChange}
                  name="address"
                  className="form-control"
                ></textarea>
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
