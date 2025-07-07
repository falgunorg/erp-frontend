import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import {
  FilterIcon,
  ArrowRightIcon,
  ToggleCheckboxIcon,
  ToggleCheckboxActiveIcon,
} from "../elements/SvgIcons";
import FilterSidebar from "elements/FilterSidebar";
import CreateBudget from "elements/budgets/CreateBudget";
import BudgetDetails from "elements/budgets/BudgetDetails";
import EditBudget from "elements/budgets/EditBudget";
import moment from "moment";
import api from "services/api";
import { useParams, useHistory } from "react-router-dom";

export default function BudgetSheets(props) {
  const params = useParams();

  const [renderArea, setRenderArea] = useState("blank");

  const [viewTab, setViewTab] = useState("All");
  const [markAble, setMarkAble] = useState(false);

  const toggleMarkAble = () => {
    setMarkAble(!markAble);
  };

  const [budgets, setBudgets] = useState([]);

  const getBudgets = async () => {
    const response = await api.post("/budgets");
    if (response.status === 200 && response.data) {
      const data = response.data.budgets.data;
      setBudgets(data);
    }
  };

  useEffect(async () => {
    getBudgets();
  }, []);

  useEffect(async () => {
    if (params.id) {
      setRenderArea("details");
    } else {
      setRenderArea("blank");
    }
    getBudgets();
  }, [params.id]);

  useEffect(async () => {
    props.setHeaderData({
      pageName: "Budgets",
      isNewButton: true,
      newButtonLink: "",
      newButtonText: "New BGD",
      isInnerSearch: true,
      innerSearchValue: "",
    });
  }, []);

  const history = useHistory();

  const [selectedBudgetId, setSelectedBudgetId] = useState(null);

  const handleClick = (id) => {
    setSelectedBudgetId(id);
    history.push("/budget-sheets/" + id);
    setRenderArea("details");
  };

  const handleDelete = async () => {
    var response = await api.post("/budgets-delete", { id: selectedBudgetId });
    if (response.status === 200 && response.data) {
      getBudgets();
      history.push("/budget-sheets");
    }
  };

  return (
    <div className="purchase_order_page">
      <div className="purchase_action_header non_printing_area">
        <div className="actions_left">
          <button onClick={() => setRenderArea("add")} className="active">
            New BGD
          </button>

          <button
            disabled={renderArea !== "details"}
            onClick={() => setRenderArea("update")}
          >
            Edit
          </button>
          <button onClick={handleDelete} disabled={renderArea !== "details"}>
            Delete
          </button>
        </div>
      </div>

      <div className="technical_package_layout purchase_order_page_when_print">
        <FilterSidebar />

        <div className="purchase_list non_printing_area">
          <div className="purchase_list_header d-flex justify-content-between">
            <div className="purchase_header_left">
              <div className="title">
                <input type="checkbox" style={{ marginTop: "3px" }} /> BGD View
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
            {budgets.length > 0 &&
              budgets.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleClick(item.id)}
                  className={
                    params.id == item.id
                      ? "single_tp_item active"
                      : "single_tp_item"
                  }
                >
                  <div className="tp_text d-flex align-items-center">
                    <span
                      className="marker"
                      style={{ width: "20px", display: "inline-block" }}
                    >
                      {markAble ? (
                        <input type="checkbox" />
                      ) : (
                        <ArrowRightIcon />
                      )}
                    </span>
                    <span className="me-2">{item.ref_number}</span>
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    {item.techpack?.buyer_style_name}
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    {item.techpack?.buyer?.nickname}
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    {item.fob}
                  </div>
                  <div className="tp_text">
                    <span className="step_border"></span>
                    {item.cm}
                  </div>
                  <div className="tp_text d-flex justify-content-between align-items-center">
                    <div>
                      <span className="step_border"></span>
                      <span className="date area me-2">
                        {" "}
                        {moment(item.created_at).format("L")}
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
          {renderArea === "add" && <CreateBudget />}
          {renderArea === "details" && <BudgetDetails />}
          {renderArea === "update" && <EditBudget />}
        </div>
      </div>
    </div>
  );
}
