import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import swal from "sweetalert";
import Select from "react-select";
import ListGroup from "react-bootstrap/ListGroup";

export default function CreateQuickRequisition(props) {
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);

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

  const [parts, setParts] = useState([]);
  const getParts = async () => {
    setSpinner(true);
    var response = await api.post("/parts-required-purchase");
    if (response.status === 200 && response.data) {
      setParts(response.data.parts);
    }
    setSpinner(false);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredParts = parts.filter(
    (item) =>
      item.part_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const addRow = (item) => {
    // Animate the item
    const animatedItem = { ...item, animationClass: "slide-in-right" };
    setRequisitionItems([animatedItem, ...requisitionItems]);
    setParts(parts.filter((part) => part.part_id !== item.part_id));

    // Remove animation class after animation ends
    setTimeout(() => {
      setRequisitionItems((items) =>
        items.map((it) =>
          it.part_id === animatedItem.part_id
            ? { ...it, animationClass: "" }
            : it
        )
      );
    }, 500); // Duration of slide-in-right animation
  };

  const removeRow = (index) => {
    const item = requisitionItems[index];
    // Animate the item
    const animatedItem = { ...item, animationClass: "slide-out-left" };
    const updatedRequisitionItems = [...requisitionItems];
    updatedRequisitionItems[index] = animatedItem;
    setRequisitionItems(updatedRequisitionItems);

    // Remove the item from requisitionItems and add to parts after animation ends
    setTimeout(() => {
      setRequisitionItems((items) => items.filter((_, i) => i !== index));
      setParts([item, ...parts]);
    }, 500); // Duration of slide-out-left animation
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...requisitionItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
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
        return;
      }
      var data = new FormData();
      data.append("recommended_user", formDataSet.recommended_user);
      data.append("label", formDataSet.label);
      data.append("requisition_items", JSON.stringify(requisitionItems));
      setSpinner(true);
      var response = await api.post("/requisitions-create", data);
      if (response.status === 200 && response.data) {
        history.push("/requisitions-details/" + response.data.data.id);
      } else {
        setErrors(response.data.errors);
      }
      setSpinner(false);
    }
  };

  useEffect(() => {
    getParts();
    getEmployees();
  }, []);

  useEffect(() => {
    getParts();
  }, [props.callParts]);

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
    <div className="create_edit_page" style={{ marginTop: "-15px" }}>
      {spinner && <Spinner />}
      <div className="row">
        <div className="col-lg-5 bg-falgun">
          <br />
          <div className="search_header">
            <input
              type="search"
              placeholder="Item name Or Type"
              className="form-control"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <hr />
          <div className="retrived_items">
            <ListGroup
              as="ul"
              style={{
                height: "calc(100vh - 160px)",
                overflowY: "scroll",
                scrollBehavior: "smooth",
              }}
            >
              {filteredParts.map((item, index) => (
                <ListGroup.Item
                  className={item.animationClass || ""}
                  style={{
                    marginBottom: "5px",
                    borderTop: "1px solid #dee2e6",
                    fontSize: "14px",
                  }}
                  key={index}
                  as="li"
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      {item.part_name} | {item.type} |{" "}
                      <strong className="text-danger">
                        STOCK: {item.stock_in_hand} {item.unit}
                      </strong>
                    </div>
                    <Link
                      className="btn btn-sm btn-outline-success"
                      onClick={() => addRow(item)}
                    >
                      SELECT
                    </Link>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </div>
        <div
          className="col-lg-7"
          style={{
            height: "calc(100vh - 100px)",
            overflowY: "scroll",
            scrollBehavior: "smooth",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div className="create_page_heading margin_bottom_0">
              <div className="page_name">Create Quick Requisition</div>
              <div className="actions">
                <button
                  type="submit"
                  className="publish_btn btn btn-warning bg-falgun"
                >
                  Create
                </button>
                <Link
                  to="/requisitions"
                  className="btn btn-danger rounded-circle"
                >
                  <i className="fal fa-times"></i>
                </Link>
              </div>
            </div>
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
                                (item) =>
                                  item.id === formDataSet.recommended_user
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
                      <th>Required QTY</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requisitionItems.map((item, index) => (
                      <tr key={index} className={item.animationClass || ""}>
                        <td>
                          {item.part_name} | {item.type} |{" "}
                          <strong className="text-danger">
                            STOCK: {item.stock_in_hand} {item.unit}
                          </strong>
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
                                handleItemChange(
                                  index,
                                  "remarks",
                                  e.target.value
                                )
                              }
                            />
                            <Link
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeRow(index)}
                            >
                              REMOVE
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <br />
              <br />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
