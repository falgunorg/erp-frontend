import React, { useState, useEffect } from "react";
import CreatePurchaseOrder from "../elements/po_elements/CreatePurchaseOrder";
import PurchaseOrderDetails from "../elements/po_elements/PurchaseOrderDetails";
import EditPurchaseOrder from "elements/po_elements/EditPurchaseOrder";
import api from "services/api";
import { useParams, useHistory } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import swal from "sweetalert";
import FilterSidebar from "elements/FilterSidebar";

import {
  FilterIcon,
  ArrowRightIcon,
  ArrowDownIcon,
  ToggleCheckboxIcon,
  ToggleCheckboxActiveIcon,
} from "../elements/SvgIcons";

export default function PurchaseOrders(props) {
  const params = useParams();
  const history = useHistory();
  const [renderArea, setRenderArea] = useState("blank");

  useEffect(async () => {
    props.setHeaderData({
      pageName: "Purchase Orders",
      isNewButton: true,
      newButtonLink: "",
      newButtonText: "New TP",
      isInnerSearch: true,
      innerSearchValue: "",
    });
  }, []);

  const [viewTab, setViewTab] = useState("All");
  const [markAble, setMarkAble] = useState(false);
  const toggleMarkAble = () => {
    setMarkAble(!markAble);
  };

  const [pos, setPos] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});

  const getPos = async () => {
    const response = await api.post("/pos", {
      department: props.sidebarFilter.department,
      purchase_contract_id: props.sidebarFilter.purchase_contract_id,
      technical_package_id: props.sidebarFilter.technical_package_id,
      date: props.sidebarFilter.date,
    });
    if (response.status === 200 && response.data) {
      const data = response.data.pos.data;
      setPos(data);

      // Initialize all groups as expanded (true)
      const initialExpandedState = {};
      Object.keys(data).forEach((group) => {
        initialExpandedState[group] = true;
      });
      setExpandedGroups(initialExpandedState);
    }
  };

  const toggleGroup = (groupName) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  useEffect(async () => {
    getPos();
  }, [props.sidebarFilter]);

  const [selectedPo, setSelectedPo] = useState();
  const handlePoDetails = (po) => {
    setSelectedPo(po);
    history.push("/purchase-orders/" + po.id);
    setRenderArea("details");
  };

  const handleDelete = async (id) => {
    const confirmed = await swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this purchase order!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (confirmed) {
      try {
        var response = await api.post("/pos-delete", { id: id });
        if (response.status === 200 && response.data) {
          swal(
            "Deleted!",
            "The purchase order has been deleted.",
            "success"
          ).then(() => {
            history.push("/purchase-orders");
            window.location.reload();
          });
        }
      } catch (error) {
        swal("Error", "Something went wrong while deleting.", "error");
      }
    }
  };

  useEffect(async () => {
    if (params.id) {
      history.push("/purchase-orders/" + params.id);
      setRenderArea("details");
    } else {
      setRenderArea("blank");
    }
  }, [params.id]);
  return (
    <div className="purchase_order_page">
      <div className="purchase_action_header non_printing_area">
        <div className="actions_left">
          <button onClick={() => setRenderArea("add")} className="active">
            New PO
          </button>

          <button
            disabled={renderArea !== "details"}
            onClick={() => setRenderArea("update")}
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(selectedPo.id)}
            disabled={renderArea !== "details"}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="technical_package_layout purchase_order_page_when_print">
        <FilterSidebar {...props} />

        <div className="purchase_list">
          <div className="purchase_list_header d-flex justify-content-between">
            <div className="purchase_header_left">
              <div className="title">
                <input type="checkbox" style={{ marginTop: "3px" }} /> PO View
              </div>

              <div className="buttons_group">
                <button
                  className={viewTab === "All" ? "active" : ""}
                  onClick={() => setViewTab("All")}
                >
                  All
                </button>
                <button
                  className={viewTab === "Urgent" ? "active" : ""}
                  onClick={() => setViewTab("Urgent")}
                >
                  Urgent
                </button>
                <button
                  className={viewTab === "Unassigned WO" ? "active" : ""}
                  onClick={() => setViewTab("Unassigned WO")}
                >
                  Unassigned WO
                </button>
              </div>
            </div>
            <div className="purchase_header_left">
              <span
                onClick={toggleMarkAble}
                className="toggleSelect"
                style={{ cursor: "pointer" }}
              >
                {markAble ? (
                  <ToggleCheckboxActiveIcon />
                ) : (
                  <ToggleCheckboxIcon />
                )}
              </span>

              <Dropdown className="purchase_filter_dropdown">
                <Dropdown.Toggle
                  id="dropdown-button-dark-example1"
                  variant="secondary"
                >
                  <FilterIcon />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>Buyer</Dropdown.Item>
                  <Dropdown.Item>PC</Dropdown.Item>
                  <Dropdown.Item>WO</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          <div className="tp_list">
            {Object.entries(pos).map(([groupName, packages]) => (
              <div key={groupName} className="group">
                <div
                  onClick={() => toggleGroup(groupName)}
                  className="group-header"
                >
                  <span className="me-2">
                    {expandedGroups[groupName] ? (
                      <ArrowDownIcon />
                    ) : (
                      <ArrowRightIcon />
                    )}
                  </span>
                  {groupName}
                </div>

                {expandedGroups[groupName] && (
                  <div className="group-tps">
                    {packages.map((po) => (
                      <div
                        key={po.id}
                        onClick={() => handlePoDetails(po)}
                        className={
                          po.id == params.id
                            ? "single_tp_item active on_po"
                            : "single_tp_item on_po"
                        }
                      >
                        <div className="tp_text d-flex align-items-center">
                          <span
                            className="marker"
                            style={{ width: "20px", display: "inline-block" }}
                          >
                            {markAble ? <input type="checkbox" /> : ""}
                          </span>
                          <span className="me-2">{po.po_number}</span>
                        </div>
                        <div className="tp_text">
                          <span className="step_border"></span>
                          {po.item_name}
                        </div>
                        <div className="tp_text">
                          <span className="step_border"></span>
                          {po.technical_package?.techpack_number}
                        </div>
                        <div className="tp_text">
                          <span className="step_border"></span>
                          {po.total_qty} PCS
                        </div>
                        <div className="tp_text">
                          <span className="step_border"></span>${" "}
                          {po.total_value}
                        </div>
                        <div className="tp_text d-flex justify-content-between align-items-center">
                          <div>
                            <span className="step_border"></span>
                            <span className="date area me-2">
                              {po.delivery_date}
                            </span>
                          </div>

                          <div className="icon_area">
                            <svg
                              className="me-2"
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
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div
          className={
            renderArea === "details"
              ? "tp_details_area"
              : "tp_details_area non_printing_area"
          }
        >
          {renderArea === "blank" && (
            <div style={{ textAlign: "center", paddingTop: "250px" }}>
              <b>Select an Item For Details</b>
              <div className="text-muted">Nothing is selected</div>
            </div>
          )}
          {renderArea === "add" && (
            <CreatePurchaseOrder
              renderArea={renderArea}
              setRenderArea={setRenderArea}
              selectedPo={selectedPo}
              setSelectedPo={setSelectedPo}
            />
          )}
          {renderArea === "details" && (
            <PurchaseOrderDetails
              renderArea={renderArea}
              setRenderArea={setRenderArea}
              selectedPo={selectedPo}
              setSelectedPo={setSelectedPo}
            />
          )}
          {renderArea === "update" && (
            <EditPurchaseOrder
              renderArea={renderArea}
              setRenderArea={setRenderArea}
              selectedPo={selectedPo}
              setSelectedPo={setSelectedPo}
            />
          )}
        </div>
      </div>
    </div>
  );
}
