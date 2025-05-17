import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "../../services/api";
import Spinner from "../../elements/Spinner";
import { Modal, Button, Dropdown, Offcanvas } from "react-bootstrap";
import swal from "sweetalert";
import Pagination from "../../elements/Pagination";
import SubstoreIssueCanvas from "../../elements/modals/SubstoreIssueCanvas";

export default function SubStore(props) {
  const history = useHistory();
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
  // const [currentPage, setCurrentPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(
    () => Number(sessionStorage.getItem("subStorePage")) || 1
  );
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

  //REFRESH SCROLLINTOVIEW PAGE
  const listRef = useRef(null);
  const refreshPage = () => {
    setCurrentPage(1);
    sessionStorage.removeItem("subStorePage");
    sessionStorage.removeItem("selectedSubstore");
  };

  useEffect(() => {
    const selectedSubstore = sessionStorage.getItem("selectedSubstore");
    if (selectedSubstore && listRef.current) {
      const itemElement = listRef.current.querySelector(
        `[data-id="${selectedSubstore}"]`
      );
      if (itemElement) {
        itemElement.scrollIntoView({ behavior: "smooth", block: "center" });
        itemElement.focus();
      }
    }
  }, [substores]);

  const handleItemClick = (id) => {
    sessionStorage.setItem("selectedSubstore", id);
    sessionStorage.setItem("subStorePage", currentPage);
    history.push(`/sub-stores-details/${id}`);
  };

  const selectedSubstore = sessionStorage.getItem("selectedSubstore");

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
            className="btn btn-success me-2"
          >
            ITEMS
          </Link>

          <button onClick={refreshPage} className="btn btn-warning me-2">
            <i className="fa fa-retweet"></i>
          </button>
        </div>
        <br />
        <div className="table-responsive">
          <table ref={listRef} className="table substore_dataTable">
            <thead className="">
              <tr>
                <th>THUMB</th>
                <th>ID</th>
                <th>ITEM</th>
                <th>TYPE</th>
                <th>UNIT</th>
                <th>BALANCE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {substores.map((item, index) => (
                <tr key={index} data-id={item.id} tabIndex={0}>
                  <td
                    className={
                      selectedSubstore == item.id
                        ? "d-flex align-items-center selected_border"
                        : "d-flex align-items-center"
                    }
                  >
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
                      to="#"
                      onClick={() => handleItemClick(item.id)}
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
