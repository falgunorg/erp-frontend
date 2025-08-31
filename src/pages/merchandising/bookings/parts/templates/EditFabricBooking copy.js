import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "services/api";
import Logo from "../../../../../assets/images/logos/logo-short.png"; // Adjust path if needed
import CustomSelect from "elements/CustomSelect";
import QuailEditor from "elements/QuailEditor";

export default function EditFabricBooking(props) {
  const params = useParams();
  const history = useHistory();

  const [workorder, setWorkorder] = useState({});
  const [formData, setFormData] = useState({});
  const [variationItems, setVariationItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [lcTerms] = useState([
    { id: 1, title: "At Sight" },
    { id: 2, title: "30 Days, C&F Ctg" },
    { id: 3, title: "60 Days, C&F Ctg" },
    { id: 4, title: "90 Days, C&F Ctg" },
    { id: 5, title: "120 Days, C&F Ctg" },
    { id: 6, title: "150 Days, C&F Ctg" },
    { id: 7, title: "FOB" },
    { id: 8, title: "Ex Factory" },
    { id: 9, title: "TT, 10 Days" },
    { id: 10, title: "TT, 20 Days" },
    { id: 11, title: "TT, 30 Days" },
    { id: 12, title: "TT, 60 Days" },
  ]);

  const fetchBooking = async () => {
    try {
      const response = await api.post("/merchandising/fabric/booking/details", {
        id: params.id,
      });
      if (response.status === 200) {
        const booking = response.data.data;
        setFormData(booking);
        setVariationItems(booking.items || []);
        setWorkorder(booking.workorder || {});
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [params.id]);

  const handleFormDataChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      total_price:
        name === "unit_price"
          ? (value * totalBookingQty).toFixed(2)
          : (prev.unit_price * totalBookingQty).toFixed(2),
    }));
  };

  const handleVariationInputChange = (index, field, value) => {
    setVariationItems((prev) => {
      const updated = [...prev];
      updated[index][field] = value;

      if (["consumption", "wastage", "garment_qty"].includes(field)) {
        const qty = parseFloat(updated[index].garment_qty || 0);
        const cons = parseFloat(updated[index].consumption || 0);
        const allow = parseFloat(updated[index].wastage || 0);

        const total = qty * cons;
        const actualTotal = total + (total * allow) / 100;

        updated[index].total = total;
        updated[index].actual_total = actualTotal;
        updated[index].final_qty = actualTotal;
        updated[index].booking_qty = actualTotal;
      }

      return updated;
    });
  };

  const saveBooking = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        items: variationItems,
      };
      const response = await api.post(
        "/merchandising/fabric/booking/update",
        payload
      );
      if (response.status === 200) {
        alert("Booking updated successfully!");
        history.push("/merchandising/fabric-booking-details/" + formData.id);
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        console.error("Error updating booking:", error);
        alert("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  const totalGarmentQty = variationItems.reduce(
    (sum, row) => sum + (Number(row.garment_qty) || 0),
    0
  );
  const totalFabric = variationItems.reduce(
    (sum, row) => sum + (Number(row.total) || 0),
    0
  );
  const totalFinalQty = variationItems.reduce(
    (sum, row) => sum + (Number(row.final_qty) || 0),
    0
  );
  const totalBookingQty = variationItems.reduce(
    (sum, row) => sum + (Number(row.booking_qty) || 0),
    0
  );

  const totalSampleRequiremnt = variationItems.reduce(
    (sum, row) => sum + (Number(row.sample_requirement) || 0),
    0
  );

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      total_price: prev.unit_price * totalBookingQty,
    }));
  }, [totalBookingQty]);

  useEffect(async () => {
    props.setHeaderData({
      pageName: "Edit Booking",
      isNewButton: true,
      newButtonLink: "",
      newButtonText: "New WO",
      isInnerSearch: true,
      innerSearchValue: "",
    });
  }, []);

  return (
    <div className="create_technical_pack">
      <div className="row create_tp_header align-items-center">
        <div className="col-lg-10">
          <div className="row align-items-baseline">
            <div className="col-lg-4">
              <img
                style={{ width: "30px", marginRight: "8px" }}
                src={Logo}
                alt="Logo"
              />
              <span className="purchase_text">
                Edit Booking {formData.item?.title}
              </span>
            </div>
          </div>
        </div>

        <div className="col-lg-2">
          <button
            onClick={saveBooking}
            className="btn btn-default submit_button"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
      <br />
      <div className="create_tp_body">
        <div className="row">
          <div className="col-lg-2">
            <label className="form-label">Buyer</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">
              {workorder.techpack?.buyer?.name || "-"}
            </div>
          </div>
          <div className="col-lg-2">
            <label className="form-label">Tech Pack/Style#</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">
              {workorder.techpack?.techpack_number || "-"}
            </div>
          </div>
          <div className="col-lg-2">
            <label className="form-label">Company</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">
              {workorder.techpack?.company?.title || "-"}
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
            <label className="form-label">Unit</label>
          </div>
          <div className="col-lg-2">
            <select
              value={formData.unit}
              name="unit"
              onChange={(e) => handleFormDataChange("unit", e.target.value)}
            >
              <option value="YDS">YDS</option>
              <option value="MTR">MTR</option>
              <option value="KG">KG</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-2">
            <label className="form-label">Unit Price</label>
          </div>
          <div className="col-lg-2">
            <input
              value={formData.unit_price}
              name="unit_price"
              onChange={(e) =>
                handleFormDataChange("unit_price", e.target.value)
              }
              type="number"
              min={0}
              step={0.1}
            />
          </div>
          <div className="col-lg-2">
            <label className="form-label">Total Amount</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">${formData.total_price}</div>
          </div>
          <div className="col-lg-2">
            <label className="form-label">Supplier</label>
          </div>
          <div className="col-lg-2">
            <div className="form-value">{formData.supplier?.company_name}</div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-2">
            <label className="form-label">LC Terms</label>
          </div>
          <div className="col-lg-2">
            <CustomSelect
              className="select_wo"
              placeholder="LC Terms"
              options={lcTerms.map(({ title }) => ({
                value: title,
                label: title,
              }))}
              value={
                lcTerms
                  .map(({ title }) => ({
                    value: title,
                    label: title,
                  }))
                  .find((opt) => opt.value === formData.lc_term) || null
              }
              onChange={(selectedOption) =>
                handleFormDataChange("lc_term", selectedOption?.value)
              }
            />
          </div>
          <div className="col-lg-2">
            <label className="form-label">ETD</label>
          </div>
          <div className="col-lg-2">
            <input
              value={formData.etd}
              name="etd"
              onChange={(e) => handleFormDataChange("etd", e.target.value)}
              type="date"
            />
          </div>
          <div className="col-lg-2">
            <label className="form-label">ETA</label>
          </div>
          <div className="col-lg-2">
            <input
              value={formData.eta}
              name="eta"
              onChange={(e) => handleFormDataChange("eta", e.target.value)}
              type="date"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-2">
            <label className="form-label">EID</label>
          </div>
          <div className="col-lg-2">
            <input
              value={formData.eid}
              name="eid"
              onChange={(e) => handleFormDataChange("eid", e.target.value)}
              type="date"
            />
          </div>
          <div className="col-lg-2">
            <label className="form-label">Remarks</label>
          </div>
          <div className="col-lg-2">
            <input
              value={formData.remarks}
              name="remarks"
              onChange={(e) => handleFormDataChange("remarks", e.target.value)}
              type="text"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-2">
            <label className="form-label">Po</label>
          </div>
          <div className="col-lg-10">
            <div className="form-value">
              {workorder.pos?.map((item, index) => (
                <Link to={"/purchase-orders/" + item.id} key={index}>
                  {item.po_number}
                  {index !== workorder.pos.length - 1 ? ", " : ""}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="table-responsive mt-3">
          <table className="table table-bordered create_tp_body">
            <thead>
              <tr>
                <th>Garment Color</th>
                <th>Fabric Code/Color</th>
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

                  <td>
                    <input
                      className="form-value"
                      value={item.fabric_code}
                      onChange={(e) =>
                        handleVariationInputChange(
                          index,
                          "fabric_code",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <textarea
                      onChange={(e) =>
                        handleVariationInputChange(
                          index,
                          "fabric_details",
                          e.target.value
                        )
                      }
                      className="form-value"
                      value={item.fabric_details || ""}
                    />
                  </td>
                  <td>
                    <input
                      className="form-value"
                      value={item.width}
                      onChange={(e) =>
                        handleVariationInputChange(
                          index,
                          "width",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>{item.garment_qty}</td>
                  <td>
                    <input
                      className="form-value"
                      type="number"
                      value={item.consumption}
                      onChange={(e) =>
                        handleVariationInputChange(
                          index,
                          "consumption",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>{item.total}</td>
                  <td>
                    <input
                      className="form-value"
                      type="number"
                      value={item.wastage}
                      onChange={(e) =>
                        handleVariationInputChange(
                          index,
                          "wastage",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>{item.final_qty}</td>
                  <td>
                    <input
                      className="form-value"
                      type="number"
                      value={item.booking_qty}
                      onChange={(e) =>
                        handleVariationInputChange(
                          index,
                          "booking_qty",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={item.sample_requirement}
                      className="form-value"
                      onChange={(e) =>
                        handleVariationInputChange(
                          index,
                          "sample_requirement",
                          e.target.value
                        )
                      }
                      type="number"
                      min={0}
                    />
                  </td>
                  <td>
                    <input
                      value={item.comment}
                      className="form-value form-value"
                      onChange={(e) =>
                        handleVariationInputChange(
                          index,
                          "comment",
                          e.target.value
                        )
                      }
                      type="text"
                    />
                  </td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: "right", fontWeight: "bold" }}
                >
                  Total:
                </td>
                <td>{totalGarmentQty}</td>
                <td></td>
                <td>{totalFabric}</td>
                <td></td>
                <td>{totalFinalQty}</td>
                <td>{totalBookingQty}</td>
                <td>{totalSampleRequiremnt}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <br />
      <hr />

      <div className="row">
        <QuailEditor
          content={formData.description}
          onContentChange={(value) =>
            handleFormDataChange("description", value)
          }
        />
      </div>
    </div>
  );
}
