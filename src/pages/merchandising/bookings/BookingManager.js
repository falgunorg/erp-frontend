import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import Dropdown from "react-bootstrap/Dropdown";
import Logo from "../../../assets/images/logos/logo-short.png";
import iconSettingW from "../../../assets/images/icons/Settings-W.png";
import iconT1w from "../../../assets/images/icons/T1-W.png";
export default function BookingManager(props) {
  useEffect(async () => {
    props.setHeaderData({
      pageName: "NEXT PD",
      isNewButton: false,
      newButtonLink: "",
      newButtonText: "",
      isInnerSearch: true,
      innerSearchValue: "",
      isDropdown: true,
      DropdownMenu: [
        { title: "Fabric", url: "/booking-manager" },
        { title: "Trims", url: "/booking-manager" },
        { title: "Thread", url: "/booking-manager" },
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
          <button className="active">New Booking</button>
          <button>Edit</button>
          <button>Delete</button>
        </div>
      </div>
      <div
        className="row d-grid purchase_order_page_when_print"
        style={{ gridTemplateColumns: "15% 40% 45% " }}
      >
        <div className="col">
          <div className="booking_manager_sidebar">
            <div className="filters_area d-flex">
              <div className="buttons_area">
                <button className="active">All</button>
                <button>Urgent Issue</button>
                <button>Book PO</button>
                <button>Submit PI</button>
                <button>Submit LC</button>
                <button>Import</button>
                <button>Inventory</button>
              </div>
              <div className="filter_area_right">
                <span className="toggleSelect" style={{ cursor: "pointer" }}>
                  <img
                    style={{ height: "22px", width: "22px" }} // Corrected 'widows' to 'width'
                    src={iconT1w}
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
                      src={iconSettingW}
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
            <div className="tables_area">
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between">
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
                  </div>
                  <div className="mail_text">PONXT01245</div>
                  <div className="mail_text">
                    <span className="step_border"></span>
                    8/15/25
                  </div>
                  <div className="mail_text">
                    <span className="step_border"></span>
                    SEWING
                  </div>
                </li>
                <li className="list-group-item d-flex justify-content-between">
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
                  </div>
                  <div className="mail_text">PONXT01245</div>
                  <div className="mail_text">
                    <span className="step_border"></span>
                    8/15/25
                  </div>
                  <div className="mail_text">
                    <span className="step_border"></span>
                    EXPORTRD
                  </div>
                </li>
                <li className="list-group-item d-flex justify-content-between">
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
                  </div>
                  <div className="mail_text">PONXT01245</div>
                  <div className="mail_text">
                    <span className="step_border"></span>
                    8/15/25
                  </div>
                  <div className="mail_text">
                    <span className="step_border"></span>
                    SHIPPED
                  </div>
                </li>
                <li className="list-group-item d-flex justify-content-between">
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
                  </div>
                  <div className="mail_text">PONXT01245</div>
                  <div className="mail_text">
                    <span className="step_border"></span>
                    8/15/25
                  </div>
                  <div className="mail_text">
                    <span className="step_border"></span>
                    FAILED
                  </div>
                </li>
                <li className="list-group-item d-flex justify-content-between">
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
                  </div>
                  <div className="mail_text">PONXT01245</div>
                  <div className="mail_text">
                    <span className="step_border"></span>
                    8/15/25
                  </div>
                  <div className="mail_text">
                    <span className="step_border"></span>
                    REJECTED
                  </div>
                </li>
                <li className="list-group-item d-flex justify-content-between">
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
                  </div>
                  <div className="mail_text">PONXT01245</div>
                  <div className="mail_text">
                    <span className="step_border"></span>
                    8/15/25
                  </div>
                  <div className="mail_text">
                    <span className="step_border"></span>
                    PROCESSING
                  </div>
                </li>
                <li className="list-group-item d-flex justify-content-between">
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
                  </div>
                  <div className="mail_text">PONXT01245</div>
                  <div className="mail_text">
                    <span className="step_border"></span>
                    8/15/25
                  </div>
                  <div className="mail_text">
                    <span className="step_border"></span>
                    COMPLETE
                  </div>
                </li>
              </ul>
              <br />

              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between">
                  <div className="mail_text">PONXT01245</div>

                  <div className="mail_text">
                    <span className="step_border"></span>
                    12/31/2024
                  </div>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <div className="mail_text">PONXT01245</div>

                  <div className="mail_text">
                    <span className="step_border"></span>
                    12/31/2024
                  </div>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <div className="mail_text">PONXT01245</div>

                  <div className="mail_text">
                    <span className="step_border"></span>
                    12/31/2024
                  </div>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <div className="mail_text">PONXT01245</div>

                  <div className="mail_text">
                    <span className="step_border"></span>
                    12/31/2024
                  </div>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <div className="mail_text">PONXT01245</div>

                  <div className="mail_text">
                    <span className="step_border"></span>
                    12/31/2024
                  </div>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <div className="mail_text">PONXT01245</div>

                  <div className="mail_text">
                    <span className="step_border"></span>
                    12/31/2024
                  </div>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <div className="mail_text">PONXT01245</div>

                  <div className="mail_text">
                    <span className="step_border"></span>
                    12/31/2024
                  </div>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <div className="mail_text">PONXT01245</div>

                  <div className="mail_text">
                    <span className="step_border"></span>
                    12/31/2024
                  </div>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <div className="mail_text">PONXT01245</div>

                  <div className="mail_text">
                    <span className="step_border"></span>
                    12/31/2024
                  </div>
                </li>
              </ul>
            </div>
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
                  <span className="purchase_text"> Material Status File</span>
                </div>
                <div className="left_side d-flex gap_10">
                  <div className="buttons_group">
                    <button>Material T&A</button>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="row">
                  <div className="col-4">
                    <input
                      className="form-control"
                      type="text"
                      name="title"
                      placeholder="WO"
                      styles={customStyles}
                    />
                  </div>
                  <div className="col-4">
                    <Select
                      className="select_wo"
                      placeholder="Style"
                      options={workOrders}
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                    />
                  </div>
                  <div className="col-4">
                    <Select
                      className="select_wo"
                      placeholder="Product Type"
                      options={workOrders}
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                    />
                  </div>

                  <div className="col-4">
                    <Select
                      className="select_wo"
                      placeholder="Total QTY"
                      options={workOrders}
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                    />
                  </div>
                  <div className="col-4">
                    <input
                      className="form-control"
                      type="text"
                      name="title"
                      placeholder="Item"
                      styles={customStyles}
                    />
                  </div>
                  <div className="col-4">
                    <input
                      className="form-control"
                      type="text"
                      name="title"
                      placeholder="WO QTY"
                      styles={customStyles}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
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
                      placeholder="Sizes"
                      options={workOrders}
                      //   styles={customStyles}
                      components={{ DropdownIndicator }}
                    />
                  </div>
                  <div className="col-8">
                    <div className="row">
                      <div className="col-6">
                        <Select
                          isMulti
                          className="select_wo"
                          placeholder="Buyer"
                          options={workOrders}
                          styles={customStyles}
                          components={{ DropdownIndicator }}
                        />
                      </div>
                      <div className="col-6">
                        <input
                          className="form-control"
                          type="date"
                          name="title"
                          placeholder="WO QTY"
                          styles={customStyles}
                        />
                      </div>
                      <div className="col-6">
                        <input
                          className="form-control"
                          type="text"
                          name="title"
                          placeholder="Color"
                          styles={customStyles}
                        />
                      </div>
                      <div className="col-6">
                        <input
                          className="form-control"
                          type="text"
                          name="title"
                          placeholder="PCD"
                          styles={customStyles}
                        />
                      </div>
                      <div className="col-6">
                        <input
                          className="form-control"
                          type="date"
                          name="title"
                          placeholder="PCD"
                          styles={customStyles}
                        />
                      </div>
                      <div className="col-6">
                        <Select
                          isMulti
                          className="select_wo"
                          placeholder="Marchent"
                          options={workOrders}
                          styles={customStyles}
                          components={{ DropdownIndicator }}
                        />
                      </div>
                      <div className="col-6">
                        <Select
                          isMulti
                          className="select_wo"
                          placeholder="Default"
                          options={workOrders}
                          styles={customStyles}
                          components={{ DropdownIndicator }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <input
                      className="form-control"
                      type="text"
                      name="title"
                      placeholder="Purchase Allocation"
                      styles={customStyles}
                    />
                  </div>

                  <div className="col-4">
                    <input
                      className="form-control"
                      type="text"
                      name="title"
                      placeholder="Purchased Value"
                      styles={customStyles}
                    />
                  </div>
                </div>
                <hr />
                <div className="booking_material">
                  <div className="booking_material_header d-flex justify-content-between">
                    <div className="purchase_header_left">
                      <h6>Material</h6>
                      <div className="buttons_area">
                        <button className="active">Booking</button>
                        <button>PI</button>
                        <button>LC</button>
                        <button>Import</button>
                        <button>Inventory</button>
                      </div>
                    </div>
                    <div className="purchase_filter_dropdown">
                      <Dropdown className="purchase_filter_dropdown">
                        <Dropdown.Toggle
                          id="dropdown-button-dark-example1"
                          variant="secondary"
                        >
                          <img
                            style={{ height: "22px", width: "22px" }} // Corrected 'widows' to 'width'
                            src={iconSettingW}
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
                  <br />
                  <div className="material_list">
                    <div className="list-group">
                      <div
                        className="list-group-item direction d-flex justify-content-between"
                        style={{ backgroundColor: "#ECECEC" }}
                      >
                        <div className="item"> Sewing Material</div>

                        <div className="item d-flex gap_10">
                          <div className="item">
                            {" "}
                            <span className="step_border"></span> MID
                          </div>
                          <div className="item">
                            {" "}
                            <span className="step_border"></span> EMID
                          </div>
                        </div>
                      </div>

                      <div className="list-group-item d-flex justify-content-between">
                        <div className="item">
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
                        </div>
                        <div className="item">Body Fabric</div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> Velcord Tex Ltd
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> ASH FAB{" "}
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 1.78-3%
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 03.37$/yds
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 012240 yds
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> $ 0040,881.60
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> Inhoused
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 09/20/24
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 10/20/24
                        </div>
                      </div>

                      <div className="list-group-item expanded">
                        <div className="single_lot d-flex justify-content-between">
                          <div className="lot_no">Lot 1</div>
                          <div className="lot_content d-flex gap_10">
                            <div className="lot_content_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge success">Book PO</div>
                                <div className="badge success">Submit PI</div>
                                <div className="badge success">Open LC</div>
                                <div className="badge success">Check</div>
                                <div className="badge success">Submit SD</div>
                                <div className="badge success">Customs</div>
                                <div className="badge success">On Load</div>
                                <div className="badge success">CEPZ</div>
                                <div className="badge warning">Inhouse</div>
                              </div>
                              <div className="fill_area">TEST</div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">09/01</div>
                                <div className="badge ">09/03</div>
                                <div className="badge ">09/09</div>
                                <div className="badge ">09/15</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/24</div>
                                <div className="badge ">09/28</div>
                                <div className="badge ">09/30</div>
                              </div>
                            </div>
                            <div className="lot_content_left border_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">MI %</div>
                                <div className="badge ">QCP %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10 allow_margin">
                                <div className="badge ">80 %</div>
                                <div className="badge ">70 %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">Late</div>
                                <div className="badge danger">Partial Fail</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="single_lot d-flex justify-content-between">
                          <div className="lot_no">Lot 2</div>
                          <div className="lot_content d-flex gap_10">
                            <div className="lot_content_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge success">Book PO</div>
                                <div className="badge success">Submit PI</div>
                                <div className="badge success">Open LC</div>
                                <div className="badge success">Check</div>
                                <div className="badge success">Submit SD</div>
                                <div className="badge success">Customs</div>
                                <div className="badge success">On Load</div>
                                <div className="badge success">CEPZ</div>
                                <div className="badge warning">Inhouse</div>
                              </div>
                              <div className="fill_area">TEST</div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">09/01</div>
                                <div className="badge ">09/03</div>
                                <div className="badge ">09/09</div>
                                <div className="badge ">09/15</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/24</div>
                                <div className="badge ">09/28</div>
                                <div className="badge ">09/30</div>
                              </div>
                            </div>
                            <div className="lot_content_left border_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">MI %</div>
                                <div className="badge ">QCP %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10 allow_margin">
                                <div className="badge ">80 %</div>
                                <div className="badge ">70 %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">Late</div>
                                <div className="badge danger">Partial Fail</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="list-group-item d-flex justify-content-between">
                        <div className="item">
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
                        </div>
                        <div className="item">Body Fabric</div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> Velcord Tex Ltd
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> ASH FAB{" "}
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 1.78-3%
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 03.37$/yds
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 012240 yds
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> $ 0040,881.60
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> Inhoused
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 09/20/24
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 10/20/24
                        </div>
                      </div>
                      <div className="list-group-item expanded">
                        <div className="single_lot d-flex justify-content-between">
                          <div className="lot_no">Lot 1</div>
                          <div className="lot_content d-flex gap_10">
                            <div className="lot_content_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge success">Book PO</div>
                                <div className="badge success">Submit PI</div>
                                <div className="badge success">Open LC</div>
                                <div className="badge success">Check</div>
                                <div className="badge success">Submit SD</div>
                                <div className="badge success">Customs</div>
                                <div className="badge success">On Load</div>
                                <div className="badge success">CEPZ</div>
                                <div className="badge warning">Inhouse</div>
                              </div>
                              <div className="fill_area">TEST</div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">09/01</div>
                                <div className="badge ">09/03</div>
                                <div className="badge ">09/09</div>
                                <div className="badge ">09/15</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/24</div>
                                <div className="badge ">09/28</div>
                                <div className="badge ">09/30</div>
                              </div>
                            </div>
                            <div className="lot_content_left border_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">MI %</div>
                                <div className="badge ">QCP %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10 allow_margin">
                                <div className="badge ">80 %</div>
                                <div className="badge ">70 %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">Late</div>
                                <div className="badge danger">Partial Fail</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="single_lot d-flex justify-content-between">
                          <div className="lot_no">Lot 2</div>
                          <div className="lot_content d-flex gap_10">
                            <div className="lot_content_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge success">Book PO</div>
                                <div className="badge success">Submit PI</div>
                                <div className="badge success">Open LC</div>
                                <div className="badge success">Check</div>
                                <div className="badge success">Submit SD</div>
                                <div className="badge success">Customs</div>
                                <div className="badge success">On Load</div>
                                <div className="badge success">CEPZ</div>
                                <div className="badge warning">Inhouse</div>
                              </div>
                              <div className="fill_area">TEST</div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">09/01</div>
                                <div className="badge ">09/03</div>
                                <div className="badge ">09/09</div>
                                <div className="badge ">09/15</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/24</div>
                                <div className="badge ">09/28</div>
                                <div className="badge ">09/30</div>
                              </div>
                            </div>
                            <div className="lot_content_left border_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">MI %</div>
                                <div className="badge ">QCP %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10 allow_margin">
                                <div className="badge ">80 %</div>
                                <div className="badge ">70 %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">Late</div>
                                <div className="badge danger">Partial Fail</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="list-group-item d-flex justify-content-between">
                        <div className="item">
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
                        </div>
                        <div className="item">Body Fabric</div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> Velcord Tex Ltd
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> ASH FAB{" "}
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 1.78-3%
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 03.37$/yds
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 012240 yds
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> $ 0040,881.60
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> Inhoused
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 09/20/24
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 10/20/24
                        </div>
                      </div>
                      <div className="list-group-item expanded">
                        <div className="single_lot d-flex justify-content-between">
                          <div className="lot_no">Lot 1</div>
                          <div className="lot_content d-flex gap_10">
                            <div className="lot_content_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge success">Book PO</div>
                                <div className="badge success">Submit PI</div>
                                <div className="badge success">Open LC</div>
                                <div className="badge success">Check</div>
                                <div className="badge success">Submit SD</div>
                                <div className="badge success">Customs</div>
                                <div className="badge success">On Load</div>
                                <div className="badge success">CEPZ</div>
                                <div className="badge warning">Inhouse</div>
                              </div>
                              <div className="fill_area">TEST</div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">09/01</div>
                                <div className="badge ">09/03</div>
                                <div className="badge ">09/09</div>
                                <div className="badge ">09/15</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/24</div>
                                <div className="badge ">09/28</div>
                                <div className="badge ">09/30</div>
                              </div>
                            </div>
                            <div className="lot_content_left border_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">MI %</div>
                                <div className="badge ">QCP %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10 allow_margin">
                                <div className="badge ">80 %</div>
                                <div className="badge ">70 %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">Late</div>
                                <div className="badge danger">Partial Fail</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="single_lot d-flex justify-content-between">
                          <div className="lot_no">Lot 2</div>
                          <div className="lot_content d-flex gap_10">
                            <div className="lot_content_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge success">Book PO</div>
                                <div className="badge success">Submit PI</div>
                                <div className="badge success">Open LC</div>
                                <div className="badge success">Check</div>
                                <div className="badge success">Submit SD</div>
                                <div className="badge success">Customs</div>
                                <div className="badge success">On Load</div>
                                <div className="badge success">CEPZ</div>
                                <div className="badge warning">Inhouse</div>
                              </div>
                              <div className="fill_area">TEST</div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">09/01</div>
                                <div className="badge ">09/03</div>
                                <div className="badge ">09/09</div>
                                <div className="badge ">09/15</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/24</div>
                                <div className="badge ">09/28</div>
                                <div className="badge ">09/30</div>
                              </div>
                            </div>
                            <div className="lot_content_left border_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">MI %</div>
                                <div className="badge ">QCP %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10 allow_margin">
                                <div className="badge ">80 %</div>
                                <div className="badge ">70 %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">Late</div>
                                <div className="badge danger">Partial Fail</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="list-group-item d-flex justify-content-between">
                        <div className="item">
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
                        </div>
                        <div className="item">Body Fabric</div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> Velcord Tex Ltd
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> ASH FAB{" "}
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 1.78-3%
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 03.37$/yds
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 012240 yds
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> $ 0040,881.60
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> Inhoused
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 09/20/24
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 10/20/24
                        </div>
                      </div>
                      <div className="list-group-item expanded">
                        <div className="single_lot d-flex justify-content-between">
                          <div className="lot_no">Lot 1</div>
                          <div className="lot_content d-flex gap_10">
                            <div className="lot_content_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge success">Book PO</div>
                                <div className="badge success">Submit PI</div>
                                <div className="badge success">Open LC</div>
                                <div className="badge success">Check</div>
                                <div className="badge success">Submit SD</div>
                                <div className="badge success">Customs</div>
                                <div className="badge success">On Load</div>
                                <div className="badge success">CEPZ</div>
                                <div className="badge warning">Inhouse</div>
                              </div>
                              <div className="fill_area">TEST</div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">09/01</div>
                                <div className="badge ">09/03</div>
                                <div className="badge ">09/09</div>
                                <div className="badge ">09/15</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/24</div>
                                <div className="badge ">09/28</div>
                                <div className="badge ">09/30</div>
                              </div>
                            </div>
                            <div className="lot_content_left border_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">MI %</div>
                                <div className="badge ">QCP %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10 allow_margin">
                                <div className="badge ">80 %</div>
                                <div className="badge ">70 %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">Late</div>
                                <div className="badge danger">Partial Fail</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="single_lot d-flex justify-content-between">
                          <div className="lot_no">Lot 2</div>
                          <div className="lot_content d-flex gap_10">
                            <div className="lot_content_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge success">Book PO</div>
                                <div className="badge success">Submit PI</div>
                                <div className="badge success">Open LC</div>
                                <div className="badge success">Check</div>
                                <div className="badge success">Submit SD</div>
                                <div className="badge success">Customs</div>
                                <div className="badge success">On Load</div>
                                <div className="badge success">CEPZ</div>
                                <div className="badge warning">Inhouse</div>
                              </div>
                              <div className="fill_area">TEST</div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">09/01</div>
                                <div className="badge ">09/03</div>
                                <div className="badge ">09/09</div>
                                <div className="badge ">09/15</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/24</div>
                                <div className="badge ">09/28</div>
                                <div className="badge ">09/30</div>
                              </div>
                            </div>
                            <div className="lot_content_left border_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">MI %</div>
                                <div className="badge ">QCP %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10 allow_margin">
                                <div className="badge ">80 %</div>
                                <div className="badge ">70 %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">Late</div>
                                <div className="badge danger">Partial Fail</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="list-group-item d-flex justify-content-between">
                        <div className="item">
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
                        </div>
                        <div className="item">Body Fabric</div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> Velcord Tex Ltd
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> ASH FAB{" "}
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 1.78-3%
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 03.37$/yds
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 012240 yds
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> $ 0040,881.60
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> Inhoused
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 09/20/24
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 10/20/24
                        </div>
                      </div>
                      <div className="list-group-item expanded">
                        <div className="single_lot d-flex justify-content-between">
                          <div className="lot_no">Lot 1</div>
                          <div className="lot_content d-flex gap_10">
                            <div className="lot_content_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge success">Book PO</div>
                                <div className="badge success">Submit PI</div>
                                <div className="badge success">Open LC</div>
                                <div className="badge success">Check</div>
                                <div className="badge success">Submit SD</div>
                                <div className="badge success">Customs</div>
                                <div className="badge success">On Load</div>
                                <div className="badge success">CEPZ</div>
                                <div className="badge warning">Inhouse</div>
                              </div>
                              <div className="fill_area">TEST</div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">09/01</div>
                                <div className="badge ">09/03</div>
                                <div className="badge ">09/09</div>
                                <div className="badge ">09/15</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/24</div>
                                <div className="badge ">09/28</div>
                                <div className="badge ">09/30</div>
                              </div>
                            </div>
                            <div className="lot_content_left border_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">MI %</div>
                                <div className="badge ">QCP %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10 allow_margin">
                                <div className="badge ">80 %</div>
                                <div className="badge ">70 %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">Late</div>
                                <div className="badge danger">Partial Fail</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="single_lot d-flex justify-content-between">
                          <div className="lot_no">Lot 2</div>
                          <div className="lot_content d-flex gap_10">
                            <div className="lot_content_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge success">Book PO</div>
                                <div className="badge success">Submit PI</div>
                                <div className="badge success">Open LC</div>
                                <div className="badge success">Check</div>
                                <div className="badge success">Submit SD</div>
                                <div className="badge success">Customs</div>
                                <div className="badge success">On Load</div>
                                <div className="badge success">CEPZ</div>
                                <div className="badge warning">Inhouse</div>
                              </div>
                              <div className="fill_area">TEST</div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">09/01</div>
                                <div className="badge ">09/03</div>
                                <div className="badge ">09/09</div>
                                <div className="badge ">09/15</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/24</div>
                                <div className="badge ">09/28</div>
                                <div className="badge ">09/30</div>
                              </div>
                            </div>
                            <div className="lot_content_left border_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">MI %</div>
                                <div className="badge ">QCP %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10 allow_margin">
                                <div className="badge ">80 %</div>
                                <div className="badge ">70 %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">Late</div>
                                <div className="badge danger">Partial Fail</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className="list-group">
                      <div
                        className="list-group-item direction d-flex justify-content-between"
                        style={{ backgroundColor: "#ECECEC" }}
                      >
                        <div className="item"> Trims</div>

                        <div className="item d-flex gap_10">
                          <div className="item">
                            {" "}
                            <span className="step_border"></span> MID
                          </div>
                          <div className="item">
                            {" "}
                            <span className="step_border"></span> EMID
                          </div>
                        </div>
                      </div>

                      <div className="list-group-item d-flex justify-content-between">
                        <div className="item">
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
                        </div>
                        <div className="item">Button</div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> Velcord Tex Ltd
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> ASH FAB{" "}
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 1.78-3%
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 03.37$/yds
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 012240 yds
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> $ 0040,881.60
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> Inhoused
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 09/20/24
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 10/20/24
                        </div>
                      </div>
                      <div className="list-group-item expanded">
                        <div className="single_lot d-flex justify-content-between">
                          <div className="lot_no">Lot 1</div>
                          <div className="lot_content d-flex gap_10">
                            <div className="lot_content_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge success">Book PO</div>
                                <div className="badge success">Submit PI</div>
                                <div className="badge success">Open LC</div>
                                <div className="badge success">Check</div>
                                <div className="badge success">Submit SD</div>
                                <div className="badge success">Customs</div>
                                <div className="badge success">On Load</div>
                                <div className="badge success">CEPZ</div>
                                <div className="badge warning">Inhouse</div>
                              </div>
                              <div className="fill_area">TEST</div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">09/01</div>
                                <div className="badge ">09/03</div>
                                <div className="badge ">09/09</div>
                                <div className="badge ">09/15</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/24</div>
                                <div className="badge ">09/28</div>
                                <div className="badge ">09/30</div>
                              </div>
                            </div>
                            <div className="lot_content_left border_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">MI %</div>
                                <div className="badge ">QCP %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10 allow_margin">
                                <div className="badge ">80 %</div>
                                <div className="badge ">70 %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">Late</div>
                                <div className="badge danger">Partial Fail</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="single_lot d-flex justify-content-between">
                          <div className="lot_no">Lot 2</div>
                          <div className="lot_content d-flex gap_10">
                            <div className="lot_content_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge success">Book PO</div>
                                <div className="badge success">Submit PI</div>
                                <div className="badge success">Open LC</div>
                                <div className="badge success">Check</div>
                                <div className="badge success">Submit SD</div>
                                <div className="badge success">Customs</div>
                                <div className="badge success">On Load</div>
                                <div className="badge success">CEPZ</div>
                                <div className="badge warning">Inhouse</div>
                              </div>
                              <div className="fill_area">TEST</div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">09/01</div>
                                <div className="badge ">09/03</div>
                                <div className="badge ">09/09</div>
                                <div className="badge ">09/15</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/24</div>
                                <div className="badge ">09/28</div>
                                <div className="badge ">09/30</div>
                              </div>
                            </div>
                            <div className="lot_content_left border_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">MI %</div>
                                <div className="badge ">QCP %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10 allow_margin">
                                <div className="badge ">80 %</div>
                                <div className="badge ">70 %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">Late</div>
                                <div className="badge danger">Partial Fail</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="list-group-item d-flex justify-content-between">
                        <div className="item">
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
                        </div>
                        <div className="item">Thread</div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> Velcord Tex Ltd
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> ASH FAB{" "}
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 1.78-3%
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 03.37$/yds
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 012240 yds
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> $ 0040,881.60
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> Inhoused
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 09/20/24
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 10/20/24
                        </div>
                      </div>
                      <div className="list-group-item expanded">
                        <div className="single_lot d-flex justify-content-between">
                          <div className="lot_no">Lot 1</div>
                          <div className="lot_content d-flex gap_10">
                            <div className="lot_content_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge success">Book PO</div>
                                <div className="badge success">Submit PI</div>
                                <div className="badge success">Open LC</div>
                                <div className="badge success">Check</div>
                                <div className="badge success">Submit SD</div>
                                <div className="badge success">Customs</div>
                                <div className="badge success">On Load</div>
                                <div className="badge success">CEPZ</div>
                                <div className="badge warning">Inhouse</div>
                              </div>
                              <div className="fill_area">TEST</div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">09/01</div>
                                <div className="badge ">09/03</div>
                                <div className="badge ">09/09</div>
                                <div className="badge ">09/15</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/24</div>
                                <div className="badge ">09/28</div>
                                <div className="badge ">09/30</div>
                              </div>
                            </div>
                            <div className="lot_content_left border_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">MI %</div>
                                <div className="badge ">QCP %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10 allow_margin">
                                <div className="badge ">80 %</div>
                                <div className="badge ">70 %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">Late</div>
                                <div className="badge danger">Partial Fail</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="single_lot d-flex justify-content-between">
                          <div className="lot_no">Lot 2</div>
                          <div className="lot_content d-flex gap_10">
                            <div className="lot_content_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge success">Book PO</div>
                                <div className="badge success">Submit PI</div>
                                <div className="badge success">Open LC</div>
                                <div className="badge success">Check</div>
                                <div className="badge success">Submit SD</div>
                                <div className="badge success">Customs</div>
                                <div className="badge success">On Load</div>
                                <div className="badge success">CEPZ</div>
                                <div className="badge warning">Inhouse</div>
                              </div>
                              <div className="fill_area">TEST</div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">09/01</div>
                                <div className="badge ">09/03</div>
                                <div className="badge ">09/09</div>
                                <div className="badge ">09/15</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/24</div>
                                <div className="badge ">09/28</div>
                                <div className="badge ">09/30</div>
                              </div>
                            </div>
                            <div className="lot_content_left border_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">MI %</div>
                                <div className="badge ">QCP %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10 allow_margin">
                                <div className="badge ">80 %</div>
                                <div className="badge ">70 %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">Late</div>
                                <div className="badge danger">Partial Fail</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="list-group-item d-flex justify-content-between">
                        <div className="item">
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
                        </div>
                        <div className="item">Embroadary Thread</div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> Velcord Tex Ltd
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> ASH FAB{" "}
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 1.78-3%
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 03.37$/yds
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 012240 yds
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> $ 0040,881.60
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> Inhoused
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 09/20/24
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 10/20/24
                        </div>
                      </div>
                      <div className="list-group-item expanded">
                        <div className="single_lot d-flex justify-content-between">
                          <div className="lot_no">Lot 1</div>
                          <div className="lot_content d-flex gap_10">
                            <div className="lot_content_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge success">Book PO</div>
                                <div className="badge success">Submit PI</div>
                                <div className="badge success">Open LC</div>
                                <div className="badge success">Check</div>
                                <div className="badge success">Submit SD</div>
                                <div className="badge success">Customs</div>
                                <div className="badge success">On Load</div>
                                <div className="badge success">CEPZ</div>
                                <div className="badge warning">Inhouse</div>
                              </div>
                              <div className="fill_area">TEST</div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">09/01</div>
                                <div className="badge ">09/03</div>
                                <div className="badge ">09/09</div>
                                <div className="badge ">09/15</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/24</div>
                                <div className="badge ">09/28</div>
                                <div className="badge ">09/30</div>
                              </div>
                            </div>
                            <div className="lot_content_left border_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">MI %</div>
                                <div className="badge ">QCP %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10 allow_margin">
                                <div className="badge ">80 %</div>
                                <div className="badge ">70 %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">Late</div>
                                <div className="badge danger">Partial Fail</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="single_lot d-flex justify-content-between">
                          <div className="lot_no">Lot 2</div>
                          <div className="lot_content d-flex gap_10">
                            <div className="lot_content_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge success">Book PO</div>
                                <div className="badge success">Submit PI</div>
                                <div className="badge success">Open LC</div>
                                <div className="badge success">Check</div>
                                <div className="badge success">Submit SD</div>
                                <div className="badge success">Customs</div>
                                <div className="badge success">On Load</div>
                                <div className="badge success">CEPZ</div>
                                <div className="badge warning">Inhouse</div>
                              </div>
                              <div className="fill_area">TEST</div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">09/01</div>
                                <div className="badge ">09/03</div>
                                <div className="badge ">09/09</div>
                                <div className="badge ">09/15</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/24</div>
                                <div className="badge ">09/28</div>
                                <div className="badge ">09/30</div>
                              </div>
                            </div>
                            <div className="lot_content_left border_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">MI %</div>
                                <div className="badge ">QCP %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10 allow_margin">
                                <div className="badge ">80 %</div>
                                <div className="badge ">70 %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">Late</div>
                                <div className="badge danger">Partial Fail</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className="list-group">
                      <div
                        className="list-group-item direction d-flex justify-content-between"
                        style={{ backgroundColor: "#ECECEC" }}
                      >
                        <div className="item"> Finishing Material</div>

                        <div className="item d-flex gap_10">
                          <div className="item">
                            {" "}
                            <span className="step_border"></span> MID
                          </div>
                          <div className="item">
                            {" "}
                            <span className="step_border"></span> EMID
                          </div>
                        </div>
                      </div>

                      <div className="list-group-item d-flex justify-content-between">
                        <div className="item">
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
                        </div>
                        <div className="item">Cartons</div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> Velcord Tex Ltd
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> ASH FAB{" "}
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 1.78-3%
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 03.37$/yds
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 012240 yds
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> $ 0040,881.60
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> Inhoused
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 09/20/24
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 10/20/24
                        </div>
                      </div>
                      <div className="list-group-item expanded">
                        <div className="single_lot d-flex justify-content-between">
                          <div className="lot_no">Lot 1</div>
                          <div className="lot_content d-flex gap_10">
                            <div className="lot_content_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge success">Book PO</div>
                                <div className="badge success">Submit PI</div>
                                <div className="badge success">Open LC</div>
                                <div className="badge success">Check</div>
                                <div className="badge success">Submit SD</div>
                                <div className="badge success">Customs</div>
                                <div className="badge success">On Load</div>
                                <div className="badge success">CEPZ</div>
                                <div className="badge warning">Inhouse</div>
                              </div>
                              <div className="fill_area">TEST</div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">09/01</div>
                                <div className="badge ">09/03</div>
                                <div className="badge ">09/09</div>
                                <div className="badge ">09/15</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/24</div>
                                <div className="badge ">09/28</div>
                                <div className="badge ">09/30</div>
                              </div>
                            </div>
                            <div className="lot_content_left border_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">MI %</div>
                                <div className="badge ">QCP %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10 allow_margin">
                                <div className="badge ">80 %</div>
                                <div className="badge ">70 %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">Late</div>
                                <div className="badge danger">Partial Fail</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="single_lot d-flex justify-content-between">
                          <div className="lot_no">Lot 2</div>
                          <div className="lot_content d-flex gap_10">
                            <div className="lot_content_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge success">Book PO</div>
                                <div className="badge success">Submit PI</div>
                                <div className="badge success">Open LC</div>
                                <div className="badge success">Check</div>
                                <div className="badge success">Submit SD</div>
                                <div className="badge success">Customs</div>
                                <div className="badge success">On Load</div>
                                <div className="badge success">CEPZ</div>
                                <div className="badge warning">Inhouse</div>
                              </div>
                              <div className="fill_area">TEST</div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">09/01</div>
                                <div className="badge ">09/03</div>
                                <div className="badge ">09/09</div>
                                <div className="badge ">09/15</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/24</div>
                                <div className="badge ">09/28</div>
                                <div className="badge ">09/30</div>
                              </div>
                            </div>
                            <div className="lot_content_left border_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">MI %</div>
                                <div className="badge ">QCP %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10 allow_margin">
                                <div className="badge ">80 %</div>
                                <div className="badge ">70 %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">Late</div>
                                <div className="badge danger">Partial Fail</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="list-group-item d-flex justify-content-between">
                        <div className="item">
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
                        </div>
                        <div className="item">Hanger</div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> Velcord Tex Ltd
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> ASH FAB{" "}
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 1.78-3%
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 03.37$/yds
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 012240 yds
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> $ 0040,881.60
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> Inhoused
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 09/20/24
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 10/20/24
                        </div>
                      </div>
                      <div className="list-group-item expanded">
                        <div className="single_lot d-flex justify-content-between">
                          <div className="lot_no">Lot 1</div>
                          <div className="lot_content d-flex gap_10">
                            <div className="lot_content_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge success">Book PO</div>
                                <div className="badge success">Submit PI</div>
                                <div className="badge success">Open LC</div>
                                <div className="badge success">Check</div>
                                <div className="badge success">Submit SD</div>
                                <div className="badge success">Customs</div>
                                <div className="badge success">On Load</div>
                                <div className="badge success">CEPZ</div>
                                <div className="badge warning">Inhouse</div>
                              </div>
                              <div className="fill_area">TEST</div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">09/01</div>
                                <div className="badge ">09/03</div>
                                <div className="badge ">09/09</div>
                                <div className="badge ">09/15</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/24</div>
                                <div className="badge ">09/28</div>
                                <div className="badge ">09/30</div>
                              </div>
                            </div>
                            <div className="lot_content_left border_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">MI %</div>
                                <div className="badge ">QCP %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10 allow_margin">
                                <div className="badge ">80 %</div>
                                <div className="badge ">70 %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">Late</div>
                                <div className="badge danger">Partial Fail</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="single_lot d-flex justify-content-between">
                          <div className="lot_no">Lot 2</div>
                          <div className="lot_content d-flex gap_10">
                            <div className="lot_content_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge success">Book PO</div>
                                <div className="badge success">Submit PI</div>
                                <div className="badge success">Open LC</div>
                                <div className="badge success">Check</div>
                                <div className="badge success">Submit SD</div>
                                <div className="badge success">Customs</div>
                                <div className="badge success">On Load</div>
                                <div className="badge success">CEPZ</div>
                                <div className="badge warning">Inhouse</div>
                              </div>
                              <div className="fill_area">TEST</div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">09/01</div>
                                <div className="badge ">09/03</div>
                                <div className="badge ">09/09</div>
                                <div className="badge ">09/15</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/24</div>
                                <div className="badge ">09/28</div>
                                <div className="badge ">09/30</div>
                              </div>
                            </div>
                            <div className="lot_content_left border_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">MI %</div>
                                <div className="badge ">QCP %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10 allow_margin">
                                <div className="badge ">80 %</div>
                                <div className="badge ">70 %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">Late</div>
                                <div className="badge danger">Partial Fail</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="list-group-item d-flex justify-content-between">
                        <div className="item">
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
                        </div>
                        <div className="item">Poly Bag</div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> Velcord Tex Ltd
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> ASH FAB{" "}
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 1.78-3%
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 03.37$/yds
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 012240 yds
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> $ 0040,881.60
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> Inhoused
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 09/20/24
                        </div>
                        <div className="item">
                          {" "}
                          <span className="step_border"></span> 10/20/24
                        </div>
                      </div>
                      <div className="list-group-item expanded">
                        <div className="single_lot d-flex justify-content-between">
                          <div className="lot_no">Lot 1</div>
                          <div className="lot_content d-flex gap_10">
                            <div className="lot_content_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge success">Book PO</div>
                                <div className="badge success">Submit PI</div>
                                <div className="badge success">Open LC</div>
                                <div className="badge success">Check</div>
                                <div className="badge success">Submit SD</div>
                                <div className="badge success">Customs</div>
                                <div className="badge success">On Load</div>
                                <div className="badge success">CEPZ</div>
                                <div className="badge warning">Inhouse</div>
                              </div>
                              <div className="fill_area">TEST</div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">09/01</div>
                                <div className="badge ">09/03</div>
                                <div className="badge ">09/09</div>
                                <div className="badge ">09/15</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/24</div>
                                <div className="badge ">09/28</div>
                                <div className="badge ">09/30</div>
                              </div>
                            </div>
                            <div className="lot_content_left border_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">MI %</div>
                                <div className="badge ">QCP %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10 allow_margin">
                                <div className="badge ">80 %</div>
                                <div className="badge ">70 %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">Late</div>
                                <div className="badge danger">Partial Fail</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="single_lot d-flex justify-content-between">
                          <div className="lot_no">Lot 2</div>
                          <div className="lot_content d-flex gap_10">
                            <div className="lot_content_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge success">Book PO</div>
                                <div className="badge success">Submit PI</div>
                                <div className="badge success">Open LC</div>
                                <div className="badge success">Check</div>
                                <div className="badge success">Submit SD</div>
                                <div className="badge success">Customs</div>
                                <div className="badge success">On Load</div>
                                <div className="badge success">CEPZ</div>
                                <div className="badge warning">Inhouse</div>
                              </div>
                              <div className="fill_area">TEST</div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">09/01</div>
                                <div className="badge ">09/03</div>
                                <div className="badge ">09/09</div>
                                <div className="badge ">09/15</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/20</div>
                                <div className="badge ">09/24</div>
                                <div className="badge ">09/28</div>
                                <div className="badge ">09/30</div>
                              </div>
                            </div>
                            <div className="lot_content_left border_left">
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">MI %</div>
                                <div className="badge ">QCP %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10 allow_margin">
                                <div className="badge ">80 %</div>
                                <div className="badge ">70 %</div>
                              </div>
                              <div className="lot_steps d-flex justify-content-between gap_10">
                                <div className="badge ">Late</div>
                                <div className="badge danger">Partial Fail</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <br />
              </div>
            </div>
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
                  <span className="purchase_text">
                    {" "}
                    Material Purchase Order
                  </span>
                </div>
              </div>
              <div className="">
                <div className="row">
                  <div className="col-4">
                    <input
                      className="form-control"
                      type="text"
                      name="title"
                      placeholder="WO"
                      styles={customStyles}
                    />
                  </div>
                  <div className="col-4">
                    <Select
                      className="select_wo"
                      placeholder="material Type"
                      options={workOrders}
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                    />
                  </div>
                  <div className="col-4">
                    <input
                      className="form-control"
                      type="text"
                      name="title"
                      placeholder="PO"
                      styles={customStyles}
                    />
                  </div>
                  <div className="col-4">
                    <input
                      className="form-control"
                      type="text"
                      name="title"
                      placeholder="WO QTY"
                      styles={customStyles}
                    />
                  </div>
                  <div className="col-4">
                    <Select
                      className="select_wo"
                      placeholder="Booking Ref"
                      options={workOrders}
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                    />
                  </div>
                  <div className="col-4">
                    <input
                      className="form-control"
                      type="date"
                      name="title"
                      placeholder="Issue Date"
                      styles={customStyles}
                    />
                  </div>
                  <div className="col-4">
                    <input
                      className="form-control"
                      type="text"
                      name="title"
                      placeholder="Item"
                      styles={customStyles}
                    />
                  </div>
                  <div className="col-4">
                    <input
                      className="form-control"
                      type="text"
                      name="title"
                      placeholder="Style"
                      styles={customStyles}
                    />
                  </div>

                  <div className="col-4">
                    <Select
                      className="select_wo"
                      placeholder="Supplier Material Name "
                      options={workOrders}
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                    />
                  </div>

                  <div className="col-4">
                    <input
                      className="form-control"
                      type="text"
                      name="title"
                      placeholder="Oder QTY"
                      styles={customStyles}
                    />
                  </div>
                  <div className="col-4">
                    <Select
                      className="select_wo"
                      placeholder="Vendor"
                      options={workOrders}
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                    />
                  </div>
                  <div className="col-4">
                    <Select
                      className="select_wo"
                      placeholder="Buyer"
                      options={workOrders}
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                    />
                  </div>

                  <div className="col-4">
                    <input
                      className="form-control"
                      type="text"
                      name="title"
                      placeholder="Order value"
                      styles={customStyles}
                    />
                  </div>

                  <div className="col-4">
                    <input
                      className="form-control"
                      type="date"
                      name="title"
                      placeholder="Booking date"
                      styles={customStyles}
                    />
                  </div>

                  <div className="col-4">
                    <input
                      className="form-control"
                      type="date"
                      name="title"
                      placeholder="Delivery date"
                      styles={customStyles}
                    />
                  </div>
                </div>
                <hr />
                <div className="row">
                  <h6>Order Breakdown</h6>
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
                  <div className="col-lg-12">
                    <div className="terms_details_area">
                      <div className="terms_header d-flex justify-content-between">
                        <div className="text">Terms & Conditions</div>
                        <button>Request Rivision</button>
                      </div>
                      <div className="row">
                        <div className="col-lg-3">Mode of Shipment:</div>
                        <div className="col-lg-9">By Sea </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-3">Payment terms:</div>
                        <div className="col-lg-9">
                          By TT, payment will be made within 15 working days of
                          shipment date.
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-3">Payee Bank:</div>
                        <div className="col-lg-9">
                          WELLS FARGO BANK, N. A, (New York International
                          Branch) New York, NY, USA
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-3">Shipper Bank:</div>
                        <div className="col-lg-9">
                          EXPORT IMPORT BANK OF BANGLADSH LIMITED, AGRABAD
                          BRANCH
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-3">Porr Of Loading:</div>
                        <div className="col-lg-9">Chittagong, Bangladesh</div>
                      </div>
                      <div className="row">
                        <div className="col-lg-3">Port of Destination:</div>
                        <div className="col-lg-9">New York, USA </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-3">Date of Shipment:</div>
                        <div className="col-lg-9">15-Aug-24</div>
                      </div>
                      <div className="row">
                        <div className="col-lg-3">Date of Expiry:</div>
                        <div className="col-lg-9">14-Apr-25</div>
                      </div>
                      <div className="row">
                        <div className="col-lg-3">Partial shipment :</div>
                        <div className="col-lg-9">Allowed </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-3">Defective Allowance: :</div>
                        <div className="col-lg-9">
                          0.5% deduction is allowed in the commercial invoice
                          within reason.
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-3">Documents required::</div>
                        <div className="col-lg-9">Commercial Invoice</div>
                      </div>
                    </div>
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col-lg-12">
                    <div className="row signature_part">
                      <div className="col-lg-3 border">Merchant: Anik Das </div>
                      <div className="col-lg-3 border">FG ID: </div>
                      <div className="col-lg-3 border">FG Pass: </div>
                      <div className="col-lg-3 border">Buyer Signatory:</div>
                    </div>
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
