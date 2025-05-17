import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import Dropdown from "react-bootstrap/Dropdown";
import Logo from "../assets/images/logos/logo-short.png";
import iconT1W from "../assets/images/icons/T1-W.png";
import iconSettingsO from "../assets/images/icons/Settings-O.png";

export default function WorkOrders(props) {
  useEffect(async () => {
    props.setHeaderData({
      pageName: "Work Orders",
      isNewButton: true,
      newButtonLink: "",
      newButtonText: "New WO",
      isInnerSearch: true,
      innerSearchValue: "",
      isDropdown: true,
      DropdownMenu: [
        { title: "Purchase Orders", url: "/purchase-orders" },
        { title: "Work Orders", url: "/work-orders" },
        { title: "Purchase Contracts", url: "/purchase-contracts" },
      ],
    });
  }, []);
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

  return (
    <div className="purchase_order_page">
      <div className="purchase_action_header non_printing_area">
        <div className="actions_left">
          <button className="active">New WO</button>
          <button>Edit</button>
          <button>Delete</button>
        </div>
      </div>
      <div
        className="row d-grid purchase_order_page_when_print"
        style={{ gridTemplateColumns: "13% 37% 50%" }}
      >
        <div className="col">
          <div className="purchase_sidebar">
            <div className="email-section">
              <div className="folder_name">Department</div>
              <ul>
                <li>
                  <button className="active">
                    Folder Name <span>20</span>
                  </button>
                </li>
                <li>
                  <button className="">
                    Folder Name <span>20</span>
                  </button>
                </li>
                <li>
                  <button className="">
                    Folder Name <span>20</span>
                  </button>
                </li>
                <li>
                  <button className="">
                    Folder Name <span>20</span>
                  </button>
                </li>
                <li>
                  <button className="">
                    Folder Name <span>20</span>
                  </button>
                </li>
              </ul>
            </div>
            <div className="email-section">
              <div className="folder_name">Purchase Contract</div>
              <ul>
                <li>
                  <button className="active">
                    Folder Name <span>20</span>
                  </button>
                </li>
                <li>
                  <button className="">
                    Folder Name <span>20</span>
                  </button>
                </li>
                <li>
                  <button className="">
                    Folder Name <span>20</span>
                  </button>
                </li>
                <li>
                  <button className="">
                    Folder Name <span>20</span>
                  </button>
                </li>
                <li>
                  <button className="">
                    Folder Name <span>20</span>
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
          </div>
        </div>
        <div className="col">
          <div className="purchase_list">
            <div className="purchase_list_header d-flex justify-content-between">
              <div className="purchase_header_left">
                <div className="title">
                  <input type="checkbox" /> WO View
                </div>
                <div className="buttons_group">
                  <button>All</button>
                  <button>Urgent</button>
                  <button>Unassigned WO</button>
                </div>
              </div>
              <div className="purchase_header_left">
                <span className="toggleSelect" style={{ cursor: "pointer" }}>
                  <img
                    style={{ height: "22px", width: "22px" }} // Corrected 'widows' to 'width'
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
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />{" "}
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>{" "}
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="mail_text">
                  <input type="checkbox" />
                  <i className="fa fa-play text-muted mx-2"></i>
                  PONXT01245
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
                <div className="mail_text">
                  <span className="step_border"></span>
                  TEXT HERE
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="col">
          <div className="details_area_scroller">
            <div className="purchase_details">
              <div className="details_header d-flex justify-content-between">
                <div className="">
                  <img
                    style={{ width: "30px", marginRight: "12px" }} // Corrected 'widows' to 'width'
                    src={Logo}
                    alt="Logo"
                  />
                  <span className="purchase_text">Work Order</span>
                </div>

                <div className="left_side d-flex gap_10">
                  <div className="buttons_group">
                    <button>ZEhly</button>
                  </div>
                  <div className="buttons_group">
                    <button>MCLU217</button>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="row">
                  <div className="col-3">
                    <input
                      className="form-control"
                      type="text"
                      name="title"
                      placeholder="WO"
                      styles={customStyles}
                    />
                  </div>

                  <div className="col-3">
                    <Select
                      className="select_wo"
                      placeholder="Style"
                      options={workOrders}
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                    />
                  </div>

                  <div className="col-3">
                    <Select
                      className="select_wo"
                      placeholder="Product Type"
                      options={workOrders}
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                    />
                  </div>

                  <div className="col-3">
                    <input
                      className="form-control"
                      type="text"
                      name="title"
                      placeholder="QTY"
                    />
                  </div>
                  <div className="col-3">
                    <input
                      className="form-control"
                      type="text"
                      name="title"
                      placeholder="Total Qty"
                    />
                  </div>
                  <div className="col-3">
                    <Select
                      className="select_wo"
                      placeholder="Buyer"
                      options={workOrders}
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                    />
                  </div>

                  <div className="col-3">
                    <input
                      className="form-control"
                      type="date"
                      name="title"
                      placeholder="Total Qty"
                    />
                  </div>

                  <div className="col-3">
                    <Select
                      className="select_wo"
                      placeholder="Season"
                      options={workOrders}
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-3">
                    <Select
                      isMulti
                      className="select_wo"
                      placeholder="PO"
                      options={workOrders}
                      //   styles={customStyles}
                      components={{ DropdownIndicator }}
                    />
                    <Select
                      isMulti
                      className="select_wo"
                      placeholder="Size"
                      options={workOrders}
                      //   styles={customStyles}
                      components={{ DropdownIndicator }}
                    />
                  </div>
                  <div className="col-lg-9">
                    <div className="row">
                      <div className="col-lg-4">
                        <input
                          className="form-control"
                          type="text"
                          name="title"
                          placeholder="Item"
                          styles={customStyles}
                        />
                      </div>
                      <div className="col-lg-4">
                        <input
                          className="form-control"
                          type="date"
                          name="title"
                          placeholder="Item"
                          styles={customStyles}
                        />
                      </div>
                      <div className="col-lg-4">
                        <input
                          className="form-control"
                          type="text"
                          name="title"
                          placeholder="Output Target"
                          styles={customStyles}
                        />
                      </div>
                      <div className="col-lg-4">
                        <input
                          className="form-control"
                          type="text"
                          name="title"
                          placeholder="Color"
                          styles={customStyles}
                        />
                      </div>
                      <div className="col-lg-4">
                        <input
                          className="form-control"
                          type="text"
                          name="title"
                          placeholder="Ex Fty Delta"
                          styles={customStyles}
                        />
                      </div>
                      <div className="col-lg-4">
                        <input
                          className="form-control"
                          type="text"
                          name="title"
                          placeholder="PCD"
                          styles={customStyles}
                        />
                      </div>

                      <div className="col-lg-4">
                        <input
                          className="form-control"
                          type="date"
                          name="title"
                          placeholder=""
                          styles={customStyles}
                        />
                      </div>
                      <div className="col-lg-4">
                        <input
                          className="form-control"
                          type="date"
                          name="title"
                          placeholder="PCD"
                          styles={customStyles}
                        />
                      </div>

                      <div className="col-lg-4">
                        <Select
                          className="select_wo"
                          placeholder="Marchent"
                          options={workOrders}
                          styles={customStyles}
                          components={{ DropdownIndicator }}
                        />
                      </div>

                      <div className="col-lg-4">
                        <Select
                          className="select_wo"
                          placeholder="Lead Time"
                          options={workOrders}
                          styles={customStyles}
                          components={{ DropdownIndicator }}
                        />
                      </div>

                      <div className="col-lg-4">
                        <Select
                          className="select_wo"
                          placeholder="Production Lead Time"
                          options={workOrders}
                          styles={customStyles}
                          components={{ DropdownIndicator }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <h6>Work Order Breakdown</h6>
                  <div className="col-lg-12">
                    <table className="table table-bordered po_list_table">
                      <thead>
                        <th>#</th>
                        <th>Item</th>
                        <th>Style</th>
                        <th>Color</th>
                        <th>Size</th>
                        <th>Qty(PCS)</th>
                        <th>Unit Price ($)</th>
                        <th>Amount ($)</th>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>N96472</td>
                          <td>Menswear 20 PRT Belt FGray ST</td>
                          <td>Gray</td>
                          <td>30</td>
                          <td>200</td>
                          <td>7.4</td>
                          <td>1480.00</td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>N96472</td>
                          <td>Menswear 20 PRT Belt FGray ST</td>
                          <td>Gray</td>
                          <td>30</td>
                          <td>200</td>
                          <td>7.4</td>
                          <td>1480.00</td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>N96472</td>
                          <td>Menswear 20 PRT Belt FGray ST</td>
                          <td>Gray</td>
                          <td>30</td>
                          <td>200</td>
                          <td>7.4</td>
                          <td>1480.00</td>
                        </tr>
                        <tr>
                          <td>4</td>
                          <td>N96472</td>
                          <td>Menswear 20 PRT Belt FGray ST</td>
                          <td>Gray</td>
                          <td>30</td>
                          <td>200</td>
                          <td>7.4</td>
                          <td>1480.00</td>
                        </tr>
                        <tr>
                          <td>5</td>
                          <td>N96472</td>
                          <td>Menswear 20 PRT Belt FGray ST</td>
                          <td>Gray</td>
                          <td>30</td>
                          <td>200</td>
                          <td>7.4</td>
                          <td>1480.00</td>
                        </tr>
                        <tr>
                          <td>6</td>
                          <td>N96472</td>
                          <td>Menswear 20 PRT Belt FGray ST</td>
                          <td>Gray</td>
                          <td>30</td>
                          <td>200</td>
                          <td>7.4</td>
                          <td>1480.00</td>
                        </tr>
                        <tr>
                          <td>7</td>
                          <td>N96472</td>
                          <td>Menswear 20 PRT Belt FGray ST</td>
                          <td>Gray</td>
                          <td>30</td>
                          <td>200</td>
                          <td>7.4</td>
                          <td>1480.00</td>
                        </tr>
                        <tr>
                          <td className="text-center" colSpan={7}>
                            TOTAL
                          </td>
                          <td colSpan={1}>10360.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="row">
                  <h6>WO Status</h6>
                  <div className="col-lg-12">
                    <table className="table table-bordered po_list_table">
                      <thead>
                        <th>#</th>
                        <th>Item</th>
                        <th>Style</th>
                        <th>Color</th>
                        <th>Size</th>
                        <th>Qty(PCS)</th>
                        <th>Unit Price ($)</th>
                        <th>Amount ($)</th>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>N96472</td>
                          <td>Menswear 20 PRT Belt FGray ST</td>
                          <td>Gray</td>
                          <td>30</td>
                          <td>200</td>
                          <td>7.4</td>
                          <td>1480.00</td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>N96472</td>
                          <td>Menswear 20 PRT Belt FGray ST</td>
                          <td>Gray</td>
                          <td>30</td>
                          <td>200</td>
                          <td>7.4</td>
                          <td>1480.00</td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>N96472</td>
                          <td>Menswear 20 PRT Belt FGray ST</td>
                          <td>Gray</td>
                          <td>30</td>
                          <td>200</td>
                          <td>7.4</td>
                          <td>1480.00</td>
                        </tr>
                        <tr>
                          <td>4</td>
                          <td>N96472</td>
                          <td>Menswear 20 PRT Belt FGray ST</td>
                          <td>Gray</td>
                          <td>30</td>
                          <td>200</td>
                          <td>7.4</td>
                          <td>1480.00</td>
                        </tr>
                        <tr>
                          <td>5</td>
                          <td>N96472</td>
                          <td>Menswear 20 PRT Belt FGray ST</td>
                          <td>Gray</td>
                          <td>30</td>
                          <td>200</td>
                          <td>7.4</td>
                          <td>1480.00</td>
                        </tr>
                        <tr>
                          <td>6</td>
                          <td>N96472</td>
                          <td>Menswear 20 PRT Belt FGray ST</td>
                          <td>Gray</td>
                          <td>30</td>
                          <td>200</td>
                          <td>7.4</td>
                          <td>1480.00</td>
                        </tr>
                        <tr>
                          <td>7</td>
                          <td>N96472</td>
                          <td>Menswear 20 PRT Belt FGray ST</td>
                          <td>Gray</td>
                          <td>30</td>
                          <td>200</td>
                          <td>7.4</td>
                          <td>1480.00</td>
                        </tr>
                        <tr>
                          <td className="text-center" colSpan={7}>
                            TOTAL
                          </td>
                          <td colSpan={1}>10360.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="row">
                  <h6>Product Sketch Plan</h6>
                  <div className="col-lg-12">
                    <table className="table table-bordered po_list_table">
                      <thead>
                        <th>#</th>
                        <th>Item</th>
                        <th>Style</th>
                        <th>Color</th>
                        <th>Size</th>
                        <th>Qty(PCS)</th>
                        <th>Unit Price ($)</th>
                        <th>Amount ($)</th>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>N96472</td>
                          <td>Menswear 20 PRT Belt FGray ST</td>
                          <td>Gray</td>
                          <td>30</td>
                          <td>200</td>
                          <td>7.4</td>
                          <td>1480.00</td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>N96472</td>
                          <td>Menswear 20 PRT Belt FGray ST</td>
                          <td>Gray</td>
                          <td>30</td>
                          <td>200</td>
                          <td>7.4</td>
                          <td>1480.00</td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>N96472</td>
                          <td>Menswear 20 PRT Belt FGray ST</td>
                          <td>Gray</td>
                          <td>30</td>
                          <td>200</td>
                          <td>7.4</td>
                          <td>1480.00</td>
                        </tr>
                        <tr>
                          <td>4</td>
                          <td>N96472</td>
                          <td>Menswear 20 PRT Belt FGray ST</td>
                          <td>Gray</td>
                          <td>30</td>
                          <td>200</td>
                          <td>7.4</td>
                          <td>1480.00</td>
                        </tr>
                        <tr>
                          <td>5</td>
                          <td>N96472</td>
                          <td>Menswear 20 PRT Belt FGray ST</td>
                          <td>Gray</td>
                          <td>30</td>
                          <td>200</td>
                          <td>7.4</td>
                          <td>1480.00</td>
                        </tr>
                        <tr>
                          <td>6</td>
                          <td>N96472</td>
                          <td>Menswear 20 PRT Belt FGray ST</td>
                          <td>Gray</td>
                          <td>30</td>
                          <td>200</td>
                          <td>7.4</td>
                          <td>1480.00</td>
                        </tr>
                        <tr>
                          <td>7</td>
                          <td>N96472</td>
                          <td>Menswear 20 PRT Belt FGray ST</td>
                          <td>Gray</td>
                          <td>30</td>
                          <td>200</td>
                          <td>7.4</td>
                          <td>1480.00</td>
                        </tr>
                        <tr>
                          <td className="text-center" colSpan={7}>
                            TOTAL
                          </td>
                          <td colSpan={1}>10360.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <br />
                <br />
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
