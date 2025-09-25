import React, { useState, useEffect, useMemo, useCallback } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import CreateTechnicalPackage from "../elements/techpack/CreateTechnicalPackage";
import TechnicalPackageDetails from "../elements/techpack/TechnicalPackageDetails";
import api from "services/api";
import swal from "sweetalert";
import FilterSidebar from "elements/FilterSidebar";
import { useHistory, useParams } from "react-router-dom";
import {
  FilterIcon,
  ArrowRightIcon,
  ArrowDownIcon,
  ToggleCheckboxIcon,
  ToggleCheckboxActiveIcon,
} from "../elements/SvgIcons";
import EditTechnicalPackage from "elements/techpack/EditTechnicalPackage";

export default function TechnicalPackages(props) {
  const [renderArea, setRenderArea] = useState("blank");
  const history = useHistory();
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      setRenderArea("details");
    }
  }, [params.id]);

  useEffect(async () => {
    props.setHeaderData({
      pageName: "Tech Packs",
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
    setSelectedItems([]);
    setMarkAble(!markAble);
  };

  const [technicalPackages, setTechnicalPackages] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});

  const getTechnicalPackages = async () => {
    const response = await api.post("/merchandising/technical-packages", {
      department: props.sidebarFilter.department,
      purchase_contract_id: props.sidebarFilter.purchase_contract_id,
      technical_package_id: props.sidebarFilter.technical_package_id,
      date: props.sidebarFilter.date,
    });
    if (response.status === 200 && response.data) {
      const data = response.data.techpacks.data;
      setTechnicalPackages(data);

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
    getTechnicalPackages();
  }, [props.sidebarFilter]);

  const [selectedTp, setSelectedTp] = useState();
  const handleTpDetails = (pkg) => {
    history.push("/technical-packages/" + pkg.id);
    setRenderArea("details");
    setSelectedTp(pkg);
  };

  const [selectedItems, setSelectedItems] = useState([]);

  // Flatten all item IDs
  const allItemsIds = useMemo(() => {
    return Object.values(technicalPackages)
      .flat()
      .map((item) => item.id);
  }, [technicalPackages]);

  const toggleSelectAll = useCallback(() => {
    if (selectedItems.length === allItemsIds.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(allItemsIds);
    }
  }, [selectedItems, allItemsIds]);

  const toggleSelectChange = useCallback(
    (id) => {
      setSelectedItems((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    },
    [setSelectedItems]
  );

  const handleDelete = async (id) => {
    const confirmed = await swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this technical package!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (confirmed) {
      try {
        const response = await api.post(
          "/merchandising/technical-packages-delete",
          { id }
        );
        if (response.status === 200 && response.data) {
          swal(
            "Deleted!",
            "The technical package has been deleted.",
            "success"
          ).then(() => {
            history.push("/technical-packages");
            window.location.reload();
          });
        }
      } catch (error) {
        swal("Error", "Something went wrong while deleting.", "error");
      }
    }
  };

  const handleDeleteMultiple = async () => {
    if (selectedItems.length === 0) {
      swal(
        "No items selected",
        "Please select at least one item to delete.",
        "info"
      );
      return;
    }

    const confirmed = await swal({
      title: "Are you sure?",
      text: "This will permanently delete all selected technical packages!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (confirmed) {
      try {
        const response = await api.post(
          "/merchandising/technical-packages-delete-multiple",
          {
            ids: selectedItems,
          }
        );
        if (response.status === 200 && response.data) {
          swal(
            "Deleted!",
            "Selected technical packages have been deleted.",
            "success"
          ).then(() => {
            window.location.reload();
          });
        }
      } catch (error) {
        swal(
          "Error",
          "Something went wrong while deleting multiple items.",
          "error"
        );
      }
    }
  };

  const [techpackExpandDetails, setTechpackExpandDetails] = useState(() => {
    // load initial state from sessionStorage
    const saved = sessionStorage.getItem("techpackExpandDetails");
    return saved ? JSON.parse(saved) : false;
  });

  const toggleTechpackExpanded = () => {
    setTechpackExpandDetails((prev) => !prev);
  };

  // keep sessionStorage in sync with state
  useEffect(() => {
    sessionStorage.setItem(
      "techpackExpandDetails",
      JSON.stringify(techpackExpandDetails)
    );
  }, [techpackExpandDetails]);

  return (
    <div className="purchase_order_page">
      <div className="purchase_action_header non_printing_area">
        <div className="actions_left">
          <button
            onClick={() => {
              history.push("/technical-packages");
              setRenderArea("add");
            }}
            className="active"
          >
            New TP
          </button>

          <button
            disabled={renderArea !== "details"}
            onClick={() => setRenderArea("update")}
          >
            Edit
          </button>

          {selectedItems.length > 1 ? (
            <button
              onClick={handleDeleteMultiple}
              // disabled={renderArea !== "details"}
            >
              Delete All
            </button>
          ) : (
            <button
              onClick={() => handleDelete(selectedTp.id)}
              disabled={renderArea !== "details"}
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="technical_package_layout purchase_order_page_when_print">
        <FilterSidebar {...props} />

        <div
          className={
            techpackExpandDetails ? "purchase_list width_0" : "purchase_list"
          }
        >
          <div className="purchase_list_header d-flex justify-content-between">
            <div className="purchase_header_left">
              <div className="title">
                {markAble && (
                  <>
                    <input
                      onChange={toggleSelectAll}
                      checked={selectedItems.length === allItemsIds.length}
                      type="checkbox"
                      style={{ marginTop: "3px" }}
                    />{" "}
                  </>
                )}
                TP View
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
            {Object.entries(technicalPackages).map(([groupName, packages]) => (
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
                    {packages.map((pkg) => (
                      <div
                        onClick={() => handleTpDetails(pkg)}
                        className={
                          pkg.id == params.id
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
                              <input
                                onChange={() => toggleSelectChange(pkg.id)}
                                type="checkbox"
                                checked={selectedItems.includes(pkg.id)}
                              />
                            ) : (
                              ""
                            )}
                          </span>
                          <span className="me-2">{pkg.techpack_number}</span>
                        </div>
                        <div className="tp_text">
                          <span className="step_border"></span>
                          {pkg.item_name}
                        </div>
                        <div className="tp_text">
                          <span className="step_border"></span>
                          {pkg.po?.po_number ?? "N/A"}
                        </div>
                        <div className="tp_text">
                          <span className="step_border"></span>
                          {pkg.wo?.wo_number ?? "N/A"}
                        </div>
                        <div className="tp_text">
                          <span className="step_border"></span>
                          {pkg.buyer?.name}
                        </div>
                        <div className="tp_text d-flex justify-content-between align-items-center">
                          <div>
                            <span className="step_border"></span>
                            <span className="date area me-2">
                              {pkg.received_date}
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
            techpackExpandDetails
              ? "tp_details_area non_printing_area expanded"
              : "tp_details_area "
          }
        >
          {renderArea === "blank" && (
            <div style={{ textAlign: "center", paddingTop: "250px" }}>
              <i
                onClick={toggleTechpackExpanded}
                style={{
                  fontSize: "25px",
                  marginRight: "15px",
                  cursor: "pointer",
                }}
                className="fa fa-angle-left"
              ></i>
              <b>Select an Item For Details</b>
              <div className="text-muted">Nothing is selected</div>
            </div>
          )}

          {renderArea === "add" && (
            <CreateTechnicalPackage
              toggleTechpackExpanded={toggleTechpackExpanded}
              setRenderArea={setRenderArea}
            />
          )}
          {renderArea === "details" && (
            <TechnicalPackageDetails
              toggleTechpackExpanded={toggleTechpackExpanded}
            />
          )}
          {renderArea === "update" && (
            <EditTechnicalPackage
              toggleTechpackExpanded={toggleTechpackExpanded}
              setRenderArea={setRenderArea}
            />
          )}
        </div>
      </div>
    </div>
  );
}
