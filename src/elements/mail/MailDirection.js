import { Link } from "react-router-dom";
import React, { useCallback, useState } from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "services/authConfig";
import { mailMinimize } from "../../minimize/mailMinimize";

export default function MailDirection(props) {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();

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

  const CancelDirection = () => {
    props.setSelectedMailIds([]);
  };

  const bulkDelete = (ids) => {
    mailMinimize.bulkDelete(ids);
    props.setSelectedMail({});
    props.setSelectedMailIds([]);
    props.setMarkMail(false);
  };

  const bulkPermanentDelete = (ids) => {
    mailMinimize.bulkPermanentDelete(ids);
    props.setSelectedMail({});
    props.setSelectedMailIds([]);
    props.setMarkMail(false);
  };

  const bulkMove = (ids, folderId) => {
    mailMinimize.bulkMove(ids, folderId);
    props.setSelectedMail({});
    props.setSelectedMailIds([]);
    props.setMarkMail(false);
  };

  const bulkArchive = (ids) => {
    mailMinimize.bulkArchive(ids);
    props.setSelectedMail({});
    props.setSelectedMailIds([]);

    props.setMarkMail(false);
  };

  const bulkRestore = (ids) => {
    mailMinimize.bulkRestore(ids);
    props.setSelectedMail({});
    props.setSelectedMailIds([]);
    props.setMarkMail(false);
  };

  const bulkRead = (ids) => {
    mailMinimize.bulkRead(ids);
    props.setSelectedMail({});
    props.setSelectedMailIds([]);
    props.setMarkMail(false);
  };

  const bulkUnread = (ids) => {
    mailMinimize.bulkUnread(ids);
    props.setSelectedMail({});
    props.setSelectedMailIds([]);
    props.setMarkMail(false);
  };

  return (
    <div
      style={{ position: "relative", width: "100%", height: "100%" }}
      className="mail_direction text-center"
    >
      <div className="floating_part">
        {/* {props.selectedMailIds.length > 0 ? (
          <img
            src={require("../../assets/images/icons/selected.svg").default}
            alt="Logo"
          />
        ) : (
          <img
            src={require("../../assets/images/icons/light.svg").default}
            alt="Logo"
          />
        )} */}

        <div>
          <b>
            {props.selectedMailIds.length > 0
              ? props.selectedMailIds.length + " Item's selected"
              : "Select an item to read"}
          </b>
        </div>
        {props.selectedMailIds.length > 0 ? (
          <ul>
            {props.mailFolder.folderName === "Deleted Items" ? (
              <>
                <li>
                  <Link
                    to="#"
                    onClick={() => bulkRestore(props.selectedMailIds)}
                  >
                    <i className="fa fa-recycle text-success"></i>Restore
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    onClick={() => bulkPermanentDelete(props.selectedMailIds)}
                  >
                    <i className="fa fa-trash text-danger"></i>Permanently
                    Delete
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link to="#" onClick={() => bulkDelete(props.selectedMailIds)}>
                  <i className="fa fa-trash text-danger"></i>Delete
                </Link>
              </li>
            )}

            <li>
              <Link to="#" onClick={() => bulkRead(props.selectedMailIds)}>
                <i className="fas fa-envelope-open"></i>Mark as read
              </Link>
            </li>

            <li>
              <Link to="#" onClick={() => bulkUnread(props.selectedMailIds)}>
                <i className="fas fa-envelope"></i>Mark as unread
              </Link>
            </li>
            <li>
              <Link to="#" onClick={CancelDirection}>
                <i className="fas fa-times text-danger"></i>Cancel
              </Link>
            </li>
          </ul>
        ) : (
          <div className="text-muted">Nothing is selected</div>
        )}
      </div>
    </div>
  );
}
