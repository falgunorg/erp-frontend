import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import swal from "sweetalert";
import Select from "react-select";

// modals
import UnitModal from "../../../elements/modals/UnitModal";
import PartModal from "../../../elements/modals/PartModal";

export default function EditRequisition(props) {
  const params = useParams();
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);
  // const userInfo = props.userData;
  const [units, setUnits] = useState([]);
  const getUnits = async () => {
    setSpinner(true);
    var response = await api.post("/units");
    if (response.status === 200 && response.data) {
      setUnits(response.data.data);
    }
    setSpinner(false);
  };

  const [employees, setEmployees] = useState([]);
  const getEmployees = async () => {
    setSpinner(true);
    var response = await api.post("/employees", {
      recommended_group: true,
      without_me: true,
    });
    if (response.status === 200 && response.data) {
      setEmployees(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  // item showing and adding
  const [parts, setParts] = useState([]);
  const getParts = async () => {
    setSpinner(true);
    var response = await api.post("/parts");
    if (response.status === 200 && response.data) {
      setParts(response.data.data);
    }
    setSpinner(false);
  };

  const [errors, setErrors] = useState({});

  const [formDataSet, setFormDataSet] = useState({
    recommended_user: "",
    label: "",
  });

  const handleChange = (name, value) => {
    setFormDataSet({ ...formDataSet, [name]: value });
  };

  const validateForm = () => {
    let formErrors = {};
    // personal info
    if (!formDataSet.recommended_user) {
      formErrors.recommended_user = "Recommended User is required";
    }
    if (!formDataSet.label) {
      formErrors.label = "Label is required";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const [requisitionItems, setRequisitionItems] = useState([]);
  const removeRow = (index) => {
    const updatedItems = [...requisitionItems];
    updatedItems.splice(index, 1);
    setRequisitionItems(updatedItems);
  };
  const addRow = () => {
    const newItem = {
      part_id: "",
      unit: "",
      stock_in_hand: "",
      qty: "",
      remarks: "",
    };

    setRequisitionItems([...requisitionItems, newItem]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...requisitionItems];

    if (field === "part_id") {
      const selectedItem = parts.find((part) => part.id === parseInt(value));
      if (selectedItem) {
        updatedItems[index].part_id = parseInt(value);
        updatedItems[index].unit = selectedItem.unit;
        updatedItems[index].stock_in_hand = parseInt(selectedItem.stock);
      } else {
        updatedItems[index].item_id = "";
        updatedItems[index].unit = "";
        updatedItems[index].stock_in_hand = "";
      }
    }

    updatedItems[index] = {
      ...updatedItems[index], // Copy the existing item
      [field]: value, // Update the specific field
    };
    setRequisitionItems(updatedItems);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      if (requisitionItems.length === 0) {
        swal({
          title:
            "There are no Items's in this Requisition, click on Add Row and fill the data",
          icon: "error",
        });
        return; //Prevent form submission
      }
      var data = new FormData();
      data.append("recommended_user", formDataSet.recommended_user);
      data.append("label", formDataSet.label);
      data.append("requisition_items", JSON.stringify(requisitionItems));
      data.append("id", formDataSet.id);
      setSpinner(true);
      var response = await api.post("/requisitions-update", data);
      if (response.status === 200 && response.data) {
        history.push("/requisitions");
      } else {
        setErrors(response.data.errors);
      }
      setSpinner(false);
    }
  };

  const getRequisition = async () => {
    setSpinner(true);
    var response = await api.post("/requisitions-show", { id: params.id });
    if (response.status === 200 && response.data) {
      setFormDataSet(response.data.data);
      setRequisitionItems(response.data.data.requisition_items);
    } else {
      setErrors(response.data.errors);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getUnits();
    getParts();
    getEmployees();
    getRequisition();
  }, []);
  useEffect(async () => {
    getParts();
  }, [props.callParts]);

  useEffect(async () => {
    getUnits();
  }, [props.callUnits]);

  useEffect(() => {
    const validateDuplicatePiItem = () => {
      const itemMap = new Map();
      let isDuplicate = false;

      requisitionItems.forEach((item, index) => {
        const { part_id } = item;
        const key = `${part_id}`;

        if (itemMap.has(key)) {
          isDuplicate = true;
          itemMap.get(key).push(index);
        } else {
          itemMap.set(key, [index]);
        }
      });

      if (isDuplicate) {
        itemMap.forEach((indices, key) => {
          if (indices.length > 1) {
            swal({
              title: "Duplicate Item",
              text: "Item Already Selected",
              icon: "warning",
            }).then(() => {
              const updatedItems = [...requisitionItems];
              indices.reverse().forEach((index, i) => {
                if (i !== 0) {
                  updatedItems.splice(index, 1);
                }
              });
              setRequisitionItems(updatedItems);
            });
          }
        });
      }
    };

    validateDuplicatePiItem();
  }, [requisitionItems]);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <form onSubmit={handleSubmit}>
        <div className="create_page_heading">
          <div className="page_name">
            Update Requisition --- {formDataSet.requisition_number}
          </div>
          <div className="actions">
            <button
              type="supmit"
              className="publish_btn btn btn-warning bg-falgun"
            >
              Update
            </button>
            <Link to="/requisitions" className="btn btn-danger rounded-circle">
              <i className="fal fa-times"></i>
            </Link>
          </div>
        </div>

        <div className="col-lg-12">
          <div className="personal_data">
            <div className="row">
              <div className="col-lg-6">
                <label>Recommanded Person</label>
                <Select
                  required
                  placeholder="Select"
                  value={
                    employees.find(
                      (item) => item.id === formDataSet.recommended_user
                    )
                      ? {
                          value: formDataSet.recommended_user,
                          label:
                            employees.find(
                              (item) => item.id === formDataSet.recommended_user
                            ).full_name +
                              " | " +
                              employees.find(
                                (item) =>
                                  item.id === formDataSet.recommended_user
                              ).department_title || "",
                        }
                      : null
                  }
                  onChange={(selectedOption) =>
                    handleChange("recommended_user", selectedOption.value)
                  }
                  name="recommended_user"
                  options={employees.map((item) => ({
                    value: item.id,
                    label: item.full_name + " | " + item.department_title,
                  }))}
                />
                {errors.recommended_user && (
                  <>
                    <div className="errorMsg">{errors.recommended_user}</div>
                    <br />
                  </>
                )}
              </div>
              <div className="col-lg-6">
                <label> Requisition Label</label>
                <input
                  required
                  type="text"
                  className="form-control"
                  placeholder="Ex: Stationery Item, Medical Item"
                  onChange={(e) => handleChange("label", e.target.value)}
                  value={formDataSet.label}
                />
                {errors.recommended_user && (
                  <>
                    <div className="errorMsg">{errors.recommended_user}</div>
                    <br />
                  </>
                )}
              </div>
            </div>
            <br />
            <h6 className="text-center">
              <u>REQUISITION ITEMS</u>
            </h6>
            <div className="Import_booking_item_table">
              <table className="table text-start align-middle table-bordered table-hover mb-0">
                <thead className="bg-dark text-white">
                  <tr className="text-center">
                    <th>Item</th>
                    <th style={{ width: "150px" }}>Unit</th>
                    <th style={{ width: "150px" }}>Stock Inhand</th>
                    <th style={{ width: "150px" }}>QTY</th>
                    <th style={{ width: "250px" }}>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {requisitionItems.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div style={{ position: "relative" }}>
                          <Select
                            required
                            placeholder="Select"
                            onChange={(selectedOption) =>
                              handleItemChange(
                                index,
                                "part_id",
                                selectedOption.value
                              )
                            }
                            value={
                              parts.find((part) => part.id === item.part_id)
                                ? {
                                    value: item.part_id,
                                    label:
                                      parts.find(
                                        (part) => part.id === item.part_id
                                      ).title || "",
                                  }
                                : null
                            }
                            options={parts.map((part) => ({
                              value: part.id,
                              label: part.title,
                            }))}
                          />

                          <i
                            onClick={() => props.setPartModal(true)}
                            style={{
                              color: "white",
                              background: "green",
                              padding: "2px",
                              cursor: "pointer",
                              borderRadius: "0px 5px 5px 0px",
                              position: "absolute",
                              right: 0,
                              top: 0,
                              padding: "12px 10px",
                              fontSize: "13px",
                            }}
                            className="fa fa-plus bg-falgun"
                          ></i>
                        </div>
                      </td>

                      <td style={{ width: "150px" }}>
                        <div style={{ position: "relative" }}>
                          <Select
                            required
                            placeholder="Select"
                            onChange={(selectedOption) =>
                              handleItemChange(
                                index,
                                "unit",
                                selectedOption.value
                              )
                            }
                            value={
                              units.find((unit) => unit.title === item.unit)
                                ? {
                                    value: item.unit,
                                    label:
                                      units.find(
                                        (unit) => unit.title === item.unit
                                      ).title || "",
                                  }
                                : null
                            }
                            options={units.map((unit) => ({
                              value: unit.title,
                              label: unit.title,
                            }))}
                          />
                          <i
                            onClick={() => props.setUnitModal(true)}
                            style={{
                              color: "white",
                              background: "green",
                              padding: "2px",
                              cursor: "pointer",
                              borderRadius: "0px 5px 5px 0px",
                              position: "absolute",
                              right: 0,
                              top: 0,
                              padding: "12px 10px",
                              fontSize: "13px",
                            }}
                            className="fa fa-plus bg-falgun"
                          ></i>
                        </div>
                      </td>

                      <td style={{ width: "150px" }}>
                        <input
                          required
                          type="number"
                          onWheel={(event) => event.target.blur()}
                          min="0"
                          className="form-control"
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "stock_in_hand",
                              e.target.value
                            )
                          }
                          value={item.stock_in_hand}
                        />
                      </td>

                      <td style={{ width: "150px" }}>
                        <input
                          required
                          type="number"
                          onWheel={(event) => event.target.blur()}
                          min="0"
                          className="form-control"
                          onChange={(e) =>
                            handleItemChange(index, "qty", e.target.value)
                          }
                          value={item.qty}
                        />
                      </td>

                      <td style={{ width: "250px" }}>
                        <div className="d-flex gap_10 align-items-center">
                          <input
                            className="form-control"
                            value={item.remarks}
                            onChange={(e) =>
                              handleItemChange(index, "remarks", e.target.value)
                            }
                          />
                          <Link>
                            <i
                              onClick={() => removeRow(index)}
                              className="fa fa-times text-danger"
                            ></i>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}

                  <tr className="border_none">
                    <td className="border_none" colSpan={4}></td>
                    <td className="border_none">
                      <div className="add_row text-end">
                        <Link className="btn btn-info btn-sm" onClick={addRow}>
                          Add Row
                        </Link>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <br />
            <br />
          </div>
        </div>
      </form>
      <PartModal {...props} />
      <UnitModal {...props} />
    </div>
  );
}
