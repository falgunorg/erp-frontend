import React, { useState } from "react";
import ReactDOM from "react-dom";
import SingleMailWindow from "./SingleMailWindow";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, ArrowDownIcon, ArrowRightIcon } from "../SvgIcons";

const MailingSingle = ({
  item,
  index,
  activeIndex,
  handleItemClick,
  handleContextMenu,
  toggleSelectChange,

  selectedMailIds,
  mailMinimize,
  mailFolder,
  onToggleMailChain,
  isSubMail,
  props,
}) => {
  const [directiveID, setDirectiveID] = useState("");

  const toggleDirective = (id) => {
    if (directiveID === id) {
      setDirectiveID("");
    } else {
      setDirectiveID(id);
    }
  };

  //DOUBLE CLICK HANDLER
  const handleDoubleClick = (item) => {
    const newWindow = window.open("", "_blank", "width=1080,height=500");

    if (newWindow) {
      newWindow.document.title = item.subject;
      // Create a container in the new window
      const container = newWindow.document.createElement("div");
      newWindow.document.body.appendChild(container);
      // Render an empty component initially
      ReactDOM.render(
        <SingleMailWindow item={props.selectedMail} />,
        container
      );

      // Delay postMessage to ensure the new window is ready
      setTimeout(() => {
        newWindow.postMessage(item, "*");
      }, 500);
    }
  };

  const handleDelete = (id) => {
    mailMinimize.handleDelete(id);
    props.setSelectedMail({});
    props.setSelectedMailIds([]);
  };

  const handlePermanentDelete = (id) => {
    mailMinimize.handlePermanentDelete(id);
    props.setSelectedMail({});
    props.setSelectedMailIds([]);
  };

  return (
    <div
      style={{
        borderLeft:
          item.isRead === false
            ? "2px solid #ef9a3e"
            : item.importance === "high"
            ? "2px solid red"
            : "1px solid #dee2e6",
      }}
      key={`${item.id}-${index}`}
      className={
        index === activeIndex ? "single_mail_item active" : "single_mail_item"
      }
      onClick={() => {
        handleItemClick(index, item.id);
      }}
      onContextMenu={(e) => handleContextMenu(e, item)}
      onDoubleClick={() => handleDoubleClick(item)}
    >
      <div
        className="mail_text text-center"
        style={{
          paddingLeft:
            item.isRead === false
              ? "4px"
              : item.importance === "high"
              ? "4px"
              : "5px",
        }}
      >
        {props.markMail
          ? !isSubMail && (
              <input
                onChange={() => toggleSelectChange(item.id)}
                type="checkbox"
                checked={selectedMailIds.includes(item.id)}
              />
            )
          : !isSubMail &&
            item.hasMailChain > 1 && (
              <Link
                to="#"
                style={{ width: "100%", display: "block" }}
                onClick={() => {
                  onToggleMailChain();
                  toggleDirective(item.id);
                }}
              >
                {directiveID === item.id ? (
                  <ArrowDownIcon />
                ) : (
                  <ArrowRightIcon />
                )}
              </Link>
            )}
      </div>

      <div
        style={{ marginLeft: isSubMail ? "-10px" : "0px" }}
        title={item.subject}
        className={item.isRead === false ? "mail_text unread" : "mail_text"}
      >
        {item.subject ? item.subject : "No Subject"}
      </div>
      <div title={item.sender?.emailAddress?.name} className="mail_text">
        <span className="step_border"></span>
        {item.sender?.emailAddress?.name}
      </div>
      <div title={item.workOrder} className="mail_text">
        <span className="step_border"></span>
        {item.workOrder}
      </div>
      <div
        title={mailMinimize.formatDate(item.receivedDateTime)}
        className="mail_text dateTime"
      >
        <span className="step_border"></span>
        <div className="date_area">
          {" "}
          {mailMinimize.formatDate(item.receivedDateTime)}
        </div>
        <div className="icons-area">
          {/* Display flag and delete icons */}
          {item.flag?.flagStatus === "notFlagged" ? (
            <svg
              className="me-1"
              onClick={() =>
                mailMinimize.toggleFlag(item.id, item.flag.flagStatus)
              }
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="13"
              viewBox="0 0 12 13"
            >
              <path
                id="Polygon_170"
                data-name="Polygon 170"
                d="M5.548,2.965a1,1,0,0,1,1.9,0L8.587,6.5a1,1,0,0,0,.178.328l2.44,2.981a1,1,0,0,1-.979,1.612L6.7,10.683a1,1,0,0,0-.41,0l-3.522.737a1,1,0,0,1-.979-1.612l2.44-2.981A1,1,0,0,0,4.413,6.5Z"
                transform="translate(12) rotate(90)"
                fill="#ff4a4a"
              />
            </svg>
          ) : item.flag?.flagStatus === "flagged" ? (
            <svg
              className="me-1"
              onClick={() =>
                mailMinimize.toggleFlag(item.id, item.flag.flagStatus)
              }
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="13"
              viewBox="0 0 12 13"
            >
              <path
                id="Polygon_170"
                data-name="Polygon 170"
                d="M5.548,2.965a1,1,0,0,1,1.9,0L8.587,6.5a1,1,0,0,0,.178.328l2.44,2.981a1,1,0,0,1-.979,1.612L6.7,10.683a1,1,0,0,0-.41,0l-3.522.737a1,1,0,0,1-.979-1.612l2.44-2.981A1,1,0,0,0,4.413,6.5Z"
                transform="translate(12) rotate(90)"
                fill="#ff4a4a"
              />
            </svg>
          ) : (
            <svg
              className="me-1"
              onClick={() =>
                mailMinimize.toggleFlag(item.id, item.flag.flagStatus)
              }
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="13"
              viewBox="0 0 12 13"
            >
              <path
                id="Polygon_170"
                data-name="Polygon 170"
                d="M5.548,2.965a1,1,0,0,1,1.9,0L8.587,6.5a1,1,0,0,0,.178.328l2.44,2.981a1,1,0,0,1-.979,1.612L6.7,10.683a1,1,0,0,0-.41,0l-3.522.737a1,1,0,0,1-.979-1.612l2.44-2.981A1,1,0,0,0,4.413,6.5Z"
                transform="translate(12) rotate(90)"
                fill="#ff4a4a"
              />
            </svg>
          )}

          {item.categories.length > 0 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="11"
              viewBox="0 0 11 11"
            >
              <rect
                id="Rectangle_99"
                data-name="Rectangle 99"
                width="11"
                height="11"
                rx="1"
                fill="#ffd67b"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="11"
              viewBox="0 0 11 11"
            >
              <rect
                id="Rectangle_184"
                data-name="Rectangle 184"
                width="11"
                height="11"
                rx="1"
                fill="#91cfff"
              />
            </svg>
          )}

          {/* {mailFolder.folderName === "Deleted Items" ? (
            <>
              <i
                onClick={() => mailMinimize.handleRestore(item.id)}
                className="fa fa-recycle text-success"
              ></i>
              <i
                onClick={() => handlePermanentDelete(item.id)}
                className="fa fa-trash text-danger"
              ></i>
            </>
          ) : (
            <i
              onClick={() => handleDelete(item.id)}
              className="fa fa-trash text-danger"
            ></i>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default MailingSingle;
