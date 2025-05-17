import React, { useState, useEffect, useCallback } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

import moment from "moment";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "services/authConfig";
// import "quill/dist/quill.snow.css";
import "quill-better-table/dist/quill-better-table.css";
import MailAvatar from "./MailAvatar";

const SingleMailWindow = ({ item }) => {
  const handleDownload = (attachment) => {
    const link = document.createElement("a");
    link.href = `data:${attachment.contentType};base64,${attachment.contentBytes}`;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {item.id && (
        <div className="email-content">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "60% 20%",
              boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
              padding: "10px",
              borderRadius: "7px",
              position: "sticky",
              top: "0",
              zIndex: "9999",
              background: "#fff",
              alignItems: "center",
              marginTop: "20px",
            }}
            className="write_email_subject"
          >
            <div
              style={{ fontSize: "16px", fontWeight: "500", border: "none" }}
              className="workOrder"
            >
              {item.subject}
            </div>
            <div
              style={{ fontSize: "16px", fontWeight: "500", border: "none" }}
              className="workOrder"
            >
              {item.workOrder}
            </div>
          </div>
          <div
            style={{
              marginTop: "15px",
              boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
              padding: "10",
              borderRadius: "7px",
              background: "#fff",
            }}
            className="mail_body_area"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              className="mail_header"
            >
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
                className="users_area"
              >
                <MailAvatar
                  name={
                    item.from?.emailAddress?.name ||
                    item.from?.emailAddress?.address
                  }
                  picture={item.senderImage}
                  size={32}
                />

                <div className="user_details">
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                    className="username"
                    // style={{ cursor: "pointer" }}
                  >
                    {item.from?.emailAddress?.name ||
                      item.from?.emailAddress?.address}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                    className="toString"
                  >
                    <span style={{ fontSize: "11px", paddingRight: "5px" }}>
                      {" "}
                      To:
                    </span>
                    {item.toRecipients?.map((recipient, index) => (
                      <React.Fragment key={recipient.emailAddress?.address}>
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            padding: "0 0 0 0",
                            fontSize: "11px",
                          }}
                          className="mail_recepients_btn"
                        >
                          {recipient.emailAddress?.name ||
                            recipient.emailAddress?.address}
                        </button>
                        {index < item.toRecipients.length - 1 && "; "}
                      </React.Fragment>
                    ))}
                  </div>

                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                    className="toString"
                  >
                    <span style={{ fontSize: "11px", paddingRight: "5px" }}>
                      Cc:
                    </span>
                    {item.ccRecipients?.map((recipient, index) => (
                      <React.Fragment key={index}>
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            padding: "0 0 0 0",
                            fontSize: "11px",
                          }}
                          className="mail_recepients_btn"
                        >
                          {recipient.emailAddress?.name ||
                            recipient.emailAddress?.address}
                        </button>
                        {index < item.ccRecipients.length - 1 && "; "}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: "12px" }}>
                {moment(item.receivedDateTime).format(
                  "MMM D, YYYY [at] h:mm A"
                )}
              </div>
            </div>
            <hr />
            {item?.attachments && item.attachments.length > 0 && (
              <div className="attachments">
                {item.attachments
                  .filter((attachment) => !attachment.isInline)
                  .map((attachment, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "0 0 0 0",
                        background: "#e9ecef",
                        border: "1px solid #ddd !important",
                        borderRadius: "3px",
                        marginRight: "10px",
                        marginBottom: "10px",
                        fontSize: "12px",
                        alignItems: "center",
                        display: "flex",
                        color: "#555",
                        width: "fit-content",
                        float: "left",
                      }}
                      className="single_attachment"
                    >
                      <button
                        onClick={() => handleDownload(attachment)}
                        style={{ border: "none", background: "none" }}
                      >
                        {attachment.name}
                      </button>
                    </div>
                  ))}
              </div>
            )}
            <br />

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
                  __html: item.body?.content,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SingleMailWindow;
