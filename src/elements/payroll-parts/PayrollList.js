import React, { useState, useEffect } from "react";
import api from "../../services/api";
import moment from "moment";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";

export default function PayrollList() {
  const [spinner, setSpinner] = useState();
  const [payrolls, setPayrolls] = useState([]);
  const [companyId, setCompanyId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [status, setStatus] = useState("");
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.post("/common/departments");
        if (response.status === 200 && response.data) {
          setDepartments(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const response = await api.post("/common/designations");
        if (response.status === 200 && response.data) {
          setDesignations(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDesignations();
  }, []);

  const getPayrolls = async () => {
    try {
      const response = await api.post("/hr/admin/payrolls", {
        company_id: companyId,
        department: department,
        designation: designation,
        status: status,
      });
      if (response.status === 200 && response.data) {
        setPayrolls(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    getPayrolls();
  }, [companyId, department, designation, status]);

  const filteredData = payrolls.filter(
    (item) =>
      item.full_name.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.staff_id.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handlePrint = () => {};
  const handleDownloadPDF = () => {};

  //adding area on modal

  const [open, setOpen] = useState(false);
  const closeModal = () => {
    setFormData({
      staff_id: "",
      full_name: "",
      gross_salary: "",
      basic_salary: "",
      house_rent: "",
      medical_allowance: "",
      transport_allowance: "",
      food_allowance: "",
    });
    setErrors({});
    setOpen(false);
  };

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    staff_id: "",
    full_name: "",
    company_id: "",
    department_id: "",
    designation_id: "",
    gross_salary: "",
    basic_salary: "",
    house_rent: "",
    medical_allowance: "",
    transport_allowance: "",
    food_allowance: "",
  });

  const handleChange = (name, value) => {
    setFormData((prevState) => {
      let updatedData = { ...prevState, [name]: value };

      if (name === "gross_salary") {
        const gross_salary = parseFloat(value) || 0;

        updatedData = {
          ...updatedData,
          basic_salary: gross_salary * 0.62,
          house_rent: gross_salary * 0.3,
          medical_allowance: gross_salary * 0.03,
          transport_allowance: gross_salary * 0.02,
          food_allowance: gross_salary * 0.03,
        };
      }

      return updatedData;
    });
  };

  const validateForm = () => {
    let formErrors = {};

    if (!formData.staff_id) {
      formErrors.staff_id = "Staff ID is required";
    }
    if (!formData.full_name) {
      formErrors.full_name = "Full Name is required";
    }
    if (!formData.company_id) {
      formErrors.company_id = "Company is Required";
    }

    if (!formData.department_id) {
      formErrors.department_id = "Department is Required";
    }
    if (!formData.designation_id) {
      formErrors.designation_id = "Designation is Required";
    }

    if (!formData.gross_salary) {
      formErrors.gross_salary = "Gross Salary is required";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  console.log("DATASET", formData);

  const submitPayroll = async () => {
    try {
      if (validateForm()) {
        const response = await api.post("/hr/admin/payrolls-create", {
          staff_id: formData.staff_id,
          full_name: formData.full_name,
          company_id: formData.company_id,
          department_id: formData.department_id,
          designation_id: formData.designation_id,
          gross_salary: formData.gross_salary,
          basic_salary: formData.basic_salary,
          house_rent: formData.house_rent,
          medical_allowance: formData.medical_allowance,
          transport_allowance: formData.transport_allowance,
          food_allowance: formData.food_allowance,
        });
        if (response.status === 200 && response.data) {
          getPayrolls();
          setFormData({});
          setOpen(false);
        } else {
          setErrors(response.data.errors);
        }
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // update mechanism
  const [editingItem, setEditingItem] = useState({});
  const [editModal, setEditModal] = useState(false);

  const openEditModal = (item) => {
    setEditingItem(item || {}); // Ensure it's always an object
    setErrors({});
    setEditModal(true);
  };

  const closeEditModal = () => {
    setEditingItem({});
    setErrors({});
    setEditModal(false);
  };

  const handleEditChange = (name, value) => {
    setEditingItem((prevState) => {
      if (!prevState) return prevState;

      let updatedData = { ...prevState, [name]: value };

      if (name === "gross_salary") {
        const gross_salary = parseFloat(value) || 0;

        updatedData = {
          ...updatedData,
          basic_salary: gross_salary * 0.62,
          house_rent: gross_salary * 0.3,
          medical_allowance: gross_salary * 0.03,
          transport_allowance: gross_salary * 0.02,
          food_allowance: gross_salary * 0.03,
        };
      }

      return updatedData;
    });
  };

  const validateEditForm = () => {
    let formErrors = {};

    if (!editingItem?.staff_id) {
      formErrors.staff_id = "Staff ID is required";
    }
    if (!editingItem?.full_name) {
      formErrors.full_name = "Full Name is required";
    }
    if (!editingItem?.company_id) {
      formErrors.company_id = "Company is required";
    }
    if (!editingItem?.department_id) {
      formErrors.department_id = "Department is required";
    }
    if (!editingItem?.designation_id) {
      formErrors.designation_id = "Designation is required";
    }
    if (!editingItem?.gross_salary) {
      formErrors.gross_salary = "Gross Salary is required";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const updatePayroll = async () => {
    if (!validateEditForm()) return;

    try {
      const response = await api.post("/hr/admin/payrolls-update", {
        ...editingItem,
      });

      if (response.status === 200 && response.data) {
        getPayrolls();
        closeEditModal();
      } else {
        setErrors(response.data.errors || {});
      }
    } catch (error) {
      console.error("Error updating payroll:", error);
    }
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="bg-white rounded p-1 box_shadow_card">
          <h6>
            <strong>Payroll List</strong>
          </h6>
          <div className="d-inline justify-content-start align-items-center gap-3">
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
            >
              <option value="">All</option>
              <option value="1">JMS</option>
              <option value="2">MCL</option>
              <option value="3">MBL</option>
              <option value="4">H/O</option>
            </select>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">Department</option>
              {departments.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>

            <select
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            >
              <option value="">Designation</option>
              {designations.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>

            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <input
              type="search"
              className="me-2"
              value={searchValue}
              style={{ maxWidth: "100px", fontSize: "12px" }}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {!spinner && (
              <>
                <button
                  onClick={handlePrint}
                  style={{ maxHeight: "25px", padding: "2px 5px 2px 5px" }}
                  className="btn btn-outline-secondary btn-sm me-2"
                >
                  <i className="fa fa-print"></i>
                </button>
                <button
                  onClick={handleDownloadPDF}
                  style={{ maxHeight: "25px", padding: "2px 5px 2px 5px" }}
                  className="btn btn-outline-secondary btn-sm me-2"
                >
                  <i className="fa fa-file-pdf"></i>
                </button>
              </>
            )}
          </div>
          <hr />
          <div className="table-responsive attendance_table_area">
            <table className="table table-bordered table-striped print-table">
              <tr>
                <td colSpan={11}></td>
                <td className="text-center cursor-pointer">
                  <i
                    style={{ cursor: "pointer" }}
                    onClick={() => setOpen(true)}
                    className="fa fa-plus text-success"
                  ></i>
                </td>
              </tr>
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "white",
                  zIndex: 1,
                  width: "100%",
                }}
                className="print-thead thead-dark table-dark"
              >
                <tr className="table_heading_tr">
                  <th>ID</th>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Basic Salary</th>
                  <th>House Rent</th>
                  <th>Medical Allowance </th>
                  <th>Transport Allowance </th>
                  <th>Food Allowance</th>
                  <th>Gross Salary</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.staff_id}</td>
                    <td>{item.full_name}</td>
                    <td>{item.company_name}</td>
                    <td>{item.department_title}</td>
                    <td>{item.designation_title}</td>
                    <td>{item.basic_salary}</td>
                    <td>{item.house_rent}</td>
                    <td>{item.medical_allowance}</td>
                    <td>{item.transport_allowance}</td>
                    <td>{item.food_allowance}</td>
                    <td>
                      <strong>{item.gross_salary}</strong>
                    </td>
                    <td className="text-center">
                      <i
                        style={{ cursor: "pointer" }}
                        onClick={() => openEditModal(item)}
                        className="far fa-pen"
                      ></i>
                    </td>
                  </tr>
                ))}

                <tr>
                  <td colSpan={5} className="text-center">
                    <strong>TOTAL</strong>
                  </td>
                  <td>
                    <strong>
                      {filteredData.reduce(
                        (total, item) => total + Number(item.basic_salary),
                        0
                      )}
                    </strong>
                  </td>
                  <td>
                    <strong>
                      {filteredData.reduce(
                        (total, item) => total + Number(item.house_rent),
                        0
                      )}
                    </strong>
                  </td>
                  <td>
                    <strong>
                      {filteredData.reduce(
                        (total, item) => total + Number(item.medical_allowance),
                        0
                      )}{" "}
                    </strong>
                  </td>
                  <td>
                    <strong>
                      {filteredData.reduce(
                        (total, item) =>
                          total + Number(item.transport_allowance),
                        0
                      )}{" "}
                    </strong>
                  </td>
                  <td>
                    <strong>
                      {filteredData.reduce(
                        (total, item) => total + Number(item.food_allowance),
                        0
                      )}{" "}
                    </strong>
                  </td>
                  <td>
                    <strong>
                      {filteredData.reduce(
                        (total, item) => total + Number(item.gross_salary),
                        0
                      )}{" "}
                    </strong>
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* addding modal */}

          <Modal size="md" show={open}>
            <Modal.Header>
              <Modal.Title>Add Payroll</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form">
                <h6>Job Details</h6>
                <hr />
                <div className="row">
                  <div className="col-12 col-lg-12">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        required
                        type="text"
                        className="form-control"
                        placeholder="John Doe"
                        name="full_name"
                        value={formData.full_name}
                        onChange={(event) =>
                          handleChange("full_name", event.target.value)
                        }
                      />
                      {errors.full_name && (
                        <div className="text-danger">{errors.full_name}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label>Staff ID</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="203478"
                        required
                        name="staff_id"
                        value={formData.staff_id}
                        onChange={(event) =>
                          handleChange("staff_id", event.target.value)
                        }
                      />
                      {errors.staff_id && (
                        <div className="text-danger">{errors.staff_id}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label>Company</label>
                      <select
                        className="form-select"
                        value={formData.company_id}
                        name="company_id"
                        onChange={(event) =>
                          handleChange("company_id", event.target.value)
                        }
                      >
                        <option value="">Select</option>
                        <option value="1">JMS</option>
                        <option value="2">MCL</option>
                        <option value="3">MBL</option>
                        <option value="4">H/O</option>
                      </select>

                      {errors.company_id && (
                        <div className="text-danger">{errors.company_id}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label>Department</label>

                      <Select
                        placeholder="Select"
                        value={
                          departments.find(
                            (item) => item.id === formData.department_id
                          )
                            ? {
                                value: formData.department_id,
                                label:
                                  departments.find(
                                    (item) => item.id === formData.department_id
                                  ).title || "",
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleChange("department_id", selectedOption.value)
                        }
                        name="department_id"
                        options={departments.map((item) => ({
                          value: item.id,
                          label: item.title,
                        }))}
                      />

                      {errors.department_id && (
                        <div className="text-danger">
                          {errors.department_id}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label>Designation</label>
                      <Select
                        placeholder="Select"
                        value={
                          designations.find(
                            (item) => item.id === formData.designation_id
                          )
                            ? {
                                value: formData.designation_id,
                                label:
                                  designations.find(
                                    (item) =>
                                      item.id === formData.designation_id
                                  ).title || "",
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleChange("designation_id", selectedOption.value)
                        }
                        name="designation_id"
                        options={designations.map((item) => ({
                          value: item.id,
                          label: item.title,
                        }))}
                      />

                      {errors.designation_id && (
                        <div className="text-danger">
                          {errors.designation_id}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <br />
                <h6>Payment Details</h6>
                <hr />

                <div className="row">
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label>Gross Salary</label>
                      <input
                        required
                        type="number"
                        className="form-control"
                        name="gross_salary"
                        value={formData.gross_salary}
                        onChange={(event) =>
                          handleChange("gross_salary", event.target.value)
                        }
                      />
                      {errors.gross_salary && (
                        <div className="text-danger">{errors.gross_salary}</div>
                      )}
                    </div>
                  </div>

                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label>Basic Salary</label>
                      <input
                        readOnly
                        type="number"
                        className="form-control"
                        name="basic_salary"
                        value={formData.basic_salary}
                        onChange={(event) =>
                          handleChange("basic_salary", event.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label>House Rent</label>
                      <input
                        readOnly
                        type="number"
                        className="form-control"
                        name="house_rent"
                        value={formData.house_rent}
                        onChange={(event) =>
                          handleChange("house_rent", event.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label>Medical Allowance</label>
                      <input
                        readOnly
                        type="number"
                        className="form-control"
                        name="medical_allowance"
                        value={formData.medical_allowance}
                        onChange={(event) =>
                          handleChange("medical_allowance", event.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label>Transport Allowance</label>
                      <input
                        readOnly
                        type="number"
                        className="form-control"
                        name="transport_allowance"
                        value={formData.transport_allowance}
                        onChange={(event) =>
                          handleChange(
                            "transport_allowance",
                            event.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label>Food Allowance</label>
                      <input
                        readOnly
                        type="number"
                        className="form-control"
                        name="food_allowance"
                        value={formData.food_allowance}
                        onChange={(event) =>
                          handleChange("food_allowance", event.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="default" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={submitPayroll}>
                Save
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal size="md" show={editModal}>
            <Modal.Header>
              <Modal.Title>Update Payroll</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form">
                <h6>Job Details</h6>
                <hr />
                <div className="row">
                  <div className="col-12 col-lg-12">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        required
                        type="text"
                        className="form-control"
                        placeholder="John Doe"
                        name="full_name"
                        value={editingItem.full_name}
                        onChange={(event) =>
                          handleEditChange("full_name", event.target.value)
                        }
                      />
                      {errors.full_name && (
                        <div className="text-danger">{errors.full_name}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label>Staff ID</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="203478"
                        required
                        name="staff_id"
                        value={editingItem.staff_id}
                        onChange={(event) =>
                          handleEditChange("staff_id", event.target.value)
                        }
                      />
                      {errors.staff_id && (
                        <div className="text-danger">{errors.staff_id}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label>Company</label>
                      <select
                        className="form-select"
                        value={editingItem.company_id}
                        name="company_id"
                        onChange={(event) =>
                          handleEditChange("company_id", event.target.value)
                        }
                      >
                        <option value="">Select</option>
                        <option value="1">JMS</option>
                        <option value="2">MCL</option>
                        <option value="3">MBL</option>
                        <option value="4">H/O</option>
                      </select>

                      {errors.company_id && (
                        <div className="text-danger">{errors.company_id}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label>Department</label>

                      <Select
                        placeholder="Select"
                        value={
                          departments.find(
                            (item) => item.id === editingItem.department_id
                          )
                            ? {
                                value: editingItem.department_id,
                                label:
                                  departments.find(
                                    (item) =>
                                      item.id === editingItem.department_id
                                  ).title || "",
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleEditChange(
                            "department_id",
                            selectedOption.value
                          )
                        }
                        name="department_id"
                        options={departments.map((item) => ({
                          value: item.id,
                          label: item.title,
                        }))}
                      />

                      {errors.department_id && (
                        <div className="text-danger">
                          {errors.department_id}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label>Designation</label>
                      <Select
                        placeholder="Select"
                        value={
                          designations.find(
                            (item) => item.id === editingItem.designation_id
                          )
                            ? {
                                value: editingItem.designation_id,
                                label:
                                  designations.find(
                                    (item) =>
                                      item.id === editingItem.designation_id
                                  ).title || "",
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleEditChange(
                            "designation_id",
                            selectedOption.value
                          )
                        }
                        name="designation_id"
                        options={designations.map((item) => ({
                          value: item.id,
                          label: item.title,
                        }))}
                      />

                      {errors.designation_id && (
                        <div className="text-danger">
                          {errors.designation_id}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <br />
                <h6>Payment Details</h6>
                <hr />

                <div className="row">
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label>Gross Salary</label>
                      <input
                        required
                        type="number"
                        className="form-control"
                        name="gross_salary"
                        value={editingItem.gross_salary}
                        onChange={(event) =>
                          handleEditChange("gross_salary", event.target.value)
                        }
                      />
                      {errors.gross_salary && (
                        <div className="text-danger">{errors.gross_salary}</div>
                      )}
                    </div>
                  </div>

                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label>Basic Salary</label>
                      <input
                        readOnly
                        type="number"
                        className="form-control"
                        name="basic_salary"
                        value={editingItem.basic_salary}
                        onChange={(event) =>
                          handleEditChange("basic_salary", event.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label>House Rent</label>
                      <input
                        readOnly
                        type="number"
                        className="form-control"
                        name="house_rent"
                        value={editingItem.house_rent}
                        onChange={(event) =>
                          handleEditChange("house_rent", event.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label>Medical Allowance</label>
                      <input
                        readOnly
                        type="number"
                        className="form-control"
                        name="medical_allowance"
                        value={editingItem.medical_allowance}
                        onChange={(event) =>
                          handleEditChange(
                            "medical_allowance",
                            event.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label>Transport Allowance</label>
                      <input
                        readOnly
                        type="number"
                        className="form-control"
                        name="transport_allowance"
                        value={editingItem.transport_allowance}
                        onChange={(event) =>
                          handleEditChange(
                            "transport_allowance",
                            event.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label>Food Allowance</label>
                      <input
                        readOnly
                        type="number"
                        className="form-control"
                        name="food_allowance"
                        value={editingItem.food_allowance}
                        onChange={(event) =>
                          handleEditChange("food_allowance", event.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="default" onClick={closeEditModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={updatePayroll}>
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}
