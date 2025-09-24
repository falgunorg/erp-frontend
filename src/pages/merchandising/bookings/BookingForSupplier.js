import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Logo from "../../../assets/images/logos/logo-short.png"; // Adjust path if needed

export default function BookingForSupplier(props) {
  const params = useParams();
  const [booking, setBooking] = useState({});
  const [variationItems, setVariationItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchBooking = async () => {
    try {
      const response = await api.get("/merchandising/bookings/" + params.id);
      if (response.status === 200) {
        setBooking(response.data.data);
        setVariationItems(response.data.data.items || []);
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(async () => {
    fetchBooking();
  }, []);

  if (loading) return <p>Loading...</p>;

  const totalGarmentQty = variationItems.reduce(
    (sum, row) => sum + (Number(row.garment_qty) || 0),
    0
  );

  const totalFinalQty = variationItems.reduce(
    (sum, row) => sum + (Number(row.final_qty) || 0),
    0
  );

  const totalFabric = variationItems.reduce(
    (sum, row) => sum + (Number(row.garment_qty * row.consumption) || 0),
    0
  );

  const totalBookingQty = variationItems.reduce(
    (sum, row) => sum + (Number(row.booking_qty) || 0),
    0
  );

  const grandTotalAmount = variationItems.reduce(
    (sum, row) => sum + (Number(row.total_price) || 0),
    0
  );

  const totalSampleRequiredQty = variationItems.reduce(
    (sum, row) => sum + (Number(row.sample_requirement) || 0),
    0
  );

  const totalActualAllow =
    totalFabric > 0
      ? (((totalBookingQty - totalFabric) / totalFabric) * 100).toFixed(2)
      : "0.00";

  return (
    <div className="container-fluid">
      <div class="po-header">
        <div class="row align-items-center">
          <div class="col-4">
            <img
              style={{ width: "30px", marginRight: "8px" }}
              src={Logo}
              alt="Logo"
            />
          </div>

          <div class="col-8 text-end">
            <h5 class="mb-0 fw-bold">
              {" "}
              {booking.workorder?.techpack?.company?.title || "-"}
            </h5>
            <small class="d-block">
              {booking.workorder?.techpack?.company?.address || "-"}
            </small>
            <small class="d-block">
              Phone: +880 140 440 8877 | Email: info@falgun.org
            </small>
            <small class="d-block">www.falgun.org</small>
          </div>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-12 text-center">
          <h5 class="fw-bold text-uppercase border-bottom py-2">
            Booking Order
          </h5>
        </div>
      </div>

      <div className="row mt-4">
        {/* Left Column */}
        <div className="col-6">
          <table className="table table-borderless mb-0">
            <tbody>
              <tr>
                <td style={{ width: "50%" }} className="fw-bold">
                  Buyer:
                </td>
                <td>{booking.workorder?.techpack?.buyer?.name || "-"}</td>
              </tr>
              <tr>
                <td style={{ width: "50%" }} className="fw-bold">
                  Style#:
                </td>
                <td>{booking.workorder.techpack?.techpack_number || "-"}</td>
              </tr>
              <tr>
                <td style={{ width: "50%" }} className="fw-bold">
                  Company:
                </td>
                <td>{booking.workorder?.techpack?.company?.title || "-"}</td>
              </tr>
              <tr>
                <td style={{ width: "50%" }} className="fw-bold">
                  Delivery Address:
                </td>
                <td>{booking.workorder?.techpack?.company?.address || "-"}</td>
              </tr>
              <tr>
                <td style={{ width: "50%" }} className="fw-bold">
                  Garment Qty:
                </td>
                <td>{totalGarmentQty}</td>
              </tr>
              <tr>
                <td style={{ width: "50%" }} className="fw-bold">
                  Booking Qty:
                </td>
                <td>
                  {totalBookingQty} / {booking.unit}
                </td>
              </tr>
              <tr>
                <td style={{ width: "50%" }} className="fw-bold">
                  PO Numbers:
                </td>
                <td>
                  {booking.workorder?.pos?.map((item, index) => (
                    <a href={"/purchase-orders/" + item.id} key={index}>
                      {item.po_number}
                      {index !== booking.workorder?.pos.length - 1 ? ", " : ""}
                    </a>
                  ))}
                </td>
              </tr>
              <tr>
                <td style={{ width: "50%" }} className="fw-bold">
                  Item:
                </td>
                <td>{booking.item?.title}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right Column */}
        <div className="col-6">
          <table className="table table-borderless mb-0">
            <tbody>
              <tr>
                <td style={{ width: "50%" }} className="fw-bold text-end">
                  Supplier:
                </td>
                <td className="text-end">{booking.supplier?.company_name}</td>
              </tr>
              <tr>
                <td style={{ width: "50%" }} className="fw-bold text-end">
                  Attention:
                </td>
                <td className="text-end">
                  {booking.supplier?.attention_person} /{" "}
                  {booking.supplier?.mobile_number}
                </td>
              </tr>
              <tr>
                <td style={{ width: "50%" }} className="fw-bold text-end">
                  Supplier Address:
                </td>
                <td className="text-end">{booking.supplier?.address}</td>
              </tr>
              <tr>
                <td style={{ width: "50%" }} className="fw-bold text-end">
                  LC Terms:
                </td>
                <td className="text-end">{booking.lc_term}</td>
              </tr>
              <tr>
                <td style={{ width: "50%" }} className="fw-bold text-end">
                  ETD:
                </td>
                <td className="text-end">{booking.etd}</td>
              </tr>
              <tr>
                <td style={{ width: "50%" }} className="fw-bold text-end">
                  ETA:
                </td>
                <td className="text-end">{booking.eta}</td>
              </tr>
              <tr>
                <td style={{ width: "50%" }} className="fw-bold text-end">
                  EID:
                </td>
                <td className="text-end">{booking.eid}</td>
              </tr>
              <tr>
                <td style={{ width: "50%" }} className="fw-bold text-end">
                  Remarks:
                </td>
                <td className="text-end">{booking.remarks}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="row">
        <div className="table-responsive mt-4">
          <table className="table table-bordered table-striped align-middle">
            <thead className="table-light">
              <tr>
                <th colSpan={3} className="text-center fw-bold text-uppercase">
                  Garment Details
                </th>
                <th colSpan={10} className="text-center fw-bold text-uppercase">
                  Item Details
                </th>
              </tr>
              <tr>
                {/* Garment Details */}
                <th>Garment Color</th>
                <th>Size Ranges</th>
                <th>Garment QTY</th>
                <th>Size / Dimension</th>
                <th>Description / Specification / Composition</th>
                <th>Color / Pantone / Code</th>

                {/* Item Details */}
                {booking.item_type_id !== 1 && (
                  <>
                    <th>Material Type</th>
                    <th>Position</th>
                    <th>Brand / Logo</th>
                  </>
                )}

                <th>Booking QTY</th>
                <th>Unit Price /{booking.unit}</th>
                <th>Total Price</th>
                <th>Sample Requirement</th>
                <th>Comment / Remarks</th>
              </tr>
            </thead>

            <tbody>
              {variationItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.garment_color}</td>
                  <td>{item.size_range}</td>
                  <td className="text-end">{item.garment_qty}</td>
                  <td>{item.item_size}</td>
                  <td>{item.item_description}</td>
                  <td>{item.item_color}</td>
                  {booking.item_type_id !== 1 && (
                    <>
                      <td>{item.item_type}</td>
                      <td>{item.position}</td>
                      <td>{item.item_brand}</td>
                    </>
                  )}

                  <td className="text-end">{item.booking_qty}</td>
                  <td className="text-end">{item.unit_price}</td>
                  <td className="text-end">{item.total_price}</td>
                  <td className="text-end">{item.sample_requirement}</td>
                  <td>{item.comment}</td>
                </tr>
              ))}

              {/* Totals Row */}
              <tr className="table-secondary fw-bold">
                <td colSpan="2" className="text-center">
                  Total
                </td>
                <td className="text-end">{totalGarmentQty}</td>
                <td
                  colSpan={booking.item_type_id === 1 ? "3" : "6"}
                  className="text-end"
                >
                  Grand Total
                </td>
                <td className="text-end">
                  {totalBookingQty.toFixed(2)} {booking.unit}
                </td>
                <td></td>
                <td className="text-end">{grandTotalAmount.toFixed(2)}</td>
                <td className="text-end">
                  {totalSampleRequiredQty.toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <br />
      <hr />

      <div
        className="preview"
        dangerouslySetInnerHTML={{ __html: booking.description }}
      ></div>
    </div>
  );
}
