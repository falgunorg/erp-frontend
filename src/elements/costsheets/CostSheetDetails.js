import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logos/logo-short.png";
import api from "services/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ArrowRightIcon, ArrowDownIcon } from "../../elements/SvgIcons";
import { useParams } from "react-router-dom";

export default function CreateCostSheet(props) {
  const params = useParams();
  const [spinner, setSpinner] = useState(false);

  const [costing, setCosting] = useState([]);
  const getCosting = async () => {
    setSpinner(true);
    const response = await api.post("/merchandising/costings-show", { id: params.id });
    if (response.status === 200 && response.data) {
      const costingData = response.data.data;
      setCosting(costingData);

      // Group items by item_type_id
      const groupedItems = {};
      for (const item of costingData.items) {
        if (!groupedItems[item.item_type_id]) {
          groupedItems[item.item_type_id] = [];
        }

        groupedItems[item.item_type_id].push({
          ...item,
        });
      }
      setConsumptionItems(groupedItems);
    }
    setSpinner(false);
  };

  useEffect(() => {
    getCosting();
  }, [params.id]);

  const [itemTypes, setItemTypes] = useState([]);
  const getItemTypes = async () => {
    setSpinner(true);
    var response = await api.post("/common/item-types");
    if (response.status === 200 && response.data) {
      setItemTypes(response.data.data);
    }
    setSpinner(false);
  };

  useEffect(() => {
    getItemTypes();
  }, []);

  const [collapsedItemTypes, setCollapsedItemTypes] = useState({}); // Track collapsed state

  const toggleItemType = (itemTypeId) => {
    setCollapsedItemTypes((prev) => ({
      ...prev,
      [itemTypeId]: !prev[itemTypeId], // Toggle collapse state
    }));
  };

  const [consumptionItems, setConsumptionItems] = useState({});
  const getGroupTotalPrice = (itemTypeId) => {
    const items = consumptionItems[itemTypeId] || [];
    return items
      .reduce((sum, item) => {
        const totalPrice = parseFloat(item.total_price) || 0;
        return sum + totalPrice;
      }, 0)
      .toFixed(2);
  };

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

        const fileName = costing.costing_ref;
        pdf.save(`${fileName}.pdf`);
      });
    }, 100); // Slight delay for DOM to reflow
  };
  const getGrandTotalFob = () => {
    const items = Object.values(consumptionItems).flat();
    return items
      .reduce((sum, item) => {
        const totalPrice = parseFloat(item.total_price) || 0;
        return sum + totalPrice;
      }, 0)
      .toFixed(2);
  };

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
              <span className="purchase_text">Cost Sheet</span>
            </div>
            <div className="col-lg-2">
              <label className="form-label">PO Number</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{costing.po?.po_number || "N/A"}</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">WO Number</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{costing.po?.wo_number || "N/A"}</div>
            </div>
          </div>
        </div>
        <div className="col-lg-2">
          <button
            className="btn btn-default submit_button"
            onClick={handleGeneratePDF}
          >
            PDF
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
                {costing.techpack?.buyer?.name || "N/A"}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Tech Pack#</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {costing.techpack?.techpack_number || "N/A"}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Brand</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">
                {costing.techpack?.brand || "N/A"}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Buyer Style Name</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {costing.techpack?.buyer_style_name || "N/A"}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Season</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">
                {costing.techpack?.season || "N/A"}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Name</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {costing.techpack?.item_name || "N/A"}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Department</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">
                {costing.techpack?.department || "N/A"}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Type</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {costing.techpack?.item_type || "N/A"}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Factory CPM/Eft</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">{costing.factory_cpm || "N/A"}</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Description</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {costing.techpack?.description || "N/A"}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">FOB</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">{costing.fob || "N/A"}</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Wash Detail</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {costing.techpack?.wash_details || "N/A"}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">CM</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">{costing.cm || "N/A"}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Special Operation</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {(() => {
                  try {
                    const ops = JSON.parse(costing.techpack?.special_operation);
                    return Array.isArray(ops) ? ops.join(", ") : "";
                  } catch {
                    return "";
                  }
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />

      <div className="create_tp_materials_area create_tp_body">
        <h6>Material Descriptions</h6>
        <table className="table table-bordered">
          <thead style={{ verticalAlign: "middle" }}>
            <tr>
              <th>Item Type</th>
              <th>Item Name</th>
              <th>Item Details</th>
              <th>Color</th>
              <th>Size</th>
              <th>Position</th>
              <th>Supplier</th>
              <th>
                Consum <br />+ Wastage
              </th>
              <th>Unit Price</th>
              <th>Price Total</th>
            </tr>
          </thead>
          <tbody>
            {itemTypes.map((itemType) => (
              <React.Fragment key={itemType.id}>
                <tr>
                  <td
                    colSpan={13}
                    style={{
                      background: "#ECECEC",
                      cursor: "pointer",
                      height: "20px",
                    }}
                  >
                    <div
                      className="itemType"
                      style={{
                        padding: "0 5px",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "5px",
                        alignItems: "center",
                        fontSize: "12px",
                      }}
                    >
                      <div>
                        <span
                          onClick={() => toggleItemType(itemType.id)}
                          style={{ cursor: "pointer" }}
                        >
                          {collapsedItemTypes[itemType.id] ? (
                            <ArrowRightIcon />
                          ) : (
                            <ArrowDownIcon />
                          )}
                        </span>{" "}
                        <span
                          onClick={() => toggleItemType(itemType.id)}
                          className="me-2"
                        >
                          <strong>{itemType.title}</strong>
                        </span>
                      </div>
                      <div>
                        <strong>$ {getGroupTotalPrice(itemType.id)}</strong>
                      </div>
                    </div>
                  </td>
                </tr>

                {!collapsedItemTypes[itemType.id] &&
                  (consumptionItems[itemType.id] || []).map((item, index) => (
                    <tr key={`${itemType.id}-${index}`}>
                      <td>{item.item?.title}</td>
                      {itemType.title === "CM" ? (
                        <>
                          <td colSpan={8}></td>
                          <td className="text-end">{item.total_price}</td>
                        </>
                      ) : (
                        <>
                          <td>{item.item_name}</td>
                          <td>{item.item_details}</td>
                          <td>{item.color}</td>
                          <td>{item.size}</td>
                          <td>{item.position}</td>
                          <td>{item.supplier?.company_name}</td>
                          <td>
                            {item.consumption} + {item.wastage} %
                          </td>
                          <td>
                            $ {item.unit_price} {item.unit}
                          </td>
                          <td className="text-end">{item.total_price}</td>
                        </>
                      )}
                    </tr>
                  ))}
              </React.Fragment>
            ))}

            <tr>
              <td colSpan={9}>
                <strong>FOB</strong>
              </td>
              <td className="text-end">
                <strong>$ {getGrandTotalFob()}</strong>
              </td>
            </tr>
          </tbody>
        </table>
        <br></br>
        <br></br>

        <table className="table table-bordered">
          <tbody>
            <tr>
              <td>
                <b>Merchant:</b> {costing.user?.full_name}
              </td>
              <td>
                <b>FG ID:</b>
              </td>
              <td>
                <b>FG Pass:</b>
              </td>
              <td>
                <b>Buyer Confirmation Mail:</b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
