import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logos/logo-short.png";
import Select, { components } from "react-select";
import MultipleFileInput from "./MultipleFileInput";
import api from "services/api";
import html2pdf from "html2pdf.js";

export default function PurchaseOrderDetails(props) {
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="9"
          height="7"
          viewBox="0 0 9 7"
        >
          <path
            id="Polygon_60"
            data-name="Polygon 60"
            d="M3.659,1.308a1,1,0,0,1,1.682,0L8.01,5.459A1,1,0,0,1,7.168,7H1.832A1,1,0,0,1,.99,5.459Z"
            transform="translate(9 7) rotate(180)"
            fill="#707070"
          />
        </svg>
      </components.DropdownIndicator>
    );
  };
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "none",
      border: "none",
      minHeight: "21px",
      fontSize: "12px",
      height: "21px",
      background: "#ECECEC",
      lineHeight: "19px",
      boxShadow: "inset 0px 0px 6px rgba(0, 0, 0, 0.18)",
      boxShadow: state.isFocused ? "" : "",
    }),

    valueContainer: (provided, state) => ({
      ...provided,
      height: "21px",
      padding: "0 6px",
    }),

    input: (provided, state) => ({
      ...provided,
      margin: "0px",
      fontSize: "12px", // Ensure input text is also 12px
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),

    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: "21px",
    }),

    menu: (provided) => ({
      ...provided,
      fontSize: "12px", // Set menu font size to 12px
      padding: "3px", // Ensure padding is a maximum of 3px
    }),

    option: (provided, state) => ({
      ...provided,
      fontSize: "12px", // Ensure each option has 12px font size
      padding: "3px", // Limit option padding to 3px
      backgroundColor: state.isSelected
        ? "#ef9a3e"
        : state.isFocused
        ? "#f0f0f0"
        : "#fff",
      color: state.isSelected ? "#fff" : "#333",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#ef9a3e",
        color: "#fff",
      },
    }),
  };

  const [selectedTechpackFiles, setSelectedTechpackFiles] = useState([
    { id: 1, name: "Attatchment 1" },
    { id: 2, name: "Attatchment 2" },
    { id: 3, name: "Attatchment 3" },
    { id: 4, name: "Attatchment 4" },
  ]);
  const [spinner, setSpinner] = useState(false);

  const [sizes, setSizes] = useState([]);
  const getSizes = async () => {
    setSpinner(true);
    var response = await api.post("/sizes");
    if (response.status === 200 && response.data) {
      setSizes(response.data.data);
    }
    setSpinner(false);
  };

  const [colors, setColors] = useState([]);
  const getColors = async () => {
    setSpinner(true);
    var response = await api.post("/colors");
    if (response.status === 200 && response.data) {
      setColors(response.data.data);
    }
    setSpinner(false);
  };

  useEffect(() => {
    getSizes();
    getColors();
  }, []);

  const [poItems, setPoItems] = useState([
    {
      id: 1,
      color: "Red",
      size: 24,
      inseam: "20",
      quantity: 500,
      fob: 15,
      total: 7500,
    },
    {
      id: 2,
      color: "Pink",
      size: 24,
      inseam: "20",
      quantity: 500,
      fob: 15,
      total: 7500,
    },
    {
      id: 3,
      color: "Green",
      size: 24,
      inseam: "20",
      quantity: 500,
      fob: 15,
      total: 7500,
    },
    {
      id: 4,
      color: "Black",
      size: 24,
      inseam: "20",
      quantity: 500,
      fob: 15,
      total: 7500,
    },

    {
      id: 5,
      color: "Red",
      size: 24,
      inseam: "20",
      quantity: 500,
      fob: 15,
      total: 7500,
    },
  ]);

  const handleAddItem = () => {
    setPoItems([
      ...poItems,
      {
        color: "",
        size: "",
        inseam: "",
        quantity: "",
        fob: "",
        total: 0,
      },
    ]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...poItems];
    updatedItems[index][field] = value;

    // Calculate total if quantity or fob changes
    if (field === "quantity" || field === "fob") {
      const quantity = parseFloat(updatedItems[index].quantity) || 0;
      const fob = parseFloat(updatedItems[index].fob) || 0;
      updatedItems[index].total = quantity * fob;
    }

    setPoItems(updatedItems);
  };

  const removeRow = (index) => {
    const updatedItems = [...poItems];
    updatedItems.splice(index, 1);
    setPoItems(updatedItems);
  };

  const totalQuantity = poItems.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );
  const grandTotalFob = poItems.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );

  const poRef = React.useRef();
  const handleGeneratePDF = () => {
    const element = poRef.current;
    const opt = {
      margin: 0.2,
      filename: "cost-sheet.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="create_technical_pack" ref={poRef}>
      <div className="row create_tp_header align-items-center">
        <div className="col-lg-10">
          <div className="row align-items-baseline">
            <div className="col-lg-4">
              <img
                style={{ width: "30px", marginRight: "8px" }}
                src={Logo}
                alt="Logo"
              />
              <span className="purchase_text">PO</span>
            </div>
            <div className="col-lg-2">
              <label className="form-label">PO Number</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">#PONXT5875</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">WO Number</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">#WONXT5875</div>
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
      <div style={{ padding: "0 15px" }} className="row create_tp_body">
        <div className="col-lg-12">
          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">PO Issue</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">23/04/2025</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Tech Pack</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">#TPNXT5875</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Destination</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">Turkey</div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">PO Delivery</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">25/12/2025</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Buyer Style Name</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">Chino short</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Ship Mode</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">Ocean</div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">PC/LC</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">#PCNXT548</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Name</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">Ps Trouser</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Terms of Shipping</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">Terms Of Payment</div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Factory</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">MCL</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Item Type</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">Bottom</div>
            </div>
            <div className="col-lg-2">
              <label className="form-label">Packing Method</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">Flat Packing</div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Buyer</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">NSLBD</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Department</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">Mens</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Payment Terms</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">New Payment terms</div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Brand</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">NEXT</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Wash Detail</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">Silicon Wash</div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Total Quantity</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">5000</div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Season</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">S25</div>
            </div>

            <div className="col-lg-2"></div>
            <div className="col-lg-2"></div>

            <div className="col-lg-2">
              <label className="form-label">Total Value</label>
            </div>
            <div className="col-lg-2">
              <div className="form-value">$500000</div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
              <label className="form-label">Description</label>
            </div>
            <div className="col-lg-4">
              <div className="form-value">
                97% Cotton 3% Elastane Ps Chino Trouser
              </div>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Special Operation</label>
            </div>
            <div className="col-lg-4">
              <div className="form-value">Printing, Diyeing, Embroadary</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 15px" }} className="create_tp_attatchment">
        <MultipleFileInput
          label="PO Attachments"
          inputId="buyer_techpacks"
          selectedFiles={selectedTechpackFiles}
          setSelectedFiles={setSelectedTechpackFiles}
        />
      </div>
      <br />
      <div
        style={{ padding: "0 15px" }}
        className="create_tp_materials_area create_tp_body"
      >
        <div className="d-flex justify-content-between">
          <h6>PO Details</h6>
        </div>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Color</th>
              <th>Size</th>
              <th>Inseam</th>
              <th>Quantity</th>
              <th>FOB</th>
              <th>Total FOB</th>
            </tr>
          </thead>
          <tbody>
            {poItems.map((item, index) => (
              <tr key={index}>
                <td>{item.color}</td>
                <td>{item.size}</td>
                <td>{item.inseam}</td>
                <td>{item.quantity}</td>
                <td>{item.fob}</td>
                <td>{item.total}</td>
              </tr>
            ))}
            <br />

            {/* GRAND TOTAL */}
            <tr>
              <td>
                <strong>Grand Total</strong>
              </td>
              <td></td>
              <td></td>
              <td>
                <strong>{totalQuantity}</strong>
              </td>
              <td></td>
              <td>
                <strong>{grandTotalFob.toFixed(2)}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <br></br>
      <br></br>

      <table className="table table-bordered">
        <tbody>
          <tr>
            <td>
              <b>Merchant:</b> Anik Das{" "}
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
  );
}
