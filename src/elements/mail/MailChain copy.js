import React, { useState, useRef, useEffect } from "react";
import { Dropdown, DropdownButton, Modal, Button } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import moment from "moment";
import MailAvatar from "./MailAvatar";
import ReactDOM from "react-dom";
import EmailReaderWindow from "./EmailReaderWindow";
import { default as MimeParser } from "emailjs-mime-parser";
import { parseMsg } from "msg-parser";

import MailRecepients from "./MailRecepients";

export default function MailChain(props) {
  const [activeKey, setActiveKey] = useState(null);
  const handleAccordionToggle = (eventKey) => {
    setActiveKey(eventKey === activeKey ? null : eventKey);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredEmails, setHoveredEmails] = useState([]);

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

  const handleClick = (emails) => {
    setHoveredEmails(emails);
    setIsModalOpen(true);
  };

  const renderEmails = (emails) => {
    if (!emails || emails.trim() === "") {
      return null;
    }

    const emailArray = emails.split(", ");
    return (
      <>
        {emailArray.slice(0, 2).map((email, index) => (
          <span key={index}>
            {email}
            {index < 1 && emailArray.length > 2 ? ", " : ""}
          </span>
        ))}
        {emailArray.length > 2 && (
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => handleClick(emailArray)}
          >
            {" ..."}more
          </span>
        )}
      </>
    );
  };

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

  console.log("chainMessages", props.chainMessages);
  return (
    <div className="mailChain non_printing_area">
      <Accordion
        className="mailchain_accordion mail_body_area without_box_shadow"
        defaultActiveKey={props.mailID}
      >
        {props.chainMessages.length > 0 &&
          props.chainMessages.map((message, index) => (
            <Accordion.Item eventKey={message.id} key={message.id}>
              <Accordion.Header
                onClick={() => handleAccordionToggle(message.id)}
              >
                <div className="mail_header d-flex justify-content-between">
                  <div className="users_area">
                    <MailAvatar
                      name={message.from?.emailAddress?.name}
                      picture={message.senderImage}
                      size={32}
                    />

                    <div className="user_details">
                      <div className="username">
                        {message.from?.emailAddress?.name || "Unknown"}
                      </div>
                      {activeKey === message.id ? (
                        ""
                      ) : (
                        <div
                          className="msg_body_trunconate"
                          dangerouslySetInnerHTML={{
                            __html: message.body?.content || "",
                          }}
                        />
                      )}

                      {activeKey === message.id && (
                        <>
                          <MailRecepients
                            label="To"
                            recipients={message.toRecipients}
                            // userDetails={userDetails}
                            props={props}
                          />


                          {message.ccRecipients?.length > 0 && (
                            <MailRecepients
                              label="Cc"
                              recipients={message.ccRecipients}
                              props={props}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {activeKey === message.id ? (
                    <div className="extranal_btns">
                      <div className="button_grups">
                        <button
                          onClick={() => {
                            props.setMailID(message.id);
                            props.setSelectedMail(message);

                            setTimeout(() => {
                              props.setIsComposing(true);
                              props.setMailSendType("Reply");
                            }, 500);
                          }}
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => {
                            props.setMailID(message.id);
                            props.setSelectedMail(message);

                            setTimeout(() => {
                              props.setIsComposing(true);
                              props.setMailSendType("ReplyAll");
                            }, 500);
                          }}
                        >
                          Reply All
                        </button>
                        <button
                          onClick={() => {
                            props.setMailID(message.id);
                            props.setSelectedMail(message);

                            setTimeout(() => {
                              props.setIsComposing(true);
                              props.setMailSendType("Forward");
                            }, 500);
                          }}
                        >
                          Forward
                        </button>
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          textAlign: "right",
                          paddingTop: "10px",
                          color: "#000",
                          fontWeight: "semi-bold",
                        }}
                        className="mail_datetime"
                      >
                        <svg
                          class="me-2"
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
                          ></path>
                        </svg>
                        {moment
                          .utc(message.receivedDateTime)
                          .local()
                          .format("ddd M/D/YYYY HH:mm")}
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#000",
                        fontWeight: "semi-bold",
                      }}
                      className="mail_datetime"
                    >
                      <svg
                        class="me-2"
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
                        ></path>
                      </svg>
                      {moment
                        .utc(message.receivedDateTime)
                        .local()
                        .format("ddd M/D/YYYY HH:mm")}
                    </div>
                  )}
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <div
                  className="mail_body_area without_box_shadow"
                  style={{ paddingLeft: "54px" }}
                >
                  {message?.attachments && message.attachments.length > 0 && (
                    <div className="attachments_onChain">
                      {message.attachments
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

                          // <div key={index} className="single_attachment">
                          //   <a
                          //     href={`data:${attachment.contentType};base64,${attachment.contentBytes}`}
                          //     download={attachment.name}
                          //   >
                          //     {attachment.name.endsWith("png") ? (
                          //       <i
                          //         style={{
                          //           fontSize: "14px",
                          //           marginRight: "5px",
                          //         }}
                          //         className="fa fa-image"
                          //       ></i>
                          //     ) : attachment.name.endsWith("jpg") ||
                          //       attachment.name.endsWith("jpeg") ? (
                          //       <i
                          //         style={{
                          //           fontSize: "14px",
                          //           marginRight: "5px",
                          //         }}
                          //         className="fa fa-file-image"
                          //       ></i>
                          //     ) : attachment.name.endsWith("pdf") ? (
                          //       <i
                          //         style={{
                          //           fontSize: "14px",
                          //           marginRight: "5px",
                          //         }}
                          //         className="fa fa-file-pdf"
                          //       ></i>
                          //     ) : attachment.name.endsWith("doc") ||
                          //       attachment.name.endsWith("docx") ? (
                          //       <i
                          //         style={{
                          //           fontSize: "14px",
                          //           marginRight: "5px",
                          //         }}
                          //         className="fa fa-file-word"
                          //       ></i>
                          //     ) : attachment.name.endsWith("xls") ||
                          //       attachment.name.endsWith("xlsx") ? (
                          //       <i
                          //         style={{
                          //           fontSize: "14px",
                          //           marginRight: "5px",
                          //         }}
                          //         className="fa fa-file-excel"
                          //       ></i>
                          //     ) : attachment.name.endsWith("ppt") ||
                          //       attachment.name.endsWith("pptx") ? (
                          //       <i
                          //         style={{
                          //           fontSize: "14px",
                          //           marginRight: "5px",
                          //         }}
                          //         className="fa fa-file-powerpoint"
                          //       ></i>
                          //     ) : (
                          //       <i
                          //         style={{
                          //           fontSize: "14px",
                          //           marginRight: "5px",
                          //         }}
                          //         className="fa fa-file"
                          //       ></i>
                          //     )}
                          //     {attachment.name}
                          //   </a>
                          //   <DropdownButton
                          //     id={`dropdown-${index}`}
                          //     title={<i className="fa fa-angle-down" />}
                          //     variant="secondary"
                          //     className="dropdown_toggle"
                          //   >
                          //     <Dropdown.Item
                          //       onClick={() => handlePreview(attachment)}
                          //     >
                          //       Preview
                          //     </Dropdown.Item>
                          //     <Dropdown.Item
                          //       onClick={() => handleSaveToOneDrive(attachment)}
                          //     >
                          //       Save to OneDrive
                          //     </Dropdown.Item>
                          //     <Dropdown.Item
                          //       onClick={() => handleCopy(attachment)}
                          //     >
                          //       Copy
                          //     </Dropdown.Item>
                          //     <Dropdown.Item
                          //       onClick={() => handleDownload(attachment)}
                          //     >
                          //       Download
                          //     </Dropdown.Item>
                          //   </DropdownButton>
                          // </div>
                        ))}
                    </div>
                  )}
                  <div
                    style={{
                      width: "100%",
                      overflowY: "hidden",
                    }}
                    className="email_textarea_body"
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: message.body?.content || "",
                      }}
                    />
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
      </Accordion>
      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>All Emails</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {hoveredEmails.map((email, index) => (
            <div key={index}>{email}</div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
