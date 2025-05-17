import React, { useState } from "react";
import api from "../../services/api";
import swal from "sweetalert";
import Spinner from "../../elements/Spinner";

export default function Settings() {
  const [file, setFile] = useState(null);
  const fileChange = async (event) => {
    setFile(event.target.files[0]);
  };
  const [spinner, setSpinner] = useState(false);

  const submitFile = async (e) => {
    e.preventDefault();
    if (file) {
      const data = new FormData();
      data.append("photo", file);
      setSpinner(true);
      var response = await api.post("/update-profil", data);
      if (response.status === 200 && response.data) {
        swal({
          title: "Updated Success",
          icon: "success",
        });
      }
      setSpinner(false);
    } else {
      swal({
        title: "Please Upload File",
        icon: "error",
      });
    }
  };

  return (
    <div className="container">
      {spinner && <Spinner />}
      <br />
      <br />
      <br />
      <h1>
        Robot import{" "}
        <span className="text-muted" style={{ fontSize: "16px" }}>
          (Excel File on;y)
        </span>
      </h1>
      <form onSubmit={submitFile}>
        <input onChange={fileChange} type="file" className="form-control" />
        <button type="submit" className="btn btn-warning bg-falgun">
          <strong> SUBMIT</strong>
        </button>
      </form>
    </div>
  );
}
