import React, { useState, useEffect } from "react";
import "jodit";
import "jodit/build/jodit.min.css";
import JoditEditor from "jodit-react";

const buttons = [
  "undo",
  "redo",
  "bold",
  "strikethrough",
  "underline",
  "italic",
  "superscript",
  "subscript",
  "align",
  "ul",
  "ol",
  "outdent",
  "indent",
  "font",
  "fontsize",
  "brush",
  "paragraph",
  "image",
  "link",
  "table",
  "hr",
  "eraser",
  "copyformat",
  "fullsize",
  "selectall",
  "print",
  "symbols",
  //   "source",

  {
    name: "copyContent",
    tooltip: "Copy to Clipboard",
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    `,
    exec: function (editor) {
      const html = editor.value; // Get the HTML content of the editor
      navigator.clipboard
        .writeText(html) // Use Clipboard API to copy text
        .catch((err) => {
          console.error("Failed to copy content: ", err);
          alert("Failed to copy content. Please try again.");
        });
    },
  },

  {
    name: "attachment",
    tooltip: "Attach Files",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="13.435" height="13.435" viewBox="0 0 13.435 13.435"><g id="Rectangle_1570" data-name="Rectangle 1570" transform="translate(0 9.899) rotate(-45)" fill="none" stroke="#707070" strokeWidth="1"><rect width="14" height="5" rx="2.5" stroke="none"/><rect x="0.5" y="0.5" width="13" height="4" rx="2" fill="none"/></g></svg>',
    exec: (editor) => {
      const input = document.getElementById("attachmentInput");
      if (input) {
        input.click(); // Trigger file selection
      }
    },
  },

  {
    name: "importance",
    tooltip: "Toggle Importance",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="5" height="16" viewBox="0 0 5 16"><text id="_" data-name="!" transform="translate(0 13)" fill="red" fontSize="14" fontFamily="Arial-BoldMT, Arial" fontWeight="700"><tspan x="0" y="0">!</tspan></text></svg>',
    exec: (editor) => {
      const object = document.getElementById("toggleImportance");
      if (object) {
        object.click(); // Trigger file selection
      }
    },
  },
];

const editorConfig = {
  toolbarStickyOffset: 0,
  readonly: false,
  toolbar: true,
  spellcheck: true,
  language: "en",
  toolbarButtonSize: "small",
  toolbarAdaptive: false,
  showCharsCounter: false,
  showWordsCounter: false,
  showXPathInStatusbar: false,
  askBeforePasteHTML: false,
  askBeforePasteFromWord: false,
  pasteHTMLAction: "insert_as_html",
  buttons: buttons,
  uploader: {
    insertImageAsBase64URI: true,
  },

  events: {
    afterInsertNode: (node) => {
      if (node.tagName === "TABLE") {
        node.style.border = "1px solid #000";
        node.style.borderCollapse = "collapse"; // Optional for better visuals
        // Apply border style to all <td> elements
        const tableCells = node.querySelectorAll("td");
        tableCells.forEach((td) => {
          td.style.border = "1px solid #000";
        });
      }
    },
  },
};

const initialContent = ``;

function JEditor({ handleFileSelect, toggleImportance, editorRef, onChange }) {
  const [data, setData] = useState(initialContent);

  useEffect(() => {
    if (editorRef && editorRef.current) {
      console.log("Editor is mounted!");
    }
  }, [editorRef]);

  return (
    <>
      <input
        type="file"
        multiple
        id="attachmentInput"
        style={{ display: "none" }}
        onChange={handleFileSelect} // Pass file selection to parent handler
      />
      <button
        onClick={toggleImportance}
        id="toggleImportance"
        style={{ display: "none" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="5"
          height="16"
          viewBox="0 0 5 16"
        >
          <text
            id="_"
            data-name="!"
            transform="translate(0 13)"
            fill="rgba(255,74,74,0.6)"
            fontSize="14"
            fontFamily="Arial-BoldMT, Arial"
            fontWeight="700"
          >
            <tspan x="0" y="0">
              !
            </tspan>
          </text>
        </svg>
      </button>

      <JoditEditor
        ref={editorRef} // Use the editorRef here
        value={data}
        config={editorConfig}
        onChange={(value) => {
          setData(value); // Update local state
          onChange(value); // Pass the value to the parent component
        }}
      />
    </>
  );
}

export default JEditor;
