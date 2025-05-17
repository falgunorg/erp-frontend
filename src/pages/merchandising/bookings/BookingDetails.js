import React, { useState, Fragment, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Spinner from "../../../elements/Spinner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import moment from "moment/moment";
import swal from "sweetalert";

export default function BookingDetails(props) {
  const history = useHistory();

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
      pdf.save("booking-order.pdf");
    });
  };

  const PrintPdf = () => {
    window.print();
  };

  const [booking, setBooking] = useState({});
  const [bookingItems, setBookingItems] = useState([]);

  const getBooking = async () => {
    setSpinner(true);
    var response = await api.post("/bookings-show", { id: params.id });
    if (response.status === 200 && response.data) {
      setBooking(response.data.data);
      setBookingItems(response.data.data.booking_items);
    }
    setSpinner(false);
  };

  useEffect(async () => {
    getBooking();
  }, []);

  useEffect(async () => {
    props.setSection("merchandising");
  }, []);

  const toggleStatus = async (status) => {
    setSpinner(true);
    var response = await api.post("/bookings-toggle-status", {
      id: booking.id,
      status: status,
    });

    if (response.status === 200 && response.data) {
      swal({
        title: "Status Updated Success!",
        icon: "success",
      });
      getBooking();
    }
    setSpinner(false);
  };

  useEffect(() => {
    const checkAccess = async () => {
      const allowedDepartments = [
        "Merchandising",
        "Sample",
        "Planing",
        "Management",
        "Commercial",
        "Accounts & Finance",
        "IT",
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
        <div className="page_name">Booking Details</div>
        <div className="actions">
          <Link to="#" onClick={PrintPdf} className="btn btn-info btn-sm">
            <i className="fas fa-print"></i>
          </Link>

          <Link to="#" onClick={generatePdf} className="btn btn-warning bg-falgun ">
            <i className="fas fa-download"></i>
          </Link>

          {props.userData.userId === booking.user_id &&
          (booking.status === "Pending" || booking.status === "Rejected") ? (
            <Fragment>
              <Link
                to={"/merchandising/bookings-edit/" + booking.id}
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
          booking.status === "Placed" ? (
            <Fragment>
              <button
                onClick={() => toggleStatus("Confirmed")}
                className="btn btn-success"
              >
                Confirmed
              </button>
              {/* <button
                onClick={() => toggleStatus("Rejected")}
                className="btn btn-danger"
              >
                Reject
              </button> */}
            </Fragment>
          ) : null}

          <Link to="/merchandising/bookings" className="btn btn-danger">
            <i className="fal fa-times"></i>
          </Link>
        </div>
      </div>

      <div className="preview_print page" id="pdf_container">
        <div className="container border ">
          <br />
          <h6 className="text-center text-underline">
            <u>BOOKING ORDER</u>
          </h6>
          <br />

          <table className="table text-start align-middle table-bordered table-hover mb-0 table-striped">
            <tbody>
              <tr>
                <td colSpan={1}>
                  <strong>BOOKING NUMBER</strong>
                </td>
                <td colSpan={1}>
                  <strong>CURRENCY</strong>
                </td>
                <td colSpan={1}>
                  <strong>SUPPLIER</strong>
                </td>
                <td colSpan={1}>
                  <strong>TOTAL</strong>
                </td>
                <td colSpan={1}>
                  <strong>FROM</strong>
                </td>
                <td colSpan={1}>
                  <strong>TO</strong>
                </td>
              </tr>
              <tr>
                <td colSpan={1}>{booking.booking_number}</td>
                <td colSpan={1}>{booking.currency}</td>
                <td colSpan={1}>{booking.supplier}</td>
                <td colSpan={1}>{booking.total_amount}</td>
                <td colSpan={1}>{booking.booking_from}</td>
                <td colSpan={1}>{booking.booking_to}</td>
              </tr>

              <tr>
                <td colSpan={1}>
                  <strong>STATUS</strong>
                </td>
                <td colSpan={1}>
                  <strong>BOOKING DATE</strong>
                </td>
                <td colSpan={1}>
                  <strong>DELIVERY DATE</strong>
                </td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
              </tr>

              <tr>
                <td colSpan={1}>{booking.status}</td>
                <td colSpan={1}>{moment(booking.booking_date).format("ll")}</td>
                <td colSpan={1}>
                  {moment(booking.delivery_date).format("ll")}
                </td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
              </tr>

              <tr>
                <td colSpan={3}>
                  <strong>BILL TO</strong>
                </td>
                <td colSpan={3}>
                  <strong>DELIVERY TO </strong>
                </td>
              </tr>
              <tr>
                <td colSpan={3}>{booking.billing_address}</td>
                <td colSpan={3}>{booking.delivery_address}</td>
              </tr>
            </tbody>
          </table>
          <br />

          <h6 className="text-center text-underline">
            <u>BOOKING ITEM'S</u>
          </h6>
          <div className="Import_booking_item_table">
            <table className="table text-start align-middle table-bordered table-hover mb-0">
              <thead className="bg-dark text-white">
                <tr>
                  <th>#</th>
                  <th>Budget</th>
                  <th>Buyer</th>
                  <th>Style/Techpack</th>
                  <th>Item</th>
                  <th>Item Details </th>
                  <th>Remarks</th>
                  <th>Attatchment</th>
                  <th>Color</th>
                  <th>Size</th>
                  <th>Shade</th>
                  <th>Tex</th>
                  <th>Unit</th>
                  <th>Unit Price</th>
                  <th>QTY</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {bookingItems.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.budget_number}</td>
                    <td>{item.buyer}</td>
                    <td>{item.techpack}</td>
                    <td>{item.item_name}</td>
                    <td>
                      <pre>{item.description}</pre>
                    </td>
                    <td>
                      <pre>{item.remarks}</pre>
                    </td>
                    <td>
                      <img
                        style={{ height: "80px", width: "120px" }}
                        src={item.image_source}
                      />
                    </td>
                    <td>{item.color}</td>
                    <td>{item.size}</td>
                    <td>{item.shade}</td>
                    <td>{item.tex}</td>
                    <td>{item.unit}</td>
                    <td>{item.unit_price}</td>
                    <td>{item.qty}</td>
                    <td>{item.total}</td>
                  </tr>
                ))}

                <tr className="text-center">
                  <td colSpan={15}>
                    <h6>Items Summary</h6>
                  </td>

                  <td>
                    <h6>{booking.total_amount}</h6>
                  </td>
                </tr>
              </tbody>
            </table>

            <br />
            <div className="row">
              <div className="col-lg-8">
                <div className="attachment_list">
                  <h6>Attachment's:</h6>
                  {booking &&
                  booking.attachments &&
                  booking.attachments.length > 0
                    ? booking.attachments.map((value, index) => (
                        <div key={index} className="single_attachment">
                          {value.filename.endsWith(".txt") ? (
                            <div className="item">
                              <i className="fal fa-text"></i>
                            </div>
                          ) : value.filename.endsWith(".pdf") ? (
                            <div className="item">
                              <i className="fal fa-file-pdf"></i>
                            </div>
                          ) : value.filename.endsWith(".docx") ? (
                            <div className="item">
                              <i className="fal fa-file-word"></i>
                            </div>
                          ) : value.filename.endsWith(".doc") ? (
                            <div className="item">
                              <i className="fal fa-file-word"></i>
                            </div>
                          ) : value.filename.endsWith(".xls") ? (
                            <div className="item">
                              <i className="fal fa-file-excel"></i>
                            </div>
                          ) : value.filename.endsWith(".png") ? (
                            <div className="item">
                              <i className="fal fa-image"></i>
                            </div>
                          ) : value.filename.endsWith(".jpg") ? (
                            <div className="item">
                              <i className="fal fa-image"></i>
                            </div>
                          ) : value.filename.endsWith(".jpeg") ? (
                            <div className="item">
                              <i className="fal fa-image"></i>
                            </div>
                          ) : value.filename.endsWith(".gif") ? (
                            <div className="item">
                              <i className="fal fa-image"></i>
                            </div>
                          ) : (
                            <div className="item">
                              <i className="fal fa-file"></i>
                            </div>
                          )}
                          <a target="_blank" href={value.file_source} download>
                            <div className="item">
                              <div className="text-muted">{value.filename}</div>
                              {/* <div className="text-muted">200 kb</div> */}
                            </div>
                          </a>
                        </div>
                      ))
                    : "No Attachment Here"}
                </div>
              </div>
            </div>
            <hr />

            <div className="signature_block">
              {booking.placed_by > 0 && (
                <div className="item">
                  <img
                    className="signature"
                    src={booking.placed_by_sign}
                    defalt
                  />
                  <div className="sign_time">
                    {moment(booking.placed_at).format("lll")}
                  </div>
                </div>
              )}
              {booking.confirmed_by > 0 && (
                <div className="item">
                  <img className="signature" src={booking.confirmed_by_sign} />
                  <div className="sign_time">
                    {moment(booking.confirmed_at).format("lll")}
                  </div>
                </div>
              )}
            </div>
          </div>
          <br />
        </div>
      </div>
    </div>
  );
}
