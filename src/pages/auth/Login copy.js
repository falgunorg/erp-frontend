import React, { useState } from "react";
import auth from "services/auth";
import api from "services/api";
import AppContext from "contexts/AppContext";
import Spinner from "../../elements/Spinner";
const LoginForm = () => {
  const { updateUserObj } = React.useContext(AppContext);
  const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [spinner, setSpinner] = useState(false);
  const validate = () => {
    var valid = true;
    var formErrors = {};
    if (!formData.email) {
      formErrors = { ...formErrors, email: "Please enter a Username" };
      valid = false;
    }
    if (!formData.password) {
      formErrors = { ...formErrors, password: "Please enter a Password" };
      valid = false;
    }
    setErrors(formErrors);
    return valid;
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [mainErrorMsg, setMainErrorMsg] = useState("");

  const [showpass, setShowPass] = useState(false);
  const toggleShowPass = () => {
    setShowPass(!showpass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validate();
    if (isValid) {
      setSpinner(true);
      var response = await api.post("/login", formData);
      console.log(response);
      if (response.data.status === "success") {
        await auth.login(response.data.user);
        await updateUserObj(response.data.user);
        setIsAuthenticated(auth.isAuthenticated);
      } else {
        setMainErrorMsg(response.data.errorMsg);
      }
      setSpinner(false);
    }
  };
  return (
    <>
      {spinner && <Spinner />}
      <div className="container-fluid">
        <form onSubmit={handleSubmit}>
          <div
            className="row h-100 align-items-center justify-content-center"
            style={{ minHeight: "100vh" }}
          >
            <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
              <div className="bg-falgun-light rounded p-4 p-sm-4 my-2 mx-3">
                <div className="mb-4">
                  <img
                    alt="App Logo"
                    width={"100%"}
                    src={require("../../assets/images/logos/logo.png").default}
                  />
                </div>
                <div className="form-floating mb-1">
                  <input
                    type="text"
                    id="floatingInput"
                    name="email"
                    className="form-control"
                    placeholder="Username/Email"
                    value={formData.email}
                    onChange={handleChange}
                  />

                  <label for="floatingInput">Email/Usename</label>
                  <div className="errorMsg">{errors.email}</div>
                </div>
                <div className="form-floating mb-2">
                  <input
                    type={showpass ? "text" : "password"}
                    name="password"
                    id="floatingPassword"
                    className="form-control"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />

                  <i
                    onClick={toggleShowPass}
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      right: "15px",
                      top: "22px",
                    }}
                    className={showpass ? "far fa-eye-slash" : "far fa-eye"}
                  ></i>

                  <label for="floatingPassword">Password</label>
                  <div className="errorMsg">{errors.password}</div>
                </div>

                <div className="errorMsg">{mainErrorMsg}</div>

                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="exampleCheck1"
                    />
                    <label className="form-check-label" for="exampleCheck1">
                      Remember Me
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-warning py-3 w-100 mb-4 bg-falgun"
                >
                  <strong> SIGN IN</strong>
                </button>
                <p className="text-center mb-0">
                  Forget Password?{" "}
                  <a className="text-falgun" href="">
                    Contact Admin
                  </a>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
