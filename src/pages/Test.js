import React, { Fragment, useState } from "react";
import api from "services/api";
import Spinner from "../elements/Spinner";
import swal from "sweetalert";

export default function Test() {
  const [spinner, setSpinner] = useState(false);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSpinner(true);
    var response = await api.post("/substores-report-mail");
    if (response.status === 200 && response.data) {
      swal({
        icon: "success",
        title: "Mail Send Success",
      });
      setErrors("");
    } else {
      setErrors(response.data.errors);
    }
    setSpinner(false);
  };
  return (
    <Fragment>
      {spinner && <Spinner />}
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <form onSubmit={handleSubmit}>
              <br />
              <h5>
                <strong>Send Test Mail</strong>
              </h5>
              <div className="form-group">
                <button className="btn btn-primary" type="submit">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
