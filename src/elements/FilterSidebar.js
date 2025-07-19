import React, { useState, useEffect } from "react";
import CustomSelect from "./CustomSelect";
import api from "services/api";
export default function FilterSidebar(props) {


  const departments = [
    { id: 1, title: "Mens" },
    { id: 2, title: "Womens" },
    { id: 3, title: "Kids" },
    { id: 4, title: "School Wear" },
  ];

  const [contracts, setContracts] = useState([]);

  const getContracts = async () => {
    var response = await api.post("/public-purchase-contracts");
    if (response.status === 200 && response.data) {
      setContracts(response.data.data);
    }
  };

  const [techpacks, setTechpacks] = useState([]);

  const getTechpacks = async () => {
    var response = await api.post("/technical-packages-all-desc");
    if (response.status === 200 && response.data) {
      setTechpacks(response.data.data);
    }
  };
 

  const handleFormChange = async (name, value) => {
    props.setSidebarFilter((prev) => ({
      ...props.sidebarFilter,
      [name]: value,
    }));
  };



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

  useEffect(() => {
    getContracts();
    getTechpacks();
  }, []);



  return (
    <div className="purchase_sidebar non_printing_area">
      <div className="email-section">
        <div className="folder_name">Department</div>
        <ul>
          {departments.map((department, index) => (
            <li key={index}>
              <button
                onClick={() => handleFormChange("department", department.title)}
                className={
                  props.sidebarFilter?.department === department.title ? "active" : ""
                }
              >
                {department.title} <span>63</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="email-section">
        <div className="folder_name">Purchase Contract</div>
        <ul>
          {contracts.map((contract, index) => (
            <li key={index}>
              <button
                onClick={() =>
                  handleFormChange("purchase_contract_id", contract.id)
                }
                className={
                  props.sidebarFilter?.purchase_contract_id === contract.id
                    ? "active"
                    : ""
                }
              >
                {contract.title} <span>63</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="email-section">
        <div className="folder_name">Styles</div>
        <CustomSelect
          className="select_wo"
          placeholder="Style"
          options={techpacks.map(({ id, techpack_number }) => ({
            value: id,
            label: techpack_number,
          }))}
          onChange={(selectedOption) =>
            handleFormChange("technical_package_id", selectedOption?.value)
          }
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
              <button
                className={props.sidebarFilter?.date === day ? "active" : ""}
                onClick={() => handleFormChange("date", day)}
              >
                {day} <span>3</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
