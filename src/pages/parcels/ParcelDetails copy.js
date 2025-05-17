import React from "react";
import { Link } from "react-router-dom";
import QRCode from "react-qr-code";
import finalConfig from "../../configs/config";

const ParcelDetails = () => {
  const appURL = finalConfig.appUrl;

  const parcel = {
    id: 1,
    tracking_number: "jR9huWdr",
  };

  const printContent = () => {
    const printableArea = document.getElementById("printable_area").innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printableArea;
    window.print();
    document.body.innerHTML = originalContent;
  };

  const confirmReceive = () => {
    if (window.confirm("Do you want to receive this parcel?")) {
      document.getElementById("receiveForm").submit();
    }
  };

  return (
    <div className="parcel_details border">
      <div className="text-end">
        <Link to="/parcels" className="btn btn-danger">
          <i className="fal fa-times"></i>
        </Link>
      </div>
      <h4 className="text-center text-uppercase">Parcel Details</h4>
      <div className="text-center">
        <button
          className="btn btn-success btn-sm me-2"
          id="printButton"
          onClick={printContent}
        >
          <strong>PRINT</strong>
        </button>
        <button className="btn btn-warning btn-sm" onClick={printContent}>
          <strong>RECEIVE</strong>
        </button>
      </div>
      <div
        className="printable_area"
        id="printable_area"
        style={{ padding: "15px" }}
      >
        <table className="table table-bordered">
          <tbody>
            <tr>
              <td colSpan={1} style={{ width: "33.33%", textAlign: "center" }}>
                <QRCode
                  size={50}
                  value={`${appURL}/parcels-details/${parcel.tracking_number}`}
                />
              </td>
              <td
                colSpan={1}
                style={{
                  width: "33.33%",
                  textAlign: "center",
                  alignContent: "center",
                }}
              >
                <img
                  style={{ margin: "0 auto" }}
                  alt="App Logo"
                  width={"100%"}
                  src={require("../../assets/images/logos/logo.png").default}
                />
              </td>
              <td
                colSpan={1}
                style={{
                  width: "33.33%",
                  textAlign: "center",
                  alignContent: "center",
                }}
              >
                <div style={{ fontSize: "25px" }} className="">
                  <strong>{parcel.tracking_number}</strong>
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-muted ">ITEM:</div>
                <h6>STYLE # 28 LINEN DRAWSTRING TRS</h6>
              </td>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-muted ">TYPE:</div>
                <h6>RMG</h6>
              </td>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-muted ">QTY:</div>
                <h6>7Pcs</h6>
              </td>
            </tr>
            <tr>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-muted ">FROM:</div>
                <h6>Amit</h6>
                <div className="text-muted ">Head Office</div>
                <div className="text-muted ">24 Jun 24 6:52 PM</div>
              </td>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-muted ">TO:</div>
                <h6>ABDUL-AL-MAMUN (WASHING)</h6>
                <div className="text-muted ">Modiste (CEPZ) LTD</div>
              </td>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-muted ">DELIVERY BY:</div>
                <h6>Company Vehicle</h6>
              </td>
            </tr>
            <tr>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-muted ">CHALLAN:</div>
                <h6>678586</h6>
              </td>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-muted ">REFERENCE:</div>
                <h6>DEVELOPMENT FOR WASH</h6>
              </td>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-muted ">REFERENCE:</div>
                <h6>DEVELOPMENT FOR WASH</h6>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <table className="table table-bordered">
          <tbody>
            <tr>
              <td className="text-center" colSpan="3" style={{ width: "100%" }}>
                <strong>OFFICE COPY</strong>
              </td>
            </tr>
            <tr>
              <td colSpan={1} style={{ width: "33.33%", textAlign: "center" }}>
                <QRCode
                  size={50}
                  value={`${appURL}/parcels-details/${parcel.tracking_number}`}
                />
              </td>
              <td
                colSpan={1}
                style={{
                  width: "33.33%",
                  textAlign: "center",
                  alignContent: "center",
                }}
              >
                <img
                  style={{ margin: "0 auto" }}
                  alt="App Logo"
                  width={"100%"}
                  src={require("../../assets/images/logos/logo.png").default}
                />
              </td>
              <td
                colSpan={1}
                style={{
                  width: "33.33%",
                  textAlign: "center",
                  alignContent: "center",
                }}
              >
                <div style={{ fontSize: "25px" }} className="">
                  <strong>{parcel.tracking_number}</strong>
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-muted ">ITEM:</div>
                <h6>STYLE # 28 LINEN DRAWSTRING TRS</h6>
              </td>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-muted ">TYPE:</div>
                <h6>RMG</h6>
              </td>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-muted ">QTY:</div>
                <h6>7Pcs</h6>
              </td>
            </tr>
            <tr>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-muted ">FROM:</div>
                <h6>Amit</h6>
                <div className="text-muted ">Head Office</div>
                <div className="text-muted ">24 Jun 24 6:52 PM</div>
              </td>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-muted ">TO:</div>
                <h6>ABDUL-AL-MAMUN (WASHING)</h6>
                <div className="text-muted ">Modiste (CEPZ) LTD</div>
              </td>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-muted ">DELIVERY BY:</div>
                <h6>Company Vehicle</h6>
              </td>
            </tr>
            <tr>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-muted ">CHALLAN:</div>
                <h6>678586</h6>
              </td>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-muted ">REFERENCE:</div>
                <h6>DEVELOPMENT FOR WASH</h6>
              </td>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-muted ">REFERENCE:</div>
                <h6>DEVELOPMENT FOR WASH</h6>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <br />

      <div className="border" style={{ margin: "15px", padding: "10px" }}>
        <div className="text-muted ">DESCRIPTION:</div>
        <h4>
          <strong>STYLE # 28 LINEN DRAWSTRING TRS</strong>
        </h4>
      </div>
    </div>
  );
};

export default ParcelDetails;
