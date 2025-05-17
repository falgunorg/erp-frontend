import React, { useState } from "react";
import IntlDateTime from "./IntlDateTime";
import { useIsAuthenticated } from "@azure/msal-react";
import SignInButton from "./mail/SignInButton";
import SignOutButton from "./mail/SignOutButton";
import { Badge } from "react-bootstrap";
import moment from "moment";
import { Link } from "react-router-dom";
import api from "services/api";

import {
  HeaderBarIcon,
  HeaderBarActiveIcon,
  HeaderNotificationIcon,
  HeaderNotificationActiveIcon,
  HeaderWhatsappIcon,
  HeaderWhatsappActiveIcon,
  HeaderSearchIcon,
} from "./SvgIcons";

export default function HeaderRightMenu(props) {
  const isAuthenticated = useIsAuthenticated();

  const [expandSearch, setExpandSearch] = useState(false);

  const toggleExpand = () => {
    setExpandSearch(!expandSearch);
  };
  const markAsRead = async (id) => {
    try {
      const response = await api.post("/notifications-read", {
        id: id,
      });
      if (response.status === 200 && response.data) {
        // After marking the notification as read, you may choose to update the notifications list
        props.setCallNotifications(true);

        // Delay for 500 milliseconds before setting the notification back to false
        setTimeout(() => {
          props.setCallNotifications(false);
        }, 500);
      }
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };
  return (
    <div className="header_right_menus ms-auto">
      {expandSearch ? (
        <div
          className={`item expand_searchbar ${expandSearch ? "expanded" : ""}`}
        >
          <div className="expand_inner_search_area">
            <span className="search_icon">
              <HeaderSearchIcon />
            </span>
            <input
              type="search"
              className="form-control border-0 margin_bottom_0 inside_searchbar"
              placeholder="Search"
            />
          </div>
        </div>
      ) : (
        <>
          <IntlDateTime />
          <div className="item dropdown me-2">
            <Link
              style={{ position: "relative" }}
              to="#"
              className=" dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              <div
                style={{
                  position: "absolute",
                  top: "1px",
                  left: "9px",
                  color: "#fff",
                  fontWeight: "600",
                }}
              >
                {props.unreadNotifications.length > 0
                  ? props.unreadNotifications.length
                  : ""}
              </div>
              <HeaderNotificationIcon />
            </Link>
            <div
              style={{
                transform: "translate(-5px, 30px)",
              }}
              className="dropdown-menu dropdown-menu-end"
            >
              {props.unreadNotifications.map((item, index) => (
                <>
                  <Link
                    to={item.url}
                    key={index}
                    onClick={() => markAsRead(item.id)}
                    className="dropdown-item"
                  >
                    <h6 className="fw-normal mb-0">{item.title}</h6>
                    <p style={{ fontSize: "13px" }}>{item.description}</p>
                    <small>
                      {moment(item.created_at).format("MMMM Do YYYY, h:mm A")}
                    </small>
                  </Link>
                  <hr className="dropdown-divider" />
                </>
              ))}

              <a href="#" className="dropdown-item text-center">
                See all notifications
              </a>
            </div>
          </div>
          <div className="item me-2">
            <a
              href="https://web.whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <HeaderWhatsappIcon />
            </a>
          </div>
        </>
      )}

      <div onClick={toggleExpand} className="item me-2">
        <Link to="#" className="#">
          {expandSearch ? (
            <svg
              fill="#ff0505"
              width="26px"
              height="26px"
              viewBox="-3.2 -3.2 38.40 38.40"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#ff0505"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path d="M 7.21875 5.78125 L 5.78125 7.21875 L 14.5625 16 L 5.78125 24.78125 L 7.21875 26.21875 L 16 17.4375 L 24.78125 26.21875 L 26.21875 24.78125 L 17.4375 16 L 26.21875 7.21875 L 24.78125 5.78125 L 16 14.5625 Z"></path>
              </g>
            </svg>
          ) : (
            <HeaderSearchIcon />
          )}
        </Link>
      </div>
      <div className="item dropdown me-3">
        <Link to="#" className=" dropdown-toggle" data-bs-toggle="dropdown">
          <HeaderBarIcon />
        </Link>
        <div className="dropdown-menu dropdown-menu-end">
          {isAuthenticated ? <SignOutButton /> : <SignInButton />}
        </div>
      </div>
    </div>
  );
}
