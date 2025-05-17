import React, { useState, useEffect } from "react";
import auth from "services/auth";
import api from "services/api";
import AppContext from "contexts/AppContext";
import Spinner from "../../elements/Spinner";
import OtpInput from "react-otp-input";
import Carousel from "react-bootstrap/Carousel";
import moment from "moment";

import Logo from "../../assets/images/logos/logo.png";
import Image1 from "../../assets/images/autoimg/1.webp";
import Image2 from "../../assets/images/autoimg/2.webp";
import Image3 from "../../assets/images/autoimg/3.webp";
import Image4 from "../../assets/images/autoimg/4.webp";
import Image5 from "../../assets/images/autoimg/5.webp";

const LoginForm = () => {
  const { updateUserObj } = React.useContext(AppContext);
  const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");

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

  const [currentTime, setCurrentTime] = useState(
    moment().format("MMMM Do YYYY , h:mm A")
  ); // Initialize current time

  // Function to update the current time every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment().format("MMMM Do YYYY , h:mm A"));
    }, 60000); // Update every minute (60000 milliseconds)

    // Clean up function to clear the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures effect only runs once after initial render

  return (
    <>
      {spinner && <Spinner />}
      <div className="container-fluid">
        <div
          style={{ minHeight: "100vh", position: "relative" }}
          className="row align-items-center justify-content-center"
        >
          <div className="col-lg-6">
            <form onSubmit={handleSubmit}>
              <div
                style={{ width: "290px", margin: "0 auto" }}
                className="align-items-center justify-content-center"
              >
                <div className="mb-4 text-center">
                  <img alt="App Logo" width={"100%"} src={Logo} />
                  <small className="d-none" style={{ color: "#707070" }}>
                    Version © 1.0.0
                  </small>
                </div>
                <br />
                <div className="form-group mb-4">
                  <input
                    type="email"
                    name="email"
                    className="form-control custom_input_for_login_page"
                    placeholder="USER"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <div className="errorMsg">{errors.email}</div>
                </div>

                <div
                  style={{ position: "relative" }}
                  className="form-group mb-2"
                >
                  <input
                    type={showpass ? "text" : "password"}
                    name="password"
                    className="form-control custom_input_for_login_page"
                    placeholder="PASSWORD"
                    value={formData.password}
                    onChange={handleChange}
                  />

                  <i
                    onClick={toggleShowPass}
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      right: "15px",
                      top: "10px",
                      color: "#707070",
                    }}
                    className={showpass ? "far fa-eye-slash" : "far fa-eye"}
                  ></i>
                  <div className="errorMsg">{errors.password}</div>
                </div>

                <div className="errorMsg">{mainErrorMsg}</div>
                <div className="align-items-center justify-content-between mb-5 mt-4">
                  <p style={{ color: "#707070" }} className="text-center mb-0">
                    <u>Contact Administration</u>
                  </p>
                </div>
                <button
                  style={{
                    fontSize: "24px",
                    height: "48px",
                    fontWeight: "500",
                    lineHeight: "25px",
                    borderRadius: "9px",
                    border: "none",
                  }}
                  type="submit"
                  className="btn btn-warning  w-100 mb-4 bg-falgun text-white"
                >
                  Sign In
                </button>

                <div
                  className="otp_area d-none"
                  style={{ border: "1px solid red" }}
                >
                  <h4 className="text-base mt-6 mb-4">
                    One Time Password (OTP)
                  </h4>
                  <p
                    style={{ background: "#323232" }}
                    className="text-base text-white mt-4 bg-[#323232] p-4 rounded-md"
                  >
                    We have sent an OTP to your email, please check your inbox
                    or spam folder
                  </p>

                  <div className="flex items-center gap-4">
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={6}
                      renderSeparator={<span> - </span>}
                      renderInput={(props) => <input {...props} />}
                    />
                  </div>
                  <div className="errorMsg">{errors.password}</div>
                </div>
              </div>
            </form>
            <p
              style={{
                position: "absolute",
                bottom: "20px",
                color: "#707070",
                left: "18%",
              }}
              className="text-center mb-0"
            >
              {currentTime}
            </p>
          </div>
          <div className="col-lg-6">
            <div
              className="topic_Img bg-falgun"
              style={{
                borderRadius: "27px",
                padding: "15px",
                height: "calc(100vh - 30px)",
              }}
            >
              <Carousel fade className="login_page_carousel">
                <Carousel.Item>
                  <img
                    style={{
                      borderRadius: "20px",
                      width: "100%",
                      height: "calc(100vh - 60px)",
                    }}
                    alt="AI IMAGE"
                    src={Image1}
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    style={{
                      borderRadius: "20px",
                      width: "100%",
                      height: "calc(100vh - 60px)",
                    }}
                    alt="AI IMAGE"
                    src={Image2}
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    style={{
                      borderRadius: "20px",
                      width: "100%",
                      height: "calc(100vh - 60px)",
                    }}
                    alt="AI IMAGE"
                    src={Image3}
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    style={{
                      borderRadius: "20px",
                      width: "100%",
                      height: "calc(100vh - 60px)",
                    }}
                    alt="AI IMAGE"
                    src={Image4}
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    style={{
                      borderRadius: "20px",
                      width: "100%",
                      height: "calc(100vh - 60px)",
                    }}
                    alt="AI IMAGE"
                    src={Image5}
                  />
                </Carousel.Item>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
