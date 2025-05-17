import React from "react";

export default function InnerSearch(props) {
  return (
    <div className="inner_search_area">
      <span className="search_icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15.207"
          height="14.78"
          viewBox="0 0 15.207 14.78"
        >
          <g
            id="Group_18"
            data-name="Group 18"
            transform="translate(-1466 -34)"
          >
            <g
              id="Ellipse_1"
              data-name="Ellipse 1"
              transform="translate(1466 34)"
              fill="none"
              stroke="#707070"
              strokeWidth="1"
            >
              <circle cx="5.885" cy="5.885" r="5.885" stroke="none" />
              <circle cx="5.885" cy="5.885" r="5.385" fill="none" />
            </g>
          </g>
          <line
            id="Line_189"
            data-name="Line 189"
            x2="4.393"
            y2="4.062"
            transform="translate(10.107 10.012)"
            fill="none"
            stroke="#707070"
            strokeLinecap="round"
            strokeWidth="1"
          />
        </svg>
      </span>
      <input
        type="search"
        onChange={(e) =>
          props.setHeaderData((prevData) => ({
            ...prevData,
            innerSearchValue: e.target.value,
          }))
        }
        value={props.headerData?.innerSearchValue}
        className="form-control border-0 margin_bottom_0 inside_searchbar"
        placeholder="Search"
      />
    </div>
  );
}
