import React, { useState, useCallback, useEffect, useRef } from "react";
import { mailMinimize } from "../../minimize/mailMinimize";
import { loginRequest } from "services/authConfig";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import SingleMailWindow from "./SingleMailWindow";
import ReactDOM from "react-dom";
//Svg Icons

import {
  AttatchmentIcon,
  BoldIcon,
  BulletsIcon,
  TextCenterIcon,
  TextLeftIcon,
  TextRightIcon,
  HyperLinkIcon,
  ImportanceIcon,
  ItalicIcon,
  NumbersIcon,
  RedoIcon,
  UndoIcon,
  StrikethroughIcon,
  TableIcon,
  UnderlineIcon,
  ZoomInIcon,
  ZoomOutIcon,
  EllipseIcon,
} from "../SvgIcons";

//EDITOR INSTANCE
import Quill from "quill";
const BlockEmbed = Quill.import("blots/block/embed");
class HrBlot extends BlockEmbed {
  static blotName = "hr";
  static tagName = "hr";
}
Quill.register(HrBlot);
export default function MailActionHeader(props) {
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

  //INSTANCE
  const quillRef = props.editorInstance.quillRef;
  const handleFileSelect = (e) => {
    const newFiles = Array.from(e.target.files); // Convert FileList to array
    props.setEditorInstance((prevState) => ({
      ...prevState, // Spread the previous state
      selectedFiles: newFiles, // Replace selectedFiles with new files
    }));
    e.target.value = null; // Reset the input value to allow re-selection of the same file
  };
  const fileInputRef = useRef(null);
  const imageSelect = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target.result; // Get the base64 string from the file
        const quill = window.quill; // Access the Quill instance
        if (quill) {
          // Ensure the editor is focused
          quill.focus();
          // Get the current selection range
          let range = quill.getSelection();
          // If no selection, set the range to the end of the document
          if (!range) {
            range = {
              index: quill.getLength(), // Insert image at the end of the document
              length: 0,
            };
          }

          // Insert the image at the cursor (or at the end of the content)
          quill.insertEmbed(range.index, "image", base64Image);
        }
      };
      reader.readAsDataURL(file); // Read the file as a base64 data URL
    }
  };
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  //COLOR AND FONT SIZE
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [showBackgoundPalette, setShowBackgoundPalette] = useState(false);
  const colorOptions = [
    "#000000",
    "#FFFFFF",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FFA500",
    "#800080",
    "#008080",
    "#FFC0CB",
    "#A52A2A",
    "#808080",
    "#FFD700",
    "#00FFFF",
    "#FF00FF",
    "#808000",
    "#000080",
    "#800000",
    "#40E0D0",
    "#D2691E",
    "#ef9a3e",
    "#A7A7A7",
    "#cfcfcf",
  ];
  const handleColorSelect = (color) => {
    const quill = quillRef.current; // Get the Quill instance
    quill.format("color", color); // Apply the selected color
    setShowColorPalette(false);
  };
  const handleBackgroundSelect = (color) => {
    const quill = quillRef.current; // Get the Quill instance
    quill.format("background", color); // Apply the selected color
    setShowBackgoundPalette(false);
  };
  //Symbol Parts
  const [showSymbols, setShowSymbols] = useState(false);
  const symbolList = [
    // Stars, Checkmarks, Crosses
    "★",
    "☆",
    "✓",
    "✔",
    "✗",
    "✘",
    "✚",
    "✱",
    "✲",
    "✳",

    // Arrows
    "→",
    "←",
    "↑",
    "↓",
    "↔",
    "↕",
    "⇐",
    "⇒",
    "⇑",
    "⇓",
    "↵",
    "↩",
    "↪",
    "⇌",

    // Mathematical and Technical Symbols
    "∞",
    "≈",
    "≠",
    "≡",
    "≤",
    "≥",
    "±",
    "√",
    "∑",
    "∫",
    "∂",
    "∇",
    "π",
    "∏",
    "⊕",
    "⊗",
    "⊤",
    "⊥",
    "⊢",
    "⊨",
    "∴",
    "∵",
    "∘",
    "⋅",
    "⋮",
    "⋯",
    "⋰",
    "⋱",

    // Currency
    "€",
    "$",
    "£",
    "¥",
    "¢",
    "₹",
    "₽",
    "₩",
    "₴",
    "₫",
    "₿",
    "฿",

    // Musical Symbols
    "♪",
    "♫",
    "♬",
    "♩",
    "♭",
    "♮",
    "♯",
    "𝄞",
    "𝄢",

    // Weather Symbols
    "☀",
    "☁",
    "☂",
    "☔",
    "❄",
    "☃",
    "⚡",
    "☄",
    "🌪",
    "🌈",

    // Miscellaneous Shapes
    "■",
    "□",
    "▢",
    "▣",
    "▤",
    "▥",
    "▦",
    "▧",
    "▨",
    "▩",
    "◆",
    "◇",
    "◈",
    "◉",
    "◎",
    "○",
    "●",
    "◌",
    "◍",
    "◐",
    "◑",
    "◒",
    "◓",
    "◔",
    "◕",
    "◖",
    "◗",
    "◜",
    "◝",
    "◞",
    "◟",
    "▭",
    "◼",
    "◻",
    "◽",
    "◾",

    // Communication and Tools
    "☎",
    "✉",
    "✂",
    "✏",
    "✎",
    "✍",
    "⌛",
    "⌚",
    "✄",

    // Chess and Game Symbols
    "♔",
    "♕",
    "♖",
    "♗",
    "♘",
    "♙",
    "♚",
    "♛",
    "♜",
    "♝",
    "♞",
    "♟",
    "⚽",
    "⚾",
    "🏀",
    "🏈",
    "🎾",
    "🎳",
    "🎲",
    "♠",
    "♣",
    "♥",
    "♦",

    // Religious and Cultural Symbols
    "✝",
    "✡",
    "☪",
    "☮",
    "☯",
    "☸",
    "♁",
    "♆",
    "⚕",
    "⚖",

    // Gender Symbols
    "♂",
    "♀",
    "⚢",
    "⚣",
    "⚤",
    "⚥",
    "⚦",
    "⚨",

    // Astrology and Zodiac
    "♈",
    "♉",
    "♊",
    "♋",
    "♌",
    "♍",
    "♎",
    "♏",
    "♐",
    "♑",
    "♒",
    "♓",
    "☉",
    "☽",

    // Punctuation Marks and Emojis
    "❛",
    "❜",
    "❝",
    "❞",
    "❢",
    "❣",
    "❦",
    "❧",
    "❶",
    "❷",
    "❸",
    "❹",
    "❺",
    "❻",
    "❼",
    "❽",
    "❾",
    "❿",
    "♤",
    "♧",
    "♨",
    "⚜",
    "⚛",
    "⚙",
    "⚔",
    "⚖",
    "⚗",
    "⚘",
    "⚚",
    "⚜",
    "⚠",
    "❇",
    "✠",
    "✡",
    "☬",
    "☸",
    "☯",

    // Legal and General
    "©",
    "®",
    "™",
    "℠",
    "§",
    "¶",
    "¤",
    "※",
    "†",
    "‡",
    "◁",
    "▷",
    "◀",
    "▶",
    "◂",
    "▸",
    "⌘",
    "⌥",
    "⌫",
    "♽",
    "✉",
    "✈",
    "☕",
    "☘",
    "⚓",
    "⛑",
    "⚕",
    "⚖",
    "☠",
    "⚰",
    "⚱",
    "⚧",
    "⚨",
    "⚢",
    "⚣",
    "⚤",
  ];
  const handleInsertSymbol = (symbol) => {
    const quill = quillRef.current; // Access the Quill instance
    if (quill) {
      quill.focus();

      // Get the current selection range
      let range = quill.getSelection();

      // If no selection, insert at the end of the document
      if (!range) {
        range = {
          index: quill.getLength(),
          length: 0,
        };
      }

      // Insert the symbol at the cursor
      quill.insertText(range.index, symbol);
    }
    setShowSymbols(false);
  };
  const insertHr = () => {
    const quill = quillRef.current;
    const range = quill.getSelection();

    if (range) {
      quill.insertEmbed(range.index, "hr", true);
      quill.setSelection(range.index + 1); // Move the cursor below the <hr>
    }
  };
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
  const markAsUnread = (id) => {
    mailMinimize.markAsUnread(id);
    props.setSelectedMail({});
    props.setSelectedMailIds([]);
    props.setMarkMail(false);
  };
  //DOUBLE CLICK HANDLER
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
  const [moreMenu, setMoreMenu] = useState(false);
  const moreToggle = () => {
    setMoreMenu(!moreMenu);
  };

  return (
    <div className="mail_action_header non_printing_area">
      <div className="actions_left">
        <button
          onClick={() => {
            props.setIsComposing(true);
            props.setMailSendType("Send");
            props.setSelectedMailIds([]);
          }}
          className="active"
        >
          New Mail
        </button>
        <>
          {props.selectedMailIds.length > 1 && (
            <>
              {props.mailFolder.folderName === "Deleted Items" && (
                <>
                  <button
                    className="d-none"
                    onClick={() => bulkRestore(props.selectedMailIds)}
                    disabled={
                      props.isComposing ||
                      props.selectedMailIds.length === 0 ||
                      props.mailFolder.folderName !== "Deleted Items"
                    }
                  >
                    Restore All
                  </button>
                  <button
                    onClick={() => bulkPermanentDelete(props.selectedMailIds)}
                    disabled={
                      props.isComposing ||
                      props.selectedMailIds.length === 0 ||
                      props.mailFolder.folderName !== "Deleted Items"
                    }
                  >
                    Permanently Delete
                  </button>
                </>
              )}
              <button
                onClick={() => bulkDelete(props.selectedMailIds)}
                disabled={
                  props.isComposing || props.selectedMailIds.length === 0
                }
              >
                Delete All
              </button>
              <button
                onClick={() => bulkArchive(props.selectedMailIds)}
                disabled={
                  props.isComposing ||
                  props.selectedMailIds.length === 0 ||
                  props.mailFolder.folderName === "Archive"
                }
              >
                Archive
              </button>
              <DropdownButton
                id="dropdown-basic-button"
                title="Move to"
                variant="info"
                style={{ display: "inline-block" }}
                disabled={
                  props.isComposing || props.selectedMailIds.length === 0
                }
              >
                {folders.map((folder, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() => bulkMove(props.selectedMailIds, folder.id)}
                  >
                    {folder.displayName}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
              <button
                onClick={() => bulkRead(props.selectedMailIds)}
                disabled={
                  props.isComposing || props.selectedMailIds.length === 0
                }
              >
                Read
              </button>
              <button
                onClick={() => bulkUnread(props.selectedMailIds)}
                disabled={
                  props.isComposing || props.selectedMailIds.length === 0
                }
              >
                Unread
              </button>
            </>
          )}

          {props.selectedMailIds.length < 1 && (
            <>
              {props.mailFolder.folderName === "Deleted Items" && (
                <>
                  <button
                    onClick={() => mailMinimize.handleRestore(props.mailID)}
                    disabled={
                      props.isComposing ||
                      !props.mailID ||
                      props.mailFolder.folderName !== "Deleted Items"
                    }
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => handlePermanentDelete(props.mailID)}
                    disabled={
                      props.isComposing ||
                      !props.mailID ||
                      props.mailFolder.folderName !== "Deleted Items"
                    }
                  >
                    Permanently Delete
                  </button>
                </>
              )}

              <button
                onClick={() => handleDelete(props.mailID)}
                disabled={!props.mailID}
              >
                Delete
              </button>
              <button
                onClick={() => mailMinimize.archiveMail(props.mailID)}
                disabled={
                  !props.mailID || props.mailFolder.folderName === "Archive"
                }
              >
                Archive
              </button>
              <DropdownButton
                id="dropdown-basic-button"
                title="Move to"
                style={{ display: "inline-block" }}
                disabled={!props.mailID}
                variant="info"
              >
                {folders.map((folder, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() =>
                      mailMinimize.moveMail(props.mailID, folder.id)
                    }
                  >
                    {folder.displayName}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
              <button
                onClick={() => mailMinimize.markAsRead(props.mailID)}
                disabled={!props.mailID}
              >
                Read
              </button>
              <button
                onClick={() => markAsUnread(props.mailID)}
                disabled={!props.mailID}
              >
                Unread
              </button>
            </>
          )}
        </>
      </div>
      <div className="actions_right">
        <div className="toolbar_area">
          {props.isComposing && (
            <div
              id="FalgunToolbar"
              className="toolbar"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <button
                title="Undo"
                className="ql-redo"
                onClick={() =>
                  props.setEditorInstance((prevState) => ({
                    ...prevState,
                    actionHistory: "undo",
                  }))
                }
              >
                <UndoIcon />
              </button>
              <button
                title="Redo"
                className="ql-redo"
                onClick={() =>
                  props.setEditorInstance((prevState) => ({
                    ...prevState,
                    actionHistory: "redo",
                  }))
                }
              >
                <RedoIcon />
              </button>

              <button className="d-none" title="Hr" onClick={insertHr}>
                <i className="fa fa-minus"></i>
              </button>

              <span className="ql-formats">
                <select className="ql-size style_select_area">
                  <option value="10px">10</option>
                  <option selected value="12px">
                    Styles
                  </option>
                  <option value="12px">12</option>
                  <option value="14px">14</option>
                  <option value="16px">16</option>
                  <option value="18px">18</option>
                  <option value="20px">20</option>
                  <option value="22px">22</option>
                  <option value="24px">24</option>
                  <option value="26px">26</option>
                  <option value="28px">28</option>
                  <option value="30px">30</option>
                  <option value="32px">32</option>
                  <option value="34px">34</option>
                  <option value="36px">36</option>
                  <option value="38px">38</option>
                  <option value="40px">40</option>
                </select>
              </span>

              <button title="Bold" className="ql-bold">
                <BoldIcon />
              </button>

              <button title="Italic" className="ql-italic">
                <ItalicIcon />
              </button>
              <button title="Underline" className="ql-underline">
                <UnderlineIcon />
              </button>
              <button className="ql-strike" title="Strike">
                <StrikethroughIcon />
              </button>
              <button
                type="button"
                className="ql-link"
                aria-pressed="false"
                aria-label="link"
                title="HyperLink"
              >
                <HyperLinkIcon />
              </button>
              <button
                type="button"
                className="ql-list"
                aria-pressed="false"
                value="bullet"
                aria-label="list: bullet"
              >
                <BulletsIcon />
              </button>
              <button
                type="button"
                className="ql-list"
                aria-pressed="false"
                value="ordered"
                aria-label="list: ordered"
              >
                <NumbersIcon />
              </button>
              <button title="Left" className="ql-align" value="justify">
                <TextLeftIcon />
              </button>
              <button title="Center" className="ql-align" value="center">
                <TextCenterIcon />
              </button>
              <button title="Right" className="ql-align" value="right">
                <TextRightIcon />
              </button>

              <input
                type="file"
                multiple
                style={{ display: "none" }}
                id="attachmentInput"
                onChange={handleFileSelect}
              />
              <label
                title="Attatchments"
                htmlFor="attachmentInput"
                className="file-upload-label label_button"
              >
                <AttatchmentIcon />
              </label>

              <button className="ql-table">
                <TableIcon />
              </button>

              <button
                className={
                  props.editorInstance?.toggleImportance === "high"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  props.setEditorInstance((prevState) => ({
                    ...prevState,
                    toggleImportance:
                      prevState.toggleImportance === "normal"
                        ? "high"
                        : "normal",
                  }))
                }
              >
                <ImportanceIcon />
              </button>

              <button
                className="d-none"
                title="Insert Image"
                onClick={handleImageClick}
              >
                <i className="far fa-image"></i>
              </button>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef} // Reference to trigger file selection
                onChange={imageSelect} // Handle the file when selected
              />

              <button className="d-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="13"
                  viewBox="0 0 15 13"
                >
                  <text
                    id="_"
                    data-name="…"
                    transform="translate(3) rotate(90)"
                    fontSize="13"
                    fontFamily="ArialMT, Arial"
                  >
                    <tspan x="0" y="0">
                      …
                    </tspan>
                  </text>
                </svg>
              </button>
              <div className="d-none" style={{ position: "relative" }}>
                <button
                  title="Color"
                  onClick={() => setShowColorPalette(!showColorPalette)}
                >
                  <i className="fa fa-fill-drip"></i>
                </button>
                {showColorPalette && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      zIndex: 10,
                      borderRadius: "4px",
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                      padding: "5px",
                      display: "grid",
                      gridTemplateColumns: "repeat(5, 20px)",
                      gap: "5px",
                    }}
                  >
                    {colorOptions.map((color) => (
                      <div
                        key={color}
                        style={{
                          width: "20px",
                          height: "20px",
                          backgroundColor: color,
                          cursor: "pointer",
                          borderRadius: "4px",
                          border: "1px solid green",
                        }}
                        onClick={() => handleColorSelect(color)}
                      ></div>
                    ))}
                  </div>
                )}
              </div>
              <div className="d-none" style={{ position: "relative" }}>
                <button
                  title="Background"
                  onClick={() => setShowBackgoundPalette(!showBackgoundPalette)}
                >
                  <i className="fa fa-highlighter"></i>
                </button>
                {showBackgoundPalette && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      zIndex: 10,
                      borderRadius: "4px",
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                      padding: "5px",
                      display: "grid",
                      gridTemplateColumns: "repeat(5, 20px)",
                      gap: "5px",
                    }}
                  >
                    {colorOptions.map((color) => (
                      <div
                        key={color}
                        style={{
                          width: "20px",
                          height: "20px",
                          backgroundColor: color,
                          cursor: "pointer",
                          borderRadius: "4px",
                          border: "1px solid green",
                        }}
                        onClick={() => handleBackgroundSelect(color)}
                      ></div>
                    ))}
                  </div>
                )}
              </div>
              <div className="d-none" style={{ position: "relative" }}>
                <button
                  title="Symble"
                  onClick={() => setShowSymbols(!showSymbols)}
                >
                  <i className="fa fa-icons"></i>
                </button>
                {showSymbols && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      zIndex: 10,
                      borderRadius: "4px",
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                      padding: "5px",
                      display: "grid",
                      gridTemplateColumns: "repeat(15, 20px)",
                      gap: "5px",
                    }}
                  >
                    {symbolList.map((symbol, index) => (
                      <div
                        key={index}
                        style={{
                          cursor: "pointer",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          textAlign: "center",
                        }}
                        onClick={() => handleInsertSymbol(symbol)}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#ffa500")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        {symbol}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mail_tools text-end">
          <button
            className={props.mailDetailsWidth > 50.3 ? "active" : ""}
            onClick={handleZoomIn}
          >
            <ZoomInIcon />
          </button>
          <button
            className={props.mailDetailsWidth < 50.3 ? "active me-1" : "me-1"}
            onClick={handleZoomOut}
          >
            <ZoomOutIcon />
          </button>
          {props.mailID && props.isComposing != true ? (
            <>
              <button
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
                Reply all
              </button>
              <button
                onClick={() => {
                  props.setIsComposing(true);
                  props.setMailSendType("Forward");
                }}
              >
                Forward
              </button>
              <Dropdown className="moreToggleButton" onClick={moreToggle}>
                <Dropdown.Toggle
                  id="dropdown-button-dark-example1"
                  variant="secondary"
                  className="me-1"
                  style={{ backgroundColor: "#eeeeee", height: "20px" }}
                >
                  <EllipseIcon />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleDelete(props.mailID)}>
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
                  <Dropdown.Item onClick={() => markAsUnread(props.mailID)}>
                    Unread
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleDoubleClick(props.selectedMail)}
                  >
                    View
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
