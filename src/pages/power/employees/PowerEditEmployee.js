import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import swal from "sweetalert";
import Quill from "quill";

export default function PowerEditEmployee(props) {
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);
  const params = useParams();

  const textEditorRef = useRef(null);
  const quillInstance = useRef(null); // To store the Quill instance
  const [mailSign, setMailSign] = useState("");

  useEffect(() => {
    if (textEditorRef.current) {
      // Initialize Quill instance
      quillInstance.current = new Quill(textEditorRef.current, {
        theme: "snow",
        placeholder: "Start typing here...",
      });

      // Event listener for text change
      quillInstance.current.on("text-change", () => {
        const htmlContent = quillInstance.current.root.innerHTML;
        handleContentChange(htmlContent);
      });
    }

    return () => {
      // Cleanup the Quill instance on component unmount
      if (quillInstance.current) {
        quillInstance.current = null;
      }
    };
  }, []);

  const handleContentChange = (value) => {
    // Add the MsoNormal class to all <p> elements
    let modifiedValue = value.replace(
      /<p\b([^>]*)>/g,
      '<p style="margin:0;" class="MsoNormal x_MsoNormal"$1>'
    );

    // Add style="width:170px" to all <img> elements inside <p> tags
    modifiedValue = modifiedValue.replace(
      /<p[^>]*>(.*?)<img\b([^>]*)>/g,
      (match, pContent, imgAttrs) => {
        // Add width style to the img tag while keeping its original attributes
        return `<p style="margin:0;" class="MsoNormal x_MsoNormal">${pContent}<img ${imgAttrs} style="width:170px;">`;
      }
    );

    // Wrap the modified content in mail_signature_block
    setMailSign(`<div class="mail_signature_block">${modifiedValue}</div>`);
  };

  const getEmployee = async () => {
    setSpinner(true);
    var response = await api.post("/employees-show", { id: params.id });
    if (response.status === 200 && response.data) {
      setFormDataSet(response.data.data);
      setMailSign(response.data.data?.mailSign);
    }
    setSpinner(false);
  };

  // department add on modal
  const [departmentModal, setDepartmentModal] = useState(false);
  const closeDepartmentModal = () => {
    setDepartmentModal(false);
  };

  const [departmentForm, setDepartmentForm] = useState({
    title: "",
  });

  const [departmentFormErrors, setDepartmentFormErrors] = useState({});

  const departmentFormChange = (ev) => {
    setDepartmentForm({
      ...departmentForm,
      [ev.target.name]: ev.target.value,
    });
  };

  const validateDepartmentForm = () => {
    const errors = {};
    if (!departmentForm.title) {
      errors.title = "Department title is required";
    }
    setDepartmentFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if there are no errors
  };

  const submitDepartment = async () => {
    if (validateDepartmentForm()) {
      try {
        const response = await api.post("/common/departments-create", departmentForm);
        if (response.status === 200 && response.data) {
          getDepartments();
          setDepartmentModal(false);
          setDepartmentForm({
            title: "",
          });
        }
      } catch (error) {
        // Handle API error
      }
    }
  };

  // designation add on modal

  const [designationModal, setDesignationModal] = useState(false);
  const closeDesignationModal = () => {
    setDesignationModal(false);
  };

  const [designationForm, setDesignationForm] = useState({
    title: "",
  });

  const [designationFormErrors, setDesignationFormErrors] = useState({});

  const designationFormChange = (ev) => {
    setDesignationForm({
      ...designationForm,
      [ev.target.name]: ev.target.value,
    });
  };

  const validateDesignationForm = () => {
    const errors = {};
    if (!designationForm.title) {
      errors.title = "Designation title is required";
    }
    setDesignationFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if there are no errors
  };

  const submitDesignation = async () => {
    if (validateDesignationForm()) {
      try {
        const response = await api.post(
          "/designations-create",
          designationForm
        );
        if (response.status === 200 && response.data) {
          getDesignations();
          setDesignationModal(false);
          setDesignationForm({
            title: "",
          });
        }
      } catch (error) {
        // Handle API error
      }
    }
  };

  // add company on modal
  const [companyModal, setCompanyModal] = useState(false);
  const closeCompanyModal = () => {
    setCompanyModal(false);
  };

  const [companyForm, setCompanyForm] = useState({
    title: "", // Changed field name to "title"
  });

  const [companyFormErrors, setCompanyFormErrors] = useState({});

  const companyFormChange = (ev) => {
    setCompanyForm({
      ...companyForm,
      [ev.target.name]: ev.target.value,
    });
  };

  const validateCompanyForm = () => {
    const errors = {};
    if (!companyForm.title) {
      errors.title = "Company title is required";
    }
    setCompanyFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if there are no errors
  };

  const submitCompany = async () => {
    if (validateCompanyForm()) {
      try {
        const response = await api.post("/common/companies-create", companyForm);
        if (response.status === 200 && response.data) {
          getCompanies();
          setCompanyModal(false);
          setCompanyForm({
            title: "", // Reset the field
          });
        }
      } catch (error) {
        // Handle API error
      }
    }
  };

  // retrive data

  const [departments, setDepartments] = useState([]);
  const getDepartments = async () => {
    var response = await api.post("/common/departments");
    if (response.status === 200 && response.data) {
      setDepartments(response.data.data);
    }
  };

  const [designations, setDesignations] = useState([]);
  const getDesignations = async () => {
    var response = await api.post("/common/designations");
    if (response.status === 200 && response.data) {
      setDesignations(response.data.data);
    }
  };

  const [companies, setCompanies] = useState([]);
  const getCompanies = async () => {
    var response = await api.post("/common/companies", { type: "Own" });
    if (response.status === 200 && response.data) {
      setCompanies(response.data.data);
    }
  };

  const [roles, setRoles] = useState([]);
  const getRoles = async () => {
    var response = await api.get("/roles");
    if (response.status === 200 && response.data) {
      setRoles(response.data);
    }
  };

  console.log("MAIL_SIGN", mailSign);
  useEffect(async () => {
    getDesignations();
    getRoles();
    getDepartments();
    getCompanies();
    getEmployee();
  }, []);

  const [errors, setErrors] = useState({});

  const [formDataSet, setFormDataSet] = useState({
    full_name: "",
    email: "",
    staff_id: "",
    role_permission: "",
    department: "",
    designation: "",
    company: "",
    status: "",
  });

  const [employeePhoto, setEmployeePhoto] = useState(null);
  const handleChange = (ev) => {
    var inputName = ev.target.name;
    if (inputName == "employeePhoto") {
      setEmployeePhoto(ev.target.files[0]);
      handleFileChange(ev);
    } else {
      setFormDataSet({
        ...formDataSet,
        [ev.target.name]: ev.target.value,
      });
    }
  };

  const validateForm = () => {
    let formErrors = {};
    // personal info
    if (!formDataSet.full_name) {
      formErrors.full_name = "Full Name is required";
    }

    if (!formDataSet.email) {
      formErrors.email = "Email is required";
    }

    if (!formDataSet.staff_id) {
      formErrors.staff_id = "Staff ID is required";
    }
    if (!formDataSet.role_permission) {
      formErrors.role_permission = "Role Permission is required";
    }
    if (!formDataSet.department) {
      formErrors.department = "Department is required";
    }
    if (!formDataSet.designation) {
      formErrors.designation = "Designation is required";
    }
    if (!formDataSet.company) {
      formErrors.company = "Company is required";
    }
    if (!formDataSet.status) {
      formErrors.status = "Status is required";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      var data = new FormData();
      data.append("photo", employeePhoto);
      data.append("full_name", formDataSet.full_name);
      data.append("email", formDataSet.email);
      data.append("staff_id", formDataSet.staff_id);
      data.append("role_permission", formDataSet.role_permission);
      data.append("department", formDataSet.department);
      data.append("designation", formDataSet.designation);
      data.append("company", formDataSet.company);
      data.append("status", formDataSet.status);
      data.append("id", formDataSet.id);
      data.append("mailSign", mailSign);
      setSpinner(true);
      var response = await api.post("/employees-update", data);
      if (response.status === 200 && response.data) {
        history.push("/power/employees");
      } else {
        console.log(response.data);
        setErrors(response.data.errors);
      }
      setSpinner(false);
    }
  };

  useEffect(() => {
    const checkAccess = async () => {
      if (props.userData?.role !== "Admin") {
        await swal({
          icon: "error",
          text: "You Cannot Access This Section.",
          closeOnClickOutside: false,
        });

        history.push("/dashboard");
      }
    };
    checkAccess();
  }, [props, history]);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <form onSubmit={handleSubmit}>
        <div className="create_page_heading">
          <div className="page_name">Edit Employee</div>
          <div className="actions">
            <button
              type="supmit"
              className="publish_btn btn btn-warning bg-falgun"
            >
              Update
            </button>
            <Link
              to="/power/employees"
              className="btn btn-danger rounded-circle"
            >
              <i className="fal fa-times"></i>
            </Link>
          </div>
        </div>

        <div className="col-lg-12">
          <div className="personal_data">
            <div className="row">
              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    Full Name <sup>*</sup>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="full_name"
                    value={formDataSet.full_name}
                    onChange={handleChange}
                  />
                  {errors.full_name && (
                    <div className="errorMsg">{errors.full_name}</div>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    Email/Username <sup>*</sup>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    value={formDataSet.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <div className="errorMsg">{errors.email}</div>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    Staff ID<sup>*</sup>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="staff_id"
                    value={formDataSet.staff_id}
                    onChange={handleChange}
                  />
                  {errors.staff_id && (
                    <div className="errorMsg">{errors.staff_id}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    Role Permission<sup>*</sup>
                  </label>
                  <select
                    name="role_permission"
                    value={formDataSet.role_permission}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Select Role Permission</option>
                    {roles.length > 0 ? (
                      roles.map((item, index) => (
                        <option key={index} value={item.id}>
                          {item.title}
                        </option>
                      ))
                    ) : (
                      <option value="0">No roles found</option>
                    )}
                  </select>
                  {errors.role_permission && (
                    <div className="errorMsg">{errors.role_permission}</div>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    Department<sup>*</sup>
                  </label>
                  <div className="d-flex">
                    <select
                      name="department"
                      value={formDataSet.department}
                      onChange={handleChange}
                      className="form-select margin_bottom_0"
                    >
                      <option value="">Select department</option>
                      {departments.length > 0 ? (
                        departments.map((item, index) => (
                          <option key={index} value={item.id}>
                            {item.title}
                          </option>
                        ))
                      ) : (
                        <option value="0">No departments found</option>
                      )}
                    </select>
                    <Link
                      to="#"
                      onClick={() => setDepartmentModal(true)}
                      style={{ width: "100px", marginLeft: "10px" }}
                      className="btn btn-warning bg-falgun"
                    >
                      NEW
                    </Link>
                  </div>

                  {errors.department && (
                    <div className="errorMsg">{errors.department}</div>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    Designation<sup>*</sup>
                  </label>
                  <div className="d-flex">
                    <select
                      name="designation"
                      value={formDataSet.designation}
                      onChange={handleChange}
                      className="form-select margin_bottom_0"
                    >
                      <option value="">Select designation</option>
                      {designations.length > 0 ? (
                        designations.map((item, index) => (
                          <option key={index} value={item.id}>
                            {item.title}
                          </option>
                        ))
                      ) : (
                        <option value="0">No designation found</option>
                      )}
                    </select>
                    <Link
                      to="#"
                      onClick={() => setDesignationModal(true)}
                      style={{ width: "100px", marginLeft: "10px" }}
                      className="btn btn-warning bg-falgun"
                    >
                      NEW
                    </Link>
                  </div>

                  {errors.designation && (
                    <div className="errorMsg">{errors.designation}</div>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    Company<sup>*</sup>
                  </label>
                  <div className="d-flex">
                    <select
                      name="company"
                      value={formDataSet.company}
                      onChange={handleChange}
                      className="form-select margin_bottom_0"
                    >
                      <option value="">Select company</option>
                      {companies.length > 0 ? (
                        companies.map((item, index) => (
                          <option key={index} value={item.id}>
                            {item.title}
                          </option>
                        ))
                      ) : (
                        <option value="0">No company found</option>
                      )}
                    </select>
                    <Link
                      to="#"
                      onClick={() => setCompanyModal(true)}
                      style={{ width: "100px", marginLeft: "10px" }}
                      className="btn btn-warning bg-falgun"
                    >
                      NEW
                    </Link>
                  </div>

                  {errors.company && (
                    <div className="errorMsg">{errors.company}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    Status<sup>*</sup>
                  </label>
                  <select
                    name="status"
                    value={formDataSet.status}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Select Job Status</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                  {errors.status && (
                    <div className="errorMsg">{errors.status}</div>
                  )}
                </div>
              </div>
            </div>
            <br />
            <hr></hr>
            <div className="row">
              <div className="col-lg-2">
                <div className="form-group">
                  <label>Employee Photo</label>
                  <br />
                  <label for="uploadPhoto">
                    <div className="previw_upload_image">
                      {previewUrl && (
                        <img
                          style={{
                            height: "150px",
                            width: "150px",
                            border: "2px solid red",
                          }}
                          className="rounded-circle"
                          src={previewUrl}
                          alt="Preview"
                        />
                      )}
                      {!previewUrl && (
                        <img
                          style={{
                            height: "150px",
                            width: "150px",
                            border: "2px solid red",
                          }}
                          src={formDataSet.profile_picture}
                          alt="Preview"
                          className="rounded-circle"
                        />
                      )}
                      <i className="fas fa-camera"></i>
                    </div>
                  </label>
                  <br />
                  <input
                    type="file"
                    hidden
                    id="uploadPhoto"
                    name="employeePhoto"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <h4>Mail Signature</h4>
                <div
                  ref={textEditorRef}
                  style={{
                    minHeight: "200px",
                    border: "1px solid #ccc",
                    padding: "10px",
                  }}
                />
              </div>
              <div className="col-lg-4">
                <br />
                <br />
                <div dangerouslySetInnerHTML={{ __html: mailSign }} />
              </div>
            </div>
          </div>
        </div>
      </form>
      <Modal show={departmentModal} onHide={closeDepartmentModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Department Name</label>
            <input
              className="form-control"
              type="text"
              name="title"
              value={departmentForm.title}
              onChange={departmentFormChange}
            />
            {departmentFormErrors.title && (
              <div className="errorMsg">{departmentFormErrors.title}</div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDepartmentModal}>
            Close
          </Button>
          <Button variant="primary" onClick={submitDepartment}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={designationModal} onHide={closeDesignationModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Designation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Designation Name</label>
            <input
              className="form-control"
              type="text"
              name="title"
              value={designationForm.title}
              onChange={designationFormChange}
            />
            {designationFormErrors.title && (
              <div className="errorMsg">{designationFormErrors.title}</div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDesignationModal}>
            Close
          </Button>
          <Button variant="primary" onClick={submitDesignation}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={companyModal} onHide={closeCompanyModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Company</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Company Name</label>
            <input
              className="form-control"
              type="text"
              name="title"
              value={companyForm.title}
              onChange={companyFormChange}
            />
            {companyFormErrors.title && (
              <div className="errorMsg">{companyFormErrors.title}</div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeCompanyModal}>
            Close
          </Button>
          <Button variant="primary" onClick={submitCompany}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
