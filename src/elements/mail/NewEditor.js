import React, { useRef, useEffect } from "react";
import JoditEditor from "jodit-react";

const NewEditor = ({ content, setContent, currentCommand }) => {
  const editor = useRef(null); // Reference for the JoditEditor instance

  const config = {
    toolbar: false, // Disable built-in toolbar
    height: 400,
    readonly: false,
  };

  useEffect(() => {
    if (currentCommand && editor.current) {
      const editorInstance = editor.current; // Direct access to the editor instance

      // Execute commands using Jodit API
      switch (currentCommand) {
        case "bold":
        case "italic":
        case "underline":
        case "strikeThrough":
          editorInstance.execCommand(currentCommand); // Execute formatting commands
          break;

        case "ul": // unordered list
          editorInstance.execCommand("insertUnorderedList");
          break;

        case "ol": // ordered list
          editorInstance.execCommand("insertOrderedList");
          break;

        case "link":
          const url = prompt("Enter the URL:");
          if (url) {
            editorInstance.s.insertHTML(
              `<a href="${url}" target="_blank">${url}</a>`
            );
          }
          break;

        case "undo":
        case "redo":
          editorInstance.execCommand(currentCommand); // Undo/Redo
          break;

        default:
          console.log(`Command '${currentCommand}' is not implemented.`);
          break;
      }
    }
  }, [currentCommand]); // Re-run effect when currentCommand changes

  return (
    <JoditEditor
      ref={editor} // Assign reference to JoditEditor
      value={content}
      config={config}
      onBlur={(newContent) => setContent(newContent)} // Save content on blur
      onChange={(newContent) => {}}
    />
  );
};

export default NewEditor;
