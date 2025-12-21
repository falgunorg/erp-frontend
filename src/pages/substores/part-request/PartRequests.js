import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import Pagination from "../../../elements/Pagination";
import $ from "jquery";
import "datatables.net";
import "datatables.net-buttons";
import "datatables.net-buttons/js/buttons.html5.min.js";
import "datatables.net-buttons/js/buttons.print.min.js";
import "datatables.net-buttons/js/buttons.colVis.mjs";
import swal from "sweetalert";
import moment from "moment";
import { Modal, Button} from "react-bootstrap";

export default function PartRequests(props) {
  const history = useHistory();
  const userInfo = props.userData;

  console.log("userInfo", userInfo);
  const [spinner, setSpinner] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const partReuestRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [total, setTotal] = useState(0);
  const [links, setLinks] = useState([]);

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

  // get all requisitions
  const [requisitions, setRequisitions] = useState([]);
  const getRequisitions = async () => {
    setSpinner(true);

    // Send the correct page parameter to the API request
    var response = await api.post("/part-requests?page=" + currentPage, {
      department: userInfo.department_title,
      designation: userInfo.designation_title,
    });

    if (response.status === 200 && response.data) {
      // Update the state with pagination data
      setRequisitions(response.data.requests.data);
      setLinks(response.data.requests.links);
      setFrom(response.data.requests.from);
      setTo(response.data.requests.to);
      setTotal(response.data.requests.total);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };
  useEffect(async () => {
    getRequisitions();
  }, [currentPage]);

  const toggleStatus = async (id, status) => {
    setSpinner(true);
    var response = await api.post("/part-requests-toggle", {
      id: id,
      status: status,
    });
    if (response.status === 200 && response.data) {
      swal({
        title: "Successfully Updated",
        icon: "success",
      });
      getRequisitions();
    } else {
      swal({
        title: response.data.errors.main_error,
        icon: "error",
      });
    }
    setSpinner(false);
  };

  useEffect(() => {
    const fetchDataAndInitializeDataTable = async () => {
      setSpinner(true);
      await getRequisitions();
      if ($.fn.DataTable.isDataTable(partReuestRef.current)) {
        $(partReuestRef.current).DataTable().destroy();
      }
      const dataTable = $(partReuestRef.current).DataTable({
        dom: "Bfrtip",
        buttons: [
          {
            extend: "copy",
            exportOptions: { columns: ":visible" },
          },
          {
            extend: "excel",
            exportOptions: { columns: ":visible" },
          },
          {
            extend: "print",
            exportOptions: {
              columns: function (idx, data, node) {
                return true;
              },
            },
            customize: function (win) {
              // Add title on top of DataTable when printing
              var newTitle = $("<h6>")
                .css("text-align", "left")
                .html("REQUISITIONS LIST");
              newTitle.insertAfter($(win.document.body).find("h1"));
            },
          },
        ],
        paging: false, // Disable pagination
        info: false,
        searching: false,
        order: false,
        // DataTable options go here
      });

      setSpinner(false); // Move this line inside the function
      // Destroy DataTable when the component unmounts
      return () => {
        dataTable.destroy();
      };
    };

    fetchDataAndInitializeDataTable();
  }, []);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Store Requisitions</div>
        <div className="actions">
          <input
            type="search"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            className="form-control"
            placeholder="Search"
          />

          <Link
            to="/part-requests-create"
            className="btn btn-warning bg-falgun rounded-circle"
          >
            <i className="fal fa-plus"></i>
          </Link>
        </div>
      </div>

      <div className="employee_lists">
        <div className="table-responsive">
          <div id="buttonsContainer"> </div>
          <table
            ref={partReuestRef}
            className="table text-start align-middle table-bordered table-hover mb-0"
          >
            <thead className="bg-dark text-white">
              <tr>
                <th>Thumb</th>
                <th>SL</th>
                <th>Date</th>
                <th>Item</th>
                <th>Line/Dept</th>
                <th>Requisition By</th>
                <th>Requisition QTY</th>
                <th>Stock QTY</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchValue ? (
                <>
                  {requisitions
                    .filter((item) => {
                      if (!searchValue) return false;
                      const lowerCaseSearchValue = searchValue.toLowerCase();
                      return (
                        item.request_number
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.part_name
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.requisition_by
                          .toLowerCase()
                          .includes(lowerCaseSearchValue)
                      );
                    })
                    .map((item, index) => (
                      <tr key={index} className={item.status}>
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
                        <td>{item.request_number}</td>
                        <td>
                          {moment(item.created_at).format(
                            "MMMM Do YYYY, h:mm A"
                          )}
                        </td>
                        <td>{item.part_name}</td>
                        <td>{item.line}</td>
                        <td>{item.requisition_by}</td>
                        <td>
                          {item.qty} | {item.unit}
                        </td>
                        <td>
                          {item.stock_qty} | {item.unit}
                        </td>
                        <td>
                          {item.status} by {item.action_user}
                        </td>
                        <td>
                          <>
                            {[
                              "Manager",
                              "Assistant Manager",
                              "General Manager",
                            ].includes(userInfo.designation_title) &&
                            item.status === "Pending" &&
                            userInfo.company_id === item.company_id &&
                            userInfo.department === item.department ? (
                              <>
                                <button
                                  className="btn btn-success btn-sm"
                                  type="submit"
                                  onClick={() =>
                                    toggleStatus(item.id, "Approved")
                                  }
                                >
                                  <i className="fa fa-check"></i>
                                </button>{" "}
                                <button
                                  className="btn btn-danger btn-sm"
                                  type="submit"
                                  onClick={() =>
                                    toggleStatus(item.id, "Rejected")
                                  }
                                >
                                  <i className="fa fa-ban"></i>
                                </button>
                              </>
                            ) : null}

                            {item.status === "Approved" &&
                            userInfo.company_id === item.company_id &&
                            userInfo.designation_title === "Store Keeper" ? (
                              <>
                                <button
                                  className="btn btn-info btn-sm"
                                  type="submit"
                                  onClick={() =>
                                    toggleStatus(item.id, "Delivered")
                                  }
                                >
                                  <i className="fa fa-truck"></i>
                                </button>
                              </>
                            ) : (
                              ""
                            )}

                            {userInfo.userId === item.user_id &&
                            (item.status === "Pending" ||
                              item.status === "Rejected" ||
                              item.status === "Cancelled") ? (
                              <Link
                                className="btn btn-warning btn-sm"
                                to={"/part-requests-edit/" + item.id}
                              >
                                <i className="fas fa-pen"></i>
                              </Link>
                            ) : null}

                            {userInfo.userId === item.user_id &&
                            !(
                              item.status === "Delivered" ||
                              item.status === "Cancelled"
                            ) ? (
                              <button
                                className="btn btn-danger btn-sm"
                                type="submit"
                                onClick={() =>
                                  toggleStatus(item.id, "Cancelled")
                                }
                              >
                                <i className="fa fa-times"></i>
                              </button>
                            ) : null}
                          </>
                        </td>
                      </tr>
                    ))}
                </>
              ) : (
                <>
                  {requisitions.map((item, index) => (
                    <tr key={index} className={item.status}>
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
                      <td>{item.request_number}</td>
                      <td>
                        {moment(item.created_at).format("MMMM Do YYYY, h:mm A")}
                      </td>
                      <td>{item.part_name}</td>
                      <td>{item.line}</td>
                      <td>{item.requisition_by}</td>
                      <td>
                        {item.qty} | {item.unit}
                      </td>
                      <td>
                        {item.stock_qty} | {item.unit}
                      </td>
                      <td>
                        {item.status} by {item.action_user}
                      </td>
                      <td>
                        <>
                          {[
                            "Manager",
                            "Assistant Manager",
                            "General Manager",
                          ].includes(userInfo.designation_title) &&
                          item.status === "Pending" &&
                          userInfo.company_id === item.company_id &&
                          userInfo.department === item.department ? (
                            <>
                              <button
                                className="btn btn-success btn-sm"
                                type="submit"
                                onClick={() =>
                                  toggleStatus(item.id, "Approved")
                                }
                              >
                                <i className="fa fa-check"></i>
                              </button>{" "}
                              <button
                                className="btn btn-danger btn-sm"
                                type="submit"
                                onClick={() =>
                                  toggleStatus(item.id, "Rejected")
                                }
                              >
                                <i className="fa fa-ban"></i>
                              </button>
                            </>
                          ) : null}

                          {item.status === "Approved" &&
                          userInfo.company_id === item.company_id &&
                          userInfo.designation_title === "Store Keeper" ? (
                            <>
                              <button
                                className="btn btn-info btn-sm"
                                type="submit"
                                onClick={() =>
                                  toggleStatus(item.id, "Delivered")
                                }
                              >
                                <i className="fa fa-truck"></i>
                              </button>
                            </>
                          ) : (
                            ""
                          )}

                          {userInfo.userId === item.user_id &&
                          (item.status === "Pending" ||
                            item.status === "Rejected" ||
                            item.status === "Cancelled") ? (
                            <Link
                              className="btn btn-warning btn-sm"
                              to={"/part-requests-edit/" + item.id}
                            >
                              <i className="fas fa-pen"></i>
                            </Link>
                          ) : null}

                          {userInfo.userId === item.user_id &&
                          !(
                            item.status === "Delivered" ||
                            item.status === "Cancelled"
                          ) ? (
                            <button
                              className="btn btn-danger btn-sm"
                              type="submit"
                              onClick={() => toggleStatus(item.id, "Cancelled")}
                            >
                              <i className="fa fa-times"></i>
                            </button>
                          ) : null}
                        </>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>

          <br />
          <h6 className="text-center">
            Showing {from} To {to} From {total}
          </h6>

          <Pagination
            links={links}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
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

      <br />
      <br />
    </div>
  );
}
