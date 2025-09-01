import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Modal, Button, Badge } from "react-bootstrap";
import api from "services/api";
import Spinner from "../../../elements/Spinner";

export default function PowerEditSupplier(props) {
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);
  const params = useParams();

  const getSupplier = async () => {
    setSpinner(true);
    var response = await api.post("/suppliers-show", { id: params.id });
    if (response.status === 200 && response.data) {
      setFormDataSet(response.data.data);
    }
    setSpinner(false);
  };

  const [countries, setCountries] = useState([]);
  const getCountries = async () => {
    var response = await api.get("/common/countries");
    if (response.status === 200 && response.data) {
      setCountries(response.data);
    }
  };

  useEffect(async () => {
    getCountries();
    getSupplier();
  }, []);

  const [errors, setErrors] = useState({});
  const [formDataSet, setFormDataSet] = useState({
    company_name: "",
    email: "",
    attention_person: "",
    office_number: "",
    mobile_number: "",
    address: "",
    state: "",
    postal_code: "",
    country: "",
    product_supply: "",
    vat_reg_number: "",
    status: "",
  });

  const handleChange = (ev) => {
    setFormDataSet({
      ...formDataSet,
      [ev.target.name]: ev.target.value,
    });
  };

  const validateForm = () => {
    let formErrors = {};

    if (!formDataSet.company_name) {
      formErrors.company_name = "Company Name is required";
    }
    if (!formDataSet.email) {
      formErrors.email = "Email is required";
    }
    if (!formDataSet.attention_person) {
      formErrors.attention_person = "Attention Person Name is required";
    }
    if (!formDataSet.mobile_number) {
      formErrors.mobile_number = "Attention person contact is required";
    }
    if (!formDataSet.country) {
      formErrors.country = "Country is required";
    }
    if (!formDataSet.status) {
      formErrors.status = "Status is required";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      setSpinner(true);
      var response = await api.post("/suppliers-update", formDataSet);
      if (response.status === 200 && response.data) {
        history.push("/power/suppliers");
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
          <div className="page_name">Edit Supplier</div>
          <div className="actions">
            <button type="supmit" className="publish_btn btn btn-warning bg-falgun">
              Update
            </button>
            <Link to="/power/suppliers" className="btn btn-danger rounded-circle">
              <i className="fal fa-times"></i>
            </Link>
          </div>
        </div>

        <div className="col-lg-12">
          <div className="personal_data">
            <div className="row">
              <div className="col-lg-3">
                <div className="form-group">
                  <label>
                    Company Name <sup>*</sup>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="company_name"
                    value={formDataSet.company_name}
                    onChange={handleChange}
                  />
                  {errors.company_name && (
                    <div className="errorMsg">{errors.company_name}</div>
                  )}
                </div>
              </div>

              <div className="col-lg-3">
                <div className="form-group">
                  <label>
                    Email <sup>*</sup>
                  </label>
                  <input
                    type="email"
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
              <div className="col-lg-3">
                <div className="form-group">
                  <label>
                    Attention Person <sup>*</sup>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="attention_person"
                    value={formDataSet.attention_person}
                    onChange={handleChange}
                  />
                  {errors.attention_person && (
                    <div className="errorMsg">{errors.attention_person}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label>
                    Mobile Number (Attention Person)<sup>*</sup>
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    name="mobile_number"
                    value={formDataSet.mobile_number}
                    onChange={handleChange}
                  />
                  {errors.mobile_number && (
                    <div className="errorMsg">{errors.mobile_number}</div>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label>Phone Number(Company)</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="office_number"
                    value={formDataSet.office_number}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <label>
                    Country <sup>*</sup>
                  </label>

                  <select
                    onChange={handleChange}
                    value={formDataSet.country}
                    name="country"
                    className="form-select"
                  >
                    <option value="">Select country</option>
                    {countries.map((item, index) => (
                      <option key={index} value={item.nicename}>
                        {item.nicename}
                      </option>
                    ))}
                  </select>
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
                    <option value="">Select Status</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                  {errors.status && (
                    <div className="errorMsg">{errors.status}</div>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label>State/City</label>
                  <input
                    type="text"
                    className="form-control"
                    name="state"
                    value={formDataSet.state}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <label>Postal Code / ZIP Code</label>
                  <input
                    type="text"
                    className="form-control"
                    name="postal_code"
                    value={formDataSet.postal_code}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label>VAT/BIN Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="vat_reg_number"
                    value={formDataSet.vat_reg_number}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    className="form-control"
                    name="address"
                    value={formDataSet.address}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group">
                  <label>Product Supply</label>
                  <textarea
                    className="form-control"
                    name="product_supply"
                    value={formDataSet.product_supply}
                    onChange={handleChange}
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
