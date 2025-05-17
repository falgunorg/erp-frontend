import React, { useEffect, useState } from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "services/authConfig";

const MailContextMenu = ({
  x,
  y,
  onClose,
  onAction,
  mail,
  mailMinimize,
  props,
}) => {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const [folders, setFolders] = useState([]);
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

  // State to manage the visibility of the sub-menus
  const [isCopySubMenuOpen, setIsCopySubMenuOpen] = useState(false);
  const [isMoveSubMenuOpen, setIsMoveSubMenuOpen] = useState(false);

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
            `${process.env.REACT_APP_MICROSOFT_API_URL}/me/mailFolders?$top=50&$select=displayName`,
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

            const sortedFolders = allFolders.sort((a, b) => {
              const indexA = folderOrder.indexOf(a.displayName);
              const indexB = folderOrder.indexOf(b.displayName);
              if (indexA === -1) return 1;
              if (indexB === -1) return -1;
              return indexA - indexB;
            });

            const filteredFolders = sortedFolders.filter(
              (folder) => folder.id !== props.mailFolder.folderId
            );

            setFolders(filteredFolders);
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

  const emailList = props.emails;

  const handleDelete = (id) => {
    // Find the index of the item to delete
    const indexToDelete = emailList.findIndex((email) => email.id === id);
    // Remove the item from the list
    mailMinimize.handleDelete(id);
    // Determine the next item to select
    let nextIndex = -1;
    if (indexToDelete !== -1) {
      // Try selecting the next item
      nextIndex = indexToDelete + 1 < emailList.length ? indexToDelete + 1 : -1;

      // If no next item, try selecting the previous item
      if (nextIndex === -1 || nextIndex >= emailList.length - 1) {
        nextIndex = indexToDelete - 1 >= 0 ? indexToDelete - 1 : -1;
      }
    }

    // Update selected mail and selected mail IDs
    if (nextIndex !== -1) {
      const nextMail = emailList[nextIndex];
      props.setSelectedMail(nextMail);
      props.setSelectedMailIds([]);
      props.setMailID(nextMail.id);
    } else {
      // If no items left, clear selection
      props.setSelectedMail({});
      props.setSelectedMailIds([]);
    }
  };
  const handlePermanentDelete = (id) => {
    // Find the index of the item to delete
    const indexToDelete = emailList.findIndex((email) => email.id === id);

    // Remove the item from the list
    mailMinimize.handlePermanentDelete(id);

    // Determine the next item to select
    let nextIndex = -1;
    if (indexToDelete !== -1) {
      // Try selecting the next item
      nextIndex = indexToDelete + 1 < emailList.length ? indexToDelete + 1 : -1;

      // If no next item, try selecting the previous item
      if (nextIndex === -1 || nextIndex >= emailList.length - 1) {
        nextIndex = indexToDelete - 1 >= 0 ? indexToDelete - 1 : -1;
      }
    }

    // Update selected mail and selected mail IDs
    if (nextIndex !== -1) {
      const nextMail = emailList[nextIndex];
      props.setSelectedMail(nextMail);
      props.setSelectedMailIds([]);
      props.setMailID(nextMail.id);
    } else {
      // If no items left, clear selection
      props.setSelectedMail({});
      props.setSelectedMailIds([]);
    }
  };

  return (
    <div
      className="mail_context-menu"
      style={{ top: `${y}px`, left: `${x}px`, position: "absolute" }}
      onClick={onClose}
    >
      <ul className="context-menu-list">
        <li onClick={() => window.print()}>Print</li>
        <hr className="margin_0"></hr>
        <li
          onClick={() => {
            props.setIsComposing(true);
            props.setMailSendType("Reply");
          }}
        >
          Reply
        </li>
        <li
          onClick={() => {
            props.setIsComposing(true);
            props.setMailSendType("ReplyAll");
          }}
        >
          Reply All
        </li>
        <li
          onClick={() => {
            props.setIsComposing(true);
            props.setMailSendType("Forward");
          }}
        >
          Forward
        </li>
        <hr className="margin_0"></hr>
        {mail.isRead ? (
          <li onClick={() => mailMinimize.markAsUnread(props.mailID)}>
            Mark as Unread
          </li>
        ) : (
          <li onClick={() => mailMinimize.markAsRead(props.mailID)}>
            Mark as Read
          </li>
        )}
        <hr className="margin_0"></hr>
        <li
          className="d-flex justify-content-between align-items-center "
          onMouseEnter={() => setIsCopySubMenuOpen(true)}
          onMouseLeave={() => setIsCopySubMenuOpen(false)}
        >
          <span>Copy</span> <i className="fa fa-angle-right text-muted"></i>
        </li>

        {isCopySubMenuOpen && (
          <div
            className="sub-menu mail_context-menu"
            style={{ top: "0", left: "100%", position: "absolute" }} // Adjust positioning as necessary
            onMouseEnter={() => setIsCopySubMenuOpen(true)} // Keep the submenu open when hovering
            onMouseLeave={() => setIsCopySubMenuOpen(false)} // Close it when mouse leaves
          >
            <ul className="context-menu-list">
              {folders.map((folder, index) => (
                <li
                  key={index}
                  onClick={() => {
                    mailMinimize.copyMail(props.mailID, folder.id);
                    setIsCopySubMenuOpen(false); // Close sub-menu after action
                  }}
                >
                  {folder.displayName}
                </li>
              ))}
            </ul>
          </div>
        )}

        <li
          className="d-flex justify-content-between align-items-center "
          onMouseEnter={() => setIsMoveSubMenuOpen(true)}
          onMouseLeave={() => setIsMoveSubMenuOpen(false)}
        >
          <span>Move to</span> <i className="fa fa-angle-right text-muted"></i>
        </li>

        {/* Nested Move Sub-menu */}
        {isMoveSubMenuOpen && (
          <div
            className="mail_context-menu"
            style={{ top: "0", left: "100%", position: "absolute" }}
            onMouseEnter={() => setIsMoveSubMenuOpen(true)}
            onMouseLeave={() => setIsMoveSubMenuOpen(false)}
          >
            <ul className="context-menu-list">
              {folders.map((folder, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setIsMoveSubMenuOpen(false);
                    mailMinimize.moveMail(props.mailID, folder.id);
                  }}
                >
                  {folder.displayName}
                </li>
              ))}
            </ul>
          </div>
        )}

        <hr className="margin_0"></hr>
        {props.mailFolder.folderName === "Deleted Items" ? (
          <>
            <li onClick={() => mailMinimize.handleRestore(props.mailID)}>
              Restore
            </li>
            <li onClick={() => handlePermanentDelete(props.mailID)}>
              Delete Permanently
            </li>
          </>
        ) : (
          <li onClick={() => handleDelete(props.mailID)}>Delete</li>
        )}
      </ul>
    </div>
  );
};

export default MailContextMenu;
