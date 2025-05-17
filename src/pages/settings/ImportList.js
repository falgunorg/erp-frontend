import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import swal from "sweetalert";
import Spinner from "../../elements/Spinner";

export default function ImportList() {
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

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Robot Import System</div>
        <div className="actions">
          <Link to="/" className="btn btn-danger rounded-circle">
            <i className="fal fa-times"></i>
          </Link>
        </div>
      </div>

      <div className="row">
        <form onSubmit={handleSubmit}>
          <div className="col-lg-6 offset-lg-3 text-center">
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
                IMPORT
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
