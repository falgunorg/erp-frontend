import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logos/logo-short.png";

import api from "services/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import swal from "sweetalert";

import { useParams, useHistory, Link } from "react-router-dom";

export default function WorkOrderDetails() {
  const params = useParams();
  const history = useHistory();

  const [workorder, setWorkorder] = useState({});
  const getWorkorder = async () => {
    const response = await api.post("/workorders-show", { id: params.id });
    if (response.status === 200 && response.data) {
      const data = response.data.workorder;
      setWorkorder(data);
    }
  };

  useEffect(() => {
    getWorkorder();
  }, [params.id]);

  const handleGeneratePDF = () => {
    const element = document.getElementById("pdf-content");
    const responsiveTables = element.querySelectorAll(".table-responsive");

    // Temporarily remove overflow and set height to auto
    responsiveTables.forEach((table) => {
      table.dataset.originalStyle = table.getAttribute("style") || "";
      table.style.overflow = "visible";
      table.style.maxHeight = "unset";
      table.style.height = "auto";
    });

    // Wait for layout to update
    setTimeout(() => {
      html2canvas(element, {
        scale: 2, // High quality
        useCORS: true,
        scrollY: -window.scrollY, // Optional: remove scroll offset
      }).then((canvas) => {
        // Restore original styles
        responsiveTables.forEach((table) => {
          table.setAttribute("style", table.dataset.originalStyle);
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        const fileName = workorder.wo_number;
        pdf.save(`${fileName}.pdf`);
      });
    }, 100); // Slight delay for DOM to reflow
  };

  const [grandTotalOrderQty, setGrandTotalOrderQty] = useState(0);

  useEffect(() => {
    if (workorder?.pos) {
      const total = workorder.pos.reduce((poSum, po) => {
        const itemQtySum = po.items?.reduce((sum, item) => sum + item.qty, 0);
        return poSum + itemQtySum;
      }, 0);
      setGrandTotalOrderQty(total);
    }
  }, [workorder]);

  const openPopUp = () => {
    swal({
      icon: "success",
    });
  };

  

  const allItems = workorder.pos.flatMap((po) => po.items || []);

  // Step 2: Collect sizes with qty > 0
  const sizeSet = new Set();
  allItems.forEach((item) => {
    if (item.qty > 0) {
      sizeSet.add(item.size);
    }
  });
  const displaySizes = Array.from(sizeSet);

  // Step 3: Group by color and accumulate size-wise quantities
  const colorMap = {}; // { color: { total, sizes: { size: qty } } }
  allItems.forEach(({ color, size, qty }) => {
    if (qty <= 0) return;
    if (!colorMap[color]) {
      colorMap[color] = { total: 0, sizes: {} };
    }
    colorMap[color].total += qty;
    colorMap[color].sizes[size] = (colorMap[color].sizes[size] || 0) + qty;
  });

  // Step 4: Calculate grand totals
  let grandTotalQty = 0;
  const grandSizeTotals = {};
  displaySizes.forEach((size) => {
    grandSizeTotals[size] = 0;
  });

  const colorEntries = Object.entries(colorMap);
console.log("SIZE-COLOR", JSON.stringify(colorEntries));


  return (
    <div className="create_technical_pack" id="pdf-content">
      <div className="row create_tp_header align-items-center">
        <div className="col-lg-10">
          <div className="row align-items-baseline">
            <div className="col-lg-4">
              <img
                style={{ width: "30px", marginRight: "8px" }}
                src={Logo}
                alt="Logo"
              />
              <span className="purchase_text">WO</span>
            </div>

            <div className="col-lg-2">
              <label className="form-label">WO Number</label>
            </div>
            <div className="col-lg-6">
              <div className="form-value">{workorder.wo_number}</div>
            </div>
          </div>
        </div>
        <div className="col-lg-2">
          <button
            onClick={handleGeneratePDF}
            className="btn btn-default submit_button"
          >
            {" "}
            PDF{" "}
          </button>
        </div>
      </div>
      <br />
      <div className="row create_tp_body">
        <div className="col-lg-12">
          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Buyer</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">
                {workorder.techpack?.buyer?.name || "N/A"}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Tech Pack#</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                <Link to={"/technical-packages/" + workorder.techpack?.id}>
                  {workorder.techpack?.techpack_number || "N/A"}
                </Link>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Brand</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">
                {workorder.techpack?.brand || "N/A"}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Buyer Style Name</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {workorder.techpack?.buyer_style_name || "N/A"}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Season</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">
                {workorder.techpack?.season || "N/A"}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Name</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {workorder.techpack?.item_name || "N/A"}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Department</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">
                {workorder.techpack?.department || "N/A"}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Type</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {workorder.techpack?.item_type || "N/A"}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Issued Date</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">{workorder.create_date || "N/A"}</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Description</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {workorder.techpack?.description || "N/A"}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Delivery Date</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">
                {workorder.delivery_date || "N/A"}
              </div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Wash Detail</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {workorder.techpack?.wash_details || "N/A"}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Swing SAM</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">{workorder.sewing_sam || "N/A"}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Special Operation</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {workorder.techpack?.special_operation || "N/A"}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">PO'S</label>
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
      </div>

      <br />

      <div
        style={{ padding: "0 15px" }}
        className="create_tp_materials_area create_tp_body"
      >
        <div className="d-flex justify-content-between">
          <h6>Color Wise Size Breakdown</h6>
          <button onClick={openPopUp} className="btn btn-sm btn-warning">
            <i className="fa fa-plus"></i>
          </button>
        </div>

        {workorder.pos?.length > 0 ? (
          (() => {
            // Step 1: Collect items from all POs
            const allItems = workorder.pos.flatMap((po) => po.items || []);

            // Step 2: Collect sizes with qty > 0
            const sizeSet = new Set();
            allItems.forEach((item) => {
              if (item.qty > 0) {
                sizeSet.add(item.size);
              }
            });
            const displaySizes = Array.from(sizeSet);

            // Step 3: Group by color and accumulate size-wise quantities
            const colorMap = {}; // { color: { total, sizes: { size: qty } } }
            allItems.forEach(({ color, size, qty }) => {
              if (qty <= 0) return;
              if (!colorMap[color]) {
                colorMap[color] = { total: 0, sizes: {} };
              }
              colorMap[color].total += qty;
              colorMap[color].sizes[size] =
                (colorMap[color].sizes[size] || 0) + qty;
            });

            // Step 4: Calculate grand totals
            let grandTotalQty = 0;
            const grandSizeTotals = {};
            displaySizes.forEach((size) => {
              grandSizeTotals[size] = 0;
            });

            const colorEntries = Object.entries(colorMap);

            return (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Color</th>
                    <th>Total</th>
                    {displaySizes.map((size) => (
                      <th key={size}>{size}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {colorEntries.map(([color, details], index) => {
                    grandTotalQty += details.total;
                    displaySizes.forEach((size) => {
                      grandSizeTotals[size] += details.sizes[size] || 0;
                    });

                    return (
                      <tr key={color}>
                        <td>{index + 1}</td>
                        <td>{color}</td>
                        <td>{details.total}</td>
                        {displaySizes.map((size) => (
                          <td key={size}>{details.sizes[size] || ""}</td>
                        ))}
                      </tr>
                    );
                  })}

                  {/* Grand Total Row */}
                  <tr className="bg-light">
                    <td colSpan={2}>
                      <strong>Grand Total</strong>
                    </td>
                    <td>
                      <strong>{grandTotalQty}</strong>
                    </td>
                    {displaySizes.map((size) => (
                      <td key={`grand-${size}`}>
                        {grandSizeTotals[size] > 0 ? (
                          <strong>{grandSizeTotals[size]}</strong>
                        ) : (
                          ""
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            );
          })()
        ) : (
          <p>No PO is associated to this WorkOrder</p>
        )}
      </div>

      <div
        style={{ padding: "0 15px" }}
        className="create_tp_materials_area create_tp_body"
      >
        <h6>Material Descriptions</h6>

        {Array.isArray(workorder.costing?.items) &&
        workorder.costing.items.length > 0 ? (
          (() => {
            const grouped = {};

            workorder.costing.items
              .filter((material) => material.item_type?.title !== "CM")
              .forEach((material) => {
                const type = material.item_type?.title || "Others";
                if (!grouped[type]) {
                  grouped[type] = [];
                }
                grouped[type].push(material);
              });

            const itemTypeList = Object.entries(grouped);

            return (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Item Name</th>
                    <th>Item Details</th>
                    <th>Color</th>
                    <th>Size</th>
                    <th>Position</th>
                    <th>Unit</th>
                    <th>Consmp + Wstg</th>
                    <th>
                      WO Required Qty.
                      <br /> (allow included)
                    </th>
                    <th>Supplier</th>
                  </tr>
                </thead>
                <tbody>
                  {itemTypeList.map(([typeTitle, items], groupIndex) => (
                    <React.Fragment key={`group-${groupIndex}`}>
                      <tr className="bg-light">
                        <td className="form-value" colSpan={11}>
                          <strong>{typeTitle}</strong>
                        </td>
                      </tr>
                      {items.map((material, index) => (
                        <tr key={`material-${groupIndex}-${index}`}>
                          <td>{index + 1}</td>
                          <td>{material.item?.title}</td>
                          <td>{material.item_details}</td>
                          <td>{material.color}</td>
                          <td>{material.size}</td>
                          <td>{material.position}</td>
                          <td className="text-lowercase">{material.unit}</td>
                          <td>{material.total}</td>
                          <td>
                            {" "}
                            {(
                              grandTotalOrderQty *
                              parseFloat(material.total || 0)
                            ).toFixed(2)}
                          </td>
                          <td>{material.supplier?.company_name}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            );
          })()
        ) : (
          <p>There is no Costing Added for this Techpack</p>
        )}
      </div>
      <br />

      <table className="table table-bordered">
        <tbody>
          <tr>
            <td>
              <b>PREPARED BY:</b> {workorder.user?.full_name}
            </td>
            <td>
              <b>CHECKED BY:</b>
            </td>
            <td>
              <b>APPROVED BY:</b>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
