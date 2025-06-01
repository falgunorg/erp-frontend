import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import Dropdown from "react-bootstrap/Dropdown";
import Logo from "../assets/images/logos/logo-short.png";
import CreatePurchaseOrder from "../elements/po_elements/CreatePurchaseOrder";
import PurchaseOrderDetails from "../elements/po_elements/PurchaseOrderDetails";
import EditPurchaseOrder from "elements/po_elements/EditPurchaseOrder";
import api from "services/api";

import {
  FilterIcon,
  ArrowRightIcon,
  ArrowDownIcon,
  ToggleCheckboxIcon,
  ToggleCheckboxActiveIcon,
} from "../elements/SvgIcons";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function PurchaseOrders(props) {
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

  useEffect(async () => {
    props.setHeaderData({
      pageName: "Purchase Orders",
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

  const [pos, setPos] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});

  const getPos = async () => {
    const response = await api.post("/pos");
    if (response.status === 200 && response.data) {
      const data = response.data.pos.data;
      setPos(data);

      // Initialize all groups as expanded (true)
      const initialExpandedState = {};
      Object.keys(data).forEach((group) => {
        initialExpandedState[group] = true;
      });
      setExpandedGroups(initialExpandedState);
    }
  };

  const toggleGroup = (groupName) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const expandAll = () => {
    const allExpanded = {};
    Object.keys(pos).forEach((group) => {
      allExpanded[group] = true;
    });
    setExpandedGroups(allExpanded);
  };

  const collapseAll = () => {
    const allCollapsed = {};
    Object.keys(pos).forEach((group) => {
      allCollapsed[group] = false;
    });
    setExpandedGroups(allCollapsed);
  };

  useEffect(async () => {
    getPos();
  }, []);

  const [selectedTp, setSelectedTp] = useState();
  const handleTpDetails = (pkg) => {
    setRenderArea("details");
    setSelectedTp(pkg);
  };

  const handleDelete = async (id) => {
    var response = await api.post("/pos-delete", { id: id });
    if (response.status === 200 && response.data) {
      window.location.reload();
    }
  };

  return (
    <div className="purchase_order_page">
      <div className="purchase_action_header non_printing_area">
        <div className="actions_left">
          <button onClick={() => setRenderArea("add")} className="active">
            New PO
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
                <input type="checkbox" style={{ marginTop: "3px" }} /> PO View
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
            {Object.entries(pos).map(([groupName, packages]) => (
              <div key={groupName} className="group">
                <div
                  onClick={() => toggleGroup(groupName)}
                  className="group-header"
                >
                  <span className="me-2">
                    {expandedGroups[groupName] ? (
                      <ArrowDownIcon />
                    ) : (
                      <ArrowRightIcon />
                    )}
                  </span>
                  {groupName}
                </div>

                {expandedGroups[groupName] && (
                  <div className="group-tps">
                    {packages.map((pkg) => (
                      <div
                        onClick={() => handleTpDetails(pkg)}
                        className={
                          pkg.id === selectedTp?.id
                            ? "single_tp_item active"
                            : "single_tp_item"
                        }
                      >
                        <div className="tp_text d-flex align-items-center">
                          <span
                            className="marker"
                            style={{ width: "20px", display: "inline-block" }}
                          >
                            {markAble ? <input type="checkbox" /> : ""}
                          </span>
                          <span className="me-2">{pkg.po_number}</span>
                        </div>
                        <div className="tp_text">
                          <span className="step_border"></span>
                          {pkg.item_name}
                        </div>
                        <div className="tp_text">
                          <span className="step_border"></span>
                          {pkg.item_type}
                        </div>
                        <div className="tp_text">
                          <span className="step_border"></span>
                          {pkg.wo_id}
                        </div>
                        <div className="tp_text">
                          <span className="step_border"></span>
                          1000 PCS
                        </div>
                        <div className="tp_text d-flex justify-content-between align-items-center">
                          <div>
                            <span className="step_border"></span>
                            <span className="date area me-2">
                              {pkg.received_date}
                            </span>
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
                    ))}
                  </div>
                )}
              </div>
            ))}
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
          {renderArea === "add" && <CreatePurchaseOrder />}
          {renderArea === "details" && <PurchaseOrderDetails />}
          {renderArea === "update" && <EditPurchaseOrder />}
        </div>
      </div>
    </div>
  );
}
