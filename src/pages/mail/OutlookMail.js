import React, { useState, useEffect } from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "services/authConfig";
import SignInButton from "../../elements/mail/SignInButton";
import SignOutButton from "../../elements/mail/SignOutButton";

const OutlookMail = () => {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const [folders, setFolders] = useState([]);
  const [emails, setEmails] = useState([]);

  // get mauil folders
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
            "https://graph.microsoft.com/v1.0/me/mailFolders",
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
            setFolders(data.value);
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

  // get-mails

  const [folderId, setFolderId] = useState("");

  useEffect(() => {
    const getEmails = async () => {
      if (accounts.length > 0) {
        try {
          const response = await instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0],
          });

          const accessToken = response.accessToken;

          const emailResponse = await fetch(
            `https://graph.microsoft.com/v1.0/me/mailFolders/${folderId}/messages`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (emailResponse.ok) {
            const data = await emailResponse.json();
            setEmails(data.value);
          } else {
            console.error("Failed to fetch emails");
          }
        } catch (error) {
          console.error("Error acquiring token or fetching emails", error);
        }
      }
    };

    if (isAuthenticated) {
      console.log("Fetching emails...");
      getEmails();
    }
  }, [instance, accounts, isAuthenticated, folderId]);

  useEffect(() => {
    const hash = window.location.hash.substring(1); // Remove the leading '#'
    const params = new URLSearchParams(hash);

    const code = params.get("code");
    const clientInfo = params.get("client_info");
    const state = params.get("state");
    const sessionState = params.get("session_state");

    console.log("Code:", code);
    console.log("Client Info:", clientInfo);
    console.log("State:", state);
    console.log("Session State:", sessionState);
  }, []);

  return (
    <div>
      {isAuthenticated ? <SignOutButton /> : <SignInButton />}
      <h2>Your Mail Folders</h2>

      <div className="row">
        <div className="col-3">
          {isAuthenticated ? (
            <ul>
              {folders.length > 0 ? (
                folders.map((folder) => (
                  <li onClick={() => setFolderId(folder.id)} key={folder.id}>
                    {folder.displayName}
                  </li>
                ))
              ) : (
                <p>No mail folders found.</p>
              )}
            </ul>
          ) : (
            <p>Please sign in to view your mail folders.</p>
          )}
        </div>
        <div className="col-9">
          {isAuthenticated ? (
            <ul>
              {emails.length > 0 ? (
                emails.map((email) => <li key={email.id}>{email.subject}</li>)
              ) : (
                <p>No emails found.</p>
              )}
            </ul>
          ) : (
            <p>Please sign in to view your emails.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutlookMail;
