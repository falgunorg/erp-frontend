import React, { useState } from "react";

const MegaMenuVerticle = ({ items }) => {
  const [submenuPosition, setSubmenuPosition] = useState({ top: 0, left: 0 });
  const [activeItem, setActiveItem] = useState(null);

  const handleMouseEnter = (event, index) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSubmenuPosition({
      top: rect.top,
      left: 50,
    });
    setActiveItem(index);
  };

  const handleMouseLeave = () => {
    setActiveItem(null);
  };

  return (
    <div className="vertical-megamenu">
      {items?.length ? (
        <ul className="menu-list">
          {items.map((item, index) => (
            <li
              className={
                activeItem === index ? "menu-item active" : "menu-item"
              }
              key={index}
              onMouseEnter={(e) => handleMouseEnter(e, index)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={
                  activeItem === index ? "menu-button active" : "menu-button"
                }
              >
                <span className="menu-label">{item.label}</span>
              </button>
              {item.submenu && activeItem === index && (
                <div
                  className="submenu"
                  style={{
                    position: "fixed",
                    top: submenuPosition.top,
                    left: submenuPosition.left,
                  }}
                >
                  {item.submenu.map((submenu, subIndex) => (
                    <div className="submenu-column" key={subIndex}>
                      <div className="submenu-item">
                        <strong className="submenu-item-label">
                          {submenu.label}
                        </strong>
                        <ul className="submenu-sublist">
                          {submenu.options.map((option, optIndex) => (
                            <li key={optIndex}>
                              <a href={option.link}>{option.label}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No menu items available</p>
      )}
    </div>
  );
};

export default MegaMenuVerticle;
