import React, { useState, useEffect, useRef } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "services/authConfig";
import PropTypes from "prop-types";
import Toolbar from "./Toolbar";
import SingleMailDetails from "./SingleMailDetails";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";
import api from "services/api";
//quail
// import "quill/dist/quill.snow.css";
import "quill-better-table/dist/quill-better-table.css";
import Quill from "quill";
import QuillBetterTable from "quill-better-table";
import ImageResize from "quill-image-resize-module-react";

export default function SentMail(props) {
  Quill.register("modules/better-table", QuillBetterTable);
  Quill.register("modules/imageResize", ImageResize);

  const [description, setDescription] = useState("");
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const handleUndo = () => {
    if (quillRef.current) {
      quillRef.current.history.undo();
    }
  };

  const handleRedo = () => {
    if (quillRef.current) {
      quillRef.current.history.redo();
    }
  };

  useEffect(() => {
    var fontSizeStyle = Quill.import("attributors/style/size");
    fontSizeStyle.whitelist = [
      "10px",
      "12px",
      "14px",
      "16px",
      "18px",
      "20px",
      "22px",
      "24px",
      "26px",
      "28px",
      "30px",
      "32px",
      "34px",
      "36px",
      "38px",
      "40px",
    ];
    Quill.register(fontSizeStyle, true);
    const quill = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: "Write Mail",

      modules: {
        toolbar: "#FalgunToolbar",
        imageResize: {
          parchment: Quill.import("parchment"),
          modules: ["Resize", "DisplaySize"],
        },
        "better-table": {
          operationMenu: {
            items: {
              insertColumnRight: { text: "Insert Column Right" },
              insertColumnLeft: { text: "Insert Column Left" },
              insertRowUp: { text: "Insert Row Up" },
              insertRowDown: { text: "Insert Row Down" },
              deleteColumn: { text: "Delete Column" },
              deleteRow: { text: "Delete Row" },
            },
          },
        },
      },
    });

    quillRef.current = quill; // Store the Quill instance in the ref

    quill.on("text-change", () => {
      // Apply styles to all td elements within each new table

      const tables = quill.root.querySelectorAll("table");
      tables.forEach((table) => {
        table.style.border = "1px solid #000";
        table.style.borderCollapse = "collapse";

        // Style each <td> element within the table
        const cells = table.querySelectorAll("td");
        cells.forEach((cell) => {
          cell.style.border = "1px solid #000";
          cell.style.padding = "5px";
        });
      });
      // Timeout to ensure the table is inserted before applying styles
      const html = quill.root.innerHTML; // Get content as HTML
      setDescription(html); // Set the state with the content
    });

    window.quill = quill; // Make quill instance globally available

    const toolbar = quill.getModule("toolbar");

    // Add custom toolbar handlers
    toolbar.addHandler("table", function () {
      const betterTable = quill.getModule("better-table");
      betterTable.insertTable(4, 4);
    });

    toolbar.addHandler("undo", () => quill.history.undo());
    toolbar.addHandler("redo", () => quill.history.redo());
  }, []);

  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const [toEmails, setToEmails] = useState([]);
  const [ccEmails, setCcEmails] = useState([]);
  const [bccEmails, setBccEmails] = useState([]);
  const [subject, setSubject] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [workOrder, setWorkOrder] = useState("");
  const [poNumber, setPoNumber] = useState("");

  const history = useHistory();

  const [mailSign, setMailSign] = useState("");

  const getMailSign = async () => {
    try {
      const response = await api.post("/mail-signature", {
        user_id: props.userData?.userId,
      });
      if (response.status === 200 && response.data) {
        setMailSign(response.data.data);
      }
    } catch (error) {
      // Handle API error
    }
  };

  useEffect(() => {
    getMailSign();
  }, []);

  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const getContacts = async () => {
      let allContacts = [];
      let nextPageLink = `${process.env.REACT_APP_MICROSOFT_API_URL}/me/contacts`;

      while (nextPageLink) {
        try {
          const response = await instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0],
          });

          const accessToken = response.accessToken;

          const contactsResponse = await fetch(nextPageLink, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });

          if (contactsResponse.ok) {
            const contactsData = await contactsResponse.json();

            // Normalize contacts to match desired structure
            const normalizedContacts = contactsData.value.map((contact) => ({
              displayName:
                contact.displayName || contact.givenName || "Unknown", // Use displayName or fallback
              mail: contact.emailAddresses[0]?.address || "", // Get first email address
            }));

            allContacts = allContacts.concat(normalizedContacts); // Add fetched contacts

            // Check for nextLink (pagination)
            nextPageLink = contactsData["@odata.nextLink"] || null; // Update the link for the next page
          } else {
            const errorData = await contactsResponse.json();
            console.error("Failed to fetch contacts", errorData);
            break; // Stop if an error occurs
          }
        } catch (error) {
          console.error("Error acquiring token or fetching contacts", error);
          break;
        }
      }

      console.log("All normalized contacts fetched:", allContacts);
      return allContacts;
    };

    const getPeoples = async () => {
      let allUsers = [];
      if (accounts.length > 0) {
        try {
          const response = await instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0],
          });

          const accessToken = response.accessToken;

          let nextLink = `${process.env.REACT_APP_MICROSOFT_API_URL}/users?$select=displayName,mail`;

          // Loop to fetch all pages of users
          do {
            const peopleResponse = await fetch(nextLink, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            });

            if (peopleResponse.ok) {
              const data = await peopleResponse.json();

              // Normalize people data to match desired structure
              const normalizedUsers = data.value.map((user) => ({
                displayName: user.displayName || "Unknown",
                mail: user.mail || "",
              }));

              allUsers = allUsers.concat(normalizedUsers); // Add current page of users to the list
              nextLink = data["@odata.nextLink"]; // Get the next link for pagination
            } else {
              console.error(
                "Failed to fetch people:",
                await peopleResponse.json()
              );
              nextLink = null; // Stop fetching if there's an error
            }
          } while (nextLink);

          console.log("All normalized people fetched:", allUsers);
          return allUsers;
        } catch (error) {
          console.error("Error acquiring token or fetching people", error);
        }
      }
      return allUsers;
    };

    const fetchAndMergeData = async () => {
      if (isAuthenticated) {
        // Fetch contacts and people concurrently
        const [contactsData, peoplesData] = await Promise.all([
          getContacts(),
          getPeoples(),
        ]);

        // Combine both datasets and remove duplicates based on the mail field
        const mergedData = [...contactsData, ...peoplesData];

        // Create a Map to filter out duplicates based on the 'mail' field
        const uniqueContacts = Array.from(
          new Map(mergedData.map((contact) => [contact.mail, contact])).values()
        );

        // Set the unique contacts into state
        setContacts(uniqueContacts);
      }
    };

    fetchAndMergeData();
  }, [instance, accounts, isAuthenticated]);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Helper function to check if emails exist in other arrays
  const isEmailInOtherLists = (email, otherLists) => {
    return otherLists.some((list) => list.includes(email));
  };

  // Update the handleEmailChange to include validation
  const handleEmailChange = (emails, setEmails, otherEmailLists) => {
    const validEmails = emails.filter(isValidEmail);
    const filteredEmails = validEmails.filter((email) => {
      // Ensure the email is not present in any of the other email lists
      return !isEmailInOtherLists(email, otherEmailLists);
    });
    setEmails(filteredEmails);
  };

  // For handling toEmails change
  const handleToEmailChange = (event, value) => {
    handleEmailChange(value, setToEmails, [ccEmails, bccEmails]);
  };

  // For handling ccEmails change
  const handleCcEmailChange = (event, value) => {
    handleEmailChange(value, setCcEmails, [toEmails, bccEmails]);
  };

  // For handling bccEmails change
  const handleBccEmailChange = (event, value) => {
    handleEmailChange(value, setBccEmails, [toEmails, ccEmails]);
  };

  const [showBccField, setShowBccField] = useState(false);

  const toggleBccFields = () => {
    setShowBccField(!showBccField);
  };

  // Function to handle file selection
  const handleFileSelect = (e) => {
    const newFiles = Array.from(e.target.files); // Convert FileList to array
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]); // Append new files to existing files
    e.target.value = null; // Reset the input value to allow re-selection of the same file
  };

  //drag and copy paste

  // Handle files dropped into the drop zone
  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  // Allow dragging over the drop zone
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Handle pasted files
  const handlePaste = (event) => {
    const pastedFiles = Array.from(event.clipboardData.files);
    if (pastedFiles.length) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...pastedFiles]);
    }
  };

  // Function to handle file deletion
  const handleFileDelete = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    const { selectedMail, mailSendType } = props;

    if (selectedMail) {
      const {
        subject,
        sender,
        toRecipients = [],
        ccRecipients = [],
        bccRecipients = [],
        body,
        poNumber,
        workOrder,
      } = selectedMail;
      switch (mailSendType) {
        case "Reply":
          setSubject(`RE: ${subject}`);
          setToEmails([sender.emailAddress.address]);
          setCcEmails([]);
          setBccEmails([]);
          setWorkOrder(workOrder);
          setPoNumber(poNumber);
          break;

        case "ReplyAll":
          setSubject(`RE: ${subject}`);
          setToEmails([
            sender.emailAddress.address,
            ...toRecipients.map((rec) => rec.emailAddress.address),
          ]);
          setCcEmails(ccRecipients.map((rec) => rec.emailAddress.address));
          setBccEmails([]);
          setWorkOrder(workOrder);
          setPoNumber(poNumber);
          break;

        case "draftSent":
          setSubject(subject || "");
          setToEmails(toRecipients.map((rec) => rec.emailAddress.address));
          setCcEmails(ccRecipients.map((rec) => rec.emailAddress.address));
          setBccEmails(bccRecipients.map((rec) => rec.emailAddress.address));
          setDescription(body?.content || "");
          setWorkOrder(workOrder);
          setPoNumber(poNumber);
          break;

        case "Forward":
          setSubject(`FW: ${subject}`);
          setToEmails([]);
          setCcEmails([]);
          setBccEmails([]);
          setWorkOrder(workOrder);
          setPoNumber(poNumber);
          break;

        default:
          // For new email, reset the fields
          setSubject("");
          setToEmails([]);
          setCcEmails([]);
          setBccEmails([]);
          setDescription(""); // Reset description for new email
          break;
      }
    }
  }, [props.mailSendType, props.selectedMail]);

  const handleSendEmail = async () => {
    if (props.mailSendType === "Send") {
      if (!toEmails.length || !subject || !description) {
        setErrorMessage("To, Subject, and Body are required.");
        return;
      }
    }

    const fullSubject = `${subject}=>${workOrder}=>${poNumber}`;

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });

      const accessToken = response.accessToken;

      const attachments = await Promise.all(
        selectedFiles.map(async (file) => {
          const base64File = await fileToBase64(file);
          return {
            "@odata.type": "#microsoft.graph.fileAttachment",
            name: file.name,
            contentType: file.type,
            contentBytes: base64File.replace(/^data:.+;base64,/, ""), // Strip base64 prefix
          };
        })
      );

      const fullBodyContent = `${description}<br><br>${mailSign}`;
      const message = {
        subject: fullSubject,
        body: {
          contentType: "HTML",
          content: fullBodyContent,
        },
        toRecipients: toEmails.map((email) => ({
          emailAddress: { address: email },
        })),
        ccRecipients: ccEmails.map((email) => ({
          emailAddress: { address: email },
        })),
        bccRecipients: bccEmails.map((email) => ({
          emailAddress: { address: email },
        })),
        attachments,
        importance: importance,
      };

      // Check the mailSendType to decide whether it's a new email, reply, forward, etc.
      let url = "";
      let method = "POST";
      const selectedMailId = props.selectedMail?.id;

      if (props.mailSendType === "Reply") {
        url = `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${selectedMailId}/createReply`;
      } else if (props.mailSendType === "ReplyAll") {
        url = `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${selectedMailId}/createReplyAll`;
      } else if (props.mailSendType === "Forward") {
        url = `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${selectedMailId}/forward`;
      } else if (props.mailSendType === "draftSent") {
        url = `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${selectedMailId}/send`;
      } else {
        url = `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages`;
      }

      // Send the request to Microsoft Graph API based on the mailSendType
      let apiResponse;
      if (props.mailSendType === "Reply" || props.mailSendType === "ReplyAll") {
        const replyResponse = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: fullBodyContent,
          }),
        });

        if (!replyResponse.ok) {
          throw new Error("Failed to create reply message");
        }

        const replyData = await replyResponse.json();
        const replyId = replyData.id;

        // Add attachments to the reply
        for (const attachment of attachments) {
          await addAttachmentToReply(replyId, attachment, accessToken);
        }

        // Send the reply message
        await sendReply(replyId, accessToken);

        apiResponse = { ok: true }; // Simulating a successful response
      } else if (props.mailSendType === "Forward") {
        apiResponse = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: fullBodyContent,
            toRecipients: toEmails.map((email) => ({
              emailAddress: { address: email },
            })),
            attachments,
            importance: importance,
          }),
        });
      } else if (props.mailSendType === "draftSent") {
        apiResponse = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: fullBodyContent,
            attachments,
            importance: importance,
          }),
        });
      } else {
        // Sending a new email
        const createMessageResponse = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        });

        if (!createMessageResponse.ok) {
          throw new Error("Failed to create draft message");
        }
        const createdMessage = await createMessageResponse.json();

        apiResponse = await fetch(
          `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${createdMessage.id}/send`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }

      if (apiResponse.ok) {
        setSuccessMessage("Email sent successfully!");
        const allRecipients = [...toEmails, ...ccEmails, ...bccEmails];
        for (const email of allRecipients) {
          await addRecipientToContacts(email, accessToken);
        }

        setToEmails([]);
        setCcEmails([]);
        setSubject("");
        setDescription("");
        setSelectedFiles([]);
        props.setIsComposing(false);
        props.setMailSendType("Send");
      } else {
        setErrorMessage("Failed to send email. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred while sending the email.", error);
      setErrorMessage("An error occurred while sending the email.");
    } finally {
      setLoading(false);
    }
  };

  const addRecipientToContacts = async (email, accessToken) => {
    try {
      // Get existing contacts to check if the recipient is already a contact
      const response = await fetch(
        `${process.env.REACT_APP_MICROSOFT_API_URL}/me/contacts`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch contacts.");
      }

      const contactData = await response.json();

      // Check if the contact already exists by comparing the email addresses
      const contactExists = contactData.value.some((contact) =>
        contact.emailAddresses.some((e) => e.address === email)
      );

      if (contactExists) {
        console.log(`${email} is already a contact.`);
        return; // Don't add the recipient if they already exist
      }

      // If the contact doesn't exist, add the recipient to contacts
      const newContact = {
        givenName: "", // Optionally, extract/displayName from email pattern if available
        emailAddresses: [
          {
            address: email,
            name: email, // Use the email as the name if no name is provided
          },
        ],
      };

      const addResponse = await fetch(
        `${process.env.REACT_APP_MICROSOFT_API_URL}/me/contacts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newContact),
        }
      );

      if (!addResponse.ok) {
        throw new Error(`Failed to add ${email} to contacts.`);
      }

      console.log(`${email} added to contacts successfully!`);
    } catch (error) {
      console.error(`Error adding ${email} to contacts: `, error);
    }
  };

  //Handle Discard

  const handleDiscard = () => {
    if (
      subject ||
      description ||
      toEmails.length > 0 ||
      selectedFiles.length > 0
    ) {
      // Show SweetAlert when trying to discard
      swal({
        title: "Discard Changes?",
        text: "Do you want to save this email to drafts before discarding?",
        icon: "warning",
        buttons: {
          cancel: "No",
          confirm: {
            text: "Save to Draft",
            value: true,
          },
        },
      }).then((saveToDraft) => {
        if (saveToDraft) {
          handleSaveDraft(); // Call the save draft function
        } else {
          props.setIsComposing(false); // Close the compose window without saving
        }
      });
    } else {
      // If nothing to save, simply close the compose window
      props.setIsComposing(false);
    }
  };

  // Function to save the email as a draft
  const handleSaveDraft = async () => {
    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });

      const accessToken = response.accessToken;

      // Convert files to base64 format for attachments
      const attachments = await Promise.all(
        selectedFiles.map(async (file) => {
          const base64File = await fileToBase64(file);
          return {
            "@odata.type": "#microsoft.graph.fileAttachment",
            name: file.name,
            contentType: file.type,
            contentBytes: base64File.replace(/^data:.+;base64,/, ""), // Strip base64 prefix
          };
        })
      );

      const fullSubject = `${subject} => ${workOrder} => ${poNumber}`;
      const fullBodyContent = `${description}<br><br>${mailSign}`;
      const draftMessage = {
        subject: fullSubject,
        body: {
          contentType: "HTML",
          content:
            props.mailSendType === "draftSent" ? description : fullBodyContent,
        },
        toRecipients: toEmails.map((email) => ({
          emailAddress: { address: email },
        })),
        ccRecipients: ccEmails.map((email) => ({
          emailAddress: { address: email },
        })),
        bccRecipients: bccEmails.map((email) => ({
          emailAddress: { address: email },
        })),

        importance: importance,
      };

      // Determine URL and method based on mailSendType
      let url = "";
      let method = "POST";
      const selectedMailId = props.selectedMail?.id;

      switch (props.mailSendType) {
        case "draftSent":
          url = `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${selectedMailId}`;
          method = "PATCH"; // Updating the draft
          break;
        case "Reply":
          url = `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${selectedMailId}/createReply`;
          break;
        case "ReplyAll":
          url = `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${selectedMailId}/createReplyAll`;
          break;
        case "Forward":
          url = `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${selectedMailId}/createForward`;
          break;
        default: // New Draft
          url = `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages`;
          break;
      }

      const body =
        props.mailSendType === "Reply" ||
        props.mailSendType === "ReplyAll" ||
        props.mailSendType === "Forward"
          ? JSON.stringify({
              comment: fullBodyContent,
            })
          : JSON.stringify(draftMessage);
      // Send the draft creation or update request
      const createDraftResponse = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body,
      });

      if (!createDraftResponse.ok) {
        throw new Error("Failed to save the draft.");
      }

      const draft = await createDraftResponse.json();
      const replyId = draft.id;

      // Add attachments to the reply (if any)

      for (const attachment of attachments) {
        await addAttachmentToReply(replyId, attachment, accessToken);
      }

      // Success handling
      setSuccessMessage("Email saved to drafts successfully!");

      // Update the state and UI
      props.setMailSendType("Send");
      props.setIsComposing(false); // Close the compose window
      props.setMailFolder(props.mailFolder); // Update mail folder if needed
      props.setSelectedMail(draft); // Set the new draft as selected mail
      history.push("/mailbox"); // Use history.push instead of history.pushState
    } catch (error) {
      console.error("An error occurred while saving the draft.", error);
      setErrorMessage("An error occurred while saving the draft.");
    }
  };

  // Helper function to add an attachment to the reply
  const addAttachmentToReply = async (replyId, attachment, accessToken) => {
    const response = await fetch(
      `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${replyId}/attachments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attachment),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add attachment to reply");
    }
  };

  // Helper function to send the reply message
  const sendReply = async (replyId, accessToken) => {
    const response = await fetch(
      `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${replyId}/send`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to send reply message");
    }
  };

  const [importance, setImportance] = useState("normal");
  const toggleImportance = () => {
    if (importance === "normal") {
      setImportance("high");
    } else {
      setImportance("normal");
    }
  };

  const handleToggle = () => {
    props.setExtendDetailsToogle(!props.extendDetailsToggle);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onPaste={handlePaste}
      className="compose-email"
    >
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}
      <div className="write_email_subject">
        <input
          autoFocus
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="workOrder"
        />
        <Autocomplete
          className="workOrder"
          freeSolo
          options={["WO001", "WO002", "WO003", "WO004", "WO005", "WO006", "NA"]}
          value={workOrder}
          onChange={(e, newValue) => setWorkOrder(newValue)}
          renderInput={(params) => <TextField {...params} placeholder="WO" />}
        />

        <Autocomplete
          className="workOrder"
          freeSolo
          options={["PO001", "PO002", "PO003", "PO004", "PO005", "PO006", "NA"]}
          value={poNumber}
          onChange={(e, newValue) => setPoNumber(newValue)}
          renderInput={(params) => (
            <TextField className="workOrder" {...params} placeholder="PO" />
          )}
        />

        <button onClick={handleToggle} className="toggleExtend">
          {props.extendDetailsToggle ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18.252"
              height="18.643"
              viewBox="0 0 18.252 18.643"
            >
              <path
                id="Polygon_181"
                data-name="Polygon 181"
                d="M3.993,1.4A1,1,0,0,1,5.7,1.4L8.763,6.409A1,1,0,0,1,7.91,7.93H1.783A1,1,0,0,1,.93,6.409Z"
                transform="matrix(-0.719, -0.695, 0.695, -0.719, 12.743, 12.438)"
                fill="#707070"
              />
              <path
                id="Polygon_182"
                data-name="Polygon 182"
                d="M3.993,1.4A1,1,0,0,1,5.7,1.4L8.763,6.409A1,1,0,0,1,7.91,7.93H1.783A1,1,0,0,1,.93,6.409Z"
                transform="translate(5.408 6.233) rotate(43)"
                fill="#707070"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20.783"
              height="22.093"
              viewBox="0 0 20.783 22.093"
            >
              <path
                id="Polygon_181"
                data-name="Polygon 181"
                d="M3.993,1.4A1,1,0,0,1,5.7,1.4L8.763,6.409A1,1,0,0,1,7.91,7.93H1.783A1,1,0,0,1,.93,6.409Z"
                transform="matrix(0.766, 0.643, -0.643, 0.766, 13.359, 0)"
                fill="#707070"
              />
              <path
                id="Polygon_182"
                data-name="Polygon 182"
                d="M3.993,1.4A1,1,0,0,1,5.7,1.4L8.763,6.409A1,1,0,0,1,7.91,7.93H1.783A1,1,0,0,1,.93,6.409Z"
                transform="matrix(-0.766, -0.643, 0.643, -0.766, 7.425, 22.093)"
                fill="#707070"
              />
            </svg>
          )}
        </button>
      </div>
      <Toolbar
        onUndo={handleUndo}
        onRedo={handleRedo}
        toggleImportance={toggleImportance}
        handleFileSelect={handleFileSelect}
        importance={importance}
        quillRef={quillRef}
      />

      <div className="mail_body_area_composing">
        <div className="to_send_area">
          <div className="sentbtn">
            <button onClick={handleSendEmail} disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
          <div className="to_cc">
            <div className="to_field">
              <Autocomplete
                className="recepient_AutoComplete"
                multiple
                freeSolo
                options={contacts
                  .map((contact) => contact.mail || contact.displayName)
                  .filter((option) => !toEmails.includes(option))} // Prevent duplicate in suggestions
                value={toEmails}
                onChange={handleToEmailChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="TO: "
                  />
                )}
              />
            </div>

            <div style={{ position: "relative" }} className="cc_field">
              <Autocomplete
                className="recepient_AutoComplete"
                multiple
                freeSolo
                options={contacts
                  .map((contact) => contact.mail || contact.displayName)
                  .filter((option) => !ccEmails.includes(option))} // Prevent duplicate in suggestions
                value={ccEmails}
                onChange={handleCcEmailChange}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" placeholder="CC:" />
                )}
              />
              <i
                onClick={toggleBccFields}
                style={{
                  position: "absolute",
                  right: "0",
                  top: "2px",
                  cursor: "pointer",
                  color: "#adb5bd",
                  fontSize: "12px",
                }}
                className="fa fa"
              >
                BCC
              </i>
            </div>
            {showBccField && (
              <div className="cc_field">
                <Autocomplete
                  className="recepient_AutoComplete"
                  multiple
                  freeSolo
                  options={contacts
                    .map((contact) => contact.mail || contact.displayName)
                    .filter((option) => !bccEmails.includes(option))} // Prevent duplicate in suggestions
                  value={bccEmails}
                  onChange={handleBccEmailChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="BCC:"
                    />
                  )}
                />
              </div>
            )}
          </div>
          <div className="discard">
            <button onClick={handleDiscard}>Discard</button>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <>
            <br />
            <div className="attachment-container">
              {selectedFiles.map((file, index) => (
                <span
                  key={index}
                  style={{
                    padding: "5px",
                    background: "#e9ecef",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    fontSize: "11px",
                    margin: "5px",
                    display: "inline-block",
                    position: "relative",
                  }}
                >
                  {file.name.endsWith("png") ? (
                    <i
                      style={{
                        fontSize: "14px",
                        marginRight: "5px",
                      }}
                      className="fa fa-image"
                    ></i>
                  ) : file.name.endsWith("jpg") ||
                    file.name.endsWith("jpeg") ? (
                    <i
                      style={{
                        fontSize: "14px",
                        marginRight: "5px",
                      }}
                      className="fa fa-file-image"
                    ></i>
                  ) : file.name.endsWith("pdf") ? (
                    <i
                      style={{
                        fontSize: "14px",
                        marginRight: "5px",
                      }}
                      className="fa fa-file-pdf"
                    ></i>
                  ) : file.name.endsWith("doc") ||
                    file.name.endsWith("docx") ? (
                    <i
                      style={{
                        fontSize: "14px",
                        marginRight: "5px",
                      }}
                      className="fa fa-file-word"
                    ></i>
                  ) : file.name.endsWith("xls") ||
                    file.name.endsWith("xlsx") ? (
                    <i
                      style={{
                        fontSize: "14px",
                        marginRight: "5px",
                      }}
                      className="fa fa-file-excel"
                    ></i>
                  ) : file.name.endsWith("ppt") ||
                    file.name.endsWith("pptx") ? (
                    <i
                      style={{
                        fontSize: "14px",
                        marginRight: "5px",
                      }}
                      className="fa fa-file-powerpoint"
                    ></i>
                  ) : (
                    <i
                      style={{
                        fontSize: "14px",
                        marginRight: "5px",
                      }}
                      className="fa fa-file"
                    ></i>
                  )}

                  {file.name}
                  <i
                    className="fas fa-times"
                    style={{
                      color: "red",
                      fontSize: "15px",
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleFileDelete(index)}
                  ></i>
                </span>
              ))}
            </div>
            <hr />
          </>
        )}

        <div className="editor" ref={editorRef}></div>

        {props.mailSendType !== "draftSent" && (
          <div
            dangerouslySetInnerHTML={{
              __html: mailSign,
            }}
          />
        )}
      </div>

      {props.mailSendType !== "Send" && (
        <SingleMailDetails replyble={false} {...props} />
      )}
    </div>
  );
}

SentMail.propTypes = {
  setIsComposing: PropTypes.func.isRequired,
};
