import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "../../../services/api";
import moment from "moment";
import Spinner from "../../../elements/Spinner";
import { Modal, Button } from "react-bootstrap";
import swal from "sweetalert";
import $ from "jquery";
import "datatables.net";
import "datatables.net-buttons";
import "datatables.net-buttons/js/buttons.html5.min.js";
import "datatables.net-buttons/js/buttons.print.min.js";
import "datatables.net-buttons/js/buttons.colVis.mjs";

export default function Employees(props) {
  const history = useHistory();
  const dataTableRef = useRef(null);
  const [spinner, setSpinner] = useState(false);

  const [imageURL, setImageUrl] = useState(null);
  const [imageModal, setImageModal] = useState(false);
  const openImageModal = (url) => {
    setImageUrl(url);
    setImageModal(true);
  };
  const closeImageModal = () => {
    setImageUrl(null);
    setImageModal(false);
  };
  // password
  const [passwordModal, setPasswordModal] = useState(false);
  const [userID, setUserID] = useState(0);
  const [username, setUsername] = useState("");
  const [showPass, setShowPass] = useState(false);

  const toggleShowPass = () => {
    setShowPass(!showPass);
  };

  const openPasswordModal = (id, name) => {
    setUserID(id);
    setUsername(name);
    setPasswordModal(true);
  };
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const submitPassword = async () => {
    if (!password) {
      setPasswordError("Password is required");
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
    } else {
      try {
        const response = await api.post("/admin/employees-update-password", {
          id: userID,
          password: password,
        });
        if (response.status === 200 && response.data) {
          setPasswordModal(false);
        }
      } catch (error) {
        console.error("Error updating password:", error);
        // Handle error from API call
      }
    }
  };

  const closePasswordModal = () => {
    setPassword("");
    setPasswordError("");
    setUserID(0);
    setUsername("");
    setPasswordModal(false);
  };

  // get all employees

  const [employees, setEmployees] = useState([]);
  const getEmployees = async () => {
    setSpinner(true);
    var response = await api.post("/admin/employees");
    if (response.status === 200 && response.data) {
      setEmployees(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  useEffect(() => {
    const fetchDataAndInitializeDataTable = async () => {
      setSpinner(true);
      await getEmployees();
      if ($.fn.DataTable.isDataTable(dataTableRef.current)) {
        $(dataTableRef.current).DataTable().destroy();
      }
      const dataTable = $(dataTableRef.current).DataTable({
        dom: "Bfrtip",
        buttons: [
          {
            extend: "copy",
            exportOptions: { columns: ":visible" },
          },
          {
            extend: "excel",
            exportOptions: { columns: ":visible" },
          },
          {
            extend: "print",
            exportOptions: {
              columns: function (idx, data, node) {
                // Exclude the second (index 1) and last columns
                return (
                  idx !== 1 &&
                  idx !== 7 &&
                  idx !== dataTable.columns().indexes().length - 1
                );
              },
            },
          },
        ],
        // DataTable options go here
      });

      setSpinner(false); // Move this line inside the function
      // Destroy DataTable when the component unmounts
      return () => {
        dataTable.destroy();
      };
    };

    fetchDataAndInitializeDataTable();
  }, []);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Employees</div>
        <div className="actions">
          <Link
            to="/admin/employees/create"
            className="btn btn-warning bg-falgun rounded-circle"
          >
            <i className="fal fa-plus"></i>
          </Link>
        </div>
      </div>
      <div className="employees_tables">
        <div id="buttonsContainer"> </div>
        <table ref={dataTableRef} className="display">
          <thead>
            <tr>
              <th>#</th>
              <th>Photo</th>
              <th>Staff ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Company</th>
              <th>Role Permission</th>
              <th>Email</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>

                <td>
                  <img
                    onClick={() => openImageModal(item.profile_picture)}
                    style={{
                      height: "50px",
                      width: "50px",
                      border: "1px solid gray",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                    src={item.profile_picture}
                  />
                </td>
                <td>{item.staff_id}</td>
                <td>{item.full_name}</td>
                <td>{item.department_title}</td>
                <td>{item.designation_title}</td>
                <td>{item.company_title}</td>
                <td>{item.role_title}</td>
                <td>{item.email}</td>
                <td>{item.status}</td>
                <td>
                  {item.last_login_at
                    ? moment(item.last_login_at).format("MMM Do YY, h:mm A")
                    : "Not Login Yet"}
                </td>
                <td>
                  <>
                    <Link to={"/admin/employees/edit/" + item.id}>
                      <i className="fas fa-pen"></i>
                    </Link>
                    <Link
                      to="#"
                      onClick={() => openPasswordModal(item.id, item.full_name)}
                    >
                      <i
                        style={{ marginLeft: "10px" }}
                        className=" fa fa-key text-warning"
                      ></i>
                    </Link>
                  </>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal show={imageModal} onHide={closeImageModal}>
        <Modal.Header closeButton>
          <Modal.Title>Profile Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img style={{ width: "100%" }} src={imageURL} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeImageModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={passwordModal} onHide={closePasswordModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Password for {username}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ position: "relative" }} className="form-group">
            <label>
              Password <sup>*</sup>
            </label>
            <input
              type={showPass ? "text" : "password"}
              className="form-control"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
            <div
              style={{
                position: "absolute",
                right: "15px",
                top: "30px",
                fontSize: "16px",
                cursor: "pointer",
              }}
              onClick={toggleShowPass}
            >
              {showPass ? (
                <i className="fa fa-eye"></i>
              ) : (
                <i className="fa fa-eye-slash"></i>
              )}
            </div>

            {passwordError && <div className="errorMsg">{passwordError}</div>}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={submitPassword}>
            Update
          </Button>
          <Button variant="secondary" onClick={closePasswordModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
