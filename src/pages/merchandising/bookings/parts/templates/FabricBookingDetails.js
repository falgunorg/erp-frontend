import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Logo from "../../../../../assets/images/logos/logo-short.png"; // Adjust path if needed

export default function FabricBookingDetails(props) {
  const params = useParams();
  const [booking, setBooking] = useState({});
  const [variationItems, setVariationItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchBooking = async () => {
    try {
      const response = await api.post("/merchandising/fabric/booking/details", {
        id: params.id,
      });
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
    <div className="create_technical_pack">
      <div className="row create_tp_header align-items-center">
        <div className="col-lg-10">
          <div className="row align-items-baseline">
            <div className="col-lg-12">
              <img
                style={{ width: "30px", marginRight: "8px" }}
                src={Logo}
                alt="Logo"
              />
              <span className="purchase_text">
                Booking Details - {booking.item?.title}
              </span>
            </div>
          </div>
        </div>

        <div className="col-lg-2 text-end">
          <Link
            to={"/merchandising/edit-fabric-booking/" + booking.id}
            className="btn btn-primary"
          >
            Edit
          </Link>
        </div>
      </div>
      <br />
      <br />
      <div className="create_tp_body">
        <div className="row">
          <div className="col-lg-2">
            <label className="form-label">Buyer</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">
              {booking.workorder?.techpack?.buyer?.name || "-"}
            </div>
          </div>
          <div className="col-lg-2">
            <label className="form-label">Tech Pack/Style#</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">
              {booking.workorder.techpack?.techpack_number || "-"}
            </div>
          </div>
          <div className="col-lg-2">
            <label className="form-label">Company</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">
              {booking.workorder?.techpack?.company?.title || "-"}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-2">
            <label className="form-label">Garment QTY</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">{totalGarmentQty}</div>
          </div>
          <div className="col-lg-2">
            <label className="form-label">
              WO Required Qty. (allow included){" "}
            </label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">{totalFinalQty}</div>
          </div>
          <div className="col-lg-2">
            <label className="form-label">Actual Booking</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">{totalBookingQty}</div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-2">
            <label className="form-label">Actual Allow %</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">{totalActualAllow}%</div>
          </div>
          <div className="col-lg-2">
            <label className="form-label">Unit</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">{booking.unit}</div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-2">
            <label className="form-label">Unit Price</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">{booking.unit_price}</div>
          </div>
          <div className="col-lg-2">
            <label className="form-label">Total Amount</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">${booking.total_price}</div>
          </div>
          <div className="col-lg-2">
            <label className="form-label">Supplier</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">{booking.supplier?.company_name}</div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-2">
            <label className="form-label">LC Terms</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">{booking.lc_term}</div>
          </div>
          <div className="col-lg-2">
            <label className="form-label">ETD</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">{booking.etd}</div>
          </div>
          <div className="col-lg-2">
            <label className="form-label">ETA</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">{booking.eta}</div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-2">
            <label className="form-label">EID</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">{booking.eid}</div>
          </div>
          <div className="col-lg-2">
            <label className="form-label">Remarks</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">{booking.remarks}</div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-2">
            <label className="form-label">Po</label>
          </div>
          <div className="col-lg-10">
            <div className="form-value">
              {booking.workorder?.pos?.map((item, index) => (
                <Link to={"/purchase-orders/" + item.id} key={index}>
                  {item.po_number}
                  {index !== booking.workorder?.pos.length - 1 ? ", " : ""}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="table-responsive mt-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Garment Color</th>
                <th>Size Range</th>
                <th>Fabric Code</th>
                <th>Fabric Details</th>
                <th>Width</th>
                <th>Garment QTY</th>
                <th>Consumption</th>
                <th>Fabric</th>
                <th>Allow %</th>
                <th>Final</th>
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
                  <td>{item.fabric_code}</td>
                  <td>{item.fabric_details}</td>
                  <td>{item.width}</td>
                  <td>{item.garment_qty}</td>
                  <td>{item.consumption}</td>
                  <td>{item.garment_qty * item.consumption}</td>
                  <td>{item.wastage}</td>
                  <td>{item.final_qty}</td>
                  <td>{item.booking_qty}</td>
                  <td>{item.sample_requirement}</td>
                  <td>{item.comment}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="5" className="text-end">
                  <strong>Total:</strong>
                </td>
                <td>
                  <strong>{totalGarmentQty}</strong>
                </td>
                <td></td>
                <td>
                  <strong>{totalFabric.toFixed(2)}</strong>
                </td>
                <td></td>
                <td>
                  <strong>{totalFinalQty.toFixed(2)}</strong>
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
