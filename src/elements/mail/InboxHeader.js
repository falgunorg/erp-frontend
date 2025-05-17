import React, { useState, useEffect, useRef } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import {
  FilterIcon,
  FilterActiveIcon,
  SortIcon,
  SortActiveIcon,
  ToggleCheckboxIcon,
  ToggleCheckboxActiveIcon,
} from "../SvgIcons";

const InboxHeader = ({
  toggleSelectAll,
  setFilter,
  setToMeActive,
  toMeFilter,
  toMeActive,
  filter,
  filterToggle,
  setSortOrder,
  mailFolder,
  emails,
  selectedMailIds,
  toggleMarkAble,
  props,
}) => {
  const [filterAble, setFilterAble] = useState(false);
  const [sortAble, setSortAble] = useState(false);

  // References for dropdown containers
  const filterRef = useRef(null);
  const sortRef = useRef(null);

  // Function to handle clicks outside dropdowns
  const handleClickOutside = (event) => {
    if (
      filterRef.current &&
      !filterRef.current.contains(event.target) &&
      sortRef.current &&
      !sortRef.current.contains(event.target)
    ) {
      setFilterAble(false);
      setSortAble(false);
    }
  };

  // Attach event listener when filterAble or sortAble is true
  useEffect(() => {
    if (filterAble || sortAble) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterAble, sortAble]);

  return (
    <div className="inbox-header">
      <div className="inbox_header_left">
        <div className="title">
          <span style={{ width: "20px", display: "inline-block" }}>
            {props.markMail && (
              <input
                onClick={toggleSelectAll}
                type="checkbox"
                checked={selectedMailIds.length === emails.length}
              />
            )}
          </span>
          {mailFolder.folderName}
        </div>

        <div className="buttons_group">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => {
              setFilter("all");
              setToMeActive(false);
            }}
          >
            All
          </button>
          <button
            className={filter === "unread" ? "active" : ""}
            onClick={() => {
              setFilter(filter === "unread" ? "all" : "unread");
              setToMeActive(false);
            }}
          >
            Unread
          </button>

          {mailFolder.folderName === "Inbox" && (
            <button
              className={toMeActive ? "active" : ""}
              onClick={() => {
                toMeFilter();
                setToMeActive(!toMeActive);
                setFilter("");
              }}
            >
              To me
            </button>
          )}
        </div>
      </div>
      {emails.length > 0 && (
        <div
          className="inbox_header_left"
          style={{ paddingLeft: "0px", textAlign: "right" }}
        >
          <button
            className="filter_btn"
            style={{ cursor: "pointer" }}
            onClick={toggleMarkAble}
          >
            {props.markMail ? (
              <ToggleCheckboxActiveIcon />
            ) : (
              <ToggleCheckboxIcon />
            )}
          </button>

          {/* Filter Dropdown */}
          <Dropdown
            ref={filterRef}
            className="mail_filter_dropdown"
            onClick={() => {
              filterToggle();
              setFilterAble(!filterAble);
            }}
          >
            <Dropdown.Toggle
              id="dropdown-filter"
              variant="secondary"
              className="filter_btn"
            >
              {filterAble ? <FilterActiveIcon /> : <FilterIcon />}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setFilter("all")}>
                All
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter("flagged")}>
                Flag
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter("important")}>
                Important
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter("event")}>
                Event
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* Sort Dropdown */}
          <Dropdown
            ref={sortRef}
            className="mail_filter_dropdown"
            onClick={() => {
              filterToggle();
              setSortAble(!sortAble);
            }}
          >
            <Dropdown.Toggle
              id="dropdown-sort"
              variant="secondary"
              className="filter_btn"
            >
              {sortAble ? <SortActiveIcon /> : <SortIcon />}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSortOrder("date")}>
                Date
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSortOrder("from")}>
                From
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSortOrder("subject")}>
                Subject
              </Dropdown.Item>
              <Dropdown.Item>Buyer</Dropdown.Item>
              <Dropdown.Item>WO</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}
    </div>
  );
};

export default InboxHeader;
