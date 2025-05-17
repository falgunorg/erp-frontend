import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "services/api";
import Spinner from "elements/Spinner";

export default function CreateRoles() {
  const [spinner, setSpinner] = useState(false);
  const history = useHistory();
  // announcement
  const [announcementData, setAnnouncementData] = useState({
    add_edit: 0,
    view_download: 0,
    approved_reject: 0,
    delete_void: 0,
  });

  const announcementChange = (ev) => {
    var inputName = ev.target.name;

    if (inputName == "add_edit") {
      var checked = ev.target.checked;
      if (checked) {
        setAnnouncementData({
          ...announcementData,
          add_edit: 1,
        });
      } else {
        setAnnouncementData({
          ...announcementData,
          add_edit: 0,
        });
      }
    } else if (inputName == "view_download") {
      var checked = ev.target.checked;
      if (checked) {
        setAnnouncementData({
          ...announcementData,
          view_download: 1,
        });
      } else {
        setAnnouncementData({
          ...announcementData,
          view_download: 0,
        });
      }
    } else if (inputName == "approved_reject") {
      var checked = ev.target.checked;
      if (checked) {
        setAnnouncementData({
          ...announcementData,
          approved_reject: 1,
        });
      } else {
        setAnnouncementData({
          ...announcementData,
          approved_reject: 0,
        });
      }
    } else if (inputName == "delete_void") {
      var checked = ev.target.checked;
      if (checked) {
        setAnnouncementData({
          ...announcementData,
          delete_void: 1,
        });
      } else {
        setAnnouncementData({
          ...announcementData,
          delete_void: 0,
        });
      }
    }
  };

  const [employeeData, setEmployeeData] = useState({
    add_edit: 0,
    view_download: 0,
    approved_reject: 0,
    delete_void: 0,
  });
  const employeeChange = (ev) => {
    var inputName = ev.target.name;

    if (inputName == "add_edit") {
      var checked = ev.target.checked;
      if (checked) {
        setEmployeeData({
          ...employeeData,
          add_edit: 1,
        });
      } else {
        setEmployeeData({
          ...employeeData,
          add_edit: 0,
        });
      }
    } else if (inputName == "view_download") {
      var checked = ev.target.checked;
      if (checked) {
        setEmployeeData({
          ...employeeData,
          view_download: 1,
        });
      } else {
        setEmployeeData({
          ...employeeData,
          view_download: 0,
        });
      }
    } else if (inputName == "approved_reject") {
      var checked = ev.target.checked;
      if (checked) {
        setEmployeeData({
          ...employeeData,
          approved_reject: 1,
        });
      } else {
        setEmployeeData({
          ...employeeData,
          approved_reject: 0,
        });
      }
    } else if (inputName == "delete_void") {
      var checked = ev.target.checked;
      if (checked) {
        setEmployeeData({
          ...employeeData,
          delete_void: 1,
        });
      } else {
        setEmployeeData({
          ...employeeData,
          delete_void: 0,
        });
      }
    }
  };

  // notebook Data
  const [notebookData, setNotebookData] = useState({
    add_edit: 0,
    view_download: 0,
    approved_reject: 0,
    delete_void: 0,
  });

  const notebookChange = (ev) => {
    var inputName = ev.target.name;

    if (inputName == "add_edit") {
      var checked = ev.target.checked;
      if (checked) {
        setNotebookData({
          ...notebookData,
          add_edit: 1,
        });
      } else {
        setNotebookData({
          ...notebookData,
          add_edit: 0,
        });
      }
    } else if (inputName == "view_download") {
      var checked = ev.target.checked;
      if (checked) {
        setNotebookData({
          ...notebookData,
          view_download: 1,
        });
      } else {
        setNotebookData({
          ...notebookData,
          view_download: 0,
        });
      }
    } else if (inputName == "approved_reject") {
      var checked = ev.target.checked;
      if (checked) {
        setNotebookData({
          ...notebookData,
          approved_reject: 1,
        });
      } else {
        setNotebookData({
          ...notebookData,
          approved_reject: 0,
        });
      }
    } else if (inputName == "delete_void") {
      var checked = ev.target.checked;
      if (checked) {
        setNotebookData({
          ...notebookData,
          delete_void: 1,
        });
      } else {
        setNotebookData({
          ...notebookData,
          delete_void: 0,
        });
      }
    }
  };

  // roles data
  const [rolesData, setRolesData] = useState({
    add_edit: 0,
    view_download: 0,
    approved_reject: 0,
    delete_void: 0,
  });

  const rolesChange = (ev) => {
    var inputName = ev.target.name;

    if (inputName == "add_edit") {
      var checked = ev.target.checked;
      if (checked) {
        setRolesData({
          ...rolesData,
          add_edit: 1,
        });
      } else {
        setRolesData({
          ...rolesData,
          add_edit: 0,
        });
      }
    } else if (inputName == "view_download") {
      var checked = ev.target.checked;
      if (checked) {
        setRolesData({
          ...rolesData,
          view_download: 1,
        });
      } else {
        setRolesData({
          ...rolesData,
          view_download: 0,
        });
      }
    } else if (inputName == "approved_reject") {
      var checked = ev.target.checked;
      if (checked) {
        setRolesData({
          ...rolesData,
          approved_reject: 1,
        });
      } else {
        setRolesData({
          ...rolesData,
          approved_reject: 0,
        });
      }
    } else if (inputName == "delete_void") {
      var checked = ev.target.checked;
      if (checked) {
        setRolesData({
          ...rolesData,
          delete_void: 1,
        });
      } else {
        setRolesData({
          ...rolesData,
          delete_void: 0,
        });
      }
    }
  };

  // report Data
  const [reportData, setReportData] = useState({
    add_edit: 0,
    view_download: 0,
    approved_reject: 0,
    delete_void: 0,
  });

  const reportChange = (ev) => {
    var inputName = ev.target.name;

    if (inputName == "add_edit") {
      var checked = ev.target.checked;
      if (checked) {
        setReportData({
          ...reportData,
          add_edit: 1,
        });
      } else {
        setReportData({
          ...reportData,
          add_edit: 0,
        });
      }
    } else if (inputName == "view_download") {
      var checked = ev.target.checked;
      if (checked) {
        setReportData({
          ...reportData,
          view_download: 1,
        });
      } else {
        setReportData({
          ...reportData,
          view_download: 0,
        });
      }
    } else if (inputName == "approved_reject") {
      var checked = ev.target.checked;
      if (checked) {
        setReportData({
          ...reportData,
          approved_reject: 1,
        });
      } else {
        setReportData({
          ...reportData,
          approved_reject: 0,
        });
      }
    } else if (inputName == "delete_void") {
      var checked = ev.target.checked;
      if (checked) {
        setReportData({
          ...reportData,
          delete_void: 1,
        });
      } else {
        setReportData({
          ...reportData,
          delete_void: 0,
        });
      }
    }
  };

  // settings Data
  const [settingsData, setSettingsData] = useState({
    add_edit: 0,
    view_download: 0,
    approved_reject: 0,
    delete_void: 0,
  });

  const settingChange = (ev) => {
    var inputName = ev.target.name;

    if (inputName == "add_edit") {
      var checked = ev.target.checked;
      if (checked) {
        setSettingsData({
          ...settingsData,
          add_edit: 1,
        });
      } else {
        setSettingsData({
          ...settingsData,
          add_edit: 0,
        });
      }
    } else if (inputName == "view_download") {
      var checked = ev.target.checked;
      if (checked) {
        setSettingsData({
          ...settingsData,
          view_download: 1,
        });
      } else {
        setSettingsData({
          ...settingsData,
          view_download: 0,
        });
      }
    } else if (inputName == "approved_reject") {
      var checked = ev.target.checked;
      if (checked) {
        setSettingsData({
          ...settingsData,
          approved_reject: 1,
        });
      } else {
        setSettingsData({
          ...settingsData,
          approved_reject: 0,
        });
      }
    } else if (inputName == "delete_void") {
      var checked = ev.target.checked;
      if (checked) {
        setSettingsData({
          ...settingsData,
          delete_void: 1,
        });
      } else {
        setSettingsData({
          ...settingsData,
          delete_void: 0,
        });
      }
    }
  };

  const [formData, setFormData] = useState({
    title: "",
    level: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.title) {
      newErrors.title = "Role Name is required";
    }
    if (!formData.level) {
      newErrors.level = "Team Lead is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    var valid = validateForm();

    if (valid) {
      setSpinner(true);
      var response = await api.post("/roles-create", {
        title: formData.title,
        level: formData.level,
        announcement_data: announcementData,
        employee_data: employeeData,
        notebook_data: notebookData,
        roles_data: rolesData,
        report_data: reportData,
        setting_data: settingsData,
      });
      if (response.status === 200 && response.data) {
        history.push("/roles");
      } else {
        setErrors(response.data.errors);
      }
      setSpinner(false);
    }
  };

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <form onSubmit={handleSubmit}>
        <div className="create_page_heading">
          <div className="page_name">Create New Role</div>
          <div className="actions">
            <button
              type="submit"
              className="publish_btn btn btn-warning bg-falgun"
            >
              Save
            </button>
            <Link to="/roles" className="btn btn-danger rounded-circle">
              <i className="fal fa-times"></i>
            </Link>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="input-name">Role Name</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                className="form-control form-control-alternative"
                placeholder="Account Manager"
                onChange={handleChange}
              />
              {errors.title && <div className="errorMsg">{errors.title}</div>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="input-level">Access Level</label>
              <input
                type="text"
                name="level"
                value={formData.level}
                className="form-control form-control-alternative"
                placeholder="view only"
                onChange={handleChange}
              />
              {errors.level && <div className="errorMsg">{errors.level}</div>}
            </div>
          </div>
        </div>

        <br />
        <br />
        <div className="text-right d-none">
          <button className="btn btn-info btn-sm full_access_btn mr-10">
            Check All
          </button>
          <button className="btn btn-danger uncheckAll ">Uncheck All</button>
        </div>
        <br />
        <h3>Select Permission:</h3>
        <div className="row">
          <div className="col-md-12">
            <table className="table tablesorter">
              <thead className="text-primary">
                <th scope="col">Menu Name</th>
                <th scope="col">Add & Edit</th>
                <th scope="col">View & Download</th>
                <th scope="col">Approve/Reject</th>
                <th scope="col">Delete,Disable & Enable</th>
              </thead>
              <tbody>
                <tr>
                  <td>Sample Order Request</td>
                  <td>
                    <label className="switch">
                      <input
                        value={announcementData.add_edit}
                        name="add_edit"
                        type="checkbox"
                        className="singleCheckbox"
                        onChange={announcementChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        value={announcementData.view_download}
                        name="view_download"
                        type="checkbox"
                        className="singleCheckbox"
                        onChange={announcementChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        value={announcementData.approved_reject}
                        name="approved_reject"
                        type="checkbox"
                        className="singleCheckbox"
                        onChange={announcementChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        value={announcementData.delete_void}
                        name="delete_void"
                        type="checkbox"
                        className="singleCheckbox"
                        onChange={announcementChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                </tr>
                <tr>
                  <td>Costing Files</td>
                  <td>
                    <label className="switch">
                      <input
                        value={employeeData.add_edit}
                        name="add_edit"
                        type="checkbox"
                        className="singleCheckbox"
                        onChange={employeeChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        value={employeeData.view_download}
                        name="view_download"
                        type="checkbox"
                        className="singleCheckbox"
                        onChange={employeeChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        value={employeeData.approved_reject}
                        name="approved_reject"
                        type="checkbox"
                        className="singleCheckbox"
                        onChange={employeeChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        value={employeeData.delete_void}
                        name="delete_void"
                        type="checkbox"
                        className="singleCheckbox"
                        onChange={employeeChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                </tr>

                <tr>
                  <td>Purchases</td>
                  <td>
                    <label className="switch">
                      <input
                        value={notebookData.add_edit}
                        name="add_edit"
                        type="checkbox"
                        className="singleCheckbox"
                        onChange={notebookChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        value={notebookData.view_download}
                        name="view_download"
                        type="checkbox"
                        className="singleCheckbox"
                        onChange={notebookChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        value={notebookData.approved_reject}
                        name="approved_reject"
                        type="checkbox"
                        className="singleCheckbox"
                        onChange={notebookChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        value={notebookData.delete_void}
                        name="delete_void"
                        type="checkbox"
                        className="singleCheckbox"
                        onChange={notebookChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                </tr>

                <tr>
                  <td>Bookings</td>
                  <td>
                    <label className="switch">
                      <input
                        value={rolesData.add_edit}
                        name="add_edit"
                        type="checkbox"
                        className="singleCheckbox"
                        onChange={rolesChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        value={rolesData.view_download}
                        name="view_download"
                        type="checkbox"
                        className="singleCheckbox"
                        onChange={rolesChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        value={rolesData.approved_reject}
                        name="approved_reject"
                        type="checkbox"
                        className="singleCheckbox"
                        onChange={rolesChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        value={rolesData.delete_void}
                        name="delete_void"
                        type="checkbox"
                        className="singleCheckbox"
                        onChange={rolesChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                </tr>

                <tr>
                  <td>LCS</td>
                  <td>
                    <label className="switch">
                      <input
                        value={reportData.add_edit}
                        name="add_edit"
                        type="checkbox"
                        className="singleCheckbox"
                        onChange={reportChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        value={reportData.view_download}
                        name="view_download"
                        type="checkbox"
                        className="singleCheckbox"
                        onChange={reportChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        value={reportData.approved_reject}
                        name="approved_reject"
                        type="checkbox"
                        className="singleCheckbox"
                        onChange={reportChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        value={reportData.delete_void}
                        name="delete_void"
                        type="checkbox"
                        className="singleCheckbox"
                        onChange={reportChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                </tr>

                <tr>
                  <td>Purchase Contract</td>
                  <td>
                    <label className="switch">
                      <input
                        value={reportData.add_edit}
                        name="add_edit"
                        type="checkbox"
                        className="singleCheckbox"
                        onChange={reportChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        value={reportData.view_download}
                        name="view_download"
                        type="checkbox"
                        className="singleCheckbox"
                        onChange={reportChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        value={reportData.approved_reject}
                        name="approved_reject"
                        type="checkbox"
                        className="singleCheckbox"
                        onChange={reportChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        value={reportData.delete_void}
                        name="delete_void"
                        type="checkbox"
                        className="singleCheckbox"
                        onChange={reportChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                </tr>

                <tr>
                  <td>Settings</td>
                  <td>
                    <label className="switch">
                      <input
                        value={settingsData.add_edit}
                        name="add_edit"
                        type="checkbox"
                        className="singleCheckbox"
                        onChange={settingChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        value={settingsData.view_download}
                        name="view_download"
                        type="checkbox"
                        className="singleCheckbox"
                        onChange={settingChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        value={settingsData.approved_reject}
                        name="approved_reject"
                        type="checkbox"
                        className="singleCheckbox"
                        onChange={settingChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        value={settingsData.delete_void}
                        name="delete_void"
                        type="checkbox"
                        className="singleCheckbox"
                        onChange={settingChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
  );
}
