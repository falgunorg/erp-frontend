import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "services/api";
import swal from "sweetalert";
import Spinner from "../../elements/Spinner";
import Map from "../../elements/Map";

export default function Profile(props) {
  const [spinner, setSpinner] = useState(false);
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
    var response = await api.post("/common/departments");
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
    var response = await api.get("/admin/roles");
    if (response.status === 200 && response.data) {
      setRoles(response.data);
    }
  };

  // retrive data
  const getProfile = async () => {
    setSpinner(true);
    var response = await api.get("/profile");
    if (response.status === 200 && response.data) {
      setFormDataSet(response.data.data);
    }
    setSpinner(false);
  };

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

  const handleChange = (ev) => {
    setFormDataSet({
      ...formDataSet,
      [ev.target.name]: ev.target.value,
    });
  };
  // update profile

  const [file, setFile] = useState(null);
  const handleFileChange = async (event) => {
    setFile(event.target.files[0]);
    const data = new FormData();
    data.append("photo", event.target.files[0]);
    var response = await api.post("/update-profile-picture", data);
    if (response.status === 200 && response.data) {
      getProfile();
      swal({
        title: "Updated Success",
        icon: "success",
      });
    }
  };

  const handleSignChange = async (event) => {
    const file = event.target.files[0];

    // Check if a file is selected
    if (file) {
      // Check if the selected file is an image
      if (!file.type.startsWith("image/")) {
        // Notify the user that only image files are allowed
        swal({
          title: "Invalid File Type",
          text: "Please select an image file",
          icon: "error",
        });
        return;
      }

      // Create an image object to get the dimensions
      const img = new Image();
      img.onload = function () {
        // Check if the dimensions exceed the specified limits
        if (img.width > 200 || img.height > 80) {
          // Notify the user about the image size limit
          swal({
            title: "Image Size Limit Exceeded",
            text: "Please upload an image with dimensions not exceeding 200x80 pixels",
            icon: "error",
          });
          return;
        }

        // If the dimensions are within limits, proceed with uploading
        const data = new FormData();
        data.append("sign", file);

        // Upload the image
        api
          .post("/update-signature", data)
          .then((response) => {
            if (response.status === 200 && response.data) {
              getProfile();
              swal({
                title: "Sign Updated Success",
                icon: "success",
              });
            }
          })
          .catch((error) => {
            // Handle upload errors
            console.error("Error uploading signature:", error);
            // Notify the user about the error
            swal({
              title: "Error",
              text: "Failed to update signature. Please try again later.",
              icon: "error",
            });
          });
      };

      // Set the source of the image object to the selected file
      img.src = URL.createObjectURL(file);
    }
  };

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!newPassword || !confirmNewPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("New password and confirm password do not match.");
      return;
    }
    const formData = new FormData();
    formData.append("new_password", newPassword);
    formData.append("confirm_password", confirmNewPassword);
    var response = await api.post("/profile-update", formData);
    if (response.status === 200 && response.data) {
      setNewPassword("");
      setConfirmNewPassword("");
      setErrorMessage("");
      swal({
        title: "Updated Success",
        icon: "success",
      });
    } else {
      setErrorMessage(response.data.errors);
    }
  };
  useEffect(async () => {
    getDesignations();
    getRoles();
    getDepartments();
    getCompanies();
    getProfile();
  }, []);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">My Profile</div>
        <div className="actions">
          <Link to="/" className="btn btn-danger rounded-circle">
            <i className="fal fa-times"></i>
          </Link>
        </div>
      </div>

      <div className="row">
        <Map />
      </div>

      <div className="col-lg-12">
        <div className="personal_data">
          <div className="row">
            <div className="col-lg-4">
              <div className="border p-3 h-100 rounded">
                <h6>Change Profile Picture ?</h6>
                <hr />
                <div className="form-group">
                  <label for="uploadPhoto">
                    <div className="previw_upload_image">
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

                      <i className="fas fa-camera"></i>
                    </div>
                  </label>
                  <br />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    id="uploadPhoto"
                    name="employeePhoto"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="border p-3 h-100 rounded">
                <h6>Change Signature ?</h6>
                <hr />
                <div className="form-group">
                  <label for="uploadSign">
                    <div className="previw_upload_image">
                      <img
                        style={{
                          height: "80px",
                          width: "200px",
                          border: "2px solid red",
                        }}
                        src={formDataSet.signature}
                        alt="Preview"
                        // className="rounded-circle"
                      />

                      <i className="fas fa-camera"></i>
                    </div>
                  </label>
                  <br />
                  <input
                    type="file"
                    hidden
                    id="uploadSign"
                    name="employeeSign"
                    onChange={handleSignChange}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-4 ">
              <div className="border p-3 h-100 rounded">
                <h6>Change Password? </h6>
                <hr />
                <label>New Password:</label>
                <input
                  type="password"
                  value={newPassword}
                  className="form-control"
                  onChange={(event) => setNewPassword(event.target.value)}
                />
                <label>Confirm New Password:</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  className="form-control"
                  onChange={(event) =>
                    setConfirmNewPassword(event.target.value)
                  }
                />
                {errorMessage && <div className="errorMsg">{errorMessage}</div>}
                <button
                  onClick={handleSubmit}
                  type="supmit"
                  className="publish_btn btn btn-warning bg-falgun"
                >
                  Update
                </button>
              </div>
            </div>
          </div>

          <br />
          <hr />
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
                  disabled
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
                  disabled
                />
                {errors.email && <div className="errorMsg">{errors.email}</div>}
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
                  disabled
                />
                {errors.staff_id && (
                  <div className="errorMsg">{errors.staff_id}</div>
                )}
              </div>
            </div>
            <div className="col-lg-4 d-none">
              <div className="form-group">
                <label>
                  Role Permission<sup>*</sup>
                </label>
                <select
                  name="role_permission"
                  value={formDataSet.role_permission}
                  onChange={handleChange}
                  className="form-select"
                  disabled
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
                  Department <sup>*</sup>
                </label>
                <select
                  name="department"
                  value={formDataSet.department}
                  onChange={handleChange}
                  className="form-select"
                  disabled
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
                <select
                  name="designation"
                  value={formDataSet.designation}
                  onChange={handleChange}
                  className="form-select"
                  disabled
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
                <select
                  name="company"
                  value={formDataSet.company}
                  onChange={handleChange}
                  className="form-select"
                  disabled
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

                {errors.company && (
                  <div className="errorMsg">{errors.company}</div>
                )}
              </div>
            </div>
            <div className="col-lg-4 d-none">
              <div className="form-group">
                <label>
                  Status<sup>*</sup>
                </label>
                <select
                  name="status"
                  value={formDataSet.status}
                  onChange={handleChange}
                  className="form-select"
                  disabled
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
        </div>
      </div>
    </div>
  );
}
