import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import swal from "sweetalert";
import Select from "react-select";
import { Modal, Button } from "react-bootstrap";
export default function CreatePartRequest(props) {
  const history = useHistory();
  const [spinner, setSpinner] = useState(false);
  const userInfo = props.userData;
  // item showing and adding
  const [substores, setSubstores] = useState([]);
  const getSubstores = async () => {
    setSpinner(true);
    var response = await api.post("/substore/substores");
    if (response.status === 200 && response.data) {
      setSubstores(response.data.company_wise);
    }
    setSpinner(false);
  };

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

  const [errors, setErrors] = useState({});
  const [requisitionItems, setRequisitionItems] = useState([]);
  const removeRow = (index) => {
    const updatedItems = [...requisitionItems];
    updatedItems.splice(index, 1);
    setRequisitionItems(updatedItems);
  };
  const addRow = () => {
    const newItem = {
      substore_id: "",
      unit: "",
      stock_qty: "",
      qty: "",
      remarks: "",
      image_source: "",
    };

    setRequisitionItems([...requisitionItems, newItem]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...requisitionItems];

    if (field === "substore_id") {
      const selectedItem = substores.find(
        (substore) => substore.id === parseInt(value)
      );
      if (selectedItem) {
        updatedItems[index].substore_id = parseInt(value);
        updatedItems[index].unit = selectedItem.unit;
        updatedItems[index].stock_qty = parseInt(selectedItem.qty);
        updatedItems[index].qty = "";
        updatedItems[index].image_source = selectedItem.image_source;
      } else {
        updatedItems[index].item_id = "";
        updatedItems[index].unit = "";
        updatedItems[index].stock_qty = "";
        updatedItems[index].qty = "";
        updatedItems[index].image_source = "";
      }
    }

    if (field === "qty") {
      if (parseInt(value) > parseInt(updatedItems[index].stock_qty)) {
        return;
      } else {
        updatedItems[index].qty = value;
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

    if (requisitionItems.length === 0) {
      swal({
        title:
          "There are no Items's in this Requisition, click on Add Item and fill the data",
        icon: "error",
      });
      return; // Prevent form submission
    }
    var data = new FormData();
    data.append("line", userInfo.department_title);
    data.append("request_items", JSON.stringify(requisitionItems));
    setSpinner(true);
    var response = await api.post("/substore/part-requests-create", data);
    if (response.status === 200 && response.data) {
      history.push("/part-requests");
    } else {
      setErrors(response.data.errors);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getSubstores();
  }, []);

  useEffect(() => {
    const validateDuplicatePiItem = () => {
      const itemMap = new Map();
      let isDuplicate = false;
      requisitionItems.forEach((item, index) => {
        const { substore_id } = item;
        const key = `${substore_id}`;

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
          <div className="page_name">Create Store Requisition</div>
          <div className="actions">
            <button
              type="supmit"
              className="publish_btn btn btn-warning bg-falgun"
            >
              Submit
            </button>
            <Link to="/part-requests" className="btn btn-danger rounded-circle">
              <i className="fal fa-times"></i>
            </Link>
          </div>
        </div>

        <div className="col-lg-12">
          <div className="personal_data">
            <br />
            <h6 className="text-center">
              <u>REQUISITION ITEMS</u>
            </h6>
            <br />
            <div className="Import_booking_item_table">
              <table className="table text-start align-middle table-bordered table-hover mb-0">
                <thead className="bg-dark text-white">
                  <tr className="text-center">
                    <th>Item</th>
                    <th>Thumb</th>
                    <th>Unit</th>
                    <th style={{ width: "150px" }}>Stock QTY</th>
                    <th style={{ width: "150px" }}>QTY</th>
                    <th style={{ width: "250px" }}>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {requisitionItems.map((item, index) => (
                    <tr key={index}>
                      <td style={{ minWidth: "300px" }}>
                        <Select
                          required
                          placeholder="Select"
                          onChange={(selectedOption) =>
                            handleItemChange(
                              index,
                              "substore_id",
                              selectedOption.value
                            )
                          }
                          value={
                            substores.find(
                              (substore) => substore.id === item.substore_id
                            )
                              ? {
                                  value: item.substore_id,
                                  label:
                                    substores.find(
                                      (substore) =>
                                        substore.id === item.substore_id
                                    ).part_name || "",
                                }
                              : null
                          }
                          options={substores.map((substore) => ({
                            value: substore.id,
                            label: substore.part_name,
                          }))}
                        />
                      </td>
                      <td>
                        <img
                          onClick={() => openImageModal(item.image_source)}
                          style={{
                            height: "50px",
                            width: "50px",
                            border: "1px solid gray",
                            borderRadius: "3px",
                            cursor: "pointer",
                          }}
                          src={item.image_source}
                        />
                      </td>

                      <td className="text-center">{item.unit}</td>

                      <td style={{ width: "150px" }}>
                        <input
                          required
                          readOnly
                          type="number"
                          onWheel={(event) => event.target.blur()}
                          min="0"
                          className="form-control"
                          onChange={(e) =>
                            handleItemChange(index, "stock_qty", e.target.value)
                          }
                          value={item.stock_qty}
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
                          <Link to="#">
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
                    <td className="border_none" colSpan={5}></td>
                    <td className="border_none">
                      <div className="add_row text-end">
                        <Link to="#" className="btn btn-info btn-sm" onClick={addRow}>
                          Add Item
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
      <Modal show={imageModal} onHide={closeImageModal}>
        <Modal.Header closeButton>
          <Modal.Title>Item Image</Modal.Title>
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
    </div>
  );
}
