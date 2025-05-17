import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Modal, Button, Badge } from "react-bootstrap";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import moment from "moment/moment";
import swal from "sweetalert";

export default function AdminBudgetDetails(props) {
  const history = useHistory();
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
    const input = document.getElementById("pdf_container");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      // Open the print dialog
      pdf.autoPrint();
      window.open(pdf.output("bloburl"), "_blank");
    });
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

  useEffect(async () => {
    getBudget();
  }, []);
  useEffect(async () => {
    props.setSection("merchandising");
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
        <div className="page_name">Budget Details</div>
        <div className="actions">
          <Link onClick={PrintPdf} className="btn btn-info btn-sm">
            <i className="fas fa-print"></i>
          </Link>
          <Link onClick={generatePdf} className="btn btn-warning bg-falgun ">
            <i className="fas fa-download"></i>
          </Link>

          {props.userData.userId === budget.user_id &&
          budget.status === "Pending" ? (
            <Link
              to={"/merchandising/budgets-edit/" + budget.id}
              className="btn btn-warning"
            >
              <i className="fal fa-pen"></i>
            </Link>
          ) : null}

          <Link to="/merchandising/budgets" className="btn btn-danger">
            <i className="fal fa-times"></i>
          </Link>
        </div>
      </div>

      <div className="preview_print page" id="pdf_container">
        <div className="container border ">
          <br />
          <h6 className="text-center">Cost File</h6>
          <hr></hr>
          <br />
          <div className="row">
            <div className="col-lg-8">
              <table className="table text-start align-middle table-bordered table-hover mb-0 table-striped ">
                <tbody>
                  <tr>
                    <td>
                      <strong>COSTING NUMBER</strong>
                    </td>
                    <td>
                      <strong>BUYER</strong>
                    </td>
                    <td>
                      <strong>SEASON</strong>
                    </td>
                    <td>
                      <strong>Brand</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>{budget.budget_number}</td>
                    <td>{budget.buyer}</td>
                    <td>{budget.season}</td>
                    <td>{budget.brand}</td>
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
                      <strong>RATIO</strong>
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
                    <td>{budget.ratio}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>QTY</strong>
                    </td>
                    <td>
                      <strong>SIZE RANGE</strong>
                    </td>
                    <td>
                      <strong>COLORS</strong>
                    </td>
                    <td>
                      <strong>CURRENCY</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {budget.qty} {budget.unit}
                    </td>
                    <td>
                      {budget.sizesList &&
                        budget.sizesList.map((item) => (
                          <span style={{ paddingRight: "5px" }} key={item.id}>
                            {item.title}
                            {","}
                          </span>
                        ))}
                    </td>
                    <td>
                      {budget.colorsList &&
                        budget.colorsList.map((item) => (
                          <span style={{ paddingRight: "5px" }} key={item.id}>
                            {item.title}
                            {","}
                          </span>
                        ))}
                    </td>
                    <td>{budget.currency}</td>
                  </tr>

                  <tr>
                    <td>
                      <strong>ORDER VALUE </strong>
                    </td>
                    <td>
                      <strong>STYLES</strong>
                    </td>
                    <td>
                      <strong>STATUS</strong>
                    </td>
                    <td>
                      <strong>TECHPACK / REF</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>{budget.total_order_value}</td>
                    <td>
                      {budget.stylesList &&
                        budget.stylesList.map((item) => (
                          <span style={{ paddingRight: "5px" }} key={item.id}>
                            {item.title}
                            {","}
                          </span>
                        ))}
                    </td>
                    <td>{budget.status}</td>
                    <td>{budget.techpack}</td>
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
              <div className="attachment_list" style={{ marginTop: 0 }}>
                <h5>Style Images</h5>
                {budget &&
                budget.attachments &&
                budget.attachments.length > 0
                  ? budget.attachments.map((value, index) => (
                      <img
                        key={index}
                        style={{ height: "250px", width: "100%" }}
                        src={value.file_source}
                      />
                    ))
                  : "No Attachment Here"}
              </div>
            </div>
          </div>
          <br />
          <h6 className="text-center">ITEM'S</h6>
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
        </div>
      </div>
    </div>
  );
}
