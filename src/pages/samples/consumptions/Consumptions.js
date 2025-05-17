import React, { useState, useEffect, Fragment } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import moment from "moment/moment";
import swal from "sweetalert";
import { Modal, Button } from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Consumptions(props) {
  const history = useHistory();
  const userInfo = props.userData;
  const [spinner, setSpinner] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [filterData, setFilterData] = useState({
    from_date: "",
    to_date: "",
    num_of_row: 20,
  });
  const filterChange = (event) => {
    setFilterData({ ...filterData, [event.target.name]: event.target.value });
  };
  const clearFields = () => {
    setFilterData({
      from_date: "",
      to_date: "",
      num_of_row: 20,
    });
  };
  // all Placed techpacks

  const [techpacks, setTechpacks] = useState([]);
  const getTechpacks = async () => {
    setSpinner(true);
    var response = await api.post("/techpacks", { status: "Placed" });
    if (response.status === 200 && response.data) {
      setTechpacks(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  // get all consumptions
  const [consumptions, setConsumptions] = useState([]);
  const getConsumptions = async () => {
    setSpinner(true);
    var response = await api.post("/consumptions", {
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      num_of_row: filterData.num_of_row,
      department: userInfo.department_title,
      designation: userInfo.designation_title,
    });
    if (response.status === 200 && response.data) {
      setConsumptions(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const [detailsModal, setDetailsModal] = useState(false);
  const [consumption, setConsumption] = useState({});
  const [consumptionItems, setConsumptionItems] = useState([]);
  const showDetails = async (id) => {
    setSpinner(true);
    var response = await api.post("/consumptions-show", { id: id });
    if (response.status === 200 && response.data) {
      setConsumption(response.data.data);
      setConsumptionItems(response.data.data.consumption_items);
      setDetailsModal(true);
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
      pdf.save("consumption.pdf");
    });
  };

  const closeEditModal = () => {
    setDetailsModal(false);
  };

  useEffect(async () => {
    getConsumptions();
  }, []);

  const deleteAttatchment = async (id) => {
    setSpinner(true);
    var response = await api.post("/consumptions-attachment-delete", {
      id: id,
    });
    if (response.status === 200 && response.data) {
      setDetailsModal(false);
      getConsumptions();
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getConsumptions();
  }, [filterData]);
  useEffect(async () => {
    getTechpacks();
  }, []);

  useEffect(async () => {
    props.setSection("merchandising");
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      const allowedDepartments = [
        "Merchandising",
        "Sample",
        "Planing",
        "Management",
        "Commercial",
        "Accounts & Finance",
        "IT",
      ];
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
        <div className="page_name">Consumptions </div>
        <div className="actions">
          <input
            type="search"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            className="form-control"
            placeholder="Search"
          />

          <Link
            to="/sample/consumptions-create"
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
        <hr></hr>
        <div className="row">
          <div className="col-lg-6">
            <h6 className="text-center">
              <u>Awaiting For Consumption</u>
            </h6>
            <div className="table-responsive">
              <table className="table text-start align-middle table-bordered table-hover mb-0">
                <thead className="bg-dark text-white">
                  <tr>
                    <th>SL</th>
                    <th>Title/Style</th>
                    <th>Buyer</th>
                    <th>Season</th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {techpacks.map((item, index) => (
                    <tr key={index}>
                      <td>{item.techpack_number}</td>
                      <td>{item.title}</td>
                      <td>{item.buyer}</td>
                      <td>{item.season}</td>
                      <td>{item.item_type}</td>
                      <td>
                        <Link to={"/sample/consumptions-create/" + item.id}>
                          Upload Consumption
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-lg-6">
            <h6 className="text-center">
              <u>Consumption Done</u>
            </h6>
            <div className="table-responsive">
              <table className="table text-start align-middle table-bordered table-hover mb-0">
                <thead className="bg-dark text-white">
                  <tr>
                    <th>SL</th>
                    <th>Title/Style</th>
                    <th>Buyer</th>
                    <th>Season</th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {searchValue ? (
                    <>
                      {consumptions
                        .filter((item) => {
                          if (!searchValue) return false;
                          const lowerCaseSearchValue =
                            searchValue.toLowerCase();
                          return (
                            item.buyer
                              .toLowerCase()
                              .includes(lowerCaseSearchValue) ||
                            item.title
                              .toLowerCase()
                              .includes(lowerCaseSearchValue)
                          );
                        })
                        .map((item, index) => (
                          <tr key={index}>
                            <td>{item.consumption_number}</td>
                            <td>{item.teckpack}</td>
                            <td>{item.buyer}</td>
                            <td>{item.season}</td>
                            <td>{item.item_type}</td>
                            <td>
                              <Link to="#" onClick={() => showDetails(item.id)}>
                                <i className="fa fa-eye mr-10 text-success"></i>
                              </Link>
                            </td>
                          </tr>
                        ))}
                    </>
                  ) : (
                    <>
                      {consumptions.map((item, index) => (
                        <tr key={index}>
                          <td>{item.consumption_number}</td>
                          <td>{item.teckpack}</td>
                          <td>{item.buyer}</td>
                          <td>{item.season}</td>
                          <td>{item.item_type}</td>
                          <td>
                            <Link to="#" onClick={() => showDetails(item.id)}>
                              <i className="fa fa-eye mr-10 text-success"></i>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />

      <Modal size="lg" show={detailsModal} onHide={closeEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Consumption Details</Modal.Title>
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
                          <td>{consumption.consumption_number}</td>
                          <td>{consumption.buyer}</td>
                          <td>{consumption.teckpack}</td>
                          <td>{consumption.season}</td>
                        </tr>

                        <tr>
                          <td>
                            <strong>TECHPACK BY</strong>
                          </td>
                          <td>
                            <strong>CONSUMPTION BY</strong>
                          </td>
                          <td>
                            <strong>T. DATE</strong>
                          </td>
                          <td>
                            <strong>C. DATE</strong>
                          </td>
                        </tr>
                        <tr>
                          <td>{consumption.techpack_by}</td>
                          <td>{consumption.consumption_by}</td>
                          <td>
                            {moment(consumption.techpack_date).format("lll")}
                          </td>
                          <td>
                            {moment(consumption.created_at).format("lll")}
                          </td>
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
                      src={consumption.file_source}
                    />
                    <div className="form-group">
                      <label htmlFor="attachments">Uploaded Files:</label>
                      {consumption.attatchments?.map((item, index) => (
                        <div
                          key={index}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <a
                            style={{
                              background: "#e5e5e5",
                              paddingTop: "2px",
                              paddingBottom: "2px",
                              paddingLeft: "5px",
                              paddingRight: "5px",
                              marginBottom: "7px",
                              borderRadius: "2px",
                              fontSize: "14px",
                              textDecoration: "none",
                            }}
                            target="_blank"
                            href={item.file_source}
                            download
                          >
                            <div className="item">
                              <div className="text-muted">
                                {item.filename.endsWith(".txt") ? (
                                  <i className="fal fa-text"></i>
                                ) : item.filename.endsWith(".pdf") ? (
                                  <i className="fal fa-file-pdf"></i>
                                ) : item.filename.endsWith(".docx") ? (
                                  <i className="fal fa-file-word"></i>
                                ) : item.filename.endsWith(".doc") ? (
                                  <i className="fal fa-file-word"></i>
                                ) : item.filename.endsWith(".xls") ? (
                                  <i className="fal fa-file-excel"></i>
                                ) : item.filename.endsWith(".png") ? (
                                  <i className="fal fa-image"></i>
                                ) : item.filename.endsWith(".jpg") ? (
                                  <i className="fal fa-image"></i>
                                ) : item.filename.endsWith(".jpeg") ? (
                                  <i className="fal fa-image"></i>
                                ) : item.filename.endsWith(".gif") ? (
                                  <i className="fal fa-image"></i>
                                ) : (
                                  <i className="fal fa-file"></i>
                                )}{" "}
                                {item.filename}
                              </div>
                            </div>
                          </a>

                          <i
                            onClick={() => deleteAttatchment(item.id)}
                            style={{ marginLeft: "15px" }}
                            className="fa fa-trash text-danger"
                          ></i>
                        </div>
                      ))}
                    </div>
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
    </div>
  );
}
