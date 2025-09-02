import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "../../../services/api";
import Spinner from "../../../elements/Spinner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Modal, Button } from "react-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown";
import swal from "sweetalert";
import moment from "moment/moment";

export default function SampleStore(props) {
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
  const history = useHistory();

  const [filterData, setFilterData] = useState({
    from_date: "",
    to_date: "",
    num_of_row: 20,
    buyer_id: "",
    item_type: "",
  });
  const clearFields = () => {
    setFilterData({
      from_date: "",
      to_date: "",
      num_of_row: 20,
      buyer_id: "",
      item_type: "",
    });
  };

  const filterChange = (event) => {
    setFilterData({ ...filterData, [event.target.name]: event.target.value });
  };
  const [selectedItems, setSelectedItems] = useState([]);
  const [options, setOptions] = useState([]);
  const handleCheckboxChange = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };
  const handleSelectAll = () => {
    if (selectedItems.length === options.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(options.map((option) => option.id));
    }
  };
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleDropdownSelect = (eventKey) => {
    setDropdownOpen(false);
  };
  const handleFilterClick = () => {
    getStores();
    setDropdownOpen(false);
  };

  // get all stores
  const [stores, setStores] = useState([]);
  const getStores = async () => {
    setSpinner(true);
    var response = await api.post("/sample/sample-stores", {
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      num_of_row: filterData.num_of_row,
      filter_items: selectedItems,
      buyer_id: filterData.buyer_id,
      item_type: filterData.item_type,
    });
    if (response.status === 200 && response.data) {
      setStores(response.data.data);
      setOptions(response.data.allData);
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

  const [items, setItems] = useState([]);
  const getItems = async () => {
    setSpinner(true);
    var response = await api.post("/common/items");
    if (response.status === 200 && response.data) {
      setItems(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  // Details on Modal
  const [storeModal, setStoreModal] = useState(false);
  const closeStoreModal = () => {
    setStoreModal(false);
  };
  const [storeDetails, setStoreDetails] = useState({});
  const getStoreDetails = async (id) => {
    setSpinner(true);
    var response = await api.post("/sample/sample-stores-show", { id: id });
    if (response.status === 200 && response.data) {
      setStoreDetails(response.data.data);
      setStoreModal(true);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const generatePdf = () => {
    const input = document.getElementById("pdf_container");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("sor.pdf");
    });
  };

  const PrintPdf = () => {
    const input = document.getElementById("pdf_container");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Open the print dialog
      pdf.autoPrint();
      window.open(pdf.output("bloburl"), "_blank");
    });
  };

  const [incrementForm, setIncrementForm] = useState({
    sample_store_id: "",
    qty: 0,
    reference: "",
    remarks: "",
  });
  const [incrementModal, setIncrementModal] = useState(false);
  const closeIncrementModal = () => {
    setIncrementModal(false);
  };

  const openIncrementModal = (id) => {
    setIncrementForm({ sample_store_id: id });
    setIncrementModal(true);
  };

  const incrementChange = (ev) => {
    setIncrementForm({
      ...incrementForm,
      [ev.target.name]: ev.target.value,
    });
  };

  const submitIncrement = async () => {
    if (!incrementForm.qty > 0) {
      swal({
        title: "Quantity is Must be greater than 0.",
        icon: "error",
      });
      return;
    } else {
      var response = await api.post(
        "/sample/sample-stores-increment",
        incrementForm
      );
      if (response.status === 200 && response.data) {
        getStores();
        setIncrementModal(false);
      }
    }
  };

  useEffect(async () => {
    getStores();
    getBuyers();
    getItems();
  }, []);
  useEffect(async () => {
    getStores();
  }, [filterData]);
  useEffect(async () => {
    props.setSection("sample");
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      const allowedDepartments = ["Merchandising", "Sample"];
      if (!allowedDepartments.includes(props.userData?.department_title)) {
        await swal({
          icon: "error",
          text: "You Cannot Access This Section.",
          closeOnClickOutside: false,
        });
        history.push("/dashboard");
      }
    };
    checkAccess();
  }, [props.userData?.department_title, history]);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Store</div>
        <div className="actions">
          <input
            type="search"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            className="form-control"
            placeholder="Search"
          />
          {props.rolePermission?.Employee?.add_edit ? (
            <Link
              to="/sample/stores-create"
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
        <div className="datrange_filter">
          <div className="row">
            <div className="col">
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
            <div className="col">
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
            <div className="col">
              <div className="form-group">
                <label>Buyer</label>
                <select
                  onChange={filterChange}
                  value={filterData.buyer_id}
                  name="buyer_id"
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
            </div>
            <div className="col">
              <div className="form-group">
                <label>Item Type</label>
                <select
                  onChange={filterChange}
                  value={filterData.item_type}
                  name="item_type"
                  className="form-select"
                >
                  <option value="">Select Item</option>
                  {items.length > 0 ? (
                    items.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.title}
                      </option>
                    ))
                  ) : (
                    <option value="">No items found</option>
                  )}
                </select>
              </div>
            </div>
            <div className="col">
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
                  <option value="200">200</option>
                  <option value="500">500</option>
                </select>
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label></label>
                <NavDropdown
                  title="Filter by STR No"
                  id="stores"
                  show={dropdownOpen}
                  onToggle={(isOpen) => setDropdownOpen(isOpen)}
                >
                  <div
                    style={{ paddingLeft: 5, paddingRight: 5 }}
                    className="dropdown-checkbox-list"
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.length === options.length}
                      onChange={handleSelectAll}
                    />{" "}
                    Select All
                    {options.map((option) => (
                      <div style={{ paddingLeft: 10 }} key={option.id}>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(option.id)}
                          onChange={() => handleCheckboxChange(option.id)}
                        />{" "}
                        <small>{option.store_number}</small>
                      </div>
                    ))}
                    <br />
                    <div className="d-flex justify-content-between">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={handleDropdownSelect}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleFilterClick}
                      >
                        Filter
                      </Button>
                    </div>
                  </div>
                </NavDropdown>
              </div>
            </div>

            <div className="col">
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
                <th>Photo</th>
                <th>MRR</th>
                <th>Item Title</th>
                <th>Type</th>
                <th>Code</th>
                <th>Buyer</th>
                <th>Style</th>
                <th>Size</th>
                <th>Color</th>
                <th>Unit</th>
                <th>Balance</th>
                <th>Reference</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {searchValue ? (
                <>
                  {stores
                    .filter((item) => {
                      if (!searchValue) return false;
                      const lowerCaseSearchValue = searchValue.toLowerCase();
                      return (
                        item.buyer
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.title
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.store_number
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.code.toLowerCase().includes(lowerCaseSearchValue)
                      );
                    })
                    .map((item, index) => (
                      <tr key={index}>
                        <td>
                          <img
                            onClick={() => openImageModal(item.file_source)}
                            style={{
                              width: "50px",
                              height: "50px",
                              border: "1px solid gray",
                              borderRadius: "3px",
                              cursor: "pointer",
                            }}
                            src={item.file_source}
                          />
                        </td>
                        <td>{item.store_number}</td>
                        <td>{item.title}</td>
                        <td>{item.item_type_name}</td>
                        <td>{item.code}</td>
                        <td>{item.buyer}</td>
                        <td>{item.techpack}</td>
                        <td>{item.size}</td>
                        <td>{item.color}</td>
                        <td>{item.unit}</td>
                        <td>{item.balance}</td>
                        <td>{item.reference_name}</td>

                        <td>
                          <Link
                            to="#"
                            onClick={() => openIncrementModal(item.id)}
                          >
                            <i className="fa fa-plus margin-10"></i>
                          </Link>
                          <Link to="#" onClick={() => getStoreDetails(item.id)}>
                            <i className="fa fa-eye margin-10 text-success"></i>
                          </Link>
                          {props.userData.userId === item.user_id &&
                          item.used < 1 ? (
                            <>
                              <Link to={"/sample/stores-edit/" + item.id}>
                                <i className="fa fa-pen margin-10 text-info"></i>
                              </Link>
                            </>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                </>
              ) : (
                <>
                  {stores.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          onClick={() => openImageModal(item.file_source)}
                          style={{
                            width: "50px",
                            height: "50px",
                            border: "1px solid gray",
                            borderRadius: "3px",
                            cursor: "pointer",
                          }}
                          src={item.file_source}
                        />
                      </td>
                      <td>{item.store_number}</td>
                      <td>{item.title}</td>
                      <td>{item.item_type_name}</td>
                      <td>{item.code}</td>
                      <td>{item.buyer}</td>
                      <td>{item.techpack}</td>
                      <td>{item.size}</td>
                      <td>{item.color}</td>
                      <td>{item.unit}</td>
                      <td>{item.balance}</td>
                      <td>{item.reference_name}</td>
                      <td>
                        <Link
                          to="#"
                          onClick={() => openIncrementModal(item.id)}
                        >
                          <i className="fa fa-plus margin-10"></i>
                        </Link>
                        <Link to="#" onClick={() => getStoreDetails(item.id)}>
                          <i className="fa fa-eye margin-10 text-success"></i>
                        </Link>

                        {props.userData.userId === item.user_id &&
                        item.used < 1 ? (
                          <>
                            <Link to={"/sample/stores-edit/" + item.id}>
                              <i className="fa fa-pen margin-10 text-info"></i>
                            </Link>
                          </>
                        ) : null}
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

      <Modal size="lg" show={storeModal} onHide={closeStoreModal}>
        <Modal.Header closeButton>
          <Modal.Title>Item Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="actions d-flex gap_10 justify-content-end">
            <Link to="#" onClick={PrintPdf} className="btn btn-info btn-sm">
              <i className="fas fa-print"></i>
            </Link>
            <Link
              to="#"
              onClick={generatePdf}
              className="btn btn-warning bg-falgun btn-sm"
            >
              <i className="fas fa-download"></i>
            </Link>
          </div>
          <br />
          <div className="preview_print page" id="pdf_container">
            <div className="container border ">
              <br />
              <h2 className="text-center">Item Details</h2>
              <br />
              <div className="row">
                <div className="col-lg-12">
                  <table className="table text-start align-middle table-bordered table-hover mb-0">
                    <tbody>
                      <tr>
                        <td>
                          <strong>STR NUMBER</strong>
                        </td>
                        <td>
                          <strong>ITEM & CODE</strong>
                        </td>
                        <td>
                          <strong>ITEM TYPE</strong>
                        </td>
                      </tr>
                      <tr>
                        <td>{storeDetails.store_number}</td>
                        <td>
                          {storeDetails.title} | {storeDetails.code}
                        </td>
                        <td>{storeDetails.item_type_name}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>BUYER</strong>
                        </td>
                        <td>
                          <strong>STYLE</strong>
                        </td>
                        <td>
                          <strong>REFERENCE</strong>
                        </td>
                      </tr>
                      <tr>
                        <td>{storeDetails.buyer}</td>
                        <td>{storeDetails.techpack}</td>
                        <td>{storeDetails.reference_name}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>BALANCE</strong>
                        </td>
                        <td>
                          <strong>SIZE</strong>
                        </td>
                        <td>
                          <strong>COLOR</strong>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {storeDetails.balance} {storeDetails.unit}
                        </td>
                        <td>{storeDetails.size}</td>
                        <td>{storeDetails.color}</td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <strong>DESCRIPTION</strong>
                        </td>
                        <td colSpan={1}>
                          <strong>ITEM PHOTO</strong>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <pre>{storeDetails.description}</pre>
                        </td>
                        <td colSpan={1}>
                          <img
                            style={{
                              height: "150px",
                              width: "150px",
                              margin: 5,
                            }}
                            src={storeDetails.file_source}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <br></br>
                  <h5>ITEM SUMMERY</h5>

                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>DATE</th>
                        <th>QTY</th>
                        <th>TYPE</th>
                        <th>SOR NO.</th>
                        <th>REFERENCE</th>
                        <th>REMARKS</th>
                        <th>BY</th>
                      </tr>
                    </thead>
                    <tbody>
                      {storeDetails.activities &&
                      storeDetails.activities.length > 0 ? (
                        storeDetails.activities.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{moment(item.delivery_date).format("ll")}</td>
                            <td>{item.qty}</td>
                            <td>{item.type}</td>
                            <td>{item.sor_number}</td>
                            <td>{item.reference}</td>
                            <td>{item.remarks}</td>
                            <td>{item.user}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5">No activities available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <br />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={closeStoreModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal size="sm" show={incrementModal} onHide={closeIncrementModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Stock </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>QTY</label>
            <input
              value={incrementForm.qty}
              onChange={incrementChange}
              name="qty"
              type="number"
              onWheel={(event) => event.target.blur()}
              min={0}
              step={0.01}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Reference</label>
            <input
              value={incrementForm.reference}
              onChange={incrementChange}
              name="reference"
              type="text"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Remarks</label>
            <textarea
              value={incrementForm.remarks}
              onChange={incrementChange}
              name="remarks"
              className="form-control"
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="default" onClick={closeIncrementModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submitIncrement}>
            Save
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
    </div>
  );
}
