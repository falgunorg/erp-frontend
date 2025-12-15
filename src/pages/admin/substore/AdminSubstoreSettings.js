import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import api from "services/api";
import swal from "sweetalert";
import Spinner from "../../../elements/Spinner";
import Select from "react-select";

import $ from "jquery";
import "datatables.net";
import "datatables.net-buttons";
import "datatables.net-buttons/js/buttons.html5.min.js";
import "datatables.net-buttons/js/buttons.print.min.js";
import "datatables.net-buttons/js/buttons.colVis.mjs";

export default function AdminSubstoreSettings(props) {
  const userInfo = props.userData;
  const dataTableRef = useRef(null);
  //IMPORT PARTS
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const [spinner, setSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", selectedFile);
    setSpinner(true);
    var response = await api.post("/settings-store-parts", formData);
    if (response.status === 200 && response.data) {
      console.log(response.data);
      swal({
        title: "Upload Success",
        icon: "success",
      });
      window.location.reload(false);
    } else {
      setErrorMessage(response.data.errors.file);
    }
    setSpinner(true);
  };

  //REVISE BALANCE
  const [substores, setSubstores] = useState([]);
  const getSubstores = async () => {
    setSpinner(true);
    var response = await api.post("/substore/substores");
    if (response.status === 200 && response.data) {
      setSubstores(response.data.all_data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };
  const [reviseForm, setReviseForm] = useState({
    part_id: "",
    qty: 0,
  });

  const handleReviseChange = async (name, value) => {
    setReviseForm({
      ...reviseForm,
      [name]: value,
    });
  };

  console.log("REVISEFORM", reviseForm);

  const submitRevise = async (event) => {
    event.preventDefault();
    setSpinner(true);
    try {
      const response = await api.post("/substore/substores-revise", reviseForm);
      if (response.status === 200 && response.data) {
        setReviseForm({
          part_id: "",
          qty: 0,
        });
        getSubstores();
      }
    } catch (error) {
      console.error("Error issuing substore:", error);
    }
    setSpinner(false);
  };

  // ACCESS AREA MANAGEMENT
  const [accesses, setAccesses] = useState([]);

  const getAccesses = async () => {
    setSpinner(true);
    try {
      const response = await api.post("/admin/substores/access");
      if (response.status === 200 && response.data) {
        setAccesses(response.data.data);
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching accesses:", error);
    } finally {
      setSpinner(false);
    }
  };

  useEffect(() => {
    getAccesses();
  }, []);

  useEffect(() => {
    const fetchDataAndInitializeDataTable = async () => {
      setSpinner(true);
      await getAccesses();
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
                // Exclude the second (index 1) and last columns
                return idx !== dataTable.columns().indexes().length - 1;
              },
            },
          },
        ],
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

  // Employees
  const [employees, setEmployees] = useState([]);

  const getEmployees = async () => {
    setSpinner(true);
    try {
      const response = await api.post("/admin/employees");
      if (response.status === 200 && response.data) {
        setEmployees(response.data.data);
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setSpinner(false);
    }
  };

  useEffect(() => {
    getEmployees();
    getSubstores();
  }, []);

  const areas = [
    "Stationery",
    "Spare Parts",
    "Electrical",
    "Needle",
    "Medical",
    "Fire",
    "Compressor & boiler",
    "Chemical",
    "Printing",
    "It",
    "WTP",
    "Vehicle",
    "Compliance"
  ];

  const [accessForm, setAccessForm] = useState({
    user_id: "",
    area: [],
  });

  const handleChange = (name, selectedOptions) => {
    if (name === "user_id") {
      setAccessForm((prevState) => ({
        ...prevState,
        user_id: selectedOptions.value,
      }));
    } else if (name === "area") {
      const selectedAreas = selectedOptions.map((option) => option.value);
      setAccessForm((prevState) => ({
        ...prevState,
        area: selectedAreas,
      }));
    }
  };

  const handleAddAccess = async () => {
    try {
      const response = await api.post(
        "/power/substores/access-create",
        accessForm
      );
      if (response.status === 200 && response.data) {
        getAccesses();
        swal({
          title: "Access Added Success",
          icon: "success",
        });
      } else {
        swal({
          title: response.data.errors.title,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error updating part:", error);
    }
  };

  // UPDATE ITEM INLINE
  const [editIndex, setEditIndex] = useState(null);
  const [editedItem, setEditedItem] = useState({});

  const handleEditClick = (index, item) => {
    setEditIndex(index);
    setEditedItem({
      ...item,
      area: item.area.split(","), // Convert the comma-separated string to an array
    });
  };

  const handleCancelClick = () => {
    setEditIndex(null);
    setEditedItem({});
  };

  const handleEditChange = (selectedOptions) => {
    const selectedAreas = selectedOptions.map((option) => option.value);
    setEditedItem((prevItem) => ({
      ...prevItem,
      area: selectedAreas,
    }));
  };

  const handleUpdateClick = async () => {
    try {
      const response = await api.post("/admin/substores/access-update", {
        ...editedItem,
        area: editedItem.area.join(","), // Convert the array back to a comma-separated string
      });
      if (response.status === 200 && response.data) {
        setEditIndex(null);
        getAccesses();
        swal({
          title: "Access Update Success",
          icon: "success",
        });
      } else {
        swal({
          title: response.data.errors.title,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error updating part:", error);
      swal({
        title: "Update failed",
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
            <div className="page_name">Sub-Store Settings</div>
            <div className="actions">
              <Link
                to="/empire/power"
                className="btn btn-danger rounded-circle"
              >
                <i className="fal fa-times"></i>
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-6 col-xl-4">
              <div className="h-100 bg-modiste-green rounded p-3">
                <h6 className="mb-0 uppercase">Import Parts With Stock</h6>
                <hr />
                <div className="">
                  <div className="form-group">
                    <label>Upload Excel File</label>
                    <input
                      onChange={handleFileSelect}
                      className="form-control"
                      type="file"
                      placeholder="Upload Excel File"
                    />
                  </div>

                  {errorMessage && (
                    <div className="errorMsg">{errorMessage}</div>
                  )}

                  <div className="next_btns">
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="btn btn-primary"
                    >
                      IMPORT
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-6 col-xl-8">
              <div className="h-100 bg-modiste-purple-light rounded p-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h6 className="mb-0 uppercase">Revise Balance</h6>
                </div>
                <hr />
                <form onSubmit={submitRevise}>
                  <div className="form-group">
                    <label>Item ID</label>
                    <Select
                      required
                      placeholder="Select Or Search"
                      onChange={(selectedOption) =>
                        handleReviseChange("part_id", selectedOption.value)
                      }
                      value={
                        substores.find(
                          (item) => item.part_id === reviseForm.part_id
                        )
                          ? {
                              value: reviseForm.part_id,
                              label: `${
                                substores.find(
                                  (item) => item.part_id === reviseForm.part_id
                                ).part_id
                              } | ${
                                substores.find(
                                  (item) => item.part_id === reviseForm.part_id
                                ).part_name
                              } | ${
                                substores.find(
                                  (item) => item.part_id === reviseForm.part_id
                                ).qty
                              }`,
                            }
                          : null
                      }
                      name="part_id"
                      options={substores.map((item) => ({
                        value: item.part_id,
                        label: `${item.part_id} | ${item.part_name} | ${item.qty}`,
                      }))}
                    />
                  </div>

                  <div className="form-group">
                    <label>QTY</label>
                    <input
                      required
                      type="number"
                      className="form-control"
                      name="qty"
                      min={1}
                      value={reviseForm.qty}
                      onChange={(event) =>
                        handleReviseChange("qty", event.target.value)
                      }
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    SET
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="row g-4 pt-4">
            <div className="col-sm-6 col-xl-2">
              <Link to="/power/substores/requisitions">
                <div className="bg-falgun-light rounded d-flex align-items-center justify-content-between p-3">
                  <i className="fa fa-list text-falgun"></i>
                  <div className="ms-3">
                    <h6 className="mb-2">REQUISITIONS</h6>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-sm-6 col-xl-2">
              <Link to="/power/substores">
                <div className="bg-falgun-light rounded d-flex align-items-center justify-content-between p-3">
                  <i className="fa fa-store text-falgun"></i>
                  <div className="ms-3">
                    <h6 className="mb-2">SUB-STORES</h6>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-sm-6 col-xl-2">
              <Link to="/power/substores/parts">
                <div className="bg-falgun-light rounded d-flex align-items-center justify-content-between p-3">
                  <i className="fa fa-store text-falgun"></i>
                  <div className="ms-3">
                    <h6 className="mb-2">PARTS</h6>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-sm-6 col-xl-2">
              <Link to="/power/substores/receives">
                <div className="bg-falgun-light rounded d-flex align-items-center justify-content-between p-3">
                  <i className="fa fa-store text-falgun"></i>
                  <div className="ms-3">
                    <h6 className="mb-2">RECEIVES</h6>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-sm-6 col-xl-2">
              <Link to="/power/substores/issues">
                <div className="bg-falgun-light rounded d-flex align-items-center justify-content-between p-3">
                  <i className="fa fa-store text-falgun"></i>
                  <div className="ms-3">
                    <h6 className="mb-2">ISSUES</h6>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="row g-4 pt-4">
            <div className="col-sm-6 col-xl-12">
              <div className="h-100 rounded border p-3">
                <div className="mb-2">
                  <h6 className="mb-0">ACCESS MANAGEMENT</h6>
                </div>
                <hr />
                <div className="row">
                  <div className="col-5">
                    <div className="form-group">
                      <Select
                        placeholder="SELECT OR SEARCH"
                        value={
                          employees.find(
                            (item) => item.id === accessForm.user_id
                          )
                            ? {
                                value: accessForm.user_id,
                                label:
                                  employees.find(
                                    (item) => item.id === accessForm.user_id
                                  ).full_name +
                                    " - " +
                                    employees.find(
                                      (item) => item.id === accessForm.user_id
                                    ).department_title +
                                    " - " +
                                    employees.find(
                                      (item) => item.id === accessForm.user_id
                                    ).designation_title +
                                    " - " +
                                    employees.find(
                                      (item) => item.id === accessForm.user_id
                                    ).company_title || "",
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleChange("user_id", selectedOption)
                        }
                        name="user_id"
                        options={employees.map((item) => ({
                          value: item.id,
                          label: `${item.full_name} - ${item.department_title} - ${item.designation_title} - ${item.company_title}`,
                        }))}
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <Select
                        isMulti
                        name="area"
                        placeholder="SELECT MULTIPLE"
                        value={accessForm.area.map((areaName) => ({
                          value: areaName,
                          label: areaName,
                        }))}
                        onChange={(selectedOptions) =>
                          handleChange("area", selectedOptions)
                        }
                        options={areas.map((area) => ({
                          value: area,
                          label: area,
                        }))}
                      />
                    </div>
                  </div>
                  <div className="col-1">
                    <button
                      type="submit"
                      onClick={handleAddAccess}
                      className="btn btn-warning bg-falgun ms-2"
                    >
                      ADD
                    </button>
                  </div>
                </div>
                <hr />
                <div className="supplier_table">
                  <table ref={dataTableRef} className="display">
                    <thead className="bg-falgun">
                      <tr>
                        <th>USER</th>
                        <th>DEP|DES</th>
                        <th>COMPNAY</th>
                        <th>ACCESS AREA</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accesses.map((item, index) => (
                        <tr key={index}>
                          <td style={{ verticalAlign: "middle" }}>
                            <strong>{item.user_name}</strong>
                          </td>
                          <td style={{ verticalAlign: "middle" }}>
                            <strong>
                              {item.department_title} | {item.designation_title}
                            </strong>
                          </td>
                          <td style={{ verticalAlign: "middle" }}>
                            <strong>{item.company_title}</strong>
                          </td>

                          <td
                            style={{
                              maxWidth: "200px",
                              verticalAlign: "middle",
                            }}
                          >
                            {editIndex === index ? (
                              <Select
                                isMulti
                                name="area"
                                placeholder="SELECT MULTIPLE"
                                value={editedItem.area.map((areaName) => ({
                                  value: areaName,
                                  label: areaName,
                                }))}
                                onChange={handleEditChange}
                                options={areas.map((area) => ({
                                  value: area,
                                  label: area,
                                }))}
                              />
                            ) : (
                              <strong>{item.area}</strong>
                            )}
                          </td>
                          <td style={{ verticalAlign: "middle" }}>
                            {editIndex === index ? (
                              <>
                                <i
                                  onClick={handleUpdateClick}
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
                                className="fa fa-pen text-falgun"
                                style={{ fontSize: "15px", cursor: "pointer" }}
                              ></i>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <h1 className="text-uppercase text-danger">
          You are on wrong place baby! Beware of dogs.
        </h1>
      )}

      <br />
      <br />
      <br />
    </div>
  );
}
