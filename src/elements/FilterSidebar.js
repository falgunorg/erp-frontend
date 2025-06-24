import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";

export default function FilterSidebar(props) {
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

  return (
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
  );
}
