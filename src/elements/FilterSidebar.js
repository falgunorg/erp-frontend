import React, { useState, useEffect } from "react";
import CustomSelect from "./CustomSelect";

export default function FilterSidebar(props) {
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
        <CustomSelect
          className="select_wo"
          placeholder="Search Or Select"
          options={workOrders}
        />
      </div>

      <div className="email-section">
        <div className="folder_name">Ext. Factory Date</div>

        <CustomSelect
          className="select_wo"
          placeholder="Search Or Select"
          options={months.map((month, index) => ({
            label: month,
            value: index,
          }))}
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
