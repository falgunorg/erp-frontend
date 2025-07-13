import React, { useState, useContext } from "react";
import auth from "services/auth";
import AppContext from "contexts/AppContext";
import { Link, useLocation } from "react-router-dom";
import { hasPermission } from "../routes/permissions/CheckPermissions";
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
} from "./SvgIcons";

export default function Sidebar(props) {
  const location = useLocation();
  const pathname = location.pathname;
  const { updateUserObj } = useContext(AppContext);
  const themeMode = "bg_light";

  const logout = async (ev) => {
    ev.preventDefault();
    await auth.logout();
    await updateUserObj();
  };

  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const toggleSubMenu = (index) => {
    if (openMenu === index) {
      setOpenMenu(null); // Close submenu if it's already open
    } else {
      setOpenMenu(index); // Open the clicked submenu
    }
  };

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
                  {props.resizeToggle ? (
                    <i className="fa fa-angle-left"></i>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="7.156"
                      height="9.121"
                      viewBox="0 0 7.156 9.121"
                    >
                      <path
                        id="Polygon_176"
                        data-name="Polygon 176"
                        d="M3.659,1.308a1,1,0,0,1,1.682,0L8.01,5.459A1,1,0,0,1,7.168,7H1.832A1,1,0,0,1,.99,5.459Z"
                        transform="translate(7.156 0.122) rotate(91)"
                        fill="#707070"
                      />
                    </svg>
                  )}
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
            <ul>
              <li>
                <Link
                  title="Next"
                  to="#"
                  className={openMenu === "Next" ? "active" : ""}
                  onClick={() => toggleMenu("Next")}
                >
                  NX
                </Link>
              </li>
              {openMenu === "Next" && (
                <ul className="submenu">
                  <li>
                    <Link
                      className={
                        location.pathname === "/technical-packages"
                          ? "active"
                          : ""
                      }
                      to="/technical-packages"
                    >
                      TP
                    </Link>
                  </li>

                  <li>
                    <Link
                      className={
                        location.pathname === "/cost-sheets" ? "active" : ""
                      }
                      to="/cost-sheets"
                    >
                      CS
                    </Link>
                  </li>

                  <li>
                    <Link
                      className={
                        location.pathname === "/purchase-orders" ? "active" : ""
                      }
                      to="/purchase-orders"
                    >
                      PO
                    </Link>
                  </li>

                  <li>
                    <Link
                      className={
                        location.pathname === "/budget-sheets" ? "active" : ""
                      }
                      to="/budget-sheets"
                    >
                      BGD
                    </Link>
                  </li>

                  <li>
                    <Link
                      className={
                        location.pathname === "/work-orders" ? "active" : ""
                      }
                      to="/work-orders"
                    >
                      WO
                    </Link>
                  </li>

                  <li>
                    <Link
                      className={
                        location.pathname === "/purchase-contracts"
                          ? "active"
                          : ""
                      }
                      to="/purchase-contracts"
                    >
                      PC
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        location.pathname === "/time-and-actions"
                          ? "active"
                          : ""
                      }
                      to="/time-and-actions"
                    >
                      T&A
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        location.pathname === "/booking-manager" ? "active" : ""
                      }
                      to="/booking-manager"
                    >
                      BM
                    </Link>
                  </li>
                </ul>
              )}
            </ul>

            <ul>
              <li>
                <Link
                  title="Carmel"
                  to="#"
                  className={openMenu === "Carmel" ? "active" : ""}
                  onClick={() => toggleMenu("Carmel")}
                >
                  CR
                </Link>
              </li>
              {openMenu === "Carmel" && (
                <ul className="submenu">
                  <li>
                    <Link
                      className={
                        location.pathname === "/technical-packages"
                          ? "active"
                          : ""
                      }
                      to="/technical-packages"
                    >
                      TP
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        location.pathname === "/work-orders" ? "active" : ""
                      }
                      to="/work-orders"
                    >
                      WO
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        location.pathname === "/purchase-orders" ? "active" : ""
                      }
                      to="/purchase-orders"
                    >
                      PO
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        location.pathname === "/purchase-contracts"
                          ? "active"
                          : ""
                      }
                      to="/purchase-contracts"
                    >
                      PC
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        location.pathname === "/time-and-actions"
                          ? "active"
                          : ""
                      }
                      to="/time-and-actions"
                    >
                      T&A
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        location.pathname === "/booking-manager" ? "active" : ""
                      }
                      to="/booking-manager"
                    >
                      BM
                    </Link>
                  </li>
                </ul>
              )}
            </ul>

            <ul>
              <li>
                <Link
                  to="#"
                  title="Garan"
                  className={openMenu === "Garan" ? "active" : ""}
                  onClick={() => toggleMenu("Garan")}
                >
                  GR
                </Link>
              </li>
              {openMenu === "Garan" && (
                <ul className="submenu">
                  <li>
                    <Link
                      className={
                        location.pathname === "/technical-packages"
                          ? "active"
                          : ""
                      }
                      to="/technical-packages"
                    >
                      TP
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        location.pathname === "/work-orders" ? "active" : ""
                      }
                      to="/work-orders"
                    >
                      WO
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        location.pathname === "/purchase-orders" ? "active" : ""
                      }
                      to="/purchase-orders"
                    >
                      PO
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        location.pathname === "/purchase-contracts"
                          ? "active"
                          : ""
                      }
                      to="/purchase-contracts"
                    >
                      PC
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        location.pathname === "/time-and-actions"
                          ? "active"
                          : ""
                      }
                      to="/time-and-actions"
                    >
                      T&A
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        location.pathname === "/booking-manager" ? "active" : ""
                      }
                      to="/booking-manager"
                    >
                      BM
                    </Link>
                  </li>
                </ul>
              )}
            </ul>

            <ul>
              <li>
                <Link
                  title="Mango"
                  to="#"
                  className={openMenu === "Mango" ? "active" : ""}
                  onClick={() => toggleMenu("Mango")}
                >
                  MN
                </Link>
              </li>
              {openMenu === "Mango" && (
                <ul className="submenu">
                  <li>
                    <Link
                      className={
                        location.pathname === "/technical-packages"
                          ? "active"
                          : ""
                      }
                      to="/technical-packages"
                    >
                      TP
                    </Link>
                  </li>

                  <li>
                    <Link
                      className={
                        location.pathname === "/work-orders" ? "active" : ""
                      }
                      to="/work-orders"
                    >
                      WO
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        location.pathname === "/purchase-orders" ? "active" : ""
                      }
                      to="/purchase-orders"
                    >
                      PO
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        location.pathname === "/purchase-contracts"
                          ? "active"
                          : ""
                      }
                      to="/purchase-contracts"
                    >
                      PC
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        location.pathname === "/time-and-actions"
                          ? "active"
                          : ""
                      }
                      to="/time-and-actions"
                    >
                      T&A
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        location.pathname === "/booking-manager" ? "active" : ""
                      }
                      to="/booking-manager"
                    >
                      BM
                    </Link>
                  </li>
                </ul>
              )}
            </ul>

            <ul>
              <li>
                <Link
                  to="#"
                  title="Development"
                  className={openMenu === "Dev" ? "active" : ""}
                  onClick={() => toggleMenu("Dev")}
                >
                  DV
                </Link>
              </li>
              {openMenu === "Dev" && (
                <ul className="submenu">
                  <li>
                    <Link
                      className={
                        location.pathname === "/work-orders" ? "active" : ""
                      }
                      to="/work-orders"
                    >
                      WO
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        location.pathname === "/purchase-orders" ? "active" : ""
                      }
                      to="/purchase-orders"
                    >
                      PD
                    </Link>
                  </li>
                </ul>
              )}
            </ul>
          </div>
          {/* <hr />
          <div className="permission_menus">
            <ul>
              {Object.keys(rolesPermissions).map(
                (department, index) =>
                  userData?.department_title === department &&
                  Object.keys(rolesPermissions[department]).map(
                    (designation, idx) =>
                      userData?.designation_title === designation &&
                      rolesPermissions[department][designation].map(
                        (item, subIndex) =>
                          hasPermission(userData, item.path) && (
                            <li key={`${index}-${idx}-${subIndex}`}>
                              <div
                                onClick={() =>
                                  toggleSubMenu(`${index}-${idx}-${subIndex}`)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <Link
                                  title={item.label}
                                  className={
                                    location.pathname === item.path ? "active" : ""
                                  }
                                  to={item.path}
                                >
                                  {item.label}
                                </Link>
                              </div>

                              {item.submenus &&
                                item.submenus.length > 0 &&
                                openMenu === `${index}-${idx}-${subIndex}` && (
                                  <ul className="submenu">
                                    {item.submenus.map((submenu, subIdx) => (
                                      <li key={subIdx}>
                                        <Link
                                          title={submenu.label}
                                          className={
                                            location.pathname === submenu.path
                                              ? "active"
                                              : ""
                                          }
                                          to={submenu.path}
                                        >
                                          {submenu.label}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                            </li>
                          )
                      )
                  )
              )}
            </ul>
          </div> */}
        </div>

        <div className="fixed_area bottom">
          <div className="user_menu_bottom">
            <ul>
              <li>
                <Link className="new_menu" to="#">
                  Admin
                </Link>
              </li>
              <li>
                <Link className="new_menu" to="#">
                  Settings
                </Link>
              </li>
              <li>
                <Link to="/profile">
                  <ProfileIcon />
                </Link>
              </li>
              <li>
                <Link to="/settings">
                  <SettingIcon />
                </Link>
              </li>
              <li>
                <Link to="#" onClick={logout}>
                  <LogOutIcon />
                </Link>
              </li>
              <li>
                <img
                  style={{
                    cursor: "pointer",
                    height: "30px",
                    width: "30px",
                    borderRadius: "50%",
                    marginTop: "10px",
                    background: "#fff",
                  }}
                  className="profile_image_menu"
                  src={props.userData?.profile_picture}
                  alt=""
                />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
