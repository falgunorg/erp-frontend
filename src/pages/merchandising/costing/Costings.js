import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import moment from "moment/moment";
import swal from "sweetalert";
import { Modal, Button } from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Costings(props) {
  const history = useHistory();
  const userInfo = props.userData;
  const [spinner, setSpinner] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filterData, setFilterData] = useState({
    from_date: "",
    to_date: "",
    status: "",
    num_of_row: 20,
    view: userInfo.designation_title === "Assistant Manager" ? "team" : "self",
  });
  const filterChange = (event) => {
    setFilterData({ ...filterData, [event.target.name]: event.target.value });
  };
  const clearFields = () => {
    setFilterData({
      from_date: "",
      to_date: "",
      status: "",
      num_of_row: 20,
      view:
        userInfo.designation_title === "Assistant Manager" ? "team" : "self",
    });
  };

  // get all costings
  const [costings, setCostings] = useState([]);
  const getCostings = async () => {
    setSpinner(true);
    var response = await api.post("/merchandising/costings", {
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      status: filterData.status,
      num_of_row: filterData.num_of_row,
      department: userInfo.department_title,
      designation: userInfo.designation_title,
      view: filterData.view,
    });
    if (response.status === 200 && response.data) {
      setCostings(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  // techpach Details

  const generatePdf = () => {
    const input = document.getElementById("pdf_container");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("consumption.pdf");
    });
  };

  const [consumptionItems, setConsumptionItems] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const showDetails = async (id) => {
    setSpinner(true);
    var response = await api.post("/merchandising/techpacks-show", { id: id });
    if (response.status === 200 && response.data) {
      setEditForm(response.data.data);
      setConsumptionItems(response.data.consumption_items);
      setEditModal(true);
    }
    setSpinner(false);
  };

  const closeEditModal = () => {
    setEditModal(false);
  };

  // IMAGE MODAL SHOW

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
  useEffect(async () => {
    getCostings();
  }, []);
  useEffect(async () => {
    getCostings();
  }, [filterData]);
  useEffect(async () => {
    props.setSection("merchandising");
  }, []);

 
  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Costing Files</div>
        <div className="actions">
          <input
            type="search"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            className="form-control"
            placeholder="Search"
          />

          {userInfo.department_title === "Merchandising" &&
          userInfo.designation_title !== "Deputy General Manager" ? (
            <Link
              to="/merchandising/costings-create"
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
            <div className="col-lg-2">
              <div className="form-group">
                <label>View Mode</label>
                <select
                  onChange={filterChange}
                  value={filterData.view}
                  name="view"
                  className="form-select"
                >
                  <option value="self">Self</option>
                  <option value="team">Team</option>
                </select>
              </div>
            </div>
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
              <div className="form-group">
                <label>Status</label>
                <select
                  onChange={filterChange}
                  value={filterData.status}
                  name="status"
                  className="form-select"
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Approved">Approved</option>
                </select>
              </div>
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
                <th>Photo</th>
                <th>SL</th>
                <th>Techpack/Style</th>
                <th>Consumption</th>
                <th>Buyer</th>
                <th>Season</th>
                <th>Total Cost</th>
                <th>Costing By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchValue ? (
                <>
                  {costings
                    .filter((item) => {
                      if (!searchValue) return false;
                      const lowerCaseSearchValue = searchValue.toLowerCase();
                      return (
                        item.buyer
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.costing_number
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.techpack_number
                          .toLowerCase()
                          .includes(lowerCaseSearchValue)
                      );
                    })
                    .map((item, index) => (
                      <tr key={index} className={item.status}>
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
                        <td>{item.costing_number}</td>
                        <td>
                          <Link
                            to="#"
                            onClick={() => showDetails(item.techpack_id)}
                          >
                            {item.techpack_number}
                          </Link>
                        </td>
                        <td>
                          <Link
                            to="#"
                            onClick={() => showDetails(item.techpack_id)}
                          >
                            {item.consumption_number}
                          </Link>
                        </td>
                        <td>{item.buyer}</td>
                        <td>{item.season}</td>
                        <td>{item.total} USD</td>
                        <td>{item.user}</td>
                        <td>
                          <Link
                            to={"/merchandising/costings-details/" + item.id}
                          >
                            <i className="fa fa-eye mr-10 text-success"></i>
                          </Link>
                          {props.userData.userId === item.user_id ? (
                            <Link
                              to={"/merchandising/costings-edit/" + item.id}
                            >
                              <i className="fa fa-pen"></i>
                            </Link>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                </>
              ) : (
                <>
                  {costings.map((item, index) => (
                    <tr key={index} className={item.status}>
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
                      <td>{item.costing_number}</td>
                      <td>
                        <Link
                          to="#"
                          onClick={() => showDetails(item.techpack_id)}
                        >
                          {item.techpack_number}
                        </Link>
                      </td>
                      <td>
                        <Link
                          to="#"
                          onClick={() => showDetails(item.techpack_id)}
                        >
                          {item.consumption_number}
                        </Link>
                      </td>
                      <td>{item.buyer}</td>
                      <td>{item.season}</td>
                      <td>{item.total} USD</td>
                      <td>{item.user}</td>
                      <td>
                        <Link to={"/merchandising/costings-details/" + item.id}>
                          <i className="fa fa-eye mr-10 text-success"></i>
                        </Link>
                        {props.userData.userId === item.user_id ? (
                          <Link to={"/merchandising/costings-edit/" + item.id}>
                            <i className="fa fa-pen"></i>
                          </Link>
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

      <Modal size="lg" show={editModal} onHide={closeEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Techpack Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="create_edit_page">
            {spinner && <Spinner />}

            <Link
              to="#"
              onClick={generatePdf}
              className="btn btn-warning btn-sm bg-falgun "
            >
              <i className="fas fa-download"></i>
            </Link>

            <div className="preview_print page" id="pdf_container">
              <h6 className="text-center text-underline">
                <u>TECHPACK DETAILS</u>
              </h6>
              <table className="table text-start align-middle table-bordered table-hover mb-0 ">
                <tbody>
                  <tr>
                    <td>
                      <strong>SL</strong>
                    </td>
                    <td>
                      <strong>BUYER</strong>
                    </td>
                    <td>
                      <strong>TECHPACK/STYLE</strong>
                    </td>
                    <td>
                      <strong>SEASON</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>{editForm.techpack_number}</td>
                    <td>{editForm.buyer}</td>
                    <td>{editForm.title}</td>
                    <td>{editForm.season}</td>
                  </tr>

                  <tr>
                    <td>
                      <strong>TECHPACK BY</strong>
                    </td>
                    <td>
                      <strong>TYPE</strong>
                    </td>
                    <td>
                      <strong>DATE</strong>
                    </td>
                    <td>STATUS</td>
                  </tr>
                  <tr>
                    <td>{editForm.techpack_by}</td>
                    <td>{editForm.item_type}</td>
                    <td> {moment(editForm.created_at).format("lll")} </td>
                    <td>{editForm.status}</td>
                  </tr>
                </tbody>
              </table>

              <div className="container border ">
                <br />
                <h6 className="text-center text-underline">
                  <u>CONSUMPTION FILE</u>
                </h6>

                <br />
                <div className="row">
                  <div className="col-lg-8">
                    <table className="table text-start align-middle table-bordered table-hover mb-0 ">
                      <tbody>
                        <tr>
                          <td>
                            <strong>SL</strong>
                          </td>
                          <td>
                            <strong>CONSUMPTION BY</strong>
                          </td>
                        </tr>
                        <tr>
                          <td>{editForm.consumption_number}</td>
                          <td>{editForm.consumption_by}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-lg-4">
                    <img
                      style={{
                        width: "100%",
                        border: "1px solid gray",
                        borderRadius: "3px",
                      }}
                      src={editForm.file_source}
                    />
                  </div>
                </div>
                <br />
                <h6 className="text-center text-underline">
                  <u>BOM'S</u>
                </h6>
                <div className="Import_booking_item_table">
                  <table className="table text-start align-middle table-bordered table-hover mb-0">
                    <thead className="bg-dark text-white">
                      <tr>
                        <th>SL</th>
                        <th>Item</th>
                        <th>Item Details</th>
                        <th>Unit</th>
                        <th>Size</th>
                        <th>Color</th>
                        <th>QTY</th>
                      </tr>
                    </thead>
                    <tbody>
                      {consumptionItems.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.item_name}</td>
                          <td>
                            <pre>{item.description}</pre>
                          </td>
                          <td>{item.unit}</td>
                          <td>{item.size}</td>
                          <td>{item.color}</td>
                          <td>{item.qty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <br />
                </div>
                <hr />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>
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
      <br />
      <br />
    </div>
  );
}
