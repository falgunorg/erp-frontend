import React, { useState, useEffect } from "react";
import api from "../../services/api";
import moment from "moment";

export default function Holidays() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const [addNew, setAddNew] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [holidayForm, setHolidayForm] = useState({ date: "", title: "" });

  const getHolidays = async () => {
    try {
      const response = await api.post("/hr/holidays", { year });
      if (response.status === 200 && response.data) {
        setHolidays(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching holidays:", error);
    }
  };

  const holidayChange = (e) => {
    const { name, value } = e.target;
    setHolidayForm({ ...holidayForm, [name]: value });
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};

    if (!holidayForm.title) {
      formErrors.title = "Title is required";
    }
    if (!holidayForm.date) {
      formErrors.date = "Date is required";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const submitHoliday = async (event) => {
    event.preventDefault();
    try {
      if (validateForm()) {
        const response = await api.post("/hr/holidays-create", holidayForm);
        if (response.status === 200) {
          setHolidayForm({ title: "", date: "" });
          setAddNew(false);
          getHolidays();
        } else {
          setErrors(response.data.errors);
        }
      }
    } catch (error) {
      console.error("Error adding holiday:", error);
    }
  };

  const editChange = (e) => {
    const { name, value } = e.target;
    setEditingItem({ ...editingItem, [name]: value });
  };

  const submitUpdate = async () => {
    try {
      const response = await api.post("/hr/holidays-update", {
        id: editingItem.id,
        title: editingItem.title,
        date: editingItem.date,
      });
      if (response.status === 200) {
        setEditingItem(null);
        getHolidays();
      }
    } catch (error) {
      console.error("Error updating holiday:", error);
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await api.post("/hr/holidays-delete", {
        id: id,
      });
      if (response.status === 200) {
        getHolidays();
      }
    } catch (error) {
      console.error("Error deleting holiday:", error);
    }
  };

  useEffect(() => {
    getHolidays();
  }, [year]);

  return (
    <div className="bg-white rounded p-1 box_shadow_card">
      <h6>
        <strong>Manage Holidays</strong>
      </h6>

      <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <button
          style={{ maxHeight: "25px", padding: "2px 5px" }}
          className="btn btn-sm rounded btn-outline-success"
          onClick={() => setAddNew(true)}
        >
          <i className="fa fa-plus"></i>
        </button>
      </div>
      <hr />

      <div className="table-responsive attendance_table_area">
        <table className="table table-bordered table-striped print-table">
          <thead
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "white",
              zIndex: 1,
              width: "100%",
            }}
            className="print-thead thead-dark table-dark"
          >
            <tr className="table_heading_tr">
              <th>Date</th>
              <th>Label</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {addNew && (
              <tr>
                <td>
                  <input
                    onChange={holidayChange}
                    value={holidayForm.date}
                    name="date"
                    className="form-control margin_bottom_0"
                    type="date"
                  />
                  {errors.date && (
                    <div className="errorMsg margin_bottom_0">
                      {errors.date}
                    </div>
                  )}
                </td>
                <td>
                  <input
                    onChange={holidayChange}
                    value={holidayForm.title}
                    name="title"
                    className="form-control margin_bottom_0"
                    type="text"
                  />
                  {errors.title && (
                    <div className="errorMsg margin_bottom_0">
                      {errors.title}
                    </div>
                  )}
                </td>
                <td>
                  <i
                    onClick={submitHoliday}
                    className="fa fa-check text-success me-2"
                    style={{ cursor: "pointer" }}
                  ></i>
                  <i
                    onClick={() => {
                      setAddNew(false);
                      setErrors({});
                      setHolidayForm({});
                    }}
                    className="fa fa-times text-danger"
                    style={{ cursor: "pointer" }}
                  ></i>
                </td>
              </tr>
            )}

            {holidays.length > 0 ? (
              holidays.map((item, index) =>
                editingItem?.id === item.id ? (
                  <tr key={index}>
                    <td>
                      <input
                        onChange={editChange}
                        value={editingItem.date}
                        name="date"
                        className="form-control margin_bottom_0"
                        type="date"
                      />
                    </td>
                    <td>
                      <input
                        onChange={editChange}
                        value={editingItem.title}
                        name="title"
                        className="form-control margin_bottom_0"
                        type="text"
                      />
                    </td>
                    <td>
                      <i
                        onClick={submitUpdate}
                        className="fa fa-check text-success me-2"
                        style={{ cursor: "pointer" }}
                      ></i>
                      <i
                        onClick={() => setEditingItem(null)}
                        className="fa fa-times text-danger"
                        style={{ cursor: "pointer" }}
                      ></i>
                    </td>
                  </tr>
                ) : (
                  <tr key={index}>
                    <td>{moment(item.date).format("MMM Do YYYY")}</td>
                    <td>{item.title}</td>
                    <td>
                      <i
                        onClick={() => setEditingItem(item)}
                        className="far fa-pen text-warning me-2"
                        style={{ cursor: "pointer" }}
                      ></i>
                      <i
                        onClick={() => deleteItem(item.id)}
                        className="far fa-trash text-danger"
                        style={{ cursor: "pointer" }}
                      ></i>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
