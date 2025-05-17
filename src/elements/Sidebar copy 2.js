import React, { useState, useContext } from "react";
import auth from "services/auth";
import AppContext from "contexts/AppContext";
import { Link, useLocation } from "react-router-dom";
import { hasPermission } from "../routes/permissions/CheckPermissions";
import MailW from "../assets/images/icons/Mail-W.png";
import MailO from "../assets/images/icons/Mail-O.png";
import ScheduleW from "../assets/images/icons/Schedule-W.png";
import ScheduleO from "../assets/images/icons/Schedule-O.png";
import TaskW from "../assets/images/icons/Task-W.png";
import TaskO from "../assets/images/icons/Task-O.png";
import WorkW from "../assets/images/icons/Work-W.png";
import WorkO from "../assets/images/icons/Work-O.png";
import FilesW from "../assets/images/icons/Files-W.png";
import FilesO from "../assets/images/icons/Files-O.png";
import MegaMenuVertical from "./MegaMenuVerticle";
import {
  defaultConfig,
  rolesPermissions,
} from "../routes/permissions/PermissionsConfig";
import ls from "services/ls";

export default function Sidebar(props) {
  const { userData, isAuthenticated } = props;
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

  const items = [
    {
      label: "A",
      icon: "pi pi-box",
      submenu: [
        {
          label: "Living Room",
          options: [
            {
              label: "Accessories",
              link: "/furniture/living-room/accessories",
            },
            { label: "Armchair", link: "/furniture/living-room/armchair" },
            {
              label: "Coffee Table",
              link: "/furniture/living-room/coffee-table",
            },
            { label: "Couch", link: "/furniture/living-room/couch" },
            { label: "TV Stand", link: "/furniture/living-room/tv-stand" },
          ],
        },
        {
          label: "Living Room",
          options: [
            {
              label: "Accessories",
              link: "/furniture/living-room/accessories",
            },
            { label: "Armchair", link: "/furniture/living-room/armchair" },
            {
              label: "Coffee Table",
              link: "/furniture/living-room/coffee-table",
            },
            { label: "Couch", link: "/furniture/living-room/couch" },
            { label: "TV Stand", link: "/furniture/living-room/tv-stand" },
          ],
        },
        {
          label: "Living Room",
          options: [
            {
              label: "Accessories",
              link: "/furniture/living-room/accessories",
            },
            { label: "Armchair", link: "/furniture/living-room/armchair" },
            {
              label: "Coffee Table",
              link: "/furniture/living-room/coffee-table",
            },
            { label: "Couch", link: "/furniture/living-room/couch" },
            { label: "TV Stand", link: "/furniture/living-room/tv-stand" },
          ],
        },
      
        {
          label: "Bedroom",
          options: [
            { label: "Bed", link: "/furniture/bedroom/bed" },
            { label: "Wardrobe", link: "/furniture/bedroom/wardrobe" },
            { label: "Dresser", link: "/furniture/bedroom/dresser" },
            { label: "Nightstand", link: "/furniture/bedroom/nightstand" },
          ],
        },
        {
          label: "Kitchen",
          options: [
            { label: "Bar Stool", link: "/furniture/kitchen/bar-stool" },
            { label: "Dining Table", link: "/furniture/kitchen/dining-table" },
            { label: "Cabinets", link: "/furniture/kitchen/cabinets" },
          ],
        },
      ],
    },
    {
      label: "B",
      icon: "pi pi-mobile",
      submenu: [
        {
          label: "Computers",
          options: [
            { label: "Monitor", link: "/electronics/computers/monitor" },
            { label: "Mouse", link: "/electronics/computers/mouse" },
            { label: "Keyboard", link: "/electronics/computers/keyboard" },
            { label: "Notebook", link: "/electronics/computers/notebook" },
          ],
        },
        {
          label: "Appliances",
          options: [
            { label: "Fridge", link: "/electronics/appliances/fridge" },
            {
              label: "Washing Machine",
              link: "/electronics/appliances/washing-machine",
            },
            { label: "Oven", link: "/electronics/appliances/oven" },
            {
              label: "Vacuum Cleaner",
              link: "/electronics/appliances/vacuum-cleaner",
            },
          ],
        },
        {
          label: "Gaming",
          options: [
            { label: "Console", link: "/electronics/gaming/console" },
            { label: "Accessories", link: "/electronics/gaming/accessories" },
            { label: "Games", link: "/electronics/gaming/games" },
          ],
        },
      ],
    },
    {
      label: "C",
      icon: "pi pi-tags",
      submenu: [
        {
          label: "Men",
          options: [
            { label: "T-Shirts", link: "/clothing/men/t-shirts" },
            { label: "Jeans", link: "/clothing/men/jeans" },
            { label: "Jackets", link: "/clothing/men/jackets" },
            { label: "Shoes", link: "/clothing/men/shoes" },
          ],
        },
        {
          label: "Women",
          options: [
            { label: "Dresses", link: "/clothing/women/dresses" },
            { label: "Tops", link: "/clothing/women/tops" },
            { label: "Skirts", link: "/clothing/women/skirts" },
            { label: "Shoes", link: "/clothing/women/shoes" },
          ],
        },
        {
          label: "Kids",
          options: [
            { label: "T-Shirts", link: "/clothing/kids/t-shirts" },
            { label: "Shorts", link: "/clothing/kids/shorts" },
            { label: "Sneakers", link: "/clothing/kids/sneakers" },
          ],
        },
      ],
    },
    {
      label: "S",
      icon: "pi pi-clock",
      submenu: [
        {
          label: "Football",
          options: [
            { label: "Kits", link: "/sports/football/kits" },
            { label: "Shoes", link: "/sports/football/shoes" },
            { label: "Training Gear", link: "/sports/football/training-gear" },
          ],
        },
        {
          label: "Tennis",
          options: [
            { label: "Rackets", link: "/sports/tennis/rackets" },
            { label: "Balls", link: "/sports/tennis/balls" },
            { label: "Shoes", link: "/sports/tennis/shoes" },
          ],
        },
        {
          label: "Swimming",
          options: [
            { label: "Swimsuits", link: "/sports/swimming/swimsuits" },
            { label: "Goggles", link: "/sports/swimming/goggles" },
            { label: "Accessories", link: "/sports/swimming/accessories" },
          ],
        },
      ],
    },
    {
      label: "A",
      icon: "pi pi-box",
      submenu: [
        {
          label: "Living Room",
          options: [
            {
              label: "Accessories",
              link: "/furniture/living-room/accessories",
            },
            { label: "Armchair", link: "/furniture/living-room/armchair" },
            {
              label: "Coffee Table",
              link: "/furniture/living-room/coffee-table",
            },
            { label: "Couch", link: "/furniture/living-room/couch" },
            { label: "TV Stand", link: "/furniture/living-room/tv-stand" },
          ],
        },
        {
          label: "Bedroom",
          options: [
            { label: "Bed", link: "/furniture/bedroom/bed" },
            { label: "Wardrobe", link: "/furniture/bedroom/wardrobe" },
            { label: "Dresser", link: "/furniture/bedroom/dresser" },
            { label: "Nightstand", link: "/furniture/bedroom/nightstand" },
          ],
        },
        {
          label: "Kitchen",
          options: [
            { label: "Bar Stool", link: "/furniture/kitchen/bar-stool" },
            { label: "Dining Table", link: "/furniture/kitchen/dining-table" },
            { label: "Cabinets", link: "/furniture/kitchen/cabinets" },
          ],
        },
      ],
    },
    {
      label: "B",
      icon: "pi pi-mobile",
      submenu: [
        {
          label: "Computers",
          options: [
            { label: "Monitor", link: "/electronics/computers/monitor" },
            { label: "Mouse", link: "/electronics/computers/mouse" },
            { label: "Keyboard", link: "/electronics/computers/keyboard" },
            { label: "Notebook", link: "/electronics/computers/notebook" },
          ],
        },
        {
          label: "Appliances",
          options: [
            { label: "Fridge", link: "/electronics/appliances/fridge" },
            {
              label: "Washing Machine",
              link: "/electronics/appliances/washing-machine",
            },
            { label: "Oven", link: "/electronics/appliances/oven" },
            {
              label: "Vacuum Cleaner",
              link: "/electronics/appliances/vacuum-cleaner",
            },
          ],
        },
        {
          label: "Gaming",
          options: [
            { label: "Console", link: "/electronics/gaming/console" },
            { label: "Accessories", link: "/electronics/gaming/accessories" },
            { label: "Games", link: "/electronics/gaming/games" },
          ],
        },
      ],
    },
    {
      label: "C",
      icon: "pi pi-tags",
      submenu: [
        {
          label: "Men",
          options: [
            { label: "T-Shirts", link: "/clothing/men/t-shirts" },
            { label: "Jeans", link: "/clothing/men/jeans" },
            { label: "Jackets", link: "/clothing/men/jackets" },
            { label: "Shoes", link: "/clothing/men/shoes" },
          ],
        },
        {
          label: "Women",
          options: [
            { label: "Dresses", link: "/clothing/women/dresses" },
            { label: "Tops", link: "/clothing/women/tops" },
            { label: "Skirts", link: "/clothing/women/skirts" },
            { label: "Shoes", link: "/clothing/women/shoes" },
          ],
        },
        {
          label: "Kids",
          options: [
            { label: "T-Shirts", link: "/clothing/kids/t-shirts" },
            { label: "Shorts", link: "/clothing/kids/shorts" },
            { label: "Sneakers", link: "/clothing/kids/sneakers" },
          ],
        },
      ],
    },
    {
      label: "S",
      icon: "pi pi-clock",
      submenu: [
        {
          label: "Football",
          options: [
            { label: "Kits", link: "/sports/football/kits" },
            { label: "Shoes", link: "/sports/football/shoes" },
            { label: "Training Gear", link: "/sports/football/training-gear" },
          ],
        },
        {
          label: "Tennis",
          options: [
            { label: "Rackets", link: "/sports/tennis/rackets" },
            { label: "Balls", link: "/sports/tennis/balls" },
            { label: "Shoes", link: "/sports/tennis/shoes" },
          ],
        },
        {
          label: "Swimming",
          options: [
            { label: "Swimsuits", link: "/sports/swimming/swimsuits" },
            { label: "Goggles", link: "/sports/swimming/goggles" },
            { label: "Accessories", link: "/sports/swimming/accessories" },
          ],
        },
      ],
    },
    {
      label: "A",
      icon: "pi pi-box",
      submenu: [
        {
          label: "Living Room",
          options: [
            {
              label: "Accessories",
              link: "/furniture/living-room/accessories",
            },
            { label: "Armchair", link: "/furniture/living-room/armchair" },
            {
              label: "Coffee Table",
              link: "/furniture/living-room/coffee-table",
            },
            { label: "Couch", link: "/furniture/living-room/couch" },
            { label: "TV Stand", link: "/furniture/living-room/tv-stand" },
          ],
        },
        {
          label: "Bedroom",
          options: [
            { label: "Bed", link: "/furniture/bedroom/bed" },
            { label: "Wardrobe", link: "/furniture/bedroom/wardrobe" },
            { label: "Dresser", link: "/furniture/bedroom/dresser" },
            { label: "Nightstand", link: "/furniture/bedroom/nightstand" },
          ],
        },
        {
          label: "Kitchen",
          options: [
            { label: "Bar Stool", link: "/furniture/kitchen/bar-stool" },
            { label: "Dining Table", link: "/furniture/kitchen/dining-table" },
            { label: "Cabinets", link: "/furniture/kitchen/cabinets" },
          ],
        },
      ],
    },
    {
      label: "B",
      icon: "pi pi-mobile",
      submenu: [
        {
          label: "Computers",
          options: [
            { label: "Monitor", link: "/electronics/computers/monitor" },
            { label: "Mouse", link: "/electronics/computers/mouse" },
            { label: "Keyboard", link: "/electronics/computers/keyboard" },
            { label: "Notebook", link: "/electronics/computers/notebook" },
          ],
        },
        {
          label: "Appliances",
          options: [
            { label: "Fridge", link: "/electronics/appliances/fridge" },
            {
              label: "Washing Machine",
              link: "/electronics/appliances/washing-machine",
            },
            { label: "Oven", link: "/electronics/appliances/oven" },
            {
              label: "Vacuum Cleaner",
              link: "/electronics/appliances/vacuum-cleaner",
            },
          ],
        },
        {
          label: "Gaming",
          options: [
            { label: "Console", link: "/electronics/gaming/console" },
            { label: "Accessories", link: "/electronics/gaming/accessories" },
            { label: "Games", link: "/electronics/gaming/games" },
          ],
        },
      ],
    },
    {
      label: "C",
      icon: "pi pi-tags",
      submenu: [
        {
          label: "Men",
          options: [
            { label: "T-Shirts", link: "/clothing/men/t-shirts" },
            { label: "Jeans", link: "/clothing/men/jeans" },
            { label: "Jackets", link: "/clothing/men/jackets" },
            { label: "Shoes", link: "/clothing/men/shoes" },
          ],
        },
        {
          label: "Women",
          options: [
            { label: "Dresses", link: "/clothing/women/dresses" },
            { label: "Tops", link: "/clothing/women/tops" },
            { label: "Skirts", link: "/clothing/women/skirts" },
            { label: "Shoes", link: "/clothing/women/shoes" },
          ],
        },
        {
          label: "Kids",
          options: [
            { label: "T-Shirts", link: "/clothing/kids/t-shirts" },
            { label: "Shorts", link: "/clothing/kids/shorts" },
            { label: "Sneakers", link: "/clothing/kids/sneakers" },
          ],
        },
      ],
    },
    {
      label: "S",
      icon: "pi pi-clock",
      submenu: [
        {
          label: "Football",
          options: [
            { label: "Kits", link: "/sports/football/kits" },
            { label: "Shoes", link: "/sports/football/shoes" },
            { label: "Training Gear", link: "/sports/football/training-gear" },
          ],
        },
        {
          label: "Tennis",
          options: [
            { label: "Rackets", link: "/sports/tennis/rackets" },
            { label: "Balls", link: "/sports/tennis/balls" },
            { label: "Shoes", link: "/sports/tennis/shoes" },
          ],
        },
        {
          label: "Swimming",
          options: [
            { label: "Swimsuits", link: "/sports/swimming/swimsuits" },
            { label: "Goggles", link: "/sports/swimming/goggles" },
            { label: "Accessories", link: "/sports/swimming/accessories" },
          ],
        },
      ],
    },
    {
      label: "A",
      icon: "pi pi-box",
      submenu: [
        {
          label: "Living Room",
          options: [
            {
              label: "Accessories",
              link: "/furniture/living-room/accessories",
            },
            { label: "Armchair", link: "/furniture/living-room/armchair" },
            {
              label: "Coffee Table",
              link: "/furniture/living-room/coffee-table",
            },
            { label: "Couch", link: "/furniture/living-room/couch" },
            { label: "TV Stand", link: "/furniture/living-room/tv-stand" },
          ],
        },
        {
          label: "Bedroom",
          options: [
            { label: "Bed", link: "/furniture/bedroom/bed" },
            { label: "Wardrobe", link: "/furniture/bedroom/wardrobe" },
            { label: "Dresser", link: "/furniture/bedroom/dresser" },
            { label: "Nightstand", link: "/furniture/bedroom/nightstand" },
          ],
        },
        {
          label: "Kitchen",
          options: [
            { label: "Bar Stool", link: "/furniture/kitchen/bar-stool" },
            { label: "Dining Table", link: "/furniture/kitchen/dining-table" },
            { label: "Cabinets", link: "/furniture/kitchen/cabinets" },
          ],
        },
      ],
    },
    {
      label: "B",
      icon: "pi pi-mobile",
      submenu: [
        {
          label: "Computers",
          options: [
            { label: "Monitor", link: "/electronics/computers/monitor" },
            { label: "Mouse", link: "/electronics/computers/mouse" },
            { label: "Keyboard", link: "/electronics/computers/keyboard" },
            { label: "Notebook", link: "/electronics/computers/notebook" },
          ],
        },
        {
          label: "Appliances",
          options: [
            { label: "Fridge", link: "/electronics/appliances/fridge" },
            {
              label: "Washing Machine",
              link: "/electronics/appliances/washing-machine",
            },
            { label: "Oven", link: "/electronics/appliances/oven" },
            {
              label: "Vacuum Cleaner",
              link: "/electronics/appliances/vacuum-cleaner",
            },
          ],
        },
        {
          label: "Gaming",
          options: [
            { label: "Console", link: "/electronics/gaming/console" },
            { label: "Accessories", link: "/electronics/gaming/accessories" },
            { label: "Games", link: "/electronics/gaming/games" },
          ],
        },
      ],
    },
    {
      label: "C",
      icon: "pi pi-tags",
      submenu: [
        {
          label: "Men",
          options: [
            { label: "T-Shirts", link: "/clothing/men/t-shirts" },
            { label: "Jeans", link: "/clothing/men/jeans" },
            { label: "Jackets", link: "/clothing/men/jackets" },
            { label: "Shoes", link: "/clothing/men/shoes" },
          ],
        },
        {
          label: "Women",
          options: [
            { label: "Dresses", link: "/clothing/women/dresses" },
            { label: "Tops", link: "/clothing/women/tops" },
            { label: "Skirts", link: "/clothing/women/skirts" },
            { label: "Shoes", link: "/clothing/women/shoes" },
          ],
        },
        {
          label: "Kids",
          options: [
            { label: "T-Shirts", link: "/clothing/kids/t-shirts" },
            { label: "Shorts", link: "/clothing/kids/shorts" },
            { label: "Sneakers", link: "/clothing/kids/sneakers" },
          ],
        },
      ],
    },
    {
      label: "S",
      icon: "pi pi-clock",
      submenu: [
        {
          label: "Football",
          options: [
            { label: "Kits", link: "/sports/football/kits" },
            { label: "Shoes", link: "/sports/football/shoes" },
            { label: "Training Gear", link: "/sports/football/training-gear" },
          ],
        },
        {
          label: "Tennis",
          options: [
            { label: "Rackets", link: "/sports/tennis/rackets" },
            { label: "Balls", link: "/sports/tennis/balls" },
            { label: "Shoes", link: "/sports/tennis/shoes" },
          ],
        },
        {
          label: "Swimming",
          options: [
            { label: "Swimsuits", link: "/sports/swimming/swimsuits" },
            { label: "Goggles", link: "/sports/swimming/goggles" },
            { label: "Accessories", link: "/sports/swimming/accessories" },
          ],
        },
      ],
    },
  ];

  return (
    <div className={`falgun_app_sidebar ${themeMode}`}>
      <nav className={`navbar ${themeMode}`} style={{ display: "block" }}>
        <div className="fixed_area">
          {pathname === "/mailbox" ? (
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
                    <i className="fa fa-angle-right"></i>
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
                  className={pathname === "/mailbox" ? "active" : ""}
                >
                  <span className="icon_shadow">
                    <img className="inactive" src={MailW} alt="Logo" />
                    <img className="active" src={MailO} alt="Logo" />
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/schedules"
                  className={pathname === "/schedules" ? "active" : ""}
                >
                  <span className="icon_shadow">
                    <img className="inactive" src={ScheduleW} alt="Logo" />
                    <img className="active" src={ScheduleO} alt="Logo" />
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/tasks"
                  className={pathname === "/tasks" ? "active" : ""}
                >
                  <span className="icon_shadow">
                    <img className="inactive" src={TaskW} alt="Logo" />
                    <img className="active" src={TaskO} alt="Logo" />
                  </span>
                </Link>
              </li>
              <li>
                <Link to="#">
                  <span className="icon_shadow">
                    <img className="inactive" src={WorkW} alt="Logo" />
                    <img className="active" src={WorkO} alt="Logo" />
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/files"
                  className={pathname === "/files" ? "active" : ""}
                >
                  <span className="icon_shadow">
                    <img className="inactive" src={FilesW} alt="Logo" />
                    <img className="active" src={FilesO} alt="Logo" />
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <MegaMenuVertical items={items} />
        <div className="dynamic_area d-none">
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
                      className={pathname === "/work-orders" ? "active" : ""}
                      to="/work-orders"
                    >
                      WO
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        pathname === "/purchase-orders" ? "active" : ""
                      }
                      to="/purchase-orders"
                    >
                      PO
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        pathname === "/purchase-contracts" ? "active" : ""
                      }
                      to="/purchase-contracts"
                    >
                      PC
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        pathname === "/time-and-actions" ? "active" : ""
                      }
                      to="/time-and-actions"
                    >
                      T&A
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        pathname === "/booking-manager" ? "active" : ""
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
                      className={pathname === "/work-orders" ? "active" : ""}
                      to="/work-orders"
                    >
                      WO
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        pathname === "/purchase-orders" ? "active" : ""
                      }
                      to="/purchase-orders"
                    >
                      PO
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        pathname === "/purchase-contracts" ? "active" : ""
                      }
                      to="/purchase-contracts"
                    >
                      PC
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        pathname === "/time-and-actions" ? "active" : ""
                      }
                      to="/time-and-actions"
                    >
                      T&A
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        pathname === "/booking-manager" ? "active" : ""
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
                      className={pathname === "/work-orders" ? "active" : ""}
                      to="/work-orders"
                    >
                      WO
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        pathname === "/purchase-orders" ? "active" : ""
                      }
                      to="/purchase-orders"
                    >
                      PO
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        pathname === "/purchase-contracts" ? "active" : ""
                      }
                      to="/purchase-contracts"
                    >
                      PC
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        pathname === "/time-and-actions" ? "active" : ""
                      }
                      to="/time-and-actions"
                    >
                      T&A
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        pathname === "/booking-manager" ? "active" : ""
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
                      className={pathname === "/work-orders" ? "active" : ""}
                      to="/work-orders"
                    >
                      WO
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        pathname === "/purchase-orders" ? "active" : ""
                      }
                      to="/purchase-orders"
                    >
                      PO
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        pathname === "/purchase-contracts" ? "active" : ""
                      }
                      to="/purchase-contracts"
                    >
                      PC
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        pathname === "/time-and-actions" ? "active" : ""
                      }
                      to="/time-and-actions"
                    >
                      T&A
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        pathname === "/booking-manager" ? "active" : ""
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
                      className={pathname === "/work-orders" ? "active" : ""}
                      to="/work-orders"
                    >
                      WO
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        pathname === "/purchase-orders" ? "active" : ""
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
                                    pathname === item.path ? "active" : ""
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
                                            pathname === submenu.path
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
                <Link to="/profile">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xlink="http://www.w3.org/1999/xlink"
                    width="26"
                    height="30"
                    viewBox="0 0 26 30"
                  >
                    <defs>
                      <filter
                        id="Ellipse_319"
                        x="0"
                        y="4"
                        width="26"
                        height="26"
                        filterUnits="userSpaceOnUse"
                      >
                        <feOffset dy="3" input="SourceAlpha" />
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feFlood floodOpacity="0.161" />
                        <feComposite operator="in" in2="blur" />
                        <feComposite in="SourceGraphic" />
                      </filter>
                      <filter
                        id="Ellipse_325"
                        x="2"
                        y="0"
                        width="22"
                        height="22"
                        filterUnits="userSpaceOnUse"
                      >
                        <feOffset dy="3" input="SourceAlpha" />
                        <feGaussianBlur stdDeviation="3" result="blur-2" />
                        <feFlood floodOpacity="0.161" />
                        <feComposite operator="in" in2="blur-2" />
                        <feComposite in="SourceGraphic" />
                      </filter>
                    </defs>
                    <rect
                      id="Rectangle_1699"
                      data-name="Rectangle 1699"
                      width="16"
                      height="16"
                      rx="2"
                      transform="translate(5 4)"
                      fill="#fff"
                    />
                    <g
                      transform="matrix(1, 0, 0, 1, 0, 0)"
                      filter="url(#Ellipse_319)"
                    >
                      <g
                        id="Ellipse_319-2"
                        data-name="Ellipse 319"
                        transform="translate(9 10)"
                        fill="none"
                        stroke="#2b2b2b"
                        strokeWidth="1"
                      >
                        <circle cx="4" cy="4" r="4" stroke="none" />
                        <circle cx="4" cy="4" r="3.5" fill="none" />
                      </g>
                    </g>
                    <g
                      transform="matrix(1, 0, 0, 1, 0, 0)"
                      filter="url(#Ellipse_325)"
                    >
                      <g
                        id="Ellipse_325-2"
                        data-name="Ellipse 325"
                        transform="translate(11 6)"
                        fill="none"
                        stroke="#2b2b2b"
                        strokeWidth="1"
                      >
                        <circle cx="2" cy="2" r="2" stroke="none" />
                        <circle cx="2" cy="2" r="1.5" fill="none" />
                      </g>
                    </g>
                  </svg>
                </Link>
              </li>
              <li>
                <Link to="/settings">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xlink="http://www.w3.org/1999/xlink"
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                  >
                    <defs>
                      <filter
                        id="Ellipse_320"
                        x="2"
                        y="2"
                        width="24"
                        height="24"
                        filterUnits="userSpaceOnUse"
                      >
                        <feOffset dy="3" input="SourceAlpha" />
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feFlood floodOpacity="0.161" />
                        <feComposite operator="in" in2="blur" />
                        <feComposite in="SourceGraphic" />
                      </filter>
                      <filter
                        id="Ellipse_321"
                        x="4"
                        y="0"
                        width="24"
                        height="24"
                        filterUnits="userSpaceOnUse"
                      >
                        <feOffset dy="3" input="SourceAlpha" />
                        <feGaussianBlur stdDeviation="3" result="blur-2" />
                        <feFlood floodOpacity="0.161" />
                        <feComposite operator="in" in2="blur-2" />
                        <feComposite in="SourceGraphic" />
                      </filter>
                      <filter
                        id="Ellipse_322"
                        x="0"
                        y="0"
                        width="24"
                        height="24"
                        filterUnits="userSpaceOnUse"
                      >
                        <feOffset dy="3" input="SourceAlpha" />
                        <feGaussianBlur stdDeviation="3" result="blur-3" />
                        <feFlood floodOpacity="0.161" />
                        <feComposite operator="in" in2="blur-3" />
                        <feComposite in="SourceGraphic" />
                      </filter>
                      <filter
                        id="Ellipse_323"
                        x="0"
                        y="4"
                        width="24"
                        height="24"
                        filterUnits="userSpaceOnUse"
                      >
                        <feOffset dy="3" input="SourceAlpha" />
                        <feGaussianBlur stdDeviation="3" result="blur-4" />
                        <feFlood floodOpacity="0.161" />
                        <feComposite operator="in" in2="blur-4" />
                        <feComposite in="SourceGraphic" />
                      </filter>
                      <filter
                        id="Ellipse_324"
                        x="4"
                        y="4"
                        width="24"
                        height="24"
                        filterUnits="userSpaceOnUse"
                      >
                        <feOffset dy="3" input="SourceAlpha" />
                        <feGaussianBlur stdDeviation="3" result="blur-5" />
                        <feFlood floodOpacity="0.161" />
                        <feComposite operator="in" in2="blur-5" />
                        <feComposite in="SourceGraphic" />
                      </filter>
                    </defs>
                    <rect
                      id="Rectangle_1698"
                      data-name="Rectangle 1698"
                      width="16"
                      height="16"
                      rx="2"
                      transform="translate(6 3)"
                      fill="#fff"
                    />
                    <g
                      transform="matrix(1, 0, 0, 1, 0, 0)"
                      filter="url(#Ellipse_320)"
                    >
                      <g
                        id="Ellipse_320-2"
                        data-name="Ellipse 320"
                        transform="translate(11 8)"
                        fill="none"
                        stroke="#2b2b2b"
                        strokeWidth="1"
                      >
                        <circle cx="3" cy="3" r="3" stroke="none" />
                        <circle cx="3" cy="3" r="2.5" fill="none" />
                      </g>
                    </g>
                    <g
                      transform="matrix(1, 0, 0, 1, 0, 0)"
                      filter="url(#Ellipse_321)"
                    >
                      <g
                        id="Ellipse_321-2"
                        data-name="Ellipse 321"
                        transform="translate(13 6)"
                        fill="none"
                        stroke="#2b2b2b"
                        strokeWidth="1"
                      >
                        <circle cx="3" cy="3" r="3" stroke="none" />
                        <circle cx="3" cy="3" r="2.5" fill="none" />
                      </g>
                    </g>
                    <g
                      transform="matrix(1, 0, 0, 1, 0, 0)"
                      filter="url(#Ellipse_322)"
                    >
                      <g
                        id="Ellipse_322-2"
                        data-name="Ellipse 322"
                        transform="translate(9 6)"
                        fill="none"
                        stroke="#2b2b2b"
                        strokeWidth="1"
                      >
                        <circle cx="3" cy="3" r="3" stroke="none" />
                        <circle cx="3" cy="3" r="2.5" fill="none" />
                      </g>
                    </g>
                    <g
                      transform="matrix(1, 0, 0, 1, 0, 0)"
                      filter="url(#Ellipse_323)"
                    >
                      <g
                        id="Ellipse_323-2"
                        data-name="Ellipse 323"
                        transform="translate(9 10)"
                        fill="none"
                        stroke="#2b2b2b"
                        strokeWidth="1"
                      >
                        <circle cx="3" cy="3" r="3" stroke="none" />
                        <circle cx="3" cy="3" r="2.5" fill="none" />
                      </g>
                    </g>
                    <g
                      transform="matrix(1, 0, 0, 1, 0, 0)"
                      filter="url(#Ellipse_324)"
                    >
                      <g
                        id="Ellipse_324-2"
                        data-name="Ellipse 324"
                        transform="translate(13 10)"
                        fill="none"
                        stroke="#2b2b2b"
                        strokeWidth="1"
                      >
                        <circle cx="3" cy="3" r="3" stroke="none" />
                        <circle cx="3" cy="3" r="2.5" fill="none" />
                      </g>
                    </g>
                  </svg>
                </Link>
              </li>
              <li>
                <Link to="#" onClick={logout}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xlink="http://www.w3.org/1999/xlink"
                    width="28.327"
                    height="29"
                    viewBox="0 0 28.327 29"
                  >
                    <defs>
                      <filter
                        id="Polygon_184"
                        x="0"
                        y="0"
                        width="28.327"
                        height="29"
                        filterUnits="userSpaceOnUse"
                      >
                        <feOffset dy="3" input="SourceAlpha" />
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feFlood floodOpacity="0.161" />
                        <feComposite operator="in" in2="blur" />
                        <feComposite in="SourceGraphic" />
                      </filter>
                    </defs>
                    <rect
                      id="Rectangle_1697"
                      data-name="Rectangle 1697"
                      width="16"
                      height="16"
                      rx="2"
                      transform="translate(7.5 3.5)"
                      fill="#fff"
                    />
                    <g
                      transform="matrix(1, 0, 0, 1, 0, 0)"
                      filter="url(#Polygon_184)"
                    >
                      <g
                        id="Polygon_184-2"
                        data-name="Polygon 184"
                        transform="translate(9 17) rotate(-90)"
                        fill="none"
                      >
                        <path
                          d="M3.735,3.315a2,2,0,0,1,3.531,0L9.434,7.387a2,2,0,0,1-1.765,2.94H3.331a2,2,0,0,1-1.765-2.94Z"
                          stroke="none"
                        />
                        <path
                          d="M 5.5 3.254807472229004 C 5.319479942321777 3.254807472229004 4.872089862823486 3.30644702911377 4.617370128631592 3.784757614135742 L 2.448419570922852 7.857447147369385 C 2.208290100097656 8.308326721191406 2.386119842529297 8.696347236633301 2.473719596862793 8.842247009277344 C 2.561320304870605 8.988147735595703 2.820219993591309 9.327497482299805 3.33105993270874 9.327497482299805 L 7.66894006729126 9.327497482299805 C 8.179780006408691 9.327497482299805 8.438679695129395 8.988147735595703 8.526279449462891 8.842247009277344 C 8.613880157470703 8.696347236633301 8.791709899902344 8.308326721191406 8.551580429077148 7.857447147369385 L 6.382629871368408 3.784757614135742 C 6.127910137176514 3.30644702911377 5.680520057678223 3.254807472229004 5.5 3.254807472229004 M 5.5 2.254812240600586 C 6.194485187530518 2.254812240600586 6.888969898223877 2.608107566833496 7.265270233154297 3.314697265625 L 9.434220314025879 7.387387275695801 C 10.14367961883545 8.71955680847168 9.178250312805176 10.3274974822998 7.66894006729126 10.3274974822998 L 3.33105993270874 10.3274974822998 C 1.821749687194824 10.3274974822998 0.8563203811645508 8.71955680847168 1.565779685974121 7.387387275695801 L 3.734729766845703 3.314697265625 C 4.111030101776123 2.608107566833496 4.805514812469482 2.254812240600586 5.5 2.254812240600586 Z"
                          stroke="none"
                          fill="#2b2b2b"
                        />
                      </g>
                    </g>
                  </svg>
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
