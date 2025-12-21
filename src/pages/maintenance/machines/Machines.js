import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "../../../services/api";
import Spinner from "../../../elements/Spinner";
import swal from "sweetalert";
import { Modal, Button } from "react-bootstrap";
import Pagination from "../../../elements/Pagination";
import $ from "jquery";
import "datatables.net";
import "datatables.net-buttons";
import "datatables.net-buttons/js/buttons.html5.min.js";
import "datatables.net-buttons/js/buttons.print.min.js";
import "datatables.net-buttons/js/buttons.colVis.mjs";

export default function Machines(props) {
  const [spinner, setSpinner] = useState(false);
  const history = useHistory();

  const [searchValue, setSearchValue] = useState("");
  const dataTableRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [total, setTotal] = useState(0);
  const [links, setLinks] = useState([]);
  const [machines, setMachines] = useState([]);

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

  const getMachines = async () => {
    setSpinner(true);
    var response = await api.post("/machines?page=" + currentPage, {
      search: searchValue,
    });
    if (response.status === 200 && response.data) {
      setMachines(response.data.machines.data);
      setLinks(response.data.machines.links);
      setFrom(response.data.machines.from);
      setTo(response.data.machines.to);
      setTotal(response.data.machines.total);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getMachines();
  }, [currentPage, searchValue]);

  useEffect(() => {
    const fetchDataAndInitializeDataTable = async () => {
      setSpinner(true);
      await getMachines();
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
                .html("MACHINE LIST");
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
        <div className="page_name">Machines</div>
        <div className="actions">
          {props.userData.department_title === "Maintenance" ||
          props.userData.designation_title === "Manager" ? (
            <Link
              to="/maintenance/machines-create"
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
              <th>SL</th>
              <th>THUMB</th>
              <th>TITLE</th>
              <th>MODEL</th>
              <th>BRAND</th>
              <th>TYPE</th>
              <th>UNIT</th>
              <th>REF</th>
              <th>EFFICIENCY</th>
              <th>COMPANY</th>
              <th>OWNERSHIP</th>
              <th>CATEGORY</th>
              <th>VALUE</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {machines.map((item, index) => (
              <tr
                key={index}
                className={item.status === "Inactive" ? "Pending" : "Placed"}
              >
                <td>{item.serial_number}</td>
                <td>
                  <img
                    onClick={() => openImageModal(item.image_source)}
                    style={{
                      width: "50px",
                      height: "50px",
                      border: "1px solid gray",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                    src={item.image_source}
                  />
                </td>
                <td>{item.title}</td>
                <td>{item.model}</td>
                <td>{item.brand}</td>
                <td>{item.type}</td>
                <td>{item.unit}</td>
                <td>{item.reference}</td>
                <td>{item.efficiency} %</td>
                <td>{item.company}</td>
                <td>{item.ownership}</td>
                <td>{item.category}</td>
                <td>{item.purchase_value}</td>
                <td>{item.status}</td>
                <td>
                  <Link to={"/maintenance/machines-edit/" + item.id}>
                    <i className="fas fa-pen"></i>
                  </Link>
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
