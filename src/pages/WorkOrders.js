import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import Dropdown from "react-bootstrap/Dropdown";
import Logo from "../assets/images/logos/logo-short.png";
import CreateWorkOrder from "elements/wo_elements/CreateWorkOrder";
import WorkOrderDetails from "elements/wo_elements/WorkOrderDetails";
import EditWorkOrder from "elements/wo_elements/EditWorkOrder";
import moment from "moment";
import api from "services/api";
import FilterSidebar from "elements/FilterSidebar";
import { useHistory, useParams } from "react-router-dom";

import {
  FilterIcon,
  ToggleCheckboxIcon,
  ToggleCheckboxActiveIcon,
} from "../elements/SvgIcons";

export default function WorkOrders(props) {
  const history = useHistory();
  const params = useParams();
  const [renderArea, setRenderArea] = useState("blank");

  useEffect(async () => {
    props.setHeaderData({
      pageName: "Work Orders",
      isNewButton: true,
      newButtonLink: "",
      newButtonText: "New WO",
      isInnerSearch: true,
      innerSearchValue: "",
    });
  }, []);

  const [viewTab, setViewTab] = useState("All");
  const [markAble, setMarkAble] = useState(false);

  const toggleMarkAble = () => {
    setMarkAble(!markAble);
  };

  const [workorders, setWorkorders] = useState([]);
  const getWorkOrders = async () => {
    const response = await api.post("/workorders");
    if (response.status === 200 && response.data) {
      const data = response.data.workorders.data;
      setWorkorders(data);
    }
  };

  useEffect(async () => {
    getWorkOrders();
  }, []);

  const [selectedWo, setSelectedWo] = useState();
  const handlePoDetails = (wo) => {
    history.push("/work-orders/" + wo.id);
    setRenderArea("details");
    setSelectedWo(wo);
  };

  const handleDelete = async (id) => {
    var response = await api.post("/workorders-delete", { id: id });
    if (response.status === 200 && response.data) {
      window.location.reload();
    }
  };

  useEffect(async () => {
    if (params.id) {
      setRenderArea("details");
    } else {
      setRenderArea("blank");
    }
    getWorkOrders();
  }, [params.id]);

  return (
    <div className="purchase_order_page">
      <div className="purchase_action_header non_printing_area">
        <div className="actions_left">
          <button onClick={() => setRenderArea("add")} className="active">
            New WO
          </button>

          <button
            disabled={renderArea !== "details"}
            onClick={() => setRenderArea("update")}
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(selectedWo.id)}
            disabled={renderArea !== "details"}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="technical_package_layout purchase_order_page_when_print">
        <FilterSidebar />

        <div className="purchase_list">
          <div className="purchase_list_header d-flex justify-content-between">
            <div className="purchase_header_left">
              <div className="title">
                <input type="checkbox" style={{ marginTop: "3px" }} /> WO View
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
                  Unassigned LC
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
            {workorders.map((wo) => (
              <div
                key={wo.id}
                onClick={() => handlePoDetails(wo)}
                className={`single_tp_item on_wo ${
                  wo.id === selectedWo?.id ? "active" : ""
                }`}
              >
                <div className="tp_text d-flex align-items-center">
                  <span
                    className="marker"
                    style={{ width: "20px", display: "inline-block" }}
                  >
                    {markAble && <input type="checkbox" />}
                  </span>
                  <span className="me-2">{wo.wo_number}</span>
                </div>

                <div className="tp_text">
                  <span className="step_border"></span>
                  {wo.techpack?.buyer?.nickname}
                </div>

                <div className="tp_text">
                  <span className="step_border"></span>
                  {wo.techpack?.company?.nickname}
                </div>
                <div className="tp_text">
                  <span className="step_border"></span>$
                  {wo.pos
                    ?.reduce(
                      (sum, po) => sum + (parseFloat(po.total_value) || 0),
                      0
                    )
                    .toFixed(2)}
                </div>

                <div className="tp_text">
                  <span className="step_border"></span>
                  {wo.pos?.reduce(
                    (sum, po) => sum + (parseInt(po.total_qty) || 0),
                    0
                  )}{" "}
                  Pcs
                </div>

                <div className="tp_text d-flex justify-content-between align-items-center">
                  <div>
                    <span className="step_border"></span>
                    <span className="date area me-2">
                      {moment(wo.updated_at).format("L")}
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
                      <rect width="11" height="11" rx="1" fill="#91cfff" />
                    </svg>
                  </div>
                </div>
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
            <CreateWorkOrder
              renderArea={renderArea}
              setRenderArea={setRenderArea}
              selectedWo={selectedWo}
              setSelectedWo={setSelectedWo}
            />
          )}
          {renderArea === "details" && (
            <WorkOrderDetails
              renderArea={renderArea}
              setRenderArea={setRenderArea}
              selectedWo={selectedWo}
              setSelectedWo={setSelectedWo}
            />
          )}
          {renderArea === "update" && (
            <EditWorkOrder
              renderArea={renderArea}
              setRenderArea={setRenderArea}
              selectedWo={selectedWo}
              setSelectedWo={setSelectedWo}
            />
          )}
        </div>
      </div>
    </div>
  );
}
