import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import api from "services/api";
import Spinner from "../../elements/Spinner";

export default function CreateBuyer(props) {
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);

  // retrive data

  const [countries, setCountries] = useState([]);
  const getCountries = async () => {
    var response = await api.get("/common/countries");
    if (response.status === 200 && response.data) {
      setCountries(response.data);
    }
  };

  useEffect(async () => {
    getCountries();
  }, []);

  const [errors, setErrors] = useState({});

  const [formDataSet, setFormDataSet] = useState({
    full_name: "",
    email: "",
    password: "",
    staff_id: "",
    role_permission: "",
    department: "",
    designation: "",
    company: "",
    status: "",
  });

  const [buyerPhoto, setEmployeePhoto] = useState(null);
  const handleChange = (ev) => {
    var inputName = ev.target.name;
    if (inputName == "buyerPhoto") {
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
    if (!formDataSet.password) {
      formErrors.password = "Password is required";
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
      data.append("photo", buyerPhoto);
      data.append("full_name", formDataSet.full_name);
      data.append("email", formDataSet.email);
      data.append("password", formDataSet.password);
      data.append("staff_id", formDataSet.staff_id);
      data.append("role_permission", formDataSet.role_permission);
      data.append("department", formDataSet.department);
      data.append("designation", formDataSet.designation);
      data.append("company", formDataSet.company);
      data.append("status", formDataSet.status);
      setSpinner(true);
      var response = await api.post("/common/buyers-create", data);
      if (response.status === 200 && response.data) {
        history.push("/buyers");
      } else {
        console.log(response.data.errors);
        setErrors(response.data.errors);
      }
      setSpinner(false);
    }
  };

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <form onSubmit={handleSubmit}>
        <div className="create_page_heading">
          <div className="page_name">Add New Buyer</div>
          <div className="actions">
            <button type="supmit" className="publish_btn btn btn-warning bg-falgun">
              Save
            </button>
            <Link to="/buyers" className="btn btn-danger rounded-circle">
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
                    Buyer Name <sup>*</sup>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formDataSet.name}
                    onChange={handleChange}
                  />
                  {errors.name && <div className="errorMsg">{errors.name}</div>}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    Country<sup>*</sup>
                  </label>
                  <select
                    name="country"
                    value={formDataSet.country}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Select country</option>
                    {countries.length > 0 ? (
                      countries.map((item, index) => (
                        <option key={index} value={item.code}>
                          {item.nicename}
                        </option>
                      ))
                    ) : (
                      <option value="0">No country found</option>
                    )}
                  </select>
                  {errors.country && (
                    <div className="errorMsg">{errors.country}</div>
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
                  </select>
                  {errors.status && (
                    <div className="errorMsg">{errors.status}</div>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label>Address</label>

                  <textarea
                    value={formDataSet.address}
                    onChange={handleChange}
                    name="address"
                    className="form-control"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
