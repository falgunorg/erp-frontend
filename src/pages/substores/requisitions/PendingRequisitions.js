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
import moment from "moment";

export default function PendingRequisitions(props) {
  const history = useHistory();
  const userInfo = props.userData;

  console.log("userInfo", userInfo);
  const [spinner, setSpinner] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const dataTableRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [total, setTotal] = useState(0);
  const [links, setLinks] = useState([]);

  // get all requisitions
  const [requisitions, setRequisitions] = useState([]);
  const getRequisitions = async () => {
    setSpinner(true);

    // Send the correct page parameter to the API request
    var response = await api.post("/substore/requisitions-pending?page=" + currentPage, {
      department: userInfo.department_title,
      designation: userInfo.designation_title,
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
  useEffect(async () => {
    getRequisitions();
  }, [currentPage]);

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
        order: [[0, "desc"]],
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
        <div className="page_name">Purchase Pending Items</div>
        <div className="actions">
          <input
            type="search"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            className="form-control"
            placeholder="Search"
          />

          {(userInfo.department_title === "Store" &&
            userInfo.designation_title !== "Manager") ||
          (userInfo.department_title === "Administration" &&
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
      <div className="employee_lists">
        <div className="table-responsive">
          <div id="buttonsContainer"> </div>
          <table
            ref={dataTableRef}
            className="table text-start align-middle table-bordered table-hover mb-0"
          >
            <thead className="bg-dark text-white">
              <tr>
                <th>SL</th>
                <th>DATE</th>
                <th>BY</th>
                <th>ITEM</th>
                <th>FINAL QTY</th>
                <th>PURCHASE QTY</th>
                <th>LEFT PURCHASE QTY</th>
                <th>RECEIVED QTY </th>
                <th>LEFT RECEIVE QTY </th>
                <th>Action</th>
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
                        item.requisition_number
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.part_name
                          .toLowerCase()
                          .includes(lowerCaseSearchValue) ||
                        item.user.toLowerCase().includes(lowerCaseSearchValue)
                      );
                    })

                    .map((item, index) => (
                      <tr key={index} className={item.status}>
                        <td>{item.requisition_number}</td>
                        <td>{moment(item.created_at).format("lll")}</td>
                        <td>{item.user}</td>
                        <td>{item.part_name}</td>
                        <td>{item.final_qty}</td>
                        <td>{item.purchase_qty}</td>
                        <td>{item.left_purchase_qty}</td>
                        <td>{item.received_qty}</td>
                        <td>{item.left_received_qty}</td>
                        <td>
                          <Link
                            className="btn btn-success btn-sm mr-10"
                            to={"/requisitions-details/" + item.requisition_id}
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                </>
              ) : (
                <>
                  {requisitions.map((item, index) => (
                    <tr key={index} className={item.status}>
                      <td>{item.requisition_number}</td>
                      <td>{moment(item.created_at).format("lll")}</td>
                      <td>{item.user}</td>
                      <td>{item.part_name}</td>
                      <td>{item.final_qty}</td>
                      <td>{item.purchase_qty}</td>
                      <td>{item.left_purchase_qty}</td>
                      <td>{item.received_qty}</td>
                      <td>{item.left_received_qty}</td>
                      <td>
                        <Link
                          className="btn btn-success btn-sm mr-10"
                          to={"/requisitions-details/" + item.requisition_id}
                        >
                          Details
                        </Link>
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
      </div>

      <br />
      <br />
    </div>
  );
}
