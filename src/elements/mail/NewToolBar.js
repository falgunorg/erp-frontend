import React from "react";

const NewToolBar = ({ onCommand }) => {
    const commands = [
        "undo",
        "redo",
        "bold",
        "italic",
        "underline",
        "strikethrough",
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
        "preview",
        "find",
    ];

    const handleClick = (command) => {
        onCommand(command); // Notify the parent of the selected command
    };

    return (
        <div className="toolbar">
            {commands.map((command) => (
                <button
                    key={command}
                    onClick={() => handleClick(command)}
                    title={command}
                >
                    {command}
                </button>
            ))}
        </div>
    );
};

export default NewToolBar;
