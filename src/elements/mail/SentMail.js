import React, { useState, useEffect, useRef } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "services/authConfig";
import PropTypes from "prop-types";
import SingleMailDetails from "./SingleMailDetails";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";
import api from "services/api";
import { Modal } from "react-bootstrap";
import { MailCollapseIcon, MailExpandIcon } from "../SvgIcons";

//quail

import "quill-better-table/dist/quill-better-table.css";
import Quill from "quill";
import QuillBetterTable from "quill-better-table";
import ImageResize from "quill-image-resize-module-react";
import moment from "moment";

export default function SentMail(props) {
  //Editor Area

  Quill.register("modules/better-table", QuillBetterTable);
  Quill.register("modules/imageResize", ImageResize);

  const quillRef = useRef(null);

  const [selectedFiles, setSelectedFiles] = useState([]);
  useEffect(() => {
    if (props.editorInstance.actionHistory === "undo") {
      quillRef.current.history.undo();
    } else if (props.editorInstance.actionHistory === "redo") {
      quillRef.current.history.redo();
    }

    if (props.editorInstance?.toggleImportance) {
      setImportance(props.editorInstance.toggleImportance);
    }

    if (props.editorInstance.selectedFiles.length > 0) {
      const newFiles = Array.from(props.editorInstance.selectedFiles); // Convert FileList to array
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
      props.setEditorInstance((prevState) => ({
        ...prevState, // Spread the previous state
        selectedFiles: [], // Replace selectedFiles with new files
      }));
    }
  }, [props.editorInstance]);

  // const handleUndo = () => {
  //   if (quillRef.current) {
  //     quillRef.current.history.undo();
  //   }
  // };

  // const handleRedo = () => {
  //   if (quillRef.current) {
  //     quillRef.current.history.redo();
  //   }
  // };

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
      // theme: "snow",
      placeholder: "",

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

    quillRef.current = quill;
    quill.on("text-change", () => {
      const tables = quill.root.querySelectorAll("table");
      tables.forEach((table) => {
        table.style.tableLayout = "auto";
        table.style.width = "100%";
        table.style.border = "1px solid #000";
        table.style.borderCollapse = "collapse";

        const cells = table.querySelectorAll("td");
        cells.forEach((cell) => {
          cell.style.border = "1px solid #000";
          cell.style.padding = "5px";
          cell.style.resize = "horizontal";
          cell.style.overflow = "auto";
          cell.style.minWidth = "100px";
        });
      });

      const html = quill.root.innerHTML;
      setDescription(html);
    });

    window.quill = quill;
    const toolbar = quill.getModule("toolbar");

    // Add custom toolbar handlers
    toolbar.addHandler("table", function () {
      const betterTable = quill.getModule("better-table");
      betterTable.insertTable(4, 4);

      // Apply default widths to new tables
      const tables = quill.root.querySelectorAll("table");
      tables.forEach((table) => {
        const cells = table.querySelectorAll("td");
        cells.forEach((cell) => {
          cell.style.width = "100px"; // Set default column width
        });
      });
    });

    toolbar.addHandler("undo", () => quill.history.undo());
    toolbar.addHandler("redo", () => quill.history.redo());
  }, []);

  const [description, setDescription] = useState("");
  const editorRef = useRef(null);

  //CONTEXT MENU ON SEND BUTTON FOR SCHEDULES
  const [contextMenu, setContextMenu] = useState(null);
  const contextMenuRef = useRef();

  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleMenuClick = (action) => {
    if (action === "Schedules") {
      setSchedulesModal(true);
    }

    setContextMenu(null);
  };

  const [schedulesModal, setSchedulesModal] = useState(false);
  const closeSchedulesModal = () => {
    setSchedulesModal(false);
  };

  const [schedules, setSchedules] = useState([]);
  const getSchedules = async () => {
    try {
      const response = await api.post("/schedules");
      if (response.status === 200 && response.data) {
        setSchedules(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  //schedule area

  // const selectSchedule = (desc) => {
  //   setSchedulesModal(false);
  //   if (editorRef.current) {
  //     editorRef.current.innerHTML = `<h4>${desc}</h4>`;
  //   }
  // };

  const selectSchedule = (desc) => {
    setSchedulesModal(false);

    if (quillRef.current) {
      quillRef.current.clipboard.dangerouslyPasteHTML(
        quillRef.current.getLength() - 1,
        `<h4>${desc}</h4>`
      );
    }
  };

  useEffect(() => {
    getSchedules();
  }, []);

  // Close menu on clicking outside
  const handleClickOutside = (event) => {
    if (
      contextMenuRef.current &&
      !contextMenuRef.current.contains(event.target)
    ) {
      handleCloseContextMenu();
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleEditorChange = (value) => {
    setDescription(value);
  };

  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const [toEmails, setToEmails] = useState([]);
  const [ccEmails, setCcEmails] = useState([]);
  const [bccEmails, setBccEmails] = useState([]);
  const [subject, setSubject] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [workOrder, setWorkOrder] = useState("");

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
        workOrder,
      } = selectedMail;
      switch (mailSendType) {
        case "Reply":
          setSubject(`RE: ${subject}`);
          setToEmails([sender.emailAddress.address]);
          setCcEmails([]);
          setBccEmails([]);
          setWorkOrder(workOrder);

          break;

        case "ReplyAll":
          if (accounts.length > 0) {
            const myEmail = accounts[0].username.toLowerCase();
            setSubject(`RE: ${subject}`);
            setToEmails([
              sender.emailAddress.address,
              ...toRecipients
                .map((rec) => rec.emailAddress.address)
                .filter((email) => email.toLowerCase() !== myEmail),
            ]);
            setCcEmails(
              ccRecipients
                .map((rec) => rec.emailAddress.address)
                .filter((email) => email.toLowerCase() !== myEmail)
            );
            setBccEmails([]);
            setWorkOrder(workOrder);
          }
          break;

        case "draftSent":
          setSubject(subject || "");
          setToEmails(toRecipients.map((rec) => rec.emailAddress.address));
          setCcEmails(ccRecipients.map((rec) => rec.emailAddress.address));
          setBccEmails(bccRecipients.map((rec) => rec.emailAddress.address));
          // setDescription(body?.content || "");

          if (quillRef.current) {
            quillRef.current.setContents([]); // Clear the editor
            quillRef.current.clipboard.dangerouslyPasteHTML(
              0,
              `<div>${body?.content}</div>`
            );
          }
          // if (quillRef.current) {
          //   quillRef.current.clipboard.dangerouslyPasteHTML(
          //     quillRef.current.getLength() - 1,
          //     `<div>${body?.content}</div>`
          //   );
          // }
          setWorkOrder(workOrder);

          break;

        case "Forward":
          setSubject(`FW: ${subject}`);
          setToEmails([]);
          setCcEmails([]);
          setBccEmails([]);
          setWorkOrder(workOrder);

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

    const fullSubject = `${subject}=>${workOrder}`;

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

      const fullBodyContent = `${description}<br>${mailSign}`;
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

      const fullSubject = `${subject} => ${workOrder}`;
      const fullBodyContent = `${description}<br>${mailSign}`;
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
  console.log("IMPORTANTCE", importance);

  // const toggleImportance = () => {
  //   if (importance === "normal") {
  //     setImportance("high");
  //   } else {
  //     setImportance("normal");
  //   }
  // };

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

  const mailReceivedTime = props.selectedMail?.receivedDateTime;
  const currentTime = new Date();

  const [lastSentDateTime, setLastSentDateTime] = useState("");

  useEffect(() => {
    if (mailReceivedTime) {
      const receivedTime = new Date(mailReceivedTime);
      const diffMs = currentTime - receivedTime; // Difference in milliseconds

      if (diffMs > 0) {
        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const days = Math.floor(totalMinutes / (60 * 24));
        const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
        const minutes = totalMinutes % 60;

        const formattedTimeGap = `${
          days > 0 ? `${days} Day${days > 1 ? "s" : ""} ` : ""
        }${hours}:${minutes.toString().padStart(2, "0")}`;
        setLastSentDateTime(formattedTimeGap);
      }
    }
  }, [mailReceivedTime]);

  console.log("SELECTED-MAIL", props.selectedMail);

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

        <button onClick={handleToggle} className="toggleExtend">
          {props.extendDetailsToggle ? (
            <MailCollapseIcon />
          ) : (
            <MailExpandIcon />
          )}
        </button>
      </div>
      <div className="jo_editor_area mail_body_area_composing">
        <div className="to_send_area">
          <div style={{ position: "relative" }} className="sentbtn">
            <button
              onContextMenu={handleContextMenu}
              onClick={handleSendEmail}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </button>
            {contextMenu && (
              <div
                ref={contextMenuRef}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 62,
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "3px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  zIndex: 1000,
                }}
                className="context-menu"
              >
                <ul
                  style={{
                    listStyle: "none",
                    margin: 0,
                    padding: "10px",
                  }}
                >
                  <li
                    style={{ fontSize: "12px", cursor: "pointer" }}
                    onClick={() => handleMenuClick("Schedules")}
                  >
                    Schedules
                  </li>
                  <li
                    style={{ fontSize: "12px", cursor: "pointer" }}
                    onClick={() => handleMenuClick("Later")}
                  >
                    Later
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="to_cc">
            <div className="to_field">
              <Autocomplete
                className="recepient_AutoComplete"
                multiple
                freeSolo
                options={contacts
                  .map((contact) => contact.mail || contact.displayName)
                  .filter((option) => !toEmails.includes(option))} // Prevent duplicate suggestions
                value={toEmails}
                onChange={handleToEmailChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="TO: "
                    InputLabelProps={{
                      shrink: true,
                      className: "custom-label", // ✅ Add your custom class
                    }}
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
                  <TextField
                    {...params}
                    variant="outlined"
                    label="CC: "
                    InputLabelProps={{
                      shrink: true,
                      className: "custom-label", // ✅ Add your custom class
                    }}
                  />
                )}
              />
              <div
                className="bcc_toggle"
                onClick={toggleBccFields}
                style={{
                  position: "absolute",
                  right: "0",
                  top: "2px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Bcc
              </div>
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
                      label="BCC: "
                      InputLabelProps={{
                        shrink: true,
                        className: "custom-label",
                      }}
                    />
                  )}
                />
              </div>
            )}
          </div>
          <div className="attatchments">
            {selectedFiles.length > 0 && (
              <>
                <div className="attachment-container">
                  {selectedFiles.map((file, index) => (
                    <span
                      title={file.name}
                      key={index}
                      style={{
                        padding: "1px",
                        background: "#F5F5F5",
                        borderRadius: "3px",
                        fontSize: "11px",
                        margin: "2px",
                        display: "inline-block",
                        position: "relative",
                        width: "79px",
                        cursor: "pointer",
                        height: "20px",
                      }}
                    >
                      {file.name.endsWith("png") ? (
                        <i
                          style={{
                            fontSize: "11px",
                            marginRight: "5px",
                          }}
                          className="fa fa-image"
                        ></i>
                      ) : file.name.endsWith("jpg") ||
                        file.name.endsWith("jpeg") ? (
                        <i
                          style={{
                            fontSize: "11px",
                            marginRight: "5px",
                          }}
                          className="fa fa-file-image"
                        ></i>
                      ) : file.name.endsWith("pdf") ? (
                        <i
                          style={{
                            fontSize: "11px",
                            marginRight: "5px",
                          }}
                          className="fa fa-file-pdf"
                        ></i>
                      ) : file.name.endsWith("doc") ||
                        file.name.endsWith("docx") ? (
                        <i
                          style={{
                            fontSize: "11px",
                            marginRight: "5px",
                          }}
                          className="fa fa-file-word"
                        ></i>
                      ) : file.name.endsWith("xls") ||
                        file.name.endsWith("xlsx") ? (
                        <i
                          style={{
                            fontSize: "11px",
                            marginRight: "5px",
                          }}
                          className="fa fa-file-excel"
                        ></i>
                      ) : file.name.endsWith("ppt") ||
                        file.name.endsWith("pptx") ? (
                        <i
                          style={{
                            fontSize: "11px",
                            marginRight: "5px",
                          }}
                          className="fa fa-file-powerpoint"
                        ></i>
                      ) : (
                        <i
                          style={{
                            fontSize: "11px",
                            marginRight: "5px",
                          }}
                          className="fa fa-file"
                        ></i>
                      )}

                      {file.name.length > 10
                        ? file.name.substring(0, 7) + ".."
                        : file.name}

                      <i
                        className="fas fa-times"
                        style={{
                          color: "red",
                          fontSize: "15px",
                          position: "absolute",
                          top: "-2px",
                          right: "0px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleFileDelete(index)}
                      ></i>
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="discard">
            <button className="me-1" onClick={handleSaveDraft}>
              Save
            </button>
            <button onClick={handleDiscard}>Delete</button>

            {props.mailSendType !== "Send" && (
              <div className="last_mail_time">
                Last Mail: {lastSentDateTime}
              </div>
            )}
          </div>
        </div>
        <br />
        <div className="editor mail_writing_container" ref={editorRef}></div>

        {props.mailSendType !== "draftSent" && (
          <div
            className="MailSign"
            dangerouslySetInnerHTML={{
              __html: mailSign,
            }}
          />
        )}
      </div>
      {props.mailSendType !== "Send" && (
        <SingleMailDetails replyble={false} {...props} />
      )}

      <Modal size="lg" show={schedulesModal} onHide={closeSchedulesModal}>
        <Modal.Header closeButton>
          <Modal.Title>Select Schedules</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ height: "400px", overflowX: "auto" }}>
            <div className="list-group">
              {schedules.map((item, index) => (
                <div key={index} className="list-group-item">
                  <h5>{item.title}</h5>
                  <div style={{ fontSize: "14px", color: "#707070" }}>
                    {item.description}
                  </div>
                  <button
                    onClick={() =>
                      selectSchedule(item.description + " Named " + item.title)
                    }
                    className="btn btn-success btn-sm"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

SentMail.propTypes = {
  setIsComposing: PropTypes.func.isRequired,
};
