import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "../../services/api";
import Spinner from "../../elements/Spinner";
import { Modal, Button, Dropdown, Offcanvas } from "react-bootstrap";
import swal from "sweetalert";
import Pagination from "../../elements/Pagination";
import $ from "jquery";
import "datatables.net";
import "datatables.net-buttons";
import "datatables.net-buttons/js/buttons.html5.min.js";
import "datatables.net-buttons/js/buttons.print.min.js";
import "datatables.net-buttons/js/buttons.colVis.mjs";
import SubstoreIssueCanvas from "../../elements/modals/SubstoreIssueCanvas";

// import Offcanvas from "react-bootstrap";

export default function SubStore(props) {
  const [spinner, setSpinner] = useState(false);
  const userInfo = props.userData;
  const params = useParams();

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
  const dataTableRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [total, setTotal] = useState(0);
  const [links, setLinks] = useState([]);

  // get all store items
  const [substores, setSubstores] = useState([]);
  const getSubstores = async () => {
    setSpinner(true);

    // Send the correct page parameter to the API request
    var response = await api.post("/substores", {
      search: searchValue,
      page: currentPage,
      type: params.type,
    });

    if (response.status === 200 && response.data) {
      // Update the state with pagination data
      setSubstores(response.data.substores.data);
      setLinks(response.data.substores.links);
      setFrom(response.data.substores.from);
      setTo(response.data.substores.to);
      setTotal(response.data.substores.total);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getSubstores();
  }, [currentPage, searchValue, params.type]);

  useEffect(() => {
    const fetchDataAndInitializeDataTable = async () => {
      setSpinner(true);
      await getSubstores();
      if ($.fn.DataTable.isDataTable(dataTableRef.current)) {
        $(dataTableRef.current).DataTable().destroy();
      }
      const dataTable = $(dataTableRef.current).DataTable({
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
                .html("SUBSTORE SUMMERY");
              newTitle.insertAfter($(win.document.body).find("h1"));
            },
          },
        ],
        paging: false, // Disable pagination
        info: false,
        searching: false,
        // order: [[0, "desc"]],
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

  // ISSUE ON MODAL

  const handleFileChange = async (event, item) => {
    const file = event.target.files[0];
    const data = new FormData();
    data.append("photo", file);
    data.append("id", item.part_id);
    try {
      const response = await api.post("/parts-upload-photo", data);
      if (response.status === 200 && response.data) {
        swal({
          title: "Update Success",
          icon: "success",
        });
        getSubstores();
      }
    } catch (error) {
      console.error("Error updating photo:", error);
    }
  };

  // useEffect(async () => {
  //   getSubstores();
  // }, [props.callSubstores]);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">
          Manage Sub Store ({params.type ? params.type : "All"})
        </div>
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
        <div className="d-flex justify-content-end">
          {(userInfo.department_title === "Store" &&
            userInfo.designation_title !== "Manager") ||
          (userInfo.department_title === "Washing" &&
            userInfo.designation_title !== "Manager") ||
          (userInfo.department_title === "IT" &&
            userInfo.designation_title !== "Manager") ||
          (userInfo.department_title === "Administration" &&
            userInfo.designation_title !== "Manager") ? (
            <>
              <Link
                to="/requisitions-create-quick"
                style={{ marginRight: "10px" }}
                className="btn btn-info"
              >
                QUICK REQUISITION
              </Link>
              <Link
                to="/sub-stores-pending-receive"
                style={{ marginRight: "10px" }}
                className="btn btn-secondary"
              >
                WATING FOR RECEIVE
              </Link>
              <Link
                to="/sub-stores-receive"
                style={{ marginRight: "10px" }}
                className="btn btn-primary"
              >
                NEW RECEIVE
              </Link>
              <button
                onClick={() => props.setSubstoreIssueCanvas(true)}
                style={{ marginRight: "10px" }}
                className="btn btn-danger"
              >
                NEW ISSUE
              </button>
            </>
          ) : null}

          <Dropdown>
            <Dropdown.Toggle
              variant="warning"
              className="bg-falgun"
              id="dropdown-basic"
            >
              REPORTS
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="/substores-report">SUMMARY</Dropdown.Item>
              <Dropdown.Item href="/substores-receive-report">
                RECEIVES
              </Dropdown.Item>
              <Dropdown.Item href="/substores-issue-report">
                ISSUES
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Link
            to="/parts"
            style={{ marginLeft: "10px" }}
            className="btn btn-success"
          >
            ITEMS
          </Link>
        </div>

        <div className="table-responsive">
          <table ref={dataTableRef} className="table substore_dataTable">
            <thead className="">
              <tr>
                <th rowSpan="2">THUMB</th>
                <th rowSpan="2">SL</th>
                <th rowSpan="2">ID</th>
                <th rowSpan="2">ITEM</th>
                <th rowSpan="2">TYPE</th>
                <th rowSpan="2">UNIT</th>
                <th colSpan="4" className="text-center">
                  CURRENT MONTH
                </th>
                <th colSpan="4" className="text-center">
                  TOTAL
                </th>
                <th rowSpan="2">ACTION</th>
              </tr>
              <tr>
                <th>O.B.</th>
                <th>RECEIVE</th>
                <th>TOTAL</th>
                <th>ISSUE</th>
                <th>O.B.</th>
                <th>RECEIVE</th>
                <th>ISSUE</th>
                <th>BALANCE</th>
              </tr>
            </thead>
            <tbody>
              {substores.map((item, index) => (
                <tr key={index}>
                  <td className="d-flex align-items-center">
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
                      alt="Part Thumbnail"
                    />
                    <div className="upload_photo">
                      <label htmlFor={`file-${index}`}>
                        <i
                          style={{ marginLeft: "5px", cursor: "pointer" }}
                          className="fa fa-upload"
                        ></i>
                      </label>
                      <input
                        onChange={(event) => handleFileChange(event, item)}
                        id={`file-${index}`}
                        name="file"
                        hidden
                        type="file"
                        accept="image/*"
                      />
                    </div>
                  </td>
                  <td>
                    <strong>{index + 1}</strong>
                  </td>
                  <td>
                    <strong>{item.part_id}</strong>
                  </td>
                  <td>
                    <strong>{item.part_name}</strong>
                  </td>
                  <td>
                    <strong>{item.type}</strong>
                  </td>
                  <td>
                    <strong>{item.unit}</strong>
                  </td>
                  <td>
                    <strong>{item.current_month_opening_balance}</strong>
                  </td>
                  <td>
                    <strong>{item.current_month_receives}</strong>
                  </td>
                  <td>
                    <strong>{item.current_month_total}</strong>
                  </td>
                  <td>
                    <strong>{item.current_month_issues}</strong>
                  </td>
                  <td>
                    <strong>{item.opening_balance}</strong>
                  </td>
                  <td className="text-primary">
                    <strong>{item.total_receives}</strong>
                  </td>
                  <td className="text-danger">
                    <strong>{item.total_issues}</strong>
                  </td>
                  <td
                    className={
                      item.qty <= item.min_balance
                        ? "text-danger"
                        : "text-success"
                    }
                  >
                    <strong>{item.qty}</strong>
                  </td>
                  <td>
                    <Link
                      to={`/sub-stores-details/${item.id}`}
                      className="btn btn-sm btn-success"
                    >
                      Details
                    </Link>{" "}
                    {(userInfo.department_title === "Store" &&
                      userInfo.designation_title !== "Manager") ||
                    (userInfo.department_title === "Administration" &&
                      userInfo.designation_title !== "Manager") ? (
                      <button
                        onClick={() => {
                          props.setSubstoreIssueCanvas(true);
                          props.setSubstoreCanvasId(item.id);
                        }}
                        className="btn btn-sm btn-warning"
                      >
                        Issue
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
      <br />
      <br />

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
      <SubstoreIssueCanvas {...props} />
    </div>
  );
}
