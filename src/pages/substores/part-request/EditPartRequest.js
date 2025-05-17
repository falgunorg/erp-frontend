import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import swal from "sweetalert";
import Select from "react-select";
export default function EditPartRequest(props) {
  const history = useHistory();
  const params = useParams();
  const [spinner, setSpinner] = useState(false);
  const userInfo = props.userData;

  // item showing and adding
  const [substores, setSubstores] = useState([]);
  const getSubstores = async () => {
    setSpinner(true);
    var response = await api.post("/substores");
    if (response.status === 200 && response.data) {
      setSubstores(response.data.self_store);
    }
    setSpinner(false);
  };

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    substore_id: "",
    unit: "",
    stock_qty: "",
    qty: "",
    remarks: "",
  });

  const handleChange = (field, value) => {
    if (field === "substore_id") {
      const selectedItem = substores.find(
        (substore) => substore.id === parseInt(value)
      );
      if (selectedItem) {
        formData.substore_id = parseInt(value);
        formData.unit = selectedItem.unit;
        formData.stock_qty = parseInt(selectedItem.qty);
        formData.qty = "";
      } else {
        formData.item_id = "";
        formData.unit = "";
        formData.stock_qty = "";
        formData.qty = "";
      }
    }

    if (field === "qty") {
      if (parseInt(value) > parseInt(formData.stock_qty)) {
        return;
      } else {
        formData.qty = value;
      }
    }

    setFormData({ ...formData, [field]: value });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.substore_id) {
      formErrors.substore_id = "Please Select Part";
    }
    if (!formData.qty) {
      formErrors.qty = "Enter QTY";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      var response = await api.post("/part-requests-update", formData);
      if (response.status === 200 && response.data) {
        setErrors({});
        history.push("/part-requests");
      } else {
        setErrors(response.data.errors);
      }
    }
  };

  const getRequest = async () => {
    setSpinner(true);
    var response = await api.post("/part-requests-show", { id: params.id });
    if (response.status === 200 && response.data) {
      setFormData(response.data.data);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getSubstores();
    getRequest();
  }, []);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <form onSubmit={handleSubmit}>
        <div className="create_page_heading">
          <div className="page_name">Edit Store Requisition</div>
          <div className="actions">
            <button
              type="supmit"
              className="publish_btn btn btn-warning bg-falgun"
            >
              Update
            </button>
            <Link to="/part-requests" className="btn btn-danger rounded-circle">
              <i className="fal fa-times"></i>
            </Link>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-5">
            <div className="form-group">
              <label>Item</label>
              <Select
                placeholder="Select"
                onChange={(selectedOption) =>
                  handleChange("substore_id", selectedOption.value)
                }
                value={
                  substores.find((item) => item.id === formData.substore_id)
                    ? {
                        value: formData.substore_id,
                        label:
                          substores.find(
                            (item) => item.id === formData.substore_id
                          ).part_name || "",
                      }
                    : null
                }
                name="substore_id"
                options={substores.map((item) => ({
                  value: item.id,
                  label: item.part_name,
                }))}
              />
              {errors.substore_id && (
                <small className="text-danger">{errors.substore_id}</small>
              )}
            </div>
          </div>

          <div className="col-lg-2">
            <div className="form-group">
              <label>Stock QTY</label>
              <input
                readOnly
                type="number"
                onWheel={(event) => event.target.blur()}
                name="stock_qty"
                onChange={(event) =>
                  handleChange("stock_qty", event.target.value)
                }
                value={formData.stock_qty}
                className="form-control"
              />
              {errors.stock_qty && (
                <small className="text-danger">{errors.stock_qty}</small>
              )}
            </div>
          </div>

          <div className="col-lg-2">
            <div className="form-group">
              <label>Requisition QTY</label>
              <input
                type="number"
                onWheel={(event) => event.target.blur()}
                name="qty"
                onChange={(event) => handleChange("qty", event.target.value)}
                value={formData.qty}
                className="form-control"
              />
              {errors.qty && (
                <small className="text-danger">{errors.qty}</small>
              )}
            </div>
          </div>
          <div className="col-lg-3">
            <div className="form-group">
              <label>Remarks</label>
              <input
                type="text"
                name="remarks"
                onChange={(event) =>
                  handleChange("remarks", event.target.value)
                }
                value={formData.remarks}
                className="form-control"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
