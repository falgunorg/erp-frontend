import React, { useState, useEffect, useRef } from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "services/authConfig";
import ls from "services/ls";
import Select, { components } from "react-select";
import MailCategory from "./MailCategory";
import { ArrowLeftIcon, ArrowDownIcon, ArrowRightIcon } from "../SvgIcons";

export default function MailFolders(props) {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const [folders, setFolders] = useState([]);
  const initialFolderSet = useRef(false);
  const [favoriteFolders, setFavoriteFolders] = useState([]);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    folder: null,
  });
  const folderOrder = [
    "Inbox",
    "Drafts",
    "Sent Items",
    "Deleted Items",
    "Archive",
    "Conversation History",
    "Junk Email",
    "Outbox",
    "RSS Feeds",
  ];
  useEffect(() => {
    // Load favorite folders from local storage
    const savedFavorites = ls.get("favoriteFolders") || [];
    setFavoriteFolders(savedFavorites);

    const getMailFolders = async () => {
      if (accounts.length > 0) {
        try {
          const response = await instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0],
          });
          const accessToken = response.accessToken;
          const foldersResponse = await fetch(
            `${process.env.REACT_APP_MICROSOFT_API_URL}/me/mailFolders?$top=50&$select=displayName,unreadItemCount`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (foldersResponse.ok) {
            const data = await foldersResponse.json();
            let allFolders = data.value;

            const fetchSubfolders = async (parentFolder) => {
              const subfoldersResponse = await fetch(
                `${process.env.REACT_APP_MICROSOFT_API_URL}/me/mailFolders/${parentFolder.id}/childFolders?$top=999&$select=displayName,unreadItemCount`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (subfoldersResponse.ok) {
                const subfolderData = await subfoldersResponse.json();
                parentFolder.subfolders = subfolderData.value || [];
              } else {
                parentFolder.subfolders = [];
              }
            };

            for (let folder of allFolders) {
              await fetchSubfolders(folder);
            }

            const sortedFolders = allFolders.sort((a, b) => {
              const indexA = folderOrder.indexOf(a.displayName);
              const indexB = folderOrder.indexOf(b.displayName);
              if (indexA === -1) return 1;
              if (indexB === -1) return -1;
              return indexA - indexB;
            });

            setFolders(sortedFolders);
            if (!initialFolderSet.current) {
              const inboxFolder = sortedFolders.find(
                (folder) => folder.displayName === "Inbox"
              );
              if (inboxFolder) {
                props.setMailFolder({
                  folderName: inboxFolder.displayName,
                  folderId: inboxFolder.id,
                });
                initialFolderSet.current = true;
              }
            }
          } else {
            console.error("Failed to fetch mail folders");
          }
        } catch (error) {
          console.error(
            "Error acquiring token or fetching mail folders",
            error
          );
        }
      }
    };

    if (isAuthenticated) {
      getMailFolders();
    }
  }, [instance, accounts, isAuthenticated]);

  const toggleFavoriteFolder = (folder) => {
    const isFavorite = favoriteFolders.some((fav) => fav.id === folder.id);
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favoriteFolders.filter((fav) => fav.id !== folder.id);
    } else {
      updatedFavorites = [...favoriteFolders, folder];
    }

    setFavoriteFolders(updatedFavorites);
    ls.set("favoriteFolders", updatedFavorites); // Save updated favorites in local storage
  };

  const isFavorite = (folderId) => {
    return favoriteFolders.some((fav) => fav.id === folderId);
  };

  const [expandedFolders, setExpandedFolders] = useState({});

  const toggleFolder = (folderId) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId], // Toggle the expanded state
    }));
  };

  const handleContextMenu = (e, folder) => {
    e.preventDefault(); // Prevent the default right-click behavior
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      folder: folder,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, folder: null });
  };

  useEffect(() => {
    document.addEventListener("click", closeContextMenu);
    return () => document.removeEventListener("click", closeContextMenu);
  }, []);

  const initialFolderState = () => {
    const savedState = localStorage.getItem("folderState");
    return savedState
      ? JSON.parse(savedState)
      : {
          favorites: false,
          folders: true,
          wo_wise: false,
          po_wise: false,
          sender: false,
          dv_wise: false,
          category_wise: false,
        };
  };

  const [folderState, setFolderState] = useState(initialFolderState);

  useEffect(() => {
    localStorage.setItem("folderState", JSON.stringify(folderState));
  }, [folderState]);

  // Function to toggle folder state
  const changeFolderStates = (name, value) => {
    setFolderState((prevState) => ({
      ...prevState,
      [name]: !value, // Toggle the specific folder state
    }));
  };

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="9"
          height="7"
          viewBox="0 0 9 7"
        >
          <path
            id="Polygon_60"
            data-name="Polygon 60"
            d="M3.659,1.308a1,1,0,0,1,1.682,0L8.01,5.459A1,1,0,0,1,7.168,7H1.832A1,1,0,0,1,.99,5.459Z"
            transform="translate(9 7) rotate(180)"
            fill="#707070"
          />
        </svg>
      </components.DropdownIndicator>
    );
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "none",
      border: "none",
      minHeight: "21px",
      height: "21px",
      boxShadow: "inset 0px 0px 6px rgba(0, 0, 0, 0.18)",
      boxShadow: state.isFocused ? null : null,
    }),

    valueContainer: (provided, state) => ({
      ...provided,
      height: "21px",
      padding: "0 6px",
    }),

    input: (provided, state) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorSeparator: (state) => ({
      display: "none",
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: "21px",
    }),
  };

  const [workOrders, setWorkOrders] = useState(
    ["WO001", "WO002", "WO003", "WO004", "WO005", "WO006"].map((wo) => ({
      label: wo,
      value: wo,
    }))
  );

  const [poNumbers, setPoNumbers] = useState(
    ["PO001", "PO002", "PO003", "PO004", "PO005", "PO006"].map((wo) => ({
      label: wo,
      value: wo,
    }))
  );

  const [selectedBuyer, setSelectedBuyer] = useState("");
  const toggleBuyerArea = (buyeName) => {
    setSelectedBuyer(buyeName);
  };

  //unread count for inbox

  const [inboxUnreadCount, setInboxUnreadCount] = useState(0);

  useEffect(() => {
    const fetchInboxUnreadCount = async () => {
      if (accounts.length > 0) {
        try {
          const response = await instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0],
          });
          const accessToken = response.accessToken;
          const foldersResponse = await fetch(
            `${process.env.REACT_APP_MICROSOFT_API_URL}/me/mailFolders?$top=50&$select=displayName,unreadItemCount`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (foldersResponse.ok) {
            const data = await foldersResponse.json();
            const inboxFolder = data.value.find(
              (folder) => folder.displayName === "Inbox"
            );
            if (inboxFolder) {
              setInboxUnreadCount(inboxFolder.unreadItemCount);
            }
          } else {
            console.error("Failed to fetch mail folders");
          }
        } catch (error) {
          console.error(
            "Error acquiring token or fetching mail folders",
            error
          );
        }
      }
    };

    // Fetch inbox unread count immediately on mount
    fetchInboxUnreadCount();

    // Set up an interval to fetch inbox unread count every 5 seconds
    const intervalId = setInterval(fetchInboxUnreadCount, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [instance, accounts]); // Re-run when accounts or instance changes



  return (
    <div
      className={
        props.resizeToggle
          ? "email-sidebar non_printing_area"
          : "email-sidebar non_printing_area expanded"
      }
    >
      {isAuthenticated && (
        <button
          onClick={() => {
            const newToggleValue = !props.resizeToggle;
            ls.set("resizeToggle", newToggleValue);
            props.setResizeToggle(newToggleValue);
          }}
          className="resizeToggle"
        >
          <>{props.resizeToggle ? <ArrowLeftIcon /> : <ArrowRightIcon />}</>
        </button>
      )}

      <div className="email-section">
        <div className="folder_name">
          <span
            style={{
              paddingRight: "10px",
              cursor: "pointer",
              display: "inline-block",
              width: "15px",
            }}
            onClick={() =>
              changeFolderStates("favorites", folderState.favorites)
            }
          >
            {folderState.favorites ? <ArrowDownIcon /> : <ArrowRightIcon />}
          </span>
          Favorite
        </div>
        {folderState.favorites && (
          <ul>
            {favoriteFolders.length > 0 ? (
              favoriteFolders.map((folder) => (
                <li style={{ position: "relative" }} key={folder.id}>
                  <button
                    className={
                      props.mailFolder.folderId === folder.id
                        ? "d-flex justify-content-between active"
                        : "d-flex justify-content-between"
                    }
                    onClick={() => {
                      props.setSelectedMailIds([]);
                      props.setMailFolder({
                        folderName: folder.displayName,
                        folderId: folder.id,
                      });
                      props.setMailSearchData([]);
                    }}
                  >
                    <span>{folder.displayName}</span>
                    {folder.displayName === "Inbox" && inboxUnreadCount > 0 && (
                      <span>{inboxUnreadCount}</span>
                    )}
                  </button>
                </li>
              ))
            ) : (
              <p>No favorite folders yet.</p>
            )}
          </ul>
        )}
      </div>
      <div className="email-section">
        <div className="folder_name">
          <span
            style={{
              paddingRight: "10px",
              cursor: "pointer",
              display: "inline-block",
              width: "15px",
            }}
            onClick={() => changeFolderStates("folders", folderState.folders)}
          >
            {folderState.folders ? <ArrowDownIcon /> : <ArrowRightIcon />}
          </span>
          Folders
        </div>

        {folderState.folders && (
          <>
            {isAuthenticated ? (
              <ul>
                {folders.length > 0 ? (
                  folders.map((folder) => {
                    // Check if the folder has subfolders
                    if (!folder.subfolders || folder.subfolders.length === 0) {
                      return (
                        <li style={{ position: "relative" }} key={folder.id}>
                          <button
                            className={
                              props.mailFolder.folderId === folder.id
                                ? "active"
                                : ""
                            }
                            onContextMenu={(e) => handleContextMenu(e, folder)}
                            onClick={() => {
                              props.setSelectedMailIds([]);
                              props.setMailFolder({
                                folderName: folder.displayName,
                                folderId: folder.id,
                              });
                              props.setMailSearchData([]);
                            }}
                          >
                            {folder.displayName}

                            {folder.displayName === "Inbox" &&
                              inboxUnreadCount > 0 && (
                                <span>{inboxUnreadCount}</span>
                              )}

                            {/* {folder.unreadItemCount > 0 && (
                              <span>{folder.unreadItemCount}</span>
                            )} */}
                          </button>
                          {contextMenu.visible &&
                            contextMenu.folder?.id === folder.id && (
                              <div
                                style={{
                                  background: "#fff",
                                  border: "1px solid #ccc",
                                  position: "absolute",
                                  borderRadius: "5px",
                                  top: "0px",
                                  right: "0px",
                                  zIndex: "9999",
                                }}
                                className="context_menu"
                              >
                                <ul
                                  style={{ fontSize: "11px", padding: "5px" }}
                                >
                                  <li>
                                    <button
                                      onClick={() =>
                                        toggleFavoriteFolder(contextMenu.folder)
                                      }
                                    >
                                      {favoriteFolders.some(
                                        (fav) =>
                                          fav.id === contextMenu.folder.id
                                      )
                                        ? "Remove from Favorites"
                                        : "Add to Favorites"}
                                    </button>
                                  </li>

                                  <li>
                                    <button
                                      onClick={() =>
                                        console.log("Hide folder logic")
                                      }
                                    >
                                      Mark All Read
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      onClick={() =>
                                        console.log("Hide folder logic")
                                      }
                                    >
                                      Mark All Unread
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            )}
                        </li>
                      );
                    }

                    return (
                      <li style={{ position: "relative" }} key={folder.id}>
                        <button
                          className={
                            props.mailFolder.folderId === folder.id
                              ? "active"
                              : ""
                          }
                          onClick={() => toggleFolder(folder.id)}
                          onContextMenu={(e) => handleContextMenu(e, folder)}
                        >
                          {folder.displayName}

                          <span>
                            {expandedFolders[folder.id] ? (
                              <ArrowDownIcon />
                            ) : (
                              <ArrowRightIcon />
                            )}
                          </span>
                        </button>
                        {contextMenu.visible &&
                          contextMenu.folder?.id === folder.id && (
                            <div
                              style={{
                                background: "#fff",
                                border: "1px solid #ccc",
                                position: "absolute",
                                borderRadius: "5px",
                                top: "0px",
                                right: "0px",
                                zIndex: "9999",
                              }}
                              className="context_menu"
                            >
                              <ul style={{ fontSize: "11px", padding: "5px" }}>
                                <li>
                                  <button
                                    onClick={() =>
                                      toggleFavoriteFolder(contextMenu.folder)
                                    }
                                  >
                                    {favoriteFolders.some(
                                      (fav) => fav.id === contextMenu.folder.id
                                    )
                                      ? "Remove from Favorites"
                                      : "Add to Favorites"}
                                  </button>
                                </li>

                                <li>
                                  <button
                                    onClick={() =>
                                      console.log("Hide folder logic")
                                    }
                                  >
                                    Mark All Read
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={() =>
                                      console.log("Hide folder logic")
                                    }
                                  >
                                    Mark All Unread
                                  </button>
                                </li>
                              </ul>
                            </div>
                          )}

                        {expandedFolders[folder.id] && folder.subfolders && (
                          <ul style={{ marginLeft: "15px" }}>
                            {folder.subfolders.map((subfolder) => (
                              <li
                                style={{ position: "relative" }}
                                key={subfolder.id}
                              >
                                <button
                                  className={
                                    props.mailFolder.folderId === subfolder.id
                                      ? "active"
                                      : ""
                                  }
                                  onClick={() => {
                                    props.setSelectedMailIds([]);
                                    props.setMailFolder({
                                      folderName: subfolder.displayName,
                                      folderId: subfolder.id,
                                    });
                                    props.setMailSearchData([]);
                                  }}
                                  onContextMenu={(e) =>
                                    handleContextMenu(e, subfolder)
                                  }
                                >
                                  {subfolder.displayName}
                                  {subfolder.unreadItemCount > 0 && (
                                    <span>{subfolder.unreadItemCount}</span>
                                  )}
                                </button>
                                {contextMenu.visible &&
                                  contextMenu.folder?.id === subfolder.id && (
                                    <div
                                      style={{
                                        background: "#fff",
                                        border: "1px solid #ccc",
                                        position: "absolute",
                                        borderRadius: "5px",
                                        top: "0px",
                                        right: "0px",
                                        zIndex: "9999",
                                      }}
                                      className="context_menu"
                                    >
                                      <ul
                                        style={{
                                          fontSize: "11px",
                                          padding: "5px",
                                        }}
                                      >
                                        <li>
                                          <button
                                            onClick={() =>
                                              toggleFavoriteFolder(
                                                contextMenu.folder
                                              )
                                            }
                                          >
                                            {favoriteFolders.some(
                                              (fav) =>
                                                fav.id === contextMenu.folder.id
                                            )
                                              ? "Remove from Favorites"
                                              : "Add to Favorites"}
                                          </button>
                                        </li>

                                        <li>
                                          <button
                                            onClick={() =>
                                              console.log("Hide folder logic")
                                            }
                                          >
                                            Mark All Read
                                          </button>
                                        </li>
                                        <li>
                                          <button
                                            onClick={() =>
                                              console.log("Hide folder logic")
                                            }
                                          >
                                            Mark All Unread
                                          </button>
                                        </li>
                                      </ul>
                                    </div>
                                  )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })
                ) : (
                  <p>No mail folders found.</p>
                )}
              </ul>
            ) : (
              <p>Please sign in to view your mail folders.</p>
            )}
          </>
        )}
      </div>

      {/* Filtering area  */}

      <div className="email-section">
        <div className="folder_name">
          <span
            style={{
              paddingRight: "10px",
              cursor: "pointer",
              display: "inline-block",
              width: "15px",
            }}
            onClick={() => changeFolderStates("wo_wise", folderState.wo_wise)}
          >
            {folderState.wo_wise ? <ArrowDownIcon /> : <ArrowRightIcon />}
          </span>
          WO-Wise
        </div>

        {folderState.wo_wise && (
          <ul>
            <li>
              <button
                className={selectedBuyer === "Next" ? "flex_button active" : ""}
                onClick={() => toggleBuyerArea("Next")}
              >
                {selectedBuyer === "Next" ? (
                  <div className="search_button">
                    <div className="buyer_name">{selectedBuyer}</div>
                    <Select
                      className="select_wo"
                      placeholder="Search"
                      options={workOrders}
                      styles={customStyles}
                      onChange={(selectedOption) =>
                        props.setMailSearchData({
                          ...props.mailSearchData,
                          subject: selectedOption.value,
                        })
                      }
                      components={{ DropdownIndicator }}
                    />
                  </div>
                ) : (
                  <span>Next</span>
                )}
              </button>
            </li>
            <li>
              <button
                className={
                  selectedBuyer === "Carmel" ? "flex_button active" : ""
                }
                onClick={() => toggleBuyerArea("Carmel")}
              >
                {selectedBuyer === "Carmel" ? (
                  <div className="search_button">
                    <div className="buyer_name">{selectedBuyer}</div>

                    <Select
                      className="select_wo"
                      placeholder="Search"
                      options={workOrders}
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                      onChange={(selectedOption) =>
                        props.setMailSearchData({
                          ...props.mailSearchData,
                          subject: selectedOption.value,
                        })
                      }
                    />
                  </div>
                ) : (
                  <span>Carmel</span>
                )}
              </button>
            </li>
            <li>
              <button
                className={
                  selectedBuyer === "Mango" ? "flex_button active" : ""
                }
                onClick={() => toggleBuyerArea("Mango")}
              >
                {selectedBuyer === "Mango" ? (
                  <div className="search_button">
                    <div className="buyer_name">{selectedBuyer}</div>

                    <Select
                      className="select_wo"
                      placeholder="Search"
                      options={workOrders}
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                      onChange={(selectedOption) =>
                        props.setMailSearchData({
                          ...props.mailSearchData,
                          subject: selectedOption.value,
                        })
                      }
                    />
                  </div>
                ) : (
                  <span>Mango</span>
                )}
              </button>
            </li>
          </ul>
        )}
      </div>
      <div className="email-section">
        <div className="folder_name">
          <span
            style={{
              paddingRight: "10px",
              cursor: "pointer",
              display: "inline-block",
              width: "15px",
            }}
            onClick={() => changeFolderStates("po_wise", folderState.po_wise)}
          >
            {folderState.po_wise ? <ArrowDownIcon /> : <ArrowRightIcon />}
          </span>
          PO-Wise
        </div>

        {folderState.po_wise && (
          <ul>
            <li>
              <button
                className={selectedBuyer === "Next" ? "flex_button active" : ""}
                onClick={() => toggleBuyerArea("Next")}
              >
                {selectedBuyer === "Next" ? (
                  <div className="search_button">
                    <div className="buyer_name">{selectedBuyer}</div>

                    <Select
                      className="select_wo"
                      placeholder="Search"
                      options={poNumbers}
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                      onChange={(selectedOption) =>
                        props.setMailSearchData({
                          ...props.mailSearchData,
                          subject: selectedOption.value,
                        })
                      }
                    />
                  </div>
                ) : (
                  <span>Next</span>
                )}
              </button>
            </li>
            <li>
              <button
                className={
                  selectedBuyer === "Carmel" ? "flex_button active" : ""
                }
                onClick={() => toggleBuyerArea("Carmel")}
              >
                {selectedBuyer === "Carmel" ? (
                  <div className="search_button">
                    <div className="buyer_name">{selectedBuyer}</div>

                    <Select
                      className="select_wo"
                      placeholder="Search"
                      options={poNumbers}
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                      onChange={(selectedOption) =>
                        props.setMailSearchData({
                          ...props.mailSearchData,
                          subject: selectedOption.value,
                        })
                      }
                    />
                  </div>
                ) : (
                  <span>Carmel</span>
                )}
              </button>
            </li>
            <li>
              <button
                className={
                  selectedBuyer === "Mango" ? "flex_button active" : ""
                }
                onClick={() => toggleBuyerArea("Mango")}
              >
                {selectedBuyer === "Mango" ? (
                  <div className="search_button">
                    <div className="buyer_name">{selectedBuyer}</div>
                    <Select
                      className="select_wo"
                      placeholder="Search"
                      options={poNumbers}
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                      onChange={(selectedOption) =>
                        props.setMailSearchData({
                          ...props.mailSearchData,
                          subject: selectedOption.value,
                        })
                      }
                    />
                  </div>
                ) : (
                  <span>Mango</span>
                )}
              </button>
            </li>
          </ul>
        )}
      </div>
      <div className="email-section">
        <div className="folder_name">
          <span
            style={{
              paddingRight: "10px",
              cursor: "pointer",
              display: "inline-block",
              width: "15px",
            }}
            onClick={() => changeFolderStates("sender", folderState.sender)}
          >
            {folderState.sender ? <ArrowDownIcon /> : <ArrowRightIcon />}
          </span>
          Sender
        </div>

        {folderState.sender && (
          <ul>
            <li>
              <button
                className={selectedBuyer === "Next" ? "flex_button active" : ""}
                onClick={() => toggleBuyerArea("Next")}
              >
                {selectedBuyer === "Next" ? (
                  <div className="search_button">
                    <div className="buyer_name">{selectedBuyer}</div>

                    <Select
                      className="select_wo"
                      placeholder="Search"
                      options={poNumbers}
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                    />
                  </div>
                ) : (
                  <span>Next</span>
                )}
              </button>
            </li>
            <li>
              <button
                className={
                  selectedBuyer === "Carmel" ? "flex_button active" : ""
                }
                onClick={() => toggleBuyerArea("Carmel")}
              >
                {selectedBuyer === "Carmel" ? (
                  <div className="search_button">
                    <div className="buyer_name">{selectedBuyer}</div>

                    <Select
                      className="select_wo"
                      placeholder="Search"
                      options={poNumbers}
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                    />
                  </div>
                ) : (
                  <span>Carmel</span>
                )}
              </button>
            </li>
            <li>
              <button
                className={
                  selectedBuyer === "Mango" ? "flex_button active" : ""
                }
                onClick={() => toggleBuyerArea("Mango")}
              >
                {selectedBuyer === "Mango" ? (
                  <div className="search_button">
                    <div className="buyer_name">{selectedBuyer}</div>
                    <Select
                      className="select_wo"
                      placeholder="Search"
                      options={poNumbers}
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                    />
                  </div>
                ) : (
                  <span>Mango</span>
                )}
              </button>
            </li>
          </ul>
        )}
      </div>

      <div className="email-section">
        <div className="folder_name">
          <span
            style={{
              paddingRight: "10px",
              cursor: "pointer",
              display: "inline-block",
              width: "15px",
            }}
            onClick={() => changeFolderStates("dv_wise", folderState.dv_wise)}
          >
            {folderState.dv_wise ? <ArrowDownIcon /> : <ArrowRightIcon />}
          </span>
          DV-Wise
        </div>

        {folderState.dv_wise && (
          <ul>
            <li>
              <button
                className={selectedBuyer === "Next" ? "flex_button active" : ""}
                onClick={() => toggleBuyerArea("Next")}
              >
                {selectedBuyer === "Next" ? (
                  <div className="search_button">
                    <div className="buyer_name">{selectedBuyer}</div>

                    <Select
                      className="select_wo"
                      placeholder="Search"
                      options={poNumbers}
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                    />
                  </div>
                ) : (
                  <span>Next</span>
                )}
              </button>
            </li>
            <li>
              <button
                className={
                  selectedBuyer === "Carmel" ? "flex_button active" : ""
                }
                onClick={() => toggleBuyerArea("Carmel")}
              >
                {selectedBuyer === "Carmel" ? (
                  <div className="search_button">
                    <div className="buyer_name">{selectedBuyer}</div>

                    <Select
                      className="select_wo"
                      placeholder="Search"
                      options={poNumbers}
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                    />
                  </div>
                ) : (
                  <span>Carmel</span>
                )}
              </button>
            </li>
            <li>
              <button
                className={
                  selectedBuyer === "Mango" ? "flex_button active" : ""
                }
                onClick={() => toggleBuyerArea("Mango")}
              >
                {selectedBuyer === "Mango" ? (
                  <div className="search_button">
                    <div className="buyer_name">{selectedBuyer}</div>
                    <Select
                      className="select_wo"
                      placeholder="Search"
                      options={poNumbers}
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                    />
                  </div>
                ) : (
                  <span>Mango</span>
                )}
              </button>
            </li>
          </ul>
        )}
      </div>

      <div className="email-section">
        <div className="folder_name">
          <span
            style={{
              paddingRight: "10px",
              cursor: "pointer",
              display: "inline-block",
              width: "15px",
            }}
            onClick={() =>
              changeFolderStates("category_wise", folderState.category_wise)
            }
          >
            {folderState.category_wise ? <ArrowDownIcon /> : <ArrowRightIcon />}
          </span>
          Category-Wise
        </div>

        {folderState.category_wise && <MailCategory {...props} />}
      </div>
    </div>
  );
}
