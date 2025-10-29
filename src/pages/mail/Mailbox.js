import React, { useState, useEffect, useRef } from "react";
import MailFolders from "../../elements/mail/MailFolders";
import SentMail from "../../elements/mail/SentMail";
import MailDetails from "../../elements/mail/MailDetails";
import MailList from "../../elements/mail/MailList";
import MailDirection from "../../elements/mail/MailDirection";
import { useIsAuthenticated } from "@azure/msal-react";
import SignInButton from "../../elements/mail/SignInButton";
import { useParams } from "react-router-dom";
import "jodit/build/jodit.min.css";

//import new Design's Mail Action Header
import MailActionHeader from "elements/mail/MailActionHeader";

export default function Mailbox(props) {
  const isAuthenticated = useIsAuthenticated();
  const params = useParams();

  useEffect(async () => {
    props.setMailID(params.id);
  }, [params.id]);

  useEffect(async () => {
    props.setHeaderData({
      pageName: "Mail",
      isModalButton: true,
      modalButtonRef: "composeSection",
      isNewButton: false,
      newButtonLink: "",
      newButtonText: "New mail",
      isMailSearch: true,
      isInnerSearch: false,
      innerSearchValue: "",
      isDropdown: false,
      DropdownMenu: [],
      isBackBtn: true,
    });
  }, []);

  console.log("SElectedMail", props.selectedMail);

  return (
    <>
      {isAuthenticated ? (
        <>
          <MailActionHeader {...props} />
          <div className="email_layout">
            <MailFolders {...props} />
            <MailList {...props} />

            <div
              className={`email-detail  ${
                props.resizeToggle ? "" : "expanded"
              } ${props.extendDetailsToggle ? "extend_full" : ""}`}
              style={{ width: `${props.mailDetailsWidth}%` }}

              // className={
              //   props.resizeToggle ? "email-detail" : "email-detail expanded"
              // }
            >
              {props.isComposing ? (
                <SentMail {...props} />
              ) : props.selectedMailIds.length > 1 ? (
                <MailDirection {...props} />
              ) : props.mailID ? (
                <MailDetails {...props} />
              ) : (
                <MailDirection {...props} />
              )}
            </div>
          </div>
        </>
      ) : (
        <div
          style={{ marginTop: "200px", paddingBottom: "20px" }}
          className="text-center col-md-4 offset-md-4"
        >
          <h5> Please Sign In Your Mail</h5>
          <br />
          <SignInButton />
        </div>
      )}
    </>
  );
}
