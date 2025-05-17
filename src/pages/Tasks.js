import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import Dropdown from "react-bootstrap/Dropdown";
import Logo from "../assets/images/logos/logo-short.png";
import iconT1W from "../assets/images/icons/T1-W.png";
import iconSettingsO from "../assets/images/icons/Settings-O.png";

export default function Tasks(props) {
  useEffect(async () => {
    props.setHeaderData({
      pageName: "Task",
      isNewButton: true,
      newButtonLink: "",
      newButtonText: "New task",
      isInnerSearch: true,
      innerSearchValue: "",
      isDropdown: false,
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
      <div className="row d-grid" style={{ gridTemplateColumns: "13% 87%" }}>
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
            <div className="email-section">
              <div className="folder_name">Work Order</div>
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
          <div className="purchase_list no_shadow">
            <div className="purchase_list_header  d-flex justify-content-between">
              <div className="purchase_header_left padding_left_0">
                <div className="title">
                  <input type="checkbox" /> Task
                </div>
                <div className="buttons_group">
                  <button>All</button>
                  <button>List</button>
                  <button>Group</button>
                  <button>Timeline</button>
                </div>
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
                      src={
                        iconSettingsO
                      }
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

            <div
              className="task_folders d-grid"
              style={{ gridTemplateColumns: "14% 14% 14% 14% 14% 14% 14%" }}
            >
              <div className="folder">
                <div className="folder_title">
                  Mail <span className="item_badge">10</span>
                </div>
                <div className="task_list">
                  <ul>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_260">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_260-2"
                                data-name="Ellipse 260"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_260)"
                              >
                                <circle
                                  id="Ellipse_260-3"
                                  data-name="Ellipse 260"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                              <g
                                id="Ellipse_260-4"
                                data-name="Ellipse 260"
                                fill="none"
                                stroke="rgba(28,141,255,0.6)"
                                strokeWidth="1"
                              >
                                <circle
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  stroke="none"
                                />
                                <circle cx="6.5" cy="6.5" r="6" fill="none" />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <circle
                              id="Ellipse_276"
                              data-name="Ellipse 276"
                              cx="6.5"
                              cy="6.5"
                              r="6.5"
                              fill="rgba(161,255,151,0.52)"
                            />
                            <path
                              id="Path_5"
                              data-name="Path 5"
                              d="M2319.211,2730.261l1.792,1.68s2.352-2.534,3.136-3.3"
                              transform="translate(-2315.175 -2723.789)"
                              fill="none"
                              stroke="#707070"
                              strokeLinecap="round"
                              stroke-linejoin="round"
                              strokeWidth="1"
                            />
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <g
                              id="Ellipse_94"
                              data-name="Ellipse 94"
                              fill="#fff"
                              stroke="#707070"
                              strokeWidth="1"
                            >
                              <circle cx="6.5" cy="6.5" r="6.5" stroke="none" />
                              <circle cx="6.5" cy="6.5" r="6" fill="none" />
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="folder">
                <div className="folder_title">
                  PD <span className="item_badge">10</span>
                </div>
                <div className="task_list">
                  <ul>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>

                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_260">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_260-2"
                                data-name="Ellipse 260"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_260)"
                              >
                                <circle
                                  id="Ellipse_260-3"
                                  data-name="Ellipse 260"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                              <g
                                id="Ellipse_260-4"
                                data-name="Ellipse 260"
                                fill="none"
                                stroke="rgba(28,141,255,0.6)"
                                strokeWidth="1"
                              >
                                <circle
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  stroke="none"
                                />
                                <circle cx="6.5" cy="6.5" r="6" fill="none" />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <circle
                              id="Ellipse_276"
                              data-name="Ellipse 276"
                              cx="6.5"
                              cy="6.5"
                              r="6.5"
                              fill="rgba(161,255,151,0.52)"
                            />
                            <path
                              id="Path_5"
                              data-name="Path 5"
                              d="M2319.211,2730.261l1.792,1.68s2.352-2.534,3.136-3.3"
                              transform="translate(-2315.175 -2723.789)"
                              fill="none"
                              stroke="#707070"
                              strokeLinecap="round"
                              stroke-linejoin="round"
                              strokeWidth="1"
                            />
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <g
                              id="Ellipse_94"
                              data-name="Ellipse 94"
                              fill="#fff"
                              stroke="#707070"
                              strokeWidth="1"
                            >
                              <circle cx="6.5" cy="6.5" r="6.5" stroke="none" />
                              <circle cx="6.5" cy="6.5" r="6" fill="none" />
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="folder">
                <div className="folder_title">
                  Sample <span className="item_badge">10</span>
                </div>
                <div className="task_list">
                  <ul>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>

                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_260">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_260-2"
                                data-name="Ellipse 260"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_260)"
                              >
                                <circle
                                  id="Ellipse_260-3"
                                  data-name="Ellipse 260"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                              <g
                                id="Ellipse_260-4"
                                data-name="Ellipse 260"
                                fill="none"
                                stroke="rgba(28,141,255,0.6)"
                                strokeWidth="1"
                              >
                                <circle
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  stroke="none"
                                />
                                <circle cx="6.5" cy="6.5" r="6" fill="none" />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <circle
                              id="Ellipse_276"
                              data-name="Ellipse 276"
                              cx="6.5"
                              cy="6.5"
                              r="6.5"
                              fill="rgba(161,255,151,0.52)"
                            />
                            <path
                              id="Path_5"
                              data-name="Path 5"
                              d="M2319.211,2730.261l1.792,1.68s2.352-2.534,3.136-3.3"
                              transform="translate(-2315.175 -2723.789)"
                              fill="none"
                              stroke="#707070"
                              strokeLinecap="round"
                              stroke-linejoin="round"
                              strokeWidth="1"
                            />
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <g
                              id="Ellipse_94"
                              data-name="Ellipse 94"
                              fill="#fff"
                              stroke="#707070"
                              strokeWidth="1"
                            >
                              <circle cx="6.5" cy="6.5" r="6.5" stroke="none" />
                              <circle cx="6.5" cy="6.5" r="6" fill="none" />
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="folder">
                <div className="folder_title">
                  Material <span className="item_badge">10</span>
                </div>
                <div className="task_list">
                  <ul>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>

                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_260">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_260-2"
                                data-name="Ellipse 260"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_260)"
                              >
                                <circle
                                  id="Ellipse_260-3"
                                  data-name="Ellipse 260"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                              <g
                                id="Ellipse_260-4"
                                data-name="Ellipse 260"
                                fill="none"
                                stroke="rgba(28,141,255,0.6)"
                                strokeWidth="1"
                              >
                                <circle
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  stroke="none"
                                />
                                <circle cx="6.5" cy="6.5" r="6" fill="none" />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <circle
                              id="Ellipse_276"
                              data-name="Ellipse 276"
                              cx="6.5"
                              cy="6.5"
                              r="6.5"
                              fill="rgba(161,255,151,0.52)"
                            />
                            <path
                              id="Path_5"
                              data-name="Path 5"
                              d="M2319.211,2730.261l1.792,1.68s2.352-2.534,3.136-3.3"
                              transform="translate(-2315.175 -2723.789)"
                              fill="none"
                              stroke="#707070"
                              strokeLinecap="round"
                              stroke-linejoin="round"
                              strokeWidth="1"
                            />
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <g
                              id="Ellipse_94"
                              data-name="Ellipse 94"
                              fill="#fff"
                              stroke="#707070"
                              strokeWidth="1"
                            >
                              <circle cx="6.5" cy="6.5" r="6.5" stroke="none" />
                              <circle cx="6.5" cy="6.5" r="6" fill="none" />
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="folder">
                <div className="folder_title">
                  Production <span className="item_badge">10</span>
                </div>
                <div className="task_list">
                  <ul>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>

                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_260">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_260-2"
                                data-name="Ellipse 260"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_260)"
                              >
                                <circle
                                  id="Ellipse_260-3"
                                  data-name="Ellipse 260"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                              <g
                                id="Ellipse_260-4"
                                data-name="Ellipse 260"
                                fill="none"
                                stroke="rgba(28,141,255,0.6)"
                                strokeWidth="1"
                              >
                                <circle
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  stroke="none"
                                />
                                <circle cx="6.5" cy="6.5" r="6" fill="none" />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <circle
                              id="Ellipse_276"
                              data-name="Ellipse 276"
                              cx="6.5"
                              cy="6.5"
                              r="6.5"
                              fill="rgba(161,255,151,0.52)"
                            />
                            <path
                              id="Path_5"
                              data-name="Path 5"
                              d="M2319.211,2730.261l1.792,1.68s2.352-2.534,3.136-3.3"
                              transform="translate(-2315.175 -2723.789)"
                              fill="none"
                              stroke="#707070"
                              strokeLinecap="round"
                              stroke-linejoin="round"
                              strokeWidth="1"
                            />
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <g
                              id="Ellipse_94"
                              data-name="Ellipse 94"
                              fill="#fff"
                              stroke="#707070"
                              strokeWidth="1"
                            >
                              <circle cx="6.5" cy="6.5" r="6.5" stroke="none" />
                              <circle cx="6.5" cy="6.5" r="6" fill="none" />
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="folder">
                <div className="folder_title">
                  Shipment <span className="item_badge">10</span>
                </div>
                <div className="task_list">
                  <ul>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>

                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_260">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_260-2"
                                data-name="Ellipse 260"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_260)"
                              >
                                <circle
                                  id="Ellipse_260-3"
                                  data-name="Ellipse 260"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                              <g
                                id="Ellipse_260-4"
                                data-name="Ellipse 260"
                                fill="none"
                                stroke="rgba(28,141,255,0.6)"
                                strokeWidth="1"
                              >
                                <circle
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  stroke="none"
                                />
                                <circle cx="6.5" cy="6.5" r="6" fill="none" />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <circle
                              id="Ellipse_276"
                              data-name="Ellipse 276"
                              cx="6.5"
                              cy="6.5"
                              r="6.5"
                              fill="rgba(161,255,151,0.52)"
                            />
                            <path
                              id="Path_5"
                              data-name="Path 5"
                              d="M2319.211,2730.261l1.792,1.68s2.352-2.534,3.136-3.3"
                              transform="translate(-2315.175 -2723.789)"
                              fill="none"
                              stroke="#707070"
                              strokeLinecap="round"
                              stroke-linejoin="round"
                              strokeWidth="1"
                            />
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <g
                              id="Ellipse_94"
                              data-name="Ellipse 94"
                              fill="#fff"
                              stroke="#707070"
                              strokeWidth="1"
                            >
                              <circle cx="6.5" cy="6.5" r="6.5" stroke="none" />
                              <circle cx="6.5" cy="6.5" r="6" fill="none" />
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="folder">
                <div className="folder_title">
                  Project <span className="item_badge">10</span>
                </div>
                <div className="task_list">
                  <ul>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_78">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_78-2"
                                data-name="Ellipse 78"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_78)"
                              >
                                <circle
                                  id="Ellipse_78-3"
                                  data-name="Ellipse 78"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <defs>
                              <filter id="Ellipse_260">
                                <feOffset dy="3" input="SourceAlpha" />
                                <feGaussianBlur
                                  stdDeviation="3"
                                  result="blur"
                                />
                                <feFlood floodOpacity="0.161" result="color" />
                                <feComposite
                                  operator="out"
                                  in="SourceGraphic"
                                  in2="blur"
                                />
                                <feComposite operator="in" in="color" />
                                <feComposite
                                  operator="in"
                                  in2="SourceGraphic"
                                />
                              </filter>
                            </defs>
                            <g data-type="innerShadowGroup">
                              <circle
                                id="Ellipse_260-2"
                                data-name="Ellipse 260"
                                cx="6.5"
                                cy="6.5"
                                r="6.5"
                                fill="#fff"
                              />
                              <g
                                transform="matrix(1, 0, 0, 1, 0, 0)"
                                filter="url(#Ellipse_260)"
                              >
                                <circle
                                  id="Ellipse_260-3"
                                  data-name="Ellipse 260"
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  fill="#fff"
                                />
                              </g>
                              <g
                                id="Ellipse_260-4"
                                data-name="Ellipse 260"
                                fill="none"
                                stroke="rgba(28,141,255,0.6)"
                                strokeWidth="1"
                              >
                                <circle
                                  cx="6.5"
                                  cy="6.5"
                                  r="6.5"
                                  stroke="none"
                                />
                                <circle cx="6.5" cy="6.5" r="6" fill="none" />
                              </g>
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <circle
                              id="Ellipse_276"
                              data-name="Ellipse 276"
                              cx="6.5"
                              cy="6.5"
                              r="6.5"
                              fill="rgba(161,255,151,0.52)"
                            />
                            <path
                              id="Path_5"
                              data-name="Path 5"
                              d="M2319.211,2730.261l1.792,1.68s2.352-2.534,3.136-3.3"
                              transform="translate(-2315.175 -2723.789)"
                              fill="none"
                              stroke="#707070"
                              strokeLinecap="round"
                              stroke-linejoin="round"
                              strokeWidth="1"
                            />
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                    <li className="single_task">
                      <div className="task_row">
                        <div className="task_title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                          >
                            <g
                              id="Ellipse_94"
                              data-name="Ellipse 94"
                              fill="#fff"
                              stroke="#707070"
                              strokeWidth="1"
                            >
                              <circle cx="6.5" cy="6.5" r="6.5" stroke="none" />
                              <circle cx="6.5" cy="6.5" r="6" fill="none" />
                            </g>
                          </svg>{" "}
                          Task One For Excess
                        </div>
                        <div className="user_group">
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                          <img
                            src={
                              Logo
                            }
                          />
                        </div>
                      </div>

                      <div className="task_row">
                        <div className="task_title">
                          <span className="work_number">WO: 574385674</span>
                          <span className="work_number">Buyer: Next</span>
                        </div>
                        <div className="date_raea">12/11</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}          
