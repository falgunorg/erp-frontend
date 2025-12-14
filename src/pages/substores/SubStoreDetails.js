import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import api from "../../services/api";
import Spinner from "../../elements/Spinner";
import moment from "moment/moment";
import swal from "sweetalert";

export default function SubStoreDetails(props) {
  const userInfo = props.userData;
  const history = useHistory();
  const params = useParams();
  const [spinner, setSpinner] = useState(false);
  const [store, setStore] = useState({});

  const [receives, setReceives] = useState([]);
  const [issues, setIssues] = useState([]);
  const getStore = async () => {
    setSpinner(true);
    var response = await api.post("/substores-show", { id: params.id });
    if (response.status === 200 && response.data) {
      setStore(response.data.data);
      setReceives(response.data.data.receives);
      setIssues(response.data.data.issues);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getStore();
  }, []);

  useEffect(async () => {
    props.setSection("stores");
  }, []);
  const handleUndoIssue = (id) => {
    swal({
      title: "Are you sure?",
      text: "Do you really want to Undo this item?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // Create an async function inside the then block to handle the async operation
        (async () => {
          try {
            var response = await api.post("/substores-issue-undo", {
              id: id,
            });

            if (response.status === 200 && response.data) {
              swal({
                title: "Undo Success",
                text: "Item Undo successfully",
                icon: "success",
              });
              getStore();
            } else {
              swal({
                title: "Undo Failed",
                text: response.data.errors.message,
                icon: "error",
              });
            }
          } catch (error) {
            swal({
              title: "Undo Failed",
              text: "An error occurred while undo the item",
              icon: "error",
            });
          }
        })();
      } else {
        swal("Item is safe!");
      }
    });
  };

  const handleUndoReceive = (id) => {
    swal({
      title: "Are you sure?",
      text: "Do you really want to Undo this item?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // Create an async function inside the then block to handle the async operation
        (async () => {
          try {
            var response = await api.post("/substores-receive-undo", {
              id: id,
            });

            if (response.status === 200 && response.data) {
              swal({
                title: "Undo Success",
                text: "Item Undo successfully",
                icon: "success",
              });
              getStore();
            } else {
              swal({
                title: "Undo Failed",
                text: response.data.errors.message,
                icon: "error",
              });
            }
          } catch (error) {
            swal({
              title: "Undo Failed",
              text: "An error occurred while undo the item",
              icon: "error",
            });
          }
        })();
      } else {
        swal("Item is safe!");
      }
    });
  };

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Sub Store Details</div>
        <div className="actions">
          <Link
            onClick={() => history.goBack()}
            className="btn btn-danger rounded-circle"
          >
            <i className="fal fa-times"></i>
          </Link>
        </div>
      </div>
      <div className="employee_lists">
        <div className="row">
          <div className="col-9">
            <h5>Item Details</h5>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>ITEM</th>
                  <th>RECEIVED</th>
                  <th>ISSUED</th>
                  <th>BALANCE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>{store.part_name}</strong>
                  </td>
                  <td>
                    <strong>
                      {store.total_received} {store.unit}
                    </strong>
                  </td>
                  <td>
                    <strong>
                      {store.total_issued} {store.unit}
                    </strong>
                  </td>
                  <td>
                    <strong>
                      {store.qty} {store.unit}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-6">
            <h5>Received</h5>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>REQ.</th>
                    <th>Item</th>
                    <th>Supplier</th>
                    <th>Challan</th>
                    <th>Gate Pass</th>
                    <th>MRR</th>
                    <th>QTY </th>
                    <th>BY</th>
                    {userInfo.department_title === "IT" ? <th>Action</th> : ""}
                  </tr>
                </thead>
                <tbody>
                  {receives.map((item, index) => (
                    <tr key={index}>
                      <td>{moment(item.created_at).format("ll")}</td>
                      <td>{item.requisition_number}</td>
                      <td>{item.part_name}</td>
                      <td>{item.supplier_name}</td>
                      <td>{item.challan_no}</td>
                      <td>{item.gate_pass}</td>
                      <td>{item.mrr_no}</td>
                      <td>
                        {item.qty} | {item.unit}
                      </td>
                      <td>{item.user}</td>
                      {userInfo.department_title === "IT" ? (
                        <td>
                          <button
                            onClick={() => handleUndoReceive(item.id)}
                            className="btn btn-sm btn-danger"
                          >
                            Undo
                          </button>
                        </td>
                      ) : (
                        ""
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-6">
            <h5>Issued</h5>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>To</th>
                    <th>Line/Sec</th>
                    <th>REF</th>
                    <th>QTY</th>
                    <th>BY</th>
                    {userInfo.department_title === "IT" ? <th>Action</th> : ""}
                  </tr>
                </thead>
                <tbody>
                  {issues.map((item, index) => (
                    <tr key={index}>
                      <td>{moment(item.created_at).format("ll")}</td>
                      <td>{item.issue_type}</td>
                      <td>{item.issue_to_show}</td>
                      <td>{item.line}</td>
                      <td>{item.reference}</td>
                      <td>{item.qty}</td>
                      <td>{item.user}</td>
                      {userInfo.department_title === "IT" ? (
                        <td>
                          <button
                            onClick={() => handleUndoIssue(item.id)}
                            className="btn btn-sm btn-danger"
                          >
                            Undo
                          </button>
                        </td>
                      ) : (
                        ""
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
    </div>
  );
}
