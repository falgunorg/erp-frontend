import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logos/logo-short.png";
import api from "services/api";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
export default function BudgetDetails(props) {
  const params = useParams();

  const [spinner, setSpinner] = useState(false);

  const [itemTypes, setItemTypes] = useState([]);
  const getItemTypes = async () => {
    setSpinner(true);
    var response = await api.post("/item-types");
    if (response.status === 200 && response.data) {
      setItemTypes(response.data.data);
    }
    setSpinner(false);
  };

  useEffect(() => {
    getItemTypes();
  }, []);

  const [budget, setBudget] = useState([]);
  const getBudget = async () => {
    setSpinner(true);
    const response = await api.post("/budgets-show", { id: params.id });
    if (response.status === 200 && response.data) {
      const budgetData = response.data.data;
      setBudget(budgetData);
    }
    setSpinner(false);
  };

  useEffect(() => {
    getBudget();
  }, [params.id]);

  const budgetRef = React.useRef();
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
        pdf.save("download.pdf");
      });
    }, 100); // Slight delay for DOM to reflow
  };

  // const handleGeneratePDF = () => {
  //   const element = document.getElementById("pdf-content");
  //   const responsiveTables = element.querySelectorAll(".table-responsive");

  //   // Temporarily remove overflow
  //   responsiveTables.forEach((table) => {
  //     table.dataset.originalOverflow = table.style.overflow;
  //     table.style.overflow = "visible";
  //   });

  //   html2canvas(element, { useCORS: true, scale: 2 }).then((canvas) => {
  //     // Restore overflow
  //     responsiveTables.forEach((table) => {
  //       table.style.overflow = table.dataset.originalOverflow || "";
  //     });

  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "mm", "a4");

  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  //     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //     pdf.save("download.pdf");
  //   });
  // };

  // const handleGeneratePDF = () => {
  //   const element = document.getElementById("pdf-content");

  //   html2canvas(element).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "mm", "a4");

  //     const imgProps = pdf.getImageProperties(imgData);
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //     pdf.save("download.pdf");
  //   });
  // };

  const isCMType = (item_type_id) => {
    const type = itemTypes.find((t) => t.id === item_type_id);
    return type?.title === "CM";
  };

  return (
    <div className="create_technical_pack" id="pdf-content" ref={budgetRef}>
      <div className="row create_tp_header align-items-center">
        <div className="col-lg-10">
          <div className="row align-items-baseline">
            <div className="col-lg-4">
              <img
                style={{ width: "30px", marginRight: "8px" }}
                src={Logo}
                alt="Logo"
              />
              <span className="purchase_text">Budget</span>
            </div>
            <div className="col-lg-2">
              <label className="form-label">PO Number</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{budget.po?.po_number || "N/A"}</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">WO Number</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">{budget.po?.wo_number || "N/A"}</div>
            </div>
          </div>
        </div>
        <div className="col-lg-2">
          <button
            className="btn btn-default submit_button non_printing_area"
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
                {budget.techpack?.buyer?.name || "N/A"}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Tech Pack#</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {budget.techpack?.techpack_number || "N/A"}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Brand</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">
                {budget.techpack?.brand || "N/A"}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Buyer Style Name</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {budget.techpack?.buyer_style_name || "N/A"}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Season</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">
                {budget.techpack?.season || "N/A"}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Name</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {budget.techpack?.item_name || "N/A"}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Department</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">
                {budget.techpack?.department || "N/A"}
              </div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Type</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {budget.techpack?.item_type || "N/A"}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Factory CPM/Eft</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">{budget.factory_cpm || "N/A"}</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Description</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {budget.techpack?.description || "N/A"}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">FOB</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">{budget.fob || "N/A"}</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Wash Detail</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {budget.techpack?.wash_details || "N/A"}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">CM</label>
            </div>
            <div className="col-lg-3">
              <div className="form-value">{budget.cm || "N/A"}</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Special Operation</label>
            </div>
            <div className="col-lg-5">
              <div className="form-value">
                {budget.techpack?.special_operation || "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="create_tp_materials_area create_tp_body">
        <h6>Material Descriptions</h6>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead style={{ verticalAlign: "middle" }}>
              <tr>
                <th>Item Type</th>
                <th>Item Name</th>
                <th>Item Details</th>
                <th>Supplier</th>
                <th>Color</th>
                <th>Position</th>
                <th>Size</th>
                <th>Unit</th>
                <th>Size From PO</th>
                <th>Quantity</th>
                <th>Actual Cons</th>
                <th>Wastage</th>
                <th>Total Consum- ption</th>
                <th>Total Booking</th>
                <th>Unit Price From Open Budget</th>
                <th>Actual Unit Price</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {budget.items?.length > 0 &&
                budget.items.map((item, index) => {
                  const isCM = isCMType(item.item_type_id);

                  return (
                    <tr key={index}>
                      <td>{item.item_type?.title}</td>
                      <td>{item.item?.title}</td>

                      {isCM ? (
                        <>
                          <td colSpan={14}></td>
                          <td>{item.actual_total_price}</td>
                        </>
                      ) : (
                        <>
                          <td>{item.item_details}</td>
                          <td>{item.supplier?.company_name}</td>
                          <td>{item.color}</td>
                          <td>{item.position}</td>
                          <td>{item.size}</td>
                          <td>{item.unit}</td>
                          <td>{item.size_breakdown}</td>
                          <td>{item.quantity}</td>
                          <td>{item.consumption}</td>
                          <td>{item.wastage}</td>
                          <td>{item.total}</td>
                          <td>{item.total_booking}</td>
                          <td>{item.unit_price}</td>
                          <td>{item.actual_unit_price}</td>
                          <td>{item.actual_total_price}</td>
                        </>
                      )}
                    </tr>
                  );
                })}

              <tr>
                <td colSpan={16}>
                  <strong>FOB</strong>
                </td>
                <td className="text-end">
                  <strong>
                    $
                    {budget.items
                      ?.reduce(
                        (sum, row) =>
                          sum + parseFloat(row.actual_total_price || 0),
                        0
                      )
                      .toFixed(2)}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <br></br>
      </div>
    </div>
  );
}
