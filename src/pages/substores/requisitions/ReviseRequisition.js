import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import swal from "sweetalert";

export default function ReviseRequisition(props) {
  const params = useParams();
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);
  const userInfo = props.userData;
  console.log("USERINFO", userInfo);

  const [formDataSet, setFormDataSet] = useState({});
  const [errors, setErrors] = useState({});

  const [requisitionItems, setRequisitionItems] = useState([]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...requisitionItems];

    // Apply validation logic
    switch (field) {
      case "recommand_qty":
        if (parseInt(value) > parseInt(updatedItems[index].qty)) {
          return;
        } else {
          updatedItems[index].recommand_qty = parseInt(value);
          updatedItems[index].audit_qty = parseInt(value);
          updatedItems[index].final_qty = parseInt(value);
          // updatedItems[index].purchase_qty = parseInt(value);
        }
        break;
      case "audit_qty":
        if (parseInt(value) > parseInt(updatedItems[index].recommand_qty)) {
          return;
        } else {
          updatedItems[index].audit_qty = parseInt(value);
          updatedItems[index].final_qty = parseInt(value);
          // updatedItems[index].purchase_qty = parseInt(value);
        }
        break;
      case "final_qty":
        if (parseInt(value) > parseInt(updatedItems[index].audit_qty)) {
          return;
        } else {
          updatedItems[index].final_qty = parseInt(value);
          // updatedItems[index].purchase_qty = parseInt(value);
        }
        break;
      case "purchase_qty":
        if (parseInt(value) > parseInt(updatedItems[index].final_qty)) {
          return;
        } else {
          updatedItems[index].purchase_qty = parseInt(value);
        }
        break;
      default:
        break;
    }

    updatedItems[index] = {
      ...updatedItems[index], // Copy the existing item
      [field]: value, // Update the specific field
    };

    if (field === "purchase_qty") {
      updatedItems[index].total =
        parseFloat(updatedItems[index].purchase_qty) *
        parseFloat(updatedItems[index].final_rate);
    }
    if (field === "final_rate") {
      updatedItems[index].total =
        parseFloat(updatedItems[index].purchase_qty) *
        parseFloat(updatedItems[index].final_rate);
    }

    setRequisitionItems(updatedItems);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (requisitionItems.length === 0) {
      swal({
        title:
          "There are no Items's in this Requisition, click on Add Row and fill the data",
        icon: "error",
      });
      return; // Prevent form submission
    }
    var data = new FormData();
    data.append("requisition_items", JSON.stringify(requisitionItems));
    data.append("id", formDataSet.id);
    setSpinner(true);
    var response = await api.post("/substore/requisitions-revise", data);
    if (response.status === 200 && response.data) {
      history.push("/requisitions-details/" + formDataSet.id);
    } else {
      setErrors(response.data.errors);
    }
    setSpinner(false);
  };

  const getRequisition = async () => {
    setSpinner(true);
    var response = await api.post("/substore/requisitions-show", { id: params.id });
    if (response.status === 200 && response.data) {
      setFormDataSet(response.data.data);
      setRequisitionItems(response.data.data.requisition_items);
    } else {
      setErrors(response.data.errors);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getRequisition();
  }, []);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <form onSubmit={handleSubmit}>
        <div className="create_page_heading">
          <div className="page_name">
            Revise Requisition --- {formDataSet.requisition_number}
          </div>
          <div className="actions">
            <button
              type="supmit"
              className="publish_btn btn btn-warning bg-falgun"
            >
              Update
            </button>

            <Link
              to={"/requisitions-details/" + formDataSet.id}
              className="btn btn-danger rounded-circle"
            >
              <i className="fal fa-times"></i>
            </Link>
          </div>
        </div>

        <div className="col-lg-12">
          <div className="personal_data">
            <h6>ITEM'S</h6>
            <div className="Import_booking_item_table">
              <table className="table text-start align-middle table-bordered table-hover mb-0">
                <thead className="bg-dark text-white">
                  <tr className="text-center">
                    <th>Item</th>
                    <th>Stock Inhand</th>
                    <th>Requisition QTY</th>
                    <th>Recommanded QTY</th>
                    <th>Approx. Rate</th>
                    <th>Audit QTY</th>
                    <th>Final QTY</th>
                    {formDataSet.status === "Finalized" && (
                      <>
                        <th>Purchase QTY</th>
                        <th>Final Rate</th>
                        <th>Total</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {requisitionItems.map((item, index) => (
                    <tr key={index}>
                      <td style={{ width: "250px" }}>
                        {item.part_name} | {item.unit}
                      </td>
                      <td>{item.stock_in_hand}</td>
                      <td>{item.qty}</td>
                      <td>
                        <input
                          required
                          disabled={
                            !(
                              userInfo.userId ===
                                formDataSet.recommended_user &&
                              formDataSet.status === "Placed"
                            )
                          }
                          type="number"
                          onWheel={(event) => event.target.blur()}
                          min="0"
                          className="form-control"
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "recommand_qty",
                              e.target.value
                            )
                          }
                          value={item.recommand_qty}
                        />
                      </td>
                      <td>
                        <input
                          required
                          disabled={
                            !(
                              userInfo.department_title === "Purchase" &&
                              userInfo.company_id === formDataSet.company_id &&
                              formDataSet.status === "Recommended"
                            )
                          }
                          type="number"
                          onWheel={(event) => event.target.blur()}
                          min="0"
                          step="0.01"
                          className="form-control"
                          onChange={(e) =>
                            handleItemChange(index, "rate", e.target.value)
                          }
                          value={item.rate}
                        />
                      </td>

                      <td>
                        <input
                          required
                          disabled={
                            !(
                              userInfo.department_title === "Audit" &&
                              userInfo.company_id === formDataSet.company_id &&
                              formDataSet.status === "Valuated"
                            )
                          }
                          type="number"
                          onWheel={(event) => event.target.blur()}
                          min="0"
                          className="form-control"
                          onChange={(e) =>
                            handleItemChange(index, "audit_qty", e.target.value)
                          }
                          value={item.audit_qty}
                        />
                      </td>
                      <td>
                        <input
                          required
                          disabled={
                            !(
                              userInfo.designation_title ===
                                "Factory Incharge" ||
                              userInfo.designation_title == "General Manager"
                            )
                          }
                          type="number"
                          onWheel={(event) => event.target.blur()}
                          min="0"
                          className="form-control"
                          onChange={(e) =>
                            handleItemChange(index, "final_qty", e.target.value)
                          }
                          value={item.final_qty}
                        />
                      </td>

                      {formDataSet.status === "Finalized" && (
                        <>
                          <td>
                            <input
                              required
                              disabled
                              type="number"
                              onWheel={(event) => event.target.blur()}
                              className="form-control"
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "purchase_qty",
                                  e.target.value
                                )
                              }
                              value={item.purchase_qty}
                            />
                          </td>

                          <td>
                            <input
                              required
                              disabled={
                                !(
                                  userInfo.department_title === "Purchase" &&
                                  userInfo.company_id ===
                                    formDataSet.company_id &&
                                  formDataSet.status === "Finalized"
                                )
                              }
                              type="number"
                              onWheel={(event) => event.target.blur()}
                              min="0"
                              step="0.01"
                              className="form-control"
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "final_rate",
                                  e.target.value
                                )
                              }
                              value={item.final_rate}
                            />
                          </td>

                          <td>
                            <input
                              required
                              readOnly
                              type="number"
                              onWheel={(event) => event.target.blur()}
                              min="0"
                              className="form-control"
                              onChange={(e) =>
                                handleItemChange(index, "total", e.target.value)
                              }
                              value={item.total}
                            />
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <br />
            <br />
          </div>
        </div>
      </form>
    </div>
  );
}
