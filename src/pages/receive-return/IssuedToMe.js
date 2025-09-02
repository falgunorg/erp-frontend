import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "../../services/api";
import Spinner from "../../elements/Spinner";
import moment from "moment/moment";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import swal from "sweetalert";

export default function IssuedToMe(props) {
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);
  const [imageURL, setImageUrl] = useState(null);
  const [imageModal, setImageModal] = useState(false);
  const openImageModal = (url) => {
    setImageUrl(url);
    setImageModal(true);
  };
  const closeImageModal = () => {
    setImageUrl(null);
    setImageModal(false);
  };

  const [searchValue, setSearchValue] = useState("");
  const [filterData, setFilterData] = useState({
    from_date: "",
    to_date: "",
    num_of_row: 20,
    buyer_id: "",
    techpack_id: "",
  });
  const filterChange = (name, value) => {
    setFilterData({ ...filterData, [name]: value });
  };
  const clearFields = () => {
    setFilterData({
      from_date: "",
      to_date: "",
      num_of_row: 20,
      buyer_id: "",
      techpack_id: "",
    });
  };
  // get all issues
  const [issues, setIssues] = useState([]);
  const getIssues = async () => {
    setSpinner(true);
    var response = await api.post("/store/issued-to-me", {
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      num_of_row: filterData.num_of_row,
      buyer_id: filterData.buyer_id,
      techpack_id: filterData.techpack_id,
    });

    if (response.status === 200 && response.data) {
      setIssues(response.data.data);
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

  // techpacks
  const [techpacks, setTechpacks] = useState([]);
  const getTechpacks = async () => {
    setSpinner(true);
    var response = await api.post("/merchandising/techpacks");
    if (response.status === 200 && response.data) {
      setTechpacks(response.data.all_items);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  // issueModal
  const [issueModal, setIssueModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [formDataSet, setFormDataSet] = useState({});
  const openIssueModal = async (item_id) => {
    setSpinner(true);
    var response = await api.post("/store/issues-show", { id: item_id });
    if (response.status === 200 && response.data) {
      setFormDataSet(response.data.data);
      setIssueModal(true);
    }
    setSpinner(false);
  };
  const closeIssueModal = () => {
    setIssueModal(false);
    setErrors({});
    setFormDataSet({});
  };

  const handleChange = (ev) => {
    let formErrors = {};
    const name = ev.target.name;
    const value = ev.target.value;
    if (name === "return_qty" && Number(value) > formDataSet.qty) {
      formErrors.return_qty = "Cannot return over balance qty";
    }
    setFormDataSet({
      ...formDataSet,
      [name]: value,
    });

    setErrors(formErrors);
  };
  const validateForm = () => {
    let formErrors = {};
    if (!formDataSet.return_qty) {
      formErrors.return_qty = "Please Insert Return QTY";
    }
    if (Number(formDataSet.return_qty) > formDataSet.qty) {
      formErrors.return_qty = "Cannot return over qty";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      var response = await api.post("/store/returns-create", formDataSet);
      if (response.status === 200 && response.data) {
        setFormDataSet({});
        setErrors({});
        setIssueModal(false);
        swal({
          title: "Successfully Return Item",
          icon: "success",
        });
        getIssues();
      } else {
        setErrors(response.data.errors);
      }
    }
  };

  // add to sample store functionality

  const [addStoreModal, setAddStoreModal] = useState(false);
  const [storeErrors, setStoreErrors] = useState({});
  const [storeForm, setStoreForm] = useState({});
  const openStoreModal = async (item_id) => {
    setSpinner(true);
    var response = await api.post("/store/issues-show", { id: item_id });
    if (response.status === 200 && response.data) {
      setStoreForm(response.data.data);
      setAddStoreModal(true);
    }
    setSpinner(false);
  };

  const closeStoreModal = () => {
    setAddStoreModal(false);
    setStoreErrors({});
    setStoreForm({});
  };

  const handleStoreChange = (ev) => {
    let formErrors = {};
    const name = ev.target.name;
    const value = ev.target.value;
    setStoreForm({
      ...storeForm,
      [name]: value,
    });
  };

  const validateStoreForm = () => {
    let formErrors = {};
    if (!storeForm.code) {
      formErrors.code = "Please Insert Code";
    }
    if (!storeForm.description) {
      formErrors.description = "Please Insert Title";
    }

    setStoreErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };
  const handleStoreSubmit = async (event) => {
    event.preventDefault();
    if (validateStoreForm()) {
      var response = await api.post("/sample/sample-stores-inject", storeForm);
      if (response.status === 200 && response.data) {
        setStoreForm({});
        setStoreErrors({});
        setAddStoreModal(false);
        swal({
          title: "Successfully Added Item",
          icon: "success",
        });
        getIssues();
      } else {
        setStoreErrors(response.data.errors);
      }
    }
  };

  // item Default
  useEffect(async () => {
    getBuyers();
    getTechpacks();
  }, []);

  useEffect(async () => {
    getIssues();
  }, [filterData]);

  useEffect(async () => {
    props.setSection("receive-return");
  }, []);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Receives From Store</div>
        <div className="actions">
          <input
            type="search"
            onChange={(e) => setSearchValue(e.target.value)}
            // type="text"
            value={searchValue}
            className="form-control"
            placeholder="Search"
          />
        </div>
      </div>
      <div className="employee_lists">
        <div className="datrange_filter">
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label>From Date</label>
                <input
                  value={filterData.from_date}
                  onChange={(event) =>
                    filterChange("from_date", event.target.value)
                  }
                  name="from_date"
                  className="form-control"
                  type="date"
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>To Date</label>
                <input
                  onChange={(event) =>
                    filterChange("to_date", event.target.value)
                  }
                  value={filterData.to_date}
                  name="to_date"
                  className="form-control"
                  type="date"
                />
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label>Buyer</label>
                <Select
                  placeholder="Select"
                  onChange={(selectedOption) =>
                    filterChange("buyer_id", selectedOption.value)
                  }
                  value={
                    buyers.find((item) => item.id === filterData.buyer_id)
                      ? {
                          value: filterData.buyer_id,
                          label:
                            buyers.find(
                              (item) => item.id === filterData.buyer_id
                            ).name || "",
                        }
                      : null
                  }
                  name="buyer_id"
                  options={buyers.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                />
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label>Style</label>
                <Select
                  placeholder="Select"
                  value={
                    techpacks.find((item) => item.id === filterData.techpack_id)
                      ? {
                          value: filterData.techpack_id,
                          label:
                            techpacks.find(
                              (item) => item.id === filterData.techpack_id
                            ).title || "",
                        }
                      : null
                  }
                  onChange={(selectedOption) =>
                    filterChange("techpack_id", selectedOption.value)
                  }
                  name="techpack_id"
                  options={techpacks.map((item) => ({
                    value: item.id,
                    label: item.title,
                  }))}
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>NUM Of Rows</label>
                <div className="d-flex gap_10">
                  <select
                    onChange={(event) =>
                      filterChange("num_of_row", event.target.value)
                    }
                    value={filterData.num_of_row}
                    name="num_of_row"
                    className="form-select"
                  >
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="75">75</option>
                    <option value="100">100</option>
                  </select>
                  <Link to="#" className="btn btn-warning" onClick={clearFields}>
                    <i className="fas fa-retweet"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead className="bg-dark text-white">
              <tr>
                <th>#</th>
                <th>DCN</th>
                <th>Date</th>
                <th>Photo</th>
                <th>Buyer</th>
                <th>Style</th>
                <th>Item</th>
                <th>Details</th>
                <th>Qty</th>
                <th>Returned</th>
                <th>Issued By</th>
                <th>Reference</th>
                <th>Line</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {searchValue ? (
                <>
                  {issues
                    .filter((item) => {
                      if (!searchValue) return false;
                      const lowerCaseSearchValue = searchValue.toLowerCase();
                      return (
                        item.booking_number
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.supplier
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.buyer
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.techpack
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.delivery_challan
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.issue_by
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.reference
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.item_name
                          .toLowerCase()
                          .includes(lowerCaseSearchValue)
                      );
                    })
                    .map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <a target="_blank" href={item.challan_file} download>
                            {item.delivery_challan}
                          </a>
                        </td>

                        <td>{moment(item.created_at).format("ll")}</td>
                        <td>
                          <img
                            onClick={() => openImageModal(item.image_source)}
                            style={{
                              height: "50px",
                              width: "50px",
                              border: "1px solid gray",
                              borderRadius: "3px",
                              cursor: "pointer",
                            }}
                            src={item.image_source}
                          />
                        </td>
                        <td>{item.buyer}</td>
                        <td>{item.techpack}</td>
                        <td>{item.item_name}</td>
                        <td>{item.description}</td>
                        <td>
                          {item.qty} {item.unit}
                        </td>
                        <td>{item.returned_qty}</td>
                        <td>{item.issue_by}</td>
                        <td>{item.reference}</td>
                        <td>{item.line}</td>

                        <td>
                          <div className="text-center">
                            {props.userData?.designation_title ===
                            "Asst. Merchandiser" ? (
                              <>
                                {item.status === "Issued" && (
                                  <Link to="#"
                                    className="btn btn-success btn-sm mr-10"
                                    onClick={() => openStoreModal(item.id)}
                                  >
                                    Add To Sample Store
                                  </Link>
                                )}
                              </>
                            ) : (
                              <>
                                {item.qty !== item.returned_qty && (
                                  <Link to="#"
                                    className="btn btn-warning btn-sm"
                                    onClick={() => openIssueModal(item.id)}
                                  >
                                    Return
                                  </Link>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </>
              ) : (
                <>
                  {issues.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <a target="_blank" href={item.challan_file} download>
                          {item.delivery_challan}
                        </a>
                      </td>

                      <td>{moment(item.created_at).format("ll")}</td>
                      <td>
                        <img
                          onClick={() => openImageModal(item.image_source)}
                          style={{
                            height: "50px",
                            width: "50px",
                            border: "1px solid gray",
                            borderRadius: "3px",
                            cursor: "pointer",
                          }}
                          src={item.image_source}
                        />
                      </td>
                      <td>{item.buyer}</td>
                      <td>{item.techpack}</td>
                      <td>{item.item_name}</td>
                      <td>{item.description}</td>
                      <td>
                        {item.qty} {item.unit}
                      </td>
                      <td>{item.returned_qty}</td>
                      <td>{item.issue_by}</td>
                      <td>{item.reference}</td>
                      <td>{item.line}</td>
                      <td>
                        <div className="text-center">
                          {props.userData?.designation_title ===
                          "Asst. Merchandiser" ? (
                            <>
                              {item.status === "Issued" && (
                                <Link to="#"
                                  className="btn btn-success btn-sm mr-10"
                                  onClick={() => openStoreModal(item.id)}
                                >
                                  Add To Sample Store
                                </Link>
                              )}
                            </>
                          ) : (
                            <>
                              {item.qty !== item.returned_qty && (
                                <Link to="#"
                                  className="btn btn-warning btn-sm"
                                  onClick={() => openIssueModal(item.id)}
                                >
                                  Return
                                </Link>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Modal show={issueModal} onHide={closeIssueModal}>
        <Modal.Header closeButton>
          <Modal.Title>Return Items To Store</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <img style={{ width: "150px" }} src={formDataSet.image_source} />
          </div>
          <br />
          <div className="row">
            <div className="col-lg-6">
              <div className="form-group">
                <br />
                <label>Balance</label>
                <input
                  type="number"
onWheel={(event) => event.target.blur()}
                  disabled
                  min={1}
                  className="form-control"
                  name="qty"
                  value={formDataSet.qty}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group">
                <br />
                <label>Return QTY</label>
                <input
                  type="number"
onWheel={(event) => event.target.blur()}
                  className="form-control"
                  name="return_qty"
                  min={1}
                  value={formDataSet.return_qty}
                  onChange={handleChange}
                />
                {errors.return_qty && (
                  <div className="errorMsg">{errors.return_qty}</div>
                )}
              </div>
            </div>

            <div className="col-lg-12">
              <div className="form-group">
                <br />
                <label>Remarks/Note</label>
                <textarea
                  onChange={handleChange}
                  value={formDataSet.remarks}
                  name="remarks"
                  className="form-control"
                ></textarea>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="danger" onClick={closeIssueModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={imageModal} onHide={closeImageModal}>
        <Modal.Header closeButton>
          <Modal.Title>Item Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img style={{ width: "100%" }} src={imageURL} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeImageModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={addStoreModal} onHide={closeStoreModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add to Sample Store</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <img style={{ width: "150px" }} src={storeForm.image_source} />
          </div>
          <br />
          <div className="row">
            <div className="col-lg-12">
              <div className="form-group">
                <br />
                <label>Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  value={storeForm.description}
                  onChange={handleStoreChange}
                />
                {storeErrors.description && (
                  <div className="errorMsg">{storeErrors.description}</div>
                )}
              </div>
            </div>

            <div className="col-lg-6">
              <div className="form-group">
                <br />
                <label>Code</label>
                <input
                  type="text"
                  className="form-control"
                  name="code"
                  value={storeForm.code}
                  onChange={handleStoreChange}
                />
                {storeErrors.code && (
                  <div className="errorMsg">{storeErrors.code}</div>
                )}
              </div>
            </div>

            <div className="col-lg-6">
              <div className="form-group">
                <br />
                <label>Buyer</label>
                <select
                  name="buyer_id"
                  value={storeForm.buyer_id}
                  onChange={handleStoreChange}
                  className="form-select"
                >
                  <option value="">Select One</option>
                  {buyers.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {storeErrors.buyer_id && (
                  <div className="errorMsg">{storeErrors.buyer_id}</div>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group">
                <br />
                <label>Style/Techpack</label>

                <select
                  name="techpack_id"
                  value={storeForm.techpack_id}
                  onChange={handleStoreChange}
                  className="form-select"
                >
                  <option value="">Select One </option>
                  {techpacks.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
                {storeErrors.techpack_id && (
                  <div className="errorMsg">{storeErrors.techpack_id}</div>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group">
                <br />
                <label>Description</label>
                <textarea
                  className="form-control"
                  name="short_description"
                  value={storeForm.short_description}
                  onChange={handleStoreChange}
                ></textarea>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleStoreSubmit}>
            Import
          </Button>
          <Button variant="danger" onClick={closeStoreModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <br />
      <br />
    </div>
  );
}
