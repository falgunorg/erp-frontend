import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Logo from "../../../../../assets/images/logos/logo-short.png"; // Adjust path if needed

export default function AccessoriseBookingForSupplier(props) {
  const params = useParams();
  const [booking, setBooking] = useState({});
  const [variationItems, setVariationItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchBooking = async () => {
    try {
      const response = await api.post(
        "/merchandising/accessories/booking/details",
        {
          id: params.id,
        }
      );
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

  const totalSampleRequiredQty = variationItems.reduce(
    (sum, row) => sum + (Number(row.sample_requirement) || 0),
    0
  );

  const totalActualAllow =
    totalFabric > 0
      ? (((totalBookingQty - totalFabric) / totalFabric) * 100).toFixed(2)
      : "0.00";

  return (
    <div className="create_technical_pack container">
      <div class="po-header border-bottom pb-3 mb-4">
        <div class="row align-items-center">
          <div class="col-4">
            <img
              style={{ width: "30px", marginRight: "8px" }}
              src={Logo}
              alt="Logo"
            />
          </div>

          <div class="col-8 text-end">
            <h3 class="mb-0 fw-bold">
              {" "}
              {booking.workorder?.techpack?.company?.title || "-"}
            </h3>
            <small class="d-block">
              {booking.workorder?.techpack?.company?.address || "-"}
            </small>
            <small class="d-block">
              Phone: +880 140 440 8877 | Email: info@falgun.org
            </small>
            <small class="d-block">www.falgun.org</small>
          </div>
        </div>

        <div class="row mt-3">
          <div class="col-12 text-center">
            <h2 class="fw-bold text-uppercase border-top border-bottom py-2">
              Booking Order
            </h2>
          </div>
        </div>

        <div class="row mt-4">
          <div class="col-6">
            <p class="mb-1">
              <strong>Buyer:</strong>{" "}
              {booking.workorder?.techpack?.buyer?.name || "-"}
            </p>
            <p class="mb-1">
              <strong>Tech Pack / Style#:</strong>{" "}
              {booking.workorder.techpack?.techpack_number || "-"}
            </p>
            <p class="mb-1">
              <strong>Company:</strong>{" "}
              {booking.workorder?.techpack?.company?.title || "-"}
            </p>
            <p class="mb-1">
              <strong>Delivery Address:</strong>{" "}
              {booking.workorder?.techpack?.company?.address || "-"}
            </p>
            <p class="mb-1">
              <strong>Garment Qty:</strong> {totalGarmentQty}
            </p>
            <p class="mb-1">
              <strong>Booking Qty:</strong> {totalBookingQty} / {booking.unit}
            </p>
          </div>
          <div class="col-6 text-end">
            <p class="mb-1">
              <strong>Supplier:</strong> {booking.supplier?.company_name}
            </p>
            <p class="mb-1">
              <strong>Attention:</strong> {booking.supplier?.attention_person}/
              {booking.supplier?.mobile_number}
            </p>
            <p class="mb-1">
              <strong>Supplier Address:</strong> {booking.supplier?.address}
            </p>
            <p class="mb-1">
              <strong>LC Terms:</strong> {booking.lc_term}
            </p>
            <p class="mb-1">
              <strong>ETD:</strong> {booking.etd}
            </p>
            <p class="mb-1">
              <strong>ETA:</strong> {booking.eta}
            </p>
          </div>
          <div class="col-6">
            <p class="mb-1">
              <strong>PO Numbers: </strong>
              {booking.workorder?.pos?.map((item, index) => (
                <a href={"/purchase-orders/" + item.id} key={index}>
                  {item.po_number}
                  {index !== booking.workorder?.pos.length - 1 ? ", " : ""}
                </a>
              ))}
            </p>
            <p class="mb-1">
              <strong>Item: </strong>
              {booking.item?.title}
            </p>
          </div>
          <div class="col-6 text-end">
            <p class="mb-1">
              <strong>EID:</strong> {booking.eid}
            </p>
            <p class="mb-1">
              <strong>Remarks:</strong> {booking.remarks}
            </p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="table-responsive mt-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Garment Color</th>
                <th>Size Ranges</th>
                <th>Material Type</th>
                <th>Position</th>
                <th>Size / Dimension</th>
                <th>Description / Specification/Composition</th>
                <th>Color / Pantone</th>
                <th>Item Material</th>
                <th>Brand / Logo</th>
                <th>Garment QTY</th>

                <th>Booking QTY</th>
                <th>Sample Requirement</th>
                <th>Comment/Remarks</th>
              </tr>
            </thead>
            <tbody>
              {variationItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.garment_color}</td>
                  <td>{item.size_range}</td>
                  <td>{item.item_type}</td>
                  <td>{item.position}</td>
                  <td>{item.item_size}</td>
                  <td>{item.item_description}</td>
                  <td>{item.item_color}</td>
                  <td>{item.item_material}</td>
                  <td>{item.item_brand}</td>
                  <td>{item.garment_qty}</td>
                  <td>{item.booking_qty}</td>
                  <td>{item.sample_requirement}</td>
                  <td>{item.comment}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="9" className="text-end">
                  <strong>Total:</strong>
                </td>
                <td>
                  <strong>{totalGarmentQty}</strong>
                </td>
                <td>
                  <strong>{totalBookingQty.toFixed(2)}</strong>
                </td>
                <td>
                  <strong>{totalSampleRequiredQty.toFixed(2)}</strong>
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
