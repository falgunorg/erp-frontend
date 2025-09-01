import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import finalConfig from "../../configs/config";
import api from "../../services/api";
import Spinner from "../../elements/Spinner";
import swal from "sweetalert";
import moment from "moment";
import Logo from "../../assets/images/logos/logo-short.png";

const ParcelDetails = (props) => {
  const [spinner, setSpinner] = useState(false);
  const appURL = finalConfig.appUrl;
  const params = useParams();

  // get all store items
  const [parcel, setParcel] = useState([]);
  const getParcel = async () => {
    setSpinner(true);

    // Send the correct page parameter to the API request
    var response = await api.post("/common/parcels-show", {
      tracking_number: params.tracking_number,
    });

    if (response.status === 200 && response.data) {
      setParcel(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getParcel();
  }, []);

  const printContent = () => {
    window.print();
  };

  const handleReceive = (id) => {
    swal({
      title: "Are you sure?",
      text: "Do you really want to receive this parcel?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // Create an async function inside the then block to handle the async operation
        (async () => {
          try {
            var response = await api.post("/common/parcels-receive", {
              id: id,
            });

            if (response.status === 200 && response.data) {
              swal({
                title: "Received Success",
                text: "Item received successfully",
                icon: "success",
              });
              getParcel();
            } else {
              swal({
                title: "Receive Failed",
                text: "Failed to receive item",
                icon: "error",
              });
            }
          } catch (error) {
            swal({
              title: "Receive Failed",
              text: "An error occurred while Receive the item",
              icon: "error",
            });
          }
        })();
      }
    });
  };

  return (
    <div className="parcel_details">
      {spinner && <Spinner />}
      <div className="text-end non_printing_area">
        <Link to="/parcels" className="btn btn-danger">
          <i className="fal fa-times"></i>
        </Link>
      </div>
      <h4 className="text-center text-uppercase non_printing_area">
        Parcel Details
      </h4>
      <div className="text-center non_printing_area">
        <button
          className="btn btn-success btn-sm me-2"
          id="printButton"
          onClick={printContent}
        >
          <strong>PRINT</strong>
        </button>
        {parcel.user_id !== props.userData.userId &&
        parcel.status !== "Completed" ? (
          <button
            className="btn btn-warning btn-sm"
            onClick={() => handleReceive(parcel.id)}
          >
            <strong>RECEIVE</strong>
          </button>
        ) : (
          ""
        )}
      </div>

      <div
        className="preview_print page"
        id="pdf_container"
        style={{ padding: "15px" }}
      >
        <table className="table table-bordered">
          <tbody>
            <tr>
              <td className="text-center" colSpan="3" style={{ width: "100%" }}>
                <strong>COURIER COPY</strong>
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
                  src={Logo}
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
                <div className="text-black">ITEM:</div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {parcel.title}
                </div>
              </td>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-black">TYPE:</div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {parcel.item_type}
                </div>
              </td>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-black">QTY:</div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {parcel.qty}
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-black">FROM:</div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {" "}
                  {parcel.user_name}
                </div>
                <div className="text-black">{parcel.from_company_name}</div>
                <div className="text-black">
                  {moment(parcel.created_at).format("lll")}{" "}
                </div>
              </td>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-black">TO:</div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {parcel.destination_person_name}
                </div>
                <div className="text-black">{parcel.to}</div>
              </td>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-black">DELIVERY BY:</div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {parcel.method}
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-black">CHALLAN:</div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {parcel.challan_no}
                </div>
              </td>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-black">REFERENCE:</div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {parcel.reference}
                </div>
              </td>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-black">BUYER:</div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {parcel.buyer_name}
                </div>
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
                <div className="text-black">ITEM:</div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {parcel.title}
                </div>
              </td>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-black">TYPE:</div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {parcel.item_type}
                </div>
              </td>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-black">QTY:</div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {parcel.qty}
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-black">FROM:</div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {" "}
                  {parcel.user_name}
                </div>
                <div className="text-black">{parcel.from_company_name}</div>
                <div className="text-black">
                  {moment(parcel.created_at).format("lll")}{" "}
                </div>
              </td>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-black">TO:</div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {parcel.destination_person_name}
                </div>
                <div className="text-black">{parcel.to}</div>
              </td>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-black">DELIVERY BY:</div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {parcel.method}
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-black">CHALLAN:</div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {parcel.challan_no}
                </div>
              </td>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-black">REFERENCE:</div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {parcel.reference}
                </div>
              </td>
              <td colSpan={1} style={{ width: "33.33%" }}>
                <div className="text-black">BUYER:</div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {parcel.buyer_name}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        className="border non_printing_area"
        style={{ margin: "15px", padding: "10px" }}
      >
        <div className="text-black">DESCRIPTION:</div>
        <h4>
          <strong>STYLE # 28 LINEN DRAWSTRING TRS</strong>
        </h4>
      </div>
    </div>
  );
};

export default ParcelDetails;
