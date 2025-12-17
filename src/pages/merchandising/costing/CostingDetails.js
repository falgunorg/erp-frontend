import React, { useState, Fragment, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import moment from "moment/moment";
import swal from "sweetalert";

export default function CostingDetails(props) {
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
      pdf.save("costing.pdf");
    });
  };
  const PrintPdf = () => {
    window.print();
  };

  const [costing, setCosting] = useState({});
  const [costingItems, setCostingItems] = useState([]);

  const getCosting = async () => {
    setSpinner(true);
    var response = await api.post("/merchandising/costings-show", { id: params.id });
    if (response.status === 200 && response.data) {
      setCosting(response.data.data);
      setCostingItems(response.data.data.costing_items);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getCosting();
  }, []);
  useEffect(async () => {
    props.setSection("merchandising");
  }, []);

  
  return (
    <div className="create_edit_page">
      {spinner && <Spinner />}
      <div className="create_page_heading">
        <div className="page_name">Costing Details</div>
        <div className="actions">
          <Link to="#" onClick={PrintPdf} className="btn btn-info btn-sm">
            <i className="fas fa-print"></i>
          </Link>
          <Link to="#" onClick={generatePdf} className="btn btn-warning bg-falgun ">
            <i className="fas fa-download"></i>
          </Link>
          <Link to="#" onClick={goBack} className="btn btn-danger">
            <i className="fal fa-times"></i>
          </Link>
        </div>
      </div>

      <div className="preview_print page" id="pdf_container">
        <div className="container border ">
          <br />

          <h6 className="text-center text-underline">
            <u>COST FILE</u>
          </h6>

          <br />
          <div className="row">
            <div className="col-lg-8">
              <table className="table text-start align-middle table-bordered table-hover mb-0 ">
                <tbody>
                  <tr>
                    <td>
                      <strong>COSTING NUMBER</strong>
                    </td>
                    <td>
                      <strong>TECHPACK/STYLE</strong>
                    </td>
                    <td>
                      <strong>SEASON</strong>
                    </td>
                    <td>
                      <strong>CONSUMPTION</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>{costing.costing_number}</td>
                    <td>{costing.techpack_number}</td>
                    <td>{costing.season}</td>
                    <td>{costing.consumption_number}</td>
                  </tr>

                  <tr>
                    <td>
                      <strong>UNIT COST</strong>
                    </td>
                    <td>
                      <strong>COSTING BY</strong>
                    </td>
                    <td>
                      <strong></strong>
                    </td>
                    <td>
                      <strong></strong>
                    </td>
                  </tr>
                  <tr>
                    <td>{costing.total} USD</td>
                    <td>{costing.user}</td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-lg-4">
              <img
                style={{ height: "250px", width: "100%" }}
                src={costing.file_source}
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
                  <th>Unit</th>
                  <th>Color</th>
                  <th>Size</th>
                  <th>Actual Cons</th>
                  <th>Wastage %</th>
                  <th>Total Cons</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {costingItems.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.item_name}</td>
                    <td>
                      <pre>{item.description}</pre>
                    </td>
                    <td>{item.unit}</td>
                    <td>{item.size}</td>
                    <td>{item.color}</td>
                    <td>{item.actual}</td>
                    <td>{item.wastage_parcentage}%</td>
                    <td>{item.cons_total}</td>
                    <td>{item.unit_price}</td>
                    <td>{item.total}</td>
                  </tr>
                ))}
                <tr className="">
                  <td colSpan={10}>
                    <h6>Items Summary</h6>
                  </td>

                  <td>
                    <h6>{costing.total} USD</h6>
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
          </div>
          <hr />
        </div>
      </div>
    </div>
  );
}
