import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import Dropdown from "react-bootstrap/Dropdown";
import {
  FilterIcon,
  ArrowRightIcon,
  ToggleCheckboxIcon,
  ToggleCheckboxActiveIcon,
} from "../elements/SvgIcons"; 

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import CreateCostSheet from "elements/costsheets/CreateCostSheet";
import CostSheetDetails from "elements/costsheets/CostSheetDetails";
import EditCostSheet from "elements/costsheets/EditCostSheet";

export default function CostSheets(props) {
  const [renderArea, setRenderArea] = useState("blank");

  const handleExportPDF = () => {
    const input = document.querySelector(".po_print_area");

    html2canvas(input, {
      scale: 2,
      useCORS: true, // Ensure external images are loaded
      allowTaint: true,
      logging: false, // Remove unnecessary console logs
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      // Calculate the PDF height based on content
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("purchase_order.pdf");
    });
  };

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
      fontSize: "15px",
      height: "21px",
      background: "#ECECEC",
      lineHeight: "100%",
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
    }),
    indicatorSeparator: (state) => ({
      display: "none",
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: "21px",
    }),
  };

  const [workOrders, setWorkOrders] = useState(
    Array.from({ length: 50 }, (_, index) => {
      const serial = String(index + 1).padStart(2, "0");
      return { value: `WONXF1JM${serial}`, label: `WONXF1JM${serial}` };
    })
  );

  const [sizes, setSizes] = useState(
    Array.from({ length: 15 }, (_, index) => {
      const serial = String(index + 1).padStart(2, "0");
      return { value: `Size-${serial}`, label: `Size-${serial}` };
    })
  );

  useEffect(async () => {
    props.setHeaderData({
      pageName: "Cost Sheets",
      isNewButton: true,
      newButtonLink: "",
      newButtonText: "New TP",
      isInnerSearch: true,
      innerSearchValue: "",
    });
  }, []);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = (monthIndex, year) => {
    const days = new Date(year, monthIndex + 1, 0).getDate(); // Get total days in month
    return Array.from(
      { length: days },
      (_, i) => `${monthIndex + 1}/${i + 1}/${year % 100}`
    ); // Format as MM/DD/YY
  };

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [days, setDays] = useState([]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setDays(getDaysInMonth(selectedMonth, currentYear));
  }, [selectedMonth]);
  const [viewTab, setViewTab] = useState("All");

  const [markAble, setMarkAble] = useState(false);

  const toggleMarkAble = () => {
    setMarkAble(!markAble);
  };

  return (
    <div className="purchase_order_page">
      <div className="purchase_action_header non_printing_area">
        <div className="actions_left">
          <button onClick={() => setRenderArea("add")} className="active">
            New CS
          </button>

          <button
            disabled={renderArea !== "details"}
            onClick={() => setRenderArea("update")}
          >
            Edit
          </button>
          <button disabled={renderArea !== "details"}>Delete</button>
        </div>
      </div>

      <div className="technical_package_layout purchase_order_page_when_print">
        <div className="purchase_sidebar">
          <div className="email-section">
            <div className="folder_name">Department</div>
            <ul>
              <li>
                <button className="active">
                  Men <span>63</span>
                </button>
              </li>
              <li>
                <button className="">
                  Women <span>63</span>
                </button>
              </li>
              <li>
                <button className="">
                  School Wear <span>63</span>
                </button>
              </li>
              <li>
                <button className="">
                  Kids <span>63</span>
                </button>
              </li>
            </ul>
          </div>
          <div className="email-section">
            <div className="folder_name">Purchase Contract</div>
            <ul>
              <li>
                <button className="active">
                  SS25 <span>63</span>
                </button>
              </li>
              <li>
                <button className="">
                  AW25 <span>63</span>
                </button>
              </li>
              <li>
                <button className="">
                  School Wear <span>63</span>
                </button>
              </li>
              <li>
                <button className="">
                  Kids <span>63</span>
                </button>
              </li>
            </ul>
          </div>
          <div className="email-section">
            <div className="folder_name">Styles</div>
            <Select
              className="select_wo"
              placeholder="Search Or Select"
              options={workOrders}
              styles={customStyles}
              components={{ DropdownIndicator }}
            />
          </div>

          <div className="email-section">
            <div className="folder_name">Ext. Factory Date</div>

            <Select
              className="select_wo"
              placeholder="Search Or Select"
              options={months.map((month, index) => ({
                label: month,
                value: index,
              }))}
              components={{ DropdownIndicator }}
              styles={customStyles}
              onChange={(selected) => setSelectedMonth(selected.value)}
            />

            <br />
            <ul>
              {days.map((day, index) => (
                <li key={index}>
                  <button>
                    {day} <span>3</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="purchase_list">
          <div className="purchase_list_header d-flex justify-content-between">
            <div className="purchase_header_left">
              <div className="title">
                <input type="checkbox" style={{ marginTop: "3px" }} /> CS View
              </div>

              <div className="buttons_group">
                <button
                  className={viewTab === "All" ? "active" : ""}
                  onClick={() => setViewTab("All")}
                >
                  All
                </button>
                <button
                  className={viewTab === "Urgent" ? "active" : ""}
                  onClick={() => setViewTab("Urgent")}
                >
                  Urgent
                </button>
                <button
                  className={viewTab === "Unassigned WO" ? "active" : ""}
                  onClick={() => setViewTab("Unassigned WO")}
                >
                  Unassigned WO
                </button>
              </div>
            </div>
            <div className="purchase_header_left">
              <span
                onClick={toggleMarkAble}
                className="toggleSelect"
                style={{ cursor: "pointer" }}
              >
                {markAble ? (
                  <ToggleCheckboxActiveIcon />
                ) : (
                  <ToggleCheckboxIcon />
                )}
              </span>

              <Dropdown className="purchase_filter_dropdown">
                <Dropdown.Toggle
                  id="dropdown-button-dark-example1"
                  variant="secondary"
                >
                  <FilterIcon />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>Buyer</Dropdown.Item>
                  <Dropdown.Item>PC</Dropdown.Item>
                  <Dropdown.Item>WO</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          <div className="tp_list">
            <div className="group">
              <div className="group-header">
                <span className="me-2">
                  <ArrowRightIcon />
                </span>
                Mens
              </div>
              <div className="group-tps">
                <div
                  onClick={() => setRenderArea("details")}
                  className="single_tp_item"
                >
                  <div className="tp_text d-flex align-items-center">
                    <span
                      className="marker"
                      style={{ width: "20px", display: "inline-block" }}
                    >
                      {markAble ? (
                        <input type="checkbox" />
                      ) : (
                        <ArrowRightIcon />
                      )}
                    </span>
                    <span className="me-2">TPNXT01245</span>
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    Menswear 20 PRT Belt FGray ST dsad jsadksadsioau disopajdi
                    sadjisa
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    N96472
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    FGTRIAL
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    1000 PCS
                  </div>
                  <div className="tp_text d-flex justify-content-between align-items-center">
                    <div>
                      <span className="step_border"></span>
                      <span className="date area me-2">12/23/2025</span>
                    </div>

                    <div className="icon_area">
                      <svg
                        className="me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="13"
                        viewBox="0 0 12 13"
                      >
                        <path
                          id="Polygon_170"
                          data-name="Polygon 170"
                          d="M5.548,2.965a1,1,0,0,1,1.9,0L8.587,6.5a1,1,0,0,0,.178.328l2.44,2.981a1,1,0,0,1-.979,1.612L6.7,10.683a1,1,0,0,0-.41,0l-3.522.737a1,1,0,0,1-.979-1.612l2.44-2.981A1,1,0,0,0,4.413,6.5Z"
                          transform="translate(12) rotate(90)"
                          fill="#ff4a4a"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="11"
                        viewBox="0 0 11 11"
                      >
                        <rect
                          id="Rectangle_184"
                          data-name="Rectangle 184"
                          width="11"
                          height="11"
                          rx="1"
                          fill="#91cfff"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => setRenderArea("details")}
                  className="single_tp_item"
                >
                  <div className="tp_text d-flex align-items-center">
                    <span
                      className="marker"
                      style={{ width: "20px", display: "inline-block" }}
                    >
                      {markAble ? (
                        <input type="checkbox" />
                      ) : (
                        <ArrowRightIcon />
                      )}
                    </span>
                    <span className="me-2">TPNXT01245</span>
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    Menswear 20 PRT Belt FGray ST dsad jsadksadsioau disopajdi
                    sadjisa
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    N96472
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    FGTRIAL
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    1000 PCS
                  </div>
                  <div className="tp_text d-flex justify-content-between align-items-center">
                    <div>
                      <span className="step_border"></span>
                      <span className="date area me-2">12/23/2025</span>
                    </div>

                    <div className="icon_area">
                      <svg
                        className="me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="13"
                        viewBox="0 0 12 13"
                      >
                        <path
                          id="Polygon_170"
                          data-name="Polygon 170"
                          d="M5.548,2.965a1,1,0,0,1,1.9,0L8.587,6.5a1,1,0,0,0,.178.328l2.44,2.981a1,1,0,0,1-.979,1.612L6.7,10.683a1,1,0,0,0-.41,0l-3.522.737a1,1,0,0,1-.979-1.612l2.44-2.981A1,1,0,0,0,4.413,6.5Z"
                          transform="translate(12) rotate(90)"
                          fill="#ff4a4a"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="11"
                        viewBox="0 0 11 11"
                      >
                        <rect
                          id="Rectangle_184"
                          data-name="Rectangle 184"
                          width="11"
                          height="11"
                          rx="1"
                          fill="#91cfff"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => setRenderArea("details")}
                  className="single_tp_item"
                >
                  <div className="tp_text d-flex align-items-center">
                    <span
                      className="marker"
                      style={{ width: "20px", display: "inline-block" }}
                    >
                      {markAble ? (
                        <input type="checkbox" />
                      ) : (
                        <ArrowRightIcon />
                      )}
                    </span>
                    <span className="me-2">TPNXT01245</span>
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    Menswear 20 PRT Belt FGray ST dsad jsadksadsioau disopajdi
                    sadjisa
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    N96472
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    FGTRIAL
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    1000 PCS
                  </div>
                  <div className="tp_text d-flex justify-content-between align-items-center">
                    <div>
                      <span className="step_border"></span>
                      <span className="date area me-2">12/23/2025</span>
                    </div>

                    <div className="icon_area">
                      <svg
                        className="me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="13"
                        viewBox="0 0 12 13"
                      >
                        <path
                          id="Polygon_170"
                          data-name="Polygon 170"
                          d="M5.548,2.965a1,1,0,0,1,1.9,0L8.587,6.5a1,1,0,0,0,.178.328l2.44,2.981a1,1,0,0,1-.979,1.612L6.7,10.683a1,1,0,0,0-.41,0l-3.522.737a1,1,0,0,1-.979-1.612l2.44-2.981A1,1,0,0,0,4.413,6.5Z"
                          transform="translate(12) rotate(90)"
                          fill="#ff4a4a"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="11"
                        viewBox="0 0 11 11"
                      >
                        <rect
                          id="Rectangle_184"
                          data-name="Rectangle 184"
                          width="11"
                          height="11"
                          rx="1"
                          fill="#91cfff"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => setRenderArea("details")}
                  className="single_tp_item"
                >
                  <div className="tp_text d-flex align-items-center">
                    <span
                      className="marker"
                      style={{ width: "20px", display: "inline-block" }}
                    >
                      {markAble ? (
                        <input type="checkbox" />
                      ) : (
                        <ArrowRightIcon />
                      )}
                    </span>
                    <span className="me-2">TPNXT01245</span>
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    Menswear 20 PRT Belt FGray ST dsad jsadksadsioau disopajdi
                    sadjisa
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    N96472
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    FGTRIAL
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    1000 PCS
                  </div>
                  <div className="tp_text d-flex justify-content-between align-items-center">
                    <div>
                      <span className="step_border"></span>
                      <span className="date area me-2">12/23/2025</span>
                    </div>

                    <div className="icon_area">
                      <svg
                        className="me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="13"
                        viewBox="0 0 12 13"
                      >
                        <path
                          id="Polygon_170"
                          data-name="Polygon 170"
                          d="M5.548,2.965a1,1,0,0,1,1.9,0L8.587,6.5a1,1,0,0,0,.178.328l2.44,2.981a1,1,0,0,1-.979,1.612L6.7,10.683a1,1,0,0,0-.41,0l-3.522.737a1,1,0,0,1-.979-1.612l2.44-2.981A1,1,0,0,0,4.413,6.5Z"
                          transform="translate(12) rotate(90)"
                          fill="#ff4a4a"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="11"
                        viewBox="0 0 11 11"
                      >
                        <rect
                          id="Rectangle_184"
                          data-name="Rectangle 184"
                          width="11"
                          height="11"
                          rx="1"
                          fill="#91cfff"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="group">
              <div className="group-header">
                <span className="me-2">
                  <ArrowRightIcon />
                </span>
                Womens
              </div>
              <div className="group-tps">
                <div
                  onClick={() => setRenderArea("details")}
                  className="single_tp_item"
                >
                  <div className="tp_text d-flex align-items-center">
                    <span
                      className="marker"
                      style={{ width: "20px", display: "inline-block" }}
                    >
                      {markAble ? (
                        <input type="checkbox" />
                      ) : (
                        <ArrowRightIcon />
                      )}
                    </span>
                    <span className="me-2">TPNXT01245</span>
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    Menswear 20 PRT Belt FGray ST dsad jsadksadsioau disopajdi
                    sadjisa
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    N96472
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    FGTRIAL
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    1000 PCS
                  </div>
                  <div className="tp_text d-flex justify-content-between align-items-center">
                    <div>
                      <span className="step_border"></span>
                      <span className="date area me-2">12/23/2025</span>
                    </div>

                    <div className="icon_area">
                      <svg
                        className="me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="13"
                        viewBox="0 0 12 13"
                      >
                        <path
                          id="Polygon_170"
                          data-name="Polygon 170"
                          d="M5.548,2.965a1,1,0,0,1,1.9,0L8.587,6.5a1,1,0,0,0,.178.328l2.44,2.981a1,1,0,0,1-.979,1.612L6.7,10.683a1,1,0,0,0-.41,0l-3.522.737a1,1,0,0,1-.979-1.612l2.44-2.981A1,1,0,0,0,4.413,6.5Z"
                          transform="translate(12) rotate(90)"
                          fill="#ff4a4a"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="11"
                        viewBox="0 0 11 11"
                      >
                        <rect
                          id="Rectangle_184"
                          data-name="Rectangle 184"
                          width="11"
                          height="11"
                          rx="1"
                          fill="#91cfff"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => setRenderArea("details")}
                  className="single_tp_item"
                >
                  <div className="tp_text d-flex align-items-center">
                    <span
                      className="marker"
                      style={{ width: "20px", display: "inline-block" }}
                    >
                      {markAble ? (
                        <input type="checkbox" />
                      ) : (
                        <ArrowRightIcon />
                      )}
                    </span>
                    <span className="me-2">TPNXT01245</span>
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    Menswear 20 PRT Belt FGray ST dsad jsadksadsioau disopajdi
                    sadjisa
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    N96472
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    FGTRIAL
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    1000 PCS
                  </div>
                  <div className="tp_text d-flex justify-content-between align-items-center">
                    <div>
                      <span className="step_border"></span>
                      <span className="date area me-2">12/23/2025</span>
                    </div>

                    <div className="icon_area">
                      <svg
                        className="me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="13"
                        viewBox="0 0 12 13"
                      >
                        <path
                          id="Polygon_170"
                          data-name="Polygon 170"
                          d="M5.548,2.965a1,1,0,0,1,1.9,0L8.587,6.5a1,1,0,0,0,.178.328l2.44,2.981a1,1,0,0,1-.979,1.612L6.7,10.683a1,1,0,0,0-.41,0l-3.522.737a1,1,0,0,1-.979-1.612l2.44-2.981A1,1,0,0,0,4.413,6.5Z"
                          transform="translate(12) rotate(90)"
                          fill="#ff4a4a"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="11"
                        viewBox="0 0 11 11"
                      >
                        <rect
                          id="Rectangle_184"
                          data-name="Rectangle 184"
                          width="11"
                          height="11"
                          rx="1"
                          fill="#91cfff"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => setRenderArea("details")}
                  className="single_tp_item"
                >
                  <div className="tp_text d-flex align-items-center">
                    <span
                      className="marker"
                      style={{ width: "20px", display: "inline-block" }}
                    >
                      {markAble ? (
                        <input type="checkbox" />
                      ) : (
                        <ArrowRightIcon />
                      )}
                    </span>
                    <span className="me-2">TPNXT01245</span>
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    Menswear 20 PRT Belt FGray ST dsad jsadksadsioau disopajdi
                    sadjisa
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    N96472
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    FGTRIAL
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    1000 PCS
                  </div>
                  <div className="tp_text d-flex justify-content-between align-items-center">
                    <div>
                      <span className="step_border"></span>
                      <span className="date area me-2">12/23/2025</span>
                    </div>

                    <div className="icon_area">
                      <svg
                        className="me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="13"
                        viewBox="0 0 12 13"
                      >
                        <path
                          id="Polygon_170"
                          data-name="Polygon 170"
                          d="M5.548,2.965a1,1,0,0,1,1.9,0L8.587,6.5a1,1,0,0,0,.178.328l2.44,2.981a1,1,0,0,1-.979,1.612L6.7,10.683a1,1,0,0,0-.41,0l-3.522.737a1,1,0,0,1-.979-1.612l2.44-2.981A1,1,0,0,0,4.413,6.5Z"
                          transform="translate(12) rotate(90)"
                          fill="#ff4a4a"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="11"
                        viewBox="0 0 11 11"
                      >
                        <rect
                          id="Rectangle_184"
                          data-name="Rectangle 184"
                          width="11"
                          height="11"
                          rx="1"
                          fill="#91cfff"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => setRenderArea("details")}
                  className="single_tp_item"
                >
                  <div className="tp_text d-flex align-items-center">
                    <span
                      className="marker"
                      style={{ width: "20px", display: "inline-block" }}
                    >
                      {markAble ? (
                        <input type="checkbox" />
                      ) : (
                        <ArrowRightIcon />
                      )}
                    </span>
                    <span className="me-2">TPNXT01245</span>
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    Menswear 20 PRT Belt FGray ST dsad jsadksadsioau disopajdi
                    sadjisa
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    N96472
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    FGTRIAL
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    1000 PCS
                  </div>
                  <div className="tp_text d-flex justify-content-between align-items-center">
                    <div>
                      <span className="step_border"></span>
                      <span className="date area me-2">12/23/2025</span>
                    </div>

                    <div className="icon_area">
                      <svg
                        className="me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="13"
                        viewBox="0 0 12 13"
                      >
                        <path
                          id="Polygon_170"
                          data-name="Polygon 170"
                          d="M5.548,2.965a1,1,0,0,1,1.9,0L8.587,6.5a1,1,0,0,0,.178.328l2.44,2.981a1,1,0,0,1-.979,1.612L6.7,10.683a1,1,0,0,0-.41,0l-3.522.737a1,1,0,0,1-.979-1.612l2.44-2.981A1,1,0,0,0,4.413,6.5Z"
                          transform="translate(12) rotate(90)"
                          fill="#ff4a4a"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="11"
                        viewBox="0 0 11 11"
                      >
                        <rect
                          id="Rectangle_184"
                          data-name="Rectangle 184"
                          width="11"
                          height="11"
                          rx="1"
                          fill="#91cfff"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="group">
              <div className="group-header">
                <span className="me-2">
                  <ArrowRightIcon />
                </span>
                Kids
              </div>
              <div className="group-tps">
                <div
                  onClick={() => setRenderArea("details")}
                  className="single_tp_item"
                >
                  <div className="tp_text d-flex align-items-center">
                    <span
                      className="marker"
                      style={{ width: "20px", display: "inline-block" }}
                    >
                      {markAble ? (
                        <input type="checkbox" />
                      ) : (
                        <ArrowRightIcon />
                      )}
                    </span>
                    <span className="me-2">TPNXT01245</span>
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    Menswear 20 PRT Belt FGray ST dsad jsadksadsioau disopajdi
                    sadjisa
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    N96472
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    FGTRIAL
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    1000 PCS
                  </div>
                  <div className="tp_text d-flex justify-content-between align-items-center">
                    <div>
                      <span className="step_border"></span>
                      <span className="date area me-2">12/23/2025</span>
                    </div>

                    <div className="icon_area">
                      <svg
                        className="me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="13"
                        viewBox="0 0 12 13"
                      >
                        <path
                          id="Polygon_170"
                          data-name="Polygon 170"
                          d="M5.548,2.965a1,1,0,0,1,1.9,0L8.587,6.5a1,1,0,0,0,.178.328l2.44,2.981a1,1,0,0,1-.979,1.612L6.7,10.683a1,1,0,0,0-.41,0l-3.522.737a1,1,0,0,1-.979-1.612l2.44-2.981A1,1,0,0,0,4.413,6.5Z"
                          transform="translate(12) rotate(90)"
                          fill="#ff4a4a"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="11"
                        viewBox="0 0 11 11"
                      >
                        <rect
                          id="Rectangle_184"
                          data-name="Rectangle 184"
                          width="11"
                          height="11"
                          rx="1"
                          fill="#91cfff"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => setRenderArea("details")}
                  className="single_tp_item"
                >
                  <div className="tp_text d-flex align-items-center">
                    <span
                      className="marker"
                      style={{ width: "20px", display: "inline-block" }}
                    >
                      {markAble ? (
                        <input type="checkbox" />
                      ) : (
                        <ArrowRightIcon />
                      )}
                    </span>
                    <span className="me-2">TPNXT01245</span>
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    Menswear 20 PRT Belt FGray ST dsad jsadksadsioau disopajdi
                    sadjisa
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    N96472
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    FGTRIAL
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    1000 PCS
                  </div>
                  <div className="tp_text d-flex justify-content-between align-items-center">
                    <div>
                      <span className="step_border"></span>
                      <span className="date area me-2">12/23/2025</span>
                    </div>

                    <div className="icon_area">
                      <svg
                        className="me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="13"
                        viewBox="0 0 12 13"
                      >
                        <path
                          id="Polygon_170"
                          data-name="Polygon 170"
                          d="M5.548,2.965a1,1,0,0,1,1.9,0L8.587,6.5a1,1,0,0,0,.178.328l2.44,2.981a1,1,0,0,1-.979,1.612L6.7,10.683a1,1,0,0,0-.41,0l-3.522.737a1,1,0,0,1-.979-1.612l2.44-2.981A1,1,0,0,0,4.413,6.5Z"
                          transform="translate(12) rotate(90)"
                          fill="#ff4a4a"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="11"
                        viewBox="0 0 11 11"
                      >
                        <rect
                          id="Rectangle_184"
                          data-name="Rectangle 184"
                          width="11"
                          height="11"
                          rx="1"
                          fill="#91cfff"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => setRenderArea("details")}
                  className="single_tp_item"
                >
                  <div className="tp_text d-flex align-items-center">
                    <span
                      className="marker"
                      style={{ width: "20px", display: "inline-block" }}
                    >
                      {markAble ? (
                        <input type="checkbox" />
                      ) : (
                        <ArrowRightIcon />
                      )}
                    </span>
                    <span className="me-2">TPNXT01245</span>
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    Menswear 20 PRT Belt FGray ST dsad jsadksadsioau disopajdi
                    sadjisa
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    N96472
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    FGTRIAL
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    1000 PCS
                  </div>
                  <div className="tp_text d-flex justify-content-between align-items-center">
                    <div>
                      <span className="step_border"></span>
                      <span className="date area me-2">12/23/2025</span>
                    </div>

                    <div className="icon_area">
                      <svg
                        className="me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="13"
                        viewBox="0 0 12 13"
                      >
                        <path
                          id="Polygon_170"
                          data-name="Polygon 170"
                          d="M5.548,2.965a1,1,0,0,1,1.9,0L8.587,6.5a1,1,0,0,0,.178.328l2.44,2.981a1,1,0,0,1-.979,1.612L6.7,10.683a1,1,0,0,0-.41,0l-3.522.737a1,1,0,0,1-.979-1.612l2.44-2.981A1,1,0,0,0,4.413,6.5Z"
                          transform="translate(12) rotate(90)"
                          fill="#ff4a4a"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="11"
                        viewBox="0 0 11 11"
                      >
                        <rect
                          id="Rectangle_184"
                          data-name="Rectangle 184"
                          width="11"
                          height="11"
                          rx="1"
                          fill="#91cfff"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => setRenderArea("details")}
                  className="single_tp_item"
                >
                  <div className="tp_text d-flex align-items-center">
                    <span
                      className="marker"
                      style={{ width: "20px", display: "inline-block" }}
                    >
                      {markAble ? (
                        <input type="checkbox" />
                      ) : (
                        <ArrowRightIcon />
                      )}
                    </span>
                    <span className="me-2">TPNXT01245</span>
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    Menswear 20 PRT Belt FGray ST dsad jsadksadsioau disopajdi
                    sadjisa
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    N96472
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    FGTRIAL
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    1000 PCS
                  </div>
                  <div className="tp_text d-flex justify-content-between align-items-center">
                    <div>
                      <span className="step_border"></span>
                      <span className="date area me-2">12/23/2025</span>
                    </div>

                    <div className="icon_area">
                      <svg
                        className="me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="13"
                        viewBox="0 0 12 13"
                      >
                        <path
                          id="Polygon_170"
                          data-name="Polygon 170"
                          d="M5.548,2.965a1,1,0,0,1,1.9,0L8.587,6.5a1,1,0,0,0,.178.328l2.44,2.981a1,1,0,0,1-.979,1.612L6.7,10.683a1,1,0,0,0-.41,0l-3.522.737a1,1,0,0,1-.979-1.612l2.44-2.981A1,1,0,0,0,4.413,6.5Z"
                          transform="translate(12) rotate(90)"
                          fill="#ff4a4a"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="11"
                        viewBox="0 0 11 11"
                      >
                        <rect
                          id="Rectangle_184"
                          data-name="Rectangle 184"
                          width="11"
                          height="11"
                          rx="1"
                          fill="#91cfff"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={
            renderArea === "details"
              ? "tp_details_area"
              : "tp_details_area non_printing_area"
          }
        >
          {renderArea === "blank" && (
            <div style={{ textAlign: "center", paddingTop: "250px" }}>
              <b>Select an Item For Details</b>
              <div className="text-muted">Nothing is selected</div>
            </div>
          )}
          {renderArea === "add" && <CreateCostSheet />}
          {renderArea === "details" && <CostSheetDetails />}
          {renderArea === "update" && <EditCostSheet />}
        </div>
      </div>
    </div>
  );
}
