import React, { useState, Fragment, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import moment from "moment/moment";
import swal from "sweetalert";

export default function BudgetDetails(props) {
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  const userInfo = props.userData;
  const [spinner, setSpinner] = useState(false);
  const params = useParams();
  const generatePdf = () => {
    const input = document.getElementById("pdf_container");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("budget.pdf");
    });
  };

  const PrintPdf = () => {
    window.print();
  };

  const [budget, setBudget] = useState({});
  const [budgetItems, setBudgetItems] = useState([]);

  const getBudget = async () => {
    setSpinner(true);
    var response = await api.post("/budgets-show", { id: params.id });
    if (response.status === 200 && response.data) {
      setBudget(response.data.data);
      setBudgetItems(response.data.data.budget_items);
    }
    setSpinner(false);
  };

  const toggleStatus = async (status) => {
    setSpinner(true);
    var response = await api.post("/budgets-toggle-status", {
      id: budget.id,
      status: status,
    });

    if (response.status === 200 && response.data) {
      swal({
        title: "Status Updated Success!",
        icon: "success",
      });
      getBudget();
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getBudget();
  }, []);
  useEffect(async () => {
    props.setSection("merchandising");
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      const allowedDepartments = [
        "Merchandising",
        "Audit",
        "Accounts & Finance",
        "Management",
        "Planing",
      ];
      if (!allowedDepartments.includes(props.userData?.department_title)) {
        await swal({
          icon: "error",
          text: "You Cannot Access This Section.",
          closeOnClickOutside: false,
        });
        history.push("/dashboard");
      }
    };
    checkAccess();
  }, [props.userData?.department_title, history]);

  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Budget Details</div>
        <div className="actions">
          <Link to="#" onClick={PrintPdf} className="btn btn-info btn-sm">
            <i className="fas fa-print"></i>
          </Link>
          <Link to="#" onClick={generatePdf} className="btn btn-warning bg-falgun ">
            <i className="fas fa-download"></i>
          </Link>

          {props.userData.userId === budget.user_id &&
          (budget.status === "Pending" || budget.status === "Rejected") ? (
            <Fragment>
              <Link
                to={"/merchandising/budgets-edit/" + budget.id}
                className="btn btn-warning"
              >
                <i className="fal fa-pen"></i>
              </Link>
              <button
                onClick={() => toggleStatus("Placed")}
                className="btn btn-success"
              >
                Submit to Team Leader
              </button>
            </Fragment>
          ) : null}

          {userInfo.department_title === "Merchandising" &&
          userInfo.designation_title === "Assistant Manager" &&
          budget.status === "Placed" ? (
            <Fragment>
              <button
                onClick={() => toggleStatus("Confirmed")}
                className="btn btn-success"
              >
                Confirmed
              </button>
              <button
                onClick={() => toggleStatus("Rejected")}
                className="btn btn-danger"
              >
                Reject
              </button>
            </Fragment>
          ) : null}

          {userInfo.department_title === "Merchandising" &&
          userInfo.designation_title === "Deputy General Manager" &&
          budget.status === "Confirmed" ? (
            <Fragment>
              <button
                onClick={() => toggleStatus("Submitted")}
                className="btn btn-success"
              >
                Submit To Audit
              </button>
              <button
                onClick={() => toggleStatus("Rejected")}
                className="btn btn-danger"
              >
                Reject
              </button>
            </Fragment>
          ) : null}

          {userInfo.department_title === "Audit" &&
          userInfo.designation_title === "Manager" &&
          budget.status === "Submitted" ? (
            <Fragment>
              <button
                onClick={() => toggleStatus("Checked")}
                className="btn btn-success"
              >
                Checked
              </button>
              <button
                onClick={() => toggleStatus("Rejected")}
                className="btn btn-danger"
              >
                Reject
              </button>
            </Fragment>
          ) : null}

          {userInfo.department_title === "Accounts & Finance" &&
          userInfo.designation_title === "Manager" &&
          budget.status === "Checked" ? (
            <Fragment>
              <button
                onClick={() => toggleStatus("Cost-Approved")}
                className="btn btn-success"
              >
                Cost-Approved
              </button>
              <button
                onClick={() => toggleStatus("Rejected")}
                className="btn btn-danger"
              >
                Reject
              </button>
            </Fragment>
          ) : null}

          {userInfo.department_title === "Accounts & Finance" &&
          userInfo.designation_title === "General Manager" &&
          budget.status === "Cost-Approved" ? (
            <Fragment>
              <button
                onClick={() => toggleStatus("Finalized")}
                className="btn btn-success"
              >
                Finalized
              </button>
              <button
                onClick={() => toggleStatus("Rejected")}
                className="btn btn-danger"
              >
                Reject
              </button>
            </Fragment>
          ) : null}

          {userInfo.department_title === "Management" &&
          userInfo.designation_title === "Managing Director" &&
          budget.status === "Finalized" ? (
            <Fragment>
              <button
                onClick={() => toggleStatus("Approved")}
                className="btn btn-success"
              >
                Approve
              </button>
              <button
                onClick={() => toggleStatus("Rejected")}
                className="btn btn-danger"
              >
                Reject
              </button>
            </Fragment>
          ) : null}

          <Link to="#" onClick={goBack} className="btn btn-danger">
            <i className="fal fa-times"></i>
          </Link>
        </div>
      </div>

      <div className="preview_print page" id="pdf_container">
        <div className="container border ">
          <br />
          <h6 className="text-center text-underline">
            <u>BUDGET FILE</u>
          </h6>

          <br />
          <div className="row">
            <div className="col-lg-8">
              <table className="table text-start align-middle table-bordered table-hover mb-0 ">
                <tbody>
                  <tr>
                    <td>
                      <strong>PO </strong>
                    </td>
                    <td>
                      <strong>BUYER</strong>
                    </td>
                    <td>
                      <strong>SEASON</strong>
                    </td>
                    <td>
                      <strong>BRAND</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>{budget.po_number}</td>
                    <td>{budget.buyer}</td>
                    <td>{budget.season}</td>
                    <td>{budget.brand}</td>
                  </tr>

                  <tr>
                    <td>
                      <strong>PC/MASTER</strong>
                    </td>
                    <td>
                      <strong>QTY</strong>
                    </td>
                    <td>
                      <strong>ORDER VALUE</strong>
                    </td>
                    <td>
                      <strong>USED</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>{budget.contract_number}</td>
                    <td>{budget.qty}</td>
                    <td>
                      {budget.total_order_value} {budget.currency}
                    </td>
                    <td>
                      {budget.order_total_cost} ({budget.total_budget_used}%)
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <strong>ISSUED DATE</strong>
                    </td>

                    <td>
                      <strong>ISSUED BY</strong>
                    </td>
                    <td>
                      <strong>PRODUCTION UNIT</strong>
                    </td>
                    <td>
                      <strong>STANDING CM</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {" "}
                      {budget.issued_date
                        ? moment(budget.issued_date).format("ll")
                        : ""}
                    </td>
                    <td>{budget.user}</td>
                    <td>{budget.company}</td>
                    <td>
                      {budget.balance} {budget.currency}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <strong>SIZE RANGE</strong>
                    </td>
                    <td colSpan={2}>
                      <strong>COLORS</strong>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      {budget.sizesList &&
                        budget.sizesList.map((item) => (
                          <span style={{ paddingRight: "5px" }} key={item.id}>
                            {item.title}
                            {","}
                          </span>
                        ))}
                    </td>
                    <td colSpan={2}>
                      {budget.colorsList &&
                        budget.colorsList.map((item) => (
                          <span style={{ paddingRight: "5px" }} key={item.id}>
                            {item.title}
                            {","}
                          </span>
                        ))}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <strong>STYLE/TECHPACK</strong>
                    </td>
                    <td>
                      <strong>RATIO</strong>
                    </td>
                    <td>
                      <strong>STATUS</strong>
                    </td>
                    <td>
                      <strong>SL</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>{budget.techpack}</td>
                    <td>{budget.ratio}</td>
                    <td>{budget.status}</td>
                    <td>{budget.budget_number}</td>
                  </tr>

                  <tr>
                    <td colSpan={2}>
                      <strong>PRODUCT DESCRIPTION</strong>
                    </td>
                    <td colSpan={2}>
                      <strong>NOTE</strong>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <pre>{budget.product_description}</pre>
                    </td>
                    <td colSpan={2}>
                      <pre>{budget.note}</pre>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-lg-4">
              <img
                style={{
                  height: "250px",
                  width: "100%",
                  border: "1px solid gray",
                }}
                src={budget.file_source}
              />
            </div>
          </div>
          <br />
          <h6 className="text-center text-underline">
            <u>USED ITEM'S</u>
          </h6>
          <div className="Import_booking_item_table">
            <table className="table text-start align-middle table-bordered table-hover mb-0">
              <thead className="bg-dark text-white">
                <tr>
                  <th>SL</th>
                  <th>Item</th>
                  <th>Item Details</th>
                  <th>Supplier</th>
                  <th>Cuttable Width</th>
                  <th>Actual Cons</th>
                  <th>Wastage %</th>
                  <th>Unit Cons</th>
                  <th>Unit</th>
                  <th>Unit Price/Unit</th>
                  <th>Total Req. Qty</th>
                  <th>Unit Total Cost</th>
                  <th>Used Budget(%)</th>
                  <th>Order Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {budgetItems.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.item_name}</td>
                    <td>
                      <pre>{item.description}</pre>
                    </td>
                    <td>{item.supplier}</td>
                    <td>{item.cuttable_width}</td>
                    <td>{item.actual}</td>
                    <td>{item.wastage_parcentage}%</td>
                    <td>{item.cons_total}</td>
                    <td>{item.unit}</td>
                    <td>{item.unit_price}</td>
                    <td>{item.total_req_qty}</td>
                    <td>{item.unit_total_cost}</td>
                    <td>{item.used_budget}</td>
                    <td>{item.order_total_cost}</td>
                  </tr>
                ))}
                <tr className="">
                  <td colSpan={10}>
                    <h6>Items Summary</h6>
                  </td>
                  <td>
                    <h6>{budget.currency}</h6>
                  </td>
                  <td>
                    <h6>{budget.total_unit_cost}</h6>
                  </td>
                  <td>
                    <h6>{budget.total_budget_used}%</h6>
                  </td>
                  <td>
                    <h6>{budget.order_total_cost}</h6>
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
          </div>
          <hr />

          <div className="signature_block">
            {budget.placed_by > 0 && (
              <div className="item">
                <img className="signature" src={budget.placed_by_sign} defalt />
                <div className="sign_time">
                  {moment(budget.placed_at).format("lll")}
                </div>
              </div>
            )}
            {budget.confirmed_by > 0 && (
              <div className="item">
                <img className="signature" src={budget.confirmed_by_sign} />
                <div className="sign_time">
                  {moment(budget.confirmed_at).format("lll")}
                </div>
              </div>
            )}

            {budget.submitted_by > 0 && (
              <div className="item">
                <img className="signature" src={budget.submitted_by_sign} />
                <div className="sign_time">
                  {moment(budget.submitted_at).format("lll")}
                </div>
              </div>
            )}

            {budget.checked_by > 0 && (
              <div className="item">
                <img className="signature" src={budget.checked_by_sign} />
                <div className="sign_time">
                  {moment(budget.checked_at).format("lll")}
                </div>
              </div>
            )}

            {budget.cost_approved_by > 0 && (
              <div className="item">
                <img className="signature" src={budget.cost_approved_by_sign} />
                <div className="sign_time">
                  {moment(budget.cost_approved_at).format("lll")}
                </div>
              </div>
            )}

            {budget.finalized_by > 0 && (
              <div className="item">
                <img className="signature" src={budget.finalized_by_sign} />
                <div className="sign_time">
                  {moment(budget.finalized_at).format("lll")}
                </div>
              </div>
            )}

            {budget.approved_by > 0 && (
              <div className="item">
                <img className="signature" src={budget.approved_by_sign} />
                <div className="sign_time">
                  {moment(budget.approved_at).format("lll")}
                </div>
              </div>
            )}

            {budget.received_by > 0 && (
              <div className="item">
                <img className="signature" src={budget.received_by_sign} />
                <div className="sign_time">
                  {moment(budget.received_at).format("lll")}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
