import React, { useState, useRef } from "react";
// import "quill/dist/quill.snow.css";
import Quill from "quill";
const BlockEmbed = Quill.import("blots/block/embed");
class HrBlot extends BlockEmbed {
  static blotName = "hr";
  static tagName = "hr";
}
Quill.register(HrBlot);
const Toolbar = ({
  onUndo,
  onRedo,
  handleFileSelect,
  toggleImportance,
  importance,
  quillRef,
}) => {
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

  //Symbol Part

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

  return (
    <>
      <div
        id="FalgunToolbar"
        className="toolbar"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <button title="Undo" className="ql-redo" onClick={onUndo}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="8"
            height="10"
            viewBox="0 0 8 10"
          >
            <path
              id="Polygon_185"
              data-name="Polygon 185"
              d="M4.152,1.357a1,1,0,0,1,1.7,0l3.2,5.113A1,1,0,0,1,8.2,8H1.8A1,1,0,0,1,.956,6.47Z"
              transform="translate(0 10) rotate(-90)"
              fill="#707070"
            />
          </svg>
        </button>
        <button title="Redo" className="ql-redo" onClick={onRedo}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="7.113"
            height="8.395"
            viewBox="0 0 7.113 8.395"
          >
            <g
              id="Group_62"
              data-name="Group 62"
              transform="translate(-1042 -73.803)"
            >
              <path
                id="Path_29"
                data-name="Path 29"
                d="M4.152,1.357a1,1,0,0,1,1.7,0l3.2,5.113A1,1,0,0,1,8.2,8H1.8A1,1,0,0,1,.956,6.47Z"
                transform="translate(1050 73) rotate(90)"
                fill="#707070"
              />
            </g>
          </svg>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="9"
            height="14"
            viewBox="0 0 9 14"
          >
            <text
              id="B"
              transform="translate(0 11)"
              fontSize="12"
              fontFamily="Arial-BoldMT, Arial"
              fontWeight="700"
            >
              <tspan x="0" y="0">
                B
              </tspan>
            </text>
          </svg>
        </button>
        <button title="Italic" className="ql-italic">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="4"
            height="14"
            viewBox="0 0 4 14"
          >
            <text
              id="I"
              transform="translate(0 11)"
              fontSize="12"
              fontFamily="Arial-ItalicMT, Arial"
              fontStyle="italic"
            >
              <tspan x="0" y="0">
                I
              </tspan>
            </text>
          </svg>
        </button>
        <button title="Underline" className="ql-underline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="9"
            height="14"
            viewBox="0 0 9 14"
          >
            <text
              id="U"
              transform="translate(0 11)"
              fontSize="12"
              fontFamily="ArialMT, Arial"
            >
              <tspan x="0" y="0">
                U
              </tspan>
            </text>
          </svg>
        </button>
        <button className="ql-strike" title="Strike">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11.5"
            height="14"
            viewBox="0 0 11.5 14"
          >
            <text
              id="S"
              transform="translate(1.75 11)"
              fontSize="12"
              fontFamily="ArialMT, Arial"
            >
              <tspan x="0" y="0">
                S
              </tspan>
            </text>
            <line
              id="Line_493"
              data-name="Line 493"
              x2="11"
              transform="translate(0.25 7)"
              fill="none"
              stroke="#0d0d0d"
              strokeLinecap="round"
              strokeWidth="0.5"
            />
          </svg>
        </button>
        <button
          type="button"
          className="ql-link"
          aria-pressed="false"
          aria-label="link"
          title="HyperLink"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="9"
            height="14"
            viewBox="0 0 9 14"
          >
            <text
              id="H"
              transform="translate(0 11)"
              fontSize="12"
              fontFamily="ArialMT, Arial"
            >
              <tspan x="0" y="0">
                H
              </tspan>
            </text>
          </svg>
        </button>

        <button
          type="button"
          className="ql-list"
          aria-pressed="false"
          value="bullet"
          aria-label="list: bullet"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="6"
            height="16"
            viewBox="0 0 6 16"
          >
            <text
              id="_-_-_-"
              data-name="-  
-
-"
              transform="translate(0 5)"
              fontSize="6"
              fontFamily="ArialMT, Arial"
            >
              <tspan x="0" y="0" space="preserve">
                -{" "}
              </tspan>
              <tspan x="0" y="5">
                -
              </tspan>
              <tspan x="0" y="10">
                -
              </tspan>
            </text>
          </svg>
        </button>
        <button
          type="button"
          className="ql-list"
          aria-pressed="false"
          value="ordered"
          aria-label="list: ordered"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="4"
            height="14"
            viewBox="0 0 4 14"
          >
            <text
              id="_1_2_3_"
              data-name="1  
2
3 "
              transform="translate(0 3)"
              fontSize="3"
              fontFamily="ArialMT, Arial"
            >
              <tspan x="0" y="0" space="preserve">
                1{" "}
              </tspan>
              <tspan x="0" y="5">
                2
              </tspan>
              <tspan x="0" y="10">
                3{" "}
              </tspan>
            </text>
          </svg>
        </button>

        <button title="Left" className="ql-align" value="justify">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13.35"
            height="11.659"
            viewBox="0 0 13.35 11.659"
          >
            <g
              id="Group_60"
              data-name="Group 60"
              transform="translate(-1358.5 -72.165)"
            >
              <line
                id="Line_496"
                data-name="Line 496"
                x2="11"
                transform="translate(1360.5 72.515)"
                fill="none"
                stroke="#0d0d0d"
                strokeLinecap="round"
                strokeWidth="0.7"
              />
              <line
                id="Line_497"
                data-name="Line 497"
                x2="7"
                transform="translate(1364.5 75.255)"
                fill="none"
                stroke="#0d0d0d"
                strokeLinecap="round"
                strokeWidth="0.7"
              />
              <line
                id="Line_498"
                data-name="Line 498"
                x2="7"
                transform="translate(1364.5 77.995)"
                fill="none"
                stroke="#0d0d0d"
                strokeLinecap="round"
                strokeWidth="0.7"
              />
              <line
                id="Line_501"
                data-name="Line 501"
                x2="7"
                transform="translate(1364.5 80.735)"
                fill="none"
                stroke="#0d0d0d"
                strokeLinecap="round"
                strokeWidth="0.7"
              />
              <line
                id="Line_502"
                data-name="Line 502"
                x2="11"
                transform="translate(1360.5 83.474)"
                fill="none"
                stroke="#0d0d0d"
                strokeLinecap="round"
                strokeWidth="0.7"
              />
              <path
                id="Polygon_177"
                data-name="Polygon 177"
                d="M1.652,1.357a1,1,0,0,1,1.7,0l.7,1.113A1,1,0,0,1,3.2,4H1.8A1,1,0,0,1,.956,2.47Z"
                transform="translate(1358.5 80) rotate(-90)"
                fill="#707070"
              />
            </g>
          </svg>
        </button>

        <button title="Center" className="ql-align" value="center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11.7"
            height="8.561"
            viewBox="0 0 11.7 8.561"
          >
            <line
              id="Line_518"
              data-name="Line 518"
              x2="5.5"
              transform="translate(2.85 0.35)"
              fill="none"
              stroke="#0d0d0d"
              strokeLinecap="round"
              strokeWidth="0.7"
            />
            <line
              id="Line_519"
              data-name="Line 519"
              x2="11"
              transform="translate(0.35 4.218)"
              fill="none"
              stroke="#0d0d0d"
              strokeLinecap="round"
              strokeWidth="0.7"
            />
            <line
              id="Line_520"
              data-name="Line 520"
              x2="5.5"
              transform="translate(3.35 8.211)"
              fill="none"
              stroke="#0d0d0d"
              strokeLinecap="round"
              strokeWidth="0.7"
            />
          </svg>
        </button>

        <button title="Right" className="ql-align" value="right">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12.85"
            height="11.659"
            viewBox="0 0 12.85 11.659"
          >
            <g
              id="Group_61"
              data-name="Group 61"
              transform="translate(-1382 -72.165)"
            >
              <line
                id="Line_508"
                data-name="Line 508"
                x2="11"
                transform="translate(1383.5 72.515)"
                fill="none"
                stroke="#0d0d0d"
                strokeLinecap="round"
                strokeWidth="0.7"
              />
              <line
                id="Line_509"
                data-name="Line 509"
                x2="7"
                transform="translate(1387.5 75.255)"
                fill="none"
                stroke="#0d0d0d"
                strokeLinecap="round"
                strokeWidth="0.7"
              />
              <line
                id="Line_510"
                data-name="Line 510"
                x2="7"
                transform="translate(1387.5 77.995)"
                fill="none"
                stroke="#0d0d0d"
                strokeLinecap="round"
                strokeWidth="0.7"
              />
              <line
                id="Line_511"
                data-name="Line 511"
                x2="7"
                transform="translate(1387.5 80.735)"
                fill="none"
                stroke="#0d0d0d"
                strokeLinecap="round"
                strokeWidth="0.7"
              />
              <line
                id="Line_512"
                data-name="Line 512"
                x2="11"
                transform="translate(1383.5 83.474)"
                fill="none"
                stroke="#0d0d0d"
                strokeLinecap="round"
                strokeWidth="0.7"
              />
              <path
                id="Polygon_179"
                data-name="Polygon 179"
                d="M1.652,1.357a1,1,0,0,1,1.7,0l.7,1.113A1,1,0,0,1,3.2,4H1.8A1,1,0,0,1,.956,2.47Z"
                transform="translate(1386 75) rotate(90)"
                fill="#707070"
              />
            </g>
          </svg>
        </button>

        <input
          type="file"
          multiple
          style={{ display: "none" }}
          id="attachmentInput"
          onChange={handleFileSelect} // Call handleFileSelect when files are selected
        />
        <label
          title="Attatchments"
          htmlFor="attachmentInput"
          className="file-upload-label label_button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13.435"
            height="13.435"
            viewBox="0 0 13.435 13.435"
          >
            <g
              id="Group_63"
              data-name="Group 63"
              transform="translate(-1428.282 -71.282)"
            >
              <g
                id="Rectangle_1570"
                data-name="Rectangle 1570"
                transform="translate(1428.282 81.182) rotate(-45)"
                fill="none"
                stroke="#707070"
                strokeWidth="1"
              >
                <rect width="14" height="5" rx="2.5" stroke="none" />
                <rect
                  x="0.5"
                  y="0.5"
                  width="13"
                  height="4"
                  rx="2"
                  fill="none"
                />
              </g>
            </g>
          </svg>
        </label>

        <button className="ql-table">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
          >
            <g
              id="Group_65"
              data-name="Group 65"
              transform="translate(-1448 -68)"
            >
              <line
                id="Line_565"
                data-name="Line 565"
                y2="20"
                transform="translate(1454.5 68)"
                fill="none"
                stroke="#707070"
                strokeWidth="0.5"
              />
              <line
                id="Line_566"
                data-name="Line 566"
                y2="20"
                transform="translate(1461.5 68)"
                fill="none"
                stroke="#707070"
                strokeWidth="0.5"
              />
              <line
                id="Line_567"
                data-name="Line 567"
                y2="20"
                transform="translate(1468 74) rotate(90)"
                fill="none"
                stroke="#707070"
                strokeWidth="0.5"
              />
              <line
                id="Line_568"
                data-name="Line 568"
                y2="20"
                transform="translate(1468 82) rotate(90)"
                fill="none"
                stroke="#707070"
                strokeWidth="0.5"
              />
            </g>
          </svg>
        </button>

        <button
          className={importance === "high" ? "active" : ""}
          onClick={toggleImportance}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="5"
            height="16"
            viewBox="0 0 5 16"
          >
            <g
              id="Group_64"
              data-name="Group 64"
              transform="translate(-1479 -70)"
            >
              <text
                id="_"
                data-name="!"
                transform="translate(1479 83)"
                fill="rgba(255,74,74,0.6)"
                fontSize="14"
                fontFamily="Arial-BoldMT, Arial"
                fontWeight="700"
              >
                <tspan x="0" y="0">
                  !
                </tspan>
              </text>
            </g>
          </svg>
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

        {/* <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="15"
              viewBox="0 0 14 15"
            >
              <path
                id="Polygon_66"
                data-name="Polygon 66"
                d="M2.681,1.17a1,1,0,0,1,1.638,0L5.9,3.427A1,1,0,0,1,5.079,5H1.921A1,1,0,0,1,1.1,3.427Z"
                transform="translate(7)"
                fill="#707070"
              />
              <text
                id="A"
                transform="translate(1 12)"
                fontSize="12"
                fontFamily="ArialMT, Arial"
              >
                <tspan x="0" y="0">
                  A
                </tspan>
              </text>
            </svg>
          </button>
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="13"
              viewBox="0 0 12 13"
            >
              <path
                id="Polygon_67"
                data-name="Polygon 67"
                d="M2.681,1.17a1,1,0,0,1,1.638,0L5.9,3.427A1,1,0,0,1,5.079,5H1.921A1,1,0,0,1,1.1,3.427Z"
                transform="translate(12 5) rotate(180)"
                fill="#707070"
              />
              <text
                id="A"
                transform="translate(1 11)"
                fontSize="10"
                fontFamily="ArialMT, Arial"
              >
                <tspan x="0" y="0">
                  A
                </tspan>
              </text>
            </svg>
          </button> */}

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
          <button title="Symble" onClick={() => setShowSymbols(!showSymbols)}>
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
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  {symbol}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Toolbar;
