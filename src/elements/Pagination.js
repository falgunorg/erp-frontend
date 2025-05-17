import React, { useState } from "react";

const Pagination = ({ links, setCurrentPage, currentPage }) => {
  const handleClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <nav>
        <ul className="pagination">
          {links.map((link, index) => (
            <li
              key={index}
              className={`page-item ${link.active ? "active" : ""}`}
              style={{ margin: "0 5px" }}
            >
              {link.label === "&laquo; Previous" ? (
                <button
                  onClick={() => handleClick(currentPage - 1)}
                  className={`page-link ${link.active ? "active" : ""}`}
                  disabled={currentPage === 1 ? true : false}
                >
                  <span dangerouslySetInnerHTML={{ __html: link.label }} />
                </button>
              ) : link.label === "Next &raquo;" ? (
                <button
                  onClick={() => handleClick(currentPage + 1)}
                  className={`page-link ${link.active ? "active" : ""}`}
                  disabled={currentPage === links.length ? true : false}
                >
                  <span dangerouslySetInnerHTML={{ __html: link.label }} />
                </button>
              ) : (
                <button
                  className={`page-link ${link.active ? "active" : ""}`}
                  onClick={() => handleClick(parseInt(link.label))}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              )}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Pagination;
