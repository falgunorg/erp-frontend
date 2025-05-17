import React, { useState, useEffect, useRef } from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "services/authConfig";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import iconSettingsW from "../../assets/images/icons/Settings-W.png";
import iconSettingsO from "../../assets/images/icons/Settings-O.png";

import { FilterIcon } from "../SvgIcons";

export default function MailSearch(props) {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const [folders, setFolders] = useState([]);
  const [contacts, setContacts] = useState([]);
  const initialFolderSet = useRef(false);

  // Email state variables
  const [fromEmails, setFromEmails] = useState([]);
  const [toEmails, setToEmails] = useState([]);
  const [ccEmails, setCcEmails] = useState([]);

  const handleFromEmailChange = (event, value) => {
    setFromEmails(value);
  };

  const handleToEmailChange = (event, value) => {
    setToEmails(value);
  };

  const handleCcEmailChange = (event, value) => {
    setCcEmails(value);
  };

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
    const getMailFolders = async () => {
      if (accounts.length > 0) {
        try {
          const response = await instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0],
          });

          const accessToken = response.accessToken;

          const foldersResponse = await fetch(
            `${process.env.REACT_APP_MICROSOFT_API_URL}/me/mailFolders?$top=50`,
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

            // Sort the folders based on the predefined order
            const sortedFolders = data.value.sort((a, b) => {
              const indexA = folderOrder.indexOf(a.displayName);
              const indexB = folderOrder.indexOf(b.displayName);

              if (indexA === -1) return 1;
              if (indexB === -1) return -1;
              return indexA - indexB;
            });

            setFolders(data.value);

            // Set the initial folder only if it hasn't been set yet
            if (!initialFolderSet.current) {
              const inboxFolder = data.value.find(
                (folder) => folder.displayName === "Inbox"
              );
              if (inboxFolder) {
                props.setMailFolder({
                  folderName: inboxFolder.displayName,
                  folderId: inboxFolder.id,
                });
                initialFolderSet.current = true; // Mark the initial folder as set
              }
            }
          } else {
            console.error("Failed to fetch mail folders");
          }

          //contact

          let allUsers = []; // Array to hold all users
          let nextLink =
            `${process.env.REACT_APP_MICROSOFT_API_URL}/users?$select=displayName,mail`; // Initial request URL

          // Loop to fetch all pages of users
          do {
            const contactResponse = await fetch(nextLink, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            });

            if (contactResponse.ok) {
              const data = await contactResponse.json();
              allUsers = allUsers.concat(data.value); // Add current page of users to the list
              nextLink = data["@odata.nextLink"]; // Get the next link for pagination
            } else {
              console.error(
                "Failed to fetch contacts:",
                await contactResponse.json()
              );
              nextLink = null; // Stop fetching if there's an error
            }
          } while (nextLink); // Continue while there's a next link

          setContacts(allUsers); // Set all users to the state
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

  //DesignREF
  const containerRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  // Form state
  const [formData, setFormData] = useState({
    folderId: "",
    subject: "",
    keywords: "",
    dateFrom: "",
    dateTo: "",
    isRead: true,
    attachments: false,
  });

  // Handle general form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle search action
  const handleSearch = (e) => {
    e.preventDefault();
    const searchCriteria = {
      ...formData,
      fromEmails,
      toEmails,
      ccEmails,
    };

    props.setMailSearchData(searchCriteria);
    console.log(searchCriteria);

    setShowForm(false);
    // Implement your search logic here
  };

  // Handle clearing filters
  const handleClearFilters = () => {
    setFormData({
      folderId: "",
      subject: "",
      keywords: "",
      dateFrom: "",
      dateTo: "",
      isRead: undefined,
      attachments: false,
    });
    setFromEmails([]);
    setToEmails([]);
    setCcEmails([]);

    const searchCriteria = {
      ...formData,
      fromEmails,
      toEmails,
      ccEmails,
    };

    props.setMailSearchData(searchCriteria);
    setShowForm(false);
  };

  const autocompleteRef = useRef(null);
  const popperRef = useRef(null); // New ref for Autocomplete popper

  // Event listener to handle outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If click happens outside of both search-container and Autocomplete, hide the form
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        (!autocompleteRef.current ||
          !autocompleteRef.current.contains(event.target)) &&
        (!popperRef.current || !popperRef.current.contains(event.target))
      ) {
        setShowForm(false);
      }
    };

    // Add the event listener when form is open
    if (showForm) {
      document.addEventListener("mouseup", handleClickOutside);
    }

    // Clean up event listener when form is hidden or component unmounts
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [showForm]);

  return (
    <div
      className={
        showForm ? "mail_searching bottom_radious_none" : "mail_searching"
      }
    >
      <form onSubmit={handleSearch}>
        <div className="mail_search_area">
          <span className="search_icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15.207"
              height="14.78"
              viewBox="0 0 15.207 14.78"
            >
              <g
                id="Group_18"
                data-name="Group 18"
                transform="translate(-1466 -34)"
              >
                <g
                  id="Ellipse_1"
                  data-name="Ellipse 1"
                  transform="translate(1466 34)"
                  fill="none"
                  stroke="#707070"
                  strokeWidth="1"
                >
                  <circle cx="5.885" cy="5.885" r="5.885" stroke="none" />
                  <circle cx="5.885" cy="5.885" r="5.385" fill="none" />
                </g>
              </g>
              <line
                id="Line_189"
                data-name="Line 189"
                x2="4.393"
                y2="4.062"
                transform="translate(10.107 10.012)"
                fill="none"
                stroke="#707070"
                strokeLinecap="round"
                strokeWidth="1"
              />
            </svg>
          </span>
          <span
            style={{ cursor: "pointer" }}
            onClick={toggleForm}
            className="filter_icon"
          >
            <FilterIcon />
          </span>
          <input
            type="text"
            className="form-control border-0 margin_bottom_0 inside_searchbar no_boxshadow"
            placeholder="Search"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
          />
        </div>
        {showForm && (
          <div className="search-container p-2" ref={containerRef}>
            <div className="row form-group">
              <div className="col-2">
                <label htmlFor="folderId">Folder</label>
              </div>
              <div className="col-10">
                <select
                  id="folderId"
                  name="folderId"
                  className="form-control"
                  value={formData.folderId}
                  onChange={(e) => {
                    const selectedFolder = folders.find(
                      (folder) => folder.id === e.target.value
                    );
                    if (selectedFolder) {
                      props.setMailFolder({
                        folderName: selectedFolder.displayName,
                        folderId: selectedFolder.id,
                      });
                    }
                    handleInputChange(e); // Call your input change handler to update the form data
                  }}
                >
                  {folders.length > 0 ? (
                    folders.map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.displayName}
                      </option>
                    ))
                  ) : (
                    <p>No mail folders found.</p>
                  )}
                </select>
              </div>
            </div>

            <div className="row form-group to_cc">
              <div className="col-2">
                <label htmlFor="from">From</label>
              </div>
              <div className="col-10">
                <div className="to_field">
                  <Autocomplete
                    multiple
                    freeSolo
                    options={contacts
                      .map((contact) => contact.mail || contact.displayName)
                      .filter((option) => !fromEmails.includes(option))}
                    value={fromEmails}
                    onChange={handleFromEmailChange}
                    PopperComponent={(popperProps) => {
                      return (
                        <div {...popperProps} ref={popperRef} /> // Capture the popper with a ref
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder=""
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="row form-group to_cc">
              <div className="col-2">
                <label htmlFor="to">To</label>
              </div>
              <div className="col-10">
                <div className="to_field">
                  <Autocomplete
                    multiple
                    freeSolo
                    options={contacts
                      .map((contact) => contact.mail || contact.displayName)
                      .filter((option) => !toEmails.includes(option))}
                    value={toEmails}
                    onChange={handleToEmailChange}
                    PopperComponent={(popperProps) => {
                      return <div {...popperProps} ref={popperRef} />;
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder=""
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="row form-group to_cc" ref={autocompleteRef}>
              <div className="col-2">
                <label htmlFor="cc">CC</label>
              </div>
              <div className="col-10">
                <div className="to_field">
                  <Autocomplete
                    multiple
                    freeSolo
                    options={contacts
                      .map((contact) => contact.mail || contact.displayName)
                      .filter((option) => !ccEmails.includes(option))}
                    value={ccEmails}
                    onChange={handleCcEmailChange}
                    PopperComponent={(popperProps) => {
                      return <div {...popperProps} ref={popperRef} />;
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder=""
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="row form-group">
              <div className="col-2">
                <label htmlFor="subject">Subject</label>
              </div>
              <div className="col-10">
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="form-control"
                  value={formData.subject}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="row form-group">
              <div className="col-2">
                <label htmlFor="keywords">Work Order</label>
              </div>
              <div className="col-10">
                <input
                  type="text"
                  id="keywords"
                  name="keywords"
                  className="form-control"
                  value={formData.keywords}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="row form-group">
              <div className="col-2">
                <label>Date</label>
              </div>
              <div className="col-10">
                <div className="d-flex">
                  <input
                    type="date"
                    name="dateFrom"
                    className="form-control me-2"
                    value={formData.dateFrom}
                    onChange={handleInputChange}
                  />
                  <input
                    type="date"
                    name="dateTo"
                    className="form-control"
                    value={formData.dateTo}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="row form-group">
              <div className="col-2">
                <label htmlFor="isRead">Read status</label>
              </div>
              <div className="col-10">
                <select
                  id="isRead"
                  name="isRead"
                  className="form-control"
                  value={formData.isRead}
                  onChange={handleInputChange}
                >
                  <option value="">All</option>
                  <option value="true">Read</option>
                  <option value="false">Unread</option>
                </select>
              </div>
            </div>
            <div className="row form-group">
              <div className="col-2">
                <label className="form-check-label" htmlFor="attachments">
                  Attachments
                </label>
              </div>
              <div className="col-10">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="attachments"
                  name="attachments"
                  checked={formData.attachments}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="button-group d-flex justify-content-end">
              <button
                type="submit"
                className="btn btn-warning bg-falgun text-white me-2"
              >
                Search
              </button>
              <button
                type="reset"
                className="btn btn-outline-danger"
                onClick={handleClearFilters}
              >
                Clear filters
              </button>
            </div>
            <br />
          </div>
        )}
      </form>
    </div>
  );
}
