import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Spinner from "../../elements/Spinner";
import Select from "react-select";
import api from "services/api";
import { Button } from "react-bootstrap";

export default function OpenSubstore(props) {
  const history = useHistory();
  const userInfo = props.userData;
  const [spinner, setSpinner] = useState();

  const [parts, setParts] = useState([]);
  const getParts = async () => {
    setSpinner(true);
    var response = await api.post("/parts");
    if (response.status === 200 && response.data) {
      setParts(response.data.data);
    }
    setSpinner(false);
  };

  const [companies, setCompanies] = useState([]);

  const getCompanies = async () => {
    setSpinner(true);
    var response = await api.post("/common/companies");
    if (response.status === 200 && response.data) {
      setCompanies(response.data.data);
    }
    setSpinner(false);
  };

  const [errors, setErrors] = useState({});
  const [formDataSet, setFormDataSet] = useState({
    part_id: "",
    company_id: "",
  });

  const handleChange = (name, value) => {
    setFormDataSet({ ...formDataSet, [name]: value });
  };

  const validateForm = () => {
    let formErrors = {};

    if (!formDataSet.part_id) {
      formErrors.part_id = "Enter Part";
    }
    if (!formDataSet.company_id) {
      formErrors.company_id = "Enter Company";
    }
    if (!formDataSet.qty) {
      formErrors.qty = "Enter QTY";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      var formData = new FormData();
      formData.append("part_id", formDataSet.part_id);
      formData.append("company_id", formDataSet.company_id);
      formData.append("qty", formDataSet.qty);

      var response = await api.post("/substores-open", formData);
      if (response.status === 200 && response.data) {
        setFormDataSet({});
        setErrors({});
      } else {
        setErrors(response.data.errors);
      }
    }
  };

  useEffect(async () => {
    getParts();
    getCompanies();
  }, []);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Open Balance</div>
        <div className="actions">
          <Link to="/sub-stores" className="btn btn-danger rounded-circle">
            <i className="fal fa-times"></i>
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-5">
          <div className="form-group">
            <label>Part Name</label>
            <Select
              placeholder="Select"
              onChange={(selectedOption) =>
                handleChange("part_id", selectedOption.value)
              }
              value={
                parts.find((item) => item.id === formDataSet.part_id)
                  ? {
                      value: formDataSet.buyer_id,
                      label:
                        parts.find((item) => item.id === formDataSet.part_id)
                          .title || "",
                    }
                  : null
              }
              name="part_id"
              options={parts.map((item) => ({
                value: item.id,
                label: item.title,
              }))}
            />
            {errors.part_id && (
              <small className="text-danger">{errors.part_id}</small>
            )}
          </div>
        </div>
        <div className="col-lg-3">
          <div className="form-group">
            <label>Company</label>
            <Select
              placeholder="Select"
              onChange={(selectedOption) =>
                handleChange("company_id", selectedOption.value)
              }
              value={
                companies.find((item) => item.id === formDataSet.company_id)
                  ? {
                      value: formDataSet.company_id,
                      label:
                        companies.find(
                          (item) => item.id === formDataSet.company_id
                        ).title || "",
                    }
                  : null
              }
              name="company_id"
              options={companies.map((item) => ({
                value: item.id,
                label: item.title,
              }))}
            />
            {errors.company_id && (
              <small className="text-danger">{errors.company_id}</small>
            )}
          </div>
        </div>
        <div className="col-lg-2">
          <div className="form-group">
            <label>QTY</label>
            <input
              type="number"
              onWheel={(event) => event.target.blur()}
              name="qty"
              onChange={(event) => handleChange("qty", event.target.value)}
              value={formDataSet.qty}
              className="form-control"
            />
            {errors.qty && <small className="text-danger">{errors.qty}</small>}
          </div>
        </div>
        <div className="col-lg-1">
          <div className="form-group">
            <br />
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
