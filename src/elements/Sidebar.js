import React, { useState, useEffect, useMemo } from "react"; // Added useMemo
import auth from "services/auth";
import ls from "services/ls";
import { Link, useLocation } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
  ArrowLeftIcon,
  ArrowRightIcon,
} from "./SvgIcons";

export default function Sidebar(props) {
  const location = useLocation();
  const pathname = location.pathname;
  const themeMode = "bg_light";

  // Fix 1: Memoize userData to prevent reference changes on every render
  const userData = useMemo(() => auth.getUser(), []); 

  const [menus, setMenus] = useState(() => {
    const savedOrder = localStorage.getItem("menuOrder");
    if (savedOrder && userData?.menus) {
      const parsedOrder = JSON.parse(savedOrder);
      const orderedMenus = parsedOrder
        .map((id) => userData.menus.find((menu) => menu.id === id))
        .filter(Boolean);
      
      // If the saved order doesn't cover all menus (e.g. new permissions added), 
      // you might want to append missing ones here.
      return orderedMenus.length > 0 ? orderedMenus : userData.menus;
    }
    return userData?.menus || [];
  });

  // Fix 2: Use a specific ID or stringified version to avoid infinite loops
  useEffect(() => {
    const hasSavedOrder = localStorage.getItem("menuOrder");
    if (!hasSavedOrder && userData?.menus) {
      setMenus(userData.menus);
    }
  }, [userData?.id, userData?.menus?.length]); // More stable dependencies

  const [customLabels, setCustomLabels] = useState(() => {
    const saved = localStorage.getItem("menuLabels");
    return saved ? JSON.parse(saved) : {};
  });

  const renameMenu = (id, newLabel) => {
    const updated = { ...customLabels, [id]: newLabel };
    setCustomLabels(updated);
    localStorage.setItem("menuLabels", JSON.stringify(updated));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(menus);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    setMenus(reordered);
    localStorage.setItem(
      "menuOrder",
      JSON.stringify(reordered.map((item) => item.id))
    );
  };

  return (
    <div className={`falgun_app_sidebar ${themeMode}`}>
      <nav className={`navbar ${themeMode}`} style={{ display: "block" }}>
        <div className="fixed_area">
          {/* Use specific condition to avoid constant toggling */}
          {pathname === "/mailbox" && !props.resizeToggle && (
            <button
              onClick={() => {
                const newToggleValue = !props.resizeToggle;
                ls.set("resizeToggle", newToggleValue);
                props.setResizeToggle(newToggleValue);
              }}
              className="resizeToggle sidebarMenu"
            >
               <ArrowRightIcon />
            </button>
          )}
          {/* Optional: Add the close button for when it is toggled */}
          {pathname === "/mailbox" && props.resizeToggle && (
             <button
             onClick={() => {
               const newToggleValue = !props.resizeToggle;
               ls.set("resizeToggle", newToggleValue);
               props.setResizeToggle(newToggleValue);
             }}
             className="resizeToggle sidebarMenu"
           >
              <ArrowLeftIcon />
           </button>
          )}

          <div className="common_icon_menus">
            <ul>
              <li>
                <Link to="/mailbox" className={pathname === "/mailbox" ? "active" : ""}>
                  <div className="border_design"></div>
                  <span className="icon_shadow">
                    <span className="inactive"><MailIcon /></span>
                    <span className="active"><MailActiveIcon /></span>
                  </span>
                  <div className="link_text">Mail</div>
                </Link>
              </li>
              <li>
                <Link to="/schedules" className={pathname === "/schedules" ? "active" : ""}>
                  <div className="border_design"></div>
                  <span className="icon_shadow">
                    <span className="inactive"><ScheduleIcon /></span>
                    <span className="active"><ScheduleActiveIcon /></span>
                  </span>
                  <div className="link_text">Schedule</div>
                </Link>
              </li>
              <li>
                <Link to="/tasks" className={pathname === "/tasks" ? "active" : ""}>
                  <div className="border_design"></div>
                  <span className="icon_shadow">
                    <span className="inactive"><TaskIcon /></span>
                    <span className="active"><TaskActiveIcon /></span>
                  </span>
                  <div className="link_text">Task</div>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="dynamic_area">
          <div className="permission_menus">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="menu">
                {(provided) => (
                  <ul className="submenu" {...provided.droppableProps} ref={provided.innerRef}>
                    {menus.map((item, index) => (
                      <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              const newName = prompt(
                                "Enter new name for menu",
                                customLabels[item.id] || item.label
                              );
                              if (newName) renameMenu(item.id, newName);
                            }}
                          >
                            <Link
                              to={item.path}
                              title={customLabels[item.id] || item.label}
                              className={pathname === item.path ? "active" : ""}
                            >
                              {customLabels[item.id] || item.label}
                            </Link>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </nav>
    </div>
  );
}
