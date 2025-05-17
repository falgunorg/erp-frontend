import React, { useState, useEffect, useRef } from "react";
import Spinner from "../Spinner";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "services/authConfig";
import SingleMailDetails from "./SingleMailDetails";
import MailChain from "./MailChain";
import {
  AttatchmentIcon,
  ImportanceIcon,
  MailExpandIcon,
  MailCollapseIcon,
} from "../SvgIcons";

export default function MailDetails(props) {
  const { instance, accounts } = useMsal();
  const [spinner, setSpinner] = useState(false);
  const [abortController, setAbortController] = useState(null);

  useEffect(() => {
    if (!accounts.length || !props.mailID) return;

    // Cleanup existing fetch requests on email change
    if (abortController) {
      abortController.abort();
    }

    const newAbortController = new AbortController();
    setAbortController(newAbortController);
    props.setChainMessages([]);

    fetchEmailDetails(props.mailID, newAbortController.signal);

    return () => {
      if (newAbortController) newAbortController.abort();
    };
  }, [accounts, props.mailID]);

  const fetchEmailDetails = async (mailID, signal) => {
    try {
      const accessToken = await getAccessToken();
      const email = props.emails.find((email) => email.id === mailID);

      if (!email) throw new Error("Email not found.");

      const [subject, workOrder] = parseSubject(email.subject);

      // Set basic email data first for immediate display
      props.setSelectedMail({
        ...email,
        subject,
        workOrder,
        body: { content: email.body.content || "" },
        attachments: [],
        senderImage: null,
      });

      const senderImage = await getSenderImage(
        email.from.emailAddress.address,
        accessToken,
        signal
      );
      const attachments = await fetchAttachments(mailID, accessToken, signal);
      const updatedBody = insertInlineAttachments(
        email.body.content,
        attachments
      );

      props.setSelectedMail((prev) =>
        prev.id === mailID
          ? {
              ...email,
              subject,
              workOrder,

              senderImage,
              body: { content: updatedBody },
              attachments,
            }
          : prev
      );

      if (email.subject) {
        const chainMessages = await fetchMailChain(
          email.subject,
          mailID,
          accessToken,
          signal
        );
        props.setChainMessages(chainMessages);
      }
    } catch (error) {
      if (error.name !== "AbortError")
        console.error("Error fetching email details:", error);
    }
  };

  const getAccessToken = async () => {
    const response = await instance.acquireTokenSilent({
      ...loginRequest,
      account: accounts[0],
    });
    return response.accessToken;
  };

  const parseSubject = (subject = "") => {
    const [mainSubject, workOrder] = subject.split("=>");
    return [mainSubject || "No Subject", workOrder || "WO#"];
  };

  const getSenderImage = async (emailAddress, accessToken, signal) => {
    try {
      let response;

      if (accounts[0].username === emailAddress) {
        response = await fetch(
          `${process.env.REACT_APP_MICROSOFT_API_URL}/me/photo/$value`,
          { headers: { Authorization: `Bearer ${accessToken}` }, signal }
        );
      } else {
        response = await fetch(
          `${process.env.REACT_APP_MICROSOFT_API_URL}/users/${emailAddress}/photo/$value`,
          { headers: { Authorization: `Bearer ${accessToken}` }, signal }
        );
      }

      return response.ok ? response.url : null;
    } catch (error) {
      console.error("Error fetching sender image:", error);
      return null;
    }
  };

  const fetchAttachments = async (mailID, accessToken, signal) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${mailID}/attachments`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          signal,
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data.value || [];
      }
    } catch (error) {
      console.error(`Error fetching attachments for mailID: ${mailID}`, error);
    }
    return [];
  };

  const insertInlineAttachments = (bodyContent, attachments) => {
    let updatedBody = bodyContent;
    attachments
      .filter((attachment) => attachment.isInline)
      .forEach((attachment) => {
        const cid = attachment.contentId;
        const base64Image = `data:${attachment.contentType};base64,${attachment.contentBytes}`;
        updatedBody = updatedBody.replace(`cid:${cid}`, base64Image);
      });
    return updatedBody;
  };

  const fetchMailChain = async (subject, mailID, accessToken, signal) => {
    try {
      const escapedSubject = encodeURIComponent(subject.replace(/'/g, "''"));
      const prefixes = [
        `startswith(subject,'${escapedSubject}')`,
        `startswith(subject,'RE: ${escapedSubject}')`,
        `startswith(subject,'FW: ${escapedSubject}')`,
      ];
      const filterQuery = prefixes.join(" or ");
      const response = await fetch(
        `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages?$filter=${filterQuery}&$top=20`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          signal,
        }
      );

      if (response.ok) {
        const data = await response.json();
        const chainMessages = await Promise.all(
          data.value
            .filter((message) => message.id !== mailID)
            .map(async (message) => {
              const senderImage = await getSenderImage(
                message.from.emailAddress.address,
                accessToken,
                signal
              );
              const attachments = await fetchAttachments(
                message.id,
                accessToken,
                signal
              );
              const updatedBody = insertInlineAttachments(
                message.body.content,
                attachments
              );
              return {
                ...message,
                senderImage,
                body: { content: updatedBody },
                attachments,
              };
            })
        );

        return chainMessages.sort(
          (a, b) => new Date(b.receivedDateTime) - new Date(a.receivedDateTime)
        );
      }
    } catch (error) {
      console.error("Error fetching mail chain:", error);
    }
    return [];
  };

  const handleToggle = () => {
    if (props.mailDetailsWidth < 100) {
      props.setMailDetailsWidth(100);
      props.setMailListWidth(0);
    } else {
      props.setMailDetailsWidth(50.3);
      props.setMailListWidth(38.27);
    }
    props.setExtendDetailsToogle(!props.extendDetailsToggle);
  };

  //CONTEXT MENU
  const [contextMenu, setContextMenu] = React.useState(null);
  const contextMenuRef = React.useRef();

  const handleContextMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;
    setContextMenu({
      mouseX: Math.min(clientX, innerWidth - 150),
      mouseY: Math.min(clientY, innerHeight - 200),
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target)
      ) {
        handleCloseContextMenu();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const [poNumbers, setPoNumbers] = useState([
    ...Array.from(
      { length: 100 },
      (_, i) => `PO${String(i + 1).padStart(3, "0")}`
    ),
  ]);

  const handleMenuClick = (action) => {
    alert(action);
    setContextMenu(null);
  };

  const mailBodyRef = useRef(null);

  useEffect(() => {
    if (mailBodyRef.current) {
      mailBodyRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [props.selectedMail.id]);

  return (
    <>
      {spinner && <Spinner />}
      {props.selectedMail.id && (
        <div ref={mailBodyRef} className="email-content">
          <div className="write_email_subject">
            <div
              title={props.selectedMail.subject}
              className="subject-container"
            >
              <div
                title={props.selectedMail.subject}
                className={
                  props.selectedMail.subject.length > 70
                    ? "subject small_subject"
                    : "subject"
                }
              >
                {props.selectedMail.subject}
              </div>
            </div>
            <div style={{ position: "relative" }} className="workOrder">
              WO: {props.selectedMail.workOrder}
              <small style={{ fontSize: "9px", display: "block" }}>
                PO001{" "}
                <a
                  href="#"
                  style={{ color: "#ef9a3e" }}
                  onClick={handleContextMenu}
                >
                  + 12 others
                </a>
              </small>
              {contextMenu && (
                <div ref={contextMenuRef} className="po-context-menu">
                  <ul>
                    {Array.isArray(poNumbers) && poNumbers.length > 0 ? (
                      poNumbers.map((item, index) => (
                        <li onClick={() => handleMenuClick(item)} key={index}>
                          {item}
                        </li>
                      ))
                    ) : (
                      <li>NA</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            <div className="right__icons_area" style={{ textAlign: "end" }}>
              {props.selectedMail.flag?.flagStatus !== "notFlagged" && (
                <span className="flagged_icon me-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                  >
                    <g
                      id="Group_60"
                      data-name="Group 60"
                      transform="translate(-1793 -112)"
                    >
                      <g id="Group_57" data-name="Group 57">
                        <rect
                          id="Rectangle_1882"
                          data-name="Rectangle 1882"
                          width="20"
                          height="20"
                          rx="3"
                          transform="translate(1793 112)"
                          fill="#f5f5f5"
                        />
                      </g>
                      <path
                        id="Polygon_193"
                        data-name="Polygon 193"
                        d="M6.047,2.984a1,1,0,0,1,1.905,0l1.3,4.072a1,1,0,0,0,.177.327l2.787,3.425a1,1,0,0,1-.982,1.61L7.206,11.57a1,1,0,0,0-.412,0l-4.029.848a1,1,0,0,1-.982-1.61L4.571,7.383a1,1,0,0,0,.177-.327Z"
                        transform="translate(1811 115) rotate(90)"
                        fill="#ff9191"
                      />
                    </g>
                  </svg>
                </span>
              )}

              {props.selectedMail.importance === "high" && (
                <span className="flagged_icon me-2">
                  <button className="btn btn-default">
                    <ImportanceIcon />
                  </button>
                </span>
              )}

              {props.selectedMail.hasAttachments === true && (
                <span
                  style={{
                    cursor: "pointer",
                    width: "20px",
                    height: "20px",
                    display: "inline-block",
                  }}
                  className="me-2"
                >
                  <AttatchmentIcon />
                </span>
              )}

              <span
                style={{
                  cursor: "pointer",
                  width: "20px",
                  height: "20px",
                  display: "inline-block",
                }}
                onClick={handleToggle}
                className="non_printing_area"
              >
                {props.extendDetailsToggle ? (
                  <MailCollapseIcon />
                ) : (
                  <MailExpandIcon />
                )}
              </span>
            </div>
          </div>

          <>
            <SingleMailDetails replyble={true} {...props} />
            <MailChain {...props} />
          </>
        </div>
      )}
    </>
  );
}
