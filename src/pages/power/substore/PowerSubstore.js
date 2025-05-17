import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import Select from "react-select";
import { Modal, Button, Dropdown, Offcanvas } from "react-bootstrap";
import swal from "sweetalert";
import Pagination from "../../../elements/Pagination";
import $ from "jquery";
import "datatables.net";
import "datatables.net-buttons";
import "datatables.net-buttons/js/buttons.html5.min.js";
import "datatables.net-buttons/js/buttons.print.min.js";
import "datatables.net-buttons/js/buttons.colVis.mjs";
import SubstoreIssueCanvas from "../../../elements/modals/SubstoreIssueCanvas";

// import Offcanvas from "react-bootstrap";

export default function PowerSubstore(props) {
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

  //FILTERING
  const [filterData, setFilterData] = useState({
    company_id: "",
    type: "",
    item_id: "",
  });
  const clearFields = () => {
    setFilterData({
      company_id: "",
      type: "",
      item_id: "",
    });
  };

  const filterChange = (name, value) => {
    setFilterData({
      ...filterData,
      [name]: value,
    });
  };

  const [companies, setCompanies] = useState([]);
  const getCompanies = async () => {
    setSpinner(true);

    // Send the correct page parameter to the API request
    var response = await api.post("/companies", {
      type: "Own",
    });

    if (response.status === 200 && response.data) {
      setCompanies(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  // get all store items
  const [substores, setSubstores] = useState([]);
  const getSubstores = async () => {
    setSpinner(true);

    // Send the correct page parameter to the API request
    var response = await api.post("/power/substores", {
      search: searchValue,
      page: currentPage,
      type: filterData.type,
      company_id: filterData.company_id,
      item_id: filterData.item_id,
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
  }, [currentPage, searchValue, filterData]);

  useEffect(async () => {
    getCompanies();
  }, []);

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

  useEffect(async () => {
    getSubstores();
  }, [props.callSubstores]);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}

      {userInfo.userId === 1 ? (
        <>
          <div className="create_page_heading">
            <div className="page_name">Manage Sub Store</div>
            <div className="actions">
              <div className="d-flex">
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
                <Dropdown>
                  <Dropdown.Toggle
                    variant="warning"
                    className="bg-falgun"
                    id="dropdown-basic"
                  >
                    REPORTS
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href="/substores-report">
                      SUMMARY
                    </Dropdown.Item>
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
                  className="btn btn-info"
                >
                  ITEMS
                </Link>
                <Link
                  to="/power/substore/settings"
                  className="btn btn-danger rounded-circle"
                >
                  <i className="fal fa-times"></i>
                </Link>
              </div>
            </div>
          </div>

          <div className="datrange_filter non_printing_area">
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label>Vendor</label>
                  <select
                    value={filterData.company_id}
                    className="form-select"
                    name="company_id"
                    onChange={(event) =>
                      filterChange("company_id", event.target.value)
                    }
                  >
                    <option value="">All</option>
                    {companies.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label>Item Type</label>
                  <select
                    value={filterData.type}
                    className="form-select"
                    name="type"
                    onChange={(event) =>
                      filterChange("type", event.target.value)
                    }
                  >
                    <option value="">All</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Spare Parts">Spare Parts</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Needle">Needle</option>
                    <option value="Medical">Medical</option>
                    <option value="Fire">Fire</option>
                    <option value="Compressor & boiler">
                      Compressor & boiler
                    </option>
                    <option value="Chemical">Chemical</option>
                    <option value="Printing">Printing</option>
                    <option value="It">It</option>
                    <option value="WTP">WTP</option><option value="Vehicle">Vehicle</option>
<option value="Compliance">Compliance</option>
                  </select>
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label>Item</label>

                  <Select
                    placeholder="Select"
                    value={
                      substores.find((item) => item.id === filterData.item_id)
                        ? {
                            value: filterData.item_id,
                            label:
                              substores.find(
                                (item) => item.id === filterData.item_id
                              ).part_name || "",
                          }
                        : null
                    }
                    onChange={(selectedOption) =>
                      filterChange("item_id", selectedOption.value)
                    }
                    name="item_id"
                    options={substores.map((item) => ({
                      value: item.id,
                      label: item.part_name,
                    }))}
                  />
                </div>
              </div>

              <div className="col">
                <div className="form-group">
                  <label>Search</label>
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

              <div className="col">
                <br />
                <Button
                  onClick={clearFields}
                  className="btn btn-warning btn-sm"
                >
                  <i className="fas fa-retweet"></i>
                </Button>{" "}
              </div>
            </div>
          </div>
          <hr />
          <div className="employee_lists">
            <div className="">
              <table ref={dataTableRef} className="table substore_dataTable">
                <thead className="">
                  <tr>
                    <th rowSpan="2">THUMB</th>
                    <th rowSpan="2">VENDOR</th>
                    <th rowSpan="2">ID</th>
                    <th rowSpan="2">ITEM</th>

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
                        <strong>{item.company}</strong>
                      </td>
                      <td>
                        <strong>{item.part_id}</strong>
                      </td>
                      <td>
                        <strong>{item.part_name}</strong>
                        <br />
                        {item.type} | {item.unit}
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
                          <i className="fa fa-eye"></i>
                        </Link>{" "}
                        <button
                          onClick={() => {
                            props.setSubstoreIssueCanvas(true);
                            props.setSubstoreCanvasId(item.id);
                          }}
                          className="btn btn-sm btn-warning"
                        >
                          <i className="fa fa-angle-right"></i>
                        </button>
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
        </>
      ) : (
        <h1 className="text-uppercase text-danger">
          You are on wrong place baby! Beware of dogs.
        </h1>
      )}
    </div>
  );
}
