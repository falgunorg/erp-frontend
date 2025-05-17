import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const HeaderDropdown = ({ headerData }) => {
  const location = useLocation();
  const pagePath = location.pathname;
  const [selectedItem, setSelectedItem] = useState("Dropdown Button");

  useEffect(() => {
    // Check if the current pagePath matches any option URL
    const matchingOption = headerData?.DropdownMenu.find(
      (option) => option.url === pagePath
    );
    if (matchingOption) {
      setSelectedItem(matchingOption.title); // Set the selected item to the matching option's title
    }
  }, [pagePath, headerData]);

  const handleSelect = (eventKey, event) => {
    setSelectedItem(event.target.textContent); // Update selected item based on clicked item's text
  };

  return (
    <Dropdown className="header_dropdown" onSelect={handleSelect}>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {selectedItem}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {headerData?.DropdownMenu.map((option, index) => (
          <Dropdown.Item key={index} eventKey={index} href={option.url}>
            {option.title}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default HeaderDropdown;
