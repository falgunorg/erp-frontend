import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import Select from "react-select";
import swal from "sweetalert";

export default function PowerEditTeam(props) {
  const history = useHistory();
  const params = useParams();
  const [spinner, setSpinner] = useState(false);
  // employees
  const [employees, setEmployees] = useState([]);
  const getEmployees = async () => {
    setSpinner(true);
    var response = await api.post("/employees");
    if (response.status === 200 && response.data) {
      setEmployees(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  // departments
  const [departments, setDepartments] = useState([]);
  const getDepartments = async () => {
    setSpinner(true);
    var response = await api.post("/departments");
    console.log(response.data);
    if (response.status === 200 && response.data) {
      setDepartments(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const [companies, setCompanies] = useState([]);
  const getCompanies = async () => {
    setSpinner(true);
    var response = await api.post("/companies", { type: "Own" });
    console.log(response.data);
    if (response.status === 200 && response.data) {
      setCompanies(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const [errors, setErrors] = useState({});
  const [formDataSet, setFormDataSet] = useState({
    team_number: "",
    title: "",
    team_lead: "",
    employees: [],
    department: "",
    company_id: "",
    description: "",
  });

  const getTeam = async () => {
    setSpinner(true);
    var response = await api.post("/teams-show", { id: params.id });
    if (response.status === 200 && response.data) {
      const team = response.data.data;
      setFormDataSet({
        team_number: team.team_number,
        title: team.title,
        team_lead: team.team_lead,
        employees: Array.isArray(team.employees)
          ? team.employees.map(Number)
          : [],
        department: team.department,
        company_id: team.company_id,
        description: team.description,
        id: team.id,
      });
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };



  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setFormDataSet({
      ...formDataSet,
      [ev.target.name]: ev.target.value,
    });
    if (name === "department") {
      getEmployees(value);
    }
    if (name === "company_id") {
      getEmployees(value);
    }
  };
  const handleMemberChange = (selectedOptions) => {
    const selectedMemberIds = selectedOptions.map((option) => option.value);
    setFormDataSet((prevData) => ({
      ...prevData,
      employees: selectedMemberIds,
    }));
  };

  const validateForm = () => {
    let formErrors = {};
    //  validation logic
    if (!formDataSet.team_number) {
      formErrors.team_number = "Team Number is required";
    }
    if (!formDataSet.title) {
      formErrors.title = "Title is required";
    }
    if (!formDataSet.team_lead) {
      formErrors.team_lead = "Team Leader is required";
    }
    if (!formDataSet.employees.length > 0) {
      formErrors.employees = "Team Members must be greater than 0";
    }
    if (!formDataSet.department) {
      formErrors.department = "Department is required";
    }
    if (!formDataSet.company_id) {
      formErrors.company_id = "Workplace is required";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      setSpinner(true);
      const dataSet = new FormData();
      dataSet.append("team_number", formDataSet.team_number);
      dataSet.append("title", formDataSet.title);
      dataSet.append("team_lead", formDataSet.team_lead);
      dataSet.append("employees", formDataSet.employees);
      dataSet.append("department", formDataSet.department);
      dataSet.append("company_id", formDataSet.company_id);
      dataSet.append("description", formDataSet.description);
      dataSet.append("id", formDataSet.id);
      var response = await api.post("/teams-update", dataSet);
      if (response.status === 200 && response.data) {
        history.push("/power/teams");
      } else {
        setErrors(response.data.errors);
      }
      setSpinner(false);
    }
  };

  useEffect(async () => {
    getEmployees();
    getDepartments();
    getCompanies();
    getTeam();
  }, []);

  useEffect(async () => {
    props.setSection("settings");
  }, []);

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
      <div className="create_page_heading">
        <div className="page_name">Edit Team </div>
        <div className="actions">
          <Link to="/power/teams" className="btn btn-danger rounded-circle">
            <i className="fal fa-times"></i>
          </Link>
        </div>
      </div>

      <div className="col-lg-12">
        <form onSubmit={handleSubmit}>
          <div className="personal_data">
            <div className="row">
              <div className="col-lg-3">
                <div className="form-group">
                  <label>
                    Team Number<sup>*</sup>
                  </label>
                  <input
                    name="team_number"
                    value={formDataSet.team_number}
                    className="form-control"
                    type="text"
                    readOnly
                  />
                </div>
                {errors.team_number && (
                  <>
                    <div className="errorMsg">{errors.team_number}</div>
                    <br />
                  </>
                )}
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label>
                    Team Name<sup>*</sup>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formDataSet.title}
                    name="title"
                    onChange={handleChange}
                  />

                  {errors.title && (
                    <>
                      <div className="errorMsg">{errors.title}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label>
                    Work Place<sup>*</sup>
                  </label>

                  <select
                    onChange={handleChange}
                    value={formDataSet.company_id}
                    name="company_id"
                    className="form-select"
                  >
                    <option value="">Select Workplace</option>
                    {companies.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                  {errors.department && (
                    <>
                      <div className="errorMsg">{errors.department}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>

              <div className="col-lg-3">
                <div className="form-group">
                  <label>
                    Department<sup>*</sup>
                  </label>
                  <div style={{ position: "relative" }}>
                    <select
                      onChange={handleChange}
                      value={formDataSet.department}
                      name="department"
                      className="form-select"
                    >
                      <option value="">Select Department</option>
                      {departments.map((item, index) => (
                        <option key={index} value={item.id}>
                          {item.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.department && (
                    <>
                      <div className="errorMsg">{errors.department}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label>
                    Team Leader<sup>*</sup>
                  </label>
                  <select
                    onChange={handleChange}
                    value={formDataSet.team_lead}
                    name="team_lead"
                    className="form-select"
                  >
                    <option value="">Select Leader</option>
                    {employees.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.full_name} | {item.designation_title}
                      </option>
                    ))}
                  </select>
                  {errors.team_lead && (
                    <>
                      <div className="errorMsg">{errors.team_lead}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>
              <div className="col-lg-9">
                <div className="form-group">
                  <label>
                    Team Members <sup>*</sup>
                  </label>
                  <Select
                    isMulti
                    placeholder="Select or Search"
                    name="employees"
                    value={formDataSet.employees.map((employeeId) => {
                      const selectedEmployee = employees.find(
                        (employee) => employee.id === employeeId
                      );
                      return {
                        value: employeeId,
                        label: selectedEmployee
                          ? selectedEmployee.full_name
                          : "",
                      };
                    })}
                    onChange={handleMemberChange}
                    options={employees.map((employee) => ({
                      value: employee.id,
                      label: employee.full_name,
                    }))}
                  />
                  {errors.employees && (
                    <>
                      <div className="errorMsg">{errors.employees}</div>
                      <br />
                    </>
                  )}
                </div>
              </div>

              <div className="col-lg-12">
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    onChange={handleChange}
                    value={formDataSet.description}
                    name="description"
                    className="form-control"
                  >
                    {formDataSet.description}
                  </textarea>
                </div>
              </div>
            </div>
            <br />
            <div className="text-center">
              <button type="submit" className="btn btn-warning bg-falgun">
                Update & Save
              </button>
            </div>
            <hr></hr>
          </div>
        </form>
      </div>
    </div>
  );
}
