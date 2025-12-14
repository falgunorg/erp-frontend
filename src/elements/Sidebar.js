import React, { useState, useContext } from "react";
import auth from "services/auth";
import AppContext from "contexts/AppContext";
import { Link, useLocation } from "react-router-dom";
import ls from "services/ls";

import {
  MailIcon,
  MailActiveIcon,
  ScheduleActiveIcon,
  ScheduleIcon,
  TaskIcon,
  TaskActiveIcon,
  FileIcon,
  FileActiveIcon,
  WorkIcon,
  WorkActiveIcon,
  LogOutIcon,
  SettingIcon,
  ProfileIcon,
  ArrowLeftIcon,
  ArrowDownIcon,
  ArrowRightIcon,
} from "./SvgIcons";

export default function Sidebar(props) {
  const location = useLocation();
  const pathname = location.pathname;
  const themeMode = "bg_light";

  const userData = auth.getUser();

  return (
    <div className={`falgun_app_sidebar ${themeMode}`}>
      <nav className={`navbar ${themeMode}`} style={{ display: "block" }}>
        <div className="fixed_area">
          {location.pathname === "/mailbox" ? (
            <>
              {props.resizeToggle ? (
                ""
              ) : (
                <button
                  onClick={() => {
                    const newToggleValue = !props.resizeToggle;
                    ls.set("resizeToggle", newToggleValue);
                    props.setResizeToggle(newToggleValue);
                  }}
                  className="resizeToggle sidebarMenu"
                >
                  {props.resizeToggle ? <ArrowLeftIcon /> : <ArrowRightIcon />}
                </button>
              )}
            </>
          ) : (
            ""
          )}
          <div className="common_icon_menus">
            <ul>
              <li>
                <Link
                  to="/mailbox"
                  className={location.pathname === "/mailbox" ? "active" : ""}
                >
                  <div className="border_design"></div>
                  <span className="icon_shadow">
                    <span className="inactive">
                      <MailIcon />
                    </span>
                    <span className="active">
                      <MailActiveIcon />
                    </span>
                  </span>
                  <div className="link_text">Mail</div>
                </Link>
              </li>
              <li>
                <Link
                  to="/schedules"
                  className={location.pathname === "/schedules" ? "active" : ""}
                >
                  <div className="border_design"></div>
                  <span className="icon_shadow">
                    <span className="inactive">
                      <ScheduleIcon />
                    </span>
                    <span className="active">
                      <ScheduleActiveIcon />
                    </span>
                  </span>
                  <div className="link_text">Schedule</div>
                </Link>
              </li>
              <li>
                <Link
                  to="/tasks"
                  className={location.pathname === "/tasks" ? "active" : ""}
                >
                  <div className="border_design"></div>
                  <span className="icon_shadow">
                    <span className="inactive">
                      <TaskIcon />
                    </span>
                    <span className="active">
                      <TaskActiveIcon />
                    </span>
                  </span>
                  <div className="link_text">Task</div>
                </Link>
              </li>
              <li className="d-none">
                <Link to="#">
                  <div className="border_design"></div>
                  <span className="icon_shadow">
                    <span className="inactive">
                      <WorkIcon />
                    </span>
                    <span className="active">
                      <WorkActiveIcon />
                    </span>
                  </span>
                  <div className="link_text">Work</div>
                </Link>
              </li>
              <li className="d-none">
                <Link
                  to="/files"
                  className={location.pathname === "/files" ? "active" : ""}
                >
                  <div className="border_design"></div>
                  <span className="icon_shadow">
                    <span className="inactive">
                      <FileIcon />
                    </span>
                    <span className="active">
                      <FileActiveIcon />
                    </span>
                  </span>
                  <div className="link_text">Files</div>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="dynamic_area">
          <div className="permission_menus">
            <ul className="submenu">
              {userData?.menus?.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    title={item.label}
                    className={pathname === item.path ? "active" : ""}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
