import React, { useState } from "react";

const MaterialBookingTemplate = ({ variations, item }) => {
  const [rows, setRows] = useState([
    {
      sl: 1,
      accessoryName: "",
      type: "",
      description: "",
      garmentColor: "",
      accessoryColor: "",
      size: "",
      material: "",
      logoPrint: "",
      pantone: "",
      orderQty: "",
      unit: "pcs",
      wastage: "",
      bookingQty: "",
      supplier: "",
      remarks: "",
    },
  ]);

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    // Auto calculate booking quantity when Order Qty or Wastage changes
    if (field === "orderQty" || field === "wastage") {
      const orderQty = parseFloat(updatedRows[index].orderQty) || 0;
      const wastage = parseFloat(updatedRows[index].wastage) || 0;
      updatedRows[index].bookingQty = (
        orderQty +
        (orderQty * wastage) / 100
      ).toFixed(2);
    }

    setRows(updatedRows);
  };
  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Garment Color & Size</th>
            <th>Garment QTY</th>
            <th>Accessory Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Accessory Color</th>
            <th>Size</th>
            <th>Material</th>
            <th>Logo/Print Details</th>
            <th>Pantone Code</th>
            <th>Position</th>
            <th>Consumption</th>
            <th>Total</th>
            <th>Unit</th>
            <th>Wastage %</th>
            <th>Booking Qty</th>
            <th>Supplier</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {variations.map((row, index) => (
            <tr key={index}>
              <td style={{ minWidth: "100px" }}>
                {row.color} | {row.size}
              </td>
              <td style={{ minWidth: "100px" }}>{row.qty}</td>
              <td style={{ minWidth: "100px" }}>
                <input
                  type="text"
                  value={item.item_name}
                  onChange={(e) =>
                    handleInputChange(index, "accessoryName", e.target.value)
                  }
                />
              </td>
              <td style={{ minWidth: "100px" }}>
                <input
                  type="text"
                  value={row.type}
                  onChange={(e) =>
                    handleInputChange(index, "type", e.target.value)
                  }
                />
              </td>
              <td style={{ minWidth: "100px" }}>
                <textarea
                  style={{ minWidth: "200px", minHeight: "60px" }}
                  value={item.item_details}
                />
              </td>

              <td style={{ minWidth: "100px" }}>
                <input
                  type="text"
                  value={item.color}
                  onChange={(e) =>
                    handleInputChange(index, "accessoryColor", e.target.value)
                  }
                />
              </td>
              <td style={{ minWidth: "100px" }}>
                <input
                  type="text"
                  value={item.size}
                  onChange={(e) =>
                    handleInputChange(index, "size", e.target.value)
                  }
                />
              </td>
              <td style={{ minWidth: "100px" }}>
                <input
                  type="text"
                  value={row.material}
                  onChange={(e) =>
                    handleInputChange(index, "material", e.target.value)
                  }
                />
              </td>
              <td style={{ minWidth: "100px" }}>
                <input
                  type="text"
                  value={row.logoPrint}
                  onChange={(e) =>
                    handleInputChange(index, "logoPrint", e.target.value)
                  }
                />
              </td>
              <td style={{ minWidth: "100px" }}>
                <input
                  type="text"
                  value={row.pantone}
                  onChange={(e) =>
                    handleInputChange(index, "pantone", e.target.value)
                  }
                />
              </td>
              <td style={{ minWidth: "100px" }}>
                <input
                  type="text"
                  value={item.position}
                  onChange={(e) =>
                    handleInputChange(index, "position", e.target.value)
                  }
                />
              </td>
              <td style={{ minWidth: "100px" }}>
                <input
                  type="number"
                  value={item.consumption}
                  onChange={(e) =>
                    handleInputChange(index, "orderQty", e.target.value)
                  }
                />
              </td>
              <td style={{ minWidth: "100px" }}>
                <input readOnly type="number" value={row.total} />
              </td>
              <td style={{ minWidth: "100px" }}>
                <input
                  type="text"
                  value={item.unit}
                  onChange={(e) =>
                    handleInputChange(index, "unit", e.target.value)
                  }
                />
              </td>
              <td style={{ minWidth: "100px" }}>
                <input
                  type="number"
                  value={item.wastage}
                  onChange={(e) =>
                    handleInputChange(index, "wastage", e.target.value)
                  }
                />
              </td>
              <td style={{ minWidth: "100px" }}>
                <input type="text" value={row.bookingQty} readOnly />
              </td>
              <td style={{ minWidth: "100px" }}>
                <input
                  type="text"
                  value={item.supplier_id}
                  onChange={(e) =>
                    handleInputChange(index, "supplier", e.target.value)
                  }
                />
              </td>
              <td style={{ minWidth: "100px" }}>
                <input
                  type="text"
                  value={row.remarks}
                  onChange={(e) =>
                    handleInputChange(index, "remarks", e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaterialBookingTemplate;
