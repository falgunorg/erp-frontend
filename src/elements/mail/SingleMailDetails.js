import React, { useState, useEffect, useCallback, useRef } from "react";

import { Modal, Dropdown, DropdownButton } from "react-bootstrap";
import moment from "moment";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "services/authConfig";
// import "quill/dist/quill.snow.css";
import "quill-better-table/dist/quill-better-table.css";
import MailAvatar from "./MailAvatar";
import ReactDOM from "react-dom";
import EmailReaderWindow from "./EmailReaderWindow";
import { default as MimeParser } from "emailjs-mime-parser";
import { parseMsg } from "msg-parser";
import { mailMinimize } from "../../minimize/mailMinimize";
import SingleMailWindow from "./SingleMailWindow";

import { ZoomInIcon, ZoomOutIcon, EllipseIcon } from "../SvgIcons";
import MailRecepients from "./MailRecepients";

export default function SingleMailDetails(props) {
  //MAIL READ FUNCTION
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  // Memoize access token to avoid acquiring it unnecessarily
  const getAccessToken = useCallback(async () => {
    if (accounts.length > 0) {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });
      return response.accessToken;
    }
  }, [instance, accounts]);
  mailMinimize.setAccessTokenAndEmails(getAccessToken, props.setEmails);

  // Attachment Functionalities
  const handleDownload = (attachment) => {
    const link = document.createElement("a");
    link.href = `data:${attachment.contentType};base64,${attachment.contentBytes}`;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = async (attachment) => {
    if (attachment.name.endsWith("eml")) {
      try {
        // Decode base64 content
        const byteCharacters = atob(attachment.contentBytes);
        const byteArray = Uint8Array.from(byteCharacters, (char) =>
          char.charCodeAt(0)
        );
        const rawEmail = new TextDecoder().decode(byteArray);
        const parsedEmail = MimeParser(rawEmail);
        const emailDetails = extractEmailDetails(parsedEmail);
        console.log("EMAIL-DETAILS", emailDetails);

        // Open in new window
        const newWindow = window.open("", "_blank", "width=1080,height=500");
        if (newWindow) {
          newWindow.document.title = emailDetails.subject || "Email Preview";
          const container = newWindow.document.createElement("div");
          newWindow.document.body.appendChild(container);
          ReactDOM.render(<EmailReaderWindow item={emailDetails} />, container);
        }
      } catch (error) {
        console.error("Error processing .eml file:", error);
      }
    } else if (attachment.name.endsWith("msg")) {
      try {
        // Decode base64 content
        const byteCharacters = atob(attachment.contentBytes);
        const byteArray = Uint8Array.from(byteCharacters, (char) =>
          char.charCodeAt(0)
        );

        // Parse with msg-parser
        const parsedMsg = parseMsg(new Uint8Array(byteArray));
        const emailDetails = {
          from: parsedMsg.senderEmail,
          to: parsedMsg.recipients.map((r) => r.email),
          subject: parsedMsg.subject,
          body: parsedMsg.body,
          attachments: parsedMsg.attachments,
        };

        // Open in new window
        const newWindow = window.open("", "_blank", "width=1080,height=500");
        if (newWindow) {
          newWindow.document.title = emailDetails.subject || "Email Preview";
          const container = newWindow.document.createElement("div");
          newWindow.document.body.appendChild(container);
          ReactDOM.render(<EmailReaderWindow item={emailDetails} />, container);
        }
      } catch (error) {
        console.error("Error processing .msg file:", error);
      }
    } else {
      // Handle non-EML files
      try {
        const byteCharacters = atob(attachment.contentBytes);
        const byteArray = Uint8Array.from(byteCharacters, (char) =>
          char.charCodeAt(0)
        );
        const blob = new Blob([byteArray], { type: attachment.contentType });

        // Open the file in a new tab
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
      } catch (error) {
        console.error("Error handling non-EML attachment:", error);
      }
    }
  };

  const extractEmailDetails = (parsedEmail) => {
    const headers = parsedEmail.headers || {};
    const from = (headers.from && headers.from[0]?.value) || "";
    const toRecipients = (headers.to && headers.to[0]?.value) || [];
    const ccRecipients = (headers.cc && headers.cc[0]?.value) || [];
    const subject = (headers.subject && headers.subject[0]?.value) || "";
    const receivedDateTime = (headers && headers.date[0]?.value) || "";
    const rawEmail = parsedEmail.raw;
    const extractHtmlContent = (rawEmail) => {
      try {
        const parsedEmail = MimeParser(rawEmail);
        const traverseParts = (node) => {
          if (node.contentType && node.contentType.value === "text/html") {
            const decoder = new TextDecoder(node.charset || "utf-8");
            return decoder.decode(node.content);
          }
          if (node.childNodes && node.childNodes.length) {
            for (const child of node.childNodes) {
              const htmlContent = traverseParts(child);
              if (htmlContent) {
                return htmlContent;
              }
            }
          }
          return null;
        };
        return traverseParts(parsedEmail);
      } catch (error) {
        console.error("Error parsing email:", error);
        return null;
      }
    };
    const htmlContent = extractHtmlContent(rawEmail);
    const extractAttachments = (node, attachments = []) => {
      if (node.disposition && node.disposition.value === "attachment") {
        attachments.push({
          fileName:
            node.headers.get("content-disposition")?.params?.filename ||
            "Unnamed",
          mimeType: node.contentType.value,
          content: node.content,
        });
      }
      if (node.childNodes && node.childNodes.length) {
        node.childNodes.forEach((child) =>
          extractAttachments(child, attachments)
        );
      }
      return attachments;
    };
    const attachments = extractAttachments(parsedEmail);
    return {
      from,
      toRecipients,
      ccRecipients,
      subject,
      body: htmlContent,
      attachments,
      receivedDateTime,
    };
  };

  const handleCopy = (attachment) => {
    console.log("Copy:", attachment.name);
  };
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([]);
  const [attachments, setAttachments] = useState([]);

  const [userModal, setUserModal] = useState(false);
  const closeUserModal = () => {
    setUserModal(false);
    setUser({});
    setMessages([]);
    setAttachments([]);
  };

  const userDetails = async (recipient) => {
    closeUserModal();

    if (accounts.length === 0) return;

    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });

      const accessToken = response.accessToken;
      const headers = { Authorization: `Bearer ${accessToken}` };

      // Fetch user profile and messages
      const [profileResult, messagesResult] = await Promise.allSettled([
        fetch(
          `${process.env.REACT_APP_MICROSOFT_API_URL}/users/${recipient.address}`,
          { headers }
        ).then((res) =>
          res.ok ? res.json() : Promise.reject("Failed to fetch user profile")
        ),
        fetch(
          `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages?$search="from:${recipient.address} OR to:${recipient.address}"`,
          { headers }
        ).then((res) => res.json()),
      ]);

      // Handle profile response
      let userProfile =
        profileResult.status === "fulfilled" ? profileResult.value : {};
      if (!userProfile.displayName) userProfile.displayName = recipient.name;
      if (!userProfile.userPrincipalName)
        userProfile.userPrincipalName = recipient.address;

      setUserModal(true);
      setActiveTab("overview");

      // Fetch user photo
      let photoUrl = null;
      try {
        const photoResponse = await fetch(
          `${process.env.REACT_APP_MICROSOFT_API_URL}/users/${recipient.address}/photo/$value`,
          { headers }
        );
        if (photoResponse.ok) {
          photoUrl = photoResponse.url;
        }
      } catch (error) {
        console.warn("Failed to fetch user photo:", error);
      }

      // Filter messages with attachments
      const messages =
        messagesResult.status === "fulfilled"
          ? messagesResult.value.value || []
          : [];
      const messagesWithAttachments = messages.filter(
        (message) => message.hasAttachments
      );

      // Fetch attachments in parallel
      const attachments = await Promise.allSettled(
        messagesWithAttachments.map(async (message) => {
          try {
            const attachmentData = await fetch(
              `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${message.id}/attachments`,
              { headers }
            ).then((res) => res.json());
            return {
              subject: message.subject,
              attachments: attachmentData.value,
            };
          } catch (error) {
            console.warn(
              `Failed to fetch attachments for message ${message.id}:`,
              error
            );
            return { subject: message.subject, attachments: [] };
          }
        })
      );

      setUser({ ...userProfile, photoUrl });
      setMessages(messages);
      setAttachments(
        attachments.map((res) => (res.status === "fulfilled" ? res.value : []))
      );
    } catch (error) {
      console.error("Error acquiring token or fetching user details", error);
    }
  };

  const [activeTab, setActiveTab] = useState("overview");

  const [dropdownOpen, setDropdownOpen] = useState(null);

  const toggleDropdown = (index) => {
    setDropdownOpen((prev) => (prev === index ? null : index));
  };

  const closeDropdown = () => {
    setDropdownOpen(null);
  };
  const dropdownRefs = useRef([]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownOpen !== null &&
        dropdownRefs.current[dropdownOpen] &&
        !dropdownRefs.current[dropdownOpen].contains(event.target)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [dropdownOpen]);

  const handleZoomIn = () => {
    if (props.mailDetailsWidth < 100) {
      props.setMailDetailsWidth(props.mailDetailsWidth + 5); // Increase email-detail width by 10%
      if (props.mailDetailsWidth > 80) {
        props.setMailListWidth(0);
      } else {
        props.setMailListWidth(props.mailListWidth - 5);
      }
    }
  };
  // Function to handle zoom out (decrease email-detail width)
  const handleZoomOut = () => {
    if (props.mailDetailsWidth > 40) {
      props.setMailDetailsWidth(props.mailDetailsWidth - 5); // Increase email-detail width by 10%
      props.setMailListWidth(props.mailListWidth + 5); // Decrease inbox width by 10%
    }
  };

  const [moreMenu, setMoreMenu] = useState(false);
  const moreToggle = () => {
    setMoreMenu(!moreMenu);
  };

  const handleDoubleClick = (item) => {
    const newWindow = window.open("", "_blank", "width=1080,height=500");

    if (newWindow) {
      newWindow.document.title = item.subject;
      // Create a container in the new window
      const container = newWindow.document.createElement("div");
      newWindow.document.body.appendChild(container);
      // Render an empty component initially
      ReactDOM.render(
        <SingleMailWindow item={props.selectedMail} />,
        container
      );

      // Delay postMessage to ensure the new window is ready
      setTimeout(() => {
        newWindow.postMessage(item, "*");
      }, 500);
    }
  };

  return (
    <>
      {props.selectedMail.id && (
        <>
          <div className="mail_body_area">
            <div className="mail_header">
              <div className="users_area">
                <MailAvatar
                  name={
                    props.selectedMail.from?.emailAddress?.name ||
                    props.selectedMail.from?.emailAddress?.address
                  }
                  picture={props.selectedMail.senderImage}
                  size={32}
                  onClick={() =>
                    userDetails(props.selectedMail.from?.emailAddress)
                  }
                />

                <div style={{ width: "100%" }} className="user_details">
                  <div
                    className="username"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      userDetails(props.selectedMail.from?.emailAddress)
                    }
                  >
                    {props.selectedMail.from?.emailAddress?.name ||
                      props.selectedMail.from?.emailAddress?.address}
                  </div>

                  <MailRecepients
                    label="To"
                    recipients={props.selectedMail.toRecipients}
                    userDetails={userDetails}
                    props={props}
                  />
                  <MailRecepients
                    label="Cc"
                    recipients={props.selectedMail.ccRecipients}
                    userDetails={userDetails}
                    props={props}
                  />
                </div>
              </div>
              <div>
                {props.selectedMail?.attachments &&
                  props.selectedMail.attachments.length > 0 && (
                    <div className="attachments">
                      {props.selectedMail.attachments
                        .filter((attachment) => !attachment.isInline)
                        .map((attachment, index) => (
                          <div
                            key={index}
                            title={attachment.name}
                            className="single_attachment"
                          >
                            <button onClick={() => handlePreview(attachment)}>
                              <span>
                                {attachment.name.endsWith("png") ? (
                                  <i className="fa fa-image"></i>
                                ) : attachment.name.endsWith("jpg") ||
                                  attachment.name.endsWith("jpeg") ? (
                                  <i className="fa fa-file-image"></i>
                                ) : attachment.name.endsWith("pdf") ? (
                                  <i className="fa fa-file-pdf"></i>
                                ) : attachment.name.endsWith("doc") ||
                                  attachment.name.endsWith("docx") ? (
                                  <i className="fa fa-file-word"></i>
                                ) : attachment.name.endsWith("xls") ||
                                  attachment.name.endsWith("xlsx") ? (
                                  <i className="fa fa-file-excel"></i>
                                ) : attachment.name.endsWith("ppt") ||
                                  attachment.name.endsWith("pptx") ? (
                                  <i className="fa fa-file-powerpoint"></i>
                                ) : (
                                  <i className="fa fa-file"></i>
                                )}
                              </span>
                              <span>
                                {attachment.name.length > 11
                                  ? attachment.name.substring(0, 9) + ".."
                                  : attachment.name}
                              </span>
                            </button>
                            <div
                              ref={(el) => (dropdownRefs.current[index] = el)}
                              className="attatchment_dropdown"
                            >
                              <i
                                style={{ cursor: "pointer" }}
                                onClick={() => toggleDropdown(index)}
                                className="fa fa-angle-down"
                              ></i>
                              {dropdownOpen === index && (
                                <div className="attatchment_dropdown_menu">
                                  <button
                                    className="dropdown-item"
                                    onClick={() => {
                                      handlePreview(attachment);
                                      closeDropdown();
                                    }}
                                  >
                                    Preview
                                  </button>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => {
                                      handleCopy(attachment);
                                      closeDropdown();
                                    }}
                                  >
                                    Copy
                                  </button>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => {
                                      handleDownload(attachment);
                                      closeDropdown();
                                    }}
                                  >
                                    Download
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
              </div>

              {props.replyble ? (
                <div className="extranal_btns">
                  <div className="button_grups">
                    <button
                      className={props.mailDetailsWidth > 50.3 ? "active" : ""}
                      onClick={handleZoomIn}
                    >
                      <ZoomInIcon />
                    </button>
                    <button
                      className={props.mailDetailsWidth < 50.3 ? "active" : ""}
                      onClick={handleZoomOut}
                    >
                      <ZoomOutIcon />
                    </button>

                    {/* <button
                      onClick={() => {
                        props.setIsComposing(true);
                        props.setMailSendType("Reply");
                      }}
                    >
                      Reply
                    </button>
                    <button
                      onClick={() => {
                        props.setIsComposing(true);
                        props.setMailSendType("ReplyAll");
                      }}
                    >
                      Reply All
                    </button>
                    <button
                      onClick={() => {
                        props.setIsComposing(true);
                        props.setMailSendType("Forward");
                      }}
                    >
                      Forward
                    </button> */}

                    <Dropdown className="moreToggleButton" onClick={moreToggle}>
                      <Dropdown.Toggle
                        id="dropdown-button-dark-example1"
                        variant="secondary"
                      >
                        <EllipseIcon />
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="non_printing_area">
                        <Dropdown.Item
                          onClick={() =>
                            mailMinimize.handleDelete(props.mailID)
                          }
                        >
                          Delete
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => window.print()}>
                          Print
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => mailMinimize.markAsRead(props.mailID)}
                        >
                          Read
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            mailMinimize.markAsUnread(props.mailID)
                          }
                        >
                          Unread
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleDoubleClick(props.selectedMail)}
                        >
                          View
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <div className="datetime_and_important">
                    {props.selectedMail.flag?.flagStatus === "flagged" && (
                      <span className="flagged_icon me-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="13"
                          viewBox="0 0 12 13"
                        >
                          <path
                            id="Polygon_184"
                            data-name="Polygon 184"
                            d="M5.548,2.965a1,1,0,0,1,1.9,0L8.587,6.5a1,1,0,0,0,.178.328l2.44,2.981a1,1,0,0,1-.979,1.612L6.7,10.683a1,1,0,0,0-.41,0l-3.522.737a1,1,0,0,1-.979-1.612l2.44-2.981A1,1,0,0,0,4.413,6.5Z"
                            transform="translate(12) rotate(90)"
                            fill="#ff9191"
                          />
                        </svg>
                      </span>
                    )}

                    {props.selectedMail.importance === "high" && (
                      <span className="flagged_icon me-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="5"
                          height="16"
                          viewBox="0 0 5 16"
                        >
                          <text
                            id="_"
                            data-name="!"
                            transform="translate(0 13)"
                            fill="rgba(255,74,74,0.6)"
                            fontSize="14"
                            fontFamily="Arial-BoldMT, Arial"
                            fontWeight="700"
                          >
                            <tspan x="0" y="0">
                              !
                            </tspan>
                          </text>
                        </svg>
                      </span>
                    )}

                    <span className="dateTime">
                      {moment(props.selectedMail?.receivedDateTime).format(
                        "ddd M/D/YYYY HH:mm"
                      )}
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: "12px" }}>
                  {moment(props.receivedDateTime).format(
                    "MMM D, YYYY [at] h:mm A"
                  )}
                </div>
              )}
            </div>

            <div
              style={{
                width: "100%",
                overflowY: "hidden",
                paddingLeft: "42px",
              }}
              className="email_textarea_body"
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: props.selectedMail.body?.content,
                }}
              />
            </div>
          </div>

          <Modal size="lg" show={userModal} onHide={closeUserModal}>
            <Modal.Header closeButton>
              <Modal.Title>
                <div className="d-flex gap_10 align-items-center">
                  <span>
                    <MailAvatar
                      name={user.displayName}
                      picture={user.photoUrl}
                      size={100}
                    />
                  </span>
                  <span>{user.displayName}</span>
                </div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="modal-tabs">
                <button
                  className={`tab ${activeTab === "overview" ? "active" : ""}`}
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </button>
                <button
                  className={`tab ${activeTab === "files" ? "active" : ""}`}
                  onClick={() => setActiveTab("files")}
                >
                  Files
                </button>
                <button
                  className={`tab ${activeTab === "messages" ? "active" : ""}`}
                  onClick={() => setActiveTab("messages")}
                >
                  Messages
                </button>
              </div>

              {activeTab === "overview" && (
                <div className="overview-content">
                  <br />
                  <div className="availability">
                    <p>Available • Free on (Not Set)</p>
                    <p>Work hours: (Not Set)</p>
                  </div>
                  <h6>Contact Information</h6>
                  <div className="availability">
                    <a href={`mailto:${user.userPrincipalName}`}>
                      <i className="fa fa-envelope"></i>{" "}
                      {user.userPrincipalName}
                    </a>
                  </div>
                </div>
              )}

              {activeTab === "files" && (
                <div
                  style={{
                    maxHeight: "600px",
                    overflowY: "auto",
                  }}
                  className="linkedin-info"
                >
                  <br />
                  <div className="list-group list-group-flush">
                    {attachments &&
                      attachments
                        .filter((item) => item.attachments)
                        .map((item, index) => (
                          <div key={index} className="list-group-item">
                            {item.attachments
                              .filter((attachment) => !attachment.isInline)
                              .map((attachment, attachmentIndex) => (
                                <a
                                  className="text-muted"
                                  style={{
                                    textDecoration: "none",
                                    color: "#010101",
                                    paddingRight: "20px",
                                  }}
                                  key={attachmentIndex}
                                  href={`data:${attachment.contentType};base64,${attachment.contentBytes}`}
                                  download={attachment.name}
                                >
                                  {(() => {
                                    const iconStyle = {
                                      fontSize: "30px",
                                      marginRight: "5px",
                                    };
                                    if (attachment.name.endsWith("png")) {
                                      return (
                                        <i
                                          style={iconStyle}
                                          className="fa fa-image"
                                        ></i>
                                      );
                                    } else if (
                                      ["jpg", "jpeg"].some((ext) =>
                                        attachment.name.endsWith(ext)
                                      )
                                    ) {
                                      return (
                                        <i
                                          style={iconStyle}
                                          className="fa fa-file-image"
                                        ></i>
                                      );
                                    } else if (
                                      attachment.name.endsWith("pdf")
                                    ) {
                                      return (
                                        <i
                                          style={iconStyle}
                                          className="fa fa-file-pdf"
                                        ></i>
                                      );
                                    } else if (
                                      ["doc", "docx"].some((ext) =>
                                        attachment.name.endsWith(ext)
                                      )
                                    ) {
                                      return (
                                        <i
                                          style={iconStyle}
                                          className="fa fa-file-word"
                                        ></i>
                                      );
                                    } else if (
                                      ["xls", "xlsx"].some((ext) =>
                                        attachment.name.endsWith(ext)
                                      )
                                    ) {
                                      return (
                                        <i
                                          style={iconStyle}
                                          className="fa fa-file-excel"
                                        ></i>
                                      );
                                    } else if (
                                      ["ppt", "pptx"].some((ext) =>
                                        attachment.name.endsWith(ext)
                                      )
                                    ) {
                                      return (
                                        <i
                                          style={iconStyle}
                                          className="fa fa-file-powerpoint"
                                        ></i>
                                      );
                                    } else {
                                      return (
                                        <i
                                          style={iconStyle}
                                          className="fa fa-file"
                                        ></i>
                                      );
                                    }
                                  })()}
                                  <span style={{ fontSize: "20px" }}>
                                    {" "}
                                    {attachment.name}
                                  </span>
                                </a>
                              ))}
                          </div>
                        ))}
                  </div>
                </div>
              )}
              {activeTab === "messages" && (
                <div
                  style={{
                    maxHeight: "600px",
                    overflowY: "auto",
                  }}
                  className="messages"
                >
                  {Array.isArray(messages) && messages.length > 0 ? (
                    messages.map((item, index) => (
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          props.setMailID(item.id);
                          setUserModal(false);
                        }}
                        key={index}
                        className="card p-2"
                      >
                        <div>{item.sender?.emailAddress?.name}</div>
                        <h6>{item.subject ? item.subject : "No Subject"}</h6>
                        <div
                          style={{ fontSize: "11px" }}
                          className="text-muted"
                        >
                          {item.receivedDateTime
                            ? moment(item.receivedDateTime).format("lll")
                            : "Date not available"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <li>No emails found or failed to load emails</li>
                  )}
                </div>
              )}
            </Modal.Body>
          </Modal>
        </>
      )}
    </>
  );
}
