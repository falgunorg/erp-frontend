import React, { useState, useEffect, Fragment } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import moment from "moment/moment";
import swal from "sweetalert";

export default function RequisitionDetails(props) {
  const userInfo = props.userData;
  const history = useHistory();

  const handleGoBack = () => {
    history.goBack();
  };

  const [spinner, setSpinner] = useState(false);
  const params = useParams();

  const PrintPdf = () => {
    window.print();
  };

  const PrintForSupplier = () => {
    const columnsToHide = document.querySelectorAll(".hide-for-supplier");

    // Hide columns
    columnsToHide.forEach((column) => {
      column.style.display = "none";
    });

    window.print();

    // Show columns again
    columnsToHide.forEach((column) => {
      column.style.display = "";
    });
  };

  const [requisition, setRequisition] = useState({});
  const [requisitionItems, setRequisitionItems] = useState([]);
  const getRequisition = async () => {
    setSpinner(true);
    var response = await api.post("/substore/requisitions-show", { id: params.id });
    if (response.status === 200 && response.data) {
      setRequisition(response.data.data);
      setRequisitionItems(response.data.data.requisition_items);
    }
    setSpinner(false);
  };

  const toggleStatus = async (status) => {
    setSpinner(true);
    var response = await api.post("/substore/requisitions-toggle-status", {
      id: requisition.id,
      status: status,
    });
    if (response.status === 200 && response.data) {
      swal({
        title: "Status Updated Success!",
        icon: "success",
      });
      getRequisition();
    }
    history.goBack();
    setSpinner(false);
  };
  useEffect(async () => {
    getRequisition();
  }, []);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Requisition Details</div>
        <div className="actions">
          <Link to="#" onClick={PrintPdf} className="btn btn-info btn-sm">
            <i className="fas fa-print"></i>
          </Link>

          {requisition.status === "Finalized" && (
            <button onClick={PrintForSupplier} className="btn btn-info btn-sm">
              Print For Supplier
            </button>
          )}

          {userInfo.userId === requisition.user_id &&
          (requisition.status === "Pending" ||
            requisition.status === "Rejected") ? (
            <Fragment>
              <Link
                to={"/requisitions-edit/" + requisition.id}
                className="btn btn-warning"
              >
                <i className="fal fa-pen"></i>
              </Link>
              <button
                onClick={() => toggleStatus("Placed")}
                className="btn btn-success"
              >
                Place
              </button>
            </Fragment>
          ) : null}

          {requisition.status === "Placed" &&
          userInfo.userId === requisition.recommended_user ? (
            <Fragment>
              <button
                onClick={() => toggleStatus("Recommended")}
                className="btn btn-success"
              >
                Recommend
              </button>
              <Link
                to={"/requisitions-revise/" + requisition.id}
                className="btn btn-warning"
              >
                Revise
              </Link>
              <button
                onClick={() => toggleStatus("Rejected")}
                className="btn btn-danger"
              >
                Reject
              </button>
            </Fragment>
          ) : null}

          {requisition.status === "Recommended" &&
          userInfo.department_title === "Purchase" &&
          requisition.company_id === userInfo.company_id ? (
            <Fragment>
              <button
                onClick={() => toggleStatus("Valuated")}
                className="btn btn-success"
              >
                Mark As Valuated
              </button>
              <Link
                to={"/requisitions-revise/" + requisition.id}
                className="btn btn-warning"
              >
                Add Approx Rate
              </Link>
            </Fragment>
          ) : null}

          {requisition.status === "Finalized" &&
          userInfo.department_title === "Purchase" &&
          requisition.company_id === userInfo.company_id ? (
            <Fragment>
              <Link
                to={"/requisitions-revise/" + requisition.id}
                className="btn btn-warning"
              >
                Add Purchase QTY & Rate
              </Link>
            </Fragment>
          ) : null}

          {requisition.status === "Valuated" &&
          userInfo.department_title === "Audit" &&
          requisition.company_id === userInfo.company_id ? (
            <Fragment>
              <button
                onClick={() => toggleStatus("Checked")}
                className="btn btn-success"
              >
                Checked
              </button>
              <Link
                to={"/requisitions-revise/" + requisition.id}
                className="btn btn-warning"
              >
                Revise
              </Link>
              <button
                onClick={() => toggleStatus("Rejected")}
                className="btn btn-danger"
              >
                Reject
              </button>
            </Fragment>
          ) : null}

          {requisition.status === "Checked" &&
          requisition.company_id === userInfo.company_id ? (
            <Fragment>
              {userInfo.designation_title === "Factory Incharge" ||
              userInfo.designation_title === "General Manager" ? (
                <>
                  <button
                    onClick={() => toggleStatus("Finalized")}
                    className="btn btn-success"
                  >
                    Finalized
                  </button>
                  <Link
                    to={"/requisitions-revise/" + requisition.id}
                    className="btn btn-warning"
                  >
                    Revise
                  </Link>
                  <button
                    onClick={() => toggleStatus("Rejected")}
                    className="btn btn-danger"
                  >
                    Reject
                  </button>
                </>
              ) : (
                ""
              )}
            </Fragment>
          ) : null}

          <button onClick={handleGoBack} className="btn btn-danger">
            <i className="fal fa-times"></i>
          </button>
        </div>
      </div>

      <h4 className="text-center text-uppercase">
        {requisition.status === "Pending" && (
          <div className="bg-warning zoomable">Need to Place</div>
        )}
        {requisition.status === "Placed" && (
          <div className="bg-warning zoomable">Waiting For Recommendation</div>
        )}
        {requisition.status === "Recommended" && (
          <div className="bg-warning zoomable">
            Waiting For Purchase Valuation
          </div>
        )}

        {requisition.status === "Valuated" && (
          <div className="bg-warning zoomable">Waiting For Audit Checking</div>
        )}

        {requisition.status === "Checked" && (
          <div className="bg-warning zoomable">Waiting For Final Approval</div>
        )}
        {requisition.status === "Finalized" && (
          <div className="bg-success text-white">Ready to Buy</div>
        )}
      </h4>

      <div className="preview_print page" id="pdf_container">
        <div className="container border ">
          <br />
          <h4 className="text-center">FALGUN GROUP</h4>
          <h6 className="text-center text-underline">
            <u className="bg-warning">REQUISITION</u>
          </h6>
          <br />
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>SL</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{requisition.requisition_number}</td>
                <td>{moment(requisition.created_at).format("lll")}</td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th>DEPRTMENT</th>
                <th>COMPANY</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{requisition.department_title}</td>
                <td>{requisition.company}</td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th>BY</th>
                <th>BILLING ACC/UNIT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{requisition.requisition_by}</td>
                <td>{requisition.billing_company}</td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th colSpan="2">{requisition.label}</th>
              </tr>
            </thead>
          </table>

          <br />
          <h6 className="text-center">ITEM'S</h6>

          <div className="Import_booking_item_table">
            <div className="table-responsive">
              <table className="table text-start align-middle table-bordered table-hover mb-0">
                <thead className="bg-dark text-white">
                  <tr>
                    <th>SL</th>
                    <th>Item</th>
                    <th>Unit</th>
                    <th className="hide-for-supplier">Inhand QTY</th>
                    <th className="hide-for-supplier">Req QTY</th>
                    <th className="hide-for-supplier">Recommended QTY</th>
                    <th className="hide-for-supplier">Audited QTY</th>
                    <th>Final QTY</th>
                    <th className="hide-for-supplier">Purchase QTY</th>
                    <th className="hide-for-supplier">Aprox. Rate</th>
                    <th className="hide-for-supplier">Final Rate</th>
                    <th className="hide-for-supplier">Total</th>
                    <th>Remarks</th>
                  </tr>
                </thead>

                <tbody>
                  {requisitionItems.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.part_name}</td>
                      <td>{item.unit}</td>
                      <td className="hide-for-supplier">
                        {item.stock_in_hand}
                      </td>
                      <td className="hide-for-supplier">{item.qty}</td>
                      <td className="hide-for-supplier">
                        {requisition.recommended_by > 0
                          ? item.recommand_qty
                          : ""}
                      </td>
                      <td className="hide-for-supplier">
                        {requisition.checked_by > 0 ? item.audit_qty : ""}
                      </td>
                      <td>
                        {requisition.finalized_by > 0 ? item.final_qty : ""}
                      </td>
                      <td className="hide-for-supplier">{item.purchase_qty}</td>
                      <td className="hide-for-supplier">{item.rate}</td>
                      <td className="hide-for-supplier">{item.final_rate}</td>
                      <td className="hide-for-supplier">{item.total}</td>
                      <td>{item.remarks}</td>
                    </tr>
                  ))}
                </tbody>

                <tr className="hide-for-supplier">
                  <td colSpan={11} className="text-center">
                    <h6>
                      <strong>TOTAL</strong>
                    </h6>
                  </td>
                  <td>
                    <strong>{requisition.total_amount}</strong>
                  </td>
                  <td></td>
                </tr>
              </table>
            </div>
            <br />
          </div>

          <div className="signature_block">
            {requisition.placed_by > 0 && (
              <div className="item">
                <img
                  className="signature"
                  src={requisition.placed_by_sign}
                  defalt
                />
                <div className="sign_time">
                  {moment(requisition.placed_at).format("lll")}
                </div>
                <h6>Placed</h6>
              </div>
            )}

            {requisition.rejected_by > 0 && (
              <div className="item">
                <img className="signature" src={requisition.rejected_by_sign} />
                <div className="sign_time">
                  {moment(requisition.rejected_at).format("lll")}
                </div>
                <h6 className="text-danger">Rejected</h6>
              </div>
            )}
            {requisition.recommended_by > 0 && (
              <div className="item">
                <img
                  className="signature"
                  src={requisition.recommended_by_sign}
                />
                <div className="sign_time">
                  {moment(requisition.recommended_at).format("lll")}
                </div>
                <h6>Recommended</h6>
              </div>
            )}
            {requisition.valuated_by > 0 && (
              <div className="item">
                <img className="signature" src={requisition.valuated_by_sign} />
                <div className="sign_time">
                  {moment(requisition.valuated_at).format("lll")}
                </div>
                <h6>Valuated</h6>
              </div>
            )}

            {requisition.checked_by > 0 && (
              <div className="item">
                <img className="signature" src={requisition.checked_by_sign} />
                <div className="sign_time">
                  {moment(requisition.checked_at).format("lll")}
                </div>
                <h6 className="text-success">Checked</h6>
              </div>
            )}

            {requisition.approved_by > 0 && (
              <div className="item">
                <img className="signature" src={requisition.approved_by_sign} />
                <div className="sign_time">
                  {moment(requisition.approved_at).format("lll")}
                </div>
                <h6>Approved</h6>
              </div>
            )}

            {requisition.finalized_by > 0 && (
              <div className="item">
                <img
                  className="signature"
                  src={requisition.finalized_by_sign}
                />
                <div className="sign_time">
                  {moment(requisition.finalized_at).format("lll")}
                </div>
                <h6>Finalized</h6>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
