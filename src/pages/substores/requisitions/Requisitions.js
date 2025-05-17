import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import Select from "react-select";
import Pagination from "../../../elements/Pagination";
import { Button, Overlay, Popover } from "react-bootstrap";
import moment from "moment";

export default function Requisitions(props) {
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const [clickedIndex, setClickedIndex] = useState(null);
  const ref = useRef(null);
  const handlePurchaseDetailsClick = (event, index) => {
    setShow(clickedIndex !== index || !show);
    setTarget(event.target);
    setClickedIndex(index);
  };
  const userInfo = props.userData;
  const [spinner, setSpinner] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);

  const [currentPage, setCurrentPage] = useState(
    () => Number(sessionStorage.getItem("currentPage")) || 1
  );
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [total, setTotal] = useState(0);
  const [links, setLinks] = useState([]);

  const [filterData, setFilterData] = useState({
    from_date: "",
    to_date: "",
    status: "",
    item_id: "",
    searchValue: "",
  });
  const clearFields = () => {
    sessionStorage.removeItem("currentPage");
    sessionStorage.removeItem("selectedRequisition");
    setCurrentPage(1);
    setFilterData({
      from_date: "",
      to_date: "",
      status: "",
      item_id: "",
      searchValue: "",
    });
  };

  const filterChange = (name, value) => {
    setFilterData({
      ...filterData,
      [name]: value,
    });
  };

  // get all requisitions
  const [requisitions, setRequisitions] = useState([]);
  const getRequisitions = async () => {
    setSpinner(true);
    // Send the correct page parameter to the API request
    var response = await api.post("/requisitions?page=" + currentPage, {
      department: userInfo.department_title,
      designation: userInfo.designation_title,
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      status: filterData.status,
      id: filterData.item_id,
      searchValue: filterData.searchValue,
    });

    if (response.status === 200 && response.data) {
      // Update the state with pagination data
      setRequisitions(response.data.requisitions.data);
      setLinks(response.data.requisitions.links);
      setFrom(response.data.requisitions.from);
      setTo(response.data.requisitions.to);
      setTotal(response.data.requisitions.total);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };
  useEffect(() => {
    getRequisitions();
  }, [currentPage, filterData]);

  const listRef = useRef(null);

  useEffect(() => {
    const selectedRequisition = sessionStorage.getItem("selectedRequisition");
    if (selectedRequisition && listRef.current) {
      const itemElement = listRef.current.querySelector(
        `[data-id="${selectedRequisition}"]`
      );
      if (itemElement) {
        itemElement.scrollIntoView({ behavior: "smooth", block: "center" });
        itemElement.focus();
      }
    }
  }, [requisitions]);

  const handleItemClick = (id) => {
    sessionStorage.setItem("selectedRequisition", id);
    sessionStorage.setItem("currentPage", currentPage);
    history.push(`/requisitions-details/${id}`);
  };

  const selectedRequisition = sessionStorage.getItem("selectedRequisition");

  console.log("SELECTED ITEM ", selectedRequisition);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Requisitions</div>
        <div className="actions">
          {(userInfo.department_title === "Store" &&
            userInfo.designation_title !== "Manager") ||
          (userInfo.department_title === "Administration" &&
            userInfo.designation_title !== "Manager") ||
          (userInfo.department_title === "Washing" &&
            userInfo.designation_title !== "Manager") ||
          (userInfo.department_title === "IT" &&
            userInfo.designation_title !== "Manager") ||
          (userInfo.department_title === "Maintenance" &&
            userInfo.designation_title !== "Manager") ? (
            <Link
              to="/requisitions-create"
              className="btn btn-warning bg-falgun rounded-circle"
            >
              <i className="fal fa-plus"></i>
            </Link>
          ) : null}
        </div>
      </div>

      <div className="datrange_filter non_printing_area">
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label>From Date</label>
              <input
                value={filterData.from_date}
                name="from_date"
                className="form-control"
                type="date"
                onChange={(event) =>
                  filterChange("from_date", event.target.value)
                }
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>To Date</label>
              <input
                value={filterData.to_date}
                name="to_date"
                className="form-control"
                type="date"
                onChange={(event) =>
                  filterChange("to_date", event.target.value)
                }
              />
            </div>
          </div>

          <div className="col">
            <div className="form-group">
              <label>Status</label>
              <select
                value={filterData.status}
                className="form-select"
                name="status"
                onChange={(event) => filterChange("status", event.target.value)}
              >
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="Placed">Placed</option>
                <option value="Recommended">Recommended</option>
                <option value="Valuated">Valuated</option>
                <option value="Checked">Checked</option>
                {/* <option value="Approved">Approved</option> */}
                <option value="Finalized">Finalized</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="col d-none">
            <div className="form-group">
              <label>Requisition Number</label>

              <Select
                placeholder="Select"
                value={
                  filterData.item_id
                    ? {
                        value: filterData.item_id,
                        label: `${
                          requisitions.find(
                            (item) => item.id === filterData.item_id
                          )?.requisition_number || ""
                        } | ${
                          requisitions.find(
                            (item) => item.id === filterData.item_id
                          )?.label || ""
                        }`,
                      }
                    : null
                }
                onChange={(selectedOption) =>
                  filterChange("item_id", selectedOption.value)
                }
                name="item_id"
                options={requisitions.map((item) => ({
                  value: item.id,
                  label: `${item.requisition_number} | ${item.label}`,
                }))}
              />
            </div>
          </div>

          <div className="col">
            <div className="form-group">
              <label>Requisition Number</label>
              <input
                type="number"
                value={filterData.searchValue}
                className="form-control"
                name="searchValue"
                onChange={(event) =>
                  filterChange("searchValue", event.target.value)
                }
              />
            </div>
          </div>
          <div className="col">
            <br />
            <button onClick={clearFields} className="btn btn-warning btn-sm">
              <i className="fas fa-retweet"></i>
            </button>{" "}
          </div>
        </div>
      </div>
      <div className="table-responsive">
        <table ref={listRef} className="table substore_dataTable">
          <thead className="">
            <tr>
              <th>SL</th>
              <th>Label</th>
              <th>Date</th>
              <th>Company</th>
              <th>Requisition By</th>
              <th>Status</th>
              <th>Stage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requisitions.map((item, index) => (
              <tr
                key={index}
                className={item.status}
           
                data-id={item.id}
                tabIndex={0}
              >
                <td
                  className={
                    selectedRequisition == item.id ? "selected_border" : ""
                  }
                >
                  {item.requisition_number}
                </td>
                <td>{item.label}</td>
                <td>{moment(item.created_at).format("lll")}</td>
                <td>{item.company}</td>
                <td>{item.requisition_by}</td>
                <td>{item.status}</td>
                <td>
                  {item.status === "Pending" && (
                    <div className="bg-danger zoomable_onlist">
                      Need to Place
                    </div>
                  )}
                  {item.status === "Placed" && (
                    <div className="bg-danger zoomable_onlist">
                      Waiting For Recommendation
                    </div>
                  )}
                  {item.status === "Recommended" && (
                    <div className="bg-danger zoomable_onlist">
                      Waiting For Purchase Valuation
                    </div>
                  )}

                  {item.status === "Valuated" && (
                    <div className="bg-danger zoomable_onlist">
                      Waiting For Audit Checking
                    </div>
                  )}

                  {item.status === "Checked" && (
                    <div className="bg-danger zoomable_onlist">
                      Waiting For Final Approval
                    </div>
                  )}
                  {item.status === "Finalized" && (
                    <>
                      {item.purchesed_items === 0 &&
                      item.partial_purchased === 0 ? (
                        <div className="text-white">Ready to Buy</div>
                      ) : (
                        <>
                          <Button
                            style={{
                              padding: 0,
                              fontSize: "12px",
                              zIndex: "9999",
                            }}
                            variant="light"
                            onClick={(e) =>
                              handlePurchaseDetailsClick(e, index)
                            }
                            className="d-inline-flex align-items-center"
                          >
                            <span className="ms-1">Show Purchase Details</span>
                          </Button>
                          <Overlay
                            show={show && clickedIndex === index}
                            target={target}
                            placement="bottom"
                            container={ref.current}
                            containerPadding={20}
                          >
                            <Popover
                              style={{ padding: 0, fontSize: "12px" }}
                              id="popover-contained"
                            >
                              <Popover.Header as="h3">
                                Purchase Details
                              </Popover.Header>
                              <Popover.Body>
                                <strong>Total Item:</strong> {item.total_items}
                                <br />
                                <strong>Purchased:</strong>{" "}
                                {item.purchesed_items} (
                                {item.purchase_percentage}%)
                                <br />
                                <strong>Partial Purchased:</strong>{" "}
                                {item.partial_purchased} (
                                {item.partial_purchase_percentage}%)
                                <br />
                                <strong>Not Purchased Yet:</strong>{" "}
                                {item.left_purchase_items}
                              </Popover.Body>
                            </Popover>
                          </Overlay>
                        </>
                      )}
                    </>
                  )}
                </td>
                <td>
                  <Link
                  to="#"
                    onClick={() => handleItemClick(item.id)}
                    className="btn btn-success btn-sm"
                  >
                    <i className="fa fa-cog"></i>
                  </Link>

                  {userInfo.userId === item.user_id &&
                  (item.status === "Pending" || item.status === "Rejected") ? (
                    <Link
                      className="btn btn-warning btn-sm"
                      to={"/requisitions-edit/" + item.id}
                    >
                      <i className="fa fa-pen"></i>
                    </Link>
                  ) : null}
                </td>
              </tr>
            ))}
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

      <br />
      <br />
    </div>
  );
}
