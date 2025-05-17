import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function Instructions() {
  const [csv, setCsv] = useState({});
  const [excel, setExcel] = useState({});
  const getFiles = async () => {
    var response = await api.get("/file-format");
    if (response.status === 200 && response.data) {
      setCsv(response.data.csv_file);
      setExcel(response.data.excel_file);
    } else {
      console.log(response.data);
    }
  };

  useEffect(async () => {
    getFiles();
  }, []);
  return (
    <div className="create_edit_page">
      <div className="create_page_heading">
        <div className="page_name">Instructions for import employee</div>
        <div className="actions">
          <Link to="/" className="btn btn-danger rounded-circle">
            <i className="fal fa-times"></i>
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <ul className="list-group">
            <li className="list-group-item">
              full_name = <span className="text-danger">required</span> || min
              length 3 character
            </li>
            <li className="list-group-item">
              short_name = <span className="text-danger">required</span> || min
              length 3 character
            </li>
            <li className="list-group-item">
              login_id = <span className="text-danger">required</span> || unique{" "}
              || min length 3 character
            </li>
            <li className="list-group-item">
              password = <span className="text-danger">required</span> || min
              length 3 character
            </li>
            <li className="list-group-item">
              nationality = <span className="text-danger">required</span> ||{" "}
              counry code ex(AL,BD,DZ)
            </li>
            <li className="list-group-item">
              employee_id = <span className="text-danger">required</span> ||{" "}
              unique
            </li>
            <li className="list-group-item">
              gender = <span className="text-danger">required</span> ||{" "}
              ex(Male,Female,Others)
            </li>
            <li className="list-group-item">
              date_of_birth = <span className="text-danger">required</span> ||{" "}
              format(2022-12-31)
            </li>
            <li className="list-group-item">
              religion = <span className="text-danger">required</span> ||{" "}
              ex(islam,hindu)
            </li>
            <li className="list-group-item">
              marital_status = <span className="text-danger">required</span> ||{" "}
              ex(Married,Single)
            </li>
            <li className="list-group-item">
              ic_num = <span className="text-danger">required</span> ||{" "}
              ex(HK123)
            </li>
            <li className="list-group-item">
              ppt_expired = <span className="text-danger">required</span> ||{" "}
              format(2022-12-31)
            </li>
            <li className="list-group-item">
              phone_code = <span className="text-danger">required</span> ||{" "}
              counry code ex(AL,BD,DZ)
            </li>
            <li className="list-group-item">
              mobile_number = <span className="text-danger">required</span>
            </li>
            <li className="list-group-item">house_number = #256</li>
            <li className="list-group-item">email = email@email.com</li>
            <li className="list-group-item">address</li>
            <li className="list-group-item">city</li>
            <li className="list-group-item">postcode</li>
            <li className="list-group-item">country</li>
            <li className="list-group-item">
              date_joined = <span className="text-danger">required</span> ||{" "}
              format(2022-12-31)
            </li>
            <li className="list-group-item">
              role_permission = <span className="text-danger">required</span> ||{" "}
              role Permission id ex(2,4,6)
            </li>
            <li className="list-group-item">
              team = <span className="text-danger">required</span> || team id
              ex(2,4,6)
            </li>
            <li className="list-group-item">
              position = <span className="text-danger">required</span> ||{" "}
              position id ex(2,4,6)
            </li>
            <li className="list-group-item">position_grade</li>
            <li className="list-group-item">working_hours</li>
            <li className="list-group-item">work_location</li>
            <li className="list-group-item">branch_office</li>
            <li className="list-group-item">
              job_status = <span className="text-danger">required</span> ||{" "}
              ex(Inactive,Active)
            </li>
            <li className="list-group-item">
              job_type = ex(Permanent,Contract)
            </li>
            <li className="list-group-item">rest_day</li>
            <li className="list-group-item">annual_leave</li>
            <li className="list-group-item">al_start_from</li>
            <li className="list-group-item">al_expired_on</li>
            <li className="list-group-item">flight_allowance_currency</li>
            <li className="list-group-item">flight_allowance</li>
            <li className="list-group-item">eligible_start_from</li>
            <li className="list-group-item">meals_allowance_currency</li>
            <li className="list-group-item">meals_allowance</li>
            <li className="list-group-item">medical_eligible_start_from</li>
            <li className="list-group-item">medical_eligible_expired_on</li>
            <li className="list-group-item">currency</li>
            <li className="list-group-item">beneficiary</li>
            <li className="list-group-item">bank</li>
            <li className="list-group-item">account_number</li>
            <li className="list-group-item">basic_salary</li>
            <li className="list-group-item">kpi_bonus</li>
          </ul>
        </div>
        <div className="col-md-6">
          <h2>Excel File Format</h2>
          <a href={excel} target="blank" download className="btn btn-warning bg-falgun">
            Demo Excel File
          </a>

          <br />
          <br />
          <h2>CSV File Format</h2>
          <a target="blank" href={csv} download className="btn btn-warning bg-falgun">
            Demo CSV File
          </a>
        </div>
      </div>
    </div>
  );
}
