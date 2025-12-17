import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "../../../services/api";
import swal from "sweetalert";
import Spinner from "../../../elements/Spinner";

export default function MachineImport(props) {
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const history = useHistory();
  const [spinner, setSpinner] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", selectedFile);
    setSpinner(true);
    var response = await api.post("/machines-bulk-store", formData);
    if (response.status === 200 && response.data) {
      console.log(response.data);
      swal({
        title: "Upload Success",
        icon: "success",
      });
      history.push("/maintenance/machines");
    } else {
      setErrorMessage(response.data.errors.file);
    }
    setSpinner(false);
  };



  

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Import From Excel</div>
        <div className="actions">
          <Link
            to="/commercial/hscodes"
            className="btn btn-danger rounded-circle"
          >
            <i className="fal fa-times"></i>
          </Link>
        </div>
      </div>

      <div className="row">
        <form onSubmit={handleSubmit}>
          <div className="col-lg-6">
            <h3>Execute New Excel File</h3>
            <hr></hr>
            <label>Upload Excel File</label>
            <input
              onChange={handleFileSelect}
              className="form-control"
              type="file"
              placeholder="Upload Excel File"
            />
            {errorMessage && <div className="errorMsg">{errorMessage}</div>}
            <br />
            <div className="next_btns">
              <button type="submit" className="btn btn-primary">
                Import & Execute
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
