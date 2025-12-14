import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import Select from "react-select";
import Pagination from "../../../elements/Pagination";
import $ from "jquery";
import "datatables.net";
import "datatables.net-buttons";
import "datatables.net-buttons/js/buttons.html5.min.js";
import "datatables.net-buttons/js/buttons.print.min.js";
import "datatables.net-buttons/js/buttons.colVis.mjs";
import moment from "moment";
import { Button, Overlay, Popover } from "react-bootstrap";

export default function RequisitionsSpecial(props) {
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const [clickedIndex, setClickedIndex] = useState(null);
  const ref = useRef(null);

  const handleClick = (event, index) => {
    setShow(clickedIndex !== index || !show); // Toggle show if clicking the same button
    setTarget(event.target);
    setClickedIndex(index);
  };
  const userInfo = props.userData;
  const params = useParams();

  const [spinner, setSpinner] = useState(false);
  const dataTableRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
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
    var response = await api.post("/requisitions/special?page=" + currentPage, {
      company_id: params.company_id,
      from_date: filterData.from_date,
      to_date: filterData.to_date,
      status: filterData.status,
      id: filterData.item_id,
      searchValue: filterData.searchValue,
    });
    if (response.status === 200 && response.data) {
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

  useEffect(async () => {
    getRequisitions();
  }, [currentPage, filterData, params.company_id]);

  useEffect(() => {
    const fetchDataAndInitializeDataTable = async () => {
      setSpinner(true);
      await getRequisitions();
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
                .html("REQUISITIONS LIST");
              newTitle.insertAfter($(win.document.body).find("h1"));
            },
          },
        ],
        paging: false, // Disable pagination
        info: false,
        searching: false,
        order: [[9, "desc"]],
        // DataTable options go here
      });

      setSpinner(false); // Move this line inside the function

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
        <div className="page_name">Requisitions</div>
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
            </button>
          </div>
        </div>
      </div>
      <div className="employee_lists">
        <div className="table-responsive">
          <div id="buttonsContainer"> </div>
          <table
            ref={dataTableRef}
            className="table text-start align-middle table-bordered mb=0"
          >
            <thead className="bg-dark text-white">
              <tr>
                <th>SL</th>
                <th>Label</th>
                <th>Date</th>
                <th>Company</th>
                <th>Department</th>
                <th>Requisition By</th>
                <th>Status</th>
                <th>Stage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requisitions.map((item, index) => (
                <tr key={index} className={item.status}>
                  <td>{item.requisition_number}</td>
                  <td>{item.label}</td>
                  <td>{moment(item.created_at).format("lll")}</td>
                  <td>{item.company}</td>
                  <td>{item.department_title}</td>
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
                              variant="light"
                              onClick={(e) => handleClick(e, index)}
                              className="d-inline-flex align-items-center"
                            >
                              <span className="ms-1">
                                Show Purchase Details
                              </span>
                            </Button>
                            <Overlay
                              show={show && clickedIndex === index}
                              target={target}
                              placement="bottom"
                              container={ref.current}
                              containerPadding={20}
                            >
                              <Popover id="popover-contained">
                                <Popover.Header as="h3">
                                  Purchase Details
                                </Popover.Header>
                                <Popover.Body>
                                  <strong>Total Item:</strong>{" "}
                                  {item.total_items}
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
                      className="btn btn-success btn-sm mr-10"
                      to={"/requisitions-details/" + item.id}
                    >
                      Details
                    </Link>

                    {userInfo.userId === item.user_id &&
                    (item.status === "Pending" ||
                      item.status === "Rejected") ? (
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
      </div>

      <br />
      <br />
    </div>
  );
}
