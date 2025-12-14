import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "../../../services/api";
import Spinner from "../../../elements/Spinner";
import swal from "sweetalert";
import Pagination from "../../../elements/Pagination";
import $ from "jquery";
import "datatables.net";
import "datatables.net-buttons";
import "datatables.net-buttons/js/buttons.html5.min.js";
import "datatables.net-buttons/js/buttons.print.min.js";
import "datatables.net-buttons/js/buttons.colVis.mjs";

export default function Hscodes(props) {
  const [spinner, setSpinner] = useState(false);
  const history = useHistory();

  const [searchValue, setSearchValue] = useState("");
  const dataTableRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [total, setTotal] = useState(0);
  const [links, setLinks] = useState([]);
  const [hscodes, setHscodes] = useState([]);
  const getHscodes = async () => {
    setSpinner(true);
    var response = await api.post("/hscodes?page=" + currentPage, {
      search: searchValue,
    });
    if (response.status === 200 && response.data) {
      setHscodes(response.data.hscodes.data);
      setLinks(response.data.hscodes.links);
      setFrom(response.data.hscodes.from);
      setTo(response.data.hscodes.to);
      setTotal(response.data.hscodes.total);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getHscodes();
  }, [currentPage, searchValue]);

  useEffect(() => {
    const fetchDataAndInitializeDataTable = async () => {
      setSpinner(true);
      await getHscodes();
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
                .html("HS CODE LIST");
              newTitle.insertAfter($(win.document.body).find("h1"));
            },
          },
        ],
        paging: false, // Disable pagination
        info: false,
        searching: false,
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
        <div className="page_name">HS CODES</div>
        <div className="actions">
          {props.userData.department_title === "Commercial" &&
          props.userData.designation_title === "Asst. General Manager" ? (
            <Link
              to="/commercial/hscodes-create"
              className="btn btn-warning bg-falgun rounded-circle"
            >
              <i className="fal fa-plus"></i>
            </Link>
          ) : (
            ""
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8"></div>
        <div className="col-lg-4">
          <label>SEARCH</label>
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            type="search"
            className="form-control"
          />
        </div>
      </div>

      <div className="employees_tables">
        <div id="buttonsContainer"> </div>
        <table ref={dataTableRef} className="display">
          <thead>
            <tr>
              <th>HS</th>
              <th>CODE 8</th>
              <th>CODE 10</th>
              <th>UNIT</th>
              <th>PARTICULARS</th>
              <th>CD</th>
              <th>SD</th>
              <th>VAT</th>
              <th>AIT</th>
              <th>AT</th>
              <th>RD</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {hscodes.map((item, index) => (
              <tr key={index}>
                <td>{item.hs}</td>
                <td>{item.code_8}</td>
                <td>{item.code_10}</td>
                <td>{item.unit}</td>
                <td>{item.description}</td>
                <td>{item.cd}</td>
                <td>{item.sd}</td>
                <td>{item.vat}</td>
                <td>{item.ait}</td>
                <td>{item.at}</td>
                <td>{item.rd}</td>
                <td>{item.status}</td>
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
