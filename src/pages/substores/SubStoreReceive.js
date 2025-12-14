import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Spinner from "../../elements/Spinner";
import Select from "react-select";
import api from "services/api";
import SubstoreReceiveCanvas from "../../elements/modals/SubstoreReceiveCanvas";

export default function SubStoreReceive(props) {
  const history = useHistory();
  const userInfo = props.userData;
  const params = useParams();
  const [spinner, setSpinner] = useState(false);
  const [requisitions, setRequisitions] = useState([]);
  const [formData, setFormData] = useState({
    requisition_id: params.requisition_id
      ? parseInt(params.requisition_id, 10)
      : null,
  });
  console.log("REQUISITION", formData);
  const [requisitionItems, setRequisitionItems] = useState([]);

  const getRequisitions = async () => {
    setSpinner(true);
    try {
      const response = await api.post("/requisitions-for-receive");
      if (response.status === 200 && response.data) {
        setRequisitions(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching requisitions:", error);
    } finally {
      setSpinner(false);
    }
  };

  const getRequisition = async () => {
    if (!formData.requisition_id) {
      setRequisitionItems([]);
      return;
    }

    setSpinner(true);
    try {
      const response = await api.post("/requisitions-show", {
        id: formData.requisition_id,
      });
      if (response.status === 200 && response.data) {
        setRequisitionItems(response.data.data.requisition_items);
      } else {
        setRequisitionItems([]);
      }
    } catch (error) {
      console.error("Error fetching requisition:", error);
    } finally {
      setSpinner(false);
    }
  };

  const requisitionChange = (selectedOption) => {
    setFormData({
      ...formData,
      requisition_id: selectedOption ? selectedOption.value : null,
    });
  };

  useEffect(() => {
    getRequisitions();
  }, []);

  useEffect(() => {
    getRequisition();
  }, [formData.requisition_id]);

  useEffect(() => {
    getRequisition();
  }, [props.callRequisition]);

  useEffect(() => {
    if (params.requisition_id) {
      setFormData({
        ...formData,
        requisition_id: parseInt(params.requisition_id, 10),
      });
    }
  }, [params.requisition_id]);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Receive Items</div>
        <div className="actions">
          <Link to="/sub-stores" className="btn btn-danger rounded-circle">
            <i className="fal fa-times"></i>
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6">
          <div className="form-group">
            <label>Requisition No:</label>
            <Select
              placeholder="Select Or Search"
              onChange={requisitionChange}
              value={
                formData.requisition_id &&
                requisitions.find((item) => item.id === formData.requisition_id)
                  ? {
                      value: formData.requisition_id,
                      label: requisitions.find(
                        (item) => item.id === formData.requisition_id
                      ).requisition_number,
                    }
                  : null
              }
              name="requisition_id"
              options={requisitions.map((item) => ({
                value: item.id,
                label: item.requisition_number,
              }))}
            />
          </div>
        </div>
      </div>
      <br />
      <br />
      <div className="row">
        <h6>Requisitions Item's</h6>
        <div className="Import_requisition_item_table">
          <table className="table text-start align-middle table-bordered table-hover mb-0">
            <thead className="bg-dark text-white">
              <tr>
                <th>SL</th>
                <th>Item</th>
                <th>Unit</th>
                <th>Final Qty</th>
                <th>Received QTY</th>
                <th>Left Received QTY</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requisitionItems.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.part_name}</td>
                  <td>{item.unit}</td>
                  <td>{item.final_qty}</td>
                  <td>{item.received_qty}</td>
                  <td>{item.left_received_qty}</td>
                  <td>
                    {item.left_received_qty > 0 && (
                      <button
                        onClick={() => {
                          props.setSubstoreReceiveCanvas(true);
                          props.setRequisitionItemId(item.id);
                        }}
                        className="btn btn-sm btn-success"
                      >
                        Receive
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <SubstoreReceiveCanvas {...props} />
          <br />
          <br />
        </div>
      </div>
    </div>
  );
}
