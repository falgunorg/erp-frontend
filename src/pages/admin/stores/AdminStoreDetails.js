import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import api from "../../../services/api";
import Spinner from "../../../elements/Spinner";
import moment from "moment/moment";
import swal from "sweetalert";

export default function AdminStoreDetails(props) {
  const history = useHistory();
  const params = useParams();
  const [spinner, setSpinner] = useState(false);
  const [store, setStore] = useState({});

  const [receives, setReceives] = useState([]);
  const [issues, setIssues] = useState([]);

  const getStore = async () => {
    setSpinner(true);
    var response = await api.post("/stores-show", { id: params.id });
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

  useEffect(() => {
    const checkAccess = async () => {
      if (props.userData?.role !== "Admin") {
        await swal({
          icon: "error",
          text: "You Cannot Access This Section.",
          closeOnClickOutside: false,
        });

        history.push("/dashboard");
      }
    };
    checkAccess();
  }, [props, history]);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Store Details</div>
        <div className="actions">
          <Link to="/admin/stores" className="btn btn-danger rounded-circle">
            <i className="fal fa-times"></i>
          </Link>
        </div>
      </div>
      <div className="employee_lists">
        <div className="row">
          <div className="col-3">
            <img style={{ width: "100%" }} src={store.image_source} />
          </div>
          <div className="col-9">
            <h5>Item Details</h5>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>S.N.</th>
                  <th>B. N</th>
                  <th>RECEIVED</th>
                  <th>ISSUED</th>
                  <th>BALANCE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{store.store_number}</td>
                  <td>{store.booking_number}</td>
                  <td>
                    {store.total_received} {store.unit}
                  </td>
                  <td>
                    {store.total_issued} {store.unit}
                  </td>
                  <td>
                    {store.qty} {store.unit}
                  </td>
                </tr>
              </tbody>
              <thead>
                <tr>
                  <th>ITEM</th>
                  <th>BUYER</th>
                  <th>STYLE</th>
                  <th colSpan={2}>SUPPLIER</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{store.item_name}</td>
                  <td>{store.buyer}</td>
                  <td>{store.techpack}</td>
                  <td colSpan={2}>{store.supplier}</td>
                </tr>
              </tbody>

              <thead>
                <tr>
                  <th colSpan={2}>DETAILS</th>
                  <th colSpan={2}>REMARKS</th>
                  <th>BOOKED BY</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={2}>{store.description}</td>
                  <td colSpan={2}>{store.remarks}</td>
                  <td>{store.booked_by}</td>
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
                    <th>MRR</th>
                    <th>Challan</th>
                    <th>QTY</th>
                    <th>Received By</th>
                  </tr>
                </thead>
                <tbody>
                  {receives.map((item, index) => (
                    <tr key={index}>
                      <td>{moment(item.created_at).format("ll")}</td>
                      <td>{item.mrr_number}</td>
                      <td>
                        <a target="_blank" href={item.challan_file} download>
                          {item.challan_no}
                        </a>
                      </td>
                      <td>{item.qty}</td>
                      <td>{item.received_by}</td>
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
                    <th>DCN</th>
                    <th>Reference</th>
                    <th>QTY</th>
                    <th>Issue By</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((item, index) => (
                    <tr key={index}>
                      <td>{moment(item.created_at).format("ll")}</td>
                      <td>{item.issue_type}</td>

                      <td>
                        <a target="_blank" href={item.challan_file} download>
                          {item.delivery_challan}
                        </a>
                      </td>
                      <td>{item.reference}</td>
                      <td>{item.qty}</td>
                      <td>{item.issue_by}</td>
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
