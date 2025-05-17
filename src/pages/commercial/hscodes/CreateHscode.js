import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "../../../services/api";
import swal from "sweetalert";
import Spinner from "../../../elements/Spinner";

export default function CreateHscode() {
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const history = useHistory();
  const [spinner, setSpinner] = useState(false);
  const [step, setStep] = useState(1);

  const [total, setTotal] = useState(0);
  const currentPage = 1;

  const getHscodes = async () => {
    setSpinner(true);
    var response = await api.post("/hscodes?page=" + currentPage);
    if (response.status === 200 && response.data) {
      setTotal(response.data.hscodes.total);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  const nextStep = async () => {
    setSpinner(true);
    var response = await api.post("/hscodes-delete");
    if (response.status === 200 && response.data) {
      setStep(step + 1);
    }
    setSpinner(false);
  };

  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", selectedFile);
    setSpinner(true);
    var response = await api.post("/hscodes-create", formData);
    if (response.status === 200 && response.data) {
      console.log(response.data);
      swal({
        title: "Upload Success",
        icon: "success",
      });
      history.push("/commercial/hscodes");
    } else {
      setErrorMessage(response.data.errors.file);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getHscodes();
  }, []);

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

      {step === 1 && (
        <div className="row">
          {total > 0 ? (
            <div className="col-lg-6">
              <h3>Step {step} : Delete Previous Items</h3>
              <hr></hr>
              <p>Delete Previous {total} Items</p>
              <div className="next_btns">
                <button
                  onClick={nextStep}
                  type="submit"
                  className="btn btn-danger"
                >
                  Delete & Next
                </button>
              </div>
            </div>
          ) : (
            <div className="next_btns">
              <button
                onClick={() => setStep(2)}
                type="submit"
                className="btn btn-primary"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
      {step === 2 && (
        <div className="row">
          <form onSubmit={handleSubmit}>
            <div className="col-lg-6">
              <h3>Step {step} : Execute New Excel File</h3>
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
      )}
    </div>
  );
}
