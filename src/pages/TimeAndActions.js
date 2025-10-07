import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import Logo from "../assets/images/logos/logo-short.png";
import iconT1W from "../assets/images/icons/T1-W.png";
import iconSettingsO from "../assets/images/icons/Settings-O.png";

export default function TimeAndActions(props) {
  useEffect(async () => {
    props.setHeaderData({
      pageName: "NEXT T&A",
      isNewButton: false,
      newButtonLink: "",
      newButtonText: "",
      isInnerSearch: true,
      innerSearchValue: "",
      isDropdown: false,
      DropdownMenu: [],
    });
  }, []);

  const [workOrders, setWorkOrders] = useState(
    Array.from({ length: 100 }, (_, index) => {
      const serial = String(index + 1).padStart(2, "0");
      return {
        value: `WONXF1JM${serial}`,
        label: `WONXF1JM${serial}`,
        date: "8/15/24",
      };
    })
  );

  return (
    <div className="tna_page">
      <div className="tna_page_topbar">
        <Link className="active" to="#">
          T&A View
        </Link>
        <Link to="#">T&A Calender</Link>
        <Link to="#">T&A Custom</Link>
        <Link to="#">Material</Link>
        <Link to="#">Sample & Testing</Link>
        <Link to="#">Production</Link>
        <Link to="#">Shipment</Link>
      </div>
      <div className="purchase_order_page">
        <div className="row d-grid" style={{ gridTemplateColumns: "16% 84% " }}>
          <div className="col">
            <div className="booking_manager_sidebar with_shadow_and_scroll">
              <div
                style={{ padding: "10px", fontSize: "18px", fontWeight: "600" }}
              >
                Work Order
              </div>
              <div
                style={{ paddingLeft: "10px" }}
                className="filters_area d-flex"
              >
                <div className="buttons_area">
                  <button className="active">All</button>
                  <button>Urgent Issue</button>
                  <button>Ready Booking</button>
                </div>
                <div className="filter_area_right">
                  <span className="toggleSelect" style={{ cursor: "pointer" }}>
                    <img
                      style={{ height: "22px", width: "22px" }}
                      src={iconT1W}
                      alt="Logo"
                    />
                  </span>

                  <Dropdown className="purchase_filter_dropdown">
                    <Dropdown.Toggle
                      id="dropdown-button-dark-example1"
                      variant="secondary"
                    >
                      <img
                        style={{ height: "22px", width: "22px" }} // Corrected 'widows' to 'width'
                        src={iconSettingsO}
                        alt="Logo"
                      />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item>Date</Dropdown.Item>
                      <Dropdown.Item>From</Dropdown.Item>
                      <Dropdown.Item>Subject</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
              <div className="tables_area on_tna_page">
                <ul className="list-group">
                  {workOrders.map((item, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between"
                    >
                      <div className="mail_text">
                        <input type="checkbox" />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="9"
                          height="7"
                          viewBox="0 0 9 7"
                        >
                          <path
                            id="Polygon_29"
                            data-name="Polygon 29"
                            d="M3.659,1.308a1,1,0,0,1,1.682,0L8.01,5.459A1,1,0,0,1,7.168,7H1.832A1,1,0,0,1,.99,5.459Z"
                            transform="translate(9 7) rotate(180)"
                            fill="#707070"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="7"
                          height="9"
                          viewBox="0 0 7 9"
                        >
                          <path
                            id="Polygon_12"
                            data-name="Polygon 12"
                            d="M3.659,1.308a1,1,0,0,1,1.682,0L8.01,5.459A1,1,0,0,1,7.168,7H1.832A1,1,0,0,1,.99,5.459Z"
                            transform="translate(7) rotate(90)"
                            fill="#707070"
                          />
                        </svg>
                        {item.label}
                      </div>

                      <div className="mail_text">
                        <span className="step_border"></span>
                        {item.date}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="details_area_scroller on_tna_page">
              <div className="purchase_details without_shadow">
                <div className="details_header no_padding d-flex justify-content-between">
                  <div className="">
                    <img
                      style={{ width: "30px", marginRight: "12px" }} // Corrected 'widows' to 'width'
                      src={Logo}
                      alt="Logo"
                    />
                    <span className="purchase_text"> T & A </span>
                    <span className="badge ">WO: MC/WMB/ANXF2001</span>
                    <span className="badge me-2">
                      Style: Menswear 30 N5PKT ST MCRD BL{" "}
                    </span>
                  </div>
                  <div className="left_side">
                    <div className="buttons_group d-flex justify-content-end gap_10 mb-2">
                      <button>T&A Calender</button>
                      <button>Predicted Lead Time</button>
                      <button>Ext Fty Date</button>
                    </div>
                    <div className="buttons_group d-flex justify-content-end gap_10">
                      <button>Executed Lead Time</button>
                      <button>Projected Ext Fty Date</button>
                    </div>
                  </div>
                </div>
                <div className="">
                  <div className="leading_headline">
                    Pre-Production: Lead Time 45 Days
                  </div>

                  <div className="single_timeline">
                    <div className="timeline_header d-flex gap_10">
                      <div className="header_title">Material</div>
                      <div className="header_buttons">
                        <button className="active">Full </button>
                        <button>Fabric </button>
                        <button>Trims </button>
                      </div>
                    </div>
                    <div className="timeline_items">
                      <button className="btn item">FG PO</button>
                      <button className="btn item">Confirm Intial T&A</button>
                      <button className="btn item">Issue WO</button>
                      <button className="btn item">Bulk Consumption</button>
                      <button className="btn item">
                        Approve Material Budget
                      </button>
                      <button className="btn item">Book Sewing Material</button>
                      <button className="btn item">Submit PI for LC</button>
                      <button className="btn item ">Fabric LC Issue</button>
                      <button className="btn item active">
                        Submit Fabric LC to Supplier
                      </button>
                      <button className="btn item">
                        Submit Fabric DOC for Import
                      </button>
                      <button className="btn item">Trims LC Issue</button>
                      <button className="btn item">
                        Submit Trims LC to Supplier
                      </button>
                      <button className="btn item">
                        Submit Trims DOC for Import
                      </button>
                      <button className="btn item">Fabric ETD</button>
                      <button className="btn item">Trims ETD</button>
                      <button className="btn item">Fabric MID</button>
                      <button className="btn item">Fabric QC Passed</button>
                      <button className="btn item">Trims MID</button>
                      <button className="btn item">Trims QC Passed</button>
                      <button className="btn item">WO PCD</button>
                    </div>
                    <div className="liner_timeline">
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item active">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                    </div>
                    <div className="timeline_items">
                      <button className="btn item text-success">4/17</button>
                      <button className="btn item text-success">4/17</button>
                      <button className="btn item text-success">4/17</button>
                      <button className="btn item text-success">4/17</button>
                      <button className="btn item text-success">4/17</button>
                      <button className="btn item text-success">4/17</button>
                      <button className="btn item text-success">4/17</button>
                      <button className="btn item text-warning">4/17</button>
                      <button className="btn item text-warning">4/17</button>
                      <button className="btn item text-warning">4/17</button>
                      <button className="btn item text-warning">4/17</button>
                      <button className="btn item text-warning">4/17</button>
                      <button className="btn item text-warning">4/17</button>
                      <button className="btn item text-danger">Delay</button>
                      <button className="btn item text-danger">
                        Projected Late
                      </button>
                      <button className="btn item text-danger">
                        Projected Late
                      </button>
                      <button className="btn item text-danger">
                        Projected Late
                      </button>
                      <button className="btn item text-danger">
                        Projected Late
                      </button>
                    </div>
                  </div>
                  <div className="single_timeline">
                    <div className="timeline_header d-flex gap_10">
                      <div className="header_title">Testing & Sample</div>
                      <div className="header_buttons">
                        <button className="active">Full </button>
                        <button>Sample </button>
                        <button>Testing </button>
                      </div>
                    </div>
                    <div className="timeline_items">
                      <button className="btn item">SCS</button>
                      <button className="btn item">Base Fabric Request</button>
                      <button className="btn item">Base Test</button>
                      <button className="btn item">NIS</button>
                      <button className="btn item">Base Test Submit</button>
                      <button className="btn item">Base Hanger</button>
                      <button className="btn item">PNP</button>
                      <button className="btn item">White Seal</button>
                      <button className="btn item">Black Seal</button>
                      <button className="btn item active">Bulk Hanger</button>
                      <button className="btn item">Bulk Test</button>
                      <button className="btn item">BCCU/TC</button>
                      <button className="btn item">Product Test</button>
                      <button className="btn item">Gold Seal</button>
                      <button className="btn item">Fabric QC Passed</button>
                      <button className="btn item">Trims MID</button>
                      <button className="btn item">Trims QC Passed</button>
                      <button className="btn item">WO PCD</button>
                    </div>
                    <div className="liner_timeline">
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item active">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                    </div>
                    <div className="timeline_items">
                      <button className="btn item text-success">4/17</button>
                      <button className="btn item text-success">4/17</button>
                      <button className="btn item text-success">4/17</button>
                      <button className="btn item text-success">4/17</button>
                      <button className="btn item text-success">4/17</button>
                      <button className="btn item text-success">4/17</button>
                      <button className="btn item text-success">4/17</button>
                      <button className="btn item text-warning">4/17</button>
                      <button className="btn item text-warning">4/17</button>
                      <button className="btn item text-warning">4/17</button>
                      <button className="btn item text-warning">4/17</button>
                      <button className="btn item text-warning">4/17</button>
                      <button className="btn item text-warning">4/17</button>
                      <button className="btn item text-danger">Delay</button>
                      <button className="btn item text-danger">
                        Projected Late
                      </button>
                      <button className="btn item text-danger">
                        Projected Late
                      </button>
                      <button className="btn item text-danger">
                        Projected Late
                      </button>
                      <button className="btn item text-danger">
                        Projected Late
                      </button>
                    </div>
                  </div>

                  <div className="leading_headline">
                    Production: Lead Time 25 Days
                  </div>

                  <div className="single_timeline">
                    <div className="timeline_header d-flex gap_10">
                      <div className="header_title">Cutting & Sewing</div>
                      <div className="header_buttons">
                        <button className="active">Full </button>
                        <button>Cutting </button>
                        <button>Sewing </button>
                      </div>
                    </div>
                    <div className="timeline_items">
                      <button className="btn item success">PCD Date</button>
                      <button className="btn item success">SS Date</button>
                      <button className="btn item success">Lot 1: 5000</button>
                      <button className="btn item warning">Day 1</button>
                      <button className="btn item warning">Lot 3: 5000</button>
                      <button className="btn item warning">SED Date</button>
                      <button className="btn item warning">
                        Submit Fabric LC to Supplier
                      </button>
                      <button className="btn item warning">
                        Submit Fabric DOC for Import
                      </button>
                      <button className="btn item warning">
                        Trims LC Issue
                      </button>
                      <button className="btn item warning">
                        Submit Trims LC to Supplier
                      </button>
                      <button className="btn item warning">
                        Submit Trims DOC for Import
                      </button>
                      <button className="btn item warning active">
                        Fabric ETD
                      </button>
                      <button className="btn item warning">Trims ETD</button>
                      <button className="btn item danger">Fabric MID</button>
                      <button className="btn item danger">
                        Fabric QC Passed
                      </button>
                      <button className="btn item danger">Trims MID</button>
                      <button className="btn item danger">
                        Trims QC Passed
                      </button>
                      <button className="btn item danger">WO PCD</button>
                    </div>
                    <div className="liner_timeline">
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item active">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                      <div className="item">4/17</div>
                    </div>
                    <div className="timeline_items">
                      <button className="btn item text-success">4/17</button>
                      <button className="btn item text-success">4/17</button>
                      <button className="btn item text-success">4/17</button>
                      <button className="btn item text-success">4/17</button>
                      <button className="btn item text-success">4/17</button>
                      <button className="btn item text-success">4/17</button>
                      <button className="btn item text-success">4/17</button>
                      <button className="btn item text-warning">4/17</button>
                      <button className="btn item text-warning">4/17</button>
                      <button className="btn item text-warning">4/17</button>
                      <button className="btn item text-warning">4/17</button>
                      <button className="btn item text-warning">4/17</button>
                      <button className="btn item text-warning">4/17</button>
                      <button className="btn item text-danger">Delay</button>
                      <button className="btn item text-danger">
                        Projected Late
                      </button>
                      <button className="btn item text-danger">
                        Projected Late
                      </button>
                      <button className="btn item text-danger">
                        Projected Late
                      </button>
                      <button className="btn item text-danger">
                        Projected Late
                      </button>
                    </div>
                  </div>

                  <div className="leading_headline">Shipment: Lead Time</div>
                  <div className="d-flex gap_10">
                    <div className="single_timeline">
                      <div className="timeline_header d-flex gap_10">
                        <div className="header_title">Finishing & Packing</div>
                        <div className="header_buttons d-none">
                          <button className="active">Full </button>
                          <button>Cutting </button>
                          <button>Sewing </button>
                        </div>
                      </div>
                      <div className="timeline_items">
                        <button className="btn item success ">FS Date</button>
                        <button className="btn item success">WO Issue</button>
                        <button className="btn item success">
                          Prepare Material PO
                        </button>
                        <button className="btn item warning">
                          Book Material
                        </button>
                        <button className="btn item warning">
                          Submit PI for LC
                        </button>
                        <button className="btn item warning active">
                          Fabric LC Issue
                        </button>
                        <button className="btn item warning">
                          Submit Fabric LC to Supplier
                        </button>
                        <button className="btn item warning">
                          Submit Fabric DOC for Import
                        </button>
                        <button className="btn item warning">
                          Trims LC Issue
                        </button>
                      </div>
                      <div className="liner_timeline">
                        <div className="item">4/17</div>
                        <div className="item">4/17</div>
                        <div className="item">4/17</div>
                        <div className="item active">4/17</div>
                        <div className="item">4/17</div>
                        <div className="item">4/17</div>
                        <div className="item">4/17</div>
                        <div className="item">4/17</div>
                        <div className="item">4/17</div>
                      </div>
                      <div className="timeline_items">
                        <button className="btn item text-success">4/17</button>
                        <button className="btn item text-success">4/17</button>
                        <button className="btn item text-warning">4/17</button>
                        <button className="btn item text-warning">4/17</button>
                        <button className="btn item text-warning">4/17</button>
                        <button className="btn item text-warning">4/17</button>
                        <button className="btn item text-warning">4/17</button>
                        <button className="btn item text-warning">4/17</button>
                        <button className="btn item text-warning">4/17</button>
                      </div>
                    </div>
                    <div className="single_timeline">
                      <div className="timeline_header d-flex gap_10">
                        <div className="header_title">
                          Final Inspection & Shipment
                        </div>
                        <div className="header_buttons">
                          <button className="active">Full </button>
                          <button>Pass </button>
                          <button>Re-Check </button>
                        </div>
                      </div>
                      <div className="timeline_items">
                        <button className="btn item success active">
                          PS Date
                        </button>
                        <button className="btn item success">
                          Lot 1 Packing
                        </button>
                        <button className="btn item success">
                          Prepare Material PO
                        </button>
                        <button className="btn item warning">
                          Book Material
                        </button>
                        <button className="btn item warning">
                          Submit PI for LC
                        </button>
                        <button className="btn item warning">
                          Fabric LC Issue
                        </button>
                        <button className="btn item warning">
                          Submit Fabric LC to Supplier
                        </button>
                        <button className="btn item warning">
                          Submit Fabric DOC for Import
                        </button>
                        <button className="btn item warning">
                          Trims LC Issue
                        </button>
                      </div>
                      <div className="liner_timeline">
                        <div className="item">4/17</div>
                        <div className="item">4/17</div>
                        <div className="item">4/17</div>
                        <div className="item active">4/17</div>
                        <div className="item">4/17</div>
                        <div className="item">4/17</div>
                        <div className="item">4/17</div>
                        <div className="item">4/17</div>
                        <div className="item">4/17</div>
                      </div>
                      <div className="timeline_items">
                        <button className="btn item text-success active">
                          4/17
                        </button>
                        <button className="btn item text-success">4/17</button>
                        <button className="btn item text-warning">4/17</button>
                        <button className="btn item text-warning">4/17</button>
                        <button className="btn item text-warning">4/17</button>
                        <button className="btn item text-warning">4/17</button>
                        <button className="btn item text-warning">4/17</button>
                        <button className="btn item text-warning">4/17</button>
                        <button className="btn item text-warning">4/17</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
