import React, { useState, useEffect, useRef } from "react";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import { Modal, Button } from "react-bootstrap";
import swal from "sweetalert";
import Pagination from "../../../elements/Pagination";
import $ from "jquery";
import "datatables.net";
import "datatables.net-buttons";
import "datatables.net-buttons/js/buttons.html5.min.js";
import "datatables.net-buttons/js/buttons.print.min.js";
import "datatables.net-buttons/js/buttons.colVis.mjs";
import { Link } from "react-router-dom";
import Select from "react-select";

export default function AdminSubstoreParts(props) {
  const [spinner, setSpinner] = useState(false);
  const userInfo = props.userData;

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
    user_id: "",
  });
  const clearFields = () => {
    setFilterData({
      company_id: "",
      type: "",
      item_id: "",
      user_id: "",
    });
  };

  const filterChange = (name, value) => {
    setFilterData({
      ...filterData,
      [name]: value,
    });
  };

  const [employees, setEmployees] = useState([]);
  const getEmployees = async () => {
    setSpinner(true);
    // Send the correct page parameter to the API request
    var response = await api.post("/admin/employees");
    if (response.status === 200 && response.data) {
      setEmployees(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const [companies, setCompanies] = useState([]);
  const getCompanies = async () => {
    setSpinner(true);

    // Send the correct page parameter to the API request
    var response = await api.post("/common/companies", {
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
  const [parts, setParts] = useState([]);
  const getParts = async () => {
    setSpinner(true);

    // Send the correct page parameter to the API request
    var response = await api.post("/admin/substores/parts", {
      search: searchValue,
      page: currentPage,
      type: filterData.type,
      company_id: filterData.company_id,
      item_id: filterData.item_id,
      user_id: filterData.user_id,
    });

    if (response.status === 200 && response.data) {
      // Update the state with pagination data
      setParts(response.data.parts.data);
      setLinks(response.data.parts.links);
      setFrom(response.data.parts.from);
      setTo(response.data.parts.to);
      setTotal(response.data.parts.total);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getParts();
  }, [currentPage, searchValue, filterData]);
  useEffect(async () => {
    getCompanies();
    getEmployees();
  }, []);

  useEffect(() => {
    const fetchDataAndInitializeDataTable = async () => {
      setSpinner(true);
      await getParts();
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
                .html("PARTS List");
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
  useEffect(async () => {
    getParts();
  }, [props.callParts]);

  const [units, setUnits] = useState([]);
  const getUnits = async () => {
    var response = await api.post("/common/units");
    if (response.status === 200 && response.data) {
      setUnits(response.data.data);
    } else {
      console.log(response.data);
    }
  };

  useEffect(async () => {
    getUnits();
  }, []);

  // UPLOAD PHOTO
  const handleFileChange = async (event, item) => {
    const file = event.target.files[0];
    const data = new FormData();
    data.append("photo", file);
    data.append("id", item.id);
    try {
      const response = await api.post("/substore/parts-upload-photo", data);
      if (response.status === 200 && response.data) {
        swal({
          title: "Update Success",
          icon: "success",
        });
        getParts();
      }
    } catch (error) {
      console.error("Error updating photo:", error);
    }
  };

  //   UPDATE ITEM INLINE

  const [editIndex, setEditIndex] = useState(null);
  const [editedItem, setEditedItem] = useState({});

  const handleEditClick = (index, item) => {
    setEditIndex(index);
    setEditedItem(item);
  };

  const handleCancelClick = () => {
    setEditIndex(null);
    setEditedItem({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };
  const handleSaveClick = async () => {
    var response = await api.post("/substore/parts-update", editedItem);
    if (response.status === 200 && response.data) {
      setEditIndex(null);
      getParts();
      swal({
        title: "Part Update Success",
        icon: "success",
      });
    } else {
      swal({
        title: response.data.errors.title,
        icon: "error",
      });
    }
  };

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}

      {userInfo.userId === 1 ? (
        <>
          <div className="create_page_heading">
            <div className="page_name">PARTS</div>
            <div className="actions">
              <Link
                to="/power/substore/settings"
                className="btn btn-danger rounded-circle"
              >
                <i className="fal fa-times"></i>
              </Link>
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
                  <label>BY</label>
                  <Select
                    placeholder="Select"
                    value={
                      employees.find((item) => item.id === filterData.user_id)
                        ? {
                            value: filterData.user_id,
                            label:
                              employees.find(
                                (item) => item.id === filterData.user_id
                              ).full_name || "",
                          }
                        : null
                    }
                    onChange={(selectedOption) =>
                      filterChange("user_id", selectedOption.value)
                    }
                    name="user_id"
                    options={employees.map((item) => ({
                      value: item.id,
                      label: item.full_name,
                    }))}
                  />
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label>Item</label>

                  <Select
                    placeholder="Select"
                    value={
                      parts.find((item) => item.id === filterData.item_id)
                        ? {
                            value: filterData.item_id,
                            label:
                              parts.find(
                                (item) => item.id === filterData.item_id
                              ).id || "",
                          }
                        : null
                    }
                    onChange={(selectedOption) =>
                      filterChange("item_id", selectedOption.value)
                    }
                    name="item_id"
                    options={parts.map((item) => ({
                      value: item.id,
                      label: item.id,
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
            <div className="table-responsive">
              <table ref={dataTableRef} className="table">
                <thead className="bg-dark text-white align-items-center">
                  <tr>
                    <th>THUMB</th>
                    <th>VENDOR</th>
                    <th>ID</th>
                    <th>ITEM TITLE</th>
                    <th>TYPE</th>
                    <th>UNIT</th>
                    <th>MIN BL.</th>
                    <th>BY</th>
                    <th>BRAND</th>
                    <th>MODEL</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  <>
                    {parts.map((item, index) => (
                      <tr key={index}>
                        <td style={{ maxWidth: "50px" }}>
                          <img
                            onClick={() => openImageModal(item.image_source)}
                            style={{
                              height: "35px",
                              width: "35px",
                              border: "1px solid gray",
                              borderRadius: "3px",
                              cursor: "pointer",
                              float: "left",
                            }}
                            src={item.image_source}
                          />
                          <div
                            style={{ float: "left" }}
                            className="upload_photo"
                          >
                            <label htmlFor={`file-${index}`}>
                              <i
                                style={{
                                  marginLeft: "5px",
                                  cursor: "pointer",
                                  marginTop: "10px",
                                }}
                                className="fa fa-upload"
                              ></i>
                            </label>
                            <input
                              onChange={(event) =>
                                handleFileChange(event, item)
                              }
                              id={`file-${index}`}
                              name="file"
                              hidden
                              type="file"
                              accept="image/*"
                            />
                          </div>
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          <strong>{item.company}</strong>
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          <strong>{item.id}</strong>
                        </td>
                        <td
                          style={{ maxWidth: "200px", verticalAlign: "middle" }}
                        >
                          {editIndex === index ? (
                            <input
                              type="text"
                              name="title"
                              className="form-control margin_bottom_0 text-uppercase"
                              value={editedItem.title}
                              onChange={handleChange}
                              required
                            />
                          ) : (
                            <strong>{item.title}</strong>
                          )}
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          {editIndex === index ? (
                            <select
                              required
                              name="type"
                              value={editedItem.type}
                              onChange={handleChange}
                              className="form-select margin_bottom_0"
                            >
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
                          ) : (
                            <strong>{item.type}</strong>
                          )}
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          {editIndex === index ? (
                            <select
                              required
                              name="unit"
                              value={editedItem.unit}
                              onChange={handleChange}
                              className="form-select margin_bottom_0"
                            >
                              {units.length > 0 ? (
                                units.map((unit, index) => (
                                  <option key={index} value={unit.title}>
                                    {unit.title}
                                  </option>
                                ))
                              ) : (
                                <option value="">No unit found</option>
                              )}
                            </select>
                          ) : (
                            <strong>{item.unit}</strong>
                          )}
                        </td>

                        <td style={{ verticalAlign: "middle" }}>
                          {editIndex === index ? (
                            <input
                              type="number"
                              name="min_balance"
                              min={1}
                              className="form-control margin_bottom_0"
                              value={editedItem.min_balance}
                              onChange={handleChange}
                            />
                          ) : (
                            <strong>{item.min_balance}</strong>
                          )}
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          <strong>{item.user}</strong>
                        </td>

                        <td style={{ verticalAlign: "middle" }}>
                          {editIndex === index ? (
                            <input
                              type="text"
                              name="brand"
                              className="form-control margin_bottom_0"
                              value={editedItem.brand}
                              onChange={handleChange}
                            />
                          ) : (
                            <strong>{item.brand}</strong>
                          )}
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          {editIndex === index ? (
                            <input
                              type="text"
                              name="model"
                              className="form-control margin_bottom_0"
                              value={editedItem.model}
                              onChange={handleChange}
                            />
                          ) : (
                            <strong>{item.model}</strong>
                          )}
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          {editIndex === index ? (
                            <>
                              <i
                                onClick={handleSaveClick}
                                className="fa fa-check-circle text-success"
                                style={{
                                  fontSize: "20px",
                                  cursor: "pointer",
                                  marginRight: "10px",
                                }}
                              ></i>

                              <i
                                onClick={handleCancelClick}
                                className="fa fa-times-circle text-danger"
                                style={{
                                  fontSize: "20px",
                                  cursor: "pointer",
                                }}
                              ></i>
                            </>
                          ) : (
                            <i
                              onClick={() => handleEditClick(index, item)}
                              className="fas fa-pen text-falgun"
                              style={{
                                fontSize: "15px",
                                cursor: "pointer",
                              }}
                            ></i>
                          )}
                        </td>
                      </tr>
                    ))}
                  </>
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
        </>
      ) : (
        <h1 className="text-uppercase text-danger">
          You are on wrong place baby! Beware of dogs.
        </h1>
      )}
    </div>
  );
}
